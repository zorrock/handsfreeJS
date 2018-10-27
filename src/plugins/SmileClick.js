/**
 * Activate clicks with a smile
 * @type {Object}
 */
module.exports = {
  name: '0-SmileClick',

  mouseDowned: [],
  mouseDown: [],
  mouseDrag: [],
  mouseUp: [],

  onFrame: function (faces, instance) {
    faces.forEach((face, faceIndex) => {
      let a
      let b
      let smileFactor

      // Calculate mouth width
      a = face.points[48].x - face.points[54].x
      b = face.points[48].y - face.points[54].y
      const mouthWidth = Math.sqrt(a*a + b*b)

      // Calculate eye distance
      a = face.points[39].x - face.points[42].x
      b = face.points[39].y - face.points[42].y
      const eyeDistance = Math.sqrt(a*a + b*b)

      // Calculate smile factor
      smileFactor = mouthWidth / eyeDistance
      smileFactor -= 1.4 // 1.4 === neutral, 1.7 === smiling

      if (smileFactor > 0.25) smileFactor = 0.25
      if (smileFactor < 0) smileFactor = 0
      smileFactor *= 4

      if (smileFactor < 0) smileFactor = 0
      if (smileFactor > 1) smileFactor = 1

      instance.faces[faceIndex].cursor.state = this.updateMouseStates({
        face,
        faceIndex,
        instance,
        smileFactor
      })
    })

    return instance.faces
  },

  /**
   * Updates the mouse events
   * @return new states
   */
  updateMouseStates (state) {
    if (state.smileFactor >= 1) {
      this.mouseDrag[state.faceIndex] = this.mouseDowned[state.faceIndex]
      if (this.mouseDowned[state.faceIndex]) {
        this.mouseDown[state.faceIndex] = false
      } else {
        this.mouseDowned[state.faceIndex] = true
        this.mouseDown[state.faceIndex] = true
      }
      this.triggerClick(state.face, state.faceIndex)

      // Styles
      state.instance.cursor.$el.style.background = '#f00'
      state.instance.cursor.$el.style.border = '2px solid #ff0'
      state.instance.cursor.$el.classList.add('handsfree-clicked')
    } else {
      this.mouseUp[state.faceIndex] = this.mouseDowned[state.faceIndex]
      this.mouseDowned[state.faceIndex] = this.mouseDrag[state.faceIndex] = this.mouseDown[state.faceIndex] = false

      // Styles
      state.instance.cursor.$el.style.background = '#ff0'
      state.instance.cursor.$el.style.border = '2px solid #f00'
      state.instance.cursor.$el.classList.remove('handsfree-clicked')
    }

    return {
      mouseDown: this.mouseDown[state.faceIndex],
      mouseDrag: this.mouseDrag[state.faceIndex],
      mouseUp: this.mouseUp[state.faceIndex]
    }
  },

  /**
   * Triggers a click
   * - Fires a click event
   * - Focuses the element if it's focusable
   *
   * @param {Object}  face  The face object
   * @param {Integer} index The face index
   */
  triggerClick: function (face, index) {
    const $el = face.cursor.$target

    if ($el && this.mouseDown[index]) {
      // Click
      $el.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientX: face.cursor.x,
        clientY: face.cursor.y
      }))

      // Focus
      if (['INPUT', 'TEXTAREA', 'BUTTON', 'A'].includes($el.nodeName))
        $el.focus()
    }
  }
}
