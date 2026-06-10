import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { db } from '../db.js'
import { signToken, requireAuth } from '../auth.js'

const router = Router()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function publicUser(u) {
  return { id: u.id, email: u.email, name: u.name }
}

router.post('/register', (req, res) => {
  const { email, password, name } = req.body || {}
  if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ error: 'Valid email required' })
  if (!password || String(password).length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase())
  if (existing) return res.status(409).json({ error: 'Email already registered' })

  const hash = bcrypt.hashSync(String(password), 10)
  const info = db
    .prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)')
    .run(email.toLowerCase(), hash, (name || '').trim())
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid)

  res.status(201).json({ token: signToken(user), user: publicUser(user) })
})

router.post('/login', (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(String(email).toLowerCase())
  if (!user || !bcrypt.compareSync(String(password), user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  res.json({ token: signToken(user), user: publicUser(user) })
})

router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ user: publicUser(user) })
})

export default router
