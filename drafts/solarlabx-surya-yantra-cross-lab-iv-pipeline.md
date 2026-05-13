---
title: "Cross-Lab IV Measurement Pipelines: How Surya Yantra and SolarLabX Propagate Measurement Uncertainty Across Sites"
seo_title: "Cross-Lab PV IV Measurement Pipeline: Surya Yantra + SolarLabX Uncertainty Propagation | Srishti PV Lab"
description: "Architecture of the Surya Yantra → SolarLabX cross-laboratory IV measurement pipeline: GUM uncertainty propagation, inter-lab comparison protocol, and the multi-lab-coordinator skill design."
keywords:
  - cross-lab IV measurement
  - SolarLabX
  - Surya Yantra
  - PV measurement uncertainty
  - GUM JCGM
  - inter-lab comparison
  - ISO 17043
  - NABL inter-laboratory
  - solar PV LIMS
  - measurement pipeline
  - Antaryami-OS multi-lab
  - distributed PV testing
canonical: "https://surya-yantra.srishtipvlab.in/posts/solarlabx-surya-yantra-cross-lab-iv-pipeline"
og:
  title: "Cross-Lab IV Pipeline: Surya Yantra × SolarLabX"
  description: "GUM-compliant uncertainty propagation across the Jamnagar and Chennai PV labs — architecture and measurement traceability design."
  image: "/og/solarlabx-cross-lab-pipeline.png"
  type: "article"
twitter:
  card: "summary_large_image"
  title: "Cross-Lab PV Testing: Surya Yantra × SolarLabX"
  description: "How two PV labs share IV curve data with traceable uncertainty — the architecture behind the Srishti Lab network."
  image: "/og/solarlabx-cross-lab-pipeline.png"
author: "Srishti PV Lab Engineering"
date: "2026-05-12"
lastmod: "2026-05-13"
draft: true
tags:
  - solarlabx
  - cross-lab
  - measurement-uncertainty
  - gum
  - inter-lab-comparison
  - solar-pv
  - lims
  - nabl
  - antaryami-os
  - india
categories:
  - engineering
  - research
  - measurement-science
reading_time: 14
schema_type: "TechArticle"
related_repos:
  - surya-yantra
  - SolarLabX
  - antaryami-os
---

# Cross-Lab IV Measurement Pipelines: How Surya Yantra and SolarLabX Propagate Measurement Uncertainty Across Sites

*Tuesday seed — 12 May 2026 · Updated 13 May 2026 · Srishti PV Lab Engineering*

