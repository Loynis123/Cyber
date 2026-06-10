import { Router } from 'express'
import { db } from '../db.js'
import { requireAuth } from '../auth.js'

const router = Router()
router.use(requireAuth)

const ESTIMATED_TAX = 50
const ESTIMATED_SHIPPING = 29

// Place an order from the current cart, then clear the cart. Atomic.
router.post('/', (req, res) => {
  const cartItems = db
    .prepare(
      `SELECT ci.product_id, ci.qty, ci.color, ci.memory, p.name, p.image, p.price
       FROM cart_items ci JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = ?`,
    )
    .all(req.user.id)

  if (!cartItems.length) return res.status(400).json({ error: 'Cart is empty' })

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0)
  const total = subtotal + ESTIMATED_TAX + ESTIMATED_SHIPPING

  const place = db.transaction(() => {
    const info = db
      .prepare('INSERT INTO orders (user_id, subtotal, tax, shipping, total) VALUES (?, ?, ?, ?, ?)')
      .run(req.user.id, subtotal, ESTIMATED_TAX, ESTIMATED_SHIPPING, total)
    const orderId = info.lastInsertRowid

    const insertItem = db.prepare(
      `INSERT INTO order_items (order_id, product_id, name, image, price, qty, color, memory)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    for (const i of cartItems) {
      insertItem.run(orderId, i.product_id, i.name, i.image, i.price, i.qty, i.color, i.memory)
    }
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id)
    return orderId
  })

  const orderId = place()
  res.status(201).json(getOrder(orderId, req.user.id))
})

function getOrder(orderId, userId) {
  const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(orderId, userId)
  if (!order) return null
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId)
  return { ...order, items }
}

router.get('/', (req, res) => {
  const orders = db
    .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC')
    .all(req.user.id)
  const itemsStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?')
  res.json(orders.map((o) => ({ ...o, items: itemsStmt.all(o.id) })))
})

router.get('/:id', (req, res) => {
  const order = getOrder(req.params.id, req.user.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  res.json(order)
})

export default router
