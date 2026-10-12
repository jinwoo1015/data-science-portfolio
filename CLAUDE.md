# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Jinwoo Choi's personal portfolio, a static single page site (plain HTML, CSS and vanilla JS) served by GitHub Pages at https://jinwoo1015.github.io/data-science-portfolio/. There is no package manager, build step, linter or test suite.

## Commands

Preview locally (the page loads Google Fonts, so it needs internet):

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Deploy by pushing to `main`. `.github/workflows/jekyll-gh-pages.yml` builds the repo root with `actions/jekyll-build-pages` and publishes it, which takes about a minute. GitHub Pages then caches files for about 10 minutes, so use a hard refresh when checking a live change.

## Architecture

Three files do everything: `index.html` (content and SEO metadata), `style.css` (theme and layout), `script.js` (all behavior, one IIFE). Things that span files:

- **Section ids are wired in three places.** The sections in `index.html` (`#impact`, `#work`, `#projects`, `#skills`, `#contact`) are referenced by the nav links, by the scroll spy that highlights the active nav item, and by the `cmds` array that powers the Cmd/Ctrl+K command palette in `script.js`. Adding or renaming a section means updating all three.
- **Reveal animations depend on JS.** Elements with `.reveal` start at `opacity: 0` and only show once the IntersectionObserver in `script.js` adds `.in`. The same `.in` class triggers the animated metric bars (`--w` custom property on `.bar i`) and the `data-count` stat counters. A new block that should appear on scroll needs `.reveal`.
- **`.spot` cards** get a cursor spotlight from `--mx` and `--my`, which `script.js` sets on pointermove.
- **The hero background is a canvas** (`#field`) drawn in `script.js`; it pauses when off screen and renders static under `prefers-reduced-motion`.
- **Theme is dark only.** All colors are CSS variables in the `:root` block at the top of `style.css`. There is no light mode or toggle.
- **Cache busting.** `index.html` loads `style.css?v=2` and `script.js?v=2`. Bump the number when changing either file so returning visitors get the new version.

## Content rules

- `jinwoo_choi_resume.pdf` is the download behind the "Resume (PDF)" buttons. It is compiled from the LaTeX source in the sibling folder `../resume workshop/` (currently `resume_latex_1page_v3.tex`) and must stay exactly 1 page. Page budget is tight, so adding content to the resume usually means cutting something.
- Site claims must match the resume or the linked projects. Do not invent metrics, employers or links. The numbers used (2x, 20%, 6 hrs, 50+, 83% accuracy, 0.754 ROC AUC, 0.677 precision, 69.2% for the play classification model) all come from the resume or the paper.
- Contact is email only (`jinwooc@uchicago.edu`). The phone number is deliberately left off the public site.
- The play classification card links to the separate repo https://github.com/jinwoo1015/qb-play-classification, which has the paper and anonymized data.
- Avoid dashes (including em dashes and spaced hyphens) in written copy and docs. This is a standing preference from the parent project's CLAUDE.md.
- `README.md` describes the design and tech. Update it when the design or file list changes, since it has gone stale once already.

## Local only files

`graphify-out/` (knowledge graph) and `.claude/` (preview server config) are excluded through `.git/info/exclude` and should not be committed.
