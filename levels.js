const { sc, byteLen, pxWidth, cssEscape, sel, getSelectorChain, extractAllAttributes, analyzeInlineStyles, syllables, fleschKincaid, stripHtml, getTextContent, countSyllables, extractSchemas, chunkText, analyzeSchema, detectAIPatterns, analyzeImage, analyzeLink, analyzeHeading, analyzeAccessibility, countWords, extractEntities, extractAllMentions, analyzeReadability, analyzeKeywordDensity, analyzeBigrams, analyzeContentStructure, analyzeTransitionWords, detectContentQualityFlags, analyzeNLP, analyzeTitlePrecision, analyzeHeadingHierarchy, analyzeCanonicalIntegrity, analyzeMediaOptimization, analyzeHttpHeaders, analyzeInternalLinks, ssrVsCsrDiff, analyzeDomDepth, validateSchemaComprehensive, analyzeCoreWebVitals, extractKnowledgeGraphEntities, calculateInformationGain, analyzeAnchorTextContext, analyzeReadabilityAdvanced, ragChunkSimulator, directAnswerScorer, simulateLLMCitation, generateSchemaCode, generateMetaOptions, formatJiraTicket, generateEdgeWorkerCode, analyzeBotManagement, analyzeMultiModalContent, validateSemanticCaptions, analyzeSerpVolatility, calculateQualityThresholds, analyzeSyntheticAgentBehavior, calculateUnhelpfulContentRatio, validateEEATSignals, calculateRevenueAtRisk, prioritizeByImpact, passageVectorSim, crossReferenceEntityConsensus, generateAutonomousFix, redTeamTest, agenticCommerceAudit, synthesizeMentionShare, selfHealingEdgeScript, calculateSiteWideRisk } = require('./helpers');

function level1($, url, headers, rawHtml, config) {
  try {
  const cfg = config || {};
  const issues = [];
  let p = 0;
  const subfunctions = {};
  const data = subfunctions;
  data.config = { userAgent: cfg.userAgent || 'chrome-desktop', pageType: cfg.pageType || 'auto', keywords: cfg.keywords || '', brand: cfg.brand || '' };

  const titleText = $('title').first().text().trim();
  const titleBl = byteLen(titleText);
  const titlePx = pxWidth(titleText);
  const titleIsTruncated = titlePx > 580 || titleBl > 70;
  const titleHasDynamic = /[%][sS]|\{title\}|\{page\}|\{term\}|\[page\]|\[keyword\]|{{.+?}}/i.test(titleText);
  const h1Text = $('h1').first().text().trim();
  const titleMatchesH1 = h1Text && titleText.toLowerCase().includes(h1Text.toLowerCase().substring(0, 30));
  const ogTitle = $('meta[property="og:title"]').attr('content') || '';
  const titleMatchesOG = ogTitle && titleText === ogTitle;

  data.titleAnalysis = {
    text: titleText, byteLength: titleBl, pxWidth: titlePx,
    truncationRisk: titleIsTruncated, dynamicSubstitution: titleHasDynamic,
    pixelTruncationRisk: titlePx > 580,
    matchesH1: titleMatchesH1, h1Text,
    matchesOGTitle: titleMatchesOG, ogTitle,
    keywordPosition: titleText.length > 0 ? (h1Text ? (titleText.toLowerCase().indexOf(h1Text.split(/\s+/).filter(w => w.length > 3)[0] || '') >= 0 ? 'early' : 'present') : 'unknown') : 'none',
    lengthStatus: titleText.length < 30 ? 'too-short' : titleText.length > 60 ? 'long' : 'optimal',
    hasSeparator: /[-–—|:;]/.test(titleText)
  };

  if (!titleText) { p += 25; issues.push({ severity: 'critical', impact: 'critical', message: 'No title tag found in <head> — Google must derive a title from page content, losing control over how the page appears in search results', element: 'title', selector: 'head > title', link: url, evidence: 'Title tag count: 0 in <head>', fix: '<title>' + ((cfg.keywords || '').split(',')[0] || 'Primary Keyword') + ' - ' + (cfg.brand || 'Brand Name') + '</title>', recommendation: 'Add a unique, descriptive title tag to every page. Place the primary keyword at the start.', steps: ['Add a <title> tag inside the <head> section', 'Keep title between 50-60 characters (580px pixel width max)', 'Front-load the primary keyword for maximum SEO impact', 'Ensure each page has a unique title (no duplicates across your site)', 'Save and deploy the changes'] }); }
  else {
    if (titleText.length < 20) { p += 15; issues.push({ severity: 'critical', impact: 'high', message: 'Title too short: ' + titleText.length + ' chars. "' + titleText + '" under 20 chars wastes SERP real estate', element: 'title', selector: $('title').length ? sel($, $('title')[0]) : 'head > title', link: url, evidence: 'Length: ' + titleText.length + ' chars, min recommended: 50', fix: '<title>' + (h1Text || 'Your Primary Keyword') + ' - Detailed Description | ' + (data.config.brand || 'Brand Name') + '</title>', steps: ['Current title is only ' + titleText.length + ' characters — far below the optimal 50-60 range', 'Expand the title by adding: Primary Keyword + Secondary Keyword + Brand', 'Example pattern: "Primary Keyword - Supporting Detail | Brand Name"', 'Ensure the title accurately describes the page content', 'Test pixel width using a title pixel counter tool (target: under 580px)', 'Deploy and verify in Google Search Console after indexing'] }); }
    else if (titleText.length < 30) { p += 5; issues.push({ severity: 'warning', impact: 'medium', message: 'Title below optimal length: ' + titleText.length + ' chars — could include more descriptive keywords', element: 'title', selector: sel($, $('title')[0]), link: url, fix: 'Add more descriptive keywords to reach 50-60 characters', steps: ['Add a secondary keyword or descriptive phrase to the title', 'Include your brand name if not already present', 'Target 50-60 characters total', 'Front-load the most important keywords'] }); }
    if (titleIsTruncated) { p += titlePx > 580 ? 8 : 5; issues.push({ severity: 'warning', impact: 'medium', message: 'Title may truncate in SERPs: ' + titlePx + 'px/' + titleBl + ' bytes (safe limit: 580px / ~60 chars)', element: 'title', selector: sel($, $('title')[0]), link: url, evidence: 'Pixel width ' + titlePx + 'px, safe limit 580px', fix: 'Shorten title to under 55 characters. Front-load the primary keyword.', steps: ['Google truncates titles at approximately 580 pixels (roughly 55-60 characters)', 'Your title is ' + titlePx + 'px wide — the last ' + (titlePx - 580) + 'px will be cut off in search results', 'Move the most important keyword/phrase to the beginning of the title', 'Remove filler words like "Welcome to", "The official site of"', 'Aim for 50-55 characters to be safe across all devices', 'Use a pixel width checker to verify: search for "SERP pixel width tool"'] }); }
    if (titleHasDynamic) { p += 5; issues.push({ severity: 'warning', impact: 'medium', message: 'Dynamic substitution tokens detected in title — Google may rewrite SERP title', element: 'title', selector: sel($, $('title')[0]), link: url, evidence: 'Patterns found: ' + (titleText.match(/[%][sS]|\{title\}|\{page\}|\{term\}|\[page\]|\[keyword\]|{{.+?}}/g) || []).join(', '), fix: 'Replace dynamic tokens with static, keyword-rich titles or verify token replacement works correctly', steps: ['Dynamic tokens like {title}, %s%, [page] are CMS placeholders that get replaced at runtime', 'Verify the token actually produces a meaningful title by viewing the rendered page', 'If the token output is generic (e.g., "Page 1"), replace it with a static title', 'For WordPress: Edit the SEO plugin title template (Yoast/RankMath)', 'For custom CMS: Check the template file that generates the <title> tag', 'Google may ignore dynamic titles that appear auto-generated'] }); }
    if (!titleMatchesH1 && h1Text) { p += 5; issues.push({ severity: 'warning', impact: 'medium', message: 'Title "' + titleText.substring(0, 40) + '" substantially differs from H1 "' + h1Text.substring(0, 40) + '" — Google may rewrite title based on H1 content', element: 'title', selector: sel($, $('title')[0]), link: url, evidence: 'Title: "' + titleText + '" | H1: "' + h1Text + '"', fix: 'Align title and H1 to share the same primary keyword phrase', steps: ['Google sometimes replaces your title with H1 text in search results', 'Ensure both title and H1 contain the same primary keyword', 'The title can be a slightly expanded version of the H1', 'Example: H1 = "Best Running Shoes" → Title = "Best Running Shoes 2026 - Reviews & Guide | Brand"', 'This alignment signals clear topical focus to search engines'] }); }
    if (ogTitle && !titleMatchesOG) { p += 3; issues.push({ severity: 'info', impact: 'low', message: 'OG:title "' + ogTitle.substring(0, 40) + '" differs from HTML title — social shares may show different text', element: 'meta[property="og:title"]', link: url, evidence: 'OG: "' + ogTitle + '" vs Title: "' + titleText + '"', fix: 'Set og:title to match or closely mirror the HTML <title> tag', steps: ['OG:title controls what appears when your page is shared on Facebook/LinkedIn', 'Set <meta property="og:title" content="same as your title tag">', 'This ensures consistent branding across search and social', 'Update Open Graph tags in your HTML <head> section'] }); }
  }

  const desc = $('meta[name="description"]').first().attr('content') || '';
  const descLen = desc.length;
  const descBl = byteLen(desc);
  const descHasCTA = /\b(learn|discover|find|get|start|try|shop|browse|explore|see|read|check|download|sign|join|buy|order|subscribe)\b/i.test(desc);
  const descKeywords = h1Text ? h1Text.split(/\s+/).filter(w => w.length > 3).slice(0, 2).join(' ') : '';
  const descHasKeyword = descKeywords ? desc.toLowerCase().includes(descKeywords.toLowerCase()) : true;
  const ogDesc = $('meta[property="og:description"]').attr('content') || '';
  const ogDescAligned = ogDesc && desc ? desc === ogDesc : true;

  data.metaDescription = {
    text: desc.substring(0, 200), length: descLen, byteLength: descBl,
    hasCTA: descHasCTA, includesKeyword: descHasKeyword,
    truncationRisk: descLen > 160,
    lengthStatus: descLen < 70 ? 'too-short' : descLen < 120 ? 'below-optimal' : descLen <= 160 ? 'optimal' : 'too-long',
    ogDescription: ogDesc.substring(0, 200), ogAligned: ogDescAligned
  };

  if (!desc) { p += 20; issues.push({ severity: 'critical', impact: 'critical', message: 'No meta description — Google will auto-generate a snippet from page content, meaning you lose control over the text shown in results and it may not include your keyword', element: 'meta[name="description"]', link: url, evidence: 'Meta description tag count: 0', fix: '<meta name="description" content="' + (cfg.keywords ? cfg.keywords.split(',')[0] : 'Primary Keyword') + ' — ' + (cfg.brand || 'Brand Name') + '. Write a compelling description that includes your primary keyword and a call-to-action.">', recommendation: 'Write a compelling 150-155 char description with primary keyword and CTA', steps: ['Locate the <head> section', 'Add: <meta name="description" content="Your compelling description here">', 'Write 150-155 characters (Google truncates at ~155-160)', 'Include your primary keyword naturally in the first 100 characters', 'Add a call-to-action: "Learn how...", "Discover why...", "Get started..."', 'Make it unique for every page — duplicate descriptions hurt rankings', 'Save and deploy. Monitor CTR in Google Search Console after indexing'] }); }
  else {
    if (descLen < 70) { p += 8; issues.push({ severity: 'warning', impact: 'medium', message: 'Meta description too short: ' + descLen + ' chars — optimal is 150-155', element: 'meta[name="description"]', link: url, evidence: 'Current: ' + descLen + ' chars, target: 150-155', fix: 'Expand description to 150-155 characters with compelling copy and keywords', steps: ['Your description is only ' + descLen + ' characters — Google can display up to ~155', 'Add more descriptive text about what the page offers', 'Include the primary keyword naturally', 'Add a call-to-action (e.g., "Learn more", "Shop now", "Read the guide")', 'Aim for exactly 150-155 characters for maximum SERP visibility'] }); }
    else if (descLen < 120) { p += 3; issues.push({ severity: 'info', impact: 'low', message: 'Meta description below optimal range: ' + descLen + ' chars (target: 150-155)', element: 'meta[name="description"]', link: url, fix: 'Add 30-40 more characters with additional keyword-rich copy', steps: ['Description is slightly short at ' + descLen + ' chars', 'Add a secondary keyword or benefit statement', 'Include a CTA if not already present'] }); }
    if (descLen > 160) { p += 5; issues.push({ severity: 'warning', impact: 'medium', message: 'Meta description too long: ' + descLen + ' chars — Google truncates at ~155-160 chars', element: 'meta[name="description"]', link: url, evidence: 'Current: ' + descLen + ' chars, truncation point: ~155 chars', fix: 'Trim to 150-155 characters. Keep the most important info and CTA at the start.', steps: ['Your description exceeds 160 characters — the last ' + (descLen - 155) + ' characters will be cut off in search results', 'Identify the most compelling part of your description', 'Move the primary keyword and CTA to the first 100 characters', 'Remove redundant words or secondary details', 'Test by pasting into a character counter tool'] }); }
    if (!descHasCTA && descLen > 50) { p += 2; issues.push({ severity: 'info', impact: 'low', message: 'Meta description lacks a clear call-to-action — CTAs give users a reason to click and can influence CTR, though impact varies by niche', element: 'meta[name="description"]', link: url, fix: 'Add a CTA like "Learn how...", "Discover why...", "Get started..."', steps: ['CTAs in meta descriptions encourage clicks from search results', 'Add action verbs: Learn, Discover, Find, Get, Start, Try, Shop, Read', 'Place the CTA near the end of the description', 'Example: "... Read our complete guide to learn more"', 'A/B test different CTAs in Google Search Console'] }); }
    if (!descHasKeyword && descKeywords) { p += 2; issues.push({ severity: 'info', impact: 'medium', message: 'Primary keyword phrase "' + descKeywords + '" not found in meta description — keywords in descriptions get bolded in SERPs', element: 'meta[name="description"]', link: url, evidence: 'H1 keyword "' + descKeywords + '" not in description', fix: 'Include the primary keyword phrase "' + descKeywords + '" naturally in the description', steps: ['Google bolds matching keywords in descriptions, increasing visibility', 'Your primary keyword from the H1 should appear in the meta description', 'Rewrite the description to naturally include "' + descKeywords + '"', 'Place it in the first 100 characters for maximum impact', 'Don\'t keyword-stuff — keep it readable'] }); }
    if (ogDesc && !ogDescAligned) { p += 2; issues.push({ severity: 'info', impact: 'low', message: 'OG:description differs from HTML meta description — social platforms may show different text', element: 'meta[property="og:description"]', link: url, fix: 'Set og:description to match the HTML meta description', steps: ['OG:description controls what appears when shared on social media', 'Set <meta property="og:description" content="same as meta description">', 'This ensures consistent messaging across search and social'] }); }
  }

  const vp = $('meta[name="viewport"]').first().attr('content') || '';
  data.viewport = {
    present: !!vp, content: vp,
    hasWidthDeviceWidth: vp.includes('width=device-width'),
    hasInitialScale: vp.includes('initial-scale='),
    allowsZoom: !vp.includes('maximum-scale') && !vp.includes('user-scalable=no'),
    zoomRestricted: vp.includes('maximum-scale=') || vp.includes('user-scalable=no')
  };
  if (!vp) { p += 20; issues.push({ severity: 'critical', impact: 'critical', message: 'No viewport meta tag — mobile browsers render at desktop width, hurting mobile rankings', element: 'meta[name="viewport"]', selector: 'head > meta[name="viewport"]', link: url, fix: '<meta name="viewport" content="width=device-width, initial-scale=1">', recommendation: 'Essential for mobile-first indexing', steps: ['Without a viewport tag, mobile browsers render at 980px desktop width', 'This makes your site unreadable on phones without zooming', 'Add this exact tag to your <head> section: <meta name="viewport" content="width=device-width, initial-scale=1">', 'This tells the browser to match the device screen width', 'initial-scale=1 sets the zoom level to 100% on page load', 'Test on mobile devices or use Chrome DevTools device emulation', 'This is required for Google mobile-first indexing'] }); }
  else {
    if (!vp.includes('width=device-width')) { p += 10; issues.push({ severity: 'critical', impact: 'high', message: 'Viewport missing "width=device-width" — required for responsive display', element: 'meta[name="viewport"]', link: url, evidence: 'Current: "' + vp + '"', fix: 'Change to: <meta name="viewport" content="width=device-width, initial-scale=1">', steps: ['The "width=device-width" directive is essential for responsive design', 'Without it, the browser doesn\'t know to match the device width', 'Update your viewport tag to include width=device-width', 'If using a CMS, check your theme/template settings'] }); }
    if (vp.includes('user-scalable=no') || vp.includes('maximum-scale=1')) { p += 8; issues.push({ severity: 'warning', impact: 'high', message: 'Viewport blocks user zooming (user-scalable=no or maximum-scale=1) — accessibility violation, may hurt rankings', element: 'meta[name="viewport"]', link: url, evidence: 'Current: "' + vp + '"', fix: 'Remove user-scalable=no and maximum-scale from the viewport tag', steps: ['Blocking zoom is a WCAG 2.1 Level AA accessibility violation', 'Users with visual impairments cannot read your content', 'Google may penalize sites that block zooming on mobile', 'Remove "user-scalable=no" and "maximum-scale=1" from your viewport tag', 'Correct tag: <meta name="viewport" content="width=device-width, initial-scale=1">', 'Only block zoom if your site is a native app-like experience (rare)'] }); }
    if (!vp.includes('initial-scale=')) { p += 5; issues.push({ severity: 'warning', impact: 'medium', message: 'Viewport missing "initial-scale=1" — may cause zooming issues on mobile', element: 'meta[name="viewport"]', link: url }); }
    if (vp.includes('maximum-scale=') || vp.includes('user-scalable=no')) { p += 5; issues.push({ severity: 'warning', impact: 'medium', message: 'Viewport restricts user zoom — WCAG accessibility violation for visually impaired users', element: 'meta[name="viewport"]', link: url, evidence: 'Zoom restrictions detected', recommendation: 'Remove maximum-scale=1 and user-scalable=no to allow pinch-zoom' }); }
  }

  const robotsContent = ($('meta[name="robots"]').attr('content') || '').toLowerCase();
  data.robotsMeta = { raw: robotsContent, noindex: robotsContent.includes('noindex'), nofollow: robotsContent.includes('nofollow'), nosnippet: robotsContent.includes('nosnippet'), noimageindex: robotsContent.includes('noimageindex'), notranslate: robotsContent.includes('notranslate'), maxSnippet: (robotsContent.match(/max-snippet:(-?\d+)/) || [])[1] || null, maxVideoPreview: (robotsContent.match(/max-video-preview:(-?\d+)/) || [])[1] || null, maxImagePreview: (robotsContent.match(/max-image-preview:(large|standard|none)/) || [])[1] || null };
  if (robotsContent.includes('noindex')) { p += 30; issues.push({ severity: 'critical', impact: 'critical', message: 'NOINDEX directive found — this page is BLOCKED from Google index', element: 'meta[name="robots"]', selector: 'head > meta[name="robots"]', link: url, evidence: 'Content: "' + robotsContent + '"', fix: 'Remove noindex from meta robots tag or delete the tag entirely', steps: ['This page will NEVER appear in Google search results', 'Check if this is intentional (e.g., admin pages, thank-you pages)', 'If unintentional: Remove the <meta name="robots" content="noindex"> tag', 'Or change to: <meta name="robots" content="index, follow">', 'Also check server response headers for X-Robots-Tag: noindex', 'After fixing, submit the URL in Google Search Console for re-crawling', 'Indexing may take 1-14 days after removal of noindex'] }); }
  if (robotsContent.includes('nofollow')) { p += 10; issues.push({ severity: 'critical', impact: 'high', message: 'NOFOLLOW directive found — all link equity from this page is blocked', element: 'meta[name="robots"]', link: url, evidence: 'Content: "' + robotsContent + '"', fix: 'Remove nofollow unless linking to untrusted external pages', steps: ['nofollow tells Google not to pass any link equity through links on this page', 'This means your internal links and outbound links carry zero SEO value', 'Remove nofollow from the robots meta tag for most pages', 'Only use nofollow on user-generated content links (comments, forums)', 'Change to: <meta name="robots" content="index, follow">'] }); }
  if (robotsContent.includes('nosnippet')) { p += 8; issues.push({ severity: 'warning', impact: 'high', message: 'NOSNIPPET directive — Google will not show snippet/description in SERPs', element: 'meta[name="robots"]', link: url, fix: 'Remove nosnippet to allow Google to display a description in search results', steps: ['nosnippet prevents Google from showing any text snippet in search results', 'This reduces CTR as users can\'t preview your content', 'Remove nosnippet from the robots meta tag', 'Allow Google to auto-generate a snippet from your page content'] }); }

  const xRobots = (headers['x-robots-tag'] || '').toLowerCase();
  data.xRobotsTagHeader = { raw: headers['x-robots-tag'] || 'not set', noindex: xRobots.includes('noindex'), nofollow: xRobots.includes('nofollow'), nosnippet: xRobots.includes('nosnippet') };
  if (xRobots.includes('noindex')) { p += 25; issues.push({ severity: 'critical', impact: 'critical', message: 'X-Robots-Tag: noindex via HTTP header — overrides meta robots at server level', element: 'HTTP Header: X-Robots-Tag', link: url, evidence: 'Server header: X-Robots-Tag: ' + headers['x-robots-tag'], fix: 'Remove the X-Robots-Tag: noindex header from your server configuration', steps: ['This header is set at the server/CDN level, not in HTML', 'Check your server config files (.htaccess, nginx.conf, server.js)', 'In Apache: Remove "Header set X-Robots-Tag: noindex"', 'In Nginx: Remove "add_header X-Robots-Tag noindex"', 'In Node.js/Express: Remove res.setHeader("X-Robots-Tag", "noindex")', 'Check CDN settings (Cloudflare, AWS CloudFront, etc.)', 'After fixing, test with curl -I to verify the header is removed'] }); }

  const canon = analyzeCanonicalIntegrity($, url);
  data.canonical = canon;
  if (canon.issues.length > 0) {
    if (!canon.canonicalUrl) { p += 15; issues.push({ severity: 'critical', impact: 'high', message: 'No canonical tag — URL variants create duplicate content that dilutes ranking signals', element: 'link[rel="canonical"]', selector: 'head > link[rel="canonical"]', link: url, fix: '<link rel="canonical" href="' + url + '">', steps: ['Without a canonical, Google may index multiple versions of this page', 'URL variants: http/https, www/non-www, trailing slash, parameters', 'Add this to your <head>: <link rel="canonical" href="' + url + '">', 'The canonical URL should be the preferred, crawlable version', 'Use absolute URLs (not relative paths)', 'If using a CMS, enable canonical tags in your SEO plugin', 'Self-referencing canonicals (pointing to the same URL) are best practice'] }); }
    if (canon.multipleCanonicals) { p += 15; issues.push({ severity: 'critical', impact: 'high', message: 'Multiple canonical tags (' + $('link[rel="canonical"]').length + ') — search engines may ignore all', element: 'link[rel="canonical"]', link: url, evidence: $('link[rel="canonical"]').length + ' canonicals found', fix: 'Keep only ONE canonical tag per page pointing to the preferred URL', steps: ['Having multiple canonical tags confuses search engines', 'They may ignore ALL canonicals, treating the page as self-canonical', 'Remove duplicate canonical tags — keep only one', 'Check: theme templates, SEO plugins, and custom code for duplicates', 'The canonical URL should be the exact URL you want indexed'] }); }
  }

  const headingAnalysis = analyzeHeadingHierarchy($);
  data.headingHierarchy = headingAnalysis;
  if (headingAnalysis.hierarchyIssues.length > 0) {
    headingAnalysis.hierarchyIssues.forEach(hi => {
      if (hi.type === 'multiple-h1') { p += 10; issues.push({ severity: 'warning', impact: 'high', message: 'Multiple H1 tags (' + hi.count + ') — dilutes strongest topic signal', element: 'h1', link: url, evidence: hi.count + ' H1 tags', fix: 'Keep exactly one H1 per page. Convert extra H1s to H2s.', steps: ['Each page should have exactly one H1 tag for clear topic focus', 'Your page has ' + hi.count + ' H1 tags — Google may not understand the primary topic', 'Identify which H1 best represents the page\'s main topic', 'Convert all other H1 tags to H2 tags', 'Example: <h1>Main Topic</h1> → keep; <h1>Sub-topic</h1> → change to <h2>Sub-topic</h2>', 'The single H1 should contain your primary target keyword'] }); }
      else if (hi.type === 'missing-h1') { p += 20; issues.push({ severity: 'critical', impact: 'critical', message: 'No H1 tag — strongest on-page HTML signal for topic relevance is missing', element: 'h1', link: url, fix: '<h1>Your Primary Target Keyword Here</h1>', steps: ['The H1 tag is the most important on-page SEO signal', 'Add exactly one H1 tag near the top of your content area', 'The H1 should contain your primary target keyword', 'It should accurately describe what the page is about', 'Place it inside <main> or the primary content section', 'Don\'t hide the H1 in the footer or sidebar', 'Example: <h1>Best Running Shoes for Marathon Training 2026</h1>'] }); }
      else if (hi.type === 'skipped-level') { p += 3; issues.push({ severity: 'warning', impact: 'medium', message: 'Heading hierarchy skipped from H' + hi.from + ' to H' + hi.to + ' at "' + hi.text + '" — breaks document outline', element: 'heading', selector: hi.selector, link: url, evidence: 'H' + hi.from + ' to H' + hi.to + ' at "' + hi.text + '"', fix: 'Use sequential heading levels: H1 to H2 to H3. Never skip levels.', steps: ['Heading tags create a document outline for crawlers and screen readers', 'Skipping levels (e.g., H1 to H3) breaks this outline', 'Change the H' + hi.to + ' tag to H' + (hi.from + 1) + ' for proper hierarchy', 'Each heading level should logically nest under the previous one'] }); }
      else if (hi.type === 'empty-heading') { p += 3; issues.push({ severity: 'warning', impact: 'medium', message: 'Empty H' + hi.level + ' heading — no text content, confuses screen readers and crawlers', element: 'h' + hi.level, selector: hi.selector, link: url, fix: 'Add descriptive text content to the heading or remove the empty heading tag', steps: ['Empty headings provide no SEO value and confuse assistive technologies', 'Add meaningful text that describes the section content', 'Or remove the empty heading tag entirely', 'If used for styling, use a <div> or <span> with CSS instead'] }); }
    });
  }

  const media = analyzeMediaOptimization($);
  data.mediaOptimization = media;
  const imgsNoAlt = media.images.filter(i => !i.alt).length;
  const imgsNoDims = media.images.filter(i => !i.hasDimensions).length;
  const outdatedCount = media.images.filter(i => ['png', 'gif', 'bmp'].includes(i.format)).length;
  if (imgsNoAlt > 0) { p += Math.min(20, imgsNoAlt * 3); issues.push({ severity: 'critical', impact: 'high', message: imgsNoAlt + ' of ' + media.totalImages + ' images missing alt attribute — essential for accessibility and image SEO', element: 'img', link: url, evidence: 'Images without alt: ' + imgsNoAlt, fix: 'Add descriptive alt text to every image', steps: ['Alt text is required for WCAG 2.1 accessibility compliance', 'Google uses alt text to understand image content and rank in Image Search', 'For each image, add: <img src="..." alt="Descriptive text about the image">', 'Be specific: "Red Nike running shoe on white background" not "shoe image"', 'Decorative images: use alt="" (empty alt) to skip them', 'CMS users: Add alt text in the media library or image block settings', 'Aim for 125 characters or less for alt text'] }); }
  if (imgsNoDims > 0) { p += Math.min(10, imgsNoDims * 2); issues.push({ severity: 'warning', impact: 'high', message: imgsNoDims + ' images missing width/height attributes — causes Cumulative Layout Shift (CLS)', element: 'img', link: url, evidence: imgsNoDims + ' images lack dimensions', fix: 'Add width and height attributes matching the actual image dimensions', steps: ['Missing image dimensions cause layout shifts as images load', 'This increases your CLS score, a Core Web Vitals metric', 'Add width="X" height="Y" to each <img> tag', 'Use the actual pixel dimensions of the image file', 'Example: <img src="photo.jpg" width="800" height="600" alt="...">', 'Modern CSS can still override these for responsive sizing', 'CMS users: Check your theme\'s image output template'] }); }
  if (outdatedCount > 0) { p += Math.min(5, outdatedCount); issues.push({ severity: 'warning', impact: 'medium', message: outdatedCount + ' images use outdated formats (PNG/GIF) — use WebP/AVIF for 25-35% better compression', element: 'img', link: url, fix: 'Convert PNG/GIF images to WebP or AVIF format', steps: ['WebP/AVIF formats provide 25-35% better compression than PNG/JPG', 'Use tools like Squoosh.app, TinyPNG, or ImageOptim to convert', 'In HTML: <picture><source srcset="image.webp" type="image/webp"><img src="image.jpg" alt="..."></picture>', 'Most modern browsers support WebP (97%+ coverage)', 'AVIF offers even better compression but lower browser support (90%+)', 'CMS users: Install a WebP conversion plugin (e.g., ShortPixel, Imagify)'] }); }
  if (media.brokenSvgCount > 0) { p += 3; issues.push({ severity: 'info', impact: 'low', message: media.brokenSvgCount + ' inline SVGs with no accessible text or aria-label', element: 'svg', link: url }); }

  const lazyImages = media.images.filter(i => i.isLazy).length;
  const nonLazyCount = media.totalImages - lazyImages;
  if (nonLazyCount > 5) { p += Math.min(10, nonLazyCount * 1.5); issues.push({ severity: 'info', impact: 'medium', message: nonLazyCount + ' images without loading="lazy" — increase initial page load for below-fold images', element: 'img', link: url }); }

  const headersResult = analyzeHttpHeaders(headers);
  data.httpHeaders = headersResult;
  if (headersResult.statusCode >= 400) { p += 25; issues.push({ severity: 'critical', impact: 'critical', message: 'HTTP ' + headersResult.statusCode + ' error — page inaccessible to users and search engines', element: 'HTTP Status', link: url, evidence: 'Status code: ' + headersResult.statusCode, fix: 'Fix the server-side issue causing the ' + headersResult.statusCode + ' error', steps: ['HTTP ' + headersResult.statusCode + ' means the server could not serve this page', headersResult.statusCode === 404 ? 'The page URL doesn\'t exist — check for typos or create the page' : headersResult.statusCode === 503 ? 'Server is temporarily unavailable — check server health and restart if needed' : 'Check server logs for the root cause of this error', 'Verify the URL is correct and the page exists on the server', 'If using a CMS, check if the page is published (not in draft)', 'If recently moved, set up a 301 redirect from old URL to new URL', 'After fixing, test with: curl -I ' + url] }); }

  const links = analyzeInternalLinks($, url);
  data.internalLinks = links;
  if (links.deadFragments.length > 0) { p += Math.min(10, links.deadFragments.length * 3); issues.push({ severity: 'warning', impact: 'medium', message: links.deadFragments.length + ' dead hash fragment links (href="#" points to non-existent IDs) — wastes crawl budget', element: 'a[href^="#"]', link: url, evidence: 'Dead fragments: ' + links.deadFragments.slice(0, 3).map(d => d.href).join(', '), fix: 'Fix or remove broken hash fragment links', steps: ['Dead fragment links point to IDs that don\'t exist in the page', 'Check each broken link and either: add the missing ID, fix the href, or remove the link', 'Search your HTML for id="' + (links.deadFragments[0] || {}).href?.replace('#', '') + '" to verify', 'These broken links waste crawl budget and create poor UX'] }); }

  const perLinkAnalysis = [];
  $('a[href]').each((i, el) => {
    const la = analyzeLink($, el, url);
    perLinkAnalysis.push(la);
    if (la.isEmpty && !la.isHash && !la.isJavaScript) {
      p += 2; issues.push({ severity: 'warning', impact: 'medium', message: 'Link #' + (i + 1) + ' has no accessible text: href="' + la.href.substring(0, 60) + '" — screen readers cannot interpret this link', element: 'a', selector: la.selector, link: url, fix: 'Add visible text, aria-label, or an image with alt text inside the link', steps: ['Empty links are invisible to screen readers and waste crawl budget', 'Add descriptive text: <a href="...">Click here to learn more</a>', 'Or add aria-label: <a href="..." aria-label="Learn more about our products">', 'For icon-only links, add aria-label describing the link purpose'] });
    }
    if (la.isGeneric) {
      p += 1; issues.push({ severity: 'info', impact: 'low', message: 'Link "' + la.text.substring(0, 30) + '" uses generic anchor text — use descriptive text for SEO value', element: 'a', selector: la.selector, link: url, fix: 'Replace generic text with keyword-rich descriptive anchor text', steps: ['Generic text like "click here" or "read more" wastes link equity', 'Describe the destination: "Read our guide to technical SEO" instead of "click here"', 'Descriptive anchors help Google understand what the linked page is about'] });
    }
    if (la.target === '_blank' && !la.rel.includes('noopener')) {
      p += 2; issues.push({ severity: 'warning', impact: 'medium', message: 'Link to "' + la.href.substring(0, 40) + '" missing rel="noopener" with target="_blank" — security vulnerability', element: 'a', selector: la.selector, link: url, fix: 'Add rel="noopener noreferrer" to all target="_blank" links', steps: ['Links with target="_blank" can be exploited by the opened page', 'The new page can access window.opener and redirect your page', 'Add rel="noopener noreferrer" to prevent this', 'Example: <a href="..." target="_blank" rel="noopener noreferrer">', 'Most modern browsers add this automatically, but older browsers don\'t'] });
    }
  });
  data.perLinkAnalysis = { total: perLinkAnalysis.length, emptyLinks: perLinkAnalysis.filter(l => l.isEmpty).length, genericLinks: perLinkAnalysis.filter(l => l.isGeneric).length, noopenerMissing: perLinkAnalysis.filter(l => l.target === '_blank' && !l.rel.includes('noopener')).length };

  const perHeadingAnalysis = [];
  $('h1,h2,h3,h4,h5,h6').each((i, el) => {
    const ha = analyzeHeading($, el);
    perHeadingAnalysis.push(ha);
    if (ha.isEmpty) {
      p += 3; issues.push({ severity: 'warning', impact: 'medium', message: 'Empty H' + ha.level + ' heading — no text content, confuses screen readers and crawlers', element: 'h' + ha.level, selector: ha.selector, link: url });
    }
    if (ha.wordCount > 20) {
      p += 2; issues.push({ severity: 'info', impact: 'low', message: 'H' + ha.level + ' heading has ' + ha.wordCount + ' words (' + ha.textLen + ' chars) — consider keeping headings under 10 words', element: 'h' + ha.level, selector: ha.selector, link: url });
    }
  });
  data.perHeadingAnalysis = { total: perHeadingAnalysis.length, emptyHeadings: perHeadingAnalysis.filter(h => h.isEmpty).length, longHeadings: perHeadingAnalysis.filter(h => h.wordCount > 20).length, headingsWithLinks: perHeadingAnalysis.filter(h => h.hasLinks).length };

  const bodyText = getTextContent($);
  const wordCount = countWords(bodyText);
  const linkDensity = wordCount > 0 ? (links.internalCount / wordCount * 100).toFixed(2) : 0;
  data.linkDensity = linkDensity + '%';
  if (links.nofollowCount > links.total * 0.5 && links.total > 5) { p += 5; issues.push({ severity: 'warning', impact: 'medium', message: links.nofollowCount + '/' + links.total + ' links are nofollow/sponsored/ugc — high ratio may limit PageRank flow', element: 'link rel', link: url }); }

  data.headingDetail = perHeadingAnalysis;

  return { level: 1, name: 'Core Hygiene & Technical Baseline', score: sc(p), issues, data };
  } catch (e) { return { level: 1, name: 'Core Hygiene & Technical Baseline', score: 0, issues: [{ severity: 'critical', impact: 'critical', message: 'Level 1 analysis failed: ' + e.message, element: 'system', link: url }], data: { error: e.message } }; }
}

