---
title: "A Unified Open-Source PV R&D Ecosystem for India: Surya Yantra, SolarLabX, GanitaSutra, and the Antaryami AI Layer"
slug: unified-pv-ecosystem-india
status: draft
date: 2026-06-03
updated: 2026-06-04
tags: [pv-ecosystem, open-source, india, ganitasutra, solarlabx, antaryami, shilpasutra, ai-diagnostics]
repos: [surya-yantra, SolarLabX, GanitaSutra, ShilpaSutra, antaryami-os]
citations:
  - "IEC 61215:2021"
  - "IEC 62446-1:2016"
  - "IEC 61730-1:2023"
  - "https://modelcontextprotocol.io/"
  - "https://github.com/langchain-ai/langgraph"
  - "IEEE 1547:2018"
seo_description: ""
---

# A Unified Open-Source PV R&D Ecosystem for India: Surya Yantra, SolarLabX, GanitaSutra, and the Antaryami AI Layer

> **Status**: Draft (Wednesday enhancement). Advance to `review` on Thursday.

## Abstract

India's solar PV manufacturing capacity is scaling rapidly toward 100 GW/year under the
Production Linked Incentive (PLI) scheme, yet the software infrastructure for domestic
testing and R&D remains fragmented, expensive, and largely imported from European and
North American vendors. This paper describes an integrated open-source ecosystem developed
at Anahata Sri Research for the Srishti PV Lab, Jamnagar, comprising six interoperating
systems:

- **Surya Yantra** — IV curve tracer and IEC 60891:2021 correction engine (this repo)
- **SolarLabX** — Laboratory Information Management System (LIMS) and Quality Management System (QMS)
- **GanitaSutra** — MATLAB/Simulink-inspired symbolic math and SimuFlow block-diagram environment
- **ShilpaSutra** — AI-powered text-to-CAD/CFD for mechanical design of test fixtures
- **Antaryami OS** — Enterprise AI OS providing Claude-based diagnostic and orchestration
- **pv-pranali** — Multi-agent LangGraph + MCP orchestrator connecting all subsystems

All six systems are built on a common Next.js 14 / TypeScript / Vercel / PostgreSQL stack,
with hardware bridges for SCPI instruments, Modbus sensors, and STM32-based relay matrices.
We describe the inter-system API contracts, the AI orchestration patterns enabled by the
Model Context Protocol (MCP), and the deployment architecture on Vercel's edge regions
closest to Jamnagar (sin1/bom1). Preliminary productivity metrics from lab commissioning
are reported where available.

**Keywords**: PV testing, LIMS, open-source, India, TypeScript, AI diagnostics,
IEC standards, GanitaSutra, SolarLabX, Surya Yantra, multi-agent, LangGraph, MCP,
Antaryami, PLI scheme.

---

## 1. Introduction

### 1.1 India's PV testing gap

India's PLI scheme targets domestic solar module manufacturing capacity exceeding
65 GW/year by 2030 (MNRE, 2022). NABL-accredited testing laboratories are a
bottleneck: the country has fewer than 20 labs capable of the full IEC 61215 / IEC 61730
qualification sequence, and most rely on proprietary European software (PVSyst, Halm,
Spire) with limited auditability and high licence costs.

### 1.2 The ecosystem vision

Each system in the stack solves one layer; together they cover the full lab lifecycle:

```
Design (ShilpaSutra: text → CAD/CFD fixtures)
  → Procurement (hardware/BOM.md with India purchase links)
    → Lab operations (SolarLabX: LIMS, QMS, audit, certificates)
      → Measurement (Surya Yantra: IV tracer, IEC corrections)
        → Analysis (GanitaSutra: symbolic math, SimuFlow)
          → AI diagnostics + reporting (Antaryami OS: Claude)
            → Orchestration (pv-pranali: multi-agent MCP)
```

### 1.3 Contribution of this paper

- First unified description of the inter-system API contracts across all six repos.
- Architecture of the MCP-based orchestration layer and its role in AI diagnostics.
- Comparison with commercial alternatives (PVSyst, Halm TestBed, standard LIMS vendors).
- Open-source release notes and reproducibility guidance.

---

## 2. System Descriptions

### 2.1 Surya Yantra

75-module test bed, ESL-Solar 500 e-load, 300-relay MUX. Full IEC 60891:2021
Procedures 1–4 + SMMF (IEC 60904-7) + IAM (IEC 61853-2). WebSocket IV streaming;
Next.js 14 + Electron. REST/JSON API with HMAC-signed tokens and Socket.IO.

