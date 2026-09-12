const express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { z } = require('zod');
const logger = require('./src/logger');
const { LruCache } = require('./src/cache');
const history = require('./src/history');
const { fetchCrux } = require('./src/lib/crux');
const { fetchText } = require('./src/lib/netfetch');
const { parseSitemapXml, isSitemapIndex } = require('./src/lib/sitemap');
const { requestId, notFound, errorHandler } = require('./src/middleware/errors');
// Single source of truth lives in src/middleware/ssrf.js (re-exported here
// so existing imports/tests keep working while routes share one guard).
const { isPrivateHostname, assertPublicUrl, normaliseUserUrl } = require('./src/middleware/ssrf');

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', { message: err && err.message, stack: err && err.stack });
});
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled rejection', { message: (err && err.message) || String(err) });
});

const app = express();
const PORT = process.env.PORT || 3000;
const APP_VERSION = require('./package.json').version || '1.3.0';
const STARTED_AT = Date.now();

app.use(compression());
app.use(requestId);
// CORS: restrict in production via ALLOWED_ORIGINS (comma-separated).
// Public demo default allows all origins so the SPA + curl work out of the box.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(cors(ALLOWED_ORIGINS.length ? { origin: ALLOWED_ORIGINS } : {}));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        scriptSrcAttr: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https:']
      }
    },
    // Extra hardening beyond the SPA CSP (1.3.0):
    hsts: { maxAge: 31536000, includeSubDomains: true },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h', etag: true, lastModified: true }));
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false }));

/* ===================== SSRF GUARD ===================== */
// Single source of truth: src/middleware/ssrf.js (imported above; re-exported for tests).
// Hardened in 1.3.0: CGNAT/TEST-NET blocks, decimal/octal IP tricks, credentialed-URL rejection.

// Input validation (zod) — keeps oversized / malformed payloads out of Puppeteer.
const configSchema = z
  .object({
    keywords: z.string().max(500).optional(),
    brand: z.string().max(120).optional(),
    pageType: z.string().max(40).optional(),
    userAgent: z.string().max(40).optional(),
    customUA: z.string().max(300).optional(),
    viewportWidth: z.number().int().min(320).max(3840).optional(),
    viewportHeight: z.number().int().min(320).max(2160).optional(),
    monthlyTraffic: z.number().min(0).max(1e12).optional(),
    avgOrderValue: z.number().min(0).max(1e9).optional(),
    conversionRate: z.number().min(0).max(100).optional(),
    sitemap: z.string().max(500).optional(),
    competitors: z.union([z.string().max(2000), z.array(z.string().max(500)).max(25)]).optional(),
    geo: z.string().max(4).optional(),
    currency: z.string().max(4).optional()
  })
  .passthrough();
const auditBodySchema = z.object({
  url: z.string().min(4).max(2000),
  config: configSchema.optional(),
  auditId: z.string().max(80).optional()
});
const urlOnlySchema = z.object({ url: z.string().min(4).max(2000) });

function parseBody(schema, body) {
  const r = schema.safeParse(body || {});
  if (!r.success) {
    const e = new Error(
      'Invalid request: ' +
        r.error.issues
          .slice(0, 3)
          .map((i) => i.path.join('.') + ' ' + i.message)
          .join('; ')
    );
    e.status = 400;
    throw e;
  }
  return r.data;
}

const {
  sc,
  byteLen,
  pxWidth,
  sel,
  syllables,
  fleschKincaid,
  extractSchemas,
  chunkText,
  analyzeSchema,
  detectAIPatterns,
  analyzeImage,
  analyzeLink,
  analyzeHeading,
  analyzeAccessibility,
  countWords,
  extractEntities,
  analyzeReadability,
  analyzeKeywordDensity
} = require('./helpers');

const {
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
  level11,
  level12,
  level13,
  level14,
  level15,
  level16,
  level17,
  level18,
  level19,
  level20,
  level21
} = require('./src/levels');
const { level22 } = require('./src/levels/level22');

const CHROME_PATH = process.env.CHROME_PATH || null;

async function launchBrowser() {
  const opts = {
    headless: 'new',
    args: [
      // --no-sandbox is required on Render's rootless containers (no user
      // namespaces). Avoid it for local dev running as root; prefer a
      // dedicated non-root chrome user with the default sandbox there.
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1920,1080',
      '--disable-extensions',
      '--disable-background-networking',
      '--disable-default-apps',
      '--disable-sync',
      '--disable-translate',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-first-run'
    ]
  };
  if (CHROME_PATH) opts.executablePath = CHROME_PATH;
  return puppeteer.launch(opts);
}

const MAX_HTML_BYTES = 5 * 1024 * 1024; // 5MB cap on raw HTML (OOM + slow-client protection)

async function fetchRawHtml(url, userAgent) {
  const ua = userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': ua,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      },
      redirect: 'follow'
    });
    clearTimeout(timeout);
    const headers = {};
    resp.headers.forEach((value, key) => {
      headers[key] = value;
    });
    const len = parseInt(resp.headers.get('content-length') || '0', 10);
    if (len > MAX_HTML_BYTES) throw new Error('Page too large (>5MB), refusing to buffer');
    const html = await resp.text();
    if (Buffer.byteLength(html, 'utf8') > MAX_HTML_BYTES) throw new Error('Page too large (>5MB), refusing to buffer');
    return {
      html,
      status: resp.status,
      headers,
      url: resp.url
    };
  } catch (e) {
    clearTimeout(timeout);
    throw new Error('Failed to fetch: ' + e.message);
  }
}

function isBlockedPage(html, $) {
  const title = ($ ? $('title').first().text() : '').trim().toLowerCase();
  const bodyText = ($ ? $('body').text() : '').trim().toLowerCase().substring(0, 500);
  return (
    title.includes('access denied') ||
    title.includes('blocked') ||
    title.includes('forbidden') ||
    title.includes('captcha') ||
    title.includes('security check') ||
    title.includes('please verify') ||
    bodyText.includes('access denied') ||
    bodyText.includes('you have been blocked') ||
    bodyText.includes('verify you are human') ||
    bodyText.includes('security check')
  );
}

/* ===================== REAL-TIME COMPETITOR DISCOVERY ===================== */

const COMP_SEARCH_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

// Domains that are never real on-page competitors (infra / social / search / docs / SEO tools / aggregators)
const COMP_SKIP_HOSTS = new Set([
  'google.com',
  'google.co.in',
  'google.co.uk',
  'google.de',
  'google.ca',
  'google.com.au',
  'googleapis.com',
  'youtube.com',
  'gmail.com',
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'x.com',
  'linkedin.com',
  'pinterest.com',
  'reddit.com',
  'tumblr.com',
  'tiktok.com',
  'snapchat.com',
  'whatsapp.com',
  'telegram.org',
  'wikipedia.org',
  'wikimedia.org',
  'wikidata.org',
  'archive.org',
  'github.com',
  'gitlab.com',
  'bitbucket.org',
  'cloudflare.com',
  'wordpress.org',
  'blogger.com',
  'medium.com',
  'w3.org',
  'mozilla.org',
  'schema.org',
  'stackoverflow.com',
  'quora.com',
  'imdb.com',
  'bing.com',
  'duckduckgo.com',
  'yahoo.com',
  'baidu.com',
  'yandex.com',
  'adobe.com',
  'microsoft.com',
  'apple.com',
  'netflix.com',
  'spotify.com',
  'twitch.tv',
  'aliexpress.com',
  'alibaba.com',
  'etsy.com',
  'craigslist.org',
  'indeed.com',
  'monster.com',
  'glassdoor.com',
  // SEO tools, competitor-lookup, software-review and listicle sites — never true competitors
  'semrush.com',
  'ahrefs.com',
  'similarweb.com',
  'cbinsights.com',
  'spyfu.com',
  'serpstat.com',
  'moz.com',
  'seo.com',
  'saasdiscovery.com',
  'parasiterank.com',
  'distillintelligence.com',
  'g2.com',
  'g2crowd.com',
  'softwareadvice.com',
  'sitejabber.com',
  'trustpilot.com',
  'capterra.com',
  'producthunt.com',
  'crunchbase.com',
  'owler.com',
  'comparably.com',
  'glassdoor.com',
  'craft.co',
  'zapier.com',
  'alternativeto.net',
  'siteslike.com',
  'sitelike.org',
  'similar-sites.com',
  'topalternatives.com',
  'ahrefstop.com',
  'wappalyzer.com',
  'builtwith.com',
  'thetopwebsites.com',
  'rankwatch.com'
]);

