# PentoGIS (pentogis.com)

PentoGIS: GIS, mapping, remote sensing, AI/ML, planning, dashboards and geospatial software services. Pages: Home, Services, Industries, About, Contact.
Owner: kalampanna82. GitHub repo: `kalampanna82/pentogis.com` (renamed from `pentogis`; the old URL redirects, never create a new repo with the old name).

## Stack and commands
Plain static HTML, one shared `styles.css`, one shared `script.js` (scroll reveal, footer year, nav background). No framework, no package.json, no build step.
- Run locally: `python3 -m http.server 8000`, then open http://localhost:8000
- "Build": none. Check by loading the page at phone width (about 400px) and desktop.
- HTML and CSS are minified onto few lines. Keep that style when editing; don't reformat whole files.
- Hosting: Cloudflare Pages (project `pentogis`). Merging to `main` deploys, as long as `main` is the production branch in the Cloudflare Pages project settings.

## Folder map
- `index.html`, `services.html`, `industries.html`, `about.html`, `contact.html`: the pages
- `brand/`: logo kit (`svg/`, `png/`; see `brand/README.md` for files, colours and usage rules)
- `logo-mark.png`: header logo (favicons come from `brand/`)
- `404.html`: missing-page page; uses root-absolute paths (`/styles.css`) because it is served at any URL
- `robots.txt`, `sitemap.xml`, `_headers` (Cloudflare Pages headers). Add new pages to `sitemap.xml`.

## Brand
- Obsidian and gold palette (see `:root` in `styles.css` and `brand/README.md`). Use the CSS variables, not new hard-coded colours. The variable names (`--cyan`, `--blue`, `--green`) are leftovers from an older palette; they now hold gold tones.
- Follow the logo rules in `brand/README.md` (no recolouring, stretching, or moving the gold wedge).

## Rules
- This repo is PentoGIS only. Do not add immigration, tax, Visa Bulletin or other One Path Finder content here (a Visa Bulletin tool was added by mistake in PR #2 and removed in PR #3).
- Do not touch the owner's other domains or projects (onepathfinder.com, 1pathfinder.com, getready.*, musafir.travel). Never redirect them here.
- Match existing style and markup. No new dependencies without a stated reason.
- No PII logging. Don't add forms that send or store visitor data without the owner's decision.

## Workflow
- Pull requests only, never push to `main`. Keep each PR small and focused, with a description and test steps. The owner reviews and merges, unless he explicitly asks Claude to merge.
- The owner handles logins, DNS and hosting settings. Do not attempt these.
- At the end of each session, update "Decisions and open items" below.

## Decisions and open items
- 2026-10-24: Added this CLAUDE.md.
- 2026-10-24: Owner confirmed the site is hosted on Cloudflare. Domain, DNS and Pages settings are the owner's.
- 2026-10-24: Repo renamed to `kalampanna82/pentogis.com` to match the domain.
- 2026-10-24: Real page content went live (PR #7: Services, Industries, About, Contact, phone menu, mailto contact form). Owner reviewed every service, industry and toolkit item and confirmed them. Change these lists only when the owner asks.
- 2026-10-24: Added 404 page, robots.txt, sitemap.xml, `_headers`, home-page structured data; replaced emoji card icons with gold line SVG icons; canonical URLs now extensionless (`/about`), matching Cloudflare Pages. HSTS left to the owner's Cloudflare settings.
- Open: a "Selected work" or case-study section needs real project examples from the owner.
