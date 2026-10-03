# JYC V1 Public Experience Modules

Keep the V1 contract data separate from page rendering.

- `config.js` — routes, event categories, discovery aliases and motion/content rules.
- `jyc-socials.js` — social identities plus verification sources.
- `hub-identities.js` — visual identity tokens for clubs/events.
- `jyc-source-media.js` — source media enrichment.
- `extra-features.jsx` — calendar, recruitment, gallery and other secondary features.
- `main.jsx` — application shell and route/page composition.

When adding a club, event or social profile, update the smallest relevant module rather than adding another large block to `main.jsx`.
