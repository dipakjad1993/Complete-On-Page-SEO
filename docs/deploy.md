# Deploy

> **Recruiter demo reliability:** use Docker or Fly.io as primary demo (no sleep).
> Render free-tier sleeps → first click 503/wake ~50s. Keep Render as secondary link only.

## Docker (self-host, no sleep — recommended primary)

```bash
docker build -t complete-on-page-seo .
docker run -p 3000:3000 complete-on-page-seo
# health: http://localhost:3000/api/health
# GHCR releases: ghcr.io/dipakjad1993/complete-on-page-seo:latest (on every v* tag)
```

System Chromium is baked in (`CHROME_PATH=/usr/bin/chromium`, `PUPPETEER_SKIP_DOWNLOAD=true`).

## Fly.io (persistent, no sleep — recommended primary)

```bash
fly launch && fly deploy   # fly.toml: iad, 1×1024MB, /api/health checks
```

## Render.com (public demo — sleeps on free tier, secondary)

Blueprint `render.yaml`: `npm run render-build` → `npm start`, `healthCheckPath: /api/health`.
Stop the sleep→503: free [UptimeRobot](https://uptimerobot.com/) HTTP(s) monitor, 5-min interval, on
`https://<app>.onrender.com/api/health` (env `KEEP_ALIVE_URL` documents it). First cold load ≈ 50 s.

## VPS / bare metal

```bash
npm ci && npx puppeteer browsers install chrome && npm start
# env: PORT, CHROME_PATH, ALLOWED_ORIGINS, KEEP_ALIVE_URL, PAGESPEED_API_KEY, LOG_LEVEL, HISTORY_DIR
```

## Env vars

| Var                 | Default               | Purpose                |
| ------------------- | --------------------- | ---------------------- |
| `PORT`              | 3000                  | listen port            |
| `CHROME_PATH`       | puppeteer default     | system Chrome          |
| `ALLOWED_ORIGINS`   | empty (public demo)   | browser CORS allowlist |
| `KEEP_ALIVE_URL`    | render health URL     | UptimeRobot target     |
| `PAGESPEED_API_KEY` | empty (works)         | higher /api/crux quota |
| `LOG_LEVEL`         | info prod / debug dev | winston level          |
| `HISTORY_DIR`       | ./data                | history store dir      |
| `HISTORY_MAX`       | 200                   | retained summaries     |
