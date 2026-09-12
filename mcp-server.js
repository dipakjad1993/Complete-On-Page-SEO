#!/usr/bin/env node
/**
 * MCP server — exposes the audit engine to Claude/Cursor/Copilot as tools.
 * Stdio transport, zero new deps (plain JSON-RPC over stdio).
 * Tools: audit_url, get_level_info, check_ai_readiness, get_crux, crawl_site.
 * Run: node mcp-server.js   (configure in Claude Desktop / Cursor MCP settings)
 */
const { assertPublicUrl, normaliseUserUrl } = require('./src/middleware/ssrf');

const API = (process.env.SEO_API || 'http://localhost:3000').replace(/\/$/, '');

async function apiPost(path, body) {
  const r = await fetch(API + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(180000)
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    throw new Error(j.error || 'HTTP ' + r.status);
  }
  return j;
}
async function apiGet(path) {
  const r = await fetch(API + path, { signal: AbortSignal.timeout(60000) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    throw new Error(j.error || 'HTTP ' + r.status);
  }
  return j;
}

const TOOLS = [
  {
    name: 'audit_url',
    description: 'Run the full 22-level SEO + AI-search audit on a public URL. Returns overall score, per-level scores and issue counts.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        keywords: { type: 'string' },
        monthlyTraffic: { type: 'number' },
        avgOrderValue: { type: 'number' },
        conversionRate: { type: 'number' }
      },
      required: ['url']
    }
  },
  {
    name: 'get_level_info',
    description: 'List the 22 audit levels and what each measures.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'check_ai_readiness',
    description: 'Check llms.txt + robots-ai + citation surface (Level 22) for a URL. Fast, no full audit.',
    inputSchema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] }
  },
  {
    name: 'get_crux',
    description: 'Real CrUX/PageSpeed field data (LCP/INP/CLS) for a URL.',
    inputSchema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] }
  },
  {
    name: 'crawl_site',
    description: 'Same-origin BFS crawl (up to 25 pages) + sitemap discovery.',
    inputSchema: { type: 'object', properties: { startUrl: { type: 'string' }, maxPages: { type: 'number' } }, required: ['startUrl'] }
  }
];

const LEVELS = [
  'L1 Core Hygiene & Technical Baseline',
  'L2 DOM Reality, Rendering & Structural Diagnostics',
  'L3 Semantic Architecture, Entities & Information Gain',
  'L4 Generative Search, LLM & RAG Visibility',
  'L5 Dev Automation & Auto-Fix Generation',
  'L6 Edge Computing & Serverless Integration',
  'L7 Multi-Modal Content & Spatial Asset Auditing',
  'L8 Predictive SERP Volatility & Algorithm Impact',
  'L9 SEO A/B Testing & Rollback Safety',
  'L10 Bot Behavior Mapping & Log Config Templates',
  'L11 Synthetic Content & LLM Visibility Heuristics',
  'L12 Algorithmic Quality & Helpful-Content Classifier',
  'L13 Edge-Native Patching & CI/CD Gatekeeping',
  'L14 Financial Attribution - Single-Page ROI',
  'L15 Passage Vector & Cosine Similarity Profiler',
  'L16 Third-Party Consensus & Entity Alignment',
  'L17 Autonomous Fix Generator & Red-Team Checks',
  'L18 Zero-Click & Agentic Commerce Visibility',
  'L19 Edge Orchestration & Canary Safety',
  'L20 Adversarial Checks & Security Headers',
  'L21 Site-Wide Risk Aggregation & Executive Rollup',
  'L22 AI-Search Readiness (llms.txt/robots-ai/citation)'
];

async function callTool(name, args) {
  if (name === 'get_level_info') {
    return { levels: LEVELS, count: 22, honesty: 'All metrics are measured from the live page; unmeasurable values return null/N/A.' };
  }
  if (name === 'audit_url') {
    const url = await assertPublicUrl(normaliseUserUrl(args.url));
    const cfg = {};
    for (const k of ['keywords', 'monthlyTraffic', 'avgOrderValue', 'conversionRate']) {
      if (args[k] != null) {
        cfg[k] = args[k];
      }
    }
    const full = await apiPost('/api/audit', { url, config: cfg });
    return {
      url: full.url,
      overallScore: full.overallScore,
      duration: full.duration,
      summary: full.summary,
      levels: (full.levels || []).map((l) => ({ level: l.level, name: l.name, score: l.score, issues: (l.issues || []).length }))
    };
  }
  if (name === 'check_ai_readiness') {
    const url = await assertPublicUrl(normaliseUserUrl(args.url));
    const full = await apiPost('/api/audit', { url });
    const l22 = (full.levels || []).find((l) => l.level === 22);
    return l22 || { error: 'Level 22 missing from audit response' };
  }
  if (name === 'get_crux') {
    const url = await assertPublicUrl(normaliseUserUrl(args.url));
    return apiGet('/api/crux?url=' + encodeURIComponent(url));
  }
  if (name === 'crawl_site') {
    const startUrl = await assertPublicUrl(normaliseUserUrl(args.startUrl));
    return apiPost('/api/crawl', { startUrl, maxPages: Math.min(25, Math.max(1, args.maxPages || 10)) });
  }
  throw new Error('Unknown tool: ' + name);
}

// --- Minimal JSON-RPC stdio loop (MCP-compatible: initialize/tools.list/tools.call) ---
let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', async (chunk) => {
  buffer += chunk;
  let idx;
  while ((idx = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) {
      continue;
    }
    let msg;
    try {
      msg = JSON.parse(line);
    } catch {
      continue;
    }
    const { id, method, params } = msg;
    const reply = (result, error) => {
      const out = { jsonrpc: '2.0', id };
      if (error) {
        out.error = { code: -32000, message: String(error.message || error) };
      } else {
        out.result = result;
      }
      process.stdout.write(JSON.stringify(out) + '\n');
    };
    try {
      if (method === 'initialize') {
        reply({
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: { name: 'complete-on-page-seo', version: '1.3.0' }
        });
      } else if (method === 'tools/list') {
        reply({ tools: TOOLS });
      } else if (method === 'tools/call') {
        reply({ content: [{ type: 'text', text: JSON.stringify(await callTool(params.name, params.arguments || {}), null, 2) }] });
      } else {
        reply({ ok: true });
      }
    } catch (e) {
      reply(null, e);
    }
  }
});
