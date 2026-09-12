# API reference (13 paths — see openapi.yaml)

Base: `https://complete-on-page-seo.onrender.com` (demo, sleeps) or `http://localhost:3000`.

## POST /api/audit — full 22-level audit

```json
{
  "url": "https://example.com",
  "config": {
    "keywords": "seo audit",
    "brand": "Example",
    "pageType": "article",
    "userAgent": "chrome-desktop",
    "viewportWidth": 1920,
    "viewportHeight": 1080,
    "monthlyTraffic": 50000,
    "avgOrderValue": 75,
    "conversionRate": 2.5,
    "currency": "USD",
    "geo": "US",
    "sitemap": "https://example.com/sitemap.xml",
    "competitors": "https://rival.com"
  }
}
```

Response: `{ url, overallScore, levels[22], summary{criticalIssues,warnings,info}, meta, duration, cached? }`.
Errors: `400` invalid/blocked (SSRF), `429` engine busy (`Retry-After: 30`).

## GET /api/audit-progress/:auditId — SSE stream

`text/event-stream` with `{ auditId, level, status, detail }` per level + heartbeat comment every 20 s.

## POST /api/analyze-url — auto-fill

`{ url }` → `{ brand, pageType, sitemap, keywords, competitors, viewportWidth/Height, geo, currency, userAgent, blocked, meta }`.
Runs live fetch + DuckDuckGo competitor discovery + verification.

## GET /api/crux?url= — field data

Real PageSpeed/CrUX (LCP/INP/CLS/TTFB/FCP/speedIndex + `fieldData` + `performanceScore`).
Honest `unmeasured` payload on 429/5xx. Higher quota via `PAGESPEED_API_KEY`.

## POST /api/crawl — multi-page BFS (max 25)

```json
{ "startUrl": "https://example.com", "maxPages": 25, "includeSitemap": true }
```

Same-origin BFS over raw HTML + sitemap-index expansion (`includeSitemap`, default true). Per-page: `{ url, status, title, words }`.
Note: full 22-level depth needs one `POST /api/audit` per URL.

## GET /api/history?url= — audit history

File-backed last-200 summaries. `?url=` filters (max 50), `?limit=` caps.

## GET /api/diff?from=<iso>&to=<iso>&url= — score diff

`from`/`to` are history timestamps for the same URL. Returns `{ overallDelta, verdict: improved|regressed|stable, levels[{level,from,to,delta}] }`.

## POST /api/export-pdf — HTML→PDF (1 MB cap)

`{ html }` → `application/pdf` (A4, backgrounds, 20/15 mm margins).

## GET /api/health · GET /api · GET /api/cache-stats · GET /openapi.yaml

Liveness (version/uptime/memory/activeAudits/cache/history), index, cache stats (size/max/ttl/hits/misses/evictions/hitRate), spec file.
