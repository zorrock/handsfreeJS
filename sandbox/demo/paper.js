/**
 * Sets up the Paper.js demo
 */
const paper = require('paper')
const $canvas = document.getElementById('paperjs')

window.paper = paper
paper.setup($canvas)
