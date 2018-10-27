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
      if (face.cursor.$target === $canvas && face.cursor.state) {
        if (face.cursor.state.mouseDown) {
          console.log('down')
        }

        if (face.cursor.state.mouseDrag) {
          console.log('drag');
        }

        if (face.cursor.state.mouseUp) {
          console.log('up');
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
  console.log(event);
	path = new paper.Path()
	path.fillColor = {
		hue: Math.random() * 360,
		saturation: 1,
		brightness: 1
	}

	path.add(event.point)
}

tool.onMouseDrag = function (event) {
	var step = event.delta.divide(2)
	step.angle += 90

	var top = event.middlePoint.add(step)
	var bottom = event.middlePoint.subtract(step)

	path.add(top)
	path.insert(0, bottom)
	path.smooth()
}

tool.onMouseUp = function (event) {
	path.add(event.point)
	path.closed = true
	path.smooth()
}
