import { reactive, computed, watch } from 'vue'
import { toNumber, makeArticle } from './product-utils.js'
import { api } from './api.js'
import { isAuthed } from './user.js'

// Shopping cart. Two modes:
//  - guest:   state lives locally and is persisted to localStorage.
//  - authed:  state mirrors the server cart; every mutation hits the API and
//             the response (the full cart) replaces local state.
// On login any guest items are merged up to the server, then cleared locally.

const GUEST_KEY = 'cyber_cart_guest'

const state = reactive({
  items: [], // normalised: { key, serverId, productId, name, image, price, qty, variant, article, color, memory }
})

function variantOf(color, memory) {
  return [color, memory].filter(Boolean).join('-')
}

function loadGuest() {
  try {
    const raw = JSON.parse(localStorage.getItem(GUEST_KEY) || '[]')
    state.items = raw.map((p) => normaliseLocal(p))
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
  const variant = p.variant ?? variantOf(p.color, p.memory)
  const key = p.key ?? p.name + (variant ? `|${variant}` : '')
  return {
    key,
    serverId: null,
    productId: p.productId ?? null,
    name: p.name,
    image: p.image || '',
    price: toNumber(p.price),
    qty: p.qty ?? 1,
    variant,
    article: makeArticle(key),
    color: p.color || '',
    memory: p.memory || '',
  }
}

function setFromServer(payload) {
  state.items = payload.items.map((i) => {
    const variant = variantOf(i.color, i.memory)
    return {
      key: `srv-${i.id}`,
      serverId: i.id,
      productId: i.productId,
      name: i.name,
      image: i.image || '',
      price: toNumber(i.price),
      qty: i.qty,
      variant,
      article: makeArticle(i.name + (variant ? `|${variant}` : '')),
      color: i.color || '',
      memory: i.memory || '',
    }
  })
}

async function loadServer() {
  setFromServer(await api.get('/cart'))
}

// Merge guest items into the server cart, then adopt the server state.
async function mergeGuestIntoServer() {
  const guest = state.items.filter((i) => i.productId)
  for (const i of guest) {
    try {
      await api.post('/cart', { productId: i.productId, qty: i.qty, color: i.color, memory: i.memory })
    } catch {
      /* skip items the server rejects */
    }
  }
  clearGuestStorage()
  await loadServer()
}

export const cart = {
  items: state.items, // note: reassigned on mode switch; see getter below

  add(product, qty = 1) {
    if (isAuthed.value) {
      if (!product.id) return Promise.resolve()
      return api
        .post('/cart', { productId: product.id, qty, color: product.color || '', memory: product.memory || '' })
        .then(setFromServer)
    }
    const variant = variantOf(product.color, product.memory)
    const key = product.name + (variant ? `|${variant}` : '')
    const existing = state.items.find((i) => i.key === key)
    if (existing) existing.qty += qty
    else state.items.push(normaliseLocal({ ...product, qty, variant, key }))
    saveGuest()
    return Promise.resolve()
  },

  remove(key) {
    const item = state.items.find((i) => i.key === key)
    if (!item) return Promise.resolve()
    if (isAuthed.value && item.serverId) {
      return api.del(`/cart/${item.serverId}`).then(setFromServer)
    }
    state.items.splice(state.items.indexOf(item), 1)
    saveGuest()
    return Promise.resolve()
  },

  setQty(key, qty) {
    return this._changeQty(key, Math.max(1, qty))
  },
  increment(key) {
    const item = state.items.find((i) => i.key === key)
    if (item) return this._changeQty(key, item.qty + 1)
    return Promise.resolve()
  },
  decrement(key) {
    const item = state.items.find((i) => i.key === key)
    if (item) return this._changeQty(key, Math.max(1, item.qty - 1))
    return Promise.resolve()
  },

  _changeQty(key, qty) {
    const item = state.items.find((i) => i.key === key)
    if (!item) return Promise.resolve()
    item.qty = qty // optimistic
    if (isAuthed.value && item.serverId) {
      return api.patch(`/cart/${item.serverId}`, { qty }).then(setFromServer)
    }
    saveGuest()
    return Promise.resolve()
  },

  clear() {
    if (isAuthed.value) return api.del('/cart').then(setFromServer)
    state.items.splice(0, state.items.length)
    saveGuest()
    return Promise.resolve()
  },
}

// `cart.items` must always point at the live array. Because setFromServer
// reassigns state.items, expose it through a getter.
Object.defineProperty(cart, 'items', {
  get: () => state.items,
  enumerable: true,
})

export const cartCount = computed(() => state.items.reduce((sum, i) => sum + i.qty, 0))
export const cartSubtotal = computed(() => state.items.reduce((sum, i) => sum + i.price * i.qty, 0))

// Initial load + react to auth changes.
loadGuest()
watch(
  isAuthed,
  async (authed, prev) => {
    if (authed) {
      // merge any guest items we have locally, then adopt server state
      if (state.items.some((i) => !i.serverId)) await mergeGuestIntoServer()
      else await loadServer()
    } else if (prev) {
      // just logged out — drop server items, restore (empty) guest cart
      state.items = []
      loadGuest()
    }
  },
  { immediate: true },
)