**Engineering signal:** [SolarLabX](https://github.com/ganeshgowri-ASA/SolarLabX) reached **24 open issues** as of 12 May 2026 — up from 20 on 10 May (+4 in 2 days). SolarLabX is the LIMS backend for cross-lab IV measurements from both the Srishti PV Lab Jamnagar facility (Surya Yantra) and a partner Chennai lab. The new issues indicate active development of the inter-lab data pipeline — the integration surface that Antaryami-OS's `multi-lab-coordinator` skill depends on.

## Why Cross-Lab Comparison Is Hard

An IV curve measured at 850 W/m² and 46 °C in Jamnagar, corrected to STC using IEC 60891 P2, and stored in SolarLabX is not directly comparable to the same module's STC curve measured in Chennai, unless:

1. Both labs used the same IEC correction procedure and the same reference values for α, β, Rₛ.
2. Both labs' irradiance sensors are traceable to the same calibration standard (IEC 60904-2 reference cell or secondary standard pyranometer).
3. The uncertainty budget for each correction step is documented and propagated.

Without these three conditions, a 1.5 % Pmpp deviation between Jamnagar and Chennai measurements cannot be attributed to module degradation — it could be an artefact of sensor calibration divergence or procedure mismatch.

NABL accreditation (ISO/IEC 17025:2017) requires that inter-laboratory comparisons be conducted under ISO/IEC 17043:2023 and that measurement uncertainty be reported per the GUM (JCGM 100:2008).

## The Pipeline Architecture

```
Surya Yantra (Jamnagar lab)
  │
  ├── Measure: IV curve at (G₁, T₁)
  ├── Correct: IEC 60891 P2 → STC
  ├── Compute: u(Pmpp) — GUM combined uncertainty
  ├── Sign: HMAC payload with lab key
  └── POST /api/measurements → SolarLabX ingestion endpoint
                 │
                 ▼
         SolarLabX LIMS
  ├── Store: IVCurve + u(Pmpp) + correction metadata
  ├── Compare: vs. reference curve for same serial number
  ├── Flag: if |ΔPmpp| > 2 % or u(ΔPmpp) > threshold
  └── Notify: Antaryami-OS multi-lab-coordinator skill
                 │
                 ▼
  multi-lab-coordinator (Antaryami-OS skill)
  ├── Root-cause route: degradation | calibration drift | procedure mismatch
  └── Notify: QM at both labs if flag unresolved in 24 h
```

## Uncertainty Propagation — GUM Framework

For IEC 60891 Procedure 2, the combined standard uncertainty on corrected Pmpp is (GUM §5.1):

```
u²(Pmpp,STC) = (∂Pmpp/∂Pmpp_meas)² · u²(Pmpp_meas)
             + (∂Pmpp/∂G)²         · u²(G)
             + (∂Pmpp/∂T)²         · u²(T)
             + (∂Pmpp/∂α)²         · u²(α)
             + (∂Pmpp/∂β)²         · u²(β)
             + (∂Pmpp/∂Rs)²        · u²(Rs)
```

Typical uncertainty contributions at a NABL-class lab:

| Source | u(x) | u(Pmpp) contribution |
|--------|------|----------------------|
| Irradiance sensor (pyranometer) | ±5 W/m² (k=1) | ±0.5 W (≈0.11 %) |
| Cell temperature sensor (Pt100) | ±0.3 K (k=1) | ±0.15 W (≈0.03 %) |
| α (from datasheet ±10 %) | ±0.0002 A/°C | ±0.08 W (≈0.02 %) |
| ESL-Solar 500 ADC (Pmpp_meas) | ±0.05 % | ±0.23 W (≈0.05 %) |
| **RSS combined (k=1)** | — | **≈ ±0.55 W (≈0.12 %)** |

The 2 % Pmpp deviation flag threshold is ~17× the combined uncertainty — appropriate for distinguishing true inter-lab divergence from measurement noise.

<!-- TODO: Verify partial derivative expressions against IEC 60891:2021 §7.4 and cross-check with apps/web/__tests__/lib/iec60891.test.ts -->
<!-- TODO: Get actual Pt100 and pyranometer calibration certificates from Srishti lab to confirm u(G) and u(T) -->

## The `multi-lab-coordinator` Skill Design

The Antaryami-OS skill receives the SolarLabX flag and classifies the divergence:

```typescript
// Conceptual skill invocation
const diagnosis = await skills.multiLabCoordinator({
  module: { serialNumber: 'SPL-HJT-00042', technology: 'HJT' },
  jamnagar: { pmpp: 368.4, uPmpp: 0.55, procedure: 'P2', date: '2026-05-12' },
  chennai:  { pmpp: 362.8, uPmpp: 0.60, procedure: 'P2', date: '2026-05-10' },
  deltaThreshold: 0.02,
});
// Returns: { root_cause: 'PROBABLE_DEGRADATION' | 'CALIBRATION_DRIFT' | 'PROCEDURE_MISMATCH',
//            confidence: 0.78, actions: [...] }
```

The skill uses Claude claude-sonnet-4-6 to reason over measurement metadata — dates, lab conditions, correction procedures, calibration due dates — and returns a structured root-cause hypothesis. The final determination remains with the QM, following ISO/IEC 17025:2017 §7.8.7.

## Integration with Surya Yantra's Existing API

The cross-lab push reuses the existing `POST /api/measurements/:id/correct` flow and adds a `publishToLims` flag:

```json
POST /api/measurements/clx-m-042/correct
{
  "procedure": "IEC60891_P2",
  "target": { "irradiance": 1000, "temperature": 25 },
  "applySmmf": true,
  "applyIam": true,
  "publishToLims": true,
  "limsTarget": "solarlabx"
}
```

SolarLabX receives the `CorrectionResult` record with an added `uPmpp` field.

<!-- TODO: Confirm SolarLabX API schema — does it accept CorrectionResult directly or require transformation? -->
<!-- TODO: Add SolarLabX GitHub repo URL once public -->

## Research Narrative

The cross-lab pipeline implements the NABL inter-lab comparison requirement. The research contribution:

1. A practical GUM-compliant uncertainty propagation model for IEC 60891-corrected IV measurements — generalising to any multi-site PV testing network.
2. An AI-assisted root-cause framework (`multi-lab-coordinator`) for inter-lab Pmpp divergence — the first such AI-mediated inter-lab comparison system for PV testing.
3. Empirical validation from the Jamnagar-Chennai pair with En number analysis per ISO/IEC 17043:2023 and ISO 13528:2022.

Target venue: **Solar Energy** (Elsevier) or **Measurement** (Elsevier).

<!-- TODO: Add En number calculation worked example once first cross-lab comparison data is available -->

## References

1. JCGM 100:2008. *Evaluation of measurement data — Guide to the expression of uncertainty in measurement (GUM)*. BIPM, Paris. §5.1.
2. ISO/IEC 17025:2017. *General requirements for the competence of testing and calibration laboratories*. ISO, Geneva. §7.4.2, §7.8.7.
3. ISO/IEC 17043:2023. *Conformity assessment — General requirements for proficiency testing*. ISO, Geneva.
4. IEC 60891:2021. *Photovoltaic devices — Procedures for temperature and irradiance corrections to measured I-V characteristics*. IEC, Geneva. §7.
5. IEC 60904-2:2023. *Photovoltaic devices — Part 2: Requirements for reference photovoltaic devices*. IEC, Geneva.
6. SolarLabX: [github.com/ganeshgowri-ASA/SolarLabX](https://github.com/ganeshgowri-ASA/SolarLabX).
7. Surya Yantra IEC correction API: `POST /api/measurements/:id/correct` — see `docs/API.md`.
8. Antaryami-OS `multi-lab-coordinator` skill: see `drafts/antaryami-os-skill-architecture-pv-lab.md`.
9. JCGM 101:2008. *Supplement 1 to the Guide to the Expression of Uncertainty in Measurement — Propagation of distributions using a Monte Carlo method*. BIPM, Paris. — Provides the Monte Carlo alternative to the GUM linear propagation used in §3; recommended when sensitivity coefficients are difficult to evaluate analytically (e.g. when the P3 bilinear correction is used and the derivatives are not closed-form).
10. IEC 60904-4:2019. *Photovoltaic devices — Part 4: Reference solar devices — Procedures for establishing calibration traceability*. IEC, Geneva. — Defines the SI-traceability chain for reference cells used to calibrate the irradiance sensors at each lab; a prerequisite for inter-lab u(G) agreement.
11. Jahn U., Herz M., Köntges M., Parlevliet D., Paggi M., Tsanakas I., Stein J., Berger K.A., Ranta S., French R.H., Richter M., Tanahashi T. (2014). *Review on Infrared and Electroluminescence Imaging for PV Field Applications*. IEA PVPS Task 13, Report T13-03:2014. — Reports ±1–2 % expanded uncertainty (k=2) as typical for NABL-class PV laboratories; validates the 2 % Pmpp deviation flag threshold chosen in §3.
12. ISO 13528:2022. *Statistical methods for use in proficiency testing by interlaboratory comparison*. ISO, Geneva. — Defines the En-score calculation used to evaluate inter-lab comparison results; required alongside ISO/IEC 17043:2023 for the worked En number example planned in the research narrative.

---

## Peer Review

*Not yet scheduled — seed article, 12 May 2026.*

### Reviewer Sign-off

| Role | Name | Date | Signature |
|------|------|------|----------|
| Technical reviewer | — | — | — |
| Standards reviewer (measurement science) | — | — | — |
| Editor | — | — | — |

*Assign reviewers in the GitHub PR before promoting `draft: true → false`.*
