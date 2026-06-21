---
title: "Open-Source PostgreSQL/Next.js LIMS Architecture for ISO 17025:2017-Accredited Solar PV Test Laboratories in India"
slug: open-source-lims-iso17025-nabl-pv-india
status: draft
date_created: 2026-06-21
date_modified: 2026-06-21
weekly_angle: seo/metadata
target_journal: "Accreditation and Quality Assurance (Springer) — ISSN 0949-1775"
target_doi: TBD

seo:
  meta_description: "Open-source LIMS (SolarLabX + Surya Yantra) for ISO 17025:2017-accredited solar PV test labs in India — 4-tier NPL calibration traceability chain, GUM uncertainty budget, NABL audit trail on PostgreSQL + Next.js."
  keywords:
    - "ISO 17025 LIMS solar PV India"
    - "NABL accreditation solar testing"
    - "open-source laboratory management system"
    - "solar PV calibration traceability"
    - "NPL India calibration chain"
    - "IEC 60891 LIMS"
    - "GUM uncertainty LIMS"
    - "PostgreSQL solar lab"
    - "photovoltaic test lab software open-source"
    - "Srishti PV Lab Jamnagar"
  canonical_url: TBD
  og_image: TBD
  schema_type: ScholarlyArticle

linked_repos:
  - repo: ganeshgowri-ASA/surya-yantra
    feature: 20-model PostgreSQL schema (apps/web/prisma/schema.prisma); IEC correction engine
  - repo: ganeshgowri-ASA/SolarLabX
    feature: Calibration traceability graph (lib/calibration-chain.ts + /lims/calibration-chain)
    commit: 70cedbf  # enhance(lims): calibration chain traceability graph, 2026-05-20

blockers:
  - "#163 — CorrectionResult.uExpandedPct schema field missing"
  - "#176 — GUM uncertainty budget documentation"
  - "#180 — 3 TODO citations in NABL draft"
---

## Abstract

<!-- TODO: 200-word abstract after §3 clause coverage table is reviewed -->

India’s PLI scheme for high-efficiency solar PV modules has accelerated demand for NABL-accredited PV test laboratories, yet no open-source laboratory information management system (LIMS) addresses the full ISO 17025:2017 audit scope for PV testing. This paper presents the combined architecture of **SolarLabX** and **Surya Yantra** — two open-source, PostgreSQL-backed platforms covering the ISO 17025 clause landscape: equipment calibration traceability (§6.4.6), measurement uncertainty (§7.6), method validation (§7.2), internal QC (§7.7), and test certificate issuance (§7.8). A four-tier calibration traceability graph (NMI → Reference → Working → Field) provides automated expiry alerts and lineage queries traceable to NPL India. Integrated with Surya Yantra’s IEC 60891 correction engine and GUM-S1 Monte Carlo uncertainty propagation, the combined stack addresses the last remaining obstacle to open-source NABL accreditation for smaller Indian PV labs unable to afford commercial LIMS (typically ₹8–20 lakh/year).

---

## 1. Introduction

### 1.1 Indian PV Testing Context

India’s installed solar capacity crossed 80 GW in 2026 [TODO: cite MNRE capacity update]. The Ministry of New and Renewable Energy (MNRE) PLI scheme and Bureau of Energy Efficiency (BEE) Star Label mandate BIS-certified, IEC-tested modules for grid-connected and subsidised projects [TODO: cite MNRE PLI document 2022]. Certification requires ISO 17025-accredited test results from a NABL-scoped PV laboratory.

As of mid-2026, [TODO: N] NABL-accredited laboratories hold PV testing scope under NABL 141 [TODO: query NABL online directory, date accessed 2026-06-21]. Most use proprietary LIMS at a recurring cost of ₹8–20 lakh/year — prohibitive for university or SME labs seeking initial accreditation.

### 1.2 Open-Source LIMS Gap

[TODO: prior art search — find 2–3 open-source LIMS papers; confirm none address IEC 60891/60904 specifically. Search: IEEE Xplore, Zenodo, GitHub]

### 1.3 Contributions

1. A clause-by-clause ISO 17025:2017 mapping across SolarLabX and Surya Yantra.
2. A four-tier calibration traceability graph implementation in TypeScript (SolarLabX `lib/calibration-chain.ts`).
3. A cost comparison against commercial LIMS for Indian PV labs.

---

## 2. System Architecture

### 2.1 Surya Yantra — IV Tracer and Data Acquisition

