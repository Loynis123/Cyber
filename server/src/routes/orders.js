import { Router } from 'express'
import { db, get, all } from '../db.js'
import { requireAuth } from '../auth.js'

const router = Router()
router.use(requireAuth)

const ESTIMATED_TAX = 50
const ESTIMATED_SHIPPING = 29

async function getOrder(orderId, userId) {
  const order = await get('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, userId])
  if (!order) return null
  const items = await all('SELECT * FROM order_items WHERE order_id = ?', [orderId])
  return { ...order, items }
}

// Place an order from the current cart, then clear the cart. Atomic.
router.post('/', async (req, res, next) => {
  try {
    const cartItems = await all(
      `SELECT ci.product_id, ci.qty, ci.color, ci.memory, p.name, p.image, p.price
       FROM cart_items ci JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = ?`,
      [req.user.id],
    )

    if (!cartItems.length) return res.status(400).json({ error: 'Cart is empty' })

    const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0)
    const total = subtotal + ESTIMATED_TAX + ESTIMATED_SHIPPING

    const tx = await db.transaction('write')
    let orderId
    try {
      const info = await tx.execute({
        sql: 'INSERT INTO orders (user_id, subtotal, tax, shipping, total) VALUES (?, ?, ?, ?, ?)',
        args: [req.user.id, subtotal, ESTIMATED_TAX, ESTIMATED_SHIPPING, total],
      })
      orderId = Number(info.lastInsertRowid)

      for (const i of cartItems) {
        await tx.execute({
          sql: `INSERT INTO order_items (order_id, product_id, name, image, price, qty, color, memory)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [orderId, i.product_id, i.name, i.image, i.price, i.qty, i.color, i.memory],
        })
      }
      await tx.execute({ sql: 'DELETE FROM cart_items WHERE user_id = ?', args: [req.user.id] })
      await tx.commit()
    } catch (err) {
      await tx.rollback()
      throw err
    }

    res.status(201).json(await getOrder(orderId, req.user.id))
  } catch (err) {
    next(err)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const orders = await all('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', [req.user.id])
    const withItems = await Promise.all(
      orders.map(async (o) => ({ ...o, items: await all('SELECT * FROM order_items WHERE order_id = ?', [o.id]) })),
    )
    res.json(withItems)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const order = await getOrder(req.params.id, req.user.id)
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  } catch (err) {
    next(err)
  }
})

export default router
