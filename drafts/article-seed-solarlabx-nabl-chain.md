---
title: "SolarLabX LIMS + Surya Yantra: Closing the Uncertainty Chain from Test Request to NABL Report"
slug: "solarlabx-nabl-uncertainty-chain"
status: "seed"
date: "2026-05-30"
lastmod: "2026-05-30"
author: "Srishti PV Lab"
affiliation: "Srishti PV Lab, Jamnagar, Gujarat, India"
target_venue: "Measurement (Elsevier) or Renewable and Sustainable Energy Reviews"
keywords:
  - solarlabx
  - LIMS
  - NABL
  - ISO-17025
  - uncertainty-budget
  - iv-curve
  - surya-yantra
  - pv-testing
  - QMS
  - audit-trail
seed_source: "SolarLabX repo (ganeshgowri-ASA/SolarLabX) — 'Unified Solar PV Lab Operations Suite | LIMS + QMS + Audit + Test Protocols + Uncertainty + AI Vision + SOP Gen + Reports'; last commit 2026-03-25, 73 open issues"
---

# SolarLabX LIMS + Surya Yantra: Closing the Uncertainty Chain from Test Request to NABL Report

## Engineering Signal

SolarLabX (`ganeshgowri-ASA/SolarLabX`, Next.js + Vercel, 73 open issues) is described
as a "Unified Solar PV Lab Operations Suite" covering LIMS, QMS, Audit, Test Protocols,
Uncertainty budgets, AI Vision, SOP generation, and Reports. Its domain is the
laboratory operations layer *above* the instrument — the layer that knows which
module is being tested, what the test order says, which calibration certificates are
current, and what the pass/fail criteria are.

Surya Yantra is the instrument-control layer *below* — it drives the hardware, applies
IEC corrections, and produces a corrected IV curve. The gap between them is a
**missing data handshake**: SolarLabX has no live feed from Surya Yantra's
`/api/measurements` endpoint, and Surya Yantra's reports lack the LIMS context
(calibration certificate IDs, test order number, customer reference) required for
a NABL-accredited test certificate.

## Research Question

> Can a lightweight REST adapter between SolarLabX's test-order lifecycle API and
> Surya Yantra's session + measurement APIs produce a complete, traceable
> ISO/IEC 17025:2017 uncertainty statement for corrected Pmpp without manual
> data entry, and what is the end-to-end latency from test request to signed PDF?

## 1. Motivation

### 1.1 The current workflow (manual)

At Srishti lab today:
1. Lab manager creates a test order in SolarLabX (module serial number, test type,
   customer reference, requested date).
2. Test engineer walks to the Surya Yantra terminal, manually enters the module slot,
   creates a session, and runs the sweep.
3. Engineer notes the corrected Pmpp and manually enters it into SolarLabX to
   complete the test record.
4. SolarLabX generates a certificate — but without the raw IV data, uncertainty
   budget, or the exact correction procedure used.

This manual bridge introduces transcription errors, loses the raw IV data, and
makes the uncertainty budget incomplete (missing: quadrature error, ESL-Solar
accuracy, reference cell calibration traceability).

### 1.2 The proposed integration

```
SolarLabX test order (module serial, test type)
          │
          │  POST /api/sessions (Surya Yantra)
          │  with SolarLabX order_id as external_ref
          ▼
Surya Yantra runs sweep + POST /api/corrections/apply
          │
          │  Webhook: POST SolarLabX/api/results
          │  payload: {corrected_curve, uncertainty_budget, procedure, env_conditions}
          ▼
SolarLabX populates test record + calibration refs
          │
          ▼
NABL-ready PDF: GET /api/reports/:id/download
  — includes: raw curve, STC curve, full GUM budget, calibration cert IDs,
              test order number, IEC standard version, procedure used
```

### 1.3 Why this matters for NABL accreditation

