---
title: "A Unified Open-Source Solar PV Lab Automation Ecosystem: Architecture, Integration, and Research Pathways"
slug: "unified-solar-pv-lab-automation-ecosystem"
date: "2026-06-14"
status: outline
weekly_angle: roadmap
seeded_from: "All four sibling repos pushed 2026-06-13 — antaryami-os, GanitaSutra-v0, ShilpaSutra, SolarLabX"
description: >
  Architectural overview of the six-repository Srishti PV Lab open-source
  ecosystem and how Surya Yantra's IV tracing and IEC correction engine
  connects to laboratory information management, AI orchestration, symbolic
  computation, and CAD/CFD tooling to form a unified, end-to-end solar PV
  characterisation platform.
keywords:
  - solar PV lab automation
  - open source LIMS
  - IEC 60891 IV curve
  - multi-agent AI solar
  - ShilpaSutra AI CAD
  - GanitaSutra symbolic computation
  - antaryami-os enterprise AI
  - SolarLabX LIMS QMS
  - NABL ISO 17025
  - pv-pranali LangGraph
  - Srishti PV Lab Jamnagar India
target_venue: "Solar Energy (Elsevier) or Renewable and Sustainable Energy Reviews"
og_image: ""
canonical_url: ""
reading_time_minutes: 14
---

# A Unified Open-Source Solar PV Lab Automation Ecosystem

> **Article seed** — triggered by simultaneous 2026-06-13 push activity across
> antaryami-os, GanitaSutra-v0, ShilpaSutra, and SolarLabX.
> Status: OUTLINE — integration sections need live API contract verification.

---

## 1. Abstract (TODO — ≤ 250 words)

Solar photovoltaic test laboratories require tight integration between
hardware control, measurement correction, quality management, and AI-assisted
diagnostics. Commercial solutions (Spire, Sinton, PV Evolution Labs) are
expensive and proprietary. This paper describes an open-source ecosystem
of six web applications built for the Srishti PV Lab, Jamnagar, India,
as a reference architecture for affordable, IEC-compliant PV characterisation.

The ecosystem centres on **Surya Yantra** (IV curve tracer, IEC 60891:2021
P1–P4 correction engine, Vercel web app + Electron desktop), extending to
**SolarLabX** (LIMS + QMS + GUM uncertainty + AI vision), **antaryami-os**
(enterprise AI OS with event bus), **GanitaSutra** (MATLAB-inspired
computation platform with ABCD power systems and SimuFlow), **ShilpaSutra**
(text/multimodal to CAD + CFD), and **pv-pranali** (multi-agent LangGraph +
MCP orchestration layer). All components are TypeScript/Next.js on Vercel
with PostgreSQL/Prisma backends.

---

## 2. Introduction

### 2.1 Motivation

IEC 61215:2021 module design qualification and IEC 60891:2021 correction
procedures require lab software that is traceable, auditable, and integrable
with NABL ISO/IEC 17025 quality management systems. The cost of proprietary
lab management software (often $20,000–$100,000/year) is prohibitive for
research-scale labs in India.

### 2.2 Scope

This paper covers the architecture of the six-repo stack as of W24 2026,
with emphasis on the data contracts and API boundaries that enable
cross-repo integration.

---

## 3. System Architecture

### 3.1 Repository overview

| Repo | Role | Language | Deployed |
|------|------|----------|---------|
| surya-yantra | IV tracer + IEC corrections | TypeScript/Next.js | Vercel (preview) |
| SolarLabX | LIMS + QMS + AI Vision + GUM | TypeScript/Next.js | Vercel (preview ⚠️) |
| antaryami-os | Enterprise AI OS | TypeScript | Vercel (antaryami-chat) |
| GanitaSutra / GanitaSutra-v0 | Math computation platform | TypeScript | Vercel (ganita-sutra) |
| ShilpaSutra | AI CAD + CFD | TypeScript/Next.js | Vercel (shilpa-sutra) |
| pv-pranali | Multi-agent orchestration | Python + LangGraph | Vercel (pv-pranali-web) |

### 3.2 Integration architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         pv-pranali (MCP orchestrator)               │
│             LangGraph multi-agent: Claude Code + MiMo on WSL/tmux   │
└──────────┬──────────┬─────────────┬──────────────┬──────────────────┘
           │          │             │              │
    ┌──────▼──┐  ┌────▼───┐  ┌─────▼────┐  ┌─────▼────┐
    │Surya    │  │SolarLabX│  │antaryami │  │ShilpaSutra│
    │Yantra   │  │LIMS/QMS │  │AI OS     │  │CAD+CFD   │
    │IV+IEC   │  │ISO17025 │  │Event bus │  │Multimodal │
    └──────┬──┘  └────┬───┘  └──────────┘  └──────────┘
           │          │
    ┌──────▼──────────▼──────────────────────────────────┐
    │              GanitaSutra                            │
    │   21 toolboxes: ABCD, SimuFlow, formula graph        │
    │   Symbolic autodiff for IEC coefficient derivation   │
    └────────────────────────────────────────────────────-┘
