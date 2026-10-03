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
