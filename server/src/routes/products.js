import { Router } from 'express'
import { db } from '../db.js'
import { brands, filterGroups, sortOptions, categories } from '../catalog-meta.js'

const router = Router()

function serialize(row) {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    oldPrice: row.old_price,
    image: row.image,
    brand: row.brand,
    category: row.category,
    specs: {
      battery: row.battery,
      screen: row.screen,
      diagonal: row.diagonal,
      protection: row.protection,
      memory: row.memory,
    },
    tabs: JSON.parse(row.tabs || '[]'),
    discount: !!row.discount,
  }
}

// Accept ?brand=a,b or repeated ?brand=a&brand=b -> ['a','b']
function asList(v) {
  if (v == null) return []
  const arr = Array.isArray(v) ? v : String(v).split(',')
  return arr.map((s) => s.trim()).filter(Boolean)
}

const SORT_SQL = {
  'By rating': 'id ASC',
  'Price: low to high': 'price ASC',
  'Price: high to low': 'price DESC',
  'Newest first': 'id DESC',
  price_asc: 'price ASC',
  price_desc: 'price DESC',
  newest: 'id DESC',
}

// Maps a query-param key to its products column for the spec filter groups.
const SPEC_COLUMNS = { battery: 'battery', screen: 'screen', diagonal: 'diagonal', protection: 'protection', memory: 'memory' }

router.get('/meta/brands', (_req, res) => res.json(brands))
router.get('/meta/filters', (_req, res) => res.json({ filterGroups, sortOptions }))
router.get('/meta/categories', (_req, res) => res.json(categories))

router.get('/', (req, res) => {
  const where = []
  const params = []

  const brandList = asList(req.query.brand)
  if (brandList.length) {
    where.push(`brand IN (${brandList.map(() => '?').join(',')})`)
    params.push(...brandList)
  }

  for (const [key, col] of Object.entries(SPEC_COLUMNS)) {
    const list = asList(req.query[key])
    if (list.length) {
      where.push(`${col} IN (${list.map(() => '?').join(',')})`)
      params.push(...list)
    }
  }

  if (req.query.category) {
    where.push('category = ?')
    params.push(String(req.query.category))
  }

  if (req.query.tab) {
    where.push("tabs LIKE ?")
    params.push(`%"${String(req.query.tab)}"%`)
  }

  if (req.query.discount === '1' || req.query.discount === 'true') {
    where.push('discount = 1')
  }

  const q = String(req.query.q || req.query.search || '').trim()
  if (q) {
    where.push('LOWER(name) LIKE ?')
    params.push(`%${q.toLowerCase()}%`)
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const orderSql = SORT_SQL[req.query.sort] || SORT_SQL['By rating']

  const total = db.prepare(`SELECT COUNT(*) AS n FROM products ${whereSql}`).get(...params).n

  // Pagination (optional — omit page to get everything).
  let limitSql = ''
  const page = parseInt(req.query.page, 10)
  const pageSize = parseInt(req.query.pageSize, 10)
  if (Number.isInteger(page) && Number.isInteger(pageSize) && pageSize > 0) {
    limitSql = `LIMIT ${pageSize} OFFSET ${(Math.max(1, page) - 1) * pageSize}`
  }

  const rows = db
    .prepare(`SELECT * FROM products ${whereSql} ORDER BY ${orderSql} ${limitSql}`)
    .all(...params)

  res.json({
    items: rows.map(serialize),
    total,
    page: Number.isInteger(page) ? Math.max(1, page) : 1,
    pageCount: pageSize > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1,
  })
})

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Product not found' })
  res.json(serialize(row))
})

export default router
