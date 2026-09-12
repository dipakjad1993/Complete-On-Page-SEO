# Performance budget

| Operation                           | Budget                  | Enforced by                                          |
| ----------------------------------- | ----------------------- | ---------------------------------------------------- |
| `GET /api/health`                   | < 50 ms p99             | No I/O; healthcheck + status badge target            |
| `POST /api/analyze-url` (auto-fill) | < 15 s                  | 9s verify + 5s robots/sitemap probes, parallelised   |
| `POST /api/audit` (full 22 levels)  | < 120 s                 | 25s fetch + 45s Puppeteer + level CPU (pure Cheerio) |
| Raw HTML buffer                     | ≤ 5 MB                  | `MAX_HTML_BYTES` — refuses larger with 400           |
| JSON body / PDF HTML                | ≤ 1 MB                  | express.json limit + export-pdf guard                |
| Concurrent audits                   | ≤ 2                     | 429 + `Retry-After: 30` beyond that                  |
| Cache                               | 500 keys / 1 h TTL      | `src/cache.js` LRU + eviction counter                |
| Crawl                               | ≤ 25 pages, same-origin | BFS + per-fetch 25s timeout                          |
| SSE                                 | heartbeat 20 s          | Prevents proxy timeouts on long audits               |

Exceeding a budget returns a structured error (`429`/`400`/`504`), never a silent hang.
