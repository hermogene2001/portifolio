const switcher = document.querySelector('.style-switcher')
const switcherToggle = document.querySelector('.style-switcher-toggler')

if (switcher && switcherToggle) {
  switcherToggle.addEventListener('click', () => {
    switcher.classList.toggle('open')
  })

  window.addEventListener('scroll', () => {
    if (switcher.classList.contains('open')) {
      switcher.classList.remove('open')
    }
  })
}

window.setActiveStyle = function setActiveStyle(color) {
  document
    .querySelectorAll('.alternate-style')
    .forEach((style) => (style.disabled = style.getAttribute('title') !== color))

  localStorage.setItem('portfolio_color', color)
}

const savedColor = localStorage.getItem('portfolio_color')
if (savedColor) {
  window.setActiveStyle(savedColor)
}
