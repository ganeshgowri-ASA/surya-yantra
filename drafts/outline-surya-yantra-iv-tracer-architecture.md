# OUTLINE — Surya Yantra: Open-Source IV Curve Tracer Architecture for IEC-Compliant PV Module Testing

**Status:** outline  
**Created:** 2026-05-05  
**Target:** Solar Energy Materials and Solar Cells / IEEE PVSC proceedings  
**Audience:** PV test engineers, LCOE researchers, open-source hardware community

---

## Abstract (draft)

Surya Yantra is an open-source, full-stack PV module testing platform combining
a 300 V / 27 A electronic load (ESL-Solar 500) with a 75-module, 300-relay MUX
matrix, 4-wire Kelvin sensing, and a web/desktop application stack that
implements the complete IEC 60891:2021 correction pipeline (Procedures 1–4),
spectral mismatch factor (IEC 60904-7), and incidence-angle modifier
(IEC 61853-2 Martin-Ruiz model). This paper describes the system architecture,
the IEC algorithm implementations, real-field validation data from Srishti PV
Lab (Jamnagar, 22.47 °N), and a cost analysis showing sub-₹40 lakh CAPEX for a
75-slot test bed — roughly 60 % below comparable commercial systems.

---

## 1. Introduction

- [ ] Motivation: large-scale module qualification bottleneck in India
- [ ] State of commercial IV tracers (cost, vendor lock-in)
- [ ] Gap: no fully open-source IEC 60891:2021-compliant tracer in literature
- [ ] Contribution statement: hardware + firmware + software, all MIT-licensed

**Key references to gather:**
- IEC 60891:2021 (primary standard)
- Chegaar et al. 2013 (P1 vs P2 comparative accuracy)
- Virtuani et al. 2015 (translation uncertainty)
- NREL best practices report on IV tracing

---

## 2. System Architecture

### 2.1 Hardware Layer
- [ ] ESL-Solar 500 specs + SCPI command set
- [ ] 300-relay MUX matrix design (STM32H7 + MCP23017 I²C chain)
- [ ] 4-wire Kelvin sensing — voltage error analysis
- [ ] Environmental sensor suite (pyranometer, reference cell, Pt-100, spectroradiometer)

### 2.2 Software Stack
- [ ] Next.js 14 + Prisma + PostgreSQL data model (20 entities)
- [ ] Real-time IV curve streaming via Socket.IO
- [ ] Electron desktop shell for air-gapped labs
- [ ] AI diagnostics layer (Claude API)

**Figure placeholders:**
- Fig 1: System block diagram (ASCII → SVG needed)
- Fig 2: MUX relay matrix schematic
- Fig 3: Software architecture diagram

---

## 3. IEC Correction Engine

### 3.1 IEC 60891:2021 Procedures 1–4
- [ ] Algorithm derivation (linearisation assumptions for P1/P2)
- [ ] When to use P3 (two reference curves, unknown coefficients)
- [ ] P4 shunt-resistance extension for thin-film CdTe
- [ ] Implementation validation against worked example (§1.5 of IEC-CORRECTIONS.md)

### 3.2 Spectral Mismatch Factor (IEC 60904-7)
- [ ] Grid-harmonisation and trapezoidal integration approach
- [ ] SMMF ranges observed at Jamnagar site

### 3.3 IAM — Martin-Ruiz Model (IEC 61853-2)
- [ ] Beam/diffuse/albedo decomposition
- [ ] Sensitivity of ar coefficient on energy yield estimate

**Figure placeholders:**
- Fig 4: P1 vs P2 STC power error over ΔG range
- Fig 5: SMMF distribution for CdTe vs c-Si, Jamnagar monsoon data

---

## 4. Validation

- [ ] 450 Wp bifacial reference module comparison (Table: Measured vs P1 vs P2)
- [ ] Round-robin comparison with Keysight 34465A reference measurements
- [ ] Repeatability: 5 consecutive sweeps, σ(Pmpp)
- [ ] Uncertainty budget (per IEC 60904-1 Annex D)

---

## 5. Cost Analysis

- [ ] CAPEX breakdown vs commercial alternatives (SPIRE, Sinton, Halm)
- [ ] India-specific sourcing notes (lead times, GST impact)
- [ ] OPEX model (Vercel + Anthropic + Sentry)

---

## 6. Discussion

- [ ] Limitations: no indoor flash capability; manual calibration of Rs/κ
- [ ] Roadmap: SCPI driver package, Modbus firmware, HF Space demo

---

## 7. Conclusion

- [ ] Summary of contributions
- [ ] Repository and live demo URLs

---

## References (to populate)

1. IEC 60891:2021
2. IEC 60904-1:2020, IEC 60904-3:2019, IEC 60904-7:2019
3. IEC 61215:2021, IEC 61853-1/2/3
4. Martin & Ruiz (2001) — IAM model original paper
5. To add: ≥5 peer-reviewed validation studies
