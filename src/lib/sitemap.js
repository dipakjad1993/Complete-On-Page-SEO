/**
 * Sitemap + robots.txt utilities: sitemap index expansion, robots Sitemap: discovery,
 * AI-bot parsing (GPTBot, PerplexityBot, ClaudeBot, CCBot, Bytespider...).
 * All fetches are SSRF-safe (caller must assertPublicUrl first) with timeouts.
 * @module src/lib/sitemap
 */

/** Parse robots.txt into { sitemaps, disallows, aiBotRules } without fetching. */
function parseRobots(txt) {
  const lines = String(txt || '').split(/\r?\n/);
  const sitemaps = [];
  /** @type {Array<{ua:string,path:string}>} */
  const disallows = [];
  /** @type {Record<string,{disallow:string[],allow:string[]}>} */
  const aiBotRules = {};
  let currentUAs = [];
  let wildcardApplies = false;
  const AI_BOTS = [
    'gptbot',
    'chatgpt-user',
    'oai-searchbot',
    'perplexitybot',
    'perplexity-user',
    'claudebot',
    'claude-searchbot',
    'claude-user',
    'ccbot',
    'bytespider',
    'google-extended',
    'applebot',
    'applebot-extended',
    'cohere-ai',
    'youbot',
    'dify',
    'meta-ai',
    'amazonbot'
  ];
  for (const raw of lines) {
    const line = raw.split('#')[0].trim();
    if (!line) {
      currentUAs = [];
      continue;
    }
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) {
      continue;
    }
    const field = m[1].toLowerCase();
    const value = m[2].trim();
    if (field === 'user-agent') {
      currentUAs = [value.toLowerCase()];
    } else if (field === 'sitemap') {
      if (value) {
        sitemaps.push(value);
      }
    } else if (field === 'disallow' || field === 'allow') {
      for (const ua of currentUAs.length ? currentUAs : ['*']) {
        disallows.push({ ua, path: value, rule: field });
        if (AI_BOTS.includes(ua)) {
          aiBotRules[ua] = aiBotRules[ua] || { disallow: [], allow: [] };
          aiBotRules[ua][field === 'disallow' ? 'disallow' : 'allow'].push(value);
        }
        if (ua === '*') {
          // wildcard applies to AI bots unless overridden — wildcard fallback noted in docs
          wildcardApplies = true;
        }
      }
    }
  }
  return { sitemaps, disallows, aiBotRules, wildcardApplies };
}

/** Extract <loc> URLs from a sitemap or sitemap-index XML string (capped). */
function parseSitemapXml(xml, cap = 500) {
  const out = [];
  const re = /<loc>\s*([^<>\s]+)\s*<\/loc>/gi;
  let m;
  while ((m = re.exec(String(xml || ''))) && out.length < cap) {
    out.push(m[1].trim());
  }
  return out;
}

function isSitemapIndex(xml) {
  return /<sitemapindex[\s>]/i.test(String(xml || ''));
}

module.exports = { parseRobots, parseSitemapXml, isSitemapIndex };
