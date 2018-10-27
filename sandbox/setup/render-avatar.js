/**
 * Render the avatar
 */
const avatar = require('../../assets/avatar/face-001.json')
window.addEventListener('handsfree-injectDebugger', (ev) => {
  handsfree.faces = avatar
  handsfree.debug.$canvas.width = 640
  handsfree.debug.$canvas.height = 480
  handsfree.debug.$canvas.parentElement.style.display = 'block'

  handsfree.drawFaces()
})

setTimeout(() => {
  document.querySelector('body > div').style.opacity = '1'
}, 250)