Vercel project: `surya-yantra` (prj_QiTDz1I0e4kde3Fy2j0pZ1LJqTrc). Latest build: READY.

### 2.2 SolarLabX

LIMS for sample tracking, test protocols, and IEC 61215 / IEC 61730 certificate
generation. QMS for non-conformances, CAPA, and audit trails. Standards coverage:
IEC 61215:2021, IEC 61730-1/2:2023, IEC 62446-1:2016.

Vercel project: `solar-lab-x` (prj_AHZlhDfpU33SZbdtylTvEtBgoL1l).

### 2.3 GanitaSutra

21 toolboxes covering signal processing, control theory, statistics, and more.
SimuFlow block-diagram editor for visual dataflow programming (comparable to Simulink).
CodePad editor and PlotEngine. Of direct relevance to Surya Yantra: symbolic
sensitivity analysis of IEC 60891 correction coefficients, spectral convolution
for SMMF, and thermal modelling for cell temperature estimation.

Vercel project: `ganita-sutra` (prj_uhtVLk9xmuXl0jXNVU3338DaYWCN).

### 2.4 ShilpaSutra

Text/multimodal → parametric CAD + CFD conversational design agent. Use case:
generate the MUX chassis DXF from a natural-language specification. Reduces the
design-to-fabrication cycle for custom lab hardware.

Vercel project: `shilpa-sutra` (prj_PU5K116Eaipv44elqSNg3VAqEvRQ).

### 2.5 Antaryami OS

Enterprise AI OS; Claude-based multi-modal orchestration. Provides the
`POST /api/ai/chat` streaming endpoint consumed by Surya Yantra (model: `claude-opus-4-8`
and `claude-sonnet-4-6`). Most actively developed repo in the ecosystem.

Vercel project: `antaryami-os-antaryami-chat` / `antaryami-chat`.

### 2.6 pv-pranali

LangGraph + MCP multi-agent system. Agents: ShilpaSutra, Antaryami,
Vidyalaya-Office, SuryaPrajna, Vidyut-Srishti. Entry point for unified
proposal orchestration and cross-repo diagnostics.

---

## 3. Inter-System Data Flows

### 3.1 Measurement → Analysis pipeline

```
Surya Yantra (IV sweep + IEC 60891 correction → STC power)
  → SolarLabX (test record + IEC 61215 certificate)
    → GanitaSutra (symbolic regression, degradation model)
      → Antaryami (LLM interpretation + report narrative)
        → pv-pranali (PDF export + stakeholder distribution)
```

### 3.2 Design → Procurement pipeline

```
ShilpaSutra (natural-language → CAD fixture DXF)
  → hardware/BOM.md (component list with India purchase links)
    → SolarLabX (incoming inspection protocol)
      → pv-pranali (procurement approval workflow)
```

### 3.3 API contract sketch (Wednesday draft)

Key boundary between Surya Yantra and SolarLabX:

```json
POST /api/sessions/:id/finalise
{
  "sessionId": "clx-sess-001",
  "testType": "IEC61215_MST51",
  "moduleIds": ["clx-m-001", ...],
  "correctionProcedure": "IEC60891_P2",
  "targetConditions": { "irradiance": 1000, "temperature": 25 },
  "exportTo": "SolarLabX"
}
```

Response includes a `solarLabXTestRecordId` that links the Surya Yantra measurement
to the SolarLabX sample record. *(Full JSON schema to be formalised with SolarLabX
API team — tracked as content gap.)*

Key boundary between Antaryami and Surya Yantra:

```json
POST /api/ai/chat
{
  "sessionId": "clx-sess-001",
  "moduleId": "clx-m-042",
  "model": "claude-opus-4-8",
  "message": "Explain why Isc dropped 6% after the last sweep.",
  "context": {
    "measurementIds": ["clx-m-041", "clx-m-042"],
    "correctionResults": [...]
  }
}
```

The Antaryami layer receives the full measurement context and returns a
`text/event-stream` diagnostic narrative.

---

## 4. AI Orchestration with Antaryami

### 4.1 Diagnostic queries

A typical Srishti lab diagnostic session:

1. Technician notices Isc drop of 6% on module slot 34.
2. `POST /api/ai/chat` invoked with the last two measurement records.
3. Antaryami queries Surya Yantra for raw IV data, calls GanitaSutra for a
   regression on the last 30 days of Isc vs irradiance, and returns a root-cause
   hypothesis (soiling, delamination, or bypass-diode activation).
