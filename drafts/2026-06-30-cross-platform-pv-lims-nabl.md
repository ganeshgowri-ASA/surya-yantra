# Open-Source LIMS for ISO 17025–Accredited Solar PV Laboratories: Linking NABL Traceability to Automated IV Testing

**Status**: seed — Tuesday 2026-06-30
**Target venue**: Measurement (Elsevier) / MDPI Applied Sciences
**Linked engineering work**: GanitaSutra-v0 (GUM uncertainty engine, ABCD power-flow), SolarLabX (ISO 17025 LIMS, audit trail, NABL compliance), Surya Yantra (IEC-compliant IV correction engine)

---

## Abstract (draft)

Achieving NABL accreditation for a solar PV test laboratory under ISO 17025:2017
requires traceability of every measurement to national standards, a documented
uncertainty budget per IEC/ISO GUM, and a laboratory information management system
(LIMS) that preserves audit trails. Commercial LIMS solutions are expensive and
not purpose-built for PV module testing. We present an open-source stack combining
three interdependent projects — SolarLabX (LIMS/QMS), GanitaSutra-v0 (uncertainty
and electrical computation library), and Surya Yantra (automated IV curve tracer) —
that together address the full ISO 17025 pipeline for a 75-module PV test bed.

---

## Outline

### 1. Introduction
- ISO 17025:2017 requirements for PV test laboratories
- NABL 141 technical criteria: traceability, uncertainty, calibration, records
- Gap: no open-source LIMS covers the PV module testing workflow end-to-end
- Contribution: three-project open-source stack

### 2. Architecture Overview

```
┌─────────────────┐   measurements   ┌──────────────────┐
│  Surya Yantra   │ ──────────────►  │  SolarLabX LIMS  │
│  IV Tracer      │                  │  ISO 17025 audit │
└─────────────────┘                  └───────┬──────────┘
        │                                    │
        │ IEC 60891 corrections              │ uncertainty calc
        ▼                                    ▼
┌─────────────────┐              ┌────────────────────────┐
│ GanitaSutra-v0  │              │ GanitaSutra-v0         │
│ iec60891.ts     │              │ uncertainty.ts / GUM   │
└─────────────────┘              └────────────────────────┘
```

### 3. Measurement Traceability Chain
- Reference pyranometer (Kipp & Zonen SMP10, ISO 17025 calibrated)
- Reference cell (IMT Si-RS485TC-T-MB, traceable to PTB)
- GanitaSutra-v0 GUM uncertainty propagation through IEC 60891 P1 corrections
- Combined standard uncertainty for Pmax, Isc, Voc at STC

### 4. IEC 60891 Corrections and Uncertainty Budget (TODO — expand)
- GanitaSutra-v0 `uncertainty.ts`: `calculateTypeA`, `calculateTypeB`, `combineUncertainties`
- Input uncertainties: α ± 0.1 %, G ± 1.5 %, T ± 0.5 K
- Propagation through P1: partial derivatives of I2, V2 w.r.t. each input
- Expanded uncertainty U_Pmax (k=2, 95 % confidence)

### 5. LIMS Features (SolarLabX)
- Sample tracking: module ingest → test assignment → result archive
- Audit trail: ISO 17025 §7.11 records management, immutable log
- CAR workflow: corrective action requests per NABL quality manual
- Document control: test procedures, calibration certificates, SOP generation (Claude AI)

### 6. Calibration Management
- Instrument calibration schedule: pyranometers (2-year cycle), Keysight 34465A (1-year)
- `lib/uncertainty.ts` getCoverageFactor() for t-table interpolation
- Calibration certificate ingestion and traceability link to measurements

### 7. NABL Accreditation Mapping
- ISO 17025:2017 clause-by-clause mapping to open-source features
- NABL 141 specific requirements vs implementation status
- Gap analysis: what still requires manual / proprietary tooling

### 8. Case Study: Srishti PV Lab (TODO — field data needed)
- 75-module test campaign: workflow, timing, uncertainty results
- Comparison with commercial LIMS (Labvantage, LabWare) on feature coverage and cost

### 9. Conclusion
- Open-source stack provides ~70 % of NABL 141 technical requirements
- Remaining gaps: e-signature (CFR 21 Part 11 equivalent), proficiency testing registry
- Roadmap: Surya Yantra ↔ SolarLabX API integration via shared PostgreSQL schema

---

## References (seed — expand for submission)

1. ISO/IEC 17025:2017, *General requirements for the competence of testing and calibration laboratories*.
2. NABL 141, *Specific criteria for accreditation of photovoltaic test laboratories* (2023).
3. JCGM 100:2008 (GUM), *Evaluation of measurement data — Guide to the expression of uncertainty in measurement*.
4. IEC 60891:2021, *Temperature and irradiance corrections to I-V characteristics*.
5. IEC 60904-1:2020, *I-V measurement of photovoltaic devices*.
6. Martin N., Ruiz J.M., *IAM analytical model*, Solar Energy Materials 70 (2001).
7. SolarLabX repository — `lib/uncertainty.ts`, `lib/iec60891.ts` (ganeshgowri-ASA, 2026).
8. GanitaSutra-v0 repository — `lib/power/transmission-lines.ts` (ganeshgowri-ASA, 2026).

---

## Content gaps / blocking issues

- [ ] **Field uncertainty data** — real Pmax expanded uncertainty from Srishti lab campaign
- [ ] **Calibration certificates** — anonymised example to illustrate traceability chain
- [ ] **NABL 141 clause mapping table** — full clause-by-clause status (stub in §7)
- [ ] **Architecture diagram** — figure with alt-text (needed for journal submission)
- [ ] Elsevier Measurement author guidelines: word limit, figure count
