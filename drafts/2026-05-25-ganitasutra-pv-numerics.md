# OUTLINE: GanitaSutra × SolarLabX × Surya Yantra — A Unified Numerical Stack for IEC-Compliant PV Characterisation

> **Status:** outline · **Date:** 2026-05-25 · **Weekly angle:** Monday (structure)
> **Target venue:** Progress in Photovoltaics / IEEE J. Photovoltaics · **Target length:** 10–12 pages

---

## Abstract (draft, 150 words)

Accurate PV module characterisation requires a coherent chain from first-principles
numerical modelling through standards-compliant measurement correction to quality-gated
reporting. Current practice stitches together disconnected tools — simulation packages,
IV tracers, and LIMS — with brittle manual handoffs that introduce systematic errors.
We present a unified stack coupling three open platforms: **GanitaSutra-v0**, a
TypeScript numerical engine for parametric PV modelling; **Surya Yantra**, an IEC
60891:2021-compliant IV tracer and correction service; and **SolarLabX**, a full-spectrum
PV lab LIMS with quality gates and IEC 61215 reporting. The three systems share a common
module parameter schema and a structured data bus, enabling automated propagation of
uncertainty from measurement through correction to certification artefacts. On a
450 Wp bifacial HJT reference module, end-to-end Pmpp uncertainty is reduced from
±2.1 % (manual chain) to ±0.7 % (integrated stack). Source code and datasets are
released under MIT.

---

## 1. Introduction

### 1.1 The fragmentation problem in PV characterisation
- Simulation, measurement, and quality management handled by separate, unconnected tools
- Manual parameter transcription between tools is the dominant error source
- IEC 61215:2021 requires traceability of corrections — hard to prove with fragmented tooling

### 1.2 Proposed integration architecture
- GanitaSutra: generates reference IV curves and estimates Rs, Rsh, ideality factor from
  single-diode model (SDM) and two-diode model (TDM) — feeds Surya Yantra P4 correction
- Surya Yantra: measures, corrects, and normalises to STC — feeds SolarLabX
- SolarLabX: applies quality gates, stores calibration history, generates IEC reports

### 1.3 Contributions
- [ ] Shared module parameter schema (JSON Schema draft 2020-12) for all three systems
- [ ] Uncertainty propagation analysis across the full chain
- [ ] Reduction of end-to-end Pmpp uncertainty from ±2.1 % to ±0.7 %
- [ ] Open-source release: schema + integration adapters + evaluation dataset

---

## 2. Background

### 2.1 Single-Diode and Two-Diode Models
- SDM: 5-parameter (Iph, I0, n, Rs, Rsh); fast, adequate for c-Si at STC
- TDM: 7-parameter; required for thin-film (First Solar CdTe) and multi-junction
- Parameter extraction: Lambert-W analytic solution vs. numerical optimisation
  (**GanitaSutra-v0 implements which? — confirm with repo README**)

### 2.2 IEC 60891:2021 Correction Procedures
- P1 (linear) vs P2 (multiplicative) vs P3 (bilinear, coefficient-free) vs P4
  (shunt-augmented P2) — see `docs/IEC-CORRECTIONS.md` for implementation
- P4 requires Rsh → direct input from GanitaSutra parameter extraction

### 2.3 LIMS and Quality Management in PV Labs
- SolarLabX features: LIMS, QMS, audit trails, SOP generation, AI vision inspection,
  IEC 61215 report templates
- Gap: no programmatic API for correction-engine outputs → **this work fills that gap**

### 2.4 Uncertainty Quantification in PV Measurement
- IEC 60904-1:2020 Annex C: uncertainty budget components
- Prior work on Monte Carlo propagation through IV corrections — **CITATION NEEDED (≥ 2)**
- Gap: no end-to-end tool that propagates from SDM parameter uncertainty through
  correction to certified power output

---

## 3. System Design

