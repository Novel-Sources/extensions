// Novel Arrow · versión corregida (repositorio Novel-Sources/extensions)
//
// Parte 1: la extensión oficial de LNReader, versión 1.0.1, sin tocar
// (github.com/LNReader/lnreader-plugins; licencia MIT, © 2021 Rajarshee
// Chatterjee; texto completo en LICENSE-LNReader.txt).
// Parte 2: mudanza a NovelPing, filtros, catálogo, búsqueda, archivo de capítulos y lectura.
var t=this&&this.__awaiter||function(t,e,n,r){return new(n||(n=Promise))((function(a,o){function c(t){try{s(r.next(t))}catch(t){o(t)}}function i(t){try{s(r.throw(t))}catch(t){o(t)}}function s(t){var e;t.done?a(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(c,i)}s((r=r.apply(t,e||[])).next())}))},e=this&&this.__generator||function(t,e){var n,r,a,o={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]},c=Object.create(("function"==typeof Iterator?Iterator:Object).prototype);return c.next=i(0),c.throw=i(1),c.return=i(2),"function"==typeof Symbol&&(c[Symbol.iterator]=function(){return this}),c;function i(i){return function(s){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;c&&(c=0,i[0]&&(o=0)),o;)try{if(n=1,r&&(a=2&i[0]?r.return:i[0]?r.throw||((a=r.return)&&a.call(r),0):r.next)&&!(a=a.call(r,i[1])).done)return a;switch(r=0,a&&(i=[2&i[0],a.value]),i[0]){case 0:case 1:a=i;break;case 4:return o.label++,{value:i[1],done:!1};case 5:o.label++,r=i[1],i=[0];continue;case 7:i=o.ops.pop(),o.trys.pop();continue;default:if(!(a=o.trys,(a=a.length>0&&a[a.length-1])||6!==i[0]&&2!==i[0])){o=0;continue}if(3===i[0]&&(!a||i[1]>a[0]&&i[1]<a[3])){o.label=i[1];break}if(6===i[0]&&o.label<a[1]){o.label=a[1],a=i;break}if(a&&o.label<a[2]){o.label=a[2],o.ops.push(i);break}a[2]&&o.ops.pop(),o.trys.pop();continue}i=e.call(t,o)}catch(t){i=[6,t],r=0}finally{n=a=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}};Object.defineProperty(exports,"__esModule",{value:!0});var n=require("cheerio"),r=require("@libs/fetch"),a=require("@libs/novelStatus"),o=function(){function o(){this.id="novelarrow",this.name="Novel Arrow",this.icon="src/en/novelarrow/icon.png",this.site="https://novelarrow.com/",this.version="1.0.1"}return o.prototype.popularNovels=function(a){return t(this,void 0,void 0,(function(){var t,o,c,i;return e(this,(function(e){switch(e.label){case 0:return t="".concat(this.site,"novels/latest?page=").concat(a),[4,(0,r.fetchApi)(t).then((function(t){return t.text()}))];case 1:return o=e.sent(),c=(0,n.load)(o),i=[],c("article").each((function(t,e){var n=c(e).find("h2").text().trim(),r=c(e).find("img").attr("src"),a=c(e).find("a").attr("href");n&&a&&i.push({name:n,cover:r,path:a.substring(1)})})),[2,i]}}))}))},o.prototype.parseNovel=function(o){return t(this,void 0,void 0,(function(){var t,c,i,s,u,p,l,h,f,m,v,d,g,y,b,w;return e(this,(function(e){switch(e.label){case 0:return t=this.site+o.replace(/^\//,""),[4,(0,r.fetchApi)(t).then((function(t){return t.text()}))];case 1:c=e.sent(),i=(0,n.load)(c),s=o.replace("novel/","").replace(/^\//,""),(u=i('meta[name="og:novel:genre"], meta[property="og:novel:genre"]').attr("content"))||(p=[],i('meta[property="article:tag"]').each((function(t,e){var n=i(e).attr("content");n&&p.push(n)})),u=p.join(", ")),l=i(".site-reading-copy p").map((function(t,e){return i(e).text().trim()})).get().join("\n\n")||i(".site-reading-copy").text().trim(),h={path:o,name:i('meta[name="og:novel:novel_name"]').attr("content")||i("h1").first().text().trim(),cover:i('meta[property="og:image"]').attr("content"),author:i('meta[name="og:novel:author"]').attr("content")||i('meta[name="author"]').attr("content"),status:"Ongoing"===i('meta[name="og:novel:status"]').attr("content")?a.NovelStatus.Ongoing:a.NovelStatus.Completed,summary:l,genres:u,chapters:[]},f="".concat(this.site,"api-web/novels/").concat(s,"/chapters?sort=asc"),e.label=2;case 2:return e.trys.push([2,4,,5]),[4,(0,r.fetchApi)(f,{headers:{Accept:"application/json"}}).then((function(t){return t.json()}))];case 3:return(m=e.sent())&&m.items&&(h.chapters=m.items.map((function(t){return{name:t.chapter_name,path:"chapter/".concat(s,"/").concat(t.chapter_id),releaseTime:null}}))),[3,5];case 4:for(e.sent(),v=new Map,d=/\\?"chapter_id\\?":\\?"([^"]+)\\?",\\?"chapter_name\\?":\\?"([^"]+)\\?"/g,g=void 0;null!==(g=d.exec(c));)y=g[1],b=g[2].replace(/\\"/g,'"'),w="chapter/".concat(s,"/").concat(y),v.has(w)||v.set(w,{name:b,path:w,releaseTime:null});return h.chapters=Array.from(v.values()),[3,5];case 5:return[2,h]}}))}))},o.prototype.parseChapter=function(a){return t(this,void 0,void 0,(function(){var t,o,c,i,s,u,p,l,h,f;return e(this,(function(e){switch(e.label){case 0:t=a.replace("chapter/","").split("/"),o=t[0],c=t[1],i="".concat(this.site,"api-web/novels/").concat(o,"/chapters/").concat(c),e.label=1;case 1:return e.trys.push([1,3,,5]),[4,(0,r.fetchApi)(i,{headers:{Accept:"application/json","x-track-reading-progress":"false"}}).then((function(t){return t.json()}))];case 2:return(s=e.sent())&&s.item&&s.item.chapterInfo&&s.item.chapterInfo.chapter_content?[2,s.item.chapterInfo.chapter_content]:[3,5];case 3:return e.sent(),[4,(0,r.fetchApi)("".concat(this.site).concat(a)).then((function(t){return t.text()}))];case 4:return u=e.sent(),p=/\\u003ch4\\u003e(.*)\\u003c\/p\\u003e/,(l=u.match(p))?(h=(h=l[0]).replace(/\\u003c/g,"<").replace(/\\u003e/g,">").replace(/\\"/g,'"').replace(/\\n/g,"").replace(/\\t/g,"").replace(/\\r/g,"").replace(/\\\\/g,"\\"),-1!==(f=h.lastIndexOf("</p>"))&&(h=h.substring(0,f+4)),[2,h]):[2,(0,n.load)(u)(".site-reading-copy").html()||"Content not found or premium."];case 5:return[2,"Content not found or premium."]}}))}))},o.prototype.searchNovels=function(a,o){return t(this,void 0,void 0,(function(){var t,c,i,s;return e(this,(function(e){switch(e.label){case 0:return t="".concat(this.site,"novels/search?keyword=").concat(encodeURIComponent(a),"&page=").concat(o),[4,(0,r.fetchApi)(t).then((function(t){return t.text()}))];case 1:return c=e.sent(),i=(0,n.load)(c),s=[],i("article").each((function(t,e){var n=i(e).find("h2").text().trim(),r=i(e).find("img").attr("src"),a=i(e).find("a").attr("href");n&&a&&s.push({name:n,cover:r,path:a.substring(1)})})),[2,s]}}))}))},o}();exports.default=new o;

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

    plugin.safeFecth = function (url) { return fetchApi(url).then(function (r) { return r.text(); }); };

        plugin.site = 'https://novelping.com/';

        if (!plugin.filters) {
            plugin.filters = {
                order: {
                    type: 'Picker',
                    label: 'Order by',
                    value: 'UPDATES',
                    options: [
                        { label: 'Latest Updates', value: 'UPDATES' },
                        { label: 'Popular this week', value: 'POPULAR' },
                        { label: 'Most Viewed', value: 'ALL_TIME' },
                        { label: 'Top Rated', value: 'RATING' },
                        { label: 'Recently Added', value: 'NEW' },
                        { label: 'Most Chapters', value: 'CHAPTERS' }
                    ]
                },
                status: {
                    type: 'Picker',
                    label: 'Status',
                    value: 'all',
                    options: [
                        { label: 'All', value: 'all' },
                        { label: 'Ongoing', value: 'ongoing' },
                        { label: 'Completed', value: 'completed' }
                    ]
                },
                genre: {
                    type: 'Picker',
                    label: 'Genre',
                    value: 'all',
                    options: [
                        { label: 'All', value: 'all' },
                        { label: 'Action', value: 'action' },
                        { label: 'Adult', value: 'adult' },
                        { label: 'Adventure', value: 'adventure' },
                        { label: 'Anime & Comics', value: 'anime-&-comics' },
                        { label: 'Comedy', value: 'comedy' },
                        { label: 'Drama', value: 'drama' },
                        { label: 'Eastern', value: 'eastern' },
                        { label: 'Ecchi', value: 'ecchi' },
                        { label: 'Fan-fiction', value: 'fan-fiction' },
                        { label: 'Fantasy', value: 'fantasy' },
                        { label: 'Game', value: 'game' },
                        { label: 'Gender Bender', value: 'gender-bender' },
                        { label: 'Harem', value: 'harem' },
                        { label: 'Historical', value: 'historical' },
                        { label: 'Horror', value: 'horror' },
                        { label: 'Isekai', value: 'isekai' },
                        { label: 'Josei', value: 'josei' },
                        { label: 'LGBT+', value: 'lgbt+' },
                        { label: 'LitRPG', value: 'litrpg' },
                        { label: 'Magic', value: 'magic' },
                        { label: 'Magical Realism', value: 'magical-realism' },
                        { label: 'Martial Arts', value: 'martial-arts' },
                        { label: 'Mature', value: 'mature' },
                        { label: 'Mecha', value: 'mecha' },
                        { label: 'Military', value: 'military' },
                        { label: 'Modern Life', value: 'modern-life' },
                        { label: 'Mystery', value: 'mystery' },
                        { label: 'Psychological', value: 'psychological' },
                        { label: 'Realistic', value: 'realistic' },
                        { label: 'Reincarnation', value: 'reincarnation' },
                        { label: 'Romance', value: 'romance' },
                        { label: 'School Life', value: 'school-life' },
                        { label: 'Sci-fi', value: 'sci-fi' },
                        { label: 'Seinen', value: 'seinen' },
                        { label: 'Shoujo', value: 'shoujo' },
                        { label: 'Shoujo Ai', value: 'shoujo-ai' },
                        { label: 'Shounen', value: 'shounen' },
                        { label: 'Shounen Ai', value: 'shounen-ai' },
                        { label: 'Slice of Life', value: 'slice-of-life' },
                        { label: 'Smut', value: 'smut' },
                        { label: 'Sports', value: 'sports' },
                        { label: 'Supernatural', value: 'supernatural' },
                        { label: 'System', value: 'system' },
                        { label: 'Thriller', value: 'thriller' },
                        { label: 'Tragedy', value: 'tragedy' },
                        { label: 'Urban', value: 'urban' },
                        { label: 'Video Games', value: 'video-games' },
                        { label: 'War', value: 'war' },
                        { label: 'Wuxia', value: 'wuxia' },
                        { label: 'Xianxia', value: 'xianxia' },
                        { label: 'Xuanhuan', value: 'xuanhuan' },
                        { label: 'Yaoi', value: 'yaoi' },
                        { label: 'Yuri', value: 'yuri' }
                    ]
                }
            };
        }

        function parseNovelPingCards(html, site) {
            var $lib = cheerioLib();
            if (!$lib || !html) return [];
            var $ = $lib.load(html);
            var novels = [];
            var seen = Object.create(null);

            $('.list-novel .row, #list-page .row, .col-novel-main .row, .row').each(function () {
                var $el = $(this);
                var $a = $el.find('.novel-title a, h3.novel-title a, h3 a').first();
                var name = squash($a.text());
                var href = $a.attr('href') || '';
                if (!name || !href) return;

                var path = href.replace(site, '').replace(/^https?:\/\/[^\/]+/, '');
                if (path && !path.startsWith('/')) path = '/' + path;
                if (!path || seen[path] || !path.includes('/book/')) return;
                seen[path] = true;

                var cover = '';
                var $img = $el.find('img.cover, img.novel-cover-loading, img').first();
                cover = $img.attr('data-src') || $img.attr('src') || '';
                if (cover && !cover.startsWith('http')) {
                    cover = site.replace(/\/+$/, '') + '/' + cover.replace(/^\/+/, '');
                }

                novels.push({ name: name, path: path, cover: cover });
            });

            return novels;
        }

        plugin.popularNovels = function (page, options) {
            var self = this;
            resetObserved();
            var site = 'https://novelping.com';
            page = page || 1;

            var opts = withDeclaredFilters(options);
            var filters = (opts && opts.filters) || {};
            var genreVal = filters.genre && filters.genre.value;
            var statusVal = filters.status && filters.status.value;
            var orderVal = filters.order && filters.order.value;
            if (opts && opts.showLatestNovels) orderVal = 'UPDATES';

            var targetUrl = site;
            if (genreVal && genreVal !== 'all') {
                targetUrl += '/novelping-genres/' + encodeURIComponent(genreVal);
                if (statusVal === 'ongoing') targetUrl += '/ongoing';
                else if (statusVal === 'completed') targetUrl += '/completed';

                var params = [];
                if (orderVal === 'LASTEST' || orderVal === 'UPDATES') params.push('sort=LASTEST');
                else if (orderVal && orderVal !== 'POPULAR') params.push('sort=' + encodeURIComponent(orderVal));
                if (page > 1) params.push('page=' + page);
                if (params.length) targetUrl += '?' + params.join('&');
            } else {
                targetUrl += '/sort/updates';
                if (statusVal === 'ongoing') targetUrl += '/ongoing';
                else if (statusVal === 'completed') targetUrl += '/completed';

                var params2 = [];
                if (orderVal && orderVal !== 'UPDATES') params2.push('sort=' + encodeURIComponent(orderVal));
                if (page > 1) params2.push('page=' + page);
                if (params2.length) targetUrl += '?' + params2.join('&');
            }
            var fetchPromise = null;
            if (typeof self.safeFecth === 'function') {
                fetchPromise = self.safeFecth(targetUrl);
            } else if (fetchApi) {
                fetchPromise = fetchApi(targetUrl).then(function (r) { return r.text(); });
            } else {
                fetchPromise = Promise.resolve('');
            }

            return Promise.resolve(fetchPromise).then(function (res) {
                if (typeof res === 'string') {
                    var list = parseNovelPingCards(res, site);
                    if (list.length) return list;
                    return list;
                }
                return res;
            });
        };

        plugin.searchNovels = function (query, page) {
            var self = this;
            resetObserved();
            var site = 'https://novelping.com';
            page = page || 1;
            var q = encodeURIComponent(String(query || '').trim());
            var url = site + '/search?keyword=' + q + (page > 1 ? '&page=' + page : '');
            var fetchPromise = typeof self.safeFecth === 'function' ? self.safeFecth(url)
                             : fetchApi ? fetchApi(url).then(function (r) { return r.text(); })
                             : Promise.resolve('');

            return Promise.resolve(fetchPromise).then(function (res) {
                if (typeof res === 'string') {
                    var list = parseNovelPingCards(res, site);
                    if (list.length) return list;
                    return list;
                }
                return res;
            });
        };

        plugin.parseNovel = function (novelPath) {
            var self = this;
            resetObserved();
            var site = 'https://novelping.com';
            var slug = String(novelPath || '').replace(/^\/?(book|novel)\//, '').replace(/^\/+|\/+$/g, '');
            var novelUrl = site + '/book/' + slug;
            if (!fetchApi) return Promise.reject(new Error('Fetch API not available'));

            return fetchApi(novelUrl).then(function (r) { return r.text(); }).then(function (html) {
                var $lib = cheerioLib();
                var $ = $lib ? $lib.load(html) : null;

                var name = ($ && $('meta[property="og:novel:novel_name"]').attr('content')) ||
                           ($ && $('meta[property="og:title"]').attr('content')) ||
                           ($ && $('h3.title').first().text().trim()) ||
                           ($ && $('h1').first().text().trim()) || slug;
                name = name.replace(/\s*\|\s*NovelPing$/i, '').trim();

                var cover = ($ && $('meta[property="og:image"]').attr('content')) ||
                            ($ && $('img.cover').first().attr('src')) || '';
                var author = ($ && $('meta[property="og:novel:author"]').attr('content')) ||
                             ($ && $('.author a').first().text().trim()) ||
                             ($ && $('.author').first().text().trim()) || '';
                var genres = ($ && $('meta[property="og:novel:genre"]').attr('content')) ||
                             ($ && $('.categories a').map(function () { return $(this).text().trim(); }).get().join(', ')) || '';
                var statusRaw = ($ && $('meta[property="og:novel:status"]').attr('content')) ||
                                ($ && $('.label-full').length ? 'Completed' : 'Ongoing');
                var status = /completed/i.test(statusRaw) ? 'Completed' : 'Ongoing';

                var summary = ($ && $('#novel-description-content').text().trim()) ||
                              ($ && $('.desc-text').text().trim()) ||
                              ($ && $('meta[property="og:description"]').attr('content')) ||
                              ($ && $('meta[name="description"]').attr('content')) || '';

                var archiveUrl = site + '/ajax/chapter-archive?novelId=' + encodeURIComponent(slug);
                return fetchApi(archiveUrl).then(function (r) { return r.text(); }).catch(function (error) { if (String(error).indexOf('http:404') === -1) throw error; return ''; }).then(function (archiveHtml) {
                    var chapters = [];
                    var seenCh = Object.create(null);

                    // 1. Extracción ultrarrápida por expresión regular sin sobrecarga de Cheerio DOM
                    if (archiveHtml) {
                        var reItem = /<li[^>]*data-chapter-item[^>]*>[\s\S]*?<a[^>]*href=["']([^"'>]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
                        var m;
                        var idx = 0;
                        while ((m = reItem.exec(archiveHtml)) !== null) {
                            var href = m[1] || '';
                            var inner = m[2] || '';
                            var titleMatch = inner.match(/class=["'][^"']*chapter-title[^"']*["'][^>]*>([\s\S]*?)<\//i);
                            var rawTitle = titleMatch ? titleMatch[1] : inner;
                            var title = squash(rawTitle.replace(/<[^>]+>/g, ''));
                            if (!title || !href) continue;
                            var chPath = href.replace(site, '').replace(/^https?:\/\/[^\/]+/, '');
                            if (chPath && !chPath.startsWith('/')) chPath = '/' + chPath;
                            if (seenCh[chPath]) continue;
                            seenCh[chPath] = true;
                            idx++;
                            chapters.push({
                                name: title,
                                path: chPath,
                                releaseTime: null,
                                chapterNumber: idx
                            });
                        }
                    }

                    // 2. Fallback Cheerio si regex no capturó nada
                    if (!chapters.length && $lib && (archiveHtml || html)) {
                        try {
                            var chHtml = archiveHtml || html;
                            var $ch = $lib.load(chHtml);
                            $ch('li[data-chapter-item]').each(function () {
                                var $li = $ch(this);
                                var $a = $li.find('a').first();
                                var title = squash($li.find('.chapter-title').text()) || squash($a.text());
                                var href = $a.attr('href') || '';
                                if (!title || !href) return;
                                var chPath = href.replace(site, '').replace(/^https?:\/\/[^\/]+/, '');
                                if (chPath && !chPath.startsWith('/')) chPath = '/' + chPath;
                                if (seenCh[chPath]) return;
                                seenCh[chPath] = true;
                                chapters.push({
                                    name: title,
                                    path: chPath,
                                    releaseTime: null,
                                    chapterNumber: chapters.length + 1
                                });
                            });
                        } catch (e) {}
                    }

                    if (!chapters.length) {
                        // Sin archivo, sólo enlaces de capítulo de esta ficha.
                        $('a[href*="/chapter-"]').each(function () {
                            var href = $(this).attr('href');
                            if (!seenCh[href]) { seenCh[href] = true; chapters.push({ name: squash($(this).text()), path: pathKey(href) }); }
                        });
                    }

                    return {
                        path: '/book/' + slug,
                        name: name,
                        cover: cover,
                        author: author,
                        status: status,
                        summary: summary,
                        genres: genres,
                        chapters: chapters
                    };
                });
            });
        };

        plugin.parseChapter = function (chapterPath) {
            resetObserved();
            var site = 'https://novelping.com';
            var cleanPath = String(chapterPath || '').trim();
            if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
            var chapterUrl = site + cleanPath;
            if (!fetchApi) return Promise.reject(new Error('Fetch API not available'));

            return fetchApi(chapterUrl).then(function (r) { return r.text(); }).then(function (html) {
                var $lib = cheerioLib();
                if ($lib && html) {
                    var $ = $lib.load(html);
                    var $content = $('#chr-content, .chr-c').first();
                    if ($content.length) {
                        $content.find('.js-ad-slot, script, style, ins, iframe, .adsbygoogle').remove();
                        var text = $content.html() || '';
                        if (plainLength(text) >= 200) return text;
                    }
                }
                var rescued = '';
                var $fallback = cheerio.load(html);
                rescued = $fallback('[itemprop="articleBody"], article .content, .chapter-content').first().html() || '';
                if (plainLength(rescued) >= 200) return rescued;
                throw new Error('No se pudo extraer el contenido del capítulo');
            });
        };
    
    plugin.version = '1.0.2';
})();
