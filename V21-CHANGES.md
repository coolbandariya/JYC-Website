# JYC V21.1 — Agentic-inspired Hero, Navigation & Hub Pass

## Preserved
- V20 React architecture, routing, Supabase/admin, PWA and motion layers.
- Original JYC Falcon/Phoenix identity.

## Changed
- Phoenix is now a single hero-stage artwork behind centered hero copy.
- Decorative orbit/ring layers removed across public UI and loading treatments.
- Added scroll-aware home navigation: About / Clubs / Events / Moments / Team update their active pill while scrolling.
- Reworked top navigation into a compact rounded active-pill system inspired by modern event/creative sites, using the JYC beige/brass palette.
- Added a small persistent JYC Assistant launcher independent of the Falcon. It can roll, wave, jump and bounce and jumps on route changes.
- JYC Assistant remains available across public routes and now opens the Agentic AI bridge popup.
- Added Agentic AI 2026 featured band + themed popup linking to the dedicated experience.
- Added virtual detail pages for all 21 supplied JYC hub names even when current live CMS records are absent.
- Added source-backed hub spectrum and event-programme sections using supplied hub PDFs.
- Added Google Maps campus actions for JIIT Sector 128 (existing campus map retained).
- Strengthened Clubs, Events and Team page identity and centering.
- Added long-text safety rules to reduce clipping/overflow.
- Removed rejected homepage utilities from rendering (JYC Pulse / Next Moment / Today at JYC) while retaining useful underlying routes.

## Content provenance
- Hub descriptions are based on supplied JYC hub PDFs and, where explicitly noted, current public JIIT/club pages.
- Unsupported current operational details are intentionally marked for verified updates instead of being invented.

## Validation
- Archive integrity checked after edits.
- Full Vite production build could not be completed in this environment because the original dependency install timed out and left an incomplete `node_modules`; run `npm ci` then `npm run build` locally before deployment.