// Title patterns that indicate a "competitor list / alternatives" article, not a real competing site
const COMP_LIST_TITLE_RE =
  /(top\s*\d+|best\s*\d+)?\s*(competitors?|alternatives?|similar\s*sites?|sites\s*like|vs\.?|versus|compared?|marketplace|ranking|list\s*of)/i;

// Common brand-extension words that distinguish a sister site from a real competitor
const COMP_SISTER_SUFFIXES = new Set([
  'profit',
  'channel',
  'news',
  'india',
  'global',
  'international',
  'world',
  '24x7',
  'live',
  'tv',
  'online',
  'official',
  'careers',
  'jobs',
  'hindi',
  'english',
  'marathi',
  'bengali',
  'tamil',
  'telugu',
  'malayalam',
  'shop',
  'store',
  'money',
  'markets',
  'business',
  'games',
  'health',
  'entertainment',
  'tech',
  'auto',
  'sports',
  'photo',
  'video',
  'app',
  'prime',
  'plus',
  'edge',
  'pro'
]);

// Two-part public suffixes so we can compute the true registrable domain
const COMP_TWO_PART_TLDS = new Set([
  'co.uk',
  'org.uk',
  'ac.uk',
  'gov.uk',
  'com.au',
  'net.au',
  'org.au',
  'co.in',
  'net.in',
  'org.in',
  'co.nz',
  'com.br',
  'com.cn',
  'com.sg',
  'com.hk',
  'com.mx',
  'co.jp',
  'co.kr',
  'co.za',
  'com.tr',
  'co.il',
  'com.ae',
  'com.sa',
  'com.my',
  'com.ph',
  'co.id',
  'com.eg',
  'com.pk',
  'com.bd',
  'com.lk',
  'com.np',
  'com.ng',
  'co.ke',
  'com.gh',
  'com.tz',
  'com.ua',
  'co.pl',
  'com.pl',
  'com.ru',
  'co.th',
  'com.vn',
  'com.tw',
  'com.ar',
  'com.co',
  'com.pe',
  'com.cl',
  'com.ec',
  'com.uy',
  'com.bo',
  'com.py',
  'com.ua',
  'co.ao',
  'co.mz'
]);

function compNormalizeHost(h) {
  return String(h || '')
    .toLowerCase()
    .replace(/^www\./, '')
    .replace(/^m\./, '');
}

// Registrable domain (e.g. "www.sports.ndtv.com" -> "ndtv.com", "ndtv.in" -> "ndtv.in")
function compSld(host) {
  const parts = compNormalizeHost(host).split('.');
  if (parts.length >= 3 && COMP_TWO_PART_TLDS.has(parts.slice(-2).join('.'))) {
    return parts.slice(-3).join('.');
  }
  return parts.slice(-2).join('.');
}

// First label of the registrable domain (e.g. "ndtv" for ndtv.com / ndtv.co.uk)
function compBrandLabel(host) {
  return compSld(host).split('.')[0];
}

// Is this host the same brand as the target (own subdomains, ccTLD variants, exact brand match)?
function compIsSameBrand(host, targetHost, brandToken) {
  const h = compNormalizeHost(host);
  if (h === compNormalizeHost(targetHost)) return true;
  if (compSld(h) === compSld(targetHost)) return true;
  const label = compBrandLabel(h);
  if (brandToken && brandToken.length >= 3 && label === brandToken) return true;
  // Sister sites: brandToken + a common extension word (e.g. ndtv + profit -> ndtvprofit.com)
  if (brandToken && brandToken.length >= 3 && label.length > brandToken.length && label.startsWith(brandToken)) {
    const suffix = label.slice(brandToken.length);
    if (COMP_SISTER_SUFFIXES.has(suffix)) return true;
    // e.g. ndtv24x7, ndtv.in variants already handled by label===brandToken via ccTLD logic
    if (/^(24x7|live|tv|in|com|net|org|io)$/i.test(suffix)) return true;
  }
  return false;
}

// Live keyword search via DuckDuckGo HTML endpoint -> array of candidate result URLs
async function compSearch(query, limit) {
  const out = [];
  try {
    const r = await fetch('https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query), {
      signal: AbortSignal.timeout(12000),
      headers: { 'User-Agent': COMP_SEARCH_UA, Accept: 'text/html' },
      redirect: 'follow'
    });
    if (!r.ok) return out;
    const html = await r.text();
    const $ = cheerio.load(html);
    $('a.result__a').each(function () {
      const href = $(this).attr('href') || '';
      let url = href;
      const m = href.match(/uddg=([^&]+)/);
      if (m) url = decodeURIComponent(m[1]);
      if (/duckduckgo\.com|^\/|\.js\?/i.test(url)) return;
      try {
        const u = new URL(url);
        if (u.protocol.startsWith('http')) out.push(u.href);
      } catch {}
    });
  } catch (e) {
    logger.warn('Competitor search failed', { query, message: e.message });
  }
  return out.slice(0, limit || 15);
}