4. If soiling: SolarLabX CAPA workflow triggered.
5. If delamination: IEC 61730-2 §10 degradation test protocol suggested.

### 4.2 Multi-agent round-trip latency

*(Fill after benchmarking — target < 5 s for a single diagnostic query.)*

### 4.3 Prompt engineering patterns

The Anthropic Claude API is invoked with prompt caching enabled for the large
IEC standards context. The `POST /api/ai/chat` route passes:

```
system: [IEC 60891 formulae + module datasheet + last 30-day measurement history]
user: [technician's natural-language question]
```

The system prompt is structured to be cache-breakpoint-friendly (static IEC text
first, dynamic measurement data after), targeting >80% cache hit rate on repeated
diagnostic queries for the same module.

---

## 5. GanitaSutra × Surya Yantra Integration

### 5.1 Symbolic sensitivity analysis

GanitaSutra's CAS differentiates the P1 correction formula symbolically with respect
to `α`, `β`, `Rs`, `κ` to produce analytical uncertainty bounds without Monte Carlo
simulation. This is an order of magnitude faster than numerical perturbation for
real-time dashboard display.

### 5.2 SimuFlow block diagram for IV correction pipeline

The correction pipeline (IAM → SMMF → IEC 60891) maps naturally to a SimuFlow
dataflow graph, enabling visual inspection, Jacobian auto-computation, and
real-time what-if analysis in the browser.

### 5.3 Higher-order spectral integration

GanitaSutra's signal-processing toolbox can replace the trapezoidal `trapz` in
`smmf.ts` with Gaussian quadrature for improved accuracy at coarse wavelength
grids (< 20 nm spacing), reducing SMMF uncertainty by an estimated 0.1%.

---

## 6. Deployment Architecture

```
Vercel Edge (sin1 / bom1)
├── surya-yantra          → Next.js 14 + Socket.IO (IV streaming)
├── solar-lab-x           → Next.js 14 (LIMS/QMS)
├── ganita-sutra          → Next.js 14 (symbolic math, SimuFlow)
└── shilpa-sutra          → Next.js 14 (CAD/CFD agent)

Hardware gateway (Cloudflare Tunnel — zero-trust, no inbound firewall)
├── ESL-Solar 500         → SCPI/TCP (192.168.1.40:5025)
├── MUX STM32H7           → Modbus RTU / USB
└── Environmental sensors → Modbus RTU / RS-485

AI layer
└── Antaryami OS          → claude-opus-4-8 + claude-sonnet-4-6 (Anthropic API)
                            MCP tools: Surya Yantra, SolarLabX, GanitaSutra
```

*(Deployment architecture diagram — see Fig 4 placeholder below.)*

---

## 7. Preliminary Results

*(Fill after Srishti lab commissioning. Placeholders for benchmark targets.)*

| Metric | Target | Achieved |
|--------|--------|---------|
| Time to first IV curve after boot | < 2 min | — |
| MUX relay switch time (SW + HW) | < 100 ms | — |
| Full 75-module test cycle | < 4 h | — |
| pv-pranali diagnostic round-trip | < 5 s | — |
| Anthropic cache hit rate | > 80% | — |
| Vercel edge function P50 latency | < 50 ms | — |

---

## 8. Discussion

### 8.1 Comparison with commercial alternatives

| Feature | Our stack | PVSyst + LIMS | Halm TestBed |
|---------|-----------|---------------|-------------|
| Annual cost | ~₹1.1 L (SaaS) | ~$10 k | ~$50 k hardware |
| Source available | Yes (MIT) | No | No |
| IEC 60891 procedures | 1–4 | 1–2 | 1–2 |
| AI diagnostics | Yes (Claude) | No | No |
| Web + desktop | Yes | Desktop only | Desktop only |
| India data residency | Yes (bom1) | Depends | No |
| NABL audit trail | Yes (SolarLabX) | Partial | No |

### 8.2 Limitations

- Cross-repo API contracts are still informal; a unified OpenAPI specification is pending.
- pv-pranali multi-agent orchestration has not yet been benchmarked at scale.
- GanitaSutra SimuFlow integration with Surya Yantra is designed but not yet implemented.
- Antaryami OS cross-repo session scope restrictions currently prevent automated
  commit-level seeding from all five repos in a single session (workaround: use
  `add_repo` tool or grant broader access).

---

## 9. Conclusion and Future Work

