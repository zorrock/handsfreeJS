// Setup handsfree.js
window.handsfree = new Handsfree({debug: true})

// Sandbox related stuff
require('./setup/sandbox.js')
// Demos
require('./demo/setup.js')

/**
 * Bind to the handsfree-trackFaces event
 * @param {Handsfree} ev.detail.scope The handsfree instance
 * @param {Object}    ev.detail.faces An array of face objects
 */
window.addEventListener('handsfree-trackFaces', (ev) => {
})
