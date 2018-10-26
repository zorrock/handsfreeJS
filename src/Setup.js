const {assign} = require('lodash')

module.exports = Handsfree => {
  /**
   * Applies the instantiation config
   */
  Handsfree.prototype.applyConfig = function (opts) {
    opts = assign({
      debug: false
    }, opts)

    this.opts = opts
  }

  /**
   * Reads the Web ASM Binary into a buffer if it's supported
   */
  Handsfree.prototype.initAndMaybeReadWASMBinary = function () {
    if (this.isWASMSupported) {
      let xhr = new XMLHttpRequest()
      let url = this.brf.baseURL + this.brf.sdkName + '.wasm'
      let onError = err => this.throwError(err)
      let onProgress = progress => console.log(progress)

      xhr.open('GET', url, true)
      xhr.responseType = 'arraybuffer'
      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 0 && xhr.response) {
          this.brf.WASMBuffer = xhr.response
          this.init()
        } else {
          onError()
        }
      }
      xhr.onerror = onError
      xhr.onprogress = onProgress
      xhr.send(null)
    } else {
      this.init()
    }
  }

  /**
   * Initializes BRFv4
   */
  Handsfree.prototype.init = function () {
    this.injectBRFv4()
    this.injectDebugger()
    this.injectCursor()
    this.loadPlugins()
  }

  /**
   * Injects the BRFv4 library into the DOM
   */
  Handsfree.prototype.injectBRFv4 = function () {
    let $script = document.createElement('script')

    $script.setAttribute('type', 'text/javascript')
    $script.setAttribute('async', true)
    $script.setAttribute('src', this.brf.baseURL + this.brf.sdkName + '.js')

    document.body.appendChild($script)
  }

  /**
   * Actually starts BRFv4 (once stream dimensions are known)
   */
  Handsfree.prototype.startBRFv4 = function () {
    const $webcam = this.debug.$webcam
    const $canvas = this.debug.$canvas

    if ($webcam.videoWidth === 0) {
      // @FIXME let's optimize this wait time
      setTimeout(() => this.startBRFv4(), 50)
    } else {
      // Resize canvas to stream
      $canvas.width = $webcam.videoWidth
      $canvas.height = $webcam.videoHeight

      this.waitForSDK()
    }
  }

  /**
   * Wait for the BRFv4 SDK to finish loading before initializing it
   */
  Handsfree.prototype.waitForSDK = function () {
    // Set up the namespace and initialize BRFv4.
    // locateFile tells the asm.js version where to find the .mem file.
    // wasmBinary gets the preloaded .wasm file.
    if (this.brf.sdk === null && window.hasOwnProperty('initializeBRF')) {
      this.brf.sdk = {
        locateFile: fileName => this.brf.baseURL + fileName,
        wasmBinary: this.brf.WASMBuffer
      }
      initializeBRF(this.brf.sdk)
    }

    if (this.brf.sdk && this.brf.sdk.sdkReady) {
      this.initSDK()
    } else {
      // @FIXME let's optimize this wait time
      setTimeout(() => this.waitForSDK(), 250)
    }
  }

  /**
   * Finally, let's initialize the SDK
   */
  Handsfree.prototype.initSDK = function () {
    this.brf.resolution = new this.brf.sdk.Rectangle(0, 0, this.debug.$canvas.width, this.debug.$canvas.height)
    this.brf.manager = new this.brf.sdk.BRFManager()
    this.brf.manager.init(this.brf.resolution, this.brf.resolution, 'js.handsfree')

    this.trackFaces()
  }
}
