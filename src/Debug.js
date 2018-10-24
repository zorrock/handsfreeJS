module.exports = Handsfree => {
  /**
   * Inject the debugger, which includes a video, canvas, and wrapping div
   */
  Handsfree.prototype.injectDebugger = function () {
    let $webcam
    let $canvas
    let $wrap
    let $parent

    // Create debug elements
    this.debug.$wrap = $wrap = document.createElement('div')
    this.debug.$webcam = $webcam = document.createElement('video')
    this.debug.$canvas = $canvas = document.createElement('canvas')

    $wrap.classList.add('handsfree-debugger')
    $webcam.classList.add('handsfree-webcam')
    $canvas.classList.add('handsfree-canvas')

    // Apply minimal styles
    $webcam.setAttribute('playsinline', 'playsinline')
    $wrap.style.display = 'none'
    $wrap.style.position = 'relative'
    $webcam.style.transform = 'scale(-1, 1)'
    $canvas.style.transform = 'scale(-1, 1)'
    $canvas.style.position = 'absolute'
    $canvas.style.top = '0px'
    $canvas.style.left = '-25%'
    $canvas.style.width = '150%'
    $canvas.style.height = 'auto'

    // Inject
    $parent = document.querySelector('.handsfree-debug-wrap')
    if (!$parent) $parent = document.body

    $parent.appendChild($wrap)
    $wrap.appendChild($webcam)
    $wrap.appendChild($canvas)
  }

  /**
   * Draws the faces onto the debugger canvas
   */
  Handsfree.prototype.drawFaces = function () {
    const ctx = this.debug.ctx
    ctx.clearRect(0, 0, this.debug.$canvas.width, this.debug.$canvas.height)

    this.faces.forEach(face => {
      if (face.state === this.brf.sdk.BRFState.FACE_TRACKING_START || face.state === this.brf.sdk.BRFState.FACE_TRACKING) {
        // Draw Triangles
        ctx.strokeStyle = '#ff0'
        ctx.lineWidth = 2
        for (let i = 0; i < face.triangles.length; i += 3) {
          ctx.beginPath()
          let vertex = face.triangles[i]
          ctx.moveTo(face.vertices[vertex * 2], face.vertices[vertex * 2 + 1])
          vertex = face.triangles[i + 1]
          ctx.lineTo(face.vertices[vertex * 2], face.vertices[vertex * 2 + 1])
          vertex = face.triangles[i + 2]
          ctx.lineTo(face.vertices[vertex * 2], face.vertices[vertex * 2 + 1])
          ctx.stroke()
        }

        // Draw Vertices
        ctx.lineWidth = 3
        for (let i = 0; i < face.vertices.length; i += 2) {
          let vertex = i / 2

          // Set colors
          if (vertex > 47 && vertex < 69) ctx.strokeStyle = '#f0f'
          else if (vertex > 35 && vertex < 48) ctx.strokeStyle = '#0f0'
          else if (vertex === 27) ctx.strokeStyle = '#f00'
          else ctx.strokeStyle = '#ff0'

          ctx.beginPath()
          ctx.arc(face.vertices[i], face.vertices[i + 1], 3, 0, 2 * Math.PI)
          ctx.stroke()
        }
      }
    })
  }

  /**
   * Toggle Debugger
   * @param {Boolean|Null} state Whether to turn it on (true), off (false), or flip between the two (null)
   */
  Handsfree.prototype.toggleDebugger = function (state = null) {
    if (typeof state === 'boolean') this.debug.isDebugging = state
    else this.debug.isDebugging = !this.opts.debug

    this.debug.$wrap.style.display = this.debug.isDebugging ? 'inline-block' : 'none'
  }
}
