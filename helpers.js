const cheerio = require('cheerio');

function sc(pen) {
  return Math.max(0, Math.min(100, 100 - pen));
}

function byteLen(s) {
  return Buffer.byteLength(s || '', 'utf8');
}

function pxWidth(s) {
  let w = 0;
  for (const c of (s || '')) {
    if ('iljtfr'.includes(c)) w += 4;
    else if ('I.J'.includes(c)) w += 5;
    else if ('mw'.includes(c)) w += 7;
    else if ('MW'.includes(c)) w += 8;
    else if (c.charCodeAt(0) > 127) w += 12;
    else w += 8;
  }
  return w;
}

function cssEscape(s) {
  if (!s) return '';
  return s.replace(/([^\w-])/g, (ch) => {
    const code = ch.charCodeAt(0);
    if (code === 0) return '\ufffd';
    if (code >= 1 && code <= 31) return '\\' + code.toString(16) + ' ';
    if (code === 0x2D || code === 0x5F || (code >= 0x30 && code <= 0x39) || (code >= 0x41 && code <= 0x5A) || (code >= 0x61 && code <= 0x7A)) return ch;
    return '\\' + ch;
  });
}

function sel($, el) {
  try {
    if (!el || !el.tagName) return '';
    const id = $(el).attr('id');
    if (id) return '#' + cssEscape(String(id));
    const tag = String(el.tagName || '').toLowerCase();
    const cls = String($(el).attr('class') || '').trim().split(/\s+/).filter(c => c)[0];
    const parent = el.parent;
    const idx = parent ? $(parent).children(tag).toArray().indexOf(el) + 1 : 1;
    return tag + (cls ? '.' + cssEscape(cls) : '') + ':nth-of-type(' + idx + ')';
  } catch (e) { return ''; }
}

function stripHtml(s) {
  if (!s) return '';
  return s.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

function getTextContent($) {
  try {
    const body = $('body');
    if (!body.length) return '';
    return body.text().replace(/\s+/g, ' ').trim();
  } catch (e) { return ''; }
}

function getSelectorChain($, el) {
  try {
    if (!el || !el.tagName) return '';
    const parts = [];
    let current = el;
    while (current && current.tagName) {
      parts.unshift(sel($, current));
      current = current.parent;
      if (parts.length > 5) break;
    }
    return parts.join(' > ');
  } catch (e) { return ''; }
}

function extractAllAttributes($, el) {
  const attrs = {};
  if (!el || !el.attribs) return attrs;
  Object.keys(el.attribs).forEach(k => { attrs[k] = el.attribs[k]; });
  return attrs;
}

function analyzeInlineStyles($, el) {
  const style = $(el).attr('style') || '';
  const result = { raw: style, hasImportant: style.includes('!important'), properties: {} };
  style.split(';').filter(s => s.trim()).forEach(decl => {
    const parts = decl.split(':');
    if (parts.length >= 2) {
      const prop = parts[0].trim();
      const val = parts.slice(1).join(':').trim();
      result.properties[prop] = val;
    }
  });
  return result;
}

function syllables(w) {
  w = (w || '').toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  return (w.match(/[aeiouy]{1,2}/g) || []).length || 1;
}

function fleschKincaid(text) {
  const sents = text.split(/[.!?]+/).filter(s => s.trim());
  const words = text.split(/\s+/).filter(w => w);
  if (words.length === 0 || sents.length === 0) return 0;
  const syls = words.reduce((c, w) => c + syllables(w), 0);
  return Math.max(0, Math.min(100, 206.835 - 1.015 * (words.length / sents.length) - 84.6 * (syls / words.length)));
}

function extractSchemas($) {
  const schemas = [];
  $('script[type="application/ld+json"]').each((i, el) => {
    const raw = $(el).html() || '';
    try {
      const parsed = JSON.parse(raw);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      arr.forEach(s => {
        if (s && s['@type']) schemas.push({ type: s['@type'], data: s, raw, valid: true, index: i });
      });
    } catch (e) {
      schemas.push({ type: 'invalid', data: null, raw, valid: false, error: e.message, index: i });
    }
  });
  return schemas;
}

function chunkText(text, size) {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += size) {
    chunks.push(words.slice(i, i + size).join(' '));
  }
  return chunks;
}

function analyzeSchema($) {
  const schemas = extractSchemas($);
  return schemas.map(s => {
    if (!s.valid) return { ...s, validation: { valid: false, errors: [s.error], warnings: [] } };
    const errors = [];
    const warnings = [];
    if (s.type === 'Article' || s.type === 'NewsArticle' || s.type === 'BlogPosting') {
      if (!s.data.headline) errors.push('Missing "headline"');
      if (!s.data.image) errors.push('Missing "image"');
      if (!s.data.datePublished) errors.push('Missing "datePublished"');
      if (!s.data.author) errors.push('Missing "author"');
      if (!s.data.publisher) warnings.push('Missing "publisher"');
    }
    if (s.type === 'Product') {
      if (!s.data.name) errors.push('Missing "name"');
      if (!s.data.image) errors.push('Missing "image"');
      if (!s.data.offers) errors.push('Missing "offers"');
      else {
        if (!s.data.offers.price) errors.push('Missing "offers.price"');
        if (!s.data.offers.priceCurrency) errors.push('Missing "offers.priceCurrency"');
      }
    }
    if (s.type === 'FAQPage') {
      if (!s.data.mainEntity || !Array.isArray(s.data.mainEntity) || s.data.mainEntity.length === 0) errors.push('Missing "mainEntity"');
    }
    if (s.type === 'HowTo') {
      if (!s.data.step || !Array.isArray(s.data.step) || s.data.step.length === 0) errors.push('Missing "step" array');
    }
    if (!s.data['@context']) errors.push('Missing @context');
    else if (s.data['@context'] !== 'https://schema.org') warnings.push('@context should be https://schema.org');
    const eligible = ['Article','Product','FAQPage','HowTo','LocalBusiness','Event','Recipe','VideoObject','Organization','WebSite','BreadcrumbList','Review','SoftwareApplication','Book','Movie','TVSeries','MusicAlbum','Course','JobPosting','Occupation','Service','MedicalWebPage'];
    const googleEligible = errors.length === 0 && eligible.includes(s.type);
    return { ...s, validation: { valid: errors.length === 0, errors, warnings, googleEligible } };
  });
}

