import { reactive, computed, watch } from 'vue'
import { toNumber, makeArticle } from './product-utils.js'
import { api } from './api.js'
import { isAuthed } from './user.js'

// Favorites (wishlist). Same dual-mode design as the cart:
//  - guest:  local state persisted to localStorage.
//  - authed: mirrors the server; mutations hit the API.
// Uniqueness is by product (productId when known, else name).

const GUEST_KEY = 'cyber_fav_guest'

const state = reactive({
  items: [], // { key, serverId, productId, name, image, price, article }
})

function loadGuest() {
  try {
    const raw = JSON.parse(localStorage.getItem(GUEST_KEY) || '[]')
    state.items = raw.map(normaliseLocal)
  } catch {
    state.items = []
  }
}
function saveGuest() {
  if (isAuthed.value) return
  localStorage.setItem(GUEST_KEY, JSON.stringify(state.items))
}
function clearGuestStorage() {
  localStorage.removeItem(GUEST_KEY)
}

function normaliseLocal(p) {
  return {
    key: p.key ?? p.name,
    serverId: null,
    productId: p.productId ?? p.id ?? null,
    name: p.name,
    image: p.image || '',
    price: toNumber(p.price),
    article: makeArticle(p.name),
  }
}

function setFromServer(payload) {
  state.items = payload.items.map((i) => ({
    key: `srv-${i.productId}`,
    serverId: i.productId,
    productId: i.productId,
    name: i.name,
    image: i.image || '',
    price: toNumber(i.price),
    article: makeArticle(i.name),
  }))
}

async function loadServer() {
  setFromServer(await api.get('/favorites'))
}

async function mergeGuestIntoServer() {
  const guest = state.items.filter((i) => i.productId)
  for (const i of guest) {
    try {
      await api.post('/favorites', { productId: i.productId })
    } catch {
      /* skip */
    }
  }
  clearGuestStorage()
  await loadServer()
}

function find(idOrName) {
  return state.items.find(
    (i) => i.productId === idOrName || i.name === idOrName || i.key === idOrName,
  )
}

export const favorites = {
  has(idOrName) {
    return !!find(idOrName)
  },

  add(product) {
    if (isAuthed.value) {
      if (!product.id) return Promise.resolve()
      return api.post('/favorites', { productId: product.id }).then(setFromServer)
    }
    if (find(product.id ?? product.name)) return Promise.resolve()
    state.items.push(normaliseLocal(product))
    saveGuest()
    return Promise.resolve()
  },

  remove(idOrName) {
    const item = find(idOrName)
    if (!item) return Promise.resolve()
    if (isAuthed.value && item.productId) {
      return api.del(`/favorites/${item.productId}`).then(setFromServer)
    }
    state.items.splice(state.items.indexOf(item), 1)
    saveGuest()
    return Promise.resolve()
  },

  toggle(product) {
    return this.has(product.id ?? product.name)
      ? this.remove(product.id ?? product.name)
      : this.add(product)
  },

  clear() {
    state.items.splice(0, state.items.length)
    saveGuest()
  },
}

Object.defineProperty(favorites, 'items', {
  get: () => state.items,
  enumerable: true,
})

export const favoritesCount = computed(() => state.items.length)

loadGuest()
watch(
  isAuthed,
  async (authed, prev) => {
    if (authed) {
      if (state.items.some((i) => !i.serverId)) await mergeGuestIntoServer()
      else await loadServer()
    } else if (prev) {
      state.items = []
      loadGuest()
    }
  },
  { immediate: true },
)
