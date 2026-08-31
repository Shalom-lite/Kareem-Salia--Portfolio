# Personal Portfolio Website

A modern, responsive single-page portfolio for **Kareem Abiodun Salia** — Web Developer, UI/UX Designer and Graphic Designer. Built as the Phase 1 internship project using plain HTML, CSS, JavaScript and a small PHP backend for the contact form — no frameworks, no build tools.

---

## Description

The website presents who Kareem is, what he does, and how to get in touch:

- **Hero** — name, roles, short introduction, calls to action and social links
- **About** — introduction, career objective, interests and "what I do" cards
- **Skills** — Frontend / Backend / Tools / Design categories with technology badges
- **Projects** — three real projects with descriptions, tech stacks and links
- **Education** — editable placeholder timeline plus an honest self-learning entry
- **Resume** — download button pointing to `resume/Kareem Salia Abiodun CV.pdf`
- **Contact** — contact details and a validated contact form processed by `contact.php`

The site ships in **dark mode by default** with a light/dark toggle that remembers your choice.

## Technologies

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Structure | HTML5 (semantic markup)             |
| Style     | CSS3 (variables, Grid, Flexbox)     |
| Behaviour | Vanilla JavaScript (ES6)            |
| Backend   | PHP (form processing only)          |
| Icons     | Font Awesome 6 (CDN)                |
| Fonts     | Google Fonts — Inter & Sora         |
| Versioning| Git / GitHub                        |

No React, Vue, Angular, TypeScript, Tailwind or Bootstrap were used.

## Features

- Sticky navigation with smooth scrolling and active-section highlighting
- Mobile hamburger menu with slide-down animation (closes on selection/outside click/Esc)
- Light/dark theme toggle saved in `localStorage` (no flash of the wrong theme on load)
- Scroll-reveal animations powered by `IntersectionObserver`
- Back-to-top button that appears after scrolling
- Client-side **and** server-side contact form validation with clear error messages
- Honest form behaviour: if email isn't configured yet, messages are stored locally and the visitor is told so
- Accessible: semantic HTML, labelled inputs, focus states, skip link, ARIA attributes, `prefers-reduced-motion` support
- Responsive from 320 px phones up to large desktops — no horizontal scrolling
- Basic SEO: title, meta description, author and Open Graph tags


## Installation / Running Locally

### Option A — Frontend only (quickest)

1. Download or clone this folder.
2. Double-click `index.html`, or open it with VS Code's **Live Server** extension.
   - Everything works except sending the contact form (that needs PHP).

### Option B — Full experience with XAMPP (recommended)

1. Install [XAMPP](https://www.apachefriends.org/) and start **Apache** from its control panel.
2. Copy the whole `portfolio` folder into:
   ```
   C:\xampp\htdocs\
   ```
   so you end up with `C:\xampp\htdocs\portfolio\`.
3. Open your browser and visit:
   ```
   http://localhost/portfolio/
   ```
4. The contact form now runs through PHP. In demo mode it saves messages to
   `messages/contact-log.txt` inside the project (see *Enabling Email Delivery* below).
