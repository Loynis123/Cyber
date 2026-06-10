// Shared helpers for cart & favorites.

// Parse a numeric price out of either a number or a "$1,399" style string.
export function toNumber(price) {
  if (typeof price === 'number') return price
  const n = parseFloat(String(price).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

// Deterministic faux article number from a product key.
export function makeArticle(key) {
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0
  return '#' + String(h).padStart(8, '0').slice(0, 8) + String(key.length).padStart(3, '0')
}
