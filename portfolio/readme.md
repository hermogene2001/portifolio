# UKUNDAYEZU Hermogene Portfolio

A premium, modern, elegant personal portfolio website built with HTML5, CSS3, JavaScript, Bootstrap 5, and Font Awesome.

## Structure

```
portfolio/
├── index.html
├── css/
│   ├── style.css
│   ├── skins/
│   │   ├── color-1.css
│   │   ├── color-2.css
│   │   ├── color-3.css
│   │   ├── color-4.css
│   │   └── color-5.css
│   └── style-switcher.css
├── js/
│   ├── script.js
│   └── style-switcher.js
├── images/
│   ├── hero.jpg            (real headshot, copied from ../headshot-on-white.jpg)
│   ├── about.jpg           (real headshot)
│   ├── project-1.svg ... project-5.svg   (branded SVG covers)
│   ├── client-1.svg ... client-3.svg     (initial avatars)
│   ├── cv.pdf              (generated CV)
│   └── (legacy .jpg placeholders kept for reference)
└── README.md
```

## How to Run

1. Open `portfolio/index.html` in any browser.
2. For best behavior with external libraries, use a local static server.
3. Example: `npx serve portfolio`

## Features Included

- Premium one-page layout
- Sticky navigation + active section highlight
- Smooth scrolling + scroll-to-top button
- Light/Dark mode toggle
- 5-color theme switcher panel
- Typing animation (Typed.js)
- Scroll reveal animations (AOS)
- Responsive design for mobile, tablet, desktop
- Project filters and premium hover effects

## Customize Before Going Live

- Replace `your-email@example.com` with a real email.
- Replace `+250 XXX XXX XXX` with a real phone number.
- Replace all social links (`#`) with real profiles.
- ⚠️ `images/cv.pdf` is an auto-generated summary CV — replace with a fully detailed CV and keep the filename (or update the two links in `index.html`).
- Add real project **Live Demo / GitHub / Case Study** URLs in the projects section (currently `#`).
- Add real client testimonials (currently generic).
- Replace placeholder `.jpg` images in `images/` with real brand/project assets if preferred.
- `images/hero.jpg` and `images/about.jpg` currently use `../headshot-on-white.jpg`.
