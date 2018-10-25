require('spectre.css')
require('../assets/style.styl')
const avatar = require('../assets/avatar/face-001.json')

window.handsfree = new Handsfree({debug: true})

/**
 * Render the avatar
 */
window.addEventListener('handsfree-injectDebugger', (ev) => {
  handsfree.faces = avatar
  handsfree.debug.$canvas.width = 640
  handsfree.debug.$canvas.height = 480
  handsfree.debug.$canvas.parentElement.style.display = 'block'

  handsfree.drawFaces()
  document.querySelector('body > div').style.opacity = '1'
})

/**
 * Bind to the handsfree-trackFaces event
 * @param {Handsfree} ev.detail.scope The handsfree instance
 * @param {Object}    ev.detail.faces An array of face objects
 */
window.addEventListener('handsfree-trackFaces', (ev) => {
})
