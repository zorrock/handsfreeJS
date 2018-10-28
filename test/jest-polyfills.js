/**
 * A suite of polyfill togglers for testing with jest
 */

/**
 * Catch window.alert
 */
window.alert = function () {}

/**
 * Suppress known error messages
 */
window.consoleError = console.error
console.error = function (message, ...args) {
  switch (message) {
    case 'ERROR: This browser does not support webcams, please try another browser...like Google Chrome!':
    break
    default:
      window.consoleError(message, ...args)
  }
}

module.exports = {
  mediaDevices: {
    support () {
      window.HTMLMediaElement.prototype.load = () => {}
      window.HTMLMediaElement.prototype.play = () => {}
      window.HTMLMediaElement.prototype.pause = () => {}
      window.HTMLMediaElement.prototype.addTextTrack = () => {}
      window.HTMLMediaElement.prototype.srcObject = {
        getTracks: () => [{stop: jest.fn()}]
      }
      navigator.mediaDevices = {
        getUserMedia: function () {
          return {
            then: function () {
              return {
                catch: function () {}
              }
            }
          }
        }
      }
    },
    unsupport () {navigator.mediaDevices = null}
  },

  WebGL: {
    support () {window.WebGLRenderingContext = true},
    unsupport () {window.WebGLRenderingContext = false}
  }
}