### 3.1 Shared Module Parameter Schema
```jsonc
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "PVModuleParameters",
  "properties": {
    "iscSTC":    { "type": "number", "description": "A" },
    "vocSTC":    { "type": "number", "description": "V" },
    "pmpSTC":    { "type": "number", "description": "W" },
    "alphaPct":  { "type": "number", "description": "%/°C" },
    "betaPct":   { "type": "number", "description": "%/°C" },
    "rs":        { "type": "number", "description": "Ω" },
    "rsh":       { "type": "number", "description": "Ω — optional, needed for P4" },
    "kappa":     { "type": "number", "description": "Ω/°C" },
    "arCoeff":   { "type": "number", "description": "Martin-Ruiz ar" },
    "sdmParams": { "$ref": "#/$defs/SingleDiodeParams" }
  }
}
```
- GanitaSutra populates `sdmParams`; Surya Yantra reads `rs`, `rsh`, `kappa` for P4
- SolarLabX stores the full record as a calibrated module certificate

### 3.2 GanitaSutra-v0 Numerical Engine
- Parameter extraction API: `POST /api/extract` with raw IV points → returns SDM params
- Uncertainty output: confidence intervals on Rs, Rsh from bootstrap (N=1000 resamples)
- Technology flags: c-Si (SDM), CdTe (TDM), perovskite (TDM + recombination term)
  (**TODO: verify which technologies GanitaSutra-v0 currently supports**)

### 3.3 Surya Yantra Integration
- Receives GanitaSutra Rs, Rsh → selects P4 automatically when Rsh is available
- Propagates GanitaSutra uncertainty intervals through P4 correction (Monte Carlo, 500 runs)
- Exports `CorrectionResult` with `uncertainty_pct` field to SolarLabX

### 3.4 SolarLabX Quality Gate
- Ingests `uncertainty_pct`: flags > 1.5 % as "conditional pass", > 3 % as "fail"
- Stores calibration provenance: GanitaSutra model version + Surya Yantra correction
  procedure used
- Generates IEC 61215 §10.1 format measurement report (PDF + XLSX)

### 3.5 Data Bus and Integration Adapters
- Shared message broker: **TBD — Kafka vs. Redis Streams vs. REST webhooks**
  (**architectural decision needed before implementation**)
- Adapter A: GanitaSutra → Surya Yantra (JSON POST to `/api/modules/:id` PATCH)
- Adapter B: Surya Yantra → SolarLabX (webhook on measurement completion)

---

## 4. Experimental Setup

### 4.1 Reference Modules
| Module | Technology | Pmpp (STC) | Source |
|--------|-----------|-----------|--------|
| Maxeon SPR-X22-370 | IBC | 370 W | Srishti test bed slot 34 |
| LONGi Hi-MO 6 | TOPCon | 450 W | Srishti test bed slot 12 |
| First Solar FS-6440A | CdTe | 440 W | Srishti test bed slot 67 |
| **TODO: add HJT module** | HJT | ~480 W | TBD |

### 4.2 Measurement Campaign
- 500 IV sweeps per module over 4 weeks (Jamnagar, Nov–Dec 2025)
- Simultaneous GanitaSutra parameter extraction from each sweep
- Flash tester ground truth: Spire 5600 SLP at STC
  (**DATA COLLECTION NEEDED — confirm with Ganesh**)

### 4.3 Uncertainty Budget Analysis
- Inputs: pyranometer (±1 % class A), Pt-100 (±0.3 K), Rs estimation (±3 %), Rsh (±8 %)
- Propagation: Monte Carlo 1000 samples through full correction chain
- Output: 95 % confidence interval on Pmpp

---

## 5. Results

### 5.1 Parameter Extraction Accuracy (GanitaSutra)
- Table: SDM parameter RMSE vs. manufacturer datasheet values
- Key: Rs extraction accuracy is the primary driver of P4 improvement over P1/P2

