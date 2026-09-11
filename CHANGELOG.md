# Changelog

All notable changes follow Keep a Changelog + SemVer.

## [1.2.0] - 2026-09-11

### Added

- MIT `LICENSE` (repo was legally unusable before; `package.json` already claimed ISC).
- `GET /api/health` now returns version/uptime/memory/cache stats; new `GET /api`, `GET /api/cache-stats`, `GET /openapi.yaml`.
- `GET /api/crux?url=` — real CrUX/PageSpeed field data (LCP/INP/CLS) instead of lab-timings only.
- `POST /api/crawl` — same-origin BFS crawl, max 10 pages.
- `openapi.yaml` + Swagger-friendly docs; `Dockerfile`, `.dockerignore`, `fly.toml`, `.env.example`, `.nvmrc`.
- CI (`.github/workflows/ci.yml`): Node 18+20, typecheck, `npm audit`, vitest, prettier check.
- `tests/helpers.test.js` (30+ assertions on pure math) + `tests/api.test.js` (health, SSRF 400s, validation).
- `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`.
- Frontend SEO: meta description, OG/Twitter cards, canonical.

### Fixed

- **SSRF guard** (`assertPublicUrl`): blocks private/loopback/link-local/metadata targets + DNS-rebind check; zod input validation; JSON body 1MB; raw-HTML 5MB cap; PDF HTML 1MB cap.
- `npm audit fix`: prod deps now 0 vulnerabilities (`npm audit --omit=dev --audit-level=high` clean; remaining dev-chain vitest/vite advisories need breaking vitest 5, tracked not gated).
- CORS now respects `ALLOWED_ORIGINS`; helmet CSP enabled (was disabled); static assets use etag + 1h cache.
- Renamed confusing duplicate: L14 `Financial Attribution - Single-Page ROI` (this page) vs L21 `Site-Wide Risk Aggregation & Executive Rollup (Portfolio)` (rollup). `LEVEL_NAMES` + README updated with scope note.
- `render.yaml`: `healthCheckPath: /api/health`, `NODE_ENV=production`, keep-alive docs (UptimeRobot 5-min ping to stop free-tier sleep -> 503).

### Changed

- Version 1.1.0 -> 1.2.0; `package.json` author/repository/bugs/homepage filled; license ISC -> MIT; keywords expanded; scripts added (`test`, `lint`, `format`, `audit`, `start:prod`, `typecheck`); new deps `zod`, devDeps `vitest/supertest/eslint/prettier`.

## [1.1.0] - 2026-08-16

- Per-module screenshots for all 21 levels; removed fabricated data; real-screenshot guarantee.
