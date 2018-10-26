/**
 * Activate clicks with a smile
 * @type {Object}
 */
module.exports = {
  name: 'SmileClick',

  onFrame: function (faces, instance) {
    faces.forEach(face => {
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

      if (smileFactor >= 1) {
        instance.cursor.$el.style.background = '#f00'
        instance.cursor.$el.style.border = '2px solid #ff0'
        instance.cursor.$el.classList.add('handsfree-clicked')
        this.triggerClick(instance)
      } else {
        instance.cursor.$el.style.background = '#ff0'
        instance.cursor.$el.style.border = '2px solid #f00'
        instance.cursor.$el.classList.remove('handsfree-clicked')
      }
    })
  },

  /**
   * Triggers a click
   * - Fires a click event
   * - Focuses the element if it's focusable
   */
  triggerClick: function (instance) {
    const $el = document.elementFromPoint(instance.cursor.x, instance.cursor.y)

    if ($el) {
      // Click
      $el.dispatchEvent(new MouseEvent('click', {
        clientX: instance.cursor.x,
        clientY: instance.cursor.y
      }))

      // Focus
      if (['INPUT', 'TEXTAREA', 'BUTTON', 'A'].includes($el.nodeName))
        $el.focus()
    }
  }
}
