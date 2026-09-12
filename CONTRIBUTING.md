# Contributing

Thanks for stopping by. This is a solo-maintained audit engine; small, reviewed PRs are welcome.

## Quick start

```bash
nvm use        # Node 20 (CI also runs 18 + 22)
npm ci
npm test       # vitest: 56 tests (helpers + levels + SSRF/LRU + API)
npm run lint   # eslint (strict)
npm start      # http://localhost:3000
```

Useful: `npm run cli -- https://example.com --json`, `npm run mcp` (MCP stdio server), `npm run test:coverage`.

## PR rules

1. One concern per PR. No drive-by refactors of `levels.js` / `helpers.js` in the same PR as a feature. New levels go in `src/levels/` (see `src/levels/level22.js`); do not extend the legacy `levels.js` monolith.
2. Real data only: never present a modeled/heuristic number as a measured fact. Return `null`/`N/A` with a `dataSource` note (see `README` data-integrity guarantee).
3. Add/extend a test in `tests/` for every pure-function change (`levels.test.js` for levels, `unit.test.js` for libs, `api-extended.test.js` for routes).
4. Run `npm test && npm run lint && npx prettier --check .` before pushing.
5. Security: any new fetch of a user-supplied URL must go through `assertPublicUrl()` from `src/middleware/ssrf.js` (SSRF guard) — including robots/llms/sitemap probes.

## Good first issues

Look for the `good first issue` label: Dockerfile tweaks, Hindi locale, OG tags, history trend chart (ECharts from `GET /api/history`), Lighthouse `?lighthouse=true` option, splitting legacy `levels.js` into `src/levels/l01-*.js`.
