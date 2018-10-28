const STUBS = require('../test/jest-polyfills')
const Handsfree = require('./Handsfree')
let handsfree = null
let faces = require('../assets/avatar/face-001')

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

    handsfree.start()
    handsfree.stop()
    expect(document.body.classList.contains('handsfree-started')).toBeFalsy()
    expect(document.body.classList.contains('handsfree-stopped')).toBeTruthy()
  })

  it('Turns off tracking', () => {
    handsfree = new Handsfree({debug: true})
    handsfree.isTracking = true

    handsfree.stop()
    expect(handsfree.isTracking).toBeFalsy()
  })

  it('Stops debugger', () => {
    handsfree = new Handsfree({debug: true})
    handsfree.isTracking = true
    handsfree.debug.isDebugging = true

    handsfree.stop()
    expect(handsfree.debug.isDebugging).toBeFalsy()
    expect(handsfree.debug.$wrap.style.display).toBe('none')
  })
})

describe('Handsfree.calculateXY()', () => {
  it('Sets the correct cursor x/y', () => {
    handsfree = new Handsfree({debug: true})
    handsfree.faces = faces

    expect(handsfree.cursor.x).toBe(-100)
    expect(handsfree.cursor.y).toBe(-100)

    handsfree.calculateXY()
    expect(handsfree.cursor.x).not.toBe(-100)
    expect(handsfree.cursor.y).not.toBe(-100)
  })
})

describe('Handsfree.setTouchedElement()', () => {
  it('Sets a cursor.$target', () => {
    handsfree = new Handsfree({debug: true})
    handsfree.faces = faces

    handsfree.setTouchedElement()
    expect(handsfree.faces[0].cursor.$target).toBeTruthy()
  })
})

describe('Handsfree.trackFaces()', () => {
  it('Enables tracking', () => {
    handsfree = new Handsfree({debug: true})
    handsfree.isTracking = false
    handsfree.brf.resolution = 640
    handsfree.brf.manager.update = jest.fn()
    handsfree.brf.manager.getFaces = jest.fn()
    handsfree.calculateXY = jest.fn()
    handsfree.setTouchedElement = jest.fn()
    handsfree.onFrameHooks = jest.fn()
    handsfree.faces = faces

    handsfree.trackFaces()

    expect(handsfree.isTracking).toBeTruthy()
    expect(handsfree.onFrameHooks).toHaveBeenCalled()
  })
})
