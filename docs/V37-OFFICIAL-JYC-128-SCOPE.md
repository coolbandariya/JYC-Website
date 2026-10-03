# V37 — Official JYC 128 Scope & Research

## Decision

JYC 128 is the **official organisational website of JIIT Youth Club, Wish Town Campus, Sector 128, Noida**.

It should communicate the organisation and preserve its public record:

**identity → leadership → clubs/hubs → events → achievements → memories → announcements → contact**

It should not become a student-help or academic utility product.

## Explicitly excluded from the public product direction

The following classes are out of scope:
- attendance or academic schedules
- student academic resources
- generic student-help guides
- campus utility dashboards
- social-network/feed mechanics
- personal productivity dashboards
- utility features that do not strengthen JYC's organisational presence

Compatibility routes can remain temporarily where removing them would create broken links, but they should not be promoted in public navigation, SEO, `llms.txt`, homepage copy or the main information architecture.

## Research findings

### 1. JIIT's own material establishes JYC 128's organisational role

The JIIT 2026 brochure describes JIIT Youth Club 128 as the central coordinating body responsible for planning, managing and executing major college events, fests and inter-society activities.

JIIT's historical annual reporting also documents JYC Sector-128 activity, including orientation and hub participation.

This supports an organisation-first information architecture rather than a campus-utility architecture.

### 2. JYC 128 is actively producing major public events

Current JYC 128 public activity identifies JAI 2026 as a major event at JIIT Sector 128, with the official event website, registration channel and event communication.

JIIT's official public communication identifies Converge 2026 as the annual cultural and technical fest of Sector 128 organised by JYC.

Therefore the event system should be one of the strongest parts of the site.

### 3. 128-campus club sites show the right content pattern

CICR's current JIIT-128 website combines:
- mission
- capabilities
- projects
- upcoming events
- past events
- registration state
- community links
- contact/location

JIIT Innovation similarly combines:
- ecosystem story
- activities
- flagship events
- archive
- team
- gallery
- updates
- contact

JYC should provide the umbrella layer above these individual communities without copying their identities.

### 4. Comparable student-organisation sites reinforce organisation-first IA

BITS Students' Union uses a clear organisation story, leadership, initiatives and clubs.

Rendezvous uses strong event discovery, event-specific pages and an explicit organising team.

The useful lesson is information architecture—not visual imitation.

## What V37 should improve

### A. JYC identity
- Make “JYC 128” explicit throughout the public experience.
- Remove stale Sector-62 JYC copy.
- Keep Sector 62 only when a JIIT-wide reference is genuinely necessary.
- Use verified official social identities.
- Centralise canonical organisation metadata.

### B. Leadership
Create a clear hierarchy:
**Faculty Coordinators → Apex / Executive Leadership → Committee Heads → Clubs & Hubs**

Each published person should have:
- name
- role
- department/year when officially supplied
- photo
- short bio
- official social link when verified

### C. Clubs & hubs
Every current public club should have a proper organisational profile:
- purpose
- category
- leadership
- activities
- events
- achievements
- gallery
- recruitment state
- official links
- source and verification date

Old supplied club lists should be labelled historical/context unless re-verified.

### D. Events
Every event should answer immediately:
**What? When? Where? Who is organising it? Who can participate? How do I register?**

Then provide:
- schedule
- rules
- prizes
- FAQs
- contact
- results
- recap/gallery

### E. Achievements
Move beyond a decorative Wall of Fame.

Use evidence-backed records:
**achievement → person/club → event → year → result → source/media**

### F. Announcements
Build an official publishing layer with:
- registration
- result
- recruitment
- audition
- notice
- deadline
- JYC update

Give each notice a publication and archive/expiry state.

### G. Gallery
Treat the gallery as institutional memory:
- event albums
- club albums
- year filters
- captions
- credits
- provenance
- fullscreen viewing

### H. Trust / provenance
For every major public record, maintain:
- source
- last verified
- verified by
- published/archived state

This is especially important because the repository contains historical material from multiple years and campuses.

### I. Admin quality
Add internal content-health checks:
- stale people
- stale clubs
- broken registration links
- missing posters
- missing alt text
- missing credits
- duplicate events
- invalid venue/campus
- expired recruitment
- missing provenance

### J. Performance
JYC is image-heavy, so performance work should focus on media rather than adding animation:
- responsive image sizes
- WebP/AVIF where appropriate
- explicit image dimensions
- lazy loading below the fold
- eager/high-priority loading only for the true hero/LCP image
- bundle/image budgets
- Core Web Vitals checks

Current web.dev guidance supports responsive images, dimensions to reduce layout shift, and selective lazy loading rather than lazy-loading critical above-the-fold imagery.

### K. Accessibility
Use WCAG 2.2 as the baseline for:
- visible focus
- non-obscured focus
- target sizing
- keyboard navigation
- dialog focus management
- form labels/errors
- reduced motion
- 200–400% zoom/reflow

## Recommended final navigation

**Home · About · Leadership · Clubs · Events · Gallery · Achievements · Announcements · Join JYC · Contact**

Keep secondary compatibility pages out of the primary navigation.

## Recommended homepage hierarchy

1. JYC 128 identity + statement
2. Featured / upcoming JYC event
3. What JYC does
4. Clubs & Hubs
5. Latest announcements
6. Recent achievements
7. JYC in moments / gallery
8. Leadership preview
9. Join JYC / official CTA
10. Footer + official channels

The homepage should feel like an organisation's official front door, not a dashboard.

## Visual direction

Keep the current beige / black / white signature system.

Use motion for:
- page entrance
- card interaction
- image reveal
- event status transitions
- gallery/lightbox
- meaningful navigation feedback

Do not bring back:
- continuous orbit systems
- flying decorative birds
- custom cursor
- excessive glow
- giant empty hero areas
- generic AI-dashboard visuals

## Sources

- JIIT 2026 brochure — JYC 128 role and current community context.
- JIIT Annual Reports — historical JYC Sector-128 activity.
- JIIT official Converge 2026 communication — JYC-organised Sector-128 fest.
- JYC 128 public LinkedIn activity — current JAI 2026 event context.
- CICR JIIT-128 — club-site information architecture.
- JIIT Innovation — event/archive/team/gallery information architecture.
- BITS Students' Union — student-organisation information architecture.
- Rendezvous IIT Delhi — event discovery and organising-team patterns.
- W3C WCAG 2.2 — accessibility requirements.
- web.dev — responsive image and Core Web Vitals guidance.

This document is the V37 product guardrail: **official JYC 128 website first; no student-help portal expansion.**
