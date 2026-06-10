import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { existsSync } from 'node:fs'
import './db.js' // initialise schema on boot
import { seedIfEmpty } from './seed.js'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import cartRoutes from './routes/cart.js'
import favoriteRoutes from './routes/favorites.js'
import orderRoutes from './routes/orders.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// First boot on a fresh database: populate the catalog automatically so the
// deployed app is never empty. No-op once products exist.
const seeded = await seedIfEmpty()
if (!seeded.skipped) console.log(`Auto-seeded ${seeded.products} products on empty database.`)

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/orders', orderRoutes)

// 404 for unknown API routes
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }))

// Serve the built SPA (single-origin): static assets + history-API fallback to
// index.html for client-side routes. dist/ is produced by `npm run build`.
const distDir = join(__dirname, '..', '..', 'dist')
if (existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get('*', (_req, res) => res.sendFile(join(distDir, 'index.html')))
}

// Centralised error handler
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))
