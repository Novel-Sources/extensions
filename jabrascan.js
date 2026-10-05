// JabraScan (jabrascan.net) · Novel Sources
//
// An extension in the LNReader plugin format, written from scratch: there was
// no official one for this site. JabraScan is not WordPress: its pages build
// themselves from a few public files, and this extension reads those same
// files instead of the pages:
//   - Library, filters and search: the site's catalogue API (obras/carrousel),
//     one request for every work, with its latest chapter.
//   - Novel: the catalogue file (obras.xml) and the work's chapter list
//     (books/<work>.json).
//   - Chapter: a PDF exported from Word, on the site or in JabraScan's own
//     GitHub repository, exactly where the site's reader opens it. The app
//     turns it into paragraphs.
// Chapters the site schedules for a later date stay hidden until that day,
// as on the site.
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

var fetchLib = require('@libs/fetch');
var FilterTypes = require('@libs/filterInputs').FilterTypes;
var NovelStatus = require('@libs/novelStatus').NovelStatus;
var defaultCover = require('@libs/defaultCover').defaultCover;

var SITE = 'https://jabrascan.net/';
// Where the site's reader opens most PDFs (js/lectorpdfmod.js).
var PDFS = 'https://raw.githubusercontent.com/JabraScan/JabraScan.github.io-pdfs/main/books/';
// The works the site's reader opens from the site itself, not from GitHub.
var LOCAL = ['CDMNQTMHC', 'CultivationOnline', 'DualCultivation', 'PathtoDualCultivation'];

// The site writes the same genre in several ways (Acción, Accion, Acció…):
// each option covers all of them.
var GENRES = [
  ['Academia', ['academia']], ['Acción', ['accion', 'accio']], ['Adulto', ['adulto', 'adultos', 'adult', 'r18', 'sexo']],
  ['Artes marciales', ['artes marciales', 'murim']], ['Aventura', ['aventura']], ['Comedia', ['comedia', 'parodia', 'rom-com']],
  ['Cultivo', ['cultivo', 'xuanhuan', 'wuxia']], ['Drama', ['drama']], ['Ecchi', ['ecchi']],
  ['Escolar', ['escolar', 'vida escolar', 'romance escolar']], ['Fantasía', ['fantasia']],
  ['Harén', ['harem', 'haren']], ['Isekai', ['isekai']], ['Maduro', ['maduro']], ['Magia', ['magia']],
  ['Misterio', ['misterio']], ['Psicológico', ['psicologico']], ['Recuentos de la vida', ['recuentos de vida', 'recuentos de la vida', 'iyashikei']],
  ['Reencarnación', ['reencarnacion', 'renacimiento', 'transmigracion', 'regresion']], ['Romance', ['romance', 'romanc']],
  ['Sistema', ['sistema']], ['Sobrenatural', ['sobrenatural', 'superpoderes', 'vampiros']], ['Tragedia', ['tragedia']],
  ['Videojuegos', ['realidad virtual', 'videojuegos (vrmmorpg)', 'videojuegos']]
];

var ORIGINS = [['Corea', 'coreana'], ['Japón', 'japonesa'], ['China', 'china'], ['Inglés', 'inglesa'], ['Estados Unidos', 'usa']];

function options(pairs) {
  return pairs.map(function (pair) { return { label: pair[0], value: typeof pair[1] === 'string' ? pair[1] : pair[0] }; });
}

var ACCENTS = new RegExp('[\\u0300-\\u036f]', 'g');
function plain(value) {
  var s = String(value == null ? '' : value).toLowerCase().trim();
  if (typeof s.normalize === 'function') s = s.normalize('NFD').replace(ACCENTS, '');
  return s.replace(/\s+/g, ' ');
}

