require('spectre.css')
require('../assets/style.styl')

window.handsfree = new Handsfree({debug: true})

/**
 * Bind to the handsfree-trackFaces event
 * @param {Handsfree} ev.detail.scope The handsfree instance
 * @param {Object}    ev.detail.faces An array of face objects
 */
window.addEventListener('handsfree-trackFaces', (ev) => {
  
})
