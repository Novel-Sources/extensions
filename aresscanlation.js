// Ares Scanlation (aresscanlationovel.com) · Novel Sources
//
// An extension in the LNReader plugin format, written from scratch: there was
// no official one for this site. The site runs the Madara theme, with the
// same pages and filters as its web search:
//   - Popular and latest: the novel list, in the order the reader picks.
//   - Search and filters: the site's advanced search (genres, status, adult).
//   - Novel: its page, and the chapter list the page itself asks for
//     (ajax/chapters/).
// Only public content is read: nothing that needs an account. Chapters sold
// with the site's coins are listed with 🔒 and never opened; readers can hide
// them in the extension's settings.
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

var fetchLib = require('@libs/fetch');
var FilterTypes = require('@libs/filterInputs').FilterTypes;
var NovelStatus = require('@libs/novelStatus').NovelStatus;
var defaultCover = require('@libs/defaultCover').defaultCover;
var storage = require('@libs/storage').storage;
var cheerio = require('cheerio');

var SITE = 'https://aresscanlationovel.com/';

// The site's own genre list, with its slugs (checked 4/10/2026).
var GENRES = [
  ['Acción', 'accion'], ['Adultos', 'adultos'], ['Apocalipsis', 'apocalipsis'],
  ['Artes marciales', 'artes-marciales'], ['Aventura', 'aventura'], ['BL', 'bl'],
  ['Ciencia ficción', 'ciencia-ficcion'], ['Comedia', 'comedia'], ['Cultivación', 'cultivacion'],
  ['Drama', 'drama'], ['Ecchi', 'ecchi'], ['Entretenimiento', 'entretenimiento'],
  ['Familiar', 'familiar'], ['Fantasía', 'fantasia'], ['Harem', 'harem'], ['Historia', 'historia'],
  ['Interestelar', 'interestelar'], ['Juego', 'juego'], ['Maduro', 'maduro'], ['Magia', 'magia'],
  ['Misterio', 'misterio'], ['Mpreg', 'mpreg'], ['Novela web', 'novela-web'],
  ['Omegaverse', 'omegaverse'], ['Psicológico', 'psicologico'], ['Realidad virtual', 'realidad-virtual'],
  ['Recuentos de la vida', 'recuentos-de-la-vida'], ['Reencarnación', 'reencarnacion'],
  ['Romance', 'romance'], ['Seinen', 'seinen'], ['Shounen', 'shounen'], ['Shounen ai', 'shounen-ai'],
  ['Sobrenatural', 'sobre-natural'], ['Tragedia', 'tragedia'], ['Transmigración', 'transmigracion'],
  ['Venganza', 'venganza'], ['Vida escolar', 'vida-escolar'], ['Wuxia', 'wuxia-2'],
  ['Xianxia', 'xianxia'], ['Yaoi', 'yaoi']
];

function options(pairs) {
  return pairs.map(function (pair) { return { label: pair[0], value: pair[1] }; });
}

function absolute(path) {
  if (/^https?:\/\//i.test(path)) return path;
  return SITE + String(path || '').replace(/^\/+/, '');
}

function relative(url) {
  return String(url || '').replace(/^https?:\/\/(www\.)?aresscanlationovel\.com\/?/i, '').replace(/^\/+/, '');
}

function text(url, init) {
  return fetchLib.fetchApi(url, init).then(function (response) { return response.text(); });
}

// The biggest picture the page offers, not the thumbnail. The site loads
// pictures lazily: the real address is in data-src / data-srcset.
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
  $('.page-item-detail, .c-tabs-item__content').each(function () {
    var item = $(this);
    var link = item.find('.post-title a').first();
    var name = link.text().replace(/\s+/g, ' ').trim();
    var path = relative(link.attr('href'));
    if (!name || !path || seen[path]) return;
    seen[path] = true;
    novels.push({ name: name, path: path, cover: cover(item.find('img').first()) || defaultCover });
  });
  return novels;
}

function chosen(filters, key) {
  var value = filters && filters[key] && filters[key].value;
  return Array.isArray(value) ? value : [];
}

function statusFrom(value) {
  var s = String(value || '').toLowerCase();
  if (/ongoing|emisi|curso/.test(s)) return NovelStatus.Ongoing;
  if (/complet|finaliz|terminad/.test(s)) return NovelStatus.Completed;
  if (/cancel/.test(s)) return NovelStatus.Cancelled;
  if (/hold|pausa|hiatus/.test(s)) return NovelStatus.OnHiatus;
  return NovelStatus.Unknown;
}