// Verify a candidate competitor is a real, live, relevant site
async function compVerify(url, keywords, targetHost, brandToken) {
  try {
    const r = await fetch(url, {
      signal: AbortSignal.timeout(9000),
      redirect: 'follow',
      headers: {
        'User-Agent': COMP_SEARCH_UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    if (!r.ok) return null;
    const finalUrl = r.url || url;
    const host = new URL(finalUrl).hostname;
    if (compIsSameBrand(host, targetHost, brandToken)) return null;
    const html = await r.text();
    if (!html || html.length < 200) return null;
    const $ = cheerio.load(html);
    if (isBlockedPage(html, $)) return null;
    const title = ($('title').first().text() || '').trim();
    const desc = ($('meta[name="description"]').attr('content') || '').trim();
    const h1 = ($('h1').first().text() || '').trim();
    const words = (title + ' ' + desc + ' ' + h1).toLowerCase();
    if (!title || title.length < 3) return null;
    // Reject SEO-tool / "list of alternatives" article pages masquerading as competitors
    if (COMP_LIST_TITLE_RE.test(title)) return null;
    const hHost = compNormalizeHost(host);
    if (COMP_SKIP_HOSTS.has(hHost) || COMP_SKIP_HOSTS.has(compSld(hHost))) return null;
    let score = 0;
    (keywords || []).slice(0, 8).forEach(function (k) {
      const kk = String(k).toLowerCase();
      if (!kk || kk.length < 3) return;
      if (words.includes(kk)) score += 3;
      if (title.toLowerCase().includes(kk)) score += 5;
    });
    // Require a real topical match: if no keyword overlaps at all, only keep
    // sites that still clearly share the target's subject matter (has h1+body content).
    const bodyWords = ($('body').text() || '').replace(/\s+/g, ' ').trim().length;
    if (score === 0 && bodyWords < 300) return null;
    if (score === 0) score = 1;
    return { url: finalUrl, host: hHost, title, score };
  } catch (e) {
    return null;
  }
}

async function discoverCompetitors(opts) {
  const { finalUrl, domain, brand, keywords, pageTitle, geo } = opts;
  const targetHost = compNormalizeHost(domain);
  const brandToken = String(brand || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  const kwList = (Array.isArray(keywords) ? keywords : [])
    .filter(function (k) {
      return k && k.length > 2;
    })
    .slice(0, 8);
  const geoTerm =
    geo && geo !== 'US'
      ? {
          IN: 'india',
          GB: 'uk',
          DE: 'germany',
          FR: 'france',
          ES: 'spain',
          IT: 'italy',
          AU: 'australia',
          BR: 'brazil',
          CA: 'canada',
          JP: 'japan',
          NL: 'netherlands',
          SE: 'sweden',
          SG: 'singapore',
          AE: 'uae',
          ZA: 'south africa',
          NG: 'nigeria'
        }[geo]
      : '';

  // Build a diverse set of queries from real topical signals on the target page.
  // Topical queries (the site's own subject matter) surface real competing sites;
  // brand queries are kept only as a supplement.
  const queries = [];
  if (kwList.length >= 2) queries.push(kwList.slice(0, 3).join(' '));
  if (kwList.length) queries.push(kwList[0]);
  if (kwList.length >= 3) queries.push(kwList[1] + ' ' + kwList[2]);
  if (kwList.length >= 2) queries.push(kwList[0] + ' ' + kwList[1]);
  if (geoTerm) {
    if (kwList.length) queries.push(kwList[0] + ' ' + geoTerm);
  }
  if (brandToken.length >= 3) {
    queries.push(brandToken + ' ' + (kwList[0] || 'news'));
    queries.push(brandToken + ' news');
  }
  if (pageTitle && pageTitle.length > 8 && !COMP_LIST_TITLE_RE.test(pageTitle)) {
    queries.push(pageTitle.slice(0, 80));
  }

  const uniqueQueries = [];
  queries.forEach(function (q) {
    if (q && uniqueQueries.indexOf(q) === -1 && uniqueQueries.length < 8) uniqueQueries.push(q);
  });

  // Run all searches in parallel
  const searchResults = await Promise.all(
    uniqueQueries.map(function (q) {
      return compSearch(q, 15);
    })
  );

  const hostMap = {}; // host -> { url, count, title }
  searchResults.forEach(function (urls, qi) {
    (urls || []).forEach(function (url) {
      try {
        const host = compNormalizeHost(new URL(url).hostname);
        const sld = compSld(host);
        if (sld === compSld(targetHost)) return;
        if (compIsSameBrand(host, targetHost, brandToken)) return;
        if (COMP_SKIP_HOSTS.has(host) || COMP_SKIP_HOSTS.has(sld)) return;
        if (!hostMap[host]) hostMap[host] = { url, count: 0 };
        hostMap[host].count++;
      } catch (e) {}
    });
  });

  // Rank by how many independent queries surfaced the domain, then verify live
  const ranked = Object.values(hostMap)
    .sort(function (a, b) {
      return b.count - a.count;
    })
    .slice(0, 16);
  const verified = (
    await Promise.all(
      ranked.map(function (c) {
        return compVerify(c.url, kwList, targetHost, brandToken);
      })
    )
  )
    .filter(Boolean)
    .sort(function (a, b) {
      return b.score - a.score || b.count - a.count;
    });

  return verified.slice(0, 12);
}

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
  // L14 = single-page ROI: monetizes THIS url's issues from user-supplied
  // traffic/AOV/CVR. L21 = portfolio rollup: re-checks title/canonical/
  // headings/schema/links across the site and aggregates executive risk.
  // They share revenue math on purpose; scopes differ (page vs portfolio).
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

async function auditUrl(url, onProgress, config) {
  const startTime = Date.now();
  const cfg = config || {};

  const sendProgress = (level, status, detail) => {
    if (onProgress) onProgress({ level, status, detail, totalLevels: 22 });
  };

  sendProgress(0, 'starting', 'Initializing audit engine...');

  let rawResult;
  const initialUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
  try {
    sendProgress(0, 'fetching', 'Fetching raw HTML from ' + url);
    rawResult = await fetchRawHtml(url, initialUA);
  } catch (e) {
    throw new Error('Failed to fetch URL: ' + e.message);
  }
  const rawHtml = rawResult.html;
  const statusCode = rawResult.status;
  const responseHeaders = rawResult.headers;
  const finalUrl = rawResult.url;

  sendProgress(0, 'fetched', 'HTML fetched (' + rawHtml.length + ' chars), status: ' + statusCode);

  let browser;
  let renderedHtml = rawHtml;
  let perf = {};
  let redirectChain = [];

  try {
    sendProgress(0, 'launching', 'Launching headless Chrome...');
    browser = await launchBrowser();
    const page = await browser.newPage();

    const uaMap = {
      'googlebot-desktop': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'googlebot-mobile':
        'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      gptbot: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.0; +https://openai.com/gptbot)',
      perplexitybot: 'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai)',
      applebot:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/600.2.5 (KHTML, like Gecko) Version/8.0.2 Safari/600.2.5 (Applebot/0.1)',
      'chrome-desktop': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'chrome-mobile':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    };
    const selectedUA = cfg.userAgent === 'custom' && cfg.customUA ? cfg.customUA : uaMap[cfg.userAgent] || uaMap['chrome-desktop'];
    await page.setUserAgent(selectedUA);
    await page.setViewport({ width: cfg.viewportWidth || 1920, height: cfg.viewportHeight || 1080 });

    sendProgress(0, 'navigating', 'Navigating to URL with Puppeteer...');
    const navigationStart = Date.now();
    const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    const navTime = Date.now() - navigationStart;

    sendProgress(0, 'rendered', 'Page rendered in ' + navTime + 'ms, extracting performance metrics...');

    try {
      const timing = await page.evaluate(() => {
        const entries = performance.getEntriesByType('navigation');
        if (entries.length > 0) {
          const nav = entries[0];
          return {
            ttfb: Math.round(nav.responseStart - nav.requestStart),
            domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
            loadComplete: Math.round(nav.loadEventEnd - nav.startTime),
            domInteractive: Math.round(nav.domInteractive - nav.startTime),
            responseEnd: Math.round(nav.responseEnd - nav.startTime)
          };
        }
        return null;
      });
      if (timing) perf = timing;
    } catch {
      perf = {
        ttfb: null,
        domContentLoaded: null,
        loadComplete: null,
        domInteractive: null,
        responseEnd: null,
        note: 'Navigation timing could not be extracted — performance metrics were NOT estimated from wall-clock time.'
      };
    }

    try {
      const req = response.request();
      if (req && req.redirectChain) {
        redirectChain = req.redirectChain().map((r) => r.url());
      }
    } catch {}

    renderedHtml = await page.content();
  } catch (e) {
    logger.warn('Puppeteer error, continuing with raw HTML', { message: e.message });
    sendProgress(0, 'puppeteer-error', 'Puppeteer error: ' + e.message + '. Using raw HTML for analysis.');
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
  }

  const $ = cheerio.load(renderedHtml);
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

  sendProgress(0, 'parsed', 'HTML parsed with Cheerio. Starting 22-level deep analysis...');

  const levelFns = [
    { fn: level1, args: [$, finalUrl, responseHeaders, rawHtml, cfg], num: 1 },
    { fn: level2, args: [$, rawHtml, renderedHtml, perf, cfg], num: 2 },
    { fn: level3, args: [$, bodyText, finalUrl, cfg], num: 3 },
    { fn: level4, args: [$, bodyText, finalUrl, cfg], num: 4 },
    { fn: level5, args: [$, finalUrl, cfg], num: 5 },
    { fn: level6, args: [responseHeaders, $, finalUrl, cfg], num: 6 },
    { fn: level7, args: [$, cfg], num: 7 },
    { fn: level8, args: [$, bodyText, finalUrl, cfg], num: 8 },
    { fn: level9, args: [$, bodyText, finalUrl, cfg], num: 9 },
    { fn: level10, args: [$, statusCode, redirectChain, finalUrl, cfg], num: 10 },
    { fn: level11, args: [$, bodyText, finalUrl, cfg], num: 11 },
    { fn: level12, args: [$, bodyText, finalUrl, cfg], num: 12 },
    { fn: level13, args: [$, finalUrl, cfg], num: 13 },
    { fn: level14, args: [$, bodyText, finalUrl, cfg], num: 14 },
    { fn: level15, args: [$, bodyText, cfg], num: 15 },
    { fn: level16, args: [$, finalUrl, cfg], num: 16 },
    { fn: level17, args: [$, finalUrl, cfg, responseHeaders], num: 17 },
    { fn: level18, args: [$, bodyText, finalUrl, cfg], num: 18 },
    { fn: level19, args: [$, finalUrl, cfg], num: 19 },
    { fn: level20, args: [$, bodyText, finalUrl, cfg], num: 20 },
    { fn: level21, args: [$, bodyText, finalUrl, cfg], num: 21 }
  ];

  const levelResults = [];

  for (const lf of levelFns) {
    sendProgress(lf.num, 'analyzing', 'Running Level ' + lf.num + ': ' + (LEVEL_NAMES[lf.num - 1] || 'Analysis'));
    try {
      const result = lf.fn(...lf.args);
      result.name = result.name || LEVEL_NAMES[lf.num - 1] || 'Level ' + lf.num;
      levelResults.push(result);
      sendProgress(
        lf.num,
        'complete',
        'Level ' + lf.num + ' complete — Score: ' + result.score + '/100, Issues: ' + (result.issues ? result.issues.length : 0)
      );
    } catch (err) {
      logger.error('Level failed', { level: lf.num, message: err.message });
      sendProgress(lf.num, 'error', 'Level ' + lf.num + ' failed: ' + err.message);
      levelResults.push({
        level: lf.num,
        name: LEVEL_NAMES[lf.num - 1] || 'Level ' + lf.num,
        score: 0,
        issues: [
          {
            severity: 'critical',
            impact: 'high',
            message: 'Level ' + lf.num + ' analysis failed: ' + err.message,
            element: 'analysis-engine',
            fix: 'Check server logs for details. This may indicate a parsing error with the page HTML.',
            evidence: err.stack || err.message
          }
        ],
        data: { error: err.message }
      });
    }
  }

  // L22 probes are SSRF-safe, best-effort, never fatal (8s caps).
  sendProgress(22, 'analyzing', 'Running Level 22: ' + LEVEL_NAMES[21]);
  try {
    const origin = new URL(finalUrl).origin;
    const [robotsRes, llmsRes] = await Promise.all([
      fetchText(origin + '/robots.txt', { timeoutMs: 8000, accept: 'text/plain' }),
      fetchText(origin + '/llms.txt', { timeoutMs: 8000, accept: 'text/plain,text/markdown' })
    ]);
    const robotsTxt = robotsRes.status === 200 ? robotsRes.text : '';
    const llmsTxt = llmsRes.status === 200 ? { status: 200, text: llmsRes.text } : { status: llmsRes.status || 404, text: '' };
    const l22 = level22($, finalUrl, cfg, { responseHeaders, robotsTxt, llmsTxt, sitemapUrls: [] });
    levelResults.push(l22);
    sendProgress(22, 'complete', 'Level 22 complete \u2014 Score: ' + l22.score + '/100, Issues: ' + l22.issues.length);
  } catch (err) {
    logger.error('Level failed', { level: 22, message: err.message });
    levelResults.push({
      level: 22,
      name: LEVEL_NAMES[21],
      score: 0,
      issues: [
        {
          severity: 'critical',
          impact: 'high',
          message: 'Level 22 analysis failed: ' + err.message,
          element: 'analysis-engine',
          fix: 'Check server logs.',
          evidence: err.message
        }
      ],
      data: { error: err.message }
    });
  }

  sendProgress(22, 'aggregating', 'Aggregating results from all 22 levels...');

  let totalScore = 0;
  let totalIssues = 0;
  let critical = 0,
    warnings = 0,
    info = 0;

  levelResults.forEach((l) => {
    totalScore += l.score || 0;
    if (l.issues) {
      l.issues.forEach((i) => {
        totalIssues++;
        if (i.severity === 'critical') critical++;
        else if (i.severity === 'warning') warnings++;
        else info++;
      });
    }
  });

  const overallScore = levelResults.length > 0 ? Math.round(totalScore / levelResults.length) : 0;
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  sendProgress(22, 'complete', 'Audit complete! Score: ' + overallScore + '/100 in ' + duration + 's');

  return {
    url: finalUrl,
    overallScore,
    levels: levelResults,
    summary: {
      criticalIssues: critical,
      warnings: warnings,
      info: info,
      topFixes: Math.min(critical + warnings, 10)
    },
    duration,
    meta: {
      rawHtmlSize: rawHtml.length,
      renderedHtmlSize: renderedHtml.length,
      statusCode,
      bodyWordCount: countWords(bodyText),
      timestamp: new Date().toISOString()
    }
  };
}

// SSE progress endpoint
const progressClients = new Map();

app.get('/api/audit-progress/:auditId', (req, res) => {
  const { auditId } = req.params;
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no'
  });

  res.write('data: {"status":"connected"}\n\n');

  progressClients.set(auditId, res);
  const hb = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {}
  }, 20000);

  req.on('close', () => {
    clearInterval(hb);
    progressClients.delete(auditId);
  });
});

