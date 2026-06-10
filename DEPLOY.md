# Deployment

The app deploys as **one Node service**: Express serves both the built Vue SPA
(`dist/`) and the JSON API under `/api`, from a single origin. The catalog lives
in SQLite on a persistent disk.

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

| Variable         | Required        | Notes                                                        |
| ---------------- | --------------- | ------------------------------------------------------------ |
| `NODE_ENV`       | prod            | Set to `production`.                                         |
| `JWT_SECRET`     | **prod (hard)** | Long random string. Server refuses to boot in prod without it. |
| `PORT`           | auto            | Injected by Render/Railway.                                  |
| `JWT_EXPIRES_IN` | optional        | Token lifetime, default `7d`.                                |
| `DB_PATH`        | prod            | Absolute path on the persistent disk, e.g. `/var/data/cyber.db`. |

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Render (Blueprint)

A ready [`render.yaml`](render.yaml) is included. It provisions a 1 GB persistent
disk at `/var/data`, sets `DB_PATH` to it, and auto-generates `JWT_SECRET`.

1. Push this repo to GitHub.
2. Render → **New +** → **Blueprint** → select the repo.
3. Deploy. First boot auto-seeds the catalog onto the disk.

> A persistent disk requires a paid instance type. Without a disk the SQLite
> file lives on an ephemeral filesystem and is wiped on every restart/deploy.

## Railway

No disk config file needed:

- **Build:** `npm install && npm run build`
- **Start:** `npm start`
- Add a **Volume** mounted at e.g. `/var/data` and set `DB_PATH=/var/data/cyber.db`.
- Set `NODE_ENV=production` and `JWT_SECRET=<generated>`.

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
