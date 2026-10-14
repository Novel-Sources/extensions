// Devilnovels (devilnovels.com) · Tianshuge
//
// An extension in the LNReader plugin format, written from scratch: there was
// no official one for this site. The site is a WordPress with its own theme,
// where every novel is a page and every chapter a post:
//   - Popular: the site's own novel list (/listado-de-novelas/), which holds
//     every novel on a single page.
//   - Latest: the homepage section «Últimas actualizaciones», newest first.
//   - Search: the site's own search form (post_type=page), exactly as it sends it.
//   - Novel: its page, and the chapter index the page itself asks for
//     (admin-ajax.php, action dv_load_chapters, 100 per page).
//   - Chapter: the chapter page, the same address the site's reader opens.
// Only public content is read: nothing that needs an account. Chapters the
// site locks are listed with 🔒 and never opened; readers can hide them in
// the extension's settings.
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

var fetchLib = require('@libs/fetch');
var FilterTypes = require('@libs/filterInputs').FilterTypes;
var NovelStatus = require('@libs/novelStatus').NovelStatus;
var defaultCover = require('@libs/defaultCover').defaultCover;
var storage = require('@libs/storage').storage;
var cheerio = require('cheerio');

var SITE = 'https://devilnovels.com/';

// The chapter tab holds 100 chapters per page, like the novel page asks for.
var PER_PAGE = 100;

// Only this site's own addresses: a link to another host in a list or in
// the index is dropped, and is never requested.
var OWN = /^https:\/\/(www\.)?devilnovels\.com(\/|$)/i;

function absolute(path) {
  var value = String(path || '');
  if (/^[a-z][a-z0-9+.-]*:|^\/\//i.test(value)) {
    if (!OWN.test(value)) throw new Error('Ruta fuera de la web: ' + value.slice(0, 80));
    return value;
  }
  return SITE + value.replace(/^\/+/, '');
}

// A picture's address as the page gives it: the app downloads covers with
// its own rules, the extension never requests them.
function image(url) {
  var value = String(url || '');
  return /^https?:\/\//i.test(value) ? value : SITE + value.replace(/^\/+/, '');
}

// A page of this site, as a promise: an address of another host fails
// without being requested.
function page(path) {
  return new Promise(function (resolve) { resolve(absolute(path)); }).then(function (url) { return text(url); });
}

