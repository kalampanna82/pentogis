# PentoGIS

Website for [pentogis.com](https://pentogis.com): GIS, mapping, remote sensing, AI/ML, planning, dashboards and geospatial software services.

Plain static HTML with one shared `styles.css` and `script.js`. No build step.

## Run locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. Check pages at phone width (about 400px) and on desktop.

## Files

- `index.html`, `services.html`, `industries.html`, `about.html`, `contact.html`: the pages
- `404.html`: page shown for missing URLs
- `robots.txt`, `sitemap.xml`: for search engines
- `_headers`: Cloudflare Pages response headers (security and caching)
- `brand/`: logo kit and brand rules (see `brand/README.md`)

## Deploy

Hosted on Cloudflare Pages. Merging to `main` deploys the site.