function absolute(path) {
  if (/^https?:\/\//i.test(path)) return path;
  return SITE + String(path || '').replace(/^\/+/, '');
}

function text(url) {
  return fetchLib.fetchApi(url).then(function (response) {
    if (response.ok === false) throw new Error('http:' + response.status);
    return response.text();
  });
}

function json(url) {
  return text(url).then(function (body) { return JSON.parse(body); });
}

// A work's key goes into addresses: only letters, digits, «_» and «-».
function validKey(key) {
  return /^[A-Za-z0-9_-]+$/.test(String(key || ''));
}

function cover(images) {
  var list = Array.isArray(images) ? images : [images];
  var first = String(list.filter(Boolean)[0] || '').trim();
  if (!first || /^https?:/i.test(first) || first.indexOf('..') !== -1) return defaultCover;
  // Like the site: images inside a folder have resized copies; 600 px wide.
  if (first.indexOf('/') !== -1) return SITE + 'img/' + first.replace(/\.(jpe?g|png|webp)$/i, '') + '-600w.webp';
  return SITE + 'img/' + first;
}

function catalogue() {
  return json(SITE + 'obras/carrousel').then(function (works) {
    return (Array.isArray(works) ? works : []).filter(function (work) {
      return work && plain(work.visible) === 'si' && validKey(work.obra_id);
    });
  });
}

// obras.xml, read by hand: a handful of flat tags per work.
function cdata(value) {
  return String(value || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
}
function entities(value) {
  return String(value || '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&');
}
function tags(block, name) {
  var found = [], re = new RegExp('<' + name + '>([\\s\\S]*?)</' + name + '>', 'g'), m;
  while ((m = re.exec(block))) found.push(entities(cdata(m[1])).trim());
  return found;
}
function tag(block, name) { return tags(block, name)[0] || ''; }

function xmlWorks(xml) {
  var works = {};
  String(xml || '').split('<obra>').slice(1).forEach(function (block) {
    var key = tag(block, 'clave');
    if (validKey(key)) works[key] = block;
  });
  return works;
}

function genresOf(value) {
  return String(value || '').split(',').map(function (g) { return g.trim(); }).filter(Boolean);
}

function matchesGenre(genres, wanted) {
  var names = genres.map(plain);
  return wanted.some(function (label) {
    var entry = GENRES.filter(function (g) { return g[0] === label; })[0];
    var aliases = entry ? entry[1] : [plain(label)];
    return names.some(function (name) { return aliases.indexOf(name) !== -1; });
  });
}

function originOf(value) {
  var s = plain(value);
  for (var i = 0; i < ORIGINS.length; i++) if (s.indexOf(ORIGINS[i][1]) !== -1) return ORIGINS[i][1];
  return '';
}

function chosen(filters, key) {
  var value = filters && filters[key] && filters[key].value;
  return Array.isArray(value) ? value : [];
}

function row(work) {
  return { name: String(work.nombreobra || work.obra_id).trim(), path: '#' + work.obra_id, cover: cover(work.imagen) };
}

function Plugin() {
  this.id = 'jabrascan';
  this.name = 'JabraScan';
  this.site = SITE;
  this.version = '1.0.0';
  this.icon = 'icons/jabrascan.png';
  this.filters = {
    orden: {
      type: FilterTypes.Picker, label: 'Ordenar por', value: 'latest',
      options: options([['Últimos capítulos', 'latest'], ['Mejor valoradas', 'rating'], ['Nuevas en la web', 'new'], ['A — Z', 'az']])
    },
    genero: { type: FilterTypes.CheckboxGroup, label: 'Género', value: [], options: options(GENRES.map(function (g) { return [g[0], g[0]]; })) },
    estado: {
      type: FilterTypes.CheckboxGroup, label: 'Estado', value: [],
      options: options([['En curso', 'activo'], ['Finalizada', 'finalizado'], ['En pausa', 'pausado']])
    },
    origen: { type: FilterTypes.CheckboxGroup, label: 'Origen', value: [], options: options(ORIGINS) },
    adulto: {
      type: FilterTypes.Picker, label: 'Contenido adulto', value: '',
      options: options([['Todo', ''], ['Sin contenido adulto', 'no'], ['Sólo contenido adulto', 'si']])
    }
  };
}

Plugin.prototype.popularNovels = function (page, opts) {
  // The whole catalogue fits in one page.
  if (page > 1) return Promise.resolve([]);
  var filters = (opts && opts.filters) || this.filters;
  var order = (opts && opts.showLatestNovels) ? 'latest' : ((filters.orden && filters.orden.value) || 'latest');
  var genres = chosen(filters, 'genero'), states = chosen(filters, 'estado'), origins = chosen(filters, 'origen');
  var adult = (filters.adulto && filters.adulto.value) || '';
  // The API leaves out the genres of some works: with a genre filter, they
  // come from obras.xml.
  var categories = genres.length ? text(SITE + 'obras.xml').then(xmlWorks) : Promise.resolve(null);
  return Promise.all([catalogue(), categories]).then(function (both) {
    var works = both[0], xml = both[1];
    works = works.filter(function (work) {
      if (states.length && states.indexOf(plain(work.estado)) === -1) return false;
      if (origins.length && origins.indexOf(originOf(work.ubicacion)) === -1) return false;
      var isAdult = plain(work.adulto) === 'adulto';
      if (adult === 'si' && !isAdult) return false;
      if (adult === 'no' && isAdult) return false;
      if (genres.length) {
        var listed = genresOf(work.Categorias);
        if (!listed.length && xml && xml[work.obra_id]) listed = genresOf(tag(xml[work.obra_id], 'categoria'));
        if (!matchesGenre(listed, genres)) return false;
      }
      return true;
    });
    var by = {
      latest: function (a, b) { return String(b.UltimoCapFecha || '').localeCompare(String(a.UltimoCapFecha || '')); },
      rating: function (a, b) { return (parseFloat(b.valoracion) || 0) - (parseFloat(a.valoracion) || 0); },
      'new': function (a, b) { return String(b.fechaCreacion || '').localeCompare(String(a.fechaCreacion || '')); },
      az: function (a, b) { return plain(a.nombreobra).localeCompare(plain(b.nombreobra)); }
    }[order] || null;
    if (by) works = works.slice().sort(by);
    return works.map(row);
  });
};

Plugin.prototype.searchNovels = function (term, page) {
  if (page > 1) return Promise.resolve([]);
  var wanted = plain(term);
  return catalogue().then(function (works) {
    return works.filter(function (work) {
      var names = [work.nombreobra, work.autor].concat(Array.isArray(work.nombresAlternativos) ? work.nombresAlternativos : []);
      return names.some(function (name) { return plain(name).indexOf(wanted) !== -1; });
    }).map(row);
  });
};

function statusFrom(value) {
  var s = plain(value);
  if (/activ|curso/.test(s)) return NovelStatus.Ongoing;
  if (/finaliz|complet/.test(s)) return NovelStatus.Completed;
  if (/paus/.test(s)) return NovelStatus.OnHiatus;
  if (/cancel/.test(s)) return NovelStatus.Cancelled;
  return NovelStatus.Unknown;
}

// «04-10-2026» (and, just in case, «2026-10-04»), as a date at midnight.
function day(value) {
  var m = /^(\d{1,2})-(\d{1,2})-(\d{4})/.exec(String(value || '').trim());
  if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
  m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(String(value || '').trim());
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  return null;
}
function iso(date) {
  function two(n) { return (n < 10 ? '0' : '') + n; }
  return date.getFullYear() + '-' + two(date.getMonth() + 1) + '-' + two(date.getDate());
}

// The volume or arc a chapter belongs to, from its «tituloObra»: «Shadow
// Slave Vol 07» → «Vol 07», «Arco del Cambio (Otonari…)» → «Arco del Cambio».
// Nothing when it is just the work's name.
function volumeOf(title, names) {
  var t = String(title || '').replace(/\s*\([^)]*\)\s*$/, '').trim();
  if (!t) return '';
  var p = plain(t);
  for (var i = 0; i < names.length; i++) {
    var n = plain(names[i]);
    if (!n) continue;
    if (p === n) return '';
    if (p.indexOf(n + ' ') === 0) return t.slice(names[i].trim().length).replace(/^[\s:·,-]+/, '').trim();
  }
  return t;
}

// «Vol 07·El Borde», «v03.29·Terminando…», «a2c7 - El ángel…»: the leading
// code repeats the volume, which already groups the chapter.
function chapterTitle(name) {
  var s = String(name || '').trim();
  var dot = s.indexOf('·');
  if (dot > 0 && dot <= 12 && /\d/.test(s.slice(0, dot))) s = s.slice(dot + 1).trim();
  return s.replace(/^a\d+c\d+\s*-\s*/i, '').trim();
}

Plugin.prototype.parseNovel = function (novelPath) {
  var key = String(novelPath || '').replace(/^#/, '').split('/')[0];
  if (!validKey(key)) return Promise.reject(new Error('Obra desconocida: ' + novelPath));
  return Promise.all([text(SITE + 'obras.xml'), json(SITE + 'books/' + key + '.json')]).then(function (both) {
    var block = xmlWorks(both[0])[key] || '';
    var names = tags(block, 'nombreobra').filter(Boolean);
    var novel = {
      path: '#' + key,
      name: names[0] || key,
      cover: cover(tags(block, 'imagen')),
      author: tag(block, 'autor') || undefined,
      status: statusFrom(tag(block, 'estado')),
      chapters: []
    };
    var genres = genresOf(tag(block, 'categoria'));
    if (plain(tag(block, 'adulto')) === 'adulto' && !matchesGenre(genres, ['Adulto'])) genres.push('Adulto');
    novel.genres = genres.join(',');

    var synopsis = tag(block, 'sinopsis').split('\n').map(function (line) { return line.replace(/\s+/g, ' ').trim(); })
      .filter(Boolean).join('\n');
    var info = [];
    if (names.length > 1) info.push('Otros títulos: ' + names.slice(1).join(' · '));
    if (tag(block, 'ubicacion')) info.push('Origen: ' + tag(block, 'ubicacion'));
    if (tag(block, 'traductor')) info.push('Traducción: ' + tag(block, 'traductor'));
    novel.summary = [synopsis, info.join('\n')].filter(Boolean).join('\n\n');

    var server = tag(block, 'server');
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var list = (both[1] && Array.isArray(both[1][key])) ? both[1][key] : [];
    var chapters = [];
    list.forEach(function (chapter, index) {
      if (!chapter || !chapter.NombreArchivo || chapter.numCapitulo == null) return;
      var date = day(chapter.Fecha);
      // Scheduled for later: the site does not show it yet, nor does this.
      if (!date || date > today) return;
      var number = chapter.numCapitulo;
      // Like the site's reader: from chapter 1000 on, the folder carries the thousands.
      var folder = key + (number > 999 ? String(number).slice(0, -3) : '');
      var file = encodeURIComponent(String(chapter.NombreArchivo));
      var where = chapter.server || server || (LOCAL.indexOf(key) !== -1 ? 'local' : 'io-pdfs');
      var path = where === 'local' ? 'books/' + folder + '/' + file : PDFS + folder + '/' + file;
      var volume = volumeOf(chapter.tituloObra, names);
      var title = chapterTitle(chapter.nombreCapitulo);
      chapters.push({
        name: (volume ? '[' + volume + '] ' : '') + 'Capítulo ' + String(number).trim() + (title ? ': ' + title : ''),
        path: path,
        releaseTime: iso(date),
        chapterNumber: parseFloat(String(number).replace(/[^0-9.]/g, '')) || undefined,
        order: index
      });
    });
    chapters.sort(function (a, b) {
      return ((a.chapterNumber || 0) - (b.chapterNumber || 0)) || (a.order - b.order);
    });
    novel.chapters = chapters.map(function (chapter) { delete chapter.order; return chapter; });
    return novel;
  });
};

Plugin.prototype.parseChapter = function (chapterPath) {
  // The app hands over the PDF already as paragraphs (<h2>, <p>).
  return text(absolute(chapterPath)).then(function (html) {
    var body = String(html || '').trim();
    if (!/^<(h2|p)>/.test(body)) throw new Error('El capítulo no es un PDF legible');
    return '<div class="chapter-content">' + body + '</div>';
  });
};

Plugin.prototype.resolveUrl = function (path) {
  return absolute(path);
};

exports.default = new Plugin();
