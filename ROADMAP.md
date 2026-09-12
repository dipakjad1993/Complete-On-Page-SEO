# Roadmap — checkboxes, not promises

Shipped (1.0 → 1.3.0):

- [x] 21-level forensic engine + 14 deliverables (real data, null/N/A honesty)
- [x] SSRF guard + zod + Helmet CSP + rate-limit + 429 concurrency guard + LRU cache
- [x] SSE progress, Pixel UI, JSON/CSV/PDF export, 29 evidence screenshots
- [x] CrUX field data (`GET /api/crux`), BFS crawl, sitemap/robots discovery
- [x] CI (Node 22/24) + vitest + ESLint strict + Prettier + npm audit gate
- [x] Docker + Fly + Render blueprints, OpenAPI 3.0, MIT, SECURITY, CONTRIBUTING
- [x] **1.3.0:** L22 AI-search readiness (llms.txt/robots-ai/citation), crawl 25 + sitemap expansion, history + diff, CLI `--fail-on`, MCP server (5 tools), winston logging, docs/ split

Next (scoped, in priority order):

- [ ] **Lighthouse option** (`?lighthouse=true` via `lighthouse` npm, lab scores alongside CrUX field) — closes davo20019 parity gap
- [ ] **History UI trend chart** (ECharts sparkline on report page from `GET /api/history`)
- [ ] **Scheduled audits** (cron + email digest; needs a mail provider — currently out of scope for free tier)
- [ ] **SDK clients** (`clients/js`, `clients/python`) generated from openapi.yaml
- [ ] **Postgres/Redis adapters** behind the file-backed history/LRU interfaces (only when self-hosting at scale)
- [ ] **Coverage 80% + Codecov badge** (levels fixtures landing in 1.3.0; e2e with mocked Puppeteer next)

Non-goals (honest): full-site 1M-URL crawling, backlink index, rank tracking, hosted always-on free demo (use Docker/Fly instead).
