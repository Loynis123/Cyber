import { createClient } from '@libsql/client'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { mkdirSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '..', 'data')

// Local dev uses a file: SQLite database; production points DATABASE_URL at a
// Turso (libsql://...) database with DATABASE_AUTH_TOKEN. Same client either way.
const url = process.env.DATABASE_URL || `file:${join(dataDir, 'cyber.db')}`
if (url.startsWith('file:')) mkdirSync(dataDir, { recursive: true })

export const db = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN })

// Normalise a libsql Row into a plain { column: value } object.
function rowToObject(row, columns) {
  const o = {}
  for (const c of columns) o[c] = row[c]
  return o
}

// Thin async helpers so call sites read close to the old better-sqlite3 ones.
export async function get(sql, args = []) {
  const r = await db.execute({ sql, args })
  return r.rows.length ? rowToObject(r.rows[0], r.columns) : undefined
}
export async function all(sql, args = []) {
  const r = await db.execute({ sql, args })
  return r.rows.map((row) => rowToObject(row, r.columns))
}
export async function run(sql, args = []) {
  return db.execute({ sql, args })
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL DEFAULT '',
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  price       REAL NOT NULL,
  old_price   REAL,
  image       TEXT NOT NULL DEFAULT '',
  brand       TEXT NOT NULL DEFAULT '',
  category    TEXT NOT NULL DEFAULT '',
  battery     TEXT NOT NULL DEFAULT '',
  screen      TEXT NOT NULL DEFAULT '',
  diagonal    TEXT NOT NULL DEFAULT '',
  protection  TEXT NOT NULL DEFAULT '',
  memory      TEXT NOT NULL DEFAULT '',
  tabs        TEXT NOT NULL DEFAULT '[]',
  discount    INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cart_items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  qty        INTEGER NOT NULL DEFAULT 1,
  color      TEXT NOT NULL DEFAULT '',
  memory     TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_id, product_id, color, memory)
);

CREATE TABLE IF NOT EXISTS favorites (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subtotal   REAL NOT NULL,
  tax        REAL NOT NULL,
  shipping   REAL NOT NULL,
  total      REAL NOT NULL,
  status     TEXT NOT NULL DEFAULT 'placed',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  name       TEXT NOT NULL,
  image      TEXT NOT NULL DEFAULT '',
  price      REAL NOT NULL,
  qty        INTEGER NOT NULL,
  color      TEXT NOT NULL DEFAULT '',
  memory     TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_fav_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
`

export async function initSchema() {
  await db.executeMultiple(SCHEMA)
}

// Create the schema on first import so every entry point (server, seed CLI) is ready.
await initSchema()
