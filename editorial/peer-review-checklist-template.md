# Peer-Review Checklist Template

_Apply every Thursday to each article in `drafts/` with status `📝 draft` or higher.
One completed instance per article per week in `drafts/_pr-check-<slug>-<date>.md`._

**Article:** `<filename>`  
**Reviewer:** Claude (automated)  
**Date:** YYYY-MM-DD  
**Status before:** `<old status>`  
**Status after:** `<new status>`

---

## A. Structure & Hierarchy

- [ ] A1. Single H1 title; no heading level skipped (H2→H3→H4, never H2→H4)
- [ ] A2. Abstract ≤250 words; includes problem, method, result, significance
- [ ] A3. Introduction ends with explicit research-question or thesis statement
- [ ] A4. Section count appropriate (≥3, ≤10 for a journal paper)
- [ ] A5. Conclusion does not introduce new claims not in the body

## B. Citation Coverage

- [ ] B1. Every IEC/ISO/IEEE standard cited with edition year and section number
- [ ] B2. Every quantitative claim (numbers, percentages, efficiencies) has a citation or experimental note
- [ ] B3. No bare URLs — all external links appear in a numbered references section
- [ ] B4. References section present; entries follow a consistent style (APA or IEEE)
- [ ] B5. DOIs present for all peer-reviewed journal articles

## C. Technical Correctness

- [ ] C1. Equations rendered correctly (LaTeX/KaTeX syntax or plaintext formula blocks)
- [ ] C2. Units stated on all physical quantities; SI except where standard deviates
- [ ] C3. Formulas match the canonical IEC/literature source (spot-check ≥2 equations)
- [ ] C4. Code snippets use the actual function signatures from `apps/web/lib/*`
- [ ] C5. No contradictions with the worked example in `docs/IEC-CORRECTIONS.md §1.5`

## D. Quantitative Claims

- [ ] D1. Every numeric result states its uncertainty or confidence interval
- [ ] D2. Simulation results clearly distinguished from measured results
- [ ] D3. Claims derived from lab data cite the dataset or measurement session ID
- [ ] D4. "X %" improvement claims state the baseline and conditions
- [ ] D5. No round-number guesses presented as measurements (e.g., "≈91%" without data)

## E. Figures & Alt-Text

- [ ] E1. Every `<img>` tag has a non-empty `alt` attribute
- [ ] E2. Every figure has a numbered caption in the body text
- [ ] E3. ASCII diagrams (if used) are wrapped in fenced code blocks
- [ ] E4. No broken image links (all `![...]` paths resolve)
- [ ] E5. OG image placeholder present in front-matter (stub OK until Fri polish)

## F. Broken-Link Audit

- [ ] F1. All relative links to `docs/*`, `hardware/*`, `apps/*` resolve on `main` branch
- [ ] F2. All absolute URLs return HTTP 200 (spot-check ≥3)
- [ ] F3. Cross-references to sibling repos (antaryami-os etc.) use stable permalink, not branch HEAD
- [ ] F4. No references to files planned but not yet committed (mark `[Planned: #NNN]`)

## G. SEO & Metadata (required before `✅ promotion-ready`)

- [ ] G1. `slug` field present; lowercase, hyphenated, ≤60 chars
- [ ] G2. `description` present; ≤160 chars; does not repeat the title verbatim
- [ ] G3. ≥10 `keywords`; includes IEC standard numbers and technology terms
- [ ] G4. `canonical_url` points to production domain
- [ ] G5. `reading_time_minutes` computed (≈ word count ÷ 200)

---

## Outcome

| Grade | Criteria |
|-------|----------|
| ✅ promotion-ready | All 34 items PASS |
| ⚠️ minor-revision | ≤5 items FAIL, all in sections E–G |
| 📝 draft (continue) | ≤10 items FAIL, none blocking in C–D |
| ❌ major-revision | Any D5 FAIL, or ≥3 C-section FAILs, or any C3 FAIL |
| 🗑️ archive | Duplicate of another draft; no new contribution |
