const STUBS = require('../test/jest-polyfills')
const Handsfree = require('./Handsfree')
let handsfree = null
let faces = require('../assets/avatar/face-001')
STUBS.mediaDevices.support()

describe('Handsfree.use()', () => {
  it('Adds a plugin to handsfree.plugin', () => {
    handsfree = new Handsfree({debug: true})

    handsfree.use({name: 'UnitTest123'})
    expect(handsfree.plugin['UnitTest123']).toBeTruthy()
  })

  it('Runs the onUse callback', () => {
    handsfree = new Handsfree({debug: true})

    handsfree.use({name: 'UnitTest123', onUse: jest.fn()})
    expect(handsfree.plugin['UnitTest123'].onUse).toHaveBeenCalled()
  })

  it('Sorts plugins alphabetically', () => {
    let plugins = []
    handsfree = new Handsfree({debug: true})

    handsfree.use({name: 'UnitTest123'})
    handsfree.use({name: 'UnitTest000'})
    handsfree.use({name: 'UnitTest999'})

    for (let plugin in handsfree.plugin) {
      plugins.push(handsfree.plugin[plugin].name)
    }

    expect(plugins[0]).toBe('UnitTest000')
    expect(plugins[1]).toBe('UnitTest123')
    expect(plugins[2]).toBe('UnitTest999')
  })

  it('onFrame hooks are called', () => {
    handsfree = new Handsfree({debug: true})

    handsfree.use({name: 'UnitTest123', onFrame: jest.fn()})
    handsfree.onFrameHooks(faces)

    expect(handsfree.plugin['UnitTest123'].onFrame).toHaveBeenCalled()
  })
})
