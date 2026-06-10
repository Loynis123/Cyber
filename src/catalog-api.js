import { api } from './api.js'

// Flattens the API product shape (specs nested) into the flat object the
// views/components expect: brand + spec fields at the top level.
export function flattenProduct(p) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    oldPrice: p.oldPrice,
    image: p.image,
    brand: p.brand,
    category: p.category,
    battery: p.specs?.battery ?? '',
    screen: p.specs?.screen ?? '',
    diagonal: p.specs?.diagonal ?? '',
    protection: p.specs?.protection ?? '',
    memory: p.specs?.memory ?? '',
    tabs: p.tabs || [],
    discount: !!p.discount,
  }
}

function buildQuery(params = {}) {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === '') continue
    if (Array.isArray(value)) {
      if (value.length) qs.set(key, value.join(','))
    } else {
      qs.set(key, value)
    }
  }
  const s = qs.toString()
  return s ? `?${s}` : ''
}

// Fetch the whole catalog once (no pagination) — used by the homepage and the
// products page, which filter/sort client-side over the full list.
export async function fetchAllProducts() {
  const data = await api.get('/products')
  return data.items.map(flattenProduct)
}

export async function fetchProducts(params) {
  const data = await api.get(`/products${buildQuery(params)}`)
  return { ...data, items: data.items.map(flattenProduct) }
}

export async function fetchProduct(id) {
  return flattenProduct(await api.get(`/products/${id}`))
}

export async function fetchPriceBounds() {
  return api.get('/products/meta/price')
}

export async function fetchCatalogMeta() {
  const [brands, filters, categories] = await Promise.all([
    api.get('/products/meta/brands'),
    api.get('/products/meta/filters'),
    api.get('/products/meta/categories'),
  ])
  return { brands, filterGroups: filters.filterGroups, sortOptions: filters.sortOptions, categories }
}
