// Pabellón Literario (pabellonliterario.com) · Novel Sources
//
// An extension in the LNReader plugin format, written from scratch: there was
// no official one for this site. It uses what the site itself uses, so every
// filter behaves exactly as on the web:
//   - Library, search and filters: the site's own library request
//     (admin-ajax.php, action ph_fetch_library).
//   - Latest updates: the newest chapters from the site's public API, grouped
//     by novel, newest first.
//   - Novel and chapter: the public (cached) pages, so the site's cache serves
//     them instead of running WordPress for every reader.
// Only public content is read: nothing that needs an account.
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

var fetchLib = require('@libs/fetch');
var FilterTypes = require('@libs/filterInputs').FilterTypes;
var NovelStatus = require('@libs/novelStatus').NovelStatus;
var defaultCover = require('@libs/defaultCover').defaultCover;
var cheerio = require('cheerio');

var SITE = 'https://pabellonliterario.com/';

// Every genre the site uses, not only the ones its filter panel shows: its
// library request accepts all of them (checked 4/10/2026).
var GENRES = [
  ['Acción', 'accion'], ['Artes marciales', 'artes_marciales'], ['Aventura', 'aventura'],
  ['Boys Love', 'boys_love'], ['Ciencia ficción', 'ciencia_ficcion'], ['Comedia', 'comedia'],
  ['Cultivación', 'cultivacion'], ['Danmei', 'danmei'], ['Drama', 'drama'], ['Escolar', 'escolar'],
  ['Fantasía', 'fantasia'], ['Harem', 'harem'], ['Harem inverso', 'harem_inverso'],
  ['Histórico', 'historico'], ['Mecha', 'mecha'], ['Misterio', 'misterio'],
  ['Omegaverse', 'omegaverse'], ['Psicológico', 'psicologico'], ['Recuentos de la vida', 'slice_life'],
  ['Reencarnación', 'reencarnacion'], ['Romance', 'romance'], ['Sobrenatural', 'supernatural'],
  ['Terror', 'terror'], ['Tragedia', 'tragedia'], ['Transmigración', 'transmigracion'],
  ['Transmigración rápida', 'transmigracion_rapida'], ['Wuxia', 'wuxia'], ['Xianxia', 'xianxia'],
  ['Xuanhuan', 'xuanhuan']
];

var FILTER_KEYS = ['genero', 'estado_trad', 'idioma', 'clasificacion'];

function options(pairs) {
  return pairs.map(function (pair) { return { label: pair[0], value: pair[1] }; });
}

