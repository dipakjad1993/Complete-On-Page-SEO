# Complete ON Page SEO 2026

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![License](https://img.shields.io/badge/license-ISC-blue)
![Puppeteer](https://img.shields.io/badge/puppeteer-25.x-yellow)

A production-grade, **AI-era on-page SEO auditing engine** that runs a **21-level deep audit** on any public URL in ~60–120 seconds, then hands you **14 concrete, ready-to-use deliverables** — from technical health scoring to auto-generated GitHub pull requests, edge-worker patches, CI/CD gatekeeper configs and a dollar-valued revenue-at-risk dashboard.

Built with **Node.js + Express + Cheerio + Puppeteer**, featuring a Google Pixel–style UI (Google Sans / Roboto), dark & light themes, real-time progress streaming, and zero plugins required.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
  - [21 Specialized Analysis Levels](#-21-specialized-analysis-levels)
  - [14 Concrete Executive Deliverables](#-14-concrete-executive-deliverables)
  - [Real Data, No Fabrication](#-real-data-no-fabrication)
  - [Smart Auto-Configuration](#-smart-auto-configuration)
  - [Modern Google Pixel UI](#-modern-google-pixel-ui)
  - [Production-Ready](#-production-ready)
- [Architecture](#architecture)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Using the Tool — 3-Step Flow](#using-the-tool--3-step-flow)
- [The 21 Analysis Levels](#the-21-analysis-levels)
- [The 14 Executive Deliverables](#the-14-executive-deliverables)
- [Inputs & Configuration](#inputs--configuration)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Complete ON Page SEO 2026 is a **server-based** on-page SEO analysis tool that performs a deep, multi-dimensional audit of any public URL. Unlike superficial SEO checkers that return a handful of generic checks, this engine runs **21 independent analysis modules** ("levels"), each probing a specific facet of on-page optimization, technical SEO health, content quality, AI / LLM & RAG visibility, SERP readiness, automation and financial impact.

Each level produces:

- A **quantitative score** (0–100) reflecting that dimension's health.
- A **list of issues** with severity (critical / warning / info), impact, concrete fix instructions and recommendations.
- A **structured data object** broken into named sub-functions, each containing granular metrics derived entirely from real page data — no synthetic or fabricated values.

The system uses **Puppeteer** to render JavaScript-heavy pages (SPAs, React, Angular, Vue) so the analysis reflects what Googlebot *and* AI crawlers see after JS execution. It also compares server-side (raw) HTML against rendered HTML to detect SSR/CSR discrepancies.

---

## Key Features

### 🔬 21 Specialized Analysis Levels

| # | Level Name | Focus Area |
|---|-----------|-----------|
| 1 | Core Hygiene & Technical Baseline | Title, meta, viewport, robots, canonical, headings, links |
| 2 | DOM Reality, Rendering & Structural Diagnostics | SSR vs CSR diff, DOM depth, schema validation |
| 3 | Semantic Architecture, Entities & Information Gain | Word count, readability, keyword density, AI detection |
| 4 | Generative Search, LLM & RAG Visibility | RAG chunking, passage vectors, direct answer scoring |
| 5 | Dev Automation & Auto-Fix Generation | Auto-generated patches, edge worker scripts, CI/CD hooks |
| 6 | Edge Computing & Serverless Integration | Edge worker configs, security headers, CORS, caching |
| 7 | Multi-Modal Content & Spatial Asset Auditing | Image alt text, video captions, SVG accessibility |
| 8 | Predictive SERP Volatility & Algorithm Impact | SERP volatility scoring, ranking stability prediction |
| 9 | Continuous SEO A/B Testing & Rollback Safety | Test variants, statistical significance, rollback safety |
| 10 | Log-Stream Intelligence & Bot Behavior Mapping | Bot detection, crawl patterns, security headers |
| 11 | Multi-Model Synthetic User & LLM Behavior Simulation | LLM citation scoring, passage retrievability |
| 12 | Reverse-Engineered Core Algorithm & Quality Classifier | Content freshness, E-E-A-T signals, quality thresholds |
| 13 | Edge-Native Patching & CI/CD Gatekeeping | Pre-commit hooks, CI/CD rules, edge deployment |
| 14 | Financial Attribution & Revenue Impact Engine | Revenue-at-risk per issue, ROI matrix, business impact |
| 15 | Passage Vector & Cosine Similarity Profiler | Passage-level retrieval scoring, topic cluster detection |
| 16 | Third-Party Consensus & Entity Alignment Scorer | Entity cross-referencing, brand mention analysis |
| 17 | Multi-Agent Autonomous Sandbox & Fix Validator | Autonomous fix generation, red-team testing |
| 18 | Zero-Click & Agentic Commerce Visibility | Featured snippet readiness, product schema, commerce signals |
| 19 | Edge Orchestration & Canary Deployment Safety | Edge worker deployment, canary testing, self-healing scripts |
| 20 | Adversarial Red Team & Prompt Injection Audit | Security testing, information disclosure, cloaking detection |
| 21 | Site-Wide Risk Aggregation & Executive Dashboard | Cross-level risk scoring, executive summary, revenue impact |

### 📦 14 Concrete Executive Deliverables

The **Report page** (step 3) generates 14 ready-to-consume engineering artifacts straight from the audit's measured data:

1. **SSR vs. CSR Diff Report** — Visual split-view + machine-readable JSON diff of raw vs rendered HTML.
2. **DOM Tree Health Score** — Node count, max/avg depth, bucket histograms, reference thresholds.
3. **Schema Validation Audit** — Valid/invalid breakdown, missing required props, circular refs.
4. **RAG Chunking Simulator** — Sliding-window retrievability analysis for AI answer engines.
5. **Information Gain Delta** — KL-divergence and novel-term profile vs. background corpus.
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

Every metric across all 21 levels is derived from **actual page content**, not hardcoded defaults or synthesized values:

- **SERP volatility** is computed from real page structure (word count, headings, images, links, lists, sentence/paragraph statistics).
- **Revenue at risk** is calculated from real page signals (title presence, meta description, canonical, H1, schema, viewport, word count, image dimensions, server timing, security headers) **combined with optional GA4 business inputs** you supply (traffic, AOV, conversion rate, currency).
- **Entity consensus** uses actual page text for self-mentions and optional external content — no fake "trusted sources."
- **Passage similarity** uses real Jaccard/TF-IDF overlap on actual content passages.
- **Brand mention share** counts real occurrences in page text.
- **Readability scores** use real Flesch-Kincaid calculations on actual content.

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
- **Real-time progress streaming** (Server-Sent Events) during the 21-level run.
- **Per-module accordions** with severity badges and expandable evidence/fixes.
- **Jump-to-section table of contents** on the report page.
- **14 expandable deliverable cards**, plus a 5-phase executive deep-dive and per-module full analysis.
- Export as **JSON**, **CSV** or **PDF** — fully responsive (desktop + mobile).

### 🚀 Production-Ready

- Rate limiting (200 req/15 min).
- Helmet security headers.
- CORS enabled.
- Compression (gzip/brotli).
- Request body size limits.
- Graceful error handling at every level — a failure in one level never crashes the full audit.
- Unified logging with rotation support.
- **Render.com** deployment ready (dynamic Chrome path, `render.yaml`).

---

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
                    │  21 Level Analysis Engine             │
                    │  ┌─────┐ ┌─────┐ ┌─────┐  ┌─────┐   │
                    │  │ L01 │ │ L02 │ │ L03 │  │ L21 │   │
                    │  └──┬──┘ └──┬──┘ └──┬──┘  └──┬──┘   │
                    │     └───────┴────────┴────────┘      │
                    │              │                        │
                    │     ┌────────▼────────┐               │
                    │     │  Helpers.js    │               │
                    │     │  (60+ fns)     │               │
                    │     └────────────────┘               │
                    └──────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  JSON Response  │
                    │  + Score +      │
                    │  Issues + Data  │
                    └────────────────┘
```

### Data Flow

1. **User submits URL** via the web UI or REST API.
2. **Server fetches raw HTML** using `node-fetch` (simulating what Googlebot sees without JavaScript).
3. **Server launches headless Chrome** via Puppeteer, navigates to the URL, waits for network idle, captures performance metrics and the fully rendered HTML.
4. **Cheerio parses the rendered HTML** into a jQuery-compatible DOM.
5. **Each of the 21 level functions** receives the parsed DOM, raw text, response headers, URL, and performance data. They run independently — if one crashes, it returns an error result without affecting others.
6. **Levels import 60+ helper functions** from `helpers.js` for specialized analysis.
7. **Results are aggregated**: overall score, issue counts by severity, and per-level structured data.
8. **JSON response is sent** to the client, which renders the module grid, the 5-phase deep-dive, and the 14 deliverables.

---

## Installation

### Prerequisites

- Node.js **18.x** or higher (20.x recommended)
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

> **Note**: Puppeteer downloads Chromium (~300 MB) on first install. To use an existing Chrome install instead, set the `CHROME_PATH` variable in `server.js`.

### Environment Variables (Optional)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `CHROME_PATH` | internal Puppeteer path | Custom Chrome/Chromium executable |
| `RATE_LIMIT_WINDOW_MS` | `900000` (15 min) | Rate limit window |
| `RATE_LIMIT_MAX` | `200` | Max requests per window |

---

## Quick Start

```bash
# Standard mode
npm start

# Development mode with auto-restart
npm run dev
```

1. Open `http://localhost:3000`.
2. Enter a URL (e.g., `https://example.com`) — the tool auto-fills most settings for you.
3. Click **"Start 21-Level Deep Audit"**.
4. Watch the live progress stream across all 21 modules (~60–120 s).
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

Watch all 21 modules execute with a live progress bar and per-level status text. When complete, every module shows a **0–100 score** with critical / warning / info counts. Click any module card to expand its complete data and fixes.

### Step 3: Report

- Overall score ring + issue counts.
- **14 Executive Deliverables** (expandable, ready-to-use artifacts).
- **5-Phase Executive Deep-Dive** — every module fully rendered and open, grouped by business phase.
- **All Findings & Executive Issue Log** with live keyword search.
- **Detailed Module Analysis** — all 21 modules with nested sections.
- Export as **JSON**, **CSV**, or **Print/PDF**.

---

## The 21 Analysis Levels

### Level 1: Core Hygiene & Technical Baseline
Title length/truncation/pixel width, meta description, viewport, robots meta + X-Robots-Tag header, canonical integrity, heading hierarchy (H1 count, skipped levels), image alt text & formats, HTTP headers, internal link quality, link density.

### Level 2: DOM Reality, Rendering & Structural Diagnostics
SSR vs CSR diff (raw HTML vs rendered DOM), DOM node count / max depth / child distribution, schema.org validation (valid/invalid, missing required, circular refs, warnings).

### Level 3: Semantic Architecture, Entities & Information Gain
Word count, Flesch-Kincaid readability, keyword density, bigrams, transition words, content structure, information-gain delta (KL-divergence, novel terms), entity extraction.

### Level 4: Generative Search, LLM & RAG Visibility
RAG chunk simulation with per-chunk retrievability scores, passage vectors, direct answer scoring, LLM citation worthiness, redundant phrasing, section entropy.

### Level 5: Dev Automation & Auto-Fix Generation
Auto-generated patches (schema JSON-LD, heading hierarchy, canonical fixes) with regression test code, diagnostic workflow, rollback plans.

### Level 6: Edge Computing & Serverless Integration
Edge worker code generation, security headers, cache policy, CORS, cookie attributes, mixed-content detection.

### Level 7: Multi-Modal Content & Spatial Asset Auditing
Image analysis (alt text, dimensions, lazy loading, srcset, modern formats), video captions/posters, audio transcripts, SVG accessibility.

### Level 8: Predictive SERP Volatility & Algorithm Impact
SERP volatility from real page structure, quality thresholds, SERP feature readiness (AI Overview, featured snippet, PAA, local, shopping, knowledge panel), thin content, E-E-A-T signals, algorithm resilience.

### Level 9: Continuous SEO A/B Testing & Rollback Safety
Baseline extraction, testability assessment, title/meta variants, rollback safety, statistical significance, sample size estimation.

### Level 10: Log-Stream Intelligence & Bot Behavior Mapping
Status code & redirect chain, crawl budget estimation, bot behavior / freshness signals, drop-in log stream configs (Cloudflare, CloudWatch, Datadog).

### Level 11: Multi-Model Synthetic User & LLM Behavior Simulation
Synthetic agent behavior, RAG chunk simulation, agentic readiness (CTA parsability, form accessibility, JS dependency), LLM readiness.

### Level 12: Reverse-Engineered Core Algorithm & Quality Classifier
Content freshness, E-E-A-T signals, quality thresholds, quality flags, helpful-content alignment.

### Level 13: Edge-Native Patching & CI/CD Gatekeeping
Pre-commit hooks, GitHub Actions workflow, GitLab CI config, Cloudflare Worker / Vercel Edge code, self-healing rules.

### Level 14: Financial Attribution & Revenue Impact Engine
Revenue-at-risk per issue, ROI analysis, quarterly projections, priority action plan, traffic estimates, competitive loss, cost-benefit summary, issue registry.

### Level 15: Passage Vector & Cosine Similarity Profiler
Passage-level retrieval scoring, entity flow tracking, heading drift, content clustering, document distance.

### Level 16: Third-Party Consensus & Entity Alignment Scorer
Entity consensus, citation quality, knowledge panel readiness, factual claims, trust-level scoring.

### Level 17: Multi-Agent Autonomous Sandbox & Fix Validator
Schema/heading/canonical auto-fixes with validation tests, diagnostic workflow, fix validation.

### Level 18: Zero-Click & Agentic Commerce Visibility
AI Overview readiness, featured snippet optimization, zero-click CTR estimation, agentic commerce audit, brand mention share, entity prominence.

### Level 19: Edge Orchestration & Canary Deployment Safety
Edge worker deployment, canary (progressive rollout), rollback triggers, error budget monitoring, deployment checklist.

### Level 20: Adversarial Red Team & Prompt Injection Audit
Prompt injection testing, output manipulation, hallucination triggers, jailbreak patterns, data extraction attempts, injection risk scoring.

### Level 21: Site-Wide Risk Aggregation & Executive Dashboard
Cross-page pattern analysis, risk distribution, portfolio scoring, executive summary, KPI dashboard, benchmark comparison.

---

## The 14 Executive Deliverables

| # | Deliverable | Output Type | Data Source |
|---|-------------|-------------|-------------|
| 1 | SSR vs. CSR Diff Report | Visual split-view + JSON diff | Level 2 `ssrVsCsr` |
| 2 | DOM Tree Health Score | Metrics + bucket histograms | Level 2 `domDepth` |
| 3 | Schema Validation Audit | Schema.org compliance report | Level 2 `schemaValidation` |
| 4 | RAG Chunking Simulator | Sliding-window retrievability | Level 4 `ragChunks` |
| 5 | Information Gain Delta | KL-divergence profile | Level 3 `informationGain` |
| 6 | Entity Mapping Grid | KG + NLP entity chips | Levels 3 & 16 |
| 7 | Automated Engineering PRs | Branch + files + tests | Level 17 `pullRequests` |
| 8 | Self-Healing Edge Workers | Deploy-ready code | Levels 6, 13, 19 |
| 9 | CI/CD Build Gatekeeper Logs | Workflow + hook + pipeline | Level 13 |
| 10 | Log-Stream Bot Behavior Maps | Freshness signals + log configs | Level 10 |
| 11 | Algorithmic Quality Threshold Alerts | Flag + threshold watch | Levels 8, 12, 20 |
| 12 | Multi-Modal Asset Diagnostics | Image/video/audio compliance | Level 7 |
| 13 | Revenue-at-Risk Dashboard | Monetized financial model | Level 14 |
| 14 | Effort-to-Impact Prioritization Matrix | Ranked remediation queue | Levels 14 & 21 |

---

## Inputs & Configuration

### Audit Config (client → `POST /api/audit`)

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `url` | string | — | Target URL to audit (required) |
| `config.userAgent` | string | `chrome-desktop` | Crawl as Chrome / Googlebot / GPTBot / PerplexityBot / Applebot |
| `config.customUA` | string | — | Custom user-agent string |
| `config.viewportWidth` | number | `1920` | Rendering viewport width |
| `config.viewportHeight` | number | `1080` | Rendering viewport height |
| `config.geo` | string | — | Geo-location (e.g., `US`, `GB`, `DE`, `IN`) |
| `config.keywords` | string | — | Comma-separated target keywords |
| `config.competitors` | array | — | Competitor URLs (or auto-discovered) |
| `config.sitemap` | string | — | XML sitemap URL |
| `config.brand` | string | — | Brand / entity name |
| `config.pageType` | string | `auto` | Homepage / product / category / article / landing / local / FAQ / documentation |
| `config.monthlyTraffic` | number | `0` | GA4 organic sessions/month (powers revenue-at-risk) |
| `config.avgOrderValue` | number | `0` | GA4 average order value |
| `config.conversionRate` | number | `0` | Conversion rate % |
| `config.currency` | string | `USD` | Reporting currency |

---

## API Reference

### `POST /api/audit`

Runs a full 21-level audit on a URL.

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

**Response:** Audit result with `url`, `overallScore`, `levels[]` (each with `level`, `name`, `score`, `issues[]`, `data{}`), `meta` (timestamp, competitors), `summary`, and `duration`.

### `GET /api/audit-progress/:auditId`

Server-Sent Events (SSE) stream of live progress during an audit.

**Response:** `data: { "level": 3, "detail": "Analyzing DOM depth..." }`

### `POST /api/analyze-url`

Analyzes a URL to auto-fill config fields (page type, brand, keywords, sitemap, geo, currency, user-agent) before an audit.

**Request Body:** `{ "url": "https://example.com" }`

**Response:** `{ "brand": "...", "pageType": "...", "keywords": "...", "competitors": [...], "blocked": false, ... }`

### `POST /api/export-pdf`

Generates a PDF from audit result HTML.

**Request Body:** `{ "html": "<html>...</html>" }`

**Response:** Binary PDF file (`application/pdf`).

### `GET /api/health`

Health check endpoint.

**Response:** `{ "status": "ok", "timestamp": "..." }`

---

## Project Structure

```
Complete-On-Page-SEO/
├── README.md                       # This file
├── .gitignore
├── render.yaml                     # Render.com deployment config (app at repo root)
├── package.json                    # Dependencies & scripts
├── package-lock.json
├── server.js                       # Express server, Puppeteer orchestration, API routes
├── helpers.js                      # 60+ analysis helper functions
├── levels.js                       # 21 level analysis functions
└── public/
    └── index.html                  # Single-page application UI (vanilla JS + CSS)
```

---

## Deployment

### Render.com

A `render.yaml` blueprint is included:

- **root directory**: repo root (leave Root Directory empty if creating via the Render dashboard)
- **build**: `npm install && npx puppeteer browsers install chrome`
- **start**: `npm start`
- Chrome path is resolved dynamically at runtime.

```yaml
services:
  - type: web
    name: complete-on-page-seo
    runtime: node
    buildCommand: npm install && npx puppeteer browsers install chrome
    startCommand: npm start
```

### Manual / VPS

```bash
npm install
npx puppeteer browsers install chrome
npm start
```

---

## Troubleshooting

### Puppeteer/Chrome issues

**Chrome not found:**
```bash
npx puppeteer browsers install chrome
```
Or set a custom `CHROME_PATH` in `server.js`.

**Chrome crashes on low-memory systems:**
```bash
# In server.js, add to puppeteer args:
'--disable-dev-shm-usage',
'--no-sandbox',
```

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

- The server logs which level(s) failed with error messages.
- A failed level returns a score of 0 with a single critical issue describing the error.
- Check `server.log` / `server_err.log` for full error details.

---

## FAQ

**Q: Does this tool crawl my entire site?**  
A: No. It analyzes a single URL per request. For site-wide analysis, run multiple audits and use Level 21 (Site-Wide Risk Aggregation).

**Q: Does it work on SPAs (React, Angular, Vue)?**  
A: Yes. Puppeteer renders JavaScript before analysis. Level 2 specifically compares SSR vs CSR to detect JS-dependent content.

**Q: Are the scores comparable across different pages?**  
A: Yes. Each level uses a consistent 0–100 scoring methodology. The overall score is the average of all 21 levels.

**Q: Can I run this on localhost/staging URLs?**  
A: Yes, as long as the server running the audit can reach the target URL.

**Q: Does it store audit results?**  
A: No. This is a real-time analysis tool. Results are returned in the API response and rendered in the browser. No database is used.

**Q: How long does an audit take?**  
A: Typically 60–120 seconds depending on page complexity, JS execution time, and network latency.

**Q: Why are some deliverables showing "No Data Found"?**  
A: Some outputs (e.g., schema validation, images, revenue) depend on page content and on your Business Intelligence inputs. Thin pages or missing GA4 numbers gracefully skip those cards and point you to the relevant module.

**Q: How do I get the Revenue-at-Risk dashboard?**  
A: Enter your monthly organic traffic, average order value and conversion rate on the Configure page (Business Intelligence section) before starting the audit.

---

## Roadmap

- [x] **Auto-fill from URL analysis**
- [x] **Competitor auto-discovery** (live search + verification)
- [x] **14 concrete executive deliverables**
- [x] **5-phase executive deep-dive**
- [x] **Google Pixel UI with help guide**
- [ ] **Multi-page crawling** — spider entire sites with configurable depth
- [ ] **Historical tracking** — store results and track score changes over time
- [ ] **Scheduled audits** — cron-based periodic analysis with email reports
- [ ] **API client libraries** — JavaScript, Python, and Go SDKs
- [ ] **Integration plugins** — WordPress, Shopify, Webflow, Contentful
- [ ] **Real-time WebSocket streaming** — live audit progress
- [ ] **AI-powered fix generation** — LLM integration for automated remediation

---

## Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository.
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**.

### Guidelines

- Maintain the **21-level architecture** — new analysis should be a new level or integrated into an existing one.
- **No synthetic/fabricated data** — all metrics must derive from real page content or HTTP responses.
- Each level must have **named sub-functions** in its `data` object.
- Each level must include a **scoring penalty system** (`p` variable, `sc(p)` normalization).
- **Handle errors gracefully** — use try/catch, return a structured error result, never crash the audit.
- Add new helper functions to `helpers.js` and import them in `levels.js`.
- Run `node -c helpers.js && node -c levels.js && node -c server.js` to verify syntax.

---

## License

This project is licensed under the **ISC License**.

```
ISC License

Copyright (c) 2026, dipakjad1993

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

---

<div align="center">
  <strong>Complete ON Page SEO 2026</strong> — 21-Level AI-Powered On-Page SEO Audit & Fix Generator
  <br>
  Built with ❤️ for the SEO community
</div>
