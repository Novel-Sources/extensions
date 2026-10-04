// AnimesHoy12 · versión corregida (repositorio Novel-Sources/extensions)
//
// Parte 1: la extensión oficial de LNReader, versión 2.2.0, sin tocar
// (github.com/LNReader/lnreader-plugins; licencia MIT, © 2021 Rajarshee
// Chatterjee; texto completo en LICENSE-LNReader.txt).
// Parte 2: mudanza a Anslid Novels (anslid.com), filtros, y capítulos de pago
// marcados con 🔒 que el lector puede ocultar.
var t=this&&this.__awaiter||function(t,e,a,r){return new(a||(a=Promise))((function(n,i){function s(t){try{c(r.next(t))}catch(t){i(t)}}function o(t){try{c(r.throw(t))}catch(t){i(t)}}function c(t){var e;t.done?n(t.value):(e=t.value,e instanceof a?e:new a((function(t){t(e)}))).then(s,o)}c((r=r.apply(t,e||[])).next())}))},e=this&&this.__generator||function(t,e){var a,r,n,i={label:0,sent:function(){if(1&n[0])throw n[1];return n[1]},trys:[],ops:[]},s=Object.create(("function"==typeof Iterator?Iterator:Object).prototype);return s.next=o(0),s.throw=o(1),s.return=o(2),"function"==typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s;function o(o){return function(c){return function(o){if(a)throw new TypeError("Generator is already executing.");for(;s&&(s=0,o[0]&&(i=0)),i;)try{if(a=1,r&&(n=2&o[0]?r.return:o[0]?r.throw||((n=r.return)&&n.call(r),0):r.next)&&!(n=n.call(r,o[1])).done)return n;switch(r=0,n&&(o=[2&o[0],n.value]),o[0]){case 0:case 1:n=o;break;case 4:return i.label++,{value:o[1],done:!1};case 5:i.label++,r=o[1],o=[0];continue;case 7:o=i.ops.pop(),i.trys.pop();continue;default:if(!(n=i.trys,(n=n.length>0&&n[n.length-1])||6!==o[0]&&2!==o[0])){i=0;continue}if(3===o[0]&&(!n||o[1]>n[0]&&o[1]<n[3])){i.label=o[1];break}if(6===o[0]&&i.label<n[1]){i.label=n[1],n=o;break}if(n&&i.label<n[2]){i.label=n[2],i.ops.push(o);break}n[2]&&i.ops.pop(),i.trys.pop();continue}o=e.call(t,i)}catch(t){o=[6,t],r=0}finally{a=n=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,c])}}},a=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.MadaraPlugin=void 0;var r=require("@libs/fetch"),n=require("cheerio"),i=require("@libs/defaultCover"),s=require("@libs/novelStatus"),o=a(require("dayjs")),c=require("@libs/storage"),u=function(t,e){return new RegExp(e.join("|")).test(t)},l=function(){function a(t){var e,a;this.hideLocked=c.storage.get("hideLocked"),this.parseData=function(t){var e,a=(0,o.default)(),r=(null===(e=t.match(/\d+/))||void 0===e?void 0:e[0])||"",n=parseInt(r,10);if(!r)return t;if(u(t,["detik","segundo","second","วินาที"]))a=a.subtract(n,"second");else if(u(t,["menit","dakika","min","minute","minuto","นาที","دقائق"]))a=a.subtract(n,"minute");else if(u(t,["jam","saat","heure","hora","hour","ชั่วโมง","giờ","ore","ساعة","小时"]))a=a.subtract(n,"hours");else if(u(t,["hari","gün","jour","día","dia","day","วัน","ngày","giorni","أيام","天"]))a=a.subtract(n,"days");else if(u(t,["week","semana"]))a=a.subtract(n,"week");else if(u(t,["month","mes"]))a=a.subtract(n,"month");else{if(!u(t,["year","año"]))return"Invalid Date"!==(0,o.default)(t).format("LL")?(0,o.default)(t).format("LL"):t;a=a.subtract(n,"year")}return a.format("LL")},this.id=t.id,this.name=t.sourceName,this.icon="multisrc/madara/".concat(t.id.toLowerCase(),"/icon.png"),this.site=t.sourceSite;var r=(null===(e=t.options)||void 0===e?void 0:e.versionIncrements)||0;this.version="2.2.".concat(r),this.options=t.options,this.filters=t.filters,(null===(a=this.options)||void 0===a?void 0:a.hasLocked)&&(this.pluginSettings={hideLocked:{value:"",label:"Hide locked chapters",type:"Switch"}})}return a.prototype.translateDragontea=function(t){var e;if("dragontea"!==this.id)return t;var a=(0,n.load)((null===(e=t.html())||void 0===e?void 0:e.replace("\n","").replace(/<br\s*\/?>/g,"\n"))||"");return t.html(a.html()),t.find("*").addBack().contents().filter((function(t,e){return 3===e.nodeType})).each((function(t,e){var r=a(e),n=r.text().normalize("NFD").split("").map((function(t){var e=t.normalize("NFC"),a="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(e);return a>=0?"zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA"[a]+t.slice(e.length):t})).join("");r.replaceWith(n.replace("\n","<br>"))})),t},a.prototype.getHostname=function(t){var e=(t=t.split("/")[2]).split(".");return e.pop(),e.join(".")},a.prototype.getCheerio=function(a,i){return t(this,void 0,void 0,(function(){var t,s,o,c;return e(this,(function(e){switch(e.label){case 0:return[4,(0,r.fetchApi)(a)];case 1:if(!(t=e.sent()).ok&&1!=i)throw new Error("Could not reach site ("+t.status+") try to open in webview.");return o=n.load,[4,t.text()];case 2:if(s=o.apply(void 0,[e.sent()]),c=s("title").text().trim(),this.getHostname(a)!=this.getHostname(t.url)||"Bot Verification"==c||"You are being redirected..."==c||"Un instant..."==c||"Just a moment..."==c||"Redirecting..."==c)throw new Error("Captcha error, please open in webview");return[2,s]}}))}))},a.prototype.parseNovels=function(t){var e=[];return t(".manga-title-badges").remove(),t(".page-item-detail, .c-tabs-item__content").each((function(a,r){var n=t(r).find(".post-title").text().trim(),s=t(r).find(".post-title").find("a").attr("href")||"";if(n&&s){var o=t(r).find("img"),c={name:n,cover:o.attr("data-src")||o.attr("src")||o.attr("data-lazy-srcset")||i.defaultCover,path:s.replace(/https?:\/\/.*?\//,"")};e.push(c)}})),e},a.prototype.popularNovels=function(a,r){return t(this,arguments,void 0,(function(t,a){var r,n,i,s,o,c,u=a.filters,l=a.showLatestNovels;return e(this,(function(e){switch(e.label){case 0:for(n in r=this.site+"/page/"+t+"/?s=&post_type=wp-manga",u||(u=this.filters||{}),l&&(r+="&m_orderby=latest"),u)if("object"==typeof u[n].value)for(i=0,s=u[n].value;i<s.length;i++)o=s[i],r+="&".concat(n,"=").concat(o);else u[n].value&&(r+="&".concat(n,"=").concat(u[n].value));return[4,this.getCheerio(r,1!=t)];case 1:return c=e.sent(),[2,this.parseNovels(c)]}}))}))},a.prototype.parseNovel=function(a){return t(this,void 0,void 0,(function(){var t,c,u,l,h,p,m,d,f,g,v,b,y,x,w,_,k=this;return e(this,(function(e){switch(e.label){case 0:return[4,this.getCheerio(this.site+a,!1)];case 1:return(t=e.sent())(".manga-title-badges, #manga-title span").remove(),(c={path:a,name:t(".post-title h1").text().trim()||t("#manga-title h1").text().trim()||t(".manga-title").text().trim()||""}).cover=t(".summary_image > a > img").attr("data-lazy-src")||t(".summary_image > a > img").attr("data-src")||t(".summary_image > a > img").attr("src")||i.defaultCover,t(".post-content_item, .post-content").each((function(){var e=t(this).find("h5").text().trim(),a=t(this).find(".summary-content")||t(this).find(".summary_content");switch(e){case"Genre(s)":case"Genre":case"Tags(s)":case"Tag(s)":case"Tags":case"Género(s)":case"Kategori":case"التصنيفات":c.genres?c.genres+=", "+a.find("a").map((function(e,a){return t(a).text()})).get().join(", "):c.genres=a.find("a").map((function(e,a){return t(a).text()})).get().join(", ");break;case"Author(s)":case"Author":case"Autor(es)":case"المؤلف":case"المؤلف (ين)":c.author=a.text().trim();break;case"Translator(s)":case"Translator":case"Translators":c.author||(c.author=a.text().trim());break;case"Status":case"Novel":case"Estado":case"Durum":c.status=a.text().trim().includes("OnGoing")||a.text().trim().includes("مستمرة")?s.NovelStatus.Ongoing:s.NovelStatus.Completed;break;case"Artist(s)":c.artist=a.text().trim()}})),c.genres||(c.genres=t(".genres-content").text().trim()),c.status||(c.status=t(".manga-status").text().trim().includes("OnGoing")?s.NovelStatus.Ongoing:s.NovelStatus.Completed),c.author||(c.author=t(".manga-author a").text().trim()),c.rating||(c.rating=parseFloat(t(".post-rating span").text().trim())),c.author||(c.author=t(".manga-authors").text().trim()),t("div.summary__content .code-block,script,noscript").remove(),c.summary=this.translateDragontea(t("div.summary__content")).text().trim()||t("#tab-manga-about").text().trim()||t('.post-content_item h5:contains("Summary")').next().find("span").map((function(e,a){return t(a).text()})).get().join("\n\n").trim()||t('.post-content_item h5:contains("Summary")').next().find("p").map((function(e,a){return t(a).text()})).get().join("\n\n").trim()||t(".manga-summary p").map((function(e,a){return t(a).text()})).get().join("\n\n").trim()||t(".manga-excerpt p").map((function(e,a){return t(a).text()})).get().join("\n\n").trim(),u=[],l="",(null===(_=this.options)||void 0===_?void 0:_.useNewChapterEndpoint)?[4,(0,r.fetchApi)(this.site+a+"ajax/chapters/",{method:"POST",referrer:this.site+a}).then((function(t){return t.text()}))]:[3,7];case 2:if(l=e.sent(),h=(0,n.load)(l),!((p=h(".pagination a[data-page]")).length>0))return[3,6];if(m=Math.max.apply(Math,p.map((function(t,e){return parseInt(h(e).attr("data-page")||"1",10)})).get()),d=p.last().attr("href")||"",-1===(f=d.indexOf("?")))return[3,6];g=d.slice(f).replace(/\d+$/,""),v=2,e.label=3;case 3:return v<=m?[4,(0,r.fetchApi)(this.site+a+"ajax/chapters/"+g+v,{method:"POST",referrer:this.site+a}).then((function(t){return t.text()}))]:[3,6];case 4:(b=e.sent())&&"0"!==b&&(l+=b),e.label=5;case 5:return v++,[3,3];case 6:return[3,9];case 7:return y=t(".rating-post-id").attr("value")||t("#manga-chapters-holder").attr("data-id")||"",(x=new FormData).append("action","manga_get_chapters"),x.append("manga",y),[4,(0,r.fetchApi)(this.site+"wp-admin/admin-ajax.php",{method:"POST",body:x}).then((function(t){return t.text()}))];case 8:l=e.sent(),e.label=9;case 9:return"0"!==l&&(t=(0,n.load)(l)),w=t(".wp-manga-chapter").length,t(".wp-manga-chapter").each((function(e,a){var r=t(a).find("a").text().trim(),n=a.attribs.class.includes("premium-block");n&&(r="🔒 "+r);var i=t(a).find("span.chapter-release-date").text().trim();i=i?k.parseData(i):(0,o.default)().format("LL");var s=t(a).find("a").attr("href")||"";!s||"#"==s||n&&k.hideLocked||u.push({name:r,path:s.replace(/https?:\/\/.*?\//,""),releaseTime:i||null,chapterNumber:w-e})})),c.chapters=u.reverse(),[2,c]}}))}))},a.prototype.parseChapter=function(a){return t(this,void 0,void 0,(function(){var t,r,n;return e(this,(function(e){switch(e.label){case 0:return[4,this.getCheerio(this.site+a,!1)];case 1:return t=e.sent(),r=t(".text-left")||t(".text-right")||t(".entry-content")||t(".c-blog-post > div > div:nth-child(2)"),null===(n=this.options)||void 0===n||n.customJs,[2,this.translateDragontea(r).html()||""]}}))}))},a.prototype.searchNovels=function(a,r){return t(this,void 0,void 0,(function(){var t,n;return e(this,(function(e){switch(e.label){case 0:return t=this.site+"/page/"+r+"/?s="+encodeURIComponent(a)+"&post_type=wp-manga",[4,this.getCheerio(t,!0)];case 1:return n=e.sent(),[2,this.parseNovels(n)]}}))}))},a}();exports.MadaraPlugin=l;var h=new l({id:"AnimesHoy12",sourceSite:"https://animeshoy12.com/",sourceName:"AnimesHoy12",options:{lang:"Spanish",down:!0,downSince:1768289212951}});exports.default=h;

// ===== Parte 2 · Corrección (Novel-Sources/extensions) =====
;(function () {
  var plugin = exports.default;
  // El módulo, no la función: el motor conecta la red justo antes de cada operación.
  var fetchLib = require('@libs/fetch');
  var FilterTypes = require('@libs/filterInputs').FilterTypes;
  var NovelStatus = require('@libs/novelStatus').NovelStatus;
  var storage = require('@libs/storage').storage;
  var cheerio = require('cheerio');

  // La web se mudó de animeshoy12.com a anslid.com y se llama Anslid Novels.
  var SITE = 'https://anslid.com/';
  plugin.site = SITE;
  plugin.name = 'Anslid Novels';
  plugin.version = '2.2.1';

  // Los capítulos de pago se cobran con monedas en la web. Se listan con 🔒
  // —en la app no se abren: dicen que son de pago— y quien prefiera no
  // verlos puede ocultarlos. Cuando la web los libera, el mismo capítulo
  // vuelve sin candado: su dirección no cambia.
  plugin.pluginSettings = {
    hideLocked: { value: '', label: 'Ocultar capítulos de pago', type: FilterTypes.Switch }
  };

  var GENRES = [
    ['Acción', 'accion'], ['Artes marciales', 'artes-marciales'], ['Aventura', 'aventura'],
    ['Divertido', 'divertido'], ['Drama', 'drama'], ['Ecchi', 'ecchi'], ['Isekai', 'isekai'],
    ['Lucha', 'lucha'], ['Reencarnación', 'reencarnacion'], ['Regresión', 'regresion'],
    ['Retornado', 'retornado'], ['Romance', 'romance'], ['Seinen', 'seinen'],
    ['Vida escolar', 'vida-escolar'], ['Wuxia', 'wuxia']
  ];
  function options(pairs) { return pairs.map(function (p) { return { label: p[0], value: p[1] }; }); }

  // Los mismos que la web: el orden de su lista y su búsqueda avanzada.
  plugin.filters = {
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
    }
  };

  function absolute(path) {
    return /^https?:\/\//i.test(path) ? path : SITE + String(path || '').replace(/^\/+/, '');
  }
  function relative(url) {
    return String(url || '').replace(/^https?:\/\/[^\/]+\/?/i, '');
  }
  function text(url) {
    return fetchLib.fetchApi(url).then(function (response) { return response.text(); });
  }

  // Como hace WordPress con el título: «Capítulo 1974» → «capitulo-1974». Es
  // la dirección que tendrá el capítulo de pago cuando se libere (comprobado
  // con los 1.610 capítulos gratis de una obra, 4/10/2026).
  var ACCENTS = new RegExp('[\\u0300-\\u036f]', 'g');
  function slug(value) {
    var s = String(value || '').toLowerCase();
    if (typeof s.normalize === 'function') s = s.normalize('NFD').replace(ACCENTS, '');
    return s.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  // La portada más grande que ofrece la página, no la miniatura.
  function cover($, img) {
    var best = '', width = 0;
    String(img.attr('data-srcset') || img.attr('srcset') || '').split(',').forEach(function (entry) {
      var parts = entry.trim().split(/\s+/);
      var w = parseInt(parts[1], 10) || 0;
      if (parts[0] && w > width) { best = parts[0]; width = w; }
    });
    var url = best || img.attr('data-src') || img.attr('data-lazy-src') || img.attr('src') || '';
    return /dflazy|^data:/.test(url) ? '' : url;
  }

  function list(html) {
    var $ = cheerio.load(html);
    var novels = [];
    $('.page-item-detail, .c-tabs-item__content').each(function () {
      var item = $(this);
      var link = item.find('.post-title a').first();
      var name = link.text().trim();
      var path = relative(link.attr('href'));
      if (!name || !path) return;
      novels.push({ name: name, path: path, cover: cover($, item.find('img').first()) || undefined });
    });
    return novels;
  }

  function chosen(filters, key) {
    var value = filters && filters[key] && filters[key].value;
    return Array.isArray(value) ? value : [];
  }

  plugin.popularNovels = function (page, opts) {
    var filters = (opts && opts.filters) || plugin.filters;
    var order = (opts && opts.showLatestNovels) ? 'latest'
      : ((filters.m_orderby && filters.m_orderby.value) || 'views');
    var genres = chosen(filters, 'genre[]'), states = chosen(filters, 'status[]');
    var url;
    if (genres.length || states.length) {
      // Con filtros, la búsqueda avanzada de la web.
      url = SITE + (page > 1 ? 'page/' + page + '/' : '') + '?s=&post_type=wp-manga';
      genres.forEach(function (g) { url += '&genre%5B%5D=' + encodeURIComponent(g); });
      url += '&op=' + (filters.op && filters.op.value ? '1' : '');
      states.forEach(function (s) { url += '&status%5B%5D=' + encodeURIComponent(s); });
      url += '&m_orderby=' + order;
    } else {
      url = SITE + 'novela/' + (page > 1 ? 'page/' + page + '/' : '') + '?m_orderby=' + order;
    }
    return text(url).then(list);
  };

  plugin.searchNovels = function (term, page) {
    return text(SITE + (page > 1 ? 'page/' + page + '/' : '') + '?s=' + encodeURIComponent(term) +
      '&post_type=wp-manga').then(list);
  };

  function statusFrom(value) {
    var s = String(value || '').toLowerCase();
    if (/ongoing|emisi|curso/.test(s)) return NovelStatus.Ongoing;
    if (/complet|finaliz|end/.test(s)) return NovelStatus.Completed;
    if (/cancel/.test(s)) return NovelStatus.Cancelled;
    if (/hold|pausa|hiatus/.test(s)) return NovelStatus.OnHiatus;
    return NovelStatus.Unknown;
  }

  // La sinopsis empieza con un anuncio de la tienda de puntos y su vídeo.
  var PROMO = /comprar puntos|desbloquear m[aá]s cap|mira este video|como comprar puntos/i;

  function summaryFrom($) {
    var box = $('.summary__content').first();
    box.find('script, style, noscript, video, audio, iframe, .wp-playlist, .code-block').remove();
    var blocks = 'p, div, li, h1, h2, h3, h4, h5, h6';
    // Fuera el anuncio: el bloque más pequeño que lo contiene.
    box.find(blocks).each(function () {
      var el = $(this);
      if (!el.find(blocks).length && PROMO.test(el.text())) el.remove();
    });
    box.find('br').replaceWith('\n');
    box.find(blocks).each(function () { $(this).append('\n'); });
    return box.text().split('\n')
      .map(function (line) { return line.replace(/[ \t\u00a0]+/g, ' ').trim(); })
      .filter(function (line) { return line && !PROMO.test(line); })
      .join('\n');
  }

  plugin.parseNovel = function (novelPath) {
    var pageURL = absolute(novelPath);
    return text(pageURL).then(function (html) {
      var $ = cheerio.load(html);
      $('.manga-title-badges').remove();
      var novel = {
        path: novelPath,
        name: $('.post-title h1').first().text().trim(),
        cover: cover($, $('.summary_image img').first()) || undefined,
        summary: summaryFrom($),
        status: NovelStatus.Unknown,
        chapters: []
      };
      var authors = $('.author-content a').map(function () { return $(this).text().trim(); }).get()
        .filter(function (a) { return a && !/^n[.\/]?a$/i.test(a); });
      if (authors.length) novel.author = authors.join(', ');
      novel.genres = $('.genres-content a').map(function () { return $(this).text().trim(); }).get().join(',');
      $('.post-content_item').each(function () {
        if (/^(status|estado)$/i.test($(this).find('h5').text().trim())) {
          novel.status = statusFrom($(this).find('.summary-content').text());
        }
      });

      var hideLocked = !!storage.get('hideLocked');
      return fetchLib.fetchApi(pageURL.replace(/\/?$/, '/') + 'ajax/chapters/', {
        method: 'POST', headers: { 'X-Requested-With': 'XMLHttpRequest' }
      })
        .then(function (response) { return response.text(); })
        .then(function (chaptersHTML) {
          var c = cheerio.load(chaptersHTML || '');
          var base = relative(pageURL).replace(/\/?$/, '/');
          var rows = [];
          c('li.wp-manga-chapter').each(function () {
            var row = c(this);
            var link = row.find('a').first();
            var title = link.text().replace(/\s+/g, ' ').trim();
            if (!title) return;
            var paid = /\bpremium\b/.test(row.attr('class') || '');
            if (paid && hideLocked) return;
            var href = link.attr('href') || '';
            // Los de pago no traen enlace: el suyo sale del título.
            var path = href && href !== '#' ? relative(href) : base + slug(title) + '/';
            rows.push({
              name: paid ? '🔒 ' + title : title,
              path: path,
              releaseTime: row.find('.chapter-release-date').first().text().trim() || undefined
            });
          });
          // La web lista del último al primero.
          novel.chapters = rows.reverse().map(function (chapter, index) {
            chapter.chapterNumber = index + 1;
            return chapter;
          });
          return novel;
        });
    });
  };

  plugin.parseChapter = function (chapterPath) {
    return text(absolute(chapterPath)).then(function (html) {
      var $ = cheerio.load(html);
      var reading = $('.reading-content').first();
      // De pago: la web sólo dice que está bloqueado. Se devuelve eso tal
      // cual —la app lo reconoce y avisa—; no se intenta nada más.
      if (reading.find('.content-blocked, .premium-block').length) {
        return '<p>This chapter is locked.</p><p>🔒 Capítulo de pago en la web: se desbloquea allí, o cuando la web lo libere.</p>';
      }
      var body = reading.find('.text-left').first();
      if (!body.length) body = reading;
      body.find('input, script, style, noscript, ins, iframe, .adsbygoogle, .code-block').remove();
      var content = (body.html() || '').trim();
      return content ? '<div class="chapter-content">' + content + '</div>' : '';
    });
  };

  plugin.resolveUrl = function (path) { return absolute(path); };
})();
