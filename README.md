# JIIT Youth Club — Official Website

[![JYC CI](https://github.com/coolbandariya/JYC-Website/actions/workflows/jyc-quality.yml/badge.svg)](https://github.com/coolbandariya/JYC-Website/actions/workflows/jyc-quality.yml) [![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111)](https://react.dev/) [![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=fff)](https://vite.dev/) [![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=fff)](https://supabase.com/)

> **The official club-first digital home for JIIT Youth Club, Sector 128, Noida.**
>
> **Release: V23.0.0 — Final JYC public experience / Agentic AI bridge / Phoenix hero / centered responsive UI** — a club-first, event-first public experience for JIIT Youth Club Sector 128.

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

The site uses dependency-free CSS motion patterns rather than adding another animation runtime just for micro-interactions. The design work takes inspiration from open-source component ecosystems such as React Bits and shadcn/ui while keeping the actual JYC implementation inside this repository. The current deep-polish pass adds Phoenix depth, spotlight sweeps, stronger focus states and contact-card motion without adding a runtime dependency.

See [`docs/OPEN-SOURCE-UI-NOTES.md`](docs/OPEN-SOURCE-UI-NOTES.md) for the references and implementation notes.

## GitHub workflow

- CI runs on pushes and pull requests.
- Product QA, SEO QA and build verification run before merge/deployment.
- Bug reports and content issues have dedicated issue templates.
- Pull requests use a review checklist.
- Keep public content data separate from credentials and secrets.

## Current release

**V23.0.0 — Final Release**

This release preserves the strongest JYC platform features while repairing runtime contracts, restoring admin workspaces, and consolidating the Phoenix/cursor/calendar/search experience.

See [`RELEASE-V23.0.0-FINAL.md`](RELEASE-V23.0.0-FINAL.md) for the release-specific changes.

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

- Phoenix hero with pointer depth
- Three Phoenix doors: Communities / Experiences / People
- Custom red/gold cursor on precise pointers
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
