---
title: "A Unified Open-Source PV R&D Ecosystem for India: Surya Yantra, SolarLabX, GanitaSutra, and the Antaryami AI Layer"
slug: unified-pv-ecosystem-india
status: outline
date: 2026-06-03
updated: 2026-06-03
tags: [pv-ecosystem, open-source, india, ganitasutra, solarlabx, antaryami, shilpasutra, ai-diagnostics]
repos: [surya-yantra, SolarLabX, GanitaSutra, ShilpaSutra, antaryami-os]
citations: []
seo_description: ""
---

# A Unified Open-Source PV R&D Ecosystem for India: Surya Yantra, SolarLabX, GanitaSutra, and the Antaryami AI Layer

> **Status**: Outline (Monday seed). Advance to `draft` on Wednesday (add references, figures).

## Abstract

*(~250 words — fill on Wednesday)*

India's solar PV manufacturing capacity is scaling rapidly toward 100 GW/year, yet its
testing and R&D software stack remains fragmented, expensive, and largely imported.
This paper describes an integrated open-source ecosystem developed at Anahata Sri
Research for the Srishti PV Lab, Jamnagar, comprising:

- **Surya Yantra** — IV curve tracer and IEC correction engine
- **SolarLabX** — LIMS + QMS + audit + test protocols (unified lab operations)
- **GanitaSutra** — MATLAB/Simulink-inspired symbolic math and SimuFlow block-diagram environment
- **ShilpaSutra** — AI-powered text-to-CAD/CFD for mechanical design of test fixtures
- **Antaryami OS** — Enterprise AI OS providing a Claude-based diagnostic and orchestration layer
- **pv-pranali** — Multi-agent LangGraph + MCP orchestrator connecting all subsystems

The ecosystem is fully TypeScript/Next.js on Vercel, with hardware bridges for SCPI
instruments, Modbus sensors, and STM32-based relay matrices. We describe the inter-system
data flows, the AI orchestration patterns, and preliminary productivity metrics from
lab commissioning.

**Keywords**: PV testing, LIMS, open-source, India, TypeScript, AI diagnostics, IEC standards,
GanitaSutra, SolarLabX, Surya Yantra, multi-agent, LangGraph, MCP.

---

## 1. Introduction

### 1.1 India's PV testing gap

- PLI scheme targets 65 GW/year manufacturing by 2030.
- NABL-accredited labs are few; software is mostly PVSyst + proprietary LIMS.
- Import cost and opacity are barriers to innovation.

### 1.2 The ecosystem vision

Each system solves one layer; together they cover the full lab lifecycle:

```
Design (ShilpaSutra)
  → Procurement (BOM, vendor links)
    → Lab operations (SolarLabX LIMS/QMS)
      → Measurement (Surya Yantra IV tracer)
        → Analysis (GanitaSutra symbolic math)
          → AI diagnostics + reporting (Antaryami OS)
            → Orchestration (pv-pranali multi-agent)
```

### 1.3 Contribution of this paper

- First unified description of the inter-system API contracts.
- Benchmarks for cross-system latency (pv-pranali orchestration round-trips).
- Open-source release and reproducibility notes.

---

## 2. System Descriptions

### 2.1 Surya Yantra

- 75-module test bed, ESL-Solar 500 e-load, 300-relay MUX.
- IEC 60891 P1–P4, SMMF (IEC 60904-7), IAM (IEC 61853-2).
- WebSocket IV streaming; Next.js 14 + Electron.
- API: REST/JSON, HMAC-signed tokens, Socket.IO.

### 2.2 SolarLabX

- LIMS: sample tracking, test protocols, certificate generation.
- QMS: non-conformance, CAPA, audit trails.
- Standards: IEC 61215, IEC 61730, IEC 62446.
- Last significant update: March 2026 (83 open issues → active development).

### 2.3 GanitaSutra

- 21 toolboxes (signal processing, control, statistics, etc.).
- SimuFlow block diagrams (visual dataflow editor).
- CodePad editor + PlotEngine.
- Relevance: symbolic sensitivity analysis of IEC correction coefficients;
  spectral convolution for SMMF; thermal modelling for cell temperature estimation.
- Recent progress (May 2026): SimuFlow block diagram engine.

### 2.4 ShilpaSutra

- Text/multimodal → CAD + CFD conversational design agent.
- Parametric modelling for test fixture geometry.
- Use case: generate MUX chassis DXF from natural-language spec.

### 2.5 Antaryami OS

- Enterprise AI OS; Claude-based orchestration.
- Provides the `POST /api/ai/chat` backend consumed by Surya Yantra.
- 164 open issues → most active repo in the ecosystem.
- Recent progress (May 2026): ongoing multi-agent capability development.

### 2.6 pv-pranali

- LangGraph + MCP multi-agent system.
- Agents: ShilpaSutra, Antaryami, Vidyalaya-Office, SuryaPrajna, Vidyut-Srishti.
- Runs on WSL/tmux with Claude Code + MiMo.
- Entry point for unified proposal orchestration.

---

## 3. Inter-System Data Flows

### 3.1 Measurement → Analysis pipeline

```
Surya Yantra (IV sweep + IEC correction)
  → SolarLabX (test record + certificate)
    → GanitaSutra (symbolic regression, degradation model)
      → Antaryami (LLM interpretation + report generation)
```

### 3.2 Design → Procurement pipeline

