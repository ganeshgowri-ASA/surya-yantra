---
title: "Multi-Agent Test Specification Generation: PV-Pranali × Surya Yantra"
slug: "pv-pranali-test-spec-accuracy"
status: "seed"
date: "2026-05-28"
lastmod: "2026-05-28"
author: "Srishti PV Lab"
affiliation: "Srishti PV Lab, Jamnagar, Gujarat, India"
target_venue: "Renewable Energy (Elsevier) or arXiv cs.MA"
keywords:
  - multi-agent systems
  - LangGraph
  - MCP
  - PV test specification
  - IEC 61215
  - LLM accuracy
  - equipment proposal
  - test automation
  - Claude
  - solar PV characterisation
---

# Multi-Agent Test Specification Generation: Accuracy of PV-Pranali × Surya Yantra Orchestration

## Abstract (draft)

PV-Pranali is a multi-agent orchestrator (LangGraph + Model Context Protocol) that
generates PV test equipment proposals by reasoning over the capabilities of ShilpaSutra
(parametric CAD), Antaryami-OS (skill execution), SuryaPrajna (AI diagnostics),
Vidyut-Srishti (power conversion), and Surya Yantra (IV curve tracing). This paper
asks a concrete research question: when PV-Pranali receives a natural-language test
requirement (e.g., "certify this 450 Wp bifacial IBC module per IEC 61215-1:2021"),
how accurately does the generated test specification match a human expert's
specification on the dimensions of instrument selection, parameter ranges, correction
procedure choice, and safety configuration?

## 1. Motivation

### 1.1 The proposal generation bottleneck

A full IEC 61215-1:2021 qualification proposal requires:
- Selection of ~12 test sequences (thermal cycling, damp heat, humidity freeze, UV, etc.)
- IV measurement conditions (G, T, scan speed) for each sequence
- Correction procedure selection (IEC 60891 P1–P4) based on the module's technology
- Instrument ranges (ESL-Solar 500: 0–300V/27A for the modules in BOM.md)
- Safety configuration (MUX interlock, SOUR OFF timing, arc-flash PPE requirements)

Currently, this requires a human expert taking 4–8 hours. PV-Pranali targets < 15 min.

### 1.2 Engineering signal

PV-Pranali's Vercel deployment (`pv-pranali-web`) went live 2026-05-03. The system
orchestrates five repos via Claude Code + MiMo on WSL/tmux. It is the missing
cross-repo integration layer that connects Surya Yantra's `/api/sessions` and
`/api/corrections/apply` to the broader Srishti ecosystem.

## 2. Research question

> For a given natural-language IEC 61215 test requirement, does PV-Pranali's
> multi-agent generated specification match a human expert's specification on:
> (a) instrument selection, (b) correction procedure, (c) parameter ranges,
> (d) safety configuration — and what is the F1 score across these four dimensions?

## 3. Proposed method (outline)

### 3.1 Test set construction

- 20 diverse natural-language test requirements (5 per technology: HJT, TOPCon, IBC, CdTe)
- Ground truth: human expert specifications from IEC 61215-1:2021 Annex A test sequences
- Evaluators: two independent PV engineers blind to the LLM output

### 3.2 Evaluation dimensions

| Dimension | Metric | Pass threshold |
|-----------|--------|----------------|
| Instrument selection | Recall on required instruments | ≥ 0.90 |
| Correction procedure | Exact match (P1/P2/P3/P4) | ≥ 0.80 |
| Parameter ranges | ± 5% on G, T, scan speed | ≥ 0.85 |
| Safety configuration | Precision on safety items | ≥ 0.95 |

### 3.3 Surya Yantra integration point

PV-Pranali → `POST /api/sessions` (with generated parameters) → `POST /api/corrections/apply`
(with auto-selected procedure) → `GET /api/reports/:id/download?format=pdf`.

The research contribution is the end-to-end evaluation of this pipeline under real
IEC 61215-1 constraints, including the safety layer (§4 of `docs/HARDWARE-SETUP.md`).

## 4. TODO before draft

- [ ] Obtain PV-Pranali API spec and endpoint list from `pv-pranali` repo
- [ ] Define the 20-requirement test set with a PV engineer at Srishti lab
- [ ] Run pilot evaluation on 3–5 requirements to calibrate the scoring rubric
- [ ] Document the MCP tool calls PV-Pranali makes to Surya Yantra
- [ ] Identify which LLM model (Claude opus-4-7 vs haiku-4-5) is used for each
  orchestration step and its effect on accuracy

## References (seed)

1. IEC 61215-1:2021, *Terrestrial photovoltaic (PV) modules — Design qualification
   and type approval — Part 1: Test requirements*. IEC, Geneva.
2. IEC 60891:2021, *PV devices — Procedures for temperature and irradiance corrections
   to measured I-V characteristics*. IEC, Geneva.
3. Wang L. et al. (2024). *A survey on large language model based autonomous agents.*
   Front. Comput. Sci., 18(6), 186345. DOI: 10.1007/s11704-024-40231-1
4. Anthropic (2024). *Model Context Protocol specification*. Anthropic, San Francisco.
   https://modelcontextprotocol.io/specification
5. IEC 61215-2:2021, *Terrestrial PV modules — Design qualification and type approval
   — Part 2: Test procedures*. IEC, Geneva.
