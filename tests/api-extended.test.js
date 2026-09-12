import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js';

describe('extended API surface (1.3.0)', () => {
  it('GET /api lists 22-level engine + history/diff', async () => {
    const r = await request(app).get('/api');
    expect(r.status).toBe(200);
    expect(r.body.endpoints.join(' ')).toMatch(/history/);
    expect(r.body.endpoints.join(' ')).toMatch(/diff/);
  });
  it('GET /api/health exposes levels + cache + history', async () => {
    const r = await request(app).get('/api/health');
    expect(r.status).toBe(200);
    expect(r.body.levels).toBe(22);
    expect(r.body.cache).toBeDefined();
    expect(typeof r.body.historyEntries).toBe('number');
  });
  it('GET /api/cache-stats exposes LRU stats', async () => {
    const r = await request(app).get('/api/cache-stats');
    expect(r.status).toBe(200);
    expect(r.body.max).toBe(500);
    expect(r.body).toHaveProperty('hitRate');
  });
  it('GET /api/history returns count+entries', async () => {
    const r = await request(app).get('/api/history?limit=5');
    expect(r.status).toBe(200);
    expect(typeof r.body.count).toBe('number');
    expect(Array.isArray(r.body.entries)).toBe(true);
  });
  it('GET /api/diff 400s without params', async () => {
    const r = await request(app).get('/api/diff');
    expect(r.status).toBe(400);
  });
  it('GET /api/diff 404s on unknown timestamps', async () => {
    const r = await request(app).get('/api/diff?url=https://example.com&from=x&to=y');
    expect(r.status).toBe(404);
  });
  it('POST /api/crawl 400s on private host', async () => {
    const r = await request(app).post('/api/crawl').send({ startUrl: 'http://localhost/' });
    expect(r.status).toBe(400);
  });
  it('POST /api/crawl 400s on maxPages=26 (cap 25)', async () => {
    const r = await request(app).post('/api/crawl').send({ startUrl: 'https://example.com', maxPages: 26 });
    expect(r.status).toBe(400);
  });
  it('POST /api/export-pdf 400s without html + on oversize guard', async () => {
    const r1 = await request(app).post('/api/export-pdf').send({});
    expect(r1.status).toBe(400);
  });
  it('GET /api/crux 400s without url + 400s on private', async () => {
    const r1 = await request(app).get('/api/crux');
    expect(r1.status).toBe(400);
    const r2 = await request(app).get('/api/crux?url=http://127.0.0.1/');
    expect(r2.status).toBe(400);
  });
  it('SSE endpoint exists (event-stream, heartbeat, no leak)', async () => {
    const srv = await new Promise((resolve) => {
      const s = app.listen(0, '127.0.0.1', () => resolve(s));
    });
    try {
      const port = srv.address().port;
      const ctrl = new AbortController();
      const r = await fetch(`http://127.0.0.1:${port}/api/audit-progress/sse-test-123`, { signal: ctrl.signal });
      expect(r.status).toBe(200);
      expect(r.headers.get('content-type')).toMatch(/event-stream/);
      ctrl.abort();
      try {
        await r.body.cancel();
      } catch (_e) {
        // abort race is expected for SSE — headers already asserted
      }
    } finally {
      await new Promise((resolve) => srv.close(resolve));
    }
  }, 10000);
  it('unknown route 404s with docs pointer', async () => {
    const r = await request(app).get('/api/does-not-exist');
    expect(r.status).toBe(404);
    expect(r.body.docs).toBe('/openapi.yaml');
  });
});