function absolute(path) {
  if (/^https?:\/\//i.test(path)) return path;
  return SITE + String(path || '').replace(/^\/+/, '');
}

function relative(url) {
  return String(url || '').replace(/^https?:\/\/(www\.)?pabellonliterario\.com\/?/i, '').replace(/^\/+/, '');
}

function form(fields) {
  return Object.keys(fields).map(function (key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(fields[key]);
  }).join('&');
}

// Titles from the API come with HTML entities (&#8220;, &amp;…).
function decode(text) {
  return String(text || '')
    .replace(/&#x([0-9a-f]+);/gi, function (_, hex) { return String.fromCharCode(parseInt(hex, 16)); })
    .replace(/&#(\d+);/g, function (_, dec) { return String.fromCharCode(parseInt(dec, 10)); })
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&hellip;/g, '…').replace(/&amp;/g, '&')
    .trim();
}

function prettyGenre(raw) {
  var key = String(raw || '').trim().toLowerCase();
  if (typeof key.normalize === 'function') key = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  key = key.replace(/[\s-]+/g, '_');
  for (var i = 0; i < GENRES.length; i++) {
    if (GENRES[i][1] === key) return GENRES[i][0];
  }
  return String(raw || '').trim();
}

function chosenFilters(filters) {
  var chosen = {};
  FILTER_KEYS.forEach(function (key) {
    var value = filters && filters[key] && filters[key].value;
    if (value && value.length) chosen[key] = value.slice();
  });
  return chosen;
}

/// The site's library: search, order, page and filters in one request.
function library(search, sort, page, filters) {
  var body = form({
    action: 'ph_fetch_library',
    s: search || '',
    sort: sort,
    paged: String(page),
    filters: JSON.stringify(chosenFilters(filters))
  });
  return fetchLib.fetchApi(SITE + 'wp-admin/admin-ajax.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: body
  })
    .then(function (response) { return response.json(); })
    .then(function (json) {
      var data = json && json.success && json.data;
      if (!data || (data.total_pages && page > data.total_pages)) return [];
      var $ = cheerio.load(data.html_grid || '');
      var novels = [];
      $('a.ph-lib-card').each(function () {
        var card = $(this);
        var path = relative(card.attr('href'));
        var name = card.find('.ph-lib-card-title').first().text().trim() ||
          card.find('.ph-lib-overlay-title').first().text().trim();
        var image = card.find('img').first();
        var cover = image.attr('data-src') || image.attr('src') || '';
        if (!path || !name) return;
        novels.push({ name: name, path: path, cover: cover && !/^data:/.test(cover) ? absolute(cover) : defaultCover });
      });
      return novels;
    });
}

/// Latest updates: the newest chapters, one entry per novel, newest first.
function latest(page) {
  var chaptersURL = SITE + 'wp-json/wp/v2/capitulo?per_page=100&page=' + page +
    '&orderby=date&order=desc&_fields=pl_novela_id';
  return fetchLib.fetchApi(chaptersURL)
    .then(function (response) { return response.json(); })
    .then(function (chapters) {
      if (!Array.isArray(chapters)) return [];
      var ids = [];
      chapters.forEach(function (chapter) {
        var id = chapter && chapter.pl_novela_id ? String(chapter.pl_novela_id) : '';
        if (/^\d+$/.test(id) && ids.indexOf(id) < 0) ids.push(id);
      });
      if (!ids.length) return [];
      var novelsURL = SITE + 'wp-json/wp/v2/novela?include=' + ids.join(',') +
        '&per_page=100&orderby=include&_embed=wp:featuredmedia&_fields=id,link,title,_links,_embedded';
      return fetchLib.fetchApi(novelsURL)
        .then(function (response) { return response.json(); })
        .then(function (novels) {
          if (!Array.isArray(novels)) return [];
          return novels.map(function (novel) {
            var media = novel._embedded && novel._embedded['wp:featuredmedia'] && novel._embedded['wp:featuredmedia'][0];
            var sizes = (media && media.media_details && media.media_details.sizes) || {};
            var cover = (sizes.medium_large || sizes.large || {}).source_url || (media && media.source_url);
            return {
              name: decode(novel.title && novel.title.rendered),
              path: relative(novel.link),
              cover: cover || defaultCover
            };
          }).filter(function (novel) { return novel.name && novel.path; });
        });
    });
}

function statusFrom(translation) {
  var text = String(translation || '').toLowerCase();
  if (/finaliz|complet/.test(text)) return NovelStatus.Completed;
  if (/pausa/.test(text)) return NovelStatus.OnHiatus;
  if (/cancel|abandon/.test(text)) return NovelStatus.Cancelled;
  if (/traducci|curso|emisi|publicaci|pr[oó]ximamente/.test(text)) return NovelStatus.Ongoing;
  return NovelStatus.Unknown;
}

function Plugin() {
  this.id = 'pabellonliterario';
  this.name = 'Pabellón Literario';
  this.site = SITE;
  this.version = '1.0.0';
  this.icon = 'icons/pabellonliterario.png';
  this.filters = {
    orden: {
      type: FilterTypes.Picker, label: 'Ordenar por', value: 'views_desc',
      options: options([['Más leídas', 'views_desc'], ['Más recientes', 'date_desc'], ['A — Z', 'title_asc']])
    },
    genero: { type: FilterTypes.CheckboxGroup, label: 'Género', value: [], options: options(GENRES) },
    estado_trad: {
      type: FilterTypes.CheckboxGroup, label: 'Traducción', value: [],
      options: options([['En traducción', 'en_traduccion'], ['Completada', 'finalizada_traduccion'],
        ['Pausada', 'pausada_traduccion'], ['Próximamente', 'proximamente']])
    },
    idioma: {
      type: FilterTypes.CheckboxGroup, label: 'Idioma original', value: [],
      options: options([['Chino', 'chino'], ['Coreano', 'coreano'], ['Japonés', 'japones'], ['Otro', 'otro']])
    },
    clasificacion: {
      type: FilterTypes.CheckboxGroup, label: 'Clasificación', value: [],
      options: options([['General', 'general'], ['+13', '13'], ['+16', '16'], ['+18', '18']])
    }
  };
}

Plugin.prototype.popularNovels = function (page, options) {
  if (options && options.showLatestNovels) return latest(page);
  var filters = (options && options.filters) || this.filters;
  var sort = (filters.orden && filters.orden.value) || 'views_desc';
  return library('', sort, page, filters);
};

Plugin.prototype.searchNovels = function (term, page) {
  return library(term, 'views_desc', page, {});
};

Plugin.prototype.parseNovel = function (novelPath) {
  return fetchLib.fetchApi(absolute(novelPath))
    .then(function (response) { return response.text(); })
    .then(function (html) {
      var $ = cheerio.load(html);
      var cover = $('img.ph-cover').first();
      var coverURL = cover.attr('data-src') || cover.attr('src') || '';
      var novel = {
        path: novelPath,
        name: $('h1.ph-title').first().text().trim() || decode($('title').first().text().split('–')[0]),
        cover: coverURL && !/^data:/.test(coverURL) ? absolute(coverURL) : defaultCover,
        author: $('.ph-author').first().text().replace(/^\s*por\s+/i, '').trim(),
        genres: $('.ph-tags').first().text().split('·').map(prettyGenre).filter(Boolean).join(','),
        status: NovelStatus.Unknown,
        chapters: []
      };

      // «Idioma», «Clasificación», «Traducción», «Capítulos».
      var details = {};
      $('.ph-details-grid > div').each(function () {
        var label = $(this).find('.ph-label').first().text().trim();
        if (!label) return;
        details[label.toLowerCase()] = $(this).text().replace(label, '').replace(/\s+/g, ' ').trim();
      });
      novel.status = statusFrom(details['traducción'] || details['traduccion']);

      var summary = $('.ph-summary').first();
      summary.find('br').replaceWith('\n');
      var info = [];
      if (details['idioma']) info.push('Idioma original: ' + details['idioma'].replace(/^[^\wÀ-ÿ]+/, ''));
      if (details['clasificación']) {
        var rating = details['clasificación'];
        info.push('Clasificación: ' + (/^\d+$/.test(rating) ? '+' + rating : rating));
      }
      if (details['traducción']) info.push('Traducción: ' + details['traducción']);
      if (details['capítulos']) info.push('Capítulos: ' + details['capítulos']);
      var warning = $('.ph-content-warning .ph-warning-pill').first().text().replace(/\s+/g, ' ').trim();
      // «🔞 Contiene: Mayores 18 · Violencia» o «🛡 Contenido seguro · General».
      warning = warning.replace(/^[^\wÀ-ÿ]+/, '');
      if (warning) info.push(/^contiene\s*:/i.test(warning) ? warning.replace(/^contiene\s*:\s*/i, 'Advertencias: ') : warning);
      novel.summary = [summary.text().trim(), info.join('\n')].filter(Boolean).join('\n\n');

      // The list appears twice on the page (list and index drawer): each
      // chapter once, in the site's order. The arc goes in brackets, which is
      // how readers group chapters into volumes.
      var seen = {};
      $('li.ph-chapter-row').each(function () {
        var row = $(this);
        var link = row.find('a.ph-chapter-data').first();
        var path = relative(link.attr('href'));
        if (!path || seen[path]) return;
        seen[path] = true;
        var title = row.find('.ph-chapter-title').first().text().replace(/\s+/g, ' ').trim();
        var arc = row.find('.ph-chapter-arc').first().text()
          .replace(/✦/g, '').replace(/\s*\|\s*/g, ' · ').replace(/[\[\]]/g, '').replace(/\s+/g, ' ').trim();
        var number = parseInt(row.find('.ph-chapter-number').first().text(), 10);
        novel.chapters.push({
          name: (arc ? '[' + arc + '] ' : '') + (title || ('Capítulo ' + (novel.chapters.length + 1))),
          path: path,
          releaseTime: row.find('.ph-chapter-time > span').first().text().trim() || undefined,
          chapterNumber: isNaN(number) ? novel.chapters.length + 1 : number
        });
      });
      return novel;
    });
};

/// If the page ever stops having the reader's layout, the text comes from the
/// public API instead.
function chapterFromAPI(chapterPath) {
  var slug = String(chapterPath).replace(/\/+$/, '').split('/').pop();
  return fetchLib.fetchApi(SITE + 'wp-json/wp/v2/capitulo?slug=' + encodeURIComponent(slug) + '&_fields=content')
    .then(function (response) { return response.json(); })
    .then(function (found) {
      return (Array.isArray(found) && found[0] && found[0].content && found[0].content.rendered) || '';
    });
}

Plugin.prototype.parseChapter = function (chapterPath) {
  return fetchLib.fetchApi(absolute(chapterPath))
    .then(function (response) { return response.text(); })
    .then(function (html) {
      var $ = cheerio.load(html);
      var body = $('.phlr2-body').first();
      if (!body.length) return chapterFromAPI(chapterPath);
      // Each paragraph carries a comments button (✦): not part of the text.
      body.find('button, script, style, noscript, form').remove();
      body.find('img').each(function () {
        var image = $(this);
        var real = image.attr('data-src') || image.attr('data-lazy-src');
        if (real) image.attr('src', real);
        ['data-src', 'data-lazy-src', 'data-srcset', 'data-sizes', 'data-lazyloaded', 'srcset', 'sizes',
          'decoding', 'loading'].forEach(function (attribute) { image.removeAttr(attribute); });
        if (/^data:/.test(image.attr('src') || '')) image.remove();
      });
      body.find('p').each(function () {
        var paragraph = $(this);
        if (!paragraph.text().trim() && !paragraph.find('img').length) paragraph.remove();
      });
      // One section per paragraph (for the site's comments): the paragraphs
      // go out together, in one block, as readers expect a chapter.
      body.find('section.phlr2-p').each(function () {
        var section = $(this);
        section.replaceWith(section.html() || '');
      });
      var content = (body.html() || '').trim();
      return content ? '<div class="chapter-content">' + content + '</div>' : chapterFromAPI(chapterPath);
    });
};

Plugin.prototype.resolveUrl = function (path) {
  return absolute(path);
};

exports.default = new Plugin();