// What WordPress makes of a title: «Capítulo 12» → «capitulo-12».
var ACCENTS = new RegExp('[\\u0300-\\u036f]', 'g');
function slug(value) {
  var s = String(value || '').toLowerCase();
  if (typeof s.normalize === 'function') s = s.normalize('NFD').replace(ACCENTS, '');
  return s.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// «Capítulo 696 - Desviación de qi» lives at «capitulo-696». Coin chapters
// come without a link, so their address is guessed the way the free ones of
// the same novel are named: by number (almost all of this site) or by the
// whole title. When the site frees one, it brings its real link.
function byNumber(title) {
  var found = /cap[ií]tulo\s+(\d+(?:[.,]\d+)?)/i.exec(title);
  return found ? 'capitulo-' + found[1].replace(/[.,]/g, '-') : '';
}

function Plugin() {
  this.id = 'aresscanlation';
  this.name = 'Ares Scanlation';
  this.site = SITE;
  this.version = '1.0.0';
  this.icon = 'icons/aresscanlation.png';
  this.pluginSettings = {
    hideLocked: { value: '', label: 'Ocultar capítulos de pago', type: FilterTypes.Switch }
  };
  this.filters = {
    m_orderby: {
      type: FilterTypes.Picker, label: 'Ordenar por', value: 'views',
      options: options([['Más vistas', 'views'], ['Tendencia', 'trending'], ['Mejor valoradas', 'rating'],
        ['Últimas actualizaciones', 'latest'], ['Nuevas', 'new-manga'], ['A — Z', 'alphabet']])
    },
    'genre[]': { type: FilterTypes.CheckboxGroup, label: 'Género', value: [], options: options(GENRES) },
    op: { type: FilterTypes.Switch, label: 'Que tengan todos los géneros elegidos', value: false },
    'status[]': {
      type: FilterTypes.CheckboxGroup, label: 'Estado', value: [],
      options: options([['En emisión', 'on-going'], ['Completada', 'end'], ['Cancelada', 'canceled'],
        ['En pausa', 'on-hold'], ['Próximamente', 'upcoming']])
    },
    adult: {
      type: FilterTypes.Picker, label: 'Contenido adulto', value: '',
      options: options([['Todo', ''], ['Sin contenido adulto', '0'], ['Sólo contenido adulto', '1']])
    }
  };
}

Plugin.prototype.popularNovels = function (page, opts) {
  var filters = (opts && opts.filters) || this.filters;
  var order = (opts && opts.showLatestNovels) ? 'latest'
    : ((filters.m_orderby && filters.m_orderby.value) || 'views');
  var genres = chosen(filters, 'genre[]'), states = chosen(filters, 'status[]');
  var adult = (filters.adult && filters.adult.value) || '';
  var paging = page > 1 ? 'page/' + page + '/' : '';
  var url;
  if (genres.length || states.length || adult) {
    // With filters, the site's advanced search, exactly as its form sends it.
    url = SITE + paging + '?s=&post_type=wp-manga';
    genres.forEach(function (g) { url += '&genre%5B%5D=' + encodeURIComponent(g); });
    url += '&op=' + (filters.op && filters.op.value ? '1' : '');
    states.forEach(function (s) { url += '&status%5B%5D=' + encodeURIComponent(s); });
    url += '&adult=' + encodeURIComponent(adult) + '&m_orderby=' + order;
  } else {
    url = SITE + 'novels/' + paging + '?m_orderby=' + order;
  }
  return text(url).then(list);
};

Plugin.prototype.searchNovels = function (term, page) {
  return text(SITE + (page > 1 ? 'page/' + page + '/' : '') + '?s=' + encodeURIComponent(term) +
    '&post_type=wp-manga').then(list);
};

Plugin.prototype.parseNovel = function (novelPath) {
  var pageURL = absolute(novelPath).replace(/\/?$/, '/');
  return text(pageURL).then(function (html) {
    var $ = cheerio.load(html);
    $('.manga-title-badges').remove();
    var novel = {
      path: novelPath,
      name: $('.post-title h1').first().text().replace(/\s+/g, ' ').trim(),
      cover: cover($('.summary_image img').first()) || defaultCover,
      status: NovelStatus.Unknown,
      chapters: []
    };
    var authors = $('.author-content a').map(function () { return $(this).text().trim(); }).get()
      .filter(function (a) { return a && !/^n[.\/]?a$/i.test(a); });
    if (authors.length) novel.author = authors.join(', ');
    var artists = $('.artist-content a').map(function () { return $(this).text().trim(); }).get();
    if (artists.length) novel.artist = artists.join(', ');
    novel.genres = $('.genres-content a').map(function () { return $(this).text().trim(); }).get().join(',');

    var details = {};
    $('.post-content_item').each(function () {
      var label = $(this).find('.summary-heading h5').first().text().replace(/\s+/g, ' ').trim().toLowerCase();
      if (label) details[label] = $(this).find('.summary-content').first().text().replace(/\s+/g, ' ').trim();
    });
    novel.status = statusFrom(details['status'] || details['estado']);

    var excerpt = $('.manga-excerpt').first();
    excerpt.find('script, style, noscript').remove();
    var paragraphs = excerpt.find('p').map(function () { return $(this).text().trim(); }).get()
      .filter(Boolean);
    var summary = paragraphs.length ? paragraphs.join('\n') : excerpt.text().trim();
    var alternative = details['alternative'] || details['alternativo'];
    if (alternative) summary += (summary ? '\n\n' : '') + 'Otros títulos: ' + alternative;
    novel.summary = summary;

    var hideLocked = !!storage.get('hideLocked');
    return text(pageURL + 'ajax/chapters/', {
      method: 'POST', headers: { 'X-Requested-With': 'XMLHttpRequest' }
    }).then(function (chaptersHTML) {
      var c = cheerio.load(chaptersHTML || '');
      var base = relative(pageURL);
      var rows = [], numbered = 0, titled = 0;
      c('li.wp-manga-chapter').each(function () {
        var row = c(this);
        var link = row.find('a').first();
        var title = link.text().replace(/\s+/g, ' ').trim();
        if (!title) return;
        var href = link.attr('href') || '';
        var paid = /\bpremium\b/.test(row.attr('class') || '') || href === '#' || !href;
        if (!paid) {
          var last = relative(href).replace(/\/+$/, '').split('/').pop();
          if (last === byNumber(title)) numbered++;
          if (last === slug(title)) titled++;
        }
        rows.push({ title: title, href: href, paid: paid,
          date: row.find('.chapter-release-date').first().text().replace(/\s+/g, ' ').trim() });
      });
      var chapters = [];
      rows.forEach(function (row) {
        if (row.paid && hideLocked) return;
        var path;
        if (row.href && row.href !== '#') path = relative(row.href);
        else {
          var guess = (numbered >= titled && byNumber(row.title)) || slug(row.title);
          if (!guess) return;
          path = base + guess + '/';
        }
        chapters.push({
          name: row.paid ? '🔒 ' + row.title : row.title,
          path: path,
          releaseTime: row.date || undefined
        });
      });
      // The site lists them newest first.
      novel.chapters = chapters.reverse().map(function (chapter, index) {
        chapter.chapterNumber = index + 1;
        return chapter;
      });
      return novel;
    });
  });
};

Plugin.prototype.parseChapter = function (chapterPath) {
  return text(absolute(chapterPath)).then(function (html) {
    var $ = cheerio.load(html);
    var reading = $('.reading-content').first();
    // A coin chapter: the site only says it is locked. That goes back as is
    // —the app recognises it and tells the reader— and nothing else is tried.
    if (reading.find('.content-blocked, .premium-block').length) {
      return '<p>This chapter is locked.</p><p>🔒 Capítulo de pago en la web: se desbloquea allí, o cuando la web lo libere.</p>';
    }
    var body = reading.find('.text-left').first();
    if (!body.length) body = reading;
    body.find('input, script, style, noscript, ins, iframe, form, button, .adsbygoogle, .code-block').remove();
    body.find('img').each(function () {
      var image = $(this);
      var real = image.attr('data-src') || image.attr('data-lazy-src');
      if (real) image.attr('src', real);
      ['data-src', 'data-lazy-src', 'data-srcset', 'data-sizes', 'data-lazyloaded', 'srcset', 'sizes',
        'decoding', 'loading'].forEach(function (attribute) { image.removeAttr(attribute); });
      if (/^data:/.test(image.attr('src') || '')) image.remove();
    });
    var content = (body.html() || '').trim();
    return content ? '<div class="chapter-content">' + content + '</div>' : '';
  });
};

Plugin.prototype.resolveUrl = function (path) {
  return absolute(path);
};

exports.default = new Plugin();
