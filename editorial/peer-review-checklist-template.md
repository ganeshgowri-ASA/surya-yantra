# Peer-Review Checklist — Surya Yantra Research Articles

**Weekly angle:** Thursday  
**Version:** 1.0 (2026-05-22)

Copy this file to `drafts/_pr-check-NNN-YYYY-MM-DD.md` and fill it in for each article draft.

---

## Article metadata

| Field | Value |
|---|---|
| Article file | `drafts/article-NNN-*.md` |
| Reviewer | |
| Review date | YYYY-MM-DD |
| Status before review | (e.g. `draft`, `enhanced`) |

---

## A. Structure & Completeness

- [ ] **A1** Title is specific, contains the primary technology/standard, and is ≤ 15 words
- [ ] **A2** Abstract answers: motivation, method, key result, significance (4-sentence structure)
- [ ] **A3** Keywords (5–8) include at least one IEC standard number and one technology term
- [ ] **A4** Introduction ends with an explicit statement of contributions
- [ ] **A5** All sections referenced in the Introduction are present in the body
- [ ] **A6** Conclusion does not introduce new results; includes a "limitations & future work" paragraph
- [ ] **A7** Acknowledgements section present (lab, funding, instrument vendor)

## B. Technical Accuracy

- [ ] **B1** Every IEC standard cited by number is the current edition (verify against [IEC Webstore](https://webstore.iec.ch))
- [ ] **B2** All equations are numbered and defined (every symbol introduced on first use)
- [ ] **B3** Procedure 1 / 2 / 3 / 4 terminology matches IEC 60891:2021 exactly (not paraphrased)
- [ ] **B4** SMMF formula matches IEC 60904-7:2019 Eq. 1 verbatim
- [ ] **B5** Martin-Ruiz IAM cited as: Martín N. and Ruiz J.M. (2001), Solar Energy Materials and Solar Cells, 70(1), 25–38
- [ ] **B6** Temperature coefficients α, β stated in both absolute (A/°C, V/°C) and relative (%/°C) forms where used
- [ ] **B7** Any numerical results include uncertainty estimates (expanded uncertainty, k=2, per GUM)
- [ ] **B8** Module technologies covered (HJT, TOPCon, IBC, etc.) cited with at least one peer-reviewed characterisation reference

## C. Data & Reproducibility

- [ ] **C1** Test conditions (G, T, spectrum, AOI) are fully specified for every measurement reported
- [ ] **C2** Module serial numbers or anonymised IDs are consistent throughout
- [ ] **C3** ESL-Solar 500 firmware version and calibration date are stated (or noted as "to be added")
- [ ] **C4** Reference cell (IMT Solar Si-RS485TC-T-MB) calibration traceability is stated
- [ ] **C5** Raw data or a data-availability statement is included
- [ ] **C6** Software version / commit SHA of `surya-yantra` used for analysis is cited

## D. Citations & References

- [ ] **D1** All references are in a consistent style (recommend IEEE style for this domain)
- [ ] **D2** No reference is a bare URL without author/title/date
- [ ] **D3** IEC standards: cite as `IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and irradiance corrections*, Ed. 3, Geneva, 2021`
- [ ] **D4** Self-citations (surya-yantra repo, SolarLabX, antaryami-os) include the commit SHA or release tag
- [ ] **D5** At least one reference published within the last 3 years for each major claim
- [ ] **D6** All inline citations have a matching entry in the References section

## E. Figures & Tables

- [ ] **E1** Every figure has a caption that is self-contained (readable without the body text)
- [ ] **E2** Every figure referenced in the text exists in the file (no broken image links)
- [ ] **E3** All figures have descriptive Markdown alt-text (`![Description here](...)`)
- [ ] **E4** Tables have header rows and column alignment consistent with content type
- [ ] **E5** Axis labels on plots include units; IV curve plots label Isc, Voc, MPP

## F. Cross-Repository Links

- [ ] **F1** Links to `surya-yantra` source code use permalink format (commit SHA, not branch name)
- [ ] **F2** Links to `SolarLabX`, `antaryami-os`, `GanitaSutra-v0`, `ShilpaSutra` are valid and non-empty
- [ ] **F3** Any claim "implemented in [repo]" links to the specific file and line range
- [ ] **F4** The `related_repos` front-matter field lists all repos mentioned in the text

## G. SEO / Metadata (pre-publication)

- [ ] **G1** Slug is lowercase, hyphen-separated, ≤ 60 characters
- [ ] **G2** `keywords` front-matter contains 5–8 terms covering technology, standard, and application domain
- [ ] **G3** `abstract` front-matter field is ≤ 250 words
- [ ] **G4** `authors` front-matter includes ORCID for at least the corresponding author

---

## Review outcome

| Grade | Criteria |
|---|---|
| ✅ Ready for `polish` | All A–C items pass; D–G items ≤ 3 minor gaps |
| ⚠️ Minor revision | ≤ 5 items fail; no B items fail |
| ❌ Major revision | Any B item fails, or > 5 items total fail |

**Outcome of this review:**

**Items requiring action:**

1. (list here)
