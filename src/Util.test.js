const STUBS = require('../test/jest-polyfills')
const Handsfree = require('./Handsfree')
let handsfree = null
let faces = require('../assets/avatar/face-001')
STUBS.mediaDevices.support()

describe('Handsfree.throwError()', () => {
  it('Throws an error', () => {
    handsfree = new Handsfree({debug: true})
    STUBS.mediaDevices.unsupport()
    expect(handsfree.checkForMediaSupport).toThrow(Error)
  })
})
