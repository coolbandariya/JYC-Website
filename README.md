# JIIT Youth Club — Official Website

[![JYC CI](https://github.com/coolbandariya/JYC-Website/actions/workflows/jyc-quality.yml/badge.svg)](https://github.com/coolbandariya/JYC-Website/actions/workflows/jyc-quality.yml) [![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111)](https://react.dev/) [![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=fff)](https://vite.dev/) [![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=fff)](https://supabase.com/)

> **The official club-first digital home for JIIT Youth Club, Sector 128, Noida.**
>
> **Release: V31.0.0 — Public Experience / Beige Signature / Production Polish** — a club-first, event-first public experience for JIIT Youth Club Sector 128.

JYC brings its **clubs, events, people, memories and official community channels** into one focused public website. The Control Center is separate from the student-facing experience and handles publishing, review and operations.

## Product map

**Home → Clubs → Events → Moments → Team → Contact → More → Search**

Supporting public surfaces include **Moments, My JYC, Campus Map and JYC Planner**. Quick answers live inside About rather than behind a separate FAQ maze. Fests are intentionally not part of the normal navigation: they appear only when an authorized editor switches the public experience into **Fest mode**. Recruitment is intentionally homepage-only and can be surfaced only when the JYC editor-controlled recruitment flag allows it.

### Public experience principles

- **Club first.** This is a club website, not a generic student dashboard.
- **Search is relevance-first.** Exact title matches are deliberately ranked above metadata, fuzzy matches and shortcuts.
- **No surprise publishing.** Admin drafts remain drafts until an authorized person publishes them.
- **Official JYC content.** Public clubs, events, team and gallery content is data-driven; the UI does not invent official campus records.
- **Optional personal layer.** My JYC saves clubs/events without turning the public site into a dashboard.
- **Accessible motion.** Micro-interactions respect `prefers-reduced-motion` and avoid adding a heavy animation dependency for simple effects.
- **Human interaction.** Motion is attached to real club/event content instead of decorative animation for its own sake.
- **Signature palette.** Public UI uses JYC beige with black/white neutrals; legacy accent colours are overridden by the final visual layer.
- **Compact rhythm.** Homepage sections are curated instead of automatically appending every historical module, preventing duplicated content and dead space.
- **Open-source inspired, locally implemented.** React Bits orbit, reveal, command-palette and navigation patterns are selectively adapted without turning the site into a component demo.
- **Security first.** Publishable Supabase access is paired with RLS expectations, validated external URLs, CSP/security headers, secret scanning and CodeQL CI.

## Contact

The public Contact page keeps the official JYC channels and website creator details together:

- Instagram: `@jiityouthclub128`
- JYC WhatsApp community group
- JYC / website contact email
- Website creator: Kaustubh Dua — LinkedIn, GitHub, Instagram and email

Update the live contact values in the site data before production if any official channel changes.

## Tech stack

- React 19
- Vite 8
- React Router
- Supabase Auth / Postgres / Storage / Edge Functions
- CSS-first interaction layer
- Service worker for the cached public shell

## Repository layout

```text
src/                         React application + UI system
src/lib/                     Search, Supabase and UI utilities
src/*.css                    Layered public/admin design system
supabase/                    SQL, RLS and Edge Functions
scripts/                     Product, release, SEO and regression QA
docs/                        Architecture and product notes
.github/                     CI, issues, PR workflow and repository metadata
public/                     PWA shell, media and downloadable source archive
```

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Full static/product/security QA:

```bash
npm run qa
```

The release also has a focused navigation/contact regression check:

```bash
npm run qa:security
```

## Discoverability

The public site includes Organization/WebSite JSON-LD, canonical metadata, a public sitemap, robots rules and a SearchAction entry point. Brand searches such as `JYC`, `JIIT JYC` and `JIIT Youth Club` intentionally surface the official JIIT Youth Club page before generic content. This improves discoverability but does not guarantee a particular Google ranking; Search Console should be used after deployment.

## Search behavior

The search engine in `src/lib/search.js` uses a deterministic relevance model. The order is intentionally:

1. exact title
2. title starts with the query
3. phrase inside title
4. all query words in title
5. title word prefixes
6. fuzzy title match
7. metadata / description
8. intent shortcuts

The UI labels the first ranked result **BEST MATCH** and supports keyboard navigation with `Ctrl/Cmd + K`, `/`, arrow keys, Enter and Escape.

## Admin publishing model

Content follows:

**Draft → AI recommendation (optional) → Preview → Save → Publish**

AI suggestions are never auto-published. Staff access is kept under the Control Center and protected by the existing authorization flow.

### Public mode control

The Control Center can switch between:

- **Standard JYC mode** — normal club/event website
- **Fest mode** — enables the dedicated fest experience and its public discoverability

Only the authorized super-admin path can change the public mode.

## Open-source UI approach

The site uses dependency-free CSS motion patterns rather than adding another animation runtime just for micro-interactions. The design work takes inspiration from open-source component ecosystems such as React Bits and shadcn/ui while keeping the actual JYC implementation inside this repository. The current visual pass uses a logo-led hero, editorial image grid, compact cards, stronger focus states and restrained CSS motion without adding a runtime dependency.

See [`docs/OPEN-SOURCE-UI-NOTES.md`](docs/OPEN-SOURCE-UI-NOTES.md) for the references and implementation notes.

## GitHub workflow

- CI runs on pushes and pull requests.
- Product QA, SEO QA and build verification run before merge/deployment.
- Bug reports and content issues have dedicated issue templates.
- Pull requests use a review checklist.
- Keep public content data separate from credentials and secrets.

## Current release

**V31.0.0 — Public Experience Release**

This release preserves the strongest JYC platform features while tightening the public visual system around JYC beige, black and white, a centered logo-led hero, compact section rhythm, curated homepage content and stronger photography hierarchy.

See [`RELEASE-V26.0.0.md`](RELEASE-V26.0.0.md) for the release-specific changes.

## Verification note

Static/regression QA was run for this release. Browser QA is included as a dev dependency; after `npm install`, run `npx playwright install chromium`, start Vite with `npm run dev`, then run `npm run qa:browser`. The packaging environment cannot provide the local native Vite binding.

## Official site

https://jycjiit.vercel.app


## Release quality gates

Before a release reaches `main`:

1. `npm run build`
2. `npm run qa`
3. Browser pass across Home, Clubs, Club Detail, Events, Event Detail, Team, Gallery, Calendar, Contact, More/Search and Admin
4. Verify console has no runtime-breaking errors
5. Verify exact-title search remains the first result
6. Verify a newly published admin event appears on Events + Calendar
7. Verify Fest mode and homepage-only Recruitment rules
8. Verify desktop, tablet and mobile layouts

### Signature JYC interactions

- Logo-led hero with restrained pointer depth
- Compact homepage hierarchy: intro → events → clubs → moments → team → CTA
- Lightweight hover and focus motion without a decorative custom cursor
- Gallery lightbox with keyboard navigation
- Event share, Google Calendar, `.ics`, reminders and QR
- Combined JYC + official academic calendar
- Club follow/save layer in My JYC
- Staff Control Center with draft/review/publish workflow

The repository deliberately favors a small, understandable React/CSS system over a large animation dependency. Open-source references are documented in `docs/OPEN-SOURCE-UI-NOTES.md`.


## Final release checklist

See [`docs/JYC-FINAL-QA-CHECKLIST.md`](docs/JYC-FINAL-QA-CHECKLIST.md) for the consolidated public UI, mobile, map, admin, SEO, PWA and security checks.

## V22 final UI repair

The final public shell uses one warm paper/beige visual language across Home, Clubs, Events, Team and supporting public pages. The primary navigation no longer contains a separate Participate CTA. Returning visitors are kept in the light JYC theme, the assistant launcher is intentionally compact and static, and local/GitHub preview has a grounded public fallback for the 21 supplied hub communities plus published leadership/event material when no Supabase content is available.


## V26.2 Campus discovery pass

The public homepage now behaves more like a living campus directory while keeping JYC's own visual language:

- **JYC Now** surfaces the currently live event or the next published experience using the event's real date/time state.
- **Experience filters** let visitors scan published upcoming events by event family without leaving the homepage.
- **Club filters** let visitors narrow the homepage club preview by published type/category.
- Event and club discovery remains data-driven; the UI does not fabricate categories or records.
- The ecosystem identity uses the official JYC logo rather than the former phoenix artwork.
- Mobile filtering stays horizontally scrollable and compact so discovery does not create large empty blocks.

## V26.1 Festival-inspired interaction pass

The homepage now takes interaction cues from contemporary Indian college-fest experiences, especially the live **Rendezvous'26 — IIT Delhi** structure: category scanning, a featured experience, strong event imagery and focused discovery routes. The implementation remains JYC-specific and keeps the beige/black/white signature system.

- One featured published event with poster, date, time and venue.
- Horizontal experience/category index for fast scanning.
- Secondary event cards beneath the feature.
- Moments are rendered exactly once, eliminating the previous duplicate gallery block.
- Gallery visibility now controls the Moments section.
- No additional animation library or 3D runtime was introduced.

## Previous V24 Editorial Centered Pass

The current public hero deliberately avoids a WebGL/3D bird. The visual anchor is the official JYC logo with restrained orbital motion, a soft pulse and pointer-responsive depth. This keeps the identity visible without making the hero feel like a technology demo.

### Design references used

- [JIIT Innovation](https://www.innovationjiit.in/) — clear institutional hierarchy, strong event/archive structure and photography-led content.
- [React Bits](https://reactbits.dev/get-started/index) — inspiration for restrained reveal, hover and micro-interaction patterns; the JYC implementation remains CSS-first and dependency-light.

### V24 visual rules

- centered max-width layout across desktop and mobile
- beige / black / white JYC visual system
- official JYC logo as the hero visual anchor
- no decorative 3D bird/WebGL layer in the public hero
- real JYC photography over generic stock/AI imagery
- readable type with strong contrast and predictable spacing
- motion attached to content: reveal, hover, logo breathing and subtle depth
- prefers-reduced-motion support is mandatory

### Visual system

![JYC centered hero direction](docs/assets/jyc-hero-direction.svg)

![JYC editorial architecture](docs/assets/jyc-architecture.svg)

### Release verification

Run:

~~~bash
npm install
npm run build
npm run qa
~~~

Then verify the home page at mobile widths (320–600px), tablet widths (768–1024px) and desktop widths (1280px+). The hero should show the JYC logo, not the former Falcon/Phoenix 3D scene.

## Production hardening pass

The V26.2 audit also removed several release blockers: stale Phoenix/model-viewer runtime dependencies, demo-content injection when a configured Supabase backend is empty, stale sitemap/cache metadata, an offline service-worker response bug for non-navigation assets, missing public contact/project submission tables, and an outdated AI model default. The repository QA gate now includes production, runtime-contract and functional checks in addition to static/security/SEO checks.

**Important deployment prerequisite:** the configured JYC Supabase project must be active. The repository's configured project is currently inactive because the linked Supabase account has reached its free-project active limit; production cannot be considered live until that backend is restored or Vercel is pointed at an active JYC Supabase project.


## V32 public experience overhaul

The public website is now organized around the approved JYC-128 information architecture: Home, About JYC, Hubs, Events, Event Details, Gallery/Archive, Team, Announcements, Achievements, Contact and controlled recruitment entry points. The final visual layer keeps JYC beige, black and white across day/night modes, centers the public composition, improves image treatment, strengthens mobile layouts, and uses restrained content-linked motion rather than decorative effects.

The supplied 2026–27 JYC hub material is treated as the content source for the 21-community ecosystem and leadership structure. Public fallback content is used only for approved supplied material; fabricated statistics are not used as marketing copy.
