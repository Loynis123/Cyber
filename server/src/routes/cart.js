import { Router } from 'express'
import { get, all, run } from '../db.js'
import { requireAuth } from '../auth.js'

const router = Router()
router.use(requireAuth)

// Returns cart line items joined with product data + totals.
async function getCart(userId) {
  const items = await all(
    `SELECT ci.id, ci.product_id AS productId, ci.qty, ci.color, ci.memory,
            p.name, p.image, p.price
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.user_id = ?
     ORDER BY ci.id ASC`,
    [userId],
  )
  const count = items.reduce((s, i) => s + i.qty, 0)
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  return { items, count, subtotal }
}

router.get('/', async (req, res, next) => {
  try {
    res.json(await getCart(req.user.id))
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { productId, qty = 1, color = '', memory = '' } = req.body || {}
    const product = await get('SELECT id FROM products WHERE id = ?', [productId])
    if (!product) return res.status(404).json({ error: 'Product not found' })

    const q = Math.max(1, parseInt(qty, 10) || 1)
    const existing = await get(
      'SELECT id, qty FROM cart_items WHERE user_id = ? AND product_id = ? AND color = ? AND memory = ?',
      [req.user.id, productId, color, memory],
    )

    if (existing) {
      await run('UPDATE cart_items SET qty = qty + ? WHERE id = ?', [q, existing.id])
    } else {
      await run('INSERT INTO cart_items (user_id, product_id, qty, color, memory) VALUES (?, ?, ?, ?, ?)', [
        req.user.id, productId, q, color, memory,
      ])
    }
    res.status(201).json(await getCart(req.user.id))
  } catch (err) {
    next(err)
  }
})

router.patch('/:itemId', async (req, res, next) => {
  try {
    const { qty } = req.body || {}
    const q = parseInt(qty, 10)
    if (!Number.isInteger(q)) return res.status(400).json({ error: 'qty must be an integer' })

    const item = await get('SELECT id FROM cart_items WHERE id = ? AND user_id = ?', [req.params.itemId, req.user.id])
    if (!item) return res.status(404).json({ error: 'Cart item not found' })

    if (q <= 0) await run('DELETE FROM cart_items WHERE id = ?', [item.id])
    else await run('UPDATE cart_items SET qty = ? WHERE id = ?', [q, item.id])

    res.json(await getCart(req.user.id))
  } catch (err) {
    next(err)
  }
})

router.delete('/:itemId', async (req, res, next) => {
  try {
    await run('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [req.params.itemId, req.user.id])
    res.json(await getCart(req.user.id))
  } catch (err) {
    next(err)
  }
})

router.delete('/', async (req, res, next) => {
  try {
    await run('DELETE FROM cart_items WHERE user_id = ?', [req.user.id])
    res.json(await getCart(req.user.id))
  } catch (err) {
    next(err)
  }
})

export default router
