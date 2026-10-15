// MVLempyr · versión corregida (repositorio Tianshuge-Sources/extensions)
//
// Parte 1: la extensión oficial de LNReader, versión 1.0.14, sin tocar
// (github.com/LNReader/lnreader-plugins; licencia MIT, © 2021 Rajarshee
// Chatterjee; texto completo en LICENSE-LNReader.txt).
// Parte 2, al final: la corrección. La oficial descarga el catálogo entero
// (12 000 obras, ~22 MB) para la lista y para cada búsqueda. Aquí la lista, la
// búsqueda, los filtros y la ficha usan la API pública de la web con pocas peticiones.
var e=this&&this.__awaiter||function(e,l,a,t){return new(a||(a=Promise))((function(i,o){function r(e){try{n(t.next(e))}catch(e){o(e)}}function s(e){try{n(t.throw(e))}catch(e){o(e)}}function n(e){var l;e.done?i(e.value):(l=e.value,l instanceof a?l:new a((function(e){e(l)}))).then(r,s)}n((t=t.apply(e,l||[])).next())}))},l=this&&this.__generator||function(e,l){var a,t,i,o={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]},r=Object.create(("function"==typeof Iterator?Iterator:Object).prototype);return r.next=s(0),r.throw=s(1),r.return=s(2),"function"==typeof Symbol&&(r[Symbol.iterator]=function(){return this}),r;function s(s){return function(n){return function(s){if(a)throw new TypeError("Generator is already executing.");for(;r&&(r=0,s[0]&&(o=0)),o;)try{if(a=1,t&&(i=2&s[0]?t.return:s[0]?t.throw||((i=t.return)&&i.call(t),0):t.next)&&!(i=i.call(t,s[1])).done)return i;switch(t=0,i&&(s=[2&s[0],i.value]),s[0]){case 0:case 1:i=s;break;case 4:return o.label++,{value:s[1],done:!1};case 5:o.label++,t=s[1],s=[0];continue;case 7:s=o.ops.pop(),o.trys.pop();continue;default:if(!(i=o.trys,(i=i.length>0&&i[i.length-1])||6!==s[0]&&2!==s[0])){o=0;continue}if(3===s[0]&&(!i||s[1]>i[0]&&s[1]<i[3])){o.label=s[1];break}if(6===s[0]&&o.label<i[1]){o.label=i[1],i=s;break}if(i&&o.label<i[2]){o.label=i[2],o.ops.push(s);break}i[2]&&o.ops.pop(),o.trys.pop();continue}s=l.call(e,o)}catch(e){s=[6,e],t=0}finally{a=i=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}([s,n])}}},a=this&&this.__spreadArray||function(e,l,a){if(a||2===arguments.length)for(var t,i=0,o=l.length;i<o;i++)!t&&i in l||(t||(t=Array.prototype.slice.call(l,0,i)),t[i]=l[i]);return e.concat(t||Array.prototype.slice.call(l))};Object.defineProperty(exports,"__esModule",{value:!0});var t=require("cheerio"),i=require("@libs/fetch"),o=require("@libs/filterInputs"),r=function(){function r(){this.id="mvlempyr.com",this.name="MVLEMPYR",this.icon="src/en/mvlempyr/icon.png",this.site="https://www.mvlempyr.io/",this.version="1.0.14",this._chapSite="https://chap.heliosarchive.online/",this.filters={order:{type:o.FilterTypes.Picker,value:"reviewCount",label:"Order by",options:[{label:"Latest Added",value:"created"},{label:"Best Rated",value:"avgReview"},{label:"Most Reviewed",value:"reviewCount"},{label:"Chapter Count",value:"chapterCount"},{label:"Random",value:"random"}]},genre:{type:o.FilterTypes.ExcludableCheckboxGroup,label:"Genres",value:{include:[],exclude:[]},options:[{label:"Action",value:"action"},{label:"Adult",value:"adult"},{label:"Adventure",value:"adventure"},{label:"Comedy",value:"comedy"},{label:"Drama",value:"drama"},{label:"Ecchi",value:"ecchi"},{label:"Fan-Fiction",value:"fan-fiction"},{label:"Fantasy",value:"fantasy"},{label:"Gender Bender",value:"gender-bender"},{label:"Harem",value:"harem"},{label:"Historical",value:"historical"},{label:"Horror",value:"horror"},{label:"Josei",value:"josei"},{label:"Martial Arts",value:"martial-arts"},{label:"Mature",value:"mature"},{label:"Mecha",value:"mecha"},{label:"Mystery",value:"mystery"},{label:"Psychological",value:"psychological"},{label:"Romance",value:"romance"},{label:"School Life",value:"school-life"},{label:"Sci-fi",value:"sci-fi"},{label:"Seinen",value:"seinen"},{label:"Shoujo",value:"shoujo"},{label:"Shoujo Ai",value:"shoujo-ai"},{label:"Shounen",value:"shounen"},{label:"Shounen Ai",value:"shounen-ai"},{label:"Slice of Life",value:"slice-of-life"},{label:"Smut",value:"smut"},{label:"Sports",value:"sports"},{label:"Supernatural",value:"supernatural"},{label:"Tragedy",value:"tragedy"},{label:"Wuxia",value:"wuxia"},{label:"Xianxia",value:"xianxia"},{label:"Xuanhuan",value:"xuanhuan"},{label:"Yaoi",value:"yaoi"},{label:"Yuri",value:"yuri"}]},tag:{type:o.FilterTypes.ExcludableCheckboxGroup,label:"Tags",value:{include:[],exclude:[]},options:[{label:"Abandoned Children",value:"abandoned-children"},{label:"Ability Steal",value:"ability-steal"},{label:"Absent Parents",value:"absent-parents"},{label:"Abusive Characters",value:"abusive-characters"},{label:"Academy",value:"academy"},{label:"Accelerated Growth",value:"accelerated-growth"},{label:"Acting",value:"acting"},{label:"Adapted from Manga",value:"adapted-from-manga"},{label:"Adapted from Manhua",value:"adapted-from-manhua"},{label:"Adapted to Anime",value:"adapted-to-anime"},{label:"Adapted to Drama",value:"adapted-to-drama"},{label:"Adapted to Drama CD",value:"adapted-to-drama-cd"},{label:"Adapted to Game",value:"adapted-to-game"},{label:"Adapted to Manga",value:"adapted-to-manga"},{label:"Adapted to Manhua",value:"adapted-to-manhua"},{label:"Adapted to Manhwa",value:"adapted-to-manhwa"},{label:"Adapted to Movie",value:"adapted-to-movie"},{label:"Adapted to Visual Novel",value:"adapted-to-visual-novel"},{label:"Adopted Children",value:"adopted-children"},{label:"Adopted Protagonist",value:"adopted-protagonist"},{label:"Adultery",value:"adultery"},{label:"Advanced technology",value:"advanced-technology"},{label:"Adventurers",value:"adventurers"},{label:"Affair",value:"affair"},{label:"Age Progression",value:"age-progression"},{label:"Age Regression",value:"age-regression"},{label:"Aggressive Characters",value:"aggressive-characters"},{label:"Alchemy",value:"alchemy"},{label:"Aliens",value:"aliens"},{label:"All-Girls School",value:"all-girls-school"},{label:"Alternate World",value:"alternate-world"},{label:"American Comics",value:"american-comics"},{label:"Amnesia",value:"amnesia"},{label:"Amusement Park",value:"amusement-park"},{label:"An*l",value:"an-l"},{label:"Ancient China",value:"ancient-china"},{label:"Ancient Times",value:"ancient-times"},{label:"Androgynous Characters",value:"androgynous-characters"},{label:"Androids",value:"androids"},{label:"Angels",value:"angels"},{label:"Animal Characteristics",value:"animal-characteristics"},{label:"Animal Rearing",value:"animal-rearing"},{label:"Anti-Heo",value:"anti-heo"},{label:"Anti-Magic",value:"anti-magic"},{label:"Anti-social Protagonist",value:"anti-social-protagonist"},{label:"Antihero Protagonist",value:"antihero-protagonist"},{label:"Antique Shop",value:"antique-shop"},{label:"Apartment Life",value:"apartment-life"},{label:"Apathetic Protagonist",value:"apathetic-protagonist"},{label:"Apocalypse",value:"apocalypse"},{label:"Appearance Changes",value:"appearance-changes"},{label:"Appearance Different from Actual Age",value:"appearance-different-from-actual-age"},{label:"Archery",value:"archery"},{label:"Aristocracy",value:"aristocracy"},{label:"Arms Dealers",value:"arms-dealers"},{label:"Army",value:"army"},{label:"Army Building",value:"army-building"},{label:"Arranged Marriage",value:"arranged-marriage"},{label:"Arrogant Characters",value:"arrogant-characters"},{label:"Artifact Crafting",value:"artifact-crafting"},{label:"Artifacts",value:"artifacts"},{label:"Artificial Intelligence",value:"artificial-intelligence"},{label:"Artists",value:"artists"},{label:"Assassins",value:"assassins"},{label:"Astrologers",value:"astrologers"},{label:"Autism",value:"autism"},{label:"Automatons",value:"automatons"},{label:"Average-looking Protagonist",value:"average-looking-protagonist"},{label:"Award-winning Work",value:"award-winning-work"},{label:"Awkward Protagonist",value:"awkward-protagonist"},{label:"BDSM",value:"bdsm"},{label:"Bands",value:"bands"},{label:"Based on a Movie",value:"based-on-a-movie"},{label:"Based on a Song",value:"based-on-a-song"},{label:"Based on a TV Show",value:"based-on-a-tv-show"},{label:"Based on a Video Game",value:"based-on-a-video-game"},{label:"Based on a Visual Novel",value:"based-on-a-visual-novel"},{label:"Based on an Anime",value:"based-on-an-anime"},{label:"Battle Academy",value:"battle-academy"},{label:"Battle Competition",value:"battle-competition"},{label:"Beast Companions",value:"beast-companions"},{label:"Beastkin",value:"beastkin"},{label:"Beasts",value:"beasts"},{label:"Beautiful Female Lead",value:"beautiful-female-lead"},{label:"Bestiality",value:"bestiality"},{label:"Betrayal",value:"betrayal"},{label:"Bickering Couple",value:"bickering-couple"},{label:"Biochip",value:"biochip"},{label:"Bisexual Protagonist",value:"bisexual-protagonist"},{label:"Black Belly",value:"black-belly"},{label:"Blackmail",value:"blackmail"},{label:"Blacksmith",value:"blacksmith"},{label:"Blind Dates",value:"blind-dates"},{label:"Blind Protagonist",value:"blind-protagonist"},{label:"Blood Manipulation",value:"blood-manipulation"},{label:"Bloodlines",value:"bloodlines"},{label:"Body Swap",value:"body-swap"},{label:"Body Tempering",value:"body-tempering"},{label:"Body-double",value:"body-double"},{label:"Bodyguards",value:"bodyguards"},{label:"Books",value:"books"},{label:"Bookworm",value:"bookworm"},{label:"Boss-Subordinate Relationship",value:"boss-subordinate-relationship"},{label:"Brainwashing",value:"brainwashing"},{label:"Breast Fetish",value:"breast-fetish"},{label:"Broken Engagement",value:"broken-engagement"},{label:"Brother Complex",value:"brother-complex"},{label:"Brotherhood",value:"brotherhood"},{label:"Buddhism",value:"buddhism"},{label:"Bullying",value:"bullying"},{label:"Business Management",value:"business-management"},{label:"Businessmen",value:"businessmen"},{label:"Butlers",value:"butlers"},{label:"C*nnilingus",value:"c-nnilingus"},{label:"Calm Protagonist",value:"calm-protagonist"},{label:"Cannibalism",value:"cannibalism"},{label:"Card Games",value:"card-games"},{label:"Carefree Protagonist",value:"carefree-protagonist"},{label:"Caring Protagonist",value:"caring-protagonist"},{label:"Cautious Protagonist",value:"cautious-protagonist"},{label:"Celebrities",value:"celebrities"},{label:"Character Growth",value:"character-growth"},{label:"Charismatic Protagonist",value:"charismatic-protagonist"},{label:"Charming Protagonist",value:"charming-protagonist"},{label:"Chat Rooms",value:"chat-rooms"},{label:"Cheats",value:"cheats"},{label:"Chefs",value:"chefs"},{label:"Child Abuse",value:"child-abuse"},{label:"Child Protagonist",value:"child-protagonist"},{label:"Childcare",value:"childcare"},{label:"Childhood Friends",value:"childhood-friends"},{label:"Childhood Love",value:"childhood-love"},{label:"Childhood Promise",value:"childhood-promise"},{label:"Childish Protagonist",value:"childish-protagonist"},{label:"Chuunibyou",value:"chuunibyou"},{label:"Clan Building",value:"clan-building"},{label:"Classic",value:"classic"},{label:"Clever Protagonist",value:"clever-protagonist"},{label:"Clingy Lover",value:"clingy-lover"},{label:"Clones",value:"clones"},{label:"Clubs",value:"clubs"},{label:"Clumsy Love Interests",value:"clumsy-love-interests"},{label:"Co-Workers",value:"co-workers"},{label:"Cohabitation",value:"cohabitation"},{label:"Cold Love Interests",value:"cold-love-interests"},{label:"Cold Protagonist",value:"cold-protagonist"},{label:"Collection of Short Stories",value:"collection-of-short-stories"},{label:"College/University",value:"college-university"},{label:"Coma",value:"coma"},{label:"Comedic Undertone",value:"comedic-undertone"},{label:"Coming of Age",value:"coming-of-age"},{label:"Complex Family Relationships",value:"complex-family-relationships"},{label:"Conditional Power",value:"conditional-power"},{label:"Confident Protagonist",value:"confident-protagonist"},{label:"Confinement",value:"confinement"},{label:"Conflicting Loyalties",value:"conflicting-loyalties"},{label:"Contracts",value:"contracts"},{label:"Cooking",value:"cooking"},{label:"Corruption",value:"corruption"},{label:"Cosmic Wars",value:"cosmic-wars"},{label:"Cosplay",value:"cosplay"},{label:"Couple Growth",value:"couple-growth"},{label:"Court Official",value:"court-official"},{label:"Cousins",value:"cousins"},{label:"Cowardly Protagonist",value:"cowardly-protagonist"},{label:"Crafting",value:"crafting"},{label:"Crime",value:"crime"},{label:"Criminals",value:"criminals"},{label:"Cross-dressing",value:"cross-dressing"},{label:"Crossover",value:"crossover"},{label:"Cruel Characters",value:"cruel-characters"},{label:"Cryostasis",value:"cryostasis"},{label:"Cultivation",value:"cultivation"},{label:"Cunning Protagonist",value:"cunning-protagonist"},{label:"Curious Protagonist",value:"curious-protagonist"},{label:"Curses",value:"curses"},{label:"Cute Children",value:"cute-children"},{label:"Cute Protagonist",value:"cute-protagonist"},{label:"Cute Story",value:"cute-story"},{label:"DC",value:"dc"},{label:"Dancers",value:"dancers"},{label:"Dao Companion",value:"dao-companion"},{label:"Dao Comprehension",value:"dao-comprehension"},{label:"Daoism",value:"daoism"},{label:"Dark",value:"dark"},{label:"Dead Protagonist",value:"dead-protagonist"},{label:"Death",value:"death"},{label:"Death of Loved Ones",value:"death-of-loved-ones"},{label:"Debts",value:"debts"},{label:"Delinquents",value:"delinquents"},{label:"Delusions",value:"delusions"},{label:"Demi-Humans",value:"demi-humans"},{label:"Demon Lord",value:"demon-lord"},{label:"Demonic Cultivation Technique",value:"demonic-cultivation-technique"},{label:"Demons",value:"demons"},{label:"Dense Protagonist",value:"dense-protagonist"},{label:"Depictions of Cruelty",value:"depictions-of-cruelty"},{label:"Depression",value:"depression"},{label:"Destiny",value:"destiny"},{label:"Detectives",value:"detectives"},{label:"Determined Protagonist",value:"determined-protagonist"},{label:"Devoted Love Interests",value:"devoted-love-interests"},{label:"Different Social Status",value:"different-social-status"},{label:"Disabilities",value:"disabilities"},{label:"Discrimination",value:"discrimination"},{label:"Disfigurement",value:"disfigurement"},{label:"Dishonest Protagonist",value:"dishonest-protagonist"},{label:"Distrustful Protagonist",value:"distrustful-protagonist"},{label:"Divination",value:"divination"},{label:"Divine Protection",value:"divine-protection"},{label:"Divorce",value:"divorce"},{label:"Doctors",value:"doctors"},{label:"Dolls/Puppets",value:"dolls-puppets"},{label:"Domestic Affairs",value:"domestic-affairs"},{label:"Doting Love Interests",value:"doting-love-interests"},{label:"Doting Older Siblings",value:"doting-older-siblings"},{label:"Doting Parents",value:"doting-parents"},{label:"Dragon Ball",value:"dragon-ball"},{label:"Dragon Riders",value:"dragon-riders"},{label:"Dragon Slayers",value:"dragon-slayers"},{label:"Dragons",value:"dragons"},{label:"Dreams",value:"dreams"},{label:"Drugs",value:"drugs"},{label:"Druids",value:"druids"},{label:"Dungeon Master",value:"dungeon-master"},{label:"Dungeons",value:"dungeons"},{label:"Dwarfs",value:"dwarfs"},{label:"Dystopia",value:"dystopia"},{label:"Early Romance",value:"early-romance"},{label:"Earth Invasion",value:"earth-invasion"},{label:"Easy Going Life",value:"easy-going-life"},{label:"Economics",value:"economics"},{label:"Editors",value:"editors"},{label:"Eidetic Memory",value:"eidetic-memory"},{label:"Elderly Protagonist",value:"elderly-protagonist"},{label:"Elemental Magic",value:"elemental-magic"},{label:"Elves",value:"elves"},{label:"Emotionally Weak Protagonist",value:"emotionally-weak-protagonist"},{label:"Empires",value:"empires"},{label:"Enemies Become Allies",value:"enemies-become-allies"},{label:"Enemies Become Lovers",value:"enemies-become-lovers"},{label:"Engagement",value:"engagement"},{label:"Engineer",value:"engineer"},{label:"Enlightenment",value:"enlightenment"},{label:"Episodic",value:"episodic"},{label:"Eunuch",value:"eunuch"},{label:"European Ambience",value:"european-ambience"},{label:"Evil Gods",value:"evil-gods"},{label:"Evil Organizations",value:"evil-organizations"},{label:"Evil Protagonist",value:"evil-protagonist"},{label:"Evil Religions",value:"evil-religions"},{label:"Evolution",value:"evolution"},{label:"Exhibitionism",value:"exhibitionism"},{label:"Exorcism",value:"exorcism"},{label:"Eye Powers",value:"eye-powers"},{label:"F*llatio",value:"f-llatio"},{label:"Face slapping",value:"face-slapping"},{label:"Fairies",value:"fairies"},{label:"Fallen Angels",value:"fallen-angels"},{label:"Fallen Nobility",value:"fallen-nobility"},{label:"Familial Love",value:"familial-love"},{label:"Familiars",value:"familiars"},{label:"Family",value:"family"},{label:"Family Business",value:"family-business"},{label:"Family Conflict",value:"family-conflict"},{label:"Famous Parents",value:"famous-parents"},{label:"Famous Protagonist",value:"famous-protagonist"},{label:"Fanaticism",value:"fanaticism"},{label:"Fanfiction",value:"fanfiction"},{label:"Fantasy Creatures",value:"fantasy-creatures"},{label:"Fantasy World",value:"fantasy-world"},{label:"Farming",value:"farming"},{label:"Fast Cultivation",value:"fast-cultivation"},{label:"Fast Learner",value:"fast-learner"},{label:"Fat Protagonist",value:"fat-protagonist"},{label:"Fat to Fit",value:"fat-to-fit"},{label:"Fated Lovers",value:"fated-lovers"},{label:"Fearless Protagonist",value:"fearless-protagonist"},{label:"Female Master",value:"female-master"},{label:"Female Protagonist",value:"female-protagonist"},{label:"Female to Male",value:"female-to-male"},{label:"Feng Shui",value:"feng-shui"},{label:"Firearms",value:"firearms"},{label:"First Love",value:"first-love"},{label:"First-time Interc**rse",value:"first-time-interc-rse"},{label:"Flashbacks",value:"flashbacks"},{label:"Fleet Battles",value:"fleet-battles"},{label:"Folklore",value:"folklore"},{label:"Forced Living Arrangements",value:"forced-living-arrangements"},{label:"Forced Marriage",value:"forced-marriage"},{label:"Forced into a Relationship",value:"forced-into-a-relationship"},{label:"Forgetful Protagonist",value:"forgetful-protagonist"},{label:"Former Hero",value:"former-hero"},{label:"Fox Spirits",value:"fox-spirits"},{label:"Friends Become Enemies",value:"friends-become-enemies"},{label:"Friendship",value:"friendship"},{label:"Fujoshi",value:"fujoshi"},{label:"Futanari",value:"futanari"},{label:"Futuristic Setting",value:"futuristic-setting"},{label:"Galge",value:"galge"},{label:"Gambling",value:"gambling"},{label:"Game Elements",value:"game-elements"},{label:"Game Ranking System",value:"game-ranking-system"},{label:"Gamers",value:"gamers"},{label:"Gangs",value:"gangs"},{label:"Gate to Another World",value:"gate-to-another-world"},{label:"Genderless Protagonist",value:"genderless-protagonist"},{label:"Generals",value:"generals"},{label:"Genetic Modifications",value:"genetic-modifications"},{label:"Genies",value:"genies"},{label:"Genius Protagonist",value:"genius-protagonist"},{label:"Ghosts",value:"ghosts"},{label:"Gladiators",value:"gladiators"},{label:"Glasses-wearing Love Interests",value:"glasses-wearing-love-interests"},{label:"Glasses-wearing Protagonist",value:"glasses-wearing-protagonist"},{label:"Goblins",value:"goblins"},{label:"God Protagonist",value:"god-protagonist"},{label:"God-human Relationship",value:"god-human-relationship"},{label:"Goddesses",value:"goddesses"},{label:"Godly Powers",value:"godly-powers"},{label:"Gods",value:"gods"},{label:"Golems",value:"golems"},{label:"Gore",value:"gore"},{label:"Grave Keepers",value:"grave-keepers"},{label:"Grinding",value:"grinding"},{label:"Guardian Relationship",value:"guardian-relationship"},{label:"Guilds",value:"guilds"},{label:"Gunfighters",value:"gunfighters"},{label:"H*ndjob",value:"h-ndjob"},{label:"Hackers",value:"hackers"},{label:"Half-human Protagonist",value:"half-human-protagonist"},{label:"Handsome Male Lead",value:"handsome-male-lead"},{label:"Hard-Working Protagonist",value:"hard-working-protagonist"},{label:"Harem-seeking Protagonist",value:"harem-seeking-protagonist"},{label:"Harry Potter",value:"harry-potter"},{label:"Harsh Training",value:"harsh-training"},{label:"Hated Protagonist",value:"hated-protagonist"},{label:"Healers",value:"healers"},{label:"Heartwarming",value:"heartwarming"},{label:"Heaven",value:"heaven"},{label:"Heavenly Tribulation",value:"heavenly-tribulation"},{label:"Hell",value:"hell"},{label:"Helpful Protagonist",value:"helpful-protagonist"},{label:"Herbalist",value:"herbalist"},{label:"Heroes",value:"heroes"},{label:"Heterochromia",value:"heterochromia"},{label:"Hidden Abilities",value:"hidden-abilities"},{label:"Hiding True Abilities",value:"hiding-true-abilities"},{label:"Hiding True Identity",value:"hiding-true-identity"},{label:"Hikikomori",value:"hikikomori"},{label:"Hollywood",value:"hollywood"},{label:"Homunculus",value:"homunculus"},{label:"Honest Protagonist",value:"honest-protagonist"},{label:"Hospital",value:"hospital"},{label:"Hot-blooded Protagonist",value:"hot-blooded-protagonist"},{label:"Human Experimentation",value:"human-experimentation"},{label:"Human Weapon",value:"human-weapon"},{label:"Human-Nonhuman Relationship",value:"human-nonhuman-relationship"},{label:"Humanoid Protagonist",value:"humanoid-protagonist"},{label:"Hunter x Hunter",value:"hunter-x-hunter"},{label:"Hunters",value:"hunters"},{label:"Hypnotism",value:"hypnotism"},{label:"Identity Crisis",value:"identity-crisis"},{label:"Imaginary Friend",value:"imaginary-friend"},{label:"Immortals",value:"immortals"},{label:"Imperial Harem",value:"imperial-harem"},{label:"Incest",value:"incest"},{label:"Incubus",value:"incubus"},{label:"Indecisive Protagonist",value:"indecisive-protagonist"},{label:"Industrialization",value:"industrialization"},{label:"Inferiority Complex",value:"inferiority-complex"},{label:"Inheritance",value:"inheritance"},{label:"Inscriptions",value:"inscriptions"},{label:"Insects",value:"insects"},{label:"Interconnected Storylines",value:"interconnected-storylines"},{label:"Interdimensional Travel",value:"interdimensional-travel"},{label:"Introverted Protagonist",value:"introverted-protagonist"},{label:"Investigations",value:"investigations"},{label:"Invisibility",value:"invisibility"},{label:"JSDF",value:"jsdf"},{label:"Jack of All Trades",value:"jack-of-all-trades"},{label:"Jealousy",value:"jealousy"},{label:"Jiangshi",value:"jiangshi"},{label:"Jobless Class",value:"jobless-class"},{label:"Jujutsu Kaisen",value:"jujutsu-kaisen"},{label:"Kidnappings",value:"kidnappings"},{label:"Kind Love Interests",value:"kind-love-interests"},{label:"Kingdom Building",value:"kingdom-building"},{label:"Kingdoms",value:"kingdoms"},{label:"Knights",value:"knights"},{label:"Kuudere",value:"kuudere"},{label:"Lack of Common Sense",value:"lack-of-common-sense"},{label:"Language Barrier",value:"language-barrier"},{label:"Late Romance",value:"late-romance"},{label:"Lawyers",value:"lawyers"},{label:"Lazy Protagonist",value:"lazy-protagonist"},{label:"Leadership",value:"leadership"},{label:"Legends",value:"legends"},{label:"Level System",value:"level-system"},{label:"Library",value:"library"},{label:"Limited Lifespan",value:"limited-lifespan"},{label:"Living Abroad",value:"living-abroad"},{label:"Living Alone",value:"living-alone"},{label:"Loli",value:"loli"},{label:"Loneliness",value:"loneliness"},{label:"Loner Protagonist",value:"loner-protagonist"},{label:"Long Separations",value:"long-separations"},{label:"Long-distance Relationship",value:"long-distance-relationship"},{label:"Lost Civilizations",value:"lost-civilizations"},{label:"Lottery",value:"lottery"},{label:"Love Interest Falls in Love First",value:"love-interest-falls-in-love-first"},{label:"Love Rivals",value:"love-rivals"},{label:"Love Triangles",value:"love-triangles"},{label:"Love at First Sight",value:"love-at-first-sight"},{label:"Lovers Reunited",value:"lovers-reunited"},{label:"Low-key Protagonist",value:"low-key-protagonist"},{label:"Loyal Subordinates",value:"loyal-subordinates"},{label:"Lucky Protagonist",value:"lucky-protagonist"},{label:"M*sturbation",value:"m-sturbation"},{label:"MMORPG",value:"mmorpg"},{label:"Mafia",value:"mafia"},{label:"Magic",value:"magic"},{label:"Magic Beasts",value:"magic-beasts"},{label:"Magic Formations",value:"magic-formations"},{label:"Magical Girls",value:"magical-girls"},{label:"Magical Space",value:"magical-space"},{label:"Magical Technology",value:"magical-technology"},{label:"Maids",value:"maids"},{label:"Male Protagonist",value:"male-protagonist"},{label:"Male Yandere",value:"male-yandere"},{label:"Male to Female",value:"male-to-female"},{label:"Management",value:"management"},{label:"Mangaka",value:"mangaka"},{label:"Manipulative Characters",value:"manipulative-characters"},{label:"Manly Gay Couple",value:"manly-gay-couple"},{label:"Marriage",value:"marriage"},{label:"Marriage of Convenience",value:"marriage-of-convenience"},{label:"Martial Spirits",value:"martial-spirits"},{label:"Marvel",value:"marvel"},{label:"Masochistic Characters",value:"masochistic-characters"},{label:"Master-Disciple Relationship",value:"master-disciple-relationship"},{label:"Master-Servant Relationship",value:"master-servant-relationship"},{label:"Matriarchy",value:"matriarchy"},{label:"Mature Protagonist",value:"mature-protagonist"},{label:"Medical Knowledge",value:"medical-knowledge"},{label:"Medieval",value:"medieval"},{label:"Mercenaries",value:"mercenaries"},{label:"Merchants",value:"merchants"},{label:"Military",value:"military"},{label:"Mind Break",value:"mind-break"},{label:"Mind Control",value:"mind-control"},{label:"Misandry",value:"misandry"},{label:"Mismatched Couple",value:"mismatched-couple"},{label:"Misunderstandings",value:"misunderstandings"},{label:"Mob Protagonist",value:"mob-protagonist"},{label:"Models",value:"models"},{label:"Modern Day",value:"modern-day"},{label:"Modern Knowledge",value:"modern-knowledge"},{label:"Money Grubber",value:"money-grubber"},{label:"Monster Girls",value:"monster-girls"},{label:"Monster Society",value:"monster-society"},{label:"Monster Tamer",value:"monster-tamer"},{label:"Monsters",value:"monsters"},{label:"Movies",value:"movies"},{label:"Mpreg",value:"mpreg"},{label:"Multiple Identities",value:"multiple-identities"},{label:"Multiple POV",value:"multiple-pov"},{label:"Multiple Personalities",value:"multiple-personalities"},{label:"Multiple Protagonists",value:"multiple-protagonists"},{label:"Multiple Realms",value:"multiple-realms"},{label:"Multiple Reincarnated Individuals",value:"multiple-reincarnated-individuals"},{label:"Multiple Timelines",value:"multiple-timelines"},{label:"Multiple Transported Individuals",value:"multiple-transported-individuals"},{label:"Murders",value:"murders"},{label:"Music",value:"music"},{label:"Mutated Creatures",value:"mutated-creatures"},{label:"Mutations",value:"mutations"},{label:"Mute Character",value:"mute-character"},{label:"Mysterious Family Background",value:"mysterious-family-background"},{label:"Mysterious Illness",value:"mysterious-illness"},{label:"Mysterious Past",value:"mysterious-past"},{label:"Mystery Solving",value:"mystery-solving"},{label:"Mythical Beasts",value:"mythical-beasts"},{label:"Mythology",value:"mythology"},{label:"Naive Protagonist",value:"naive-protagonist"},{label:"Narcissistic Protagonist",value:"narcissistic-protagonist"},{label:"Naruto",value:"naruto"},{label:"Nationalism",value:"nationalism"},{label:"Near-Death Experience",value:"near-death-experience"},{label:"Necromancer",value:"necromancer"},{label:"Neet",value:"neet"},{label:"Netorare",value:"netorare"},{label:"Netorase",value:"netorase"},{label:"Netori",value:"netori"},{label:"Nightmares",value:"nightmares"},{label:"Ninjas",value:"ninjas"},{label:"Nobles",value:"nobles"},{label:"Non-humanoid Protagonist",value:"non-humanoid-protagonist"},{label:"Non-linear Storytelling",value:"non-linear-storytelling"},{label:"Not-harem",value:"not-harem"},{label:"Nudity",value:"nudity"},{label:"Nurses",value:"nurses"},{label:"Obsessive Love",value:"obsessive-love"},{label:"Office Romance",value:"office-romance"},{label:"Older Love Interests",value:"older-love-interests"},{label:"Omegaverse",value:"omegaverse"},{label:"One Piece",value:"one-piece"},{label:"Oneshot",value:"oneshot"},{label:"Online Romance",value:"online-romance"},{label:"Onmyouji",value:"onmyouji"},{label:"Or*y",value:"or-y"},{label:"Orcs",value:"orcs"},{label:"Organized Crime",value:"organized-crime"},{label:"Orphans",value:"orphans"},{label:"Otaku",value:"otaku"},{label:"Otome Game",value:"otome-game"},{label:"Outcasts",value:"outcasts"},{label:"Outdoor Interc**rse",value:"outdoor-interc-rse"},{label:"Outer Space",value:"outer-space"},{label:"Overpowered Protagonist",value:"overpowered-protagonist"},{label:"Overprotective Siblings",value:"overprotective-siblings"},{label:"Pacifist Protagonist",value:"pacifist-protagonist"},{label:"Paizuri",value:"paizuri"},{label:"Parallel Worlds",value:"parallel-worlds"},{label:"Parasites",value:"parasites"},{label:"Parent Complex",value:"parent-complex"},{label:"Parody",value:"parody"},{label:"Part-Time Job",value:"part-time-job"},{label:"Past Plays a Big Role",value:"past-plays-a-big-role"},{label:"Past Trauma",value:"past-trauma"},{label:"Pe*verted Protagonist",value:"pe-verted-protagonist"},{label:"Persistent Love Interests",value:"persistent-love-interests"},{label:"Personality Changes",value:"personality-changes"},{label:"Pets",value:"pets"},{label:"Pharmacist",value:"pharmacist"},{label:"Philosophical",value:"philosophical"},{label:"Phobias",value:"phobias"},{label:"Phoenixes",value:"phoenixes"},{label:"Photography",value:"photography"},{label:"Pill Based Cultivation",value:"pill-based-cultivation"},{label:"Pill Concocting",value:"pill-concocting"},{label:"Pilots",value:"pilots"},{label:"Pirates",value:"pirates"},{label:"Playboys",value:"playboys"},{label:"Playful Protagonist",value:"playful-protagonist"},{label:"Poetry",value:"poetry"},{label:"Poisons",value:"poisons"},{label:"Police",value:"police"},{label:"Polite Protagonist",value:"polite-protagonist"},{label:"Politics",value:"politics"},{label:"Polyandry",value:"polyandry"},{label:"Polygamy",value:"polygamy"},{label:"Poor Protagonist",value:"poor-protagonist"},{label:"Poor to Rich",value:"poor-to-rich"},{label:"Popular Love Interests",value:"popular-love-interests"},{label:"Possession",value:"possession"},{label:"Possessive Characters",value:"possessive-characters"},{label:"Post-apocalyptic",value:"post-apocalyptic"},{label:"Power Couple",value:"power-couple"},{label:"Power Struggle",value:"power-struggle"},{label:"Pragmatic Protagonist",value:"pragmatic-protagonist"},{label:"Precognition",value:"precognition"},{label:"Pregnancy",value:"pregnancy"},{label:"Pretend Lovers",value:"pretend-lovers"},{label:"Previous Life Talent",value:"previous-life-talent"},{label:"Priestesses",value:"priestesses"},{label:"Priests",value:"priests"},{label:"Prison",value:"prison"},{label:"Proactive Protagonist",value:"proactive-protagonist"},{label:"Programmer",value:"programmer"},{label:"Prophecies",value:"prophecies"},{label:"Prostit**es",value:"prostit-es"},{label:"Protagonist Falls in Love First",value:"protagonist-falls-in-love-first"},{label:"Protagonist Strong from the Start",value:"protagonist-strong-from-the-start"},{label:"Protagonist with Multiple Bodies",value:"protagonist-with-multiple-bodies"},{label:"Psychic Powers",value:"psychic-powers"},{label:"Psychopaths",value:"psychopaths"},{label:"Puppeteers",value:"puppeteers"},{label:"Quiet Characters",value:"quiet-characters"},{label:"Quirky Characters",value:"quirky-characters"},{label:"R*pe",value:"r-pe"},{label:"R*pe Victim Becomes Lover",value:"r-pe-victim-becomes-lover"},{label:"R-15",value:"r-15"},{label:"R-18",value:"r-18"},{label:"Race Change",value:"race-change"},{label:"Racism",value:"racism"},{label:"Rebellion",value:"rebellion"},{label:"Reincarnated as a Monster",value:"reincarnated-as-a-monster"},{label:"Reincarnated as an Object",value:"reincarnated-as-an-object"},{label:"Reincarnated in Another World",value:"reincarnated-in-another-world"},{label:"Reincarnated in a Game World",value:"reincarnated-in-a-game-world"},{label:"Reincarnation",value:"reincarnation"},{label:"Religions",value:"religions"},{label:"Reluctant Protagonist",value:"reluctant-protagonist"},{label:"Reporters",value:"reporters"},{label:"Restaurant",value:"restaurant"},{label:"Resurrection",value:"resurrection"},{label:"Returning from Another World",value:"returning-from-another-world"},{label:"Revenge",value:"revenge"},{label:"Reverse Harem",value:"reverse-harem"},{label:"Reverse R*pe",value:"reverse-r-pe"},{label:"Reversible Couple",value:"reversible-couple"},{label:"Rich to Poor",value:"rich-to-poor"},{label:"Righteous Protagonist",value:"righteous-protagonist"},{label:"Rivalry",value:"rivalry"},{label:"Romantic Subplot",value:"romantic-subplot"},{label:"Roommates",value:"roommates"},{label:"Royalty",value:"royalty"},{label:"Ruthless Protagonist",value:"ruthless-protagonist"},{label:"S*ave Harem",value:"s-ave-harem"},{label:"S*ave Protagonist",value:"s-ave-protagonist"},{label:"S*aves",value:"s-aves"},{label:"S*x Friends",value:"s-x-friends"},{label:"S*x S*aves",value:"s-x-s-aves"},{label:"S*xual Abuse",value:"s-xual-abuse"},{label:"S*xual Cultivation Technique",value:"s-xual-cultivation-technique"},{label:"Sadistic Characters",value:"sadistic-characters"},{label:"Saints",value:"saints"},{label:"Salaryman",value:"salaryman"},{label:"Samurai",value:"samurai"},{label:"Saving the World",value:"saving-the-world"},{label:"Schemes And Conspiracies",value:"schemes-and-conspiracies"},{label:"Schizophrenia",value:"schizophrenia"},{label:"Scientists",value:"scientists"},{label:"Sculptors",value:"sculptors"},{label:"Sealed Power",value:"sealed-power"},{label:"Second Chance",value:"second-chance"},{label:"Secret Crush",value:"secret-crush"},{label:"Secret Identity",value:"secret-identity"},{label:"Secret Organizations",value:"secret-organizations"},{label:"Secret Relationship",value:"secret-relationship"},{label:"Secretive Protagonist",value:"secretive-protagonist"},{label:"Secrets",value:"secrets"},{label:"Sect Development",value:"sect-development"},{label:"Seduction",value:"seduction"},{label:"Seeing Things Other Humans Can't",value:"seeing-things-other-humans-cant"},{label:"Selfish Protagonist",value:"selfish-protagonist"},{label:"Selfless Protagonist",value:"selfless-protagonist"},{label:"Seme Protagonist",value:"seme-protagonist"},{label:"Senpai-Kouhai Relationship",value:"senpai-kouhai-relationship"},{label:"Sentient Objects",value:"sentient-objects"},{label:"Sentimental Protagonist",value:"sentimental-protagonist"},{label:"Serial Killers",value:"serial-killers"},{label:"Servants",value:"servants"},{label:"Seven Deadly Sins",value:"seven-deadly-sins"},{label:"Seven Virtues",value:"seven-virtues"},{label:"Shameless Protagonist",value:"shameless-protagonist"},{label:"Shapeshifters",value:"shapeshifters"},{label:"Sharing A Body",value:"sharing-a-body"},{label:"Sharp-tongued Characters",value:"sharp-tongued-characters"},{label:"Shield User",value:"shield-user"},{label:"Shikigami",value:"shikigami"},{label:"Short Story",value:"short-story"},{label:"Shota",value:"shota"},{label:"Shoujo-Ai Subplot",value:"shoujo-ai-subplot"},{label:"Shounen-Ai Subplot",value:"shounen-ai-subplot"},{label:"Showbiz",value:"showbiz"},{label:"Shy Characters",value:"shy-characters"},{label:"Sibling Rivalry",value:"sibling-rivalry"},{label:"Sibling's Care",value:"siblings-care"},{label:"Siblings",value:"siblings"},{label:"Siblings Not Related by Blood",value:"siblings-not-related-by-blood"},{label:"Sickly Characters",value:"sickly-characters"},{label:"Sign Language",value:"sign-language"},{label:"Singers",value:"singers"},{label:"Single Parent",value:"single-parent"},{label:"Sister Complex",value:"sister-complex"},{label:"Skill Assimilation",value:"skill-assimilation"},{label:"Skill Books",value:"skill-books"},{label:"Skill Creation",value:"skill-creation"},{label:"Sleeping",value:"sleeping"},{label:"Slow Growth at Start",value:"slow-growth-at-start"},{label:"Slow Romance",value:"slow-romance"},{label:"Smart Couple",value:"smart-couple"},{label:"Social Outcasts",value:"social-outcasts"},{label:"Soldiers",value:"soldiers"},{label:"Soul Power",value:"soul-power"},{label:"Souls",value:"souls"},{label:"Spatial Manipulation",value:"spatial-manipulation"},{label:"Spear Wielder",value:"spear-wielder"},{label:"Special Abilities",value:"special-abilities"},{label:"Spies",value:"spies"},{label:"Spirit Advisor",value:"spirit-advisor"},{label:"Spirit Users",value:"spirit-users"},{label:"Spirits",value:"spirits"},{label:"Stalkers",value:"stalkers"},{label:"Stockholm Syndrome",value:"stockholm-syndrome"},{label:"Stoic Characters",value:"stoic-characters"},{label:"Store Owner",value:"store-owner"},{label:"Straight Seme",value:"straight-seme"},{label:"Straight Uke",value:"straight-uke"},{label:"Strategic Battles",value:"strategic-battles"},{label:"Strategist",value:"strategist"},{label:"Strength-based Social Hierarchy",value:"strength-based-social-hierarchy"},{label:"Strong Background",value:"strong-background"},{label:"Strong Love Interests",value:"strong-love-interests"},{label:"Strong to Stronger",value:"strong-to-stronger"},{label:"Stubborn Protagonist",value:"stubborn-protagonist"},{label:"Student Council",value:"student-council"},{label:"Student-Teacher Relationship",value:"student-teacher-relationship"},{label:"Succubus",value:"succubus"},{label:"Sudden Strength Gain",value:"sudden-strength-gain"},{label:"Sudden Wealth",value:"sudden-wealth"},{label:"Suicides",value:"suicides"},{label:"Summoned Hero",value:"summoned-hero"},{label:"Summoning Magic",value:"summoning-magic"},{label:"Survival",value:"survival"},{label:"Survival Game",value:"survival-game"},{label:"Sword And Magic",value:"sword-and-magic"},{label:"Sword Wielder",value:"sword-wielder"},{label:"System",value:"system"},{label:"System Administrator",value:"system-administrator"},{label:"Teachers",value:"teachers"},{label:"Teamwork",value:"teamwork"},{label:"Technological Gap",value:"technological-gap"},{label:"Tentacles",value:"tentacles"},{label:"Terminal Illness",value:"terminal-illness"},{label:"Territory Management",value:"territory-management"},{label:"Terrorists",value:"terrorists"},{label:"Thieves",value:"thieves"},{label:"Threesome",value:"threesome"},{label:"Thriller",value:"thriller"},{label:"Time Loop",value:"time-loop"},{label:"Time Manipulation",value:"time-manipulation"},{label:"Time Paradox",value:"time-paradox"},{label:"Time Skip",value:"time-skip"},{label:"Time Travel",value:"time-travel"},{label:"Timid Protagonist",value:"timid-protagonist"},{label:"Tomboyish Female Lead",value:"tomboyish-female-lead"},{label:"Torture",value:"torture"},{label:"Toys",value:"toys"},{label:"Tragic Past",value:"tragic-past"},{label:"Transformation Ability",value:"transformation-ability"},{label:"Transmigration",value:"transmigration"},{label:"Transplanted Memories",value:"transplanted-memories"},{label:"Transported Modern Structure",value:"transported-modern-structure"},{label:"Transported into a Game World",value:"transported-into-a-game-world"},{label:"Transported to Another World",value:"transported-to-another-world"},{label:"Trap",value:"trap"},{label:"Tribal Society",value:"tribal-society"},{label:"Trickster",value:"trickster"},{label:"Tsundere",value:"tsundere"},{label:"Twins",value:"twins"},{label:"Twisted Personality",value:"twisted-personality"},{label:"Ugly Protagonist",value:"ugly-protagonist"},{label:"Ugly to Beautiful",value:"ugly-to-beautiful"},{label:"Unconditional Love",value:"unconditional-love"},{label:"Underestimated Protagonist",value:"underestimated-protagonist"},{label:"Unique Cultivation Technique",value:"unique-cultivation-technique"},{label:"Unique Weapon User",value:"unique-weapon-user"},{label:"Unique Weapons",value:"unique-weapons"},{label:"Unlimited Flow",value:"unlimited-flow"},{label:"Unlucky Protagonist",value:"unlucky-protagonist"},{label:"Unreliable Narrator",value:"unreliable-narrator"},{label:"Unrequited Love",value:"unrequited-love"},{label:"Valkyries",value:"valkyries"},{label:"Vampires",value:"vampires"},{label:"Villain",value:"villain"},{label:"Villainess Noble Girls",value:"villainess-noble-girls"},{label:"Virtual Reality",value:"virtual-reality"},{label:"Vocaloid",value:"vocaloid"},{label:"Voice Actors",value:"voice-actors"},{label:"Voyeurism",value:"voyeurism"},{label:"Waiters",value:"waiters"},{label:"War Records",value:"war-records"},{label:"Wars",value:"wars"},{label:"Weak Protagonist",value:"weak-protagonist"},{label:"Weak to Strong",value:"weak-to-strong"},{label:"Wealthy Characters",value:"wealthy-characters"},{label:"Werebeasts",value:"werebeasts"},{label:"Wishes",value:"wishes"},{label:"Witches",value:"witches"},{label:"Wizards",value:"wizards"},{label:"World Hopping",value:"world-hopping"},{label:"World Travel",value:"world-travel"},{label:"World Tree",value:"world-tree"},{label:"Writers",value:"writers"},{label:"Yandere",value:"yandere"},{label:"Youkai",value:"youkai"},{label:"Younger Brothers",value:"younger-brothers"},{label:"Younger Love Interests",value:"younger-love-interests"},{label:"Younger Sisters",value:"younger-sisters"},{label:"Zombies",value:"zombies"},{label:"e-Sports",value:"e-sports"}]}}}return r.prototype.checkCaptcha=function(e){var l=e("title").text();if("Attention Required! | Cloudflare"===l||"Just a moment..."===l)throw new Error("Captcha error, please open in webview")},r.prototype.popularNovels=function(a,t){return e(this,arguments,void 0,(function(e,a){var t,i,o,r,s,n=a.filters;return l(this,(function(l){switch(l.label){case 0:return[4,this.getAllNovels()];case 1:return t=l.sent(),i=t.filter((function(e){for(var l=0,a=n.genre.value.exclude||[];l<a.length;l++){var t=a[l];if(e.genres.includes(t))return!1}for(var i=0,o=n.genre.value.include||[];i<o.length;i++){t=o[i];if(!e.genres.includes(t))return!1}for(var r=0,s=n.tag.value.exclude||[];r<s.length;r++){var u=s[r];if(e.tags.includes(u))return!1}for(var v=0,b=n.tag.value.include||[];v<b.length;v++){u=b[v];if(!e.tags.includes(u))return!1}return!0})),o=(null===(s=null==n?void 0:n.order)||void 0===s?void 0:s.value)||"reviewCount",r=i.sort((function(e,l){return l[o]-e[o]})),[2,this.paginate(r,e).map((function(e){return{name:e.name,path:e.path,cover:e.cover}}))]}}))}))},r.prototype.convertNovelId=function(e){for(var l=1999999997n,a=1n,t=7n,i=e;i>0;1n===(1n&i)&&(a=a*t%l),t=t*t%l,i>>=1n);return a},r.prototype.parseNovel=function(o){return e(this,void 0,void 0,(function(){var e,r,s,n,u,v,b,c,d,g=this;return l(this,(function(l){switch(l.label){case 0:return e=this.site+o,[4,(0,i.fetchApi)(e)];case 1:return[4,l.sent().text()];case 2:return r=l.sent(),s=(0,t.load)(r),this.checkCaptcha(s),n=s("#novel-code").text(),u=this.convertNovelId(BigInt(parseInt(n))),[4,(0,i.fetchApi)(this._chapSite+"wp-json/wp/v2/posts?tags="+u+"&per_page=500&page=1")];case 3:return v=l.sent(),b=parseInt(v.headers.get("X-Wp-Totalpages"))||1,[4,v.json()];case 4:return d=[[l.sent()]],[4,Promise.all(new Array(b-1).fill(0).map((function(e,l){return l+2})).map((function(e){return(0,i.fetchApi)(g._chapSite+"wp-json/wp/v2/posts?tags="+u+"&per_page=500&page="+e).then((function(e){return e.json()}))})))];case 5:return c=a.apply(void 0,d.concat([l.sent(),!0])).flat(),[2,{path:o,name:s("h1.novel-title").text()||"Untitled",cover:s("img.novel-image").attr("src"),summary:s("div.synopsis.w-richtext").text().trim(),chapters:c.map((function(e){return{name:e.acf.ch_name,path:"chapter/"+e.acf.novel_code+"-"+e.acf.chapter_number,releaseTime:e.date,chapterNumber:e.acf.chapter_number}})).reverse(),status:s(".novelstatustextlarge").text(),author:s("div.additionalinfo.tm10 > div.textwrapper:nth-child(1)").toArray().filter((function(e){return 2==e.children.length&&"Author:"===e.children[0].children[0].data}))[0].children[1].children[0].data,genres:s(".genre-tags").map((function(e,l){return s(l).text()})).toArray().join(",")}]}}))}))},r.prototype.parseChapter=function(a){return e(this,void 0,void 0,(function(){var e,o;return l(this,(function(l){switch(l.label){case 0:return[4,(0,i.fetchApi)(this.site+a)];case 1:return[4,l.sent().text()];case 2:return e=l.sent(),o=(0,t.load)(e),this.checkCaptcha(o),[2,o("#chapter > span").html()||""]}}))}))},r.prototype.searchNovels=function(a,t){return e(this,void 0,void 0,(function(){var e,i;return l(this,(function(l){switch(l.label){case 0:return[4,this.getAllNovels()];case 1:return e=l.sent(),i=e.filter((function(e){return e.name.toLowerCase().includes(a.toLowerCase())})),[2,this.paginate(i,t).map((function(e){return{name:e.name,path:e.path,cover:e.cover}}))]}}))}))},r.prototype.paginate=function(e,l){var a=20*(l-1),t=a+20;return e.slice(a,t)},r.prototype.getAllNovels=function(){return e(this,void 0,void 0,(function(){var e;return l(this,(function(l){switch(l.label){case 0:return this._allNovelsPromise?[4,this._allNovelsPromise]:[3,2];case 1:l.sent(),l.label=2;case 2:if(this._allNovels)return[2,this._allNovels];this._allNovelsPromise=this.loadAll(),l.label=3;case 3:return l.trys.push([3,,5,6]),e=this,[4,this._allNovelsPromise];case 4:return e._allNovels=l.sent(),[3,6];case 5:return this._allNovelsPromise=void 0,[7];case 6:return[2,this._allNovels]}}))}))},r.prototype.loadAll=function(){return e(this,void 0,void 0,(function(){var a,t,o,r,s,n,u,v,b=this;return l(this,(function(c){switch(c.label){case 0:return a=this._chapSite+"wp-json/wp/v2/mvl-novels",t=function(t,o){return e(b,void 0,void 0,(function(){var e,r,s;return l(this,(function(l){switch(l.label){case 0:return e="".concat(a,"?per_page=").concat(o,"&page=").concat(t),[4,(0,i.fetchApi)(e)];case 1:return[4,l.sent().text()];case 2:if(!(r=l.sent()))return[2,[]];try{return s=JSON.parse(r),[2,Array.isArray(s)?s:[]]}catch(e){return[2,[]]}return[2]}}))}))},[4,Promise.all([t(1,1e4),t(11,1e3),t(12,1e3),t(13,1e3)])];case 1:return o=c.sent(),r=o[0],s=o[1],n=o[2],u=o[3],v=r.concat(s,n,u),[2,v.map((function(e){return{name:e.name,path:"novel/"+e.slug,cover:"https://assets.mvlempyr.app/images/600/".concat(e["novel-code"],".webp"),avgReview:e["average-review"],reviewCount:e["total-reviews"],chapterCount:e["total-chapters"],created:new Date(e.createdOn).getTime(),genres:e.genre,tags:e.tags,random:Math.random()}}))]}}))}))},r}();exports.default=new r;
// ===== Parte 2 · Corrección (Tianshuge-Sources/extensions) =====
// La parte 1 descarga el catálogo entero para listar y buscar; aquí esas
// operaciones usan la API pública de la web con pocas peticiones:
//   - La lista inicial son las obras más nuevas (la API no ordena por
//     popularidad) con orden elegible: recientes, antiguas, A-Z y Z-A.
//   - La búsqueda va por capas: código numérico, slug exacto (con variantes
//     the-/a-/an-) y prefijo por orden alfabético con búsqueda binaria.
//   - Los filtros de género, etiqueta, idioma y estado barren en local sobre
//     páginas de 300 (acotado a 4 peticiones por página de la app).
//   - La ficha sale de la API (1 petición) y el índice por páginas de 500
//     (parsePage), sin bajar el HTML de la obra.
// La parte 1 sigue encargándose del texto de cada capítulo.
;(function () {
  var plugin = exports.default;
  // El módulo, no la función: el motor conecta la red justo antes de cada operación.
  var fetchLib = require('@libs/fetch');
  var NovelStatus = require('@libs/novelStatus').NovelStatus;
  var FilterTypes = require('@libs/filterInputs').FilterTypes;
  var storage = require('@libs/storage').storage;
  var defaultCover = require('@libs/defaultCover').defaultCover;

  plugin.version = '1.0.16';

  var CHAP = plugin._chapSite || 'https://chap.heliosarchive.online/';
  var API_NOVELS = CHAP + 'wp-json/wp/v2/mvl-novels';
  var API_POSTS = CHAP + 'wp-json/wp/v2/posts';
  var PAGE_LEN = 20;
  var PAUSE_MS = 250;

  function pause(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }

  function shortUrl(url) { return String(url).replace(/^https:\/\/[^/]+/, ''); }

  // GET que devuelve { data, total }: data es la lista (o []) y total el
  // X-WP-Total de la cabecera. Una página fuera de rango (400
  // rest_post_invalid_page_number) es lista vacía, no error; lo demás sí falla.
  function apiGet(url) {
    return fetchLib.fetchApi(url).then(function (res) {
      if (res.ok) {
        return res.json().then(function (data) {
          return { data: data, total: headerTotal(res) };
        });
      }
      return res.text().then(function (body) {
        var code = '';
        try { code = JSON.parse(body).code || ''; } catch (e) { /* no es JSON */ }
        if (code === 'rest_post_invalid_page_number') return { data: [], total: 0 };
        throw new Error('La API devolvió ' + res.status + ' en ' + shortUrl(url));
      });
    });
  }

  function headerTotal(res) {
    try {
      var n = parseInt(res.headers.get('X-WP-Total'), 10);
      return isNaN(n) ? 0 : n;
    } catch (e) { return 0; }
  }

  function queryUrl(base, params) {
    var q = Object.keys(params).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&');
    return base + '?' + q;
  }

  function novelsUrl(params) { return queryUrl(API_NOVELS, params); }
  function postsUrl(params) { return queryUrl(API_POSTS, params); }

  // Regla del slug, como el sanitize_title de WordPress (comprobada el
  // 15/10/2026 con "Trash of the Count's Family" → trash-of-the-counts-family,
  // "1% Lifesteal" → 1-lifesteal, "You're …" → you-re-…): minúsculas, sin
  // tildes; los apóstrofos desaparecen; cada grupo de lo demás que no es letra
  // ni cifra pasa a un solo '-'.
  function toSlug(text) {
    var s = String(text || '');
    if (typeof s.normalize === 'function') s = s.normalize('NFD');
    s = s.replace(/[\u0300-\u036f]/g, '');
    s = s.replace(/['\u2019\u2018`\u00b4]/g, '');
    return s.toLowerCase().replace(/[^a-z0-9\u0080-\uffff]+/g, '-').replace(/^-+|-+$/g, '');
  }

  // Géneros y etiqueta que marcan contenido sexual explícito en la taxonomía
  // propia de la web (vistos en sus datos el 15/10/2026): se ocultan con el
  // ajuste hideAdult, activado por defecto. Son Adult, Smut y Ecchi, más la
  // etiqueta R-18. Mature NO se oculta: la web lo usa como aviso amplio
  // (violencia, temas oscuros) y lo llevan obras mayoritarias como
  // lord-of-the-mysteries; lo explícito de verdad lleva además R-18.
  // Sin pedir más peticiones: si al quitarlas una página trae menos de 20,
  // se devuelve lo que hay.
  var ADULT_GENRES = ['adult', 'smut', 'ecchi'];
  var ADULT_TAGS = ['r-18'];
  function hideAdult() { return storage.get('hideAdult') !== false; }
  function isAdult(novel) {
    var genres = novel.genre || [];
    for (var i = 0; i < genres.length; i++) {
      if (ADULT_GENRES.indexOf(toSlug(genres[i])) >= 0) return true;
    }
    var tags = novel.tags || [];
    for (var j = 0; j < tags.length; j++) {
      if (ADULT_TAGS.indexOf(String(tags[j]).toLowerCase()) >= 0) return true;
    }
    return false;
  }
  function visible(novels) {
    if (!hideAdult()) return novels;
    return novels.filter(function (n) { return !isAdult(n); });
  }

  // Fila de lista: misma forma y portada que la parte 2 anterior (la portada
  // por código no se descarga, sólo se devuelve su dirección).
  function row(novel) {
    return {
      name: novel.name || '',
      path: 'novel/' + (novel.slug || ''),
      cover: novel['novel-code']
        ? ('https://assets.mvlempyr.app/images/600/' + novel['novel-code'] + '.webp')
        : defaultCover
    };
  }

  // Lee un filtro como lo manda la app ({ clave: { value } }), con el valor
  // declarado como alternativa.
  function picked(filters, key) {
    if (filters && filters[key] && filters[key].value !== undefined) return filters[key].value;
    var def = plugin.filters[key];
    return def ? def.value : undefined;
  }
  function asArray(v) {
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
  }
  function exGroup(v) {
    if (Array.isArray(v)) return { include: v, exclude: [] };
    v = v || {};
    return { include: asArray(v.include), exclude: asArray(v.exclude) };
  }

  // Órdenes que el servidor sí sabe hacer (comprobados el 15/10/2026): por fecha
  // de alta (date) y alfabético por slug. La API no ordena por popularidad,
  // valoración, reseñas ni capítulos: esas opciones de la parte 1 se quitan en
  // vez de dejarlas sin efecto. La lista inicial son las más nuevas.
  plugin.filters.order = {
    type: FilterTypes.Picker, label: 'Order by', value: 'latest',
    options: [
      { label: 'Latest Added', value: 'latest' },
      { label: 'Oldest Added', value: 'oldest' },
      { label: 'Name (A-Z)', value: 'az' },
      { label: 'Name (Z-A)', value: 'za' }
    ]
  };
  // Listas propias de la web: su formulario de /advanced-search (15/10/2026).
  // Los géneros y etiquetas se reutilizan tal cual de la parte 1 (su misma
  // taxonomía: comprobados contra los datos el 15/10/2026).
  plugin.filters.status = {
    type: FilterTypes.Picker, label: 'Status', value: 'all',
    options: [
      { label: 'All', value: 'all' },
      { label: 'Ongoing', value: 'ongoing' },
      { label: 'Completed', value: 'completed' },
      { label: 'Hiatus', value: 'hiatus' }
    ]
  };
  plugin.filters.language = {
    type: FilterTypes.CheckboxGroup, label: 'Language', value: [],
    options: [
      { label: 'Chinese', value: 'Chinese' },
      { label: 'English', value: 'English' },
      { label: 'Japanese', value: 'Japanese' },
      { label: 'Korean', value: 'Korean' }
    ]
  };
  plugin.pluginSettings = {
    hideAdult: { type: FilterTypes.Switch, label: 'Hide adult content', value: true }
  };

  function orderParams(order) {
    if (order === 'oldest') return { orderby: 'date', order: 'asc' };
    if (order === 'az') return { orderby: 'slug', order: 'asc' };
    if (order === 'za') return { orderby: 'slug', order: 'desc' };
    return { orderby: 'date', order: 'desc' }; // latest, por defecto
  }

  plugin.popularNovels = function (page, opts) {
    page = parseInt(page, 10) || 1;
    if (page < 1) page = 1;
    opts = opts || {};
    if (opts.showLatestNovels) return latest(page);
    var filters = opts.filters || {};
    var order = picked(filters, 'order') || 'latest';
    var genre = exGroup(picked(filters, 'genre'));
    var tag = exGroup(picked(filters, 'tag'));
    var langs = asArray(picked(filters, 'language'));
    var status = picked(filters, 'status') || 'all';
    if (!genre.include.length && !genre.exclude.length && !tag.include.length &&
        !tag.exclude.length && !langs.length && (!status || status === 'all')) {
      var params = orderParams(order);
      params.per_page = PAGE_LEN;
      params.page = page;
      return apiGet(novelsUrl(params)).then(function (r) {
        return visible(r.data).map(row);
      });
    }
    return sweep(page, order, genre, tag, langs, status);
  };

  // Barrido acotado para género/etiqueta/idioma/estado: el servidor no filtra
  // por ellos, así que se piden páginas de 300 en el orden elegido y se filtra
  // en local. Como mucho 4 peticiones por página de la app. El cursor (pequeño,
  // 30 min) deja a la página 2 continuar donde acabó la 1; sin cursor se
  // empieza en un punto fijo según la página, así que nunca se repite la 1.
  var SWEEP_PER = 300, SWEEP_MAX = 4, CURSOR_MIN = 30;
  function cursorKey(order, genre, tag, langs, status) {
    return 'mv_f_' + order + '|' + JSON.stringify([genre, tag, langs, status]);
  }
  function matchSweep(novel, genre, tag, langs, status) {
    var gs = (novel.genre || []).map(toSlug);
    var i;
    for (i = 0; i < genre.include.length; i++) {
      if (gs.indexOf(genre.include[i]) < 0) return false;
    }
    for (i = 0; i < genre.exclude.length; i++) {
      if (gs.indexOf(genre.exclude[i]) >= 0) return false;
    }
    var ts = (novel.tags || []).map(toSlug);
    for (i = 0; i < tag.include.length; i++) {
      if (ts.indexOf(tag.include[i]) < 0) return false;
    }
    for (i = 0; i < tag.exclude.length; i++) {
      if (ts.indexOf(tag.exclude[i]) >= 0) return false;
    }
    if (langs.length) {
      var lang = String(novel.language || '').toLowerCase();
      var okLang = langs.some(function (l) { return String(l).toLowerCase() === lang; });
      if (!okLang) return false;
    }
    if (status && status !== 'all' && String(novel.status || '').toLowerCase() !== status) return false;
    return true;
  }
  function sweep(page, order, genre, tag, langs, status) {
    var key = cursorKey(order, genre, tag, langs, status);
    var start = (page - 1) * SWEEP_MAX + 1;
    var cursor = storage.get(key);
    if (cursor && cursor.page === page - 1 && cursor.next > 0) start = cursor.next;
    var found = [];
    var apiPage = start;
    var fetched = 0;
    var base = orderParams(order);
    function step() {
      if (found.length >= PAGE_LEN || fetched >= SWEEP_MAX) return Promise.resolve(found);
      var p = apiPage++;
      return (fetched ? pause(PAUSE_MS) : Promise.resolve()).then(function () {
        return apiGet(novelsUrl({ per_page: SWEEP_PER, page: p, orderby: base.orderby, order: base.order }));
      }).then(function (r) {
        fetched++;
        var items = Array.isArray(r.data) ? r.data : [];
        for (var i = 0; i < items.length && found.length < PAGE_LEN; i++) {
          if (matchSweep(items[i], genre, tag, langs, status)) found.push(items[i]);
        }
        storage.set(key, { page: page, next: apiPage }, Date.now() + CURSOR_MIN * 60 * 1000);
        if (!items.length) return found; // fin del catálogo
        return step();
      });
    }
    return step().then(function (items) { return visible(items).map(row); });
  }

  // Novedades: obras con capítulos nuevos. Una petición de 100 capítulos
  // (sólo id, fecha y acf) y se quitan las repetidas por novel_code. Los slugs
  // se confirman en una sola petición; los pocos que no resuelven van por
  // código (máx. 5) y el resto se descarta.
  var RECENT_PER = 100, RECENT_MIN = 30;
  function latest(page) {
    return apiGet(postsUrl({ per_page: RECENT_PER, page: page, _fields: 'id,date,acf' }))
      .then(function (r) {
        var items = Array.isArray(r.data) ? r.data : [];
        var seen = {};
        var codes = [];
        var names = {};
        items.forEach(function (it) {
          var acf = it.acf || {};
          var code = acf.novel_code;
          if (!code || seen[code]) return;
          seen[code] = true;
          codes.push(code);
          names[code] = acf.novel_name || '';
        });
        var prev = storage.get('mv_recent') || {};
        if (page > 1 && prev.page === page - 1 && prev.codes) {
          codes = codes.filter(function (c) { return prev.codes.indexOf(c) < 0; });
        }
        storage.set('mv_recent', { page: page, codes: codes }, Date.now() + RECENT_MIN * 60 * 1000);
        return { codes: codes.slice(0, PAGE_LEN), names: names };
      })
      .then(function (info) {
        if (!info.codes.length) return [];
        var slugs = [];
        info.codes.forEach(function (code) {
          var s = toSlug(info.names[code]);
          if (s && slugs.indexOf(s) < 0) slugs.push(s);
        });
        var byCode = {};
        function take(records) {
          (records || []).forEach(function (n) {
            if (n && info.codes.indexOf(n['novel-code']) >= 0) byCode[n['novel-code']] = n;
          });
        }
        var chain = Promise.resolve();
        if (slugs.length) {
          var q = slugs.map(function (s) { return 'slug[]=' + encodeURIComponent(s); }).join('&');
          chain = chain.then(function () { return pause(PAUSE_MS); })
            .then(function () { return apiGet(API_NOVELS + '?' + q + '&per_page=100'); })
            .then(function (r) { take(r.data); });
        }
        chain = chain.then(function () {
          var missing = info.codes.filter(function (c) { return !byCode[c]; }).slice(0, 5);
          function next() {
            if (!missing.length) return Promise.resolve();
            var c = missing.shift();
            return pause(PAUSE_MS)
              .then(function () { return apiGet(novelsUrl({ search: String(c) })); })
              .then(function (r) { take(r.data); return next(); });
          }
          return next();
        });
        return chain.then(function () {
          var out = [];
          info.codes.forEach(function (c) { if (byCode[c]) out.push(byCode[c]); });
          return visible(out).map(row);
        });
      });
  }

  // Cota superior fija para la búsqueda binaria (el catálogo ronda 12 000 obras
  // el 15/10/2026): el total en vivo (X-WP-Total) no se puede usar porque el
  // banco de pruebas no graba cabeceras y la repetición sin red debe pedir las
  // mismas direcciones. Si el catálogo pasa de 14 000, las sondas lo notan
  // (ver prefixSearch) y hay que subir esta cota.
  var HI0 = 16383;
  plugin.searchNovels = function (term, page) {
    page = parseInt(page, 10) || 1;
    if (page > 1) return Promise.resolve([]);
    var q = String(term || '').trim();
    if (!q) return Promise.resolve([]);
    var s = toSlug(q);
    // Capa 1: código numérico, lo único que el search= del servidor entiende.
    var codeReq = /^\d+$/.test(q)
      ? apiGet(novelsUrl({ search: q })).then(function (r) { return r.data; })
      : Promise.resolve([]);
    // Capa 2: slug exacto, con variantes the-/a-/an- (una sola petición). Si el
    // texto trae apóstrofo se prueba también con '-' en su lugar: la web usa
    // las dos formas (counts frente a you-re, 15/10/2026).
    var variants = [];
    if (s) {
      var sa = toSlugApos(q);
      [s, 'the-' + s, 'a-' + s, 'an-' + s, sa, 'the-' + sa].forEach(function (v) {
        if (v && variants.indexOf(v) < 0) variants.push(v);
      });
    }
    var exactReq = variants.length
      ? apiGet(API_NOVELS + '?' + variants.map(function (v) {
          return 'slug[]=' + encodeURIComponent(v);
        }).join('&') + '&per_page=100').then(function (r) { return r.data; })
      : Promise.resolve([]);
    return Promise.all([codeReq, exactReq]).then(function (parts) {
      var found = [];
      var seenPaths = {};
      function add(n) {
        if (!n || !n.slug || seenPaths['novel/' + n.slug]) return;
        seenPaths['novel/' + n.slug] = true;
        found.push(n);
      }
      (Array.isArray(parts[0]) ? parts[0] : []).forEach(add);
      (Array.isArray(parts[1]) ? parts[1] : []).forEach(add);
      if (found.length) return visible(found).slice(0, PAGE_LEN).map(row);
      // Capa 3: prefijo por orden alfabético (slug y variante the-).
      if (!s) return [];
      return prefixSearch(s).then(function (records) {
        return visible(records).slice(0, PAGE_LEN).map(row);
      });
    });
  };
  // Variante del slug con cada apóstrofo como '-': "you're" → "you-re" (la web
  // usa las dos formas según la obra).
  function toSlugApos(text) {
    var s = String(text || '');
    if (typeof s.normalize === 'function') s = s.normalize('NFD');
    s = s.replace(/[\u0300-\u036f]/g, '');
    s = s.replace(/['\u2019\u2018`\u00b4]/g, '-');
    return s.toLowerCase().replace(/[^a-z0-9\u0080-\uffff]+/g, '-').replace(/^-+|-+$/g, '');
  }

  // Prefijo sobre orderby=slug: búsqueda binaria multi-objetivo (cada sonda
  // vale para los dos intervalos) y ventanas finales de hasta 100 (una segunda
  // si la zona quedó sin cubrir). Tandas de 6 como mucho. La comparación es la
  // de JS (por unidades de código): coincide con la colación de la base de
  // datos en letras, cifras y '-' (comprobado el 15/10/2026); la ventana
  // empieza 20 antes por si algún carácter raro ordena distinto.
  function prefixSearch(s) {
    var tg = [s, 'the-' + s];
    var N = HI0 + 1; // posiciones 0..HI0
    var lo = [0, 0];
    var hi = [HI0, HI0];
    var alive = [true, true];
    var overflow = false;
    // El total real que dice el servidor en la primera tanda (X-WP-Total): con él,
    // la búsqueda no gasta tandas sondeando el hueco entre el final del catálogo y
    // la cota fija HI0 (sin él, un prefijo del último tramo quedaba sin cubrir).
    var seenTotal = 0;
    function fetchSlug(offset) {
      return apiGet(novelsUrl({ orderby: 'slug', order: 'asc', per_page: 1, offset: offset }))
        .then(function (r) {
          if (r.total > seenTotal) seenTotal = r.total;
          var items = Array.isArray(r.data) ? r.data : [];
          return items.length ? items[0].slug : null; // null = más allá del final
        });
    }
    var rounds = 0;
    function round() {
      if (rounds >= 3) return Promise.resolve();
      var offsets = [];
      for (var i = 0; i < tg.length; i++) {
        if (!alive[i] || lo[i] >= hi[i]) continue;
        var fr = rounds === 0 ? [1 / 7, 2 / 7, 3 / 7, 4 / 7, 5 / 7, 1] : [1 / 4, 2 / 4, 3 / 4];
        for (var f = 0; f < fr.length; f++) {
          var k = lo[i] + Math.floor((hi[i] - lo[i] + 1) * fr[f]);
          if (k > hi[i]) k = hi[i];
          if (offsets.indexOf(k) < 0) offsets.push(k);
          if (rounds > 0 && offsets.length >= 6) break;
        }
        if (rounds > 0 && offsets.length >= 6) break;
      }
      if (!offsets.length) return Promise.resolve();
      rounds++;
      return (rounds > 1 ? pause(PAUSE_MS) : Promise.resolve()).then(function () {
        return Promise.all(offsets.map(function (k) {
          return fetchSlug(k).then(function (slug) { return { k: k, slug: slug }; });
        }));
      }).then(function (res) {
        res.forEach(function (r) {
          // La sonda del final en la primera tanda vigila la cota: si hay obra
          // en HI0, el catálogo ya no cabe y hay que subir HI0 (falla alto).
          if (rounds === 1 && r.k === HI0 && r.slug !== null) overflow = true;
          for (var i = 0; i < tg.length; i++) {
            if (!alive[i] || r.k < lo[i] || r.k > hi[i]) continue;
            if (r.slug === null) hi[i] = Math.min(hi[i], r.k - 1);
            else if (r.slug < tg[i]) lo[i] = Math.max(lo[i], r.k + 1);
            else hi[i] = r.k;
            if (lo[i] > hi[i]) alive[i] = false;
          }
        });
        // Con el total real, el último puesto posible es el último de verdad.
        if (rounds === 1 && seenTotal > 0) {
          for (var j = 0; j < tg.length; j++) {
            if (!alive[j]) continue;
            hi[j] = Math.min(hi[j], seenTotal - 1);
            if (lo[j] > hi[j]) alive[j] = false;
          }
        }
        return round();
      });
    }
    // El filtro ignora los '-' de ambos lados: así valen las dos formas del
    // apóstrofo (counts y you-re) y otras diferencias de guiones.
    function matchPrefix(slug, target) {
      var a = String(slug || '').replace(/-/g, '');
      var b = String(target || '').replace(/-/g, '');
      return a.indexOf(b) === 0;
    }
    function windowFor(i) {
      if (!alive[i] && lo[i] > hi[i]) return Promise.resolve({ i: i, items: [] });
      var L = Math.max(0, lo[i] - 20);
      var P = Math.min(100, hi[i] + 21 - L);
      if (P <= 0) return Promise.resolve({ i: i, items: [] });
      return apiGet(novelsUrl({ orderby: 'slug', order: 'asc', per_page: P, offset: L }))
        .then(function (r) { return { i: i, items: Array.isArray(r.data) ? r.data : [], L: L, P: P }; });
    }
    return round().then(function () {
      if (overflow) throw new Error('El catálogo supera ' + N + ' obras: hay que subir la cota HI0 de la búsqueda');
      return pause(PAUSE_MS);
    }).then(function () {
      return Promise.all([windowFor(0), windowFor(1)]);
    }).then(function (ws) {
      var out = [];
      var seenP = {};
      var counts = [0, 0];
      function takeItems(items, i) {
        var c = 0;
        (items || []).forEach(function (n) {
          if (out.length >= PAGE_LEN) return;
          if (!n || !n.slug || seenP[n.slug]) return;
          if (!matchPrefix(n.slug, tg[i])) return;
          seenP[n.slug] = true;
          out.push(n);
          c++;
        });
        counts[i] += c;
      }
      takeItems(ws[0].items, 0);
      takeItems(ws[1].items, 1);
      if (out.length >= PAGE_LEN) return out;
      // Segunda ventana para la zona que quedara sin cubrir: con la ventana
      // llena, si lo último aún es de la zona la región continúa; si no se vio
      // nada y lo último es menor, la región está más adelante. (Si se vio algo
      // y lo último ya no es de la zona, lo visto basta: la zona es contigua.)
      var more = [];
      for (var i = 0; i < 2; i++) {
        var w = ws[i];
        if (!w.items || !w.items.length || w.L === undefined || w.P <= 0) continue;
        if (w.items.length < w.P) continue; // ventana incompleta: no hay más
        var last = w.items[w.items.length - 1].slug;
        var continues = matchPrefix(last, tg[i]);
        if (!continues && (counts[i] > 0 || last >= tg[i])) continue;
        if ((w.L + w.P) >= N) continue;
        var P2 = Math.min(100, hi[i] + 21 - (w.L + w.P));
        if (P2 > 0) more.push({ i: i, offset: w.L + w.P, perPage: P2 });
      }
      if (!more.length) return out;
      return pause(PAUSE_MS).then(function () {
        return Promise.all(more.map(function (m) {
          return apiGet(novelsUrl({ orderby: 'slug', order: 'asc', per_page: m.perPage, offset: m.offset }));
        }));
      }).then(function (rs) {
        rs.forEach(function (r, k) { takeItems(Array.isArray(r.data) ? r.data : [], more[k].i); });
        return out;
      });
    });
  }

  // Ficha por API (1 petición) en vez del HTML de la obra: nombre, autor,
  // código, sinopsis, géneros, etiquetas, estado y total de capítulos. El
  // índice viene de posts?tags= en páginas de 500 con _fields (500 es el
  // máximo del servidor): la primera (más nueva) dice el total real por su
  // cabecera y la última trae los capítulos más antiguos, que son los que se
  // devuelven; el resto va por parsePage. En total 2 o 3 peticiones.
  var INDEX_MIN = 30;
  function indexKey(slug) { return 'mv_idx_' + slug; }
  function statusFrom(value) {
    var v = String(value || '').toLowerCase();
    if (v === 'ongoing') return NovelStatus.Ongoing;
    if (v === 'completed') return NovelStatus.Completed;
    if (v === 'hiatus') return NovelStatus.OnHiatus;
    return NovelStatus.Unknown;
  }
  function summaryFrom(record) {
    var parts = [String(record['synopsis-text'] || '').trim()];
    var other = String(record['associated-names'] || '').trim();
    if (other) parts.push('Other titles: ' + other);
    var tags = record.tags || [];
    if (tags.length) parts.push('Tags: ' + tags.join(', '));
    return parts.join('\n\n');
  }
  function toChapters(code, items, start, end) {
    var out = [];
    var seenNums = {};
    (Array.isArray(items) ? items : []).forEach(function (it) {
      var acf = it.acf || {};
      var num = acf.chapter_number;
      if (num === undefined || num === null || seenNums[num]) return;
      if (start !== undefined && (num < start || num > end)) return;
      seenNums[num] = true;
      out.push({
        name: acf.ch_name || ('Chapter ' + num),
        path: 'chapter/' + code + '-' + num,
        releaseTime: it.date || '',
        chapterNumber: num
      });
    });
    out.sort(function (a, b) { return a.chapterNumber - b.chapterNumber; });
    return out;
  }
  plugin.parseNovel = function (novelPath) {
    var slug = String(novelPath || '').replace(/^novel\//, '').replace(/\/+$/, '');
    var info = {};
    return apiGet(novelsUrl({ slug: slug })).then(function (r) {
      var items = Array.isArray(r.data) ? r.data : [];
      if (!items.length) throw new Error('Obra no encontrada: ' + novelPath);
      info.record = items[0];
      info.code = info.record['novel-code'];
      // convertNovelId es de la parte 1: se reutiliza, no se reescribe.
      info.tag = String(plugin.convertNovelId(BigInt(parseInt(info.code, 10))));
      return pause(PAUSE_MS);
    }).then(function () {
      return apiGet(postsUrl({ tags: info.tag, per_page: 500, page: 1, _fields: 'id,date,acf' }));
    }).then(function (rp) {
      info.total = rp.total || info.record['total-chapters'] || 0;
      info.pages = Math.ceil(info.total / 500);
      var idx = { total: info.total, tag: info.tag, code: info.code };
      storage.set(indexKey(slug), idx, Date.now() + INDEX_MIN * 60 * 1000);
      var newest = Array.isArray(rp.data) ? rp.data : [];
      if (info.pages <= 1) return toChapters(info.code, newest);
      // Con más de 500 capítulos la extensión declara sus páginas (totalPages) y el
      // motor da por buena la lista que devuelve aquí como la PÁGINA 1 y pide el resto
      // con parsePage(2..N). Tiene que ser la página 1 de verdad (capítulos 1-500):
      // con los más viejos sueltos que dejaba la última página de la API, faltaban
      // los capítulos entre ellos y la página 2 (Motor, 15/10: 300 de 1200).
      return pause(PAUSE_MS).then(function () { return pageOf(idx, 1, newest); })
        .then(function (page) { return page.chapters; });
    }).then(function (chapters) {
      var record = info.record;
      var novel = {
        path: novelPath,
        name: record.name || '',
        cover: record['novel-code']
          ? ('https://assets.mvlempyr.app/images/600/' + record['novel-code'] + '.webp')
          : defaultCover,
        author: record['author-name'] || '',
        genres: (record.genre || []).join(','),
        status: statusFrom(record.status),
        summary: summaryFrom(record),
        chapters: chapters
      };
      if (info.pages > 1) novel.totalPages = info.pages;
      return novel;
    });
  };

  // La página k del índice trae los capítulos [(k-1)*500+1, k*500]. El servidor da los
  // capítulos de más nuevo a más viejo en páginas de 500, así que cada página nuestra
  // cae en una o dos de las suyas. `p1items` es la primera del servidor, si ya se tiene.
  function pageOf(idx, k, p1items) {
    var total = idx.total || 0;
    var pages = Math.ceil(total / 500);
    if (!total || k > pages) return Promise.resolve({ chapters: [] });
    var start = (k - 1) * 500 + 1;
    var end = Math.min(k * 500, total);
    var pA = Math.floor((total - end) / 500) + 1;
    var pB = Math.floor((total - start) / 500) + 1;
    function pageItems(p) {
      if (p === 1 && p1items) return Promise.resolve(p1items);
      return apiGet(postsUrl({ tags: idx.tag, per_page: 500, page: p, _fields: 'id,date,acf' }))
        .then(function (r) { return Array.isArray(r.data) ? r.data : []; });
    }
    var fetches = [pageItems(pA)];
    if (pB !== pA) {
      fetches.push(pause(PAUSE_MS).then(function () { return pageItems(pB); }));
    }
    return Promise.all(fetches).then(function (lists) {
      var items = [];
      lists.forEach(function (l) { items = items.concat(l); });
      return { chapters: toChapters(idx.code, items, start, end) };
    });
  }

  // Índice por páginas de 500 (del primero al último capítulo): la página k
  // trae los capítulos [(k-1)*500+1, k*500]. Suele ser 1 petición; 2 cuando el
  // tramo cae entre dos páginas del servidor.
  // Índice por páginas de 500 (del primero al último capítulo). Suele ser 1 petición;
  // 2 cuando el tramo cae entre dos páginas del servidor.
  plugin.parsePage = function (novelPath, page) {
    var slug = String(novelPath || '').replace(/^novel\//, '').replace(/\/+$/, '');
    var k = parseInt(page, 10) || 1;
    if (k < 1) k = 1;
    var cached = storage.get(indexKey(slug));
    if (cached && cached.total > 0 && cached.tag) return pageOf(cached, k);
    // Sin caché (caducó o se saltó de página): ficha mínima para situarse.
    return apiGet(novelsUrl({ slug: slug })).then(function (r) {
      var items = Array.isArray(r.data) ? r.data : [];
      if (!items.length) throw new Error('Obra no encontrada: ' + novelPath);
      var code = items[0]['novel-code'];
      var tag = String(plugin.convertNovelId(BigInt(parseInt(code, 10))));
      return pause(PAUSE_MS).then(function () {
        return apiGet(postsUrl({ tags: tag, per_page: 500, page: 1, _fields: 'id,date,acf' }));
      }).then(function (rp) {
        var idx = { total: rp.total || items[0]['total-chapters'] || 0, tag: tag, code: code };
        storage.set(indexKey(slug), idx, Date.now() + INDEX_MIN * 60 * 1000);
        return pageOf(idx, k, Array.isArray(rp.data) ? rp.data : []);
      });
    });
  };

  plugin.resolveUrl = function (path) {
    return plugin.site + String(path || '').replace(/^\/+/, '');
  };
})();
