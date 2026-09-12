# Complete ON Page SEO 2026 — 22-Level + AI-Search Auditor

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://complete-on-page-seo.onrender.com/)
[![CI](https://github.com/dipakjad1993/Complete-On-Page-SEO/actions/workflows/ci.yml/badge.svg)](https://github.com/dipakjad1993/Complete-On-Page-SEO/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22-brightgreen)](./.nvmrc)
![Version](https://img.shields.io/badge/version-1.3.0-blue)
![Puppeteer](https://img.shields.io/badge/puppeteer-25.x-yellow)
![Tests](https://img.shields.io/badge/tests-56%20passing-brightgreen)
![Levels](https://img.shields.io/badge/audit--levels-22-blueviolet)
![MCP](https://img.shields.io/badge/MCP-5%20tools-orange)
![Docker](https://img.shields.io/badge/docker-ready-blue)

Production-grade **22-level on-page + AI-search (RAG/LLM) SEO auditor** with **14 dev-ready deliverables** — real measured data, no mocks. Node.js + Puppeteer + Express.

- **Real data, no mocks** — unmeasurable numbers return `null`/`N/A` with a `dataSource` note (see guarantee below).
- **22 levels incl. RAG + revenue + llms.txt** — SSR/CSR diff, schema audit, passage vectors, edge workers, revenue-at-risk, AI-search readiness.
- **Full-stack** — Puppeteer rendering → Cheerio/Express SSE streaming → Pixel UI → Render/Docker/Fly deploy.
- **Machine-consumable** — REST API (11 endpoints) + OpenAPI 3.0 + CLI (`--fail-on`) + MCP server (5 tools for Claude/Cursor).

**🔗 Try live:** [https://complete-on-page-seo.onrender.com/](https://complete-on-page-seo.onrender.com/) · Health: [`/api/health`](https://complete-on-page-seo.onrender.com/api/health) · API docs: [`/openapi.yaml`](./openapi.yaml)

> **Render free-tier note:** the demo sleeps when idle (first click can 503/wake ~50s). Keep-alive is a free 5-min [UptimeRobot](https://uptimerobot.com/) ping on `/api/health` (see `render.yaml:KEEP_ALIVE_URL`); or self-host with zero sleep: `docker run -p 3000:3000 ghcr.io/dipakjad1993/complete-on-page-seo` or `fly deploy` (see [`docs/deploy.md`](./docs/deploy.md)).

```bash
# 30-second quickstart
git clone https://github.com/dipakjad1993/Complete-On-Page-SEO.git && cd Complete-On-Page-SEO
npm ci && npx puppeteer browsers install chrome && npm start
# open http://localhost:3000
```

```bash
# CLI quickstart (CI-gating, no browser needed beyond the API)
npx complete-on-page-seo https://example.com --json --fail-on critical
```

```bash
# curl quickstart
curl -X POST http://localhost:3000/api/audit \
 -H "Content-Type: application/json" \
 -d '{"url":"https://example.com","config":{"keywords":"seo audit"}}'
```

> **Data integrity guarantee:** every metric is computed from the real fetched/rendered page. No demo results, no hardcoded scores, and no synthetic values presented as measured facts. Where a number genuinely cannot be measured (e.g. Google's real crawl frequency, real CTR uplift, live LLM inference), the tool says so explicitly instead of inventing a value.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
  - [22 Specialized Analysis Levels](#-22-specialized-analysis-levels)
  - [14 Concrete Executive Deliverables](#-14-concrete-executive-deliverables)
  - [Real Data, No Fabrication](#-real-data-no-fabrication)
  - [Smart Auto-Configuration](#-smart-auto-configuration)
  - [Modern Google Pixel UI](#-modern-google-pixel-ui)
  - [Production-Ready](#-production-ready)
  - [Machine Interfaces: CLI + MCP](#-machine-interfaces-cli--mcp)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Using the Tool — 3-Step Flow](#using-the-tool--3-step-flow)
- [The 22 Analysis Levels](#the-22-analysis-levels)
- [The 14 Executive Deliverables](#the-14-executive-deliverables)
- [Inputs & Configuration](#inputs--configuration)
- [API Reference](#api-reference)
- [Comparison — Honest Positioning](#comparison--honest-positioning)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Roadmap](#roadmap)
- [Author — Hire Me](#author--hire-me)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Complete ON Page SEO 2026 is a **server-based** on-page SEO analysis tool that performs a deep, multi-dimensional audit of any public URL. Unlike superficial SEO checkers that return a handful of generic checks, this engine runs **22 independent analysis modules** ("levels"), each probing a specific facet of on-page optimization, technical SEO health, content quality, AI / LLM & RAG visibility, SERP readiness, automation and financial impact.

Each level produces:

- A **quantitative score** (0–100) reflecting that dimension's health.
- A **list of issues** with severity (critical / warning / info), impact, concrete fix instructions and recommendations.
- A **structured data object** broken into named sub-functions, each containing granular metrics derived entirely from real page data — no synthetic or fabricated values.

The overall score is the mean of all 22 levels. A crashing level yields score 0 plus one critical issue — it never fails the whole audit.

The system uses **Puppeteer** to render JavaScript-heavy pages (SPAs, React, Angular, Vue) so the analysis reflects what Googlebot _and_ AI crawlers see after JS execution. It also compares server-side (raw) HTML against rendered HTML to detect SSR/CSR discrepancies (Level 2), probes `robots.txt` / `llms.txt` / sitemaps over SSRF-guarded fetches (Level 22 + crawl seeder), and streams per-level progress over Server-Sent Events so long audits never look hung.

Full detail: [`docs/levels.md`](./docs/levels.md) · API: [`docs/api.md`](./docs/api.md) · Architecture: [`ARCHITECTURE.md`](./ARCHITECTURE.md) · Deploy: [`docs/deploy.md`](./docs/deploy.md) · FAQ: [`docs/faq.md`](./docs/faq.md) · Budgets: [`docs/BUDGET.md`](./docs/BUDGET.md) · Roadmap: [`ROADMAP.md`](./ROADMAP.md).

---

## Key Features

### 🔬 22 Specialized Analysis Levels

| #   | Level Name                                                | Focus Area                                                                      |
| --- | --------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 1   | Core Hygiene & Technical Baseline                         | Title, meta, viewport, robots, canonical, headings, links                       |
| 2   | DOM Reality, Rendering & Structural Diagnostics           | SSR vs CSR diff, DOM depth, schema validation                                   |
| 3   | Semantic Architecture, Entities & Information Gain        | Word count, readability, keyword density, AI detection                          |
| 4   | Generative Search, LLM & RAG Visibility                   | RAG chunking, passage vectors, direct answer scoring                            |
| 5   | Dev Automation & Auto-Fix Generation                      | Auto-generated patches, edge worker scripts, CI/CD hooks                        |
| 6   | Edge Computing & Serverless Integration                   | Edge worker configs, security headers, CORS, caching                            |
| 7   | Multi-Modal Content & Spatial Asset Auditing              | Image alt text, video captions, SVG accessibility                               |
| 8   | Predictive SERP Volatility & Algorithm Impact             | SERP volatility scoring, ranking stability prediction                           |
| 9   | SEO A/B Testing & Rollback Safety Guidance                | Variant suggestions, statistical significance, rollback safety                  |
| 10  | Bot Behavior Mapping & Log Config Templates               | Bot detection, freshness signals, example log configs                           |
| 11  | Synthetic Content & LLM Visibility Heuristics             | LLM citation heuristics, passage retrievability, content flags                  |
| 12  | Algorithmic Quality & Helpful-Content Classifier          | Content freshness, E-E-A-T signals, quality thresholds                          |
| 13  | Edge-Native Patching & CI/CD Gatekeeping                  | Pre-commit hooks, CI/CD rules, edge deployment                                  |
| 14  | Financial Attribution – Single-Page ROI                   | Revenue-at-risk per issue, ROI matrix, business impact (THIS page)              |
| 15  | Passage Vector & Cosine Similarity Profiler               | Passage-level retrieval scoring, topic cluster detection                        |
| 16  | Third-Party Consensus & Entity Alignment Scorer           | Entity cross-referencing, brand mention analysis                                |
| 17  | Autonomous Fix Generator & Red-Team Checks                | Autonomous fix generation, red-team header/HTML checks                          |
| 18  | Zero-Click & Agentic Commerce Visibility                  | Featured snippet readiness, product schema, commerce signals                    |
| 19  | Edge Orchestration & Self-Correction Rules                | Edge worker deployment, canary testing, self-healing scripts                    |
| 20  | Adversarial Checks & Security Header Audit                | Security testing, information disclosure, cloaking detection                    |
| 21  | Site-Wide Risk Aggregation & Executive Rollup (Portfolio) | Cross-signal rollup + executive risk summary (PORTFOLIO view)                   |
| 22  | AI-Search Readiness (llms.txt / robots-ai / citation)     | llms.txt quality, AI-bot allow/block, citation surface (title/desc/schema/lead) |

> **L14 vs L21 — same math, different scope (by design):** L14 monetizes _this URL's_ issues from your GA4 inputs (`monthlyTraffic`, `avgOrderValue`, `conversionRate`); L21 re-checks title/canonical/headings/schema/links and aggregates them into a portfolio-style executive rollup. Without traffic inputs both return `$0` with an explicit note.
>
> **Why L5 / L13 / L17 / L19 all touch "fixes":** L5 generates dev PR diffs, L13 enforces CI gates that block bad merges, L17 red-teams the fixes (headers/HTML abuse cases), L19 rolls them out safely (canary + self-healing edge). Dev-PR vs CI-gate vs red-team vs orchestration.
>
> **Why L4 / L11 / L15 / L22 all touch "AI":** L4 simulates RAG retrievability, L11 scores agentic/CTA readiness heuristics, L15 profiles passage-level cosine similarity, L22 measures the crawlable surface AI bots actually see (llms.txt + robots-ai + citation metadata). Retrieval vs readiness vs geometry vs surface.

### 📦 14 Concrete Executive Deliverables

The **Report page** (step 3) generates 14 ready-to-consume engineering artifacts straight from the audit's measured data:

1. **SSR vs. CSR Diff Report** — Visual split-view + machine-readable JSON diff of raw vs rendered HTML.
2. **DOM Tree Health Score** — Node count, max/avg depth, bucket histograms, reference thresholds.
3. **Schema Validation Audit** — Valid/invalid breakdown, missing required props, circular refs.
4. **RAG Chunking Simulator** — Sliding-window retrievability analysis for AI answer engines.
5. **Information Gain Delta** — KL-divergence and novel-term profile vs. a supplied baseline corpus (shows `N/A` without one).
6. **Entity Mapping Grid** — Knowledge-graph + NLP entity extraction with type/count chips.
7. **Automated Engineering Pull Requests** — Branch + commit + file-diff + regression tests.
8. **Self-Healing Edge Workers** — Deploy-ready Cloudflare Worker / Vercel Edge / Edgio code.
9. **CI/CD Build Gatekeeper Logs** — GitHub Actions workflow, GitLab CI config, pre-commit hook.
10. **Log-Stream Bot Behavior Maps** — Freshness signals + drop-in log configs (Cloudflare, CloudWatch, Datadog).
11. **Algorithmic Quality Threshold Alerts** — Thin-content, quality-flag and threshold-watch monitoring.
12. **Multi-Modal Asset Diagnostics** — Image/video/audio compliance and alt-text health.
13. **Revenue-at-Risk Dashboard** — Monetized financial impact model (probability × exposure × loss).
14. **Effort-to-Impact Prioritization Matrix** — Ranked remediation queue with impact-score bars.

### 🧠 Real Data, No Fabrication

Every metric across all 22 levels is derived from **actual page content**, not hardcoded defaults or synthesized values. This guarantee is enforced by design — where a measurement genuinely isn't possible, the tool returns `null`/`N/A` with an explanatory note instead of inventing a number:

- **Core Web Vitals** — only genuinely measured metrics (from Puppeteer's real browser timings + Google PageSpeed/CrUX field data via `GET /api/crux`) are rated; unmeasured ones report `unmeasured` with a `dataSource` note. No wall-clock estimation fallback.
- **SERP volatility** is computed from real page structure (word count, headings, images, links, lists, sentence/paragraph statistics).
- **Revenue at risk** is calculated from real page signals combined with **optional GA4 business inputs** you supply (traffic, AOV, conversion rate, currency). Without them, all monetary figures are `0` and every message says so. Modeled fractions are explicitly labeled as assumptions.
- **Information Gain (KL-divergence)** requires a baseline corpus; without one it returns `N/A` with a note — it is **not** computed against an empty reference.
- **Direct-answer & LLM-citation scores** are labeled as structural heuristics ("no real user query supplied", "no real LLM inference performed") — they never claim an LLM was actually run.
- **Crawl frequency** is reported as "not measured — depends on Google's internal signals", never a fake "daily to weekly" mapping.
- **Redirect latency** is reported as "not measured", never an invented 50ms-per-hop figure.
- **A/B CTR uplift** is reported as "not measured (no A/B test run)", never a fabricated "+5-15%".
- **Log configs (Cloudflare/CloudWatch/Datadog)** are clearly labeled templates — the tool does not connect to your infrastructure.
- **Entity consensus** uses actual page text for self-mentions — no fake "trusted sources."
- **Brand mention share** counts real occurrences in page text; **readability** uses real Flesch-Kincaid math on actual content.
- **L22 llms.txt/robots-ai** probes the live `/llms.txt` and `/robots.txt` over SSRF-guarded fetches — presence, byte size, markdown hints and per-bot allow/block are all measured, never assumed.

### ✨ Smart Auto-Configuration

As you type a target URL, the tool automatically analyzes it and pre-fills:

- **Page type**, **brand / entity name**, **keywords**, **sitemap URL**
- **Viewport**, **geo-location**, **currency**, **user-agent**
- **Competitor discovery** — real-time web search (DuckDuckGo) with live verification and domain/brand filtering to find genuine competitors, not SEO-tool spam.

Each auto-filled field shows a green **AUTO** badge so you can review and adjust before starting.

### 🖥️ Modern Google Pixel UI

- **Google Sans / Roboto** typography with a Google-brand color palette (blue / green / red / yellow).
- **Dark & light themes** with one-click toggle.
- **3-step flow**: Configure → Analyze → Report, with a sticky top nav and progress states.
- **Welcome hero** + "What to Expect" cards on the configure page.
- **Help & User Guide modal** — what the tool does, requirements, every input explained, what to expect, and usage tips (opened via the Help button or `Esc` to close).
- **Real-time progress streaming** (Server-Sent Events, 20s heartbeat) during the 22-level run.
- **Per-module accordions** with severity badges and expandable evidence/fixes.
- **Jump-to-section table of contents** on the report page.
- **14 expandable deliverable cards**, plus a 5-phase executive deep-dive and per-module full analysis.
- Export as **JSON**, **CSV** or **PDF** — fully responsive (desktop + mobile).

### 🚀 Production-Ready

- Rate limiting (200 req/15 min) + max 2 concurrent audits (`429` + `Retry-After`) + **LRU 500-key / 1h result cache** (`GET /api/cache-stats` with hits/misses/evictions/hitRate).
- Helmet CSP + HSTS + noSniff + strict referrer policy, CORS via `ALLOWED_ORIGINS`, 1MB JSON body cap, 5MB raw-HTML cap, 1MB PDF-HTML cap.
- SSRF guard on every user-supplied URL (private/loopback/link-local/CGNAT/TEST-NET/metadata + decimal/octal/hex IP tricks + credentialed URLs + DNS-rebind blocked) + zod input validation.
- Structured winston logging (JSON in prod), `x-request-id` tracing, graceful SIGTERM/SIGINT drain, SSE heartbeat.
- File-backed audit history (last 200 summaries, `GET /api/history` + `GET /api/diff`).
- Structured `GET /api/health` (version/levels/uptime/memory/cache/history), `GET /api`, `GET /openapi.yaml` (11 paths).
- CI: Node 22/24, typecheck, `npm audit`, vitest (**56 tests**), ESLint (strict for new code), prettier check.
- **Render.com** deployment ready (`render.yaml` + `healthCheckPath: /api/health` + UptimeRobot keep-alive) + `fly.toml` + `Dockerfile` + GHCR release workflow alternatives.

### 🤖 Machine Interfaces: CLI + MCP

- **CLI** (`bin/seo-audit.js`, published as `complete-on-page-seo` + `seo-audit` bins): `npx complete-on-page-seo https://example.com --json --fail-on critical` — exit 1 when critical (or warning) issues exist. Ideal for CI gates alongside Lighthouse.
- **MCP server** (`mcp-server.js`, zero extra deps, stdio JSON-RPC): 5 tools for Claude/Cursor/Copilot — `audit_url`, `get_level_info`, `check_ai_readiness`, `get_crux`, `crawl_site`. Run with `npm run mcp` and point your MCP client at it.

---

## Screenshots

Real captures from a live audit run against a public page (`https://en.wikipedia.org/wiki/SEO`). The tool fetches the page, renders it in headless Chrome, runs all 22 levels, and renders the reports below — no mockups, no demo data.

### Step 1 — Configure

![Configure page with auto-filled URL analysis](screenshots/01-configure.png)

Type any public URL and the tool auto-analyzes it (page type, brand, keywords, sitemap, competitors, viewport, currency) — each auto-filled field gets a green **AUTO** badge.

### Step 2 — Analyze

![Live audit progress stream](screenshots/02-analyzing.png)

![Module results grid — 22 scored levels](screenshots/03-module-results.png)

All 22 levels execute with a live progress stream (Server-Sent Events). When complete, every module shows a **0–100 score** with critical / warning / info counts. Click any module card to expand its data and fixes.

### Step 3 — Report

![Report overview with overall score ring](screenshots/04-report-top.png)

![Executive overview](screenshots/05-report-overview.png)

![14 executive deliverables](screenshots/06-deliverables.png)

![5-phase executive deep-dive](screenshots/07-deep-dive.png)

![Findings and issue log](screenshots/08-findings.png)

The report page renders the overall score, **14 concrete deliverables**, the **5-phase executive deep-dive**, and a searchable issue log — with JSON / CSV / one-click PDF download (server-rendered, no print dialog).

### Per-Module Analysis (all 22 levels)

Each module below is shown expanded with its **0–100 score**, its **findings** (critical / warning / info) and its **full measured data sections** — all from the same live Wikipedia audit. Collapsed by default to keep this page scannable.

<details><summary><strong>Level 1 — Core Hygiene & Technical Baseline</strong></summary>

![Level 1 — Core Hygiene & Technical Baseline](screenshots/modules/01-core-hygiene.png)

</details>

<details><summary><strong>Level 2 — DOM Reality, Rendering & Structural Diagnostics</strong></summary>

![Level 2 — DOM Reality, Rendering & Structural Diagnostics](screenshots/modules/02-dom-rendering.png)

</details>

<details><summary><strong>Level 3 — Semantic Architecture, Entities & Information Gain</strong></summary>

![Level 3 — Semantic Architecture, Entities & Information Gain](screenshots/modules/03-semantic-entities.png)

</details>

<details><summary><strong>Level 4 — Generative Search, LLM & RAG Visibility</strong></summary>

![Level 4 — Generative Search, LLM & RAG Visibility](screenshots/modules/04-llm-rag.png)

</details>

<details><summary><strong>Level 5 — Dev Automation & Auto-Fix Generation</strong></summary>

![Level 5 — Dev Automation & Auto-Fix Generation](screenshots/modules/05-dev-automation.png)

</details>

<details><summary><strong>Level 6 — Edge Computing & Serverless Integration</strong></summary>

![Level 6 — Edge Computing & Serverless Integration](screenshots/modules/06-edge-computing.png)

</details>

<details><summary><strong>Level 7 — Multi-Modal Content & Spatial Asset Auditing</strong></summary>

![Level 7 — Multi-Modal Content & Spatial Asset Auditing](screenshots/modules/07-multimodal.png)

</details>

<details><summary><strong>Level 8 — Predictive SERP Volatility & Algorithm Impact</strong></summary>

![Level 8 — Predictive SERP Volatility & Algorithm Impact](screenshots/modules/08-serp-volatility.png)

</details>

<details><summary><strong>Level 9 — SEO A/B Testing & Rollback Safety Guidance</strong></summary>

![Level 9 — SEO A/B Testing & Rollback Safety Guidance](screenshots/modules/09-ab-testing.png)

</details>

<details><summary><strong>Level 10 — Bot Behavior Mapping & Log Config Templates</strong></summary>

![Level 10 — Bot Behavior Mapping & Log Config Templates](screenshots/modules/10-bot-behavior.png)

</details>

<details><summary><strong>Level 11 — Synthetic Content & LLM Visibility Heuristics</strong></summary>

![Level 11 — Synthetic Content & LLM Visibility Heuristics](screenshots/modules/11-synthetic-content.png)

</details>

<details><summary><strong>Level 12 — Algorithmic Quality & Helpful-Content Classifier</strong></summary>

![Level 12 — Algorithmic Quality & Helpful-Content Classifier](screenshots/modules/12-quality-classifier.png)

</details>

<details><summary><strong>Level 13 — Edge-Native Patching & CI/CD Gatekeeping</strong></summary>

![Level 13 — Edge-Native Patching & CI/CD Gatekeeping](screenshots/modules/13-edge-patching.png)

</details>

<details><summary><strong>Level 14 — Financial Attribution – Single-Page ROI</strong></summary>

![Level 14 — Financial Attribution – Single-Page ROI](screenshots/modules/14-financial.png)

</details>

<details><summary><strong>Level 15 — Passage Vector & Cosine Similarity Profiler</strong></summary>

![Level 15 — Passage Vector & Cosine Similarity Profiler](screenshots/modules/15-passage-vector.png)

</details>

<details><summary><strong>Level 16 — Third-Party Consensus & Entity Alignment Scorer</strong></summary>

![Level 16 — Third-Party Consensus & Entity Alignment Scorer](screenshots/modules/16-entity-consensus.png)

</details>

<details><summary><strong>Level 17 — Autonomous Fix Generator & Red-Team Checks</strong></summary>

![Level 17 — Autonomous Fix Generator & Red-Team Checks](screenshots/modules/17-autofix-redteam.png)

</details>

<details><summary><strong>Level 18 — Zero-Click & Agentic Commerce Visibility</strong></summary>

![Level 18 — Zero-Click & Agentic Commerce Visibility](screenshots/modules/18-zero-click.png)

</details>

<details><summary><strong>Level 19 — Edge Orchestration & Self-Correction Rules</strong></summary>

![Level 19 — Edge Orchestration & Self-Correction Rules](screenshots/modules/19-edge-orchestration.png)

</details>

<details><summary><strong>Level 20 — Adversarial Checks & Security Header Audit</strong></summary>

![Level 20 — Adversarial Checks & Security Header Audit](screenshots/modules/20-adversarial.png)

</details>

<details><summary><strong>Level 21 — Site-Wide Risk Aggregation & Executive Rollup (Portfolio)</strong></summary>

![Level 21 — Site-Wide Risk Aggregation & Executive Rollup (Portfolio)](screenshots/modules/21-financial-impact.png)

</details>

---

## Real-World Audit — Gadgets360 in Light Mode (30 screenshots)

Fresh end-to-end run against a live news article (`https://www.gadgets360.com/mobiles/features/iphone-18-pro-max-alternatives-in-india-top-5-android-flagship-phones-12029387` — score 79/100), captured entirely in **light mode**: configure with AUTO badges → live SSE analysis → 22 scored modules → full executive report. Includes the one-click **Download PDF** button (server-rendered binary via `POST /api/export-pdf`, no print dialog).

### Flow (light mode)

![Configure with auto-fill (light)](screenshots/gadgets360/01-configure.png)

![Live analysis progress (light)](screenshots/gadgets360/02-analyzing.png)

![22 scored modules (light)](screenshots/gadgets360/03-module-results.png)

![Report score hero (light)](screenshots/gadgets360/04-report-top.png)

![Report overview stats (light)](screenshots/gadgets360/05-report-overview.png)

![14 deliverables (light)](screenshots/gadgets360/06-deliverables.png)

![Executive deep-dive (light)](screenshots/gadgets360/07-deep-dive.png)

![Findings issue log (light)](screenshots/gadgets360/08-findings.png)

### All 22 modules (light mode, expanded)

<details><summary><strong>Level 1 — Core Hygiene (Gadgets360, light)</strong></summary>

![L1 light](screenshots/gadgets360/modules/01-core-hygiene.png)

</details>

<details><summary><strong>Level 2 — DOM Rendering (Gadgets360, light)</strong></summary>

![L2 light](screenshots/gadgets360/modules/02-dom-rendering.png)

</details>

<details><summary><strong>Level 3 — Semantic Entities (Gadgets360, light)</strong></summary>

![L3 light](screenshots/gadgets360/modules/03-semantic-entities.png)

</details>

<details><summary><strong>Level 4 — LLM/RAG (Gadgets360, light)</strong></summary>

![L4 light](screenshots/gadgets360/modules/04-llm-rag.png)

</details>

<details><summary><strong>Level 5 — Dev Automation (Gadgets360, light)</strong></summary>

![L5 light](screenshots/gadgets360/modules/05-dev-automation.png)

</details>

<details><summary><strong>Level 6 — Edge Computing (Gadgets360, light)</strong></summary>

![L6 light](screenshots/gadgets360/modules/06-edge-computing.png)

</details>

<details><summary><strong>Level 7 — Multimodal (Gadgets360, light)</strong></summary>

![L7 light](screenshots/gadgets360/modules/07-multimodal.png)

</details>

<details><summary><strong>Level 8 — SERP Volatility (Gadgets360, light)</strong></summary>

![L8 light](screenshots/gadgets360/modules/08-serp-volatility.png)

</details>

<details><summary><strong>Level 9 — A/B Testing (Gadgets360, light)</strong></summary>

![L9 light](screenshots/gadgets360/modules/09-ab-testing.png)

</details>

<details><summary><strong>Level 10 — Bot Behavior (Gadgets360, light)</strong></summary>

![L10 light](screenshots/gadgets360/modules/10-bot-behavior.png)

</details>

<details><summary><strong>Level 11 — Synthetic Content (Gadgets360, light)</strong></summary>

![L11 light](screenshots/gadgets360/modules/11-synthetic-content.png)

</details>

<details><summary><strong>Level 12 — Quality Classifier (Gadgets360, light)</strong></summary>

![L12 light](screenshots/gadgets360/modules/12-quality-classifier.png)

</details>

<details><summary><strong>Level 13 — Edge Patching (Gadgets360, light)</strong></summary>

![L13 light](screenshots/gadgets360/modules/13-edge-patching.png)

</details>

<details><summary><strong>Level 14 — Financial ROI (Gadgets360, light)</strong></summary>

![L14 light](screenshots/gadgets360/modules/14-financial.png)

</details>

<details><summary><strong>Level 15 — Passage Vector (Gadgets360, light)</strong></summary>

![L15 light](screenshots/gadgets360/modules/15-passage-vector.png)

</details>

<details><summary><strong>Level 16 — Entity Consensus (Gadgets360, light)</strong></summary>

![L16 light](screenshots/gadgets360/modules/16-entity-consensus.png)

</details>

<details><summary><strong>Level 17 — Autofix Red-Team (Gadgets360, light)</strong></summary>

![L17 light](screenshots/gadgets360/modules/17-autofix-redteam.png)

</details>

<details><summary><strong>Level 18 — Zero-Click (Gadgets360, light)</strong></summary>

![L18 light](screenshots/gadgets360/modules/18-zero-click.png)

</details>

<details><summary><strong>Level 19 — Edge Orchestration (Gadgets360, light)</strong></summary>

![L19 light](screenshots/gadgets360/modules/19-edge-orchestration.png)

</details>

<details><summary><strong>Level 20 — Adversarial (Gadgets360, light)</strong></summary>

![L20 light](screenshots/gadgets360/modules/20-adversarial.png)

</details>

<details><summary><strong>Level 21 — Portfolio Rollup (Gadgets360, light)</strong></summary>

![L21 light](screenshots/gadgets360/modules/21-financial-impact.png)

</details>

<details><summary><strong>Level 22 — AI-Search Readiness (Gadgets360, light)</strong></summary>

![L22 light](screenshots/gadgets360/modules/22-ai-readiness.png)

</details>

## Architecture

```
┌──────────────┐     ┌───────────────────┐     ┌─────────────────┐
│  Client App  │────▶│  Express Server   │────▶│  Puppeteer      │
│  (HTML/CSS/  │     │  (REST API)       │     │  (Headless      │
│   JS)        │◀────│  Port 3000        │◀────│   Chrome)       │
└──────────────┘     └───────┬───────────┘     └─────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Fetch Raw HTML │
                    │  (Node Fetch)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Cheerio Parse  │
                    │  (jQuery-like)  │
                    └────────┬────────┘
                             │
                    ┌────────▼──────────────────────────────┐
                    │  22 Level Analysis Engine             │
                    │  ┌─────┐ ┌─────┐ ┌─────┐  ┌─────┐   │
                    │  │ L01 │ │ L02 │ │ L03 │  │ L22 │   │
                    │  └──┬──┘ └──┬──┘ └──┬──┘  └──┬──┘   │
                    │     └───────┴────────┴────────┘      │
                    │              │                        │
                    │     ┌────────▼────────┐               │
                    │     │  Helpers (70)  │               │
                    │     │  pure fns      │               │
                    │     └────────────────┘               │
                    └──────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  JSON Response  │
                    │  + Score +      │
                    │  Issues + Data  │
                    └────────────────┘
```

Full module map + invariants: [`ARCHITECTURE.md`](./ARCHITECTURE.md).

### Data Flow

1. **User submits URL** via the web UI, REST API, CLI, or MCP tool.
2. **Server validates** via SSRF guard (`assertPublicUrl` + DNS-rebind) + zod schemas, checks the LRU cache (500 keys / 1h TTL) and the concurrency guard (max 2, else `429` + `Retry-After: 30`).
3. **Server fetches raw HTML** using `fetch` with a browser-like UA (simulating what Googlebot sees without JavaScript; 5MB cap, 25s timeout).
4. **Server launches headless Chrome** via Puppeteer, navigates to the URL, waits for network idle, captures performance metrics, redirect chain and the fully rendered HTML.
5. **Cheerio parses the rendered HTML** into a jQuery-compatible DOM; `robots.txt` / `llms.txt` / sitemap probes run in parallel over SSRF-safe fetches (8s caps).
6. **Each of the 22 level functions** receives the parsed DOM, raw text, response headers, URL, and performance data. They run independently — if one crashes, it returns a score-0 error result without affecting others.
7. **Levels import 70 helper functions** from `helpers.js` for specialized analysis.
8. **Results are aggregated**: overall score (mean of 22), issue counts by severity, per-level structured data; the summary is recorded to file-backed history (`data/history.json`, last 200).
9. **JSON response is sent** to the client (plus per-level SSE progress frames), which renders the module grid, the 5-phase deep-dive, and the 14 deliverables.

---

## Installation

### Prerequisites

- Node.js **22.x** or higher (22/24 tested in CI; puppeteer 25 + vitest 5 require Node 22.12+)
- npm **9.x** or higher
- Git
- Chrome/Chromium (Puppeteer downloads its own by default)

### Step-by-Step

```bash
# 1. Clone the repository
git clone https://github.com/dipakjad1993/Complete-On-Page-SEO.git
cd Complete-On-Page-SEO

# 2. Install dependencies
npm install

# 3. Verify Puppeteer Chrome installation
npx puppeteer browsers install chrome

# 4. Start the server
npm start

# 5. Open in browser
# http://localhost:3000
```

> **Note**: Puppeteer downloads Chromium (~300 MB) on first install. To use an existing Chrome install instead, set `CHROME_PATH` (see below). Docker bakes system Chromium in so no download is needed.

### Environment Variables (Optional)

Copy [`.env.example`](./.env.example) to `.env`. Never commit `.env`.

| Variable            | Default                      | Description                                                              |
| ------------------- | ---------------------------- | ------------------------------------------------------------------------ |
| `PORT`              | `3000`                       | Server port                                                              |
| `CHROME_PATH`       | Puppeteer default            | Custom Chrome/Chromium executable (Docker sets `/usr/bin/chromium`)      |
| `ALLOWED_ORIGINS`   | `` (allow all — public demo) | Comma-separated browser CORS origins for production                      |
| `KEEP_ALIVE_URL`    | Render health URL            | UptimeRobot 5-min ping target (`/api/health`) to prevent free-tier sleep |
| `PAGESPEED_API_KEY` | `` (works without)           | Higher quota for `GET /api/crux`                                         |
| `LOG_LEVEL`         | `info` prod / `debug` dev    | Winston log level                                                        |
| `HISTORY_DIR`       | `./data`                     | Audit history store directory                                            |
| `HISTORY_MAX`       | `200`                        | Retained history summaries                                               |

---

## Quick Start

```bash
# Standard mode
npm start

# Production mode
npm run start:prod

# Development mode with auto-restart
npm run dev

# CLI audit (needs a running API)
npm run cli -- https://example.com --json

# MCP server for Claude/Cursor (stdio)
npm run mcp
```

1. Open `http://localhost:3000`.
2. Enter a URL (e.g., `https://example.com`) — the tool auto-fills most settings for you.
3. Click **"Start 22-Level Deep Audit"**.
4. Watch the live progress stream across all 22 modules (~60–120 s).
5. Browse per-module results, then open the **Report** for the executive summary and 14 deliverables.

---

## Using the Tool — 3-Step Flow

### Step 1: Configure

- **Target URL** (required) — the only mandatory field.
- **Optional crawler settings** — user-agent (Chrome / Googlebot / GPTBot / PerplexityBot / Applebot / custom), page type, viewport, geo-location.
- **Optional content fields** — target keywords, competitor URLs (or auto-discovery), brand name, sitemap URL.
- **Business Intelligence** (optional, powers the financial report) — monthly organic traffic, average order value, conversion rate, currency.
- Click **Help** in the top bar for the full user guide at any time.

### Step 2: Analyze

Watch all 22 modules execute with a live progress bar and per-level status text (Server-Sent Events with heartbeat). When complete, every module shows a **0–100 score** with critical / warning / info counts. Click any module card to expand its complete data and fixes.

### Step 3: Report

- Overall score ring + issue counts.
- **14 Executive Deliverables** (expandable, ready-to-use artifacts).
- **5-Phase Executive Deep-Dive** — every module fully rendered and open, grouped by business phase.
- **All Findings & Executive Issue Log** with live keyword search.
- **Detailed Module Analysis** — all 22 modules with nested sections.
- Export as **JSON**, **CSV**, or one-click **Download PDF** (server-rendered binary, no print dialog).

---

## The 22 Analysis Levels

### Level 1: Core Hygiene & Technical Baseline

Title length/truncation/pixel width (via `pxWidth`), meta description presence/length, viewport, robots meta + X-Robots-Tag header, canonical integrity (absolute, self-referencing, single), heading hierarchy (H1 count, skipped levels), image alt text & formats, HTTP security headers presence, internal link quality, link density. The foundation — failures here cap everything above.

### Level 2: DOM Reality, Rendering & Structural Diagnostics

SSR vs CSR diff (raw HTML vs rendered DOM via `ssrVsCsrDiff`), DOM node count / max depth / child distribution (`analyzeDomDepth` with bucket histograms), schema.org validation (valid/invalid, missing required props, circular refs, warnings via `validateSchemaComprehensive`). Catches JS-dependent content that Googlebot's first wave misses.

### Level 3: Semantic Architecture, Entities & Information Gain

Word count, Flesch-Kincaid readability, keyword density, bigrams, transition words, content structure, information-gain delta (KL-divergence vs a supplied baseline corpus — `N/A` without one, never computed against empty), entity extraction (`extractEntities` + knowledge-graph entities). Answers "does this page say anything new?".

### Level 4: Generative Search, LLM & RAG Visibility

RAG chunk simulation (`ragChunkSimulator`) with per-chunk retrievability scores, passage vectors, direct answer scoring (`directAnswerScorer`), LLM citation worthiness (`simulateLLMCitation` — labeled heuristic, no LLM run), redundant phrasing, section entropy. Answers "can an AI answer engine retrieve and cite this page?".

### Level 5: Dev Automation & Auto-Fix Generation

Auto-generated patches (schema JSON-LD via `generateSchemaCode`, heading hierarchy, canonical fixes) with unified diffs, regression test code, diagnostic workflow, rollback plans. Copy-paste ready for the sprint.

### Level 6: Edge Computing & Serverless Integration

Edge worker code generation (`generateEdgeWorkerCode` for Cloudflare/Vercel/Edgio), security headers audit, cache policy (`Cache-Control`, ETag), CORS, cookie attributes (`Secure`/`HttpOnly`/`SameSite`), mixed-content detection. Ships deployable code, not advice.

### Level 7: Multi-Modal Content & Spatial Asset Auditing

Image analysis (alt text, dimensions, lazy loading, srcset, modern formats AVIF/WebP), video captions/posters, audio transcripts, SVG accessibility (`validateSemanticCaptions`). Covers the multimodal ranking surface most checkers ignore.

### Level 8: Predictive SERP Volatility & Algorithm Impact

SERP volatility from real page structure (`analyzeSerpVolatility`), quality thresholds (`calculateQualityThresholds`), SERP feature readiness (AI Overview, featured snippet, PAA, local pack, shopping, knowledge panel), thin content flags, E-E-A-T signals, algorithm resilience scoring.

### Level 9: SEO A/B Testing & Rollback Safety Guidance

Baseline extraction, testability assessment, title/meta variant suggestions, rollback safety checklist, statistical significance guidance, sample size estimation. CTR uplift percentages are **not** claimed — no A/B test is run, so variants are labeled "not measured (no A/B test run)".

### Level 10: Bot Behavior Mapping & Log Config Templates

Status code & redirect chain (per-hop latency reported as "not measured"), crawl budget estimation, bot behavior / freshness signals (`Last-Modified`, ETag, sitemap `lastmod`), and **example** log config templates (Cloudflare, CloudWatch, Datadog via `analyzeBotManagement`) — the tool does not connect to your logging infrastructure.

### Level 11: Synthetic Content & LLM Visibility Heuristics

Synthetic agent behavior (`analyzeSyntheticAgentBehavior`), RAG chunk simulation, agentic readiness (CTA parsability, form accessibility, JS dependency), direct-answer & LLM-citation **structural heuristics** (labeled as such — no real LLM inference is performed).

### Level 12: Algorithmic Quality & Helpful-Content Classifier

Content freshness signals, E-E-A-T validation (`validateEEATSignals`), quality thresholds, quality flags (`detectContentQualityFlags`), helpful-content alignment (`calculateUnhelpfulContentRatio`). Maps page traits to Helpful Content System risk.

### Level 13: Edge-Native Patching & CI/CD Gatekeeping

Pre-commit hooks, GitHub Actions workflow, GitLab CI config, Cloudflare Worker / Vercel Edge code, self-healing rules. Blocks bad merges before they ship — the enforcement twin of L5's patches.

### Level 14: Financial Attribution – Single-Page ROI

Revenue-at-risk per issue (`calculateRevenueAtRisk`: probability × exposure × loss), ROI analysis, quarterly projections, priority action plan, traffic estimates, competitive loss, cost-benefit summary, issue registry (`prioritizeByImpact`) — scoped to **this page**, gated on your GA4 inputs. Without `monthlyTraffic` + `avgOrderValue` + `conversionRate`, every dollar figure is `0` with a clear explanation.

### Level 15: Passage Vector & Cosine Similarity Profiler

Passage-level retrieval scoring (`passageVectorSim`), entity flow tracking, heading drift measurement, content clustering, document distance. Shows which passages rank for which queries and where topical drift dilutes them.

### Level 16: Third-Party Consensus & Entity Alignment Scorer

Entity consensus (`crossReferenceEntityConsensus`), citation quality, knowledge panel readiness, factual claims extraction, trust-level scoring. Measures whether the page's entities agree with the broader web — the E-E-A-T cross-check.

### Level 17: Autonomous Fix Generator & Red-Team Checks

Schema/heading/canonical auto-fixes (`generateAutonomousFix`) with validation tests, diagnostic workflow, fix validation, red-team header/HTML checks (`redTeamTest`: open redirects, parameter pollution, UA cloaking — honestly reported as skipped where not measurable).

### Level 18: Zero-Click & Agentic Commerce Visibility

AI Overview readiness, featured snippet optimization, zero-click CTR estimation, agentic commerce audit (`agenticCommerceAudit`: product schema, price/availability parsability, buy-flow), brand mention share (`synthesizeMentionShare`), entity prominence.

### Level 19: Edge Orchestration & Self-Correction Rules

Edge worker deployment (`selfHealingEdgeScript`), canary (progressive rollout) plans, rollback triggers, error budget monitoring, self-correction rules with honest deploy-time estimates. The safe-rollout twin of L13's gates.

### Level 20: Adversarial Checks & Security Header Audit

Security header analysis (CSP, HSTS, X-Frame-Options, etc.), information disclosure (server version leaks, stack traces), cloaking detection, and robustness checks (rate limiting / UA cloaking / open redirect / parameter pollution are honestly reported as skipped where not measurable).

### Level 21: Site-Wide Risk Aggregation & Executive Rollup (Portfolio)

Cross-signal rollup (`calculateSiteWideRisk`: title/canonical/headings/schema/links/quality) into an executive risk summary — scoped as a **portfolio view**. Revenue-at-risk per issue, ROI analysis, quarterly projections, priority action plan — all gated on real user-supplied traffic data.

### Level 22: AI-Search Readiness — llms.txt, Robots-AI & Citation Surface (NEW in 1.3.0)

Live `GET /llms.txt` presence + quality probe (byte size, markdown headings, absolute links, navigational aids), `robots.txt` AI-bot rule parsing (GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, CCBot, Bytespider, Google-Extended, Applebot, Amazonbot… — allowed vs blocked vs unmentioned), canonical/title/description/JSON-LD citation surface, definitional-lead-sentence check ("X is …" opener AI extractors prefer). Every check reports found/missing + evidence with a live-fetch `dataSource`. Heuristic surface audit only — no real LLM queried.

Full per-level data dictionary: [`docs/levels.md`](./docs/levels.md).

---

## The 14 Executive Deliverables

| #   | Deliverable                              | Output Type                             | Data Source                |
| --- | ---------------------------------------- | --------------------------------------- | -------------------------- |
| 1   | SSR vs. CSR Diff Report                  | Visual split-view + JSON diff           | Level 2 `ssrVsCsr`         |
| 2   | DOM Tree Health Score                    | Metrics + bucket histograms             | Level 2 `domDepth`         |
| 3   | Schema Validation Audit                  | Schema.org compliance report            | Level 2 `schemaValidation` |
| 4   | RAG Chunking Simulator                   | Sliding-window retrievability           | Level 4 `ragChunks`        |
| 5   | Information Gain Delta                   | KL-divergence profile                   | Level 3 `informationGain`  |
| 6   | Entity Mapping Grid                      | KG + NLP entity chips                   | Levels 3 & 16              |
| 7   | Automated Engineering PRs                | Branch + files + tests                  | Level 17 `pullRequests`    |
| 8   | Self-Healing Edge Workers                | Deploy-ready code                       | Levels 6, 13, 19           |
| 9   | CI/CD Build Gatekeeper Logs              | Workflow + hook + pipeline              | Level 13                   |
| 10  | Bot Behavior Maps & Log Config Templates | Freshness signals + example log configs | Level 10                   |
| 11  | Algorithmic Quality Threshold Alerts     | Flag + threshold watch                  | Levels 8, 12, 20           |
| 12  | Multi-Modal Asset Diagnostics            | Image/video/audio compliance            | Level 7                    |
| 13  | Revenue-at-Risk Dashboard                | Monetized financial model               | Level 14                   |
| 14  | Effort-to-Impact Prioritization Matrix   | Ranked remediation queue                | Levels 14 & 21             |

---

## Inputs & Configuration

### Audit Config (client → `POST /api/audit`)

| Field                   | Type   | Default          | Purpose                                                                         |
| ----------------------- | ------ | ---------------- | ------------------------------------------------------------------------------- |
| `url`                   | string | —                | Target URL to audit (required)                                                  |
| `config.userAgent`      | string | `chrome-desktop` | Crawl as Chrome / Googlebot / GPTBot / PerplexityBot / Applebot                 |
| `config.customUA`       | string | —                | Custom user-agent string                                                        |
| `config.viewportWidth`  | number | `1920`           | Rendering viewport width (320–3840)                                             |
| `config.viewportHeight` | number | `1080`           | Rendering viewport height (320–2160)                                            |
| `config.geo`            | string | —                | Geo-location (e.g., `US`, `GB`, `DE`, `IN`)                                     |
| `config.keywords`       | string | —                | Comma-separated target keywords                                                 |
| `config.competitors`    | array  | —                | Competitor URLs (or auto-discovered)                                            |
| `config.sitemap`        | string | —                | XML sitemap URL                                                                 |
| `config.brand`          | string | —                | Brand / entity name                                                             |
| `config.pageType`       | string | `auto`           | Homepage / product / category / article / landing / local / FAQ / documentation |
| `config.monthlyTraffic` | number | `0`              | GA4 organic sessions/month (powers revenue-at-risk)                             |
| `config.avgOrderValue`  | number | `0`              | GA4 average order value                                                         |
| `config.conversionRate` | number | `0`              | Conversion rate %                                                               |
| `config.currency`       | string | `USD`            | Reporting currency                                                              |

---

## API Reference

### `POST /api/audit`

Runs a full 22-level audit on a URL.

**Request Body:**

```json
{
  "url": "https://example.com",
  "config": {
    "userAgent": "chrome-desktop",
    "keywords": "seo audit tool, technical seo",
    "monthlyTraffic": 50000,
    "avgOrderValue": 75,
    "conversionRate": 2.5,
    "currency": "USD"
  }
}
```

**Response:** Audit result with `url`, `overallScore`, `levels[]` (each with `level`, `name`, `score`, `issues[]`, `data{}`), `meta` (timestamp, auditId, sizes, word count), `summary` (critical/warnings/info/topFixes), `duration`, and `cached?`.
**Errors:** `400` invalid/blocked (SSRF guard), `429` engine busy (`Retry-After: 30`).

### `GET /api/audit-progress/:auditId`

Server-Sent Events (SSE) stream of live progress during an audit (20s heartbeat comments keep proxies from timing out).

**Response:** `data: { "auditId", "level", "status", "detail" }` per level.

### `POST /api/analyze-url`

Analyzes a URL to auto-fill config fields (page type, brand, keywords, sitemap, geo, currency, user-agent, verified competitors) before an audit.

**Request Body:** `{ "url": "https://example.com" }`

**Response:** `{ "brand": "...", "pageType": "...", "keywords": "...", "competitors": "...", "viewportWidth": 1920, "geo": "US", "currency": "USD", "userAgent": "...", "blocked": false, "meta": {...} }`

### `POST /api/export-pdf`

Generates a PDF from audit result HTML.

**Request Body:** `{ "html": "<html>...</html>" }` (1MB cap)

**Response:** Binary PDF file (`application/pdf`, A4, backgrounds, 20/15mm margins).

### `GET /api/health`

Health check endpoint (also the Render `healthCheckPath` + UptimeRobot keep-alive target).

**Response:** `{ "status": "ok", "version": "1.3.0", "levels": 22, "uptime": 123, "node": "v20.x", "memory": {...}, "activeAudits": 0, "maxConcurrent": 2, "cache": {...}, "historyEntries": 3, "timestamp": "..." }`

### `GET /api/crux?url=https://example.com`

Real CrUX/PageSpeed field data (LCP/INP/CLS/TTFB/FCP/speedIndex + `fieldData` + `performanceScore` + `lighthouseVersion`). Higher quota via `PAGESPEED_API_KEY`; structured `unmeasured` payload (HTTP 429 on quota) instead of invented numbers.

### `POST /api/crawl`

Same-origin BFS crawl, max 25 pages, with sitemap-index expansion (`includeSitemap`, default true). Raw HTML per page (no per-page Puppeteer). Run `POST /api/audit` per URL for full 22-level depth.

**Request Body:** `{ "startUrl": "https://example.com", "maxPages": 25, "includeSitemap": true }`

**Response:** `{ "startUrl", "origin", "pagesCrawled", "pages": [{url, status, title, words}], "note" }`

### `GET /api/history?url=&limit=` · `GET /api/diff?url=&from=&to=`

File-backed last-200 audit summaries and score diffing (`overallDelta`, `verdict: improved|regressed|stable`, per-level `from/to/delta`). `from`/`to` are history timestamps from `/api/history`.

### `GET /api/cache-stats` · `GET /api` · `GET /openapi.yaml`

LRU cache/concurrency stats (`size/max/ttlMs/hits/misses/evictions/hitRate`), API index (11 endpoints), and the full OpenAPI 3.0 spec (see [`openapi.yaml`](./openapi.yaml), also [`docs/api.md`](./docs/api.md)).

### CLI

```bash
npx complete-on-page-seo https://example.com --json --fail-on critical
# --api <base> --config '{"monthlyTraffic":50000}' --fail-on warning
```

Exits 1 when matching issues exist — plug straight into CI alongside Lighthouse.

### MCP server (Claude / Cursor / Copilot)

```bash
npm run mcp
# stdio JSON-RPC: tools/list → audit_url, get_level_info, check_ai_readiness, get_crux, crawl_site
```

Point your MCP client at `node mcp-server.js` (env `SEO_API` selects the API base, default `http://localhost:3000`).

## Comparison — Honest Positioning

| Signal          | This repo (v1.3.0)                                                                                      | open-seo (16k★) / Seonaut / FreeCrawl     |
| --------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| License         | MIT                                                                                                     | MIT                                       |
| Live demo       | Render (sleeps; UptimeRobot keep-alive documented) + Docker/Fly no-sleep paths                          | Always-on hosted                          |
| Crawl scope     | Single URL deep audit + 25-page BFS crawl (sitemap-seeded) + history/diff                               | Full site crawl, backlinks, rank tracking |
| AI-search       | RAG chunk sim, passage vectors, LLM-citation heuristics (honestly labeled) + **L22 llms.txt/robots-ai** | AI visibility dashboards / Claude skill   |
| Revenue         | Revenue-at-risk from YOUR GA4 inputs (`0` + note without them)                                          | Mostly absent                             |
| Machine use     | JSON/CSV/PDF + CLI `--fail-on` + MCP 5-tool server                                                      | XLSX/Sheets/API                           |
| CI/tests/Docker | CI green (Node 22/24), 56 vitest tests, Dockerfile/GHCR, OpenAPI                                        | CI + releases + installers                |
| Data honesty    | `null`/`N/A` + `dataSource` notes instead of invented numbers                                           | Varies                                    |

Use this tool when you want one URL's deepest honest audit (technical + AI-search + dollars + machine-readable outputs); use a site crawler when you need 1M-URL breadth.

---

## Project Structure

```
Complete-On-Page-SEO/
├── README.md                       # This file
├── LICENSE                         # MIT
├── CHANGELOG.md                    # Release notes (Keep a Changelog)
├── CONTRIBUTING.md / SECURITY.md   # PR + security policy
├── ARCHITECTURE.md / ROADMAP.md    # Module map + scoped roadmap
├── CODEOWNERS                      # Solo maintainer
├── openapi.yaml                    # OpenAPI 3.0 spec (served at /openapi.yaml, 11 paths)
├── Dockerfile / .dockerignore      # Self-host (system Chromium, healthcheck)
├── fly.toml                        # Fly.io alternative (no sleep)
├── render.yaml                     # Render.com deployment (health check + keep-alive)
├── .env.example / .nvmrc           # Env template / Node 20 pin
├── .github/workflows/ci.yml        # CI: Node 22/24, typecheck, audit, tests, lint, prettier
├── .github/workflows/release.yml   # Release: npm + GHCR on v* tags
├── .github/dependabot.yml          # Weekly npm + monthly actions
├── tests/                          # vitest: helpers (15) + levels (11) + unit (9) + api (9) + api-extended (12) = 56
├── docs/                           # levels / api / deploy / faq / BUDGET
├── src/
│   ├── logger.js                   # Winston structured logger
│   ├── cache.js                    # LRU 500-key / 1h TTL + hitRate stats
│   ├── history.js                  # File-backed last-200 history + diff
│   ├── middleware/ssrf.js          # SSRF guard (single source of truth)
│   ├── middleware/errors.js        # requestId / 404 / error handler
│   ├── lib/netfetch.js             # SSRF-safe text fetcher (robots/llms/sitemap)
│   ├── lib/sitemap.js              # robots AI-bot + sitemap XML parsing
│   ├── lib/crux.js                 # PageSpeed/CrUX fetch + honest fallback
│   └── levels/index.js + level22.js# Level registry + L22 AI-search readiness
├── bin/seo-audit.js                # CLI (npx complete-on-page-seo --fail-on)
├── mcp-server.js                   # MCP stdio server (5 tools)
├── package.json                    # Dependencies & scripts (v1.3.0)
├── package-lock.json
├── server.js                       # Express composition root, Puppeteer orchestration, API routes
├── helpers.js                      # 70 analysis helper functions
├── levels.js                       # Legacy L1–L21 monolith (frozen; new levels go in src/levels/)
├── data/history.json               # (gitignored) audit history store
└── public/
    └── index.html                  # Single-page Pixel UI (vanilla JS + CSS, dark/light, SSE, PDF/CSV/JSON)
```

---

## Deployment

### Render.com

A `render.yaml` blueprint is included (`healthCheckPath: /api/health`):

- **root directory**: repo root (leave Root Directory empty if creating via the Render dashboard)
- **build**: `npm run render-build` (= `npm install && npx puppeteer browsers install chrome`)
- **start**: `npm start`
- Chrome path is resolved dynamically at runtime (`CHROME_PATH` or Puppeteer default).
- **Stop the sleep→503:** create a free [UptimeRobot](https://uptimerobot.com/) monitor (HTTP(s), 5-min interval) on `https://<your-app>.onrender.com/api/health`. The `KEEP_ALIVE_URL` env var in `render.yaml` documents the target.

### Docker (self-host, no sleep — recommended)

```bash
docker build -t complete-on-page-seo .
docker run -p 3000:3000 complete-on-page-seo
# health: http://localhost:3000/api/health
# GHCR releases (on every v* tag): ghcr.io/dipakjad1993/complete-on-page-seo:latest
```

System Chromium is baked in (`CHROME_PATH=/usr/bin/chromium`, `PUPPETEER_SKIP_DOWNLOAD=true`) with a container `HEALTHCHECK` on `/api/health`.

### Fly.io alternative (persistent, no sleep)

```bash
fly launch && fly deploy   # uses fly.toml + Dockerfile; /api/health checks included
```

### Manual / VPS

```bash
npm install
npx puppeteer browsers install chrome
npm start
# or: npm run start:prod  (NODE_ENV=production)
```

### Env reference

Full table with `LOG_LEVEL` / `HISTORY_DIR` / `HISTORY_MAX`: [`docs/deploy.md`](./docs/deploy.md).

---

## Troubleshooting

### Puppeteer/Chrome issues

**Chrome not found:**

```bash
npx puppeteer browsers install chrome
```

Or set `CHROME_PATH` to a system Chromium (Docker does this automatically).

**Chrome crashes on low-memory systems:**

The launcher already passes `--disable-dev-shm-usage` and `--no-sandbox` (required on Render's rootless containers). For self-hosting as root, prefer a dedicated non-root chrome user with the default sandbox rather than `--no-sandbox`.

### Server won't start

**Port 3000 in use:**

```bash
# Set a different port
$env:PORT=3001; npm start
```

**Missing dependencies:**

```bash
rm -rf node_modules && npm install
```

### Analysis errors

- The server logs which level(s) failed with structured winston entries (`LOG_LEVEL=debug` for full detail).
- A failed level returns a score of 0 with a single critical issue describing the error — the audit continues.
- `429` means the engine is busy (max 2 concurrent audits) — retry after `Retry-After: 30`.
- `POST /api/crawl` caps at 25 pages; `POST /api/export-pdf` caps HTML at 1MB; raw HTML caps at 5MB.

---

## FAQ

**Q: Does this tool crawl my entire site?**
A: No — one URL per audit, at maximum depth. `POST /api/crawl` does a 25-page same-origin BFS (sitemap-seeded) for breadth; run one audit per URL for full 22-level depth. `GET /api/history` + `GET /api/diff` track scores over time. Level 21 rolls signals into a portfolio-style executive view.

**Q: Does it work on SPAs (React, Angular, Vue)?**
A: Yes. Puppeteer renders JavaScript before analysis. Level 2 specifically compares SSR vs CSR to detect JS-dependent content.

**Q: Are the scores comparable across different pages?**
A: Yes. Each level uses a consistent 0–100 scoring methodology. The overall score is the mean of all 22 levels.

**Q: Can I run this on localhost/staging URLs?**
A: The public demo blocks private targets (SSRF guard: `localhost`, `10/8`, `192.168/16`, `172.16/12`, `127/8`, `169.254.169.254`, CGNAT/TEST-NET, IPv6 loopback/link-local, metadata endpoints, decimal/octal IP tricks, credentialed URLs, DNS-rebinds → `400`). Self-host (Docker/VPS) and audit staging from inside your network instead.

**Q: Does it store audit results?**
A: Last-200 score summaries in `data/history.json` (queryable via `GET /api/history`, diffable via `GET /api/diff`). Full level payloads live in the LRU cache (1h TTL), not on disk. No page HTML is persisted.

**Q: How long does an audit take?**
A: Typically 60–120 seconds depending on page complexity, JS execution time, and network latency (budget: [`docs/BUDGET.md`](./docs/BUDGET.md)). Auto-fill (`POST /api/analyze-url`) is <15s.

**Q: Why are some deliverables showing "No Data Found"?**
A: Some outputs (e.g., schema validation, images, revenue) depend on page content and on your Business Intelligence inputs. Thin pages or missing GA4 numbers gracefully skip those cards and point you to the relevant module.

**Q: How do I get the Revenue-at-Risk dashboard?**
A: Enter your monthly organic traffic, average order value and conversion rate on the Configure page (Business Intelligence section) before starting the audit. Without them every dollar figure is `$0` with an explicit note — by design.

**Q: Does it query a real LLM?**
A: No — citation/direct-answer scores are structural heuristics, explicitly labeled. Level 22 measures the crawlable AI surface (llms.txt + robots-ai + citation metadata) that real LLMs consume, without pretending to run one.

**Q: How do I gate CI on SEO?**
A: `npx complete-on-page-seo https://staging.example.com --fail-on critical` (or `warning`) exits non-zero when matching issues exist. Combine with Lighthouse for lab scores.

---

## Roadmap

Shipped (1.0 → 1.3.0) and scoped next steps with honest non-goals: [`ROADMAP.md`](./ROADMAP.md).

- [x] **Auto-fill from URL analysis**
- [x] **Competitor auto-discovery** (live search + verification)
- [x] **14 concrete executive deliverables**
- [x] **5-phase executive deep-dive**
- [x] **Google Pixel UI with help guide**
- [x] **Real data, no fabrication** (null/N/A + dataSource notes)
- [x] **SSRF guard + zod validation + CI + tests + Docker + OpenAPI**
- [x] **CrUX field data (`GET /api/crux`) + 25-page BFS crawl (`POST /api/crawl`)**
- [x] **Level 22 AI-search readiness (llms.txt / robots-ai / citation surface)**
- [x] **History + diff, CLI `--fail-on`, MCP 5-tool server, LRU cache, winston logging**
- [ ] **Lighthouse option** (`?lighthouse=true` lab scores alongside CrUX field)
- [ ] **History trend chart** (ECharts sparkline on the report page from `GET /api/history`)
- [ ] **Scheduled audits** (cron + email digest)
- [ ] **SDK clients** (JS/Python generated from `openapi.yaml`)
- [ ] **Coverage 80% + Codecov badge** (56 tests today; mocked-Puppeteer e2e next)

---

## Author — Hire Me

**Dipak Jadhav** — Full-Stack Node.js Engineer building AI-ready SEO tooling (Puppeteer, Cheerio, RAG, Edge Workers, MCP).

- GitHub: [dipakjad1993](https://github.com/dipakjad1993) · Live demo: [complete-on-page-seo.onrender.com](https://complete-on-page-seo.onrender.com/)
- 22-level audit engine · ~10.2k LOC · 70 helpers · 56 tests (CI Node 22/24) · Docker/GHCR/Render/Fly · OpenAPI · SSE · CLI + MCP · SSRF/zod/Helmet hardened
- **Open to:** Full-stack / Backend (Node.js) / Technical SEO / AI-search engineering roles.

Suggested repo topics: `javascript, nodejs, expressjs, puppeteer, cheerio, seo, technical-seo, on-page-seo, ai-seo, rag, llm, aeo, geo, llms-txt, mcp, core-web-vitals, crux, edge-computing, seo-tools, site-audit`.

---

## Contributing

Contributions are welcome! See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the quick start, PR rules, and `good first issue` pointers. Security reports: see [`SECURITY.md`](./SECURITY.md) (SSRF boundaries documented there).

Here's how:

1. **Fork** the repository.
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**.

### Guidelines

- Maintain the **22-level architecture** — new analysis should be a new level under `src/levels/` or integrated into an existing one (do not extend the frozen legacy `levels.js` monolith).
- **No synthetic/fabricated data** — all metrics must derive from real page content or HTTP responses, or return `null`/`N/A` with a `dataSource` note.
- Each level must have **named sub-functions** in its `data` object.
- Each level must include a **scoring penalty system** (`p` variable, `sc(p)` normalization).
- **Handle errors gracefully** — use try/catch, return a structured error result, never crash the audit.
- Add new helper functions to `helpers.js` and import them in levels.
- Security: every new fetch of a user-supplied URL must go through `assertPublicUrl()` from `src/middleware/ssrf.js`.
- Add/extend a test in `tests/` for every change (`levels.test.js` / `unit.test.js` / `api-extended.test.js`).
- Run `npm test && npm run lint && npx prettier --check .` before pushing (see CONTRIBUTING.md).

---

## License

This project is licensed under the **MIT License** — see [`LICENSE`](./LICENSE).

```
MIT License — Copyright (c) 2026 Dipak Jadhav
```

---

<div align="center">
  <strong>Complete ON Page SEO 2026</strong> — 22-Level On-Page SEO Audit & Fix Generator
  <br>
  Real measured data · RAG + AI-search visibility · Revenue-at-risk · Edge deliverables · CLI + MCP
  <br>
  Built with ❤️ for the SEO community
</div>
