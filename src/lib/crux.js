/**
 * CrUX / PageSpeed fetcher with API-key wiring + honest fallback.
 * GET /api/crux?url= returns field data when Google answers, else a
 * structured `unmeasured` payload — never invented numbers.
 * @module src/lib/crux
 */
const logger = require('../logger');

/**
 * @param {string} url canonical public URL
 * @param {{timeoutMs?:number}} [opts]
 */
async function fetchCrux(url, opts = {}) {
  const key = process.env.PAGESPEED_API_KEY ? '&key=' + encodeURIComponent(process.env.PAGESPEED_API_KEY) : '';
  const api =
    'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=' +
    encodeURIComponent(url) +
    '&strategy=mobile&category=performance' +
    key;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), opts.timeoutMs || 25000);
  try {
    const r = await fetch(api, { signal: ctrl.signal });
    if (r.status === 429) {
      return {
        url,
        dataSource: 'Google PageSpeed Insights',
        unmeasured: true,
        reason: 'quota-exceeded (HTTP 429). Set PAGESPEED_API_KEY or retry later.',
        metrics: null
      };
    }
    if (!r.ok) {
      return { url, dataSource: 'Google PageSpeed Insights', unmeasured: true, reason: 'PageSpeed API error: ' + r.status, metrics: null };
    }
    const j = await r.json();
    const audits = (j.lighthouseResult && j.lighthouseResult.audits) || {};
    const pick = (k) =>
      audits[k] ? { score: audits[k].score ?? null, value: audits[k].displayValue || audits[k].numericValue || null } : null;
    // CrUX field data lives under loadingExperience when available
    const field = j.loadingExperience || j.originLoadingExperience || null;
    return {
      url,
      dataSource: 'Google PageSpeed Insights (CrUX field + lab). Not measured locally.',
      metrics: {
        LCP: pick('largest-contentful-paint'),
        INP: pick('interaction-to-next-paint'),
        CLS: pick('cumulative-layout-shift'),
        TTFB: pick('server-response-time'),
        FCP: pick('first-contentful-paint'),
        speedIndex: pick('speed-index')
      },
      fieldData: field
        ? { overallCategory: field.overall_category || null, metrics: field.metrics || null }
        : {
            overallCategory: null,
            metrics: null,
            note: 'No CrUX field data for this origin/URL (low traffic or too new). Lab metrics above are synthetic.'
          },
      performanceScore: j.lighthouseResult?.categories?.performance?.score ?? null,
      lighthouseVersion: j.lighthouseResult?.lighthouseVersion || null
    };
  } catch (e) {
    if (logger && logger.warn) {
      logger.warn('crux fetch failed: ' + e.message);
    }
    return { url, dataSource: 'Google PageSpeed Insights', unmeasured: true, reason: 'fetch failed: ' + e.message, metrics: null };
  } finally {
    clearTimeout(t);
  }
}

module.exports = { fetchCrux };
