import { Router } from 'express'
import { db } from '../db.js'
import { requireAuth } from '../auth.js'

const router = Router()
router.use(requireAuth)

function getFavorites(userId) {
  const items = db
    .prepare(
      `SELECT f.product_id AS productId, p.name, p.image, p.price
       FROM favorites f
       JOIN products p ON p.id = f.product_id
       WHERE f.user_id = ?
       ORDER BY f.id DESC`,
    )
    .all(userId)
  return { items, count: items.length }
}

router.get('/', (req, res) => res.json(getFavorites(req.user.id)))

router.post('/', (req, res) => {
  const { productId } = req.body || {}
  const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId)
  if (!product) return res.status(404).json({ error: 'Product not found' })

  db.prepare('INSERT OR IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)')
    .run(req.user.id, productId)
  res.status(201).json(getFavorites(req.user.id))
})

router.delete('/:productId', (req, res) => {
  db.prepare('DELETE FROM favorites WHERE user_id = ? AND product_id = ?')
    .run(req.user.id, req.params.productId)
  res.json(getFavorites(req.user.id))
})

export default router