ISO/IEC 17025:2017 Clause 7.6 (Evaluation of measurement uncertainty) requires:
- Identification of all uncertainty sources
- Quantification of each contribution
- Combined uncertainty (RSS) and expanded uncertainty (k=2)
- Unbroken traceability chain from the result to national/international standards

The traceability chain for Surya Yantra's Pmpp result is:
```
NABL/NPL traceable calibration of SMP10 pyranometer
  → G measurement
  → IEC 60891 Isc correction
  → Pmpp
  → Test certificate
```

SolarLabX holds the calibration certificate IDs. Surya Yantra holds the measurement
data. Only their integration produces the complete chain.

## 2. Proposed Method

### 2.1 Adapter service

A lightweight Next.js API route in `apps/web/app/api/lims/route.ts` that:
1. Accepts a SolarLabX test order webhook (`POST /api/lims/order`).
2. Creates a Surya Yantra session with the specified module slot.
3. After the sweep completes, posts the result back to SolarLabX.
4. Includes the full GUM uncertainty budget as a JSON attachment.

### 2.2 Uncertainty budget automation

`POST /api/corrections/apply` is extended to return an `uncertainty_budget` object
alongside the corrected curve:

```json
{
  "corrected_pmpp_W": 450.2,
  "uncertainty_budget": {
    "u_eload_pct": 0.06,
    "u_irradiance_pct": 0.50,
    "u_temperature_pct": 0.12,
    "u_procedure_pct": 0.15,
    "u_smmf_pct": 0.10,
    "u_repeatability_pct": 0.05,
    "u_combined_pct": 0.55,
    "U_expanded_pct": 1.10,
    "k": 2,
    "coverage_probability": 0.95,
    "calibration_refs": {
      "pyranometer": "NABL-CAL-2026-0041",
      "reference_cell": "IMT-CAL-2025-003"
    }
  }
}
```

### 2.3 End-to-end latency target

| Stage | Expected latency |
|-------|-----------------|
| SolarLabX order → Surya Yantra session | < 2 s |
| IV sweep (500 points, 5 s scan) | ~5 s |
| Correction pipeline | < 100 ms |
| Result webhook to SolarLabX | < 1 s |
| PDF generation (pdfkit) | < 3 s |
| **Total: test order → signed PDF** | **< 15 s** |

## 3. Engineering Contribution

| Contribution | Scope |
|---|---|
| LIMS adapter route `apps/web/app/api/lims/route.ts` | Surya Yantra |
| Extended `POST /api/corrections/apply` uncertainty_budget output | Surya Yantra |
| Calibration certificate ID fields in Prisma schema | Surya Yantra / SolarLabX |
| SolarLabX webhook handler for Surya Yantra results | SolarLabX repo |
| End-to-end integration test | Both repos |

## 4. TODO before draft

- [ ] Confirm SolarLabX test order API endpoints (schema, auth)
- [ ] Prototype the adapter route locally against a mock SolarLabX webhook
- [ ] Validate the latency model against a real 500-point sweep on the lab hardware
- [ ] Get calibration certificate ID format from SolarLabX's LIMS schema
- [ ] Review NABL 141 guidelines for digital traceability chains

## References (seed)

1. ISO/IEC 17025:2017. *General requirements for the competence of testing and
   calibration laboratories*. ISO, Geneva.
2. JCGM 100:2008 (GUM). *Evaluation of measurement data — Guide to the Expression
   of Uncertainty in Measurement*. BIPM, Sèvres.
3. NABL 141 (2018). *Guidelines for Estimation and Expression of Uncertainty in
   Measurement*. National Accreditation Board for Testing and Calibration Labs, India.
4. IEC 60891:2021. *Photovoltaic devices — Procedures for temperature and irradiance
   corrections to measured I-V characteristics*. IEC, Geneva.
5. IEC 60904-1:2020. *Photovoltaic devices — Part 1: Measurement of photovoltaic
   current-voltage characteristics*. IEC, Geneva.
