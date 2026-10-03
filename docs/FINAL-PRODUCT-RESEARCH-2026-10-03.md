# JYC 128 final-product research — 2026-10-03

## Product conclusion

The site should remain a JYC-first organizational source of truth, not become a general JIIT utility portal or a visual-effects showcase.

Current JIIT material describes JYC as a student body supporting co-curricular activity through constituent clubs, including technical, cultural, literary, sports, photography/video, dramatics and other communities. JIIT's current public material also distinguishes Sector 62 and Wish Town/Sector 128 campuses. The current JAI 2026 event listing identifies `www.jiityouthclub128.in` as the official JYC 128 website.

## External research used

- JIIT contact page: Sector 128 is officially listed as "Sector-128, Jaypee Wish Town Village, Sultanpur, Noida-201304, Uttar Pradesh, India."
- JIIT 2026 brochure: documents the JYC 128 ecosystem and constituent hubs.
- JIIT student/innovation material: emphasizes student-led clubs, workshops, competitions, innovation and year-round activities.
- JAI 2026 public event listing: identifies JAI 2026 as organised by JYC 128 and points participants to the official JYC 128 website.
- Supabase current guidance: RLS and SQL grants are separate controls; revoke client privileges explicitly; use pgTAP through `supabase test db`; use versioned migrations and `db pull` to establish an existing-production baseline; Storage objects require separate backup/security planning.
- Google Search guidance: canonical URLs should represent the preferred URL; Organization/WebSite structured data should use the canonical site URL; event structured data should describe the actual event; images should reserve dimensions/aspect ratio to reduce CLS.
- WCAG 2.2 guidance: keyboard focus and target sizing need explicit testing.

## What this means for JYC

### Keep
- Clubs
- Events and fests
- Team/leadership
- Gallery/memories
- Announcements
- Recruitment
- Achievements/results
- My JYC
- Calendar
- Search/discovery
- Admin editorial workflow

### Build next
1. Relational content model around campus, club, event, venue, person, recruitment, result and album.
2. Verification workflow that controls publication.
3. Event lifecycle with registration/deadline/status/results.
4. Recruitment lifecycle.
5. Event-linked galleries and credits.
6. Results as a first-class record.
7. My JYC saved/followed/registered/reminder state.
8. Performance/accessibility gates.
9. One canonical production origin and no permanent legacy-origin allowlists.
10. One Supabase migration history based on the live production baseline.

### Avoid
- More hero redesigns
- Persistent animated assistant/bot launchers
- Particle-heavy decoration
- Multiple competing visual systems
- Generic social feed behavior
- Academic/attendance utility framing
- Hard-coded homepage statistics without provenance

## Production data rule

Historical source material is evidence/context. Published current content must be explicitly verified before it is treated as official. Campus is part of the identity of every campus-sensitive club, event, person, announcement and venue record.

## Current implementation status

The repository now has:
- production hardening migrations 001–004
- private backup storage
- database-backed abuse controls
- secure server-side media byte validation
- direct browser Storage write revocation
- campus registry
- content verification foundation
- canonical route redirects
- official production-origin metadata
- consolidated public CSS entry
- reduced-motion/focus safeguards
- architecture QA
- pgTAP RLS regression tests
- backup/restore and migration workflow documentation

The remaining production database baseline operation must be performed against the real Supabase project with `supabase db pull`, because the historical schema was created outside the current migration directory.

_Last reviewed against the merged production-hardening baseline and final-product branch on 2026-10-03._


QA branch created from final-product-architecture head for a clean release gate.

## Deep production audit addendum — 2026-10-03

### Findings from the current main audit

1. **The product direction is correct; the remaining work is operational.**
   The public experience already has the senior-approved navy/champagne/ivory visual contract, reduced-motion support, search, clubs, events, archive, calendar, My JYC and an editorial Control Center. The next gains should come from reliability, information architecture, content freshness and measurable performance rather than another hero redesign.

2. **Repository hygiene needed attention.**
   Two historical release ZIP archives were tracked in the repository. They add repository weight without contributing to the deployed application. They are removed by the deep-audit branch.

3. **Sitemap generation needed a deterministic production fallback.**
   Builds without VITE_SITE_URL could remove the sitemap rather than use the canonical production origin. The generator now defaults to https://www.jiityouthclub128.in.

4. **The SPA architecture is the largest long-term technical constraint.**
   src/main.jsx remains very large and several historical CSS generations remain underneath the consolidated public entry. This works today, but it is the next architectural target: route-level code splitting, component extraction, and a genuinely canonical CSS layer.

5. **Public submission abuse prevention is the next security priority.**
   Contact and project submission endpoints accept anonymous inserts. Their RLS protects read/update access, but production abuse controls should also cover spam volume and repeated submissions. The preferred next step is a server-side submission endpoint/RPC with distributed rate limiting and a lightweight abuse challenge, rather than trusting browser-only throttling.

6. **Production database baseline must become authoritative.**
   The repository contains the hardening migrations and pgTAP-style RLS regression tests, but the live production schema must still be reconciled into one migration history. Supabase recommends version-controlled migrations and a staging/production workflow rather than making schema changes directly in production.

7. **SEO should move toward pre-rendered public HTML over time.**
   Google can render JavaScript, but Google explicitly notes that server-side or pre-rendering can improve speed and crawler compatibility. JYC should eventually pre-render the high-value public routes and dynamic club/event detail pages while keeping the admin application client-side.

8. **Performance needs field measurement, not just build-size checks.**
   The new release gate adds JS/CSS/image budgets. The next stage is real-user measurement for LCP, INP and CLS, segmented by mobile and desktop, with regressions visible in CI/operations.

### Recommended next product sequence

**P0 — Production trust**
- Reconcile the live Supabase schema into one migration baseline.
- Add abuse/rate controls to public contact and project submission flows.
- Add database tests for every exposed table and RPC, including allow/deny cases for anon and authenticated users.
- Verify backup restoration in a non-production environment.
- Confirm Vercel and Supabase environment variables use one canonical production origin.

**P1 — Information architecture**
- Make club, event, person, venue, album, recruitment and result records relational rather than embedding more state in jyc_site_data.
- Make verification a first-class publication prerequisite for every official current record.
- Add event results/placements as first-class records.
- Link galleries directly to events/clubs and preserve credits/provenance.
- Give recruitment its own lifecycle: draft → review → open → closed → archived.

**P2 — Experience**
- Improve search into a real discovery layer with filters for club family, campus, event type, date and recruitment state.
- Make event detail the strongest public conversion surface: schedule, venue, registration state, reminders, calendar export, related club, results and gallery.
- Make My JYC the personal utility layer for saved clubs, followed events, registrations and reminders.
- Keep the public design centered, editorial and logo-led; do not add persistent decorative bots, orbital systems or particle-heavy effects.

**P3 — Architecture/performance**
- Route-level lazy loading for admin, event tools and lower-frequency public modules.
- Replace the historical CSS stack with one canonical stylesheet after visual regression coverage is strong.
- Pre-render public SEO routes.
- Add field Web Vitals monitoring and performance regression budgets.
- Convert remaining heavy imagery to responsive AVIF/WebP variants with explicit dimensions.

### Research principles

The implementation should follow WCAG 2.2 accessibility guidance, Google's current JavaScript SEO/Core Web Vitals guidance, Vercel caching/header guidance, and Supabase production/RLS guidance. External research should inform the implementation model, while JYC's supplied senior-approved visual direction remains the source of truth for branding.