/**
 * Production LRU audit cache with TTL + stats.
 * Replaces the unbounded in-memory Map (OOM risk) with a 500-key LRU.
 * Key = url + stable config hash. Value = { at, result }.
 * @module src/cache
 */
const logger = require('./logger');

class LruCache {
  /**
   * @param {{max?:number, ttlMs?:number}} [opts]
   */
  constructor(opts = {}) {
    this.max = opts.max || 500;
    this.ttlMs = opts.ttlMs || 60 * 60 * 1000;
    /** @type {Map<string,{at:number,result:any,hits:number}>} */
    this.map = new Map();
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
  }

  /** Stable key: url + sorted config JSON (key order independent). */
  key(url, config) {
    const cfg = config && typeof config === 'object' ? sortKeys(config) : config;
    return String(url) + '|' + JSON.stringify(cfg || {});
  }

  /** @returns {any|null} cached result or null */
  get(k) {
    const e = this.map.get(k);
    if (!e) {
      this.misses++;
      return null;
    }
    if (Date.now() - e.at > this.ttlMs) {
      this.map.delete(k);
      this.misses++;
      return null;
    }
    // LRU touch: re-insert to mark most-recently-used
    this.map.delete(k);
    this.map.set(k, e);
    e.hits++;
    this.hits++;
    return e.result;
  }

  /** @param {string} k @param {any} result */
  set(k, result) {
    if (this.map.has(k)) {
      this.map.delete(k);
    }
    this.map.set(k, { at: Date.now(), result, hits: 0 });
    while (this.map.size > this.max) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
      this.evictions++;
    }
    if (logger && logger.debug) {
      logger.debug('cache set', { key: k.slice(0, 80), size: this.map.size });
    }
  }

  clear() {
    this.map.clear();
  }

  stats() {
    return {
      size: this.map.size,
      max: this.max,
      ttlMs: this.ttlMs,
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      hitRate: this.hits + this.misses === 0 ? null : +(this.hits / (this.hits + this.misses)).toFixed(3)
    };
  }
}

function sortKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sortKeys);
  }
  if (obj && typeof obj === 'object') {
    const out = {};
    Object.keys(obj)
      .sort()
      .forEach((k) => {
        out[k] = sortKeys(obj[k]);
      });
    return out;
  }
  return obj;
}

module.exports = { LruCache, sortKeys };