// LRU audit cache (500 keys, 1h TTL) + concurrency guard so traffic spikes
// don't OOM the instance. Stats at GET /api/cache-stats.
const auditCache = new LruCache({ max: 500, ttlMs: 60 * 60 * 1000 });
const CACHE_TTL_MS = 60 * 60 * 1000;
let activeAudits = 0;
const MAX_CONCURRENT_AUDITS = 2;
function cacheKey(url, config) {
  return auditCache.key(url, config);
}
function cacheGet(k) {
  return auditCache.get(k); // null on miss/expiry (LRU tracks hits/misses/evictions)
}

// Main audit endpoint
app.post('/api/audit', async (req, res) => {
  if (req.headersSent) return;
  try {
    const parsed = parseBody(auditBodySchema, req.body);
    let { url, config, auditId: clientAuditId } = parsed;
    url = await assertPublicUrl(normaliseUserUrl(url));

    if (activeAudits >= MAX_CONCURRENT_AUDITS) {
      res.setHeader('Retry-After', '30');
      return res.status(429).json({ error: 'Audit engine busy (max 2 concurrent). Retry in ~30s.', retryAfter: 30 });
    }

    const key = cacheKey(url, config);
    const cached = cacheGet(key);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const auditId = clientAuditId || Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    logger.info('Starting audit', { url, auditId });

    const sendProgress = (level, status, detail) => {
      const data = JSON.stringify({ auditId, level, status, detail });
      const client = progressClients.get(auditId);
      if (client) {
        try {
          client.write('data: ' + data + '\n\n');
        } catch {}
      }
    };

    activeAudits++;
    let result;
    try {
      result = await auditUrl(url, sendProgress, config);
    } finally {
      activeAudits--;
    }
    auditCache.set(key, result);

    result.meta = { ...result.meta, auditId };
    history.record(result);
    logger.info('Audit complete', { auditId, score: result.overallScore, duration: result.duration });
    res.json(result);
  } catch (err) {
    logger.error('Audit error', { message: err.message });
    if (!res.headersSent) {
      res.status(err.status || 500).json({ error: 'Audit failed: ' + err.message });
    }
  }
});

