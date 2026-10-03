# JYC 128 — Senior Logo Design & Content Contract

Updated: 2026-10-03

## Visual source of truth

The senior-provided JYC emblem is now the visual reference for the public site.

### Core palette

- Deep navy: `#141927`
- Deep navy background: `#0f1420`
- Champagne / antique gold: `#c2a682`
- Champagne soft: `#efe3cb`
- Ivory: `#faf7ef`
- Restrained bronze: `#78593b`
- Body ink: `#111111`

The public shell must not introduce unrelated red, purple, blue, neon or arbitrary club-specific accent colours. Community identity is expressed through typography, photography, motifs and layout; the shared JYC palette remains the visual system.

## Light mode

Light mode uses warm ivory/cream surfaces with deep navy text and restrained bronze/champagne accents. Body text is never placed over low-contrast gold surfaces.

## Dark mode

Dark mode uses deep navy surfaces rather than pure black, with ivory text and champagne accents. Cards, borders and controls remain visibly separated from the background.

## Motion

Motion is editorial and functional:

- hero entrance
- logo float/glow
- restrained gold sweep
- section reveal
- image hover zoom
- card lift
- theme-toggle feedback

The public shell must respect `prefers-reduced-motion` and remove non-essential movement when requested.

## Content source contract

The supplied All Hubs / JYC orientation material is the source for:

- five JYC families: Cultural, Technical, Creative, Literary and Sports
- the JYC organisational hierarchy
- major programme names: Induction, Ebullience, Hackathons, Ethnic Day, Converge, Dron-O-War and Farewell
- supplied hub stories and photography

Live dates, registration status, current people and operational links remain controlled by published JYC records / Supabase rather than being inferred from presentation material.

## Photography

The repository currently contains the extracted JYC hub archive under:

- `public/assets/hub-photos/`
- `public/assets/hub-photos-extra/`
- `public/assets/hub-stories/`

The public gallery and hub pages use these maintained source assets. More existing PDF-derived assets were activated in the homepage and hub media mapping instead of fabricating imagery.

## Layout contract

- Public sections use a shared centered content width.
- Section headings are centered.
- Cards and grids stretch consistently to eliminate orphan/empty columns.
- Mobile layouts collapse intentionally rather than leaving desktop whitespace.
- Navigation remains simple and professional.
- No site-wide chatbot, giant campus map, orbit-heavy hero or unrelated visual effects.

## Accessibility contract

- Visible keyboard focus.
- 44px minimum interactive targets in the final public layer.
- Higher-contrast preference support.
- Reduced-motion support.
- Text remains readable independently of accent colour.

## Next product work

The next major improvements should be data/product work rather than another visual redesign:

1. Complete production Supabase baseline and migration reconciliation.
2. Make content verification status actually gate publication.
3. Connect every published content record to campus scope.
4. Relationalize events, results, galleries and recruitment records.
5. Add image dimensions/srcset/responsive delivery and Lighthouse/Core Web Vitals monitoring.
6. Add automated axe accessibility checks.
7. Finish JYC Pulse / My JYC / saved events / reminders around the verified event model.
8. Add branch protection requiring CI, Quality Gate and CodeQL before merge.
