import { describe, it, expect } from 'vitest';
import { isPrivateHostname, normaliseUserUrl } from '../src/middleware/ssrf.js';
import { parseRobots, parseSitemapXml, isSitemapIndex } from '../src/lib/sitemap.js';
import { LruCache } from '../src/cache.js';
import { diff } from '../src/history.js';
import { computeWeightedScore, zeroClickBrandValue, LEVEL_WEIGHTS } from '../src/levels/index.js';

describe('SSRF guard hardening (1.3.0)', () => {
  it('blocks classic privates', () => {
    expect(isPrivateHostname('localhost')).toBe(true);
    expect(isPrivateHostname('127.0.0.1')).toBe(true);
    expect(isPrivateHostname('10.1.2.3')).toBe(true);
    expect(isPrivateHostname('192.168.1.1')).toBe(true);
    expect(isPrivateHostname('172.20.5.4')).toBe(true);
    expect(isPrivateHostname('169.254.169.254')).toBe(true);
    expect(isPrivateHostname('::1')).toBe(true);
    expect(isPrivateHostname('metadata.google.internal')).toBe(true);
  });
  it('blocks CGNAT + TEST-NET + obfuscated numerics', () => {
    expect(isPrivateHostname('100.64.0.1')).toBe(true);
    expect(isPrivateHostname('192.0.2.44')).toBe(true);
    expect(isPrivateHostname('198.51.100.7')).toBe(true);
    expect(isPrivateHostname('203.0.113.9')).toBe(true);
    expect(isPrivateHostname('2130706433')).toBe(true); // 127.0.0.1 decimal
    expect(isPrivateHostname('0x7f000001')).toBe(true);
  });
  it('allows public hosts', () => {
    expect(isPrivateHostname('example.com')).toBe(false);
    expect(isPrivateHostname('8.8.8.8')).toBe(false);
  });
  it('normaliseUserUrl keeps ftp:// visible so it 400s', () => {
    expect(normaliseUserUrl('example.com')).toBe('https://example.com');
    expect(() => normaliseUserUrl('ftp://example.com/x')).toThrow();
    expect(() => normaliseUserUrl('')).toThrow();
  });
});

describe('sitemap/robots lib', () => {
  it('parses Sitemap: + AI-bot rules', () => {
    const r = parseRobots('User-agent: *\nDisallow: /tmp\n\nSitemap: https://example.com/sitemap.xml\nUser-agent: GPTBot\nDisallow: /');
    expect(r.sitemaps).toContain('https://example.com/sitemap.xml');
    expect(r.aiBotRules['gptbot'].disallow).toContain('/');
  });
  it('parses sitemap locs + detects index', () => {
    expect(isSitemapIndex('<sitemapindex><sitemap><loc>https://e.com/a.xml</loc></sitemap></sitemapindex>')).toBe(true);
    expect(parseSitemapXml('<urlset><url><loc>https://e.com/a</loc></url></urlset>')).toContain('https://e.com/a');
  });
});

describe('LRU cache', () => {
  it('evicts oldest beyond max + tracks hitRate', () => {
    const c = new LruCache({ max: 3, ttlMs: 60000 });
    c.set('a', 1);
    c.set('b', 2);
    c.set('c', 3);
    c.set('d', 4);
    expect(c.get('a')).toBeNull();
    expect(c.get('d')).toBe(4);
    expect(c.stats().evictions).toBe(1);
    expect(c.stats().hitRate).toBeGreaterThanOrEqual(0);
  });
  it('expires after TTL', async () => {
    const c = new LruCache({ max: 10, ttlMs: 10 });
    c.set('x', 9);
    await new Promise((r) => setTimeout(r, 25));
    expect(c.get('x')).toBeNull();
  });
});

describe('history diff', () => {
  it('verdicts improved/regressed/stable', () => {
    const a = { url: 'https://e.com', timestamp: 't1', overallScore: 60, levelScores: [{ level: 1, score: 60 }] };
    const b = { url: 'https://e.com', timestamp: 't2', overallScore: 70, levelScores: [{ level: 1, score: 80 }] };
    const d = diff(a, b);
    expect(d.overallDelta).toBe(10);
    expect(d.verdict).toBe('improved');
    expect(d.levels[0].delta).toBe(20);
  });
});

describe('weighted scoring + zero-click brand value', () => {
  it('weights foundation levels higher than dev-cluster', () => {
    expect(LEVEL_WEIGHTS[1]).toBeGreaterThan(LEVEL_WEIGHTS[5]);
    const levels = [
      { level: 1, score: 100 },
      { level: 5, score: 0 }
    ];
    const w = computeWeightedScore(levels);
    // L1 1.5x vs L5 0.7x => (150+0)/2.2 = 68
    expect(w).toBe(68);
  });
  it('zeroClickBrandValue is $0-gated without GA4 inputs', () => {
    const r = zeroClickBrandValue({});
    expect(r.monthlyBrandValue).toBe(0);
    expect(r.hasRealInputs).toBe(false);
  });
  it('zeroClickBrandValue monetizes with GA4 inputs (35% lift assumption)', () => {
    const r = zeroClickBrandValue({ monthlyTraffic: 50000, avgOrderValue: 75, conversionRate: 2.5 });
    // 50000*75*0.025=93750 *0.35=32812.5 => 32813
    expect(r.monthlyBrandValue).toBe(32813);
    expect(r.hasRealInputs).toBe(true);
  });
});