- 75-module test bed (Prisma 20-model PostgreSQL schema)
- IEC 60891:2021 P1–P4 correction engine (`lib/iec60891.ts`)
- SMMF (IEC 60904-7) and IAM Martin-Ruiz (IEC 61853-2) corrections
- Expanded uncertainty per correction result (`uExpandedPct` — issue #163)
- Signed PDF test certificates (`/api/reports`)

### 2.2 SolarLabX — LIMS and Quality Management

| Feature | ISO 17025 Clause |
|---------|------------------|
| Calibration traceability graph | §6.4.6 |
| GUM/Monte Carlo uncertainty calculator | §7.6 |
| LIMS sample management | §7.4 |
| SOP generator (Claude AI) | §7.2 |
| Internal QC control charts | §7.7 |
| Audit trail | §8.4 |
| Test certificate generator | §7.8 |

### 2.3 Integration Topology

```
┌─────────────────────────────────────────────┐
│  SolarLabX (Next.js + PostgreSQL)           │
│  LIMS · QMS · Uncertainty · Calibration     │
│  REST → surya-yantra/api/sessions/*         │
└────────────────┬───────────────────────────┘
                 │ REST + WebSocket
┌────────────────▼───────────────────────────┐
│  Surya Yantra (Next.js + PostgreSQL)        │
│  IV tracer · IEC corrections · Reports      │
│  Hardware: ESL-Solar 500 → MUX 300-relay    │
└─────────────────────────────────────────────┘
```

---

## 3. ISO 17025:2017 Clause Coverage

| ISO 17025 Clause | Requirement | SolarLabX | Surya Yantra |
|-----------------|-------------|-----------|-------------|
| §5.4 | Equipment records | Instrument registry | — |
| §6.4.6 | Calibration traceability | 4-tier graph (NPL India) | — |
| §6.5 | Metrological traceability | NPL → field link | IV curve I_sc traceability |
| §7.2 | Method validation | SOP generator | IEC 60891 P1–P4 |
| §7.4 | Handling of test items | Sample management | Module registry (75 slots) |
| §7.6 | Measurement uncertainty | GUM/MCM calculator | uExpandedPct (issue #163) |
| §7.7 | Internal QC | Shewhart charts on P_max_ref | — |
| §7.8 | Test certificates | Report generator | PDF + CSV export |
| §8.4 | Audit trail | Immutable event log | Session history |

---

## 4. Calibration Traceability Implementation

### 4.1 Data Model (`lib/calibration-chain.ts`)

```typescript
interface CalibrationNode {
  id: string;
  tier: 'NMI' | 'Reference' | 'Working' | 'Instrument';
  name: string;
  calibratedBy: string | null; // parent node id
  calibrationDate: Date;
  expiryDate: Date;
  certificateNumber: string;
  tracesTo: string;  // 'NPL India' for tier 1
}
```

### 4.2 Four-tier graph

1. **NMI** — NPL India (BIPM signatory, traceable to SI)
2. **Reference Standard** — Kipp & Zonen SMP10 pyranometer, ISO 17025-calibrated against NPL
3. **Working Standard** — IMT Solar Si-RS485TC reference cell, calibrated against Reference
4. **Field Instrument** — test pyranometer calibrated against Working Standard

### 4.3 Expiry alerting

Nodes with `expiryDate < today + 60 days` are flagged amber; expired nodes are flagged red. Both raise a SolarLabX notification and a GitHub issue in `surya-yantra` [TODO: implement via GitHub Actions on schedule].

---

## 5. GUM Uncertainty Integration

See companion article: `drafts/2026-06-21-gum-monte-carlo-pv-iec60891.md`.

The `uExpandedPct` field (issue #163) will be written by Surya Yantra to each `CorrectionResult` record and surfaced in the PDF test certificate as: *Expanded uncertainty U(P_mpp) = X.XX % (k=2, 95 % confidence, per ISO 17025 §7.6 and JCGM 100:2008)*.

---

## 6. Cost Comparison

| LIMS Option | Annual Cost (INR) | ISO 17025 Scope | IEC 60891 Native |
|-------------|-------------------|----------------|------------------|
| Labvantage (commercial) | ₹8–20 lakh | Full | No |
| LabWare (commercial) | ₹10–18 lakh | Full | No |
| Excel-based | ₹0 | Partial | Manual |
| SolarLabX + Surya Yantra (open-source) | ₹1.09 lakh/yr (cloud ops) | Full (mapped in §3) | Yes |

Cloud ops cost from `hardware/BOM.md` §8: Vercel Pro + DB + Anthropic API + Sentry = ₹1,09,100/yr.

---

## 7. Conclusion

<!-- TODO after §3 clause review and §5 uncertainty data -->

---

## References

1. ISO 17025:2017, *General requirements for the competence of testing and calibration laboratories*, ISO, Geneva.
2. NABL 141, *Criteria for Accreditation of Testing and Calibration Laboratories*, NABL, New Delhi, 2023.
3. IEC 60891:2021, *Procedures for temperature and irradiance corrections to measured I-V characteristics*, IEC, Geneva.
4. JCGM 100:2008, *Guide to the expression of uncertainty in measurement (GUM)*, BIPM/ISO, Geneva.
5. IEC 60904-7:2019, *Computation of the spectral mismatch correction for measurements of PV devices*, IEC, Geneva.
6. IEC 61853-2:2016, *PV module performance testing and energy rating — Part 2*, IEC, Geneva.
7. [TODO: MNRE PLI scheme document — PLI Scheme for High-Efficiency Solar PV Modules, mnre.gov.in, 2022]
8. [TODO: NABL-accredited PV lab count in India — query nabl.gov.in, scope NABL 141, date 2026-06-21]
9. [TODO: open-source LIMS comparison — prior art search IEEE Xplore + Google Scholar: “open-source LIMS ISO 17025”]

---

*Draft stage: Article seed (SEO/metadata pass — 2026-06-21). Next milestone: Wednesday enhancement — populate §5 uncertainty data and §6 cost comparison from live lab.*
