# JYC Website V23.5.0 — Hub Identity Release

This release keeps JYC as the subject of the public website while giving each of the 21 JYC communities a distinct domain-aware identity.

## What changed
- 21 hub identities: accent, motif, signature and domain traits.
- Hub cards and detail pages share the same identity variables.
- Light mode and dark mode retain their separate JYC identities.
- Hub identity styling is restrained and editorial rather than turning each club into a separate website.
- Supplied JYC hub material remains the source of descriptions and stories.
- Existing PDF photography and hub stories remain connected to each hub.
- Safe fallback for missing club banners.
- Public JYC organisation boundary remains intact: no student-productivity dashboard presentation.

## Validation
- `npm run qa` passes all source-level checks.
- Production Vite build must still be run in an environment with npm dependencies installed.
