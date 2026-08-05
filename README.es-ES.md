<div align="center">
  <img src="/assets/handsfree-2.0-readme-cover.gif" alt="handsfree.js 2.0">
  <blockquote>Una biblioteca plug-and-play para agregar punteros del ratón controlados por gestos faciales mediante visión por computadora.</blockquote>
  <img src="https://img.shields.io/npm/v/handsfree.svg">
  <img src="https://img.shields.io/github/last-commit/BrowseHandsfree/handsfreeJS.svg">
  <img src="https://travis-ci.org/BrowseHandsfree/handsfreeJS.svg?branch=master">
  <img src="https://img.shields.io/codecov/c/github/BrowseHandsfree/handsfreeJS/master.svg?style=flat">

</div>

## Nota importante (29/10)
> He reducido el tamaño del paquete de 86 MB a 13 MB. El problema es que la biblioteca carga estos 13 MB de una vez, lo que puede tardar entre uno y dos minutos en conexiones más lentas. Esto se solucionará en los próximos días. Si estás haciendo una demostración desde CDN, sigue usando https://unpkg.com/handsfree@2.0.3. ¡Feliz navegación!
~ Ozzy

## Inicio rápido

```html
<script src="https://unpkg.com/handsfree@2.0.3"></script>
```

o

```js
npm i handsfree
```

luego

```js
const handsfree = new Handsfree({debug: true})
handsfree.start()
```

## Plugins principales
### Escrito a mano
**Ver:** `/src/plugins/SimpleKeyboard.js`