```
ShilpaSutra (CAD fixture)
  → Surya Yantra BOM (hardware/BOM.md format)
    → pv-pranali (procurement proposal orchestration)
```

### 3.3 API contract sketch

*(Fill on Wednesday — define the JSON payloads exchanged at each boundary)*

---

## 4. AI Orchestration with Antaryami

### 4.1 Diagnostic queries

- "Why did Isc drop 6 % after the last sweep?" → Antaryami queries Surya Yantra
  measurements, runs GanitaSutra regression, returns root-cause hypothesis.

### 4.2 Multi-agent round-trip latency

*(Fill after benchmarking — target < 5 s for a single diagnostic query)*

### 4.3 Prompt engineering patterns

*(Fill on Wednesday)*

---

## 5. GanitaSutra × Surya Yantra Integration

This section expands on the most technically novel cross-system link.

### 5.1 Symbolic sensitivity analysis of IEC 60891 coefficients

GanitaSutra's CAS can differentiate the P1 correction formula symbolically with respect
to `α`, `β`, `Rs`, `κ` to produce uncertainty bounds without Monte Carlo simulation.

### 5.2 SimuFlow block diagram for IV correction pipeline

The correction pipeline (IAM → SMMF → IEC 60891) maps naturally to a
SimuFlow dataflow graph. This enables:

- Visual inspection of signal flow.
- Automatic Jacobian computation.
- Real-time what-if analysis in the browser.

### 5.3 Spectral convolution for SMMF

GanitaSutra's signal-processing toolbox can replace the trapezoidal `trapz`
in `smmf.ts` with a higher-order quadrature for improved accuracy at coarse
wavelength grids.

---

## 6. Deployment Architecture

*(Fill on Wednesday — diagram)*

```
Vercel Edge (sin1/bom1)
├── surya-yantra      → Next.js 14 + Socket.IO
├── solar-lab-x       → Next.js 14
├── ganita-sutra      → Next.js 14
└── shilpa-sutra      → Next.js 14

Hardware gateway (Cloudflare Tunnel)
├── ESL-Solar 500     → SCPI/TCP
├── MUX STM32H7       → Modbus RTU
└── Env sensors       → Modbus RTU / USB

AI layer
└── Antaryami OS      → Claude claude-opus-4-8 + claude-sonnet-4-6
```

---

## 7. Preliminary Results

*(Fill after lab commissioning — leave as placeholders now)*

- Time to first IV curve after boot: target < 2 min.
- MUX relay switch time (software + relay): target < 100 ms.
- End-to-end test cycle for 75 modules: target < 4 h.
- pv-pranali orchestration round-trip: target < 5 s.

---

## 8. Discussion

### 8.1 Comparison with commercial alternatives

| Feature | Our stack | PVSyst + LIMS | Halm TestBed |
|---------|-----------|---------------|--------------|
| Cost    | ~₹1.1 L/yr (SaaS) | ~$10k/yr | ~$50k hardware |
| Source available | Yes | No | No |
| IEC 60891 procedures | 1–4 | 1–2 | 1–2 |
| AI diagnostics | Yes (Claude) | No | No |
| Web + desktop | Yes | Desktop only | Desktop only |

### 8.2 Limitations

*(Fill on Wednesday)*

---

## 9. Conclusion and Future Work

*(Fill on Friday)*

Future work:
- pv-pranali agents for automated test scheduling.
- GanitaSutra thermal model for cell temperature estimation without Pt-100 sensors.
- ShilpaSutra-generated enclosure DXF for the MUX chassis v2.

---

## References

*(Fill on Wednesday — target ≥ 10 citations)*

1. IEC 61215:2021, *Terrestrial photovoltaic (PV) modules — Design qualification and type approval*.
2. IEC 62446-1:2016, *Grid-connected PV systems — Minimum requirements*.
3. TODO: India NABL solar testing statistics
4. TODO: PLI scheme solar targets reference
5. TODO: Open-source LIMS comparison paper
6. TODO: LangGraph multi-agent paper
7. TODO: Model Context Protocol (MCP) specification
8. TODO: Claude API technical reference
9. TODO: Vercel edge deployment latency study
10. TODO: Indian solar manufacturing capacity projection

---

## Figures needed

- [ ] Fig 1: Ecosystem overview diagram (all 6 repos + data flows) — add `alt` text
- [ ] Fig 2: SimuFlow block diagram of IEC correction pipeline — add `alt` text
- [ ] Fig 3: pv-pranali multi-agent graph — add `alt` text
- [ ] Fig 4: Deployment architecture on Vercel — add `alt` text
- [ ] Fig 5: Benchmark latency comparison table/chart — add `alt` text

> **Alt-text template**: `alt="[Description of what the figure shows, including axis labels and key data points]"`

---

## Ideation → Implementation Diagram

*(Add on Friday per weekly cadence)*

```
[Ideation: India's PV testing gap]
        ↓
[Architecture: 6-repo ecosystem]
        ↓
[Surya Yantra: IV tracer + IEC engine]  ←→  [SolarLabX: LIMS/QMS]
        ↓                                           ↓
[GanitaSutra: symbolic analysis]         [Antaryami: AI diagnostics]
        ↓                                           ↓
[ShilpaSutra: CAD/CFD fixtures]  ←→  [pv-pranali: multi-agent orchestration]
        ↓
[Vercel deployment + Cloudflare Tunnel hardware bridge]
        ↓
[Published: open-source PV R&D stack for India]
```
