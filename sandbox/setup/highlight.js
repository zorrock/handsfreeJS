/**
 * Setup Highlight.js
 */
const hljs = require('highlight.js/lib/highlight')
require('highlight.js/styles/shades-of-purple.css')
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'))
hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'))
hljs.initHighlightingOnLoad()
