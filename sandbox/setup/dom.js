/**
 * Setup sections to be 100% height
 */
window.addEventListener('resize', () => {
  const height = window.outerHeight
  document.querySelectorAll('section').forEach(section => {
    section.style.minHeight = `${height}px`
  })
})
window.dispatchEvent(new Event('resize'))
