import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js';

describe('GET /api/health', () => {
  it('returns ok with version + uptime', async () => {
    const r = await request(app).get('/api/health');
    expect(r.status).toBe(200);
    expect(r.body.status).toBe('ok');
    expect(r.body.version).toBeDefined();
    expect(typeof r.body.uptime).toBe('number');
  });
});

describe('GET /api', () => {
  it('lists endpoints', async () => {
    const r = await request(app).get('/api');
    expect(r.status).toBe(200);
    expect(Array.isArray(r.body.endpoints)).toBe(true);
  });
});

describe('POST /api/audit validation + SSRF', () => {
  it('400s on missing url', async () => {
    const r = await request(app).post('/api/audit').send({});
    expect(r.status).toBe(400);
  });
  it('400s on private host (SSRF guard)', async () => {
    const r = await request(app).post('/api/audit').send({ url: 'http://127.0.0.1/admin' });
    expect(r.status).toBe(400);
  });
  it('400s on localhost', async () => {
    const r = await request(app).post('/api/audit').send({ url: 'http://localhost:3000/' });
    expect(r.status).toBe(400);
  });
  it('400s on metadata IP', async () => {
    const r = await request(app).post('/api/audit').send({ url: 'http://169.254.169.254/latest/meta-data/' });
    expect(r.status).toBe(400);
  });
  it('400s on non-http scheme', async () => {
    const r = await request(app).post('/api/audit').send({ url: 'ftp://example.com/file' });
    expect(r.status).toBe(400);
  });
  it('400s on oversized viewport', async () => {
    const r = await request(app)
      .post('/api/audit')
      .send({ url: 'https://example.com', config: { viewportWidth: 99999 } });
    expect(r.status).toBe(400);
  });
});

describe('POST /api/analyze-url SSRF', () => {
  it('400s on localhost', async () => {
    const r = await request(app).post('/api/analyze-url').send({ url: 'http://localhost/' });
    expect(r.status).toBe(400);
  });
});
