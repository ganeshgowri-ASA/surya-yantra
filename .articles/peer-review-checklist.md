# Peer-Review Checklist — Surya Yantra Research Articles

Use this checklist for every article before requesting external peer review.
Copy the raw checklist block into the draft’s `## Peer-Review Checklist` section.

---

## Structure & Completeness

- [ ] Abstract is 150–250 words and states: problem, method, key result, significance
- [ ] All section headings follow a single H2 (`##`) → H3 (`###`) → H4 (`####`) hierarchy with no gaps
- [ ] Introduction includes: context, research gap, contribution statement, paper outline
- [ ] Related Work covers at least 5 peer-reviewed papers published ≤ 5 years ago
- [ ] Methods section is sufficiently detailed to reproduce results
- [ ] Results are separated from Discussion
- [ ] Conclusion does not introduce new findings
- [ ] References section uses consistent citation style (numbered, IEEE-style preferred)

## Technical Accuracy

- [ ] All IEC standard references include full number, year, and clause where cited (e.g., IEC 60891:2021 §5.3)
- [ ] Mathematical notation is consistent (e.g., `G` vs `Irr` — pick one)
- [ ] All equations are numbered and referenced in-text
- [ ] Unit dimensions stated for all symbols on first use
- [ ] Worked numerical examples verified against the codebase (`lib/iec60891.ts`, `lib/smmf.ts`, `lib/iam.ts`)
- [ ] Error bounds / uncertainty analysis included for key measurements
- [ ] Hardware specs match `hardware/BOM.md` (model numbers, ratings)

## Data & Reproducibility

- [ ] Measurement conditions stated (G, T, AOI, spectrum, date, location)
- [ ] At least one real IV curve dataset from Srishti PV Lab included or referenced
- [ ] Statistical method described (n=? repeats, confidence interval, outlier handling)
- [ ] Code snippets link to canonical repo path (not copied inline without reference)
- [ ] If using AI model output, model ID pinned (e.g., `claude-opus-4-8`)

## References

- [ ] All inline citations have a matching entry in References
- [ ] No orphan References entries
- [ ] DOIs or stable URLs provided for all references
- [ ] IEC standards cited as primary sources
- [ ] At least one citation to related Srishti ecosystem work (SolarLabX, ShilpaSutra, antaryami-os)

## Figures & Tables

- [ ] Every figure has a numbered caption (self-contained description)
- [ ] Every figure reference has meaningful `alt` text
- [ ] Every table has a header row and caption
- [ ] Axis labels include units on all charts
- [ ] IV / PV curve figures show: measured data, STC-corrected data, and correction procedure label

## Language & Style

- [ ] Title ≤ 15 words, informative, includes at least one keyword
- [ ] Abstract contains 3–5 keywords aligned with IEC/IEEE domain vocabulary
- [ ] Acronyms defined on first use (e.g., SCPI, SMMF, IAM, STC, MPP)
- [ ] Passive voice used sparingly in Methods; active voice elsewhere
- [ ] Spell-checked (consistent UK/Indian English)
- [ ] No uncited claims

## Ethics & Disclosure

- [ ] Author affiliations stated (Srishti PV Lab, Jamnagar)
- [ ] Open-source licence of code artefacts stated (MIT)
- [ ] Competing interests / funding disclosed
- [ ] AI tool use disclosed in Author Contributions if applicable

---

*Template version 2026-06-05 · Thursday weekly angle*
