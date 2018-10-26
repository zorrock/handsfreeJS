/**
 * Handles page scrolling
 */
module.exports = {
  name: 'Scrolling',

  // The multiplier to scroll the page by
  scrollSpeed: 0.1,

  /**
   * Scrolls the page when the cursor is above/below the screen
   * @param {Array}     faces    The array of face objects
   * @param {Handsfree} instance The handsfree instance
   */
  onFrame (faces, instance) {
    faces.forEach(face => {
      let x = face.cursor.x
      let y = face.cursor.y

      // Then add the points to the cursor!
      instance.cursor.$el.style.left = x + 'px'
      instance.cursor.$el.style.top = y + 'px'

      // Scroll the page
      if (y < 0)
        window.scrollTo(0, window.scrollY + y * this.scrollSpeed)
      else if (y > window.innerHeight)
        window.scrollTo(0, window.scrollY + (y - window.innerHeight) * this.scrollSpeed)
    })
  }
}
