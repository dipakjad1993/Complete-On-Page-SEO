/**
 * File-backed audit history store (no native deps).
 * Persists last N audits to ./data/history.json so scores can be trended
 * and diffed without Redis/SQLite. Atomic write via tmp+rename.
 * @module src/history
 */
const fs = require('node:fs');
const path = require('node:path');
const logger = require('./logger');

const DATA_DIR = process.env.HISTORY_DIR || path.join(__dirname, '..', 'data');
const FILE = path.join(DATA_DIR, 'history.json');
const MAX_ENTRIES = parseInt(process.env.HISTORY_MAX || '200', 10);

function ensureDir() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    if (logger && logger.debug) {
      logger.debug('history ensureDir: ' + err.message);
    }
  }
}

/** @returns {Array} newest-first audit summaries */
function load() {
  ensureDir();
  try {
    const raw = fs.readFileSync(FILE, 'utf8');
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveAll(arr) {
  ensureDir();
  const tmp = FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(arr.slice(0, MAX_ENTRIES), null, 2));
  fs.renameSync(tmp, FILE);
}

/**
 * Record a completed audit (summary only — full levels stay in cache, not on disk).
 * @param {{url:string, overallScore:number, duration:string|number, summary:any, levels?:Array, meta?:any}} result
 */
function record(result) {
  try {
    const arr = load();
    arr.unshift({
      id: (result.meta && result.meta.auditId) || String(Date.now()),
      url: result.url,
      overallScore: result.overallScore,
      duration: result.duration,
      summary: result.summary || null,
      levelScores: Array.isArray(result.levels) ? result.levels.map((l) => ({ level: l.level, score: l.score })) : [],
      timestamp: (result.meta && result.meta.timestamp) || new Date().toISOString()
    });
    saveAll(arr);
  } catch (e) {
    if (logger && logger.warn) {
      logger.warn('history record failed: ' + e.message);
    }
  }
}

/** @param {string} url @param {number} [limit] */
function byUrl(url, limit = 20) {
  return load()
    .filter((h) => h.url === url)
    .slice(0, limit);
}

/**
 * Diff two audits for the same URL: score deltas per level + verdict.
 * @param {{levelScores:Array, overallScore:number}} a older
 * @param {{levelScores:Array, overallScore:number}} b newer
 */
function diff(a, b) {
  const mapA = new Map((a.levelScores || []).map((l) => [l.level, l.score]));
  const mapB = new Map((b.levelScores || []).map((l) => [l.level, l.score]));
  const levels = [];
  for (let lvl = 1; lvl <= 22; lvl++) {
    if (!mapA.has(lvl) && !mapB.has(lvl)) {
      continue;
    }
    const from = mapA.has(lvl) ? mapA.get(lvl) : null;
    const to = mapB.has(lvl) ? mapB.get(lvl) : null;
    levels.push({ level: lvl, from, to, delta: from == null || to == null ? null : to - from });
  }
  const overallDelta = b.overallScore - a.overallScore;
  return {
    from: { url: a.url, timestamp: a.timestamp, overallScore: a.overallScore },
    to: { url: b.url, timestamp: b.timestamp, overallScore: b.overallScore },
    overallDelta,
    verdict: overallDelta >= 5 ? 'improved' : overallDelta <= -5 ? 'regressed' : 'stable',
    levels
  };
}

module.exports = { load, record, byUrl, diff, FILE, MAX_ENTRIES };