function level2($, rawHtml, renderedHtml, perf) {
  try {
  const issues = [];
  let p = 0;
  const subfunctions = {};
  const data = subfunctions;

  const ssrDiff = ssrVsCsrDiff(rawHtml, renderedHtml);
  data.ssrVsCsr = ssrDiff;
  if (ssrDiff.ssrRatio < 0.5) { p += 20; issues.push({ severity: 'critical', impact: 'critical', message: 'Client-side rendering detected — content added after JS execution (' + ssrDiff.jsDependentCount + ' words JS-only). Googlebot may not execute all JS, potentially missing critical content.', element: 'JavaScript rendering', link: '', evidence: 'SSR ratio: ' + ssrDiff.ssrRatio + '. Raw HTML: ' + ssrDiff.rawTextLength + ' chars vs Rendered: ' + ssrDiff.renderedTextLength + ' chars', fix: 'Implement Server-Side Rendering (SSR) or Static Site Generation (SSG)', steps: ['Your page relies heavily on JavaScript to render content', 'Googlebot CAN execute JavaScript but with delays and limitations', 'Content in raw HTML is guaranteed to be indexed; JS-rendered content may not be', 'For React: Use Next.js for SSR/SSG, or Gatsby for static generation', 'For Vue: Use Nuxt.js for SSR/SSG', 'For Angular: Use Angular Universal for SSR', 'For static sites: Pre-render critical pages at build time', 'If SSR is not possible: Ensure critical content (title, meta, headings) is in raw HTML'] }); }
  else if (ssrDiff.ssrRatio < 0.85) { p += 10; issues.push({ severity: 'warning', impact: 'high', message: 'Hybrid rendering with significant JS content (' + ssrDiff.jsDependentCount + ' JS-only words) — SSR ratio: ' + ssrDiff.ssrRatio + '. Some content may be missed by crawlers.', element: 'JavaScript rendering', link: '', evidence: 'SSR ratio: ' + ssrDiff.ssrRatio, fix: 'Move critical content to server-rendered HTML', steps: ['Your page partially renders on the server but relies on JS for important content', 'Identify which content is JS-only: compare raw HTML vs rendered HTML', 'Move critical SEO content (headings, product info, article text) to server-rendered HTML', 'Keep interactive features (filters, forms) as client-side rendered'] }); }
  if (ssrDiff.missingFromRaw.length > 0) { p += 5; issues.push({ severity: 'warning', impact: 'medium', message: ssrDiff.missingFromRaw.length + ' element types only present after JS execution — including ' + ssrDiff.missingFromRaw.slice(0, 3).map(m => m.tag).join(', '), element: 'SSR elements', link: '', evidence: 'Elements: ' + ssrDiff.missingFromRaw.map(m => m.tag + ' (' + m.count + ')').join(', '), fix: 'Ensure these elements exist in the raw HTML for guaranteed indexing', steps: ['These HTML elements only appear after JavaScript runs', 'Googlebot may not always execute JavaScript on every crawl', 'Move important elements to the server-rendered HTML', 'Check your template/component files for the missing elements'] }); }

  const dom = analyzeDomDepth($);
  data.domDepth = dom;
  if (dom.nodeCount > 1500) { p += 10; issues.push({ severity: 'warning', impact: 'high', message: 'DOM is very large: ' + dom.nodeCount + ' nodes — increases memory usage, slows rendering, hurts Core Web Vitals (TBT/FID)', element: 'DOM structure', link: '', evidence: dom.nodeCount + ' DOM nodes. Recommended: < 800', fix: 'Simplify DOM: remove unused wrappers, use semantic HTML, reduce nesting', steps: ['A large DOM tree increases memory usage and slows rendering', 'Google recommends under 800 DOM nodes for optimal performance', 'Your page has ' + dom.nodeCount + ' nodes — consider:', '1. Remove unused HTML elements and wrapper divs', '2. Use semantic HTML (<article>, <section>, <nav>) instead of nested divs', '3. Lazy-load off-screen content instead of rendering it all upfront', '4. Use Chrome DevTools > Elements panel to identify bloated sections', '5. Consider virtual scrolling for long lists'] }); }
  if (dom.maxDepth > 32) { p += 8; issues.push({ severity: 'warning', impact: 'high', message: 'DOM nesting depth of ' + dom.maxDepth + ' levels exceeds 32-level limit — causes layout thrashing and slow re-paints', element: 'DOM depth', link: '', evidence: 'Max depth: ' + dom.maxDepth + ' levels', fix: 'Flatten DOM structure to under 20 nesting levels', steps: ['Deeply nested DOM causes slow style calculations and layout reflows', 'Your page nests ' + dom.maxDepth + ' levels deep — aim for under 20', 'Common causes: CSS-in-JS wrapper components, nested grid/flex containers', 'Flatten by removing unnecessary wrapper divs', 'Use CSS Grid/Flexbox for layout instead of nested containers', 'Check Chrome DevTools > Performance > Rendering for layout thrashing'] }); }

  const schema = validateSchemaComprehensive($);
  data.schemaValidation = { validCount: schema.validCount, invalidCount: schema.invalidCount, total: schema.schemas.length, types: schema.schemas.filter(s => s.valid).map(s => s.type), missingRequired: schema.missingRequired, circularRefs: schema.circularRefs, warnings: schema.warnings };
  if (schema.invalidCount > 0) { p += 12; issues.push({ severity: 'critical', impact: 'high', message: schema.invalidCount + ' invalid JSON-LD schema(s) — ' + schema.missingRequired.slice(0, 3).map(m => m.schemaType + ': ' + m.field).join('; '), element: 'JSON-LD structured data', link: '', evidence: schema.missingRequired.map(m => m.schemaType + ' missing ' + m.field).join(', '), fix: 'Fix required fields and validate at https://validator.schema.org', steps: ['Invalid structured data won\'t trigger rich results in Google Search', 'Missing required fields break the schema completely', 'For each invalid schema:', '1. Open the JSON-LD block in your HTML', '2. Add the missing required fields: ' + schema.missingRequired.slice(0, 3).map(m => m.field).join(', '), '3. Validate at https://validator.schema.org/', '4. Test with Google Rich Results Test: https://search.google.com/test/rich-results', '5. Deploy and monitor in Google Search Console > Enhancements'] }); }
  if (schema.schemas.filter(s => s.valid).length === 0) { p += 8; issues.push({ severity: 'warning', impact: 'high', message: 'No valid structured data found — missing rich result opportunities that significantly increase CTR', element: 'structured data', link: '', fix: 'Add at minimum: Organization, WebSite, and page-type specific schemas', steps: ['Structured data enables rich results (stars, FAQs, how-tos, etc.) in Google', 'Rich results can improve visibility and CTR in eligible queries', 'Add these essential schemas:', '1. Organization schema (brand name, logo, social profiles)', '2. WebSite schema (site name, search action)', '3. BreadcrumbList schema (navigation path)', '4. Page-type specific: Article, Product, FAQ, HowTo, LocalBusiness', 'Validate at: https://validator.schema.org/'] }); }

  const idMap = {};
  $('[id]').each((i, el) => {
    const id = $(el).attr('id');
    if (id) { if (!idMap[id]) idMap[id] = []; idMap[id].push({ selector: sel($, el), tag: (el.tagName || '').toLowerCase() }); }
  });
  const duplicateIds = Object.entries(idMap).filter(([, v]) => v.length > 1);
  data.duplicateIDs = { count: duplicateIds.length, details: duplicateIds.slice(0, 10).map(([k, v]) => ({ id: k, occurrences: v.length, elements: v })) };
  if (duplicateIds.length > 0) { p += Math.min(5, duplicateIds.length * 3); issues.push({ severity: 'warning', impact: 'medium', message: duplicateIds.length + ' duplicate ID(s): ' + duplicateIds.slice(0, 5).map(([k, v]) => '"' + k + '" (' + v.length + 'x)').join(', ') + ' — breaks CSS targeting and JS getElementById()', element: 'HTML IDs', link: '', evidence: duplicateIds.length + ' IDs used multiple times', recommendation: 'IDs must be unique — use classes for repeated styles' }); }

  const cwvMetrics = {};
  if (perf) {
    if (perf.ttfb !== undefined) cwvMetrics.ttfv = perf.ttfb;
    if (perf.lcp) cwvMetrics.lcp = perf.lcp;
    if (perf.fid) cwvMetrics.fid = perf.fid;
    if (perf.cls) cwvMetrics.cls = perf.cls;
    if (perf.inp) cwvMetrics.inp = perf.inp;
    if (perf.fcp) cwvMetrics.fcp = perf.fcp;
    if (perf.si) cwvMetrics.si = perf.si;
    if (perf.tbt) cwvMetrics.tbt = perf.tbt;
  }
  data.measuredTimings = perf || {};
  const cwv = analyzeCoreWebVitals(cwvMetrics);
  data.coreWebVitals = cwv;

  let lcpElement = '';
  let lcpCandidate = null;
  $('img, video, p, h1, h2, h3, div, section').each((i, el) => {
    const tag = (el.tagName || '').toLowerCase();
    const text = $(el).text().trim();
    const src = $(el).attr('src') || '';
    const dims = { w: $(el).attr('width'), h: $(el).attr('height') };
    const score = tag === 'img' ? text.length + (src ? 50 : 0) : tag === 'video' ? 40 : ['h1', 'h2', 'h3'].includes(tag) ? text.length * 2 : text.length;
    if (!lcpCandidate || score > lcpCandidate.score) { lcpCandidate = { tag, text: text.substring(0, 50), src: src.substring(0, 100), selector: sel($, el), score, hasDimensions: !!(dims.w && dims.h) }; }
  });
  data.lcpElement = lcpCandidate;
  if (lcpCandidate && !lcpCandidate.hasDimensions && lcpCandidate.tag === 'img') { p += 5; issues.push({ severity: 'warning', impact: 'high', message: 'Potential LCP element (img: "' + lcpCandidate.src.substring(0, 40) + '") lacks explicit dimensions — causes CLS', element: lcpCandidate.tag, selector: lcpCandidate.selector, link: '', recommendation: 'Add width/height to this image to prevent layout shift' }); }

  if (cwv.measuredCount > 0 && cwv.verdict === 'fail') { p += 15; issues.push({ severity: 'warning', impact: 'high', message: 'Core Web Vitals assessment: FAIL — ' + cwv.failedTests.join(', ') + ' failing. Poor CWV directly impacts rankings under Google\'s page experience update.', element: 'Core Web Vitals', link: '', evidence: 'Failed: ' + cwv.failedTests.join(', ') + '. Score: ' + cwv.score }); }
  if (cwv.measuredCount > 0 && cwv.verdict === 'needs-improvement') { p += 8; issues.push({ severity: 'warning', impact: 'medium', message: 'Core Web Vitals assessment: NEEDS IMPROVEMENT — ' + cwv.failedTests.join(', ') + ' below the "good" threshold.', element: 'Core Web Vitals', link: '', evidence: 'Needs improvement: ' + cwv.failedTests.join(', ') + '. Score: ' + cwv.score }); }

  const resourceCounts = { scripts: $('script[src]').length, inlineScripts: $('script:not([src])').length, stylesheets: $('link[rel="stylesheet"]').length, images: $('img').length, iframes: $('iframe').length };
  const renderBlocking = [];
  $('link[rel="stylesheet"]').each((i, el) => {
    const media = $(el).attr('media') || 'all';
    const href = $(el).attr('href');
    if ((media === 'all' || media === 'screen') && href) renderBlocking.push({ type: 'css', url: href });
  });
  $('script[src]').each((i, el) => {
    const src = $(el).attr('src');
    if (!$(el).attr('async') && !$(el).attr('defer') && src) renderBlocking.push({ type: 'js', url: src });
  });
  const asyncDefer = $('script[src][async]').length + $('script[src][defer]').length;
  data.resourceSummary = { ...resourceCounts, renderBlocking: { total: renderBlocking.length, css: renderBlocking.filter(r => r.type === 'css').length, js: renderBlocking.filter(r => r.type === 'js').length, resources: renderBlocking.slice(0, 10) }, asyncDeferCount: asyncDefer, optimizedRatio: resourceCounts.scripts > 0 ? (asyncDefer / resourceCounts.scripts * 100).toFixed(0) + '%' : 'N/A' };
  if (renderBlocking.length > 3) { p += 8; issues.push({ severity: 'warning', impact: 'high', message: renderBlocking.length + ' render-blocking resources (' + renderBlocking.filter(r => r.type === 'css').length + ' CSS, ' + renderBlocking.filter(r => r.type === 'js').length + ' JS) — delays First Contentful Paint (FCP)', element: 'render-blocking', link: '', evidence: 'Blocking: ' + renderBlocking.slice(0, 5).map(r => r.url).join(', '), recommendation: 'Add defer/async to non-critical scripts, inline critical CSS' }); }
  if (resourceCounts.scripts > 15) { p += 3; issues.push({ severity: 'info', impact: 'low', message: resourceCounts.scripts + ' external scripts — high script count increases network contention and parse time', element: 'scripts', link: '', recommendation: 'Consolidate and tree-shake JavaScript bundles' }); }

  const inlineStyleAnalysis = [];
  $('[style]').each((i, el) => {
    if (i > 50) return;
    const sa = analyzeInlineStyles($, el);
    if (sa.hasImportant) {
      p += 1;
      inlineStyleAnalysis.push({ tag: (el.tagName || '').toLowerCase(), selector: sel($, el), hasImportant: true, properties: Object.keys(sa.properties).length });
    }
  });
  const importantCount = inlineStyleAnalysis.filter(s => s.hasImportant).length;
  data.inlineStyleAudit = { totalElementsWithStyle: $('[style]').length, elementsWithImportant: importantCount, details: inlineStyleAnalysis.slice(0, 20) };
  if (importantCount > 5) { p += 4; issues.push({ severity: 'info', impact: 'medium', message: importantCount + ' elements use !important in inline styles — overrides cascade, makes CSS maintenance harder and increases specificity wars', element: 'inline styles', link: '', recommendation: 'Move !important styles to CSS classes and use proper cascade' }); }

  const rawHtmlClean = stripHtml(rawHtml);
  const rawTextLen = rawHtmlClean.length;
  const renderedTextLen = getTextContent($).length;
  data.htmlNoiseRatio = rawTextLen > 0 ? Math.round((renderedTextLen / rawTextLen) * 100) + '%' : '0%';

  return { level: 2, name: 'DOM Reality, Rendering & Structural Diagnostics', score: sc(p), issues, data };
  } catch (e) { return { level: 2, name: 'DOM Reality, Rendering & Structural Diagnostics', score: 0, issues: [{ severity: 'critical', impact: 'critical', message: 'Level 2 analysis failed: ' + e.message, element: 'system' }], data: { error: e.message } }; }
}

