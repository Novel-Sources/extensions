// Astral Novel Translations (astralnovelstranslations.wordpress.com) · Novel Sources
//
// An extension in the LNReader plugin format, written from scratch: there was
// no official one for this site. The site is a WordPress.com translation blog
// (Baskerville 2 theme) where each novel has a fiche page and its chapters are
// the blog posts of the same-slug category:
//   - Popular and latest: the novel index page
//     (/indice-de-novelas-ligeras-traducidas/), which groups every novel with
//     its cover by status. Latest orders those novels by their most recent
//     post on the homepage.
//   - Search: the site's own WordPress search, whose chapter posts map back to
//     their novels through their category.
//   - Novel: its fiche page (title, cover, synopsis, data sheet) plus its
//     category page (/category/<slug>/), which lists every chapter post.
//   - Chapter: the chapter post body (.post-content).
// Only public content is read: nothing that needs an account. The site has no
// paid chapters.
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

var fetchLib = require('@libs/fetch');
var NovelStatus = require('@libs/novelStatus').NovelStatus;
var defaultCover = require('@libs/defaultCover').defaultCover;
var storage = require('@libs/storage').storage;
var cheerio = require('cheerio');

var SITE = 'https://astralnovelstranslations.wordpress.com/';

var INDEX = 'indice-de-novelas-ligeras-traducidas/';
var CACHE_MINUTES = 15;