*(~200 words — fill on Friday.)*

Future work:

- pv-pranali agents for automated test scheduling across the 75-module test bed.
- GanitaSutra thermal model for cell temperature estimation without Pt-100 sensors.
- ShilpaSutra-generated enclosure DXF for the MUX chassis v2.
- Unified OpenAPI schema for all six system boundaries.
- GUM uncertainty propagation in Surya Yantra correction engine.

---

## References

1. IEC 61215:2021, *Terrestrial photovoltaic (PV) modules — Design qualification and type approval*. Geneva: IEC.
2. IEC 62446-1:2016, *Grid-connected photovoltaic systems — Minimum requirements for system documentation, commissioning tests, and inspection*. Geneva: IEC.
3. IEC 61730-1:2023 / IEC 61730-2:2023, *Photovoltaic (PV) module safety qualification*. Geneva: IEC.
4. Ministry of New and Renewable Energy, India (2022). *Production Linked Incentive Scheme for High Efficiency Solar PV Modules — Programme Guidelines*. New Delhi: MNRE.
5. Anthropic (2024). *Model Context Protocol (MCP) Specification*. https://modelcontextprotocol.io/
6. LangChain AI (2024). *LangGraph: Build Stateful Multi-Actor Applications with LLMs*. https://github.com/langchain-ai/langgraph
7. Anthropic (2026). *Claude API Reference — Prompt Caching*. https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
8. Vercel (2026). *Edge Network — Global Infrastructure*. https://vercel.com/docs/edge-network/overview
9. IEEE 1547:2018, *Standard for Interconnection and Interoperability of Distributed Energy Resources with Associated Electric Power Systems Interfaces*. New York: IEEE.
10. National Accreditation Board for Testing and Calibration Laboratories (2024). *NABL 112 — Specific Criteria for Accreditation of Calibration and Testing Laboratories in Solar Energy Sector*. New Delhi: NABL.

---

## Figures needed

- [ ] Fig 1: Ecosystem overview — 6 repos + data flows + hardware gateway
  - `alt="Architecture diagram showing six interoperating systems: Surya Yantra, SolarLabX, GanitaSutra, ShilpaSutra, Antaryami OS, and pv-pranali, with arrows indicating data flows and a Cloudflare Tunnel bridge to lab hardware"`
- [ ] Fig 2: SimuFlow block diagram of IEC correction pipeline
  - `alt="SimuFlow block diagram showing IAM, SMMF, and IEC 60891 P1–P4 blocks connected in series, with G and T as inputs and STC IV curve as output"`
- [ ] Fig 3: pv-pranali multi-agent graph (LangGraph nodes and edges)
  - `alt="LangGraph state machine showing five agent nodes (ShilpaSutra, Antaryami, Vidyalaya-Office, SuryaPrajna, Vidyut-Srishti) and the edges representing tool calls and state transitions"`
- [ ] Fig 4: Deployment architecture on Vercel + Cloudflare Tunnel
  - `alt="Deployment diagram showing four Next.js apps on Vercel edge regions sin1 and bom1, connected via Cloudflare Tunnel to lab hardware (ESL-Solar 500, MUX STM32H7, environmental sensors) in Jamnagar"`
- [ ] Fig 5: Benchmark latency comparison (our stack vs PVSyst/Halm)
  - `alt="Bar chart comparing end-to-end test cycle times and software costs for the open-source stack, PVSyst plus commercial LIMS, and Halm TestBed"`

---

## Ideation → Implementation Diagram

*(Add on Friday per weekly cadence.)*

```
[Ideation: India's PV testing gap — PLI targets vs. lab software deficit]
        ↓
[Architecture: 6-repo ecosystem on common Next.js/Vercel/PostgreSQL stack]
        ↓
[Layer 1: Measurement — Surya Yantra IV tracer + IEC 60891 engine]
        ↓                                     ↓
[Layer 2: Operations — SolarLabX LIMS/QMS]  [Layer 2: Math — GanitaSutra SimuFlow]
        ↓                                     ↓
[Layer 3: Design — ShilpaSutra CAD/CFD]   [Layer 3: AI — Antaryami OS (Claude)]
        ↓                                     ↓
[Orchestration: pv-pranali multi-agent (LangGraph + MCP)]
        ↓
[Deployment: Vercel bom1/sin1 + Cloudflare Tunnel to Jamnagar hardware]
        ↓
[Published: open-source PV R&D stack for India — MIT licence]
```