function level3($, bodyText, url, config) {
  try {
  const cfg = config || {};
  const issues = [];
  let p = 0;
  const subfunctions = {};
  const data = subfunctions;
  const targetKeywords = (cfg.keywords || '').split(',').map(k => k.trim()).filter(k => k.length > 0);

  const wc = countWords(bodyText);
  const sentences = bodyText.split(/[.!?]+/).filter(s => s.trim().length > 5);
  const paragraphs = bodyText.split(/\n\s*\n/).filter(x => x.trim().length > 10);
  const sentenceCount = sentences.length;
  const paragraphCount = paragraphs.length;

  data.contentVolume = {
    wordCount: wc, sentenceCount, paragraphCount,
    avgWordsPerSentence: sentenceCount > 0 ? (wc / sentenceCount).toFixed(1) : '0',
    avgWordsPerParagraph: paragraphCount > 0 ? (wc / paragraphCount).toFixed(1) : '0',
    benchmarks: { thin: 300, low: 800, adequate: 1500, competitive: 2500 },
    volumeRating: wc >= 2500 ? 'comprehensive' : wc >= 1500 ? 'adequate' : wc >= 800 ? 'low' : wc >= 300 ? 'thin' : 'critical-thin'
  };

  if (wc < 300) { p += 25; issues.push({ severity: 'critical', impact: 'critical', message: 'Very thin content: only ' + wc + ' words — pages under 300 words rarely rank competitively', element: 'page content', link: '', evidence: wc + ' words (target: 1,500+)', recommendation: 'Expand to at least 1,500+ words with original research, examples, and detailed explanations' }); }
  else if (wc < 800) { p += 10; issues.push({ severity: 'warning', impact: 'high', message: 'Content may be thin (' + wc + ' words) — pages under ~800 words generally lack the depth needed to cover a topic comprehensively', element: 'page content', link: '', evidence: wc + ' words; benchmark is a heuristic, not a guarantee of ranking', recommendation: 'Add 700+ more words covering subtopics and user questions' }); }
  else if (wc < 1500) { p += 4; issues.push({ severity: 'info', impact: 'medium', message: 'Content length (' + wc + ' words) is on the shorter side — expand if competitors in this niche publish longer, more detailed content', element: 'page content', link: '' }); }

  const entities = extractKnowledgeGraphEntities(bodyText);
  data.knowledgeGraphEntities = { total: entities.length, entities: entities.slice(0, 20), topTypes: [...new Set(entities.slice(0, 10).map(e => e.type))] };

  const infoGain = calculateInformationGain(bodyText);
  data.informationGain = infoGain;
  if (infoGain.noveltyRatio && parseFloat(infoGain.noveltyRatio) < 15) { p += 8; issues.push({ severity: 'warning', impact: 'high', message: 'Low information gain — only ' + infoGain.noveltyRatio + ' novel content. Page may be redundant with competitors.', element: 'content originality', link: '', evidence: 'Novelty ratio: ' + infoGain.noveltyRatio + ', KL divergence: ' + infoGain.klDivergence, recommendation: 'Add unique data points, original research, and fresh perspectives' }); }
  if (infoGain.novelTerms && infoGain.novelTerms.length > 0) { data.novelTerms = infoGain.novelTerms.slice(0, 10); }

  const uniqueDataPoints = (bodyText.match(/\d+\.?\d*%/g) || []).length + (bodyText.match(/[\$\€\£\¥]\s?\d+(\.\d+)?/g) || []).length + (bodyText.match(/\d{4}-\d{2}-\d{2}/g) || []).length;
  data.uniqueDataPoints = { percentages: (bodyText.match(/\d+\.?\d*%/g) || []).length, monetary: (bodyText.match(/[\$\€\£\¥]\s?\d+(\.\d+)?/g) || []).length, dates: (bodyText.match(/\d{4}-\d{2}-\d{2}/g) || []).length, total: uniqueDataPoints };

  const nlp = analyzeNLP(bodyText);
  data.nlp = nlp;
  data.lexicalRichness = { uniqueWords: nlp.uniqueWords, lexicalDiversity: nlp.lexicalDiversity, longWordPct: nlp.longWordPercentage, avgWordLength: nlp.avgWordLength };
  const lexDiv = parseFloat(nlp.lexicalDiversity);
  if (lexDiv < 30 && wc > 200) { p += 5; issues.push({ severity: 'info', impact: 'medium', message: 'Low lexical diversity (' + nlp.lexicalDiversity + ') — repetitive vocabulary may reduce content quality perception', element: 'vocabulary', link: '', recommendation: 'Use synonyms and varied vocabulary to improve lexical diversity' }); }

  const readability = analyzeReadabilityAdvanced(bodyText);
  data.readability = readability;
  if (readability.fleschKincaidGrade > 16) { p += 5; issues.push({ severity: 'warning', impact: 'medium', message: 'Content is very complex (Flesch-Kincaid grade: ' + readability.fleschKincaidGrade + ', reading level: ' + readability.readabilityLevel + '). Most web users read at 6th-8th grade level.', element: 'readability', link: '', evidence: 'FK grade: ' + readability.fleschKincaidGrade + ', SMOG: ' + readability.smog + ', target: 6th-8th grade', recommendation: 'Simplify sentences: use shorter words, shorter sentences (15-20 words avg), active voice' }); }
  else if (readability.fleschKincaidGrade > 12) { p += 3; issues.push({ severity: 'info', impact: 'medium', message: 'Content is fairly complex (reading level: ' + readability.readabilityLevel + ') — consider simplifying for broader audience', element: 'readability', link: '' }); }
  data.readabilityLevels = { fleschKincaid: readability.fleschKincaidGrade, colemanLiau: readability.colemanLiau, ari: readability.ari, smog: readability.smog, avgGrade: readability.avgGradeLevel, readingTime: readability.readingTime };

  const fkScore = fleschKincaid(bodyText);
  const wordsForSyllables = bodyText.split(/\s+/).filter(w => w.length > 0);
  const syllableCounts = wordsForSyllables.slice(0, 100).map(w => countSyllables(w));
  const avgSyllablesPerWord = syllableCounts.length > 0 ? (syllableCounts.reduce((a, b) => a + b, 0) / syllableCounts.length).toFixed(1) : 0;
  const hardWords = wordsForSyllables.filter(w => countSyllables(w) >= 3).length;
  const hardWordRatio = wordsForSyllables.length > 0 ? Math.round((hardWords / wordsForSyllables.length) * 100) + '%' : '0%';
  data.detailedReadability = { fkReadingEase: Math.round(fkScore * 10) / 10, avgSyllablesPerWord, hardWordCount: hardWords, hardWordRatio };

  const passiveVoice = (bodyText.match(/\b(is|are|was|were|been|being|be|am)\s+(\w+ed|being\s+\w+ed)\b/gi) || []).length;
  const passivePct = sentenceCount > 0 ? (passiveVoice / sentenceCount * 100) : 0;
  data.passiveVoice = { count: passiveVoice, percentage: passivePct.toFixed(1) + '%', target: '< 10%' };
  if (passivePct > 15) { p += 5; issues.push({ severity: 'warning', impact: 'medium', message: 'Excessive passive voice: ' + passivePct.toFixed(1) + '% of sentences — active voice is more engaging', element: 'writing style', link: '', evidence: passiveVoice + ' passive constructions', recommendation: 'Rewrite passive constructions in active voice' }); }

  const headingQualityAnalysis = [];
  $('h1,h2,h3,h4,h5,h6').each((i, el) => {
    const ha = analyzeHeading($, el);
    headingQualityAnalysis.push(ha);
    if (ha.isEmpty) { p += 2; issues.push({ severity: 'warning', impact: 'medium', message: 'Empty H' + ha.level + ' heading — provides no semantic value', element: 'h' + ha.level, selector: ha.selector, link: '' }); }
    if (ha.textLen > 150) { p += 1; issues.push({ severity: 'info', impact: 'low', message: 'H' + ha.level + ' heading is ' + ha.textLen + ' chars (' + ha.wordCount + ' words) — overly long heading dilutes topic signal', element: 'h' + ha.level, selector: ha.selector, link: '' }); }
    if (ha.hasImages) { p += 1; issues.push({ severity: 'info', impact: 'low', message: 'H' + ha.level + ' heading contains images — headings should use text for crawler readability', element: 'h' + ha.level, selector: ha.selector, link: '' }); }
  });
  data.headingQuality = { total: headingQualityAnalysis.length, empty: headingQualityAnalysis.filter(h => h.isEmpty).length, long: headingQualityAnalysis.filter(h => h.textLen > 150).length, hasImages: headingQualityAnalysis.filter(h => h.hasImages).length, details: headingQualityAnalysis.slice(0, 20) };

  const kwDensity = analyzeKeywordDensity(bodyText, 20);
  data.keywordDensity = kwDensity;

  if (targetKeywords.length > 0) {
    const targetKwAnalysis = targetKeywords.map(kw => {
      const kwLower = kw.toLowerCase();
      const textLower = bodyText.toLowerCase();
      const titleText = ($('title').first().text() || '').toLowerCase();
      const h1Text = ($('h1').first().text() || '').toLowerCase();
      const metaDesc = ($('meta[name="description"]').attr('content') || '').toLowerCase();
      const headings = []; $('h1,h2,h3').each((i, el) => { headings.push($(el).text().toLowerCase()); });
      const bodyMentions = (textLower.match(new RegExp(kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      const titlePresent = titleText.includes(kwLower);
      const h1Present = h1Text.includes(kwLower);
      const descPresent = metaDesc.includes(kwLower);
      const headingPresent = headings.some(h => h.includes(kwLower));
      const firstOccurrence = textLower.indexOf(kwLower);
      const wordCount = bodyText.split(/\s+/).filter(w => w).length;
      const density = wordCount > 0 ? ((bodyMentions * kw.split(/\s+/).length / wordCount) * 100).toFixed(2) + '%' : '0%';
      const inFirst100Words = firstOccurrence >= 0 && firstOccurrence < bodyText.split(/\s+/).slice(0, 100).join(' ').length;
      return { keyword: kw, bodyMentions, titlePresent, h1Present, descPresent, headingPresent, density, inFirst100Words, coverage: [titlePresent, h1Present, descPresent, headingPresent].filter(Boolean).length + '/4 key locations' };
    });
    data.targetKeywordAnalysis = targetKwAnalysis;
    targetKwAnalysis.forEach(tka => {
      if (tka.bodyMentions === 0) { p += 8; issues.push({ severity: 'critical', impact: 'high', message: 'Target keyword "' + tka.keyword + '" not found anywhere in body content — page will not rank for this term', element: 'content', link: url, recommendation: 'Naturally incorporate "' + tka.keyword + '" into the body text 3-5 times' }); }
      else if (tka.bodyMentions < 2) { p += 3; issues.push({ severity: 'warning', impact: 'medium', message: 'Target keyword "' + tka.keyword + '" appears only ' + tka.bodyMentions + ' time(s) — consider adding 2-3 more natural mentions', element: 'content', link: url }); }
      if (!tka.titlePresent) { p += 4; issues.push({ severity: 'warning', impact: 'high', message: 'Target keyword "' + tka.keyword + '" missing from title tag — title is the strongest on-page ranking signal', element: 'title', link: url, recommendation: 'Include "' + tka.keyword + '" in the title tag' }); }
      if (!tka.h1Present) { p += 3; issues.push({ severity: 'warning', impact: 'medium', message: 'Target keyword "' + tka.keyword + '" missing from H1 heading', element: 'h1', link: url }); }
      if (!tka.inFirst100Words && tka.bodyMentions > 0) { p += 2; issues.push({ severity: 'info', impact: 'low', message: 'Target keyword "' + tka.keyword + '" first appears after the first 100 words — front-load keywords for stronger signals', element: 'content', link: url }); }
    });
  }

  if (kwDensity.length > 0) {
    const topKwd = kwDensity[0];
    const densityNum = parseFloat(topKwd.density);
    if (densityNum > 5) { p += 15; issues.push({ severity: 'critical', impact: 'critical', message: 'Very high keyword density: "' + topKwd.word + '" at ' + topKwd.density + ' density (' + topKwd.count + 'x) — reads as keyword stuffing, which search engines may treat as spam', element: 'keyword density', link: '', evidence: '"' + topKwd.word + '" at ' + topKwd.density + ' (common guidance: keep under 3%)', recommendation: 'Use synonyms and natural language instead of repeating keywords' }); }
    else if (densityNum > 3) { p += 10; issues.push({ severity: 'warning', impact: 'high', message: 'High keyword density for "' + topKwd.word + '": ' + topKwd.density + ' — commonly flagged as over-optimized above ~3%; vary phrasing naturally', element: 'keyword density', link: '' }); }
  }

  const bigrams = analyzeBigrams(bodyText, 10);
  data.bigrams = bigrams;

  const aiDetect = detectAIPatterns(bodyText);
  data.aiDetection = aiDetect;
  if (aiDetect.score > 50) { p += 10; issues.push({ severity: 'warning', impact: 'high', message: 'AI-generated content patterns detected (score: ' + aiDetect.score + '/100) — Google Helpful Content Update targets AI text without original value', element: 'content authenticity', link: '', evidence: 'AI patterns: ' + aiDetect.matches.slice(0, 5).map(m => m.pattern + ' (' + m.count + 'x)').join(', '), recommendation: 'Add personal experience, original data, unique research, expert opinions' }); }
  else if (aiDetect.score > 20) { p += 3; issues.push({ severity: 'info', impact: 'medium', message: 'Some AI-like content patterns (score: ' + aiDetect.score + '/100) — review flagged sections', element: 'content authenticity', link: '' }); }

  const anchorContext = analyzeAnchorTextContext($);
  data.anchorTextContext = anchorContext;
  const genericRatio = anchorContext.totalAnchors > 0 ? (anchorContext.genericAnchors / anchorContext.totalAnchors * 100).toFixed(1) + '%' : 'N/A';
  data.genericAnchorRatio = genericRatio;
  if (anchorContext.genericAnchors > anchorContext.totalAnchors * 0.3 && anchorContext.totalAnchors > 3) { p += 5; issues.push({ severity: 'warning', impact: 'medium', message: anchorContext.genericAnchors + '/' + anchorContext.totalAnchors + ' links are generic ("click here", "read more") — misses keyword-rich internal linking', element: 'a[href]', link: '', recommendation: 'Use descriptive anchor text (2-6 words) describing the target page' }); }

  const contentStruct = analyzeContentStructure(bodyText);
  data.contentStructure = contentStruct;
  if (contentStruct.paragraphs > 0 && contentStruct.avgParagraphLength > 8) { p += 3; issues.push({ severity: 'info', impact: 'low', message: 'Average paragraph length is ' + contentStruct.avgParagraphLength + ' sentences — consider shorter paragraphs (3-5 sentences) for readability', element: 'paragraphs', link: '' }); }

  const transitions = analyzeTransitionWords(bodyText);
  data.transitionWords = transitions;
  const transitionScore = transitions.total > wc * 0.02 ? 'good' : transitions.total > wc * 0.01 ? 'moderate' : 'low';
  data.transitionCoverage = { total: transitions.total, categories: Object.keys(transitions.transitions).length, score: transitionScore };
  if (transitionScore === 'low' && wc > 300) { p += 3; issues.push({ severity: 'info', impact: 'low', message: 'Low transition word coverage (' + transitions.total + ' total) — content may lack flow and cohesion', element: 'transition words', link: '', recommendation: 'Add transition words for addition, contrast, cause, sequence, and conclusion' }); }

  return { level: 3, name: 'Semantic Architecture, Entities & Information Gain', score: sc(p), issues, data };
  } catch (e) { return { level: 3, name: 'Semantic Architecture, Entities & Information Gain', score: 0, issues: [{ severity: 'critical', impact: 'critical', message: 'Level 3 analysis failed: ' + e.message, element: 'system' }], data: { error: e.message } }; }
}

function level4($, bodyText, url) {
  try {
  const issues = [];
  let p = 0;
  const subfunctions = {};
  const data = subfunctions;
  const wc = countWords(bodyText);

  const rag = ragChunkSimulator(bodyText);
  data.ragChunks = rag;
  const selfContainedPct = rag.totalChunks > 0 ? rag.retrievabilityScores.filter(c => c.retrievabilityScore >= 60).length / rag.totalChunks * 100 : 0;
  data.ragSelfContainedPct = selfContainedPct.toFixed(1) + '%';
  data.ragAvgRetrievability = rag.avgRetrievabilityScore;
  if (selfContainedPct < 50 && rag.totalChunks > 2) { p += 10; issues.push({ severity: 'warning', impact: 'high', message: Math.round(100 - selfContainedPct) + '% of chunks have poor retrievability — AI systems (LLMs, RAG) will lose context when extracting passages', element: 'content chunks', link: '', evidence: 'Avg retrievability: ' + rag.avgRetrievabilityScore + '/100, Self-contained: ' + selfContainedPct.toFixed(0) + '%', recommendation: 'Each paragraph should be self-contained: topic sentence + supporting details. Don\'t rely on previous paragraphs.' }); }
  const lowRetrievalChunks = rag.retrievabilityScores.filter(c => c.retrievabilityScore < 50);
  if (lowRetrievalChunks.length > 0) { data.lowRetrievalChunks = lowRetrievalChunks.slice(0, 5); }

  const daScore = directAnswerScorer('', bodyText);
  data.directAnswer = daScore;
  if (!daScore.hasDirectAnswer) { p += 8; issues.push({ severity: 'warning', impact: 'high', message: 'No high-confidence direct answer sections found — AI search engines (Google AI Overviews, Bing Chat) prefer concise extractable answers', element: 'content format', link: '', evidence: 'Direct Answer Score: ' + daScore.directAnswerScore + '/100 (no real user query supplied — structural Q&A/definition/list/table signals only)', recommendation: 'Add concise Q&A pairs, definition sentences ("X is Y"), numbered steps, and comparison tables' }); }
  if (daScore.listCandidates.length > 0 || daScore.tableCandidates.length > 0) { data.structuredAnswerCandidates = { lists: daScore.listCandidates.slice(0, 3), tables: daScore.tableCandidates.slice(0, 5) }; }

  const citationScore = simulateLLMCitation(bodyText, '');
  data.llmCitation = citationScore;
  data.llmCitationConfidence = citationScore.llmConfidence;
  if (citationScore.llmConfidence === 'low') { p += 5; issues.push({ severity: 'info', impact: 'medium', message: 'Low extractable-fact density (' + citationScore.avgCitationScore + '/100 avg) — the page has few statistics, data points, quotes, or authoritative references an LLM could cite (no real LLM inference performed; score is a structural heuristic)', element: 'content authority', link: '', evidence: 'Avg citation score: ' + citationScore.avgCitationScore + ', extractable facts: ' + citationScore.totalExtractableFacts, recommendation: 'Add statistics, data points, quotes, and authoritative references to increase citation potential' }); }
  if (citationScore.topCitations.length > 0) { data.topCitationSections = citationScore.topCitations; }

  const questionPhrases = (bodyText.match(/\b(how|what|why|when|where|who|which|can|does|is|are|do|should|will|would|could|may|might)\b\s+[^?]+\?/gi) || []);
  const questionCount = questionPhrases.length;
  const longTailQuestions = (bodyText.match(/\b(how (to|do|can|does|is|are|would)|what (is|are|does|can|should|would)|why (does|do|is|are|would|should)|when (does|do|can|should)|where (can|does|is|are|do))\b/gi) || []);
  data.conversationalQueries = { totalQuestions: questionCount, longTailPatterns: longTailQuestions.length, examples: questionPhrases.slice(0, 10) };
  if (questionCount < 5 && wc > 500) { p += 5; issues.push({ severity: 'info', impact: 'medium', message: 'Only ' + questionCount + ' question-based phrases found — misses long-tail conversational search queries that drive AI Overviews and voice search', element: 'content', link: '', recommendation: 'Add FAQ sections with natural questions people search for (how to, what is, why does)' }); }

  const hasFAQSchema = false;
  $('script[type="application/ld+json"]').each((i, el) => {
    try { const d = JSON.parse($(el).html()); const arr = Array.isArray(d) ? d : [d]; arr.forEach(s => { if (s['@type'] === 'FAQPage') hasFAQSchema = true; }); } catch {}
  });
  const faqPatterns = bodyText.match(/(?:^|\n)\s*(?:What|How|Why|When|Where|Who|Can|Does|Is|Are|Do|Should|Will)\b[^?]+\?\s*\n/gmi);
  const faqLikeCount = faqPatterns ? faqPatterns.length : 0;
  const hasFaqContent = $('[class*="faq"], [class*="accordion"], dt, details').length > 0 || faqLikeCount > 2;
  data.faqAnalysis = { hasFAQSchema, faqLikeContentCount: faqLikeCount, hasFaqContent, recommended: !hasFAQSchema && hasFaqContent };
  if (hasFaqContent && !hasFAQSchema) { p += 5; issues.push({ severity: 'info', impact: 'medium', message: 'FAQ-like content found but no FAQPage JSON-LD schema — missing rich result opportunity for FAQ rich snippets in SERPs', element: 'FAQ', link: '', evidence: 'FAQ content patterns: ' + faqLikeCount + ', FAQPage schema: absent', recommendation: 'Add FAQPage JSON-LD structured data to enable FAQ rich snippets' }); }

  const definitionSentences = bodyText.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(is|are)\s+(a|an|the|one|any|some|each|every)\s+/gi) || [];
  const definitionLike = (bodyText.match(/\b\w+(?:\s+\w+){0,3}\s+(is|are|refers to|means|defined as|known as)\s+\w+/gi) || []).length;
  const orderedSteps = (bodyText.match(/(?:^|\n)\s*\d+[\).]\s+[A-Z]/gm) || []).length;
  const comparisonTables = $('table').filter((i, el) => $(el).find('tr').length >= 3 && $(el).find('th').length >= 2).length;
  data.definitionStructuredAnswers = { definitionSentences: definitionLike, orderedSteps, comparisonTables, total: definitionLike + orderedSteps + comparisonTables };
  if (definitionLike === 0 && orderedSteps === 0 && comparisonTables === 0) { p += 4; issues.push({ severity: 'info', impact: 'low', message: 'No definition-style sentences, ordered steps, or comparison tables — these formats are preferred by AI search engines for featured snippets', element: 'content format', link: '', recommendation: 'Add "X is Y" definitions, step-by-step instructions, and comparison tables' }); }

  const structuredScore = Math.min(100, (definitionLike > 0 ? 25 : 0) + (orderedSteps > 0 ? 30 : 0) + (comparisonTables > 0 ? 25 : 0) + (daScore.hasDirectAnswer ? 20 : 0));
  data.aeoGeoScore = { score: structuredScore, rating: structuredScore >= 70 ? 'strong' : structuredScore >= 40 ? 'moderate' : 'weak' };
  if (structuredScore < 40) { p += 8; issues.push({ severity: 'warning', impact: 'high', message: 'Low AEO/GEO readiness score: ' + structuredScore + '/100 — page is poorly optimized for AI search engines and generative answer extraction', element: 'AEO/GEO', link: '', evidence: 'Score: ' + structuredScore + '/100', recommendation: 'Add definitions, steps, tables, FAQ schema, and concise direct answers to improve AI visibility' }); }

  const mentions = $('meta[name="description"]').attr('content') || '';
  data.pagePreview = { metaDescription: mentions.substring(0, 160), hasSnippetPotential: mentions.length >= 40 && mentions.length <= 160 };

  const chunkedAnalysis = chunkText(bodyText, 100);
  const h1ForMentions = $('h1').first().text().trim();
  const primaryKeywords = h1ForMentions ? h1ForMentions.split(/\s+/).filter(w => w.length > 3).slice(0, 5) : [];
  if (primaryKeywords.length > 0) {
    const mentionResults = extractAllMentions(bodyText, primaryKeywords);
    data.keywordMentions = mentionResults;
    const totalMentions = Object.values(mentionResults).reduce((a, b) => a + b, 0);
    data.avgMentionsPerKeyword = primaryKeywords.length > 0 ? (totalMentions / primaryKeywords.length).toFixed(1) : 0;
    primaryKeywords.forEach(kw => {
      if (!mentionResults[kw] || mentionResults[kw] < 2) {
        p += 2; issues.push({ severity: 'info', impact: 'low', message: 'Primary keyword "' + kw + '" has only ' + (mentionResults[kw] || 0) + ' mention(s) in content — minimum 2-3 mentions recommended for topical relevance', element: 'keyword', link: '', recommendation: 'Use the primary keyword naturally 2-3 times in body content' });
      }
    });
  }
  data.chunkedText = { totalChunks: chunkedAnalysis.length, chunkSizes: chunkedAnalysis.map(c => c.split(/\s+/).length) };

  return { level: 4, name: 'Generative Search, LLM & RAG Visibility (AEO/GEO)', score: sc(p), issues, data };
  } catch (e) { return { level: 4, name: 'Generative Search, LLM & RAG Visibility (AEO/GEO)', score: 0, issues: [{ severity: 'critical', impact: 'critical', message: 'Level 4 analysis failed: ' + e.message, element: 'system' }], data: { error: e.message } }; }
}

function level5($, url) {
  try {
  const issues = [];
  let p = 0;
  const subfunctions = {};
  const data = subfunctions;
  const fixes = [];

  const titleText = $('title').first().text().trim();
  const h1Text = $('h1').first().text().trim();
  const descContent = ($('meta[name="description"]').attr('content') || '').trim();
  const firstP = $('p').first().text().trim();

  let pageType = 'WebPage';
  if (/product/i.test(titleText + h1Text) || $('[itemtype*="Product"]').length > 0) pageType = 'Product';
  else if (/article|blog|news|post/i.test(titleText + h1Text)) pageType = 'Article';
  else if (/faq|question|answer/i.test(titleText + h1Text)) pageType = 'FAQPage';
  else if (/local|near|city|county|state/i.test(titleText + h1Text) || $('[itemtype*="LocalBusiness"]').length) pageType = 'LocalBusiness';

  const existingSchemas = extractSchemas($);
  const existingTypes = existingSchemas.filter(s => s.valid).map(s => s.type);
  const recommendedSchemas = [];
  const schemaPriorities = ['Article', 'Product', 'FAQPage', 'LocalBusiness', 'HowTo', 'BreadcrumbList', 'Review'];
  const missingSchemas = schemaPriorities.filter(t => !existingTypes.includes(t));
  const topMissing = missingSchemas.slice(0, 3);

  const keywords = (h1Text || titleText).split(/\s+/).filter(w => w.length > 3).slice(0, 5).join(', ');
  const brandName = (() => { try { return new URL(url).hostname.replace('www.', '').split('.')[0]; } catch { return 'Brand'; } })();

  topMissing.forEach(type => {
    const schemaCode = generateSchemaCode(type, {
      headline: titleText, description: descContent || firstP.substring(0, 160),
      authorName: $('meta[name="author"]').attr('content') || '',
      publisherName: brandName,
      name: titleText,
      price: $('meta[property="product:price:amount"]').attr('content') || '',
      currency: $('meta[property="product:price:currency"]').attr('content') || 'USD',
      questions: pageType === 'FAQPage' ? [{ question: h1Text || '', answer: firstP.substring(0, 200) || '' }] : [],
      items: titleText ? ['Home', titleText] : [],
      baseUrl: url.replace(/\/$/, '')
    });
    fixes.push({
      type: 'schema', subtype: type, priority: 'medium',
      code: '<script type="application/ld+json">\n' + schemaCode + '\n</script>',
      selector: 'head',
      description: 'Auto-generated ' + type + ' JSON-LD structured data'
    });
  });
  if (topMissing.length > 0) { p += 5; issues.push({ severity: 'info', impact: 'medium', message: topMissing.length + ' schema types recommended: ' + topMissing.join(', ') + ' — enabling rich result eligibility', element: 'structured data', link: url, recommendation: 'Paste the generated JSON-LD scripts into the <head>' }); }

  const metaOpts = generateMetaOptions(titleText, descContent, keywords);
  data.metaOptions = metaOpts;
  const titleOpts = metaOpts.filter(m => m.meta === 'title');
  const descOpts = metaOpts.filter(m => m.meta === 'description');
  data.titleOptions = titleOpts;
  data.descOptions = descOpts;

  if (!$('meta[name="description"]').length || descContent.length < 70 || descContent.length > 160) {
    descOpts.forEach((opt, i) => {
      if (opt.variant !== 'Current') {
        fixes.push({
          type: 'meta-description', variant: opt.variant, priority: 'high',
          code: '<meta name="description" content="' + opt.value.replace(/\"/g, '&quot;') + '">',
          selector: 'head',
          description: 'Meta description option ' + (i + 1) + ': ' + opt.variant + ' (' + opt.charCount + ' chars, score: ' + opt.seoScore + ')',
          rationale: opt.seoScore >= 85 ? 'Optimal length with keyword inclusion and CTA' : opt.variant === 'Trimmed' ? 'Trimmed to fit within Google\'s display limits' : 'Front-loaded with primary keyword for SERP bolded matches'
        });
      }
    });
  }
  if ($('title').length === 0 || titleText.length < 20 || titleText.length > 60) {
    titleOpts.forEach((opt, i) => {
      if (opt.variant !== 'Default') {
        fixes.push({
          type: 'title', variant: opt.variant, priority: 'high',
          code: '<title>' + opt.value.replace(/\"/g, '&quot;') + '</title>',
          selector: 'head',
          description: 'Title option ' + (i + 1) + ': ' + opt.variant + ' (' + opt.charCount + ' chars, ' + opt.pxWidth + 'px)',
          rationale: opt.variant === 'Front-loaded' ? 'Primary keyword placed at the beginning for maximum SEO impact' : 'Brand-included variant for brand awareness in SERPs'
        });
      }
    });
  }

  const headings = [];
  $('h1,h2,h3,h4,h5,h6').each((i, el) => {
    headings.push({ level: parseInt(el.tagName[1]), text: $(el).text().trim(), selector: sel($, el), chain: getSelectorChain($, el) });
  });
  const headingIssues = [];
  let prevLevel = 0;
  headings.forEach(h => {
    if (h.level > prevLevel + 1 && prevLevel > 0) headingIssues.push({ from: prevLevel, to: h.level, text: h.text.substring(0, 40), selector: h.selector });
    prevLevel = h.level;
  });
  const h1Count = headings.filter(h => h.level === 1).length;

  if (h1Count === 0 && titleText) {
    fixes.push({
      type: 'heading', priority: 'high',
      code: '<h1>' + titleText.replace(/\"/g, '&quot;') + '</h1>',
      selector: 'body > *:first-child',
      description: 'Auto-generated H1 from title tag',
      rationale: 'Every page needs exactly one H1 containing the primary keyword'
    });
  }
  if (h1Count > 1) {
    const corrected = [];
    headings.filter(h => h.level === 1).forEach((h, i) => {
      if (i === 0) corrected.push(h);
      else {
        fixes.push({
          type: 'heading-fix', priority: 'medium',
          code: '<h2>' + h.text.replace(/\"/g, '&quot;') + '</h2>',
          selector: h.selector,
          description: 'Convert H1 "' + h.text.substring(0, 30) + '" to H2 to eliminate duplicate H1',
          originalTag: 'h1', correctedTag: 'h2',
          rationale: 'Multiple H1s dilute the strongest topic signal — convert extras to H2'
        });
      }
    });
  }
  headingIssues.forEach(hi => {
    fixes.push({
      type: 'heading-hierarchy', priority: 'medium',
      code: null,
      selector: hi.selector,
      description: 'Fix heading hierarchy: H' + hi.from + ' → H' + hi.to + ' skipped at "' + hi.text + '"',
      recommendation: 'Insert a H' + (hi.from + 1) + ' between the H' + hi.from + ' and H' + hi.to + ', or promote the H' + hi.to + ' to H' + (hi.from + 1),
      rationale: 'Skipped heading levels break document outline and confuse crawlers'
    });
  });

  $('img').each((i, el) => {
    if (!$(el).is('[alt]') || !$(el).attr('alt')) {
      const src = ($(el).attr('src') || '').split('?')[0];
      const fileName = src.split('/').pop().split('.')[0].replace(/[-_]/g, ' ');
      const suggestedAlt = fileName.length > 3 ? fileName.charAt(0).toUpperCase() + fileName.slice(1) : 'Image depicting ' + (h1Text || 'content').substring(0, 30);
      fixes.push({
        type: 'alt-text', priority: 'medium',
        code: '<img src="' + src + '" alt="' + suggestedAlt.replace(/\"/g, '&quot;') + '">',
        selector: sel($, el),
        description: 'Auto-generated alt text for image: ' + src.substring(0, 40),
        suggestedAlt,
        rationale: 'Descriptive alt text is essential for accessibility (screen readers) and image SEO (Google Images)'
      });
    }
  });

  const canonEls = $('link[rel="canonical"]');
  if (canonEls.length === 0) {
    fixes.push({
      type: 'canonical', priority: 'high',
      code: '<link rel="canonical" href="' + url + '">',
      selector: 'head',
      description: 'Self-referencing canonical URL',
      rationale: 'Prevents duplicate content issues by specifying the preferred URL'
    });
  } else if (canonEls.length === 1) {
    const canonHref = $(canonEls[0]).attr('href') || '';
    try {
      const cu = new URL(canonHref);
      const pu = new URL(url);
      if (cu.hostname !== pu.hostname) {
        fixes.push({
          type: 'canonical-fix', priority: 'high',
          code: '<link rel="canonical" href="' + url + '">',
          selector: sel($, canonEls[0]),
          description: 'Fix cross-domain canonical: change from "' + canonHref + '" to "' + url + '"',
          rationale: 'Cross-domain canonicals should only be used for syndicated content'
        });
      }
    } catch {}
  }

  if (!$('meta[name="viewport"]').length) {
    fixes.push({
      type: 'viewport', priority: 'high',
      code: '<meta name="viewport" content="width=device-width, initial-scale=1">',
      selector: 'head',
      description: 'Responsive viewport meta tag',
      rationale: 'Essential for mobile-first indexing and proper rendering on mobile devices'
    });
  }
  if (!$('html').attr('lang')) {
    fixes.push({
      type: 'lang', priority: 'medium',
      code: '<html lang="en">',
      selector: 'html',
      description: 'Language declaration for accessibility',
      rationale: 'Screen readers need lang attribute for correct pronunciation'
    });
  }

  const ticketFindings = {
    url,
    issues: issues.length > 0 ? issues.slice(0, 10).map((issue, i) => ({
      name: issue.message ? issue.message.substring(0, 100) : 'Issue ' + (i + 1),
      priority: issue.severity || 'Medium',
      location: issue.selector || issue.element || url,
      description: (issue.message || issue.recommendation || '').substring(0, 200),
      recommendation: (issue.recommendation || issue.fix || '').substring(0, 200)
    })) : []
  };
  data.jiraTicket = formatJiraTicket(ticketFindings);

  const cicdConfig = {
    githubActions: `name: SEO Audit Gate
on:
  pull_request:
    branches: [main]
jobs:
  seo-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run SEO Audit
        run: |
          curl -s -X POST \${{ secrets.SEO_AUDIT_URL }}/api/audit \\
            -H "Content-Type: application/json" \\
            -d '{"url": "${url}"}'
      - name: Check Score Threshold
        run: |
          SCORE=$(curl -s -X POST \${{ secrets.SEO_AUDIT_URL }}/api/audit \\
            -H "Content-Type: application/json" \\
            -d '{"url": "${url}"}' | jq -r '.overallScore // 0')
          if [ "$SCORE" -lt 70 ]; then
            echo "SEO score $SCORE is below threshold of 70"
            exit 1
          fi
          echo "SEO score $SCORE - passed threshold"`,
    deployHooks: `// Netlify deploy hook configuration
// Add to netlify.toml:
// [build]
//   publish = "dist"
//   command = "npm run build"
//
// Vercel deploy hook:
// Add to vercel.json:
// {
//   "headers": [
//     {
//       "source": "/(.*)",
//       "headers": [
//         { "key": "X-Content-Type-Options", "value": "nosniff" },
//         { "key": "X-Frame-Options", "value": "DENY" },
//         { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
//       ]
//     }
//   ]
// }
//
// Cloudflare Workers deployment:
// wrangler deploy worker.js --env production
`,
    preCommit: `# Add to package.json scripts:
# "seo:check": "curl -s -X POST http://localhost:3000/api/audit -H 'Content-Type: application/json' -d '{\\"url\\": \\"${url}\\"}' | jq '.overallScore'"
#
# Add pre-commit hook (.husky/pre-commit):
# npm run seo:check && git add -A`
  };
  data.ciCdIntegration = cicdConfig;

  data.autoFixes = fixes;
  if (fixes.length > 0) {
    issues.push({
      severity: 'info', impact: 'high',
      message: fixes.length + ' auto-generated fixes ready: ' + fixes.filter(f => f.priority === 'high').length + ' high-priority, ' + fixes.filter(f => f.type === 'schema').length + ' schema blocks, ' + fixes.filter(f => f.type === 'alt-text').length + ' alt text fixes',
      element: 'auto-fixes', fix: 'Copy the generated code snippets and paste into your page or deploy via CI/CD pipeline.',
      link: url,
      recommendation: 'Deploy high-priority fixes first. Run the GitHub Actions workflow to gate PRs based on SEO score.'
    });
    p += 2;
  }

  return { level: 5, name: 'Dev Automation & Auto-Fix Generation', score: sc(p), issues, data, autoFixGenerated: fixes.length > 0, autoFixes: fixes };
  } catch (e) { return { level: 5, name: 'Dev Automation & Auto-Fix Generation', score: 0, issues: [{ severity: 'critical', impact: 'critical', message: 'Level 5 analysis failed: ' + e.message, element: 'system' }], data: { error: e.message } }; }
}

function level6(headers, $, url) {
  try {
  const issues = [];
  let p = 0;
  const subfunctions = {};
  const data = subfunctions;
  const h = headers || {};

  const httpResult = analyzeHttpHeaders(headers);
  data.httpHeaders = httpResult;

  const cdnSignatures = {
    cloudflare: ['cf-ray', 'cf-cache-status', 'cf-request-id', 'cf-connecting-ip'],
    cloudfront: ['x-amz-cf-id', 'x-amz-cf-pop', 'via'],
    fastly: ['x-timer', 'x-served-by', 'x-cache'],
    akamai: ['x-akamai-transformed', 'x-akamai-request-id']
  };
  let detectedCdn = 'none';
  Object.entries(cdnSignatures).forEach(([cdn, sigs]) => {
    sigs.forEach(sig => {
      if (h[sig] || h[sig.toLowerCase()] || h[sig.replace(/-/g, '_')]) detectedCdn = cdn;
    });
  });
  if (h['server'] && h['server'].toLowerCase().includes('cloudflare')) detectedCdn = 'cloudflare';
  if (h['server'] && h['server'].toLowerCase().includes('cloudfront')) detectedCdn = 'cloudfront';

  data.cdn = { detected: detectedCdn, server: h['server'] || 'unknown', poweredBy: h['x-powered-by'] || '', via: h['via'] || '', hasCDN: detectedCdn !== 'none' };

  if (detectedCdn === 'none') {
    issues.push({ severity: 'info', impact: 'low', message: 'No CDN detected. Origin server exposed - higher latency for global users. CDNs cache content closer to users and can reduce TTFB for far-away visitors.', element: 'CDN', fix: 'Deploy behind Cloudflare (free tier), CloudFront, or Fastly for global edge caching.', link: url, evidence: 'Server: ' + (h['server'] || 'unknown') });
    p += 5;
  }

  const secScore = httpResult.securityScore || 0;
  data.securityHeadersScore = secScore;
  if (secScore < 80) {
    const missingSec = [];
    if (!httpResult.securityHeaders.xContentTypeOptions) missingSec.push('X-Content-Type-Options: nosniff');
    if (!httpResult.securityHeaders.hsts) missingSec.push('Strict-Transport-Security');
    if (!httpResult.securityHeaders.xFrameOptions) missingSec.push('X-Frame-Options: DENY');
    if (!httpResult.securityHeaders.permissionsPolicy) missingSec.push('Permissions-Policy');
    if (!httpResult.securityHeaders.referrerPolicy) missingSec.push('Referrer-Policy');
    issues.push({ severity: 'warning', impact: 'high', message: 'Security headers score: ' + secScore + '/100. Missing: ' + missingSec.join(', '), element: 'security headers', fix: 'Add: ' + missingSec.join('; '), link: url, evidence: 'Score: ' + secScore + '/100' });
    p += 5 + (5 - missingSec.length) * 2;
  }

  const cacheControl = h['cache-control'] || '';
  data.cacheAnalysis = {
    raw: cacheControl,
    maxAge: (cacheControl.match(/max-age=(\d+)/) || [])[1] || null,
    sMaxAge: (cacheControl.match(/s-maxage=(\d+)/) || [])[1] || null,
    hasETag: !!h['etag'],
    hasLastModified: !!h['last-modified'],
    hasCache: !!cacheControl,
    isPublic: cacheControl.includes('public'),
    isPrivate: cacheControl.includes('private'),
    noCache: cacheControl.includes('no-cache'),
    noStore: cacheControl.includes('no-store'),
    mustRevalidate: cacheControl.includes('must-revalidate'),
    proxyRevalidate: cacheControl.includes('proxy-revalidate'),
    immutable: cacheControl.includes('immutable'),
    staleWhileRevalidate: (cacheControl.match(/stale-while-revalidate=(\d+)/) || [])[1] || null,
    staleIfError: (cacheControl.match(/stale-if-error=(\d+)/) || [])[1] || null
  };
  if (!cacheControl) {
    issues.push({ severity: 'warning', impact: 'medium', message: 'No Cache-Control header set. Browser re-downloads resources every visit - wastes bandwidth and slows repeat views.', element: 'Cache-Control', fix: 'Set Cache-Control: public, max-age=31536000 for static assets; no-cache for HTML.', link: url, evidence: 'Cache-Control header missing entirely.' });
    p += 6;
  } else {
    const maxAge = parseInt(data.cacheAnalysis.maxAge || '0');
    if (maxAge === 0 && !data.cacheAnalysis.noCache) {
      issues.push({ severity: 'info', impact: 'low', message: 'Cache-Control max-age=0 - content not cached by browser. For HTML this is fine, but static assets should be cached long-term.', element: 'Cache-Control', fix: 'For static: Cache-Control: public, max-age=31536000, immutable', link: url });
      p += 2;
    }
  }

  const serverTiming = h['server-timing'] || '';
  if (serverTiming) {
    const timings = {};
    serverTiming.split(',').forEach(entry => {
      const parts = entry.trim().split(';');
      if (parts.length >= 2) {
        const name = parts[0];
        const durMatch = parts[1].match(/dur=([0-9.]+)/);
        if (durMatch) timings[name] = parseFloat(durMatch[1]);
      }
    });
    data.serverTiming = { raw: serverTiming, parsed: timings, present: true };
    const totalTime = Object.values(timings).reduce((a, b) => a + b, 0);
    data.serverTiming.totalMs = totalTime;
    if (totalTime > 500) {
      issues.push({ severity: 'warning', impact: 'medium', message: 'Server-Timing indicates ' + totalTime.toFixed(0) + 'ms backend processing - affects TTFB and Core Web Vitals.', element: 'server timing', fix: 'Optimize server response time, consider edge caching or serverless optimization.', link: url, evidence: 'Total server time: ' + totalTime.toFixed(0) + 'ms' });
      p += 5;
    }
  } else {
    data.serverTiming = { present: false };
  }

  const botResult = analyzeBotManagement($);
  data.botManagement = botResult;

  if (botResult.robotDetection) {
    issues.push({ severity: 'warning', impact: 'high', message: 'Bot detection mechanisms active (CAPTCHA/challenge). Googlebot may be blocked from rendering JavaScript-dependent content.', element: 'bot management', fix: 'Ensure crawlers are not challenged. Use _renderPage=1 param or bot-specific bypass.', link: url, evidence: botResult.signals.map(s => s.detail).join('; ') });
    p += 8;
  }

  if (httpResult.xRobotsTag.noindex) {
    issues.push({ severity: 'critical', impact: 'critical', message: 'X-Robots-Tag: noindex set via HTTP header - page intentionally excluded from Google index.', element: 'X-Robots-Tag', fix: 'Remove noindex directive if this page should be indexed. Only use for thin/duplicate pages.', link: url, evidence: 'Header: ' + httpResult.xRobotsTag.raw });
    p += 20;
  }

  const csp = h['content-security-policy'] || '';
  data.contentSecurityPolicy = { present: !!csp, raw: csp.substring(0, 200) };
  if (csp && !csp.includes('frame-ancestors')) {
    issues.push({ severity: 'info', impact: 'low', message: 'CSP present but missing frame-ancestors directive - page could still be framed by other sites (clickjacking risk).', element: 'CSP', fix: 'Add frame-ancestors: self or frame-ancestors: none to CSP header.', link: url });
    p += 2;
  }

  data.edgeWorkerCode = {
    cloudflare: [
      "// Cloudflare Worker - SEO Auto-Healing\n" +
      "addEventListener('fetch', event => {\n" +
      "  event.respondWith(handleRequest(event.request));\n" +
      "});\n" +
      "\n" +
      "async function handleRequest(request) {\n" +
      "  const response = await fetch(request);\n" +
      "  if (!response.headers.get('content-type')?.includes('text/html')) return response;\n" +
      "  let html = await response.text();\n" +
      "  const url = new URL(request.url);\n" +
      "\n" +
      "  if (!html.includes('rel=\'canonical\'')) {\n" +
      "    html = html.replace('</head>', '<link rel=\'canonical\' href=\'' + url.origin + url.pathname + '\'></head>');\n" +
      "  }\n" +
      "  if (!html.includes('name=\'viewport\'')) {\n" +
      "    html = html.replace('</head>', '<meta name=\'viewport\' content=\'width=device-width, initial-scale=1\'></head>');\n" +
      "  }\n" +
      "  if (!html.includes('name=\'description\'')) {\n" +
      "    const firstP = html.match(/<p[^>]*>([^<]+)<\/p>/);\n" +
      "    const desc = firstP ? firstP[1].substring(0, 155).replace(/\"/g, '&quot;') : 'SEO optimized page';\n" +
      "    html = html.replace('</head>', '<meta name=\'description\' content=\'' + desc + '\'></head>');\n" +
      "  }\n" +
      "  if (!html.includes('charset=')) {\n" +
      "    html = html.replace('</head>', '<meta charset=\'utf-8\'></head>');\n" +
      "  }\n" +
      "\n" +
      "  const newResponse = new Response(html, {\n" +
      "    status: response.status,\n" +
      "    headers: response.headers\n" +
      "  });\n" +
      "  newResponse.headers.set('X-SEO-Worker', 'active');\n" +
      "  newResponse.headers.set('X-Content-Type-Options', 'nosniff');\n" +
      "  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');\n" +
      "  return newResponse;\n" +
      "}"
    ],
    vercel: [
      "// Vercel Edge Middleware - SEO Canonical & Security",
      "import { NextResponse } from 'next/server';",
      "export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'] };",
      "export function middleware(request) {",
      "  const url = new URL(request.url);",
      "  const response = NextResponse.next();",
      "  response.headers.set('X-Robots-Tag', 'index, follow');",
      "  if (!request.headers.get('referer')?.includes(url.hostname)) {",
      "    response.headers.set('X-Frame-Options', 'DENY');",
      "  }",
      "  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');",
      "  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');",
      "  const canonical = 'https://' + url.hostname + url.pathname.replace(/\/$/, '');",
      "  response.headers.set('Link', '<' + canonical + '>; rel=\'canonical\'');",
      "  return response;",
      "}"
    ].join('\n')
  };

  data.infrastructure = {
    server: h['server'] || 'unknown',
    cdn: detectedCdn,
    http2: !!h['cf-http2'] || !!h['x-http2'],
    compression: h['content-encoding'] || 'none',
    tlsVersion: h['cf-tls-version'] || h['x-tls-version'] || 'unknown',
    isHTTPS: url ? url.startsWith('https') : false
  };

  const corsHeader = h['access-control-allow-origin'] || '';
  data.cors = { present: !!corsHeader, value: corsHeader, allowsAll: corsHeader === '*' };

  data.headerSummary = {
    totalHeaders: Object.keys(h).length,
    securityHeadersPresent: [h['strict-transport-security'], h['x-content-type-options'], h['x-frame-options'], h['referrer-policy'], h['permissions-policy']].filter(Boolean).length,
    totalSecurityHeaders: 5,
    cachingConfigured: !!cacheControl,
    cdnPresent: detectedCdn !== 'none',
    serverTimingPresent: !!serverTiming,
    securityScore: secScore,
    cachingScore: cacheControl ? (data.cacheAnalysis.immutable ? 100 : data.cacheAnalysis.maxAge ? 80 : 50) : 0
  };

  return { level: 6, name: 'Edge Computing & Serverless Worker Integration', score: sc(p), issues, data };
  } catch (e) { return { level: 6, name: 'Edge Computing & Serverless Worker Integration', score: 0, issues: [{ severity: 'critical', impact: 'critical', message: 'Level 6 analysis failed: ' + e.message, element: 'system' }], data: { error: e.message } }; }
}

function level7($) {
  try {
  const issues = [];
  let p = 0;
  const subfunctions = {};
  const data = subfunctions;

  const mediaResult = analyzeMediaOptimization($);
  data.mediaOptimization = mediaResult;

  const multiModal = analyzeMultiModalContent($);
  data.multiModal = multiModal;

  const captionResult = validateSemanticCaptions($);
  data.semanticCaptions = captionResult;

  let totalImages = 0;
  let missingAlt = 0;
  let emptyAlt = 0;
  let genericAlt = 0;
  let longAlt = 0;
  let noDimensions = 0;
  let noLazy = 0;
  let oldFormats = 0;
  let missingSrcset = 0;
  let totalPngGif = 0;
  const imgFormats = {};
  const imgIssues = [];

  $('img').each((i, el) => {
    totalImages++;
    const a = analyzeImage($, el);
    const format = a.format || 'unknown';
    imgFormats[format] = (imgFormats[format] || 0) + 1;
    if (a.issues.length > 0) imgIssues.push({ src: a.src, issues: a.issues, selector: a.selector });
    if (!$(el).is('[alt]')) missingAlt++;
    else if (a.alt === '') emptyAlt++;
    else if (/^(img|image|photo|picture|logo|icon|banner|thumbnail)$/i.test(a.alt)) genericAlt++;
    else if (a.altWordCount > 15) longAlt++;
    if (!a.hasDimensions) noDimensions++;
    if (!a.loading) noLazy++;
    if (!a.srcset) missingSrcset++;
    if (['png', 'gif', 'bmp', 'tiff'].includes(format)) oldFormats++;
    if (format === 'png' || format === 'gif') totalPngGif++;
  });

  data.imageAnalysis = {
    total: totalImages,
    formats: imgFormats,
    missingAlt, emptyAlt, genericAlt, longAlt,
    noDimensions, noLazyLoading: noLazy, missingSrcset,
    oldFormatsCount: oldFormats, pngGifCount: totalPngGif,
    issues: imgIssues.slice(0, 15),
    formatScore: totalPngGif > 0 ? Math.max(0, 100 - (totalPngGif / Math.max(1, totalImages)) * 100) : 100,
    altHealthScore: totalImages > 0 ? Math.round(((totalImages - missingAlt - emptyAlt - genericAlt - longAlt) / totalImages) * 100) : 0,
    dimensionCompliance: totalImages > 0 ? Math.round(((totalImages - noDimensions) / totalImages) * 100) : 0,
    lazyScore: totalImages > 0 ? Math.round(((totalImages - noLazy) / totalImages) * 100) : 0
  };

  if (missingAlt > 0) {
    issues.push({ severity: 'critical', impact: 'high', message: missingAlt + ' images missing alt attribute entirely - screen readers cannot describe them, search engines lose context. WCAG 2.1 failure.', element: 'img[alt]', fix: 'Add descriptive alt text to all ' + missingAlt + ' images. Use empty alt (alt="") for decorative images.', link: '', evidence: missingAlt + ' images without alt attribute' });
    p += Math.min(15, missingAlt * 3);
  }
  if (emptyAlt > 0) {
    issues.push({ severity: 'warning', impact: 'medium', message: emptyAlt + ' decorative images with empty alt - good for accessibility, but confirm they are truly decorative.', element: 'img[alt=""]', fix: 'If image conveys information, add descriptive alt text. If decorative only, keep empty alt.', link: '' });
    p += Math.min(5, emptyAlt);
  }
  if (genericAlt > 0) {
    issues.push({ severity: 'warning', impact: 'medium', message: genericAlt + ' images have generic alt text ("image", "photo", "icon") - provides no SEO or accessibility value.', element: 'img[alt]', fix: 'Replace generic alt with specific descriptions: e.g., "Red running shoes on white background"', link: '', evidence: 'Generic patterns: image, photo, picture, logo, icon, banner, thumbnail' });
    p += Math.min(8, genericAlt * 2);
  }
  if (noDimensions > 0) {
    issues.push({ severity: 'warning', impact: 'high', message: noDimensions + ' images missing width/height attributes - causes Cumulative Layout Shift (CLS) as images load.', element: 'img[width][height]', fix: 'Always set explicit width and height: <img width="800" height="600" ...>', link: '' });
    p += Math.min(10, noDimensions * 2);
  }
  if (noLazy > 0 && noLazy > totalImages * 0.3) {
    issues.push({ severity: 'info', impact: 'medium', message: noLazy + ' below-fold images lack loading="lazy" - increases initial page load weight.', element: 'img[loading]', fix: 'Add loading="lazy" to below-fold images. Keep loading="eager" for above-fold and hero images.', link: '' });
    p += Math.min(5, noLazy);
  }
  if (totalPngGif > 0) {
    issues.push({ severity: 'warning', impact: 'medium', message: totalPngGif + ' images in PNG/GIF format - WebP/AVIF typically compress images smaller than PNG/GIF, reducing transfer size.', element: 'image format', fix: 'Convert PNG to WebP (lossless) and GIF to WebP/AVIF. Use <picture> with WebP fallback.', link: '', evidence: totalPngGif + ' non-modern format images' });
    p += Math.min(8, totalPngGif * 2);
  }
  if (missingSrcset > 0 && missingSrcset > totalImages * 0.5) {
    issues.push({ severity: 'info', impact: 'medium', message: missingSrcset + ' images missing srcset - mobile users download desktop-sized images, wasting bandwidth.', element: 'img[srcset]', fix: 'Add srcset with multiple resolutions: srcset="img-320w.jpg 320w, img-640w.jpg 640w, img-1280w.jpg 1280w"', link: '' });
    p += 3;
  }

  const videoElements = [];
  $('video').each((i, el) => {
    const src = $(el).attr('src') || $(el).find('source').first().attr('src') || '';
    const hasCaptions = $(el).find('track[kind="captions"], track[kind="subtitles"]').length > 0;
    const hasPoster = !!$(el).attr('poster');
    const hasControls = !!$(el).attr('controls');
    const width = $(el).attr('width');
    const height = $(el).attr('height');
    videoElements.push({ src: src.substring(0, 200), hasCaptions, hasPoster, hasControls, width, height, hasDimensions: !!(width && height), selector: sel($, el) });
  });

  $('iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="wistia"], iframe[src*="loom"]').each((i, el) => {
    const src = $(el).attr('src') || '';
    const title = $(el).attr('title') || '';
    const platform = src.includes('youtube') ? 'YouTube' : src.includes('vimeo') ? 'Vimeo' : src.includes('wistia') ? 'Wistia' : 'unknown';
    videoElements.push({ src: src.substring(0, 200), embedded: true, platform, hasTitle: !!title, title: title || 'missing', selector: sel($, el) });
  });

  data.videoAnalysis = {
    total: videoElements.length,
    nativeVideos: videoElements.filter(v => !v.embedded).length,
    embeddedVideos: videoElements.filter(v => v.embedded).length,
    platforms: [...new Set(videoElements.filter(v => v.embedded).map(v => v.platform))],
    noCaptions: videoElements.filter(v => !v.embedded && !v.hasCaptions).length,
    noPoster: videoElements.filter(v => !v.embedded && !v.hasPoster).length,
    missingTitles: videoElements.filter(v => v.embedded && !v.hasTitle).length,
    details: videoElements.slice(0, 10)
  };

  if (data.videoAnalysis.noCaptions > 0) {
    issues.push({ severity: 'warning', impact: 'medium', message: data.videoAnalysis.noCaptions + ' videos missing captions/subtitles - inaccessible to deaf users, unindexable by search engines.', element: 'track[kind="captions"]', fix: 'Add <track kind="captions" src="captions.vtt" srclang="en" label="English"> to each video.', link: '' });
    p += 6;
  }
  if (data.videoAnalysis.noPoster > 0) {
    issues.push({ severity: 'info', impact: 'low', message: data.videoAnalysis.noPoster + ' videos missing poster attribute - users see a blank area before play.', element: 'video[poster]', fix: 'Add poster="thumbnail.jpg" for a preview image before video loads.', link: '' });
    p += 2;
  }
  if (data.videoAnalysis.missingTitles > 0) {
    issues.push({ severity: 'warning', impact: 'medium', message: data.videoAnalysis.missingTitles + ' embedded videos missing title attribute - accessibility violation and poor context.', element: 'iframe[title]', fix: 'Add title="Video: [description]" to all embedded video iframes.', link: '' });
    p += 3;
  }

  const audioElements = [];
  $('audio').each((i, el) => {
    const src = $(el).attr('src') || $(el).find('source').first().attr('src') || '';
    const hasControls = !!$(el).attr('controls');
    audioElements.push({ src: src.substring(0, 200), hasControls, selector: sel($, el) });
  });
  if (audioElements.length === 0) {
    $('a[href$=".mp3"], a[href$=".wav"], a[href$=".ogg"], a[href$=".m4a"]').each((i, el) => {
      audioElements.push({ src: ($(el).attr('href') || '').substring(0, 200), linked: true, text: $(el).text().trim().substring(0, 100), selector: sel($, el) });
    });
  }
  data.audioAnalysis = {
    total: audioElements.length,
    hasTranscript: $('[class*="transcript"], [id*="transcript"]').length > 0,
    linkedOnly: audioElements.filter(a => a.linked).length,
    nativeAudio: audioElements.filter(a => !a.linked).length,
    details: audioElements.slice(0, 5)
  };

  const svgElements = [];
  $('svg').each((i, el) => {
    const w = $(el).attr('width') || $(el).attr('viewBox');
    const h = $(el).attr('height');
    const ariaLabel = $(el).attr('aria-label') || $(el).attr('aria-labelledby') || '';
    const role = $(el).attr('role') || '';
    const textContent = $(el).text().trim();
    const hasTitle = $(el).find('title').length > 0;
    const hasDesc = $(el).find('desc').length > 0;
    svgElements.push({
      selector: sel($, el),
      hasDimensions: !!(w && h),
      ariaLabel: ariaLabel || null,
      role: role || '',
      hasTextContent: !!textContent,
      hasTitle, hasDesc,
      hasAria: !!ariaLabel || role === 'img',
      inline: !$(el).attr('data-src') && !$(el).attr('src')
    });
  });

  data.svgAnalysis = {
    total: svgElements.length,
    missingAria: svgElements.filter(s => !s.hasAria && !s.hasTextContent).length,
    missingDimensions: svgElements.filter(s => !s.hasDimensions).length,
    details: svgElements.slice(0, 10)
  };

  if (data.svgAnalysis.missingAria > 0) {
    issues.push({ severity: 'warning', impact: 'medium', message: data.svgAnalysis.missingAria + ' SVGs missing accessible labels - screen readers cannot interpret them.', element: 'svg', fix: 'Add role="img" and aria-label="Description" to informative SVGs. Add aria-hidden="true" to decorative ones.', link: '' });
    p += Math.min(5, data.svgAnalysis.missingAria);
  }
  if (data.svgAnalysis.missingDimensions > 0) {
    issues.push({ severity: 'info', impact: 'low', message: data.svgAnalysis.missingDimensions + ' SVGs lack explicit width/height/viewBox - may render at incorrect sizes.', element: 'svg', fix: 'Always set viewBox="0 0 W H" and optionally width/height attributes.', link: '' });
    p += 2;
  }

  data.accessibilityScore = analyzeAccessibility($);

  if (captionResult.issues.length > 0) {
    issues.push({ severity: 'info', impact: 'medium', message: captionResult.issues.length + ' semantic caption issues found (figure/figcaption, table/caption).', element: 'semantic captions', fix: 'Add <figcaption> inside <figure> and <caption> inside <table>.', link: '', evidence: captionResult.issues.slice(0, 3).map(i => i.issue).join('; ') });
    p += Math.min(4, captionResult.issues.length);
  }

  return { level: 7, name: 'Multi-Modal Content & Spatial Asset Auditing', score: sc(p), issues, data };
  } catch (e) { return { level: 7, name: 'Multi-Modal Content & Spatial Asset Auditing', score: 0, issues: [{ severity: 'critical', impact: 'critical', message: 'Level 7 analysis failed: ' + e.message, element: 'system' }], data: { error: e.message } }; }
}

function level8($, bodyText, url) {
  try {
  const issues = [];
  let p = 0;
  const text = bodyText || getTextContent($) || '';
  const wc = countWords(text);

  const subfunctions = {};

  // Subfunction 1: SERP Volatility Analysis (real page-derived, not fake data)
  const headingCount = $('h1,h2,h3,h4,h5,h6').length;
  const imageCount = $('img').length;
  const linkCount = $('a[href]').length;
  const listCount = $('ol, ul').length;
  subfunctions.serpVolatility = analyzeSerpVolatility(text, {
    wordCount: wc, headingCount, imageCount, linkCount, listCount
  });

  // Subfunction 2: Quality Thresholds
  const qThresholds = calculateQualityThresholds(text);
  subfunctions.qualityThresholds = {
    overallScore: qThresholds.overallQuality,
    wordCountScore: qThresholds.wordCount.score,
    headingDensityScore: qThresholds.headingDensity.score,
    imageDensityScore: qThresholds.imageDensity.score,
    linkDensityScore: qThresholds.linkDensity.score,
    meetsMinWordCount: qThresholds.wordCount.meetsMin,
    meetsMinHeadings: qThresholds.headingDensity.score >= 50,
    meetsMinImages: qThresholds.imageDensity.score >= 50,
    meetsMinLinks: qThresholds.linkDensity.score >= 50,
    structuralElementsScore: qThresholds.structuralElements.score
  };

  // Subfunction 3: SERP Feature Readiness Scoring
  const definitions = $('p').filter((_, el) => {
    const t = $(el).text();
    return t.length > 40 && t.length < 300 && /\b(is|are|refers to|means|defined as|known as)\b/i.test(t);
  }).length;
  const lists = $('ol, ul').filter((_, el) => $(el).find('li').length >= 3).length;
  const tables = $('table').filter((_, el) => $(el).find('tr').length >= 3).length;
  const questionCount = (text.match(/\b(how|what|why|when|where|who|can|does|is|are|do|should|will)\b\s+[^?]+\?/gi) || []).length;
  const hasProductSchema = $('script[type="application/ld+json"]').filter((i, el) => {
    try { const d = JSON.parse($(el).html() || '{}'); return d['@type'] === 'Product' || (d['@graph'] && d['@graph'].some(g => g['@type'] === 'Product')); } catch { return false; }
  }).length > 0;
  const hasLocalBusinessSchema = $('script[type="application/ld+json"]').filter((i, el) => {
    try { const d = JSON.parse($(el).html() || '{}'); return d['@type'] === 'LocalBusiness' || d['@type'] === 'Organization'; } catch { return false; }
  }).length > 0;
  const hasCitations = $('a[href*="edu"], a[href*="gov"], a[href*="study"]').length > 0;
  const hasSufficientLength = wc > 500;

  subfunctions.serpFeatures = {
    aiOverview: {
      score: Math.min(100, (definitions > 0 ? 25 : 0) + (lists > 0 ? 20 : 0) + (tables > 0 ? 20 : 0) + (hasCitations ? 10 : 0) + (hasSufficientLength ? 10 : 0)),
      factors: { definitionSentences: definitions, lists3plus: lists, tables3plus: tables, hasAuthoritativeCitations: hasCitations, sufficientLength500plus: hasSufficientLength },
      ready: definitions > 0 && (lists > 0 || tables > 0),
      recommended: definitions === 0 ? 'Add definition sentences (X is Y format)' : lists === 0 ? 'Add numbered lists (3+ items)' : tables === 0 ? 'Add comparison tables' : ''
    },
    featuredSnippet: {
      score: Math.min(100, (definitions > 0 ? 30 : 0) + (lists > 0 ? 30 : 0) + (tables > 0 ? 25 : 0)),
      factors: { definitions, lists, tables },
      ready: definitions > 0 || lists > 0 || tables > 0,
      snippetFormat: tables > 0 ? 'table' : lists > 0 ? 'list' : definitions > 0 ? 'paragraph' : 'none'
    },
    peopleAlsoAsk: {
      score: Math.min(100, questionCount * 15),
      questionCount,
      questions: questionCount > 0 ? (text.match(/\b(how|what|why|when|where|who|can|does|is|are|do|should|will)\b\s+[^?]+\?/gi) || []).slice(0, 10).map(q => q.trim().substring(0, 120)) : [],
      ready: questionCount >= 2
    },
    localPack: {
      score: hasLocalBusinessSchema ? 70 : 0,
      factors: { hasLocalBusinessSchema, hasPhone: $('a[href^="tel:"]').length > 0 },
      ready: hasLocalBusinessSchema
    },
    shoppingGraph: {
      score: hasProductSchema ? 60 : 0,
      hasProductSchema,
      ready: hasProductSchema
    },
    knowledgePanel: {
      score: hasLocalBusinessSchema ? 50 : 0,
      factors: { hasSchema: hasLocalBusinessSchema, hasSocialLinks: $('a[href*="facebook"], a[href*="twitter"]').length > 0 },
      ready: hasLocalBusinessSchema && $('a[href*="facebook"], a[href*="twitter"]').length > 0
    }
  };

  // Subfunction 4: Thin Content & Paragraph Quality
  const paragraphs = $('p').filter((i, el) => $(el).text().trim().length > 20);
  const shortParagraphs = paragraphs.filter((i, el) => $(el).text().trim().split(/\s+/).length < 15);
  const thinRatio = paragraphs.length > 0 ? Math.round((shortParagraphs.length / paragraphs.length) * 100) : 0;
  const wordVariety = new Set(text.toLowerCase().split(/\s+/).filter(w => w.length > 2)).size;
  const lexicalDiversity = wc > 0 ? wordVariety / wc : 0;

  subfunctions.thinContentAnalysis = {
    wordCount: wc,
    isThin: wc < 300,
    thinRatio: thinRatio + '%',
    shortParagraphCount: shortParagraphs.length,
    totalParagraphs: paragraphs.length,
    thinParagraphRatio: thinRatio + '%',
    lexicalDiversity: Math.round(lexicalDiversity * 100) + '%',
    uniqueWords: wordVariety
  };

  // Subfunction 5: Monetization & Affiliate Analysis
  const affiliateLinks = $('a[href*="affiliate"], a[rel*="sponsored"], a[href*="ref="]').length;
  const totalLinks = $('a[href]').length;
  const affiliateRatio = totalLinks > 0 ? affiliateLinks / totalLinks : 0;

  subfunctions.monetizationAnalysis = {
    affiliateLinkCount: affiliateLinks,
    totalLinks,
    affiliateRatio: (affiliateRatio * 100).toFixed(1) + '%',
    safeThreshold: '30%',
    exceedsThreshold: affiliateRatio > 0.3,
    recommendation: affiliateRatio > 0.3 ? 'Reduce affiliate link density or add more editorial links' : 'Within acceptable range'
  };

  // Subfunction 6: E-E-A-T Signal Validation
  const eeat = validateEEATSignals($, text);
  subfunctions.eeatSignals = {
    score: eeat.totalScore,
    level: eeat.eeatLevel,
    hasAuthor: eeat.author.present,
    authorName: eeat.author.name,
    hasPublisher: eeat.publisher.present,
    hasDatePublished: eeat.datePublished.present,
    hasDateModified: eeat.dateModified.present,
    citationCount: eeat.citations.count,
    hasReferences: eeat.citations.hasReferences,
    factualClaimCount: eeat.factualClaims.count,
    hasDisclaimer: eeat.transparency.hasDisclaimer,
    hasAuthorBio: eeat.transparency.hasBio,
    missingSignals: [
      ...(!eeat.author.present ? ['Author attribution'] : []),
      ...(!eeat.publisher.present ? ['Publisher info'] : []),
      ...(!eeat.datePublished.present ? ['Published date'] : []),
      ...(eeat.citations.count === 0 ? ['External citations'] : [])
    ]
  };

  // Subfunction 7: Algorithm Resilience Scoring
  subfunctions.algorithmResilience = {
    helpfulContentScore: Math.min(100, (wc >= 1500 ? 20 : wc >= 800 ? 10 : 0) + (qThresholds.overallQuality >= 80 ? 20 : 10) + (subfunctions.serpFeatures.featuredSnippet.ready ? 15 : 0) + (eeat.totalScore >= 50 ? 20 : 5) + (lexicalDiversity > 0.3 ? 15 : 5) + (hasCitations ? 10 : 0)),
    vulnerablePatterns: [
      ...(wc < 300 ? ['Thin content (< 300 words)'] : []),
      ...(affiliateRatio > 0.3 ? ['High affiliate link density (> 30%)'] : []),
      ...(!eeat.author.present ? ['Missing author attribution (E-E-A-T)'] : []),
      ...(!hasCitations ? ['No authoritative external citations'] : []),
      ...(subfunctions.serpFeatures.featuredSnippet.ready === false && wc > 500 ? ['Not optimized for featured snippets'] : [])
    ],
    resilienceGrade: (() => {
      const s = (wc >= 1500 ? 20 : wc >= 800 ? 10 : 0) + (qThresholds.overallQuality >= 80 ? 20 : 10) + (eeat.totalScore >= 50 ? 20 : 5) + (lexicalDiversity > 0.3 ? 15 : 5) + (hasCitations ? 10 : 0);
      return s >= 70 ? 'A' : s >= 50 ? 'B' : s >= 30 ? 'C' : 'D';
    })()
  };

  // Subfunction 8: Zero-Click Risk Projection
  subfunctions.zeroClickRisk = {
    aiOverviewRisk: subfunctions.serpFeatures.aiOverview.score > 60 ? 'high - AI Overview may trigger for eligible queries' : 'low',
    featuredSnippetRisk: subfunctions.serpFeatures.featuredSnippet.ready ? 'moderate - snippet may reduce clicks but increase brand visibility' : 'low',
    estimatedCTRImpact: subfunctions.serpFeatures.aiOverview.score > 60 ? '-20% to -40% (qualitative projection, not measured)' : subfunctions.serpFeatures.featuredSnippet.ready ? '-10% to -20% (qualitative projection, not measured)' : 'minimal',
    mitigationStrategy: subfunctions.serpFeatures.aiOverview.score > 60 ? 'Add unique data points and analysis that AI Overviews would need to cite you as source' : 'Optimize for snippet eligibility to capture voice search share'
  };

  // Issues
  if (subfunctions.serpFeatures.aiOverview.score < 40 && wc > 300) {
    issues.push({ severity: 'warning', impact: 'high', message: 'Low AI Overview readiness: ' + subfunctions.serpFeatures.aiOverview.score + '/100. Add definitions, lists, tables, and authoritative citations for better visibility in AI Overviews.', element: 'AI Overview', fix: 'Structured content with definitions (X is Y), numbered lists (3+ items), comparison tables, and citations to .edu/.gov sources.', link: url });
    p += 8;
  }
  if (!subfunctions.serpFeatures.featuredSnippet.ready && wc > 500) {
    issues.push({ severity: 'warning', impact: 'medium', message: 'No featured snippet optimization. Google often pulls snippets from: definitions ("X is Y"), numbered lists, and comparison tables.', element: 'Featured Snippet', fix: 'Add: concise definition paragraph (40-60 words), numbered steps (3+), or comparison table with clear headers.', link: url });
    p += 6;
  }
  if (questionCount < 2 && wc > 500) {
    issues.push({ severity: 'info', impact: 'low', message: 'Only ' + questionCount + ' question-answer pairs found. People Also Ask triggers when content directly answers user questions.', element: 'PAA', fix: 'Add 3-5 FAQ-style questions with direct answers.', link: url });
    p += 3;
  }
  if (thinRatio > 50 && paragraphs.length > 0) {
    issues.push({ severity: 'warning', impact: 'medium', message: shortParagraphs.length + '/' + paragraphs.length + ' paragraphs thin (< 15 words). Google may consider this shallow content.', element: 'thin content', fix: 'Expand short paragraphs to 25-50 words each.', link: url });
    p += 6;
  }
  if (wc < 300) {
    issues.push({ severity: 'warning', impact: 'high', message: 'Thin content: only ' + wc + ' words. Helpful content system targets pages under 300 words.', element: 'content length', fix: 'Expand to 800-1500+ words with unique insights, examples, data.', link: url, evidence: wc + ' total words' });
    p += 12;
  }
  if (affiliateRatio > 0.3) {
    issues.push({ severity: 'warning', impact: 'medium', message: 'High affiliate/link ratio: ' + (affiliateRatio * 100).toFixed(1) + '% may trigger affiliate penalty. Google recommends under 30%.', element: 'affiliate links', fix: 'Add nofollow/sponsored rel to affiliate links. Add more editorial content links.', link: url });
    p += 6;
  }

  return {
    level: 8, name: 'Predictive SERP Volatility & Algorithm Impact Simulator',
    score: sc(p), issues,
    data: subfunctions
  };
  } catch (e) { return { level: 8, name: 'Predictive SERP Volatility & Algorithm Impact Simulator', score: 0, issues: [{ severity: 'critical', impact: 'critical', message: 'Level 8 analysis failed: ' + e.message, element: 'system' }], data: { error: e.message } }; }
}

function level9($, bodyText, url) {
  try {
  const issues = [];
  let p = 0;
  const text = bodyText || getTextContent($) || '';
  const wc = countWords(text);

  const title = $('title').first().text().trim();
  const metaDesc = ($('meta[name="description"]').attr('content') || '').trim();
  const h1 = $('h1').first().text().trim();
  const h1s = $('h1').length;

  const baseline = {
    title: { text: title, length: title.length, pixelWidth: pxWidth(title) },
    metaDescription: { text: metaDesc, length: metaDesc.length },
    h1: { text: h1, count: h1s },
    wordCount: wc,
    images: $('img').length,
    links: $('a[href]').length,
    internalLinks: $('a[href^="/"]').length,
    externalLinks: $('a[href^="http"]').not('a[href^="/"]').length,
    schemas: $('script[type="application/ld+json"]').length,
    h2Count: $('h2').length,
    h3Count: $('h3').length,
    paragraphs: $('p').length,
    ctaCount: $('a[href*="buy"], a[href*="signup"], a[href*="subscribe"], a[href*="register"], a[href*="download"], a[href*="trial"], a[href*="demo"], a[href*="contact"], [class*="cta"], button[type="submit"]').length
  };

  const testableElements = [];
  if (title) testableElements.push({ element: 'title', current: title.substring(0, 60), testable: true, variants: 3 });
  if (metaDesc) testableElements.push({ element: 'meta description', current: metaDesc.substring(0, 155), testable: true, variants: 3 });
  if (h1) testableElements.push({ element: 'H1', current: h1.substring(0, 60), testable: true, variants: 2 });
  $('[class*="cta"], a[href*="buy"], a[href*="signup"]').each((i, el) => {
    testableElements.push({ element: 'CTA ' + (i + 1), current: $(el).text().trim().substring(0, 40), testable: true, variants: 2, selector: sel($, el) });
  });

  const titleVariants = [];
  if (title) {
    const cleanTitle = title.replace(/[-|\u2013\u2014].*$/, '').trim();
    const brand = title.includes('|') ? title.split('|').pop().trim() : 'Brand';
    titleVariants.push(
      { variant: 'A (Control)', title: title, hypothesis: 'Current title - baseline', estimatedCTR: 'not measured (no A/B test run)', charCount: title.length },
      { variant: 'B (Front-loaded)', title: cleanTitle.substring(0, 55), hypothesis: 'Shorter, front-loaded version reduces truncation risk', estimatedCTR: 'not measured (no A/B test run)', charCount: Math.min(cleanTitle.length, 55) },
      { variant: 'C (Benefit-driven)', title: cleanTitle.substring(0, 40) + ': ' + brand, hypothesis: 'Adding benefit hook increases emotional engagement and CTR', estimatedCTR: 'not measured (no A/B test run)', charCount: Math.min(cleanTitle.length + 3, 65) }
    );
  }

  const metaVariants = [];
  if (metaDesc) {
    const firstSentence = text.split(/[.!?]+/).filter(s => s.trim().length > 30)[0] || metaDesc;
    metaVariants.push(
      { variant: 'A (Control)', description: metaDesc.substring(0, 155), hypothesis: 'Current meta description', charCount: Math.min(metaDesc.length, 155) },
      { variant: 'B (Benefit-first)', description: ('Discover ' + firstSentence.trim().substring(0, 130).replace(/^[Dd]iscover /, '').replace(/\"/g, '') + ' today.').substring(0, 155), hypothesis: 'Leading with benefit verb increases CTR', charCount: 155 },
      { variant: 'C (Question + Answer)', description: ('Looking for ' + title.split(/[-|]/)[0].trim().substring(0, 35) + '? ' + firstSentence.trim().substring(0, 110)).substring(0, 155), hypothesis: 'Question format mirrors search query', charCount: 155 }
    );
  }

  const catastrophicPatterns = [];
  if ($('meta[name="robots"]').attr('content') === 'noindex') {
    catastrophicPatterns.push('Page is noindex - catastrophic if deployed unintentionally');
    issues.push({ severity: 'critical', impact: 'critical', message: 'Page is set to noindex - a bad deployment could accidentally noindex the entire site.', element: 'noindex', fix: 'Ensure noindex is only applied intentionally.', link: url });
    p += 20;
  }
  if (!$('link[rel="canonical"]').length) {
    catastrophicPatterns.push('Missing canonical - URL drift risk during deployment');
    issues.push({ severity: 'warning', impact: 'high', message: 'Missing canonical - a deployment changing URL structure could cause duplicate content.', element: 'canonical', fix: 'Add self-referencing canonical tag to prevent URL drift.', link: url });
    p += 8;
  }

  const subfunctions = {};
  subfunctions.baseline = baseline;
  subfunctions.testability = {
    testableElements: testableElements.slice(0, 10),
    count: testableElements.length,
    score: Math.min(100, testableElements.length * 15 + (wc > 300 ? 10 : 0)),
    isTestable: testableElements.length >= 2
  };
  subfunctions.titleVariants = titleVariants;
  subfunctions.metaVariants = metaVariants;
  subfunctions.rollbackSafety = {
    catastrophicPatterns,
    riskLevel: catastrophicPatterns.length > 1 ? 'high' : catastrophicPatterns.length > 0 ? 'medium' : 'low',
    monitoringConfig: {
      metrics: ['organic_impressions', 'ctr', 'avg_position', 'indexed_pages', 'crawl_errors'],
      alertThresholds: { impressionsDrop: '-20%', ctrDrop: '-15%', positionDrop: '-3' },
      duration: '14 days minimum monitoring after deployment'
    }
  };
  subfunctions.statisticalSignificance = {
    minimumSampleSize: wc < 300 ? 'Insufficient content for testing' : wc < 800 ? '~500 sessions per variant' : wc < 1500 ? '~300 sessions per variant' : '~150 sessions per variant',
    recommendedDuration: baseline.ctaCount > 3 ? '2-4 weeks' : '4-8 weeks',
    confidenceLevel: '95% recommended (p < 0.05)'
  };

  if (testableElements.length < 2) {
    issues.push({ severity: 'info', impact: 'low', message: 'Only ' + testableElements.length + ' testable element(s). Need 2+ for A/B testing.', element: 'A/B test readiness', fix: 'Ensure: unique title tag, meta description, H1, and CTA.' });
    p += 2;
  }

  return { level: 9, name: 'SEO A/B Testing & Rollback Safety Guidance', score: sc(p), issues, data: subfunctions };
  } catch (e) { return { level: 9, name: 'SEO A/B Testing & Rollback Safety Guidance', score: 0, issues: [{ severity: 'critical', impact: 'critical', message: 'Level 9 analysis failed: ' + e.message, element: 'system' }], data: { error: e.message } }; }
}

function level10($, statusCode, redirects, url) {
  try {
  const issues = [];
  let p = 0;
  const status = parseInt(statusCode) || 200;
  const redirs = Array.isArray(redirects) ? redirects : [];

  const statusInfo = {
    code: status,
    class: Math.floor(status / 100) + 'xx',
    meaning: status === 200 ? 'OK' : status === 301 ? 'Moved Permanently' : status === 302 ? 'Found' : status === 404 ? 'Not Found' : status === 410 ? 'Gone' : status >= 500 ? 'Server Error' : 'Unknown',
    isError: status >= 400,
    isRedirect: status >= 300 && status < 400
  };

  if (status >= 500) {
    issues.push({ severity: 'critical', impact: 'critical', message: 'HTTP ' + status + ' server error - page completely inaccessible. Search engines will deindex after persistent 5xx.', element: 'HTTP status', fix: 'Check server logs, database connections, and server config. Deploy fix ASAP.', link: url, evidence: 'Status: ' + status });
    p += 30;
  } else if (status === 404) {
    const bodyText = $.html().toLowerCase();
    const looksLike404 = /page not found|404|not found|doesn't exist/i.test(bodyText);
    if (looksLike404 && status === 200) {
      issues.push({ severity: 'critical', impact: 'critical', message: 'Soft 404 detected - page returns 200 but content resembles a 404. Wastes crawl budget.', element: 'soft 404', fix: 'Return proper 404 status. If page should exist, add actual content.', link: url, evidence: '200 status with 404-like text' });
      p += 25;
    } else {
      issues.push({ severity: 'critical', impact: 'critical', message: 'HTTP 404 - page does not exist. Search engines will drop from index.', element: 'HTTP status', fix: 'Restore content, or 301 redirect to nearest relevant page.', link: url });
      p += 25;
    }
  } else if (status >= 300 && status < 400) {
    issues.push({ severity: 'info', impact: 'medium', message: 'HTTP ' + status + ' redirect - not a final destination. Every redirect hop adds latency and can spread link equity across URLs.', element: 'redirect', fix: 'Update to 301 if redirect should be permanent.', link: url });
    p += 3;
  }

  const urlsSeen = new Set();
  let loopFound = false;
  for (const r of redirs) {
    if (urlsSeen.has(r)) { loopFound = true; break; }
    urlsSeen.add(r);
  }

  const redirectChain = {
    length: redirs.length,
    chain: redirs,
    loopDetected: loopFound,
    excessive: redirs.length > 3,
    timeOverhead: redirs.length > 0 ? 'per-hop latency not measured (would require synthetic-browser timing per redirect)' : 'none',
    hopDetails: redirs.map((r, i) => ({ hop: i + 1, url: r, estimatedTimeMs: null, note: 'per-hop timing not measured' }))
  };

  if (loopFound) {
    issues.push({ severity: 'critical', impact: 'critical', message: 'Redirect loop detected! URL appears multiple times in chain. Browsers and crawlers will give up.', element: 'redirect loop', fix: 'Fix redirect config. Ensure chain A -> B -> C.', link: url, evidence: 'Loop in chain: ' + redirs.join(' -> ') });
    p += 30;
  } else if (redirs.length > 3) {
    issues.push({ severity: 'warning', impact: 'high', message: 'Excessive redirect chain: ' + redirs.length + ' hops. Each hop adds network latency and can spread link equity across multiple URLs.', element: 'redirect chain', fix: 'Flatten chain to max 1 redirect. Update internal links to final URL.', link: url, evidence: redirs.join(' -> ') });
    p += 12;
  }

  let u;
  try { u = new URL(url); } catch { u = null; }

  let sessionParams = [];
  let paramCount = 0;
  let crawlEfficiency = 100;

  if (u) {
    const params = [...u.searchParams.entries()];
    paramCount = params.length;
    const paramKeys = params.map(([k]) => k.toLowerCase());
    const sessionPatterns = ['session', 'sid', 'phpsessid', 'jsessionid', 'token', 'fbclid', 'gclid', 'utm_source'];
    sessionParams = paramKeys.filter(k => sessionPatterns.some(p => k.includes(p)));

    if (sessionParams.length > 0) {
      issues.push({ severity: 'warning', impact: 'high', message: 'Session/tracking parameters in URL: ' + sessionParams.join(', ') + '. Creates infinite crawlable URLs, wasting crawl budget.', element: 'crawl budget', fix: 'Move session IDs to cookies. Configure Search Console to ignore tracking params.', link: url, evidence: 'Params: ' + sessionParams.join(', ') });
      p += 10;
      crawlEfficiency -= 20;
    }
    if (paramCount > 5) {
      issues.push({ severity: 'warning', impact: 'high', message: paramCount + ' URL parameters - potential crawl black hole. Each parameter combination creates a unique URL.', element: 'crawl budget', fix: 'Canonicalize all parameter variations. Set self-referencing canonical.', link: url, evidence: paramCount + ' parameters found' });
      p += 8;
      crawlEfficiency -= 15;
    }
    if (u.pathname !== u.pathname.toLowerCase()) {
      issues.push({ severity: 'info', impact: 'low', message: 'URL has uppercase characters - may cause duplicate content issues.', element: 'URL casing', fix: 'Use lowercase URLs consistently.', link: url });
      p += 2;
    }
    crawlEfficiency = Math.max(0, crawlEfficiency - redirs.length * 10 - (u.pathname.split('/').filter(Boolean).length > 4 ? 5 : 0));
  }

  const wc = countWords($('body').text().replace(/\s+/g, ' ').trim());

  const freshnessScore = ($('meta[property="article:published_time"]').length ? 30 : 0) + ($('meta[property="article:modified_time"]').length ? 30 : 0) + ($('[rel="author"]').length ? 15 : 0) + ($('time').length > 1 ? 25 : 0);
  const estimatedCrawlFrequency = 'Not measured — actual crawl frequency depends on Google\'s internal signals (site authority, content freshness, crawl demand) and cannot be derived from a single page fetch. Freshness-signal score: ' + freshnessScore + '/100 (on-page recency markers only).';

  const crawlBudgetWaste = [];
  if (wc < 200) crawlBudgetWaste.push('Thin content (' + wc + ' words)');
  if (sessionParams.length > 0) crawlBudgetWaste.push('Infinite URL permutations from tracking params');
  if (redirs.length > 3) crawlBudgetWaste.push('Excessive redirect chain');

  const subfunctions = {};
  subfunctions.statusCode = statusInfo;
  subfunctions.redirectChain = redirectChain;
  subfunctions.crawlBudget = {
    urlAnalysis: u ? { path: u.pathname, pathDepth: u.pathname.split('/').filter(Boolean).length, paramCount, isClean: paramCount === 0 && u.pathname === u.pathname.toLowerCase() } : null,
    sessionParams,
    parametricRisk: paramCount > 5 ? 'high' : paramCount > 2 ? 'medium' : 'low',
    crawlEfficiency: { score: crawlEfficiency, label: crawlEfficiency >= 80 ? 'good' : crawlEfficiency >= 50 ? 'fair' : 'poor' }
  };
  subfunctions.botBehavior = {
    freshnessSignals: {
      hasDatePublished: $('meta[property="article:published_time"]').length > 0,
      hasDateModified: $('meta[property="article:modified_time"]').length > 0
    },
    estimatedCrawlFrequency,
    crawlBudgetWaste
  };
  subfunctions.logStreamConfig = {
    note: 'Template field mappings only — this tool does NOT connect to or instrument your logging infrastructure. Set these up in your own Cloudflare/CloudWatch/Datadog accounts to start measuring; the example field names below must match your real log schema.',
    cloudflare: { type: 'Cloudflare Logpush (example)', fields: 'ClientIP, ClientRequestHost, ClientRequestURI, EdgeResponseStatus, EdgeStartTimestamp, EdgeDurationMs, CacheCacheStatus' },
    cloudwatch: { type: 'CloudWatch Logs (example)', logGroup: '<your-log-group, e.g. /aws/seo-audit/crawl-budget>', fields: ['timestamp', 'url', 'status', 'userAgent', 'durationMs', 'isBot'] },
    datadog: { type: 'Datadog Logs (example)', logSource: '<your-log-source>', tags: ['env:<your-env>', 'team:<your-team>'], monitorQuery: '<add your own query against metrics you actually emit>' }
  };

  return { level: 10, name: 'Bot Behavior Mapping & Log Config Templates', score: sc(p), issues, data: subfunctions };
  } catch (e) { return { level: 10, name: 'Bot Behavior Mapping & Log Config Templates', score: 0, issues: [{ severity: 'critical', impact: 'critical', message: 'Level 10 analysis failed: ' + e.message, element: 'system' }], data: { error: e.message } }; }
}

function level11($, bodyText, url) {
  try {
  const issues = [];
  let p = 0;
  const text = bodyText || getTextContent($) || '';

  const agentResult = analyzeSyntheticAgentBehavior(text);
  const chunkResult = ragChunkSimulator(text);

  const ctaSelectors = [
    'a[href*="buy"]', 'a[href*="signup"]', 'a[href*="subscribe"]', 'a[href*="register"]',
    'a[href*="download"]', 'a[href*="trial"]', 'a[href*="demo"]', 'a[href*="contact"]',
    'a[href*="get-started"]', 'button[type="submit"]', '[class*="cta"]', '[class*="btn-primary"]'
  ];
  let totalCtas = 0;
  let accessibleCtas = 0;
  const ctaIssues = [];

  ctaSelectors.forEach(selStr => {
    $(selStr).each((i, el) => {
      totalCtas++;
      const elText = $(el).text().trim();
      const ariaLabel = $(el).attr('aria-label') || '';
      const href = $(el).attr('href') || '';
      const hasVisibleText = elText.length > 0 || ariaLabel.length > 0;
      const isJsRequired = href.startsWith('javascript:') || href === '#';
      const isAccessible = hasVisibleText && !isJsRequired;
      if (isAccessible) accessibleCtas++;
      if (!hasVisibleText) ctaIssues.push({ selector: sel($, el), issue: 'CTA has no readable text - AI agents cannot identify this as actionable', recommendation: 'Add text content or aria-label' });
      if (isJsRequired) ctaIssues.push({ selector: sel($, el), issue: 'CTA requires JavaScript - headless agents may fail to trigger', recommendation: 'Use native <a href="..."> with server-side routing' });
    });
  });

  const ctaParsability = {
    total: totalCtas,
    accessible: accessibleCtas,
    inaccessible: totalCtas - accessibleCtas,
    score: totalCtas > 0 ? Math.round((accessibleCtas / totalCtas) * 100) : 100,
    issues: ctaIssues.slice(0, 10)
  };

  if (totalCtas > 0 && accessibleCtas < totalCtas) {
    issues.push({ severity: 'warning', impact: 'high', message: (totalCtas - accessibleCtas) + '/' + totalCtas + ' CTAs not parsable by AI agents. Headless browsers and LLM crawlers may fail to understand conversion paths.', element: 'CTA accessibility', fix: 'Use semantic HTML: <a href="...">Visible Text</a> instead of JS-driven buttons.', link: url, evidence: (totalCtas - accessibleCtas) + ' CTAs with missing text or JS dependency' });
    p += 8;
  }

  const forms = $('form');
  let accessibleForms = 0;
  const formIssues = [];

  forms.each((i, el) => {
    const action = $(el).attr('action') || '';
    const inputs = $(el).find('input, textarea, select');
    const inputCount = inputs.length;
    const hasSubmit = $(el).find('button[type="submit"], input[type="submit"]').length > 0;
    const inputsWithLabels = inputs.filter((_, inp) => {
      const id = $(inp).attr('id');
      return $(inp).attr('aria-label') || (id && $(el).find('label[for="' + id + '"]').length) || $(inp).closest('label').length;
    }).length;
    if (inputCount > 0 && inputsWithLabels === inputCount && hasSubmit) accessibleForms++;
    if (inputCount > 0 && !hasSubmit) formIssues.push({ form: i, issue: 'Form missing submit button - AI agents cannot complete submission', recommendation: 'Add <button type="submit">' });
    if (inputsWithLabels < inputCount) formIssues.push({ form: i, issue: (inputCount - inputsWithLabels) + ' inputs without labels', recommendation: 'Add labels or aria-labels to all inputs' });
    if (!action) formIssues.push({ form: i, issue: 'Form missing action attribute', recommendation: 'Set action="URL" for server-side form handling' });
  });

  const formAccessibility = {
    total: forms.length,
    accessible: accessibleForms,
    score: forms.length > 0 ? Math.round((accessibleForms / forms.length) * 100) : 100,
    issues: formIssues.slice(0, 10)
  };

  if (formIssues.length > 0) {
    issues.push({ severity: 'warning', impact: 'medium', message: formIssues.length + ' form accessibility issues. AI agents cannot reliably submit forms without labels and submit buttons.', element: 'forms', fix: 'Ensure all inputs have labels and forms have visible submit buttons.', link: url });
    p += 6;
  }

  const jsDependentElements = [];
  $('[data-js], [v-if], [v-show], [ng-if], [ng-show], [x-show]').each((i, el) => {
    const textContent = $(el).text().trim();
    if (textContent.length > 10) jsDependentElements.push({ tag: (el.tagName || '').toLowerCase(), selector: sel($, el), textPreview: textContent.substring(0, 60) });
  });

  const jsDependency = {
    count: jsDependentElements.length,
    elements: jsDependentElements.slice(0, 10),
    score: jsDependentElements.length > 0 ? Math.max(0, 100 - jsDependentElements.length * 5) : 100,
    risk: jsDependentElements.length > 5 ? 'high' : jsDependentElements.length > 0 ? 'medium' : 'low'
  };

  if (jsDependentElements.length > 5) {
    issues.push({ severity: 'warning', impact: 'medium', message: jsDependentElements.length + ' elements only render with JavaScript - headless AI agents and some crawlers will miss this content.', element: 'JS-dependent content', fix: 'Use server-side rendering. Ensure critical content renders without JS.', link: url, evidence: jsDependentElements.length + ' JS-dependent elements' });
    p += 6;
  }

  const overallScore = Math.round((ctaParsability.score + formAccessibility.score + jsDependency.score) / 3);
  const agenticLevel = overallScore >= 80 ? 'advanced - AI agent ready' : overallScore >= 60 ? 'moderate - improvements needed' : 'low - significant changes needed';

  const structuredData = extractSchemas($);
  const hasTableData = $('table').filter((_, el) => $(el).find('tr').length >= 3).length > 0;
  const hasListData = $('ol, ul').filter((_, el) => $(el).find('li').length >= 4).length > 0;
  const entityCount = extractEntities(text).length;
  const hasKeyFacts = (/\b\d+%|\$\d+|\d+ (million|billion|thousand)|according to/i).test(text);

  const machineReadableScore = Math.min(100, (hasTableData ? 30 : 0) + (hasListData ? 25 : 0) + (hasKeyFacts ? 20 : 0) + (entityCount > 5 ? 15 : 0) + (structuredData.length > 0 ? 10 : 0));

  if (machineReadableScore < 30 && text.length > 500) {
    issues.push({ severity: 'warning', impact: 'high', message: 'Low machine-readability score (' + machineReadableScore + '/100). Content mostly prose without structured formats LLMs can extract.', element: 'machine readability', fix: 'Add: data tables, numbered/bullet lists, definition lists, key stat callouts.', link: url });
    p += 8;
  }

  const semanticElements = {
    article: $('article').length, section: $('section').length, nav: $('nav').length,
    aside: $('aside').length, main: $('main').length, header: $('header').length,
    footer: $('footer').length, figure: $('figure').length, figcaption: $('figcaption').length,
    time: $('time').length, blockquote: $('blockquote').length, code: $('code').length
  };
  const totalSemantic = Object.values(semanticElements).reduce((a, b) => a + b, 0);

  if (totalSemantic < 3 && text.length > 300) {
    issues.push({ severity: 'info', impact: 'medium', message: 'Few semantic HTML elements (' + totalSemantic + '). LLMs use semantic structure to understand content hierarchy.', element: 'semantic HTML', fix: 'Use <article>, <section>, <nav>, <main>, <figure>, <time>, <blockquote>.', link: url });
    p += 4;
  }

  const entityClarityScore = Math.min(100, (structuredData.length > 0 ? 25 : 0) + (entityCount > 10 ? 20 : entityCount > 5 ? 10 : 0) + (hasTableData ? 20 : 0) + (hasListData ? 15 : 0) + (hasKeyFacts ? 10 : 0) + (totalSemantic >= 5 ? 10 : 0));
  const multiFormatScore = Math.min(100, (structuredData.length > 0 ? 25 : 0) + ((hasTableData || hasListData) ? 25 : 0) + (totalSemantic >= 5 ? 20 : 0) + (hasKeyFacts ? 15 : 0) + (entityCount > 10 ? 15 : 0));

  const chunkAvgScore = chunkResult.avgRetrievabilityScore || 0;
  if (chunkAvgScore < 50 && chunkResult.totalChunks > 1) {
    issues.push({ severity: 'warning', impact: 'medium', message: 'Low RAG chunk self-containment (' + chunkAvgScore + '/100). Content chunks may lose meaning when extracted for vector retrieval.', element: 'RAG readiness', fix: 'Each paragraph should be self-contained: include entity context, avoid cross-references like "as discussed above".', link: url });
    p += 6;
  }

  const subfunctions = {};
  subfunctions.syntheticAgentBehavior = agentResult;
  subfunctions.ragChunkSimulation = chunkResult;
  subfunctions.agenticReadiness = {
    ctaParsability,
    formAccessibility,
    jsDependency,
    overall: { score: overallScore, level: agenticLevel }
  };
  subfunctions.llmReadiness = {
    entityClarity: { score: entityClarityScore, totalEntities: entityCount },
    machineReadableFormats: { score: machineReadableScore, formats: { tables: hasTableData, lists: hasListData, keyFacts: hasKeyFacts, entities: entityCount } },
    semanticMarkup: { elements: semanticElements, totalSemanticElements: totalSemantic, score: Math.min(100, totalSemantic * 5) },
    multiFormatReadiness: {
      score: multiFormatScore,
      structuredData: structuredData.length > 0,
      machineReadable: hasTableData || hasListData,
      entityRich: entityCount > 10,
      comprehensive: structuredData.length > 0 && (hasTableData || hasListData) && entityCount > 5
    }
  };
  subfunctions.chunkSelfContainment = {
    avgRetrievabilityScore: chunkAvgScore,
    totalChunks: chunkResult.totalChunks,
    score: chunkAvgScore,
    lowQualityChunks: (chunkResult.retrievabilityScores || []).filter(c => c.retrievabilityScore < 50).length
  };

  return { level: 11, name: 'Synthetic Content & LLM Visibility Heuristics', score: sc(p), issues, data: subfunctions };
  } catch (e) { return { level: 11, name: 'Synthetic Content & LLM Visibility Heuristics', score: 0, issues: [{ severity: 'critical', impact: 'critical', message: 'Level 11 analysis failed: ' + e.message, element: 'system' }], data: { error: e.message } }; }
}

function level12($, bodyText, url, config) {
  try {
  const issues = [];
  let p = 0;
  const text = bodyText || getTextContent($) || '';
  const wc = countWords(text);
  const subfunctions = {};
  const data = subfunctions;

  const helpfulContent = calculateUnhelpfulContentRatio(text);
  data.helpfulContent = helpfulContent;

  if (helpfulContent.helpfulRatio < 40) {
    issues.push({ severity: 'critical', impact: 'high', message: 'Helpful content ratio critically low: ' + helpfulContent.helpfulRatio + '%. ' + helpfulContent.genericSentences + ' generic sentences and ' + helpfulContent.unhelpfulShortSentences + ' overly short sentences detected — Google Helpful Content System targets pages with low originality.', element: 'content quality', fix: 'Rewrite generic template sentences with unique insights. Remove thin short sentences (< 20 chars) or expand them. Add original research, personal experience, data points.', link: url, evidence: 'Helpful ratio: ' + helpfulContent.helpfulRatio + '%, Generic: ' + helpfulContent.genericSentences + ', Thin: ' + helpfulContent.unhelpfulShortSentences, recommendation: 'Aim for > 70% helpful content ratio' });
    p += 15;
  } else if (helpfulContent.helpfulRatio < 70) {
    issues.push({ severity: 'warning', impact: 'high', message: 'Moderate helpful content ratio: ' + helpfulContent.helpfulRatio + '%. ' + helpfulContent.genericSentences + ' sentences flagged as generic/templated — may be at risk under Helpful Content Update.', element: 'content quality', fix: 'Review flagged generic sentences and replace with original analysis, data, or expert commentary.', link: url, evidence: 'Helpful ratio: ' + helpfulContent.helpfulRatio + '%' });
    p += 8;
  }

  const paragraphs = $('p').filter((i, el) => $(el).text().trim().length > 20);
  const paraTexts = paragraphs.map((i, el) => $(el).text().trim()).get();
  const boilerplatePatterns = [/\b(contact us|learn more|click here|read more|for more information|please feel free|don.?t hesitate)\b/i];
  let boilerplateCount = 0;
  paraTexts.forEach(pt => { boilerplatePatterns.forEach(bp => { if (bp.test(pt)) boilerplateCount++; }); });
  data.boilerplateContent = { count: boilerplateCount, totalParagraphs: paraTexts.length, ratio: paraTexts.length > 0 ? ((boilerplateCount / paraTexts.length) * 100).toFixed(1) + '%' : '0%' };
  if (boilerplateCount > 0) {
    issues.push({ severity: 'info', impact: 'medium', message: boilerplateCount + ' boilerplate/templated paragraph(s) detected (' + data.boilerplateContent.ratio + ' of content). Repeated templated content across pages reduces uniqueness signals.', element: 'content', fix: 'Replace templated phrases with page-specific original content.', link: url });
    p += Math.min(5, boilerplateCount * 2);
  }

  const sectionTexts = [];
  $('section, article, div[class*="content"], div[class*="section"], main').each((i, el) => {
    const st = $(el).text().trim();
    if (st.length > 50) sectionTexts.push(st);
  });
  if (sectionTexts.length === 0) {
    paraTexts.forEach(pt => { if (pt.length > 50) sectionTexts.push(pt); });
  }
  const sectionEntities = sectionTexts.map(st => {
    const ents = extractEntities(st);
    return ents.slice(0, 5).map(e => e[0]);
  });
  const uniqueSectionEntities = new Set();
  sectionEntities.forEach(se => se.forEach(e => uniqueSectionEntities.add(e)));
  const sectionUniqueness = sectionTexts.length > 0 ? (uniqueSectionEntities.size / Math.max(1, sectionTexts.length)) : 0;
  data.sectionUniqueness = { sections: sectionTexts.length, uniqueEntitySpread: uniqueSectionEntities.size, score: Math.min(100, Math.round(sectionUniqueness * 20)) };
  if (sectionUniqueness < 2 && sectionTexts.length > 2) {
    issues.push({ severity: 'warning', impact: 'medium', message: 'Low section-level uniqueness: only ' + uniqueSectionEntities.size + ' unique entities across ' + sectionTexts.length + ' sections. Sections may share too much repetitive phrasing.', element: 'content structure', fix: 'Diversify language across sections. Each section should introduce new entities and concepts rather than reusing the same phrases.', link: url });
    p += 6;
  }

  const eeat = validateEEATSignals($, text);
  data.eeatSignals = eeat;

  if (eeat.totalScore < 40) {
    issues.push({ severity: 'critical', impact: 'high', message: 'Weak E-E-A-T signals (score: ' + eeat.totalScore + '/100). Missing: ' + (!eeat.author.present ? 'author attribution, ' : '') + (!eeat.publisher.present ? 'publisher info, ' : '') + (!eeat.datePublished.present ? 'published date, ' : '') + (eeat.citations.count === 0 ? 'authoritative citations, ' : '') + (!eeat.transparency.hasDisclaimer ? 'disclaimer, ' : '') + '— Google\'s Quality Rater Guidelines require Experience, Expertise, Authoritativeness, Trustworthiness for YMYL topics.', element: 'E-E-A-T', fix: 'Add: author byline with bio, published date, publisher name/organization schema, citations to .edu/.gov sources, transparent disclosures, and references section.', link: url, evidence: 'E-E-A-T score: ' + eeat.totalScore + '/100. Author: ' + (eeat.author.present ? 'present' : 'missing') + ', Publisher: ' + (eeat.publisher.present ? 'present' : 'missing') + ', Citations: ' + eeat.citations.count, recommendation: 'Target E-E-A-T score > 70 by adding author, date, citations, and transparency signals' });
    p += 15;
  } else if (eeat.totalScore < 70) {
    issues.push({ severity: 'warning', impact: 'high', message: 'Moderate E-E-A-T signals (' + eeat.totalScore + '/100). Strengthen authority with more citations and transparency elements.', element: 'E-E-A-T', fix: 'Add more external citations, author credentials, and references section.', link: url, evidence: 'E-E-A-T score: ' + eeat.totalScore + '/100' });
    p += 7;
  }

  const orgSchema = $('script[type="application/ld+json"]').filter((i, el) => {
    try { const d = JSON.parse($(el).html() || '{}'); const arr = Array.isArray(d) ? d : [d]; return arr.some(s => s['@type'] === 'Organization'); } catch { return false; }
  });
  const authorSchema = $('script[type="application/ld+json"]').filter((i, el) => {
    try { const d = JSON.parse($(el).html() || '{}'); const arr = Array.isArray(d) ? d : [d]; return arr.some(s => s['@type'] === 'Person' || (s.author && s.author['@type'] === 'Person')); } catch { return false; }
  });
  data.schemaSignals = {
    hasOrganizationSchema: orgSchema.length > 0,
    hasAuthorSchema: authorSchema.length > 0,
    hasLogo: $('[itemprop="logo"], meta[property="og:image"]').length > 0,
    hasSocialLinks: $('a[href*="facebook.com"], a[href*="twitter.com"], a[href*="linkedin.com"], a[href*="instagram.com"]').length > 0,
    hasContactInfo: $('a[href^="tel:"], a[href^="mailto:"], [itemprop="telephone"]').length > 0
  };
  if (!data.schemaSignals.hasOrganizationSchema) {
    issues.push({ severity: 'warning', impact: 'medium', message: 'No Organization schema found — missing trust signal. Organization schema with logo, URL, and contact info helps Google understand your brand entity.', element: 'JSON-LD', fix: 'Add Organization schema with name, logo (112x112px min), URL, and social profiles.', link: url });
    p += 5;
  }
  if (!data.schemaSignals.hasSocialLinks) {
    issues.push({ severity: 'info', impact: 'low', message: 'No social profile links found — linking to verified social profiles (Facebook, Twitter, LinkedIn, Instagram) strengthens entity authority.', element: 'social links', fix: 'Add links to your verified social media profiles.', link: url });
    p += 2;
  }

  const eduGovLinks = $('a[href*=".edu"], a[href*=".gov"], a[href*=".ac."], a[href*="research"], a[href*="sciencedirect"], a[href*="ncbi"], a[href*="pubmed"], a[href*="scholar.google"]').length;
  const externalLinks = $('a[href^="http"]').filter((i, el) => {
    try { const h = $(el).attr('href') || ''; const pu = new URL(url).hostname; const lu = new URL(h).hostname; return lu !== pu; } catch { return false; }
  }).length;
  data.citationAnalysis = { eduGovLinks, totalExternal: externalLinks, citationRatio: externalLinks > 0 ? ((eduGovLinks / externalLinks) * 100).toFixed(1) + '%' : '0%' };
  if (eduGovLinks === 0 && externalLinks > 0) {
    issues.push({ severity: 'info', impact: 'medium', message: 'No .edu or .gov citations among ' + externalLinks + ' external links. Authoritative citations from academic or government sources significantly boost E-E-A-T.', element: 'external links', fix: 'Cite authoritative sources: research papers, government data, academic studies, official statistics.', link: url });
    p += 4;
  }

  const qualityThresholds = calculateQualityThresholds(text);
  data.qualityThresholds = qualityThresholds;
  if (qualityThresholds.overallQuality < 50) {
    issues.push({ severity: 'warning', impact: 'high', message: 'Low content quality score: ' + qualityThresholds.overallQuality + '/100. Content lacks sufficient structural elements (headings, lists, images) for its word count.', element: 'content structure', fix: 'Add more: descriptive headings, bullet/numbered lists, relevant images with alt text, bold/emphasis formatting for key points.', link: url, evidence: 'Quality score: ' + qualityThresholds.overallQuality + '/100' });
    p += 8;
  }

  const paraLengthArr = paragraphs.map((i, el) => $(el).text().trim().split(/\s+/).length).get();
  const avgParaLen = paraLengthArr.length > 0 ? paraLengthArr.reduce((a, b) => a + b, 0) / paraLengthArr.length : 0;
  const shortParas = paraLengthArr.filter(l => l < 10).length;
  const longParas = paraLengthArr.filter(l => l > 80).length;
  data.paragraphDistribution = { total: paraLengthArr.length, avgWords: Math.round(avgParaLen), shortUnder10: shortParas, longOver80: longParas, distribution: 'avg ' + Math.round(avgParaLen) + ' words/para' };
  if (shortParas > paraLengthArr.length * 0.4 && paraLengthArr.length > 5) {
    issues.push({ severity: 'warning', impact: 'medium', message: shortParas + '/' + paraLengthArr.length + ' paragraphs are very short (< 10 words). Excessive short paragraphs may appear as thin, fragmented content.', element: 'paragraphs', fix: 'Merge short paragraphs or expand them to 20-50 words with substantive content.', link: url });
    p += 5;
  }

  const aiPatterns = detectAIPatterns(text);
  data.aiPatternDetection = aiPatterns;
  if (aiPatterns.score > 50) {
    issues.push({ severity: 'warning', impact: 'high', message: 'AI-generated content patterns detected (score: ' + aiPatterns.score + '/100). ' + aiPatterns.matches.length + ' AI-buzzword or template patterns found — Google Helpful Content Update targets AI-generated text without original value.', element: 'content authenticity', fix: 'Rewrite flagged sections with: original research, personal experience, expert opinions, unique data, case studies, and specific examples.', link: url, evidence: 'AI pattern score: ' + aiPatterns.score + '/100. Flagged patterns: ' + aiPatterns.matches.slice(0, 8).map(m => m.pattern + ' (' + m.count + 'x)').join(', '), recommendation: 'Aim for AI pattern score under 20. Each flagged section reduces content authenticity signals.' });
    p += 10;
  } else if (aiPatterns.score > 20) {
    issues.push({ severity: 'info', impact: 'medium', message: 'Some AI-like content patterns detected (score: ' + aiPatterns.score + '/100) — review flagged sections for originality.', element: 'content authenticity', fix: 'Review and rewrite any detected AI-like phrasing with original voice.', link: url });
    p += 3;
  }

  const qualityFlags = detectContentQualityFlags(text);
  data.qualityFlags = qualityFlags;
  if (qualityFlags.some(f => f.type === 'subjectivity')) {
    issues.push({ severity: 'info', impact: 'low', message: 'Subjective language detected ("I think", "I believe", "I feel") — weakens perceived authority. Use factual statements and data-driven claims instead.', element: 'writing style', fix: 'Replace "I think/believe" with evidence-backed statements. Cite sources for claims.', link: url });
    p += 2;
  }

  const readability = analyzeReadabilityAdvanced(text);
  data.readability = readability;
  if (readability.fleschKincaidGrade > 14) {
    issues.push({ severity: 'warning', impact: 'medium', message: 'Content reading level is very complex (grade ' + readability.fleschKincaidGrade + ', level: ' + readability.readabilityLevel + '). Google may prefer content accessible to broader audiences (6th-8th grade level).', element: 'readability', fix: 'Simplify: use shorter sentences (15-20 words), simpler vocabulary, active voice, and break complex concepts into digestible chunks.', link: url, evidence: 'FK Grade: ' + readability.fleschKincaidGrade + ', words/sentence: ' + readability.avgWordsPerSentence });
    p += 5;
  }

  const contentStruct = analyzeContentStructure(text);
  data.contentStructure = contentStruct;
  if (wc > 500 && contentStruct.questions < 2) {
    issues.push({ severity: 'info', impact: 'medium', message: 'Only ' + contentStruct.questions + ' questions in content. Adding question-driven subheadings ("How does X work?", "Why is Y important?") aligns with search query intent and featured snippet opportunities.', element: 'content', fix: 'Add FAQ-style sections with natural language questions that users search for.', link: url });
    p += 3;
  }

  const entities = extractKnowledgeGraphEntities(text);
  data.entities = entities.slice(0, 30);
  const entityTypes = [...new Set(entities.map(e => e.type))];
  data.entityTypeCoverage = entityTypes;
  if (entities.length < 3 && wc > 300) {
    issues.push({ severity: 'warning', impact: 'medium', message: 'Very few knowledge graph entities detected (' + entities.length + '). Pages with rich entity coverage (people, places, organizations, dates, statistics) tend to rank higher for informational queries.', element: 'entity optimization', fix: 'Include: named entities (brands, people, places), dates, statistics, percentages, monetary values, and product names in your content.', link: url, evidence: entities.length + ' entities, types: ' + entityTypes.join(', ') });
    p += 6;
  }

  const h1Text = $('h1').first().text().trim() || '';
  const pageTopic = h1Text || $('title').first().text().trim() || '';
  const topicEntities = extractEntities(pageTopic).map(e => e[0].toLowerCase());
  const contentEntityNames = entities.map(e => e.entity.toLowerCase());
  const entityOverlap = topicEntities.length > 0 ? topicEntities.filter(te => contentEntityNames.some(ce => ce.includes(te) || te.includes(ce))).length / topicEntities.length : 1;
  data.entityTopicAlignment = { topic: pageTopic.substring(0, 100), topicEntities: topicEntities.slice(0, 10), pageEntities: contentEntityNames.slice(0, 20), overlapRatio: Math.round(entityOverlap * 100) + '%', aligned: entityOverlap > 0.3 };
  if (entityOverlap < 0.3 && topicEntities.length > 1) {
    issues.push({ severity: 'warning', impact: 'high', message: 'Entity mismatch detected: page topic "' + pageTopic.substring(0, 60) + '" has only ' + Math.round(entityOverlap * 100) + '% entity overlap with page content. Content entities (' + contentEntityNames.slice(0, 5).join(', ') + ') do not strongly align with topic entities (' + topicEntities.slice(0, 5).join(', ') + ').', element: 'content topic alignment', fix: 'Ensure content body entities directly support and elaborate on the topic declared in the H1 and title.', link: url });
    p += 8;
  }

  const entityConsensusResults = [];
  topicEntities.slice(0, 5).forEach(te => {
    if (te.length > 3) {
      const cr = crossReferenceEntityConsensus(te, text, '');
      entityConsensusResults.push({ entity: te, consensusRatio: cr.consensusRatio, consensusLevel: cr.consensusLevel, sourcesMentioning: cr.sourcesMentioning });
    }
  });
  data.entityConsensus = entityConsensusResults;
  const weakConsensusEntities = entityConsensusResults.filter(e => e.consensusLevel === 'weak/no consensus');
  if (weakConsensusEntities.length > 0) {
    issues.push({ severity: 'info', impact: 'low', message: weakConsensusEntities.length + ' topic entit(ies) appear weakly across the page content. This measures on-page consistency only — external knowledge-base verification was NOT performed.', element: 'entity verification', fix: 'Reference the topic entities consistently in headings and body. For external support, add citations from authoritative sources.', link: url });
    p += 3;
  }

  const searchIntentSignals = {
    hasDefinition: (text.match(/\b(is|are|refers to|means|defined as)\s+(a|an|the)\s+/gi) || []).length > 0,
    hasHowTo: (text.match(/\b(how to|steps? to|guide to|tutorial|walkthrough)\b/gi) || []).length > 0,
    hasComparison: (/\b(vs|versus|compared to|better than|alternative|vs\.)\b/i.test(text)),
    hasList: $('ol, ul').filter((i, el) => $(el).find('li').length >= 3).length > 0,
    hasData: (text.match(/\d+\.?\d*%|\$\d+|\d+ (million|billion|thousand)/g) || []).length > 0,
    hasFAQ: (text.match(/\b(how|what|why|when|where|who|can|does)\b\s+[^?]+\?/gi) || []).length >= 3
  };
  data.searchIntent = searchIntentSignals;
  const intentScore = Object.values(searchIntentSignals).filter(Boolean).length * 16.67;
  data.searchIntentScore = Math.round(intentScore);
  if (intentScore < 50 && wc > 400) {
    issues.push({ severity: 'warning', impact: 'medium', message: 'Content may not fully satisfy search intent (score: ' + Math.round(intentScore) + '/100). Missing: ' + Object.entries(searchIntentSignals).filter(([, v]) => !v).map(([k]) => k.replace(/([A-Z])/g, ' $1').toLowerCase()).join(', ') + '.', element: 'search intent', fix: 'Add: definition paragraphs, how-to steps, comparison tables, lists, data/statistics, or FAQ sections depending on query intent.', link: url });
    p += 6;
  }

  const contentToCodeRatio = (() => {
    const textLen = text.length;
    const htmlLen = $.html().length;
    return htmlLen > 0 ? Math.round((textLen / htmlLen) * 100) : 0;
  })();
  data.contentToCodeRatio = contentToCodeRatio + '%';
  if (contentToCodeRatio < 10 && wc > 200) {
    issues.push({ severity: 'info', impact: 'low', message: 'Low content-to-code ratio (' + contentToCodeRatio + '%). Page has excessive HTML markup relative to visible text content. Google may extract less text value for ranking.', element: 'content efficiency', fix: 'Reduce unnecessary wrapper divs, inline scripts, and verbose HTML. Use semantic elements.', link: url });
    p += 2;
  }

  const freshnessSignals = {
    hasDatePublished: $('meta[property="article:published_time"], time[datetime], [itemprop="datePublished"]').length > 0,
    hasDateModified: $('meta[property="article:modified_time"], [itemprop="dateModified"]').length > 0,
    hasFreshness: (text.match(/\b(202[4-9]|203[0-9])\b/g) || []).length > 0
  };
  data.freshnessSignals = freshnessSignals;
  const freshnessScore = (freshnessSignals.hasDatePublished ? 35 : 0) + (freshnessSignals.hasDateModified ? 30 : 0) + (freshnessSignals.hasFreshness ? 35 : 0);
  data.freshnessScore = freshnessScore;
  if (freshnessScore < 35 && wc > 300) {
    issues.push({ severity: 'info', impact: 'medium', message: 'Weak freshness signals (score: ' + freshnessScore + '/100). Google prefers recently updated content. Missing published date, modified date, or recent year references.', element: 'content freshness', fix: 'Add published date meta tag, last modified date, and ensure content references current data and events.', link: url });
    p += 3;
  }

  return { level: 12, name: 'Algorithmic Quality & Helpful-Content Classifier', score: sc(p), issues, data };
  } catch (e) { return { level: 12, name: 'Algorithmic Quality & Helpful-Content Classifier', score: 0, issues: [{ severity: 'critical', impact: 'critical', message: 'Level 12 analysis failed: ' + e.message, element: 'system' }], data: { error: e.message } }; }
}

function level13($, url) {
  try {
  const issues = [];
  let p = 0;
  const subfunctions = {};
  const data = subfunctions;
  const text = getTextContent($) || '';
  const patches = [];

  const missingSchemas = [];
  const existingSchemaTypes = [];
  $('script[type="application/ld+json"]').each((i, el) => {
    try { const d = JSON.parse($(el).html() || '{}'); const arr = Array.isArray(d) ? d : [d]; arr.forEach(s => { if (s['@type']) existingSchemaTypes.push(s['@type']); }); } catch {}
  });
  const recommendedTypes = ['Organization', 'WebSite', 'BreadcrumbList', 'Article', 'Product', 'FAQPage', 'LocalBusiness', 'HowTo'];
  recommendedTypes.forEach(t => { if (!existingSchemaTypes.includes(t)) missingSchemas.push(t); });

  const canonicalEl = $('link[rel="canonical"]');
  const hasCanonical = canonicalEl.length > 0;
  const canonicalHref = hasCanonical ? canonicalEl.first().attr('href') || '' : '';

  const titleText = $('title').first().text().trim() || '';
  const metaDesc = ($('meta[name="description"]').attr('content') || '').trim();
  const h1Text = $('h1').first().text().trim() || '';
  const missingMeta = [];
  if (!titleText) missingMeta.push('title');
  if (!metaDesc) missingMeta.push('meta description');
  if (!h1Text) missingMeta.push('H1');

  const edgePatches = [];
  const edgeWorker = generateEdgeWorkerCode({
    rewriteUrl: true,
    addHeaders: true,
    canonicalize: !hasCanonical,
    pathPattern: '/*'
  });
  data.edgeWorkerCode = edgeWorker;

  if (missingSchemas.length > 0) {
    const schemaCodeParts = [];
    missingSchemas.slice(0, 4).forEach(type => {
      const sc = generateSchemaCode(type, {
        headline: titleText, description: metaDesc || text.substring(0, 160),
        name: titleText || 'Page', url: url
      });
      schemaCodeParts.push('// ' + type + ' schema');
      schemaCodeParts.push(sc);
    });
    const fullSchemaScript = '<script type="application/ld+json">\n' + schemaCodeParts.join('\n\n') + '\n</script>';

    if (missingSchemas.includes('Organization')) {
      edgePatches.push({
        type: 'schema-org', patch: 'Add Organization JSON-LD to <head>',
        code: fullSchemaScript,
        deploy: 'Insert before closing </head> tag',
        priority: 'high'
      });
      patches.push({ type: 'schema', element: 'Organization JSON-LD', action: 'inject', code: fullSchemaScript.substring(0, 300), risk: 'low', description: 'Add Organization schema for knowledge panel eligibility' });
    }
  }

  if (!hasCanonical) {
    const canonUrl = url;
    const canonFix = '<link rel="canonical" href="' + canonUrl + '" />';
    edgePatches.push({
      type: 'canonical', patch: 'Add self-referencing canonical URL',
      code: canonFix,
      deploy: 'Add to <head> on all page variants',
      priority: 'critical'
    });
    patches.push({ type: 'canonical', element: 'link[rel="canonical"]', action: 'inject', code: canonFix, risk: 'low', description: 'Prevent duplicate content issues' });
  } else {
    try {
      const cu = new URL(canonicalHref);
      const pu = new URL(url);
      if (cu.hostname !== pu.hostname) {
        const canonFix = '<link rel="canonical" href="' + url + '" />';
        patches.push({ type: 'canonical', element: 'link[rel="canonical"]', action: 'replace', code: canonFix, risk: 'low', description: 'Fix cross-domain canonical — should be self-referencing' });
      }
    } catch {}
  }

  if (missingMeta.length > 0) {
    if (missingMeta.includes('meta description')) {
      const firstP = $('p').first().text().trim().substring(0, 155);
      const descFix = '<meta name="description" content="' + (firstP || 'Learn about ' + titleText).replace(/\"/g, '&quot;') + '" />';
      edgePatches.push({
        type: 'meta-description', patch: 'Add missing meta description',
        code: descFix,
        deploy: 'Add to <head>',
        priority: 'critical'
      });
      patches.push({ type: 'meta', element: 'meta[name="description"]', action: 'inject', code: descFix, risk: 'low', description: 'Add meta description for SERP snippet control' });
    }
    if (missingMeta.includes('title')) {
      const titleFix = '<title>' + (h1Text || 'Page Title') + '</title>';
      patches.push({ type: 'meta', element: 'title', action: 'inject', code: titleFix, risk: 'low', description: 'Add title tag — most important SEO element' });
    }
  }

  const imgIssues = [];
  $('img').each((i, el) => {
    if (!$(el).is('[alt]')) {
      const src = ($(el).attr('src') || '').split('?')[0];
      const altFix = $(el).attr('alt') || '';
      if (!altFix) {
        const suggestedAlt = src.split('/').pop().split('.')[0].replace(/[-_]/g, ' ');
        imgIssues.push({ src: src.substring(0, 100), selector: sel($, el), suggestedAlt });
        patches.push({
          type: 'image-alt', element: 'img', selector: sel($, el),
          action: 'add-attribute', attribute: 'alt', value: suggestedAlt,
          code: '<img src="' + src + '" alt="' + suggestedAlt.replace(/\"/g, '&quot;') + '" />',
          risk: 'low', description: 'Add alt text for accessibility and image SEO'
        });
      }
    }
  });

  const openGraphTags = {
    title: $('meta[property="og:title"]').length,
    description: $('meta[property="og:description"]').length,
    image: $('meta[property="og:image"]').length,
    url: $('meta[property="og:url"]').length
  };
  const missingOG = Object.entries(openGraphTags).filter(([, v]) => v === 0).map(([k]) => 'og:' + k);
  if (missingOG.length > 0) {
    const ogFixes = [];
    if (!openGraphTags.title && titleText) ogFixes.push('<meta property="og:title" content="' + titleText.replace(/\"/g, '&quot;') + '" />');
    if (!openGraphTags.description) ogFixes.push('<meta property="og:description" content="' + (metaDesc || text.substring(0, 155)).replace(/\"/g, '&quot;') + '" />');
    if (!openGraphTags.image) ogFixes.push('<!-- og:image — add the real URL of a 1200x630px image hosted on this domain (e.g. ' + url.replace(/\/$/, '') + '/images/social-share.jpg — replace with actual path) -->');
    if (!openGraphTags.url) ogFixes.push('<meta property="og:url" content="' + url + '" />');
    if (ogFixes.length > 0) {
      patches.push({ type: 'open-graph', element: 'meta[property^="og:"]', action: 'inject', code: ogFixes.join('\n'), risk: 'low', description: 'Add missing Open Graph tags for social sharing optimization' });
    }
  }

  data.edgePatches = edgePatches;

  const cfWorkerCode = [
    "// Cloudflare Worker — SEO Auto-Patching",
    "addEventListener('fetch', event => {",
    "  event.respondWith(handleRequest(event.request));",
    "});",
    "",
    "async function handleRequest(request) {",
    "  const response = await fetch(request);",
    "  if (!response.headers.get('content-type')?.includes('text/html')) return response;",
    "  let html = await response.text();",
    "  const url = new URL(request.url);",
    "",
    "  if (!html.includes('rel=\"canonical\"')) {",
    "    const canon = 'https://' + url.hostname + url.pathname.replace(/\\/+$/, '').toLowerCase();",
    "    html = html.replace('</head>', '<link rel=\"canonical\" href=\"' + canon + '\">\\n</head>');",
    "  }",
    "  if (!html.includes('name=\"description\"') && !html.includes(\"name='description'\")) {",
    "    const match = html.match(/<p[^>]*>([^<]{40,200})<\\/p>/);",
    "    const desc = match ? match[1].substring(0, 155).replace(/\"/g, '&quot;') : 'SEO-optimized page';",
    "    html = html.replace('</head>', '<meta name=\"description\" content=\"' + desc + '\">\\n</head>');",
    "  }"
  ];
  if (!openGraphTags.title) {
    cfWorkerCode.push("  if (!html.includes('property=\"og:title\"')) {");
    cfWorkerCode.push("    const titleMatch = html.match(/<title>([^<]+)<\\/title>/);");
    cfWorkerCode.push("    if (titleMatch) html = html.replace('</head>', '<meta property=\"og:title\" content=\"' + titleMatch[1].replace(/\"/g, '&quot;') + '\">\\n</head>');");
    cfWorkerCode.push("  }");
  }
  cfWorkerCode.push("  if (!html.includes('charset=')) {");
  cfWorkerCode.push("    html = html.replace('</head>', '<meta charset=\"utf-8\">\\n</head>');");
  cfWorkerCode.push("  }");
  cfWorkerCode.push("");
  cfWorkerCode.push("  const newResponse = new Response(html, {");
  cfWorkerCode.push("    status: response.status,");
  cfWorkerCode.push("    headers: response.headers");
  cfWorkerCode.push("  });");
  cfWorkerCode.push("  newResponse.headers.set('X-Content-Type-Options', 'nosniff');");
  cfWorkerCode.push("  newResponse.headers.set('X-Frame-Options', 'DENY');");
  cfWorkerCode.push("  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');");
  cfWorkerCode.push("  newResponse.headers.set('X-SEO-Worker', 'active');");
  cfWorkerCode.push("  return newResponse;");
  cfWorkerCode.push("}");
  data.cloudflareWorker = cfWorkerCode.join('\n');

  const vercelEdgeCode = [
    "// Vercel Edge Middleware — SEO Patch Layer",
    "import { NextResponse } from 'next/server';",
    "",
    "export const config = {",
    "  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],",
    "};",
    "",
    "export function middleware(request) {",
    "  const url = new URL(request.url);",
    "  const response = NextResponse.next();",
    "",
    "  response.headers.set('X-Robots-Tag', 'index, follow');",
    "  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');",
    "  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');",
    "",
    "  if (!hasCanonical) {",
    "    const canonical = 'https://' + url.hostname + url.pathname.replace(/\\/+$/, '').toLowerCase();",
    "    response.headers.set('Link', '<' + canonical + '>; rel=\"canonical\"');",
    "  }",
    "",
    "  return response;",
    "}"
  ].join('\n');
  data.vercelEdgeCode = vercelEdgeCode;

  const selfHealingResult = selfHealingEdgeScript(url);
  data.selfHealing = selfHealingResult;

  const githubWorkflow = [
    "name: SEO Audit CI",
    "on:",
    "  pull_request:",
    "    branches: [main, develop]",
    "  push:",
    "    branches: [main]",
    "",
    "jobs:",
    "  seo-check:",
    "    runs-on: ubuntu-latest",
    "    steps:",
    "      - uses: actions/checkout@v4",
    "",
    "      - name: SEO PR Check",
    "        uses: actions/setup-node@v4",
    "        with:",
    "          node-version: '20'",
    "",
    "      - name: Run SEO Validation",
    "        run: |",
    "          npx seo-audit " + url + " \\",
    "            --fail-on=critical \\",
    "            --format=github-annotation",
    "",
    "      - name: Annotate PR",
    "        if: failure()",
    "        uses: actions/github-script@v7",
    "        with:",
    "          script: |",
    "            core.setFailed('SEO critical issues found. Fix before merging.');",
    "",
    "      - name: Block if critical SEO issues",
    "        if: failure()",
    "        run: exit 1"
  ].join('\n');
  data.githubWorkflow = githubWorkflow;

  const gitlabConfig = [
    "stages:",
    "  - seo-check",
    "",
    "seo-validation:",
    "  stage: seo-check",
    "  image: node:20",
    "  script:",
    "    - npm ci",
    "    - npx seo-audit " + url + " --fail-on=critical --format=gitlab-annotation",
    "  rules:",
    "    - if: '$CI_PIPELINE_SOURCE == \"merge_request_event\"'",
    "  artifacts:",
    "    reports:",
    "      annotations: seo-report.json"
  ].join('\n');
  data.gitlabConfig = gitlabConfig;

  const preCommitHook = [
    "#!/bin/sh",
    "# SEO Pre-commit Hook — prevents deployment of pages with critical SEO issues",
    "# Place in .git/hooks/pre-commit",
    "",
    "echo 'Running SEO pre-commit checks...'",
    "",
    "STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\\.(html|jsx|tsx|vue|astro)$' || true)",
    "",
    "if [ -z \"$STAGED_FILES\" ]; then",
    "  exit 0",
    "fi",
    "",
    "for file in $STAGED_FILES; do",
    "  if grep -q '<title></title>' \"$file\" || grep -q '<title> </title>' \"$file\"; then",
    "    echo \"ERROR: $file has an empty <title> tag — SEO critical issue.\"",
    "    exit 1",
    "  fi",
    "  if ! grep -q '<title>' \"$file\"; then",
    "    echo \"WARNING: $file is missing a <title> tag.\"",
    "  fi",
    "  if ! grep -q '<link rel=\"canonical\"' \"$file\"; then",
    "    echo \"WARNING: $file is missing canonical link.\"",
    "  fi",
    "done",
    "",
    "echo 'SEO pre-commit checks passed.'",
    "exit 0"
  ].join('\n');
  data.preCommitHook = preCommitHook;

  data.autoFixPatches = patches;

  const criticalIssues = patches.filter(p => p.risk === 'low' || p.priority === 'critical');
  if (criticalIssues.length > 0) {
    issues.push({ severity: 'warning', impact: 'high', message: criticalIssues.length + ' auto-fix patches generated for critical issues. Review and apply: ' + criticalIssues.slice(0, 4).map(p => p.type + ': ' + p.description).join('; '), element: 'auto-fix patches', fix: 'Review the generated patches in data.autoFixPatches and apply them to your codebase or edge worker.', link: url, evidence: criticalIssues.length + ' patches ready', recommendation: 'Deploy patches via Cloudflare Worker for instant fixes' });
    p += 5;
  }
  if (missingSchemas.length > 0) {
    issues.push({ severity: 'info', impact: 'medium', message: missingSchemas.length + ' missing schema types: ' + missingSchemas.join(', ') + '. Edge worker can inject these automatically.', element: 'structured data', fix: 'Deploy the generated Cloudflare Worker to inject schemas at the edge.', link: url });
    p += 3;
  }

  return { level: 13, name: 'Edge-Native Patching & CI/CD Gatekeeping', score: sc(p), issues, data };
  } catch (e) { return { level: 13, name: 'Edge-Native Patching & CI/CD Gatekeeping', score: 0, issues: [{ severity: 'critical', impact: 'critical', message: 'Level 13 analysis failed: ' + e.message, element: 'system' }], data: { error: e.message } }; }
}

function level14($, bodyText, url, config) {
  try {
  const cfg = config || {};
  const issues = [];
  let p = 0;
  const text = bodyText || getTextContent($) || '';
  const wc = countWords(text);
  const subfunctions = {};
  const data = subfunctions;
  const inputMonthlyTraffic = cfg.monthlyTraffic || 0;
  const inputAOV = cfg.avgOrderValue || 0;
  const inputCVR = (cfg.conversionRate || 0) / 100;

  // Subfunction 1: Page Type Classification (from real URL + content signals)
  let pageType = 'blog';
  const urlLower = (url || '').toLowerCase();
  if (/\/product\/|itemid=|sku=|\/p\/|\/pd\//i.test(urlLower)) pageType = 'product';
  else if (/\/checkout\/|\/cart\/|\/basket\//i.test(urlLower)) pageType = 'checkout';
  else if (/\/landing\/|\/lp\/|landing-page/i.test(urlLower)) pageType = 'landing';
  else if (/\/category\/|\/collection\/|\/shop\/|\/products\//i.test(urlLower)) pageType = 'category';
  else if (/\/blog\/|\/article\/|\/news\/|\/post\//i.test(urlLower)) pageType = 'informational';
  else if (wc > 500 && $('article, [class*="post"], [class*="article"]').length > 0) pageType = 'informational';
  else if ($('[itemtype*="Product"]').length > 0 || $('[class*="product"]').length > 5) pageType = 'product';

  const hasEcommerce = $('[class*="add-to-cart"], [class*="addtocart"], button[type="submit"][class*="buy"], a[href*="cart"], a[href*="checkout"]').length > 0;
  const hasPricing = (text.match(/[\$\€\£\¥]\s?\d+(\.\d{2})?/g) || []).length > 0;
  const hasBuyButton = $('a[href*="buy"], a[href*="add-to-cart"], button:contains("Buy"), button:contains("Add to Cart")').length > 0;
  if (pageType === 'blog' && (hasEcommerce || hasPricing || hasBuyButton)) pageType = 'product';

  subfunctions.pageTypeClassification = {
    pageType,
    urlPattern: urlLower.match(/\/product\/|\/checkout\/|\/cart\/|\/landing\/|\/category\/|\/blog\/|\/article\//)?.[0] || 'none',
    hasEcommerce,
    hasPricing,
    hasBuyButton,
    signals: { ecommerce: hasEcommerce, pricing: hasPricing, buyButton: hasBuyButton }
  };

  // Subfunction 2: Business Metrics (monetary values ONLY from real user-supplied inputs)
  const imgCount = $('img').length;
  const imgWithDims = $('img').filter((i, el) => $(el).attr('width') && $(el).attr('height')).length;
  const hasCanonical = $('link[rel="canonical"]').length > 0;
  const hasSchema = $('script[type="application/ld+json"]').length > 0;
  const hasViewport = !!$('meta[name="viewport"]').attr('content');
  const internalLinks = $('a[href^="/"], a[href^="' + url.replace(/\/$/, '') + '"]').length;
  const title = $('title').first().text().trim();
  const hasTitle = !!title;
  const hasMetaDesc = !!($('meta[name="description"]').attr('content') || '').trim();
  const hasH1 = $('h1').length > 0;

  // No fabricated traffic/conversion assumptions: if the user did not supply real
  // analytics inputs, every monetary figure stays 0 and is explicitly marked as unavailable.
  const hasRealFinancialInputs = inputMonthlyTraffic > 0 && inputAOV > 0 && inputCVR > 0;
  const organicTraffic = hasRealFinancialInputs ? inputMonthlyTraffic : 0;
  const conversionRate = hasRealFinancialInputs ? inputCVR : 0;
  const avgOrderValue = hasRealFinancialInputs ? inputAOV : 0;

  const pageQualityScore = (() => {
    let score = 100;
    if (!hasTitle) score -= 15;
    if (!hasMetaDesc) score -= 10;
    if (!hasH1) score -= 10;
    if (wc < 300) score -= 15;
    if ($('img[alt]').length === 0 && imgCount > 0) score -= 5;
    if (!hasCanonical) score -= 5;
    if (!hasSchema) score -= 8;
    if (!hasViewport) score -= 5;
    if (imgWithDims < imgCount * 0.5 && imgCount > 0) score -= 5;
    if (!$('[role="main"], main').length) score -= 2;
    return Math.max(20, Math.min(100, score));
  })();

  const visibilityDrop = Math.max(0.05, (100 - pageQualityScore) / 200);

  subfunctions.businessMetrics = {
    pageType,
    pageQualityScore,
    financialInputStatus: hasRealFinancialInputs
      ? 'Monetary figures derived from user-supplied monthlyTraffic, avgOrderValue and conversionRate.'
      : 'NO traffic data supplied — all monetary figures are 0. Provide monthlyTraffic, avgOrderValue and conversionRate to enable financial modeling.',
    hasRealFinancialInputs,
    organicTraffic,
    conversionRate,
    avgOrderValue,
    visibilityDropFactor: visibilityDrop,
    estimatedMonthlyRevenue: Math.round(organicTraffic * conversionRate * avgOrderValue),
    estimatedAnnualRevenue: Math.round(organicTraffic * conversionRate * avgOrderValue * 12),
    pageSignals: { hasTitle, hasMetaDesc, hasH1, hasCanonical, hasSchema, hasViewport, wordCount: wc, imageCount: imgCount, imagesWithDimensions: imgWithDims, internalLinkCount: internalLinks }
  };

  // Subfunction 3: Revenue at Risk (only quantifiable with real user inputs)
  const revenueCalc = calculateRevenueAtRisk({
    organicTraffic,
    conversionRate,
    avgOrderValue,
    visibilityDrop,
    currency: 'USD',
    imageCount: imgCount,
    pageSignals: {
      hasTitle, hasMetaDesc, hasCanonical, hasH1, hasSchema, hasViewport,
      wordCount: wc, imageCount: imgCount, imagesWithDimensions: imgWithDims,
      internalLinkCount: internalLinks
    }
  });
  subfunctions.revenueAtRisk = revenueCalc;

  // Subfunction 4: Cost-Benefit & ROI Analysis
  subfunctions.roiAnalysis = (() => {
    const findings = [];
    if (!hasTitle) findings.push({ issue: 'Missing title tag', severity: 'critical', effort: 'low', hours: 0.5 });
    if (!hasMetaDesc) findings.push({ issue: 'Missing meta description', severity: 'critical', effort: 'low', hours: 0.5 });
    if (!hasCanonical) findings.push({ issue: 'Missing canonical tag', severity: 'critical', effort: 'low', hours: 0.3 });
    if (!hasH1) findings.push({ issue: 'Missing H1 heading', severity: 'critical', effort: 'low', hours: 0.3 });
    if (!hasSchema) findings.push({ issue: 'No structured data', severity: 'warning', effort: 'medium', hours: 2 });
    if (!hasViewport) findings.push({ issue: 'Missing viewport meta', severity: 'critical', effort: 'low', hours: 0.3 });
    if (wc < 300) findings.push({ issue: 'Thin content (' + wc + ' words)', severity: 'critical', effort: 'high', hours: 8 });
    const totalHours = findings.reduce((a, f) => a + f.hours, 0);
    const totalFixCost = totalHours * 150;
    const annualRevenue = organicTraffic * conversionRate * avgOrderValue * 12;
    return {
      findings,
      totalFindings: findings.length,
      totalEffortHours: Math.round(totalHours * 10) / 10,
      totalFixCost: '$' + Math.round(totalFixCost).toLocaleString(),
      hourlyRate: '$150',
      annualRevenueAtRisk: '$' + Math.round(revenueCalc.totalAtRisk).toLocaleString(),
      annualRoi: revenueCalc.totalAtRisk > 0 ? Math.round((revenueCalc.totalAtRisk / Math.max(1, totalFixCost)) * 100) + '%' : 'N/A',
      breakEvenDays: revenueCalc.totalAtRisk > 0 ? Math.ceil(totalFixCost / (revenueCalc.totalAtRisk / 365)) + ' days' : 'N/A',
      recommendation: revenueCalc.totalAtRisk > totalFixCost * 3 ? 'Fix now — high ROI, positive within first year' : 'Evaluate priority',
      methodology: 'Effort hours (0.3-8h per fix) and $150/hour rate are assumed planning estimates, not quoted prices. Adjust for your own resource costs.'
    };
  })();

  // Subfunction 5: Quarterly Projections (real inputs only)
  subfunctions.quarterlyProjections = hasRealFinancialInputs
    ? [
      { quarter: 'Q1', revenueAtRisk: '$' + Math.round(revenueCalc.totalAtRisk * 0.25).toLocaleString(), action: 'Fix critical issues now' },
      { quarter: 'Q2', revenueAtRisk: '$' + Math.round(revenueCalc.totalAtRisk * 0.5).toLocaleString(), action: 'Lost opportunity cost accumulating' },
      { quarter: 'Q3', revenueAtRisk: '$' + Math.round(revenueCalc.totalAtRisk * 0.75).toLocaleString(), action: 'Compounding revenue loss' },
      { quarter: 'Q4', revenueAtRisk: '$' + Math.round(revenueCalc.totalAtRisk).toLocaleString(), action: 'Full annualized loss realized' }
    ]
    : [{ note: 'Projections unavailable — supply monthlyTraffic, avgOrderValue and conversionRate to enable quarterly revenue-at-risk modeling.' }];

  // Subfunction 6: Priority Action Plan
  subfunctions.priorityActionPlan = (() => {
    const items = [];
    const fmt = (frac) => hasRealFinancialInputs ? '$' + Math.round(revenueCalc.totalAtRisk * frac).toLocaleString() : 'n/a (no traffic data)';
    if (!hasTitle) items.push({ rank: 1, issue: 'Add title tag', impact: 'critical', roi: 'high', effort: 'low', revenueImpact: fmt(0.2) });
    if (!hasMetaDesc) items.push({ rank: items.length + 1, issue: 'Add meta description', impact: 'critical', roi: 'high', effort: 'low', revenueImpact: fmt(0.15) });
    if (!hasCanonical) items.push({ rank: items.length + 1, issue: 'Add canonical tag', impact: 'critical', roi: 'high', effort: 'low', revenueImpact: fmt(0.12) });
    if (!hasViewport) items.push({ rank: items.length + 1, issue: 'Add viewport meta', impact: 'critical', roi: 'high', effort: 'low', revenueImpact: fmt(0.1) });
    if (!hasH1) items.push({ rank: items.length + 1, issue: 'Add H1 heading', impact: 'high', roi: 'medium', effort: 'low', revenueImpact: fmt(0.08) });
    if (!hasSchema) items.push({ rank: items.length + 1, issue: 'Add structured data', impact: 'high', roi: 'medium', effort: 'medium', revenueImpact: fmt(0.08) });
    if (wc < 300) items.push({ rank: items.length + 1, issue: 'Expand thin content', impact: 'critical', roi: 'high', effort: 'high', revenueImpact: fmt(0.2) });
    return items;
  })();

  // Issues
  data.highRiskRevenueImpact = (() => {
    const items = [];
    const fmt = (frac) => hasRealFinancialInputs ? '$' + Math.round(revenueCalc.totalAtRisk * frac) : 'n/a (no traffic data)';
    if (!hasTitle) items.push({ issue: 'Missing title tag', estimatedLoss: fmt(0.2) });
    if (!hasCanonical) items.push({ issue: 'Missing canonical tag', estimatedLoss: fmt(0.1) });
    if (!hasH1) items.push({ issue: 'Missing H1 heading', estimatedLoss: fmt(0.08) });
    if (wc < 300) items.push({ issue: 'Thin content', estimatedLoss: fmt(0.15) });
    if (!hasSchema) items.push({ issue: 'Missing structured data', estimatedLoss: fmt(0.08) });
    return items;
  })();
  if (data.highRiskRevenueImpact.length > 0) {
    const totalLoss = data.highRiskRevenueImpact.reduce((a, i) => a + parseInt(i.estimatedLoss.replace('$', '')), 0);
    if (hasRealFinancialInputs) {
      issues.push({ severity: 'critical', impact: 'high', message: 'Revenue-at-risk on this ' + pageType + ' page: ~$' + revenueCalc.totalAtRisk.toLocaleString() + '. High risk issues: ' + data.highRiskRevenueImpact.map(i => i.issue + ' (~' + i.estimatedLoss + ')').join(', '), element: 'revenue impact', fix: 'Fix critical SEO issues to recover at-risk revenue. Prioritize: title tag, canonical, H1, and content expansion.', link: url, evidence: 'Page type: ' + pageType + ', AOV: $' + avgOrderValue + ', Conv rate: ' + (conversionRate * 100).toFixed(1) + '%', recommendation: 'Fix title + canonical + content issues to recover ~$' + totalLoss.toLocaleString() + '/year' });
    } else {
      issues.push({ severity: 'critical', impact: 'high', message: 'Page has ' + data.highRiskRevenueImpact.length + ' critical on-page issues (' + data.highRiskRevenueImpact.map(i => i.issue).join(', ') + '). Monetary impact cannot be quantified — supply monthlyTraffic, avgOrderValue and conversionRate to enable revenue-at-risk modeling.', element: 'revenue impact', fix: 'Fix critical SEO issues. Provide GA4/analytics inputs for financial quantification.', link: url, evidence: 'Page type: ' + pageType + ', no financial inputs supplied' });
    }
    p += 15;
  } else if (hasRealFinancialInputs && revenueCalc.totalAtRisk > 1000) {
    issues.push({ severity: 'warning', impact: 'high', message: 'Estimated revenue-at-risk: ~$' + revenueCalc.totalAtRisk.toLocaleString() + '/year. Even informational pages impact top-of-funnel traffic that converts elsewhere.', element: 'revenue impact', fix: 'Improve content quality, add CTAs, and fix technical SEO to maximize organic traffic value.', link: url, evidence: 'Page type: ' + pageType + ', Total at risk: $' + revenueCalc.totalAtRisk.toLocaleString() });
    p += 8;
  }

  // Subfunction 7: Traffic Estimates & Loss Projection (real inputs only)
  data.trafficEstimates = {
    hasRealFinancialInputs,
    financialInputStatus: hasRealFinancialInputs
      ? 'Traffic figures derived from user-supplied monthlyTraffic.'
      : 'Traffic figures unavailable — no monthlyTraffic supplied.',
    estimatedMonthlyVisits: organicTraffic,
    estimatedAnnualVisits: organicTraffic * 12,
    estimatedAnnualOrganicRevenue: Math.round(organicTraffic * 12 * conversionRate * avgOrderValue),
    trafficLossRisk: hasRealFinancialInputs ? {
      critical: Math.round(organicTraffic * 0.15),
      high: Math.round(organicTraffic * 0.08),
      medium: Math.round(organicTraffic * 0.03),
      note: 'Modeled from assumed risk fractions (15%/8%/3% of traffic) — not measured analytics'
    } : { note: 'Not quantified without traffic data' },
    recoveryPotential: hasRealFinancialInputs ? {
      fixCritical: '+$' + Math.round(revenueCalc.totalAtRisk * 0.4),
      fixAll: '+$' + Math.round(revenueCalc.totalAtRisk * 0.7),
      timelineMonths: '3-6',
      note: 'Recovery percentages (40%/70% of at-risk revenue) are modeling assumptions, not measured outcomes'
    } : { note: 'Not quantified without traffic data' },
    conversionValuePerVisitor: (conversionRate * avgOrderValue).toFixed(4)
  };
  subfunctions.trafficEstimates = data.trafficEstimates;

  // Subfunction 8: Competitive Loss Analysis (real inputs only)
  const monthlyOrganicRevenue = organicTraffic * conversionRate * avgOrderValue;
  subfunctions.competitiveLoss = {
    hasRealFinancialInputs,
    shareOfVoiceLoss: pageQualityScore < 50 ? '25-40% (qualitative estimate)' : pageQualityScore < 70 ? '10-20% (qualitative estimate)' : '< 5% (qualitative estimate)',
    positionDropRisk: pageQualityScore < 50 ? '5-8 positions (qualitative estimate)' : pageQualityScore < 70 ? '2-4 positions (qualitative estimate)' : 'stable',
    estimatedClickShareLoss: pageQualityScore < 50 ? '60-70% (qualitative estimate)' : pageQualityScore < 70 ? '20-40% (qualitative estimate)' : '< 10% (qualitative estimate)',
    dollarImpactOfPositionDrop: hasRealFinancialInputs ? '$' + Math.round(monthlyOrganicRevenue * (pageQualityScore < 50 ? 0.5 : pageQualityScore < 70 ? 0.2 : 0.05) * 12).toLocaleString() + '/year (modeled from supplied inputs)' : 'Not quantified without traffic data'
  };

  // Subfunction 9: Cost-Benefit Summary
  subfunctions.costBenefitSummary = {
    totalAtRiskAnnual: '$' + Math.round(revenueCalc.totalAtRisk).toLocaleString(),
    monthlyLossRate: '$' + Math.round(revenueCalc.totalAtRisk / 12).toLocaleString() + '/month',
    weeklyLossRate: '$' + Math.round(revenueCalc.totalAtRisk / 52).toLocaleString() + '/week',
    dailyLossRate: '$' + Math.round(revenueCalc.totalAtRisk / 365).toLocaleString() + '/day',
    fixCost: '$' + Math.round(subfunctions.roiAnalysis.totalEffortHours * 150),
    breakEvenDays: revenueCalc.totalAtRisk > 0 ? Math.ceil((subfunctions.roiAnalysis.totalEffortHours * 150) / (revenueCalc.totalAtRisk / 365)) + ' days' : 'N/A',
    annualRoi: subfunctions.roiAnalysis.annualRoi,
    methodology: 'Derived from the ROI model above — fix cost uses the assumed $150/hour rate and assumed effort hours.'
  };

  // Subfunction 10: Issue Registry (all detected page issues)
  const allFindings = [];
  if (!hasTitle) allFindings.push({ severity: 'critical', issue: 'Missing title tag', impact: 'title', recommendation: 'Add unique title tag', effort: 'low' });
  if ((title || '').length > 60) allFindings.push({ severity: 'warning', issue: 'Title too long', impact: 'meta', recommendation: 'Shorten title to under 60 chars', effort: 'low' });
  if (!hasMetaDesc) allFindings.push({ severity: 'critical', issue: 'Missing meta description', impact: 'meta', recommendation: 'Add meta description (150-155 chars)', effort: 'low' });
  if (!hasH1) allFindings.push({ severity: 'critical', issue: 'Missing H1 heading', impact: 'structure', recommendation: 'Add H1 with primary keyword', effort: 'low' });
  if ($('h1').length > 1) allFindings.push({ severity: 'warning', issue: 'Multiple H1 tags', impact: 'structure', recommendation: 'Consolidate to one H1', effort: 'low' });
  if (!hasCanonical) allFindings.push({ severity: 'critical', issue: 'Missing canonical tag', impact: 'technical', recommendation: 'Add self-referencing canonical', effort: 'low' });
  if ($('img[alt]').length < imgCount && imgCount > 0) allFindings.push({ severity: 'warning', issue: 'Images missing alt text', impact: 'accessibility', recommendation: 'Add alt text to all images', effort: 'medium' });
  if (wc < 300) allFindings.push({ severity: 'critical', issue: 'Thin content (' + wc + ' words)', impact: 'content', recommendation: 'Expand content to 1500+ words', effort: 'high' });
  if (!hasSchema) allFindings.push({ severity: 'warning', issue: 'No structured data', impact: 'schema', recommendation: 'Add relevant JSON-LD schema', effort: 'medium' });
  if ($('h2').length === 0 && wc > 400) allFindings.push({ severity: 'warning', issue: 'No H2 subheadings', impact: 'structure', recommendation: 'Add H2 subheadings for content structure', effort: 'low' });
  if ($('a[href^="http"]').filter((i, el) => { try { return new URL($(el).attr('href')).hostname !== new URL(url).hostname; } catch { return false; } }).length === 0 && wc > 300) allFindings.push({ severity: 'info', issue: 'No external links', impact: 'authority', recommendation: 'Cite authoritative external sources', effort: 'medium' });
  if (!hasViewport) allFindings.push({ severity: 'critical', issue: 'Missing viewport meta tag', impact: 'mobile', recommendation: 'Add viewport meta tag for mobile responsiveness', effort: 'low' });
  if ($('img').filter((i, el) => !$(el).attr('width') || !$(el).attr('height')).length > 0 && imgCount > 0) allFindings.push({ severity: 'warning', issue: 'Images missing dimensions', impact: 'cls', recommendation: 'Add width/height to all images to prevent CLS', effort: 'medium' });
  const h2Count = $('h2').length;
  if (h2Count < 2 && wc > 600) allFindings.push({ severity: 'info', issue: 'Few H2 headings (' + h2Count + ') for ' + wc + ' word content', impact: 'structure', recommendation: 'Add more H2 subheadings for content hierarchy', effort: 'low' });

  const priorityResult = prioritizeByImpact(allFindings);
  subfunctions.issueRegistry = priorityResult;

  if (priorityResult.prioritized.length > 0) {
    const topPriority = priorityResult.prioritized.slice(0, 5);
    issues.push({ severity: 'warning', impact: 'high', message: 'Opportunity prioritization: ' + priorityResult.totals.critical + ' critical, ' + priorityResult.totals.high + ' high, ' + priorityResult.totals.medium + ' medium, ' + priorityResult.totals.low + ' low priority items. Top fix: ' + topPriority[0].issue + ', estimated ROI: high.', element: 'prioritization', fix: 'Follow the ranked action plan: fix critical items first (title, canonical, H1, content), then high-priority items.', link: url, evidence: (priorityResult.totals.critical + priorityResult.totals.high) + ' high-impact issues found' });
    p += Math.min(10, priorityResult.totals.critical * 3 + priorityResult.totals.high);
  }

  // Merge subfunctions into data and return
  Object.assign(data, subfunctions);

  return { level: 14, name: 'Financial Attribution - Single-Page ROI', score: sc(p), issues, data };
  } catch (e) { return { level: 14, name: 'Financial Attribution - Single-Page ROI', score: 0, issues: [{ severity: 'critical', impact: 'critical', message: 'Level 14 analysis failed: ' + e.message, element: 'system' }], data: { error: e.message } }; }
}

function level15($, bodyText, config) {
  try {
  const issues = [];
  let p = 0;
  const text = bodyText || getTextContent($) || '';
  const wc = countWords(text);
  const subfunctions = {};
  const data = subfunctions;

  const pageEntities = extractKnowledgeGraphEntities(text);
  const primaryEntities = pageEntities.slice(0, 10).map(e => e.entity);
  const entityTerms = primaryEntities.slice(0, 5);

  const words = text.split(/\s+/);
  const passageSize = 200;
  const passages = [];
  for (let i = 0; i < words.length; i += passageSize) {
    passages.push(words.slice(i, Math.min(i + passageSize, words.length)).join(' '));
  }

  const passageSimilarities = [];
  const stopWords = new Set(['the','be','to','of','and','a','in','that','have','i','it','for','not','on','with','he','as','you','do','at','this','but','his','by','from','they','we','say','her','she','or','an','will','my','one','all','would','there','their','what','so','up','out','if','about','who','get','which','go','me','when','make','can','like','time','no','just','him','know','take','people','into','year','your','good','some','could','them','see','other','than','then','now','look','only','come','its','over','think','also','back','after','use','two','how','our','work','first','well','way','even','new','want','because','any','these','give','day','most','us']);
  const tokenize = s => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));

  const query = primaryEntities.slice(0, 3).join(' ');

  const vectorSimResult = passageVectorSim(text, query);
  data.vectorSimilarity = vectorSimResult;

  const passageEntitySets = [];
  passages.forEach((passage, idx) => {
    const pt = tokenize(passage);
    const passageEntities = extractKnowledgeGraphEntities(passage);
    const passageEntityNames = passageEntities.map(e => e.entity.toLowerCase());
    passageEntitySets.push({ index: idx, tokens: pt, entities: passageEntityNames, raw: passage.substring(0, 100) });

    const entityOverlap = entityTerms.filter(et => {
      const etl = et.toLowerCase();
      return pt.some(w => etl.includes(w) || w.includes(etl));
    }).length;
    const entityRatio = entityTerms.length > 0 ? entityOverlap / entityTerms.length : 0;
    const similarityScore = Math.round(entityRatio * 100);
    const flagged = similarityScore < 20 && pt.length > 10;

    passageSimilarities.push({
      index: idx,
      wordCount: pt.length,
      entityCount: passageEntities.length,
      entityOverlap: entityOverlap + '/' + entityTerms.length,
      similarityScore,
      flagged,
      preview: passage.substring(0, 150)
    });
  });

  data.passageSimilarity = passageSimilarities;
  data.passageEntityFlow = passageEntitySets.slice(0, 30);
  const flaggedPassages = passageSimilarities.filter(p => p.flagged);

  if (flaggedPassages.length > 0) {
    issues.push({ severity: 'warning', impact: 'high', message: flaggedPassages.length + '/' + passageSimilarities.length + ' passage(s) flagged for low entity overlap (< 20%) with primary entities. These passages may represent semantic drift from the core topic.', element: 'passage coherence', fix: 'Review flagged passages and add references to primary topic entities. Ensure each passage supports the main topic.', link: '', evidence: 'Flagged passages: ' + flaggedPassages.slice(0, 3).map(p => 'Passage #' + (p.index + 1) + ' (score: ' + p.similarityScore + '%)').join(', '), recommendation: 'Target each passage having >= 30% entity overlap with primary topic entities' });
    p += 10;
  }

  const headings = [];
  $('h1, h2, h3, h4').each((i, el) => {
    const ht = $(el).text().trim();
    if (ht.length > 3) headings.push({ level: parseInt(el.tagName[1]), text: ht, selector: sel($, el) });
  });
  data.headings = headings;

  const headingDrift = [];
  const headingTokens = headings.map(h => tokenize(h.text));
  const primaryTokens = tokenize(query);
  headings.forEach((h, idx) => {
    const ht = headingTokens[idx] || [];
    const overlap = ht.filter(w => primaryTokens.includes(w)).length;
    const ratio = primaryTokens.length > 0 ? overlap / primaryTokens.length : 0;
    const drift = ratio < 0.15 ? 'critical' : ratio < 0.25 ? 'high' : ratio < 0.4 ? 'moderate' : 'low';
    headingDrift.push({ heading: h.text.substring(0, 60), level: h.level, entityOverlap: overlap + '/' + primaryTokens.length, overlapRatio: Math.round(ratio * 100) + '%', driftSeverity: drift });
  });
  data.headingDrift = headingDrift;
  const highDriftHeadings = headingDrift.filter(h => h.driftSeverity === 'high' || h.driftSeverity === 'critical');

  if (highDriftHeadings.length > 0) {
    issues.push({ severity: 'warning', impact: 'medium', message: highDriftHeadings.length + ' heading(s) show high semantic drift from primary entities: ' + highDriftHeadings.slice(0, 3).map(h => '"' + h.heading + '" (' + h.overlapRatio + ' overlap)').join(', ') + '. These sections may diverge from the main topic.', element: 'heading coherence', fix: 'Revise drifted headings to include references to the primary topic. Ensure H2/H3 sections support the main entity.', link: '', evidence: 'High drift headings: ' + highDriftHeadings.length + ', primary entities: ' + primaryEntities.slice(0, 3).join(', ') });
    p += 6;
  }

  const headingContentAlignment = [];
  passageSimilarities.forEach((passageSim, pIdx) => {
    const nearestHeading = headings.reduce((best, h) => {
      const hPos = text.indexOf(h.text);
      const pPos = text.indexOf((passageSim.preview || '').substring(0, 50));
      const dist = Math.abs(hPos - pPos);
      if (!best || dist < best.dist) return { heading: h, dist };
      return best;
    }, null);

    if (nearestHeading && nearestHeading.heading) {
      const hTokens = tokenize(nearestHeading.heading.text);
      const pTokens = tokenize(passageSim.preview);
      const overlap = hTokens.filter(w => pTokens.includes(w)).length;
      const ratio = hTokens.length > 0 ? overlap / hTokens.length : 0;
      headingContentAlignment.push({
        passageIndex: pIdx,
        nearestHeading: nearestHeading.heading.text.substring(0, 50),
        headingLevel: nearestHeading.heading.level,
        headingTokenOverlap: overlap + '/' + hTokens.length,
        alignmentScore: Math.round(ratio * 100),
        misaligned: ratio < 0.15 && pTokens.length > 5
      });
    }
  });
  data.headingContentAlignment = headingContentAlignment;
  const misalignedSections = headingContentAlignment.filter(a => a.misaligned);
  if (misalignedSections.length > 0) {
    issues.push({ severity: 'info', impact: 'medium', message: misalignedSections.length + ' passage(s) have low alignment with their nearest heading. Content under a heading should directly support that heading\'s topic.', element: 'heading-content alignment', fix: 'Restructure content sections so that passages under each heading directly relate to that heading\'s topic and keywords.', link: '' });
    p += 4;
  }

  const sentenceEntityConsistency = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const slidingWindowSize = 5;
  for (let i = 0; i < sentences.length; i += slidingWindowSize) {
    const windowSents = sentences.slice(i, i + slidingWindowSize);
    const windowText = windowSents.join(' ');
    const windowEntities = extractKnowledgeGraphEntities(windowText);
    const windowEntityNames = windowEntities.map(e => e.entity.toLowerCase());
    const overlapWithPrimary = primaryEntities.filter(pe => windowEntityNames.some(we => we.includes(pe.toLowerCase()) || pe.toLowerCase().includes(we))).length;
    const consistencyScore = primaryEntities.length > 0 ? Math.round((overlapWithPrimary / primaryEntities.length) * 100) : 100;
    sentenceEntityConsistency.push({
      sectionStart: i,
      sentences: windowSents.length,
      overlappingEntities: overlapWithPrimary + '/' + primaryEntities.length,
      consistencyScore,
      flagged: consistencyScore < 25
    });
  }
  data.sectionEntityConsistency = sentenceEntityConsistency;
  const lowConsistencySections = sentenceEntityConsistency.filter(s => s.flagged);

  if (lowConsistencySections.length > sentenceEntityConsistency.length * 0.4 && sentenceEntityConsistency.length > 2) {
    issues.push({ severity: 'warning', impact: 'medium', message: lowConsistencySections.length + '/' + sentenceEntityConsistency.length + ' sections have low entity consistency (< 25%). Document-level entity focus drifts significantly across sections.', element: 'entity consistency', fix: 'Ensure primary entities are referenced consistently throughout the document. Each section should reinforce the core topic.', link: '', evidence: 'Low consistency sections: ' + lowConsistencySections.length });
    p += 7;
  }

  const bigramPassageDensity = [];
  passages.forEach((passage, idx) => {
    const passageText = passage.toLowerCase();
    const bigramCount = (passageText.match(/\b(\w+)\s(\w+)\b/g) || []).length;
    const uniqueBigrams = new Set((passageText.match(/\b(\w+)\s(\w+)\b/g) || []).map(b => b.toLowerCase()));
    bigramPassageDensity.push({ index: idx, totalBigrams: bigramCount, uniqueBigrams: uniqueBigrams.size, repetitionRatio: bigramCount > 0 ? Math.round((1 - uniqueBigrams.size / bigramCount) * 100) : 0 });
  });
  data.bigramPassageDensity = bigramPassageDensity;
  const repetitivePassages = bigramPassageDensity.filter(b => b.repetitionRatio > 50 && b.totalBigrams > 5);
  if (repetitivePassages.length > 0) {
    issues.push({ severity: 'info', impact: 'low', message: repetitivePassages.length + ' passage(s) show high bigram repetition (> 50%). Repetitive phrasing may indicate templated or low-quality content within those sections.', element: 'passage repetition', fix: 'Review repetitive passages and vary sentence structure and vocabulary.', link: '' });
    p += 3;
  }

  const entityTransitionMap = [];
  for (let i = 1; i < passageEntitySets.length; i++) {
    const prevEntities = passageEntitySets[i - 1].entities;
    const currEntities = passageEntitySets[i].entities;
    const shared = prevEntities.filter(e => currEntities.includes(e));
    const transitionScore = Math.max(prevEntities.length, currEntities.length) > 0 ? Math.round((shared.length / Math.max(1, Math.max(prevEntities.length, currEntities.length))) * 100) : 0;
    entityTransitionMap.push({ fromPassage: i - 1, toPassage: i, sharedEntities: shared.length, transitionScore, abrupt: transitionScore < 10 && prevEntities.length > 0 && currEntities.length > 0 });
  }
  data.entityTransitionMap = entityTransitionMap;
  const abruptTransitions = entityTransitionMap.filter(t => t.abrupt);
  if (abruptTransitions.length > entityTransitionMap.length * 0.5 && entityTransitionMap.length > 2) {
    issues.push({ severity: 'warning', impact: 'medium', message: abruptTransitions.length + '/' + entityTransitionMap.length + ' passage transitions are abrupt (< 10% entity overlap). Document lacks smooth topical flow between sections.', element: 'entity flow', fix: 'Add transitional sentences that bridge entity concepts between adjacent passages.', link: '' });
    p += 5;
  }

  const passageVectors = passageSimilarities.map(p => ({ index: p.index, score: p.similarityScore }));
  const avgSimilarity = passageVectors.length > 0 ? passageVectors.reduce((a, p) => a + p.score, 0) / passageVectors.length : 0;
  const minSimilarity = passageVectors.length > 0 ? Math.min(...passageVectors.map(p => p.score)) : 0;
  const maxSimilarity = passageVectors.length > 0 ? Math.max(...passageVectors.map(p => p.score)) : 0;
  const variance = passageVectors.length > 0 ? passageVectors.reduce((a, p) => a + Math.pow(p.score - avgSimilarity, 2), 0) / passageVectors.length : 0;
  const stdDev = Math.sqrt(variance);
  data.documentDistance = {
    avgEntitySimilarity: Math.round(avgSimilarity) + '%',
    minSimilarity: minSimilarity + '%',
    maxSimilarity: maxSimilarity + '%',
    stdDev: Math.round(stdDev * 100) / 100,
    severityRating: avgSimilarity < 30 ? 'high-drift' : avgSimilarity < 50 ? 'moderate-drift' : 'coherent',
    driftVisualization: passageVectors.map(p => ({ index: p.index, bar: '#'.repeat(Math.round(p.score / 5)) })),
    passageCount: passageVectors.length,
    scoreDistribution: {
      high: passageVectors.filter(p => p.score >= 60).length,
      medium: passageVectors.filter(p => p.score >= 30 && p.score < 60).length,
      low: passageVectors.filter(p => p.score < 30).length
    }
  };

  if (avgSimilarity < 30) {
    issues.push({ severity: 'warning', impact: 'high', message: 'Document coherence score: ' + Math.round(avgSimilarity) + '% — high semantic drift detected. Average entity overlap across all passages is very low.', element: 'document coherence', fix: 'Restructure content: ensure every passage supports the primary topic entities. Remove or rewrite off-topic sections.', link: '', evidence: 'Avg similarity: ' + Math.round(avgSimilarity) + '%, StdDev: ' + (Math.round(stdDev * 100) / 100) + ', Range: ' + minSimilarity + '% - ' + maxSimilarity + '%' });
    p += 10;
  } else if (avgSimilarity < 50) {
    issues.push({ severity: 'info', impact: 'medium', message: 'Moderate document coherence (' + Math.round(avgSimilarity) + '%). Some passages drift from core entities.', element: 'document coherence', fix: 'Review low-scoring passages and add entity references to improve topical focus.', link: '', evidence: 'Avg similarity: ' + Math.round(avgSimilarity) + '%' });
    p += 4;
  }

  const k = Math.min(5, Math.max(2, Math.round(passages.length / 4)));
  const clusterAssignments = [];
  passageSimilarities.forEach((ps, idx) => {
    const clusterId = Math.min(Math.floor(ps.similarityScore / (100 / k)), k - 1);
    clusterAssignments.push({ passageIndex: idx, clusterId, score: ps.similarityScore, preview: ps.preview.substring(0, 80) });
  });
  const clusters = {};
  clusterAssignments.forEach(ca => {
    if (!clusters[ca.clusterId]) clusters[ca.clusterId] = [];
    clusters[ca.clusterId].push(ca);
  });
  const clusterSummary = Object.entries(clusters).map(([clusterId, members]) => ({
    clusterId: parseInt(clusterId),
    size: members.length,
    avgScore: Math.round(members.reduce((a, m) => a + m.score, 0) / members.length),
    memberIndices: members.map(m => m.passageIndex),
    representativePassage: members.sort((a, b) => b.score - a.score)[0]?.preview || ''
  }));
  data.contentClusters = clusterSummary;

  const dominantCluster = clusterSummary.sort((a, b) => b.size - a.size)[0];
  const orphanClusters = clusterSummary.filter(c => c.avgScore < 25 && c.size > 0);
  if (orphanClusters.length > 0) {
    const orphanCount = orphanClusters.reduce((a, c) => a + c.size, 0);
    issues.push({ severity: 'info', impact: 'medium', message: orphanCount + ' orphan passage(s) detected across ' + orphanClusters.length + ' cluster(s) (avg similarity < 25%). These passages do not align with any primary topic cluster. Dominant cluster: ' + (dominantCluster ? 'cluster #' + dominantCluster.clusterId + ' (' + dominantCluster.size + ' passages, avg ' + dominantCluster.avgScore + '%)' : 'none'), element: 'content clustering', fix: 'Either integrate orphan passages with surrounding topic clusters or remove them if they are off-topic.', link: '', evidence: orphanCount + ' orphan passages in ' + orphanClusters.length + ' low-similarity clusters' });
    p += 4;
  }
  if (dominantCluster && dominantCluster.size < passages.length * 0.3 && passages.length > 3) {
    issues.push({ severity: 'info', impact: 'low', message: 'No dominant topic cluster — largest cluster (' + dominantCluster.size + '/' + passages.length + ' passages) represents only ' + Math.round((dominantCluster.size / passages.length) * 100) + '% of content. Content may lack a focused central theme.', element: 'topic focus', fix: 'Consolidate passages around a central topic. Reduce tangential sections that dilute the core message.', link: '' });
    p += 3;
  }

  return { level: 15, name: 'Passage Vector & Cosine Similarity Profiler', score: sc(p), issues, data };
  } catch (e) { return { level: 15, name: 'Passage Vector & Cosine Similarity Profiler', score: 0, issues: [{ severity: 'critical', impact: 'critical', message: 'Level 15 analysis failed: ' + e.message, element: 'system' }], data: { error: e.message } }; }
}

function level16($, url, config) {
  try {
  const issues = [];
  let p = 0;
  const text = getTextContent($) || '';
  const wc = countWords(text);
  const subfunctions = {};
  const data = subfunctions;

  const entities = extractKnowledgeGraphEntities(text);
  const namedEntities = extractEntities(text);
  data.extractedEntities = entities.slice(0, 40);
  data.namedEntities = namedEntities.slice(0, 30);

  const entityNames = entities.map(e => e.entity).filter(e => e.length > 3).slice(0, 20);

  const trustedSources = [
    { label: 'On-page occurrence (self-reference)', content: text },
    { label: 'Structured data fields (schema markup)', content: text }
  ];

  const entityConsensusResults = entityNames.map(entity => {
    const cr = crossReferenceEntityConsensus(entity, text, '');
    return {
      entity,
      consensusRatio: cr.consensusRatio,
      consensusLevel: cr.consensusLevel,
      totalMentions: cr.totalMentions,
      sourcesMentioning: cr.sourcesMentioning,
      sourceNote: 'Consensus is computed from on-page entity occurrence and schema markup only. No external knowledge-base verification (e.g. Wikipedia/Wikidata) was performed, so no claim is made about real-world entity agreement.'
    };
  });
  data.entityConsensus = entityConsensusResults;

  const strongConsensus = entityConsensusResults.filter(e => e.consensusLevel === 'strong consensus').length;
  const moderateConsensus = entityConsensusResults.filter(e => e.consensusLevel === 'moderate consensus').length;
  const weakConsensus = entityConsensusResults.filter(e => e.consensusLevel === 'weak/no consensus').length;
  const overallConsensusRate = entityNames.length > 0 ? Math.round(((strongConsensus + moderateConsensus) / entityNames.length) * 100) : 0;

  data.consensusSummary = {
    totalEntities: entityNames.length,
    strongConsensus,
    moderateConsensus,
    weakConsensus,
    overallConsensusRate: overallConsensusRate + '%'
  };

  if (weakConsensus > strongConsensus && entityNames.length > 3) {
    issues.push({ severity: 'warning', impact: 'high', message: weakConsensus + '/' + entityNames.length + ' entities appear only weakly across the on-page content. Overall on-page entity occurrence rate: ' + overallConsensusRate + '%. (On-page consensus reflects internal consistency only — it is not external knowledge-base verification.)', element: 'entity alignment', fix: 'Ensure core entities are referenced consistently in headings, body, and structured data. Add citations from .edu, .gov, or research domains for external support.', link: url, evidence: 'Entities with weak on-page occurrence: ' + entityConsensusResults.filter(e => e.consensusLevel === 'weak/no consensus').slice(0, 5).map(e => e.entity).join(', '), recommendation: 'Target > 70% on-page entity consistency by aligning headings, body text, and schema' });
    p += 10;
  }
  if (overallConsensusRate < 50 && entityNames.length > 2) {
    issues.push({ severity: 'warning', impact: 'high', message: 'Low on-page entity consistency: ' + overallConsensusRate + '%. Entities mentioned in one place are not reinforced elsewhere on the page.', element: 'entity trust', fix: 'Reinforce entity recognition by consistent naming across title, headings, body, and structured data.', link: url, evidence: 'Consistency rate: ' + overallConsensusRate + '% across ' + entityNames.length + ' entities (on-page only)' });
    p += 8;
  }

  const externalLinks = [];
  let hostname = '';
  try { hostname = new URL(url).hostname; } catch {}
  $('a[href^="http"]').each((i, el) => {
    const href = $(el).attr('href') || '';
    try {
      const lu = new URL(href).hostname;
      if (lu !== hostname) {
        const isEduGov = /\.(edu|gov|ac\.|mil)\b/i.test(lu);
        const isResearch = /(research|sciencedirect|ncbi|pubmed|scholar|springer|wiley|jstor|nature|science)/i.test(href);
        externalLinks.push({
          href: href.substring(0, 200),
          hostname: lu,
          isAuthoritative: isEduGov || isResearch,
          linkText: $(el).text().trim().substring(0, 80),
          domainType: isEduGov ? 'educational/govt' : isResearch ? 'research' : 'general'
        });
      }
    } catch {}
  });
  data.externalLinks = externalLinks.slice(0, 30);

  const authoritativeLinks = externalLinks.filter(l => l.isAuthoritative);
  const generalLinks = externalLinks.filter(l => !l.isAuthoritative);
  const citationQualityScore = externalLinks.length > 0 ? Math.round((authoritativeLinks.length / externalLinks.length) * 100) : 0;

  data.citationQuality = {
    totalExternal: externalLinks.length,
    authoritativeCount: authoritativeLinks.length,
    generalCount: generalLinks.length,
    authoritativeRatio: citationQualityScore + '%',
    score: citationQualityScore
  };

  if (externalLinks.length === 0 && wc > 200) {
    issues.push({ severity: 'warning', impact: 'medium', message: 'No external outbound links found. Pages lacking external citations may appear less authoritative. Citing trusted sources (.edu, .gov, research) is a key E-E-A-T signal.', element: 'external citations', fix: 'Add 3-5 external links to authoritative sources: academic research, government data, industry standards.', link: url, evidence: '0 external links on a page with ' + wc + ' words', recommendation: 'Aim for at least 1 authoritative citation per 300 words' });
    p += 6;
  } else if (citationQualityScore < 30 && externalLinks.length >= 3) {
    issues.push({ severity: 'info', impact: 'medium', message: 'Only ' + authoritativeLinks.length + '/' + externalLinks.length + ' external links point to authoritative domains (.edu, .gov, research). Low authoritative citation ratio: ' + citationQualityScore + '%.', element: 'citation quality', fix: 'Replace some general external links with citations from .edu, .gov, or peer-reviewed research sources.', link: url });
    p += 3;
  }

  const citationFormatted = (text.match(/\([^)]*\d{4}[^)]*\)/g) || []).length;
  const hasReferencesSection = /\b(references|sources|citations|bibliography|works cited|further reading|external links)\b/i.test(text);
  data.citationFormatting = {
    parentheticalCitations: citationFormatted,
    hasReferencesSection,
    properFormatting: citationFormatted > 0 && hasReferencesSection
  };
  if (authoritativeLinks.length > 0 && !hasReferencesSection) {
    issues.push({ severity: 'info', impact: 'low', message: authoritativeLinks.length + ' authoritative citations found but no dedicated references/sources section. A formatted references section improves credibility perception.', element: 'references', fix: 'Add a "References" or "Sources" section listing all cited works with proper formatting.', link: url });
    p += 2;
  }

  const orgSchema = $('script[type="application/ld+json"]').filter((i, el) => {
    try { const d = JSON.parse($(el).html() || '{}'); const arr = Array.isArray(d) ? d : [d]; return arr.some(s => s['@type'] === 'Organization'); } catch { return false; }
  });
  const personSchema = $('script[type="application/ld+json"]').filter((i, el) => {
    try { const d = JSON.parse($(el).html() || '{}'); const arr = Array.isArray(d) ? d : [d]; return arr.some(s => s['@type'] === 'Person'); } catch { return false; }
  });
  const hasLogo = $('[itemprop="logo"], meta[property="og:image"]').length > 0 || (orgSchema.length > 0 && (() => { try { const d = JSON.parse(orgSchema.first().html() || '{}'); return !!(d.logo || (d.image)); } catch { return false; } })());
  const hasSocialProfiles = $('a[href*="facebook.com"], a[href*="twitter.com"], a[href*="linkedin.com"], a[href*="instagram.com"], a[href*="youtube.com"]').length > 0;
  const hasKnowledgePanelName = $('meta[property="og:site_name"], meta[name="application-name"]').length > 0 || (orgSchema.length > 0 && (() => { try { return !!JSON.parse(orgSchema.first().html() || '{}').name; } catch { return false; } })());
  const schemaCompleteness = (orgSchema.length > 0 ? 1 : 0) + (personSchema.length > 0 ? 1 : 0) + (hasLogo ? 1 : 0) + (hasSocialProfiles ? 1 : 0) + (hasKnowledgePanelName ? 1 : 0);

  data.knowledgePanelReadiness = {
    hasOrganizationSchema: orgSchema.length > 0,
    hasPersonSchema: personSchema.length > 0,
    hasLogo,
    hasSocialProfiles,
    hasSiteName: hasKnowledgePanelName,
    schemaCompleteness: schemaCompleteness + '/5',
    score: Math.round((schemaCompleteness / 5) * 100),
    readyForPanel: schemaCompleteness >= 4,
    missingElements: [
      ...(orgSchema.length === 0 ? ['Organization schema with logo and name'] : []),
      ...(!hasLogo ? ['Logo image (112x112px minimum for knowledge panel)'] : []),
      ...(!hasSocialProfiles ? ['Linked social profiles (Facebook, Twitter, LinkedIn, etc.)'] : []),
      ...(!hasKnowledgePanelName ? ['Site name meta tag (og:site_name)'] : [])
    ]
  };

  if (data.knowledgePanelReadiness.score < 60 && wc > 300) {
    issues.push({ severity: 'warning', impact: 'medium', message: 'Low Knowledge Panel readiness: ' + data.knowledgePanelReadiness.score + '/100. Missing: ' + data.knowledgePanelReadiness.missingElements.slice(0, 3).join(', ') + '. Knowledge Panels require strong entity signals.', element: 'knowledge panel', fix: 'Add: Organization schema with logo (112x112px), verified social profiles (Google requires linked profiles), and site name meta tag.', link: url, evidence: 'Panel readiness: ' + data.knowledgePanelReadiness.score + '/100. Schema completeness: ' + data.knowledgePanelReadiness.schemaCompleteness, recommendation: 'Target 80%+ readiness with org schema + logo + social profiles + site name' });
    p += 6;
  }

  const contradictoryClaims = [];
  const factPatterns = [
    { pattern: /\b(\d+\.?\d*%)\b/g, label: 'percentage' },
    { pattern: /\b(\$\d+(?:\.\d{2})?)\b/g, label: 'monetary' },
    { pattern: /\b(\d{4})\b/g, label: 'year' }
  ];
  const factMap = {};
  factPatterns.forEach(fp => {
    const matches = text.match(fp.pattern) || [];
    matches.forEach(m => {
      if (!factMap[fp.label]) factMap[fp.label] = [];
      factMap[fp.label].push(m);
    });
  });
  const uniqueFacts = {};
  Object.entries(factMap).forEach(([label, values]) => {
    const deduped = [...new Set(values)];
    uniqueFacts[label] = deduped;
  });
  data.factualClaims = uniqueFacts;
  const totalClaims = Object.values(uniqueFacts).reduce((a, v) => a + v.length, 0);
  data.totalFactualClaims = totalClaims;

  if (totalClaims > 0) {
    const unverifiableClaims = entityConsensusResults.filter(e => e.consensusLevel === 'weak/no consensus');
    if (unverifiableClaims.length > 0) {
      contradictoryClaims.push({
        type: 'unverifiable',
        count: unverifiableClaims.length,
        entities: unverifiableClaims.slice(0, 5).map(e => e.entity),
        recommendation: 'Add citations from authoritative sources for these claims'
      });
    }
  }
  data.contradictoryClaims = contradictoryClaims;

  if (contradictoryClaims.length > 0) {
    issues.push({ severity: 'warning', impact: 'high', message: contradictoryClaims.length + ' high-risk claim type(s) detected: ' + contradictoryClaims.map(c => c.count + ' ' + c.type + ' claims (' + c.entities.join(', ') + ')').join('; ') + '. Unverifiable or contradictory claims reduce trustworthiness signals.', element: 'claim verification', fix: 'Cross-reference all factual claims with authoritative sources. Remove or qualify claims that cannot be supported by external references.', link: url, evidence: contradictoryClaims.length + ' claim risk categories' });
    p += 7;
  }

  const finalConsensusScore = (() => {
    let score = 0;
    score += Math.min(30, overallConsensusRate * 0.3);
    score += Math.min(20, citationQualityScore * 0.2);
    score += Math.min(25, data.knowledgePanelReadiness.score * 0.25);
    score += data.citationFormatting.hasReferencesSection ? 10 : 0;
    score += Math.min(15, externalLinks.length * 2);
    if (weakConsensus === 0 && entityNames.length > 0) score += 10;
    else if (weakConsensus <= entityNames.length * 0.2) score += 5;
    return Math.min(100, Math.round(score));
  })();
  data.consensusScore = finalConsensusScore;
  data.trustLevel = finalConsensusScore >= 70 ? 'strong' : finalConsensusScore >= 45 ? 'moderate' : 'weak';

  if (finalConsensusScore < 45) {
    issues.push({ severity: 'warning', impact: 'high', message: 'Overall consensus score: ' + finalConsensusScore + '/100 (weak). Page lacks sufficient entity alignment, authoritative citations, and knowledge panel signals for high trustworthiness.', element: 'trust signals', fix: 'High priority: add Organization schema with logo, increase authoritative external citations to 5+, link verified social profiles, and ensure all factual claims are supported by sources.', link: url, evidence: 'Consensus score: ' + finalConsensusScore + '/100 (entity: ' + overallConsensusRate + '%, citation: ' + citationQualityScore + '%, panel: ' + data.knowledgePanelReadiness.score + '%)' });
    p += 8;
  } else if (finalConsensusScore < 70) {
    issues.push({ severity: 'info', impact: 'medium', message: 'Moderate consensus score: ' + finalConsensusScore + '/100. Trust signals can be improved with more citations and stronger entity alignment.', element: 'trust signals', fix: 'Add more .edu/.gov citations, improve schema completeness, and link social profiles.', link: url });
    p += 3;
  }

  return { level: 16, name: 'Third-Party Consensus & Entity Alignment Scorer', score: sc(p), issues, data };
  } catch (e) { return { level: 16, name: 'Third-Party Consensus & Entity Alignment Scorer', score: 0, issues: [{ severity: 'critical', impact: 'critical', message: 'Level 16 analysis failed: ' + e.message, element: 'system' }], data: { error: e.message } }; }
}

function level17($, url, config, responseHeaders) {
  try {
  const issues = [];
  let p = 0;
  const subfunctions = {};
  const data = subfunctions;
  const text = getTextContent($) || '';

  const schemas = extractSchemas($);
  const schemaAnalysis = analyzeSchema($);
  data.schemas = schemaAnalysis;

  const headingAnalysis = analyzeHeadingHierarchy($);
  data.headings = headingAnalysis;

  const canonicalAnalysis = analyzeCanonicalIntegrity($, url);
  data.canonical = canonicalAnalysis;

  const autoFixes = [];
  const invalidSchemas = schemaAnalysis.filter(s => !s.validation.valid);
  if (invalidSchemas.length > 0) {
    invalidSchemas.forEach(s => {
      const fix = generateAutonomousFix({ type: 'schema', issue: s.validation.errors.join(', '), keywords: s.type }, 'article');
      autoFixes.push({
        type: 'schema',
        schemaType: s.type,
        errors: s.validation.errors,
        fix: {
          code: fix.code,
          description: fix.description,
          risk: fix.risk,
          rollbackPlan: fix.rollbackPlan,
          testCode: `const schema = JSON.parse(\`${fix.code.replace(/<\/?script[^>]*>/g, '')}\`); assert(schema['@type'] === '${s.type}'); assert(schema['@context'] === 'https://schema.org');`
        }
      });
    });
    issues.push({ severity: 'critical', impact: 'high', message: invalidSchemas.length + ' schema(s) have validation errors requiring autonomous fix. Generated corrected JSON-LD with validation tests.', element: 'structured data', fix: 'Apply auto-generated schema fixes from sandbox report.', link: url, evidence: invalidSchemas.map(s => s.type + ': ' + s.validation.errors.join('; ')).join(' | ') });
    p += 12;
  }

  if (headingAnalysis.hierarchyIssues.length > 0) {
    const skippedLevels = headingAnalysis.hierarchyIssues.filter(i => i.type === 'skipped-level');
    if (skippedLevels.length > 0) {
      const headingFix = generateAutonomousFix({ type: 'heading', issue: 'skipped-level' }, 'article');
      const correctedHierarchy = headingAnalysis.headings.map(h => {
        let correctedLevel = h.level;
        const skipIssue = skippedLevels.find(sl => sl.selector === h.selector);
        if (skipIssue) correctedLevel = skipIssue.from + 1;
        return { original: 'H' + h.level + ': ' + h.text, corrected: 'H' + correctedLevel + ': ' + h.text, selector: h.selector };
      });
      autoFixes.push({
        type: 'heading',
        headingFix: {
          code: headingFix.code,
          description: headingFix.description,
          correctedHierarchy,
          testCode: `const headings = document.querySelectorAll('h1,h2,h3,h4,h5,h6'); let prev = 0; let valid = true; headings.forEach(h => { const lv = parseInt(h.tagName[1]); if (lv > prev + 1 && prev > 0) valid = false; prev = lv; }); assert(valid);`
        }
      });
      issues.push({ severity: 'warning', impact: 'high', message: skippedLevels.length + ' heading level(s) skipped in hierarchy. Autonomous fix generates corrected heading markup.', element: 'headings', fix: 'Apply corrected heading hierarchy from sandbox report.', link: url, evidence: skippedLevels.map(sl => 'H' + sl.from + ' -> H' + sl.to + ' at ' + sl.selector).join('; ') });
      p += 8;
    }
    if (headingAnalysis.h1Count === 0) {
      const h1Fix = generateAutonomousFix({ type: 'heading', issue: 'h1 missing', keywords: url.split('/').pop().replace(/[-_]/g, ' ') || 'page title' }, 'article');
      autoFixes.push({ type: 'heading-missing-h1', fix: { code: h1Fix.code, description: h1Fix.description, risk: h1Fix.risk } });
      issues.push({ severity: 'critical', impact: 'high', message: 'Missing H1 tag — critical for topic relevance. Autonomous fix generates corrected markup.', element: 'headings', fix: 'Add H1 tag to page.', link: url });
      p += 10;
    }
  }

  if (canonicalAnalysis.issues.length > 0 && !canonicalAnalysis.isSelfReferential) {
    const canonFix = generateAutonomousFix({ type: 'canonical', issue: 'canonical', url: url }, 'article');
    autoFixes.push({
      type: 'canonical',
      fix: {
        code: canonFix.code,
        description: canonFix.description,
        risk: canonFix.risk,
        testCode: `const link = document.querySelector('link[rel="canonical"]'); assert(link.href === '${url}');`
      }
    });
    issues.push({ severity: 'warning', impact: 'high', message: 'Canonical tag issues detected. Autonomous fix generates corrected canonical tag.', element: 'canonical', fix: 'Apply corrected canonical tag from sandbox report.', link: url, evidence: canonicalAnalysis.issues.join('; ') });
    p += 8;
  }

  const redTeamResults = redTeamTest(url, $, responseHeaders || {});
  data.redTeam = redTeamResults;

  if (redTeamResults.criticalFindings > 2) {
    issues.push({ severity: 'critical', impact: 'high', message: 'Red-team analysis found ' + redTeamResults.criticalFindings + ' high-risk findings from real header/HTML checks. Page scored ' + redTeamResults.overallRisk.toUpperCase() + ' risk.', element: 'security/robustness', fix: 'Address findings: ' + redTeamResults.tests.filter(t => t.severity === 'high').map(t => t.test).join(', ') + '.', link: url, evidence: 'Risk: ' + redTeamResults.overallRisk + ', High findings: ' + redTeamResults.criticalFindings });
    p += 12;
  } else if (redTeamResults.criticalFindings > 0) {
    issues.push({ severity: 'warning', impact: 'medium', message: 'Red-team found ' + redTeamResults.criticalFindings + ' high-risk finding(s). Overall risk: ' + redTeamResults.overallRisk.toUpperCase() + '.', element: 'robustness', fix: 'Review: ' + redTeamResults.tests.filter(t => t.severity === 'high').map(t => t.test).join(', '), link: url, evidence: 'Risk: ' + redTeamResults.overallRisk });
    p += 6;
  }

  const vulnerablePatterns = [];
  const aiPatterns = detectAIPatterns(text);
  if (aiPatterns.score > 30) {
    vulnerablePatterns.push({ pattern: 'AI-generated content patterns', score: aiPatterns.score, matches: aiPatterns.matches.slice(0, 5) });
    issues.push({ severity: 'warning', impact: 'medium', message: 'Content shows ' + aiPatterns.matches.length + ' AI-typical writing patterns (score: ' + aiPatterns.score + '). Core update penalizes templated content.', element: 'content', fix: 'Rewrite flagged sections with original insights, personal experience, and unique data.', link: url, evidence: 'AI pattern score: ' + aiPatterns.score + ', Matches: ' + aiPatterns.matches.length });
    p += 6;
  }

  const syntheticContent = analyzeSyntheticAgentBehavior(text);
  if (syntheticContent.verdict !== 'likely human-written') {
    vulnerablePatterns.push({ pattern: 'synthetic-agent patterns', score: syntheticContent.syntheticScore, verdict: syntheticContent.verdict, flags: syntheticContent.totalFlags });
    issues.push({ severity: 'info', impact: 'low', message: 'Synthetic agent analysis: ' + syntheticContent.verdict + ' (' + syntheticContent.totalFlags + ' flag instances). May be at risk from algorithmic detection.', element: 'content', fix: 'Reduce AI-typical phrasing and add more original analysis, specific examples, and data-driven claims.', link: url, evidence: 'Synthetic score: ' + syntheticContent.syntheticScore + ', Verdict: ' + syntheticContent.verdict });
    p += 4;
  }

  const prs = [];
  if (autoFixes.length > 0) {
    const branchName = 'fix/seo-auto-' + Date.now().toString(36);
    autoFixes.forEach((fix, idx) => {
      const commitMsg = 'fix(' + fix.type + '): ' + (fix.fix ? fix.fix.description.substring(0, 60) : 'auto-generated fix');
      prs.push({
        branch: branchName + '-' + idx,
        commitMessage: commitMsg,
        files: [{
          path: fix.type === 'schema' ? 'index.html (or your site template file)' : fix.type.includes('heading') ? 'index.html (heading section)' : 'index.html (head section)',
          changes: fix.fix ? fix.fix.code : '',
          description: fix.fix ? fix.fix.description : ''
        }],
        testFiles: [{
          path: 'tests/' + fix.type + '.test.js',
          code: fix.fix && fix.fix.testCode ? fix.fix.testCode : '// Validation test for ' + fix.type
        }],
        description: 'Automated SEO fix for ' + fix.type + ' issues detected during sandbox audit.\n\n' + (fix.fix ? fix.fix.description : '') + '\n\nRisk: ' + (fix.fix ? fix.fix.risk : 'low') + '\nRollback: ' + (fix.fix ? fix.fix.rollbackPlan : 'Revert via git')
      });
    });
  }
  data.pullRequests = prs;

  const sandboxReport = {
    generatedAt: new Date().toISOString(),
    totalFixesGenerated: autoFixes.length,
    prsGenerated: prs.length,
    redTeamSummary: {
      testsRun: redTeamResults.totalTests,
      criticalFindings: redTeamResults.criticalFindings,
      overallRisk: redTeamResults.overallRisk
    },
    vulnerablePatternsFound: vulnerablePatterns.length,
    beforeAfter: {
      before: {
        schemaErrors: invalidSchemas.length,
        headingIssues: headingAnalysis.hierarchyIssues.length,
        canonicalIssues: canonicalAnalysis.issues.length,
        redTeamCritical: redTeamResults.criticalFindings,
        aiPatternScore: aiPatterns.score
      },
      after: {
        note: 'Not measured — these are projected targets IF the generated fixes are applied and verified. Values are NOT asserted as resolved.',
        schemaErrorsTarget: 0,
        headingIssuesTarget: 0,
        canonicalIssuesTarget: 0,
        redTeamCriticalTarget: null,
        aiPatternScoreTarget: null
      }
    },
    fixSummary: autoFixes.map(f => ({ type: f.type, description: f.fix ? f.fix.description : 'Generated fix', risk: f.fix ? f.fix.risk : 'unknown' }))
  };
  data.sandboxReport = sandboxReport;

  return { level: 17, name: 'Autonomous Fix Generator & Red-Team Checks', score: sc(p), issues, data };
  } catch (e) { return { level: 17, name: 'Autonomous Fix Generator & Red-Team Checks', score: 0, issues: [{ severity: 'critical', impact: 'critical', message: 'Level 17 analysis failed: ' + e.message, element: 'system' }], data: { error: e.message } }; }
}

function level18($, bodyText, url) {
  try {
  const issues = [];
  let p = 0;
  const text = bodyText || getTextContent($) || '';
  const subfunctions = {};
  const data = subfunctions;

  const headingCount = $('h1,h2,h3,h4,h5,h6').length;
  const imageCount = $('img').length;
  const linkCount = $('a[href]').length;
  const listCount = $('ol, ul').length;
  const wordCount = countWords(text);
  const serpVolatility = analyzeSerpVolatility(text, {
    wordCount, headingCount, imageCount, linkCount, listCount
  });
  data.serpVolatility = serpVolatility;

  const serpFeatures = [];
  const h1 = $('h1').first().text().trim();
  const title = $('title').first().text().trim();
  const metaDesc = $('meta[name="description"]').attr('content') || '';
  const hasTable = $('table').length > 0;
  const hasList = $('ul, ol').length > 0;
  const hasFAQ = $('script[type="application/ld+json"]').filter((i, el) => {
    try { const d = JSON.parse($(el).html() || '{}'); const arr = Array.isArray(d) ? d : [d]; return arr.some(s => s['@type'] === 'FAQPage'); } catch { return false; }
  }).length > 0;

  const questionCount = (text.match(/\b(how|what|why|when|where|who|can|does|is|are|do|should|will|would|could|may|might|shall|ought|must|need)\b\s+[^?]+\?/gi) || []).length;
  const listItems = $('li').length;
  const hasDefinitions = /\b(is defined as|refers to|means that|is a|are a)\b/i.test(text);
  const contentStructure = analyzeContentStructure(text);
  data.contentStructure = contentStructure;

  let aiOverviewScore = 0;
  if (questionCount >= 4) aiOverviewScore += 25;
  if (hasList && listItems >= 3) aiOverviewScore += 20;
  if (hasTable) aiOverviewScore += 15;
  if (hasDefinitions) aiOverviewScore += 15;
  if (wordCount >= 800 && wordCount <= 2500) aiOverviewScore += 15;
  if (contentStructure.paragraphs >= 5) aiOverviewScore += 10;
  const readability = analyzeReadability(text);
  data.readability = readability;
  if (readability.fleschKincaid >= 50 && readability.fleschKincaid <= 80) aiOverviewScore += 10;
  const h2Count = $('h2').length;
  if (h2Count >= 3) aiOverviewScore += 10;
  data.aiOverviewReadiness = { score: aiOverviewScore, eligible: aiOverviewScore >= 60, questionCount, listItems, hasTable, hasDefinitions, hasFAQ, h2Count };

  if (aiOverviewScore >= 60) {
    serpFeatures.push({ feature: 'AI Overview', eligible: true, confidence: aiOverviewScore + '%' });
  } else {
    serpFeatures.push({ feature: 'AI Overview', eligible: false, confidence: aiOverviewScore + '%', gap: (60 - aiOverviewScore) + ' points needed' });
    issues.push({ severity: 'warning', impact: 'medium', message: 'Page not fully optimized for AI Overview eligibility (score: ' + aiOverviewScore + '/100). Needs more question-answer format, structured lists, tables, and clear definitions.', element: 'zero-click', fix: 'Add Q&A sections, structured lists (3+ items), data tables, and clear definition statements. Target: 4+ questions answered, 3+ list items, table with comparative data.', link: url, evidence: 'AI Overview score: ' + aiOverviewScore + '%, Questions: ' + questionCount + ', Lists: ' + listItems + ', Table: ' + hasTable });
    p += 8;
  }

  let featuredSnippetScore = 0;
  const paraLengths = [];
  $('p').each((i, el) => {
    const pt = $(el).text().trim();
    if (pt.length > 40 && pt.length < 300) paraLengths.push(pt);
  });
  if (paraLengths.length > 0) featuredSnippetScore += 20;
  if (hasList && listItems >= 3) featuredSnippetScore += 25;
  if (hasTable) featuredSnippetScore += 25;
  if (questionCount >= 2) featuredSnippetScore += 20;
  if (hasDefinitions) featuredSnippetScore += 10;
  const bestPara = paraLengths.sort((a, b) => a.length - b.length)[0] || '';
  const snippetFormat = hasTable ? 'table' : hasList && listItems >= 3 ? 'list' : 'paragraph';
  data.featuredSnippet = { score: featuredSnippetScore, bestCandidate: bestPara.substring(0, 200), snippetFormat, eligible: featuredSnippetScore >= 60 };

  if (featuredSnippetScore < 60) {
    issues.push({ severity: 'warning', impact: 'medium', message: 'Featured snippet optimization score: ' + featuredSnippetScore + '/100. Content format not optimized for featured snippet capture.', element: 'zero-click', fix: 'Format content for ' + (hasTable ? 'table' : hasList && listItems >= 3 ? 'list' : 'paragraph') + ' snippet: add concise definitions (40-60 chars), numbered steps, or comparison tables.', link: url, evidence: 'Snippet score: ' + featuredSnippetScore + ', Format: ' + snippetFormat + ', Eligible: ' + (featuredSnippetScore >= 60) });
    p += 7;
  }

  const estimatedCTR = {
    withZeroClick: Math.min(35, 12 + aiOverviewScore * 0.2 + featuredSnippetScore * 0.2),
    withoutZeroClick: Math.min(10, 3 + (title.length > 0 ? 2 : 0) + (metaDesc.length > 0 ? 2 : 0)),
    uplift: 0
  };
  estimatedCTR.uplift = Math.round((estimatedCTR.withZeroClick - estimatedCTR.withoutZeroClick) * 100) / 100;
  data.estimatedCTR = estimatedCTR;

  const commerceAudit = agenticCommerceAudit($);
  data.commerceAudit = commerceAudit;

  if (commerceAudit.totalProducts > 0) {
    const schemaProducts = commerceAudit.schemaProducts;
    if (schemaProducts.length === 0) {
      issues.push({ severity: 'critical', impact: 'high', message: commerceAudit.totalProducts + ' product(s) detected but none have schema markup. Autonomous purchasing agents cannot read product data without structured schema.', element: 'agentic commerce', fix: 'Add Product schema markup with name, price, currency, availability, and image for each product.', link: url, evidence: 'Heuristic products: ' + commerceAudit.heuristicProducts.length + ', Schema products: 0', recommendation: 'Add JSON-LD Product schema with offers, price, and availability fields' });
      p += 15;
    } else {
      const missingPrice = schemaProducts.filter(p => !p.price);
      const missingAvailability = schemaProducts.filter(p => !p.availability || p.availability === 'Unknown');
      if (missingPrice.length > 0) {
        issues.push({ severity: 'warning', impact: 'high', message: missingPrice.length + '/' + schemaProducts.length + ' schema products missing price data. Agentic commerce requires complete price + currency + availability.', element: 'agentic commerce', fix: 'Add missing price and priceCurrency fields to schema.', link: url, evidence: missingPrice.map(p => p.name + ' missing price').join('; ') });
        p += 8;
      }
      if (missingAvailability.length > 0) {
        issues.push({ severity: 'warning', impact: 'medium', message: missingAvailability.length + '/' + schemaProducts.length + ' products missing availability status. Agents need InStock/OutOfStock to decide purchases.', element: 'agentic commerce', fix: 'Add availability field using schema.org/InStock or schema.org/OutOfStock.', link: url, evidence: missingAvailability.map(p => p.name + ' missing availability').join('; ') });
        p += 6;
      }
    }
    if (!commerceAudit.commerceFeatures.hasAddToCart) {
      issues.push({ severity: 'warning', impact: 'medium', message: 'No add-to-cart functionality detected. Autonomous purchasing agents need structured checkout hooks to complete purchases.', element: 'agentic commerce', fix: 'Implement add-to-cart button with data attributes (data-product-id) and structured cart endpoint.', link: url });
      p += 6;
    }
    if (!commerceAudit.commerceFeatures.hasCartLink) {
      issues.push({ severity: 'info', impact: 'low', message: 'No cart/checkout link detected on page. Agentic workflows need navigation to checkout.', element: 'agentic commerce', fix: 'Add visible cart link or checkout button.', link: url });
      p += 3;
    }
  }

  const brandTerms = [];
  const ogSiteName = $('meta[property="og:site_name"]').attr('content') || '';
  if (ogSiteName) brandTerms.push(ogSiteName);
  try { const hostParts = new URL(url).hostname.replace('www.', '').split('.'); if (hostParts.length > 0) brandTerms.push(hostParts[0]); } catch {}
  const titleWords = title.split(/\s+/).filter(w => w.length > 2 && w[0] === w[0].toUpperCase());
  titleWords.forEach(w => { if (!brandTerms.includes(w)) brandTerms.push(w); });
  if (brandTerms.length === 0) brandTerms.push(url.replace(/https?:\/\//, '').split('/')[0].replace('www.', '').split('.')[0]);

  const mentionShare = synthesizeMentionShare(text, brandTerms);
  data.mentionShare = mentionShare;

  const brandMentionCount = mentionShare.totalMentions;
  if (brandMentionCount === 0 && brandTerms.length > 0) {
    issues.push({ severity: 'warning', impact: 'medium', message: 'Brand/page terms not mentioned in content. AI engines may fail to cite or attribute this page as source.', element: 'brand visibility', fix: 'Incorporate brand name and key branded terms naturally throughout content body.', link: url, evidence: 'Brand terms checked: ' + brandTerms.join(', ') + ' — zero mentions found' });
    p += 5;
  } else if (brandMentionCount < 3) {
    issues.push({ severity: 'info', impact: 'low', message: 'Low brand mention density (' + brandMentionCount + ' mentions). AI citation share may be limited.', element: 'brand visibility', fix: 'Increase natural brand references in content paragraphs.', link: url, evidence: 'Only ' + brandMentionCount + ' mentions across ' + mentionShare.totalWords + ' words' });
    p += 2;
  }

  const entityProminence = extractKnowledgeGraphEntities(text);
  data.entityProminence = entityProminence;
  const entitiesWithCount = entityProminence.filter(e => e.count > 2).map(e => e.entity);
  data.entityCountForAI = entitiesWithCount.length;
  if (entitiesWithCount.length < 3) {
    issues.push({ severity: 'info', impact: 'low', message: 'Low entity prominence (' + entitiesWithCount.length + ' entities with >2 mentions). AI engines extract named entities for citation; low density reduces mention share.', element: 'entity optimization', fix: 'Increase references to key named entities (brands, people, places, products) across content.', link: url, evidence: 'Only ' + entitiesWithCount.length + ' prominent entities found' });
    p += 3;
  }

  const visibilityShare = {
    aiOverviewShare: aiOverviewScore >= 60 ? Math.round(15 + aiOverviewScore * 0.2) + '%' : '0%',
    featuredSnippetShare: featuredSnippetScore >= 60 ? Math.round(10 + featuredSnippetScore * 0.15) + '%' : '0%',
    organicShare: Math.round(100 - (aiOverviewScore >= 60 ? 20 : 0) - (featuredSnippetScore >= 60 ? 15 : 0) - (hasFAQ ? 10 : 0)) + '%',
    brandMentionShare: mentionShare.shareOfVoice
  };
  data.visibilityShare = visibilityShare;

  return { level: 18, name: 'Zero-Click & Agentic Commerce Visibility Metrics', score: sc(p), issues, data };
  } catch (e) { return { level: 18, name: 'Zero-Click & Agentic Commerce Visibility Metrics', score: 0, issues: [{ severity: 'critical', impact: 'critical', message: 'Level 18 analysis failed: ' + e.message, element: 'system' }], data: { error: e.message } }; }
}

function level19($, url, config) {
  try {
  const issues = [];
  let p = 0;
  const subfunctions = {};
  const data = subfunctions;

  const edgeConfig = selfHealingEdgeScript(url);
  data.edgeConfig = edgeConfig;

  const schemas = extractSchemas($);
  const schemaAnalysis = analyzeSchema($);
  const canonicalAnalysis = analyzeCanonicalIntegrity($, url);
  const titleAnalysis = analyzeTitlePrecision($, url);

  const edgeWorkerScript = [];
  edgeWorkerScript.push("// Self-Healing Edge Worker — Auto-generated by SEO Audit Level 19");
  edgeWorkerScript.push("// Deploy to: Akamai EdgeWorkers, Cloudflare Workers, Fastly Compute@Edge");
  edgeWorkerScript.push("");
  edgeWorkerScript.push("addEventListener('fetch', event => {");
  edgeWorkerScript.push("  event.respondWith(handleRequest(event.request));");
  edgeWorkerScript.push("});");
  edgeWorkerScript.push("");
  edgeWorkerScript.push("async function handleRequest(request) {");
  edgeWorkerScript.push("  const url = new URL(request.url);");
  edgeWorkerScript.push("  const path = url.pathname;");
  edgeWorkerScript.push("  const config = {");
  edgeWorkerScript.push("    siteUrl: '" + url.replace(/\/$/, '') + "',");
  edgeWorkerScript.push("    injectSchema: " + (schemas.some(s => !s.valid) ? 'true' : 'false') + ",");
  edgeWorkerScript.push("    fixCanonical: " + (canonicalAnalysis.issues.length > 0 ? 'true' : 'false') + ",");
  edgeWorkerScript.push("    injectMeta: " + (!titleAnalysis.title || titleAnalysis.truncationRisk ? 'true' : 'false'));
  edgeWorkerScript.push("  };");
  edgeWorkerScript.push("");
  edgeWorkerScript.push("  let response = await fetch(request);");
  edgeWorkerScript.push("  let contentType = response.headers.get('Content-Type') || '';");
  edgeWorkerScript.push("  if (!contentType.includes('text/html')) return response;");
  edgeWorkerScript.push("");
  edgeWorkerScript.push("  let html = await response.text();");
  edgeWorkerScript.push("");

  if (schemas.some(s => !s.valid) || schemas.length === 0) {
    const schemaType = 'WebPage';
    const pageTitleForSchema = titleAnalysis.title || '';
    const schemaData = JSON.stringify(JSON.parse(generateSchemaCode(schemaType, { name: pageTitleForSchema, description: pageTitleForSchema })));
    edgeWorkerScript.push("  // Auto-fix: Schema injection");
    edgeWorkerScript.push("  if (config.injectSchema && !html.includes('application/ld+json')) {");
    edgeWorkerScript.push("    const schema = " + schemaData + ";");
    edgeWorkerScript.push("    const schemaTag = '<script type=\"application/ld+json\">' + JSON.stringify(schema) + '</script>';");
    edgeWorkerScript.push("    html = html.replace('</head>', schemaTag + '</head>');");
    edgeWorkerScript.push("  }");
    edgeWorkerScript.push("");
  }

  if (canonicalAnalysis.issues.length > 0) {
    edgeWorkerScript.push("  // Auto-fix: Canonical correction");
    edgeWorkerScript.push("  if (config.fixCanonical) {");
    edgeWorkerScript.push("    const canon = config.siteUrl + url.pathname.replace(/\\/+$/, '');");
    edgeWorkerScript.push("    const canonTag = '<link rel=\"canonical\" href=\"' + canon + '\" />';");
    edgeWorkerScript.push("    if (html.includes('rel=\"canonical\"')) {");
    edgeWorkerScript.push("      html = html.replace(/<link[^>]*rel=\"canonical\"[^>]*>/, canonTag);");
    edgeWorkerScript.push("    } else {");
    edgeWorkerScript.push("      html = html.replace('</head>', canonTag + '</head>');");
    edgeWorkerScript.push("    }");
    edgeWorkerScript.push("  }");
    edgeWorkerScript.push("");
  }

  if (!titleAnalysis.title || titleAnalysis.truncationRisk) {
    const optimalTitle = titleAnalysis.title ? titleAnalysis.title.substring(0, 55) : 'Page | ' + (new URL(url).hostname);
    edgeWorkerScript.push("  // Auto-fix: Meta tag injection / title correction");
    edgeWorkerScript.push("  if (config.injectMeta) {");
    edgeWorkerScript.push("    const titleTag = '<title>" + optimalTitle.replace(/</g, '&lt;').replace(/>/g, '&gt;') + "</title>';");
    edgeWorkerScript.push("    if (html.match(/<title>[^<]*<\\/title>/)) {");
    edgeWorkerScript.push("      html = html.replace(/<title>[^<]*<\\/title>/, titleTag);");
    edgeWorkerScript.push("    } else {");
    edgeWorkerScript.push("      html = html.replace('</head>', titleTag + '</head>');");
    edgeWorkerScript.push("    }");
    edgeWorkerScript.push("    if (!html.includes('name=\"description\"')) {");
    edgeWorkerScript.push("      const desc = '<meta name=\"description\" content=\"' + (config.siteUrl + ' - ' + url.pathname) + '\" />';");
    edgeWorkerScript.push("      html = html.replace('</head>', desc + '</head>');");
    edgeWorkerScript.push("    }");
    edgeWorkerScript.push("  }");
    edgeWorkerScript.push("");
  }

  edgeWorkerScript.push("  // 404 → closest match redirect");
  edgeWorkerScript.push("  if (response.status === 404) {");
  edgeWorkerScript.push("    const fallbackUrl = config.siteUrl + '/';");
  edgeWorkerScript.push("    return Response.redirect(fallbackUrl, 302);");
  edgeWorkerScript.push("  }");
  edgeWorkerScript.push("");
  edgeWorkerScript.push("  // Security headers injection");
  edgeWorkerScript.push("  const headers = new Headers(response.headers);");
  edgeWorkerScript.push("  if (!headers.has('X-Content-Type-Options')) headers.set('X-Content-Type-Options', 'nosniff');");
  edgeWorkerScript.push("  if (!headers.has('X-Frame-Options')) headers.set('X-Frame-Options', 'DENY');");
  edgeWorkerScript.push("  if (!headers.has('Referrer-Policy')) headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');");
  edgeWorkerScript.push("");
  edgeWorkerScript.push("  return new Response(html, {");
  edgeWorkerScript.push("    status: response.status,");
  edgeWorkerScript.push("    statusText: response.statusText,");
  edgeWorkerScript.push("    headers: headers");
  edgeWorkerScript.push("  });");
  edgeWorkerScript.push("}");
  edgeWorkerScript.push("");

  data.edgeWorkerScript = edgeWorkerScript.join('\n');

  const ghWorkflow = [];
  ghWorkflow.push("name: SEO Auto-Fix PR Pipeline");
  ghWorkflow.push("");
  ghWorkflow.push("on:");
  ghWorkflow.push("  schedule:");
  ghWorkflow.push("    - cron: '0 6 * * 1'  # Every Monday at 6 AM");
  ghWorkflow.push("  workflow_dispatch:");
  ghWorkflow.push("    inputs:");
  ghWorkflow.push("      url:");
  ghWorkflow.push("        description: 'URL to audit'");
  ghWorkflow.push("        required: false");
  ghWorkflow.push("        default: '" + url + "'");
  ghWorkflow.push("");
  ghWorkflow.push("jobs:");
  ghWorkflow.push("  seo-audit:");
  ghWorkflow.push("    runs-on: ubuntu-latest");
  ghWorkflow.push("    steps:");
  ghWorkflow.push("      - uses: actions/checkout@v4");
  ghWorkflow.push("      - uses: actions/setup-node@v4");
  ghWorkflow.push("        with:");
  ghWorkflow.push("          node-version: 20");
  ghWorkflow.push("      - run: npm install");
  ghWorkflow.push("      - name: Run SEO Audit");
  ghWorkflow.push("        run: node audit.js --url \\${{ github.event.inputs.url || '" + url + "' }} --output audit-report.json");
  ghWorkflow.push("      - name: Generate Fixes");
  ghWorkflow.push("        run: node generate-fixes.js --input audit-report.json --output fixes/");
  ghWorkflow.push("      - name: Validate Fixes");
  ghWorkflow.push("        run: |");
  ghWorkflow.push("          for fix in fixes/*.json; do");
  ghWorkflow.push("            node validate-fix.js --fix \"$fix\"");
  ghWorkflow.push("          done");
  ghWorkflow.push("      - name: Create Pull Request");
  ghWorkflow.push("        uses: peter-evans/create-pull-request@v6");
  ghWorkflow.push("        with:");
  ghWorkflow.push("          token: \\${{ secrets.GITHUB_TOKEN }}");
  ghWorkflow.push("          commit-message: 'fix(seo): automated SEO fixes from audit'");
  ghWorkflow.push("          title: 'SEO Auto-Fix: Issues detected on " + url + "'");
  ghWorkflow.push("          body: |");
  ghWorkflow.push("            ## Automated SEO Fix Report");
  ghWorkflow.push("            Source: " + url);
  ghWorkflow.push("            Date: \\${{ github.event.repository.updated_at }}");
  ghWorkflow.push("            ");
  ghWorkflow.push("            ### Changes");
  ghWorkflow.push("            - Schema markup corrections");
  ghWorkflow.push("            - Canonical tag fixes");
  ghWorkflow.push("            - Meta tag optimizations");
  ghWorkflow.push("            ");
  ghWorkflow.push("            ### Validation");
  ghWorkflow.push("            Each fix has been validated with automated tests.");
  ghWorkflow.push("          branch: seo/auto-fix-\\${{ github.run_id }}");
  ghWorkflow.push("          base: main");
  ghWorkflow.push("          labels: seo, automated");
  ghWorkflow.push("      - name: PR Summary");
  ghWorkflow.push("        run: echo 'PR created with SEO fixes'");

  data.githubWorkflow = ghWorkflow.join('\n');

  const selfCorrectionRules = [];
  const missingSchema = schemas.filter(s => !s.valid);
  if (missingSchema.length > 0) {
    selfCorrectionRules.push({
      id: 'CORR-001',
      priority: 1,
      trigger: 'Missing or invalid JSON-LD schema',
      detection: missingSchema.map(s => s.type + ': ' + s.validation.errors.join(', ')).join('; '),
      action: 'Inject valid schema via edge worker at request time',
      config: { workerPath: 'src/edge/schema-injection.js', deployTarget: 'edge', rollbackStrategy: 'Deploy previous version' },
      testCmd: 'curl -s ' + url + ' | grep -c "application/ld+json"'
    });
    issues.push({ severity: 'critical', impact: 'high', message: 'Self-correction rule CORR-001 triggered: ' + missingSchema.length + ' schema issues found. Edge worker auto-inject configured.', element: 'self-healing', fix: 'Deploy edge worker schema injection rule.', link: url, evidence: 'Rules: ' + missingSchema.map(s => s.type).join(', ') });
    p += 12;
  }
  if (canonicalAnalysis.issues.length > 0) {
    selfCorrectionRules.push({
      id: 'CORR-002',
      priority: 2,
      trigger: 'Missing or incorrect canonical tag',
      detection: canonicalAnalysis.issues.join('; '),
      action: 'Rewrite canonical URL via edge worker response transformation',
      config: { workerPath: 'src/edge/canonical-fix.js', deployTarget: 'edge' },
      testCmd: 'curl -sI ' + url + ' | grep -i "link.*canonical"'
    });
    issues.push({ severity: 'warning', impact: 'high', message: 'Self-correction rule CORR-002 triggered: ' + canonicalAnalysis.issues.length + ' canonical issues.', element: 'self-healing', fix: 'Deploy edge worker canonical fix rule.', link: url });
    p += 8;
  }
  if (!titleAnalysis.title || titleAnalysis.truncationRisk || titleAnalysis.googleRewriteRisk !== 'low') {
    selfCorrectionRules.push({
      id: 'CORR-003',
      priority: 3,
      trigger: 'Title tag missing, truncated, or at risk of rewrite',
      detection: 'Title: "' + (titleAnalysis.title || 'missing') + '", Risk: ' + titleAnalysis.googleRewriteRisk + ', Truncation: ' + titleAnalysis.truncationRisk,
      action: 'Inject corrected title and meta description via edge worker',
      config: { workerPath: 'src/edge/meta-injection.js', deployTarget: 'edge' },
      testCmd: 'curl -s ' + url + ' | grep -o "<title>[^<]*</title>"'
    });
    issues.push({ severity: 'warning', impact: 'medium', message: 'Self-correction rule CORR-003 triggered: title issues detected.', element: 'self-healing', fix: 'Deploy edge worker meta injection rule.', link: url });
    p += 6;
  }
  selfCorrectionRules.push({
    id: 'CORR-004',
    priority: 4,
    trigger: 'HTTP 5xx server errors',
    detection: 'Server error response detected',
    action: 'Serve stale cache or generate fallback page, retry upstream with exponential backoff',
    config: { workerPath: 'src/edge/error-fallback.js', deployTarget: 'edge', cacheTTL: 300 },
    testCmd: 'curl -sI ' + url + ' | head -1'
  });
  selfCorrectionRules.push({
    id: 'CORR-005',
    priority: 5,
    trigger: 'Missing security headers',
    detection: 'X-Content-Type-Options, X-Frame-Options, or Referrer-Policy not set',
    action: 'Inject security headers via edge worker',
    config: { workerPath: 'src/edge/security-headers.js', deployTarget: 'edge' },
    testCmd: 'curl -sI ' + url + ' | grep -E "X-Content-Type-Options|X-Frame-Options"'
  });

  data.selfCorrectionRules = selfCorrectionRules;

  const prioritizedFixes = selfCorrectionRules.sort((a, b) => a.priority - b.priority).map(r => ({
    id: r.id,
    priority: r.priority,
    trigger: r.trigger,
    action: r.action,
    deployTarget: r.config.deployTarget,
    testCommand: r.testCmd,
    estimatedDeployTime: r.priority <= 2 ? '1 hour (estimate)' : r.priority <= 3 ? '2 hours (estimate)' : '4 hours (estimate)'
  }));
  data.prioritizedFixes = prioritizedFixes;

  return { level: 19, name: 'Edge Orchestration & Self-Correction Rules', score: sc(p), issues, data };
  } catch (e) { return { level: 19, name: 'Edge Orchestration & Self-Correction Rules', score: 0, issues: [{ severity: 'critical', impact: 'critical', message: 'Level 19 analysis failed: ' + e.message, element: 'system' }], data: { error: e.message } }; }
}

function level20($, bodyText, url, config) {
  try {
  const issues = [];
  let p = 0;
  const text = bodyText || getTextContent($) || '';
  const subfunctions = {};
  const data = subfunctions;

  const unhelpfulContent = calculateUnhelpfulContentRatio(text);
  data.unhelpfulContent = unhelpfulContent;

  if (unhelpfulContent.helpfulRatio < 40) {
    issues.push({ severity: 'critical', impact: 'high', message: 'Helpful content ratio critically low: ' + unhelpfulContent.helpfulRatio + '%. ' + unhelpfulContent.genericSentences + ' generic sentences + ' + unhelpfulContent.unhelpfulShortSentences + ' thin sentences. High risk of Helpful Content System action.', element: 'content quality', fix: 'Rewrite ' + unhelpfulContent.genericSentences + ' generic sentences with original research. Expand ' + unhelpfulContent.unhelpfulShortSentences + ' thin sentences to 20+ chars with substantive content.', link: 'N/A', evidence: 'Helpful: ' + unhelpfulContent.helpfulSentences + '/' + unhelpfulContent.totalSentences + ' (' + unhelpfulContent.helpfulRatio + '%), Verdict: ' + unhelpfulContent.verdict, recommendation: 'Target > 70% helpful content ratio by replacing templated language with unique insights' });
    p += 15;
  } else if (unhelpfulContent.helpfulRatio < 70) {
    issues.push({ severity: 'warning', impact: 'high', message: 'Moderate helpful content ratio: ' + unhelpfulContent.helpfulRatio + '%. ' + unhelpfulContent.genericSentences + ' generic flag(s). May trigger classifiers under aggressive updates.', element: 'content quality', fix: 'Review and replace flagged generic phrases with original content, specific examples, or data points.', link: 'N/A', evidence: 'Helpful: ' + unhelpfulContent.helpfulSentences + '/' + unhelpfulContent.totalSentences + ' (' + unhelpfulContent.helpfulRatio + '%), Verdict: ' + unhelpfulContent.verdict });
    p += 8;
  }

  const genericPatterns = [];
  const genericDetectors = [
    { pattern: /as previously mentioned/i, label: 'Previously mentioned' },
    { pattern: /as stated above/i, label: 'As stated above' },
    { pattern: /contact us/i, label: 'Contact us boilerplate' },
    { pattern: /for more information/i, label: 'For more info' },
    { pattern: /please feel free/i, label: 'Please feel free' },
    { pattern: /do not hesitate/i, label: "Don't hesitate" },
    { pattern: /we believe that/i, label: 'We believe' },
    { pattern: /we are committed/i, label: 'We are committed' },
    { pattern: /we strive to/i, label: 'We strive to' },
    { pattern: /our team of/i, label: 'Our team of' },
    { pattern: /industry-leading/i, label: 'Industry-leading' },
    { pattern: /in today.s (digital|world)/i, label: "In today's X" },
    { pattern: /in the modern/i, label: 'In the modern' }
  ];
  genericDetectors.forEach(({ pattern, label }) => {
    const count = (text.match(pattern) || []).length;
    if (count > 0) genericPatterns.push({ label, count });
  });
  data.genericPatterns = genericPatterns;

  const eeatSignals = validateEEATSignals($, text);
  data.eeatSignals = eeatSignals;

  if (eeatSignals.totalScore < 40) {
    issues.push({ severity: 'critical', impact: 'high', message: 'Critical E-E-A-T deficiency (score: ' + eeatSignals.totalScore + '/100). Missing: ' + (!eeatSignals.author.present ? 'author, ' : '') + (!eeatSignals.publisher.present ? 'publisher, ' : '') + (!eeatSignals.datePublished.present ? 'date published, ' : '') + (eeatSignals.citations.count === 0 ? 'citations, ' : '') + '— High risk for YMYL pages.', element: 'E-E-A-T', fix: 'Add author byline with bio link, publisher name, published date, and cite authoritative external sources (.edu/.gov).', link: 'N/A', evidence: 'EEAT score: ' + eeatSignals.totalScore + '/100. Author: ' + (eeatSignals.author.present ? 'present (' + eeatSignals.author.name + ')' : 'missing') + ', Publisher: ' + (eeatSignals.publisher.present ? 'present' : 'missing') + ', Citations: ' + eeatSignals.citations.count + ', References: ' + eeatSignals.citations.hasReferences, recommendation: 'Target E-E-A-T score > 70 with author credentials, publication date, and external citations' });
    p += 15;
  } else if (eeatSignals.totalScore < 70) {
    issues.push({ severity: 'warning', impact: 'high', message: 'Moderate E-E-A-T signals (' + eeatSignals.totalScore + '/100). Strengthen trust signals: ' + (!eeatSignals.author.present ? 'author attribution, ' : '') + (!eeatSignals.datePublished.present ? 'published date, ' : '') + (eeatSignals.citations.count < 3 ? 'more citations, ' : ''), element: 'E-E-A-T', fix: 'Add author credentials, published/modified dates, and 3+ external citations from authoritative domains.', link: 'N/A', evidence: 'EEAT score: ' + eeatSignals.totalScore + '/100' });
    p += 7;
  }

  const orgSchema = $('script[type="application/ld+json"]').filter((i, el) => {
    try { const d = JSON.parse($(el).html() || '{}'); const arr = Array.isArray(d) ? d : [d]; return arr.some(s => s['@type'] === 'Organization'); } catch { return false; }
  });
  if (orgSchema.length === 0) {
    issues.push({ severity: 'warning', impact: 'medium', message: 'No Organization schema found. Knowledge Graph entity verification requires Organization markup with name, logo, and social profiles.', element: 'E-E-A-T schema', fix: 'Add Organization schema with name, URL, logo, and sameAs (social profiles).', link: 'N/A' });
    p += 5;
  } else {
    const orgData = JSON.parse($(orgSchema[0]).html() || '{}');
    const orgArr = Array.isArray(orgData) ? orgData : [orgData];
    const org = orgArr.find(s => s['@type'] === 'Organization') || orgArr[0];
    if (!org.logo) {
      issues.push({ severity: 'info', impact: 'low', message: 'Organization schema missing logo. Knowledge Panels require logo for brand verification.', element: 'E-E-A-T schema', fix: 'Add logo property to Organization schema with URL to brand logo.', link: 'N/A' });
      p += 3;
    }
    if (!org.sameAs || (Array.isArray(org.sameAs) && org.sameAs.length < 2)) {
      issues.push({ severity: 'info', impact: 'low', message: 'Organization schema has limited social profile links (sameAs). Knowledge Graph uses these for entity disambiguation.', element: 'E-E-A-T schema', fix: 'Add 2+ social profiles (LinkedIn, Twitter, Facebook, Instagram, Crunchbase) to sameAs array.', link: 'N/A' });
      p += 2;
    }
  }

  const qualityThresholds = calculateQualityThresholds(text);
  data.qualityThresholds = qualityThresholds;

  if (qualityThresholds.wordCount.score < 50) {
    issues.push({ severity: 'warning', impact: 'medium', message: 'Content length below quality threshold (score: ' + qualityThresholds.wordCount.score + '/100, words: ' + qualityThresholds.wordCount.value + ', min: ' + qualityThresholds.wordCount.min + '). Thin content risks devaluation under quality algorithms.', element: 'content volume', fix: 'Expand content to at least ' + qualityThresholds.wordCount.min + ' words with substantive, original information.', link: 'N/A', evidence: 'Word count: ' + qualityThresholds.wordCount.value + '/' + qualityThresholds.wordCount.min + ' minimum' });
    p += 8;
  }
  if (qualityThresholds.headingDensity.score < 50) {
    issues.push({ severity: 'info', impact: 'low', message: 'Low heading density (score: ' + qualityThresholds.headingDensity.score + '/100, found: ' + qualityThresholds.headingDensity.value + '). Poor content structure affects readability scoring.', element: 'content structure', fix: 'Add more headings to break up content. Aim for 1 heading per 200-300 words.', link: 'N/A', evidence: 'Headings: ' + qualityThresholds.headingDensity.value + '/' + qualityThresholds.headingDensity.min + ' minimum' });
    p += 3;
  }
  if (qualityThresholds.imageDensity.score < 50) {
    issues.push({ severity: 'info', impact: 'low', message: 'Low image density (score: ' + qualityThresholds.imageDensity.score + '/100). Visual content improves engagement and quality perception.', element: 'media', fix: 'Add relevant images, diagrams, or charts to support text content.', link: 'N/A', evidence: 'Images: ' + qualityThresholds.imageDensity.value + ', min: ' + qualityThresholds.imageDensity.min });
    p += 3;
  }
  if (qualityThresholds.linkDensity.score < 50) {
    issues.push({ severity: 'info', impact: 'low', message: 'Low internal/external link density (score: ' + qualityThresholds.linkDensity.score + '/100). Links support authority signals and content discoverability.', element: 'links', fix: 'Add 3+ relevant outbound links to authoritative sources and internal links to related content.', link: 'N/A', evidence: 'Links: ' + qualityThresholds.linkDensity.value + ', target range: ' + qualityThresholds.linkDensity.min + '-' + qualityThresholds.linkDensity.max });
    p += 2;
  }

  const contentToCodeRatio = (() => {
    const htmlLen = $.html() ? $.html().length : 1;
    const textLen = text.length;
    return htmlLen > 0 ? Math.round((textLen / htmlLen) * 10000) / 100 : 0;
  })();
  data.contentToCodeRatio = contentToCodeRatio;

  if (contentToCodeRatio < 10) {
    issues.push({ severity: 'warning', impact: 'medium', message: 'Low content-to-code ratio: ' + contentToCodeRatio + '% (text occupies ' + contentToCodeRatio + '% of HTML). Search engines may interpret as low value per byte crawled.', element: 'content efficiency', fix: 'Reduce HTML bloat: minify CSS/JS, remove unnecessary wrappers, inline critical CSS.', link: 'N/A', evidence: 'Content-to-code: ' + contentToCodeRatio + '% — target > 15%' });
    p += 6;
  } else if (contentToCodeRatio > 60) {
    issues.push({ severity: 'info', impact: 'low', message: 'High content-to-code ratio: ' + contentToCodeRatio + '% — may indicate missing layout/styling.', element: 'content', fix: 'Verify page has proper CSS styling and structural markup.', link: 'N/A' });
    p += 1;
  }

  const paragraphs = $('p').filter((i, el) => $(el).text().trim().length > 0);
  const paraQualityDistribution = { short: 0, medium: 0, long: 0, veryLong: 0 };
  paragraphs.each((i, el) => {
    const pt = $(el).text().trim().length;
    if (pt < 100) paraQualityDistribution.short++;
    else if (pt < 300) paraQualityDistribution.medium++;
    else if (pt < 600) paraQualityDistribution.long++;
    else paraQualityDistribution.veryLong++;
  });
  const totalParas = paragraphs.length;
  data.paraQualityDistribution = paraQualityDistribution;
  if (totalParas > 0 && paraQualityDistribution.short / totalParas > 0.5) {
    issues.push({ severity: 'warning', impact: 'medium', message: paraQualityDistribution.short + '/' + totalParas + ' paragraphs are short (< 100 chars). Excessive short paragraphs fragment content and reduce information density.', element: 'content structure', fix: 'Merge related short paragraphs into substantive 2-4 sentence blocks.', link: 'N/A', evidence: 'Short: ' + paraQualityDistribution.short + ', Medium: ' + paraQualityDistribution.medium + ', Long: ' + paraQualityDistribution.long + ', VeryLong: ' + paraQualityDistribution.veryLong });
    p += 5;
  }

  const readabilityAdvanced = analyzeReadabilityAdvanced(text);
  data.readabilityAdvanced = readabilityAdvanced;
  if (readabilityAdvanced.readabilityLevel === 'College' || readabilityAdvanced.readabilityLevel === 'Post-Grad') {
    issues.push({ severity: 'info', impact: 'low', message: 'Content readability targets ' + readabilityAdvanced.readabilityLevel + ' level (avg grade: ' + readabilityAdvanced.avgGradeLevel + '). May be too complex for general audience; consider simplifying for broader accessibility.', element: 'readability', fix: 'Reduce sentence length, use simpler vocabulary, and break down complex concepts into digestible sections.', link: 'N/A', evidence: 'Grade level: ' + readabilityAdvanced.avgGradeLevel + ', Level: ' + readabilityAdvanced.readabilityLevel });
    p += 3;
  }

  const aiContentFlags = detectContentQualityFlags(text);
  data.contentQualityFlags = aiContentFlags;
  if (aiContentFlags.length > 0) {
    const flagSummary = aiContentFlags.map(f => f.type + '(' + f.severity + ')').join(', ');
    issues.push({ severity: 'info', impact: 'low', message: aiContentFlags.length + ' content quality flag(s): ' + flagSummary + '. These subtle patterns can accumulate under algorithmic quality assessments.', element: 'content quality', fix: aiContentFlags.map(f => f.message).join('; '), link: 'N/A', evidence: 'Flags: ' + aiContentFlags.map(f => f.type + ': ' + f.message).join(' | ') });
    p += Math.min(5, aiContentFlags.length * 2);
  }

  const syntheticBehavior = analyzeSyntheticAgentBehavior(text);
  data.syntheticBehavior = syntheticBehavior;
  if (syntheticBehavior.verdict !== 'likely human-written') {
    issues.push({ severity: 'info', impact: 'low', message: 'Synthetic agent patterns detected: ' + syntheticBehavior.verdict + ' (' + syntheticBehavior.totalFlags + ' flag instances). May trigger AI-content classifiers.', element: 'content authenticity', fix: 'Reduce formulaic patterns and add original analysis, specific examples, and personal experience.', link: 'N/A', evidence: 'Verdict: ' + syntheticBehavior.verdict + ', Flags: ' + syntheticBehavior.totalFlags + ', Score: ' + syntheticBehavior.syntheticScore });
    p += 3;
  }

  const allQualityScores = [];
  allQualityScores.push({ name: 'Helpful Content Ratio', score: unhelpfulContent.helpfulRatio, weight: 25 });
  allQualityScores.push({ name: 'E-E-A-T Signals', score: eeatSignals.totalScore, weight: 20 });
  allQualityScores.push({ name: 'Word Count Threshold', score: qualityThresholds.wordCount.score, weight: 15 });
  allQualityScores.push({ name: 'Content-to-Code Ratio', score: Math.min(100, Math.round(contentToCodeRatio * 2.5)), weight: 10 });
  allQualityScores.push({ name: 'Heading Density', score: qualityThresholds.headingDensity.score, weight: 10 });
  allQualityScores.push({ name: 'Image Density', score: qualityThresholds.imageDensity.score, weight: 5 });
  allQualityScores.push({ name: 'Link Density', score: qualityThresholds.linkDensity.score, weight: 5 });
  allQualityScores.push({ name: 'Synthetic Content Score', score: syntheticBehavior.syntheticScore, weight: 10 });

  const totalWeight = allQualityScores.reduce((a, s) => a + s.weight, 0);
  const overallQuality = Math.round(allQualityScores.reduce((a, s) => a + (s.score * s.weight), 0) / totalWeight);
  data.overallQuality = overallQuality;
  data.qualityScores = allQualityScores;

  const thresholdWarnings = [];
  if (overallQuality < 40) {
    thresholdWarnings.push({ level: 'critical', message: 'Overall quality score ' + overallQuality + '/100 — site-wide algorithmic action likely if multiple pages share this pattern' });
  } else if (overallQuality < 70) {
    thresholdWarnings.push({ level: 'warning', message: 'Overall quality score ' + overallQuality + '/100 — threshold risk for quality algorithm updates' });
  } else {
    thresholdWarnings.push({ level: 'pass', message: 'Overall quality score ' + overallQuality + '/100 — above warning thresholds' });
  }
  data.thresholdWarnings = thresholdWarnings;

  const dimensionScores = [
    { name: 'Overall quality', score: overallQuality },
    { name: 'Helpful content ratio', score: unhelpfulContent.helpfulRatio },
    { name: 'E-E-A-T signals', score: eeatSignals.totalScore },
    { name: 'Word count', score: qualityThresholds.wordCount.score },
    { name: 'Heading density', score: qualityThresholds.headingDensity.score },
    { name: 'Image density', score: qualityThresholds.imageDensity.score },
    { name: 'Link density', score: qualityThresholds.linkDensity.score }
  ];
  const siteWideRisk = calculateSiteWideRisk(dimensionScores.map(d => ({ score: d.score, url: url })), 'on-page quality dimensions');
  siteWideRisk.note = 'Single-page analysis — risk level reflects this audited page only. It is NOT a crawl of the full site. Apply the same fixes to templated pages for site-wide effect.';
  data.siteWideRisk = siteWideRisk;

  if (siteWideRisk.riskLevel === 'high' || siteWideRisk.riskLevel === 'medium-high') {
    issues.push({ severity: 'critical', impact: 'high', message: 'Risk projection for ' + url + ': ' + siteWideRisk.riskLevel.toUpperCase() + ' (score: ' + siteWideRisk.siteRiskScore + '). Computed from ' + siteWideRisk.pageCount + ' on-page quality dimensions of this audited page, not from a full site crawl.', element: 'site-wide risk', fix: 'Address all critical-quality issues on this page and propagate fixes across templated pages. ' + siteWideRisk.recommendation, link: url, evidence: 'Dimensions evaluated: ' + dimensionScores.map(d => d.name + '=' + d.score).join(', ') });
    p += 10;
  }

  return { level: 20, name: 'Algorithmic Quality Thresholds & Site-Wide Risk Scorer', score: sc(p), issues, data };
  } catch (e) { return { level: 20, name: 'Algorithmic Quality Thresholds & Site-Wide Risk Scorer', score: 0, issues: [{ severity: 'critical', impact: 'critical', message: 'Level 20 analysis failed: ' + e.message, element: 'system' }], data: { error: e.message } }; }
}

function level21($, bodyText, url, config) {
  try {
  const cfg = config || {};
  const issues = [];
  let p = 0;
  const text = bodyText || getTextContent($) || '';
  const subfunctions = {};
  const data = subfunctions;
  const wordCount = countWords(text);
  const inputMonthlyTraffic = cfg.monthlyTraffic || 0;
  const inputAOV = cfg.avgOrderValue || 0;
  const inputCVR = (cfg.conversionRate || 0) / 100;
  const organicRevenue = inputMonthlyTraffic * inputCVR * inputAOV;

  let pageType = 'informational';
  const pathParts = url.split('/').filter(x => x.length > 0 && !x.startsWith('http') && !x.startsWith('www'));
  const lastSegment = pathParts[pathParts.length - 1] || '';
  const hasPrice = /\$\s?\d+(\.\d{2})?/.test(text);
  const hasAddToCart = $('[class*="add-to-cart"], [class*="addtocart"], [data-product-id], form[action*="cart"]').length > 0;
  const hasProductSchema = $('script[type="application/ld+json"]').filter((i, el) => {
    try { const d = JSON.parse($(el).html() || '{}'); const arr = Array.isArray(d) ? d : [d]; return arr.some(s => s['@type'] === 'Product'); } catch { return false; }
  }).length > 0;
  const hasProductTerms = /\b(product|shop|buy|price|cart|checkout|order|purchase)\b/i.test(text);

  if (hasProductSchema || hasPrice || hasAddToCart) pageType = 'product';
  else if (lastSegment.match(/\/shop|\/products|\/store|\/category|\/collections?/i) || hasProductTerms && !hasPrice) pageType = 'category';
  else if (/\b(blog|article|news|post)\b/i.test(url) || wordCount > 800) pageType = 'article';
  else if (lastSegment.match(/\/about|\/contact|\/faq|\/support|\/help|\/terms|\/privacy/i)) pageType = 'support';
  else if (/\b(landing|landing-page|lp\/)\b/i.test(url) || url.split('/').filter(x => x).length <= 2) pageType = 'landing';
  data.pageType = pageType;

  let organicTraffic = 0;
  let conversionRate = 0;
  let avgOrderValue = 0;
  const hasRealFinancialInputs = inputMonthlyTraffic > 0 && inputAOV > 0 && inputCVR > 0;
  if (hasRealFinancialInputs) {
    organicTraffic = inputMonthlyTraffic;
    conversionRate = inputCVR;
    avgOrderValue = inputAOV;
  }

  data.trafficEstimates = {
    hasRealFinancialInputs,
    financialInputStatus: hasRealFinancialInputs
      ? 'Monetary figures derived from user-supplied monthlyTraffic, avgOrderValue and conversionRate.'
      : 'NO traffic data supplied — all monetary figures are 0. Provide monthlyTraffic, avgOrderValue and conversionRate to enable financial modeling.',
    organicTraffic, conversionRate, avgOrderValue, pageType
  };

  const titleAnalysis = analyzeTitlePrecision($, url);
  data.titleAnalysis = titleAnalysis;

  const revMoney = (frac) => {
    if (!hasRealFinancialInputs) return 'Revenue impact not quantified (no traffic data supplied)';
    const amt = Math.round(organicTraffic * conversionRate * avgOrderValue * frac);
    return 'Modeled revenue impact (assumed ' + Math.round(frac * 100) + '% of monthly organic revenue): ~$' + amt.toLocaleString();
  };

  const canonicalAnalysis = analyzeCanonicalIntegrity($, url);
  data.canonicalAnalysis = canonicalAnalysis;

  const headingAnalysis = analyzeHeadingHierarchy($);
  data.headingAnalysis = headingAnalysis;

  const schemaAnalysis = analyzeSchema($);
  data.schemaAnalysis = schemaAnalysis;

  const internalLinks = analyzeInternalLinks($, url);
  data.internalLinks = internalLinks;

  const readabilityAnalysis = analyzeReadabilityAdvanced(text);
  data.readability = readabilityAnalysis;

  const contentQualityFlags = detectContentQualityFlags(text);
  data.contentQualityFlags = contentQualityFlags;

  const syntheticBehavior = analyzeSyntheticAgentBehavior(text);
  data.syntheticBehavior = syntheticBehavior;

  const findings = [];

  if (titleAnalysis.truncationRisk || titleAnalysis.googleRewriteRisk !== 'low') {
    findings.push({
      severity: 'high',
      category: 'Visibility',
      name: 'Title Tag Issue',
      detail: 'Title "' + (titleAnalysis.title || 'missing') + '" — truncation risk: ' + titleAnalysis.truncationRisk + ', rewrite risk: ' + titleAnalysis.googleRewriteRisk,
      estimatedRevenueImpact: pageType === 'product' || pageType === 'category' ? organicTraffic * conversionRate * avgOrderValue * 0.03 : 0,
      engineeringHours: 0.5,
      fixComplexity: 'easy',
      fix: 'Optimize title tag to 50-60 characters with primary keyword front-loaded'
    });
    issues.push({ severity: 'warning', impact: 'high', message: 'Title issues detected (truncation/rewrite risk). ' + revMoney(0.03) + '.', element: 'title', fix: 'Fix: ' + titleAnalysis.recommendations.join('; '), link: url, evidence: 'Title: "' + titleAnalysis.title + '", Truncation: ' + titleAnalysis.truncationRisk });
    p += 8;
  }

  if (canonicalAnalysis.issues.length > 0) {
    findings.push({
      severity: 'high',
      category: 'Technical SEO',
      name: 'Canonical Issue',
      detail: canonicalAnalysis.issues.join('; '),
      estimatedRevenueImpact: organicTraffic * conversionRate * avgOrderValue * 0.05,
      engineeringHours: 1,
      fixComplexity: 'easy',
      fix: 'Set self-referencing canonical tag pointing to ' + url
    });
    issues.push({ severity: 'warning', impact: 'high', message: 'Canonical issues dilute ranking signals. ' + revMoney(0.05) + '.', element: 'canonical', fix: 'Add self-referencing canonical tag.', link: url, evidence: canonicalAnalysis.issues.join('; ') });
    p += 8;
  }

  if (headingAnalysis.hierarchyIssues.some(i => i.type === 'missing-h1')) {
    findings.push({
      severity: 'high',
      category: 'Content',
      name: 'Missing H1',
      detail: 'No H1 tag found on page',
      estimatedRevenueImpact: organicTraffic * conversionRate * avgOrderValue * 0.01,
      engineeringHours: 0.25,
      fixComplexity: 'easy',
      fix: 'Add H1 tag with primary keyword'
    });
    issues.push({ severity: 'warning', impact: 'medium', message: 'Missing H1 may reduce relevance signals. ' + revMoney(0.01) + '.', element: 'headings', fix: 'Add H1 tag describing page content.', link: url });
    p += 5;
  }

  const invalidSchemas = schemaAnalysis.filter(s => !s.validation.valid);
  if (invalidSchemas.length > 0) {
    findings.push({
      severity: 'high',
      category: 'Structured Data',
      name: 'Invalid Schema',
      detail: invalidSchemas.length + ' schema(s) with errors: ' + invalidSchemas.map(s => s.type + ': ' + s.validation.errors.join(', ')).join('; '),
      estimatedRevenueImpact: organicTraffic * conversionRate * avgOrderValue * 0.08,
      engineeringHours: 2,
      fixComplexity: 'medium',
      fix: 'Fix JSON-LD syntax or add required fields per schema type'
    });
    issues.push({ severity: 'warning', impact: 'high', message: 'Invalid structured data blocks rich result eligibility. ' + revMoney(0.08) + '.', element: 'schema', fix: 'Fix ' + invalidSchemas.length + ' schema validation errors.', link: url, evidence: invalidSchemas.map(s => s.type + ': ' + s.validation.errors.join('; ')).join(' | ') });
    p += 8;
  }

  if (internalLinks.deadFragments.length > 0) {
    findings.push({
      severity: 'medium',
      category: 'Technical SEO',
      name: 'Broken Anchor Links',
      detail: internalLinks.deadFragments.length + ' dead fragment link(s)',
      estimatedRevenueImpact: organicTraffic * conversionRate * avgOrderValue * 0.02,
      engineeringHours: 1,
      fixComplexity: 'easy',
      fix: 'Fix or remove ' + internalLinks.deadFragments.length + ' broken anchor links pointing to non-existent IDs'
    });
    issues.push({ severity: 'warning', impact: 'medium', message: internalLinks.deadFragments.length + ' dead anchor link(s) waste crawl budget and degrade UX. ' + revMoney(0.02) + '.', element: 'internal links', fix: 'Fix or remove broken fragment identifiers.', link: url, evidence: internalLinks.deadFragments.map(df => df.href + ' at ' + df.selector).join('; ') });
    p += 5;
  }

  if (internalLinks.internal.length === 0 && pageType !== 'support') {
    findings.push({
      severity: 'medium',
      category: 'Internal Linking',
      name: 'No Internal Links',
      detail: 'Page has zero internal links, reducing crawl efficiency and site architecture strength',
      estimatedRevenueImpact: organicTraffic * conversionRate * avgOrderValue * 0.02,
      engineeringHours: 1,
      fixComplexity: 'easy',
      fix: 'Add contextual internal links to related content'
    });
    issues.push({ severity: 'warning', impact: 'medium', message: 'Zero internal links found. ' + revMoney(0.02) + '.', element: 'internal linking', fix: 'Add contextual internal links to related pages.', link: url });
    p += 4;
  }

  if (syntheticBehavior.verdict !== 'likely human-written') {
    findings.push({
      severity: 'medium',
      category: 'Content Quality',
      name: 'AI Content Patterns',
      detail: 'Synthetic agent score: ' + syntheticBehavior.syntheticScore + ', verdict: ' + syntheticBehavior.verdict + ', flags: ' + syntheticBehavior.totalFlags,
      estimatedRevenueImpact: organicTraffic * conversionRate * avgOrderValue * 0.05,
      engineeringHours: 3,
      fixComplexity: 'hard',
      fix: 'Rewrite flagged sections with original research, personal experience, and data-driven analysis'
    });
    issues.push({ severity: 'info', impact: 'medium', message: 'Synthetic content patterns detected (' + syntheticBehavior.totalFlags + ' flags). ' + revMoney(0.05) + '.', element: 'content', fix: 'Rewrite flagged sections with original analysis.', link: url, evidence: 'Verdict: ' + syntheticBehavior.verdict + ', Score: ' + syntheticBehavior.syntheticScore });
    p += 4;
  }

  if (contentQualityFlags.length > 0) {
    findings.push({
      severity: 'low',
      category: 'Content Quality',
      name: 'Quality Flags',
      detail: contentQualityFlags.length + ' flags: ' + contentQualityFlags.map(f => f.type + '(' + f.severity + ')').join(', '),
      estimatedRevenueImpact: organicTraffic * conversionRate * avgOrderValue * 0.01,
      engineeringHours: 1,
      fixComplexity: 'easy',
      fix: contentQualityFlags.map(f => f.message).join('; ')
    });
    p += 2;
  }

  const readabilityLevel = readabilityAnalysis.readabilityLevel;
  if (readabilityLevel === 'College' || readabilityLevel === 'Post-Grad') {
    findings.push({
      severity: 'low',
      category: 'Readability',
      name: 'Complex Readability',
      detail: 'Readability at ' + readabilityLevel + ' level (grade ' + readabilityAnalysis.avgGradeLevel + '). May limit audience engagement.',
      estimatedRevenueImpact: organicTraffic * conversionRate * avgOrderValue * 0.01,
      engineeringHours: 2,
      fixComplexity: 'medium',
      fix: 'Simplify sentence structure and vocabulary to target 8th grade reading level'
    });
    p += 2;
  }

  if (pageType === 'product') {
    const missingDimensions = $('img').filter((i, el) => !$(el).attr('width') || !$(el).attr('height')).length;
    if (missingDimensions > 0) {
      findings.push({
        severity: 'medium',
        category: 'Core Web Vitals',
        name: 'Missing Image Dimensions',
        detail: missingDimensions + ' image(s) missing width/height — causes CLS',
        estimatedRevenueImpact: organicTraffic * conversionRate * avgOrderValue * 0.04,
        engineeringHours: 1.5,
        fixComplexity: 'easy',
        fix: 'Add width and height attributes to ' + missingDimensions + ' images'
      });
      issues.push({ severity: 'warning', impact: 'medium', message: missingDimensions + ' images missing dimensions cause layout shift (CLS). ' + revMoney(0.04) + '.', element: 'images', fix: 'Add width/height to all images.', link: url });
      p += 5;
    }
  }

  const revenueAtRisk = calculateRevenueAtRisk({
    organicTraffic,
    conversionRate,
    avgOrderValue,
    visibilityDrop: 0.15,
    currency: 'USD'
  });
  data.revenueAtRisk = revenueAtRisk;

  const prioritizedFindings = prioritizeByImpact(findings);
  data.prioritizedFindings = prioritizedFindings;

  const issueCategories = {};
  findings.forEach(f => {
    if (!issueCategories[f.category]) issueCategories[f.category] = { totalRevenueImpact: 0, count: 0, issues: [] };
    issueCategories[f.category].totalRevenueImpact += f.estimatedRevenueImpact;
    issueCategories[f.category].count++;
    issueCategories[f.category].issues.push(f.name);
  });
  data.issueCategories = issueCategories;

  const roiCalculations = findings.map(f => {
    const hours = f.engineeringHours || 1;
    const costRate = 150;
    const fixCost = hours * costRate;
    const annualRecovery = hasRealFinancialInputs ? f.estimatedRevenueImpact * 12 : 0;
    const roi = hasRealFinancialInputs && fixCost > 0 ? ((annualRecovery - fixCost) / fixCost) * 100 : null;
    const recoveryTimelineDays = f.fixComplexity === 'easy' ? 14 : f.fixComplexity === 'medium' ? 30 : 60;
    return {
      issue: f.name,
      category: f.category,
      severity: f.severity,
      estimatedMonthlyRecovery: hasRealFinancialInputs ? Math.round(f.estimatedRevenueImpact) : 0,
      annualRecovery: Math.round(annualRecovery),
      fixComplexity: f.fixComplexity,
      engineeringHours: hours,
      fixCost: Math.round(fixCost),
      recoveryTimelineDays,
      roi: roi === null ? null : Math.round(roi),
      priority: hasRealFinancialInputs ? (roi > 500 ? 'immediate' : roi > 200 ? 'high' : roi > 50 ? 'medium' : 'low') : 'n/a (no traffic data)',
      fixDescription: f.fix
    };
  });
  roiCalculations.sort((a, b) => (b.roi === null ? -1 : b.roi) - (a.roi === null ? -1 : a.roi));
  data.roiCalculations = roiCalculations;

  const totalMonthlyRevenueAtRisk = hasRealFinancialInputs ? findings.reduce((a, f) => a + f.estimatedRevenueImpact, 0) : 0;
  const totalAnnualRevenueAtRisk = totalMonthlyRevenueAtRisk * 12;
  const totalFixCost = roiCalculations.reduce((a, r) => a + r.fixCost, 0);
  const totalAnnualRecovery = roiCalculations.reduce((a, r) => a + r.annualRecovery, 0);
  const overallROI = hasRealFinancialInputs && totalFixCost > 0 ? Math.round(((totalAnnualRecovery - totalFixCost) / totalFixCost) * 100) : null;

  data.financialSummary = {
    hasRealFinancialInputs,
    financialInputStatus: hasRealFinancialInputs
      ? 'Monetary figures derived from user-supplied monthlyTraffic, avgOrderValue and conversionRate.'
      : 'NO traffic data supplied — all monetary figures are 0. Provide monthlyTraffic, avgOrderValue and conversionRate to enable financial modeling.',
    totalMonthlyRevenueAtRisk: Math.round(totalMonthlyRevenueAtRisk),
    totalAnnualRevenueAtRisk: Math.round(totalAnnualRevenueAtRisk),
    totalFixCost: Math.round(totalFixCost),
    totalAnnualRecovery: Math.round(totalAnnualRecovery),
    overallROI: overallROI === null ? 'not computed (no traffic data)' : overallROI + '%',
    currency: 'USD'
  };

  const execMoney = (v) => hasRealFinancialInputs ? '$' + Math.round(v).toLocaleString() : 'not quantified (no traffic data)';

  const executiveSummary = {
    page: url,
    pageType: pageType,
    totalIssuesFound: findings.length,
    hasRealFinancialInputs,
    totalMonthlyRevenueAtRisk: execMoney(totalMonthlyRevenueAtRisk),
    totalAnnualRevenueAtRisk: execMoney(totalAnnualRevenueAtRisk),
    totalFixInvestment: '$' + Math.round(totalFixCost).toLocaleString(),
    annualRecoveryPotential: execMoney(totalAnnualRecovery),
    roi: overallROI === null ? 'not computed (no traffic data)' : overallROI + '%',
    urgency: hasRealFinancialInputs ? (totalAnnualRevenueAtRisk > 100000 ? 'critical' : totalAnnualRevenueAtRisk > 50000 ? 'high' : totalAnnualRevenueAtRisk > 10000 ? 'medium' : 'low') : 'n/a (no traffic data)',
    categoryBreakdown: Object.entries(issueCategories).map(([cat, data]) => ({
      category: cat,
      issueCount: data.count,
      revenueImpact: execMoney(data.totalRevenueImpact * 12),
      issues: data.issues
    })),
    topActions: roiCalculations.slice(0, 5).map(r => ({
      issue: r.issue,
      roi: r.roi === null ? 'n/a' : r.roi + '%',
      timeline: r.recoveryTimelineDays + ' days',
      complexity: r.fixComplexity,
      monthlyRecovery: execMoney(r.estimatedMonthlyRecovery)
    })),
    roadmap: {
      '30 Days (Quick Wins)': roiCalculations.filter(r => r.fixComplexity === 'easy' && r.priority !== 'low').map(r => r.issue),
      '60 Days (Medium Effort)': roiCalculations.filter(r => r.fixComplexity === 'medium').map(r => r.issue),
      '90 Days (Strategic)': roiCalculations.filter(r => r.fixComplexity === 'hard').map(r => r.issue)
    },
    projectedRecovery: hasRealFinancialInputs ? {
      month1: '$' + Math.round(roiCalculations.filter(r => r.fixComplexity === 'easy').reduce((a, r) => a + r.estimatedMonthlyRecovery, 0)).toLocaleString(),
      month2: '$' + Math.round(roiCalculations.filter(r => r.fixComplexity === 'easy' || r.fixComplexity === 'medium').reduce((a, r) => a + r.estimatedMonthlyRecovery, 0) * 0.5).toLocaleString(),
      month3: '$' + Math.round(totalMonthlyRevenueAtRisk * 0.3).toLocaleString()
    } : { note: 'Projections unavailable — no traffic data supplied.' }
  };
  data.executiveSummary = executiveSummary;

  if (hasRealFinancialInputs) {
    issues.push({
      severity: 'info',
      impact: 'medium',
      message: 'Financial Impact Summary — Page type: ' + pageType.toUpperCase() + ', Revenue at risk: $' + Math.round(totalMonthlyRevenueAtRisk).toLocaleString() + '/month ($' + Math.round(totalAnnualRevenueAtRisk).toLocaleString() + '/year), Fix cost: $' + Math.round(totalFixCost).toLocaleString() + ', Projected ROI: ' + overallROI + '%. Top fix: "' + (roiCalculations[0] ? roiCalculations[0].issue : '') + '" ($' + (roiCalculations[0] ? roiCalculations[0].estimatedMonthlyRecovery : 0) + '/month, ' + (roiCalculations[0] ? roiCalculations[0].recoveryTimelineDays : 0) + ' days).',
      element: 'financial impact',
      fix: 'Prioritize fixes by ROI: ' + roiCalculations.slice(0, 3).map(r => r.issue + ' (' + r.roi + '% ROI)').join(', ') + '.',
      link: url,
      evidence: 'Revenue at risk: $' + Math.round(totalMonthlyRevenueAtRisk).toLocaleString() + '/month, Fix cost: $' + Math.round(totalFixCost).toLocaleString() + ', ROI: ' + overallROI + '%',
      recommendation: 'Address easy, high-ROI fixes within 30 days to recover ~$' + Math.round(roiCalculations.filter(r => r.fixComplexity === 'easy').reduce((a, r) => a + r.estimatedMonthlyRecovery, 0)).toLocaleString() + '/month'
    });
  } else {
    issues.push({
      severity: 'info',
      impact: 'low',
      message: 'Financial impact modeling is disabled — supply monthlyTraffic, avgOrderValue and conversionRate (GA4/analytics data) in the audit config to quantify revenue at risk, ROI and recovery timelines. On-page findings are still reported in full.',
      element: 'financial impact',
      fix: 'Re-run the audit with traffic data to enable the revenue attribution engine.',
      link: url,
      evidence: 'No financial inputs supplied; monetary figures left at 0.'
    });
  }

  return {
    level: 21,
    name: 'Site-Wide Risk Aggregation & Executive Rollup (Portfolio)',
    score: sc(p),
    issues,
    data
  };
  } catch (e) { return { level: 21, name: 'Site-Wide Risk Aggregation & Executive Rollup (Portfolio)', score: 0, issues: [{ severity: 'critical', impact: 'critical', message: 'Level 21 analysis failed: ' + e.message, element: 'system' }], data: { error: e.message } }; }
}

module.exports = { level1, level2, level3, level4, level5, level6, level7, level8, level9, level10, level11, level12, level13, level14, level15, level16, level17, level18, level19, level20, level21 };
