# national-statistics-site

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/gilbwert/national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/gilbwert/national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

**Nusantara in Numbers** — a national statistics site for Indonesia. Ten headline indicators (population, economic growth, nominal GDP, inflation, poverty, unemployment, the Human Development Index, inequality, exports and life expectancy) each carry ten years of figures, an SVG chart drawn by the site's own code, a year-by-year table and a plain-language reading of what the figure means, with its BPS source and period. A province explorer covers all 38 provinces with search, island-group filtering and sortable columns, and every province page compares its poverty, development and growth against the national figure. The site is plain static files under `app/` — no build step, no framework, no network requests — and works the same on a desktop and a phone.

## Run it

```sh
node serve.ts            # serves app/ at http://localhost:8090
# or simply open app/index.html in a browser

MAKEFUN_OUTPUT_DIR=out node main.ts   # hand-in: copies app/ + screenshots/ to out/ and writes out/dossier.json
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=dr98bygg&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
