# Architecture — Complete On-Page SEO 1.3.0

22-level audit engine. Request flow (8 steps):

```
Browser / CLI / MCP client
  │  POST /api/audit { url, config }            GET /api/audit-progress/:id (SSE)
  ▼                                             ▲
Express (helmet CSP, cors, compression, 1MB cap, 200/15min rate-limit)
  │  requestId → ssrf guard (assertPublicUrl + DNS-rebind) → zod validate
  │  LRU cache (500 keys, 1h TTL) → concurrency guard (max 2, 429+Retry-After)
  ▼
fetchRawHtml (raw HTML, 5MB cap, 25s timeout) ──► auditUrl()
  │                                                   ├─ Puppeteer (headless Chrome, UA + viewport spoof, networkidle2, 45s)
  │                                                   │    └─ perf timings + renderedHtml + redirectChain
  │                                                   ├─ Cheerio parse → bodyText
  │                                                   ├─ robots.txt / llms.txt / sitemap probes (SSRF-safe, 8s)
  │                                                   ├─ L1…L22 (each: score 0-100 + issues[] + data{}, never throws)
  │                                                   ├─ aggregate overallScore = mean(L1..L22)
  │                                                   └─ history.record() → data/history.json (last 200)
  ▼
JSON { url, overallScore, levels[22], summary, meta, duration }  (+ SSE progress per level)
  │  /api/history?url= · /api/diff?from&to · /api/crux · /api/crawl · /api/export-pdf
  ▼
Pixel UI (public/index.html) → 22 accordions + 14 deliverables + 5-phase deep-dive + CSV/PDF export
CLI (bin/seo-audit.js --fail-on) · MCP server (mcp-server.js: audit_url/get_level_info/check_ai_readiness/get_crux/crawl_site)
```

## Module map (post-1.3 refactor seam)

| Path                       | Responsibility                                                                                 |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| `server.js`                | Composition root: middleware, routes, SSE, audit orchestration                                 |
| `src/logger.js`            | winston JSON/pretty logger (replaces console.*)                                                |
| `src/cache.js`             | LRU(500) + TTL(1h) + hitRate stats                                                             |
| `src/history.js`           | File-backed history (data/history.json, 200 entries, atomic writes)                            |
| `src/middleware/ssrf.js`   | isPrivateHostname/assertPublicUrl/normaliseUserUrl (single source of truth)                    |
| `src/middleware/errors.js` | requestId, 404, errorHandler                                                                   |
| `src/lib/netfetch.js`      | SSRF-safe text fetch (robots/llms/sitemap probes)                                              |
| `src/lib/sitemap.js`       | parseRobots/parseSitemapXml/isSitemapIndex + AI-bot rules                                      |
| `src/lib/crux.js`          | PageSpeed fetch with PAGESPEED_API_KEY + honest unmeasured fallback                            |
| `src/levels/index.js`      | Level registry + LEVEL_NAMES[22]                                                               |
| `src/levels/level22.js`    | L22 AI-search readiness (llms.txt/robots-ai/citation)                                          |
| `levels.js`                | Legacy L1–L21 monolith (split incrementally; do not extend — add new levels under src/levels/) |
| `helpers.js`               | 70 pure analysis helpers (imported by all levels)                                              |
| `bin/seo-audit.js`         | CLI with --json/--fail-on for CI gating                                                        |
| `mcp-server.js`            | MCP stdio server (5 tools) for Claude/Cursor                                                   |
| `openapi.yaml`             | Full OpenAPI 3.0 spec (13 paths)                                                               |

## Key invariants

1. Real data only: unmeasurable → `null`/`N/A` + `dataSource` note. Never synthesize.
2. Levels never throw: engine wraps each in try/catch → score 0 + critical issue.
3. SSRF on every user URL: hostname block + DNS-rebind + credential rejection.
4. Bounded resources: 1MB JSON, 5MB HTML, 1MB PDF-HTML, 2 concurrent audits, 500-key cache, 25-page crawl cap.
5. Graceful degradation: Puppeteer failure → raw-HTML analysis continues; PageSpeed 429 → `unmeasured` payload.
