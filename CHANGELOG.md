# Changelog

All notable changes follow Keep a Changelog + SemVer.

## [1.4.0] - 2026-09-20

### Added

- Weighted scoring (`weightedScore` alongside `overallScore`): L1/L2/L3/L8/L12 1.5x, dev-cluster L5/L13/L17/L19 0.7x, plus `zeroClickBrandValue` 35% AI-citation lift ($0-gated without GA4 inputs). History + diff carry `weightedDelta`.
- Mocked-Puppeteer e2e (`tests/e2e.mocked.test.js`), coverage-v8 + floor thresholds, CI `test:coverage` gate.
- L22 honesty per Google May 2026 guide: retrieval vs training bot split, llms.txt demoted to informational.

### Changed

- Deps: puppeteer 25.11, uuid 14.0.2, compromise 14.17, vitest 5.0.1, zod 4.6.5 (v3/v4 compat shim in `parseBody`).
- Docs: Docker/Fly primary demo, Render secondary (sleep note).

## [Unreleased]

### Changed

- Standardized on **Node 22+** (`>=22.12.0`): `Dockerfile` (`node:22-slim`), `.nvmrc` (22), `render.yaml` (`NODE_VERSION: 22`), CI matrix (22/24). Puppeteer 25 + vitest 5 declare Node `>=22.12.0` engines; Node 20 builds emitted `EBADENGINE` warnings on Render.

### Fixed

- Inline `onclick` handlers blocked by `script-src-attr 'none'` (Helmet default) — added `script-src-attr 'unsafe-inline'` so all UI buttons work under the hardened CSP.
- `POST /api/audit` 400 `config.competitors Expected string, received array` — schema now accepts string or string-array (what the UI sends).
- Report export is now a one-click server-rendered PDF download (`downloadPDF()` → `POST /api/export-pdf` → binary save), replacing the `window.print()` print-dialog flow.

## [1.3.0] - 2026-09-12

### Added

- **Level 22 — AI-Search Readiness** (`src/levels/level22.js`): live `llms.txt` presence/quality probe, `robots.txt` AI-bot rules (GPTBot, PerplexityBot, ClaudeBot, CCBot, Bytespider, Google-Extended, Applebot…), canonical/title/description/JSON-LD citation surface, definitional-lead heuristic. Engine is now 22 levels; overall = mean(L1..L22).
- `POST /api/crawl` raised **max 10 → 25** + `includeSitemap` (default true): robots `Sitemap:` discovery, sitemap-index expansion (3 children), same-origin BFS seeding.
- `GET /api/history?url=&limit=` + `GET /api/diff?url=&from=&to=` — file-backed last-200 summaries (`data/history.json`, atomic writes) with `improved/regressed/stable` verdicts.
- `bin/seo-audit.js` CLI (`npx complete-on-page-seo <url> --json --fail-on critical|warning --config '{}' --api <base>`) for CI gating; `package.json` `bin` + `npm run cli`.
- `mcp-server.js` — zero-dep MCP stdio server (5 tools: `audit_url`, `get_level_info`, `check_ai_readiness`, `get_crux`, `crawl_site`); `npm run mcp`.
- `src/` modular seam: `logger.js` (winston), `cache.js` (LRU 500/1h + hitRate), `history.js`, `middleware/ssrf.js` (single source of truth), `middleware/errors.js` (requestId/404/handler), `lib/netfetch.js`, `lib/sitemap.js` (robots AI-bot + sitemap XML), `lib/crux.js` (API-key + honest fallback), `levels/index.js` (22-name registry).
- Packaging: `ARCHITECTURE.md`, `ROADMAP.md`, `docs/{levels,api,deploy,faq,BUDGET}.md`, `CODEOWNERS`, `.github/dependabot.yml`, `.github/workflows/release.yml` (npm + GHCR on `v*`), `README` cut 918 → ~100-line executive.
- Tests: 24 → **56** (`tests/levels.test.js` 11 pure-level inc. L22, `tests/unit.test.js` 9 SSRF/LRU/sitemap/diff, `tests/api-extended.test.js` 12 SSE/cache/history/diff/crawl/PDF/CrUX/404). CI matrix now Node 20/22 (puppeteer 25 requires Node 20+ for CJS `require`) + `npm run lint` gate.

### Changed

- `server.js` is now a composition root: winston replaces `console.*`, LRU replaces unbounded `Map`, HSTS/noSniff/referrer hardening, SSE heartbeat (20 s), graceful SIGTERM/SIGINT shutdown, `GET /api/health` exposes `levels/cache/historyEntries`, `GET /api/cache-stats` exposes LRU stats.
- SSRF guard hardened: CGNAT (`100.64/10`), TEST-NET (`192.0.2/24`, `198.51.100/24`, `203.0.113/24`, `198.18/15`), decimal/octal/hex IP tricks, credentialed-URL rejection.
- `GET /api/crux` honors `PAGESPEED_API_KEY` (higher quota) and returns structured `unmeasured` on 429/5xx instead of flat 502.
- ESLint strict (`no-unused-vars:error`, `eqeqeq`, `curly`, `no-eval`, `prefer-const`), vitest v8 coverage config, `typecheck` covers new entry points.

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
