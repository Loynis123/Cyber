import 'dotenv/config'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'
import bcrypt from 'bcryptjs'
import { db } from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '..', '..', 'src', 'data')

function toNumber(price) {
  if (typeof price === 'number') return price
  const n = parseFloat(String(price).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function inferBrand(name) {
  const n = name.toLowerCase()
  if (n.startsWith('apple') || n.includes('iphone') || n.includes('ipad') || n.includes('macbook') || n.includes('airpods') || n.includes('vision pro') || n.includes('apple watch')) return 'Apple'
  if (n.includes('samsung') || n.includes('galaxy')) return 'Samsung'
  if (n.includes('sony') || n.includes('playstation')) return 'Sony'
  if (n.includes('blackmagic')) return 'Blackmagic'
  if (n.includes('xiaomi')) return 'Xiaomi'
  if (n.includes('poco')) return 'Poco'
  if (n.includes('oppo')) return 'OPPO'
  if (n.includes('nokia')) return 'Nokia'
  if (n.includes('realme')) return 'Realme'
  if (n.includes('honor')) return 'Honor'
  if (n.includes('motorola')) return 'Motorola'
  return ''
}

// Builds the product rows from the frontend data modules and (re)writes the
// products table. Also ensures the demo user exists. Idempotent — safe to call
// repeatedly; products are fully replaced, users/orders are left untouched.
export async function seed() {
  // Import the frontend data modules (plain exported arrays, no Vue).
  const { productsCatalog } = await import(pathToFileURL(join(dataDir, 'catalog.js')).href)
  const { catalog, discounts } = await import(pathToFileURL(join(dataDir, 'products.js')).href)

  // Merge all sources into one map keyed by product name.
  const map = new Map()
  function ensure(name) {
    const key = name.trim()
    if (!map.has(key)) {
      map.set(key, {
        name: key, price: 0, old_price: null, image: '', brand: '', category: '',
        battery: '', screen: '', diagonal: '', protection: '', memory: '',
        tabs: new Set(), discount: 0,
      })
    }
    return map.get(key)
  }

  // 1) Products-page catalog: numeric price, brand, spec fields.
  for (const p of productsCatalog) {
    const r = ensure(p.name)
    r.price = toNumber(p.price)
    r.image = p.image || r.image
    r.brand = p.brand || r.brand
    r.battery = p.battery || r.battery
    r.screen = p.screen || r.screen
    r.diagonal = p.diagonal || r.diagonal
    r.protection = p.protection || r.protection
    r.memory = p.memory || r.memory
  }

  // 2) Homepage catalog: category + section tabs (and any new products).
  for (const p of catalog) {
    const r = ensure(p.name)
    if (!r.price) r.price = toNumber(p.price)
    r.image = r.image || p.image || ''
    r.category = p.category || r.category
    ;(p.tabs || []).forEach((t) => r.tabs.add(t))
  }

  // 3) Discounts list.
  for (const p of discounts) {
    const r = ensure(p.name)
    if (!r.price) r.price = toNumber(p.price)
    r.image = r.image || p.image || ''
    r.discount = 1
  }

  // Fill missing brands by inference.
  for (const r of map.values()) {
    if (!r.brand) r.brand = inferBrand(r.name)
  }

  // Order rows so the DB id sequence matches the mockup display order:
  // homepage catalog first (New Arrival grid order), then discounts, then the rest.
  const homeOrder = catalog.map((p) => p.name.trim())
  const discOrder = discounts.map((p) => p.name.trim())
  function rank(name) {
    let i = homeOrder.indexOf(name)
    if (i >= 0) return i
    i = discOrder.indexOf(name)
    if (i >= 0) return 100 + i
    return 1000 + productsCatalog.findIndex((p) => p.name.trim() === name)
  }
  const rows = [...map.values()].sort((a, b) => rank(a.name) - rank(b.name))

  const insertProduct = db.prepare(`
    INSERT INTO products (name, price, old_price, image, brand, category,
      battery, screen, diagonal, protection, memory, tabs, discount)
    VALUES (@name, @price, @old_price, @image, @brand, @category,
      @battery, @screen, @diagonal, @protection, @memory, @tabs, @discount)
  `)

  const reseed = db.transaction(() => {
    db.exec('DELETE FROM products')
    db.exec("DELETE FROM sqlite_sequence WHERE name='products'")
    for (const r of rows) {
      insertProduct.run({ ...r, tabs: JSON.stringify([...r.tabs]) })
    }
  })
  reseed()

  // Demo user (idempotent).
  const demoEmail = 'demo@cyber.test'
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(demoEmail)
  if (!exists) {
    const hash = bcrypt.hashSync('password123', 10)
    db.prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)').run(
      demoEmail, hash, 'Demo User',
    )
  }

  return { products: rows.length, demoEmail }
}

// Seeds only when the products table is empty (used on server boot in prod).
export async function seedIfEmpty() {
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM products').get()
  if (n > 0) return { skipped: true, products: n }
  return seed()
}

// Run directly via `npm run seed` (always re-seeds products).
const isMain = process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)
if (isMain) {
  const result = await seed()
  console.log(`Seeded ${result.products} products.`)
  console.log(`Demo user: ${result.demoEmail} / password123`)
}
