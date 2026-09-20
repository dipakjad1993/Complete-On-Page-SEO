import { describe, it, expect, vi } from 'vitest';

// Mocked-Puppeteer e2e: proves audit orchestration + scoring without downloading Chrome.
// Real browser is exercised in prod; CI uses this mock for speed + reliability.
vi.mock('puppeteer', () => ({
  default: {
    launch: vi.fn(async () => ({
      newPage: async () => ({
        setUserAgent: async () => {},
        setViewport: async () => {},
        goto: async () => ({ request: () => ({ redirectChain: () => [] }) }),
        evaluate: async () => ({ ttfb: 100, domContentLoaded: 300, loadComplete: 600 }),
        content: async () =>
          '<html><head><title>Mocked page — Example Brand</title><meta name="description" content="Mocked description for CI."></head><body><h1>Mocked</h1><p>Search engine optimization is the practice of improving page quality.</p></body></html>',
        url: () => 'https://example.com/',
        close: async () => {}
      }),
      close: async () => {}
    }))
  },
  launch: vi.fn(async () => ({
    newPage: async () => ({
      setUserAgent: async () => {},
      setViewport: async () => {},
      goto: async () => ({ request: () => ({ redirectChain: () => [] }) }),
      evaluate: async () => ({ ttfb: 100, domContentLoaded: 300, loadComplete: 600 }),
      content: async () => '<html><head><title>Mocked page</title></head><body><h1>Mocked</h1></body></html>',
      url: () => 'https://example.com/',
      close: async () => {}
    }),
    close: async () => {}
  }))
}));

import request from 'supertest';
import app from '../server.js';

describe('mocked e2e (no Chrome download)', () => {
  it('GET /api/health exposes version + levels=22 + cache', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.levels).toBe(22);
    expect(res.body.cache).toBeTruthy();
  });

  it('history diff carries weightedScore when present (trend-chart ready)', async () => {
    const history = await import('../src/history.js');
    const a = { url: 'https://e.com', timestamp: 't1', overallScore: 60, weightedScore: 62, levelScores: [{ level: 1, score: 60 }] };
    const b = { url: 'https://e.com', timestamp: 't2', overallScore: 70, weightedScore: 73, levelScores: [{ level: 1, score: 80 }] };
    const d = history.diff(a, b);
    expect(d.overallDelta).toBe(10);
    expect(d.weightedDelta).toBe(11);
    expect(typeof history.record).toBe('function');
  });
});
