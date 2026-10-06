// Novela en Español (novelaenespanol.com) · Novel Sources
//
// An extension in the LNReader plugin format, written from scratch: there was
// no official one for this site. The site is a WordPress with the theme
// «ranobe-novels», where every novel is a category and its chapters are the
// posts of that category. The extension reads what the site itself serves:
//   - Popular, filters and search: the site's search page (/search/), which
//     carries the whole catalogue as a JSON array (title, author, cover,
//     likes, comments, date, finished flag) and sorts and filters it in the
//     browser; this extension applies the same sorting and filtering.
//   - Latest updates: the homepage section «Novelas más editables», the place
//     where novels with recent edits (new chapters) show up first.
//   - Novel: its page (/novela-ligera/<slug>/), and the chapter index the page
//     itself asks for (template-parts/category/chapters-query.php, the same
//     request its tab «Capítulos» makes).
//   - Chapter: the chapter page (/<novel>/novela-ligera/<chapter>/), the same
//     address the site's reader opens.
// Only public content is read: nothing that needs an account. The site has no
// paid chapters.
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

var fetchLib = require('@libs/fetch');
var FilterTypes = require('@libs/filterInputs').FilterTypes;
var NovelStatus = require('@libs/novelStatus').NovelStatus;
var defaultCover = require('@libs/defaultCover').defaultCover;
var storage = require('@libs/storage').storage;
var cheerio = require('cheerio');

var SITE = 'https://novelaenespanol.com/';
// The theme's own query endpoints, the ones its pages call.
var THEME = SITE + 'wp-content/themes/ranobe-novels/';
// The site's search page shows 20 novels per page; its tag archives, 10.
var PER_PAGE = 20;
// The catalogue page is ~750 KB: fetched once and kept in storage, reduced
// to the fields the extension uses, so lists, filters and searches do not
// pull it again for every page.
var CACHE_MINUTES = 15;

// The site's own tag list, as its tag select offers it (the theme's
// tags-select-query.php, checked 5/10/2026), without «Completed»/«Ongoing»:
// the status picker covers those two.
var TAGS = [
  ['Action', 'action'], ['Actualizar', 'actualizar'], ['Adult', 'adult'],
  ['Adventure', 'adventure'], ['Comedy', 'comedy'], ['Drama', 'drama'],
  ['Ecchi', 'ecchi'], ['Everyday Life', 'everyday-life'], ['Fan-Fiction', 'fan-fiction'],
  ['Fantasy', 'fantasy'], ['Game', 'game'], ['Harem', 'harem'], ['Historical', 'historical'],
  ['Horror', 'horror'], ['Humor', 'humor'], ['Josei', 'josei'], ['Martial Arts', 'martial-arts'],
  ['Mature', 'mature'], ['Mecha', 'mecha'], ['Mystery', 'mystery'], ['Mystic', 'mystic'],
  ['Mysticism', 'mysticism'], ['Novela Ligera', 'novela-ligera'], ['Psychological', 'psychological'],
  ['Psychology', 'psychology'], ['Ranobe', 'ranobe'], ['Romance', 'romance'],
  ['School Life', 'school-life'], ['Sci-fi', 'sci-fi'], ['Seinen', 'seinen'],
  ['Shoujo', 'shoujo'], ['Shounen', 'shounen'], ['Slice Of Life', 'slice-of-life'],
  ['Supernatural', 'supernatural'], ['Tragedy', 'tragedy'], ['Urban Life', 'urban-life'],
  ['Wuxia', 'wuxia'], ['Xianxia', 'xianxia'], ['Xuanhuan', 'xuanhuan'],
  ['Ранобэ', '%d1%80%d0%b0%d0%bd%d0%be%d0%b1%d1%8d']
];

function options(pairs) {
  return pairs.map(function (pair) { return { label: pair[0], value: pair[1] }; });
}

