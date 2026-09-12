import { describe, it, expect } from 'vitest';
import { load } from 'cheerio';
import { level1, level3, level7, level14, level20, level21 } from '../levels.js';
import { level22 } from '../src/levels/level22.js';

const HTML = `<!DOCTYPE html><html lang="en"><head>
<title>Example SEO Audit Guide — Example Brand</title>
<meta name="description" content="A concise factual guide to on-page SEO audits, RAG visibility and revenue impact.">
<link rel="canonical" href="https://example.com/seo-guide">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta property="og:title" content="Example SEO Audit Guide">
</head><body>
<h1>Example SEO Audit Guide</h1>
<p>Search engine optimization is the practice of improving page quality for users and crawlers. This guide is a factual overview of audits, headings, and metadata.</p>
<h2>Technical checklist</h2>
<p>The checklist covers titles, descriptions, canonical links, headings, images with alt text, and structured data for AI answers.</p>
<img src="/img/a.png" alt="Audit checklist diagram" width="800" height="600">
<a href="/related">Related guide</a> <a href="https://example.com/other">Other page</a>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"Example SEO Audit Guide"}</script>
</body></html>`;

function $(html = HTML) {
  return load(html);
}

describe('levels: pure-function domain coverage (fixture)', () => {
  it('L1 scores a healthy page high with zero criticals', () => {
    const r = level1($(), 'https://example.com/seo-guide', { 'x-robots-tag': 'all' }, HTML, { keywords: 'seo audit' });
    expect(r.level).toBe(1);
    expect(r.score).toBeGreaterThan(60);
    expect(r.issues.filter((i) => i.severity === 'critical').length).toBe(0);
  });
  it('L1 flags a missing title as critical', () => {
    const bad = load('<html><head></head><body><h1>x</h1></body></html>');
    const r = level1(bad, 'https://example.com/', {}, '<html></html>', {});
    expect(r.issues.some((i) => i.severity === 'critical')).toBe(true);
  });
  it('L3 returns readability + entities + honest KL without corpus', () => {
    const body = $('body').text();
    const r = level3($(), body, 'https://example.com/seo-guide', { keywords: 'seo audit' });
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(JSON.stringify(r.data).toLowerCase()).toContain('readab');
  });
  it('L7 audits images (alt/dims) from real DOM', () => {
    const r = level7($(), {});
    expect(r.level).toBe(7);
    expect(JSON.stringify(r.data).length).toBeGreaterThan(50);
  });
  it('L14 is $0-gated without GA4 inputs (honesty)', () => {
    const body = $('body').text();
    const r = level14($(), body, 'https://example.com/seo-guide', {});
    expect(r.data.revenueAtRisk.hasRealInputs).toBe(false);
    expect(r.data.revenueAtRisk.totalAtRisk).toBe(0);
    expect(r.data.businessMetrics.estimatedMonthlyRevenue).toBe(0);
  });
  it('L14 monetizes with GA4 inputs', () => {
    const body = $('body').text();
    const r = level14($(), body, 'https://example.com/seo-guide', {
      monthlyTraffic: 50000,
      avgOrderValue: 75,
      conversionRate: 2.5,
      currency: 'USD'
    });
    expect(r.score).toBeGreaterThanOrEqual(0);
  });
  it('L20 audits security headers honestly', () => {
    const r = level20($(), $('body').text(), 'https://example.com/', {});
    expect(r.level).toBe(20);
  });
  it('L21 rolls up portfolio signals', () => {
    const r = level21($(), $('body').text(), 'https://example.com/', {});
    expect(r.level).toBe(21);
    expect(r.score).toBeGreaterThanOrEqual(0);
  });
});

describe('L22 AI-search readiness', () => {
  it('rewards llms.txt + open AI bots + citation surface', () => {
    const r = level22(
      $(),
      'https://example.com/seo-guide',
      {},
      {
        responseHeaders: {},
        robotsTxt: 'User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nAllow: /\n',
        llmsTxt: { status: 200, text: '# Example\n\nSummary of docs.\n\nSee https://example.com/docs and contact support.\n'.repeat(20) },
        sitemapUrls: []
      }
    );
    expect(r.level).toBe(22);
    expect(r.data.llmsTxt.status).toBe('found');
    expect(r.score).toBeGreaterThan(50);
  });
  it('flags missing llms.txt + blocked AI bots', () => {
    const r = level22(
      $(),
      'https://example.com/',
      {},
      {
        responseHeaders: {},
        robotsTxt: 'User-agent: GPTBot\nDisallow: /\n',
        llmsTxt: { status: 404, text: '' },
        sitemapUrls: []
      }
    );
    expect(r.issues.some((i) => /llms\.txt/i.test(i.message))).toBe(true);
    expect(r.data.robotsAi.blockedBots).toContain('GPTBot');
  });
  it('flags missing title as critical (citation surface)', () => {
    const bad = load('<html><head></head><body><p>' + 'word '.repeat(150) + '</p></body></html>');
    const r = level22(bad, 'https://example.com/', {}, { responseHeaders: {}, robotsTxt: '', llmsTxt: { status: 404, text: '' } });
    expect(r.issues.some((i) => i.severity === 'critical')).toBe(true);
  });
});
