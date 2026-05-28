---
title: "Peer-Review Report — W22 Thursday (2026-05-28)"
date: "2026-05-28"
reviewer: "Claude (automated)"
---

# Peer-Review Report — W22 Thursday 2026-05-28

Applying the 34-item checklist from `editorial/peer-review-checklist-template.md`
to the two article seeds committed in the Wednesday (W22) pass on PR #97, plus
a status update on the backlog from PRs #93–#94.

---

## Article 1: `2026-05-27-iv-reliability-loop.md` (PR #97)

**Title:** *From IV Curve to Reliability: How Surya Yantra and Agnipariksha Close
the PV Module Characterisation Loop*

### Checklist results

| Dimension | Items | PASS | FAIL |
|-----------|-------|------|------|
| A. Structure | 5 | 4 | 1 |
| B. Citations | 5 | 5 | 0 |
| C. Technical | 5 | 4 | 1 |
| D. Quantitative claims | 5 | 3 | 2 |
| E. Figures | 5 | 5 | 0 |
| F. Broken links | 4 | 3 | 1 |
| G. SEO | 5 | 3 | 2 |

**FAIL details:**

- **A4** — Section count: seed has abstract + 2 sections only; needs ≥3 substantive sections before Wednesday enhancement pass.
- **C3** — The IEC 60891 formula quoted in the seed must be verified against `apps/web/lib/iec60891.ts` line numbers.
- **D2** — "0.3% Pmpp bias between P1 and P2" is stated without distinguishing simulation from measured. The `docs/IEC-CORRECTIONS.md §1.5` worked example shows (451−450)/450 = 0.22% — close but not 0.3%. Either correct the figure or cite the specific conditions that produce 0.3%.
- **D5** — The claim "procedure-induced bias (~0.3%)" appears unvalidated beyond the single worked example. Must note as estimate pending multi-module dataset.
- **F4** — `agnipariksha` repo referenced; must use stable permalink (tag or commit SHA), not branch HEAD.
- **G1/G2** — Slug and description fields absent (seed-only front-matter).

**Outcome: ⚠️ minor-revision**

Blocker for promotion: D2 quantitative bias claim needs multi-point validation or
clear caveat. All other FAILs are mechanical (structure, SEO) fixable in Fri/Sat pass.

---

## Article 2: `2026-05-27-ai-test-infra-design.md` (PR #97)

**Title:** *AI-Assisted PV Test Infrastructure: Bridging GenAI-CAD-CFD-Studio
and Surya Yantra's Hardware Layer*

### Checklist results

| Dimension | Items | PASS | FAIL |
|-----------|-------|------|------|
| A. Structure | 5 | 3 | 2 |
| B. Citations | 5 | 3 | 2 |
| C. Technical | 5 | 2 | 3 |
| D. Quantitative claims | 5 | 4 | 1 |
| E. Figures | 5 | 5 | 0 |
| F. Broken links | 4 | 2 | 2 |
| G. SEO | 5 | 2 | 3 |

**FAIL details:**

- **A3** — Introduction does not end with an explicit research question; currently ends with a vague benefit statement.
- **A5** — Conclusion section absent in seed (seed-stage expected, but must be added before draft status).
- **B2** — "NL-driven parametric CAD → CFD thermal validation → BoQ reconciliation" pipeline is described but not cited; no reference to ShilpaSutra repo or API spec.
- **B4** — References section empty in seed; GenAI-CAD-CFD-Studio is an internal project with no DOI.
- **C3** — The claim that ShilpaSutra produces "SVG schematics" that feed `hardware/` docs is unverified; ShilpaSutra's output format is not documented in this repo.
- **C4** — No code snippets linking to actual `apps/web/lib/*` or `hardware/BOM.md` data fields.
- **C5** — No connection to the IEC-CORRECTIONS.md worked example; the article should demonstrate a concrete module (e.g., BOM item 1.1 ESL-Solar 500) going through the proposed pipeline.
- **D5** — No unvalidated percentage claims — PASS.
- **F3** — References to `ShilpaSutra` and `antaryami-os` use HEAD, not stable permalink.
- **F4** — `apps/desktop/relay` referenced as if it exists; must mark as `[Planned: #91]`.
- **G1/G2/G3** — SEO front-matter absent.

**Outcome: ❌ major-revision**

Blockers: C3 (ShilpaSutra output format unverified), C4 (no code linkage), A3 (no research question). This article needs a clear, falsifiable research question and at least one concrete worked example before it can advance to `📝 draft` status.

---

## Backlog status update (PRs #93–#94)

| Article | Previous status | Updated status | Change |
|---------|----------------|----------------|--------|
| 2026-05-25-antaryami-surya-ai-loop.md | ❌ major-revision | ❌ major-revision | No change — 63% latency claim still unvalidated; antaryami-os API not accessible |
| 2026-05-25-ganitasutra-pv-numerics.md | ❌ major-revision | ❌ major-revision | No change — GanitaSutra API confirmation needed |
| 2026-05-26-ts-nocheck-to-type-safe-iec-reports.md | 📝 draft | 📝 draft | Wed #97 did not update this; no change |
| 2026-05-26-auth-guards-pv-ai-apis.md | 📝 draft | 📝 draft | Wed #97 did not update this; no change |

---

## Summary

| Article | Status |
|---------|--------|
| 2026-05-27-iv-reliability-loop.md | ⚠️ minor-revision |
| 2026-05-27-ai-test-infra-design.md | ❌ major-revision |
| 2026-05-28-smmf-nabl-uncertainty.md (new seed) | 🌱 seed |
| 2026-05-28-pv-pranali-test-spec-accuracy.md (new seed) | 🌱 seed |

**Next actions:**
1. Fri pass: add ideation→implementation diagram to iv-reliability-loop; fix D2 claim.
2. Wed pass (W23): add ShilpaSutra output-format section to ai-test-infra-design.
3. Both new seeds: outline pass (Mon W23) to add section skeletons.
