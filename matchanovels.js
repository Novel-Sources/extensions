// MatchaNovels (matchanovels.com) · Novel Sources
//
// An extension in the LNReader plugin format, written from scratch: there was
// no official one for this site. The site is a custom Next.js app (App Router,
// data embedded in self.__next_f scripts) for novels translated into Spanish:
//   - Popular and latest: the library catalogue (/biblioteca), which embeds one
//     JSON array with every novel (title, link, cover, status, genres, views,
//     updated date, search text). Popular sorts by views, latest by updated
//     date, exactly what the site's client-side ordering does.
//   - Search and filters: the same catalogue, filtered locally by the search
//     text (the site searches titles and alternative titles) and by the site's
//     own genre/status values.
//   - Novel: its page (/novela/<slug>), with the fiche (ld+json), and the full
//     chapter list from the page's own embedded JSON.
//   - Chapter: the chapter body (.mn-lector).
// Only public content is read: nothing that needs an account. VIP chapters are
// listed with 🔒 and never opened; readers can hide them in the extension's
// settings.
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

var fetchLib = require('@libs/fetch');
var FilterTypes = require('@libs/filterInputs').FilterTypes;
var NovelStatus = require('@libs/novelStatus').NovelStatus;
var defaultCover = require('@libs/defaultCover').defaultCover;
var storage = require('@libs/storage').storage;
var cheerio = require('cheerio');

var SITE = 'https://matchanovels.com/';

// The site's own genre list, from its library filter buttons, with the slugs
// its novel pages link to (/biblioteca?genero=<slug>) and its catalogue JSON
// uses (checked 13/10/2026 on /biblioteca and /novela/Shadow-Slave).
var GENRES = [
  ['Acción', 'accion'], ['Aventura', 'aventura'], ['Fantasía', 'fantasia'],
  ['Drama', 'drama'], ['Romance', 'romance'], ['Comedia', 'comedia'],
  ['Harem', 'harem'], ['Vida Escolar', 'vida-escolar'], ['Sobrenatural', 'sobrenatural'],
  ['Misterio', 'misterio'], ['Horror', 'horror']
];

// The site's own status values, from its library filter buttons (En curso,
// En pausa, Finalizada) and its catalogue JSON (checked 13/10/2026).
var STATES = [
  ['En curso', 'ongoing'], ['En pausa', 'hiatus'], ['Finalizada', 'completed']
];

var CACHE_MINUTES = 15;

function options(pairs) {
  return pairs.map(function (pair) { return { label: pair[0], value: pair[1] }; });
}

