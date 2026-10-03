# JYC V36 Deep Research & Correction Pass — 03 October 2026

This pass re-audited the V36 senior-V1 branch against the approved senior V1 product contract, current JIIT public material, publicly attributable club/fest identities, and current accessibility, performance, and event-SEO guidance.

## Verified findings
- JIIT's 2026 admission brochure describes JIIT Youth Club 128 as the central coordinating body for major college events, fests and inter-society activities, and lists a broader set of named societies/hubs than the repository's older 21-community orientation dataset.
- The older 21-community dataset is retained as supplied/historical material and must not be presented as an exhaustive current 2026 directory. Current published records should be managed through the JYC Control Center.
- JIIT's current public contact information confirms separate Sector 62 and Sector 128 addresses. Public JYC copy remains explicitly scoped to Sector 128; the campus map intentionally retains both campuses for utility.
- Publicly attributable identities wired into the project include JIIT Youth Club, CICR, ZENCODERS, Dronotics, Vamunique, RPH, JODC, CypherX, GDG JIIT-128, Innovation JIIT and Abhivyakti. No unverified handles were added where attribution was insufficient.
- WCAG 2.2 requires visible keyboard focus and minimum pointer target sizing. The codebase already contains a global focus-visible contract and reduced-motion rules.
- Current web performance guidance supports lazy loading below-the-fold imagery and eager/high-priority handling for genuinely important above-the-fold imagery. Future work should add responsive image variants.
- Google Search Central's Event structured-data guidance supports event discovery when records contain accurate details and valid structured data.

## Corrections implemented
1. Find Your Community chips now map to semantic interest aliases.
2. Event Category filtering now uses event category/event type when available instead of only organiser family.
3. Leadership and Gallery now have explicit page titles/descriptions.
4. V1 public routes are included in sitemap generation.
5. The contact form no longer reports success when Supabase is not configured.
6. Gallery provenance always has a readable fallback label.
7. JAI's organiser link now points to the official JIIT Youth Club domain.
8. Event JSON-LD now supports multi-day date ranges and registration offer metadata.
9. Senior-V1 QA now checks the new discovery, category, metadata and contact-form behavior.

## P0 production gates
- GitHub CI must pass on the latest V36 commit.
- Desktop and mobile preview QA must pass.
- External social, registration and organiser links must be verified.
- Supabase production variables and contact-submission RLS must be verified.
- Vercel production origin must be configured so sitemap/canonical URLs use the real hostname.

## P1 next
- Replace the static orientation directory with an admin-managed current 2026–27 club registry while retaining archive material separately.
- Add club source metadata: official website, Instagram, LinkedIn, last verified date and verification state.
- Add event source metadata and official-source links.
- Add responsive image variants with srcset/sizes or picture.
- Add external-link health checks.
- Add automated accessibility checks for keyboard navigation, dialog focus trapping, target sizes and mobile bottom-dock obstruction.
- Add privacy/retention copy and abuse protection for public submissions.

## P2 next
- Interest-based club discovery without ranking.
- Event reminders and calendar subscription.
- Last-verified badges for official club/fest identities.
- Archive provenance for year, event, organiser, source and usage rights.
- Admin content-health rules for stale social links, missing alt text and expired recruitment links.
- Current-year leadership verification before publishing team records.

## Research source set
Current JIIT public pages and 2026 admission material; W3C WCAG 2.2; Google Search Central Event structured data; and current web.dev responsive-image guidance.