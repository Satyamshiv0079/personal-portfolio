# Satyam Shiv — Personal Portfolio

Personal portfolio website for Satyam Shiv, a Backend-focused Software Engineer and B.Tech CSE student.

## Live Website

**[satyamshiv0079.github.io/personal-portfolio](https://satyamshiv0079.github.io/personal-portfolio/)**

## Overview

A static, single-page portfolio built with HTML, CSS, and vanilla JavaScript — no frameworks or build tools required. It presents Satyam's projects, technical skills, education, virtual internships, certifications, and contact information.

## Features

- **Dark glassmorphism design** — frosted glass cards with purple/blue accent system
- **Interactive particle canvas** — WebGL-free, pauses when tab is hidden, reduced on mobile
- **Project filter** — filter by Full-Stack, AI/GenAI, or Backend
- **Tag-based skill section** — no fabricated percentage bars
- **Separated Certifications and Achievements** — honest, clearly labelled sections
- **Virtual Internships clearly labelled** — not presented as conventional employment
- **Portfolio Assistant** — rule-based keyword-matching Q&A widget (not an LLM)
- **Honest contact form** — opens the user's email client via `mailto:`, no fake submission
- **Accessibility** — semantic HTML, ARIA labels, keyboard navigation, `focus-visible`, reduced-motion support
- **Responsive layout** — tested from 320px to 1920px, zero horizontal overflow
- **SEO metadata** — title, description, Open Graph, Twitter Card, canonical URL

## Tech Stack

| Layer | Tech |
|---|---|
| HTML | Semantic HTML5 |
| CSS | Custom properties, CSS Grid, Flexbox, glassmorphism |
| JavaScript | Vanilla ES6+ (IIFE, no dependencies) |
| Fonts | Google Fonts — Outfit, Plus Jakarta Sans |
| Icons | Font Awesome 6 |
| Hosting | GitHub Pages |

## Projects Showcased

| Project | Stack | Live |
|---|---|---|
| [LUXE — E-Commerce + AI Concierge](https://github.com/Satyamshiv0079/LUXE-Store) | Flask, React, Supabase, Groq API, Socket.IO | [luxe-store-nine.vercel.app](https://luxe-store-nine.vercel.app/) |
| [NovaMind — AI Chatbot](https://github.com/Satyamshiv0079/ai-chatbot) | Flask, React, PostgreSQL, Groq LLM, Docker | [Live Demo](https://ai-chatbot-6njs1ys87-satyamshiv0079s-projects.vercel.app) |
| [Java Study Tracker](https://github.com/Satyamshiv0079/java-study-tracker) | React, Gemini API, Recharts | [java-study-tracker-omega.vercel.app](https://java-study-tracker-omega.vercel.app/) |

## Accessibility

- Semantic elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Correct heading hierarchy (h1 → h4)
- ARIA labels on interactive elements: buttons, dialog, live regions
- Visible `:focus-visible` keyboard focus rings
- `@media (prefers-reduced-motion: reduce)` — disables animations and particle canvas
- Screen-reader-only `.sr-only` class for form labels

## Performance

- Zero JavaScript dependencies (no libraries, no bundler)
- Particle canvas pauses on `document.visibilityState !== 'visible'`
- Particle count: 80 (desktop) → 40 (mobile) → 0 (reduced-motion)
- Google Fonts loaded with `<link rel="preconnect">`
- Font Awesome loaded from CDN

## Project Structure

```
portfolio/
├── index.html      # Single-page HTML — all sections
├── style.css       # All styles — variables, layout, components, responsive
├── script.js       # Particles, typing effect, navbar, scroll-reveal,
│                   # project filter, contact form (mailto), chatbot
└── README.md       # This file
```

## Local Development

No build tools required.

```bash
# Clone the repository
git clone https://github.com/Satyamshiv0079/personal-portfolio.git

# Open in browser
# Option 1: directly open index.html in your browser
# Option 2: use a simple local server to avoid CORS issues with fonts
npx serve .
# or
python -m http.server 8080
```

## Deployment

The site is deployed via **GitHub Pages** from the `main` branch root.

To deploy updates:

```bash
git add .
git commit -m "your message"
git push origin main
```

GitHub Pages rebuilds automatically on push.

## Future Improvements

- Add a real profile photo to the hero section
- Connect the contact form to a real backend (Formspree or EmailJS)
- Add project screenshot images for each project card
- Add a downloadable resume PDF once ready