app.post('/api/export-pdf', async (req, res) => {
  if (req.headersSent) return;
  let browser;
  try {
    const { html } = req.body || {};
    if (!html || typeof html !== 'string') return res.status(400).json({ error: 'HTML content required' });
    if (Buffer.byteLength(html, 'utf8') > 1024 * 1024) return res.status(400).json({ error: 'HTML too large (max 1MB)' });

    browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=seo-audit-report.pdf');
    res.send(pdfBuffer);
  } catch (err) {
    logger.error('PDF error', { message: err.message });
    if (!res.headersSent) {
      res.status(500).json({ error: 'PDF generation failed' });
    }
  } finally {
    if (browser)
      try {
        await browser.close();
      } catch {}
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: APP_VERSION,
    levels: 22,
    uptime: Math.round((Date.now() - STARTED_AT) / 1000),
    timestamp: new Date().toISOString(),
    node: process.version,
    memory: process.memoryUsage(),
    activeAudits,
    maxConcurrent: MAX_CONCURRENT_AUDITS,
    cache: auditCache.stats(),
    historyEntries: history.load().length
  });
});

// API index — keeps the root deploy verifiable without opening the SPA.
app.get('/api', (req, res) => {
  res.json({
    name: 'complete-on-page-seo-2026',
    version: APP_VERSION,
    description: '22-level on-page + AI-search SEO audit engine. Real measured data, no mocks.',
    endpoints: [
      'POST /api/audit',
      'GET /api/audit-progress/:id',
      'POST /api/analyze-url',
      'POST /api/crawl',
      'GET /api/crux?url=',
      'GET /api/history?url=',
      'GET /api/diff?url=&from=&to=',
      'POST /api/export-pdf',
      'GET /api/health',
      'GET /api/cache-stats',
      'GET /openapi.yaml'
    ],
    docs: '/openapi.yaml'
  });
});

app.get('/api/cache-stats', (req, res) => {
  res.json({ ...auditCache.stats(), activeAudits, maxConcurrent: MAX_CONCURRENT_AUDITS });
});

// CrUX + PageSpeed field data via src/lib/crux (PAGESPEED_API_KEY wired, honest unmeasured fallback).
app.get('/api/crux', async (req, res) => {
  try {
    let { url } = req.query;
    if (!url) return res.status(400).json({ error: 'url query param required' });
    url = await assertPublicUrl(normaliseUserUrl(url));
    const out = await fetchCrux(url);
    if (out.unmeasured && out.reason && /quota/i.test(out.reason)) res.status(429);
    res.json(out);
  } catch (err) {
    res.status(err.status || 500).json({ error: 'CrUX lookup failed: ' + err.message });
  }
});

// Multi-URL sitemap/BFS crawl (max 25 pages, same-origin + sitemap expansion).
app.post('/api/crawl', async (req, res) => {
  try {
    const schema = z.object({
      startUrl: z.string().min(4).max(2000),
      maxPages: z.number().int().min(1).max(25).optional(),
      includeSitemap: z.boolean().optional()
    });
    const parsed = parseBody(schema, req.body);
    let startUrl = parsed.startUrl;
    startUrl = await assertPublicUrl(normaliseUserUrl(startUrl));
    const maxPages = parsed.maxPages || 10;
    const includeSitemap = parsed.includeSitemap !== false;
    const origin = new URL(startUrl).origin;
    const seen = new Set([startUrl]);
    const queue = [startUrl];
    const pages = [];
    // Sitemap expansion first: seed the queue with real URLs, not just link-graph.
    if (includeSitemap) {
      try {
        const robotsRes = await fetchText(origin + '/robots.txt', { timeoutMs: 8000, accept: 'text/plain' });
        const { parseRobots } = require('./src/lib/sitemap');
        const smUrls =
          robotsRes.status === 200 ? parseRobots(robotsRes.text).sitemaps : [origin + '/sitemap.xml', origin + '/sitemap_index.xml'];
        for (const sm of smUrls.slice(0, 3)) {
          try {
            const smUrl = await assertPublicUrl(sm);
            const xml = await fetchText(smUrl, { timeoutMs: 8000, accept: 'application/xml,text/xml' });
            if (xml.status !== 200) continue;
            let locs = parseSitemapXml(xml.text, 100);
            if (isSitemapIndex(xml.text)) {
              for (const child of locs.slice(0, 3)) {
                try {
                  const childXml = await fetchText(await assertPublicUrl(child), { timeoutMs: 8000, accept: 'application/xml' });
                  if (childXml.status === 200) locs = locs.concat(parseSitemapXml(childXml.text, 100));
                } catch {}
              }
              locs = locs.filter((u) => !/sitemap.*\.xml/i.test(u));
            }
            for (const u of locs) {
              try {
                const abs = new URL(u, origin).href.split('#')[0];
                if (abs.startsWith(origin) && !seen.has(abs) && queue.length < maxPages) {
                  seen.add(abs);
                  queue.push(abs);
                }
              } catch {}
            }
          } catch {}
        }
      } catch {}
    }
    while (queue.length && pages.length < maxPages) {
      const u = queue.shift();
      try {
        const r = await fetchRawHtml(u);
        const $ = cheerio.load(r.html);
        pages.push({
          url: u,
          status: r.status,
          title: $('title').first().text().trim().slice(0, 120),
          words: ($('body').text() || '').split(/\s+/).length
        });
        if (pages.length >= maxPages) break;
        $('a[href]').each((_, el) => {
          try {
            const href = new URL($(el).attr('href'), u).href.split('#')[0];
            if (href.startsWith(origin) && !seen.has(href) && queue.length + pages.length < maxPages) {
              seen.add(href);
              queue.push(href);
            }
          } catch {}
        });
      } catch (e) {
        pages.push({ url: u, error: e.message });
      }
    }
    res.json({
      startUrl,
      origin,
      pagesCrawled: pages.length,
      pages,
      note: 'Same-origin BFS crawl (sitemap-seeded when includeSitemap), raw-HTML only (no Puppeteer per page). Run POST /api/audit per URL for full 22-level depth.'
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: 'Crawl failed: ' + err.message });
  }
});

app.get('/openapi.yaml', (req, res) => {
  res.sendFile(path.join(__dirname, 'openapi.yaml'));
});

// Audit history (file-backed, last 200 summaries) + score diffing.
app.get('/api/history', (req, res) => {
  try {
    const { url, limit } = req.query;
    const lim = Math.min(50, Math.max(1, parseInt(limit || '20', 10) || 20));
    const all = url ? history.byUrl(String(url), lim) : history.load().slice(0, lim);
    res.json({ count: all.length, entries: all });
  } catch (err) {
    res.status(500).json({ error: 'History lookup failed: ' + err.message });
  }
});