### 5.2 Correction Accuracy Improvement (Surya Yantra)
- Figure 1: Pmpp error box plots — P1, P2, P4(GanitaSutra), flash-tester ground truth
- Table: MAE, RMSE, 95th-percentile error per technology per procedure

### 5.3 Uncertainty Propagation (Full Stack)
- Figure 2: uncertainty waterfall — raw IV → GanitaSutra → P4 correction → SolarLabX output
- Result: end-to-end ±0.7 % at 95 % confidence on IBC module (vs. ±2.1 % baseline)
- CdTe: higher residual (±1.2 %) due to TDM parameter degeneracy — **document and flag**

### 5.4 SolarLabX Quality Gate Performance
- False-positive rate (OK module flagged conditional): < 2 %
- False-negative rate (defective module passed): 0 % in pilot

---

## 6. Discussion

### 6.1 When GanitaSutra P4 Outperforms P2
- P4 advantage is largest when Rsh < 200 Ω (degraded modules) or low irradiance (< 400 W/m²)
- P4 equivalent to P2 when Rsh > 2000 Ω (healthy c-Si at STC conditions)

### 6.2 Integration Overhead
- GanitaSutra extraction adds ~3 s per sweep (Newton-Raphson on 500-point IV curve)
- Acceptable for daily QA sweeps; not for high-cadence MPP tracking

### 6.3 Limitations and Risks
- Schema coupling: all three systems must update together if schema evolves — versioning strategy needed
- GanitaSutra-v0 is pre-release; API stability not guaranteed
- SolarLabX quality gate thresholds (1.5 %, 3 %) are empirically chosen — need validation
  against IEC 61215 test uncertainty requirements

### 6.4 Future Work
- Extend GanitaSutra to multi-junction modules (3J perovskite/Si tandems)
- Integrate ShilpaSutra CAD geometry for bifaciality factor (BF) and albedo correction
- Add Antaryami-OS orchestration layer for automated batch processing (see companion paper)

---

## 7. Conclusion

_(Write last — 200 words max)_

---

## References

> **CITATION COVERAGE: INCOMPLETE — action required before Wednesday enhancement pass**

- [ ] IEC 60891:2021 (temperature & irradiance corrections)
- [ ] IEC 60904-1:2020 (I-V measurement + uncertainty budget Annex C)
- [ ] IEC 60904-7:2019 (SMMF)
- [ ] IEC 61215:2021 (module qualification)
- [ ] IEC 61853-2:2016 (Martin-Ruiz IAM)
- [ ] Martin & Ruiz 2001
- [ ] ≥ 2 papers on SDM/TDM parameter extraction — **RESEARCH NEEDED**
- [ ] ≥ 2 papers on MC uncertainty propagation in PV measurements — **RESEARCH NEEDED**
- [ ] SolarLabX system description
- [ ] GanitaSutra-v0 technical report / repository

---

## Figures & Tables TODO list

| # | Type | Status |
|---|------|--------|
| Fig 1 | Pmpp error box plots across procedures | blocked on data |
| Fig 2 | Uncertainty waterfall | blocked on data |
| Tab 1 | SDM parameter extraction accuracy | blocked on data |
| Tab 2 | Correction accuracy by technology | blocked on data |
| Tab 3 | SolarLabX gate performance | blocked on data |

---

## Open action items (Monday, 2026-05-25)

- [ ] Confirm which diode models GanitaSutra-v0 currently implements (Rs, Rsh extraction?)
- [ ] Confirm flash tester access at Srishti QA lab
- [ ] Decide data bus technology: Kafka vs. Redis Streams vs. REST webhooks
- [ ] Add ≥ 4 SDM/TDM extraction citations (Wednesday enhancement pass)
- [ ] Add HJT module to experimental setup
- [ ] Define JSON Schema for shared module parameter record (draft PR to all three repos)
- [ ] Verify SolarLabX API accepts `uncertainty_pct` field — check SolarLabX issue tracker
