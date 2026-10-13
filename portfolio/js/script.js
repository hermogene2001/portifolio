const htmlElement = document.documentElement
const themeToggle = document.getElementById('themeToggle')
const switcherThemeToggle = document.getElementById('switcherThemeToggle')
const sections = document.querySelectorAll('section[id]')
const navLinks = document.querySelectorAll('.nav-link')
const scrollTopBtn = document.getElementById('scrollTopBtn')
const cursorGlow = document.querySelector('.cursor-glow')
const projectFilters = document.querySelectorAll('.filter-btn')
const projectItems = document.querySelectorAll('.project-item')

const setTheme = (theme) => {
  htmlElement.setAttribute('data-theme', theme)
  localStorage.setItem('portfolio_theme', theme)

  const isDark = theme === 'dark'
  const iconClass = isDark ? 'fa-sun' : 'fa-moon'

  ;[themeToggle, switcherThemeToggle].forEach((toggle) => {
    if (!toggle) return
    const icon = toggle.querySelector('i')
    if (icon) {
      icon.classList.remove('fa-moon', 'fa-sun')
      icon.classList.add(iconClass)
    }
  })
}

const savedTheme = localStorage.getItem('portfolio_theme') || 'light'
setTheme(savedTheme)

;[themeToggle, switcherThemeToggle].forEach((toggle) => {
  if (!toggle) return
  toggle.addEventListener('click', () => {
    const nextTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
  })
})

if (window.Typed) {
  new window.Typed('.typing-text', {
    strings: [
      'Full-Stack Developer',
      'AI & ML Enthusiast',
      'Data & Database Systems',
      'IoT Solutions',
      'Freelancer',
      'Digital Transformation',
    ],
    typeSpeed: 75,
    backSpeed: 45,
    backDelay: 1300,
    loop: true,
  })
}

if (window.AOS) {
  window.AOS.init({
    duration: 850,
    once: true,
    easing: 'ease-out-cubic',
  })
}

const setActiveNav = () => {
  const scrollY = window.pageYOffset

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute('id')

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach((link) => link.classList.remove('active'))
      const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`)
      if (activeLink) activeLink.classList.add('active')
    }
  })
}

window.addEventListener('scroll', () => {
  setActiveNav()

  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('show', window.scrollY > 420)
  }
})

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const menu = document.querySelector('.navbar-collapse.show')
    if (menu && window.bootstrap) {
      new window.bootstrap.Collapse(menu, { toggle: true })
    }
  })
})

projectFilters.forEach((button) => {
  button.addEventListener('click', () => {
    projectFilters.forEach((btn) => btn.classList.remove('active'))
    button.classList.add('active')

    const filter = button.dataset.filter

    projectItems.forEach((item) => {
      const categories = item.dataset.category || ''
      const shouldShow = filter === 'all' || categories.includes(filter)
      item.classList.toggle('hide', !shouldShow)
    })
  })
})

if (cursorGlow && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('mousemove', (event) => {
    cursorGlow.style.left = `${event.clientX}px`
    cursorGlow.style.top = `${event.clientY}px`
  })
} else if (cursorGlow) {
  cursorGlow.style.display = 'none'
}

const yearNode = document.getElementById('year')
if (yearNode) {
  yearNode.textContent = new Date().getFullYear().toString()
}

const contactForm = document.querySelector('.contact-form')
if (contactForm) {
  const formStatus = document.createElement('p')
  formStatus.className = 'form-status'
  contactForm.appendChild(formStatus)

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const formData = new FormData(contactForm)
    const isLocalPreview = ['localhost', '127.0.0.1'].includes(window.location.hostname)

    formStatus.textContent = 'Sending your message...'
    formStatus.classList.remove('success', 'error')
    formStatus.classList.add('visible')

    if (isLocalPreview) {
      formStatus.textContent = 'Your message is ready to send. Deploy this site to Netlify to receive submissions.'
      formStatus.classList.add('success')
      contactForm.reset()
      return
    }

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      })

      formStatus.textContent = 'Your message was sent successfully. I will get back to you soon.'
      formStatus.classList.add('success')
      contactForm.reset()
    } catch (error) {
      formStatus.textContent = 'Something went wrong while sending the message. Please email me directly.'
      formStatus.classList.add('error')
    }
  })
}

setActiveNav()
