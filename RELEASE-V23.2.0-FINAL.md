# JYC Website V23.2.0 — Final Theme Coherence Release

## Why this release exists
Browser screenshots from V23.1 showed a theme cascade problem: legacy release styles could still win over newer theme rules, leaving light-mode backgrounds with low-contrast/white text, dark navigation in light mode, oversized typography and inconsistent controls.

## What changed
- Added `src/v25-theme-coherence.css` as the canonical last public stylesheet.
- Explicit light and dark text/surface tokens.
- Explicit light and dark navigation, search and theme-control styling.
- Gold-only public atmosphere; legacy red/pink glow paths are neutralized.
- Compact typography and section rhythm.
- Public empty states are readable in both themes.
- Hero Falcon remains the only Falcon visual; the supplied robot GLB remains bot-only.
- Bot roll/wave/bounce/jump motion remains active.
- Centered JYC Assistant remains active.
- Supplied `photos.zip` campaign images are now used for team profiles and gallery fallback.
- Gallery remains a compact collage.
- Filters remain hidden until the user clicks Filters.
- Added overlap guards and reduced-motion handling.
- Release version is `23.2.0`.

## Source-backed content
The JYC hub PDFs remain the basis for JYC purpose, the six stated activity areas, the five hub families, the 21-community directory and the major-event programme. Current operational data is not invented where the supplied source does not provide it.

## Verification
- Source integrity: 80 files
- V20 regression: 26/26
- V21 regression: 17/17
- V23 UI regression: 24/24
- V25 theme coherence: 19/19
- Search: 6/6
- Security: 12/12
- SEO: 13/13
- Build preflight: PASS

The production Vite build still needs to be executed in the user's local environment because the packaging environment could not reliably install npm dependencies.
