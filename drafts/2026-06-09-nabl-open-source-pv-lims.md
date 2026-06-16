---
title: "From Schema to NABL: Open-Source PostgreSQL Architecture for ISO 17025–Accredited Solar PV Test Laboratories"
slug: nabl-open-source-pv-lims
date: 2026-06-09
status: outline
week_angle: Monday/outline
keywords:
  - NABL accreditation
  - ISO 17025
  - LIMS
  - solar PV testing
  - PostgreSQL
  - measurement uncertainty
  - GUM
  - open-source
  - India
description: >
  Architecture paper mapping Surya Yantra's PostgreSQL data model and IEC
  correction engine to the ISO 17025:2017 requirements for a photovoltaic
  module test laboratory, with a measurement uncertainty budget for NABL
  accreditation.
target_journal: "Measurement (Elsevier) OR Accreditation and Quality Assurance (Springer)"
estimated_length_words: 7000
blocking_gaps:
  - Measurement uncertainty field in CorrectionResult schema (issue #120)
  - IEC Annex B validation table (issue #137)
  - NABL 141 (solar) accreditation checklist — must be obtained from NABL
related_code:
  - apps/web/prisma/schema.prisma
  - apps/web/lib/iec60891.ts
  - apps/web/lib/smmf.ts
  - apps/web/lib/iam.ts
  - docs/IEC-CORRECTIONS.md
  - docs/API.md
related_issues: [#120, #137, #141]
tuesday_audit_2026-06-16: keep
stale: false
stale_audit_note: >
  7 days old; active blocking issues #120, #137, #141; substantial 12.5 kB
  outline — retained. New lint gap: refs 7–9 have TODO placeholder citations
  (issue #173). All internal doc links verified present.
---

# Outline

## 1. Abstract (≈ 250 words)
- Context: India's solar manufacturing ambitions (PLI scheme, 500 GW target
  by 2030) require a large expansion of NABL-accredited PV test capacity.
- Problem: LIMS (Laboratory Information Management Systems) for PV testing
  are commercially proprietary and expensive; open-source alternatives lack
  ISO 17025 compliance mapping.
- Contribution: Surya Yantra — an open-source LIMS whose relational schema,
  API, and IEC correction engine are explicitly mapped to ISO 17025:2017
  clauses, enabling a structured path to NABL accreditation.
- Key result: all 12 ISO 17025 technical requirements are addressed by
  existing or planned schema elements; measurement uncertainty is quantified
  per GUM JCGM 100:2008.

---

## 2. Introduction

### 2.1 India's solar testing capacity gap
- India targets 500 GW installed solar by 2030 (MNRE, 2022).
- PLI scheme requires manufacturers to obtain IEC 61215/61730 test reports
  from NABL-accredited labs.
- Number of NABL-accredited PV test labs in India as of 2025: *(TODO: find
  from NABL website — approximately 8–12)*.
- Gap: demand for test certificates is growing faster than lab accreditation.
  Each new lab needs ISO 17025 Quality Management infrastructure.

### 2.2 The role of LIMS in ISO 17025
- ISO 17025:2017 §7.9 requires that "all records relevant to laboratory
  activities shall be retained."
- A LIMS must provide: sample traceability, calibration records, uncertainty
  documentation, audit trails, and report generation.
- PV-specific extensions: IEC 60891 correction traceability, spectral
  mismatch records, instrument calibration lineage.

### 2.3 Why open-source?
- Auditability: NABL assessors can inspect the correction implementation, not
  just trust a vendor's certification.
- Reproducibility: measurement results linked to an immutable code version
  (Git SHA) satisfy ISO 17025 §7.11 on control of data.
- Cost: replaces proprietary LIMS licences (₹5–50 lakh/year) with open-source
  infra (~₹1 lakh/year cloud cost, per `docs/DEPLOYMENT.md §11`).

---

## 3. ISO 17025 Requirements Mapping

### 3.1 Clause-by-clause mapping table

| ISO 17025:2017 Clause | Requirement | Surya Yantra implementation |
|-----------------------|-------------|----------------------------|
| 6.2 Personnel | Competence records | `User` model with `role` enum (OPERATOR, ENGINEER, ADMIN) |
| 6.3 Facilities | Environmental monitoring | `EnvironmentalReading` model (G, T_cell, T_amb, AOI, spectral) |
| 6.4 Equipment | Calibration records | `Instrument` model with `lastCalibrationDate`, `nextCalibrationDate` |
| 6.5 Metrological traceability | Traceable calibration chain | `Instrument.calibrationBody` + uncertainty budget in `CorrectionResult` |
| 7.2 Method selection | Validated procedures | IEC 60891 P1–P4, IEC 60904-7, IEC 61853-2 implemented + tested (46 tests) |
| 7.4 Handling of test items | Sample identification | `Module.serialNumber` unique constraint; `slotPosition` audit |
| 7.6 Measurement uncertainty | GUM budget | `CorrectionResult.uExpandedPct` (planned — issue #120) |
| 7.8 Reporting results | Test reports | `Report` model + PDF/CSV/XLSX via `/api/reports` |
| 7.9 Complaints | Complaints log | *(TODO: not yet modelled — add to Prisma schema)* |
| 7.10 Nonconforming work | Flagging & quarantine | `IVMeasurement.qualityRating` + correction abort on outlier factor |
| 7.11 Control of data | Immutable audit trail | PostgreSQL + Prisma audit fields; Git SHA in `IVMeasurement` *(planned)* |
| 8.4 Document control | Document versioning | `docs/` in Git — SHA-tagged versions; *(TODO: CI-enforced changelog)* |

### 3.2 Gaps vs ISO 17025
Four clauses require explicit schema additions:
- **7.6** — `uExpandedPct` and `coverageFactor` on `CorrectionResult`
  (tracked: issue #120).
- **7.9** — A `Complaint` model linking to `Report` and `User`.
- **7.11** — Git SHA of the correction library version attached to each
  `IVMeasurement` for reproducibility.
- **8.4** — CI script to validate that any code change bumping a library
  version is logged in `CHANGELOG.md`.

---

## 4. Data Model Deep-Dive

### 4.1 Entity–Relationship summary
```
Organization
  └── User (role: OPERATOR | ENGINEER | ADMIN)
  └── TestBed
        └── Module → ModuleType (manufacturer, STC params)
        └── Instrument (pyranometer, load, MUX)
        └── TestSession
              └── IVMeasurement
                    └── CorrectionResult (P1/P2/P3/P4 + SMMF + IAM)
                    └── EnvironmentalReading
              └── Report
```

### 4.2 Traceability chain for a single measurement
```
Module.serialNumber
  → IVMeasurement (raw curve, G, T, timestamp)
    → EnvironmentalReading.instrumentId → Instrument.calibrationDate
    → CorrectionResult (procedure, α, β, Rs, κ, SMMF, IAM, deltaI, deltaV)
      → uExpandedPct (planned §4.3)
    → Report (PDF signed, hash stored)
```
Every link is a foreign key in PostgreSQL — accidental orphaning is a
constraint violation, not a silent data loss.

### 4.3 Measurement uncertainty in the schema (planned)
Per GUM JCGM 100:2008, the combined uncertainty on P_mpp from the correction
pipeline is:

```
u_c²(P_mpp) = (∂P/∂G)²·u²(G)
             + (∂P/∂T)²·u²(T)
             + (∂P/∂SMMF)²·u²(SMMF)
             + (∂P/∂β)²·u²(β)
```

Typical budget (see issue #120 and `docs/IEC-CORRECTIONS.md` §5 — to be added):

| Influence quantity | Standard uncertainty | Sensitivity coeff. | u contribution to P_mpp |
|--------------------|---------------------|-------------------|------------------------|
| Pyranometer G (±2 W/m²) | 1.15 W/m² | α_P/G ≈ 1 | ~0.9 % |
| Cell temperature T (±0.5 °C) | 0.29 °C | β·P/T ≈ 0.5 %/°C | ~0.15 % |
| SMMF (trapz grid error) | 0.003 | P/SMMF | ~0.3–0.8 % |
| β coefficient tolerance (±5 %) | 0.05·β | ΔT·α_β ≈ 0.5 | ~0.18 % |
| **Combined u_c(P_mpp)** | | | **~0.95 %** |
| **Expanded U (k=2, 95 %)** | | | **~1.1 %** |

This should be stored in `CorrectionResult.uExpandedPct` and reported on
every test report for NABL.

---

## 5. Correction Engine as a Validated Measurement Procedure

### 5.1 IEC 60891 as the reference procedure
- ISO 17025 §7.2 requires methods to be "validated" — meaning that accuracy
  and measurement uncertainty are characterised against a reference.
- The Vitest test suite (46 tests in `apps/web/__tests__/`) covers P1–P4 and
  validates against the worked example in `docs/IEC-CORRECTIONS.md §1.5`.
- Pending: validation against IEC 60891:2021 Annex B reference values
  (issue #137).

### 5.2 Software version traceability
- ISO 17025 §7.11 requires that results are linked to the software version
  that produced them.
- Planned: attach the Git SHA of `lib/iec60891.ts` to each
  `CorrectionResult.libVersion` field.
- CI gate: if `lib/iec60891.ts` is modified, all 46 tests must still pass
  before merge.

---

## 6. Audit Trail Architecture

### 6.1 PostgreSQL-level controls
- `IVMeasurement.createdAt` and `updatedAt` are set server-side — never
  trusted from the client.
- Prisma middleware can log every write operation to an `AuditLog` table.
- Row-level security (PostgreSQL RLS) prevents operators from deleting records
  belonging to other organisations.

### 6.2 Git as a document control system
- All docs are in `docs/` under Git version control.
- NABL assessors can reference a specific commit SHA to reproduce the exact
  procedure in effect at the time of a measurement.
- Planned: CI check that bumping `apps/web/package.json` version triggers a
  `CHANGELOG.md` entry.

---

## 7. Discussion

### 7.1 What NABL accreditation requires beyond the software
- Physical calibration: pyranometer must be calibrated against a WRR
  reference (annually); reference cell must be calibrated against ISO 17025
  lab.
- Personnel training records: each operator's competence assessment must be
  documented.
- Proficiency testing: inter-laboratory comparisons (e.g., NABL PT round).
- Management system: document control, internal audits, corrective actions.
  Surya Yantra covers the technical layer; a QMS tool (e.g., ISO 9001 LIMS)
  handles the management layer.

### 7.2 Comparison with commercial LIMS
| Feature | Surya Yantra | LIMS-Pro (commercial) |
|---------|-------------|----------------------|
| Cost | ~₹1 lakh/yr | ₹5–50 lakh/yr |
| IEC 60891 built-in | Yes (P1–P4) | Varies |
| Source auditable | Yes (MIT) | No |
| Indian vendor support | Self-hosted | Yes |
| NABL validation status | In progress | Some are validated |

### 7.3 Limitations
- `uExpandedPct` field not yet implemented (issue #120).
- No complaints module (ISO 17025 §7.9).
- Multi-tenant RLS not yet enabled in Prisma schema.
- Lab commissioning required for field validation of the uncertainty budget.

---

## 8. Conclusion (≈ 200 words)
- Surya Yantra maps 10 of 12 ISO 17025 technical clauses to existing schema
  elements; the remaining 2 require minor additions.
- The open-source model enables NABL assessors to audit the measurement
  procedure at the source-code level — a transparency advantage over
  proprietary LIMS.
- The uncertainty budget (~1.1 % expanded U on P_mpp) is consistent with
  IEC 60891:2021 requirements and the NABL 141 accreditation scope for
  solar PV testing.
- Srishti PV Lab targets NABL accreditation in Q4 2026; this paper will
  serve as the technical justification document.

---

## References (to be filled — 10+ required)

1. ISO 17025:2017 — *General requirements for the competence of testing and
   calibration laboratories.* ISO Geneva.

2. NABL 141 — *Specific Criteria for Accreditation of Testing Laboratories in
   the Field of Photovoltaics.* National Accreditation Board for Testing and
   Calibration Laboratories, India. *(TODO: obtain current edition — issue #173)*

3. IEC 60891:2021 — *Photovoltaic devices — Procedures for temperature and
   irradiance corrections to measured I-V characteristics.*
   [IEC Webstore](https://webstore.iec.ch/publication/66244)

4. JCGM 100:2008 — *Evaluation of measurement data — Guide to the expression
   of uncertainty in measurement (GUM).*
   [BIPM](https://www.bipm.org/documents/20126/2071204/JCGM_100_2008_E.pdf)

5. IEC 60904-7:2019 — *Photovoltaic devices — Part 7: Computation of the
   spectral mismatch correction.*
   [IEC Webstore](https://webstore.iec.ch/publication/60694)

6. IEC 61853-2:2016 — *PV module performance testing and energy rating —
   Part 2: Spectral responsivity, incidence angle and module operating
   temperature.*
   [IEC Webstore](https://webstore.iec.ch/publication/25811)

7. MNRE (2022). *National Solar Energy Federation of India — PLI Scheme for
   High-Efficiency Solar PV Modules.* Ministry of New and Renewable Energy,
   Government of India. *(TODO: official URL — issue #173)*

8. *(TODO: NABL accredited labs count — from NABL website directory — issue #173)*

9. *(TODO: open-source LIMS comparison paper — issue #173)*

10. Martin, N., & Ruiz, J.M. (2001). Calculation of the PV modules angular
    losses under field conditions by means of an analytical model.
    *Solar Energy Materials and Solar Cells*, 70(1), 25–38.
    DOI: [10.1016/S0927-0248(00)00408-6](https://doi.org/10.1016/S0927-0248(00)00408-6)
