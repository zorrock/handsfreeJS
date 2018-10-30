<div align="center">
  <img src="/assets/handsfree-2.0-readme-cover.gif" alt="handsfree.js 2.0">
  <blockquote>A drop-in library for adding face-controlled mouse pointers via computer vision</blockquote>
  <img src="https://img.shields.io/npm/v/handsfree.svg">
  <img src="https://img.shields.io/github/last-commit/BrowseHandsfree/handsfreeJS.svg">
  <img src="https://travis-ci.org/BrowseHandsfree/handsfreeJS.svg?branch=master">
  <img src="https://img.shields.io/codecov/c/github/BrowseHandsfree/handsfreeJS/master.svg?style=flat">

</div>

## Important Note 10/29
> I refactored the package down from 86Mb to 13Mb. Problem is that the library loads this 13Mb chunk all at once so it can take a minute or two on slower connections. This will be fixed in the next few days. If you're demoing from CDN, just keep using https://unpkg.com/handsfree@2.0.3. Happy browsing!
~ Ozzy

## Quickstart

```html
<script src="https://unpkg.com/handsfree@2.0.3"></script>
```

or

```js
npm i handsfree
```

then

```js
const handsfree = new Handsfree({debug: true})
handsfree.start()
```

## Core Plugins
### Typing
**See:** `/src/plugins/SimpleKeyboard.js`

![](https://i.giphy.com/495ysDE36USvobWE0y.gif)

## Demos
### Drawing
**See:** `/sandbox/demos/paper.js`

![](https://i.giphy.com/YkBbkI90xxyDM7u8jc.gif)


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

The actual library is built with `/src/Handsfree.js` as the starting point. When people `npm install handsfree` and `import handsfree from 'handsfree'`, they'll be loading this file.

The `/sandbox/` scripts are used when developing with `yarn dev` and are there to aid in developing `/src/Handsfree.js` and for documentation. `handsfree.js` and `/sandbox/index.js` are automatically injected into `/sandbox/index.pug`. When you run `yarn build`, these files are included in the `/dist/` folder which allows you to quickly deploy documentation with examples!

## Usage

### Config
You can instantiate Handsfree with the following config (defaults are shown):

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
  // Must be unique. Spaces and special characters are fine
  // Plugins are called alphabetically - to make a plugin load before another prefix it with a number
  name: '',

  // Called once when the use method is called and after the plugin is added to the instance
  onUse: () => {},
  // Called once per frame, after calculations, along with the detected face object
  // To overwrite/modify the properties of faces for use within other plugins, return the faces object
  onFrame: (faces, handsfree) => {}
})
```

## The `faces` array
The `onFrame` recieves a `faces` array, which contains an object for each tracked face. The key properties of the a `face` object include:

```js
{
  cursor: {
    // Where on the screen the user is pointed at
    x: 0,
    y: 0,
    // The target currently under the mouse
    $target: 0,

    // Mouse states for this face
    state: {
      // The first frame of a click
      mouseDown: false,
      // Every subsequent frame of a click
      mouseDrag: false,
      // When the click is finally released
      mouseUp: false
    }
  },

  // A list of all 64 landmarks
  points: [{x, y}, ...],

  // The head's pitch (facing up/down)
  rotationX: 0,
  // The head's yaw (facing left/right)
  rotationY: 0,
  // The head's roll (as if doing a cartwheel while facing straight ahead)
  rotationZ: 0,

  // The heads overall size within the camera
  scale: 0,

  // Where the head is relative to the left edge of the video feed
  translationX: 0,
  // Where the head is relative to the top edge of the video feed
  translationY: 0
}
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

## Further learning
The best way to learn how everything works is to check out `/sandbox/index.js` which contains everything you need to start (notice how few lines it has)! Then, take a peek at the plugins in `/src/plugins/*.js` to understand how various plugins work.