function absolute(path) {
  if (/^https?:\/\//i.test(path)) return path;
  return SITE + String(path || '').replace(/^\/+/, '');
}

function relative(url) {
  return String(url || '').replace(/^https?:\/\/(www\.)?matchanovels\.com\/?/i, '').replace(/^\/+/, '');
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
  if (/finaliz|complet/.test(s)) return NovelStatus.Completed;
  if (/pausa|hiatus/.test(s)) return NovelStatus.OnHiatus;
  if (/curso|ongoing/.test(s)) return NovelStatus.Ongoing;
  if (/cancel|abandon/.test(s)) return NovelStatus.Cancelled;
  return NovelStatus.Unknown;
}

function stateFromSlug(value) {
  var s = String(value || '').toLowerCase();
  if (s === 'completed') return NovelStatus.Completed;
  if (s === 'ongoing') return NovelStatus.Ongoing;
  if (s === 'hiatus') return NovelStatus.OnHiatus;
  return NovelStatus.Unknown;
}

function chosen(filters, key) {
  var value = filters && filters[key] && filters[key].value;
  return Array.isArray(value) ? value : [];
}

// The library page embeds the whole catalogue as JSON inside its Next.js data
// (one object per novel: title, href, cover, estado, generos, views,
// actualizada, busqueda). Only the fields the reader uses are kept, so the
// 300 KB page is downloaded once and cached small.
function parseCatalogue(html) {
  var clean = String(html || '').replace(/\\"/g, '"');
  var entries = [];
  var re = /\{"id":"[^"]*","title":"([^"]*)","href":"([^"]*)","cover":"([^"]*)","estado":"([^"]*)","generos":\[([^\]]*)\][^}]*?"views":(\d+)[^}]*?"actualizada":"([^"]*)","vip":(true|false),"busqueda":"([^"]*)"\}/g;
  var m;
  while ((m = re.exec(clean))) {
    var genres = [];
    String(m[5] || '').split(',').forEach(function (g) {
      var slug = g.trim().replace(/^"|"$/g, '');
      if (slug) genres.push(slug);
    });
    entries.push({
      title: m[1], href: m[2], cover: m[3], estado: m[4], generos: genres,
      views: parseInt(m[6], 10) || 0, actualizada: m[7], busqueda: m[9]
    });
  }
  return entries;
}

function catalogue() {
  var cached = storage.get('catalogue');
  if (cached) return Promise.resolve(cached);
  return text(SITE + 'biblioteca').then(function (html) {
    var entries = parseCatalogue(html);
    if (!entries.length) throw new Error('La web cambió: no se encuentra el catálogo en /biblioteca');
    storage.set('catalogue', entries, Date.now() + CACHE_MINUTES * 60 * 1000);
    return entries;
  });
}

function row(entry) {
  return {
    name: entry.title,
    path: relative(entry.href),
    cover: entry.cover && /^https:\/\//i.test(entry.cover) ? entry.cover : defaultCover
  };
}

function Plugin() {
  this.id = 'matchanovels';
  this.name = 'MatchaNovels';
  this.site = SITE;
  this.version = '1.0.1';
  this.icon = 'icons/matchanovels.png';
  this.pluginSettings = {
    hideLocked: { value: '', label: 'Ocultar capítulos de pago', type: FilterTypes.Switch }
  };
  this.filters = {
    genre: { type: FilterTypes.CheckboxGroup, label: 'Género', value: [], options: options(GENRES) },
    status: { type: FilterTypes.CheckboxGroup, label: 'Estado', value: [], options: options(STATES) }
  };
}

Plugin.prototype.popularNovels = function (page, opts) {
  // The library is a single catalogue: everything fits on page 1.
  if (page > 1) return Promise.resolve([]);
  var filters = (opts && opts.filters) || this.filters;
  var genres = chosen(filters, 'genre'), states = chosen(filters, 'status');
  var latest = !!(opts && opts.showLatestNovels);
  return catalogue().then(function (entries) {
    var kept = entries.filter(function (entry) {
      if (genres.length && !genres.some(function (g) { return entry.generos.indexOf(g) !== -1; })) return false;
      if (states.length && states.indexOf(entry.estado) === -1) return false;
      return true;
    });
    // The site orders the catalogue client-side: by popularity (views) or,
    // for new releases, by update date.
    kept.sort(function (a, b) {
      return latest ? String(b.actualizada).localeCompare(String(a.actualizada)) : (b.views - a.views);
    });
    return kept.map(row);
  });
};

Plugin.prototype.searchNovels = function (term, page) {
  if (page > 1) return Promise.resolve([]);
  var wanted = plain(term);
  return catalogue().then(function (entries) {
    return entries.filter(function (entry) {
      return plain(entry.title).indexOf(wanted) !== -1 || plain(entry.busqueda).indexOf(wanted) !== -1;
    }).map(row);
  });
};

Plugin.prototype.parseNovel = function (novelPath) {
  var pageURL = absolute(novelPath);
  var slug = String(novelPath || '').replace(/\/+$/, '').split('/').pop();
  return text(pageURL).then(function (html) {
    var $ = cheerio.load(html);
    var name = $('div[data-mn-ficha] h1').first().text().replace(/\s+/g, ' ').trim();
    if (!name) throw new Error('La web cambió: no se encuentra el título de la obra');
    // The fiche data travels as schema.org JSON-LD (cover and full synopsis).
    var fiche = null;
    $('script[type="application/ld+json"]').each(function () {
      try {
        var data = JSON.parse($(this).html() || '');
        if (data && data['@type'] === 'Book' && !fiche) fiche = data;
      } catch (e) { /* not JSON: the breadcrumb block; skip it */ }
    });
    var novel = {
      path: novelPath,
      name: name,
      cover: (fiche && fiche.image && /^https:\/\//i.test(fiche.image)) ? fiche.image : defaultCover,
      status: NovelStatus.Unknown,
      chapters: []
    };
    // The alternative title sits right under the title.
    var alt = $('div[data-mn-ficha] h1').first().parent().find('p').first().text().replace(/\s+/g, ' ').trim();
    var genres = $('div[data-mn-ficha] a[href^="/biblioteca?genero="]').map(function () {
      return $(this).text().trim();
    }).get().filter(Boolean);
    if (genres.length) novel.genres = genres.join(',');
    var badge = $('div[data-mn-ficha] h1').first().parent().find('span').first().text().replace(/\s+/g, ' ').trim();
    novel.status = statusFrom(badge);
    if (novel.status === NovelStatus.Unknown) {
      var complete = /"completa":(true|false)/.exec(html);
      if (complete) novel.status = complete[1] === 'true' ? NovelStatus.Completed : NovelStatus.Ongoing;
    }
    var summary = fiche && fiche.description ? String(fiche.description).replace(/\r/g, '').trim() : '';
    if (alt && plain(alt) !== plain(name)) summary += (summary ? '\n\n' : '') + 'Otros títulos: ' + alt;
    novel.summary = summary;
    // The full chapter list travels in the page's Next.js data as
    // ["<number>","<date>",<locked>,...] rows, oldest first.
    var rows = [];
    var re = /\[\\"(\d+)\\",\\"([^"\\]*)\\",(true|false)/g;
    var m;
    while ((m = re.exec(html))) rows.push({ number: m[1], date: m[2], locked: m[3] === 'true' });
    if (!rows.length) {
      var plainRe = /\["(\d+)","([^"]*)",(true|false)/g;
      while ((m = plainRe.exec(html))) rows.push({ number: m[1], date: m[2], locked: m[3] === 'true' });
    }
    if (!rows.length) throw new Error('La web cambió: no se encuentra el índice de capítulos');
    // Like devilnovels 1.0.1: the paid chapters this index names are kept by
    // novel slug, so parseChapter answers them without any request.
    var hideLocked = !!storage.get('hideLocked');
    var locked = [];
    rows.forEach(function (entry) {
      if (entry.locked) locked.push(entry.number);
      if (entry.locked && hideLocked) return;
      var title = 'Capítulo ' + entry.number;
      novel.chapters.push({
        name: entry.locked ? '🔒 ' + title : title,
        path: 'novela/' + slug + '/capitulo/' + entry.number,
        releaseTime: entry.date || undefined,
        chapterNumber: parseInt(entry.number, 10) || (novel.chapters.length + 1)
      });
    });
    if (slug) storage.set('locked:' + slug, JSON.stringify(locked));
    return novel;
  });
};

// The paid chapters the novel page listed, if it was opened before.
function novelKey(chapterPath) {
  var m = /^novela\/([^/]+)\/capitulo\/(\d+)\/?(?:[?#].*)?$/.exec(String(chapterPath || ''));
  return m ? { slug: m[1], number: m[2] } : null;
}

function knownLocked(chapterPath) {
  var key = novelKey(chapterPath);
  if (!key) return false;
  try {
    return JSON.parse(storage.get('locked:' + key.slug) || '[]').indexOf(key.number) !== -1;
  } catch (e) { return false; }
}

var LOCKED_NOTICE = '<p>This chapter is locked.</p><p>🔒 Capítulo de pago en la web: se desbloquea allí, o cuando la web lo libere.</p>';

Plugin.prototype.parseChapter = function (chapterPath) {
  // Known as paid from the index: not even requested.
  if (knownLocked(chapterPath)) return Promise.resolve(LOCKED_NOTICE);
  return text(absolute(chapterPath)).then(function (html) {
    // A VIP chapter shows no text, only the members notice.
    if (/miembros VIP/i.test(html)) return LOCKED_NOTICE;
    var $ = cheerio.load(html);
    var body = $('.mn-lector').first();
    if (!body.length) throw new Error('La web cambió: no se encuentra el texto del capítulo');
    body.find('script, style, noscript, iframe, form, button, input, ins, .adsbygoogle').remove();
    body.find('div[data-mn-anuncio]').remove();
    // Some chapters store site chrome as their first paragraph.
    body.find('p').first().each(function () {
      if (/^(#\s*leer ahora|[.\-–—*]+)$/i.test($(this).text().trim())) $(this).remove();
    });
    // ... and some trail it with share/comment/next-chapter prompts (compared
    // accent-folded, so only whole-paragraph chrome ever matches).
    var tail = body.children('p').last();
    while (tail.length && /^(#\s*)?(comparte?( esto)?|compartir|siguenos|comenta(rios?)?|siguiente capitulo|capitulo anterior|indice de la novela|gracias por leer.*)$/.test(plain(tail.text()))) {
      var previous = tail.prev('p');
      tail.remove();
      tail = previous;
    }
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
