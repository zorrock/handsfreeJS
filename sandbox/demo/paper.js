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

  lastPoint: [],

  onFrame (faces) {
    faces.forEach((face, faceIndex) => {
      // Only catch events when the cursor is over the canvas
      if (face.cursor.$target === $canvas) {
        // Start path, select a new color
        if (face.cursor.state.mouseDown) {
          this.setLastPoint(face, faceIndex)
          path = new paper.Path()
          path.strokeColor = {
            hue: Math.random() * 360,
            saturation: 1,
            brightness: 1
          }
          path.strokeJoin = 'round'
          path.strokeWidth = 10
          path.moveTo(this.lastPoint[faceIndex])
        }

        // Draw the path
        if (face.cursor.state.mouseDrag) {
          const newPoint = this.getPoint(face)

          if (newPoint.getDistance(this.getLastPoint(faceIndex)) > tool.minDistance) {
            path.lineTo(new paper.Point(
              face.cursor.x - $canvas.getBoundingClientRect().left,
              face.cursor.y - $canvas.getBoundingClientRect().top
            ))
            paper.view.draw()
            path.smooth()

            this.setLastPoint(face, faceIndex)
          }
        }
      }
    })
  },

  /**
   * Gets a paper point from a face
   * @param  {FaceObject} face The full face object
   * @return {Point}           The point
   */
  getPoint (face) {
    return new paper.Point(
      face.cursor.x - $canvas.getBoundingClientRect().left,
      face.cursor.y - $canvas.getBoundingClientRect().top
    )
  },

  /**
   * Sets the last point for the faceIndex
   */
  setLastPoint (face, faceIndex) {
    this.lastPoint[faceIndex] = this.getPoint(face)
  },

  /**
   * Gets the last point for the faceIndex
   */
  getLastPoint (faceIndex) { return this.lastPoint[faceIndex] }
})

// Setup Paper.js
window.paper = paper
paper.setup($canvas)
path = new paper.Path()
tool = new paper.Tool()
tool.minDistance = 20

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
  path.strokeJoin = 'round'
	path.add(event.point)
}

/**
 * Handle mouseDrag
 */
tool.onMouseDrag = function (event) {
  path.add(event.point)
	path.smooth()
}
