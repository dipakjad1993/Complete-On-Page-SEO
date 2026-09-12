# Security Policy

## Supported versions

| Version | Supported                                         |
| ------- | ------------------------------------------------- |
| 1.3.x   | yes                                               |
| 1.2.x   | yes (upgrade recommended: L22/history/CLI absent) |
| < 1.2   | no (upgrade; pre-SSRF-guard)                      |

## Report a vulnerability

Email the maintainer via a GitHub Security Advisory on this repo (preferred) — do not open a public issue with exploit details. Expect an acknowledgement within 72h.

## Security boundaries (by design)

- **Public demo, no auth.** All `/api/*` endpoints are unauthenticated and rate-limited (200 req / 15 min / IP). Do not send private URLs, credentials, or intranet hosts.
- **SSRF protection** (`src/middleware/ssrf.js`, re-exported by `server.js`). `POST /api/audit`, `/api/analyze-url`, `/api/crawl`, `GET /api/crux`, plus L22 robots/llms/sitemap probes validate public `http(s)` hosts: `localhost`, `.local`, loopback/link-local/private (`10/8`, `172.16/12`, `192.168/16`, `127/8`, `169.254.169.254`, `0.0.0.0`, CGNAT `100.64/10`, TEST-NET `192.0.2/24`/`198.51.100/24`/`203.0.113/24`/`198.18/15`, IPv6 `::1`/`::`/`fc00::/7`/`fe80::/10`), decimal/octal/hex IP obfuscation, credentialed URLs, and DNS-resolved private IPs (DNS-rebind) are rejected with `400`. Cloud metadata endpoints are blocked.
- **Fetch hardening.** Raw HTML capped at 5MB, upstream timeout 25s, L22 probes 8s/256KB, `POST /api/export-pdf` HTML capped at 1MB, JSON body limit 1MB, crawl capped at 25 same-origin pages.
- **Browser hardening.** Puppeteer runs with `--no-sandbox` only because Render's rootless containers lack user namespaces (commented in `server.js`). For self-hosting as root, run behind the Dockerfile's setup or re-enable the sandbox.
- **Headers/CORS.** `helmet` CSP + HSTS + noSniff + strict referrer policy for the SPA; `cors` restricts to `ALLOWED_ORIGINS` when set; every response carries `x-request-id`.
- **Bounded engine.** Max 2 concurrent audits (`429` + `Retry-After: 30`), LRU 500-key/1h cache with eviction counters, graceful SIGTERM/SIGINT drain, winston logs (never full HTML/secrets).
- **No log ingestion.** Log-config deliverables (L10) are drop-in _templates_ — the tool never connects to your Cloudflare/CloudWatch/Datadog. History (`data/history.json`) stores score summaries only, never page HTML.
