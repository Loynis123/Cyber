import { Router } from 'express'
import { get, all, run } from '../db.js'
import { requireAuth } from '../auth.js'

const router = Router()
router.use(requireAuth)

async function getFavorites(userId) {
  const items = await all(
    `SELECT f.product_id AS productId, p.name, p.image, p.price
     FROM favorites f
     JOIN products p ON p.id = f.product_id
     WHERE f.user_id = ?
     ORDER BY f.id DESC`,
    [userId],
  )
  return { items, count: items.length }
}

router.get('/', async (req, res, next) => {
  try {
    res.json(await getFavorites(req.user.id))
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { productId } = req.body || {}
    const product = await get('SELECT id FROM products WHERE id = ?', [productId])
    if (!product) return res.status(404).json({ error: 'Product not found' })

    await run('INSERT OR IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)', [req.user.id, productId])
    res.status(201).json(await getFavorites(req.user.id))
  } catch (err) {
    next(err)
  }
})

router.delete('/:productId', async (req, res, next) => {
  try {
    await run('DELETE FROM favorites WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.productId])
    res.json(await getFavorites(req.user.id))
  } catch (err) {
    next(err)
  }
})

export default router
