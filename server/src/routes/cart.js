import { Router } from 'express'
import { db } from '../db.js'
import { requireAuth } from '../auth.js'

const router = Router()
router.use(requireAuth)

// Returns cart line items joined with product data + totals.
function getCart(userId) {
  const items = db
    .prepare(
      `SELECT ci.id, ci.product_id AS productId, ci.qty, ci.color, ci.memory,
              p.name, p.image, p.price
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = ?
       ORDER BY ci.id ASC`,
    )
    .all(userId)
  const count = items.reduce((s, i) => s + i.qty, 0)
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  return { items, count, subtotal }
}

router.get('/', (req, res) => res.json(getCart(req.user.id)))

router.post('/', (req, res) => {
  const { productId, qty = 1, color = '', memory = '' } = req.body || {}
  const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId)
  if (!product) return res.status(404).json({ error: 'Product not found' })

  const q = Math.max(1, parseInt(qty, 10) || 1)
  const existing = db
    .prepare('SELECT id, qty FROM cart_items WHERE user_id = ? AND product_id = ? AND color = ? AND memory = ?')
    .get(req.user.id, productId, color, memory)

  if (existing) {
    db.prepare('UPDATE cart_items SET qty = qty + ? WHERE id = ?').run(q, existing.id)
  } else {
    db.prepare('INSERT INTO cart_items (user_id, product_id, qty, color, memory) VALUES (?, ?, ?, ?, ?)')
      .run(req.user.id, productId, q, color, memory)
  }
  res.status(201).json(getCart(req.user.id))
})

router.patch('/:itemId', (req, res) => {
  const { qty } = req.body || {}
  const q = parseInt(qty, 10)
  if (!Number.isInteger(q)) return res.status(400).json({ error: 'qty must be an integer' })

  const item = db.prepare('SELECT id FROM cart_items WHERE id = ? AND user_id = ?').get(req.params.itemId, req.user.id)
  if (!item) return res.status(404).json({ error: 'Cart item not found' })

  if (q <= 0) db.prepare('DELETE FROM cart_items WHERE id = ?').run(item.id)
  else db.prepare('UPDATE cart_items SET qty = ? WHERE id = ?').run(q, item.id)

  res.json(getCart(req.user.id))
})

router.delete('/:itemId', (req, res) => {
  db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(req.params.itemId, req.user.id)
  res.json(getCart(req.user.id))
})

router.delete('/', (req, res) => {
  db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id)
  res.json(getCart(req.user.id))
})

export default router
