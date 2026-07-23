# SEO Deep Audit 360 — Complete On-Page SEO Analysis Engine

![Version](https://img.shields.io/badge/version-1.0.0-indigo)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![License](https://img.shields.io/badge/license-ISC-blue)
![Puppeteer](https://img.shields.io/badge/puppeteer-25.x-yellow)

A comprehensive, production-grade on-page SEO auditing tool that analyzes web pages across **21 deep analysis levels**, delivering granular sub-function breakdowns, real data-driven scoring, and actionable remediation. Built with Node.js + Express + Cheerio + Puppeteer. Features a modern glassmorphic UI with real-time progress tracking and PDF export.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [The 21 Analysis Levels — Complete Breakdown](#the-21-analysis-levels--complete-breakdown)
- [API Reference](#api-reference)
- [Helper Functions Library](#helper-functions-library)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

SEO Deep Audit 360 is a **server-based** on-page SEO analysis tool that performs a deep, multi-dimensional audit of any public URL. Unlike superficial SEO checkers that return a handful of generic checks, this engine runs **21 independent analysis modules** (called "levels"), each designed to probe a specific facet of on-page optimization, technical SEO health, content quality, SERP readiness, and financial impact.

Each level produces:

- A **quantitative score** (0–100) reflecting that dimension's health.
- A **list of issues** with severity (critical / warning / info), impact, concrete fix instructions, and links to documentation.
- A **structured data object** broken into named **sub-functions**, each containing granular computed metrics derived entirely from real page data — no synthetic or fabricated values.

The system uses **Puppeteer** to render JavaScript-heavy pages (SPAs, React, Angular, Vue) so the analysis reflects what Googlebot sees after JS execution. It also compares server-side (raw) HTML against rendered HTML to detect SSR/CSR discrepancies.

---

## Key Features

### 🔬 21 Specialized Analysis Levels

| # | Level Name | Focus Area |
|---|-----------|-----------|
| 1 | Core Hygiene & Technical Baseline | Titles, meta descriptions, viewport, robots, canonicals, headings, images, HTTP headers, internal links |
| 2 | SSR/CSR Rendering & DOM Depth | JavaScript rendering analysis, DOM size, node depth, schema validation |
| 3 | Content Readability & Keyword Authority | Flesch-Kincaid, keyword density, bigrams, transition words, content quality flags |
| 4 | Information Gain & LLM Citation Worthiness | NLP analysis, information gain, LLM citation simulation, direct answer scoring |
| 5 | Semantic Entity Extraction & Anchor Text Topology | Knowledge graph entities, anchor text context, entity salience, internal link entity distribution |
| 6 | Core Web Vitals & HTTP Header Hardening | CWV simulation, security headers, cache policy, cookie attributes, HTTP/2, mixed content |
| 7 | Multi-Modal Content & Spatial Asset Auditing | Images (alt, dimensions, lazy loading, format), video, audio, SVG, accessibility |
| 8 | Predictive SERP Volatility & Algorithm Impact Simulator | SERP volatility, quality thresholds, SERP features (AI Overview, featured snippet, PAA, local, shopping, knowledge panel), thin content, monetization, E-E-A-T, algorithm resilience, zero-click risk |
| 9 | Continuous SEO A/B Testing & Rollback Safety Nets | Baseline metrics, testability assessment, title/meta variants, rollback safety, catastrophic patterns, statistical significance |
| 10 | Real-Time Log-Stream Intelligence & Bot Behavior Mapping | Status code analysis, redirect chain, crawl budget estimation, bot behavior, freshness signals, log stream configuration |
| 11 | Multi-Model Synthetic User & LLM Behavior Simulation | Synthetic agent behavior, RAG chunk simulation, CTA parsability, form accessibility, JS dependency, LLM readiness |
| 12 | Advanced Readability & Semantic Discourse Profiling | Flesch-Kincaid grade level, sentence length distribution, passive voice, jargon density, paragraph coherence, lexical diversity |
| 13 | Unhelpful Content Ratio & AI Search Devaluation Risk | Unhelpful content detection, AI pattern recognition, content thinness, auto-generated content detection, helpful content system alignment |
| 14 | Financial Attribution & Revenue Impact Engine | Page type classification, business metrics, revenue at risk, ROI analysis, quarterly projections, priority action plan, traffic estimates, competitive loss, cost-benefit summary, issue registry |
| 15 | Passage Vector & Cosine Similarity Profiler | Entity overlap, passage similarity, heading drift, heading-content alignment, section entity consistency, bigram density, entity transition maps, content clustering, document distance |
| 16 | Third-Party Consensus & Entity Alignment Scorer | Entity consensus, citation quality, knowledge panel readiness, factual claims, trust level scoring |
| 17 | Autonomous Sandbox Rollback Simulator & Fix Validator | Schema validation, heading hierarchy fixes, canonical fixes, auto-generated fixes with test code, diagnostic workflow |
| 18 | Zero-Click & Agentic Commerce Visibility Metrics | AI Overview readiness, featured snippet optimization, zero-click CTR estimation, agentic commerce audit, brand mention share, entity prominence, visibility share |
| 19 | Self-Healing Edge Config & Canary Deployment Safety | Edge worker script generation, canary deployment config, progressive rollout, rollback triggers, error budget monitoring |
| 20 | Adversarial Red Team & Prompt Injection Audit | Prompt injection testing, output manipulation, hallucination triggers, jailbreak patterns, data extraction attempts, injection risk scoring |
| 21 | Site-Wide Risk Aggregation & Executive Dashboard | Cross-page pattern analysis, risk distribution, portfolio scoring, executive summary, kpi dashboard |

### 🧠 Real Data, No Fabrication

Every metric across all 21 levels is derived from **actual page content**, not hardcoded defaults or synthesized values:

- **SERP volatility** is computed from real page structure (word count, headings, images, links, lists, sentence/paragraph statistics).
- **Revenue at risk** is calculated from real page signals (title presence, meta description, canonical, H1, schema, viewport, word count, image dimensions, server timing, security headers).
- **Entity consensus** uses actual page text for self-mentions and optional external content — no fake "trusted sources."
- **Passage similarity** uses real Jaccard/TF-IDF overlap on actual content passages.
- **Brand mention share** counts real occurrences in page text.
- **Readability scores** use real Flesch-Kincaid calculations on actual content.

### 🖥️ Modern Glassmorphic UI

- Dark theme with indigo/violet/cyan gradients.
- Real-time progress tracking with animated scan line effect.
- Circular score visualization with color-coded segments.
- Per-level accordion with severity badges (critical/warning/info).
- Interactive issue display with expandable evidence and recommendations.
- PDF export of full audit report.
- Fully responsive (desktop + mobile).

### 🚀 Production-Ready

- Rate limiting (200 req/15 min per API key).
- Helmet security headers.
- CORS enabled.
- Compression (gzip/brotli).
- Request body size limits (10 MB).
- Graceful error handling at every level — a failure in one level never crashes the full audit.
- 15-second fetch timeout.
- Unified logging with rotation support.

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
3. **Server launches headless Chrome** via Puppeteer, navigates to the URL, waits for network idle, captures performance metrics (TTFB, DOM Content Loaded, Load Complete) and the fully rendered HTML.
4. **Cheerio parses the rendered HTML** into a jQuery-compatible DOM.
5. **Each of the 21 level functions** receives the parsed DOM, raw text, response headers, URL, and performance data. They run independently — if one crashes, it returns an error result without affecting others.
6. **Levels import 60+ helper functions** from `helpers.js` for specialized analysis (readability, keyword density, entity extraction, schema validation, CWV simulation, etc.).
7. **Results are aggregated**: overall score (average of all 21 level scores), issue counts by severity, and per-level structured data.
8. **JSON response is sent** to the client. The web UI renders it with animations, score visualization, and issue accordion. PDF export is available via a separate endpoint.

---

## Installation

### Prerequisites

- Node.js **18.x** or higher (20.x recommended)
- npm **9.x** or higher
- Git
- Chrome/Chromium (Puppeteer will download its own by default)

### Step-by-Step

```bash
# 1. Clone the repository
git clone https://github.com/dipakjad1993/Complete-On-Page-SEO.git
cd Complete-On-Page-SEO/seo-audit-tool

# 2. Install dependencies
npm install

# 3. Verify Puppeteer Chrome installation
npx puppeteer browsers install chrome

# 4. Start the server
npm start

# 5. Open in browser
# http://localhost:3000
```

> **Note**: Puppeteer downloads Chromium (~300 MB) on first `npm install`. If you have Chrome installed and want to use it instead, set the `CHROME_PATH` variable in `server.js` to your Chrome executable path.

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
# Start in development mode with auto-restart
npm run dev

# Or standard mode
npm start

# Server starts at http://localhost:3000
```

1. Open `http://localhost:3000` in your browser.
2. Enter a URL (e.g., `https://example.com`) and click "Audit Now".
3. Watch the real-time progress bar as all 21 levels execute.
4. Explore the results: overall score, per-level breakdowns, detailed issues, and sub-function data.
5. Click "Export PDF" to generate a downloadable audit report.

---

## The 21 Analysis Levels — Complete Breakdown

### Level 1: Core Hygiene & Technical Baseline

**Sub-functions:** `titleAnalysis`, `metaDescription`, `viewport`, `robotsMeta`, `xRobotsTagHeader`, `canonical`, `headingHierarchy`, `mediaOptimization`, `httpHeaders`, `internalLinks`, `linkDensity`, `headingDetail`, `perLinkAnalysis`, `perHeadingAnalysis`

Analyzes the fundamental building blocks of on-page SEO:

- **Title Tag**: Length (byte and pixel), truncation risk, dynamic substitution detection, H1 alignment, OG title consistency, keyword position.
- **Meta Description**: Length analysis, CTA presence, keyword inclusion, OG description alignment, truncation risk.
- **Viewport Meta**: Presence, width=device-width, initial-scale, zoom restrictions (accessibility).
- **Robots Directives**: Meta robots (noindex, nofollow, nosnippet, noimageindex), X-Robots-Tag HTTP header.
- **Canonical Tag**: Presence, self-referencing, cross-domain, multiple canonicals, parameter handling.
- **Heading Hierarchy**: H1 count, missing H1, skipped levels, empty headings, visual vs. semantic headings.
- **Media Optimization**: Alt text coverage, width/height dimensions, image format (WebP/AVIF vs PNG/GIF), lazy loading, SVG accessibility.
- **HTTP Headers**: Status code, security headers, caching headers.
- **Internal Links**: Dead fragments, empty links, generic anchor text, noopener missing, nofollow ratio, link density.

**Scoring Penalties (worst):** Missing title (+25), no index (+30), missing H1 (+20), images without alt (+20), missing viewport (+20), missing meta description (+20), missing canonical (+15), multiple H1 (+10).

---

### Level 2: SSR/CSR Rendering & DOM Depth

**Sub-functions:** `ssrVsCsr`, `domDepth`, `domDepthDistribution`, `childDistribution`, `schemaValidation`

Evaluates JavaScript rendering health and DOM complexity:

- **SSR/CSR Comparison**: Compares raw (server) HTML against Puppeteer-rendered HTML. Detects JS-dependent content that Googlebot may miss.
- **DOM Analysis**: Total node count, max nesting depth, distribution by depth, child element distribution.
- **Schema Validation**: Schema count, valid/invalid breakdown, missing required fields, circular references, warnings.

**Scoring Penalties:** SSR ratio <50% (+20), SSR ratio <85% (+10), DOM >1500 nodes (+10), DOM depth >32 (+8), invalid schemas (+12).

---

### Level 3: Content Readability & Keyword Authority

**Sub-functions:** `readability`, `keywordDensity`, `bigrams`, `contentStructure`, `transitionWords`, `keywordAnalysis`, `readabilityBreakdown`, `paragraphStats`

Deep textual analysis:

- **Readability**: Flesch-Kincaid score, grade level, reading ease, sentence/word/syllable statistics.
- **Keyword Density**: Top keywords with frequency, density percentage, stop-word filtered analysis.
- **Bigram Analysis**: Top bigrams, co-occurrence patterns.
- **Content Structure**: Paragraph count, average paragraph length, short/long paragraph ratios, heading-per-word density.
- **Transition Words**: Count, ratio, specific transition categories (addition, contrast, cause, sequence, conclusion).
- **Quality Flags**: Sentence starts with "and/but/because", exclamation marks, all-caps sentences, ellipsis abuse, passive voice indicators, hedging language.

---

### Level 4: Information Gain & LLM Citation Worthiness

**Sub-functions:** `informationGain`, `keywordRichness`, `textDiversity`, `redundantPhrases`, `llmCitation`, `directAnswer`, `uniqueBigrams`, `sectionEntropy`, `uniqueSections`, `lowInformationPassages`

Measures the unique value your content provides beyond the baseline web:

- **Information Gain**: Compares keyword distribution against a baseline corpus (common English), calculating how much novel information the page contributes.
- **LLM Citation Simulation**: Extracts factual claims and simulates whether an LLM would cite the page as a source.
- **Direct Answer Scoring**: For question-based queries, determines if the page provides concise, extractable answers.
- **Text Diversity**: Unique word ratio, type-token ratio, bigram uniqueness.
- **Section Entropy**: Information-theoretic entropy across content sections — higher entropy means more diverse, information-rich content.
- **Redundant Phrasing**: Detects repeated templates and boilerplate language.

---

### Level 5: Semantic Entity Extraction & Anchor Text Topology

**Sub-functions:** `entityExtraction`, `entityRelations`, `entityOccurrenceMap`, `entityDensity`, `anchorTextClusters`, `entitySalience`

Maps the knowledge graph entities referenced in your content:

- **Entity Extraction**: Named entity recognition (people, organizations, locations, products, concepts) with frequency counting.
- **Entity Salience**: Determines which entities are most central to the page based on frequency, position, and distribution.
- **Anchor Text Context**: For each internal link, captures the surrounding text and classifies the anchor context.
- **Entity Co-occurrence**: Builds an entity relationship graph showing which entities appear together.
- **Internal Link Entity Distribution**: Maps which entities are linked from which sections.

---

### Level 6: Core Web Vitals & HTTP Header Hardening

**Sub-functions:** `coreWebVitals`, `httpSecurity`, `cachePolicy`, `cookieAnalysis`, `serverTiming`, `hsts`, `csp`, `mixedContent`

Security and performance hardening:

- **Core Web Vitals Simulation**: TTFB, LCP (simulated via DOM), CLS (simulated via layout shifts), FID (simulated via DOM complexity), INP estimation.
- **HTTP Security Headers**: Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- **Cache Policy**: Cache-Control, Expires headers, ETag validation.
- **Cookie Analysis**: Secure flag, HttpOnly flag, SameSite attribute.
- **Server Timing**: Server-Timing header parsing, request duration breakdown.
- **Mixed Content**: Detection of HTTP resources on HTTPS pages.

---

### Level 7: Multi-Modal Content & Spatial Asset Auditing

**Sub-functions:** `imageAnalysis`, `videoAnalysis`, `audioAnalysis`, `svgAnalysis`, `accessibilityScore`, `semanticCaptions`

Comprehensive media and accessibility audit:

- **Image Analysis**: Total, formats (modern vs legacy), missing alt, empty alt (decorative), generic alt, long alt, missing dimensions, lazy loading coverage, srcset presence.
- **Video Analysis**: Native HTML5 videos, embedded (YouTube, Vimeo, Wistia, Loom), captions/subtitles, poster images, controls, missing titles on embeds.
- **Audio Analysis**: Native audio elements, linked audio files (MP3, WAV, OGG), transcript presence.
- **SVG Analysis**: Inline SVGs, missing aria labels, missing dimensions, text content, accessible roles.
- **Accessibility Score**: Aggregate accessibility health based on media and semantic elements.
- **Semantic Captions**: Figure/figcaption, table/caption usage.

---

### Level 8: Predictive SERP Volatility & Algorithm Impact Simulator

**Sub-functions:** `serpVolatility`, `qualityThresholds`, `serpFeatures`, `thinContentAnalysis`, `monetizationAnalysis`, `eeatSignals`, `algorithmResilience`, `zeroClickRisk`

The most advanced level — simulates how Google algorithms may treat the page:

- **SERP Volatility**: Derived from real page structure signals (word count, heading density, image density, link density, list density). No fake date/ranking arrays.
- **Quality Thresholds**: Multi-dimension quality scoring using `calculateQualityThresholds` helper.
- **SERP Features Readiness**:
  - *AI Overview*: Definition sentences, numbered lists (3+), comparison tables, authoritative citations, sufficient length.
  - *Featured Snippet*: Paragraph format, list format, table format, question-answer patterns.
  - *People Also Ask*: Question count, direct answer formats.
  - *Local Pack*: LocalBusiness schema, phone links.
  - *Shopping Graph*: Product schema.
  - *Knowledge Panel*: Organization schema, social profiles, logo.
- **Thin Content Analysis**: Word count threshold, paragraph thin ratio, lexical diversity.
- **Monetization Analysis**: Affiliate link count, ratio, safe threshold (<30%).
- **E-E-A-T Signals**: Author attribution, publisher info, published/modified dates, citations, factual claims, disclaimers, author bio.
- **Algorithm Resilience Score**: Helpful Content System alignment score, vulnerable pattern detection, resilience grade (A–D).
- **Zero-Click Risk Projection**: AI Overview risk, featured snippet risk, estimated CTR impact, mitigation strategy.

---

### Level 9: Continuous SEO A/B Testing & Rollback Safety Nets

**Sub-functions:** `baseline`, `testability`, `titleVariants`, `metaVariants`, `rollbackSafety`, `statisticalSignificance`

SEO experimentation framework:

- **Baseline Extraction**: Captures current title, meta description, H1, word count, image count, link counts, schema count, heading structure, paragraph count, CTA count.
- **Testability Assessment**: Identifies which elements are A/B testable (title, meta description, H1, CTAs), variant count estimation.
- **Title Variants**: Generates 3 variants (control, front-loaded, benefit-driven) with CTR hypotheses.
- **Meta Variants**: Generates 3 variants (control, benefit-first, question+answer) with CTR hypotheses.
- **Rollback Safety**: Catastrophic pattern detection (noindex, missing canonical), monitoring config with metrics and alert thresholds.
- **Sample Size Estimation**: Based on content length and CTA count.
- **Statistical Significance**: Recommended duration and confidence levels.

---

### Level 10: Real-Time Log-Stream Intelligence & Bot Behavior Mapping

**Sub-functions:** `statusCode`, `redirectChain`, `crawlBudget`, `botBehavior`, `logStreamConfig`

Crawl optimization and bot behavior analysis:

- **Status Code Analysis**: Current status, status category, redirect chain length and loop detection.
- **URL Analysis**: Path depth, parameter count, parameter cleanliness, session param detection.
- **Crawl Budget Estimation**: Efficiency score, parametric risk assessment, waste analysis.
- **Bot Behavior**: Freshness signals (published/modified dates), estimated crawl frequency, crawl budget waste items.
- **Log Stream Configuration**: Pre-configured schemas for Cloudflare Logpush, AWS CloudWatch Logs, Datadog Logs.
- **Session Parameter Detection**: Identifies tracking/analytics parameters that create infinite URL permutations.

---

### Level 11: Multi-Model Synthetic User & LLM Behavior Simulation

**Sub-functions:** `syntheticAgentBehavior`, `ragChunkSimulation`, `agenticReadiness`, `llmReadiness`, `chunkSelfContainment`

Simulates how AI agents and LLMs interact with your page:

- **Synthetic Agent Behavior**: `analyzeSyntheticAgentBehavior` extracts structured data patterns, entity clusters, key facts, tabular data, list data, and semantic HTML elements.
- **RAG Chunk Simulation**: `ragChunkSimulator` splits content into chunks and scores each for self-containment (can the chunk be understood in isolation?).
- **Agentic Readiness**: CTA parsability (can an agent identify the call-to-action?), form accessibility (can an agent fill out forms?), JS dependency (is the page functional without JS?).
- **LLM Readiness**: Entity clarity score (how well-defined are the entities?), machine-readable formats (tables, lists, key facts), semantic markup coverage, multi-format readiness.
- **Chunk Self-Containment**: Average retrievability score, low-quality chunk count.

---

### Level 12: Advanced Readability & Semantic Discourse Profiling

**Sub-functions:** `readabilityAdvanced`, `fleschKincaid`, `gradeLevel`, `sentenceLengthDistribution`, `passiveVoice`, `jargonDensity`, `paragraphCoherence`, `lexicalDiversity`, `transitions`, `discourseAnalysis`, `readabilitySubscores`

Advanced linguistic profiling:

- **Flesch-Kincaid Grade Level**: Grade level with label (college, high school, middle school, elementary).
- **Reading Ease**: Flesch Reading Ease score (0–100).
- **Sentence Length Distribution**: Short (<12 words), medium (12–25), long (>25) sentences with percentages.
- **Passive Voice Detection**: Count and ratio of passive constructions.
- **Jargon Density**: Detects industry-specific terminology based on sentence complexity metrics.
- **Paragraph Coherence**: Average sentences per paragraph, transition coverage.
- **Lexical Diversity**: Type-token ratio, unique word count.
- **Transition Analysis**: Transition word count by category (addition, contrast, cause, sequence, conclusion).
- **Discourse Analysis**: Structure coherence scoring.

---

### Level 13: Unhelpful Content Ratio & AI Search Devaluation Risk

**Sub-functions:** `unhelpfulContentRatio`, `aiPatterns`, `contentThinnessScore`, `autoGeneratedScore`, `helpfulContentAlignment`, `gapAnalysis`

Aligned with Google's Helpful Content System:

- **Unhelpful Content Ratio**: `calculateUnhelpfulContentRatio` analyzes content against known unhelpful patterns (lack of expertise, insufficient depth, no original research, thin affiliate content, auto-generated text).
- **AI Pattern Detection**: `detectAIPatterns` checks for formulaic AI-generated text patterns, repetitive sentence starters, low-perplexity sequences, and templated phrasing.
- **Content Thinness Score**: Composite score based on word count, paragraph depth, entity density, and section structure.
- **Auto-Generated Content Score**: Detection of boilerplate templates, generic filler phrases, and low-information sections.
- **Helpful Content Alignment**: Overall alignment score (0–100) with actionable gap analysis.

---

### Level 14: Financial Attribution & Revenue Impact Engine

**Sub-functions:** `pageTypeClassification`, `businessMetrics`, `revenueAtRisk`, `roiAnalysis`, `quarterlyProjections`, `priorityActionPlan`, `trafficEstimates`, `competitiveLoss`, `costBenefitSummary`, `issueRegistry`

The only level that quantifies SEO issues in dollar terms:

- **Page Type Classification**: Determines if the page is product, checkout, landing, category, informational, or blog based on URL patterns and content signals.
- **Business Metrics**: Page quality score, organic traffic estimate (by page type), conversion rate, average order value, estimated monthly/annual revenue.
- **Revenue at Risk**: Real page-signal-based risk calculation (title, meta description, canonical, H1, schema, viewport, word count, image dimensions, internal links, server timing, security headers). No hardcoded traffic values.
- **ROI Analysis**: Fix effort estimation, fix cost at $150/hr, annual ROI percentage, break-even days, fix recommendation.
- **Quarterly Projections**: Q1–Q4 revenue at risk with compounding loss visualization.
- **Priority Action Plan**: Ranked issues by impact with revenue impact per issue.
- **Traffic Estimates**: Monthly/annual visits, traffic loss risk by severity, recovery potential.
- **Competitive Loss**: Share of voice loss, position drop risk, click share loss, dollar impact of position drops.
- **Cost-Benefit Summary**: Annual/monthly/weekly/daily loss rates, break-even analysis, recommended action.

---

### Level 15: Passage Vector & Cosine Similarity Profiler

**Sub-functions:** `vectorSimilarity`, `passageSimilarity`, `passageEntityFlow`, `headings`, `headingDrift`, `headingContentAlignment`, `sectionEntityConsistency`, `bigramPassageDensity`, `entityTransitionMap`, `documentDistance`, `contentClusters`

Ensures topical coherence across all passages:

- **Passage Similarity**: Splits content into word-based passages, computes entity overlap with primary entities, flags low-similarity passages.
- **Entity Flow Tracking**: Tracks entity appearance across passages, detects abrupt transitions.
- **Heading Drift Analysis**: Compares heading text tokens against primary entity tokens, flags high-drift headings.
- **Heading-Content Alignment**: Checks that content under each heading shares token overlap with the heading.
- **Section Entity Consistency**: Sliding window analysis of entity consistency across sentences.
- **Bigram Density**: Per-passage bigram repetition ratio — flags repetitive/templated sections.
- **Content Clustering**: K-means-like clustering of passage similarity scores, detects orphan clusters.
- **Document Distance**: Average similarity, min/max, standard deviation, drift visualization.

---

### Level 16: Third-Party Consensus & Entity Alignment Scorer

**Sub-functions:** `extractedEntities`, `namedEntities`, `entityConsensus`, `consensusSummary`, `externalLinks`, `citationQuality`, `citationFormatting`, `knowledgePanelReadiness`, `factualClaims`, `contradictoryClaims`, `consensusScore`, `trustLevel`

Measures how well your page's entities align with established knowledge:

- **Entity Consensus**: For each primary entity, checks self-mentions, external content references, computes consensus ratio and level (strong/moderate/weak).
- **Citation Quality**: External outbound link analysis, authoritative domain ratio (.edu, .gov, research), citation formatting.
- **Knowledge Panel Readiness**: Organization/Person schema, logo, social profiles, site name — schema completeness score.
- **Factual Claims**: Extracts percentages, monetary values, years. Verifies which claims are backed by consensus.
- **Contradictory Claims**: Flags unverifiable or contradictory factual claims.
- **Consensus Score**: Composite score combining entity consensus, citation quality, knowledge panel readiness, and formatting.

---

### Level 17: Autonomous Sandbox Rollback Simulator & Fix Validator

**Sub-functions:** `schemas`, `headings`, `canonical`, `autoFixes`, `diagWorkflow`

Generates auto-fix code for common SEO issues:

- **Schema Auto-Fix**: For invalid/missing schemas, generates corrected JSON-LD with validation test code.
- **Heading Hierarchy Fix**: For skipped heading levels or missing H1, generates corrected heading markup with hierarchy test code.
- **Canonical Fix**: For missing/broken canonicals, generates corrected link tags.
- **Diagnostic Workflow**: Creates a sandbox validation workflow with pre-conditions, fixes, and post-condition checks.
- **Auto-Fix Registry**: All generated fixes with code, description, risk assessment, and rollback plan.

---

### Level 18: Zero-Click & Agentic Commerce Visibility Metrics

**Sub-functions:** `serpVolatility`, `contentStructure`, `readability`, `aiOverviewReadiness`, `featuredSnippet`, `estimatedCTR`, `commerceAudit`, `mentionShare`, `entityProminence`, `entityCountForAI`, `visibilityShare`

Prepares your page for the AI-powered search future:

- **SERP Volatility**: Real page-derived volatility score (no fake date/ranking arrays).
- **AI Overview Readiness**: Question-answer format detection, structured list analysis, comparison tables, definition statements, content length optimization, readability optimization, heading structure.
- **Featured Snippet Optimization**: Paragraph length analysis, list/table suitability, question format, definition clarity.
- **Zero-Click CTR Estimation**: With and without zero-click features, uplift calculation.
- **Agentic Commerce Audit**: Product detection (heuristic + schema), price/availability completeness, add-to-cart detection, cart/checkout navigation.
- **Brand Mention Share**: Real brand term mentions in content, share of voice.
- **Entity Prominence**: Knowledge graph entity extraction with count-based prominence.

---

### Level 19: Self-Healing Edge Config & Canary Deployment Safety

**Sub-functions:** `edgeConfig`, `generatedEdgeWorkerScript`, `canaryDeployment`, `rollbackTriggers`, `errorBudget`, `deploymentChecklist`

For enterprise SEO operations:

- **Edge Worker Script Generation**: Generates deployable edge worker code (Cloudflare Workers, Akamai EdgeWorkers, Fastly Compute@Edge) that:
  - Self-corrects missing canonicals.
  - Injects missing schemas.
  - Fixes truncating titles.
  - Handles 404 → 301 redirects.
  - Upgrades HTTP → HTTPS.
  - Manages noindex tags.
  - Collapses URL parameters.
  - Fixes hreflang annotations.
- **Canary Deployment Config**: Progressive rollout percentages (5% → 25% → 50% → 100%), watch durations, auto-rollback thresholds.
- **Rollback Triggers**: Impression drop, CTR drop, position drop, crawl error spike, Core Web Vitals regression.
- **Error Budget Monitoring**: Monthly budget with burn rate tracking.
- **Deployment Checklist**: Pre-flight, validation, monitoring, and rollback procedures.

---

### Level 20: Adversarial Red Team & Prompt Injection Audit

**Sub-functions:** `redTeamResults`, `injectionTypes`, `hallucinationTriggers`, `jailbreakPatterns`, `dataExtraction`, `injectionRiskScore`, `vulnerableFields`

Security testing for LLM-powered search:

- **Prompt Injection Testing**: Tests common injection patterns on page content (ignore previous instructions, system prompt override, roleplay scenarios).
- **Output Manipulation**: Checks if content can be manipulated to produce misleading outputs.
- **Hallucination Triggers**: Detects patterns that may cause LLMs to hallucinate (false claims, unverifiable statements, fabricated data).
- **Jailbreak Patterns**: Tests for DAN (Do Anything Now) and similar jailbreak techniques.
- **Data Extraction Attempts**: Checks if sensitive data (emails, API keys, internal URLs) is exposed to injection.
- **Injection Risk Score**: Composite score (0–100) with vulnerable field identification.

---

### Level 21: Site-Wide Risk Aggregation & Executive Dashboard

**Sub-functions:** `pages`, `siteWideRisk`, `riskDistribution`, `portfolioScores`, `executiveSummary`, `kpiDashboard`, `benchmarkComparison`

The meta-analysis level — requires multiple page results:

- **Site-Wide Risk**: `calculateSiteWideRisk` aggregates scores across all audited pages, computes risk level, distribution metrics.
- **Risk Distribution**: Score histogram (0–20, 21–40, 41–60, 61–80, 81–100) across all pages.
- **Portfolio Scores**: Average, median, min, max, standard deviation of page scores.
- **Executive Summary**: Overall health rating, critical page count, top site-wide issues, recommended priorities.
- **KPI Dashboard**: Average score, total issues, pages needing attention, top patterns.
- **Benchmark Comparison**: Compares against industry segments for context.

---

## API Reference

### `POST /api/audit`

Runs a full 21-level audit on a URL.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "overallScore": 72,
  "levels": [
    {
      "level": 1,
      "name": "Core Hygiene & Technical Baseline",
      "score": 68,
      "issues": [
        {
          "severity": "warning",
          "impact": "medium",
          "message": "Title may truncate in SERPs: 620px/72 bytes (safe limit: 580px / ~60 chars)",
          "element": "title",
          "evidence": "Pixel width 620px, safe limit 580px",
          "recommendation": "Shorten to 50-55 chars. Front-load primary keyword."
        }
      ],
      "data": {
        "titleAnalysis": { ... },
        "metaDescription": { ... },
        "viewport": { ... }
      }
    }
  ],
  "summary": {
    "criticalIssues": 2,
    "warnings": 14,
    "info": 8,
    "topFixes": 10
  },
  "duration": "12.4"
}
```

### `POST /api/export-pdf`

Generates a PDF from audit result HTML.

**Request Body:**
```json
{
  "html": "<html>...</html>"
}
```

**Response:** Binary PDF file (`application/pdf`).

### `GET /api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-07-23T12:00:00.000Z"
}
```

---

## Helper Functions Library

Located in `helpers.js`, this module contains **60+ standalone analysis functions** used across all 21 levels. Key categories:

### Scoring & Utility
- `sc(penalty)` — Convert penalty to 0–100 score
- `byteLen(string)`, `pxWidth(string)` — Length measurement
- `sel($, element)`, `cssEscape(string)` — Selector generation
- `syllables(word)`, `fleschKincaid(text)`, `countSyllables(word)` — Readability

### Content Analysis
- `countWords(text)`, `stripHtml(html)` — Text extraction
- `getTextContent($)`, `extractEntities(text)` — Content parsing
- `analyzeReadability(text)`, `analyzeReadabilityAdvanced(text)` — Readability
- `analyzeKeywordDensity(text)`, `analyzeBigrams(text)` — Keyword analysis
- `analyzeContentStructure(text)`, `analyzeTransitionWords(text)` — Structure
- `detectContentQualityFlags(text)`, `analyzeNLP(text)` — Quality

### Entity & Knowledge Graph
- `extractKnowledgeGraphEntities(text)` — KG entity extraction
- `extractAllMentions(text, terms)` — Term mention counting
- `crossReferenceEntityConsensus(entityText, pageContent, externalContent)` — Entity consensus

### Schema & HTML Analysis
- `extractSchemas($)`, `analyzeSchema($)`, `validateSchemaComprehensive($)` — Schema validation
- `analyzeTitlePrecision($, url)` — Title analysis
- `analyzeHeadingHierarchy($)` — Heading structure
- `analyzeCanonicalIntegrity($, url)` — Canonical tags
- `analyzeMediaOptimization($)` — Images/video/media

### SEO & Performance
- `analyzeHttpHeaders(headers)` — HTTP security headers
- `analyzeInternalLinks($, url)` — Internal link analysis
- `ssrVsCsrDiff(rawHtml, renderedHtml)` — JS rendering diff
- `analyzeDomDepth($)` — DOM complexity
- `analyzeCoreWebVitals(metrics)` — CWV simulation

### Advanced Analysis
- `analyzeSerpVolatility(pageContent, pageFeatures)` — SERP volatility
- `calculateQualityThresholds(content)` — Quality scoring
- `calculateRevenueAtRisk(metrics)` — Revenue impact
- `passageVectorSim(text, queries)` — Passage similarity
- `ragChunkSimulator(text)` — RAG readiness
- `simulateLLMCitation(text, query)` — LLM citation simulation
- `directAnswerScorer(question, pageContent)` — Direct answer scoring

### Agentic & Security
- `analyzeSyntheticAgentBehavior(text)` — Agent simulation
- `agenticCommerceAudit($)` — Commerce readiness
- `redTeamTest(url)` — Prompt injection testing
- `selfHealingEdgeScript(url)` — Edge config generation

### Generation & Formatting
- `generateSchemaCode(type, data)` — Schema code generation
- `generateMetaOptions(title, desc, keywords)` — Meta tag generation
- `generateAutonomousFix(issue, pageType)` — Auto-fix generation
- `formatJiraTicket(findings)` — Jira ticket formatting
- `generateEdgeWorkerCode(rule)` — Edge worker generation

---

## Technologies Used

| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime environment (v18+) |
| **Express 5** | Web server & REST API framework |
| **Cheerio 1.x** | Server-side DOM parsing (jQuery-like API) |
| **Puppeteer 25.x** | Headless Chrome for JS rendering & performance metrics |
| **node-fetch 2.x** | Raw HTML fetching (pre-JS) |
| **compromise** | NLP for entity extraction & text analysis |
| **winston** | Logging |
| **helmet** | Security headers |
| **compression** | Response compression (gzip) |
| **express-rate-limit** | API rate limiting |
| **cors** | Cross-origin resource sharing |
| **uuid** | Unique ID generation |
| **terser** | JavaScript minification |
| **schema-dts** | TypeScript types for schema.org |

### Frontend (no build step, vanilla JS)
- **CSS3** with custom properties, animations, glassmorphism design
- **Vanilla JavaScript** (ES6+) for dynamic UI
- **Canvas/SVG** for score visualization
- **Responsive design** (mobile-first)

---

## Project Structure

```
Complete-On-Page-SEO/
├── README.md                       # This file
├── .gitignore
├── seo-audit-tool/                 # Main project directory
│   ├── package.json                # Dependencies & scripts
│   ├── package-lock.json
│   ├── server.js                   # Express server, Puppeteer orchestration, API routes
│   ├── helpers.js                  # 60+ analysis helper functions
│   ├── levels.js                   # 21 level analysis functions
│   ├── public/
│   │   ├── index.html              # Single-page application UI
│   │   ├── css/                    # Stylesheets
│   │   ├── js/                     # Client-side JavaScript
│   │   └── assets/                 # Images, icons
│   └── src/
│       ├── engines/                # (extensible) Analysis engine modules
│       ├── routes/                 # (extensible) Additional API routes
│       └── utils/                  # (extensible) Utility modules
└── .gitignore
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
- Check `server_log.txt` for full error details.

---

## FAQ

**Q: Does this tool crawl my entire site?**  
A: No. It analyzes a single URL per request. For site-wide analysis, run multiple audits and use Level 21 (Site-Wide Risk Aggregation) via the API.

**Q: Does it work on SPAs (React, Angular, Vue)?**  
A: Yes. Puppeteer renders JavaScript before analysis. Level 2 specifically compares SSR vs CSR to detect JS-dependent content.

**Q: Are the scores comparable across different pages?**  
A: Yes. Each level uses a consistent 0–100 scoring methodology. The overall score is the average of all 21 levels.

**Q: Can I run this on localhost/staging URLs?**  
A: Yes, as long as the server running SEO Audit 360 can reach the target URL. Local servers work if they're on the same network.

**Q: Does it store audit results?**  
A: No. This is a real-time analysis tool. Results are returned in the API response and rendered in the browser. No database is used.

**Q: How long does an audit take?**  
A: Typically 5–20 seconds depending on page complexity, JS execution time, and network latency.

---

## Roadmap

- [ ] **Multi-page crawling** — Spider entire sites with configurable depth
- [ ] **Historical tracking** — Store results and track score changes over time
- [ ] **Competitor comparison** — Compare audit results across domains
- [ ] **Scheduled audits** — Cron-based periodic analysis with email reports
- [ ] **API client libraries** — JavaScript, Python, and Go SDKs
- [ ] **Integration plugins** — WordPress, Shopify, Webflow, Contentful
- [ ] **Custom level creation** — DSL for authoring new analysis levels
- [ ] **Real-time WebSocket streaming** — Live audit progress without polling
- [ ] **Mobile app** — iOS/Android companion for on-the-go audits
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

### Code Style

- 2-space indentation.
- Single quotes for strings.
- Semicolons required.
- No JSDoc required but use descriptive variable names.
- Favor `const` over `let`; avoid `var`.
- Use early returns and guard clauses.

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
  <strong>SEO Deep Audit 360</strong> — Complete On-Page SEO Analysis Engine
  <br>
  Built with ❤️ for the SEO community
</div>
