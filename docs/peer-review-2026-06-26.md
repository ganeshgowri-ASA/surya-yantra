# Peer-Review Checklist — 2026-06-26 (Thursday W26)

Applied to the two active drafts from the W24 outline run. Each checklist
item is tagged: ✅ PASS · ⚠️ WARN · ❌ FAIL · 🔲 TODO (blocked).

---

## Draft 1: "Open-Source WebSocket–SCPI Bridge for Real-Time PV IV Curve Streaming"

`drafts/2026-06-09-ws-iv-tracing-systems.md` — target: MDPI Sensors

### A. Scope & Originality
- ✅ Clearly novel contribution: first open-source WS-SCPI bridge for PV IV streaming
- ✅ Prior-art table (§6) covers LabVIEW, PyVISA Dash, SMA — adequate for Sensors scope
- ⚠️ No citation to any existing WebSocket instrumentation paper (IEEE TIM, IMEKO). Add 1–2 references to establish the gap more firmly.
- 🔲 Instrument-agnostic claim needs a second instrument demo (Keithley shim §7.1) — currently only tested on ESL-Solar 500

### B. Abstract
- ❌ Abstract not written — only bullet points remain. Must be converted to ≈200-word prose before submission.
- ✅ Key claims identified (sub-50 ms latency, open-source, IEC 60891 integration)
- ⚠️ Results sentence will be weak until §4 benchmarks are measured. Flag in cover letter if submitting before issue #142 is resolved.

### C. Methods & Reproducibility
- ✅ Transport stack diagram (§3.1) is clear and complete
- ✅ Server-side architecture well-specified (ring buffer, reconnect policy)
- ⚠️ §3.2: Sampler loop uses `MEAS:MPPSCAN:LISTFIRST?` — confirm ESL-Solar 500 baud rate is 9600 (not 115200 as noted in blocking gap). Latency model in §4.1 depends on this.
- ❌ §3.5: `/api/ws` has no authentication. **Do not submit while this is open.** Issue #152 must be resolved or explicitly scoped as "future work" with a threat model paragraph.
- ✅ Code file paths in frontmatter correspond to real paths in `apps/web/`

