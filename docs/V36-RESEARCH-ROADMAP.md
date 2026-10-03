# JYC V36 Research Roadmap — 2026-10-03

This roadmap records the next improvements after the V35.1 production-hardening line. It is based on the maintained repository plus current official JIIT material and live 128-campus reference sites.

## Evidence reviewed

- JIIT Admission Brochure 2026: JIIT Youth Club 128 is described as the central coordinating body for major college events, fests and inter-society activity; the same source names current 128 communities including CICR, JODC, RPH, Innovation Club and JSA.
- JIIT Innovation: current public site demonstrates a strong event/archive model, explicit registration states, team ownership, project/gallery storytelling and an innovation ecosystem around JIIT 128.
- CICR: current 128-campus robotics site demonstrates a focused club model with mission, capabilities, projects, upcoming/past events, community links and contact/location.
- JIIT official social/public material: current 2026 Converge and JAI material show that JYC 128 is actively publishing major event experiences.
- Comparable student-activity sites: BMU Nexus and ISI Bangalore show the value of a searchable club directory, event calendar, representative/contact data, and clear “get listed / update this” workflows.

## Highest-priority product work

### 1. Make 128 the explicit product scope
Use “JIIT Youth Club 128” / “JIIT Sector 128” consistently in public copy where the site represents the 128 campus. Keep the 62/128 distinction explicit in the campus map and shared JIIT links instead of mixing campus records.

### 2. Create a verified club registry
Every public club should have:
- official name
- category/family
- one-line purpose
- long description
- current student lead/coordinator
- faculty advisor when officially published
- contact/social links
- recruitment status
- official logo/cover
- latest activity
- source/provenance field
- last verified date
- archived status

Do not publish a club merely because an old brochure mentions it.

### 3. Turn events into the core conversion surface
Every event should support:
- registration state
- start/end time
- venue + campus
- organizer
- eligibility
- capacity when applicable
- external/native registration
- add-to-calendar
- share
- reminder/save
- past-event recap
- photos/results after completion

### 4. Add provenance to public content
For clubs, events, people and major claims, store an internal source URL/document reference and last-verified timestamp. Admin should show stale-content warnings.

### 5. Build a better club discovery experience
Add:
- family/category filters
- interest filters
- “recruiting now”
- “events this month”
- “active this week”
- search by club/project/person
- compare/save/follow
- clear empty states

### 6. Improve the event/archive loop
The homepage should naturally connect:
event → registration → attendance/participation → gallery/recap → club profile → next event.

This is more valuable than another decorative homepage section.

### 7. Media provenance and performance
For every uploaded image:
- require alt text/caption
- retain source/credit
- generate responsive sizes
- use WebP/AVIF where safe
- lazy-load below the fold
- preload only the true hero asset
- prevent oversized originals from entering the public bundle
- preserve focal point/crop metadata

### 8. Make admin content quality a first-class workflow
The existing health checks should expand to:
- stale records
- missing social/contact data
- missing alt text
- broken registration links
- duplicate clubs/events
- event date conflicts
- venue/campus mismatch
- expired recruitment
- missing source/provenance
- unoptimized media
- unpublished drafts older than a threshold

### 9. Add real analytics around student outcomes
Track privacy-conscious product events such as:
- club search
- club profile open
- follow/save club
- event open
- registration click
- calendar export
- map/directions click
- social click
- search with zero results

Use aggregate metrics, not invasive student profiling.

### 10. Performance budget
Set release gates for:
- JS bundle size
- CSS size
- largest image
- total image weight
- LCP
- CLS
- INP
- first-load request count

The current visual system should remain restrained; performance is now more important than adding another animation layer.

## UX improvements worth adding

- persistent campus context on map/event cards
- “what is happening today” rail
- monthly event calendar with filters
- recruitment banner driven by admin data
- club onboarding / “find your club” questionnaire
- accessible command/search palette
- shareable club and event cards
- event result/recap templates
- alumni/achievement archive only when verified
- official-links hub for JIIT Pulse, JIIT official, JIIT Shelf and approved external services

