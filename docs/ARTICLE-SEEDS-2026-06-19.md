# Article Seeds — 2026-06-19

> **Thursday routine** — proposed research narrative seeds drawn from engineering
> progress across the constellation repos.
>
> **Access note:** GitHub MCP session is scoped to `surya-yantra` only.
> Satellite-repo commit activity is inferred from last-known repo state:
> antaryami-os (2026-05-10), GanitaSutra-v0 (2026-05-08),
> ShilpaSutra (2026-03-31), SolarLabX (2026-03-25).
> No commits detected in the last 24 h on any satellite repo.
> Seeds are therefore architecture-driven, not commit-driven.

---

## Seed 1 — Visual IEC Correction Pipelines in GanitaSutra SimuFlow

**Narrative bridge:**
GanitaSutra-v0 is a MATLAB/Simulink-inspired web platform with a SimuFlow
block-diagram editor and 21 toolboxes. Surya Yantra's
`POST /api/corrections/apply` pipeline chains IAM → SMMF → IEC 60891 →
STC report in a fixed order — structurally identical to a directed acyclic
graph of signal transforms that SimuFlow was built to express.

**Proposed title:**
*From Block Diagrams to Irradiance Sweeps: Modeling IEC 60891 Correction
Chains as SimuFlow Graphs*

**Abstract (≈150 words):**
The four-stage IEC correction pipeline in Surya Yantra — incidence-angle
modifier, spectral mismatch factor, temperature/irradiance translation,
STC power report — is a directed acyclic graph of signal transforms.
GanitaSutra's SimuFlow block-diagram environment was designed for exactly
this kind of visual composition. This article maps each correction stage to
a SimuFlow block, exposes the intermediate signals (G_eff, Isc_corr,
translated curve), and shows how a researcher can interactively swap
procedures (P1 vs P2 vs P3) by reconnecting blocks rather than editing
TypeScript. A prototype notebook in GanitaSutra's CodePad calls Surya
Yantra's REST correction endpoints at each block boundary.
Outcome: a drag-and-drop IEC correction explorer with live IV curve
visualisation, suitable for teaching PV metrology at technical universities
or accelerating parameter-sensitivity studies in a research lab.

**Sections to draft:**
1. The IEC 60891 pipeline as a DAG
2. Mapping pipeline stages to SimuFlow block primitives
3. CodePad integration — calling the Surya Yantra REST API
4. Live demo: P1 vs P2 under large ΔG (> 200 W/m²)
5. Pedagogical applications in PV metrology courses

**Key figures needed:**
- SimuFlow block diagram of the full correction chain
- Side-by-side P1 vs P2 IV curves at ΔG = 400 W/m²
- Screenshot of CodePad calling `/api/corrections/p2`

---

## Seed 2 — Antaryami Enterprise AI OS Orchestrating PV Lab Workflows

**Narrative bridge:**
antaryami-os is an "Enterprise-Grade Organizational AI Operating System."
Surya Yantra exposes test-session scheduling, environmental monitoring,
IEC corrections, real-time IV streaming (WebSocket), and AI diagnostics
through a documented REST API. An enterprise AI OS is the natural
orchestration layer for automating the recurring decisions that currently
require a lab engineer's attention.

**Proposed title:**
*AI-Orchestrated PV Lab: Wiring antaryami-os Agent Pipelines to
Surya Yantra's Test API*

**Abstract (≈150 words):**
Running a 75-module IV-sweep test bed generates a cascade of decisions:
which modules to sweep today, when irradiance is stable enough for a valid
flash measurement, whether a corrected Pmpp drop is a real degradation
event or a calibration drift. These decisions are today made manually.
antaryami-os, as an organizational AI operating system, can host persistent
agent pipelines that subscribe to Surya Yantra's WebSocket IV stream, poll
`/api/env/:bedId/latest` for irradiance stability windows, trigger
`POST /api/sessions` automatically when G_POA ∈ [980, 1020] W/m², and
forward IEC-corrected results through Claude-powered diagnostics at
`/api/ai/chat`. This article designs the agent workflow, defines the MCP
tool wrappers that expose Surya Yantra endpoints to antaryami's agent
layer, and discusses failure-mode handling (e-load timeout, relay
self-test failure) and human-in-the-loop escalation patterns.

**Sections to draft:**
1. The decision loop in a PV characterisation lab
2. antaryami agent architecture overview
3. MCP tool definitions wrapping Surya Yantra's REST API
4. Irradiance-gated automatic session trigger
5. Automated degradation flagging via IEC-corrected trend analysis
6. Human-in-the-loop escalation design
7. Security considerations: HMAC tokens and tunnel auth

**Key figures needed:**
- ideation→implementation diagram: antaryami → Surya Yantra API flow
- Sequence diagram: irradiance stability check → session trigger → corrections → AI chat
- Dashboard screenshot showing agent-scheduled sweep results

---

*Next seed review: Friday 2026-06-20 (publication-ready polish + ideation→implementation diagram)*
