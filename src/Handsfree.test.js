const STUBS = require('../test/jest-polyfills')
const Handsfree = require('./Handsfree')
let handsfree = null

/**
 * Constructor
 */
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