app.get('/api/diff', (req, res) => {
  try {
    const { url, from, to } = req.query;
    if (!url || !from || !to)
      return res.status(400).json({ error: 'url, from and to query params required (from/to = history timestamps)' });
    const entries = history.byUrl(String(url), 200);
    const a = entries.find((e) => e.timestamp === String(from));
    const b = entries.find((e) => e.timestamp === String(to));
    if (!a || !b)
      return res
        .status(404)
        .json({ error: 'History entries not found for those timestamps', hint: 'GET /api/history?url=... to list timestamps' });
    res.json(history.diff(a, b));
  } catch (err) {
    res.status(500).json({ error: 'Diff failed: ' + err.message });
  }
});

// Deep URL analysis endpoint - auto-fills all config fields
app.post('/api/analyze-url', async (req, res) => {
  if (req.headersSent) return;
  try {
    const parsed = parseBody(urlOnlySchema, req.body);
    let { url } = parsed;
    url = await assertPublicUrl(normaliseUserUrl(url));
    logger.info('Analyzing URL for auto-fill', { url });

    let rawHtml = '';
    let finalUrl = url;
    let usedPuppeteer = false;

    // Step 1: Try fetch with browser-like UA
    try {
      const rawResult = await fetchRawHtml(url);
      rawHtml = rawResult.html;
      finalUrl = rawResult.url;
      const test$ = cheerio.load(rawHtml);
      if (isBlockedPage(rawHtml, test$)) {
        logger.info('Fetch blocked, trying Puppeteer fallback');
        rawHtml = '';
      }
    } catch (e) {
      logger.info('Fetch failed, trying Puppeteer fallback', { message: e.message });
      rawHtml = '';
    }

    // Step 2: If blocked or failed, use Puppeteer
    if (!rawHtml || rawHtml.length < 500) {
      let browser;
      try {
        browser = await launchBrowser();
        const page = await browser.newPage();
        await page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
        );
        await page.setViewport({ width: 1920, height: 1080 });
        const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
        if (resp) finalUrl = page.url();
        rawHtml = await page.content();
        usedPuppeteer = true;
      } catch (e) {
        logger.error('Puppeteer fallback failed', { message: e.message });
        if (!rawHtml) return res.status(500).json({ error: 'Could not fetch URL: site may be blocking automated access' });
      } finally {
        if (browser)
          try {
            await browser.close();
          } catch {}
      }
    }

    const $ = cheerio.load(rawHtml);
    const parsedUrl = new URL(finalUrl);
    const domain = parsedUrl.hostname;
    const origin = parsedUrl.origin;
    const pageTitle = $('title').first().text().trim();

    // Detect blocked page
    const blocked = isBlockedPage(rawHtml, $);

    // ===== 1. BRAND / ENTITY NAME =====
    let brand = '';
    if (!blocked) {
      brand = $('meta[property="og:site_name"]').attr('content') || '';
      if (!brand) {
        const tw = $('meta[name="twitter:site"]').attr('content') || '';
        brand = tw.replace(/^@/, '');
      }
      if (!brand) {
        $('script[type="application/ld+json"]').each(function () {
          try {
            const d = JSON.parse($(this).html());
            if (d['@type'] === 'Organization' && d.name) {
              brand = d.name;
              return false;
            }
            if (d['@graph']) {
              for (const item of d['@graph']) {
                if (item['@type'] === 'Organization' && item.name) {
                  brand = item.name;
                  break;
                }
              }
            }
          } catch {}
        });
      }
      if (!brand && pageTitle && !pageTitle.toLowerCase().includes('access denied')) {
        const seps = [' | ', ' - ', ' \u2014 ', ' \u00B7 ', ' :: ', ' // '];
        for (const sep of seps) {
          const parts = pageTitle.split(sep);
          if (parts.length >= 2) {
            const last = parts[parts.length - 1].trim();
            if (last.length > 0 && last.length <= 30 && !/^(home|welcome|page|article|blog|news)/i.test(last)) {
              brand = last;
              break;
            }
            const first = parts[0].trim();
            if (first.length > 0 && first.length <= 30) {
              brand = first;
              break;
            }
          }
        }
      }
    }
    if (!brand) {
      brand = domain.replace(/^www\./, '').split('.')[0];
      // Preserve known uppercase brand names
      const upperBrands = {
        ndtv: 'NDTV',
        bbc: 'BBC',
        cnn: 'CNN',
        espn: 'ESPN',
        nasa: 'NASA',
        nba: 'NBA',
        nfl: 'NFL',
        mit: 'MIT',
        ibm: 'IBM',
        hp: 'HP',
        aws: 'AWS',
        faq: 'FAQ'
      };
      const lower = brand.toLowerCase();
      brand = upperBrands[lower] || brand.charAt(0).toUpperCase() + brand.slice(1);
    }

    // ===== 2. PAGE TYPE =====
    let pageType = 'auto';
    const schemaTypes = [];
    if (!blocked) {
      $('script[type="application/ld+json"]').each(function () {
        try {
          const d = JSON.parse($(this).html());
          if (d['@type']) schemaTypes.push(d['@type'].toLowerCase());
          if (d['@graph'])
            d['@graph'].forEach(function (item) {
              if (item['@type']) schemaTypes.push(item['@type'].toLowerCase());
            });
        } catch {}
      });
      const schemaStr = schemaTypes.join(' ');
      if (/product/i.test(schemaStr)) pageType = 'product';
      else if (/collectionpage|itemlist|category/i.test(schemaStr)) pageType = 'category';
      else if (/article|blogposting|newsarticle/i.test(schemaStr)) pageType = 'article';
      else if (/faq/i.test(schemaStr)) pageType = 'faq';
      else if (/localbusiness|restaurant|store/i.test(schemaStr)) pageType = 'local';
      else {
        const ogType = $('meta[property="og:type"]').attr('content') || '';
        if (ogType === 'product') pageType = 'product';
        else if (ogType === 'article' || ogType === 'news') pageType = 'article';
        else if ($('.product, .add-to-cart').length > 0) pageType = 'product';
        else if ($('article, .blog-post, .post-content, .story-body').length > 0) pageType = 'article';
        else if ($('.category, .product-list, .listing').length > 0) pageType = 'category';
        else if ($('.faq').length > 0) pageType = 'faq';
        else if ($('.contact-form').length > 0) pageType = 'landing';
        else if ($('nav').length > 0 && $('body').find('article, main > section, .story-content').length > 2) pageType = 'homepage';
      }
    }

    // ===== 3. SITEMAP URL =====
    let sitemapUrl = '';
    const fetchUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
    try {
      const robotsResp = await fetch(origin + '/robots.txt', { signal: AbortSignal.timeout(5000), headers: { 'User-Agent': fetchUA } });
      if (robotsResp.ok) {
        const robotsText = await robotsResp.text();
        const sm = robotsText.match(/Sitemap:\s*(.+)/i);
        if (sm) sitemapUrl = sm[1].trim();
      }
    } catch {}
    if (!sitemapUrl) {
      for (const p of ['/sitemap.xml', '/sitemap_index.xml', '/sitemap-index.xml', '/wp-sitemap.xml']) {
        try {
          const cr = await fetch(origin + p, { signal: AbortSignal.timeout(3000), method: 'HEAD', headers: { 'User-Agent': fetchUA } });
          if (cr.ok) {
            sitemapUrl = origin + p;
            break;
          }
        } catch {}
      }
    }

    // ===== 4. VIEWPORT =====
    let viewportWidth = 1920,
      viewportHeight = 1080;
    if (!blocked) {
      const vpMeta = $('meta[name="viewport"]').attr('content') || '';
      if (vpMeta) {
        const m = vpMeta.match(/width=(\d+)/);
        if (m) viewportWidth = parseInt(m[1]);
        if (viewportWidth <= 500 || /mobile/i.test(vpMeta)) {
          viewportWidth = 412;
          viewportHeight = 915;
        }
      }
    }

    // ===== 5. GEO-LOCATION =====
    let geo = '';
    if (!blocked) {
      const hreflang = $('link[hreflang]').first().attr('hreflang') || '';
      if (hreflang) {
        const lp = hreflang.split('-');
        geo = lp[lp.length - 1].toUpperCase();
      }
      if (!geo) {
        const ogL = $('meta[property="og:locale"]').attr('content') || '';
        if (ogL) {
          const m = {
            en_us: 'US',
            en_gb: 'GB',
            en_au: 'AU',
            de_de: 'DE',
            fr_fr: 'FR',
            es_es: 'ES',
            pt_br: 'BR',
            ja_jp: 'JP',
            zh_cn: 'CN',
            hi_in: 'IN',
            it_it: 'IT',
            ko_kr: 'KR',
            ru_ru: 'RU',
            nl_nl: 'NL',
            pl_pl: 'PL'
          };
          geo = m[ogL.toLowerCase()] || '';
        }
      }
    }
    if (!geo) {
      const t = {
        '.co.uk': 'GB',
        '.co.in': 'IN',
        '.com.au': 'AU',
        '.de': 'DE',
        '.fr': 'FR',
        '.es': 'ES',
        '.it': 'IT',
        '.br': 'BR',
        '.jp': 'JP',
        '.cn': 'CN',
        '.ru': 'RU',
        '.nl': 'NL',
        '.pl': 'PL'
      };
      for (const [k, v] of Object.entries(t)) {
        if (domain.endsWith(k)) {
          geo = v;
          break;
        }
      }
    }
    const lang = blocked ? '' : $('html').attr('lang') || '';
    if (!geo && lang) {
      const lg = { de: 'DE', fr: 'FR', es: 'ES', ja: 'JP', zh: 'CN', hi: 'IN', pt: 'BR', ko: 'KR', ru: 'RU', nl: 'NL', it: 'IT', pl: 'PL' };
      for (const [p, c] of Object.entries(lg)) {
        if (lang.startsWith(p)) {
          geo = c;
          break;
        }
      }
    }
    // Detect from domain TLD for Indian sites
    if (!geo && (domain.includes('.in') || domain.endsWith('.co.in'))) geo = 'IN';

    // ===== 6. CURRENCY =====
    let currency = 'USD';
    if (!blocked) {
      $('script[type="application/ld+json"]').each(function () {
        try {
          const d = JSON.parse($(this).html());
          if (d.priceCurrency) {
            currency = d.priceCurrency;
            return false;
          }
        } catch {}
      });
      if (currency === 'USD') {
        const ogP = $('meta[property="product:price:currency"]').attr('content');
        if (ogP) currency = ogP;
      }
      // Detect from body text currency symbols
      if (currency === 'USD') {
        const bodyT = $('body').text();
        const currFreq = {};
        const currMap = {
          '\u20B9': 'INR',
          '\u00A3': 'GBP',
          '\u20AC': 'EUR',
          '\u00A5': 'JPY',
          '\u20A9': 'KRW',
          'Rs.': 'INR',
          'Rs ': 'INR',
          INR: 'INR',
          EUR: 'EUR',
          GBP: 'GBP'
        };
        for (const [sym, code] of Object.entries(currMap)) {
          const regex = new RegExp(sym.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
          const matches = bodyT.match(regex);
          currFreq[code] = matches ? matches.length : 0;
        }
        const top = Object.entries(currFreq).sort(function (a, b) {
          return b[1] - a[1];
        })[0];
        if (top && top[1] > 0) currency = top[0];
      }
    }
    // Default Indian currency for .in domains
    if (currency === 'USD' && geo === 'IN') currency = 'INR';

    // ===== 7. KEYWORDS =====
    const keywords = [];
    if (!blocked) {
      const metaKw = $('meta[name="keywords"]').attr('content') || '';
      if (metaKw) {
        metaKw.split(',').forEach(function (kw) {
          const t = kw.trim().toLowerCase();
          if (t && t.length > 1 && t.length < 100) keywords.push(t);
        });
      }
      const titleText = $('title').first().text().trim().toLowerCase();
      const h1Text = $('h1')
        .map(function () {
          return $(this).text().trim().toLowerCase();
        })
        .get()
        .join(' ');
      const h2Text = $('h2')
        .map(function () {
          return $(this).text().trim().toLowerCase();
        })
        .get()
        .join(' ');
      const metaDesc = ($('meta[name="description"]').attr('content') || '').toLowerCase();
      const allH = titleText + ' ' + h1Text + ' ' + h2Text;
      const stopW = new Set([
        'the',
        'a',
        'an',
        'and',
        'or',
        'but',
        'in',
        'on',
        'at',
        'to',
        'for',
        'of',
        'with',
        'by',
        'from',
        'as',
        'is',
        'was',
        'are',
        'were',
        'been',
        'be',
        'have',
        'has',
        'had',
        'do',
        'does',
        'did',
        'will',
        'would',
        'could',
        'should',
        'may',
        'might',
        'shall',
        'can',
        'this',
        'that',
        'these',
        'those',
        'it',
        'its',
        'they',
        'them',
        'their',
        'we',
        'our',
        'you',
        'your',
        'he',
        'she',
        'his',
        'her',
        'not',
        'no',
        'nor',
        'so',
        'if',
        'than',
        'too',
        'very',
        'just',
        'about',
        'above',
        'after',
        'again',
        'all',
        'also',
        'am',
        'any',
        'because',
        'before',
        'between',
        'both',
        'each',
        'few',
        'more',
        'most',
        'other',
        'over',
        'own',
        'same',
        'some',
        'such',
        'only',
        'into',
        'up',
        'out',
        'here',
        'there',
        'where',
        'when',
        'how',
        'what',
        'which',
        'who',
        'whom',
        'why',
        'while',
        'during',
        'through',
        'until',
        'within',
        'without',
        'being',
        'doing',
        'having',
        'down',
        'off',
        'under',
        'around',
        'further',
        'then',
        'once',
        'new',
        'one',
        'two',
        'first',
        'last',
        'read',
        'more',
        'click',
        'here',
        'home',
        'news',
        'latest',
        'today',
        'india',
        'world'
      ]);
      function extPh(text) {
        const words = text
          .replace(/[^a-z0-9\s]/g, ' ')
          .split(/\s+/)
          .filter(function (w) {
            return w.length > 2 && !stopW.has(w);
          });
        const ph = {};
        words.forEach(function (w) {
          ph[w] = (ph[w] || 0) + 1;
        });
        for (let i = 0; i < words.length - 1; i++) {
          const p = words[i] + ' ' + words[i + 1];
          ph[p] = (ph[p] || 0) + 1;
        }
        for (let i = 0; i < words.length - 2; i++) {
          const p = words[i] + ' ' + words[i + 1] + ' ' + words[i + 2];
          ph[p] = (ph[p] || 0) + 1;
        }
        return ph;
      }
      const hPh = extPh(allH),
        dPh = extPh(metaDesc),
        bPh = extPh($('body').text().substring(0, 15000));
      const sc = {};
      Object.entries(hPh).forEach(function (e) {
        if (e[0].split(' ').length >= 2) sc[e[0]] = (sc[e[0]] || 0) + e[1] * 10 + 5;
      });
      Object.entries(dPh).forEach(function (e) {
        if (e[0].split(' ').length >= 2) sc[e[0]] = (sc[e[0]] || 0) + e[1] * 5 + 3;
      });
      Object.entries(bPh).forEach(function (e) {
        if (sc[e[0]] && e[0].split(' ').length >= 2) sc[e[0]] += e[1] * 2;
      });
      Object.entries(sc)
        .sort(function (a, b) {
          return b[1] - a[1];
        })
        .slice(0, 8)
        .forEach(function (e) {
          if (!keywords.includes(e[0])) keywords.push(e[0]);
        });
      if (keywords.length === 0 && titleText && !titleText.includes('access denied')) {
        const tw = titleText
          .replace(/[^a-z0-9\s]/g, ' ')
          .split(/\s+/)
          .filter(function (w) {
            return w.length > 2 && !stopW.has(w);
          });
        if (tw.length >= 2) keywords.push(tw.slice(0, 3).join(' '));
        tw.forEach(function (w) {
          if (!keywords.includes(w) && keywords.length < 5) keywords.push(w);
        });
      }
    }

    // ===== 8. COMPETITORS (real-time, verified) =====
    const competitors = [];
    const extLinks = [];
    const socialDomains = [
      'google',
      'facebook',
      'twitter',
      'instagram',
      'youtube',
      'linkedin',
      'pinterest',
      'tiktok',
      'whatsapp',
      'telegram',
      'reddit',
      'threads'
    ];
    const adDomains = [
      'googlesyndication',
      'googleadservices',
      'doubleclick',
      'googletagmanager',
      'facebook.net',
      'analytics',
      'track',
      'pixel',
      'cdn',
      'cloudflare',
      'amazonaws',
      'akamai',
      'bootstrapcdn',
      'jsdelivr',
      'unpkg',
      'jquery'
    ];
    // Get root domain (e.g., ndtv.com from sports.ndtv.com)
    const domainParts = domain.replace(/^www\./, '').split('.');
    const rootDomain = domainParts.length >= 2 ? domainParts.slice(-2).join('.') : domain;

    if (!blocked) {
      $('a[href]').each(function () {
        try {
          const href = $(this).attr('href');
          if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) return;
          const lt = $(this).text().trim();
          if (!lt || lt.length < 3 || lt.length > 100) return;
          // Skip nav/footer link text patterns
          const lowerText = lt.toLowerCase();
          if (
            [
              'home',
              'menu',
              'search',
              'login',
              'sign up',
              'subscribe',
              'follow',
              'share',
              'tweet',
              'pin',
              'comment',
              'advertisement',
              'sponsored',
              'read more',
              'click here',
              'loading'
            ].includes(lowerText)
          )
            return;
          const lu = new URL(href, finalUrl);
          const linkHost = lu.hostname.replace(/^www\./, '');
          const linkRoot = linkHost.split('.').slice(-2).join('.');
          // Skip same domain and all subdomains of same root
          if (linkRoot === rootDomain) return;
          // Skip social, ad, CDN domains
          if (
            socialDomains.some(function (s) {
              return linkHost.includes(s);
            })
          )
            return;
          if (
            adDomains.some(function (s) {
              return linkHost.includes(s);
            })
          )
            return;
          // Skip same-brand sister sites (common patterns: brand + keyword domains)
          const brandLower = brand.toLowerCase().replace(/[^a-z]/g, '');
          if (linkHost.replace(/[^a-z]/g, '').includes(brandLower) && linkHost !== domain) return;
          if (lu.protocol.startsWith('http')) {
            extLinks.push({ url: lu.href, text: lt, domain: linkHost });
          }
        } catch {}
      });
      // Find truly external industry domains - prioritize by link frequency from editorial content
      const dc = {};
      extLinks.forEach(function (l) {
        if (!dc[l.domain]) dc[l.domain] = { count: 0, url: l.url, sampleTexts: [] };
        dc[l.domain].count++;
        if (dc[l.domain].sampleTexts.length < 3) dc[l.domain].sampleTexts.push(l.text);
      });
      // Sort by frequency (more links = more relevant as competitor/reference)
      Object.values(dc)
        .filter(function (d) {
          return d.count >= 1;
        })
        .sort(function (a, b) {
          return b.count - a.count;
        })
        .slice(0, 10)
        .forEach(function (d) {
          if (competitors.length < 10) competitors.push(d.url);
        });
    }

    // Real-time verified competitor discovery (DuckDuckGo live search + live page verification)
    let discoveredCompetitors = [];
    try {
      discoveredCompetitors = await discoverCompetitors({ finalUrl, domain, brand, keywords, pageTitle, geo });
    } catch (e) {
      logger.error('Competitor discovery error', { message: e.message });
    }
    // Merge: discovered (verified, ranked) first, then link-based fallbacks as fillers
    const merged = [];
    const seenComp = new Set();
    discoveredCompetitors.forEach(function (c) {
      if (!seenComp.has(c.host)) {
        seenComp.add(c.host);
        merged.push(c.url);
      }
    });
    competitors.forEach(function (u) {
      try {
        const h = compNormalizeHost(new URL(u).hostname);
        if (!seenComp.has(h)) {
          seenComp.add(h);
          merged.push(u);
        }
      } catch {}
    });
    // Respect the 12-item cap, but ensure at least 10 candidates were attempted
    const finalCompetitors = merged.slice(0, 12);
    const competitorDetails = discoveredCompetitors.map(function (c) {
      return { url: c.url, host: c.host, title: c.title, score: c.score };
    });

    // ===== 9. RECOMMENDED USER AGENT =====
    let rUA = 'chrome-desktop';
    if (pageType === 'product' || pageType === 'category') rUA = 'googlebot-mobile';

    const result = {
      url: finalUrl,
      brand,
      pageType,
      sitemap: sitemapUrl,
      keywords: keywords.slice(0, 8).join(', '),
      competitors: finalCompetitors.join('\n'),
      viewportWidth,
      viewportHeight,
      geo: geo || 'US',
      currency,
      userAgent: rUA,
      blocked,
      meta: {
        title: pageTitle,
        description: ($('meta[name="description"]').attr('content') || '').substring(0, 200),
        lang,
        schemaTypes: schemaTypes.slice(0, 5),
        externalLinksCount: extLinks.length,
        h1Count: $('h1').length,
        h2Count: $('h2').length,
        usedPuppeteer,
        competitorDetails
      }
    };

    logger.info('Auto-fill complete', {
      brand,
      pageType,
      keywords: keywords.length,
      competitors: finalCompetitors.length,
      discovered: discoveredCompetitors.length,
      blocked
    });
    res.json(result);
  } catch (err) {
    logger.error('Analyze URL error', { message: err.message });
    if (!res.headersSent) res.status(err.status || 500).json({ error: 'Analysis failed: ' + err.message });
  }
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
// Re-exported for tests + routes sharing one guard (single source: src/middleware/ssrf.js).
module.exports.isPrivateHostname = isPrivateHostname;
module.exports.assertPublicUrl = assertPublicUrl;
module.exports.normaliseUserUrl = normaliseUserUrl;
module.exports.auditCache = auditCache;
module.exports.LEVEL_NAMES = LEVEL_NAMES;

if (require.main === module) {
  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`SEO Audit Tool running on http://localhost:${PORT}`);
  });
  const shutdown = (sig) => {
    logger.info('Shutting down', { sig, activeAudits });
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 10000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
