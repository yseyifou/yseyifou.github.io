# yseyifou.github.io

Personal academic portfolio — **Dimension** template by [HTML5 UP](https://html5up.net/).

## Structure

```
index.html              English version
fr/index.html           French version (absolute paths: /assets/..., /images/...)
404.html                Custom 404 page
assets/
  css/
    main.css            Template CSS (generated, DO NOT EDIT)
    custom.css          Custom layer (generated from sass/custom.scss)
    fontawesome-all.min.css
    noscript.css
  js/
    jquery.min.js       Template
    browser.min.js      Template
    breakpoints.min.js  Template
    util.js             Template
    main.js             Template
    fx.js               Particle field (vanilla JS)
    ui.js               Interactions (vanilla JS)
  sass/
    main.scss           Template SCSS (DO NOT EDIT)
    custom.scss         Custom SCSS source
    libs/ base/ components/ layout/   Template partials
  webfonts/             woff2 only
images/
  fond.webp             Background (1920px, ~160 Ko)
  fond.jpg              Background fallback (1920px, ~220 Ko)
  overlay.png           Template overlay
  favicon.svg
  og.png                Open Graph image (1200×630)
files/cv.pdf            CV (PDF)
scripts/build-images.py Image optimization
tex/                    CV LaTeX source (not published)
```

## Build

```bash
npm install
npm run css          # Compile main.css + custom.css
npm run css:watch    # Watch mode
npm run images       # Optimize images (requires Pillow)
```

**Important**: `sass` is pinned to `1.77.8` because the template uses `@import`, `map-get`, `str-slice`, and `svg-url()` — all removed in dart-sass 2.0.

## EN/FR synchronization checklist

When updating content, update **both** `index.html` and `fr/index.html`:

- [ ] Intro text
- [ ] Education timeline
- [ ] Research section
- [ ] Projects (cards, tags, descriptions)
- [ ] Skills badges
- [ ] Currently learning
- [ ] Arts section
- [ ] CV panel
- [ ] Contact links
- [ ] Meta descriptions (OG, Twitter, JSON-LD)

## Template files (do not modify)

- `assets/sass/main.scss` and all partials in `libs/`, `base/`, `components/`, `layout/`
- `assets/css/main.css` (generated)
- `assets/js/jquery.min.js`, `browser.min.js`, `breakpoints.min.js`, `util.js`, `main.js`
- `assets/css/fontawesome-all.min.css`, `assets/css/noscript.css`

All customizations go in `assets/sass/custom.scss` and `assets/js/fx.js` / `assets/js/ui.js`.

## License

Site content: © Yanis Seyifou
Template: [HTML5 UP](https://html5up.net/) — [CCA 3.0](https://creativecommons.org/licenses/by/3.0/)