function absolute(path) {
  if (/^https?:\/\//i.test(path)) return path;
  return SITE + String(path || '').replace(/^\/+/, '');
}

function relative(url) {
  return String(url || '').replace(/^https?:\/\/(www\.)?novelaenespanol\.com\/?/i, '').replace(/^\/+/, '');
}

function text(url, init) {
  return fetchLib.fetchApi(url, init).then(function (response) { return response.text(); });
}

// The biggest picture the page offers. The site loads pictures through a lazy
// load plugin: the real address may sit in data-src / data-lazy-src.
function cover(img) {
  var url = img.attr('data-src') || img.attr('data-lazy-src') || img.attr('src') || '';
  return url && !/^data:/.test(url) ? absolute(url) : '';
}

// Titles and authors from the catalogue come with HTML entities (&#8217;, &amp;…).
function decode(value) {
  return String(value || '')
    .replace(/&#x([0-9a-f]+);/gi, function (_, hex) { return String.fromCharCode(parseInt(hex, 16)); })
    .replace(/&#(\d+);/g, function (_, dec) { return String.fromCharCode(parseInt(dec, 10)); })
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&hellip;/g, '…').replace(/&amp;/g, '&');
}

// Some titles carry the trailing tagline the site adds for search engines
// («… novela Español»): the same novel must keep the same name in the lists,
// the updates, the search and the novel page.
function cleanName(name) {
  var s = String(name || '').replace(/\s+/g, ' ').trim();
  var clean = s.replace(/\s*[-–—]?\s*novelas?(\s+ligera)?(\s+en)?\s+espa[ñn]ol\s*$/i, '').trim();
  return clean || s;
}

// The search page (/search/, ~750 KB) carries the whole catalogue as a JSON
// array in one of its scripts: the same data the site's own search sorts and
// filters in the browser. One request gives every list, search and filter of
// the site; it is kept in storage, reduced, with expiry.
function catalogue() {
  var cached = storage.get('catalogue');
  if (cached) return Promise.resolve(cached);
  return text(SITE + 'search/').then(function (html) {
    var marker = html.indexOf('let cat = ');
    var start = marker < 0 ? -1 : html.indexOf('[', marker);
    if (start < 0) throw new Error('La web cambió: no se encuentra el catálogo en la página de búsqueda');
    // The array ends at its own closing bracket: descriptions may hold «]»
    // inside strings, so it is scanned the way JavaScript would read it.
    var depth = 0, inString = false, escaped = false;
    for (var i = start; i < html.length; i++) {
      var ch = html[i];
      if (inString) {
        if (escaped) escaped = false;
        else if (ch === '\\') escaped = true;
        else if (ch === '"') inString = false;
      } else if (ch === '"') inString = true;
      else if (ch === '[') depth++;
      else if (ch === ']' && --depth === 0) {
        var entries;
        try {
          entries = JSON.parse(html.slice(start, i + 1));
        } catch (e) {
          throw new Error('La web cambió: el catálogo de la página de búsqueda no se pudo leer');
        }
        if (!Array.isArray(entries) || !entries.length) {
          throw new Error('La web cambió: el catálogo de la página de búsqueda está vacío');
        }
        // Only the fields the extension uses: the descriptions alone are
        // most of the page.
        entries = entries.map(function (entry) {
          return {
            title: entry.cat_title, link: entry.cat_link, img: entry.cat_img,
            author: entry.author, likes: entry.likes, comments: entry.comments,
            date: entry.cat_date, completed: entry.completed
          };
        });
        storage.set('catalogue', entries, Date.now() + CACHE_MINUTES * 60 * 1000);
        return entries;
      }
    }
    throw new Error('La web cambió: el catálogo de la página de búsqueda no se cierra');
  });
}

// Every novel is a category of the theme: the catalogue links to its first
// chapter (…/<slug>/novela-ligera/<chapter>/) and the novel itself lives at
// /novela-ligera/<slug>/.
function novelRow(entry) {
  var first = relative(entry.link).replace(/\/+$/, '').split('/');
  var path = first[1] === 'novela-ligera' ? 'novela-ligera/' + first[0] + '/' : '';
  var name = cleanName(decode(entry.title));
  if (!path || !name) return null;
  return { name: name, path: path, cover: entry.img ? absolute(entry.img) : defaultCover };
}

// The tag archive cards, like the site's own listing (10 per page).
function archiveList(html) {
  var $ = cheerio.load(html);
  var novels = [], seen = {};
  $('article.js-bookcard').each(function () {
    var card = $(this);
    var link = card.find('.category-title a').first();
    var path = relative(link.attr('href'));
    var name = cleanName(link.text());
    if (!name || !path || seen[path]) return;
    seen[path] = true;
    novels.push({ name: name, path: path, cover: cover(card.find('.category-img').first()) || defaultCover });
  });
  return novels;
}

// «Novelas más editables»: the homepage section of novels with recent edits,
// where new chapters show up first. The section repeats its cards for the
// mobile layout: each novel once.
function latest() {
  return text(SITE).then(function (html) {
    var $ = cheerio.load(html);
    var novels = [], seen = {};
    $('article.most-edited-card').each(function () {
      var card = $(this);
      var link = card.find('.card-title a').first();
      var path = relative(link.attr('href'));
      var name = cleanName(link.text());
      if (!name || !path || seen[path]) return;
      seen[path] = true;
      novels.push({ name: name, path: path, cover: cover(card.find('img').first()) || defaultCover });
    });
    return novels;
  });
}

// The chapter tab of a novel asks the theme for its posts (chapters-query.php,
// POST cat_id/limit/offset) and links each one as
// /<novel>/novela-ligera/<chapter>/. The site asks for 30 per page, and for
// 500 at once when searching inside a novel; one big request returns the
// whole index.
function chaptersOf(catId, catSlug, name) {
  return fetchLib.fetchApi(THEME + 'template-parts/category/chapters-query.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: 'cat_id=' + encodeURIComponent(catId) + '&limit=10000&offset=0'
  }).then(function (response) { return response.text(); }).then(function (raw) {
    var items;
    try {
      items = JSON.parse(raw);
    } catch (e) {
      throw new Error('La web cambió: el índice de capítulos no se pudo leer');
    }
    if (!Array.isArray(items) || !items.length) {
      throw new Error('La web cambió: el índice de capítulos no trae capítulos');
    }
    // Two entries of the raw list are not chapters and stay out of the
    // index: the novel's own post (its synopsis: the novel's name and the
    // novel's slug where a chapter name goes) and the author's afterword
    // («Epílogo: autor»).
    items = items.filter(function (item) {
      return String(item.post_name || '') !== catSlug &&
        !/^ep[íi]logo\s*:\s*autor\b/i.test(String(item.post_title || '').trim());
    });
    if (!items.length) throw new Error('La web cambió: el índice de capítulos no trae capítulos');
    // The site lists them newest first. The index carries no dates, only
    // ID, post_name and post_title.
    return items.slice().reverse().map(function (item, index) {
      var title = String(item.post_title || '').replace(/\s+/g, ' ').trim();
      // Most titles repeat the novel's name first: the reader already shows
      // it above the text.
      var plain = title;
      if (name && title.indexOf(name) === 0) plain = title.slice(name.length).replace(/^[\s:–—-]+/, '');
      var found = /cap[ií]tulo\s+(\d+(?:[.,]\d+)?)/i.exec(plain || title);
      return {
        name: plain || title || 'Capítulo ' + (index + 1),
        path: catSlug + '/novela-ligera/' + item.post_name + '/',
        releaseTime: item.post_date || undefined,
        chapterNumber: found ? parseFloat(found[1].replace(',', '.')) : undefined
      };
    });
  });
}

function Plugin() {
  this.id = 'novelaenespanol';
  this.name = 'Novela en Español';
  this.site = SITE;
  this.version = '1.0.0';
  this.icon = 'icons/novelaenespanol.png';
  // The site's own search page: three orders (its buttons «Por fecha», «Como
  // el» [por votos] and «Por comentarios») and a finished filter. Its «Nuevo»
  // filter (added in the last 30 days) is left out: the site has added no
  // novels since May 2024, so it only ever yields an empty list.
  this.filters = {
    orden: {
      type: FilterTypes.Picker, label: 'Ordenar por', value: 'byLikes',
      options: options([['Más votadas', 'byLikes'], ['Por fecha', 'byDate'], ['Más comentadas', 'byComments']])
    },
    estado: {
      type: FilterTypes.Picker, label: 'Estado', value: '',
      options: options([['Todo', ''], ['En curso', '0'], ['Concluido', '1']])
    },
    etiqueta: {
      type: FilterTypes.Picker, label: 'Etiqueta (ignora orden y estado)', value: '',
      options: options([['Todo', '']]).concat(options(TAGS))
    }
  };
}

Plugin.prototype.popularNovels = function (page, opts) {
  var filters = (opts && opts.filters) || this.filters;
  if (opts && opts.showLatestNovels) {
    // The homepage section is the only page of updates the site has.
    return page > 1 ? Promise.resolve([]) : latest();
  }
  var tag = (filters.etiqueta && filters.etiqueta.value) || '';
  if (tag) {
    // With a tag, the site's own tag archive, exactly as its select opens
    // it: the web opens that archive alone, without sorting or filtering
    // it, so the order and the estado filter only work without a tag.
    var paging = page > 1 ? 'page/' + page + '/' : '';
    return text(SITE + 'novelas-ligeras/' + tag + '/' + paging).then(function (html) {
      var novels = archiveList(html);
      if (!novels.length && page === 1) {
        throw new Error('La web cambió: el archivo de la etiqueta «' + tag + '» no trae novelas');
      }
      return novels;
    });
  }
  var order = (filters.orden && filters.orden.value) || 'byLikes';
  var estado = (filters.estado && filters.estado.value) || '';
  return catalogue().then(function (entries) {
    entries = entries.filter(function (entry) {
      return !estado || String(entry.completed) === estado;
    });
    var by = {
      byLikes: function (a, b) { return (parseInt(b.likes, 10) || 0) - (parseInt(a.likes, 10) || 0); },
      byDate: function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); },
      byComments: function (a, b) { return (parseInt(b.comments, 10) || 0) - (parseInt(a.comments, 10) || 0); }
    }[order];
    if (by) entries = entries.slice().sort(by);
    return entries.slice((page - 1) * PER_PAGE, page * PER_PAGE)
      .map(novelRow).filter(Boolean);
  });
};

