---
title: "pv-pranali: Multi-Agent Equipment Procurement Orchestrator for India's Solar PV Labs"
seo_title: "pv-pranali: LangGraph + MCP Multi-Agent System for Solar Test Equipment Procurement | Srishti PV Lab"
description: "pv-pranali orchestrates ShilpaSutra, Antaryami-OS, and Vidyalaya-Office via LangGraph + MCP to parse User Requirements Specifications for solar test equipment into IEC-traceable structured requirements — bridging client procurement with lab commissioning."
keywords:
  - pv-pranali procurement agent
  - multi-agent LangGraph solar
  - URS ingest solar equipment
  - IEC 60904-9 sun simulator procurement
  - MCP solar lab orchestrator
  - AI solar procurement India
  - Claude Code LangGraph
  - requirements engineering solar
  - solar test equipment URS
  - Srishti PV Lab procurement
  - open source solar procurement
  - ShilpaSutra Antaryami orchestration
canonical: "https://surya-yantra.srishtipvlab.in/posts/pv-pranali-multi-agent-pv-proposal-orchestrator"
og:
  title: "pv-pranali: Multi-Agent Solar Equipment Procurement Orchestrator"
  description: "LangGraph + MCP system that parses client URS documents into structured IEC-traceable requirements, connecting equipment procurement to lab commissioning."
  image: "/og/pv-pranali-orchestrator.png"
  type: "article"
twitter:
  card: "summary_large_image"
  title: "pv-pranali: AI Solar Equipment Procurement | LangGraph + MCP"
  description: "Multi-agent LangGraph+MCP: client URS → structured requirements → IEC traceability matrix → ShilpaSutra + Antaryami-OS + Surya Yantra."
  image: "/og/pv-pranali-orchestrator.png"
author: "Srishti PV Lab Engineering"
date: "2026-05-10"
lastmod: "2026-05-10"
draft: true
tags:
  - pv-pranali
  - multi-agent
  - langraph
  - mcp
  - procurement
  - requirements-engineering
  - solar-pv
  - india
  - claude-api
categories:
  - ai
  - engineering
  - research
reading_time: 12
schema_type: "TechArticle"
related_repos:
  - pv-pranali
  - surya-yantra
  - antaryami-os
  - ShilpaSutra
---

# pv-pranali: Multi-Agent Equipment Procurement Orchestrator for India's Solar PV Labs

*Article seed — 10 May 2026 (Sunday — roadmap angle) · Srishti PV Lab Engineering*