```

### 3.3 Data flow: IV measurement → IEC correction → NABL report

```
ESL-Solar 500 (SCPI)
    │ raw IV points (V, I, W)
    ▼
Surya Yantra /api/measurements
    │ POST /api/corrections/apply
    ├── IAM(θ)          ← IEC 61853-2 Martin-Ruiz
    ├── SMMF             ← IEC 60904-7
    └── IEC 60891 P1-P4 ← G/T → STC translation
    │ CorrectionResult { gMeas, tMeas, deltaI, deltaV }
    ▼
SolarLabX /api/lims/samples
    │ sample record with STC Pmpp, Isc, Voc
    ├── GUM uncertainty budget ← JCGM 100:2008
    ├── Calibration chain     ← ISO 17025 cl. 6.4.6
    └── QMS audit trail       ← ISO 17025 cl. 8
    │
    ▼
SolarLabX /api/reports
    │ PDF (pdfkit) + XLSX + Word (docx)
    ▼
antaryami-os event bus
    │ fault flags → fleet monitoring
    ▼
AI Diagnostics (Claude claude-opus-4-8)
```

---

## 4. Key Technical Contributions

### 4.1 IEC 60891:2021 Procedures 1–4 in TypeScript

*(TODO: summarise from IEC-CORRECTIONS.md, add novelty claim)*

### 4.2 GUM Monte Carlo (JCGM 101:2008) in Next.js

SolarLabX implements `runMonteCarloSimulation()` for GUM-S1 uncertainty
propagation, with a web UI for 10k/50k/100k sample runs. The JCGM 101
validity check (`|U_MCM − U_GUM| < 0.05 × U_GUM`) is automated.

*(TODO: quantify improvement over linear GUM for non-linear IV correction)*

### 4.3 Prompt caching for AI-assisted PV diagnostics

antaryami-os and SolarLabX both use Anthropic SDK v0.100 with
`cache_control: { type: "ephemeral" }` on the stable system prompt.
For IEC SOP generation, the ~1,200-token standards-context block is cached,
reducing per-request tokens by ~60% for repeated calls within the 5-minute TTL.

*(TODO: measure token reduction with real lab traffic)*

### 4.4 Calibration chain traceability graph

SolarLabX implements a visual calibration chain from NPL India national
standards down through reference cells and working standards to test instruments.
The graph detects expired calibrations and flags `amber` (< 60 days to expiry).
This directly satisfies ISO/IEC 17025:2017 cl. 6.4.6.

---

## 5. Results (TODO — need live lab data)

| Metric | Value | Source |
|--------|-------|--------|
| IV correction accuracy P1 vs P2 at ΔG = 176 W/m² | ΔPmpp = 0.22% | IEC-CORRECTIONS §1.5 worked example |
| SMMF range CdTe clear sky | 0.95–1.05 | IEC-CORRECTIONS §2.3 |
| IAM at θ = 60° (ar = 0.17) | 0.9499 | IEC-CORRECTIONS §3.1 |
| Vercel build time | < 60 s | Vercel dashboard |
| GUM vs MCM agreement (TODO) | < 0.05 × U_GUM | — |

---

## 6. Discussion

### 6.1 Comparison with commercial LIMS solutions

*(TODO: identify 2–3 commercial tools, compare feature parity and cost)*

### 6.2 NABL ISO 17025 accreditation pathway

*(TODO: map each ISO 17025 clause to a specific feature or gap)*

### 6.3 Limitations

- All Vercel deployments are preview-only; no production traffic data
- Hardware (ESL-Solar 500 + MUX) integration not yet in public repo
- `packages/` monorepo never bootstrapped — cross-repo types shared
  only through documentation, not runtime enforcement

---

## 7. Conclusion (TODO)

---

## 8. Blockers

| # | Blocker | Action |
|---|---------|--------|
| B1 | Live IV measurement data needed for §5 | Lab commissioning |
| B2 | SolarLabX production deployment broken | Fix Vercel target |
| B3 | `packages/iv-types` not created | Bootstrap monorepo package |
| B4 | Commercial LIMS comparison data | Literature review |
| B5 | ISO 17025 clause-by-clause mapping | Expert review |

---

## 9. References (TODO: add DOIs)

1. IEC 60891:2021, *PV devices — Temperature and irradiance corrections*.
2. IEC 61215:2021, *Terrestrial PV modules — Design qualification*.
3. ISO/IEC 17025:2017, *General requirements for laboratory competence*.
4. JCGM 100:2008, *Guide to the expression of uncertainty in measurement*.
5. JCGM 101:2008, *Supplement 1 to GUM — Propagation of distributions using Monte Carlo method*.
6. IEC 60904-7:2019, *Computation of spectral mismatch correction*.
7. IEC 61853-2:2016, *PV module performance testing — AOI, operating temperature*.
8. Martin N., Ruiz J.M., *IAM analytical model*, Solar Energy Materials 70 (2001) 25–38.
9. TODO: prior art for open-source LIMS in PV testing

---

*Draft outline — seeded from 2026-06-13 cross-repo activity — Surya Yantra weekly routine — 2026-06-14*
