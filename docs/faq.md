# FAQ

**Does it crawl my whole site?**
Single URL per audit (deepest honest audit). `POST /api/crawl` does a 25-page same-origin BFS + sitemap expansion for breadth; run one audit per URL for full depth. L21 rolls signals into a portfolio view.

**SPAs (React/Angular/Vue)?**
Yes — Puppeteer renders JS; L2 diffs raw vs rendered to catch JS-dependent content.

**Scores comparable across pages?**
Yes — every level is 0–100 with the same `sc()` penalties; overall = mean of 22.

**localhost/staging?**
Public demo blocks private targets (SSRF: localhost, 10/8, 192.168/16, 172.16/12, 127/8, 169.254.169.254, ::1, fc/fd/fe80, metadata, DNS-rebind, credentialed URLs → 400). Self-host via Docker and audit staging inside your network.

**Stored results?**
Last-200 summaries in `data/history.json` (`GET /api/history`, `GET /api/diff`). Full level payloads live in the LRU cache (1 h), not on disk.

**How long?**
Auto-fill < 15 s; full audit typically 60–120 s (Puppeteer + 22 levels).

**"No Data Found" cards?**
Thin pages or missing GA4 inputs (traffic/AOV/CVR) → revenue cards show `$0` + note. Supply Business Intelligence inputs for dollars.

**Revenue-at-risk?**
`probability × exposure × loss` from your GA4 inputs. Modeled fractions labeled assumptions; without inputs every figure is `0`.

**LLM scores real inference?**
No — structural heuristics (chunk retrievability, citation surface), explicitly labeled. L22 adds the measurable part: llms.txt + robots-ai + citation surface.

**Why L14 vs L21, L5/L13/L17/L19?**
L14 = this page's dollars; L21 = portfolio rollup. L5 = PR diffs; L13 = CI gates; L17 = red-team; L19 = safe rollout.

**Troubleshooting?**
Chrome missing → `npx puppeteer browsers install chrome` or set `CHROME_PATH`. Port busy → `PORT=3001 npm start`. Low memory → keep `--disable-dev-shm-usage --no-sandbox` (already in launcher). Level failure → score 0 + critical issue, audit continues; see logs (`LOG_LEVEL=debug`).
