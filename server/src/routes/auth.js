import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { get, run } from '../db.js'
import { signToken, requireAuth } from '../auth.js'

const router = Router()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function publicUser(u) {
  return { id: u.id, email: u.email, name: u.name }
}

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body || {}
    if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ error: 'Valid email required' })
    if (!password || String(password).length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })

    const existing = await get('SELECT id FROM users WHERE email = ?', [email.toLowerCase()])
    if (existing) return res.status(409).json({ error: 'Email already registered' })

    const hash = bcrypt.hashSync(String(password), 10)
    const info = await run('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)', [
      email.toLowerCase(), hash, (name || '').trim(),
    ])
    const user = await get('SELECT * FROM users WHERE id = ?', [Number(info.lastInsertRowid)])

    res.status(201).json({ token: signToken(user), user: publicUser(user) })
  } catch (err) {
    next(err)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

    const user = await get('SELECT * FROM users WHERE email = ?', [String(email).toLowerCase()])
    if (!user || !bcrypt.compareSync(String(password), user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    res.json({ token: signToken(user), user: publicUser(user) })
  } catch (err) {
    next(err)
  }
})

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await get('SELECT * FROM users WHERE id = ?', [req.user.id])
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ user: publicUser(user) })
  } catch (err) {
    next(err)
  }
})

export default router
