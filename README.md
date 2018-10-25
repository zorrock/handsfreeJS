<div align="center"><img src="/assets/handsfree-2.0-readme-cover.gif" alt="handsfree.js 2.0"></div>

> A drop-in library for adding face-controlled mouse pointers via computer vision 🙈

## Scripts

### With Yarn...
```bash
yarn init  # To update the package with your own labels
yarn       # and yarn --only=dev if you have a global NODE_ENV=production, the default on Windows.
yarn dev   # Development mode with SASS, templates, and hot-reload on localhost:8080
yarn build # Build the library
```

### ...or with NPM

```bash
npm init       # To update the package with your own labels
npm install    # and npm install --only=dev if you have a global NODE_ENV=production, the default on Windows.
npm run dev    # Development mode with SASS, templates, and hot-reload on localhost:8080
npm run build  # Build the library
```

## Development

The actual library is built with `/src/main.js` as the starting point. When people `npm install handsfree` and `import handsfree from 'handsfree'`, they'll be loading this file.

The `/sandbox/` scripts are used when developing with `yarn dev` and are there to help you in developing your library (`/src/main.js`). Your library and `/sandbox/index.js` are automatically injected into `/sandbox/index.pug`. When you run `yarn build`, these files are included in the `/dist/` folder which allows you to quickly deploy examples with your library!

## Usage

### Config
You can instatiate Handsfree with the following config (defaults are shown):

```js
const handsfree = new Handsfree({
  // Whether to show the debugger or not
  debug: false
})
```

### API

```js
// Starts tracking faces and shows the webcam if debug is on
handsfree.start()
// Stops the webcam
handsfree.stop()
// Toggle between start/stop (null), or explicitly set it to on (true) or off (false)
handsfree.toggle(true|false|null)

// Toggles the debugger on (true), off (false), or flips the state (null)
handsfree.toggleDebugger(true|false|null)
```

### Debugging

The debugger is loaded into the first element in the DOM with the `.handsfree-debug-wrap`. If one doesn't exist, then it's added as the last root element of `body`.

### Plugins
Handsfree is built around a plugin architecture, which allows us to easily add and share functionality. We can even disable them!

To add a plugin, use the `handsfree.use({})` method with the following form:

```js
handsfree.use({
  name: '',
  // Called once when the use method is called and after the plugin is added to the instance
  onUse: () => {},
  // Called once per frame, after calculations, along with the detected face object
  onFrame: face => {}
})
```

## Events
### handsfree-trackFaces
An alternative to plugins is to use listen in on the window `handsfree-trackFaces` event:

```js
/**
 * Bind to the handsfree-trackFaces event
 * @param {Handsfree} ev.detail.scope The handsfree instance
 * @param {Object}    ev.detail.faces An array of face objects
 */
window.addEventListener('handsfree-trackFaces', (ev) => {
  // Do code with the handsfree instance: ev.detail.scope
  // or with the faces ev.detail.faces.forEach(face => {})
})
```

### handsfree-injectDebugger
The `handsfree-injectDebugger` event is fired after the debugger is injected, but before handsfree is started. Use this event to draw into the canvas without the camera being turned one.

```js
/**
 * Bind to the handsfree-injectDebugger event
 * @param {Handsfree}       ev.detail.scope The handsfree instance
 * @param {Canvas2DContent} ev.detail.canvasContext The 2D debug canvas context
 */
window.addEventListener('handsfree-injectDebugger', (ev) => {
  // Do code with the handsfree instance: ev.detail.scope
  // or draw into the canvas with ev.detail.canvasContext
})
```

## Classes
The document body contains `.handsfree-stopped` when handsfree is stopped (this includes when it's been initialized but not started), and `.handsfree-started` when it's on. This lets you style any page on the page!

## License
Uses BRFv4: https://github.com/Tastenkunst/brfv4_javascript_examples
Uses Haar Cascade: haarcascade_frontalface_default.xml

```
    Stump-based 24x24 discrete(?) adaboost frontal face detector.
    Created by Rainer Lienhart.

////////////////////////////////////////////////////////////////////////////////////////

  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.

  By downloading, copying, installing or using the software you agree to this license.
  If you do not agree to this license, do not download, install,
  copy or use the software.


                        Intel License Agreement
                For Open Source Computer Vision Library

 Copyright (C) 2000, Intel Corporation, all rights reserved.
 Third party copyrights are property of their respective owners.

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

   * Redistribution's of source code must retain the above copyright notice,
     this list of conditions and the following disclaimer.

   * Redistribution's in binary form must reproduce the above copyright notice,
     this list of conditions and the following disclaimer in the documentation
     and/or other materials provided with the distribution.

   * The name of Intel Corporation may not be used to endorse or promote products
     derived from this software without specific prior written permission.

 This software is provided by the copyright holders and contributors "as is" and
 any express or implied warranties, including, but not limited to, the implied
 warranties of merchantability and fitness for a particular purpose are disclaimed.
 In no event shall the Intel Corporation or contributors be liable for any direct,
 indirect, incidental, special, exemplary, or consequential damages
 (including, but not limited to, procurement of substitute goods or services;
 loss of use, data, or profits; or business interruption) however caused
 and on any theory of liability, whether in contract, strict liability,
 or tort (including negligence or otherwise) arising in any way out of
 the use of this software, even if advised of the possibility of such damage.
```
