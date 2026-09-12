#!/usr/bin/env node
/**
 * CLI — `npx complete-on-page-seo https://example.com`
 * Table-stakes parity with danishashko-style `npx seo-audit` tools.
 * Exits non-zero with --fail-on critical|warning when those issues exist.
 */
const { assertPublicUrl, normaliseUserUrl } = require('../src/middleware/ssrf');

async function main() {
  const args = process.argv.slice(2);
  const get = (flag, def = null) => {
    const i = args.indexOf(flag);
    return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : def;
  };
  const has = (flag) => args.includes(flag);
  if (has('--help') || has('-h') || args.length === 0) {
    console.log(`complete-on-page-seo — 22-level AI-search auditor

Usage:
  npx complete-on-page-seo https://example.com [options]

Options:
  --api <base>        API base (default http://localhost:3000)
  --json              Print raw JSON result
  --fail-on <level>   critical|warning — exit 1 when such issues exist
  --config <json>     Extra audit config as JSON string
  --help              This help`);
    process.exit(0);
  }
  const target = args.find((a) => !a.startsWith('--') && a !== get('--api') && a !== get('--fail-on') && a !== get('--config'));
  const api = (get('--api') || process.env.SEO_API || 'http://localhost:3000').replace(/\/$/, '');
  const failOn = get('--fail-on');
  let extraConfig = {};
  if (get('--config')) {
    try {
      extraConfig = JSON.parse(get('--config'));
    } catch {
      console.error('Invalid --config JSON');
      process.exit(2);
    }
  }
  let url = target;
  try {
    url = await assertPublicUrl(normaliseUserUrl(target));
  } catch (e) {
    console.error('Invalid URL: ' + e.message);
    process.exit(2);
  }
  const res = await fetch(api + '/api/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, config: extraConfig }),
    signal: AbortSignal.timeout(180000)
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('Audit failed (' + res.status + '): ' + (body.error || res.statusText));
    process.exit(1);
  }
  if (has('--json')) {
    console.log(JSON.stringify(body, null, 2));
  } else {
    console.log(`\nURL: ${body.url}\nScore: ${body.overallScore}/100  Duration: ${body.duration}s`);
    console.log(`Critical: ${body.summary.criticalIssues}  Warnings: ${body.summary.warnings}  Info: ${body.summary.info}\n`);
    for (const l of body.levels || []) {
      console.log(
        `L${String(l.level).padStart(2, '0')} ${String(l.score).padStart(3, ' ')}/100  ${l.name}  (${(l.issues || []).length} issues)`
      );
    }
  }
  if (failOn === 'critical' && body.summary.criticalIssues > 0) {
    process.exit(1);
  }
  if (failOn === 'warning' && body.summary.criticalIssues + body.summary.warnings > 0) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('CLI error: ' + e.message);
  process.exit(1);
});
