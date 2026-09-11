# Security Policy

## Supported versions

| Version | Supported                    |
| ------- | ---------------------------- |
| 1.2.x   | yes                          |
| < 1.2   | no (upgrade; pre-SSRF-guard) |

## Report a vulnerability

Email the maintainer via a GitHub Security Advisory on this repo (preferred) — do not open a public issue with exploit details. Expect an acknowledgement within 72h.

## Security boundaries (by design)

- **Public demo, no auth.** All `/api/*` endpoints are unauthenticated and rate-limited (200 req / 15 min / IP). Do not send private URLs, credentials, or intranet hosts.
- **SSRF protection.** `POST /api/audit`, `/api/analyze-url`, `/api/crawl`, `GET /api/crux` validate that targets are public `http(s)` hosts: `localhost`, `.local`, link-local/loopback/private ranges (`10/8`, `172.16/12`, `192.168/16`, `127/8`, `169.254.169.254`, `0.0.0.0`, IPv6 `::1`/`fc00::/7`/`fe80::/10`), and DNS-resolved private IPs are rejected with `400`. Cloud metadata endpoints are blocked.
- **Fetch hardening.** Raw HTML is capped at 5MB, upstream timeout 25s, `POST /api/export-pdf` HTML capped at 1MB, JSON body limit 1MB.
- **Browser hardening.** Puppeteer runs with `--no-sandbox` only because Render's rootless containers lack user namespaces (commented in `server.js`). For self-hosting as root, run behind the Dockerfile's non-root setup or re-enable the sandbox.
- **Headers/CORS.** `helmet` with a tight CSP for the SPA; `cors` restricts to `ALLOWED_ORIGINS` when set.
- **No log ingestion.** Log-config deliverables (L10) are drop-in _templates_ — the tool never connects to your Cloudflare/CloudWatch/Datadog.
