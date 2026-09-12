/**
 * Small SSRF-safe text fetcher used by L22 (robots/llms/sitemap probes).
 * Never throws — returns { status, text } with status 0 on network failure.
 * @module src/lib/netfetch
 */

/**
 * @param {string} url already assertPublicUrl'd
 * @param {{timeoutMs?:number, maxBytes?:number, accept?:string}} [opts]
 */
async function fetchText(url, opts = {}) {
  const timeoutMs = opts.timeoutMs || 8000;
  const maxBytes = opts.maxBytes || 256 * 1024;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, {
      signal: ctrl.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CompleteOnPageSEO/1.3; +https://github.com/dipakjad1993/Complete-On-Page-SEO)',
        Accept: opts.accept || 'text/plain,text/html,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    const text = await r.text();
    const sliced = Buffer.byteLength(text, 'utf8') > maxBytes ? text.slice(0, maxBytes) : text;
    return { status: r.status, text: sliced, finalUrl: r.url || url };
  } catch (e) {
    return { status: 0, text: '', error: e.message };
  } finally {
    clearTimeout(t);
  }
}

module.exports = { fetchText };
