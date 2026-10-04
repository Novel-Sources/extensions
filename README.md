# Novel Sources · extensiones

Extensiones para lectores de novelas compatibles con el **formato de LNReader**.
Son versiones corregidas de extensiones cuya web cambió y cuya versión oficial
aún no se ha actualizado.

*Extensions for novel readers that support the **LNReader plugin format**:
fixed versions of extensions whose website changed before the official one
was updated.*

## Cómo añadirlo · How to add

En tu lector: **Extensiones → Repositorios → Añadir** y pega:

    https://raw.githubusercontent.com/Novel-Sources/extensions/main/plugins.json

O abre la página: https://novel-sources.github.io/extensions/

## Qué hay · What's inside

| Extensión | Versión | Qué corrige |
|---|---|---|
| SkyNovels | 1.1.2 | Filtros de orden, estado y origen que la API admite; la ficha con los volúmenes que da la API (1.1.2) |
| MVLempyr | 1.0.15 | La lista va de 20 en 20 y la búsqueda por tandas pequeñas, en vez de bajar el catálogo entero (~22 MB) cada vez |
| Fenrir Realm | 1.1.4 | Lista y búsqueda con la API nueva de la web; el capítulo, desde la API y convertido del JSON del editor (antes salía como código); si la API falla, desde los datos de la página |
| Quanben | 1.1.2 | La portada entera (la oficial tomaba sólo la primera obra de cada bloque: 36 de 125) y las páginas de cada categoría |
| TuNovelaLigera | 1.2.2 | Las fichas en formato Madara pedían su índice a la lista general de novelas (capítulos de otras obras); ahora a la propia obra |
| dilar tube | 1.0.4 | La lista junta las novelas de cuatro páginas del listado de novedades, que mezcla cómics y novelas (la oficial daba a veces una sola), sin repetir obras entre páginas; filtro por categoría (1.0.4) |
| Ranobes | 2.0.3 | catálogo, filtros, búsqueda e índice DLE con JSON y páginas canónicas; pausa entre peticiones. |
| Novel Arrow | 1.0.2 | mudanza a NovelPing, filtros, catálogo, búsqueda, archivo de capítulos y lectura. |
| NOVA | 1.1.2 | filtros y catálogo WooCommerce sin el AJAX antiguo, incluida la búsqueda. |
| Azora | 2.2.1 | mudanza a AzoraFly y lectura del catálogo, búsqueda, islas Astro y capítulos. |

Novel Arrow y Azora cambian de sitio: el lector debe confirmar el cambio a la versión corregida.

Cada archivo es **la extensión oficial de LNReader sin tocar**, más una
corrección al final, separada y comentada, para que se vea exactamente qué
cambió. Las extensiones oficiales son de github.com/LNReader/lnreader-plugins,
con licencia MIT (ver `LICENSE-LNReader.txt`).

## Buen uso · Fair use

Las extensiones piden sólo lo que el lector abre, con pausas, y respetan cuando
una web pide esperar. Si administras una web y quieres que se retire su
extensión, abre un *issue* y se retira.

*If you run one of these websites and want its extension removed, open an
issue and it will be removed.*
