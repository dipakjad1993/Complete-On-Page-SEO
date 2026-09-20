/**
 * Level 22 — AI-Search Readiness: llms.txt / robots-ai / MCP surface.
 * NEW in 1.3.0. Pure function of ($, headers, origin, robotsTxt, llmsTxt).
 * Real measured data only: every check reports found/missing + evidence.
 * Never invents LLM inference — labels heuristics explicitly.
 * @module src/levels/level22
 */
const { sc } = require('../../helpers');

const AI_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'CCBot',
  'Bytespider',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'Amazonbot',
  'Cohere-ai',
  'YouBot'
];

// Google May 2026 AI Optimization Guide: retrieval/search bots drive citations;
// training opt-outs do NOT remove pages from AI Overviews / AI Mode.
const RETRIEVAL_BOTS = ['OAI-SearchBot', 'PerplexityBot', 'Perplexity-User', 'Claude-SearchBot', 'ChatGPT-User', 'Claude-User', 'YouBot'];
const TRAINING_BOTS = ['GPTBot', 'ClaudeBot', 'CCBot', 'Bytespider', 'Google-Extended', 'Applebot-Extended', 'Applebot', 'Amazonbot', 'Cohere-ai'];

function level22($, finalUrl, _cfg = {}, net = {}) {
  let p = 0;
  const issues = [];
  const { responseHeaders = {}, robotsTxt = '', llmsTxt = null, sitemapUrls = [] } = net;
  const toLowerHeaders = {};
  for (const [k, v] of Object.entries(responseHeaders || {})) {
    toLowerHeaders[String(k).toLowerCase()] = v;
  }

  // --- 1. llms.txt presence + quality ---
  let llmsStatus = 'missing';
  let llmsBytes = 0;
  const llmsHints = [];
  if (llmsTxt && typeof llmsTxt.text === 'string' && llmsTxt.status === 200 && llmsTxt.text.length > 50) {
    llmsStatus = 'found';
    llmsBytes = Buffer.byteLength(llmsTxt.text, 'utf8');
    const t = llmsTxt.text;
    if (/#\s+\S+/.test(t)) {
      llmsHints.push('has-markdown-headings');
    }
    if (/https?:\/\//.test(t)) {
      llmsHints.push('has-absolute-links');
    }
    if (t.length > 5000) {
      llmsHints.push('rich-context');
    }
    if (/contact|support|docs|api/i.test(t)) {
      llmsHints.push('navigational-aids');
    }
  } else if (llmsTxt && llmsTxt.status === 200) {
    llmsStatus = 'thin';
    p += 18;
    issues.push({
      severity: 'warning',
      impact: 'medium',
      message: 'llms.txt exists but is too thin (<50 chars) to help AI answers.',
      element: '/llms.txt',
      fix: 'Publish a real llms.txt: title, summary, key URLs, docs/API links, contact.',
      evidence: 'status=200 bytes=' + (llmsTxt.text || '').length
    });
  } else {
    // Google Search Central (June 15 2026): Google does not use llms.txt for
    // AI Overviews / AI Mode. ~97% of llms.txt get zero hits (Ahrefs May 2026).
    // Keep as informational dev-docs signal (Cursor/Copilot), not a ranking factor.
    p += 4;
    issues.push({
      severity: 'info',
      impact: 'low',
      message: 'No llms.txt — informational only: Google does not use it for AI citations (May 2026 guide). Useful for dev-docs assistants (Cursor/Copilot), not for ranking.',
      element: '/llms.txt',
      fix: 'Optional: add /llms.txt (markdown: brand summary + top 20 URLs + docs + contact) for coding assistants. Do not expect citation lift. See https://llmstxt.org/.',
      evidence: 'status=' + ((llmsTxt && llmsTxt.status) || '404')
    });
  }

  // --- 2. robots.txt AI-bot rules ---
  const robotsLower = String(robotsTxt || '').toLowerCase();
  const mentionedBots = AI_BOTS.filter((b) => robotsLower.includes(b.toLowerCase()));
  const wildcardBlock = /(^|\n)\s*user-agent\s*:\s*\*\s*\n(\s*[^\n]*\n)*?\s*disallow\s*:\s*\/(\s|$)/i.test(String(robotsTxt || ''));
  const blockedBots = [];
  for (const b of AI_BOTS) {
    const re = new RegExp(
      'user-agent\\s*:\\s*' + b.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\s*\\n(\\s*[^\\n]*\\n)*?\\s*disallow\\s*:\\s*/(\\s|$)',
      'i'
    );
    if (re.test(String(robotsTxt || ''))) {
      blockedBots.push(b);
    }
  }
  const blockedRetrieval = blockedBots.filter((b) => RETRIEVAL_BOTS.includes(b));
  const blockedTraining = blockedBots.filter((b) => TRAINING_BOTS.includes(b) && !RETRIEVAL_BOTS.includes(b));
  if (blockedRetrieval.length) {
    p += 18;
    issues.push({
      severity: 'critical',
      impact: 'high',
      message: 'robots.txt blocks AI retrieval bots: ' + blockedRetrieval.join(', ') + ' — page cannot be cited by those AI answers.',
      element: 'robots.txt',
      fix: 'If AI citations matter, Allow retrieval bots (OAI-SearchBot, PerplexityBot, Claude-SearchBot) explicitly. If intentional (paywall), keep + note it.',
      evidence: blockedRetrieval.join(',')
    });
  }
  if (blockedTraining.length) {
    issues.push({
      severity: 'info',
      impact: 'low',
      message: 'robots.txt blocks training opt-outs: ' + blockedTraining.join(', ') + ' — this only opts out of training data, NOT AI Overviews/citations (which use retrieval bots).',
      element: 'robots.txt',
      fix: 'No citation impact. Keep if you want training opt-out; to remove from AI Overviews use Search Console toggle, not robots.txt.',
      evidence: blockedTraining.join(',')
    });
  }
  if (!blockedBots.length && !mentionedBots.length && robotsTxt) {
    issues.push({
      severity: 'info',
      impact: 'low',
      message:
        'robots.txt has no AI-bot rules — crawlers fall back to User-agent: *. Add explicit OAI-SearchBot/PerplexityBot/Claude-SearchBot lines to be deliberate.',
      element: 'robots.txt',
      fix: 'Add explicit AI retrieval-bot Allow lines so future policy changes are intentional. Training opt-outs (GPTBot/CCBot/Google-Extended) do not affect citations.',
      evidence: 'no-ai-bot-user-agent'
    });
  }

  // --- 3. Canonical + titles for citation (reuse DOM) ---
  const title = ($('title').first().text() || '').trim();
  const desc = ($('meta[name="description"]').attr('content') || '').trim();
  const canonical = ($('link[rel="canonical"]').attr('href') || '').trim();
  if (!title) {
    p += 12;
    issues.push({
      severity: 'critical',
      impact: 'high',
      message: 'Missing <title> — AI citations have nothing quotable.',
      element: 'head>title',
      fix: 'Add a unique 30-60 char title naming the entity + topic.',
      evidence: 'empty'
    });
  }
  if (!desc) {
    p += 6;
    issues.push({
      severity: 'warning',
      impact: 'medium',
      message: 'Missing meta description — AI Overviews prefer pages with a clean summary.',
      element: 'meta[name=description]',
      fix: 'Add a 120-155 char factual summary.',
      evidence: 'empty'
    });
  }
  if (!canonical) {
    p += 5;
    issues.push({
      severity: 'info',
      impact: 'low',
      message: 'No canonical — AI engines may cite a duplicate URL variant.',
      element: 'link[rel=canonical]',
      fix: 'Add absolute canonical to ' + finalUrl,
      evidence: 'missing'
    });
  }

  // --- 4. Structured data for AI answers ---
  let ldCount = 0;
  $('script[type="application/ld+json"]').each(function () {
    ldCount++;
  });
  if (!ldCount) {
    p += 8;
    issues.push({
      severity: 'warning',
      impact: 'medium',
      message: 'No JSON-LD — AI answers ground better on typed entities.',
      element: 'script[type=ld+json]',
      fix: 'Emit Organization/Article/Product/FAQ schema matching visible content.',
      evidence: '0 blocks'
    });
  }

  // --- 5. Direct-answer surface (first 100 words contain a definitional sentence?) ---
  const bodyText = ($('body').text() || '').replace(/\s+/g, ' ').trim();
  const lead = bodyText.slice(0, 600);
  const hasDefinition =
    /^[A-Z][^.!?]{10,200}\s+is\s+[^.!?]{10,200}[.!?]/m.test(lead) || /what is|how to|definition/i.test(lead.slice(0, 300));
  if (!hasDefinition && bodyText.split(/\s+/).length > 100) {
    p += 4;
    issues.push({
      severity: 'info',
      impact: 'low',
      message: 'No definitional lead sentence in first 600 chars — AI extractors prefer a quotable "X is …" opener.',
      element: 'body>p:first',
      fix: 'Open with one factual definitional sentence (entity + what it is + scope).',
      evidence: lead.slice(0, 120)
    });
  }

  const score = sc(p);
  return {
    level: 22,
    name: 'AI-Search Readiness: llms.txt, Robots-AI & Citation Surface',
    score,
    issues,
    data: {
      llmsTxt: {
        status: llmsStatus,
        bytes: llmsBytes,
        hints: llmsHints,
        dataSource: 'live GET /llms.txt (SSRF-guarded, 8s timeout)',
        note: 'Informational only per Google May 2026 guide: Google does not use llms.txt for AI Overviews/Mode. Value is for dev-docs assistants (Cursor/Copilot).'
      },
      robotsAi: {
        mentionedBots,
        blockedBots,
        blockedRetrieval,
        blockedTraining,
        retrievalBots: RETRIEVAL_BOTS,
        trainingBots: TRAINING_BOTS,
        wildcardBlocksAll: wildcardBlock,
        dataSource: 'live GET /robots.txt'
      },
      citationSurface: {
        titleLen: title.length,
        hasDescription: !!desc,
        hasCanonical: !!canonical,
        jsonLdBlocks: ldCount,
        hasDefinitionalLead: !!hasDefinition
      },
      aiCrawlersChecked: AI_BOTS,
      sitemapHint: { urlsSeen: (sitemapUrls || []).length, dataSource: 'robots Sitemap: + /sitemap.xml probe' },
      honesty: 'Heuristic surface audit only — no real LLM was queried; citation likelihood is structural, not conversational. llms.txt + training-bot blocks do not drive Google citations.'
    }
  };
}

module.exports = { level22, AI_BOTS, RETRIEVAL_BOTS, TRAINING_BOTS };