function detectAIPatterns(text) {
  const safeText = String(text || '');
  if (!safeText.trim()) return { score: 0, matches: [] };
  const patterns = [
    { r: /in this (article|post|guide|blog)/gi, n: 'generic-intro' },
    { r: /let'?s (dive|explore|discuss|delve)/gi, n: 'cliche-opener' },
    { r: /without further ado/gi, n: 'filler' },
    { r: /in conclusion,?/gi, n: 'generic-conclusion' },
    { r: /it'?s (worth|important|crucial) (noting|mentioning)/gi, n: 'hedging' },
    { r: /as we (all )?know/gi, n: 'false-consensus' },
    { r: /in today'?s (digital|modern|fast-paced)/gi, n: 'ai-starter' },
    { r: /first and foremost/gi, n: 'cliche' },
    { r: /last but not least/gi, n: 'cliche' },
    { r: /delve into/gi, n: 'ai-buzzword' },
    { r: /landscape/gi, n: 'ai-buzzword' },
    { r: /leverage/gi, n: 'ai-buzzword' },
    { r: /streamline/gi, n: 'ai-buzzword' },
    { r: /holistic/gi, n: 'ai-buzzword' },
    { r: /it is important to note/gi, n: 'filler' },
    { r: /with that being said/gi, n: 'filler' },
    { r: /in order to/gi, n: 'wordy' },
    { r: /ever-evolving/gi, n: 'ai-buzzword' },
    { r: /game-changer/gi, n: 'cliche' },
    { r: /cutting-edge/gi, n: 'cliche' },
    { r: /thought leadership/gi, n: 'ai-buzzword' },
    { r: /best-in-class/gi, n: 'ai-buzzword' },
    { r: /world-class/gi, n: 'ai-buzzword' },
    { r: /unlock the/gi, n: 'ai-buzzword' },
    { r: /revolutionize/gi, n: 'ai-buzzword' },
    { r: /transformative/gi, n: 'ai-buzzword' },
    { r: /seamless(ly)?/gi, n: 'ai-buzzword' },
    { r: /robust/gi, n: 'ai-buzzword' },
    { r: /dynamic/gi, n: 'ai-buzzword' },
    { r: /innovative/gi, n: 'ai-buzzword' },
    { r: /user-friendly/gi, n: 'cliche' },
    { r: /state-of-the-art/gi, n: 'cliche' },
    { r: /at the end of the day/gi, n: 'cliche' },
    { r: /think outside the box/gi, n: 'cliche' },
    { r: /synergy/gi, n: 'ai-buzzword' },
    { r: /paradigm/gi, n: 'ai-buzzword' },
    { r: /empower/gi, n: 'ai-buzzword' },
    { r: /scalable/gi, n: 'ai-buzzword' },
    { r: /ecosystem/gi, n: 'ai-buzzword' },
    { r: /in the realm of/gi, n: 'wordy' },
    { r: /when it comes to/gi, n: 'wordy' },
    { r: /a lot of/gi, n: 'wordy' },
    { r: /due to the fact that/gi, n: 'wordy' },
    { r: /in the event that/gi, n: 'wordy' }
  ];
  const matches = [];
  let score = 0;
  patterns.forEach(({ r, n }) => {
    const m = text.match(r);
    if (m) { score += m.length * 8; matches.push({ pattern: n, count: m.length, example: m[0] }); }
  });
  return { score: Math.min(100, score), matches };
}

function analyzeImage($, el) {
  const src = ($(el).attr('src') || '').split('?')[0];
  const alt = $(el).attr('alt');
  const altExists = $(el).is('[alt]');
  const w = $(el).attr('width'), h = $(el).attr('height');
  const loading = $(el).attr('loading');
  const fetchpriority = $(el).attr('fetchpriority');
  const decoding = $(el).attr('decoding');
  const format = src.split('.').pop().toLowerCase();
  const selector = sel($, el);
  const chain = getSelectorChain($, el);
  const html = $.html(el).substring(0, 300);
  const srcset = $(el).attr('srcset');
  const sizes = $(el).attr('sizes');
  const isLazy = loading === 'lazy';
  const isEager = loading === 'eager';
  let quality = 'good';
  const issues = [];
  const recommendations = [];
  if (!altExists) { quality = 'critical'; issues.push('Missing alt attribute'); recommendations.push('Add descriptive alt text'); }
  else if (alt === '' && !$(el).attr('role')) { quality = 'warning'; issues.push('Empty alt without role'); recommendations.push('Either add descriptive alt or role="presentation"'); }
  else if (alt && alt.split(/\s+/).length > 15) { quality = 'warning'; issues.push('Alt text too long (' + alt.split(/\s+/).length + ' words)'); recommendations.push('Keep alt under 15 words'); }
  else if (alt && /^(img|image|photo|picture|logo|icon|banner|thumbnail)$/i.test(alt)) { quality = 'warning'; issues.push('Generic alt text'); recommendations.push('Describe the image content specifically'); }
  if (!w || !h) issues.push('Missing width/height attributes');
  if (!loading) issues.push('Missing loading attribute');
  if (!srcset) issues.push('Missing srcset for responsive images');
  if (['png', 'gif', 'bmp'].includes(format)) issues.push('Unoptimized format ' + format.toUpperCase());
  if (!['webp', 'avif'].includes(format) && src) issues.push('Not using modern format (WebP/AVIF)');
  return { src: src.substring(0, 200), alt, altExists, altWordCount: alt ? alt.split(/\s+/).length : 0, width: w, height: h, loading, fetchpriority, decoding, format, srcset: !!srcset, sizes, selector, chain, html, quality, issues, recommendations, isLazy, isEager, hasDimensions: !!(w && h) };
}

function analyzeLink($, el, pageUrl) {
  const href = $(el).attr('href') || '';
  const text = $(el).text().trim();
  const rel = ($(el).attr('rel') || '').toLowerCase();
  const target = $(el).attr('target') || '';
  const title = $(el).attr('title') || '';
  const ariaLabel = $(el).attr('aria-label') || '';
  const selector = sel($, el);
  const chain = getSelectorChain($, el);
  const html = $.html(el).substring(0, 300);
  let hostname = ''; try { hostname = new URL(pageUrl).hostname; } catch {}
  let linkHostname = ''; try { if (href.startsWith('http')) linkHostname = new URL(href).hostname; } catch {}
  const isExternal = href.startsWith('http') && linkHostname && linkHostname !== hostname;
  const isNofollow = rel.includes('nofollow');
  const isSponsored = rel.includes('sponsored');
  const isUGC = rel.includes('ugc');
  const isHash = href.startsWith('#');
  const isJavaScript = href.startsWith('javascript:');
  const isMailto = href.startsWith('mailto:');
  const isTel = href.startsWith('tel:');
  const isDownload = !!$(el).attr('download');
  const isEmpty = !text && !$(el).find('img[alt]').length && !($(el).attr('title')) && !ariaLabel;
  const isGeneric = /^(click here|here|read more|learn more|more|link|this|go|details|view|download|visit|start|get started)$/i.test(text);
  const hasImage = $(el).find('img').length > 0;
  const issues = [];
  if (isEmpty && !isHash && !isJavaScript) issues.push('No accessible text');
  if (isGeneric) issues.push('Generic anchor text');
  if (target === '_blank' && !rel.includes('noopener')) issues.push('Missing rel="noopener" with target="_blank"');
  const protocol = href.startsWith('https') ? 'https' : href.startsWith('http') ? 'http' : 'other';
  let classification = 'internal';
  if (isExternal) classification = 'external'; else if (isHash) classification = 'anchor'; else if (isJavaScript) classification = 'javascript'; else if (isMailto) classification = 'email'; else if (isTel) classification = 'phone';
  return { href: href.substring(0, 300), text: text.substring(0, 150), rel, target, title, ariaLabel, selector, chain, html, isExternal, isNofollow, isSponsored, isUGC, isHash, isJavaScript, isMailto, isTel, isDownload, isEmpty, isGeneric, hasImage, issues, classification, protocol, linkHostname };
}

function analyzeHeading($, el) {
  const text = $(el).text().trim();
  const textLen = text.length;
  const wordCount = text.split(/\s+/).filter(w => w).length;
  const innerHTML = $(el).html() || '';
  return { level: parseInt(el.tagName[1]), text: text.substring(0, 200), wordCount, textLen, selector: sel($, el), chain: getSelectorChain($, el), html: $.html(el).substring(0, 300), isEmpty: !text, hasLinks: $(el).find('a').length > 0, hasImages: $(el).find('img').length > 0, hasFormatting: /<(strong|em|b|i|span|mark)>.+<\/\1>/i.test(innerHTML), innerHTML: innerHTML.substring(0, 200) };
}

function analyzeAccessibility($) {
  const linksNoText = $('a[href]').filter((_, el) => !$(el).text().trim() && !$(el).attr('aria-label') && !$(el).find('img[alt]').length).length;
  const buttonsNoText = $('button').filter((_, el) => !$(el).text().trim() && !$(el).attr('aria-label')).length;
  const inputsNoLabel = $('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"])').filter((_, el) => {
    const id = $(el).attr('id'); return !$(el).attr('aria-label') && !$(el).attr('aria-labelledby') && !$('label[for="' + id + '"]').length && !$(el).closest('label').length; }).length;
  const imagesNoAlt = $('img:not([alt])').length;
  const videosNoCaptions = $('video').filter((_, el) => !$(el).find('track[kind="captions"], track[kind="subtitles"]').length).length;
  const iframesNoTitle = $('iframe').filter((_, el) => !$(el).attr('title')).length;
  const hasSkipLink = $('a[href*="#main"], a[href*="#content"], a[class*="skip"], a[href*="#skiptocontent"]').length > 0;
  const hasLang = !!$('html').attr('lang');
  const hasRoleMain = $('[role="main"], main').length > 0;
  const score = Math.max(0, 100 - linksNoText * 3 - buttonsNoText * 2 - inputsNoLabel * 3 - imagesNoAlt * 2 - videosNoCaptions * 2 - iframesNoTitle * 2);
  return { linksWithoutText: linksNoText, buttonsWithoutText: buttonsNoText, inputsWithoutLabel: inputsNoLabel, imagesWithoutAlt: imagesNoAlt, videosWithoutCaptions: videosNoCaptions, iframesWithoutTitle: iframesNoTitle, hasSkipLink, hasLang, hasRoleMain, score };
}

function countWords(text) { return String(text || '').split(/\s+/).filter(w => w.length > 0).length; }

function extractEntities(text) {
  const safeText = String(text || '');
  if (!safeText.trim()) return [];
  const properNouns = safeText.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
  const freq = {};
  properNouns.forEach(n => { freq[n] = (freq[n] || 0) + 1; });
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 30);
}

function extractAllMentions(text, terms) {
  const safeText = String(text || '');
  if (!safeText.trim() || !Array.isArray(terms) || terms.length === 0) return {};
  const lower = safeText.toLowerCase(); const results = {};
  terms.forEach(term => { const regex = new RegExp('\\b' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi'); const matches = lower.match(regex); if (matches) results[term] = matches.length; });
  return results;
}

function analyzeReadability(text) {
  const safeText = String(text || '');
  if (!safeText.trim()) return { fleschKincaid: 0, avgSentenceLength: 0, avgWordLength: 0, readingLevel: 'unknown', wordCount: 0, sentenceCount: 0 };
  const sentences = safeText.split(/[.!?]+/).filter(s => s.trim().length > 5);
  const words = safeText.split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0 || sentences.length === 0) return { fleschKincaid: 0, avgSentenceLength: 0, avgWordLength: 0, readingLevel: 'unknown', wordCount: 0, sentenceCount: 0 };
  const fk = fleschKincaid(text);
  const avgSentLen = words.length / sentences.length;
  const avgWordLen = words.reduce((s, w) => s + w.length, 0) / words.length;
  let rl = 'professional';
  if (fk >= 90) rl = 'very-easy'; else if (fk >= 80) rl = 'elementary'; else if (fk >= 70) rl = 'fairly-easy';
  else if (fk >= 60) rl = 'standard'; else if (fk >= 50) rl = 'fairly-difficult'; else if (fk >= 30) rl = 'difficult'; else if (fk >= 20) rl = 'complex';
  return { fleschKincaid: Math.round(fk * 10) / 10, avgSentenceLength: Math.round(avgSentLen * 10) / 10, avgWordLength: Math.round(avgWordLen * 10) / 10, readingLevel: rl, wordCount: words.length, sentenceCount: sentences.length };
}

function analyzeKeywordDensity(text, topN) {
  if (topN === undefined) topN = 15;
  const safeText = String(text || '');
  if (!safeText.trim()) return [];
  const stopWords = new Set(['the','be','to','of','and','a','in','that','have','i','it','for','not','on','with','he','as','you','do','at','this','but','his','by','from','they','we','say','her','she','or','an','will','my','one','all','would','there','their','what','so','up','out','if','about','who','get','which','go','me','when','make','can','like','time','no','just','him','know','take','people','into','year','your','good','some','could','them','see','other','than','then','now','look','only','come','its','over','think','also','back','after','use','two','how','our','work','first','well','way','even','new','want','because','any','these','give','day','most','us']);
  const words = safeText.toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
  const freq = {}; const pos = {};
  words.forEach((w, idx) => { freq[w] = (freq[w] || 0) + 1; if (!pos[w]) pos[w] = []; if (pos[w].length < 3) pos[w].push(idx); });
  const total = words.length || 1;
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, topN).map(([word, count]) => ({ word, count, density: ((count / total) * 100).toFixed(2) + '%', firstPositions: (pos[word] || []).map(p => p), spread: (pos[word] && pos[word].length > 1) ? 'well-distributed' : 'clustered' }));
}

function analyzeBigrams(text, topN) {
  if (topN === undefined) topN = 10;
  const safeText = String(text || '');
  if (!safeText.trim()) return [];
  const stopWords = new Set(['the','be','to','of','and','a','in','that','have','i','it','for','not','on','with','he','as','you','do','at','this','but','his','by','from','they','we','say','her','she','or','an','will','my','one','all','would','there','their','what','so','up','out','if','about','who','get','which','go','me','when','make','can','like','time','no','just','him','know','take','people','into','year','your','good','some','could','them','see','other','than','then','now','look','only','come','its','over','think','also','back','after','use','two','how','our','work','first','well','way','even','new','want','because','any','these','give','day','most','us']);
  const words = safeText.toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
  const freq = {};
  for (let i = 0; i < words.length - 1; i++) { const bg = words[i] + ' ' + words[i + 1]; freq[bg] = (freq[bg] || 0) + 1; }
  const total = words.length || 1;
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, topN).map(([bg, count]) => ({ bigram: bg, count, density: ((count * 2 / total) * 100).toFixed(2) + '%' }));
}

function analyzeContentStructure(t) {
  const safeT = String(t || '');
  if (!safeT.trim()) return { paragraphs: 0, sentences: 0, avgParagraphLength: 0, questions: 0, numbers: 0, percentages: 0, monetary: 0, quotedTexts: 0, parentheticals: 0, exclamations: 0, colons: 0, semicolons: 0 };
  const p = safeT.split(/\n\s*\n/).filter(x => x.trim().length > 0);
  const s = safeT.split(/[.!?]+/).filter(x => x.trim().length > 5);
  const q = (t.match(/\b(how|what|why|when|where|who|can|does|is|are|do|should|will|would|could|may|might|shall|ought|must|need)\b\s+[^?]+\?/gi) || []).length;
  const n = (t.match(/\d+/g) || []).length;
  const pc = (t.match(/\d+\.?\d*%/g) || []).length;
  const m = (t.match(/[\$\€\£\¥]\s?\d+(\.\d+)?/g) || []).length;
  const qq = (t.match(/"([^"]+)"/g) || []).length;
  const pa = (t.match(/\(([^)]+)\)/g) || []).length;
  const ex = (t.match(/!/g) || []).length;
  const co = (t.match(/:/g) || []).length;
  const sc = (t.match(/;/g) || []).length;
  return { paragraphs: p.length, sentences: s.length, avgParagraphLength: p.length > 0 ? Math.round(s.length / p.length) : 0, questions: q, numbers: n, percentages: pc, monetary: m, quotedTexts: qq, parentheticals: pa, exclamations: ex, colons: co, semicolons: sc };
}

function analyzeTransitionWords(text) {
  const safeText = String(text || '');
  if (!safeText.trim()) return { transitions: {}, total: 0 };
  const tr = {
    addition: ['furthermore','moreover','additionally','also','and','besides','in addition','not only','as well as','plus'],
    contrast: ['however','but','yet','although','though','nevertheless','nonetheless','on the other hand','conversely','whereas','while','despite','in contrast','alternatively','otherwise'],
    cause: ['because','therefore','thus','hence','consequently','accordingly','as a result','due to','since','so','thereby','for this reason'],
    sequence: ['first','second','third','next','then','finally','subsequently','afterward','previously','meanwhile','later','initially','ultimately','lastly','eventually'],
    emphasis: ['indeed','certainly','surely','obviously','clearly','undoubtedly','without doubt','in fact','above all','especially','particularly','significantly','notably'],
    example: ['for example','for instance','such as','including','like','namely','to illustrate','specifically','in particular'],
    conclusion: ['in conclusion','to conclude','in summary','to summarize','overall','all in all','in short','in brief','ultimately','finally','in essence']
  };
  const results = {}; let total = 0;
  Object.entries(tr).forEach(([cat, words]) => {
    const sum = words.reduce((acc, w) => { const re = new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi'); const m = text.match(re); return acc + (m ? m.length : 0); }, 0);
    if (sum > 0) results[cat] = sum; total += sum;
  });
  return { transitions: results, total };
}

function detectContentQualityFlags(text) {
  const safeText = String(text || '');
  if (!safeText.trim()) return [];
  const flags = [];
  if (/\bI (think|believe|feel|guess|suppose)\b/i.test(safeText)) flags.push({ type: 'subjectivity', severity: 'warning', message: 'Subjective language (I think/believe/feel) weakens authority' });
  const hc = (safeText.match(/\b(maybe|perhaps|possibly|probably|might|potentially)\b/gi) || []).length;
  if (hc > 3) flags.push({ type: 'uncertainty', severity: 'warning', message: 'Overuse of hedging language (' + hc + ' instances)' });
  const fc = (text.match(/\b(very|really|quite|extremely|incredibly|absolutely|totally|completely|literally|actually|basically|essentially|simply|just)\b/gi) || []).length;
  if (fc > 5) flags.push({ type: 'filler', severity: 'info', message: 'Overuse of intensifiers/filler words (' + fc + ' instances)' });
  const hpc = (text.match(/\b(exciting|amazing|incredible|unbelievable|fantastic|extraordinary|remarkable|outstanding|phenomenal|revolutionary|groundbreaking)\b/gi) || []).length;
  if (hpc > 3) flags.push({ type: 'hyperbole', severity: 'info', message: 'Excessive hyperbolic language (' + hpc + ' instances)' });
  return flags;
}

function analyzeNLP(t) {
  const safeT = String(t || '');
  if (!safeT.trim()) return { wordCount: 0, characterCount: 0, uniqueWords: 0, lexicalDiversity: '0%', avgWordLength: '0', longWordsCount: 0, longWordPercentage: '0%', sentenceCount: 0, avgWordsPerSentence: '0' };
  const w = safeT.split(/\s+/).filter(x => x); const s = safeT.split(/[.!?]+/).filter(x => x.trim().length > 2);
  const u = new Set(w.map(x => x.toLowerCase())).size; const ld = w.length > 0 ? (u / w.length) * 100 : 0;
  const lw = w.filter(x => x.length > 6).length; const lwp = w.length > 0 ? (lw / w.length) * 100 : 0;
  const awl = w.length > 0 ? w.reduce((x, y) => x + y.length, 0) / w.length : 0;
  return { wordCount: w.length, characterCount: t.length, uniqueWords: u, lexicalDiversity: ld.toFixed(1) + '%', avgWordLength: awl.toFixed(1), longWordsCount: lw, longWordPercentage: lwp.toFixed(1) + '%', sentenceCount: s.length, avgWordsPerSentence: s.length > 0 ? (w.length / s.length).toFixed(1) : '0' };
}

function analyzeTitlePrecision($, url) {
  const t = $('title').first(); const title = t.length ? String(t.text().trim()) : '';
  const bl = byteLen(title); const px = pxWidth(title);
  const truncationRisk = px > 580 || bl > 70; const bytesOverflow = Math.max(0, bl - 70);
  const hasDynamic = /[%][sS]|\{title\}|\{term\}|\{keyword\}|\[keyword\]|<%|<\?=|{{/i.test(title);
  const h1 = $('h1').first().text().trim(); const matchesH1 = h1 && title.toLowerCase().includes(h1.toLowerCase().substring(0, 30));
  const og = $('meta[property="og:title"]').attr('content') || ''; const matchesOg = og && title === og;
  let rewriteRisk = 'low'; const recs = [];
  if (!title) { rewriteRisk = 'critical'; recs.push('No title tag found — Google will auto-generate one'); }
  else {
    if (truncationRisk) { rewriteRisk = 'high'; recs.push('Title may truncate in SERPs — reduce to under 580px width'); }
    if (hasDynamic) { if (rewriteRisk !== 'high') rewriteRisk = 'medium'; recs.push('Dynamic substitution patterns detected — Google may rewrite'); }
    if (!matchesH1 && h1) recs.push('Title does not match H1 — Google may rewrite based on heading');
    if (!matchesOg && og) recs.push('Title differs from og:title');
  }
  return { title, byteLen: bl, pxWidth: px, truncationRisk, bytesOverflow, dynamicSubstitution: hasDynamic, matchesH1, matchesOgTitle: matchesOg, googleRewriteRisk: rewriteRisk, recommendations: recs };
}

function analyzeHeadingHierarchy($) {
  const headings = []; const issues = []; const visual = []; let prev = 0; let h1c = 0;
  $('h1,h2,h3,h4,h5,h6').each((i, el) => {
    const t = $(el).text().trim(); const lv = parseInt(el.tagName[1]); if (lv === 1) h1c++;
    const empty = t.length === 0; headings.push({ level: lv, text: t.substring(0, 200), selector: sel($, el), length: t.length, isEmpty: empty });
    if (lv > prev + 1 && prev > 0) issues.push({ type: 'skipped-level', from: prev, to: lv, selector: sel($, el), text: t.substring(0, 50) }); prev = lv;
  });
  if (h1c > 1) issues.push({ type: 'multiple-h1', count: h1c }); if (h1c === 0) issues.push({ type: 'missing-h1' });
  headings.filter(h => h.isEmpty).forEach(h => issues.push({ type: 'empty-heading', level: h.level, selector: h.selector }));
  $('[style*="font-size"]').each((i, el) => {
    const m = ($(el).attr('style') || '').match(/font-size\s*:\s*(\d+)/i);
    if (m) { const sz = parseInt(m[1]); const tag = (el.tagName || '').toLowerCase();
      if (sz >= 24 && !['h1','h2','h3','h4','h5','h6','title'].includes(tag)) { const txt = $(el).text().trim().substring(0, 100);
        if (txt.length > 0) visual.push({ tag, fontSize: sz + 'px', text: txt, selector: sel($, el), suggestion: 'Use semantic heading (H' + (sz >= 32 ? '1' : sz >= 26 ? '2' : '3') + ') instead of styled ' + tag }); } }
  });
  return { headings, hierarchyIssues: issues, visualVsSemantic: visual, totalHeadings: headings.length, h1Count: h1c, hasSkippedLevels: issues.some(i => i.type === 'skipped-level') };
}

function analyzeCanonicalIntegrity($, url) {
  const els = $('link[rel="canonical"]'); const issues = [];
  let canon = ''; let selfRef = false; let crossDom = false; let hasParams = false;
  const multi = els.length > 1;
  if (els.length === 0) issues.push('No canonical tag found');
  else {
    canon = String($(els[0]).attr('href') || '');
    try { const cu = new URL(canon); const pu = new URL(url);
      selfRef = canon.replace(/\/$/, '') === url.replace(/\/$/, ''); crossDom = cu.hostname !== pu.hostname; hasParams = cu.search.length > 0;
      if (multi) issues.push('Multiple canonical tags found on page');
      if (crossDom) issues.push('Cross-domain canonical detected — may dilute authority');
      if (hasParams) issues.push('Canonical includes URL parameters');
      if (!selfRef && !crossDom) issues.push('Canonical points to different URL on same domain');
    } catch (_) { issues.push('Invalid canonical URL'); }
  }
  return { canonicalUrl: canon, isSelfReferential: selfRef, crossDomain: crossDom, hasParams, loopDetected: false, multipleCanonicals: multi, issues };
}

function analyzeMediaOptimization($) {
  const images = []; const formatCounts = {}; let missingDimensions = 0; let clsRiskScore = 0; let brokenSvgCount = 0;
  $('img').each((i, el) => {
    const src = ($(el).attr('src') || '').split('?')[0]; const alt = $(el).attr('alt') || '';
    const w = $(el).attr('width'); const h = $(el).attr('height'); const loading = $(el).attr('loading');
    const format = src.split('.').pop().toLowerCase().split('?')[0];
    formatCounts[format] = (formatCounts[format] || 0) + 1;
    let altScore = 0;
    if (!$(el).is('[alt]')) altScore = 0; else if (alt.length === 0) altScore = 20;
    else if (/^(img|image|photo|picture|logo|icon|banner|thumbnail)$/i.test(alt)) altScore = 30;
    else if (alt.split(/\s+/).length > 15) altScore = 50; else if (alt.split(/\s+/).length > 5) altScore = 80; else altScore = 90;
    if (!w || !h) { missingDimensions++; clsRiskScore = Math.min(100, clsRiskScore + 5); }
    const isLazy = loading === 'lazy';
    images.push({ src: src.substring(0, 200), alt, format, width: w, height: h, hasDimensions: !!(w && h), loading, isLazy, altScore });
  });
  $('svg').each((i, el) => { const text = $(el).text().trim(); if (!text && !$(el).attr('aria-label') && !$(el).attr('role')) brokenSvgCount++; });
  return { images, formatsBreakdown: formatCounts, clsRiskScore, missingDimensions, brokenSvgCount, totalImages: images.length };
}

function analyzeHttpHeaders(headers) {
  const h = headers || {}; const statusCode = parseInt(String(h[':status'] || h['status'] || '200'));
  const xRobotsTag = h['x-robots-tag'] || ''; const cacheControl = h['cache-control'] || '';
  const contentType = h['content-type'] || ''; const cors = h['access-control-allow-origin'] || '';
  const server = h['server'] || ''; const serverTiming = h['server-timing'] || '';
  const linkHeader = h['link'] || '';
  const canonMatch = linkHeader.match(/<([^>]+)>.*rel="?canonical"?/i);
  const canonicalFromHeader = canonMatch ? canonMatch[1] : '';
  const hasNosniff = (h['x-content-type-options'] || '').toLowerCase() === 'nosniff';
  const hasHSTS = !!h['strict-transport-security']; const hasFrameOptions = !!h['x-frame-options'];
  const hasPermissionsPolicy = !!h['permissions-policy']; const hasReferrerPolicy = !!h['referrer-policy'];
  const securityHeaders = { xContentTypeOptions: hasNosniff, hsts: hasHSTS, xFrameOptions: hasFrameOptions, permissionsPolicy: hasPermissionsPolicy, referrerPolicy: hasReferrerPolicy };
  const xrIssues = []; if (xRobotsTag.includes('noindex')) xrIssues.push('noindex set via header');
  if (xRobotsTag.includes('nofollow')) xrIssues.push('nofollow set via header'); if (xRobotsTag.includes('nosnippet')) xrIssues.push('nosnippet set via header');
  const cacheIssues = []; if (!cacheControl) cacheIssues.push('No Cache-Control header');
  else if (!cacheControl.includes('public') && !cacheControl.includes('private')) cacheIssues.push('Cache-Control missing access directive');
  const corsIssues = []; if (!cors) corsIssues.push('No CORS header'); else if (cors === '*') corsIssues.push('CORS allows all origins');
  return { statusCode, statusClass: Math.floor(statusCode / 100) + 'xx', xRobotsTag: { raw: xRobotsTag, noindex: xRobotsTag.includes('noindex'), nofollow: xRobotsTag.includes('nofollow'), issues: xrIssues }, cacheControl: { raw: cacheControl, hasCache: !!cacheControl, maxAge: (cacheControl.match(/max-age=(\d+)/) || [])[1] || null, issues: cacheIssues }, serverTiming: { raw: serverTiming, present: !!serverTiming }, cors: { raw: cors, present: !!cors, issues: corsIssues }, contentType: { raw: contentType, isHtml: contentType.includes('text/html') }, linkCanonical: { raw: canonicalFromHeader, present: !!canonicalFromHeader }, securityHeaders, securityScore: [hasNosniff, hasHSTS, hasFrameOptions, hasPermissionsPolicy, hasReferrerPolicy].filter(Boolean).length * 20, server };
}

function analyzeInternalLinks($, url) {
  const internal = []; const external = []; const deadFragments = []; let nofollowCount = 0; let total = 0;
  let hostname = ''; try { hostname = new URL(String(url || '')).hostname; } catch (_) {}
  $('a[href]').each((i, el) => {
    const href = $(el).attr('href') || ''; const text = $(el).text().trim();
    const rel = ($(el).attr('rel') || '').toLowerCase(); const isNofollow = rel.includes('nofollow');
    const isSponsored = rel.includes('sponsored'); const isUGC = rel.includes('ugc');
    const anchorText = text || $(el).attr('aria-label') || $(el).attr('title') || ''; total++;
    if (isNofollow || isSponsored || isUGC) nofollowCount++;
    let linkHostname = ''; try { if (href.startsWith('http')) linkHostname = new URL(href).hostname; } catch (_) {}
    const isExt = href.startsWith('http') && linkHostname && linkHostname !== hostname; const isHash = href.startsWith('#');
    if (isHash && href.length > 1) { const targetId = href.substring(1); if (!$('#' + cssEscape(targetId)).length) deadFragments.push({ href, selector: sel($, el), text: anchorText.substring(0, 50) }); }
    const obj = { href: href.substring(0, 300), text: anchorText.substring(0, 150), rel, isNofollow, isSponsored, isUGC, selector: sel($, el), hasText: !!anchorText, isGeneric: /^(click here|here|read more|learn more|more|link|this|go|details|view|download|visit|start|get started)$/i.test(anchorText) };
    if (isExt) external.push(obj); else if (!isHash && !href.startsWith('javascript:') && !href.startsWith('mailto:') && !href.startsWith('tel:')) internal.push(obj);
  });
  const density = total > 0 ? (internal.length / Math.max(1, $('p, h1, h2, h3, h4, h5, h6, li').length)) : 0;
  return { internal, external, total, internalCount: internal.length, externalCount: external.length, nofollowCount, deadFragments, density: Math.round(density * 100) / 100 };
}

function ssrVsCsrDiff(rawHtml, renderedHtml) {
  const raw$ = cheerio.load(String(rawHtml || '')); const rend$ = cheerio.load(String(renderedHtml || ''));
  const addedElements = []; const missingFromRaw = []; const jsDependentText = [];
  const rawText = raw$('body').text().replace(/\s+/g, ' ').trim(); const rendText = rend$('body').text().replace(/\s+/g, ' ').trim();
  const rawWords = new Set(rawText.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  const rendWords = rendText.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const jsOnlyWords = rendWords.filter(w => !rawWords.has(w));
  if (jsOnlyWords.length > 0) jsDependentText.push({ count: jsOnlyWords.length, samples: jsOnlyWords.slice(0, 20) });
  const rawTags = {}; raw$('body *').each((i, el) => { const t = (el.tagName || '').toLowerCase(); rawTags[t] = (rawTags[t] || 0) + 1; });
  const rendTags = {}; rend$('body *').each((i, el) => { const t = (el.tagName || '').toLowerCase(); rendTags[t] = (rendTags[t] || 0) + 1; });
  Object.keys(rendTags).forEach(tag => {
    if (!rawTags[tag]) missingFromRaw.push({ tag, count: rendTags[tag], message: 'Element "' + tag + '" only exists in rendered HTML' });
    else if (rendTags[tag] > rawTags[tag] * 1.5) addedElements.push({ tag, rawCount: rawTags[tag], rendCount: rendTags[tag], message: 'Significantly more "' + tag + '" after JS (' + rawTags[tag] + ' -> ' + rendTags[tag] + ')' });
  });
  const rawSchemas = raw$('script[type="application/ld+json"]').length; const rendSchemas = rend$('script[type="application/ld+json"]').length;
  if (rendSchemas > rawSchemas) missingFromRaw.push({ tag: 'script[type="application/ld+json"]', count: rendSchemas - rawSchemas, message: 'Structured data injected via JS' });
  const wordRatio = rendWords.length > 0 ? rawWords.size / rendWords.length : 1; const ssrRatio = Math.min(1, Math.max(0, wordRatio));
  let verdict = 'fully server-rendered'; if (ssrRatio < 0.5) verdict = 'mostly client-side rendered'; else if (ssrRatio < 0.85) verdict = 'hybrid rendering with significant JS content';
  return { addedElements, missingFromRaw, jsDependentText, jsDependentCount: jsOnlyWords.length, ssrRatio: Math.round(ssrRatio * 100) / 100, verdict, rawTextLength: rawText.length, renderedTextLength: rendText.length };
}

function analyzeDomDepth($) {
  let nodeCount = 0; let maxDepth = 0; let totalDepth = 0; let sampledNodes = 0;
  const depthBuckets = { '1-4': 0, '5-8': 0, '9-16': 0, '17-24': 0, '25+': 0 }; const childDist = {}; let shadowDomCount = 0;
  function walk(el, depth) {
    nodeCount++; totalDepth += depth; sampledNodes++; if (depth > maxDepth) maxDepth = depth;
    if (depth <= 4) depthBuckets['1-4']++; else if (depth <= 8) depthBuckets['5-8']++; else if (depth <= 16) depthBuckets['9-16']++; else if (depth <= 24) depthBuckets['17-24']++; else depthBuckets['25+']++;
    const children = $(el).children(); const childCount = children.length;
    if (childCount > 0) { const tag = (el.tagName || '').toLowerCase(); childDist[tag] = (childDist[tag] || 0) + childCount; }
    children.each((i, c) => walk(c, depth + 1));
  }
  $('body').children().each((i, c) => walk(c, 1));
  if ($('*').filter((i, el) => el.tagName && el.tagName.includes('-')).length > 0) shadowDomCount++;
  const avgDepth = sampledNodes > 0 ? totalDepth / sampledNodes : 0;
  let rating = 'good'; if (nodeCount > 1500) rating = 'poor'; else if (nodeCount > 800) rating = 'moderate'; else if (nodeCount > 500) rating = 'fair';
  return { nodeCount, maxDepth, avgDepth: Math.round(avgDepth * 10) / 10, depthBuckets, childDistribution: Object.entries(childDist).sort((a, b) => b[1] - a[1]).slice(0, 15), shadowDomDetected: shadowDomCount > 0, rating, thresholds: { warning: 800, critical: 1500, depthWarning: 16, depthCritical: 32 } };
}

function validateSchemaComprehensive($) {
  const schemas = []; const warnings = []; const missingRequired = []; const circularRefs = []; let validCount = 0; let invalidCount = 0;
  const requiredFields = { 'Product': ['name', 'offers'], 'Article': ['headline', 'author', 'datePublished'], 'NewsArticle': ['headline', 'author', 'datePublished'], 'BlogPosting': ['headline', 'author', 'datePublished'], 'Event': ['name', 'startDate', 'location'], 'LocalBusiness': ['name', 'address'], 'Organization': ['name'], 'Person': ['name'], 'Recipe': ['name', 'recipeIngredient'], 'VideoObject': ['name', 'description', 'thumbnailUrl'], 'JobPosting': ['title', 'description', 'hiringOrganization'], 'Course': ['name', 'provider'], 'FAQPage': ['mainEntity'], 'HowTo': ['step'], 'Book': ['name', 'author'], 'Movie': ['name', 'actor'], 'MusicAlbum': ['name', 'byArtist'], 'Review': ['itemReviewed', 'reviewRating'], 'SoftwareApplication': ['name', 'operatingSystem', 'applicationCategory'] };
  const deprecatedTypes = ['WebPageElement', 'WPHeader', 'WPFooter', 'WPSideBar', 'DataCatalog', 'NutritionInformation'];
  const extracted = extractSchemas($);
  extracted.forEach(s => {
    if (!s.valid) { invalidCount++; schemas.push(s); return; }
    const errs = []; const warn = [];
    if (deprecatedTypes.includes(s.type)) warn.push(s.type + ' is a deprecated schema.org type');
    const reqs = requiredFields[s.type] || [];
    reqs.forEach(field => { const parts = field.split('.'); let obj = s.data; for (const p of parts) { if (obj && obj[p] !== undefined) obj = obj[p]; else { errs.push('Missing required field: "' + field + '" for type ' + s.type); break; } } });
    if (!s.data['@context']) errs.push('Missing @context'); else if (s.data['@context'] !== 'https://schema.org') warn.push('@context should be https://schema.org');
    if (s.data.image && typeof s.data.image === 'string' && !s.data.image.startsWith('http')) warn.push('Image URL should be absolute: ' + s.data.image);
    if (s.data.url && typeof s.data.url === 'string' && !s.data.url.startsWith('http')) warn.push('URL should be absolute: ' + s.data.url);
    const entityIds = new Set();
    (function extractIds(obj) { if (!obj || typeof obj !== 'object') return; if (obj['@id']) { if (entityIds.has(obj['@id'])) circularRefs.push({ id: obj['@id'], type: s.type }); entityIds.add(obj['@id']); } Object.values(obj).forEach(v => { if (typeof v === 'object') extractIds(v); }); })(s.data);
    if (errs.length > 0) { invalidCount++; errs.forEach(e => missingRequired.push({ schemaType: s.type, field: e, selector: 'script[type="application/ld+json"]:nth-of-type(' + (s.index + 1) + ')' })); } else validCount++;
    schemas.push({ ...s, validation: { valid: errs.length === 0, errors: errs, warnings: warn, googleEligible: errs.length === 0 && !warn.some(w => deprecatedTypes.some(d => w.includes(d))) } });
  });
  if (extracted.length === 0) warnings.push('No structured data found on page');
  return { schemas, validCount, invalidCount, missingRequired, circularRefs, warnings };
}

function analyzeCoreWebVitals(metrics) {
  const m = metrics || {};
  const measured = {};
  ['lcp', 'fid', 'cls', 'inp', 'ttfv', 'fcp', 'si', 'tbt'].forEach(k => {
    if (m[k] !== undefined && m[k] !== null && !isNaN(m[k])) measured[k] = m[k];
  });
  const rate = (v, g, p) => { if (v <= g) return 'good'; if (v <= p) return 'needs-improvement'; return 'poor'; };
  const thresholds = {
    lcp: { label: 'LCP', good: 2500, poor: 4000 },
    fid: { label: 'FID', good: 100, poor: 300 },
    cls: { label: 'CLS', good: 0.1, poor: 0.25 },
    inp: { label: 'INP', good: 200, poor: 500 },
    ttfv: { label: 'TTFB', good: 800, poor: 1600 },
    fcp: { label: 'FCP', good: 1800, poor: 3000 },
    si: { label: 'SI', good: 3400, poor: 5800 },
    tbt: { label: 'TBT', good: 300, poor: 600 }
  };
  const assessments = {};
  const passedTests = [];
  const failedTests = [];
  const unmeasured = [];
  let score = 100;
  Object.keys(thresholds).forEach(k => {
    const t = thresholds[k];
    if (measured[k] === undefined) { unmeasured.push(t.label); return; }
    const rating = rate(measured[k], t.good, t.poor);
    assessments[t.label] = { value: measured[k], rating, measured: true, good: t.good, poor: t.poor };
    if (rating === 'good') passedTests.push(t.label);
    else if (rating === 'poor') { failedTests.push(t.label); score -= 25; }
    else { failedTests.push(t.label); score -= 10; }
  });
  if (score < 0) score = 0;
  const rated = Object.keys(assessments).map(k => assessments[k]);
  let finalLabel = 'not-measured';
  if (rated.length > 0) {
    if (rated.some(a => a.rating === 'poor')) finalLabel = 'fail';
    else if (rated.some(a => a.rating === 'needs-improvement')) finalLabel = 'needs-improvement';
    else finalLabel = 'pass';
  }
  return {
    assessments,
    score,
    passedTests,
    failedTests,
    unmeasured,
    measuredCount: Object.keys(measured).length,
    totalScore: score,
    verdict: finalLabel,
    si: measured.si,
    tbt: measured.tbt,
    dataSource: 'measured via headless Chrome Navigation Timing / PerformanceObserver. Metrics without a measured value are listed in unmeasured and were NOT fabricated.',
    thresholdBreakdown: { thresholds: { good: { LCP: 2500, FID: 100, CLS: 0.1, INP: 200, TTFB: 800, FCP: 1800, SI: 3400, TBT: 300 }, poor: { LCP: 4000, FID: 300, CLS: 0.25, INP: 500, TTFB: 1600, FCP: 3000, SI: 5800, TBT: 600 } } }
  };
}

function extractKnowledgeGraphEntities(text) {
  const safeText = String(text || '');
  if (!safeText.trim()) return [];
  const entities = [];
  const patterns = [
    { type: 'ORGANIZATION', pattern: /\b([A-Z][a-z]+ (Inc|Corp|LLC|Ltd|Limited|LLP|Co|Group|Technologies|Technologies|Systems|Solutions|Services|Global|Ventures|Partners|Associates))\b/g },
    { type: 'PERSON', pattern: /\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g },
    { type: 'LOCATION', pattern: /\b([A-Z][a-z]+ (City|County|Valley|Beach|Heights|Springs|Harbor|Island|Lake|Park|Point|River|Village|Hill|Hills|Forest))|(New\s+[A-Z][a-z]+|Los\s+Angeles|San\s+[A-Z][a-z]+|Las\s+Vegas)\b/g },
    { type: 'DATE', pattern: /\b(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4}|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},?\s*\d{4})\b/g },
    { type: 'URL', pattern: /\b(https?:\/\/[^\s<>"']+)/g },
    { type: 'EMAIL', pattern: /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g },
    { type: 'PHONE', pattern: /\b(\+?\d{1,3}[-.\s]?\(?\d{2,3}\)?[-.\s]?\d{3}[-.\s]?\d{4})\b/g },
    { type: 'PRICE', pattern: /\b[\$\€\£\¥]\s?\d+(\.\d{2})?\b/g },
    { type: 'PERCENTAGE', pattern: /\b(\d+\.?\d*%)\b/g },
    { type: 'QUANTITY', pattern: /\b(\d+(\.\d+)?\s*(kg|kg|lbs|lb|oz|g|ml|l|cm|m|km|mph|sq ft|ft|inches|yards|pounds|tons))\b/gi },
    { type: 'PRODUCT', pattern: /\b([A-Z][a-z]+(Pro|Max|Mini|Ultra|Lite|Plus|Air|Series|Edition|Model|Version|Gen|Classic))\b/g },
    { type: 'HASHTAG', pattern: /#(\w+)/g },
    { type: 'MENTION', pattern: /@(\w+)/g }
  ];
  patterns.forEach(({ type, pattern }) => {
    const matches = text.match(pattern); if (matches) {
      const unique = [...new Set(matches)];
      unique.forEach(m => entities.push({ entity: m, type, count: (text.match(new RegExp(m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length }));
    }
  });
  return entities.sort((a, b) => b.count - a.count);
}

function countSyllables(word) {
  if (word.length <= 3) return 1;
  let w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  w = w.replace(/^y/, '');
  const syl = w.match(/[aeiouy]{1,2}/g);
  return syl ? syl.length : 1;
}

function calculateInformationGain(text, baselineCorpus) {
  const safeText = String(text || '');
  const bc = String(baselineCorpus || '');
  if (!safeText.trim()) return { klDivergence: 0, novelTerms: [], overusedTerms: [], noveltyRatio: '0%', baselineCoverage: 'N/A' };
  if (!bc.trim()) {
    return { klDivergence: null, novelTerms: [], overusedTerms: [], noveltyRatio: null, baselineCoverage: 'N/A', note: 'No baseline corpus supplied — information gain vs. an external corpus was NOT computed. Re-run with a baselineCorpus (e.g., competitor SERP text) to measure true novelty.' };
  }
  const tw = safeText.toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  const bw = new Set(bc.toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').split(/\s+/).filter(w => w.length > 2));
  const ttf = {}; const bf = {}; const stopWords = new Set(['the','be','to','of','and','a','in','that','have','i','it','for','not','on','with','he','as','you','do','at','this','but','his','by','from','they','we','say','her','she','or','an','will','my','one','all','would','there','their','what','so','up','out','if','about','who','get','which','go','me','when','make','can','like','time','no','just','him','know','take','people','into','year','your','good','some','could','them','see','other','than','then','now','look','only','come','its','over','think','also','back','after','use','two','how','our','work','first','well','way','even','new','want','because','any','these','give','day','most','us']);
  tw.forEach(w => { if (!stopWords.has(w)) ttf[w] = (ttf[w] || 0) + 1; });
  bc.toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').split(/\s+/).forEach(w => { if (w.length > 2 && !stopWords.has(w)) bf[w] = (bf[w] || 0) + 1; });
  const tTotal = Object.values(ttf).reduce((a, b) => a + b, 0); const bTotal = Object.values(bf).reduce((a, b) => a + b, 0) || 1;
  let klDivergence = 0; const novelTerms = []; const overusedTerms = [];
  Object.keys(ttf).forEach(w => {
    const tp = ttf[w] / tTotal; const bp = (bf[w] || 0.0001) / bTotal;
    if (!bw.has(w) && tp > 0.01) novelTerms.push({ word: w, frequency: ttf[w], proportion: (tp * 100).toFixed(2) + '%' });
    if (bf[w] && tp / (bf[w] / bTotal) > 5 && ttf[w] > 2) overusedTerms.push({ word: w, textRatio: (tp / (bf[w] / bTotal)).toFixed(1) + 'x' });
    klDivergence += tp * Math.log2(tp / bp);
  });
  const noveltyRatio = tTotal > 0 ? novelTerms.reduce((a, x) => a + x.frequency, 0) / tTotal : 0;
  return { klDivergence: Math.round(klDivergence * 100) / 100, novelTerms, overusedTerms, noveltyRatio: Math.round(noveltyRatio * 10000) / 100 + '%', baselineCoverage: bc ? Math.round((Object.keys(ttf).filter(w => bw.has(w)).length / Object.keys(ttf).length) * 100) + '%' : 'N/A' };
}

function analyzeAnchorTextContext($) {
  const probes = [];
  try {
  $('a[href]').each((i, el) => {
    const text = $(el).text().trim(); const href = $(el).attr('href') || '';
    const p = $(el).parent(); const parentTag = p.length ? (p[0].tagName || '').toLowerCase() : '';
    const grandparent = p.parent(); const gpTag = grandparent.length ? (grandparent[0].tagName || '').toLowerCase() : '';
    const surrounding = p.text().trim().substring(0, 300);
    const before = (() => { try { const t = p.text(); const idx = t.indexOf(text); if (idx > 40) return t.substring(idx - 40, idx).trim(); return ''; } catch (_) { return ''; } })();
    const after = (() => { try { const t = p.text(); const idx = t.indexOf(text); const end = idx + text.length; if (end + 40 < t.length) return t.substring(end, end + 40).trim(); return ''; } catch (_) { return ''; } })();
    const contextScore = text.length > 3 && !/^(click here|here|read more|learn more|more|link|this|go|details|view|download|visit|start|get started)$/i.test(text) ? 1 : 0;
    probes.push({ href: href.substring(0, 200), text: text.substring(0, 100), parentTag, grandparentTag: gpTag, surroundingText: surrounding.substring(0, 200), contextBefore: before, contextAfter: after, hasContext: contextScore === 1, isInsideList: gpTag === 'li' || parentTag === 'li', isInsideParagraph: parentTag === 'p' });
  });
  } catch (e) { /* ignore */ }
  const withContext = probes.filter(p => p.hasContext).length; const genericLinks = probes.filter(p => !p.hasContext).length;
  return { totalAnchors: probes.length, anchorsWithContext: withContext, genericAnchors: genericLinks, contextRatio: probes.length > 0 ? Math.round((withContext / probes.length) * 100) + '%' : 'N/A', probes };
}

function analyzeReadabilityAdvanced(text) {
  const safeText = String(text || '');
  if (!safeText.trim()) return { fleschKincaidGrade: 0, fleschReadingEase: 0, colemanLiau: 0, ari: 0, smog: 0, avgGradeLevel: 0, readabilityLevel: 'unknown', syllables: 0, polysyllables: 0, avgSyllablesPerWord: 0, avgWordsPerSentence: 0, complexityMetrics: { avgCharsPerWord: 0, polysyllableRatio: '0%' }, readingTime: { minutes: 0, speakingMinutes: 0 } };
  const sents = safeText.split(/[.!?]+/).filter(x => x.trim().length > 2); const words = safeText.split(/\s+/).filter(x => x.length > 0);
  const syllables = words.reduce((a, w) => a + countSyllables(w), 0);
  const polysyllables = words.filter(w => countSyllables(w) >= 3).length;
  const chars = words.reduce((a, w) => a + w.length, 0);
  const sentences = sents.length; const totalWords = words.length;
  const avgWordsPerSent = sentences > 0 ? totalWords / sentences : 0;
  const avgSyllablesPerWord = totalWords > 0 ? syllables / totalWords : 0;
  const avgCharsPerWord = totalWords > 0 ? chars / totalWords : 0;
  const fkGrade = 0.39 * (totalWords / sentences) + 11.8 * (syllables / totalWords) - 15.59;
  const fkReadingEase = 206.835 - 1.015 * avgWordsPerSent - 84.6 * avgSyllablesPerWord;
  const colemanLiau = 0.0588 * (chars / totalWords * 100) - 0.296 * (sentences / totalWords * 100) - 15.8;
  const ari = 4.71 * avgCharsPerWord + 0.5 * avgWordsPerSent - 21.43;
  const smog = Math.sqrt(polysyllables * (30 / sentences)) + 3.1;
  const readingTime = totalWords / 238; const speakingTime = totalWords / 183;
  const gradeLevels = [
    { name: 'Flesch-Kincaid', grade: Math.max(0, Math.min(18, fkGrade)) },
    { name: 'Coleman-Liau', grade: Math.max(0, Math.min(18, colemanLiau)) },
    { name: 'ARI', grade: Math.max(0, Math.min(18, ari)) },
    { name: 'SMOG', grade: Math.max(0, Math.min(18, smog)) }
  ];
  const avgGrade = gradeLevels.reduce((a, g) => a + g.grade, 0) / gradeLevels.length;
  const difficulties = { '5th': { max: 5 }, '6th': { max: 6 }, '7th': { max: 7 }, '8th': { max: 8 }, '9th': { max: 9 }, '10th': { max: 10 }, '11th-12th': { max: 12 }, 'College': { max: 14 }, 'Post-Grad': { max: 18 } };
  let readabilityLevel = '';
  Object.entries(difficulties).forEach(([level, { max }]) => { if (!readabilityLevel && avgGrade <= max) readabilityLevel = level; });
  if (!readabilityLevel) readabilityLevel = 'Post-Grad';
  return { fleschKincaidGrade: Math.round(fkGrade * 10) / 10, fleschReadingEase: Math.round(fkReadingEase * 10) / 10, colemanLiau: Math.round(colemanLiau * 10) / 10, ari: Math.round(ari * 10) / 10, smog: Math.round(smog * 10) / 10, avgGradeLevel: Math.round(avgGrade * 10) / 10, readabilityLevel, syllables, polysyllables, avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 10) / 10, avgWordsPerSentence: Math.round(avgWordsPerSent * 10) / 10, complexityMetrics: { avgCharsPerWord: Math.round(avgCharsPerWord * 10) / 10, polysyllableRatio: totalWords > 0 ? Math.round((polysyllables / totalWords) * 1000) / 10 + '%' : '0%' }, readingTime: { minutes: Math.round(readingTime * 10) / 10, speakingMinutes: Math.round(speakingTime * 10) / 10 } };
}

function ragChunkSimulator(text) {
  const safeText = String(text || '');
  if (!safeText.trim()) return { totalChunks: 0, retrievabilityScores: [], avgRetrievabilityScore: 0, avgChunkLength: 0 };
  const chunks = []; const lines = safeText.split(/\n+/).filter(x => x.trim().length > 40);
  let current = ''; let idx = 0;
  lines.forEach(line => {
    if ((current + ' ' + line).length > 280) { chunks.push({ index: idx, text: current.substring(0, 500), charLen: current.length, wordCount: current.split(/\s+/).length }); idx++; current = line; }
    else current = current ? current + ' ' + line : line;
  });
  if (current.trim().length > 0) chunks.push({ index: idx, text: current.substring(0, 500), charLen: current.length, wordCount: current.split(/\s+/).length });
  if (chunks.length === 0) {
    const words = safeText.split(/\s+/);
    for (let i = 0; i < words.length; i += 100) {
      const w = words.slice(i, i + 100).join(' ');
      chunks.push({ index: idx++, text: w.substring(0, 500), charLen: w.length, wordCount: Math.min(100, words.length - i) });
    }
  }
  const retrievabilityScores = chunks.map(c => {
    let score = 100;
    if (c.charLen < 50) score -= 20; if (c.wordCount < 10) score -= 15;
    if (c.text.includes(':') || c.text.includes(';') || c.text.includes('"')) score += 5;
    if ((c.text.match(/[.!?]/g) || []).length < 3) score -= 10;
    if (c.text.length > 300) score -= 5; return { ...c, retrievabilityScore: Math.max(0, Math.min(100, score)) };
  });
  const totalChunks = chunks.length;
  const avgScore = totalChunks > 0 ? Math.round(retrievabilityScores.reduce((a, c) => a + c.retrievabilityScore, 0) / totalChunks) : 0;
  return { totalChunks, retrievabilityScores, avgRetrievabilityScore: avgScore, avgChunkLength: totalChunks > 0 ? Math.round(chunks.reduce((a, c) => a + c.charLen, 0) / totalChunks) : 0 };
}

function directAnswerScorer(question, pageContent) {
  const safeQuestion = String(question || '');
  const safeContent = String(pageContent || '');
  if (!safeContent.trim()) return { bestAnswerCandidate: null, listCandidates: [], tableCandidates: [], directAnswerScore: 0, hasDirectAnswer: false, method: 'none' };
  if (!safeQuestion.trim()) {
    const hasDefinition = /\b(is|are|refers to|defined as|means)\b/i.test(safeContent) && /^[A-Z].{0,200}?\b(is|are|refers to|defined as|means)\b/.test(safeContent.replace(/\n+/g, ' '));
    const hasQA = /\b(how|what|why|when|where|who)\b[^?]*\?/i.test(safeContent);
    const listMatches = (safeContent.match(/^[\*\-\u2022]\s+/gm) || []).length;
    const numListMatches = (safeContent.match(/^\d+[\.\)]\s+/gm) || []).length;
    const hasTables = (safeContent.match(/\|/g) || []).length >= 6;
    let score = 0;
    if (hasDefinition) score += 40;
    if (hasQA) score += 25;
    if (listMatches >= 3 || numListMatches >= 3) score += 25;
    if (hasTables) score += 10;
    return {
      method: 'structural-only (no real user query supplied)',
      bestAnswerCandidate: null,
      listCandidates: [],
      tableCandidates: [],
      directAnswerScore: Math.min(100, score),
      hasDirectAnswer: score >= 60,
      signals: { hasDefinition, hasQA, bulletListItems: listMatches, numberedListItems: numListMatches, hasTables }
    };
  }
  const qWords = safeQuestion.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
  const pc = safeContent.toLowerCase(); const answerCandidates = [];
  const pSents = pc.split(/[.!?]+/).filter(x => x.trim().length > 10);
  pSents.forEach(sent => {
    const sw = sent.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
    const matches = qWords.filter(w => sw.includes(w)).length; const ratio = qWords.length > 0 ? matches / qWords.length : 0;
    if (ratio >= 0.4) answerCandidates.push({ sentence: sent.trim().substring(0, 200), matchedTerms: matches, totalTerms: qWords.length, matchRatio: ratio });
  });
  answerCandidates.sort((a, b) => b.matchRatio - a.matchRatio);
  const bestMatch = answerCandidates.length > 0 ? answerCandidates[0] : null;
  const lists = []; pc.split(/\n/).forEach(line => {
    const lc = line.trim(); const listMatch = lc.match(/^[\*\-\•]\s+(.+)/) || lc.match(/^\d+[\.\)]\s+(.+)/);
    if (listMatch) { const sw = listMatch[1].toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
      const matches = qWords.filter(w => sw.includes(w)).length; const ratio = qWords.length > 0 ? matches / qWords.length : 0;
      if (ratio >= 0.4) lists.push({ item: listMatch[1].substring(0, 200), matchedTerms: matches, matchRatio: ratio }); }
  });
  const tables = []; pc.split(/\n/).forEach(line => {
    if (line.includes('|') && line.split('|').length >= 3) { const cells = line.split('|').map(c => c.trim());
      cells.forEach(c => { const sw = c.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
        const matches = qWords.filter(w => sw.includes(w)).length; const ratio = qWords.length > 0 ? matches / qWords.length : 0;
        if (ratio >= 0.6) tables.push({ cell: c.substring(0, 100), matchedTerms: matches, matchRatio: ratio }); }); }
  });
  const daScore = bestMatch ? Math.round(bestMatch.matchRatio * 10) * 10 : 0;
  return { method: 'query-match', bestAnswerCandidate: bestMatch, listCandidates: lists.slice(0, 5), tableCandidates: tables.slice(0, 10), directAnswerScore: daScore, hasDirectAnswer: daScore >= 60 };
}

function simulateLLMCitation(text, query) {
  const safeText = String(text || '');
  const safeQuery = String(query || '');
  if (!safeText.trim()) return { topCitations: [], allScores: [], avgCitationScore: 0, totalExtractableFacts: 0, llmConfidence: 'low', method: 'none' };
  if (!safeQuery.trim()) {
    const sents = safeText.split(/[.!?]+\s+/).filter(x => x.trim().length > 20); const factScores = [];
    sents.forEach((sent, i) => {
      const hasNumbers = /\d+/.test(sent); const hasQuotes = /["']/.test(sent);
      const hasStats = /\d+\.?\d*%/.test(sent) || /[\$\€\£\¥]\d+/.test(sent);
      const score = (hasStats ? 60 : hasNumbers ? 30 : 0) + (hasQuotes ? 20 : 0);
      factScores.push({ index: i, sentence: sent.trim().substring(0, 200), containsData: hasNumbers || hasStats, containsQuote: hasQuotes, citationScore: score });
    });
    factScores.sort((a, b) => b.citationScore - a.citationScore);
    const topFacts = factScores.slice(0, 5);
    const avgScore = factScores.length > 0 ? Math.round(factScores.reduce((a, c) => a + c.citationScore, 0) / factScores.length) : 0;
    return { method: 'extractable-fact density (no real LLM inference performed)', topCitations: topFacts, allScores: factScores.slice(0, 20), avgCitationScore: avgScore, totalExtractableFacts: factScores.filter(c => c.containsData).length, llmConfidence: avgScore >= 50 ? 'high' : avgScore >= 25 ? 'medium' : 'low' };
  }
  const qw = safeQuery.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
  const sents = safeText.split(/[.!?]+\s+/).filter(x => x.trim().length > 20); const citationScores = [];
  sents.forEach((sent, i) => {
    const sw = sent.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
    const matches = qw.filter(w => sw.includes(w)).length; const matchRatio = qw.length > 0 ? matches / qw.length : 0;
    const hasNumbers = /\d+/.test(sent); const hasQuotes = /["']/.test(sent);
    const hasStats = /\d+\.?\d*%/.test(sent) || /[\$\€\£\¥]\d+/.test(sent);
    const score = matchRatio * 100 + (hasNumbers ? 15 : 0) + (hasStats ? 20 : 0) + (hasQuotes ? 10 : 0);
    citationScores.push({ index: i, sentence: sent.trim().substring(0, 200), matchRatio: Math.round(matchRatio * 100), containsData: hasNumbers || hasStats, containsQuote: hasQuotes, citationScore: Math.round(score) });
  });
  citationScores.sort((a, b) => b.citationScore - a.citationScore);
  const topCitations = citationScores.slice(0, 5);
  const avgScore = citationScores.length > 0 ? Math.round(citationScores.reduce((a, c) => a + c.citationScore, 0) / citationScores.length) : 0;
  return { method: 'query-match', topCitations, allScores: citationScores.slice(0, 20), avgCitationScore: avgScore, totalExtractableFacts: citationScores.filter(c => c.containsData).length, llmConfidence: avgScore >= 50 ? 'high' : avgScore >= 25 ? 'medium' : 'low' };
}

function generateSchemaCode(type, data) {
  const t = type || 'Article'; const d = data || {};
  const schemas = {
    Article: { '@context': 'https://schema.org', '@type': 'Article', headline: d.headline || '', description: d.description || '', author: { '@type': 'Person', name: d.authorName || '' }, datePublished: d.datePublished || '', image: d.image || '', publisher: { '@type': 'Organization', name: d.publisherName || '' } },
    Product: { '@context': 'https://schema.org', '@type': 'Product', name: d.name || '', description: d.description || '', image: d.image || '', offers: { '@type': 'Offer', price: d.price || '', priceCurrency: d.currency || 'USD', availability: d.availability || '' } },
    FAQPage: { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: (d.questions || []).map(q => ({ '@type': 'Question', name: q.question || '', acceptedAnswer: { '@type': 'Answer', text: q.answer || '' } })) },
    LocalBusiness: { '@context': 'https://schema.org', '@type': d.subtype || 'LocalBusiness', name: d.name || '', address: { '@type': 'PostalAddress', streetAddress: d.streetAddress || '', addressLocality: d.locality || '', addressRegion: d.region || '', postalCode: d.postalCode || '' }, telephone: d.phone || '', openingHoursSpecification: (d.hours || ['Mo-Fr 09:00-17:00']).map(h => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.split(' ')[0] || 'Mo-Fr', opens: h.split(' ')[1] || '09:00', closes: h.split(' ')[2] || '17:00' })) },
    BreadcrumbList: { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: (d.items || []).map((name, i) => ({ '@type': 'ListItem', position: i + 1, name, item: d.baseUrl ? d.baseUrl + '/' + name.toLowerCase().replace(/\s+/g, '-') : '' })) },
    HowTo: { '@context': 'https://schema.org', '@type': 'HowTo', name: d.name || '', description: d.description || '', step: (d.steps || []).map((step, i) => ({ '@type': 'HowToStep', position: i + 1, name: step.name || 'Step ' + (i + 1), text: step.text || '', url: step.url || '' })) },
    Review: { '@context': 'https://schema.org', '@type': 'Review', itemReviewed: { '@type': d.reviewType || 'Product', name: d.itemName || '' }, reviewRating: { '@type': 'Rating', ratingValue: d.rating || '', bestRating: '5' }, author: { '@type': 'Person', name: d.authorName || '' }, reviewBody: d.body || '' }
  };
  const schema = schemas[t] || schemas.Article;
  return JSON.stringify(schema, null, 2);
}

function generateMetaOptions(title, desc, keywords) {
  const opts = []; const t = title || ''; const d = desc || '';
  const cleanTitle = t.replace(/[-|–—].*$/, '').trim();
  opts.push({ meta: 'title', variant: 'Default', value: t, charCount: t.length, pxWidth: pxWidth(t), seoScore: t.length > 10 && t.length < 60 ? 90 : t.length <= 70 ? 70 : 40 });
  opts.push({ meta: 'title', variant: 'Front-loaded', value: cleanTitle.substring(0, 55), charCount: Math.min(cleanTitle.length, 55), pxWidth: pxWidth(cleanTitle.substring(0, 55)), seoScore: 85 });
  opts.push({ meta: 'title', variant: 'With brand', value: t.length > 45 ? cleanTitle : cleanTitle + ' | ' + (keywords || '').split(',')[0] || 'Brand', charCount: Math.min((cleanTitle + ' | ' + (keywords || '').split(',')[0] || 'Brand').length, 70), pxWidth: pxWidth(cleanTitle + ' | ' + (keywords || '').split(',')[0] || 'Brand'), seoScore: 75 });
  if (d) {
    opts.push({ meta: 'description', variant: 'Current', value: d.substring(0, 200), charCount: d.length, seoScore: d.length > 50 && d.length < 160 ? 90 : d.length < 200 ? 70 : 40 });
    const firstPara = d.length > 120 ? d.substring(0, d.lastIndexOf(' ', 155)) + '...' : d;
    opts.push({ meta: 'description', variant: 'Trimmed', value: firstPara.substring(0, 200), charCount: Math.min(firstPara.length, 200), seoScore: firstPara.length > 50 && firstPara.length < 160 ? 95 : 75 });
    opts.push({ meta: 'description', variant: 'CTA-focused', value: ('Discover ' + d.substring(0, 40) + ' — ' + (keywords || '').split(',')[0] || '' + ' solutions today').substring(0, 200), charCount: Math.min(('Discover ' + d.substring(0, 40) + ' — ' + (keywords || '').split(',')[0] || '') .length, 200), seoScore: 80 });
  }
  return opts;
}

function formatJiraTicket(findings) {
  const f = findings || {}; const lines = [];
  lines.push('h2. SEO Audit Findings - ' + (f.url || f.page || 'Unknown'));
  if (f.issues && Array.isArray(f.issues)) {
    f.issues.forEach((issue, i) => {
      lines.push('h3. Issue #' + (i + 1) + ': ' + (issue.name || issue.type || 'Unknown'));
      lines.push('*Priority:* ' + (issue.priority || issue.severity || 'Medium'));
      lines.push('*Location:* ' + (issue.location || issue.selector || issue.element || 'N/A'));
      lines.push('*Description:* ' + (issue.description || issue.message || issue.detail || ''));
      if (issue.recommendation || issue.suggestion) lines.push('*Recommendation:* ' + (issue.recommendation || issue.suggestion));
      if (issue.impact) lines.push('*Impact:* ' + issue.impact);
      lines.push('');
    });
  } else {
    Object.entries(f).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') lines.push('*' + key + ':* ' + value);
      else if (typeof value === 'object' && value !== null) lines.push('*' + key + ':* (see details below)');
    });
  }
  lines.push('h2. Automated Findings');
  lines.push('Generated by SEO Audit Tool v2.0');
  return lines.join('\n');
}

function generateEdgeWorkerCode(rule) {
  const r = rule || {};
  const config = { rewriteUrl: r.rewriteUrl || false, addHeaders: r.addHeaders || false, redirectDomain: r.redirectDomain || '', pathPattern: r.pathPattern || '/*', canonicalize: r.canonicalize || false, hreflangHandler: r.hreflangHandler || false };
  const lines = [];
  lines.push("import { Router } from '@edgio/core/router';");
  lines.push("import { isProductionBuild } from '@edgio/core/environment';");
  lines.push(''); lines.push('const router = new Router();');
  if (config.redirectDomain) {
    lines.push("router.match('" + config.pathPattern + "', ({ redirect, request }) => {");
    lines.push("  if (request.host === '" + config.redirectDomain + "') {");
    lines.push("    redirect('https://' + request.host + request.path, 301);");
    lines.push('  }'); lines.push('});');
  }
  if (config.rewriteUrl) {
    lines.push("router.match('" + config.pathPattern + "', ({ setResponseHeader }) => {");
    lines.push("  setResponseHeader('X-Robots-Tag', 'index, follow');");
    if (config.addHeaders) {
      lines.push("  setResponseHeader('X-Content-Type-Options', 'nosniff');");
      lines.push("  setResponseHeader('X-Frame-Options', 'DENY');");
      lines.push("  setResponseHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');");
    }
    lines.push('});');
  }
  if (config.canonicalize) {
    lines.push("router.match('" + config.pathPattern + "', ({ setResponseHeader, request }) => {");
    lines.push("  const canonical = 'https://' + request.host + request.path.replace(/\\/+$/, '').toLowerCase();");
    lines.push("  setResponseHeader('Link', '<' + canonical + '>; rel=\"canonical\"');");
    lines.push('});');
  }
  if (config.hreflangHandler) {
    lines.push("router.match('" + config.pathPattern + "', ({ setResponseHeader, request }) => {");
    lines.push("  const lang = request.path.startsWith('/de/') ? 'de' : request.path.startsWith('/fr/') ? 'fr' : 'en';");
    lines.push("  const base = 'https://' + request.host;");
    lines.push("  setResponseHeader('Link', '<" + "$" + "{base}/en" + ">; rel=\"alternate\"; hreflang=\"en\", <" + "$" + "{base}/de" + ">; rel=\"alternate\"; hreflang=\"de\"');");
    lines.push('});');
  }
  lines.push(''); lines.push('export default router;');
  return lines.join('\n');
}

function analyzeBotManagement($) {
  const signals = []; let robotDetected = false;
  try {
  const hasMetaRobots = $('meta[name="robots"], meta[name="googlebot"], meta[name="bingbot"]').length > 0;
  const hasRobotsLink = $('link[rel="robots"]').length > 0;
  const xRobotsFromMeta = $('meta[name="robots"]').attr('content') || $('meta[name="googlebot"]').attr('content') || '';
  const hasJsChallenges = $('script').filter((i, el) => /challenge|turnstile|recaptcha|hcaptcha|captcha|cf-challenge/.test($(el).html() || '')).length > 0;
  const hasStructuredBotMeta = $('meta[name="googlebot"], meta[name="bingbot"], meta[name="slurp"], meta[name="yandex"]').length > 0;
  const pageSpeedInsights = $('meta[name="googlebot"]').attr('content') || '';
  if (xRobotsFromMeta.includes('noindex')) signals.push({ type: 'noindex', source: 'meta', detail: 'Search engines blocked from indexing' });
  if (xRobotsFromMeta.includes('nofollow')) signals.push({ type: 'nofollow', source: 'meta', detail: 'Links not followed' });
  if (hasJsChallenges) { robotDetected = true; signals.push({ type: 'bot-detection', source: 'captcha', detail: 'CAPTCHA/challenge detected — may block crawlers' }); }
  const hasAkamai = ($('script').filter((i, el) => /akamai|akamaihd/.test($(el).attr('src') || '')).length) > 0;
  const hasCloudflare = ($('script').filter((i, el) => /cloudflare|cf-/.test($(el).html() || '')).length) > 0;
  if (hasAkamai) signals.push({ type: 'bot-detection', source: 'akamai', detail: 'Akamai bot management detected' });
  if (hasCloudflare) signals.push({ type: 'bot-detection', source: 'cloudflare', detail: 'Cloudflare bot management detected' });
  return { robotDetection: robotDetected, signals, hasMetaRobots, hasBotSpecificMeta: hasStructuredBotMeta, metaRobotsContent: xRobotsFromMeta, hasJsChallenge: hasJsChallenges, botManagementScore: robotDetected ? 30 : hasMetaRobots ? 70 : 50 };
  } catch (e) { return { robotDetection: false, signals: [], hasMetaRobots: false, hasBotSpecificMeta: false, metaRobotsContent: '', hasJsChallenge: false, botManagementScore: 50 }; }
}

function analyzeMultiModalContent($) {
  const images = []; const videos = []; const audios = []; let transcriptPresent = false;
  try {
  $('img').each((i, el) => { const alt = $(el).attr('alt') || ''; images.push({ src: ($(el).attr('src') || '').substring(0, 200), alt, hasAlt: $(el).is('[alt]'), altQuality: 'good', isDecorative: alt.length === 0 }); });
  $('video, [data-video], [data-media-type="video"]').each((i, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src') || '';
    const hasTrack = $(el).find('track').length > 0; const hasPoster = !!$(el).attr('poster');
    videos.push({ src: src.substring(0, 200), hasCaptions: hasTrack, hasPoster, textAccessible: hasTrack || hasPoster });
  });
  $('audio, [data-audio]').each((i, el) => { audios.push({ src: ($(el).attr('src') || '').substring(0, 200) }); });
  $('iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="wistia"]').each((i, el) => {
    const src = $(el).attr('src') || ''; const title = $(el).attr('title') || '';
    videos.push({ src: src.substring(0, 200), isEmbedded: true, platform: src.includes('youtube') ? 'youtube' : src.includes('vimeo') ? 'vimeo' : 'wistia', hasTitle: !!title, title });
  });
  transcriptPresent = videos.some(v => v.hasCaptions) || audios.length > 0;
  } catch (e) { /* ignore */ }
  return { images, videos, audios, hasTranscripts: transcriptPresent, totalImages: images.length, totalVideos: videos.length, totalAudio: audios.length };
}

function validateSemanticCaptions($) {
  const findings = [];
  try {
  $('figure').each((i, el) => {
    const img = $(el).find('img').first(); const figcap = $(el).find('figcaption');
    const imgAlt = img.attr('alt') || $(el).attr('aria-label') || '';
    const hasCaption = figcap.length > 0; const captionText = figcap.text().trim();
    if (!hasCaption) findings.push({ element: 'figure', selector: sel($, el), issue: 'No figcaption found for figure', recommendation: 'Add descriptive figcaption' });
    else if (captionText.length < 5) findings.push({ element: 'figure', selector: sel($, el), issue: 'figcaption too short', recommendation: 'Expand caption to be descriptive' });
    if (imgAlt.length > 0 && hasCaption && imgAlt.toLowerCase() === captionText.toLowerCase()) findings.push({ element: 'figure', selector: sel($, el), issue: 'Alt text and figcaption are identical', recommendation: 'Diversify alt text and caption' });
  });
  $('table').each((i, el) => {
    const caption = $(el).find('caption'); const hasSummary = !!$(el).attr('summary');
    const scopeCount = $(el).find('th[scope]').length; const thCount = $(el).find('th').length;
    if (!caption.length) findings.push({ element: 'table', selector: sel($, el), issue: 'Table missing caption', recommendation: 'Add <caption> describing table content' });
    if (thCount > 0 && scopeCount === 0) findings.push({ element: 'table', selector: sel($, el), issue: 'Header cells missing scope attribute', recommendation: 'Add scope="col" or scope="row" to th elements' });
  });
  } catch (e) { /* ignore */ }
  return { findings, totalFigures: $('figure').length, totalTables: $('table').length, issues: findings.length };
}

function analyzeSerpVolatility(pageContent, pageFeatures) {
  const text = String(pageContent || '');
  const features = pageFeatures || {};
  if (!text.trim()) return { volatilityScore: 0, volatilityLevel: 'stable', signals: [], totalSignals: 0, contentMetrics: { wordCount: 0, headingCount: 0, imageCount: 0, linkCount: 0, listCount: 0, sentenceCount: 0, paragraphCount: 0 }, recommendation: 'No content to analyze', rankingVolatilityRisk: 'unknown' };
  const wc = features.wordCount || text.split(/\s+/).filter(x => x.length > 0).length;
  const hCount = features.headingCount || (text.match(/^#{1,6}\s/gm) || []).length;
  const imgCount = features.imageCount || (text.match(/!\[([^\]]*)\]\(([^)]+)\)/g) || []).length;
  const linkCount = features.linkCount || (text.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []).length;
  const listCount = features.listCount || (text.match(/^[\*\-\•]\s/gm) || []).length;
  const sentenceCount = text.split(/[.!?]+/).filter(x => x.trim().length > 10).length;
  const paragraphCount = text.split(/\n\s*\n/).filter(x => x.trim().length > 20).length;

  const hasThinContent = wc < 300;
  const hasFewHeadings = hCount < 2 && wc > 500;
  const hasNoImages = imgCount === 0 && wc > 300;
  const hasNoLinks = linkCount === 0 && wc > 200;
  const hasNoLists = listCount === 0 && wc > 400;
  const hasLongParagraphs = paragraphCount > 0 && (wc / paragraphCount) > 200;
  const hasShortSentences = sentenceCount > 0 && (wc / sentenceCount) < 8 && wc > 200;

  const volatilitySignals = [];
  if (hasThinContent) volatilitySignals.push({ signal: 'thin-content', severity: 25, detail: 'Word count ' + wc + ' is below 300 — thin pages rank volatilely' });
  if (hasFewHeadings) volatilitySignals.push({ signal: 'few-headings', severity: 20, detail: 'Only ' + hCount + ' headings for ' + wc + ' words — poor structure increases ranking instability' });
  if (hasNoImages) volatilitySignals.push({ signal: 'no-images', severity: 15, detail: 'Zero images in ' + wc + ' words — visual content stabilizes rankings' });
  if (hasNoLinks) volatilitySignals.push({ signal: 'no-links', severity: 15, detail: 'Zero links — internal/external linking correlates with ranking stability' });
  if (hasNoLists) volatilitySignals.push({ signal: 'no-lists', severity: 10, detail: 'No bullet or numbered lists — structured content ranks more consistently' });
  if (hasLongParagraphs) volatilitySignals.push({ signal: 'long-paragraphs', severity: 10, detail: 'Avg paragraph ' + Math.round(wc / paragraphCount) + ' words — dense text walls increase bounce rate volatility' });
  if (hasShortSentences) volatilitySignals.push({ signal: 'short-sentences', severity: 5, detail: 'Avg ' + Math.round(wc / sentenceCount) + ' words/sentence — may read as choppy' });

  const rawVolatility = volatilitySignals.reduce((a, s) => a + s.severity, 0);
  const volatilityScore = Math.min(100, Math.round(rawVolatility * 1.2));
  const volatilityLevel = volatilityScore >= 60 ? 'volatile' : volatilityScore >= 30 ? 'moderate' : 'stable';

  return {
    volatilityScore,
    volatilityLevel,
    signals: volatilitySignals,
    totalSignals: volatilitySignals.length,
    contentMetrics: { wordCount: wc, headingCount: hCount, imageCount: imgCount, linkCount: linkCount, listCount, sentenceCount, paragraphCount },
    recommendation: volatilityLevel === 'volatile' ? 'Add substantial content, headings, images, and internal links to stabilize rankings' : volatilityLevel === 'moderate' ? 'Improve content structure with more headings and lists' : 'Content structure appears stable',
    rankingVolatilityRisk: volatilityScore >= 60 ? 'high — page likely experiences ranking fluctuations during algorithm updates' : volatilityScore >= 30 ? 'moderate — some ranking movement expected' : 'low — content structure supports stable rankings'
  };
}

function calculateQualityThresholds(content) {
  const thresholds = {}; const text = String(content || '');
  if (!text.trim()) return { wordCount: { value: 0, min: 300, max: 5000, meetsMin: false, meetsMax: true, score: 0 }, sentenceCount: { value: 0, min: 10, score: 0 }, headingDensity: { value: 0, min: 2, score: 0 }, linkDensity: { value: 0, min: 3, max: 20, score: 0 }, imageDensity: { value: 0, min: 1, max: 20, score: 0 }, structuralElements: { value: 0, min: 5, score: 0 }, overallQuality: 0 };
  const wordCount = text.split(/\s+/).filter(x => x.length > 0).length;
  const sentenceCount = text.split(/[.!?]+/).filter(x => x.trim().length > 2).length;
  const headingCount = (text.match(/^#{1,6}\s/gm) || []).length;
  const linkCount = (text.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []).length;
  const imageCount = (text.match(/!\[([^\]]*)\]\(([^)]+)\)/g) || []).length;
  const listCount = (text.match(/^[\*\-\•]\s/gm) || []).length;
  const boldCount = (text.match(/\*\*[^*]+\*\*/g) || []).length;
  const codeCount = (text.match(/```/g) || []).length / 2;
  thresholds.wordCount = { value: wordCount, min: 300, max: 5000, meetsMin: wordCount >= 300, meetsMax: wordCount <= 5000, score: wordCount >= 300 && wordCount <= 5000 ? 100 : wordCount < 300 ? Math.round((wordCount / 300) * 50) : Math.max(50, Math.round((1 - (wordCount - 5000) / 5000) * 100)) };
  thresholds.sentenceCount = { value: sentenceCount, min: 10, score: sentenceCount >= 10 ? 100 : Math.round((sentenceCount / 10) * 100) };
  thresholds.headingDensity = { value: headingCount, min: wordCount > 1000 ? 5 : 2, score: headingCount >= (wordCount > 1000 ? 5 : 2) ? 100 : Math.round((headingCount / (wordCount > 1000 ? 5 : 2)) * 100) };
  thresholds.linkDensity = { value: linkCount, min: 3, max: 20, score: linkCount >= 3 && linkCount <= 20 ? 100 : linkCount < 3 ? Math.round((linkCount / 3) * 60) : Math.max(40, Math.round((1 - (linkCount - 20) / 30) * 100)) };
  thresholds.imageDensity = { value: imageCount, min: 1, max: 20, score: imageCount >= 1 && imageCount <= 20 ? 100 : imageCount === 0 ? 30 : Math.max(50, Math.round((1 - (imageCount - 20) / 10) * 100)) };
  thresholds.structuralElements = { value: headingCount + listCount + boldCount, min: 5, score: (headingCount + listCount + boldCount) >= 5 ? 100 : Math.round(((headingCount + listCount + boldCount) / 5) * 100) };
  thresholds.overallQuality = Math.round(Object.values(thresholds).reduce((a, t) => a + (t.score || 0), 0) / Object.values(thresholds).filter(t => t.score !== undefined).length);
  return thresholds;
}

function analyzeSyntheticAgentBehavior(text) {
  const safeText = String(text || '');
  if (!safeText.trim()) return { results: {}, totalFlags: 0, syntheticScore: 100, verdict: 'likely human-written' };
  const patterns = {
    hedgeWords: /\b(maybe|perhaps|possibly|probably|might|potentially|arguably|seems|appears|allegedly|reportedly|supposedly|ostensibly|purportedly)\b/gi,
    fillerWords: /\b(very|really|quite|extremely|incredibly|absolutely|totally|completely|literally|actually|basically|essentially|simply|just|pretty|rather|fairly|somewhat)\b/gi,
    hyperbole: /\b(exciting|amazing|incredible|unbelievable|fantastic|extraordinary|remarkable|outstanding|phenomenal|revolutionary|groundbreaking|game-changing|next-level|cutting-edge|state-of-the-art)\b/gi,
    agentivePhrases: /\b(I (think|believe|feel|guess|suppose|assume|would say|would argue))\b/gi,
    templatePatterns: /\b(in conclusion|to summarize|as we have seen|it is important to note that|it should be noted that|needless to say|it goes without saying|last but not least|first and foremost)\b/gi,
    redundancy: /\b(each and every|first and foremost|true facts|exact same|end result|final outcome|past history|future plans|unexpected surprise|added bonus|close proximity|serious danger|sudden impulse|free gift|advance notice|mix together|refer back|repeat again)\b/gi,
    passiveClusters: /(?:is|are|was|were|been|being|be|has been|have been|had been) \w+ed (?:by|to|in|for|with|at|on)\b/gi
  };
  const results = {};
  Object.entries(patterns).forEach(([name, re]) => {
    const matches = text.match(re); results[name] = { count: matches ? matches.length : 0, examples: matches ? [...new Set(matches.map(m => m.toLowerCase()))].slice(0, 10) : [] };
  });
  const totalFlags = Object.values(results).reduce((a, r) => a + r.count, 0);
  const score = Math.max(0, 100 - totalFlags * 3);
  return { results, totalFlags, syntheticScore: score, verdict: score >= 80 ? 'likely human-written' : score >= 50 ? 'mixed signals' : 'possible AI-generated patterns' };
}

function calculateUnhelpfulContentRatio(text) {
  const safeText = String(text || '');
  if (!safeText.trim()) return { totalSentences: 0, helpfulSentences: 0, genericSentences: 0, unhelpfulShortSentences: 0, helpfulRatio: 0, genericRatio: 0, verdict: 'empty content' };
  const sents = safeText.split(/[.!?]+\s*/).filter(x => x.trim().length > 10);
  const total = sents.length; let generic = 0; let unhelpful = 0;
  const genericPatterns = [
    /\bas previously mentioned\b/i, /\bas stated above\b/i, /\bas we discussed\b/i, /\bwe will explore\b/i,
    /\bcontact us\b/i, /\blearn more\b/i, /\bclick here\b/i, /\bread more\b/i,
    /\bfor more information\b/i, /\bplease feel free\b/i, /\bdon.t hesitate\b/i,
    /\bin conclusion\b/i, /\bto summarize\b/i, /\ball in all\b/i,
    /\bin today.s digital\b/i, /\bin today.s world\b/i, /\bin the modern\b/i,
    /\bit is important to note\b/i, /\bwe believe that\b/i, /\bwe are committed\b/i,
    /\bwe strive to\b/i, /\bour team of experts\b/i, /\bindustry-leading\b/i
  ];
  sents.forEach(s => {
    if (s.length < 20) { unhelpful++; return; }
    let isGeneric = false;
    for (const p of genericPatterns) { if (p.test(s)) { isGeneric = true; break; } }
    if (isGeneric) generic++;
  });
  const helpful = total - generic - unhelpful;
  return { totalSentences: total, helpfulSentences: helpful, genericSentences: generic, unhelpfulShortSentences: unhelpful, helpfulRatio: total > 0 ? Math.round((helpful / total) * 100) : 0, genericRatio: total > 0 ? Math.round((generic / total) * 100) : 0, verdict: helpful / total > 0.7 ? 'highly helpful' : helpful / total > 0.4 ? 'moderately helpful' : 'mostly unhelpful' };
}

function validateEEATSignals($, content) {
  const signals = {};
  const safeContent = String(content || '');
  const hasAuthor = $('[itemprop="author"], [itemprop*="author"], meta[name="author"], [rel="author"]').length > 0;
  const authorName = $('meta[name="author"]').attr('content') || $('[itemprop="author"]').first().text() || $('[rel="author"]').first().text() || '';
  const hasPublisher = $('[itemprop="publisher"], meta[property*="publisher"]').length > 0;
  const publisherName = $('[itemprop="publisher"]').first().text().trim() || '';
  const hasDatePublished = $('meta[property="article:published_time"], time[datetime], [itemprop="datePublished"]').length > 0;
  const datePublished = $('meta[property="article:published_time"]').attr('content') || $('time').first().attr('datetime') || '';
  const hasDateModified = $('meta[property="article:modified_time"], [itemprop="dateModified"]').length > 0;
  const hasAboutPage = $('link[rel="about"], [typeof="AboutPage"]').length > 0;
  const citations = (safeContent.match(/\(([^)]+(?:19|20)\d{2}[^)]*)\)/g) || []).length;
  const hasReferences = /\b(references|sources|citations|bibliography|works cited|further reading)\b/i.test(safeContent);
  const factualClaims = (safeContent.match(/\b\d+%|\$\d+|\d+ (million|billion|trillion)|according to|studies show|research indicates\b/gi) || []).length;
  const hasDisclaimer = /\b(disclaimer|disclosures|conflict of interest|sponsored|advertising disclosure)\b/i.test(safeContent);
  const hasBio = /\b(about the author|biography|bio)\b/i.test(safeContent);
  const hasCommentPolicy = /\b(comments|discussion|engagement)\b/i.test(safeContent);
  signals.author = { present: hasAuthor, name: authorName || 'Not found' };
  signals.publisher = { present: hasPublisher, name: publisherName || 'Not found' };
  signals.datePublished = { present: hasDatePublished, value: datePublished || 'Not found' };
  signals.dateModified = { present: hasDateModified, value: hasDateModified ? $('meta[property="article:modified_time"]').attr('content') || '' : 'Not found' };
  signals.citations = { count: citations, hasReferences };
  signals.factualClaims = { count: factualClaims };
  signals.transparency = { hasDisclaimer, hasBio, hasCommentPolicy };
  const score = (hasAuthor ? 20 : 0) + (hasPublisher ? 15 : 0) + (hasDatePublished ? 15 : 0) + (citations > 0 ? 15 : 0) +
    (hasReferences ? 10 : 0) + (hasDisclaimer ? 10 : 0) + (hasBio ? 10 : 0) + (hasCommentPolicy ? 5 : 0);
  signals.totalScore = score;
  signals.eeatLevel = score >= 80 ? 'strong' : score >= 50 ? 'moderate' : 'weak';
  return signals;
}

function calculateRevenueAtRisk(metrics) {
  const m = metrics || {};
  const organicTraffic = Number(m.organicTraffic) || 0;
  const conversionRate = Number(m.conversionRate) || 0;
  const avgOrderValue = Number(m.avgOrderValue) || 0;
  const visibilityDrop = Number(m.visibilityDrop) || 0;
  const hasRealInputs = organicTraffic > 0 && conversionRate > 0 && avgOrderValue > 0;
  const organicRevenue = organicTraffic * conversionRate * avgOrderValue;
  const affectedTraffic = organicTraffic * visibilityDrop;
  const lostRevenue = affectedTraffic * conversionRate * avgOrderValue;

  const signals = m.pageSignals || {};
  const hasTitle = signals.hasTitle !== false;
  const hasMetaDesc = signals.hasMetaDesc !== false;
  const hasCanonical = signals.hasCanonical !== false;
  const hasH1 = signals.hasH1 !== false;
  const hasSchema = signals.hasSchema !== false;
  const hasViewport = signals.hasViewport !== false;
  const wordCount = signals.wordCount || 0;
  const hasImages = (signals.imageCount || 0) > 0;
  const hasInternalLinks = (signals.internalLinkCount || 0) > 0;
  const hasDimensions = (signals.imageCount || 0) > 0 && (signals.imagesWithDimensions || 0) / signals.imageCount > 0.5;
  const hasFastServer = (signals.serverTimingMs !== undefined) ? signals.serverTimingMs < 500 : false;
  const hasSecurityHeaders = (signals.securityHeadersCount || 0) >= 3;

  const detectedRisks = [];
  if (!hasTitle) detectedRisks.push({ issue: 'Missing title tag', baseProb: 0.25, revenueFraction: 0.15, description: 'No title tag — search engines must derive a title from page content, losing control over the snippet shown' });
  if (!hasMetaDesc) detectedRisks.push({ issue: 'Missing meta description', baseProb: 0.15, revenueFraction: 0.08, description: 'No description — Google auto-generates the snippet, which may not include your keyword' });
  if (!hasCanonical) detectedRisks.push({ issue: 'Missing canonical tag', baseProb: 0.12, revenueFraction: 0.10, description: 'Duplicate content risk — ranking signals diluted across URL variants' });
  if (!hasH1) detectedRisks.push({ issue: 'Missing H1 heading', baseProb: 0.10, revenueFraction: 0.05, description: 'Weakest topic signal — search engines may not clearly understand page relevance' });
  if (!hasSchema) detectedRisks.push({ issue: 'No structured data', baseProb: 0.08, revenueFraction: 0.08, description: 'No rich-result eligibility — lower SERP visibility in eligible query types' });
  if (!hasViewport) detectedRisks.push({ issue: 'Missing viewport meta', baseProb: 0.15, revenueFraction: 0.12, description: 'Not mobile-friendly — poor mobile UX under mobile-first indexing' });
  if (wordCount < 300) detectedRisks.push({ issue: 'Thin content (' + wordCount + ' words)', baseProb: 0.12, revenueFraction: 0.10, description: 'Content under 300 words — Helpful Content System targets thin pages' });
  if (!hasImages && wordCount > 200) detectedRisks.push({ issue: 'No images in content', baseProb: 0.05, revenueFraction: 0.03, description: 'Visual content can improve engagement and time-on-page' });
  if (!hasInternalLinks) detectedRisks.push({ issue: 'No internal links', baseProb: 0.06, revenueFraction: 0.04, description: 'Poor site architecture — crawl efficiency reduced' });
  if (!hasDimensions && (m.imageCount || 0) > 0) detectedRisks.push({ issue: 'Missing image dimensions', baseProb: 0.08, revenueFraction: 0.05, description: 'Missing width/height can cause Cumulative Layout Shift (CLS)' });
  if (signals.serverTimingMs !== undefined && !hasFastServer) detectedRisks.push({ issue: 'Slow server response', baseProb: 0.10, revenueFraction: 0.08, description: 'High TTFB affects Core Web Vitals and user experience' });
  if (signals.securityHeadersCount !== undefined && !hasSecurityHeaders) detectedRisks.push({ issue: 'Missing security headers', baseProb: 0.04, revenueFraction: 0.02, description: 'Browser trust signals missing — may affect user confidence' });

  const riskEntries = detectedRisks.map(r => {
    const probability = Math.min(0.4, r.baseProb * (1 + visibilityDrop));
    const impact = organicRevenue * r.revenueFraction;
    const expectedLoss = Math.round(probability * impact * 100) / 100;
    return {
      issue: r.issue,
      probability: Math.round(probability * 100) / 100,
      impact: Math.round(impact * 100) / 100,
      expectedLoss,
      description: r.description,
      priority: hasRealInputs ? (expectedLoss > organicRevenue * 0.03 ? 'high' : expectedLoss > organicRevenue * 0.01 ? 'medium' : 'low') : 'n/a (no traffic data)'
    };
  });

  riskEntries.sort((a, b) => b.expectedLoss - a.expectedLoss);
  const totalAtRisk = Math.round(riskEntries.reduce((a, r) => a + r.expectedLoss, 0) * 100) / 100;
  return {
    hasRealInputs,
    inputStatus: hasRealInputs ? 'monetary figures derived from user-supplied GA4/analytics inputs' : 'NO monetary inputs supplied — all dollar figures are 0 and revenue-at-risk cannot be quantified. Provide organicTraffic, conversionRate and avgOrderValue to enable financial modeling.',
    organicRevenue: Math.round(organicRevenue),
    visibilityDrop,
    lostRevenue: Math.round(lostRevenue),
    totalAtRisk,
    risks: riskEntries,
    detectedRiskCount: detectedRisks.length,
    atRiskPercentage: organicRevenue > 0 ? Math.round((totalAtRisk / organicRevenue) * 100) : 0,
    currency: m.currency || 'USD',
    revenueGrade: !hasRealInputs ? 'not-rated (no traffic data)' : totalAtRisk === 0 ? 'A (no risk)' : totalAtRisk < organicRevenue * 0.05 ? 'B (low risk)' : totalAtRisk < organicRevenue * 0.15 ? 'C (moderate risk)' : 'D (high risk)',
    methodology: 'Risk probabilities and revenue fractions are heuristic modeling assumptions based on common SEO impact patterns. They are NOT measured from real analytics and may not match your specific market. Use the quantified figures only as directional planning inputs, not as audited financial estimates.'
  };
}

function prioritizeByImpact(findings) {
  const f = findings || []; const prioritized = [];
  const severityWeight = { critical: 100, high: 60, medium: 30, low: 10, info: 0 };
  f.forEach(issue => {
    const base = severityWeight[issue.severity] || 10;
    const hasSchemaImpact = /schema|structured data|rich snippet/.test(JSON.stringify(issue)) ? 20 : 0;
    const hasVisibilityImpact = /title|meta|canonical|noindex/.test(JSON.stringify(issue)) ? 25 : 0;
    const hasSpeedImpact = /speed|render|blocking|resource|image|css|js/.test(JSON.stringify(issue)) ? 20 : 0;
    const hasContentImpact = /content|heading|keyword|duplicate|thin/.test(JSON.stringify(issue)) ? 15 : 0;
    const hasLinkImpact = /link|broken|redirect/.test(JSON.stringify(issue)) ? 10 : 0;
    const score = Math.min(100, base + hasSchemaImpact + hasVisibilityImpact + hasSpeedImpact + hasContentImpact + hasLinkImpact);
    prioritized.push({ ...issue, impactScore: score, impactLabel: score >= 80 ? 'critical' : score >= 50 ? 'high' : score >= 25 ? 'medium' : 'low' });
  });
  prioritized.sort((a, b) => b.impactScore - a.impactScore);
  const totals = { critical: prioritized.filter(i => i.impactLabel === 'critical').length, high: prioritized.filter(i => i.impactLabel === 'high').length, medium: prioritized.filter(i => i.impactLabel === 'medium').length, low: prioritized.filter(i => i.impactLabel === 'low').length };
  return { prioritized, totals, totalIssues: prioritized.length };
}

function passageVectorSim(text, queries) {
  const safeText = String(text || '');
  const qs = Array.isArray(queries) ? queries : [queries];
  if (!safeText.trim() || qs.length === 0) return { results: [], topPassages: [], totalPassages: 0, uniqueQueries: qs.length };
  const passages = safeText.split(/\n\s*\n/).filter(x => x.trim().length > 50).map(p => p.trim().substring(0, 500));
  const results = [];
  const stopWords = new Set(['the','be','to','of','and','a','in','that','have','i','it','for','not','on','with','he','as','you','do','at','this','but','his','by','from','they','we','say','her','she','or','an','will','my','one','all','would','there','their','what','so','up','out','if','about','who','get','which','go','me','when','make','can','like','time','no','just','him','know','take','people','into','year','your','good','some','could','them','see','other','than','then','now','look','only','come','its','over','think','also','back','after','use','two','how','our','work','first','well','way','even','new','want','because','any','these','give','day','most','us']);
  const tokenize = s => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
  const jaccard = (a, b) => { const sa = new Set(a); const sb = new Set(b); const inter = new Set([...sa].filter(x => sb.has(x))).size; const union = new Set([...sa, ...sb]).size; return union > 0 ? inter / union : 0; };
  qs.forEach(query => {
    const qt = tokenize(query);
    passages.forEach((passage, idx) => {
      const pt = tokenize(passage); const sim = jaccard(qt, pt);
      if (sim > 0.1) results.push({ query, passageIndex: idx, passage: passage.substring(0, 200), similarity: Math.round(sim * 1000) / 1000, termOverlap: pt.filter(w => qt.includes(w)).length });
    });
  });
  results.sort((a, b) => b.similarity - a.similarity);
  return { results: results.slice(0, 50), topPassages: results.slice(0, 10), totalPassages: passages.length, uniqueQueries: qs.length };
}

function crossReferenceEntityConsensus(entityText, pageContent, externalContent) {
  const entity = String(entityText || '').toLowerCase().trim();
  const content = String(pageContent || '').toLowerCase();
  const extContent = String(externalContent || '').toLowerCase();
  const findings = [];

  const pageMentions = content.split(entity).length - 1;
  const pageSentences = content.split(/[.!?]+/).filter(s => s.includes(entity));
  findings.push({
    sourceId: 0,
    sourceLabel: 'Page Content (self-reference)',
    mentions: pageMentions,
    contextSentences: pageSentences.slice(0, 3).map(s => s.trim().substring(0, 150)),
    agreement: pageMentions > 0 ? 'self-referenced' : 'not mentioned on page',
    entityDensity: content.split(/\s+/).length > 0 ? Math.round((pageMentions / content.split(/\s+/).length) * 1000) / 10 + '%' : '0%'
  });

  if (extContent) {
    const extMentions = extContent.split(entity).length - 1;
    const extSentences = extContent.split(/[.!?]+/).filter(s => s.includes(entity));
    findings.push({
      sourceId: 1,
      sourceLabel: 'External Reference Content',
      mentions: extMentions,
      contextSentences: extSentences.slice(0, 3).map(s => s.trim().substring(0, 150)),
      agreement: extMentions > 0 ? 'externally referenced' : 'not found in external content',
      entityDensity: extContent.split(/\s+/).length > 0 ? Math.round((extMentions / extContent.split(/\s+/).length) * 1000) / 10 + '%' : '0%'
    });
  }

  const totalMentions = findings.reduce((a, f) => a + f.mentions, 0);
  const sourcesMentioning = findings.filter(f => f.mentions > 0).length;
  const srcCount = findings.length;
  const consensusLevel = srcCount > 0 ? sourcesMentioning / srcCount : 0;

  const entityPosition = pageContent ? pageContent.toLowerCase().indexOf(entity) : -1;
  const entityPositionPercent = pageContent && pageContent.length > 0 ? Math.round((entityPosition / pageContent.length) * 100) : -1;

  return {
    entity,
    sourcesChecked: srcCount,
    sourcesMentioning,
    totalMentions,
    entityPosition: entityPositionPercent >= 0 ? entityPositionPercent + '% into document' : 'not found',
    consensusRatio: Math.round(consensusLevel * 100),
    consensusLevel: consensusLevel >= 0.8 ? 'strong consensus' : consensusLevel >= 0.5 ? 'moderate consensus' : 'weak/no consensus',
    contradictions: [],
    findings,
    entityProminence: pageMentions > 5 ? 'high' : pageMentions > 2 ? 'moderate' : 'low'
  };
}

function generateAutonomousFix(issue, pageType) {
  const issueType = (issue?.type || issue?.issue || '').toLowerCase();
  const page = pageType || 'generic';
  const fix = {
    title: '', code: '', diff: '', description: '', risk: '', rollbackPlan: ''
  };
  if (issueType.includes('missing title') || issueType.includes('title tag')) {
    fix.title = 'Generate optimized title tag';
    const keywords = issue?.keywords || 'primary keyword';
    fix.code = '<title>' + (keywords.split(',')[0] || 'primary keyword') + ' | ' + (page === 'homepage' ? 'Brand Name' : page === 'product' ? 'Product Name - Brand' : 'Category | Brand') + '</title>';
    fix.description = 'Add a unique, keyword-optimized title tag between 50-60 characters (replace placeholder brand/product tokens with actual names)';
    fix.risk = 'low';
  } else if (issueType.includes('missing meta') || issueType.includes('meta description')) {
    fix.title = 'Generate SEO meta description';
    fix.code = '<meta name="description" content="' + (issue?.description || 'Discover comprehensive information about ' + (issue?.keywords || 'this topic') + ' including expert insights and practical advice.') + '" />';
    fix.description = 'Add a compelling meta description between 120-158 characters (review generated copy before publishing)';
    fix.risk = 'low';
  } else if (issueType.includes('canonical')) {
    fix.title = 'Add self-referencing canonical URL';
    fix.code = '<link rel="canonical" href="' + (issue?.url || '') + '" />';
    fix.description = 'Prevent duplicate content issues by specifying the preferred URL (uses the audited page URL)';
    fix.risk = 'low';
  } else if (issueType.includes('h1') || issueType.includes('heading')) {
    fix.title = 'Add primary H1 heading';
    fix.code = '<h1>' + (issue?.keywords || 'Primary Page Heading').split(',')[0] + '</h1>';
    fix.description = 'Each page should have exactly one H1 that includes the primary keyword';
    fix.risk = 'low';
  } else if (issueType.includes('schema') || issueType.includes('structured data')) {
    fix.title = 'Add JSON-LD structured data';
    const schemaType = page === 'product' ? 'Product' : page === 'article' ? 'Article' : page === 'faq' ? 'FAQPage' : 'WebPage';
    fix.code = '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "' + schemaType + '",\n  "name": "' + (issue?.title || 'Page Title') + '",\n  "description": "' + (issue?.description || '') + '"\n}\n</script>';
    fix.description = 'Add structured data to enable rich results in SERPs (populate fields with actual page data)';
    fix.risk = 'medium';
  } else if (issueType.includes('image') || issueType.includes('alt')) {
    fix.title = 'Add alt text to image';
    fix.code = '<img src="' + (issue?.src || 'image.jpg') + '" alt="' + (issue?.keywords || 'Descriptive image text') + '" />';
    fix.description = 'All informative images need descriptive alt text for accessibility and SEO';
    fix.risk = 'low';
  } else if (issueType.includes('open graph') || issueType.includes('og:')) {
    fix.title = 'Add Open Graph tags';
    fix.code = '<meta property="og:title" content="' + (issue?.title || 'Page Title') + '" />\n<meta property="og:description" content="' + (issue?.description || 'Description') + '" />\n<meta property="og:image" content="' + (issue?.image || '/path/to/og-image.jpg') + '" />\n<meta property="og:url" content="' + (issue?.url || '') + '" />';
    fix.description = 'Improve social sharing appearance with Open Graph tags (add real og:image path and URL)';
    fix.risk = 'low';
  } else {
    fix.title = 'Manual review required';
    fix.description = 'This issue type requires human judgment to resolve. Review the recommendations and apply appropriate fixes.';
    fix.risk = 'unknown';
  }
  fix.rollbackPlan = 'Use version control to revert changes if issues arise. Monitor traffic and rankings for 2 weeks after deployment.';
  fix.placeholderNote = 'Generated code contains placeholders where real values were unavailable — replace them with verified page data before deploying.';
  return fix;
}

function redTeamTest(url, $, headers) {
  const tests = [];
  const page = $ || null;
  const hdrs = headers || {};
  const headerVal = (n) => { const v = hdrs[n] || hdrs[n.toLowerCase()] || ''; return String(v); };

  // 1. Clickjacking Protection — REAL: inspect actual response headers
  const xfo = headerVal('x-frame-options');
  const csp = headerVal('content-security-policy');
  const hasFrameAncestors = /\bframe-ancestors\b/i.test(csp);
  if (xfo || hasFrameAncestors) {
    tests.push({ test: 'Clickjacking Protection', endpoint: url, status: 'checked', finding: 'X-Frame-Options' + (xfo ? ': ' + xfo : '') + (hasFrameAncestors ? ' / CSP frame-ancestors present' : '') + ' set — clickjacking mitigated.', severity: 'info', verified: true });
  } else {
    tests.push({ test: 'Clickjacking Protection', endpoint: url, status: 'checked', finding: 'Neither X-Frame-Options nor CSP frame-ancestors header detected — page may be embeddable in third-party frames (clickjacking risk).', severity: 'medium', verified: true, recommendation: 'Set X-Frame-Options: DENY or CSP frame-ancestors.' });
  }

  // 2. Information Disclosure — REAL: scan actual page HTML
  if (page) {
    const html = page.html() || '';
    const exposed = [];
    if (/AKIA[0-9A-Z]{16}/.test(html)) exposed.push('AWS access key pattern');
    if (/-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(html)) exposed.push('private key block');
    if (/sk_live_|pk_live_|sk_test_|pk_test_/i.test(html)) exposed.push('Stripe API key pattern');
    if (/AIza[0-9A-Za-z_-]{35}/.test(html)) exposed.push('Google API key pattern');
    if (/(password|passwd|secret|api[_-]?key|access[_-]?token)\s*[:=]\s*["'][^"']{8,}["']/i.test(html)) exposed.push('hardcoded credential assignment');
    const comments = (html.match(/<!--[\s\S]*?-->/g) || []).filter(c => /(password|secret|token|key|todo|fixme|hack|internal|localhost|127\.0\.0\.1)/i.test(c));
    if (comments.length) exposed.push(comments.length + ' source comment(s) referencing credentials/internal paths');
    if (exposed.length > 0) {
      tests.push({ test: 'Information Disclosure', endpoint: url, status: 'checked', finding: 'Potential sensitive data exposed in HTML: ' + exposed.join('; ') + '.', severity: 'high', verified: true, recommendation: 'Remove secrets/keys from page source and server-side renders.' });
    } else {
      tests.push({ test: 'Information Disclosure', endpoint: url, status: 'checked', finding: 'No obvious API keys, private-key blocks, or credential assignments found in HTML source.', severity: 'info', verified: true });
    }
  } else {
    tests.push({ test: 'Information Disclosure', endpoint: url, status: 'skipped', finding: 'No rendered HTML available to inspect.', severity: 'info', verified: true });
  }

  // 3. Subresource Integrity — REAL: inspect actual external script tags
  if (page) {
    const extScripts = [];
    page('script[src]').each((i, el) => { extScripts.push(page(el).attr('src')); });
    const withoutIntegrity = extScripts.filter(src => !page('script[src="' + src.replace(/"/g, '\\"') + '"][integrity]').length && !page('script[src^="' + src.replace(/["\\]/g, '') + '"][integrity]').length);
    if (extScripts.length > 0) {
      const missingSRI = withoutIntegrity.length;
      tests.push({ test: 'Subresource Integrity', endpoint: url, status: 'checked', finding: missingSRI + '/' + extScripts.length + ' external script(s) lack integrity attributes.' + (missingSRI === 0 ? ' All external scripts have SRI.' : ''), severity: missingSRI > 0 ? 'low' : 'info', verified: true, recommendation: missingSRI > 0 ? 'Add integrity="sha384-..." attributes to third-party scripts.' : '' });
    }
  }

  // 4. Form CSRF Protection — REAL: inspect actual forms
  if (page) {
    let forms = 0; let tokenized = 0;
    page('form').each((i, el) => {
      forms++;
      const hasToken = page(el).find('input[name*="token"], input[name*="csrf"], input[name*="_token"], input[name="authenticity_token"]').length > 0 ||
        /csrf|token|xsrf/i.test(page(el).html() || '');
      if (hasToken) tokenized++;
    });
    if (forms > 0) {
      tests.push({ test: 'Form CSRF Protection', endpoint: url, status: 'checked', finding: tokenized + '/' + forms + ' form(s) contain CSRF tokens or anti-CSRF markers.', severity: tokenized < forms ? 'medium' : 'info', verified: true, recommendation: tokenized < forms ? 'Add CSRF tokens to forms lacking anti-CSRF protection.' : '' });
    }
  }

  // 5. JS Rendering dependency — REAL: check raw script tags that inject critical markup
  if (page) {
    const jsScripts = page('script:not([src])').filter((i, el) => /innerHTML|insertAdjacentHTML|document\.write|\.append\(|\.prepend\(/.test(page(el).html() || '')).length;
    const renderJs = page('script[src]').filter((i, el) => /(react|vue|angular|next|nuxt|hydration|polyfill)/i.test(page(el).attr('src') || '')).length;
    if (jsScripts > 0 || renderJs > 0) {
      tests.push({ test: 'JavaScript Rendering', endpoint: url, status: 'checked', finding: jsScripts + ' inline script(s) mutate the DOM and ' + renderJs + ' framework script(s) detected. Critical content may depend on JS execution.', severity: 'medium', verified: true, recommendation: 'Ensure critical content (title, headings, text) exists in raw HTML for reliable crawling.' });
    }
  }

  // 6. Canonical self-reference — REAL: inspect actual canonical tag
  if (page) {
    const canon = page('link[rel="canonical"]').first().attr('href') || '';
    if (!canon) {
      tests.push({ test: 'Canonical Integrity', endpoint: url, status: 'checked', finding: 'No canonical tag present — duplicate content risk across URL variants.', severity: 'medium', verified: true, recommendation: 'Add a self-referencing canonical URL.' });
    } else {
      let sameHost = false;
      try { sameHost = new URL(canon).hostname === new URL(url).hostname; } catch {}
      tests.push({ test: 'Canonical Integrity', endpoint: url, status: 'checked', finding: 'Canonical ' + canon + (sameHost ? ' on same host' : ' on a different host (verify intent)') + '.', severity: sameHost ? 'info' : 'medium', verified: true });
    }
  }

  // 7-9. Network-dependent tests — NOT run (no live probing), reported honestly as skipped
  ['Rate Limiting', 'User-Agent Cloaking', 'Open Redirect', 'Parameter Pollution'].forEach(name => {
    tests.push({ test: name, endpoint: url, status: 'skipped', finding: 'Requires live request probing (not performed by this audit). No claims made.', severity: 'info', verified: false });
  });

  const highFindings = tests.filter(t => t.severity === 'high');
  const mediumFindings = tests.filter(t => t.severity === 'medium');
  return {
    url,
    tests,
    totalTests: tests.length,
    checkedTests: tests.filter(t => t.status === 'checked').length,
    skippedTests: tests.filter(t => t.status === 'skipped').length,
    criticalFindings: highFindings.length,
    mediumFindings: mediumFindings.length,
    overallRisk: highFindings.length > 2 ? 'high' : highFindings.length > 0 ? 'medium' : mediumFindings.length > 2 ? 'medium' : 'low',
    methodology: 'Checks are performed against the actual fetched HTML and real response headers only. Tests requiring live request probing are reported as skipped rather than simulated.'
  };
}

function agenticCommerceAudit($) {
  const products = [];
  $('[itemtype*="Product"], [itemscope][itemtype*="product"]').each((i, el) => {
    const name = $(el).find('[itemprop="name"]').first().text().trim() || $(el).find('h1, h2, h3').first().text().trim();
    const price = $(el).find('[itemprop="price"]').first().attr('content') || $(el).find('[itemprop="price"]').first().text().trim();
    const currency = $(el).find('[itemprop="priceCurrency"]').first().attr('content') || '';
    const availability = $(el).find('[itemprop="availability"]').first().attr('href') || $(el).find('[itemprop="availability"]').first().text().trim();
    const image = $(el).find('[itemprop="image"]').first().attr('src') || $(el).find('img').first().attr('src') || '';
    const description = $(el).find('[itemprop="description"]').first().text().trim().substring(0, 200);
    const reviews = $(el).find('[itemprop="review"]').length;
    products.push({ name, price, currency, availability: availability || 'Unknown', image, description, reviewCount: reviews });
  });
  if (products.length === 0) {
    $('.product, [class*="product"], [class*="Product"], li[class*="product"]').each((i, el) => {
      const name = $(el).find('a[title], h2, h3, .name, .title').first().text().trim() || 'Product ' + (i + 1);
      const price = $(el).find('.price, [class*="price"]').first().text().trim();
      products.push({ name, price, currency: '', availability: 'Unknown', image: '', description: '', reviewCount: 0, detectedBy: 'class-based heuristic' });
    });
  }
  const hasAddToCart = $('[class*="add-to-cart"], [class*="addtocart"], [data-product-id], form[action*="cart"]').length > 0;
  const hasCartLink = $('a[href*="cart"], a[href*="checkout"]').length > 0;
  const hasWishlist = $('[class*="wishlist"], [class*="favorite"]').length > 0;
  const hasCompare = $('[class*="compare"]').length > 0;
  return { schemaProducts: products.filter(p => p.price), heuristicProducts: products.filter(p => !p.price), totalProducts: products.length, commerceFeatures: { hasAddToCart, hasCartLink, hasWishlist, hasCompare }, commerceReadiness: { haveSchema: products.filter(p => p.price).length > 0, productCount: products.length, recommendation: products.length === 0 ? 'No products detected — review page structure' : products.every(p => !p.price) ? 'Products found but missing price data — add schema markup' : 'Product schema detected' } };
}

function synthesizeMentionShare(text, brandTerms) {
  const safeText = String(text || '');
  const terms = Array.isArray(brandTerms) ? brandTerms : [brandTerms || ''];
  if (!safeText.trim() || terms.every(t => !t)) return { mentions: {}, totalMentions: 0, shareOfVoice: '0%', contexts: {}, sentimentByTerm: {}, totalWords: 0 };
  const mentions = {}; const contexts = {};
  terms.forEach(term => {
    if (!term || term.length === 0) return;
    const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = text.match(re); mentions[term] = matches ? matches.length : 0;
    const sents = text.split(/[.!?]+/).filter(s => re.test(s));
    contexts[term] = sents.slice(0, 5).map(s => s.trim().substring(0, 150));
  });
  const totalMentions = Object.values(mentions).reduce((a, b) => a + b, 0);
  const totalWordsCount = text.split(/\s+/).length;
  const shareOfVoice = totalWordsCount > 0 ? Math.round((totalMentions / totalWordsCount) * 10000) / 100 : 0;
  const sentimentByTerm = {};
  Object.keys(contexts).forEach(term => {
    const posSentences = contexts[term].filter(s => /\b(great|excellent|amazing|good|best|outstanding|fantastic|love|recommend|perfect|impressive)\b/i.test(s));
    const negSentences = contexts[term].filter(s => /\b(bad|terrible|awful|worst|poor|hate|disappointing|horrible|terrible|broken|useless)\b/i.test(s));
    sentimentByTerm[term] = { positive: posSentences.length, negative: negSentences.length, neutral: contexts[term].length - posSentences.length - negSentences.length, netScore: posSentences.length - negSentences.length };
  });
  return { mentions, totalMentions, shareOfVoice: shareOfVoice + '% (on-page mention frequency, not external SOV)', contexts, sentimentByTerm, totalWords: totalWordsCount, note: 'Counts real mentions of the brand/page terms within this single page text only. NOT a share-of-voice measure across the web.' };
}

function selfHealingEdgeScript(url) {
  const rules = []; const _u = url;
  const parsed = new URL(_u);
  rules.push({ trigger: '404 detected', action: 'Check canonical or closest matching URL and issue 301 redirect', code: "if (response.status === 404) { const canonical = await getCanonical(request.url); if (canonical) return Response.redirect(canonical, 301); }", priority: 1 });
  rules.push({ trigger: '5xx server error', action: 'Serve stale cache or fallback content', code: "if (response.status >= 500) { const cached = await cache.match(request); if (cached) return cached; }", priority: 1 });
  rules.push({ trigger: 'SSL protocol downgrade', action: 'Upgrade to HTTPS', code: "if (request.headers.get('x-forwarded-proto') !== 'https') return Response.redirect('https://' + request.host + request.url, 301);", priority: 2 });
  rules.push({ trigger: 'Noindex accidentally removed', action: 'Re-add noindex via header based on config', code: "if (config.shouldNoindex(request.url)) { response.headers.set('X-Robots-Tag', 'noindex, nofollow'); }", priority: 2 });
  rules.push({ trigger: 'Missing canonical', action: 'Inject canonical link via response header', code: "const canon = 'https://' + request.host + request.url.split('?')[0]; response.headers.set('Link', '<' + canon + '>; rel=\"canonical\"');", priority: 3 });
  rules.push({ trigger: 'URL parameter storm', action: 'Collapse parameters known to cause duplicates', code: "const collapsed = new URL(request.url); collapsed.searchParams.delete('session'); collapsed.searchParams.delete('source'); return fetch(collapsed.toString());", priority: 3 });
  rules.push({ trigger: 'Broken hreflang', action: 'Validate and fix hreflang annotations', code: "const hreflangs = response.headers.get('Link').match(/<[^>]+>; rel=\"alternate\"; hreflang=\"[^\"]+\"/g); if (hreflangs && !hreflangs.some(h => h.includes('x-default'))) { response.headers.set('Link', response.headers.get('Link') + ', <https://' + request.host + '/>; rel=\"alternate\"; hreflang=\"x-default\"'); }", priority: 3 });
  return { url: _u, hostname: parsed.hostname, selfHealingRules: rules, totalRules: rules.length, enabled: true };
}

function calculateSiteWideRisk(allPages, itemLabel) {
  const pages = Array.isArray(allPages) ? allPages : [];
  const label = itemLabel || 'pages';
  const scores = pages.map(p => p.score || p.overallScore || p.qualityScore || 0);
  const pageCount = pages.length;
  if (pageCount === 0) return { siteRiskScore: 0, pageCount: 0, riskLevel: 'unknown', distribution: {}, message: 'No ' + label + ' data provided' };
  const avgScore = scores.reduce((a, s) => a + s, 0) / pageCount;
  const minScore = Math.min(...scores); const maxScore = Math.max(...scores);
  const criticalPages = pages.filter((p, i) => scores[i] < 30).length;
  const poorPages = pages.filter((p, i) => scores[i] >= 30 && scores[i] < 50).length;
  const fairPages = pages.filter((p, i) => scores[i] >= 50 && scores[i] < 70).length;
  const goodPages = pages.filter((p, i) => scores[i] >= 70 && scores[i] < 90).length;
  const excellentPages = pages.filter((p, i) => scores[i] >= 90).length;
  const siteRiskScore = Math.round((100 - avgScore) * 10) / 10;
  const hasCriticalIssues = criticalPages > 0;
  const hasWidespreadIssues = poorPages + criticalPages > pageCount * 0.3;
  const riskLevel = hasCriticalIssues ? 'high' : hasWidespreadIssues ? 'medium-high' : poorPages + fairPages > pageCount * 0.3 ? 'medium' : 'low';
  return { siteRiskScore, avgScore: Math.round(avgScore * 10) / 10, minScore, maxScore, pageCount, itemLabel: label, distribution: { critical: criticalPages, poor: poorPages, fair: fairPages, good: goodPages, excellent: excellentPages }, riskLevel, hasCriticalIssues, hasWidespreadIssues, recommendation: riskLevel === 'high' ? 'Immediate action required on ' + criticalPages + ' critical ' + label : riskLevel === 'medium-high' ? 'Schedule sprint to address widespread issues across ' + label : riskLevel === 'medium' ? 'Plan improvements for underperforming ' + label : 'All ' + label + ' scored well — maintain monitoring' };
}

module.exports = {
  sc, byteLen, pxWidth, cssEscape, sel, getSelectorChain, extractAllAttributes, analyzeInlineStyles,
  syllables, fleschKincaid, stripHtml, getTextContent, countSyllables,
  extractSchemas, chunkText, analyzeSchema, detectAIPatterns,
  analyzeImage, analyzeLink, analyzeHeading, analyzeAccessibility,
  countWords, extractEntities, extractAllMentions, analyzeReadability,
  analyzeKeywordDensity, analyzeBigrams, analyzeContentStructure, analyzeTransitionWords,
  detectContentQualityFlags, analyzeNLP, analyzeTitlePrecision, analyzeHeadingHierarchy,
  analyzeCanonicalIntegrity, analyzeMediaOptimization, analyzeHttpHeaders, analyzeInternalLinks,
  ssrVsCsrDiff, analyzeDomDepth, validateSchemaComprehensive, analyzeCoreWebVitals,
  extractKnowledgeGraphEntities, calculateInformationGain, analyzeAnchorTextContext,
  analyzeReadabilityAdvanced, ragChunkSimulator, directAnswerScorer, simulateLLMCitation,
  generateSchemaCode, generateMetaOptions, formatJiraTicket, generateEdgeWorkerCode,
  analyzeBotManagement, analyzeMultiModalContent, validateSemanticCaptions, analyzeSerpVolatility,
  calculateQualityThresholds, analyzeSyntheticAgentBehavior, calculateUnhelpfulContentRatio,
  validateEEATSignals, calculateRevenueAtRisk, prioritizeByImpact, passageVectorSim,
  crossReferenceEntityConsensus, generateAutonomousFix, redTeamTest, agenticCommerceAudit,
  synthesizeMentionShare, selfHealingEdgeScript, calculateSiteWideRisk
};