// The site's own search: it filters the catalogue by title or author, in any
// capitalisation.
Plugin.prototype.searchNovels = function (term, page) {
  var wanted = decode(term).toUpperCase().replace(/\s+/g, ' ').trim();
  return catalogue().then(function (entries) {
    return entries.filter(function (entry) {
      var title = cleanName(decode(entry.title)).toUpperCase().replace(/\s+/g, ' ');
      var author = decode(entry.author).toUpperCase().replace(/\s+/g, ' ');
      return (wanted && (title.indexOf(wanted) !== -1 || author.indexOf(wanted) !== -1)) || !wanted;
    }).slice((page - 1) * PER_PAGE, page * PER_PAGE)
      .map(novelRow).filter(Boolean);
  });
};

Plugin.prototype.parseNovel = function (novelPath) {
  return text(absolute(novelPath)).then(function (html) {
    var $ = cheerio.load(html);
    var card = $('article.category-card').first();
    if (!card.length) throw new Error('La web cambió: no se encuentra la ficha de la obra');
    var name = cleanName(card.find('.category-title a').first().text());
    var novel = {
      path: novelPath,
      name: name,
      cover: cover(card.find('.category-img').first()) || defaultCover,
      status: card.find('.cat-status .completed').length ? NovelStatus.Completed
        : card.find('.cat-status .ongoing').length ? NovelStatus.Ongoing : NovelStatus.Unknown,
      chapters: []
    };
    var author = card.find('.cat-author [itemprop="creator"]').first().text().replace(/\s+/g, ' ').trim();
    if (author) novel.author = author;
    var genres = card.find('.post_tags a').map(function () {
      return $(this).text().replace(/\s+/g, ' ').trim();
    }).get().filter(Boolean);
    if (genres.length) novel.genres = genres.join(',');

    // The full description, not the excerpt the page shows collapsed.
    var description = card.find('.category-exerpt.hidden.description').first();
    description.find('br').replaceWith('\n');
    novel.summary = description.find('p').map(function () {
      var paragraph = $(this).text().replace(/\s+/g, ' ').trim();
      // Labels the site leaves empty: «Nombres asociados», «Autor (es)».
      return paragraph === 'Nombres asociados' || paragraph === 'Autor (es)' ? '' : paragraph;
    }).get().filter(Boolean).join('\n');

    var data = $('.js-cat-data').first();
    var catId = data.attr('data-category');
    var catSlug = data.attr('data-slug');
    if (!catId || !catSlug) throw new Error('La web cambió: falta el identificador interno de la obra');
    return chaptersOf(catId, catSlug, name).then(function (chapters) {
      novel.chapters = chapters;
      return novel;
    });
  });
};

Plugin.prototype.parseChapter = function (chapterPath) {
  return text(absolute(chapterPath)).then(function (html) {
    var $ = cheerio.load(html);
    var body = $('.entry-content .js-full-content').first();
    if (!body.length) throw new Error('La web cambió: no se encuentra el texto del capítulo');
    body.find('script, style, noscript, iframe, form, button, input, ins, .adsbygoogle').remove();
    // Headers the site wraps the text in for search engines: the chapter
    // title above, «Leer … en Español» and the title again below.
    body.find('h2, h3, h6').each(function () {
      var header = $(this);
      if (/novela\s*(ligera|en espa)|^leer\b/i.test(header.text())) header.remove();
    });
    body.find('img').each(function () {
      var image = $(this);
      var real = image.attr('data-src') || image.attr('data-lazy-src');
      if (real) image.attr('src', real);
      ['data-src', 'data-lazy-src', 'data-srcset', 'data-sizes', 'data-lazyloaded', 'srcset', 'sizes',
        'decoding', 'loading'].forEach(function (attribute) { image.removeAttr(attribute); });
      if (/^data:/.test(image.attr('src') || '')) image.remove();
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
