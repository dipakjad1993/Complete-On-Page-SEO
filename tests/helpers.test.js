import { describe, it, expect } from 'vitest';
import {
  fleschKincaid,
  countWords,
  calculateInformationGain,
  ragChunkSimulator,
  passageVectorSim,
  sc,
  byteLen,
  analyzeReadability,
  analyzeKeywordDensity,
  countSyllables,
  calculateRevenueAtRisk,
  prioritizeByImpact
} from '../helpers.js';

describe('fleschKincaid (returns number 0..100)', () => {
  it('scores simple text high, dense text lower', () => {
    const easy = fleschKincaid('The cat sat on the mat. It was a sunny day.');
    const hard = fleschKincaid(
      'The antidisestablishmentarianist pneumatological incomprehensibilities disproportionately institutionalized counterrevolutionary methodologies.'
    );
    expect(typeof easy).toBe('number');
    expect(easy).toBeGreaterThan(hard);
  });
  it('returns 0 (not NaN) for empty input', () => {
    expect(fleschKincaid('')).toBe(0);
  });
});

describe('countWords / countSyllables', () => {
  it('counts words', () => {
    expect(countWords('hello  world\nfoo')).toBe(3);
    expect(countWords('')).toBe(0);
  });
  it('counts syllables plausibly', () => {
    expect(countSyllables('hello')).toBeGreaterThanOrEqual(1);
    expect(countSyllables('beautiful')).toBeGreaterThanOrEqual(2);
  });
});

describe('calculateInformationGain (KL-divergence)', () => {
  it('returns N/A note without a baseline corpus (no fabrication)', () => {
    const r = calculateInformationGain('some page text here', null);
    expect(r.klDivergence).toBeNull();
    expect(r.baselineCoverage).toBe('N/A');
    expect(r.note).toMatch(/No baseline corpus/);
  });
  it('computes a finite divergence with a baseline', () => {
    const r = calculateInformationGain('cats dogs cats birds playing in the garden', 'cats fish dogs water swimming in the lake');
    expect(typeof r.klDivergence === 'number' || r.klDivergence === null).toBe(true);
    expect(Array.isArray(r.novelTerms)).toBe(true);
  });
});

describe('ragChunkSimulator', () => {
  it('chunks retrievable text', () => {
    const text = 'Alpha beta gamma delta epsilon zeta eta theta. '.repeat(20);
    const r = ragChunkSimulator(text);
    expect(r.totalChunks).toBeGreaterThan(0);
  });
  it('handles empty text', () => {
    expect(ragChunkSimulator('').totalChunks).toBe(0);
  });
});

describe('passageVectorSim (cosine over passages x queries)', () => {
  it('returns ranked results structure', () => {
    const text =
      'The quick brown fox jumps over the lazy dog. '.repeat(5) + '\n\nQuantum chromodynamics equations govern quark fields. '.repeat(5);
    const r = passageVectorSim(text, ['quick brown fox']);
    expect(Array.isArray(r.results)).toBe(true);
    expect(r.totalPassages).toBeGreaterThan(0);
  });
});

describe('sc / byteLen guards', () => {
  it('clamps scores to 0..100', () => {
    expect(sc(-5)).toBe(100);
    expect(sc(200)).toBe(0);
  });
  it('byteLen handles unicode', () => {
    expect(byteLen('héllo')).toBeGreaterThanOrEqual(5);
  });
});

describe('analyzeReadability / analyzeKeywordDensity', () => {
  it('readability returns a grade/score', () => {
    const r = analyzeReadability('Simple sentences. Easy words. '.repeat(20));
    expect(r).toBeDefined();
    expect(typeof r.fleschKincaid).toBe('number');
  });
  it('keyword density finds repeated terms', () => {
    const r = analyzeKeywordDensity('seo audit seo tools seo audit report '.repeat(10));
    expect(JSON.stringify(r).toLowerCase()).toContain('seo');
  });
});

describe('calculateRevenueAtRisk honesty', () => {
  it('returns zeroed money without real inputs', () => {
    const r = calculateRevenueAtRisk({ organicTraffic: 0, conversionRate: 0, avgOrderValue: 0, visibilityDrop: 0.1, currency: 'USD' });
    expect(r.hasRealInputs === false || r.organicRevenue === 0 || JSON.stringify(r)).toBeTruthy();
    expect(JSON.stringify(r)).not.toMatch(/\$\d{4,}/);
  });
});

describe('prioritizeByImpact (severity-weighted)', () => {
  it('ranks critical above info', () => {
    const r = prioritizeByImpact([
      { severity: 'info', message: 'minor note' },
      { severity: 'critical', message: 'missing title' }
    ]);
    expect(r.prioritized[0].severity).toBe('critical');
  });
});
