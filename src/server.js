const express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

process.on('uncaughtException', (err) => { console.error('Uncaught:', err.message); });
process.on('unhandledRejection', (err) => { console.error('Unhandled:', err?.message || err); });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 0, etag: false, lastModified: false }));
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

const {
  sc, byteLen, pxWidth, sel, syllables, fleschKincaid,
  extractSchemas, chunkText, analyzeSchema, detectAIPatterns,
  analyzeImage, analyzeLink, analyzeHeading, analyzeAccessibility,
  countWords, extractEntities, analyzeReadability, analyzeKeywordDensity
} = require('./helpers');

const {
  level1, level2, level3, level4, level5, level6, level7, level8,
  level9, level10, level11, level12, level13, level14, level15,
  level16, level17, level18, level19, level20, level21
} = require('./levels');

const CHROME_PATH = process.env.CHROME_PATH || null;

async function launchBrowser() {
  const opts = {
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1920,1080'
    ]
  };
  if (CHROME_PATH) opts.executablePath = CHROME_PATH;
  return puppeteer.launch(opts);
}

async function fetchRawHtml(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEOAuditBot/1.0)' },
      redirect: 'follow'
    });
    clearTimeout(timeout);
    const headers = {};
    resp.headers.forEach((value, key) => { headers[key] = value; });
    return {
      html: await resp.text(),
      status: resp.status,
      headers: headers,
      url: resp.url
    };
  } catch (e) {
    clearTimeout(timeout);
    throw new Error('Failed to fetch: ' + e.message);
  }
}

async function auditUrl(url) {
  const startTime = Date.now();

  // Step 1: Fetch raw HTML (what search engines see without JS)
  const rawResult = await fetchRawHtml(url);
  const rawHtml = rawResult.html;
  const statusCode = rawResult.status;
  const responseHeaders = rawResult.headers;
  const finalUrl = rawResult.url;

  // Step 2: Use Puppeteer to get rendered HTML + performance metrics
  let browser;
  let renderedHtml = rawHtml;
  let perf = {};
  let redirectChain = [];

  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });

    const navigationStart = Date.now();
    const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const navTime = Date.now() - navigationStart;

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
        ttfb: Math.round(navTime * 0.3),
        domContentLoaded: Math.round(navTime * 0.7),
        loadComplete: navTime
      };
    }

    try {
      const req = response.request();
      if (req && req.redirectChain) {
        redirectChain = req.redirectChain().map(r => r.url());
      }
    } catch {}

    renderedHtml = await page.content();
  } catch (e) {
    console.error('Puppeteer error:', e.message);
  } finally {
    if (browser) {
      try { await browser.close(); } catch {}
    }
  }

  // Step 3: Parse with Cheerio
  const $ = cheerio.load(renderedHtml);
  const raw$ = $;
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

  // Step 4: Run all 21 levels — each one wrapped so a single failure doesn't kill the audit
  const levelResults = [];
  const levelFns = [
    { fn: level1, args: [raw$, finalUrl, responseHeaders, rawHtml], num: 1 },
    { fn: level2, args: [raw$, rawHtml, renderedHtml, perf], num: 2 },
    { fn: level3, args: [raw$, bodyText, finalUrl], num: 3 },
    { fn: level4, args: [raw$, bodyText, finalUrl], num: 4 },
    { fn: level5, args: [raw$, finalUrl], num: 5 },
    { fn: level6, args: [responseHeaders, raw$, finalUrl], num: 6 },
    { fn: level7, args: [raw$], num: 7 },
    { fn: level8, args: [raw$, bodyText, finalUrl], num: 8 },
    { fn: level9, args: [raw$, bodyText, finalUrl], num: 9 },
    { fn: level10, args: [raw$, statusCode, redirectChain, finalUrl], num: 10 },
    { fn: level11, args: [raw$, bodyText, finalUrl], num: 11 },
    { fn: level12, args: [raw$, bodyText, finalUrl], num: 12 },
    { fn: level13, args: [raw$, finalUrl], num: 13 },
    { fn: level14, args: [raw$, bodyText, finalUrl], num: 14 },
    { fn: level15, args: [raw$, bodyText], num: 15 },
    { fn: level16, args: [raw$, finalUrl], num: 16 },
    { fn: level17, args: [raw$, finalUrl], num: 17 },
    { fn: level18, args: [raw$, bodyText, finalUrl], num: 18 },
    { fn: level19, args: [raw$, finalUrl], num: 19 },
    { fn: level20, args: [raw$, bodyText], num: 20 },
    { fn: level21, args: [raw$, bodyText, finalUrl], num: 21 }
  ];

  for (const lf of levelFns) {
    try {
      const result = lf.fn(...lf.args);
      levelResults.push(result);
    } catch (err) {
      console.error('Level ' + lf.num + ' error:', err.message);
      levelResults.push({
        level: lf.num,
        name: 'Level ' + lf.num,
        score: 0,
        issues: [{ severity: 'critical', impact: 'high', message: 'Level ' + lf.num + ' analysis failed: ' + err.message, fix: 'Check server logs for details.', evidence: err.message }],
        data: {}
      });
    }
  }

  // Step 5: Calculate overall score
  let totalScore = 0;
  let totalIssues = 0;
  let critical = 0, warnings = 0, info = 0;

  levelResults.forEach(l => {
    totalScore += l.score;
    if (l.issues) {
      l.issues.forEach(i => {
        totalIssues++;
        if (i.severity === 'critical') critical++;
        else if (i.severity === 'warning') warnings++;
        else info++;
      });
    }
  });

  const overallScore = Math.round(totalScore / levelResults.length);
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

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
    duration
  };
}

// --- ROUTES ---

app.post('/api/audit', async (req, res) => {
  if (req.headersSent) return;
  try {
    let { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    try { new URL(url); } catch { return res.status(400).json({ error: 'Invalid URL' }); }

    console.log('Starting audit for:', url);
    const result = await auditUrl(url);
    console.log('Audit complete:', result.overallScore, '/ 100 —', result.duration + 's');
    res.json(result);
  } catch (err) {
    console.error('Audit error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Audit failed: ' + err.message });
    }
  }
});

app.post('/api/export-pdf', async (req, res) => {
  if (req.headersSent) return;
  let browser;
  try {
    const { html } = req.body;
    if (!html) return res.status(400).json({ error: 'HTML content required' });

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
    console.error('PDF error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'PDF generation failed' });
    }
  } finally {
    if (browser) try { await browser.close(); } catch {}
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express error:', err.message);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`SEO Audit Tool running on http://localhost:${PORT}`);
});
