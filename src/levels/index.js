/**
 * Levels index — single import surface for the audit engine.
 * Legacy L1-L21 live in /levels.js (monolith, being split incrementally);
 * new levels live in /src/levels/*.js. This index keeps server.js clean
 * and is the seam for the ongoing monolith split.
 * @module src/levels/index
 */
const legacy = require('../../levels');
const { level22 } = require('./level22');

const LEVEL_NAMES = [
  'Core Hygiene & Technical Baseline',
  'DOM Reality, Rendering & Structural Diagnostics',
  'Semantic Architecture, Entities & Information Gain',
  'Generative Search, LLM & RAG Visibility (AEO/GEO)',
  'Dev Automation & Auto-Fix Generation',
  'Edge Computing & Serverless Worker Integration',
  'Multi-Modal Content & Spatial Asset Auditing',
  'Predictive SERP Volatility & Algorithm Impact Simulator',
  'SEO A/B Testing & Rollback Safety Guidance',
  'Bot Behavior Mapping & Log Config Templates',
  'Synthetic Content & LLM Visibility Heuristics',
  'Algorithmic Quality & Helpful-Content Classifier',
  'Edge-Native Patching & CI/CD Gatekeeping',
  'Financial Attribution - Single-Page ROI',
  'Passage Vector & Cosine Similarity Profiler',
  'Third-Party Consensus & Entity Alignment Scorer',
  'Autonomous Fix Generator & Red-Team Checks',
  'Zero-Click & Agentic Commerce Visibility Metrics',
  'Edge Orchestration & Canary Deployment Safety',
  'Adversarial Checks & Security Header Audit',
  'Site-Wide Risk Aggregation & Executive Rollup (Portfolio)',
  'AI-Search Readiness: llms.txt, Robots-AI & Citation Surface'
];

module.exports = { ...legacy, level22, LEVEL_NAMES };
