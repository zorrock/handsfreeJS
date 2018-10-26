require('spectre.css')
require('../assets/style.styl')

/**
 * Setup Highlight.js
 */
const hljs = require('highlight.js/lib/highlight')
require('highlight.js/styles/shades-of-purple.css')
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'))
hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'))
hljs.initHighlightingOnLoad()

/**
 * Render the avatar
 */
const avatar = require('../assets/avatar/face-001.json')
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

/**
 * Setup sections to be 100% height
 */
window.addEventListener('resize', () => {
  const height = window.outerHeight
  document.querySelectorAll('section').forEach(section => {
    section.style.minHeight = `${height}px`
  })
})
window.dispatchEvent(new Event('resize'))