**Engineering signal (10 May 2026):** [pv-pranali](https://github.com/ganeshgowri-ASA/pv-pranali) — the "Unified PV Test Equipment Proposal Orchestrator" — is confirmed live on Vercel (`pv-pranali-web`, production READY). Wave 6 is processing `iRIL-MxML-FRM-GE-003-Rev00`: a User Requirements Specification for a BBA P0 Steady-State Sun Simulator (MH/LED, 2-module, IEC 60904-9:2020 Class A+). The multi-agent system extracted 23 structured requirements, generated a requirements × IEC standard traceability matrix, and passed 30 unit tests — all before a purchase order is issued.

This is the layer of the Srishti PV Lab ecosystem that was previously implicit: **how does the lab translate a client's equipment needs into verifiable, IEC-traceable specifications?** pv-pranali answers this with a LangGraph + MCP multi-agent architecture that orchestrates ShilpaSutra, Antaryami-OS, and several other specialist agents.

## The Procurement Gap

The Srishti PV Lab stack — Surya Yantra (IV tracer), GanitaSutra (curve fitting), Antaryami-OS (AI scheduling), SolarLabX (LIMS), ShilpaSutra (CAD) — collectively addresses measurement, analysis, scheduling, and fixture design. But none of these repos answers the question that precedes all of them:

*What equipment does the lab actually need, and how do we verify that what is procured meets the client's requirements?*

In a solar testing context, this means:
- Parsing a client-supplied URS document (XLSX, PDF, or DOCX)
- Mapping each requirement to an IEC standard (IEC 60904-9 for solar simulators, IEC 60891 for correction procedures, IEC 61215 for module qualification)
- Identifying gaps where existing Srishti PV Lab equipment does not cover the URS requirements
- Generating a formal proposal linking each requirement to a specific instrument or procedure

This is a structured document intelligence problem — exactly what multi-agent LLM systems with MCP tool access solve well.

## pv-pranali Architecture

pv-pranali is a **LangGraph multi-agent system** with MCP tool bindings running on WSL/tmux via Claude Code. The Wave 6 architecture:

```
CLIENT URS DOCUMENT
  (XLSX / PDF / DOCX)
         │
         ▼
  URS INGEST AGENT (agents/urs/ingest.py)
  ┌──────────────────────────────────────┐
  │  XLSX → structured YAML (23 req.)   │
  │  IEC standard mapping (auto)        │
  │  Traceability matrix (Markdown)     │
  │  30 unit tests, all PASS            │
  └──────────────────┬───────────────────┘
                     │ structured requirements
                     ▼
  PORTFOLIO ORCHESTRATOR (LangGraph)
  ┌──────────────────────────────────────────────────────────────┐
  │  Wave routing: which specialist agent handles each req?      │
  │                                                              │
  │  → ShilpaSutra agent  (fixture geometry, CAD)               │
  │  → Antaryami agent    (scheduling + AI diagnostics)          │
  │  → Vidyalaya-Office   (documentation, SOP generation)        │
  │  → SuryaPrajna        (irradiance + solar resource)          │
  │  → Vidyut-Srishti     (power supply + electronic load spec)  │
  └──────────────────┬───────────────────────────────────────────┘
                     │ agent outputs
                     ▼
  PROPOSAL GENERATOR
  ┌──────────────────────────────────────┐
  │  Equipment proposal document         │
  │  Requirement coverage matrix         │
  │  Gap analysis (missing capabilities) │
  │  Cost estimation                     │
  └──────────────────────────────────────┘
```

### Wave 6 Deliverable: BBA P0 Sun Simulator URS

The URS for the BBA P0 Steady-State Sun Simulator (`iRIL-MxML-FRM-GE-003-Rev00`) requires:

| Requirement category | Count | IEC reference |
|---------------------|-------|---------------|
| Spectral irradiance class | 3 | IEC 60904-9:2020 §5 |
| Spatial non-uniformity | 2 | IEC 60904-9:2020 §6 |
| Temporal instability | 2 | IEC 60904-9:2020 §7 |
| Temperature range | 2 | IEC 60891:2021 §4 |
| 4-wire measurement | 3 | IEC 60904-1:2020 §7 |
| ISO 17025 calibration | 4 | NABL 121 §4.5 |
| Safety | 4 | IEC 61010-1:2010 |
| Software interface | 3 | — |
| **Total** | **23** | — |

The ingest agent produces `docs/urs/urs_extracted.yaml` (23 requirements as YAML objects with `id`, `text`, `iec_ref`, `priority`) and `docs/urs/traceability_matrix.md` (requirements × IEC standard cross-reference table). The 30 unit tests in `tests/test_urs_ingest.py` verify parser correctness against the YAML seed without committing the source XLSX (gitignored).

## The Research Narrative

### 1. Structured Requirements Engineering with LLMs

Converting an unstructured URS document into machine-readable, IEC-traceable requirements is a known bottleneck in equipment procurement. pv-pranali's approach — LLM extraction + structured YAML schema + unit-tested parser + traceability matrix — is a reproducible, version-controlled answer to this problem.

**Research contribution:** A requirements engineering pipeline for solar test equipment procurement that is open-source, IEC-aware, and integrates with downstream design (ShilpaSutra) and scheduling (Antaryami-OS) systems.

### 2. Multi-Agent Orchestration for Physical Lab Commissioning

pv-pranali's Wave routing (ShilpaSutra for CAD, Antaryami for scheduling, Vidyut-Srishti for power supply spec) is the first system in the Srishti PV Lab stack that explicitly coordinates all specialist agents in a single procurement workflow — what Wu et al. (2023) describe in AutoGen as *agent specialisation by capability*, applied to physical lab commissioning.

**Research contribution:** A reference architecture for multi-agent lab commissioning orchestrators, with the BBA P0 sun simulator procurement as the demonstration case.

### 3. Closing the Procurement-to-Measurement Loop

The unique contribution of pv-pranali in the ecosystem is making the procurement-to-measurement link explicit and machine-verifiable:

```
pv-pranali (URS → IEC requirements)
    → ShilpaSutra (parametric CAD fixture)
    → Surya Yantra (IV measurement)
    → GanitaSutra (parameter extraction)
    → Antaryami-OS (scheduled session)
    → SolarLabX (LIMS record)
    → pv-pranali (requirement coverage verified)
```

## Ideation → Implementation Diagram

```
IDEATION (problem)
  ┌──────────────────────────────────────────────────────────────┐
  │  Solar labs receive URS documents in various formats.        │
  │  Manual mapping to IEC standards is error-prone and slow.   │
  │  No open tool exists for automated URS-to-requirements      │
  │  extraction with IEC cross-referencing.                     │
  └────────────────────┬─────────────────────────────────────────┘
                       │
                       ▼
DESIGN (multi-agent + MCP)
  ┌──────────────────────────────────────────────────────────────┐
  │  LangGraph state machine · MCP tool bindings                 │
  │  Claude Code orchestrator · XLSX/PDF ingest                  │
  │  YAML schema for structured requirements                     │
  │  IEC standard mapping rules (60904-9, 60891, 61010)          │
  └────────────────────┬─────────────────────────────────────────┘
                       │
                       ▼
IMPLEMENTATION (Wave 6 — current)
  ┌──────────────────────────────────────────────────────────────┐
  │  ✅ agents/urs/ingest.py (XLSX → YAML, dry_run=True)         │
  │  ✅ docs/urs/urs_extracted.yaml (23 requirements)             │
  │  ✅ docs/urs/traceability_matrix.md                           │
  │  ✅ tests/test_urs_ingest.py (30/30 passing)                  │
  │  ✅ Vercel production READY (pv-pranali-web)                  │
  │  🔜 Specialist agent routing (Wave 7)                         │
  │  🔜 Proposal generator output (Wave 8)                        │
  └────────────────────┬─────────────────────────────────────────┘
                       │
                       ▼
OUTCOME
  ┌──────────────────────────────────────────────────────────────┐
  │  Client URS → structured YAML → IEC traceability matrix     │
  │  → ShilpaSutra CAD → Surya Yantra measurement               │
  │  → full NABL-traceable procurement-to-certification loop     │
  └──────────────────────────────────────────────────────────────┘
```

## Key Sections to Complete

- [ ] Wave 7: specialist agent routing — once implemented, add diagram showing ShilpaSutra/Antaryami/Vidyut-Srishti invocation flow
- [ ] Proposal generator output example — show a formatted equipment proposal section generated from the BBA P0 URS
- [ ] Gap analysis: which Srishti PV Lab instruments cover the BBA P0 URS requirements, and which gaps remain
- [ ] IEC 60904-9:2020 Class A+ classification criteria — expand §3 with specific limits for spatial non-uniformity and temporal instability
- [ ] Link to pv-pranali Vercel deployment for live demo
- [ ] Target venue: *Applied Energy* (procurement intelligence paper) or *Solar Energy* (lab management case study)

## References

1. pv-pranali: [github.com/ganeshgowri-ASA/pv-pranali](https://github.com/ganeshgowri-ASA/pv-pranali).
2. Wu Q., Bansal G., Zhang J., et al. (2023). *AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation*. arXiv:2308.08155.
3. IEC 60904-9:2020, *Photovoltaic devices — Part 9: Solar simulator performance requirements*. IEC, Geneva.
4. IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and irradiance corrections to measured I-V characteristics*. IEC, Geneva.
5. IEC 60904-1:2020, *Measurement principles for terrestrial photovoltaic (PV) devices*. IEC, Geneva.
6. IEC 61010-1:2010+A1:2016, *Safety requirements for electrical equipment for measurement, control, and laboratory use*. IEC, Geneva.
7. NABL, *Specific Criteria for Accreditation of Testing Laboratories in the field of Solar Energy*, NABL 121, 2023.
8. Anthropic (2026). *Claude Code: agentic coding with tool use and MCP*. Technical documentation.
9. Surya Yantra IV tracer: [github.com/ganeshgowri-ASA/surya-yantra](https://github.com/ganeshgowri-ASA/surya-yantra).

---

## Peer Review

*Sunday 10 May 2026 — Article seed review*

### Technical Accuracy

- [ ] pv-pranali architecture verified against commit history ✅ (Wave 6, PR #26 merged)
- [ ] URS parameters verified from pv-pranali Vercel deployment commit metadata ✅
- [ ] 23 requirements, 30 unit tests — verified from commit message ✅
- [ ] LangGraph + MCP architecture confirmed from repo description ✅
- [ ] Vercel production READY confirmed ✅

### Citation Completeness

- [ ] IEC 60904-9:2020 confirmed ✅
- [ ] AutoGen arXiv:2308.08155 confirmed ✅
- [ ] IEC 60891:2021 confirmed ✅
- [ ] NABL 121 2023 confirmed ✅

### Code Cross-References

- [ ] `agents/urs/ingest.py` — verify path once pv-pranali repo is examined
- [ ] `docs/urs/urs_extracted.yaml` — verify against actual file
- [ ] `tests/test_urs_ingest.py` — verify test count and coverage

### Reviewer Sign-off

| Role | Name | Date | Signature |
|------|------|------|----------|
| Technical reviewer (multi-agent systems) | — | — | — |
| Standards reviewer (IEC 60904-9) | — | — | — |
| Editor | — | — | — |

*Assign reviewers in the GitHub PR before promoting `draft: true → false`.*
