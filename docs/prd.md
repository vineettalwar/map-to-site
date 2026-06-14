# Map-to-Site — Product Requirements

## Vision

Turn a Google Maps listing URL into a **cinematic, motion-driven landing page** built from **real business photos** and **verified listing data** — ready for agency client pitches.

## Primary User

Agencies and designers who need fast, credible, photo-led landing pages without generic AI aesthetics.

## Product Principles

1. **Photos are the design** — real Maps listing images only
2. **Design is curated** — React templates + GSAP motion; LLM writes copy only
3. **Facts only** — no invented reviews, awards, or services
4. **Motion with narrative** — scroll-driven storytelling with reduced-motion fallback
5. **Category-aware mood** — accent colors derived from business type
6. **Agency-ready output** — shareable URL, OG metadata, photo attributions

## Core Flow

1. Paste Maps URL on `/`
2. Pipeline: Places API → R2 photos → LLM copy → D1
3. Poll `/generate/:id` until ready
4. View cinematic site at `/site/:id`

## API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/generate` | POST | Start generation (`{ url, force? }`) |
| `/api/generate/batch` | POST | Batch up to 10 URLs |
| `/api/sites` | GET | List recent sites (dashboard) |
| `/api/sites/:id` | GET | Poll status + blueprint |
| `/api/sites/:id/regenerate` | POST | Re-run pipeline |
| `/api/sites/:id/export` | GET | Download blueprint JSON |
| `/api/assets/*` | GET | Serve R2 photos when no public bucket URL |

## Templates

- **cinematic** (default) — GSAP ScrollTrigger, pinned hero, filmstrip gallery
- **minimal** — static landing template fallback via `motion.variant`

## Success Metrics (v1)

- Agency quality bar: 8/10 on diverse listings
- p95 generation < 90s
- Zero invented factual content in audit sample
- Smooth scroll on mobile Safari with reduced-motion path

See [qa-checklist.md](./qa-checklist.md) for manual QA categories.
