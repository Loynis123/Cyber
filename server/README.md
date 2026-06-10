# Cyber Store — Backend API

Node + Express + SQLite (`better-sqlite3`) with JWT auth.

## Setup

```bash
cd server
npm install
cp .env.example .env   # adjust JWT_SECRET for anything beyond local dev
npm run seed           # load products from ../src/data into SQLite + create demo user
npm run dev            # start with auto-reload (or: npm start)
```

API runs on `http://localhost:3001`. The Vite dev server proxies `/api` → this port
(see `vite.config.js`), so the frontend can call `/api/...` directly.

Run both in separate terminals:
- `cd server && npm run dev`
- `npm run dev` (project root — frontend)

Demo account created by the seed: `demo@cyber.test` / `password123`.

## Data model

One `products` table merges both frontend data files: spec fields (brand, battery,
screen, diagonal, protection, memory) for the catalog filters, `tabs` (new/best/
featured) for the homepage sections, and a `discount` flag. Plus `users`,
`cart_items`, `favorites`, `orders`, `order_items`.

## Endpoints

### Auth
| Method | Path | Body | Auth |
|--------|------|------|------|
| POST | `/api/auth/register` | `{ email, password, name? }` | — |
| POST | `/api/auth/login` | `{ email, password }` | — |
| GET  | `/api/auth/me` | — | Bearer |

Register/login return `{ token, user }`. Send the token as `Authorization: Bearer <token>`.

### Catalog (public)
| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/products` | filters + sort + search + pagination (see below) |
| GET | `/api/products/:id` | single product |
| GET | `/api/products/meta/brands` | brand list with counts |
| GET | `/api/products/meta/filters` | filter groups + sort options |
| GET | `/api/products/meta/categories` | category labels |

`GET /api/products` query params (all optional, repeatable / comma-separated):
`brand`, `battery`, `screen`, `diagonal`, `protection`, `memory`, `category`,
`tab` (new|best|featured), `discount=1`, `q` (search), `sort`
(`By rating` | `Price: low to high` | `Price: high to low` | `Newest first`),
`page`, `pageSize`. Returns `{ items, total, page, pageCount }`.
Within a filter group values are OR'd; across groups they are AND'd.

### Cart / Favorites / Orders (Bearer required)
| Method | Path | Body |
|--------|------|------|
| GET | `/api/cart` | — |
| POST | `/api/cart` | `{ productId, qty?, color?, memory? }` |
| PATCH | `/api/cart/:itemId` | `{ qty }` (qty<=0 removes) |
| DELETE | `/api/cart/:itemId` | — |
| DELETE | `/api/cart` | clear cart |
| GET | `/api/favorites` | — |
| POST | `/api/favorites` | `{ productId }` |
| DELETE | `/api/favorites/:productId` | — |
| POST | `/api/orders` | — (creates order from cart, clears cart) |
| GET | `/api/orders` | order history |
| GET | `/api/orders/:id` | single order |

Cart returns `{ items, count, subtotal }`; orders add fixed `tax` (50) and
`shipping` (29), matching the cart UI.
