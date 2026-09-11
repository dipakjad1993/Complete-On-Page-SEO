# Contributing

Thanks for stopping by. This is a solo-maintained audit engine; small, reviewed PRs are welcome.

## Quick start

```bash
nvm use        # Node 20
npm ci
npm test       # vitest (helpers + API health/validation)
npm run lint   # eslint
npm start      # http://localhost:3000
```

## PR rules

1. One concern per PR. No drive-by refactors of `levels.js` / `helpers.js` in the same PR as a feature.
2. Real data only: never present a modeled/heuristic number as a measured fact. Return `null`/`N/A` with a `dataSource` note (see `README` data-integrity guarantee).
3. Add/extend a test in `tests/` for every pure-function change.
4. Run `npm test && npm run lint && npx prettier --check .` before pushing.
5. Security: any new fetch of a user-supplied URL must go through `assertPublicUrl()` (SSRF guard) in `server.js`.

## Good first issues

Look for the `good first issue` label: Dockerfile tweaks, Hindi locale, OG tags, L21 CrUX display, splitting `levels.js`.
