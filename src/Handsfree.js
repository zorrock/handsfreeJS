const {trimStart} = require('lodash')

class Handsfree {
  constructor (opts = {}) {
    // Flags
    this.isTracking = false
    this.isSupported = false
    this.isWASMSupported = typeof WebAssembly === 'object'

    // The collection of plugins by name
    this.plugin = {}

    // Properties
    // @see this.injectDebugger
    this.debug = {
      // Whether we're actually debugging or not
      isDebugging: false,
      // The webcam stream
      $webcam: null,
      // The canvas to display debug info on
      $canvas: null,
      // The canvas context
      ctx: null,
      // The wrapping element
      $wrap: null
    }

    // BRFv4 config
    this.brf = {
      // Will fallback to ASM if Web ASM isn't supported
      baseURL: this.isWASMSupported ? `${Handsfree.libPath}/assets/libs/brf_wasm/` : `${Handsfree.libPath}/assets/libs/brf_asm/`,
      // The BRFv4 Manager
      manager: null,
      // The BRFv4 Resolution
      resolution: null,
      // The loaded BRFv4 sdk library
      sdk: null,
      // The SDK version we're using
      sdkName: 'BRFv4_JS_TK110718_v4.1.0_trial',
      // The Web ASM buffer
      WASMBuffer: null
    }

    this.cursor = {
      $el: null,
      x: -100,
      y: -100
    }

    // The tracked faces object
    this.faces = null

    // Apply config options
    this.opts = opts
    this.applyConfig(opts)

    // Error out if we don't have support
    this.checkForMediaSupport()

    // Initialize and read the BRFv4 Web Assembly binoary into a buffer
    this.initAndMaybeReadWASMBinary()
    document.body.classList.add('handsfree-stopped')
  }

  /**
   * Starts the webcam stream
   */
  start () {
    this.toggleDebugger(this.opts.debug)
    document.body.classList.add('handsfree-started')
    document.body.classList.remove('handsfree-stopped')

    window.navigator.mediaDevices.getUserMedia({
      video: {width: 640, height: 480, frameRate: 30}
    }).then(mediaStream => {
      this.debug.$webcam.srcObject = mediaStream
      this.debug.$webcam.play()

      if (!this.brf.sdk) {
        this.startBRFv4()
      } else {
        this.trackFaces()
      }
    }).catch(err => this.throwError('There are no cameras available.'))
  }

  /**
   * Stop tracking and release webcam streams
   */
  stop () {
    document.body.classList.remove('handsfree-started')
    document.body.classList.add('handsfree-stopped')

    if (this.isTracking) {
      this.isTracking = false
      this.debug.$webcam.srcObject.getTracks().forEach(track => track.stop())
      this.toggleDebugger(false)
    }
  }

  /**
   * Toggle the tracker
   * @param {Boolean|Null} state Whether to start (true) or stop (false), or flip between the two (null)
   */
  toggle (state = null) {
    if (typeof state === 'boolean') this.tracking = state
    else this.tracking = !this.tracking

    if (this.tracking) this.start()
    else this.stop()
  }

  /**
   * Tracks faces
   */
  trackFaces () {
    const ctx = this.debug.ctx
    const resolution = this.brf.resolution
    this.isTracking = true

    // mirrors the context
    ctx.setTransform(-1, 0, 0, 1, resolution.widht, 0)
    ctx.drawImage(this.debug.$webcam, 0, 0, resolution.width, resolution.height)
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    // Get faces
    this.brf.manager.update(ctx.getImageData(0, 0, resolution.width, resolution.height).data)
    this.faces = this.brf.manager.getFaces()

    // Do things with faces
    this.debug.isDebugging && this.drawFaces()
    this.calculateXY()
    this.setTouchedElement()
    this.onFrameHooks(this.faces)

    // Dispatch global event
    window.dispatchEvent(new CustomEvent('handsfree-trackFaces', {detail: {
      scope: this,
      faces: this.faces
    }}))

    // Only loop if we're tracking
    this.isTracking && requestAnimationFrame(() => this.trackFaces())
  }

  /**
   * Returns the element under the face and stores it as face.$target
   */
  setTouchedElement () {
    this.faces.forEach((face, i) => {
      this.faces[i].cursor.$target = document.elementFromPoint(face.cursor.x, face.cursor.y)
    })
  }

  /**
   * Calculates the X/Y the user is facing
   */
  calculateXY () {
    this.faces.forEach((face, i) => {
      // Maps a point on the canvas with a point on the window
      const ratio = {
        width: window.outerWidth / this.debug.$canvas.width,
        height: window.outerHeight / this.debug.$canvas.height
      }

      // @TODO Include offsets and cursor dimensions
      // Calculate X/Y
      let x = -face.translationX * ratio.width + this.debug.$canvas.width + window.outerWidth / 2
      let y = face.translationY * ratio.height
      this.cursor.x = x += Math.sin(face.rotationY) * 2 * window.outerWidth
      this.cursor.y = y += Math.sin(face.rotationX) * 2 * window.outerHeight

      // Update pointer and vars
      this.cursor.$el.style.left = `${x}px`
      this.cursor.$el.style.top = `${y}px`

      this.faces[i].cursor = {
        x,
        y
      }
    })
  }
}

// Set the lib path to whereever this file is, this is required for loading the BRFv4 SDK
Handsfree.libPath = trimStart(document.currentScript.getAttribute('src').replace('handsfree.js', ''), '/')

// Remember: to kick things off you'll want to instantiate this with `new`
require('./Setup')(Handsfree)
require('./Util')(Handsfree)
require('./Debug')(Handsfree)
require('./Plugin')(Handsfree)
require('./components/Cursor')(Handsfree)
module.exports = Handsfree