### D. Results & Figures
- ❌ §4.2 latency table: all cells empty — benchmark data required (issue #142)
- ❌ §4.3 frame-rate table: all cells empty
- ❌ §4.4 memory stability: no measurements
- ❌ Fig. 1 (architecture SVG): placeholder only; alt-text required for accessibility and MDPI guidelines
- ⚠️ §5.1 streaming-vs-post-hoc latency table uses estimated values only — note clearly as theoretical

### E. References
- ✅ IEC 60891:2021 (Ref 1) and SCPI Consortium (Ref 2) correct
- ✅ Socket.IO docs (Ref 3) and PyVISA (Ref 4) correct
- ❌ Ref 5 (Ransome & Sutterlueti 2011): missing DOI — add `10.4229/26thEUPVSEC2011-4AV.3.22`
- ❌ Ref 6: IEC 60904-7:2019 citation marked TODO — add IEC Webstore URL (see IEC-CORRECTIONS.md §2)
- ❌ Ref 7: No Recharts performance paper exists; replace with a general React rendering / virtual-DOM benchmark reference or remove
- ❌ Ref 8: India solar testing capacity — cite MNRE Annual Report 2024-25 or IEA PVPS Task 13

### F. Language & Style (for MDPI Sensors)
- ⚠️ Title is long (21 words) — MDPI guideline recommends ≤ 15 words. Suggested: "Open-Source WebSocket–SCPI Bridge for Real-Time Photovoltaic IV Curve Streaming"
- 🔲 Structured abstract format (Background / Methods / Results / Conclusions) required by MDPI — not yet applied
- ⚠️ §7.2 "Security hardening required before public deployment" reads as a limitation but is buried in Discussion. Elevate to an explicit Limitations subsection or call out in Abstract.

### G. Data Availability
- ✅ Code is MIT-licensed and available at `ganeshgowri-ASA/surya-yantra`
- 🔲 Raw benchmark data (once measured) should be deposited in Zenodo or Figshare per MDPI open-data policy

### Verdict: NOT READY FOR SUBMISSION
Blocking items: §4 empty (benchmarks needed), Fig. 1 placeholder, auth gap, abstract not written, 4 broken references.
Estimated effort to resolve: 3–5 lab days after issue #142 and #152 are closed.

---

## Draft 2: "From Schema to NABL: Open-Source PostgreSQL Architecture for ISO 17025–Accredited Solar PV Test Laboratories"

`drafts/2026-06-09-nabl-open-source-pv-lims.md` — target: Measurement (Elsevier) or Accreditation and Quality Assurance (Springer)

### A. Scope & Originality
- ✅ Strong original contribution: ISO 17025 clause-by-clause mapping to open-source schema is rare in literature
- ✅ India-specific angle (NABL 141, PLI scheme) is timely and under-served
- ⚠️ Check whether "Measurement" (Elsevier) has published LIMS architecture papers; if not, Accreditation and Quality Assurance (Springer) is the safer primary target
- ⚠️ §7.2 comparison table is anecdotal — a citation for "LIMS-Pro" costs is needed or the row should be marked "estimated"

### B. Abstract
- ❌ Abstract not written — bullet points only. Must be converted to ≈250-word prose.
- ✅ Core claims are well-defined (10/12 clauses covered, 1.1 % expanded uncertainty)
- ⚠️ "Enables a structured path to NABL accreditation" is a strong claim — soften to "provides a technically defensible foundation" unless actual accreditation has been achieved

### C. Methods & Reproducibility
- ✅ §3 ISO 17025 mapping table is comprehensive and well-structured
- ❌ §3.1: ISO 17025 §7.9 (Complaints) row is missing from the table — marked as TODO in text but not in the table itself
- ❌ `CorrectionResult.uExpandedPct` field not implemented (issue #120) — the uncertainty budget in §4.3 refers to a field that doesn't exist yet
- ❌ `IVMeasurement.libVersion` / `CorrectionResult.libVersion` schema field not implemented — critical for ISO 17025 §7.11 reproducibility claim
- ⚠️ Prisma schema file (`apps/web/prisma/schema.prisma`) is not in the public repo docs/ tree — recommend adding a schema excerpt to the paper or an appendix

### D. Results & Validation
- ✅ GUM uncertainty budget (§4.3) is well-structured and values are plausible
- ⚠️ Uncertainty budget uses "typical" values, not lab-measured sensor uncertainty certificates. State this explicitly as "estimated" and plan to update with actual calibration certificates.
- ❌ IEC 60891:2021 Annex B validation (issue #137) is pending — the claim that the correction engine is "validated" is not yet defensible without this
- 🔲 NABL 141 checklist not yet obtained — until obtained, the NABL-specific claims remain unverified

### E. References
- ✅ ISO 17025:2017 (Ref 1), IEC 60891 (Ref 3), JCGM 100:2008 (Ref 4) all correct
- ✅ IEC 60904-7 (Ref 5), IEC 61853-2 (Ref 6), Martin-Ruiz (Ref 10) all correct
- ❌ Ref 7: MNRE PLI scheme — use official URL: `https://mnre.gov.in/solar/schemes/`; add year accessed
- ❌ Ref 8: NABL-accredited PV lab count — check NABL directory at `nabl-india.org`; currently ≈12 labs as of 2024
- ❌ Ref 9: Open-source LIMS comparison paper needed; candidate: Heikkinen et al. (2021) "Open-source LIMS in research laboratories" *SoftwareX* 13:100625

### F. Language & Style (for Measurement / Accreditation)
- ⚠️ Title is clear but academic; "From Schema to NABL" is punchy — keep
- ⚠️ Abbreviation NABL is not universally known; spell out on first use in abstract: "National Accreditation Board for Testing and Calibration Laboratories (NABL)"
- 🔲 Measurement (Elsevier): requires structured highlights (3–5 bullet novelty statements) — not yet drafted
- 🔲 Accreditation and Quality Assurance (Springer): requires compliance with journal template — check section order

### G. Data Availability
- ✅ Code (MIT), schema, and IEC test suite at `ganeshgowri-ASA/surya-yantra`
- 🔲 Once `uExpandedPct` is implemented, include a sample `CorrectionResult` JSON as supplementary data

### H. Ethical / Competing-interests Disclosure
- ✅ No competing interests apparent
- 🔲 Confirm: is Srishti PV Lab a commercial entity or academic lab? If commercial, disclosure required in Measurement / Springer submission.

### Verdict: NOT READY FOR SUBMISSION
Blocking items: abstract not written, 2 schema fields unimplemented (#120, libVersion), Annex B validation (#137), NABL 141 checklist outstanding, 3 incomplete references.
Estimated effort to resolve: 4–6 weeks (primarily waiting on schema PRs and NABL document retrieval).

---

## Article Seeds — Proposed from Ecosystem Context

> Cross-repo commit data unavailable (session scoped to surya-yantra only).
> Seeds are derived from public repo descriptions and existing issue trail.

### Seed A: "IEC 60891 in Production: Four Correction Procedures in a 500-Test-Cycle Deployment"
- **Narrative**: After 500+ module tests at Srishti PV Lab, which correction procedure (P1 vs P2 vs P4) is most accurate in the Jamnagar climate (high irradiance variability, desert aerosol)? Empirical comparison using real measurement data.
- **Link to engineering progress**: Connects surya-yantra's correction engine (IEC-CORRECTIONS.md) with field data that will accumulate once the lab is commissioned.
- **Target**: Solar Energy (Elsevier) or Progress in Photovoltaics
- **Blocking**: Lab commissioning + ≥100 test records with redundant P1 and P2 runs

### Seed B: "Multi-Agent Orchestration for Solar PV Test Equipment Proposals: A LangGraph + MCP Case Study"
- **Narrative**: The pv-pranali project (LangGraph + MCP, Claude Code + MiMo on WSL) orchestrates antaryami-os, ShilpaSutra, SuryaPrajna, and Vidyut-Srishti to generate structured PV test equipment proposals. Paper describes the agent topology, tool-call chains, and accuracy of the generated BoMs.
- **Link to engineering progress**: Ties the surya-yantra hardware BOM and SCPI driver layer to the broader agentic stack being built across the organisation.
- **Target**: IEEE Access or Applied Sciences (MDPI)
- **Blocking**: pv-pranali commit access; at least one end-to-end proposal run with human evaluation

---

## Actions Required (Summary)

| Priority | Action | Owner | Linked issue |
|----------|--------|-------|-------------|
| P0 | Write abstracts for both drafts | Author | — |
| P0 | Collect §4 benchmarks for WS-IV paper | Lab engineer | #142 |
| P0 | Implement `CorrectionResult.uExpandedPct` | Dev | #120 |
| P1 | Gate `/api/ws` with authentication | Dev | #152 |
| P1 | Validate correction engine against IEC Annex B | Dev | #137 |
| P1 | Obtain NABL 141 checklist | Author | #141 |
| P1 | Create SVG Fig. 1 for WS-IV paper with alt-text | Author | — |
| P2 | Add §7.9 Complaints row to ISO 17025 mapping table | Author | — |
| P2 | Implement `libVersion` on CorrectionResult | Dev | — |
| P2 | Fill 7 incomplete references across both drafts | Author | — |
| P2 | Create `docs/PRD.md` (missing, referenced in README) | Dev | — |

---

*Thursday peer-review pass — 2026-06-26 (W26). Next: Friday = publication-ready polish for the more advanced draft once P0 blockers are lifted.*
