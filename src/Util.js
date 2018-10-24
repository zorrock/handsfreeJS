module.exports = Handsfree => {
  /**
   * Checks that the environment supports this project,
   * by peaking into the available canvas API
   */
  Handsfree.prototype.checkForMediaSupport = function () {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        let canvas = document.createElement('canvas')
        this.isSupported = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        canvas.remove()
      } catch (e) {
        this.throwError('ERROR: This browser does not support webcams, please try another browser...like Google Chrome!')
      }
    }
  }

  /**
   * Throws an error by notifiying the user
   * @param  {String} msg The message to display
   */
  Handsfree.prototype.throwError = function (msg) {
    throw new Error(msg)
    console.error(e)
    alert(msg)
  }
}