![](https://i.giphy.com/495ysDE36USvobWE0y.gif)

## Demostraciones
### Dibujo
**Ver:** `/sandbox/demos/paper.js`

![](https://i.giphy.com/YkBbkI90xxyDM7u8jc.gif)


## Scripts

### Con Yarn...

```bash
yarn init  # Para actualizar el paquete con tus propias etiquetas
yarn       # y yarn --only=dev si tienes un NODE_ENV=production global (predeterminado en Windows)
yarn dev   # Modo de desarrollo con SASS, plantillas y recarga en caliente en localhost:8080
yarn build # Construir la biblioteca
```

### ...o con NPM

```bash
npm init       # Para actualizar el paquete con tus propias etiquetas
npm install    # y npm install --only=dev si tienes un NODE_ENV=production global (predeterminado en Windows)
npm run dev    # Modo de desarrollo con SASS, plantillas y recarga en caliente en localhost:8080
npm run build  # Construir la biblioteca
```

## Desarrollo

La biblioteca en sí se construye a partir de `/src/Handsfree.js` como punto de partida. Cuando los usuarios instalan el paquete con `npm install handsfree` e importan `handsfree` desde `'handsfree'`, cargarán este archivo.

Los scripts de `/sandbox/` se utilizan durante el desarrollo con `yarn dev` y están diseñados para ayudar en el desarrollo de `/src/Handsfree.js` y para la documentación. `handsfree.js` y `/sandbox/index.js` se inyectan automáticamente en `/sandbox/index.pug`. Cuando ejecutas `yarn build`, estos archivos se incluyen en la carpeta `/dist/`, lo que permite desplegar rápidamente documentación con ejemplos.

## Uso

### Configuración
Puedes crear una instancia de Handsfree con la siguiente configuración (los valores predeterminados se muestran entre paréntesis):

```js
const handsfree = new Handsfree({
  // Si mostrar o no el depurador
  debug: false
})
```

### API

```js
// Inicia el seguimiento de rostros y muestra la webcam si el depurador está activado
handsfree.start()
// Detiene la webcam
handsfree.stop()

// Alterna el depurador a encendido (true), apagado (false) o invierte el estado (null)
handsfree.toggleDebugger(true|false|null)
```

### Depuración

El depurador se carga en el primer elemento del DOM con la clase `.handsfree-debug-wrap`. Si no existe, se agrega como el último elemento raíz del cuerpo (`body`).

### Plugins
Handsfree está construido en torno a una arquitectura de plugins, lo que nos permite agregar y compartir funcionalidad fácilmente. ¡Incluso podemos desactivarlos!

Para agregar un plugin, utiliza el método `handsfree.use({})` con la siguiente estructura:

```js
handsfree.use({
  // Debe ser único. Los espacios y los caracteres especiales están permitidos.
  // Los plugins se cargan en orden alfabético: para que un plugin se cargue antes que otro, préfiixalo con un número.
  name: '',

  // Se llama una vez cuando se invoca el método use y después de que el plugin se ha agregado a la instancia.
  onUse: () => {},
  // Se llama una vez por fotograma, después de los cálculos, junto con el objeto de rostro detectado.
  // Para sobrescribir o modificar las propiedades de los rostros para su uso en otros plugins, devuelve el objeto de rostros.
  onFrame: (faces, handsfree) => {}
})
```

## El array `faces`
El método `onFrame` recibe un array `faces`, que contiene un objeto para cada rostro detectado. Las propiedades clave de un objeto `face` incluyen:

```js
{
  cursor: {
    // Posición del cursor en la pantalla (donde el usuario está apuntando)
    x: 0,
    y: 0,
    // El objetivo actualmente bajo el cursor del ratón
    $target: 0,

    // Estados del ratón para este rostro
    state: {
      // Primer fotograma de un clic
      mouseDown: false,
      // Cada fotograma posterior de un clic
      mouseDrag: false,
      // Cuando el clic se libera finalmente
      mouseUp: false
    }
  },

  // Una lista de todos los 64 puntos de referencia
  points: [{x, y}, ...],

  // Rotación de la cabeza (mirando hacia arriba/abajo)
  rotationX: 0,
  // Rotación de la cabeza (mirando hacia la izquierda/derecha)
  rotationY: 0,
  // Rotación de la cabeza (como si hiciera una voltereta mientras miraba hacia adelante)
  rotationZ: 0,

  // Tamaño general de la cabeza dentro de la cámara
  scale: 0,

  // Posición de la cabeza relativa al borde izquierdo del feed de vídeo
  translationX: 0,
  // Posición de la cabeza relativa al borde superior del feed de vídeo
  translationY: 0
}
```

## Eventos
### handsfree-trackFaces
Una alternativa a los plugins es escuchar el evento `handsfree-trackFaces` en `window`:

```js
/**
 * Vincula el evento handsfree-trackFaces
 * @param {Handsfree} ev.detail.scope La instancia de handsfree
 * @param {Object} ev.detail.faces Un array de objetos de rostro
 */
window.addEventListener('handsfree-trackFaces', (ev) => {
  // Haz código con la instancia de handsfree: ev.detail.scope
  // o con los rostros: ev.detail.faces.forEach(face => {})
})
```

### handsfree-injectDebugger
El evento `handsfree-injectDebugger` se dispara después de que el depurador es inyectado, pero antes de que handsfree se inicie. Usa este evento para dibujar en el canvas sin que la cámara esté activada.

```js
/**
 * Vincula el evento handsfree-injectDebugger
 * @param {Handsfree} ev.detail.scope La instancia de handsfree
 * @param {Canvas2DContent} ev.detail.canvasContext El contexto del canvas de depuración 2D
 */
window.addEventListener('handsfree-injectDebugger', (ev) => {
  // Haz código con la instancia de handsfree: ev.detail.scope
  // o dibuja en el canvas con ev.detail.canvasContext
})
```

## Clases
El cuerpo del documento contiene la clase `.handsfree-stopped` cuando handsfree está detenido (incluido cuando se ha inicializado pero no se ha iniciado), y `.handsfree-started` cuando está activo. Esto te permite estilizar cualquier elemento de la página.

## Más aprendizaje
La mejor manera de aprender cómo funciona todo es consultar `/sandbox/index.js`, que contiene todo lo que necesitas para empezar (¡fíjate en lo pocas líneas que tiene!). Luego, echa un vistazo a los plugins en `/src/plugins/*.js` para entender cómo funcionan varios plugins.

En orden de complejidad, querrás consultar:
- `/src/plugins/Scrolling.js`
- `/src/plugins/SimpleKeyboard.js` (este ni siquiera usa la API de handsfree)
- `/src/plugins/SmileClick.js`

## Hoja de ruta
- Habilitar/deshabilitar plugins
- Ajustar la configuración de BRFv4 (velocidad vs precisión)
- Soporte para múltiples rostros
- Fallback de PoseNet (para distancias extremas y cuando BRFv4 no puede detectar un rostro)
- Integración y pruebas unitarias
- Teclado virtual
- Teclado de código morse
- Macros personalizadas (por ejemplo, sacudir la cabeza para deshacer una acción)

## Notas de sentido común
- Estamos utilizando BRFv4 como un módulo WASM mediante `require`. Cuando usemos una actualización futura de BRFv4, recuerda modificar el archivo .js para que se exporte como módulo.

## Licencia
Usa BRFv4: https://github.com/Tastenkunst/brfv4_javascript_examples

Usa Haar Cascade: haarcascade_frontalface_default.xml

```
Detector de rostros frontal adaboost discreto (?) basado en stump de 24x24.
Creado por Rainer Lienhart.

////////////////////////////////////////////////////////////////////////////////////////

  IMPORTANTE: LEA ATENTAMENTE ANTES DE DESCARGAR, COPIAR, INSTALAR O UTILIZAR EL SOFTWARE.

  Al descargar, copiar, instalar o utilizar el software, usted acepta esta licencia.
  Si no acepta esta licencia, no descargue, instale,
  copie o utilice el software.


                        Acuerdo de Licencia de Intel
              Para la Biblioteca de Visión por Computadora de Código Abierto

 Copyright (C) 2000, Intel Corporation, todos los derechos reservados.
 Los derechos de autor de terceros son propiedad de sus respectivos propietarios.

 Se permite la redistribución y el uso en forma de fuente y binaria, con o sin modificación,
 siempre que se cumplan las siguientes condiciones:

   * Las redistribuciones del código fuente deben conservar el aviso de derechos de autor anterior,
     esta lista de condiciones y el siguiente descargo de responsabilidad.

   * Las redistribuciones en forma binaria deben reproducir el aviso de derechos de autor anterior,
     esta lista de condiciones y el siguiente descargo de responsabilidad en la documentación
     y/o en otros materiales proporcionados con la distribución.

   * El nombre de Intel Corporation no puede ser utilizado para respaldar o promocionar productos
     derivados de este software sin un permiso previo y por escrito.

 Este software es proporcionado por los titulares de los derechos de autor y los contribuyentes "tal cual" y
 cualquier garantía expresa o implícita, incluyendo, entre otras, las garantías implícitas de
 comerciabilidad y idoneidad para un propósito particular, son excluidas. En ningún caso Intel Corporation
 o los contribuyentes serán responsables de ningún daño directo, indirecto, incidental, especial,
 ejemplar o consecuente (incluyendo, entre otras, la adquisición de bienes o servicios sustitutos;
 pérdida de uso, datos o beneficios; o interrupción del negocio) sin importar cómo se cause y bajo cualquier
 teoría de responsabilidad, ya sea en contrato, responsabilidad estricta, o agravio (incluyendo negligencia u
 otra cosa) que surja de cualquier manera por el uso de este software, incluso si se le ha advertido de la
 posibilidad de tales daños.
```

## EULA

El siguiente EULA se aplica a BRFv4, la biblioteca de visión por computadora que impulsa Handsfree.js. Consulta aquí si tienes intención de usar handsfree.js en un producto/servicio comercial: https://github.com/Tastenkunst/brfv4_javascript_examples

```
EULA.
Acuerdo de Licencia para el Usuario Final.

Estos son nuestros términos para la licencia de prueba.

ACUERDO DE LICENCIA PARA EL USUARIO FINAL DE "Beyond Reality Face SDK - versión de prueba"
IMPORTANTE: LEA ATENTAMENTE LOS TÉRMINOS Y CONDICIONES DE ESTE ACUERDO DE LICENCIA ANTES DE CONTINUAR CON LA DESCARGA
El Acuerdo de Licencia para el Usuario Final de Tastenkunst ("EULA") es un acuerdo legal entre usted
(tanto un individuo como una entidad única) y Tastenkunst por el(los) producto(s) de software de Tastenkunst
identificado(s) anteriormente, que pueden incluir componentes de software asociados, medios, materiales impresos y
documentación "en línea" o electrónica ("PRODUCTO DE SOFTWARE"). Al descargar, copiar o utilizar de otro modo
el PRODUCTO DE SOFTWARE, usted acepta estar sujeto a los términos de este EULA. Este acuerdo de licencia
representa el acuerdo completo concerniente al programa entre usted y Tastenkunst (referido como
"licenciante"), y reemplaza cualquier propuesta, representación o entendimiento previo entre las partes.
Si no acepta los términos de este EULA, no descargue ni utilice el PRODUCTO DE SOFTWARE. El
PRODUCTO DE SOFTWARE está protegido por leyes de derechos de autor y tratados internacionales de derechos de autor, así como por otras
leyes y tratados de propiedad intelectual. El PRODUCTO DE SOFTWARE está licenciado, no vendido.

1. CONCESIÓN DE LICENCIA.
El PRODUCTO DE SOFTWARE está licenciado de la siguiente manera:

(a) Descarga y Uso.
Tastenkunst le concede el derecho de descargar y utilizar copias del PRODUCTO DE SOFTWARE en su computadora.

(b) Copias de Seguridad.
Usted también puede hacer copias del PRODUCTO DE SOFTWARE en la medida que sean necesarias para fines de copia de seguridad y archivo.

2. DESCRIPCIÓN DE OTROS DERECHOS Y LIMITACIONES.
(a) Mantenimiento de Avisos de Derechos de Autor. Usted no debe eliminar ni alterar ningún aviso de derechos de autor en todas y cada una de las copias del PRODUCTO DE SOFTWARE. (b) Distribución. Usted no puede distribuir copias registradas del PRODUCTO DE SOFTWARE a terceros. Las versiones de evaluación disponibles para descarga desde los sitios web de Tastenkunst pueden distribuirse libremente. (c) Prohibición de Ingeniería Inversa, Descompilación y Desensamblaje. Usted no puede realizar ingeniería inversa, descompilar o desensamblar el PRODUCTO DE SOFTWARE, excepto y solo en la medida en que dicha actividad esté expresamente permitida por la ley aplicable a pesar de esta limitación. (d) Alquiler. Usted no puede alquilar, arrendar o prestar el PRODUCTO DE SOFTWARE. (e) Servicios de Soporte. Tastenkunst puede proporcionarle servicios de soporte relacionados con el PRODUCTO DE SOFTWARE ("Servicios de Soporte"). Cualquier código de software suplementario proporcionado a usted como parte de los Servicios de Soporte se considerará parte del PRODUCTO DE SOFTWARE y estará sujeto a los términos y condiciones de este EULA. (f) Cumplimiento de las Leyes Aplicables. Usted debe cumplir todas las leyes aplicables con respecto al uso del PRODUCTO DE SOFTWARE.

3. RESCISIÓN
Sin perjuicio de cualquier otro derecho, Tastenkunst puede rescindir este EULA si usted incumple los términos y condiciones de este EULA. En tal caso, usted debe destruir todas las copias del PRODUCTO DE SOFTWARE en su posesión.

4. DERECHOS DE AUTOR
Todos los títulos, incluyendo, entre otros, los derechos de autor, en y sobre el PRODUCTO DE SOFTWARE y cualquier copia del mismo, son propiedad de Tastenkunst o de sus proveedores. Todos los títulos y derechos de propiedad intelectual en y sobre el contenido al que se puede acceder mediante el uso del PRODUCTO DE SOFTWARE son propiedad del respectivo propietario del contenido y pueden estar protegidos por las leyes y tratados de derechos de autor o de propiedad intelectual aplicables. Este EULA no le concede ningún derecho para utilizar dicho contenido. Todos los derechos no expresamente concedidos están reservados por Tastenkunst.

5. NINGUNA GARANTÍA
Tastenkunst renuncia expresamente a cualquier garantía para el PRODUCTO DE SOFTWARE. El PRODUCTO DE SOFTWARE se proporciona "tal cual" sin ninguna garantía expresa o implícita de ningún tipo, incluyendo, entre otras, las garantías implícitas de comerciabilidad, no infracción o idoneidad para un propósito particular. Tastenkunst no garantiza ni asume responsabilidad alguna por la exactitud o integridad de cualquier información, texto, gráficos, enlaces u otros elementos contenidos en el PRODUCTO DE SOFTWARE. Tastenkunst no ofrece garantías con respecto a cualquier daño que pueda ser causado por la transmisión de un virus informático, gusano, bomba de tiempo, bomba lógica u otro programa informático similar. Tastenkunst renuncia expresamente a cualquier garantía o representación hacia los Usuarios Autorizados o hacia cualquier tercero.

6. LIMITACIÓN DE RESPONSABILIDAD
En ningún caso Tastenkunst será responsable de ningún daño (incluyendo, sin limitación, la pérdida de beneficios, la interrupción del negocio o la pérdida de información) que surja del uso o la imposibilidad de uso del PRODUCTO DE SOFTWARE por parte de los Usuarios Autorizados, incluso si Tastenkunst ha sido advertida de la posibilidad de tales daños. En ningún caso Tastenkunst será responsable de la pérdida de datos o de daños indirectos, especiales, incidentales, consecuentes (incluyendo la pérdida de beneficios), o de otros daños basados en contrato, agravio o de otra índole. Tastenkunst no tendrá ninguna responsabilidad con respecto al contenido del PRODUCTO DE SOFTWARE o de cualquier parte del mismo, incluyendo, entre otras, errores u omisiones contenidos en él, difamación, infracciones de derechos de publicidad, privacidad, marcas registradas, interrupción del negocio, lesiones personales, pérdida de privacidad, derechos morales o divulgación de información confidencial.
```
