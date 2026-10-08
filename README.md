# Jinwoo Choi, Data Science Portfolio

Personal portfolio for Jinwoo Choi: data scientist focused on machine learning pipelines, computer vision and analytics dashboards for sports performance. MS in Applied Data Science at the University of Chicago.

Live site: https://jinwoo1015.github.io/data-science-portfolio/

## What is on the site

- Experience: Arizona Baseball Software Development Team, Arizona Wildcat Football Sports Science, Tamid Group Arizona Chapter
- Projects: College Football Retention Churn Analysis (presented at SUnMaRC), play classification from broadcast video with YOLOv8, plus other analysis work
- Toolkit: languages, ML and data, statistics, and tools
- Education: University of Chicago and University of Arizona
- Downloadable one page resume (`jinwoo_choi_resume.pdf`)

## Design

- Dark, high contrast theme: near black background, white text and an acid lime accent
- Bricolage Grotesque for headlines, Instrument Sans for body text, JetBrains Mono for labels
- Generative hero: an animated data point field that reacts to the cursor
- Bento grid of results with animated bars and stat counters, plus a scrolling tech marquee
- Command palette (Cmd+K or Ctrl+K) to jump to any section or link
- Cursor spotlight on cards, scroll reveal animations, scroll progress bar and active section highlighting in the nav
- Respects `prefers-reduced-motion`
- Accessible by default: skip link, semantic landmarks, visible keyboard focus
- SEO ready: meta description, Open Graph tags and JSON-LD structured data

## Tech

Plain HTML, CSS and vanilla JavaScript. There is no build step and no dependencies. Fonts load from Google Fonts.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page content and metadata |
| `style.css` | Theme variables, layout and motion |
| `script.js` | Scroll progress, reveal on scroll, stat counters, nav highlighting |
| `jinwoo_choi_resume.pdf` | Resume download |
| `.github/workflows/jekyll-gh-pages.yml` | GitHub Pages deployment on push to `main` |

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Update the content

1. Edit the text in `index.html`.
2. Change colors in the `:root` block at the top of `style.css`.
3. Replace `jinwoo_choi_resume.pdf` with the latest resume.
4. Push to `main` and GitHub Pages redeploys.

## Deployment

The site is static, so it also works on Netlify, Vercel, Cloudflare Pages or any other static host.

## License

MIT
