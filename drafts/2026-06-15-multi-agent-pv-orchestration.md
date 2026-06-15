---
title: "Closing the PV Characterisation Loop: Multi-Agent Orchestration with LangGraph, Claude Code, and Open-Source Lab Instruments"
status: seed
created: 2026-06-15
weekly_angle: roadmap
target_venue: "IEEE Access (Open Access)"
target_length_words: 7000
blocked_on:
  - "Surya Yantra MCP tool surface for pv-pranali — issue #160"
  - "SolarLabX LIMS export endpoint — issue #158"
  - "Agent graph benchmarks (human-in-loop touches per test run)"
---

## Abstract (draft)

Photovoltaic module characterisation in research labs involves multiple
heterogeneous tools: CAD platforms for fixture design, laboratory information
management systems (LIMS) for traceability, IV curve tracers for measurement,
and simulation environments for validation. We present a multi-agent
orchestration architecture (pv-pranali) that coordinates five open-source
platforms — ShilpaSutra (AI-powered CAD), Antaryami-OS (enterprise AI OS),
Surya Yantra (IV curve tracer), SolarLabX (LIMS + QMS), and GanitaSutra
(mathematical simulation) — via a LangGraph agent graph exposed over the
Model Context Protocol (MCP). We demonstrate a complete design-to-measurement
pipeline in which a natural-language prompt ("characterise the new 450 Wp
bifacial modules") triggers automated fixture design, lab scheduling, IV
sweeps, LIMS registration, and simulation validation with fewer than three
human touchpoints. The architecture is platform-agnostic and reproducible on
commodity cloud infrastructure (Vercel + Neon PostgreSQL).

---

## 1. Introduction

TODO — motivate multi-agent approaches to lab automation; cite:
- LangGraph paper / docs (2024)
- Anthropic MCP specification (2024)
- pv-pranali project README
- Recent IEEE Access papers on lab automation

The key claim: the five platforms in the ecosystem (Antaryami-OS,
Surya Yantra, SolarLabX, ShilpaSutra, GanitaSutra) were designed
independently but compose naturally via MCP tool surfaces and a shared
LangGraph orchestration layer.

---

## 2. System Overview

### 2.1 Platform roles

| Platform | Role in pipeline | MCP tool surface |
|----------|-----------------|-----------------|
| ShilpaSutra | Text→CAD for test fixture design | `generate_cad`, `run_cfd` |
| Antaryami-OS | Lab scheduling, operator assignment | `schedule_session`, `assign_operator` |
| Surya Yantra | IV sweep execution + IEC corrections | `start_sweep`, `get_results` (M15, #160) |
| SolarLabX | LIMS traceability + QMS + audit | `register_measurement`, `get_nabl_report` |
| GanitaSutra | SimuFlow IV model validation | `run_pv_simulation`, `compare_iv` |

### 2.2 Agent graph topology

```
User prompt
    │
    ▼
[Router agent] ──────────────────────────────────────────┐
    │                                                     │
    ▼                                                     ▼
[ShilpaSutra agent]                          [Antaryami scheduler]
  generate fixture CAD                          book lab slot
    │                                                     │
    └──────────────────────────┬──────────────────────────┘
                               ▼
                    [Surya Yantra sweep agent]
                      execute IV sweep (M15)
                      apply IEC corrections
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
          [SolarLabX LIMS agent]  [GanitaSutra sim agent]
          register + audit trail  validate vs. model
                    │                     │
                    └──────────┬──────────┘
                               ▼
                    [Report generator]
                    PDF/XLSX + NABL cert
```

---

## 3. Surya Yantra MCP Tool Surface

TODO — once issue #160 is resolved, document:

```
Tool: start_sweep
Input: { testBedId, moduleIds, loadMode, stepCount, scanTimeSec }
Output: { sessionId, estimatedDurationSec }

Tool: get_sweep_results
Input: { sessionId }
Output: { measurements: [{ moduleId, ivCurve, stcParams, corrections }] }

Tool: get_module_status
Input: { testBedId }
Output: { modules: [{ slotPosition, moduleId, lastSweepAt, quality }] }
```

These three tools are sufficient for pv-pranali to autonomously drive the
full measurement pipeline without human intervention.

---

## 4. Orchestration Patterns

### 4.1 Synchronous vs. asynchronous sweep

IV sweeps take 5–30 minutes for 75 modules. The sweep agent must:
1. Call `start_sweep` → get `sessionId`.
2. Poll `get_sweep_results` (or subscribe to WebSocket) until complete.
3. Hand off results to LIMS and simulation agents in parallel.

LangGraph's `interrupt` mechanism is appropriate here: the graph pauses
at the sweep node and resumes on `iv:complete` WebSocket event.

### 4.2 Error handling

- If `start_sweep` returns `409` (MUX conflict): re-queue with 5-minute delay.
- If `get_sweep_results` shows `quality_rating = 1` (SMMF outside [0.8, 1.2]):
  flag for human review before LIMS registration.
- If SolarLabX LIMS registration fails: hold in `pending_lims` state; retry
  up to 3 times before paging operator.

---

## 5. Human-in-the-Loop Analysis

TODO — quantify: for a typical 75-module characterisation run, how many
human decisions are required with and without the multi-agent pipeline?

Hypothesis:
- **Without orchestration:** ~12 human interactions (schedule, connect modules,
  start sweep, check results, correct each module, register in LIMS, validate,
  generate report).
- **With orchestration:** 2–3 (approve fixture design, approve NABL report,
  handle anomaly flags).

---

## 6. Evaluation

TODO — run a pilot study at Srishti PV Lab, Jamnagar:
- [ ] Characterise 10 modules with manual workflow → record time + touchpoints.
- [ ] Characterise same 10 modules via pv-pranali orchestration → compare.
- [ ] Measure: total wall-clock time, human effort-hours, error rate.

---

## 7. Related Work

TODO — compare with:
- Commercial LIMS (LabWare, STARLIMS) — cost, IEC compliance.
- LabVIEW-based automation — flexibility, open-source gap.
- Other LangGraph / multi-agent lab automation papers.

---

## 8. Conclusions

TODO — once pilot data is available.

---

## References

TODO — cite:
- LangGraph: A Graph-Based Framework for Stateful Agent Orchestration (2024)
- Anthropic Model Context Protocol specification (2024)
- IEC 60891:2021, IEC 60904-7:2019
- ISO 17025:2017 General requirements for testing labs
- Relevant IEEE Access papers on lab automation and LIMS