function absolute(path) {
  if (/^https?:\/\//i.test(path)) return path;
  return SITE + String(path || '').replace(/^\/+/, '');
}

function relative(url) {
  return String(url || '').replace(/^https?:\/\/(www\.)?astralnovelstranslations\.wordpress\.com\/?/i, '').replace(/^\/+/, '');
}

function text(url, init) {
  return fetchLib.fetchApi(url, init).then(function (response) { return response.text(); });
}

// As in jabrascan.js: accents and case do not matter when matching titles.
var ACCENTS = new RegExp('[\\u0300-\\u036f]', 'g');
function plain(value) {
  var s = String(value == null ? '' : value).toLowerCase().trim();
  if (typeof s.normalize === 'function') s = s.normalize('NFD').replace(ACCENTS, '');
  return s.replace(/\s+/g, ' ');
}

function statusFrom(value) {
  var s = plain(value);
  if (/abandon/.test(s)) return NovelStatus.Cancelled;
  if (/finaliz|terminad|complet/.test(s)) return NovelStatus.Completed;
  if (/activ|curso|día|dia|proyecto/.test(s)) return NovelStatus.Ongoing;
  if (/pausa|hiatus/.test(s)) return NovelStatus.OnHiatus;
  return NovelStatus.Unknown;
}

// The index page groups its cards under one heading per status.
function sectionStatus(heading) {
  var s = plain(heading);
  if (/abandon/.test(s)) return NovelStatus.Cancelled;
  if (/finaliz|terminad/.test(s)) return NovelStatus.Completed;
  return NovelStatus.Ongoing;
}

// Every novel the site translates, with the cover and status its own index
// gives it. Small enough to cache processed.
function index() {
  var cached = storage.get('index');
  if (cached) return Promise.resolve(cached);
  return text(absolute(INDEX)).then(function (html) {
    var $ = cheerio.load(html);
    var novels = [], seen = {};
    $('.indice-maestro h2').each(function () {
      var status = sectionStatus($(this).text());
      $(this).nextAll('div').first().find('a[href]').each(function () {
        var link = $(this);
        var path = relative(link.attr('href'));
        if (!path || seen[path]) return;
        seen[path] = true;
        var name = link.find('strong').first().text().replace(/\s+/g, ' ').trim() ||
          link.text().replace(/\s+/g, ' ').trim();
        if (!name) return;
        var img = link.find('img').first();
        var src = img.attr('src') || '';
        novels.push({
          name: name, path: path,
          cover: src && /^https:\/\//i.test(src) ? src : defaultCover,
          status: status
        });
      });
    });
    if (!novels.length) throw new Error('La web cambió: no se encuentra el índice de novelas');
    storage.set('index', novels, Date.now() + CACHE_MINUTES * 60 * 1000);
    return novels;
  });
}

// A novel page slug and its chapter category usually match; the chapter posts
// themselves carry the category in their article classes.
function categoryOf(article) {
  var classes = String(article.attr('class') || '').split(/\s+/);
  for (var i = 0; i < classes.length; i++) {
    var m = /^category-(.+)$/.exec(classes[i]);
    if (m && m[1] !== 'uncategorized') return m[1];
  }
  return '';
}

function Plugin() {
  this.id = 'astralnove';
  this.name = 'Astral Novel Translations';
  this.site = SITE;
  this.version = '1.0.2';
  this.icon = 'icons/astralnove.png';
}

Plugin.prototype.popularNovels = function (page, opts) {
  if (opts && opts.showLatestNovels) return latest(page);
  // The index is a single page: everything fits on page 1.
  if (page > 1) return Promise.resolve([]);
  return index().then(function (novels) {
    return novels.map(function (novel) {
      return { name: novel.name, path: novel.path, cover: novel.cover };
    });
  });
};

Plugin.prototype.searchNovels = function (term, page) {
  if (page > 1) return Promise.resolve([]);
  var wanted = plain(term);
  return Promise.all([index(), text(SITE + '?s=' + encodeURIComponent(term))]).then(function (both) {
    var novels = both[0], $ = cheerio.load(both[1]);
    var cats = {};
    // Each result post points at its novel through its category.
    $('article[class*="category-"]').each(function () {
      cats[categoryOf($(this))] = true;
    });
    var byPath = {};
    novels.forEach(function (novel) { byPath[String(novel.path).replace(/\/+$/, '')] = novel; });
    var found = [], seen = {};
    Object.keys(cats).forEach(function (slug) {
      var novel = byPath['category/' + slug] || byPath[slug];
      if (novel && !seen[novel.path]) { seen[novel.path] = true; found.push(novel); }
    });
    // Whatever the category mapping misses, match by title text.
    if (!found.length) {
      novels.forEach(function (novel) {
        if (plain(novel.name).indexOf(wanted) !== -1) found.push(novel);
      });
    }
    return found.map(function (novel) {
      return { name: novel.name, path: novel.path, cover: novel.cover };
    });
  });
};

function latest(page) {
  if (page > 1) return Promise.resolve([]);
  return Promise.all([index(), text(SITE)]).then(function (both) {
    var novels = both[0], $ = cheerio.load(both[1]);
    var order = [];
    // The homepage lists the newest posts first: their categories give the
    // novels with new chapters, newest first.
    $('article[class*="category-"]').each(function () {
      var slug = categoryOf($(this));
      if (slug && order.indexOf(slug) === -1) order.push(slug);
    });
    var bySlug = {};
    novels.forEach(function (novel) {
      bySlug[String(novel.path).replace(/\/+$/, '')] = novel;
    });
    var ranked = [], seen = {};
    order.forEach(function (slug) {
      var novel = bySlug[slug];
      if (novel && !seen[novel.path]) { seen[novel.path] = true; ranked.push(novel); }
    });
    novels.forEach(function (novel) {
      if (!seen[novel.path]) { seen[novel.path] = true; ranked.push(novel); }
    });
    return ranked.map(function (novel) {
      return { name: novel.name, path: novel.path, cover: novel.cover };
    });
  });
}

function chaptersFrom(html) {
  var $ = cheerio.load(html);
  var chapters = [], seen = {};
  // Newest first on the site.
  $('article.post').each(function () {
    var article = $(this);
    var link = article.find('h1.post-title a').first();
    if (!link.length) return;
    var title = link.text().replace(/\s+/g, ' ').trim();
    // Share links (?share=x) and missing trailing slashes point at the same
    // post: compare normalized, keep the first form.
    var path = relative(link.attr('href')).split('?')[0].split('#')[0];
    var key = path.replace(/\/+$/, '').toLowerCase();
    if (!title || !path || seen[key]) return;
    seen[key] = true;
    var time = article.find('time[datetime]').first().attr('datetime') ||
      article.find('.post-date').first().text().replace(/\s+/g, ' ').trim() || undefined;
    var volume = /volumen\s+(\d+)/i.exec(title);
    chapters.push({
      name: title, path: path, releaseTime: time || undefined,
      page: volume ? 'Volumen ' + volume[1] : undefined
    });
  });
  return chapters;
}

Plugin.prototype.parseNovel = function (novelPath) {
  var slug = String(novelPath || '').replace(/\/+$/, '').split('/').pop();
  return text(absolute(novelPath)).then(function (html) {
    var $ = cheerio.load(html);
    var name = $('h1.post-title').first().text().replace(/\s+/g, ' ').trim();
    if (!name) throw new Error('La web cambió: no se encuentra el título de la obra');
    var novel = {
      path: novelPath,
      name: name,
      cover: $('meta[property="og:image"]').first().attr('content') || defaultCover,
      status: NovelStatus.Unknown,
      summary: '',
      chapters: []
    };
    if (!/^https:\/\//i.test(novel.cover)) novel.cover = defaultCover;
    var content = $('.post-content').first();
    // The synopsis runs from its heading to the next one.
    var sinopsis = content.find('h2').filter(function () {
      return /sinopsis/i.test($(this).text());
    }).first();
    if (sinopsis.length) {
      novel.summary = sinopsis.nextUntil('h2, h3').filter('p').map(function () {
        return $(this).text().trim();
      }).get().filter(Boolean).join('\n');
    }
    var alternative = '', genres = '', author = '', state = '';
    content.find('li').each(function () {
      var item = $(this).text().replace(/\s+/g, ' ').trim();
      var m = /^(título original|titulo original)\s*:\s*(.+)$/i.exec(item);
      if (m) alternative = m[2];
      m = /^(género|genero)\s*:\s*(.+)$/i.exec(item);
      if (m) genres = m[2];
      m = /^autor\s*:\s*(.+)$/i.exec(item);
      if (m) author = m[1];
    });
    if (author) novel.author = author;
    if (genres) novel.genres = genres.split(',').map(function (g) { return g.trim(); }).filter(Boolean).join(',');
    content.find('h3').each(function () {
      if (/estado/i.test($(this).text())) state = $(this).next('p').text();
    });
    novel.status = statusFrom(state);
    if (alternative) novel.summary += (novel.summary ? '\n\n' : '') + 'Otros títulos: ' + alternative;
    // Chapters live in the same-slug category, newest first. A few novels
    // post under a shorter category slug: then the site search tells which
    // category its posts share.
    return text(absolute('category/' + slug + '/')).then(function (catHtml) {
      var chapters = chaptersFrom(catHtml);
      if (chapters.length) return done(chapters);
      return text(SITE + '?s=' + encodeURIComponent(name)).then(function (searchHtml) {
        var counts = {};
        var c = cheerio.load(searchHtml);
        c('article[class*="category-"]').each(function () {
          var found = categoryOf(c(this));
          if (found) counts[found] = (counts[found] || 0) + 1;
        });
        var best = '', bestCount = 0;
        Object.keys(counts).forEach(function (key) {
          if (counts[key] > bestCount) { bestCount = counts[key]; best = key; }
        });
        if (!best) throw new Error('La web cambió: no se encuentran los capítulos de la obra');
        return text(absolute('category/' + best + '/')).then(function (bestHtml) {
          var bestChapters = chaptersFrom(bestHtml);
          if (!bestChapters.length) throw new Error('La web cambió: no se encuentran los capítulos de la obra');
          return done(bestChapters);
        });
      });
    });

    function done(chapters) {
      // Oldest first. Whether an entry is a volume announcement never
      // changes, so its kind ('pdf' or 'prosa') is kept in storage with no
      // expiry, keyed by entry path: only unknown routes are opened, at most
      // 10 new checks per novel (the rest keep a plain name until their
      // chapter is opened, which classifies them too).
      var ordered = chapters.reverse();
      var fresh = [];
      ordered.forEach(function (chapter) {
        var kind = storage.get('kind:' + chapter.path);
        if (kind === 'pdf') chapter.name = '📄 ' + chapter.name;
        else if (kind !== 'prosa' && fresh.length < 10) fresh.push(chapter);
      });
      return eachBatch(fresh, 5, function (chapter) {
        return text(absolute(chapter.path)).then(function (entryHtml) {
          var c = cheerio.load(entryHtml);
          var post = c('.post-content').first();
          var pdf = post.length && isVolumeNotice(c, cleanBody(c, post));
          storage.set('kind:' + chapter.path, pdf ? 'pdf' : 'prosa');
          if (pdf) chapter.name = '📄 ' + chapter.name;
        }, function () { /* unreadable entry keeps its plain name */ });
      }).then(function () {
        novel.chapters = ordered.map(function (chapter, i) {
          chapter.chapterNumber = i + 1;
          return chapter;
        });
        return novel;
      });
    }
  });
};

// The chapter body without anything around the story: navigation, download
// promos, share buttons, comments. Shared by the chapter reader and by the
// volume-announcement detector below.
function cleanBody($, body) {
  body.find('script, style, noscript, iframe, form, button, input, .post-meta, .author-bio, ' +
    '.sharedaddy, #comments, .comments-area, nav, .post-navigation').remove();
  // Ad slots left in the markup.
  body.find('div[id^="atatags-"], span[id*="wordads"], div[id*="wordads"]').remove();
  // Previous/index/next chapter links, top and bottom of every chapter.
  body.find('div').each(function () {
    var box = $(this);
    var label = box.text().replace(/\s+/g, ' ');
    if (/Capítulo Anterior/i.test(label) && /Siguiente Capítulo/i.test(label)) box.remove();
  });
  // The offline PDF download promo (short links, never the chapter text).
  body.find('h3, h4').each(function () {
    if (/lleva este cap[íi]tulo contigo/i.test($(this).text())) {
      var next = $(this).next();
      $(this).remove();
      while (next.length && (/descarga este capítulo en pdf/i.test(next.text()) ||
        next.find('a[href*="t.ly"], a[href*="tinyurl.com"], a[href*="cutt.ly"]').length)) {
        var following = next.next();
        next.remove();
        next = following;
      }
    }
  });
  return body;
}

// Download shorteners and drives: the volumes travel through them, never the
// chapter prose.
var DOWNLOAD_HOSTS = /t\.ly|tinyurl\.com|cutt\.ly|acortar\.link|goo\.su|drive\.google|mega\.nz|mediafire|gofile|1fichier|anonfiles/i;

// Some entries are volume announcements (volume synopsis plus an external
// volume download) with no prose on the site. Once the per-chapter download
// promo is cleaned, only their volume download is left pointing out.
function isVolumeNotice($, body) {
  var notice = false;
  body.find('h2, h3, h4').each(function () {
    if (/^en traducci[óo]n$/i.test($(this).text().trim())) notice = true;
  });
  body.find('a[href]').each(function () {
    if (DOWNLOAD_HOSTS.test($(this).attr('href') || '')) notice = true;
  });
  return notice;
}

var PDF_NOTICE = '<p>Este volumen sólo está disponible en PDF fuera de la web; la app no lo descarga.</p>';

// The app allows a few requests at once: the per-entry check goes in small
// sequential batches.
function eachBatch(list, size, work) {
  var at = 0;
  function next() {
    if (at >= list.length) return Promise.resolve();
    var batch = list.slice(at, at + size);
    at += size;
    return Promise.all(batch.map(work)).then(next);
  }
  return next();
}
Plugin.prototype.parseChapter = function (chapterPath) {
  return text(absolute(chapterPath)).then(function (html) {
    var $ = cheerio.load(html);
    if (!$('h1.post-title').length) throw new Error('La web cambió: no se encuentra el capítulo');
    var body = cleanBody($, $('.post-content').first());
    if (!body.length) throw new Error('La web cambió: no se encuentra el texto del capítulo');
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
    body.find('p').each(function () {
      var paragraph = $(this);
      if (!paragraph.text().trim() && !paragraph.find('img').length) paragraph.remove();
    });
    var content = (body.html() || '').trim();
    if (!content) throw new Error('La web cambió: el capítulo viene vacío');
    // A volume announcement holds no prose: its synopsis plus the external
    // volume download, which is never followed. The verdict is kept, so the
    // index learns it without reopening the entry.
    var pdf = isVolumeNotice($, body);
    storage.set('kind:' + chapterPath, pdf ? 'pdf' : 'prosa');
    if (pdf) content += PDF_NOTICE;
    return '<div class="chapter-content">' + content + '</div>';
  });
};

Plugin.prototype.resolveUrl = function (path) {
  return absolute(path);
};

exports.default = new Plugin();
