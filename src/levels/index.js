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

// Weighted scoring: money + crawl truth outweigh dev-tooling.
// L1/L2/L3/L8/L12 = 1.5x (foundation), L5/L13/L17/L19 = 0.7x (dev-cluster),
// all others 1.0x. overallScore (mean) kept for compat; weightedScore is primary.
const LEVEL_WEIGHTS = {
  1: 1.5,
  2: 1.5,
  3: 1.5,
  4: 1.2,
  5: 0.7,
  6: 1.0,
  7: 1.0,
  8: 1.5,
  9: 0.8,
  10: 1.0,
  11: 1.0,
  12: 1.5,
  13: 0.7,
  14: 1.2,
  15: 1.0,
  16: 1.0,
  17: 0.7,
  18: 1.2,
  19: 0.7,
  20: 1.0,
  21: 1.0,
  22: 1.2
};

function computeWeightedScore(levels) {
  let num = 0;
  let den = 0;
  for (const l of levels || []) {
    const w = LEVEL_WEIGHTS[l.level] || 1.0;
    num += (l.score || 0) * w;
    den += w;
  }
  return den ? Math.round(num / den) : 0;
}

// Zero-click brand value: cited brands earn ~35% more organic clicks
// (2026 AIO studies) even on zero-click SERPs. Labeled assumption, $0 without GA4 inputs.
function zeroClickBrandValue({ monthlyTraffic = 0, avgOrderValue = 0, conversionRate = 0, citationLift = 0.35 } = {}) {
  const t = Number(monthlyTraffic) || 0;
  const aov = Number(avgOrderValue) || 0;
  const cvr = (Number(conversionRate) || 0) / 100;
  if (!t || !aov || !cvr) {
    return { monthlyBrandValue: 0, hasRealInputs: false, note: '$0 without GA4 inputs (monthlyTraffic+avgOrderValue+conversionRate required)' };
  }
  const baseRevenue = t * aov * cvr;
  return {
    monthlyBrandValue: Math.round(baseRevenue * citationLift),
    hasRealInputs: true,
    note: 'Assumption: cited-in-AI brand lift 35% (2026 meta-analyses). Structural estimate, not measured clicks.'
  };
}

module.exports = { ...legacy, level22, LEVEL_NAMES, LEVEL_WEIGHTS, computeWeightedScore, zeroClickBrandValue };
