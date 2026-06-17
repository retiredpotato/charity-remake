# Elara Voss — Graphic Designer Portfolio

A modern, visually striking single-page portfolio for an independent graphic
designer. Clean, minimalist layout with strong editorial typography, generous
white space, a cohesive warm palette and a premium, Behance/Dribbble-inspired
presentation.

## Highlights

- **Self-contained** — zero external image assets. Every mockup, logo, poster
  and illustration is hand-built inline SVG, so it loads instantly and stays
  crisp at any resolution.
- **Sections** — Hero, About, Featured Projects (full case studies), Branding,
  Logo Collection, Graphics & Social Campaigns, Illustration & 2D Art, UI/UX,
  Services & Process, Testimonial and Contact.
- **Motion & polish** — page loader, custom cursor, scroll progress, reveal-on-
  scroll, animated stat counters, marquee, parallax accents and a working
  (front-end) contact form with validation.
- **Responsive** — fluid type, an elegant grid system, and a full mobile menu.
- **Accessible** — semantic markup, ARIA labels, keyboard-friendly, and full
  `prefers-reduced-motion` support.

## Tech

Plain HTML, CSS and vanilla JavaScript — no build step.

- `index.html` — markup & inline SVG artwork
- `css/styles.css` — design tokens, layout & animations
- `js/main.js` — interactions

Fonts: Fraunces (display serif), Inter (body), Space Grotesk (mono accents).

## Run

Open `index.html` directly, or serve locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Customise

Brand colours and type live as CSS custom properties at the top of
`css/styles.css` (`--paper`, `--ink`, `--accent`, font stacks). Swap the persona
copy, project descriptions and contact details in `index.html`.
