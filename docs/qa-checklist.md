# QA Checklist — Map-to-Site v1

Test one Maps listing from each category on **desktop Chrome** and **mobile Safari**.

## Categories

- [ ] Restaurant / cafe
- [ ] Hair salon / spa
- [ ] Gym / fitness center
- [ ] Retail store
- [ ] Professional services (dentist, lawyer, etc.)
- [ ] Hotel / lodging
- [ ] Bar / nightlife
- [ ] Auto repair / service
- [ ] Medical clinic
- [ ] Event venue

## Per-site checks

- [ ] Hero uses real listing photo (not gradient-only when photos exist)
- [ ] Rating badge shows when Places rating available
- [ ] Gallery filmstrip scrolls smoothly (desktop)
- [ ] Review wall pins and transitions (desktop)
- [ ] Contact section shows map embed when lat/lng available
- [ ] Mobile sticky CTA visible and tappable
- [ ] Photo attributions in gallery/footer when provided by Places
- [ ] OG preview shows business name + hero image
- [ ] `prefers-reduced-motion: reduce` shows static layout (no pin/scrub)
- [ ] Copy has no banned filler ("Welcome to", "We are passionate", etc.)
- [ ] Regenerate works from dashboard and failed-state loader
- [ ] Export JSON downloads valid blueprint

## Performance

- [ ] Hero image preloads; LCP acceptable on 4G throttling
- [ ] No visible scroll jank during pinned sections

## Edge cases

- [ ] Listing with 0 photos → gradient hero + map/contact still usable
- [ ] Re-submit same URL → instant redirect to existing site
- [ ] Batch API (`POST /api/generate/batch`) handles mixed valid/invalid URLs
