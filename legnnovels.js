// LegsNovels (legnnovels.com) · Tianshuge
//
// An extension in the LNReader plugin format, written from scratch: there was
// no official one for this site. The site could not be inspected: every route
// answers 403 with a Cloudflare challenge (checked 13/10/2026 on /), so the
// selectors below are the usual ones for novel sites and are provisional. The
// extension only makes normal requests, exactly as the app will with its
// verified browser:
//   - Popular and latest: the novel list, newest first for latest.
//   - Search and filters: the site's own search; no filters are declared
//     because none could be verified.
//   - Novel: its page, with the chapter links it lists.
//   - Chapter: the chapter body.
// Only public content is read: nothing that needs an account. If a chapter
// page shows a lock notice, it is listed with 🔒 and never opened.
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

var fetchLib = require('@libs/fetch');
var NovelStatus = require('@libs/novelStatus').NovelStatus;
var defaultCover = require('@libs/defaultCover').defaultCover;
var cheerio = require('cheerio');

var SITE = 'https://legnnovels.com/';

function absolute(path) {
  if (/^https?:\/\//i.test(path)) return path;
  return SITE + String(path || '').replace(/^\/+/, '');
}

function relative(url) {
  return String(url || '').replace(/^https?:\/\/(www\.)?legnnovels\.com\/?/i, '').replace(/^\/+/, '');
}

function text(url, init) {
  return fetchLib.fetchApi(url, init).then(function (response) { return response.text(); });
}

// The biggest picture the page offers, not the thumbnail: the real address
// usually hides in data-src / data-srcset behind a filler gif.
function cover(img) {
  var best = '', width = 0;
  String(img.attr('data-srcset') || img.attr('srcset') || '').split(',').forEach(function (entry) {
    var parts = entry.trim().split(/\s+/);
    var w = parseInt(parts[1], 10) || 0;
    if (parts[0] && w > width) { best = parts[0]; width = w; }
  });
  var url = best || img.attr('data-src') || img.attr('data-lazy-src') || img.attr('src') || '';
  return url && !/^data:/.test(url) ? absolute(url) : '';
}

function list(html) {
  var $ = cheerio.load(html);
  var novels = [], seen = {};
  // Card grids and archive rows, whatever wrapper the verified page uses.
  $('article').each(function () {
    var item = $(this);
    var link = item.find('h1 a, h2 a, .post-title a').first();
    if (!link.length) return;
    var name = link.text().replace(/\s+/g, ' ').trim();
    var path = relative(link.attr('href'));
    if (!name || !path || seen[path]) return;
    seen[path] = true;
    novels.push({ name: name, path: path, cover: cover(item.find('img').first()) || defaultCover });
  });
  return novels;
}

function statusFrom(value) {
  var s = String(value || '').toLowerCase();
  if (/ongoing|emisi|curso/.test(s)) return NovelStatus.Ongoing;
  if (/complet|finaliz|terminad/.test(s)) return NovelStatus.Completed;
  if (/hold|pausa|hiatus/.test(s)) return NovelStatus.OnHiatus;
  if (/cancel|abandon/.test(s)) return NovelStatus.Cancelled;
  return NovelStatus.Unknown;
}

function Plugin() {
  this.id = 'legnnovels';
  this.name = 'LegsNovels';
  this.site = SITE;
  this.version = '1.0.0';
  this.icon = 'icons/legnnovels.png';
}

Plugin.prototype.popularNovels = function (page, opts) {
  // One archive page per listing page; the homepage carries the latest.
  if (page > 1) return Promise.resolve([]);
  return text(SITE).then(list);
};

Plugin.prototype.searchNovels = function (term, page) {
  if (page > 1) return Promise.resolve([]);
  return text(SITE + '?s=' + encodeURIComponent(term)).then(list);
};

Plugin.prototype.parseNovel = function (novelPath) {
  var pageURL = absolute(novelPath);
  return text(pageURL).then(function (html) {
    var $ = cheerio.load(html);
    var name = $('h1.post-title, h1.entry-title, article h1').first().text().replace(/\s+/g, ' ').trim();
    if (!name) throw new Error('La web cambió: no se encuentra el título de la obra');
    var novel = {
      path: novelPath,
      name: name,
      cover: $('meta[property="og:image"]').first().attr('content') || defaultCover,
      status: NovelStatus.Unknown,
      summary: '',
      chapters: []
    };
    if (!/^https:\/\//i.test(novel.cover)) {
      novel.cover = cover($('article img').first()) || defaultCover;
    }
    var author = $('.author-content a, [rel="author"]').first().text().trim();
    if (author) novel.author = author;
    var genres = ($('.genres-content a, [rel="tag"]').map(function () {
      return $(this).text().trim();
    }).get() || []).filter(Boolean);
    if (genres.length) novel.genres = genres.join(',');
    var summary = $('.manga-excerpt, .summary__content, .post-content').first();
    summary.find('script, style, noscript').remove();
    novel.summary = summary.find('p').map(function () {
      return $(this).text().trim();
    }).get().filter(Boolean).join('\n') || summary.text().trim();
    var statusText = $('.post-content_item, .manga-status').first().text();
    novel.status = statusFrom(statusText);
    // Only same-site chapter links: anything else (PDFs, drives) is skipped.
    var seen = {};
    $('a[href*="/"]').each(function () {
      var href = $(this).attr('href') || '';
      if (!/^https?:\/\/(www\.)?legnnovels\.com\//i.test(href) && !/^\//.test(href)) return;
      if (!/\/(capitulo|chapter|cap)[\/_-]/i.test(href)) return;
      var path = relative(href).split('?')[0].split('#')[0];
      if (!path || seen[path]) return;
      seen[path] = true;
      var title = $(this).text().replace(/\s+/g, ' ').trim() || ('Capítulo ' + (novel.chapters.length + 1));
      var paid = /premium|vip|bloqueado|locked/i.test($(this).attr('class') || '') || href === '#';
      novel.chapters.push({ name: paid ? '🔒 ' + title : title, path: path });
    });
    // The site lists them newest first.
    novel.chapters = novel.chapters.reverse().map(function (chapter, i) {
      chapter.chapterNumber = i + 1;
      return chapter;
    });
    return novel;
  });
};

Plugin.prototype.parseChapter = function (chapterPath) {
  return text(absolute(chapterPath)).then(function (html) {
    // A locked chapter only carries its notice: it goes back as is.
    if (/miembros VIP|contenido bloqueado|content-blocked|premium-block|paywall/i.test(html)) {
      return '<p>This chapter is locked.</p><p>🔒 Capítulo de pago en la web: se desbloquea allí, o cuando la web lo libere.</p>';
    }
    var $ = cheerio.load(html);
    var body = $('.reading-content, .post-content, .entry-content').first();
    if (!body.length) throw new Error('La web cambió: no se encuentra el texto del capítulo');
    body.find('script, style, noscript, iframe, form, button, input, ins, nav, .sharedaddy, #comments').remove();
    body.find('img').each(function () {
      var image = $(this);
      var real = image.attr('data-src') || image.attr('data-lazy-src');
      if (real) image.attr('src', real);
      ['data-src', 'data-lazy-src', 'data-srcset', 'data-sizes', 'data-lazyloaded', 'srcset', 'sizes',
        'decoding', 'loading'].forEach(function (attribute) { image.removeAttr(attribute); });
      var src = image.attr('src') || '';
      if (/^data:/.test(src)) { image.remove(); return; }
      if (src && !/^https?:\/\//i.test(src)) image.attr('src', absolute(src));
    });
    var content = (body.html() || '').trim();
    if (!content) throw new Error('La web cambió: el capítulo viene vacío');
    return '<div class="chapter-content">' + content + '</div>';
  });
};

Plugin.prototype.resolveUrl = function (path) {
  return absolute(path);
};

exports.default = new Plugin();