function relative(url) {
  var value = String(url || '');
  if (/^[a-z][a-z0-9+.-]*:|^\/\//i.test(value) && !OWN.test(value)) return '';
  return value.replace(OWN, '').replace(/^\/+/, '');
}

// The novel's own name in the site, «obra/» from «obra/capitulo/42/» or
// «obra/?x=y»: the storage keys hold only that, never a query (RB2-D4).
function novelKey(path) {
  var slug = String(path || '').split(/[?#]/)[0].replace(/^\/+/, '').split('/')[0];
  return /^[a-z0-9-]{1,120}$/i.test(slug) ? slug.toLowerCase() + '/' : '';
}

function text(url, init) {
  return fetchLib.fetchApi(url, init).then(function (response) { return response.text(); });
}

// Titles and meta come with HTML entities (&#8211;, &amp;…).
function decode(value) {
  return String(value || '')
    .replace(/&#x([0-9a-f]+);/gi, function (_, hex) { return String.fromCharCode(parseInt(hex, 16)); })
    .replace(/&#(\d+);/g, function (_, dec) { return String.fromCharCode(parseInt(dec, 10)); })
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&hellip;/g, '…').replace(/&amp;/g, '&');
}

// The site appends the status to novel titles for search engines («A Will
// Eternal – Finalizada»): the same novel keeps the same clean name in the
// lists, the updates, the search and the novel page.
function cleanName(name) {
  var s = decode(name).replace(/\s+/g, ' ').trim();
  var clean = s.replace(/\s+[–—-]\s*(Finalizada|Finalizado|En emisi[oó]n|En curso|Completada|Completado|Abandonada|Abandonado|En pausa|En hiatus|Pr[oó]ximamente)\s*$/i, '').trim();
  return clean || s;
}

// The biggest picture the page offers, not the thumbnail. Covers come with
// srcset: the widest entry wins.
function cover(img) {
  var best = '', width = 0;
  String(img.attr('data-srcset') || img.attr('srcset') || '').split(',').forEach(function (entry) {
    var parts = entry.trim().split(/\s+/);
    var w = parseInt(parts[1], 10) || 0;
    if (parts[0] && w > width) { best = parts[0]; width = w; }
  });
  var url = best || img.attr('data-src') || img.attr('data-lazy-src') || img.attr('src') || '';
  return url && !/^data:/.test(url) ? image(url) : '';
}

// The site's own novel list: every novel on a single page.
function list(html) {
  var $ = cheerio.load(html);
  var novels = [], seen = {};
  $('div.pvc-featured-page-item').each(function () {
    var item = $(this);
    var link = item.find('p.pvc-page-title a').first();
    var name = cleanName(link.text());
    var path = relative(link.attr('href'));
    if (!name || !path || seen[path]) return;
    seen[path] = true;
    novels.push({ name: name, path: path, cover: cover(item.find('img').first()) || defaultCover });
  });
  return novels;
}

// «Últimas actualizaciones»: the homepage cards link to chapters, newest
// first. The novel goes out once, with the chapter it was reached through.
function latest(html) {
  var $ = cheerio.load(html);
  var novels = [], seen = {};
  $('a.dv-upd-card').each(function () {
    var card = $(this);
    var segments = relative(card.attr('href')).replace(/\/+$/, '').split('/');
    var path = segments[0] ? segments[0] + '/' : '';
    var name = cleanName(card.find('.dv-upd-novel').first().text());
    if (!name || !path || seen[path]) return;
    seen[path] = true;
    var thumb = card.find('img').first().attr('src') || '';
    novels.push({ name: name, path: path,
      cover: thumb && !/^data:/.test(thumb) ? image(thumb) : defaultCover });
  });
  return novels;
}

function statusFrom(value) {
  var s = String(value || '').toLowerCase();
  if (/ongoing|emisi|curso/.test(s)) return NovelStatus.Ongoing;
  if (/complet|finaliz|terminad/.test(s)) return NovelStatus.Completed;
  if (/cancel|abandon/.test(s)) return NovelStatus.Cancelled;
  if (/hold|pausa|hiatus/.test(s)) return NovelStatus.OnHiatus;
  return NovelStatus.Unknown;
}

// The chapter tab asks admin-ajax.php for 100 chapters per page
// (dv_load_chapters, cat_id/page/search), exactly as the novel page does.
function chaptersPage(catId, page) {
  return fetchLib.fetchApi(SITE + 'wp-admin/admin-ajax.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: 'action=dv_load_chapters&cat_id=' + encodeURIComponent(catId) +
      '&page=' + page + '&search='
  })
    .then(function (response) { return response.json(); })
    .then(function (json) {
      var data = json && json.success && json.data;
      if (!data || !Array.isArray(data.chapters)) {
        throw new Error('La web cambió: el índice de capítulos no trae capítulos');
      }
      return data;
    });
}

function Plugin() {
  this.id = 'devilnovels';
  this.name = 'Devilnovels';
  this.site = SITE;
  this.version = '1.0.1';
  this.icon = 'icons/devilnovels.png';
  this.pluginSettings = {
    hideLocked: { value: '', label: 'Ocultar capítulos de pago', type: FilterTypes.Switch }
  };
  this.filters = {};
}

Plugin.prototype.popularNovels = function (page, opts) {
  if (opts && opts.showLatestNovels) {
    // The homepage holds a single updates section.
    if (page > 1) return Promise.resolve([]);
    return text(SITE).then(latest);
  }
  // The whole list fits in one page.
  if (page > 1) return Promise.resolve([]);
  return text(SITE + 'listado-de-novelas/').then(function (html) {
    var novels = list(html);
    if (!novels.length) throw new Error('La web cambió: el listado no trae novelas');
    return novels;
  });
};

Plugin.prototype.searchNovels = function (term, page) {
  var paging = page > 1 ? 'page/' + page + '/' : '';
  // With the site's own search form, exactly as it sends it.
  return text(SITE + paging + '?s=' + encodeURIComponent(term) + '&post_type=page').then(function (html) {
    var $ = cheerio.load(html);
    var novels = [], seen = {};
    $('article.post').each(function () {
      var article = $(this);
      var link = article.find('h2.entry-title a').first();
      var name = cleanName(link.text());
      var path = relative(link.attr('href'));
      if (!name || !path || seen[path]) return;
      seen[path] = true;
      novels.push({ name: name, path: path, cover: cover(article.find('img').first()) || defaultCover });
    });
    return novels;
  });
};

Plugin.prototype.parseNovel = function (novelPath) {
  // The novel page ends in «/»; a query, if any, is left as it came.
  var address = String(novelPath || '');
  if (!/[?#]/.test(address)) address = address.replace(/\/?$/, '/');
  return page(address).then(function (html) {
    var $ = cheerio.load(html);
    var title = $('.nv-title').first();
    if (!title.length) throw new Error('La web cambió: no se encuentra la ficha de la obra');
    var name = cleanName(title.text());
    var novel = {
      path: novelPath,
      name: name,
      cover: cover($('.nv-cover img').first()) || defaultCover,
      status: statusFrom($('.nv-status-inner').first().text()),
      chapters: []
    };
    // «Autor: Er Gen Traductor: Devilnovels Géneros: Acción, … Xuanhuan.»
    var meta = decode($('meta[name="description"]').attr('content'));
    var author = /Autor:\s*([^.]*?)\s*Traductor:/i.exec(meta);
    if (author && author[1].trim()) novel.author = author[1].trim();
    var genres = /G[eé]neros:\s*([^.]*?)\./i.exec(meta);
    if (genres) {
      novel.genres = genres[1].split(',').map(function (g) { return g.replace(/\s+/g, ' ').trim(); })
        .filter(Boolean).join(',');
    }
    var synopsis = $('.nv-synopsis').first();
    synopsis.find('figure, script, style').remove();
    var paragraphs = synopsis.find('p').map(function () {
      return $(this).text().replace(/\s+/g, ' ').trim();
    }).get().filter(Boolean);
    // The tab repeats the header the meta already carries («Autor: …»,
    // «Traductor: …», «Géneros: …»), or the novel's own name alone in its
    // first paragraph: the story starts after it.
    while (paragraphs.length && (/^(Autor|Traductor|G[eé]neros)\s*:/i.test(paragraphs[0]) ||
        paragraphs[0] === name)) {
      paragraphs.shift();
    }
    novel.summary = paragraphs.join('\n').replace(/^Sinopsis:\s*/i, '') ||
      synopsis.text().replace(/\s+/g, ' ').trim();

    var catId = /var CAT_ID\s*=\s*(\d+)/.exec(html);
    var total = /var TOTAL_CH\s*=\s*(\d+)/.exec(html);
    if (!catId || !total) throw new Error('La web cambió: falta el identificador interno de la obra');
    var pages = Math.max(1, Math.ceil(parseInt(total[1], 10) / PER_PAGE));
    // The internal id, for parsePage: tiny public data, so every index page
    // costs a single request.
    var lockedIds = lockedIdsFrom(html);
    var key = novelKey(novelPath);
    if (key) {
      storage.set('cat:' + key, catId[1]);
      storage.set('locked:' + key, JSON.stringify(lockedIds));
    }
    return chaptersPage(catId[1], 1).then(function (data) {
      novel.chapters = indexEntries(data.chapters, 0, lockedIds);
      // A huge paginated index: the app asks for each page with parsePage.
      novel.totalPages = pages;
      return novel;
    });
  });
};

// One index page, oldest first, with the 🔒 the site itself puts on locked
// chapters. chapterNumber is the position in the whole index.
function indexEntries(entries, offset, lockedIds) {
  var hideLocked = !!storage.get('hideLocked');
  var chapters = [];
  (entries || []).forEach(function (chapter, index) {
    var title = decode(chapter.title).replace(/\s+/g, ' ').trim();
    var path = relative(chapter.link);
    // A link to another host is not a chapter of this site (RB2-D1).
    if (!title || !path) return;
    // The site marks paid chapters in LOCKED_IDS, on the novel page, and
    // draws the padlock itself (dv-chapter-access).
    var locked = (lockedIds || []).indexOf(Number(chapter.id)) !== -1 ||
      chapter.locked === true || chapter.locked === 1 || /^🔒/.test(title);
    if (locked && hideLocked) return;
    chapters.push({
      name: locked && !/^🔒/.test(title) ? '🔒 ' + title : title,
      path: path,
      // The position in the whole index, like the site's tab, even when
      // paid chapters are hidden.
      chapterNumber: offset + index + 1
    });
  });
  return chapters;
}

// «var LOCKED_IDS = [1, 2];» on the novel page: the paid chapters' ids.
function lockedIdsFrom(html) {
  var match = /var LOCKED_IDS\s*=\s*\[([^\]]*)\]/.exec(html);
  if (!match) return [];
  return match[1].split(',').map(function (id) { return parseInt(id, 10); })
    .filter(function (id) { return id > 0; });
}

Plugin.prototype.parsePage = function (novelPath, page) {
  var n = parseInt(page, 10) || 1;
  var key = novelKey(novelPath);
  var cached = key && storage.get('cat:' + key);
  var cachedLocked = key && storage.get('locked:' + key);
  function chapters(catId, lockedIds) {
    return chaptersPage(catId, n).then(function (data) {
      return { chapters: indexEntries(data.chapters, (n - 1) * PER_PAGE, lockedIds) };
    });
  }
  if (cached && cachedLocked) {
    var lockedIds = [];
    try { lockedIds = JSON.parse(cachedLocked); } catch (e) { lockedIds = []; }
    return chapters(cached, lockedIds);
  }
  return page(novelPath).then(function (html) {
    var catId = /var CAT_ID\s*=\s*(\d+)/.exec(html);
    if (!catId) throw new Error('La web cambió: falta el identificador interno de la obra');
    var lockedIds = lockedIdsFrom(html);
    if (key) {
      storage.set('cat:' + key, catId[1]);
      storage.set('locked:' + key, JSON.stringify(lockedIds));
    }
    return chapters(catId[1], lockedIds);
  });
};

// The paid chapters the novel page listed, if it was opened before.
function knownLocked(chapterPath) {
  var key = novelKey(chapterPath);
  var id = parseInt((/\/(\d+)\/?(?:[?#].*)?$/.exec(String(chapterPath)) || [])[1], 10);
  if (!key || !id) return false;
  try { return JSON.parse(storage.get('locked:' + key) || '[]').indexOf(id) !== -1; } catch (e) { return false; }
}

var LOCKED_NOTICE = '<p>This chapter is locked.</p><p>🔒 Capítulo de pago en la web: se desbloquea allí, o cuando la web lo libere.</p>';

Plugin.prototype.parseChapter = function (chapterPath) {
  // Known as paid: not even requested (RB2-D2).
  if (knownLocked(chapterPath)) return Promise.resolve(LOCKED_NOTICE);
  return page(chapterPath).then(function (html) {
    var $ = cheerio.load(html);
    var body = $('article.dv-post-article').first();
    if (!body.length) throw new Error('La web cambió: no se encuentra el texto del capítulo');
    // A locked chapter: the access plugin shows its paywall instead of the
    // text. That goes back as is —the app recognises it— and nothing else is
    // tried. Never guess URLs to read what the site charges for.
    if (body.find('.dvca-paywall, .dvca-locked, .dv-locked').length ||
        /pts para desbloquear|cap[ií]tulo bloqueado|contenido exclusivo/i.test(body.text().slice(0, 500))) {
      return LOCKED_NOTICE;
    }
    // The donation block the site appends to every chapter (a «Cada
    // Donación…» heading with Patreon/PayPal links and a random GIF from
    // another domain): not part of the text.
    body.find('script, style, noscript, iframe, form, button, input, ins, .adsbygoogle').remove();
    // The ad slots the site injects between paragraphs (empty, or with the
    // broker banner): not part of the text.
    body.find('div.dvam-ad-block, a.broker-banner-link').remove();
    body.find('a[href*="patreon.com"], a[href*="paypal.com"]').each(function () {
      var link = $(this);
      var parent = link.parent('div');
      if (parent.length && parent.text().replace(/\s+/g, ' ').trim() === link.text().replace(/\s+/g, ' ').trim()) {
        parent.remove();
      } else link.remove();
    });
    body.find('p').each(function () {
      if (/^si realizas un aporte/i.test($(this).text().replace(/\s+/g, ' ').trim())) $(this).remove();
    });
    body.find('#randomGif').remove();
    body.find('h1, h2, h3').each(function () {
      if (/cada donaci[oó]n/i.test($(this).text())) {
        var box = $(this).parent('div');
        if (box.length && !box.text().replace($(this).text(), '').replace(/\s+/g, ' ').trim()) {
          box.remove();
        } else $(this).remove();
      }
    });
    body.find('img').each(function () {
      var image = $(this);
      var real = image.attr('data-src') || image.attr('data-lazy-src');
      if (real) image.attr('src', real);
      ['data-src', 'data-lazy-src', 'data-srcset', 'data-sizes', 'data-lazyloaded', 'srcset', 'sizes',
        'decoding', 'loading'].forEach(function (attribute) { image.removeAttr(attribute); });
      if (/^data:/.test(image.attr('src') || '')) image.remove();
    });
    // The text carries line breaks in the middle of sentences («la puerta
    // de<br> la aldea»), left by the translation tool: joined with a space,
    // so the reader does not split the paragraph. Only between two pieces
    // of text, and never after the end of a sentence or before a capital
    // letter; attributes are not touched (RB2-D3).
    body.find('br').each(function () {
      var prev = this.prev, next = this.next;
      while (next && next.type === 'text' && !/\S/.test(next.data)) next = next.next;
      if (prev && prev.type === 'text' && next && next.type === 'text' &&
          /[^\s.!?…:;"”»]\s*$/.test(prev.data) && /^\s*[a-záéíóúüñ]/.test(next.data)) {
        $(this).replaceWith(' ');
      }
    });
    var content = (body.html() || '').trim();
    if (!content) throw new Error('La web cambió: el capítulo no trae texto');
    return '<div class="chapter-content">' + content + '</div>';
  });
};

Plugin.prototype.resolveUrl = function (path) {
  return absolute(path);
};

exports.default = new Plugin();
