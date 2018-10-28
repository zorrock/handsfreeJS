const STUBS = require('../test/jest-polyfills')
const Handsfree = require('./Handsfree')
let handsfree = null

describe('Constructor', () => {
  it('Fails if getUserMedia is not supported', () => {
    STUBS.mediaDevices.unsupport()
    try {handsfree = new Handsfree()} catch (e) {}
    expect(handsfree).toBeFalsy()

    // Set mediaDevices and try again
    STUBS.mediaDevices.support()
    STUBS.WebGL.support()
    handsfree = new Handsfree()
    expect(handsfree).toBeTruthy()
  })
})

describe('Handsfree.start()', () => {
  it('Adds body classes', () => {
    handsfree = new Handsfree({debug: true})
    document.body.classList =''

    Handsfree.trackFaces = jest.fn()
    Handsfree.startBRFv4 = jest.fn()

    expect(document.body.classList.contains('handsfree-started')).toBeFalsy()
    expect(document.body.classList.contains('handsfree-stopped')).toBeFalsy()
    handsfree.start()
    expect(document.body.classList.contains('handsfree-started')).toBeTruthy()
    expect(document.body.classList.contains('handsfree-stopped')).toBeFalsy()
  })
})

describe('Handsfree.stop()', () => {
  it('Removes body classes', () => {
    handsfree = new Handsfree({debug: true})
    document.body.classList =''

    Handsfree.trackFaces = jest.fn()
    Handsfree.startBRFv4 = jest.fn()

    handsfree.start()
    handsfree.stop()
    expect(document.body.classList.contains('handsfree-started')).toBeFalsy()
    expect(document.body.classList.contains('handsfree-stopped')).toBeTruthy()
  })

  it('Turns off tracking', () => {
    handsfree = new Handsfree({debug: true})
    handsfree.isTracking = true
    Handsfree.startBRFv4 = jest.fn()

    handsfree.stop()
    expect(handsfree.isTracking).toBeFalsy()
  })

  it('Stops debugger', () => {
    handsfree = new Handsfree({debug: true})
    handsfree.isTracking = true
    handsfree.debug.isDebugging = true
    Handsfree.startBRFv4 = jest.fn()

    handsfree.stop()
    expect(handsfree.debug.isDebugging).toBeFalsy()
    expect(handsfree.debug.$wrap.style.display).toBe('none')
  })
})
