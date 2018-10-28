const STUBS = require('../test/jest-polyfills')
const Handsfree = require('./Handsfree')
let handsfree = null
let faces = require('../assets/avatar/face-001')
STUBS.mediaDevices.support()

describe('Handsfree.injectDebugger()', () => {
  it('Fails if getUserMedia is not supported', () => {
    handsfree = new Handsfree({debug: true})
    expect(handsfree.debug.$wrap).toBeTruthy()
    expect(handsfree.debug.$webcam).toBeTruthy()
    expect(handsfree.debug.$canvas).toBeTruthy()
  })
})

describe('Handsfree.toggleDebugger()', () => {
  it('Can toggle the debugger on/off', () => {
    handsfree = new Handsfree({debug: true})

    handsfree.toggleDebugger(false)
    expect(handsfree.debug.$wrap.style.display).toBe('none')
    handsfree.toggleDebugger(true)
    expect(handsfree.debug.$wrap.style.display).toBe('inline-block')
    handsfree.toggleDebugger()
    expect(handsfree.debug.$wrap.style.display).toBe('none')
  })
})

describe('Handsfree.drawFaces()', () => {
  it('Can draw faces', () => {
    handsfree = new Handsfree({debug: true})

    handsfree.debug.ctx.clearRect = jest.fn()
    handsfree.debug.ctx.beginPath = jest.fn()
    handsfree.debug.ctx.moveTo = jest.fn()
    handsfree.debug.ctx.lineTo = jest.fn()
    handsfree.debug.ctx.stroke = jest.fn()
    handsfree.debug.ctx.arc = jest.fn()

    handsfree.faces = faces
    handsfree.drawFaces()
    expect(handsfree.debug.ctx.clearRect).toHaveBeenCalled()
    expect(handsfree.debug.ctx.beginPath).toHaveBeenCalled()
    expect(handsfree.debug.ctx.moveTo).toHaveBeenCalled()
    expect(handsfree.debug.ctx.lineTo).toHaveBeenCalled()
    expect(handsfree.debug.ctx.stroke).toHaveBeenCalled()
    expect(handsfree.debug.ctx.arc).toHaveBeenCalled()
  })
})
