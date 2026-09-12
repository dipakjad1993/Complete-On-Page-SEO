/**
 * SSRF guard — single source of truth for every user-supplied URL.
 * Blocks private/loopback/link-local/cloud-metadata + DNS-rebind.
 * Re-exported by server.js so behaviour is identical, but importable for
 * routes, CLI and tests without pulling in Express/Puppeteer.
 * @module src/middleware/ssrf
 */
const dns = require('node:dns').promises;
const net = require('node:net');

/**
 * @param {string} hostname
 * @returns {boolean} true if the host can never be a public audit target
 */
function isPrivateHostname(hostname) {
  const h = String(hostname || '')
    .toLowerCase()
    .replace(/\.$/, '');
  if (!h) {
    return true;
  }
  if (h === 'localhost' || h.endsWith('.local') || h === 'metadata.google.internal') {
    return true;
  }
  if (h === 'metadata.google.internal.') {
    return true;
  }
  if (net.isIP(h)) {
    if (net.isIPv4(h)) {
      if (h.startsWith('10.') || h.startsWith('192.168.') || h === '0.0.0.0') {
        return true;
      }
      if (h.startsWith('127.') || h.startsWith('169.254.')) {
        return true;
      }
      const m = h.match(/^172\.(\d+)\./);
      if (m) {
        const n = parseInt(m[1], 10);
        if (n >= 16 && n <= 31) {
          return true;
        }
      }
      // 0.0.0.0/8, 100.64.0.0/10 (CGNAT), 192.0.2.0/24 TEST-NET, 198.18.0.0/15 benchmark
      if (h.startsWith('0.') || h.startsWith('100.64.') || h.startsWith('100.65.')) {
        return true;
      }
      if (/^100\.(6[4-9]|[78]\d|9\d|1[01]\d|12[0-7])\./.test(h)) {
        return true;
      }
      if (h.startsWith('192.0.2.') || h.startsWith('198.51.100.') || h.startsWith('203.0.113.')) {
        return true;
      }
      if (/^198\.(1[89]|2\d|3[01])\./.test(h)) {
        return true;
      }
    } else {
      if (h === '::1' || h === '::' || h.startsWith('fc') || h.startsWith('fd') || h.startsWith('fe80')) {
        return true;
      }
      if (h.startsWith('fec0') || h.startsWith('ff00') || h === '::ffff:127.0.0.1') {
        return true;
      }
    }
  }
  if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|127\.|0\.0\.0\.0)/.test(h)) {
    return true;
  }
  // Decimal/octal/hex IP obfuscation tricks (2130706433 = 127.0.0.1)
  if (/^\d+$/.test(h)) {
    const n = Number(h);
    if (Number.isSafeInteger(n) && n >= 0 && n <= 4294967295) {
      return true;
    }
  }
  if (/^0x[0-9a-f]+$/i.test(h)) {
    return true;
  }
  return false;
}

/**
 * Throws a 400 Error when the URL is not a public http(s) target.
 * @param {string} rawUrl
 * @returns {Promise<string>} canonical href
 */
async function assertPublicUrl(rawUrl) {
  let u;
  try {
    u = new URL(rawUrl);
  } catch {
    const e = new Error('Invalid URL');
    e.status = 400;
    throw e;
  }
  if (!/^https?:$/.test(u.protocol)) {
    const e = new Error('Only http(s) URLs are allowed');
    e.status = 400;
    throw e;
  }
  // Block embedded credentials — they leak via fetch + never belong in an audit target
  if (u.username || u.password) {
    const e = new Error('Blocked: URLs with credentials cannot be audited');
    e.status = 400;
    throw e;
  }
  if (isPrivateHostname(u.hostname)) {
    const e = new Error('Blocked: private/internal hosts cannot be audited (SSRF protection)');
    e.status = 400;
    throw e;
  }
  try {
    const addrs = await dns.lookup(u.hostname, { all: true });
    for (const a of addrs || []) {
      if (isPrivateHostname(a.address)) {
        const e = new Error('Blocked: hostname resolves to a private IP (SSRF protection)');
        e.status = 400;
        throw e;
      }
    }
  } catch (e) {
    if (e.status === 400) {
      throw e;
    }
    // DNS failure: let fetch produce the user-facing error (don't leak resolver details)
  }
  return u.href;
}

/**
 * Normalizes user input WITHOUT masking a non-http scheme.
 * "example.com" -> "https://example.com", but "ftp://x" stays and 400s.
 * @param {string} input
 */
function normaliseUserUrl(input) {
  const raw = String(input || '').trim();
  if (!raw) {
    const e = new Error('URL is required');
    e.status = 400;
    throw e;
  }
  if (raw.length > 2000) {
    const e = new Error('URL too long (max 2000 chars)');
    e.status = 400;
    throw e;
  }
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) && !/^https?:\/\//i.test(raw)) {
    const e = new Error('Only http(s) URLs are allowed');
    e.status = 400;
    throw e;
  }
  return /^https?:\/\//i.test(raw) ? raw : 'https://' + raw;
}

module.exports = { isPrivateHostname, assertPublicUrl, normaliseUserUrl };