## Accessibility

Add automated checks for:
- heading hierarchy
- landmark structure
- color contrast
- keyboard traversal
- dialog focus trapping
- form labels/errors
- touch target size
- reduced motion
- screen-reader names for icon buttons
- zoom/reflow at 200–400%

## Security / operations

Keep the current CI/security baseline and add:
- dependency update cadence
- secret scanning
- Supabase migration smoke tests
- RLS tests for every privileged table
- storage-policy tests
- admin role escalation tests
- broken-link checks
- CSP regression tests
- backup restore drills
- production error-rate alerting

## Design direction

Do not return to the older “everything animated” direction.

Keep:
- beige / black / white foundation
- Phoenix as the signature
- editorial typography
- compact navigation
- strong cards and event hierarchy
- restrained motion
- clear mobile navigation

Avoid:
- flying decorative birds
- persistent orbit systems
- custom cursors
- excessive glow
- giant empty hero stages
- generic AI-dashboard styling

## Reference-derived product pattern

The strongest common pattern across the reviewed 128-campus sites is not visual imitation. It is information architecture:

**identity → community → capabilities → events → people → proof/archives → contact/join**

JYC should own that pattern with its own visual language.

## Release sequence

### V36 — Truth & discovery
1. verified 128 club registry
2. provenance/last-verified fields
3. recruitment status
4. improved club search/filtering
5. campus-aware events

### V36.1 — Participation
1. registration lifecycle
2. calendar/share/reminder
3. club follow
4. event recap/archive
5. analytics events

### V36.2 — Media & performance
1. responsive image pipeline
2. media credits/alt text
3. bundle budgets
4. Core Web Vitals gates
5. Lighthouse/Playwright release gate

### V37 — Operations
1. stale-content dashboard
2. broken-link monitor
3. RLS/storage regression suite
4. backup/restore drill
5. production observability

## Non-goals

Do not add features merely because they are technically impressive. JYC's public site should remain a reliable student-activity platform first: discover a community, find something happening, participate, and preserve the memory afterward.


## Social / media verification findings

Current public checks also verified a subset of club and event social identities. V36 stores only links with strong public attribution; unknown handles remain blank rather than being guessed.

Verified links surfaced in V36 include JYC 128, Vamunique, Rapid Programming Hub, CICR, Innovation JIIT, ZenCoders, JODC, CypherX, GDG JIIT-128, Dronotics and Abhivyakti.

Evidence includes official/current LinkedIn organisation pages, official Linktree pages, current event sites and current JIIT publications. In particular: GDG JIIT-128 links Instagram/LinkedIn/YouTube/GitHub/Discord through its public Linktree; CICR's Linktree links Instagram and LinkedIn; ZenCoders publicly names @zencodersjiit; Dronotics' event material names @dronoticsjiit128; and Vamunique's current LinkedIn identifies it as the official dance society of JIIT Sector 128.

Media policy: core website content should come from JYC's published records. Official club/event sites and social profiles are verification and discovery layers, not the primary CMS. Historical brochures/presentations should remain clearly labelled as historical/context material.

## Implemented V36 feature layer

- Leadership is exposed as a canonical public route while preserving Team compatibility.
- Event Calendar has a first-class public route/alias.
- Events support Upcoming / Live / Past states and category + club filters.
- Completed published fest records remain discoverable in the fest archive.
- Club pages expose verified official social connections.
- Fest pages expose official organiser/event links where verified.
- V36 QA includes a senior V1 product contract and release/cache metadata checks.

## Remaining priority order

P0: verify every current 2026–27 team member, club recruitment state, current club logos and current event posters against official records.

P1: add Google Calendar export directly to the public event detail/calendar experience; strengthen registration states; expose recruitment deadlines/application links; add gallery photographer/source credits.

P2: add Find Your Community discovery, saved events/reminders, stronger calendar navigation, social-link verification timestamps and admin content freshness indicators.
