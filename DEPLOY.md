# Deployment

The app deploys as **one Node service**: Express serves both the built Vue SPA
(`dist/`) and the JSON API under `/api`, from a single origin. Data lives in
**Turso** (cloud libSQL) — so no persistent disk and no paid plan are required.
Locally the same code falls back to a SQLite file (`server/data/cyber.db`).

## How it fits together

- `npm run build` → builds the SPA into `dist/` **and** installs the server's
  production dependencies.
- `npm start` → runs `server/src/index.js`, which:
  - creates the SQLite schema if needed,
  - **auto-seeds the catalog on first boot** (only when the products table is
    empty — never overwrites existing data),
  - serves the API under `/api/*`,
  - serves `dist/` with a history-API fallback to `index.html`.

Because the frontend calls the relative path `/api`, no CORS or extra config is
needed in this single-origin setup.

## Required environment variables

| Variable              | Required        | Notes                                                          |
| --------------------- | --------------- | -------------------------------------------------------------- |
| `NODE_ENV`            | prod            | Set to `production`.                                           |
| `JWT_SECRET`          | **prod (hard)** | Long random string. Server refuses to boot in prod without it. |
| `PORT`                | auto            | Injected by Render/Railway.                                    |
| `JWT_EXPIRES_IN`      | optional        | Token lifetime, default `7d`.                                  |
| `DATABASE_URL`        | prod            | Turso URL `libsql://<db>-<org>.turso.io`. Unset locally → file. |
| `DATABASE_AUTH_TOKEN` | prod            | Turso auth token.                                              |

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Create the Turso database (free, no card)

```bash
# install CLI (https://docs.turso.tech), then:
turso auth signup                       # sign in with GitHub
turso db create cyber-store
turso db show cyber-store --url         # -> DATABASE_URL
turso db tokens create cyber-store      # -> DATABASE_AUTH_TOKEN
```

The schema is created automatically on first boot, and the catalog is
auto-seeded when the products table is empty.

## Render (Blueprint)

A ready [`render.yaml`](render.yaml) is included (free plan, no disk).

1. Push this repo to GitHub.
2. Render → **New +** → **Blueprint** → select the repo.
3. When prompted, paste `DATABASE_URL` and `DATABASE_AUTH_TOKEN` from Turso.
   `JWT_SECRET` is auto-generated.
4. Deploy. First boot creates the schema and seeds the catalog into Turso.

## Re-seeding manually

`npm run seed` rewrites the **products** table from `src/data/*` (users and
orders are untouched). The auto-seed-on-boot only runs when the table is empty,
so a normal deploy never clobbers data.

## Local production smoke test

```bash
npm install
npm run build
NODE_ENV=production JWT_SECRET=test-secret npm start
# open http://localhost:3001  (SPA + API from one origin)
```