In order of complexity, you'll want to peek at:
- `/src/plugins/Scrolling.js`
- `/src/plugins/SimpleKeyboard.js` (this one doesn't even use the handsfree API!)
- `/src/plugins/SmileClick.js`

## Roadmap
- Enabled/disable plugins
- Adjust BRFv4 settings (speed vs accuracy)
- Multi-face support
- PoseNet fallback (for extreme distances and when BRFv4 can't detect a face)
- Integration and unit testing
- Virtual keyboard
- Morse code keyboard
- Custom macros (ex: shaking head "no" to undo an action)

## Sanity Notes
- We're `require`ing BRFv4 as a WASM module. When we use a future update of BRFv4, remember to modify the .js file so that it exports as a module

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

## EULA

The following EULA applies to BRFv4, the computer vision library powering Handsfree.js. See here if you intend to use handsfree.js in a commercial product/service: https://github.com/Tastenkunst/brfv4_javascript_examples

```
EULA.
End User License Agreement.

Those are our terms for the trial license.

END-USER LICENSE AGREEMENT FOR "Beyond Reality Face SDK - trial version"
IMPORTANT PLEASE READ THE TERMS AND CONDITIONS OF THIS LICENSE AGREEMENT CAREFULLY BEFORE CONTINUING
WITH THIS DOWNLOAD: Tastenkunst End-User License Agreement ("EULA") is a legal agreement between you
(either an individual or a single entity) and Tastenkunst for the Tastenkunst software product(s)
identified above which may include associated software components, media, printed materials, and
"online" or electronic documentation ("SOFTWARE PRODUCT"). By downloading, copying, or otherwise
using the SOFTWARE PRODUCT, you agree to be bound by the terms of this EULA. This license agreement
represents the entire agreement concerning the program between you and Tastenkunst, (referred to as
"licenser"), and it supersedes any prior proposal, representation, or understanding between the parties.
If you do not agree to the terms of this EULA, do not download or use the SOFTWARE PRODUCT. The
SOFTWARE PRODUCT is protected by copyright laws and international copyright treaties, as well as other
intellectual property laws and treaties. The SOFTWARE PRODUCT is licensed, not sold.

1. GRANT OF LICENSE.
The SOFTWARE PRODUCT is licensed as follows:

(a) Download and Use.
Tastenkunst grants you the right to download and use copies of the SOFTWARE PRODUCT on your computer.

(b) Backup Copies.
You may also make copies of the SOFTWARE PRODUCT as may be necessary for backup and archival purposes.

2. DESCRIPTION OF OTHER RIGHTS AND LIMITATIONS.
(a) Maintenance of Copyright Notices. You must not remove or alter any copyright notices on any and
all copies of the SOFTWARE PRODUCT. (b) Distribution. You may not distribute registered copies of
the SOFTWARE PRODUCT to third parties. Evaluation versions available for download from Tastenkunst's
websites may be freely distributed. (c) Prohibition on Reverse Engineering, Decompilation, and
Disassembly. You may not reverse engineer, decompile, or disassemble the SOFTWARE PRODUCT, except
and only to the extent that such activity is expressly permitted by applicable law notwithstanding
this limitation. (d) Rental. You may not rent, lease, or lend the SOFTWARE PRODUCT. (e) Support
Services. Tastenkunst may provide you with support services related to the SOFTWARE PRODUCT ("Support
Services"). Any supplemental software code provided to you as part of the Support Services shall be
considered part of the SOFTWARE PRODUCT and subject to the terms and conditions of this EULA. (f)
Compliance with Applicable Laws. You must comply with all applicable laws regarding use of the
SOFTWARE PRODUCT.

3. TERMINATION
Without prejudice to any other rights, Tastenkunst may terminate this EULA if you fail to comply
with the terms and conditions of this EULA. In such event, you must destroy all copies of the
SOFTWARE PRODUCT in your possession.

4. COPYRIGHT
All title, including but not limited to copyrights, in and to the SOFTWARE PRODUCT and any copies
thereof are owned by Tastenkunst or its suppliers. All title and intellectual property rights in
and to the content which may be accessed through use of the SOFTWARE PRODUCT is the property of
the respective content owner and may be protected by applicable copyright or other intellectual
property laws and treaties. This EULA grants you no rights to use such content. All rights not
expressly granted are reserved by Tastenkunst.

5. NO WARRANTIES
Tastenkunst expressly disclaims any warranty for the SOFTWARE PRODUCT. The SOFTWARE PRODUCT is
provided 'As Is' without any express or implied warranty of any kind, including but not limited
to any warranties of merchantability, noninfringement, or fitness of a particular purpose.
Tastenkunst does not warrant or assume responsibility for the accuracy or completeness of any
information, text, graphics, links or other items contained within the SOFTWARE PRODUCT. Tastenkunst
makes no warranties respecting any harm that may be caused by the transmission of a computer
virus, worm, time bomb, logic bomb, or other such computer program. Tastenkunst further expressly
disclaims any warranty or representation to Authorized Users or to any third party.

6. LIMITATION OF LIABILITY
In no event shall Tastenkunst be liable for any damages (including, without limitation, lost
profits, business interruption, or lost information) rising out of 'Authorized Users' use of
or inability to use the SOFTWARE PRODUCT, even if Tastenkunst has been advised of the possibility
of such damages. In no event will Tastenkunst be liable for loss of data or for indirect, special,
incidental, consequential (including lost profit), or other damages based in contract, tort or
otherwise. Tastenkunst shall have no liability with respect to the content of the SOFTWARE PRODUCT
or any part thereof, including but not limited to errors or omissions contained therein, libel,
infringements of rights of publicity, privacy, trademark rights, business interruption, personal
injury, loss of privacy, moral rights or the disclosure of confidential information.
```
