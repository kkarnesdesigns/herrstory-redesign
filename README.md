# Herrstory Redesign

A modern, editorial redesign for **Herrstory** — a women-focused storytelling community and movement empowering women to embrace their truth and elevate their voices.

## Live Site

**https://kkarnesdesigns.github.io/herrstory-redesign/**

## Project Overview

This project is a complete redesign of the existing Herrstory WordPress site ([teamherr.wptexan.com](https://teamherr.wptexan.com/)). The goal is to create a modern, high-impact design that can be ported into Webflow.

### Design Direction

- **Aesthetic**: High-gloss editorial with a luxury, elevated tone
- **Typography**: Cormorant Garamond (display) + DM Sans (body)
- **Color Palette**:
  - `--ink: #1a050b` — Deepest black-red
  - `--maroon: #591C27` — Brand primary
  - `--rose-clay: #A65E68` — Accent tone
  - `--blush: #F7F2F3` — Background paper
  - `--acid: #D4A37` — Gold accent

### Sections

1. **Navigation** — Clean horizontal nav with logo and CTA
2. **Hero** — Two-column layout with large serif headline and hero image
3. **Honesty Section** — Dark background with sticky scroll effect
4. **Why Section** — Full-bleed image with centered quote card overlay
5. **Features** — Clean horizontal grid rows (Conversations, Community, Experiences)
6. **Event Banner** — Maroon CTA section for upcoming events
7. **Testimonials** — Three-column card grid with member quotes
8. **Newsletter** — Rose-clay background with email capture
9. **Footer** — Four-column layout with links and social

## Files

```
herrstory-redesign/
├── index.html          # Main HTML file (self-contained CSS)
├── images/
│   ├── hero.jpg        # Hero section image
│   ├── lifestyle.jpg   # Why section background
│   ├── logo.png        # Herrstory logo
│   ├── testimonial-1.jpg
│   ├── testimonial-2.avif
│   └── testimonial-3.jpg
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Pages deployment
└── README.md
```

## Deployment

The site auto-deploys to GitHub Pages on every push to `main`.

**Repository**: https://github.com/kkarnesdesigns/herrstory-redesign

## Content Source

All text content, images, and branding are sourced directly from the existing site at [teamherr.wptexan.com](https://teamherr.wptexan.com/) to maintain brand consistency.

### Key Messaging

- **Tagline**: "Where women tell the truth about what it really takes to build."
- **Core Value**: Depth over noise, honest dialogue over polished facades
- **Pillars**: Conversations, Community, Experiences

## Next Steps

- [ ] Convert to Figma using html.to.design plugin
- [ ] Port design into Webflow
- [ ] Connect Webflow CMS for dynamic content
- [ ] Set up custom domain

## Webflow Compatibility

The design uses standard CSS properties that map directly to Webflow:
- Flexbox and CSS Grid layouts
- Standard typography controls
- Background images and overlays
- Hover states and transitions
- Responsive breakpoints

No custom code embeds required for core functionality.

---

*Redesign by Nine Yards Studio | 2024*
