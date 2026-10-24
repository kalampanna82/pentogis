# PentoGIS (pentogis.com)

PentoGIS: GIS, mapping, remote sensing, AI/ML, planning, dashboards and geospatial software services. Pages: Home, Services, Maps (one landing page per map type), Industries, Tools, About, Contact.
Owner: kalampanna82. GitHub repo: `kalampanna82/pentogis.com` (renamed from `pentogis`; the old URL redirects, never create a new repo with the old name).

## Stack and commands
Plain static HTML, one shared `styles.css`, one shared `script.js` (scroll reveal, footer year, nav background). `tools.js` is loaded only by `tools.html`. No framework, no package.json, no build step.
- Run locally: `python3 -m http.server 8000`, then open http://localhost:8000
- "Build": none. Check by loading the page at phone width (about 400px) and desktop.
- HTML and CSS are minified onto few lines. Keep that style when editing; don't reformat whole files.
- Hosting: Cloudflare Pages (project `pentogis`). Merging to `main` deploys, as long as `main` is the production branch in the Cloudflare Pages project settings.

## Folder map
- `index.html`, `services.html`, `industries.html`, `tools.html`, `about.html`, `contact.html`: the pages
- `maps.html`: hub listing map types; one card per type. `slope-map.html`: first map-type landing page.
- `maps/`: example map images for the landing pages (WebP).
- Map-type pages: one page per type, named `<type>-map.html` (e.g. `flood-map.html`). Each has a hero, a real example map with legend, caption and a class table, who uses it, deliverables, process and a call to action, plus `Service` JSON-LD. Add a card to `maps.html` and the URL to `sitemap.xml`.
- Example maps must come from real, credited data (state the source and resolution in the caption); never fake or invented maps. Colour ramps: one hue stepping dark to light for magnitude; check adjacent steps with the dataviz palette validator (normal-vision ΔE ≥ 15). The slope map uses `#352a1a #66502a #9a7a3e #cfa65a #f6e3b4`.
- `tools.html` + `tools.js`: free GIS tools (coordinate converter with UTM, map scale converter, distance and area). Browser-only: never send or store what visitors type. UTM maths was checked against pyproj (sub-millimetre).
- `brand/`: logo kit (`svg/`, `png/`; see `brand/README.md` for files, colours and usage rules)
- `logo-mark.png`: header logo (favicons come from `brand/`)
- `404.html`: missing-page page; uses root-absolute paths (`/styles.css`) because it is served at any URL
- `robots.txt`, `sitemap.xml`, `_headers` (Cloudflare Pages headers). Add new pages to `sitemap.xml`.

## Brand
- Obsidian and gold palette (see `:root` in `styles.css` and `brand/README.md`). Use the CSS variables, not new hard-coded colours. The variable names (`--cyan`, `--blue`, `--green`) are leftovers from an older palette; they now hold gold tones.
- Follow the logo rules in `brand/README.md` (no recolouring, stretching, or moving the gold wedge).

## Rules
- This repo is PentoGIS only. Do not add immigration, tax, Visa Bulletin or other One Path Finder content here (a Visa Bulletin tool was added by mistake in PR #2 and removed in PR #3).
- FixPixz (fixpixz.com) is the owner's sister platform for image editing. PentoGIS refers image work to it (Services section `#image-services` and a footer link on every page). Keep it a referral; don't list image editing as a PentoGIS service.
- Do not touch the owner's other domains or projects (onepathfinder.com, 1pathfinder.com, getready.*, musafir.travel). Never redirect them here.
- Match existing style and markup. No new dependencies without a stated reason.
- No PII logging. Don't add forms that send or store visitor data without the owner's decision.

## Workflow
- Pull requests only, never push to `main`. Keep each PR small and focused, with a description and test steps. The owner reviews and merges, unless he explicitly asks Claude to merge.
- The owner handles logins, DNS and hosting settings. Do not attempt these.
- Clickable links, every time (owner's standing request). Whenever you open a PR, ask the owner to merge, or report a merge, give him direct links he can click straight away:
  - Before merge: the Cloudflare preview of the changed pages. Cloudflare Pages comments the preview URL on each PR (read the PR comments). The branch preview is `https://<branch>.pentogis.pages.dev`, where `<branch>` is the branch name lowercased, with `/` and other symbols turned into `-`, cut to 28 characters (e.g. `claude/zealous-lovelace-ldfl2r` → `https://claude-zealous-lovelace-ldfl.pentogis.pages.dev`). Link the exact page and section, e.g. `.../tools#scale`.
  - After merge: the live page on `https://pentogis.com/...` (extensionless, e.g. `https://pentogis.com/tools#scale`), noting it goes live once the `main` deploy check turns green.
  - Put the same links in the PR description under "Check it".
- At the end of each session, update "Decisions and open items" below.

## Decisions and open items
- 2026-10-24: Added this CLAUDE.md.
- 2026-10-24: Owner confirmed the site is hosted on Cloudflare. Domain, DNS and Pages settings are the owner's.
- 2026-10-24: Repo renamed to `kalampanna82/pentogis.com` to match the domain.
- 2026-10-24: Real page content went live (PR #7: Services, Industries, About, Contact, phone menu, mailto contact form). Owner reviewed every service, industry and toolkit item and confirmed them. Change these lists only when the owner asks.
- 2026-10-24: Added 404 page, robots.txt, sitemap.xml, `_headers`, home-page structured data; replaced emoji card icons with gold line SVG icons; canonical URLs now extensionless (`/about`), matching Cloudflare Pages. HSTS left to the owner's Cloudflare settings.
- 2026-10-24: Added "How we engage" (project-based, hourly, retainer; no prices) to Services and an FAQ to Contact. Contact form stays mailto (owner had no preference on a form service); it now shows a fallback message after submit.
- 2026-10-24: Owner asked to refer image masking, clipping path and other image services to sister platform fixpixz.com with a backlink. Service list on the Services page is a first draft for the owner to confirm against what FixPixz offers.
- 2026-10-24: Added a Tools page (owner picked: coordinate converter, map scale converter, distance and area calculator) and a Tools link in the nav and footer. Phone menu now switches on below 980px (was 680px) so five nav links never overlap the logo.
- 2026-10-24: Owner asked for the tools to sit behind buttons at the top: one tool shows at a time, clicking the open tool's button closes it, `tools.html#scale` (or `#coordinates`, `#distance`) opens that tool directly.
- 2026-10-24: Owner asked for clickable preview and live links with every PR or merge request (rule under Workflow).
- 2026-10-24: Owner asked for landing pages per map type, starting with slope maps. Added `maps.html` (hub) and `slope-map.html` with a real example (USGS DEM near Jacksboro, TN, from Matplotlib's sample data, about 90 m), and Maps in the main nav and footer.

## Roadmap (needs the owner)
Don't invent any of this content; wait for the owner's material.
1. Selected work / case studies: 2-3 real projects (problem, client type, deliverable, an image). Highest priority.
2. About: the person behind PentoGIS (name, photo, background, certifications, LinkedIn).
3. Contact form service (e.g. Web3Forms or Formspree) so inquiries work without an email app. Owner to choose; it sends visitor data to a third party.
4. More map types: owner to pick the next ones (ideas: hillshade/terrain, flood risk, land cover, NDVI vegetation, urban heat, suitability, viewshed, drive-time).
5. Owner's accounts: Google Search Console (submit `/sitemap.xml`), Google Business Profile, Cloudflare Web Analytics.
