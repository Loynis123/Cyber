// Per-product variant config for the product page.
//
// Colors map to a real image render, so selecting a color swaps the main photo.
// Memory tiers carry a price delta, so selecting one updates the price. Products
// we don't have multiple renders for get a single swatch built from their own
// image + a colour inferred from the name, and the color picker is hidden.

// iPhones are the one product we have several real colour renders for.
const IPHONE_COLORS = [
  { name: 'Deep Purple', hex: '#574f63', image: '/imgs/iphone-purple.png' },
  { name: 'Space Black', hex: '#2b2b2d', image: '/imgs/iphone-hero.png' },
  { name: 'Silver', hex: '#e2e3e5', image: '/imgs/iphone-silver.png' },
]
const IPHONE_MEMORY = [
  { label: '128GB', delta: 0 },
  { label: '256GB', delta: 100 },
  { label: '512GB', delta: 300 },
  { label: '1TB', delta: 500 },
]

// Colour name -> swatch hex. Longer names are matched first (see deriveColor).
const COLOR_SWATCH = {
  'Deep Purple': '#574f63',
  'Space Black': '#2b2b2d',
  'Phantom Black': '#1c1c1c',
  'Moss Green': '#3a4a3f',
  'Isle Blue': '#9fb4d8',
  Starlight: '#efe7da',
  Graphite: '#3a3a3a',
  Silver: '#e2e3e5',
  Gold: '#f3e7cf',
  Purple: '#574f63',
  Black: '#2b2b2d',
  Green: '#3a4a3f',
  Blue: '#9fb4d8',
  Pink: '#f3d4dd',
  White: '#f2f2f2',
}

function deriveColor(name = '') {
  const lower = name.toLowerCase()
  const keys = Object.keys(COLOR_SWATCH).sort((a, b) => b.length - a.length)
  return keys.find((k) => lower.includes(k.toLowerCase())) || ''
}

// Returns { colors: [{name, hex, image}], memories: [{label, delta}] } for a product.
export function getVariants(product) {
  const name = (product?.name || '').toLowerCase()
  const base = product?.image || ''

  if (name.includes('iphone')) {
    return { colors: IPHONE_COLORS, memories: IPHONE_MEMORY }
  }

  // Generic single-render product: one swatch from its own colour + spec memory.
  const colorName = deriveColor(product?.name) || 'Standard'
  const colors = [{ name: colorName, hex: COLOR_SWATCH[colorName] || '#cfcfcf', image: base }]
  const memories = product?.memory ? [{ label: String(product.memory).replace(/\s+/g, ''), delta: 0 }] : []
  return { colors, memories }
}
