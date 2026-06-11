// pm2 process config — keeps the app running 24/7 and restarts it on crash/reboot.
//   pm2 start ecosystem.config.cjs
// NODE_ENV/PORT are set here; the secret (JWT_SECRET) comes from the root .env
// file (loaded via dotenv), so it never lives in the repo.
module.exports = {
  apps: [
    {
      name: 'cyber-store',
      script: 'server/src/index.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        // DATABASE_URL is intentionally unset -> the app uses a local SQLite
        // file at server/data/cyber.db (no external DB needed).
      },
    },
  ],
}
