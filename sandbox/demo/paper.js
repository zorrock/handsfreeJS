/**
 * Sets up the Paper.js demo
 */
const paper = require('paper')
const $canvas = document.getElementById('paperjs')
let path
let tool

/**
 * Plugin for drawing on paper with handsfree
 */
handsfree.use({
  name: 'PaperDraw',

  onFrame (faces) {
    faces.forEach(face => {
      // Only catch events when the cursor is over the canvas
      if (face.cursor.$target === $canvas) {
        // Start path, select a new color
        if (face.cursor.state.mouseDown) {
          path = new paper.Path()
          path.strokeColor = {
            hue: Math.random() * 360,
            saturation: 1,
            brightness: 1
          }
          path.strokeWidth = 10
          path.moveTo(new paper.Point(
            face.cursor.x - $canvas.getBoundingClientRect().left,
            face.cursor.y - $canvas.getBoundingClientRect().top
          ))
        }

        // Draw the path
        if (face.cursor.state.mouseDrag) {
          path.lineTo(new paper.Point(
            face.cursor.x - $canvas.getBoundingClientRect().left,
            face.cursor.y - $canvas.getBoundingClientRect().top
          ))
          paper.view.draw()
        }
      }
    })
  }
})

// Setup Paper.js
window.paper = paper
paper.setup($canvas)
tool = new paper.Tool()
tool.minDistance = 10
tool.maxDistance = 45

/**
 * Adapted from: http://paperjs.org/tutorials/interaction/working-with-mouse-vectors/
 */
tool.onMouseDown = function (event) {
	path = new paper.Path()
	path.strokeColor = {
		hue: Math.random() * 360,
		saturation: 1,
		brightness: 1
	}
  path.strokeWidth = 10
	path.add(event.point)
}

/**
 * Handle mouseDrag
 */
tool.onMouseDrag = function (event) {
  path.add(event.point)
	path.smooth()
}
