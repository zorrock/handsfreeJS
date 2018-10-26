const {forEach} = require('lodash')

module.exports = Handsfree => {
  /**
   * Adds a plugin
   * @param {Object} config The config object, in the form:
   * {
   *   // [required] The plugin name, which is how you access it: handsfree.plugin[pluginName]
   *   name: {String},
   *
   *   // Called once when the .use method is called and after the plugin is added to the instance
   *   onUse: {Function (face)},
   *
   *   // Called once per frame, after calculations
   *   onFrame: {Function}
   * }
   */
  Handsfree.prototype.use = function (config) {
    this.plugin[config.name] = config
    config.onUse && config.onUse()
  }

  /**
   * Called once per frame, after calculations
   */
  Handsfree.prototype.onFrameHooks = function (faces) {
    forEach(this.plugin, (config, name) => {
      config.onFrame && config.onFrame.call(config, faces, this)
    })
  }

  /**
   * Loads all the core plugins
   */
  Handsfree.prototype.loadPlugins = function () {
    this.use(require('./plugins/Scrolling'))
  }
}
