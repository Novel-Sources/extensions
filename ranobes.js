// Ranobes · versión corregida (repositorio Novel-Sources/extensions)
//
// Parte 1: la extensión oficial de LNReader, versión 2.0.2, sin tocar
// (github.com/LNReader/lnreader-plugins; licencia MIT, © 2021 Rajarshee
// Chatterjee; texto completo en LICENSE-LNReader.txt).
// Parte 2: catálogo, filtros, búsqueda e índice DLE con JSON y páginas canónicas; pausa entre peticiones.
var e=this&&this.__assign||function(){return e=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var s in t=arguments[r])Object.prototype.hasOwnProperty.call(t,s)&&(e[s]=t[s]);return e},e.apply(this,arguments)},t=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))((function(s,a){function i(e){try{c(n.next(e))}catch(e){a(e)}}function o(e){try{c(n.throw(e))}catch(e){a(e)}}function c(e){var t;e.done?s(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(i,o)}c((n=n.apply(e,t||[])).next())}))},r=this&&this.__generator||function(e,t){var r,n,s,a={label:0,sent:function(){if(1&s[0])throw s[1];return s[1]},trys:[],ops:[]},i=Object.create(("function"==typeof Iterator?Iterator:Object).prototype);return i.next=o(0),i.throw=o(1),i.return=o(2),"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function o(o){return function(c){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;i&&(i=0,o[0]&&(a=0)),a;)try{if(r=1,n&&(s=2&o[0]?n.return:o[0]?n.throw||((s=n.return)&&s.call(n),0):n.next)&&!(s=s.call(n,o[1])).done)return s;switch(n=0,s&&(o=[2&o[0],s.value]),o[0]){case 0:case 1:s=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,n=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(s=a.trys,(s=s.length>0&&s[s.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!s||o[1]>s[0]&&o[1]<s[3])){a.label=o[1];break}if(6===o[0]&&a.label<s[1]){a.label=s[1],s=o;break}if(s&&a.label<s[2]){a.label=s[2],a.ops.push(o);break}s[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],n=0}finally{r=s=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,c])}}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.RanobesPlugin=void 0;var n=require("htmlparser2"),s=require("@libs/fetch"),a=require("@libs/novelStatus"),i=function(){function i(e){var t=this;this.parseDate=function(e){var r=new Date;if(!e)return r.toISOString();if("ranobes-ru"===t.id){if(e.includes(" в "))return e.replace(" в "," г., ");var n=e.split(", "),s=n[0],a=n[1];if(!a)return r.toISOString();var i=a.split(":"),o=i[0],c=i[1];switch(s){case"Сегодня":r.setHours(parseInt(o,10)),r.setMinutes(parseInt(c,10));break;case"Вчера":r.setDate(r.getDate()-1),r.setHours(parseInt(o,10)),r.setMinutes(parseInt(c,10));break;default:return r.toISOString()}}else{var l=e.split(" "),u=l[0],p=l[1];if("ago"!==l[2])return r.toISOString();switch(p){case"minutes":r.setMinutes(parseInt(u,10));break;case"hour":case"hours":r.setHours(parseInt(u,10));break;case"day":case"days":r.setDate(r.getDate()-parseInt(u,10));break;case"month":case"months":r.setMonth(r.getMonth()-parseInt(u,10));break;case"year":case"years":r.setFullYear(r.getFullYear()-parseInt(u,10));break;default:return r.toISOString()}}return r.toISOString()},this.id=e.id,this.name=e.sourceName,this.icon="multisrc/ranobes/ranobes/icon.png",this.site=e.sourceSite,this.version="2.0.2",this.options=e.options}return i.prototype.safeFecth=function(e,n){return t(this,void 0,void 0,(function(){var t,a,i,o,c;return r(this,(function(r){switch(r.label){case 0:return[4,(0,s.fetchApi)(e,n)];case 1:if(!(t=r.sent()).ok)throw new Error("Could not reach site ("+t.status+") try to open in webview.");return[4,t.text()];case 2:if(a=r.sent(),(i=null===(c=null===(o=a.match(/<title>(.*?)<\/title>/))||void 0===o?void 0:o[1])||void 0===c?void 0:c.trim())&&("Bot Verification"==i||"You are being redirected..."==i||"Un instant..."==i||"Just a moment..."==i||"Redirecting..."==i))throw new Error("Captcha error, please open in webview");return[2,a]}}))}))},i.prototype.parseNovels=function(e){var t=[],r={name:""},s=this.site,a=!1,i=!1,o=!1,c=new n.Parser({onopentag:function(e,n){var c,l;(null===(c=n.class)||void 0===c?void 0:c.includes("short-cont"))&&(a=!0),a&&("h2"===e&&(null===(l=n.class)||void 0===l?void 0:l.includes("title"))&&(i=!0),i&&"a"===e&&(r.path=n.href.slice(s.length),o=!0),"figure"===e&&(r.cover=n.style.replace(/.*url\((.*?)\)./g,"$1")),r.path&&r.cover&&(t.push(r),(r={}).name=""))},ontext:function(e){o&&(r.name+=e)},onclosetag:function(e){"h2"===e&&(o=!1,i=!1),"figure"===e&&(a=!1)}});return c.write(e),c.end(),t},i.prototype.parseChapters=function(e){var t=this,r=[];return e.chapters.map((function(e){r.push({name:e.title,releaseTime:new Date(e.date).toISOString(),path:e.link.slice(t.site.length)})})),r.reverse()},i.prototype.popularNovels=function(e){return t(this,void 0,void 0,(function(){var t,n;return r(this,(function(r){switch(r.label){case 0:return t="".concat(this.site,"/").concat(this.options.path,"/page/").concat(e,"/"),[4,this.safeFecth(t)];case 1:return n=r.sent(),[2,this.parseNovels(n)]}}))}))},i.prototype.parseNovel=function(s){return t(this,void 0,void 0,(function(){var t,i,o,c,l,u,p,h,f,d,v,g,b,m,w,y,S,x,O,_;return r(this,(function(r){switch(r.label){case 0:return t=this.site,[4,this.safeFecth(t+s)];case 1:return i=r.sent(),o={path:s,name:"",summary:"",chapters:[],totalPages:1},c=!1,l=!1,u=!1,p=!1,h=!1,f=!1,d=!1,v=!1,g=!1,b=!1,m=!1,w=[],y=[],S={},x=0,O=this.parseDate,(_=new n.Parser({onopentag:function(e,r){"poster"===r.class&&(c=!0),c&&"img"===e&&(o.name=r.alt,o.cover=t+r.src),("div"===e&&"moreless cont-text showcont-h"===r.class||"cont-text showcont-h"===r.class&&"description"===r.itemprop)&&(u=!0),"li"===e&&r.title&&(r.title.includes("Original status")||r.title.includes("Статус оригинала"))&&(p=!0),"a"===e&&"chapter"===r.rel&&(g=!0,S.path=r.href.replace(t,"")),g&&"span"===e&&"title ellipses"===r.class&&(b=!0),g&&"span"===e&&"grey"===r.class&&(m=!0),"li"!==e||"Glossary + illustrations + division of chapters, etc."!=r.title&&"Глоссарий + иллюстраций + разделение глав и т.д."!==r.title||(v=!0)},onopentagname:function(e){u&&"br"===e&&(o.summary+="\n"),p&&"a"===e&&(h=!0),f&&"a"===e&&(d=!0)},onattribute:function(e,t){"itemprop"===e&&"creator"===t&&(l=!0),"id"===e&&"mc-fs-genre"===t&&(f=!0)},ontext:function(e){if(l&&(o.author=e),u&&(o.summary+=e.trim()),h&&(o.status="Ongoing"===e||"В процессе"==e?a.NovelStatus.Ongoing:a.NovelStatus.Completed),d&&w.push(e),v){var t=e.replace(/\D/g,"");t&&(x=parseInt(t,10))}g&&(b&&(S.name=e.trim()),m&&(S.releaseTime=O(e.trim())))},onclosetag:function(t){"a"===t&&(c=!1,l=!1,h=!1,d=!1,p=!1),"div"===t&&(u=!1,f=!1),"li"===t&&(v=!1),"a"===t&&(g=!1,S.name&&(y.push(e(e({},S),{page:"1"})),S={})),"span"===t&&(b&&(b=!1),m&&(m=!1))}})).write(i),_.end(),o.genres=w.join(", "),o.totalPages=Math.ceil((x||1)/25),o.chapters=y,o.chapters[0].path&&(o.latestChapter=o.chapters[0]),[2,o]}}))}))},i.prototype.parsePage=function(e,s){return t(this,void 0,void 0,(function(){var t,a,i,o,c,l,u,p,h,f,d,v,g,b;return r(this,(function(r){switch(r.label){case 0:return t="ranobes"==this.id?e.split("-")[0]:"/"+e.split("-").slice(1).join("-").split(".")[0],a=this.site+"/chapters"+t.replace(this.options.path+"/",""),[4,this.safeFecth(a+"/page/"+s)];case 1:return i=r.sent(),o=this.site,c=!1,l=!1,u=!1,p=!1,h=[],f={},d=this.parseDate,v={pages_count:"",chapters:[]},(g=new n.Parser({onopentag:function(e,t){"div"===e&&"cat_block cat_line"===t.class&&(l=!0),l&&"a"===e&&t.title&&t.href&&(f.name=t.title,f.path=t.href.replace(o,"")),"span"===e&&"grey small"===t.class&&(u=!0),"small"===e&&u&&(p=!0)},ontext:function(e){p&&(f.releaseTime=d(e.trim())),c&&e.includes("window.__DATA__ =")&&(v=JSON.parse(e.replace("window.__DATA__ =","")))},onclosetag:function(e){"a"===e&&f.name&&(h.push(f),f={}),"div"===e&&(l=!1),"span"===e&&(u=!1),"small"===e&&(p=!1),"main"===e&&(c=!0),"script"===e&&(c=!1)}})).write(i),g.end(),(null===(b=v.chapters)||void 0===b?void 0:b.length)&&(h=this.parseChapters(v)),[2,{chapters:h}]}}))}))},i.prototype.parseChapter=function(e){return t(this,void 0,void 0,(function(){var t,n,s;return r(this,(function(r){switch(r.label){case 0:return[4,this.safeFecth(this.site+e)];case 1:return t=r.sent(),n=t.indexOf('<div class="text" id="arrticle">'),s=t.indexOf('<div class="category grey ellipses">',n),[2,t.substring(n,s)]}}))}))},i.prototype.searchNovels=function(e,n){return t(this,void 0,void 0,(function(){var t,s;return r(this,(function(r){switch(r.label){case 0:return"ranobes-ru"!==this.id?[3,2]:[4,this.safeFecth(this.site+"/index.php?do=search",{headers:{"Content-Type":"application/x-www-form-urlencoded",Referer:this.site+"/"},method:"POST",body:new URLSearchParams({do:"search",subaction:"search",search_start:n.toString(),story:e}).toString()})];case 1:return t=r.sent(),[3,4];case 2:return s="".concat(this.site,"/search/").concat(e,"/page/").concat(n),[4,this.safeFecth(s)];case 3:t=r.sent(),r.label=4;case 4:return[2,this.parseNovels(t)]}}))}))},i}();exports.RanobesPlugin=i;var o=new i({id:"ranobes",sourceSite:"https://ranobes.top",sourceName:"Ranobes",options:{lang:"English",path:"novels"}});exports.default=o;

// ===== Parte 2 · Corrección (Novel-Sources/extensions) =====
(function () {

    var plugin = exports.default;
    var cheerio = require('cheerio');
    function cheerioLib() { return cheerio; }
    function squash(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
    function plainLabel(value) { return squash(cheerio.load('<span>' + String(value || '') + '</span>')('span').text()); }
    function plainLength(value) { return plainLabel(value).length; }
    function siteOf(self) { return String(self.site || '').replace(/\/+$/, ''); }
    function pathKey(value) { return String(value || '').replace(/^https?:\/\/[^/]+/i, '').replace(/\/+$/, ''); }
    function isVerificationPage(html) {
        return /cf-browser-verification|cf_chl_opt|cf-please-wait|__cf_chl_|<title>\s*(?:just a moment|one moment, please|attention required|security verification|bot verification|ddos-guard)|id=["']challenge-stage["']|vb-challenge-form/i.test(html);
    }
    var observed = { html: '' };
    function resetObserved() { observed.html = ''; }
    function fetchApi(url, options) {
        return require('@libs/fetch').fetchApi(url, options).then(function (response) {
            if (response.ok === false) throw new Error('http:' + response.status);
            return response.text().then(function (html) {
                if (isVerificationPage(html)) throw new Error('Captcha: open in webview');
                observed.html = html;
                return { ok: true, status: response.status, text: function () { return Promise.resolve(html); } };
            });
        });
    }
    function withDeclaredFilters(options) {
        var out = Object.assign({}, options || {}), filters = {}, given = out.filters || {};
        Object.keys(plugin.filters || {}).forEach(function (key) {
            filters[key] = Object.assign({}, plugin.filters[key]);
            if (given[key] !== undefined) filters[key].value = given[key] && typeof given[key] === 'object' && 'value' in given[key] ? given[key].value : given[key];
        });
        out.filters = filters;
        return out;
    }

    // Cola local: nunca dos peticiones simultáneas; un segundo entre respuestas.
    // Sólo usa fetchApi y los temporizadores del entorno de extensiones.
    var lastResponse = 0, queue = Promise.resolve(), stopped = null;
    plugin.safeFecth = function (url, options) {
        var next = queue.then(function () {
            if (stopped) throw stopped;
            var delay = Math.max(0, 1000 - (Date.now() - lastResponse));
            return new Promise(function (resolve) { setTimeout(resolve, delay); });
        }).then(function () { return fetchApi(url, options); })
          .then(function (r) { lastResponse = Date.now(); return r.text(); })
          .catch(function (error) { stopped = error; throw error; });
        queue = next.catch(function () {});
        return next;
    };

        var isRu = plugin.id === 'ranobes-ru' || (plugin.lang && /rus/i.test(plugin.lang));
        if (!plugin.filters) {
            plugin.filters = {
                order: {
                    type: 'Picker',
                    label: isRu ? 'Сортировка' : 'Order by',
                    value: 'novels',
                    options: isRu ? [
                        { label: 'Каталог', value: 'novels' },
                        { label: 'Рейтинг', value: 'ranking' },
                        { label: 'Обновления', value: 'updates' }
                    ] : [
                        { label: 'Novels', value: 'novels' },
                        { label: 'Ranking', value: 'ranking' },
                        { label: 'Updates', value: 'updates' }
                    ]
                },
                status: {
                    type: 'Picker',
                    label: isRu ? 'Статус' : 'Status',
                    value: 'all',
                    options: isRu ? [
                        { label: 'Все', value: 'all' },
                        { label: 'Завершенные', value: 'completed' }
                    ] : [
                        { label: 'All', value: 'all' },
                        { label: 'Completed', value: 'completed' }
                    ]
                },
                genre: {
                    type: 'Picker',
                    label: isRu ? 'Жанры' : 'Genre',
                    value: 'all',
                    options: [
                        { label: isRu ? 'Все' : 'All', value: 'all' },
                        { label: 'Action', value: 'Action' },
                        { label: 'Adult', value: 'Adult' },
                        { label: 'Adventure', value: 'Adventure' },
                        { label: 'Comedy', value: 'Comedy' },
                        { label: 'Drama', value: 'Drama' },
                        { label: 'Ecchi', value: 'Ecchi' },
                        { label: 'Fantasy', value: 'Fantasy' },
                        { label: 'Game', value: 'Game' },
                        { label: 'Gender Bender', value: 'Gender Bender' },
                        { label: 'Harem', value: 'Harem' },
                        { label: 'Historical', value: 'Historical' },
                        { label: 'Horror', value: 'Horror' },
                        { label: 'Josei', value: 'Josei' },
                        { label: 'Martial Arts', value: 'Martial Arts' },
                        { label: 'Mature', value: 'Mature' },
                        { label: 'Mecha', value: 'Mecha' },
                        { label: 'Mystery', value: 'Mystery' },
                        { label: 'Psychological', value: 'Psychological' },
                        { label: 'Romance', value: 'Romance' },
                        { label: 'School Life', value: 'School Life' },
                        { label: 'Sci-fi', value: 'Sci-fi' },
                        { label: 'Seinen', value: 'Seinen' },
                        { label: 'Shoujo', value: 'Shoujo' },
                        { label: 'Shounen', value: 'Shounen' },
                        { label: 'Shounen Ai', value: 'Shounen Ai' },
                        { label: 'Slice of Life', value: 'Slice of Life' },
                        { label: 'Smut', value: 'Smut' },
                        { label: 'Sports', value: 'Sports' },
                        { label: 'Supernatural', value: 'Supernatural' },
                        { label: 'Tragedy', value: 'Tragedy' },
                        { label: 'Wuxia', value: 'Wuxia' },
                        { label: 'Xianxia', value: 'Xianxia' },
                        { label: 'Xuanhuan', value: 'Xuanhuan' },
                        { label: 'Yaoi', value: 'Yaoi' },
                        { label: 'Yuri', value: 'Yuri' }
                    ]
                }
            };
        }

        function parseRanobesCards(html, site) {
            var $lib = cheerioLib();
            if (!$lib || !html) return [];
            var $ = $lib.load(html);
            var novels = [];
            var seen = Object.create(null);

            // 1. Catálogo estándar, géneros y completadas (.short-cont / article.story / .mod-poster)
            $('article.story, .short-cont, article.mod-poster').each(function () {
                var $el = $(this);
                var $a = $el.find('h2.title a').first();
                if (!$a.length) $a = $el.find('.title a').first();
                var name = squash($a.text());
                var href = $a.attr('href') || '';
                if (!name || !href) return;

                var path = href.replace(site, '').replace(/^https?:\/\/[^\/]+/, '');
                if (path && !path.startsWith('/')) path = '/' + path;
                if (!path || seen[path]) return;
                seen[path] = true;

                var cover = '';
                var $figure = $el.find('figure.cover, figure').first();
                var style = $figure.attr('style') || '';
                var m = style.match(/url\(['"]?(.*?)['"]?\)/);
                if (m && m[1]) cover = m[1];
                if (!cover) {
                    var $img = $el.find('img').first();
                    cover = $img.attr('data-src') || $img.attr('src') || '';
                }
                if (cover && !cover.startsWith('http')) {
                    cover = site.replace(/\/+$/, '') + '/' + cover.replace(/^\/+/, '');
                }

                novels.push({ name: name, path: path, cover: cover });
            });

            // 2. Ranking / Populares (article.rank-story)
            if (!novels.length) {
                $('article.rank-story').each(function () {
                    var $el = $(this);
                    var $a = $el.find('h2.title a, .title a').first();
                    var name = squash($a.text());
                    var href = $a.attr('href') || '';
                    if (!name || !href) return;

                    var path = href.replace(site, '').replace(/^https?:\/\/[^\/]+/, '');
                    if (path && !path.startsWith('/')) path = '/' + path;
                    if (!path || seen[path]) return;
                    seen[path] = true;

                    var cover = '';
                    var $img = $el.find('figure img, img').first();
                    cover = $img.attr('data-src') || $img.attr('src') || '';
                    if (!cover) {
                        var style = ($el.find('figure').attr('style') || '');
                        var m = style.match(/url\(['"]?(.*?)['"]?\)/);
                        if (m && m[1]) cover = m[1];
                    }
                    if (cover && !cover.startsWith('http')) {
                        cover = site.replace(/\/+$/, '') + '/' + cover.replace(/^\/+/, '');
                    }

                    novels.push({ name: name, path: path, cover: cover });
                });
            }

            // 3. Updates / Novedades (.story_line.story_line-img)
            if (!novels.length) {
                $('.story_line.story_line-img').each(function () {
                    var $el = $(this);
                    var $a = $el.find('a').first();
                    var $title = $el.find('h3.title, .title').first();
                    var name = squash($title.text());
                    var href = $a.attr('href') || '';
                    if (!name || !href) return;

                    var path = href.replace(site, '').replace(/^https?:\/\/[^\/]+/, '');
                    if (path && !path.startsWith('/')) path = '/' + path;
                    if (!path || seen[path]) return;
                    seen[path] = true;

                    var cover = '';
                    var style = ($el.find('i.image.cover, i.cover').attr('style') || '');
                    var m = style.match(/url\(['"]?(.*?)['"]?\)/);
                    if (m && m[1]) cover = m[1];
                    if (cover && !cover.startsWith('http')) {
                        cover = site.replace(/\/+$/, '') + '/' + cover.replace(/^\/+/, '');
                    }

                    novels.push({ name: name, path: path, cover: cover });
                });
            }

            return novels;
        }

        var origRanobesPopular = plugin.popularNovels.bind(plugin);
        plugin.popularNovels = function (page, options) {
            var self = this;
            resetObserved();
            var site = siteOf(self);
            page = page || 1;

            var opts = withDeclaredFilters(options);
            var filters = (opts && opts.filters) || {};
            var genreVal = filters.genre && filters.genre.value;
            var statusVal = filters.status && filters.status.value;
            var orderVal = filters.order && filters.order.value;

            var targetUrl = site + (page > 1 ? '/novels/page/' + page + '/' : '/novels/');
            if (genreVal && genreVal !== 'all') {
                targetUrl = site + '/tags/genre/' + encodeURIComponent(genreVal) + (page > 1 ? '/page/' + page + '/' : '/');
            } else if (statusVal === 'completed') {
                targetUrl = site + '/tags/status-trs/Completed/' + (page > 1 ? '/page/' + page + '/' : '/');
            } else if (orderVal === 'ranking') {
                targetUrl = site + (page > 1 ? '/ranking/page/' + page + '/' : '/ranking/');
            } else if (orderVal === 'updates' || (opts && opts.showLatestNovels)) {
                targetUrl = site + (page > 1 ? '/novels/page/' + page + '/' : '/novels/');
            }

            var fetchPromise = null;
            if (typeof self.safeFecth === 'function') {
                fetchPromise = self.safeFecth(targetUrl);
            } else {
                if (fetchApi) {
                    fetchPromise = fetchApi(targetUrl).then(function (r) { return r.text(); });
                } else {
                    fetchPromise = origRanobesPopular(page, options);
                }
            }

            return Promise.resolve(fetchPromise).then(function (res) {
                if (typeof res === 'string') {
                    var list = parseRanobesCards(res, site);
                    if (list.length) return list;
                    if (typeof self.parseNovels === 'function') {
                        try { list = self.parseNovels(res); } catch (e) { list = []; }
                    }
                    return list;
                }
                return res;
            });
        };

        var origRanobesSearch = plugin.searchNovels.bind(plugin);
        plugin.searchNovels = function (query, page) {
            var self = this;
            resetObserved();
            var site = siteOf(self);
            page = page || 1;
            var q = encodeURIComponent(String(query || '').trim());
            var url = site + '/search/' + q + '/page/' + page;
            var fetchPromise = typeof self.safeFecth === 'function' ? self.safeFecth(url)
                             : origRanobesSearch(query, page);

            return Promise.resolve(fetchPromise).then(function (res) {
                if (typeof res === 'string') {
                    var list = parseRanobesCards(res, site);
                    if (list.length) return list;
                    if (typeof self.parseNovels === 'function') {
                        try { list = self.parseNovels(res); } catch (e) { list = []; }
                    }
                    return list;
                }
                return res;
            });
        };

        function ranobesChaptersBase(novelPath, site) {
            var raw = String(novelPath || '').trim();
            var clean = raw.replace(/^https?:\/\/[^\/]+/i, '').replace(/^\/+/, '');
            var s = String(site || '').replace(/\/+$/, '');
            if (isRu) {
                var parts = clean.replace(/^ranobe\//, '').split('-');
                var slug = parts.length > 1 ? parts.slice(1).join('-').split('.')[0] : parts[0].split('.')[0];
                return s + '/chapters/' + slug.replace(/^\/+/, '');
            }
            var m = clean.match(/(?:novels\/)?(\d+)/);
            if (m && m[1]) {
                return s + '/chapters/' + m[1];
            }
            var idPart = clean.replace(/^novels\//, '').split('-')[0];
            return s + '/chapters/' + idPart.replace(/^\/+/, '');
        }

        function ranobesPageUrl(base, pageNumber) {
            var p = parseInt(pageNumber, 10) || 1;
            var cleanBase = base.replace(/\/+$/, '');
            if (p <= 1) {
                return cleanBase + '/';
            }
            return cleanBase + '/page/' + p + '/';
        }

        function extractRanobesDataJSON(html) {
            if (!html || typeof html !== 'string') return null;
            var marker = 'window.__DATA__';
            var idx = html.indexOf(marker);
            if (idx === -1) return null;
            var eq = html.indexOf('=', idx);
            if (eq === -1) return null;
            var start = eq + 1;
            var end = html.indexOf('</script>', start);
            var str = (end !== -1 ? html.substring(start, end) : html.substring(start)).trim();
            str = str.replace(/;+\s*$/, '');
            try {
                return JSON.parse(str);
            } catch (e) {
                var firstBrace = str.indexOf('{');
                var lastBrace = str.lastIndexOf('}');
                if (firstBrace !== -1 && lastBrace > firstBrace) {
                    try { return JSON.parse(str.substring(firstBrace, lastBrace + 1)); }
                    catch (e2) {}
                }
                return null;
            }
        }

        function parseRanobesChaptersFromHTML(html, site) {
            if (!html || typeof html !== 'string') return [];
            var data = extractRanobesDataJSON(html);
            if (data && Array.isArray(data.chapters) && data.chapters.length > 0) {
                var chapters = data.chapters.map(function (ch) {
                    var link = ch.link || '';
                    var path = link.replace(/^https?:\/\/[^\/]+/i, '');
                    if (path && !path.startsWith('/')) path = '/' + path;
                    var title = plainLabel(ch.title || '');
                    var releaseTime = '';
                    if (ch.date) {
                        try { releaseTime = new Date(ch.date).toISOString(); } catch (e) { releaseTime = ch.date; }
                    } else if (ch.showDate) {
                        releaseTime = ch.showDate;
                    }
                    return {
                        name: title,
                        path: path,
                        releaseTime: releaseTime
                    };
                });
                return chapters;
            }

            var $lib = cheerioLib();
            if ($lib) {
                var $ = $lib.load(html);
                var list = [];
                var seen = Object.create(null);
                $('div.cat_block.cat_line, .cat_block.cat_line, div.cat_line').each(function () {
                    var $a = $(this).find('a').first();
                    if (!$a.length) return;
                    var title = $a.attr('title') || $a.attr(':title') || squash($a.text());
                    var href = $a.attr('href') || $a.attr(':href') || '';
                    if (!title || !href || href.indexOf('{{') !== -1 || href.indexOf('chapter.') !== -1) return;
                    var path = href.replace(/^https?:\/\/[^\/]+/i, '');
                    if (path && !path.startsWith('/')) path = '/' + path;
                    var key = pathKey(path);
                    if (!key || seen[key]) return;
                    seen[key] = true;
                    var release = squash($(this).find('.grey, .small, time').text());
                    list.push({
                        name: plainLabel(title),
                        path: path,
                        releaseTime: release
                    });
                });
                if (list.length) return list;

                $('a[rel="chapter"]').each(function () {
                    var $a = $(this);
                    var href = $a.attr('href') || '';
                    var title = squash($a.find('.title, span').first().text()) || $a.attr('title') || squash($a.text());
                    if (!title || !href) return;
                    var path = href.replace(/^https?:\/\/[^\/]+/i, '');
                    if (path && !path.startsWith('/')) path = '/' + path;
                    var key = pathKey(path);
                    if (!key || seen[key]) return;
                    seen[key] = true;
                    list.push({
                        name: plainLabel(title),
                        path: path,
                        releaseTime: squash($a.find('.grey').text())
                    });
                });
                if (list.length) return list;
            }
            return [];
        }

        var origRanobesPage = typeof plugin.parsePage === 'function' ? plugin.parsePage.bind(plugin) : null;
        plugin.parsePage = function (novelPath, pageStr) {
            var self = this;
            resetObserved();
            var site = siteOf(self);
            var page = parseInt(pageStr, 10) || 1;
            var base = ranobesChaptersBase(novelPath, site);
            var targetUrl = ranobesPageUrl(base, page);

            var fetchPromise = null;
            if (typeof self.safeFecth === 'function') {
                fetchPromise = self.safeFecth(targetUrl);
            } else {
                if (fetchApi) {
                    fetchPromise = fetchApi(targetUrl).then(function (r) {
                        if (r.ok === false) throw new Error('http:' + r.status);
                        return r.text();
                    });
                } else if (origRanobesPage) {
                    fetchPromise = origRanobesPage(novelPath, pageStr);
                }
            }

            return Promise.resolve(fetchPromise).then(function (res) {
                if (typeof res === 'string') {
                    if (isVerificationPage(res)) {
                        return Promise.reject(new Error(res));
                    }
                    var chapters = parseRanobesChaptersFromHTML(res, site);
                    return { chapters: chapters };
                }
                if (res && Array.isArray(res.chapters)) {
                    return res;
                }
                return { chapters: [] };
            });
        };

        var origRanobesNovel = plugin.parseNovel.bind(plugin);
        plugin.parseNovel = function (novelPath) {
            var self = this;
            resetObserved();
            var site = siteOf(self);

            return Promise.resolve(origRanobesNovel(novelPath)).then(function (novel) {
                if (!novel || typeof novel !== 'object') novel = { path: novelPath };
                var html = observed.html || '';
                var totalChapters = 0;

                if (html) {
                    var mGlossary = html.match(/<li[^>]*title=["'][^"']*(?:Glossary|Глоссарий)[^"']*["'][^>]*>([\s\S]*?)<\/li>/i);
                    if (mGlossary) {
                        var digits = mGlossary[1].replace(/<[^>]+>/g, ' ').match(/\b\d+\b/g);
                        if (digits && digits.length) {
                            totalChapters = parseInt(digits[digits.length - 1], 10);
                        }
                    }
                    if (!totalChapters) {
                        var mLi = html.match(/<li[^>]*>[\s\S]*?(?:Translated|In original|Available|Переведено)[\s\S]*?(\d+)\s*(?:chapters|глав)[\s\S]*?<\/li>/i);
                        if (mLi) totalChapters = parseInt(mLi[1], 10);
                    }
                    if (!totalChapters) {
                        var mAny = html.match(/\b(\d+)\s*(?:chapters|глав)\b/i);
                        if (mAny) totalChapters = parseInt(mAny[1], 10);
                    }
                }

                if (totalChapters > 0) {
                    novel.totalPages = Math.max(novel.totalPages || 1, Math.ceil(totalChapters / 25));
                }

                if ((!novel.totalPages || novel.totalPages <= 1) && (html.indexOf('/chapters/') !== -1 || (novel.chapters && novel.chapters.length >= 25))) {
                    var chUrl = ranobesPageUrl(ranobesChaptersBase(novelPath, site), 1);
                    if (fetchApi) {
                        
                        return self.safeFecth(chUrl).then(function (chHtml) {
                            
                            if (chHtml) {
                                var data = extractRanobesDataJSON(chHtml);
                                if (data) {
                                    if (data.pages_count) novel.totalPages = parseInt(data.pages_count, 10);
                                    else if (data.count_all) novel.totalPages = Math.ceil(parseInt(data.count_all, 10) / 25);
                                    if (Array.isArray(data.chapters) && data.chapters.length > 0 && (!novel.chapters || novel.chapters.length < data.chapters.length)) {
                                        novel.chapters = parseRanobesChaptersFromHTML(chHtml, site);
                                    }
                                }
                            }
                            return novel;
                        }).catch(function () {
                            
                            return novel;
                        });
                    }
                }

                return novel;
            });
        };
    
    plugin.version = '2.0.3';
})();
