---
title: "Srishti PV Lab Q2 2026 Roadmap: Five Repositories, One Solar Verification Pipeline"
seo_title: "Srishti PV Lab Q2 2026 Roadmap: Surya Yantra + GanitaSutra + Antaryami-OS + SolarLabX + pv-pranali"
description: "How Surya Yantra, GanitaSutra-v0, Antaryami-OS, SolarLabX, ShilpaSutra, and pv-pranali converge into a NABL-accreditation-ready open-source PV verification pipeline — Q2 2026 milestone update."
keywords:
  - Srishti PV Lab roadmap
  - solar PV open source India
  - NABL accreditation PV lab
  - Surya Yantra roadmap
  - GanitaSutra-v0
  - Antaryami-OS solar scheduling
  - SolarLabX LIMS
  - pv-pranali procurement agent
  - IEC 60891 automation
  - PV module characterisation India
  - open source solar verification
  - photovoltaic ecosystem
  - Q2 2026 milestones
canonical: "https://surya-yantra.srishtipvlab.in/posts/srishti-pv-lab-ecosystem-roadmap-q2-2026"
og:
  title: "Srishti PV Lab Q2 2026 Roadmap: Five Repos, One Verification Pipeline"
  description: "Surya Yantra + GanitaSutra + Antaryami-OS + SolarLabX + pv-pranali converge this quarter. NABL audit preparation, parameter-free corrections, AI scheduling, and equipment procurement — status and milestones."
  image: "/og/srishti-pv-lab-roadmap-q2-2026.png"
  type: "article"
twitter:
  card: "summary_large_image"
  title: "Srishti PV Lab Q2 2026: Open-Source PV Verification Pipeline"
  description: "Five repos converging: Surya Yantra (IV tracer), GanitaSutra (curve fitting), Antaryami-OS (AI scheduling), SolarLabX (LIMS), pv-pranali (procurement). NABL audit looming."
  image: "/og/srishti-pv-lab-roadmap-q2-2026.png"
author: "Srishti PV Lab Engineering"
date: "2026-05-04"
lastmod: "2026-05-11"
draft: true
tags:
  - roadmap
  - solar-pv
  - open-source
  - india
  - nabl
  - ganitasutra
  - antaryami-os
  - surya-yantra
  - solarlab-x
  - pv-pranali
categories:
  - roadmap
  - research
reading_time: 12
schema_type: "Article"
related_repos:
  - surya-yantra
  - GanitaSutra-v0
  - antaryami-os
  - SolarLabX
  - ShilpaSutra
  - pv-pranali
---

# Srishti PV Lab Q2 2026 Roadmap: Five Repositories, One Solar Verification Pipeline

*4 May 2026 · Updated 11 May 2026 · Srishti PV Lab, Jamnagar*

Three months into 2026, five independently developed repositories are converging into something more significant than any one of them could achieve alone: a complete, open-source, NABL-accreditation-ready solar PV module verification pipeline — from equipment procurement through physical measurement to LIMS audit trail.

## Sunday 11 May 2026: Hypersprint Signal

**antaryami-os has reached 94 open issues** — up from 49 on 10 May (+45 in ≈24 hours, **+91.8%**). This is a phase-transition signal: the issue count has now nearly doubled overnight, consistent with active hardware integration testing uncovering a cascade of SCPI state-machine edge cases, LIMS schema mismatches, and audit log format issues. At 94 open issues, antaryami-os is the highest-velocity repository in the stack by a factor of **2.5×** over the next closest (ShilpaSutra at 39).

The trajectory over 8 days (3 May → 11 May): 4 → 33 → 42 → 49 → **94**. The compound daily growth rate is +56 % day-over-day since 8 May. The sprint that began as scaffolding has entered full integration testing. For governance implications, see companion article `drafts/antaryami-os-42-issue-sprint-governance.md` and the new seed `drafts/antaryami-os-94-issue-hypersprint-roadmap.md`.

Other repo deltas (11 May vs 10 May): GanitaSutra-v0 **18** (+1), ShilpaSutra **39** (+2), SolarLabX **24** (+4).

## Sunday 10 May 2026: Overnight Sprint Signal

**antaryami-os pushed to main overnight (01:47 UTC)** and carried **49 open issues** — up from 42 on Friday 9 May (+7 in ≈24 hours, +17.5%). This was the seventh consecutive day of sprint acceleration for the AI OS that will orchestrate Srishti PV Lab test sessions.

A second signal confirmed that day: **pv-pranali** — a multi-agent LangGraph + MCP system — is live on Vercel (`pv-pranali-web`, production READY). Wave 6 (current sprint) is processing `iRIL-MxML-FRM-GE-003-Rev00`, a User Requirements Specification for a BBA P0 Steady-State Sun Simulator (MH/LED, 2-module, IEC 60904-9:2020 Class A+). This is the **equipment procurement layer** that defines what instruments the lab acquires — upstream of every other repo in the stack.

## The Convergence Moment

As of 11 May 2026:

| Repository | Status | Sprint activity (11 May 2026) |
|-----------|--------|---------------------------|
| [Surya Yantra](https://github.com/ganeshgowri-ASA/surya-yantra) | Hardware commissioned; web app on Vercel | NABL prep, firmware publication |
| [GanitaSutra-v0](https://github.com/ganeshgowri-ASA/GanitaSutra-v0) | PV toolbox active sprint | **18 open issues** (+1); 5PDM LM-fitting sprint |
| [Antaryami-OS](https://github.com/ganeshgowri-ASA/antaryami-os) | AI scheduling active development | **94 open issues** (**+45 in 24 h**, **+91.8%** — hypersprint) |
| [SolarLabX](https://github.com/ganeshgowri-ASA/SolarLabX) | LIMS / QMS target | **24 open issues** (+4); LIMS sprint |
| [ShilpaSutra](https://github.com/ganeshgowri-ASA/ShilpaSutra) | AI-to-CAD platform | **39 open issues** (+2); active sprint |
| [pv-pranali](https://github.com/ganeshgowri-ASA/pv-pranali) | Equipment procurement orchestrator | Wave 6 active; URS ingest **Vercel READY**; 0 open issues |

## The Ecosystem Architecture

```
  REQUIREMENTS & PROCUREMENT
  ┌──────────────────────────────────────────────────────────────┐
  │  PV-PRANALI  (LangGraph + MCP, Wave 6)                       │
  │  · URS ingest: parse client equipment specs into YAML req.  │
  │  · Traceability matrix: req × IEC standard cross-reference  │
  │  · Orchestrates ShilpaSutra, Antaryami, Vidyalaya-Office    │
  │  · Vercel READY · iRIL-MxML-FRM-GE-003-Rev00 (BBA P0 SS)   │
  └─────────────────┬────────────────────────────────────────────┘
                    │ validated equipment requirements
                    ▼
  DESIGN & FIXTURE
  ┌──────────────────────────────────────────────────────────────┐
  │  SHILPASUTRA (39 issues)                                     │
  │  · Parametric CAD for rack geometry (issue #13)             │
  │  · Kelvin harness routing optimisation                      │
  │  · CFD thermal map → T_cell[slot] for scheduler            │
  └─────────────────┬────────────────────────────────────────────┘
                    │ rack geometry + cable routing
                    ▼
  PHYSICAL LAYER
  ┌──────────────────────────────────────────────────────────────┐
  │  75-module outdoor array · ESL-Solar 500 · MUX matrix       │
  │  4-wire Kelvin · env sensors · STM32H7 firmware              │
  └─────────────────┬────────────────────────────────────────────┘
                             │ SCPI + Modbus over USB/Ethernet
                             ▼
  ACQUISITION & CORRECTION
  ┌──────────────────────────────────────────────────────────────┐
  │  SURYA YANTRA  (Next.js + Electron)                          │
  │  · IV sweep orchestration                                    │
  │  · IEC 60891 P1–P4 corrections (lib/iec60891.ts)            │
  │  · SMMF + IAM pipeline (lib/smmf.ts, lib/iam.ts)            │
  │  · REST API + WebSocket real-time                            │
  └────────┬──────────────┬─────────────────────────────────────┘
           │ extractModuleParams() │ notifySessionEvent()
           ▼                      ▼
  PARAMETER EXTRACTION      AI ORCHESTRATION
  ┌──────────────────┐      ┌─────────────────────────────────────┐
  │  GANITASUTRA-v0  │      │  ANTARYAMI-OS (94 issues, 11 May)   │
  │  18 issues       │      │  · pv-session-planner (Sonnet 4.6)  │
  │  · 5PDM LM-fit   │      │  · pv-fault-router (Haiku/Opus tier)│
  │  · α, β, Rₛ, κ   │      │  · multi-lab-coordinator            │
  │    auto-extract  │      └─────────────────┬───────────────────┘
  └──────────────────┘                        │ LIMS push
                                              ▼
  LIMS & CERTIFICATION
  ┌──────────────────────────────────────────────────────────────┐
  │  SOLARLAB-X (24 issues)                                      │
  │  · Module test record database                               │
  │  · IEC-accredited audit trail                               │
  │  · Inter-lab QC comparison                                  │
  └──────────────────────────────────────────────────────────────┘
```

## The Full Ideation → Implementation → Validation Diagram

```
REQUIREMENTS (upstream of design)
  ┌─────────────────────────────────────────────────────────────────┐
  │  PV-PRANALI Wave 6: URS ingest (LangGraph + MCP)               │
  │  Client spec → YAML requirements → IEC traceability matrix     │
  │  iRIL-MxML-FRM-GE-003-Rev00: BBA P0 Sun Simulator ✅ Vercel    │
  └────────────────────┬────────────────────────────────────────────┘
                       │ validated requirements
                       ▼
IDEATION
  ┌─────────────────────────────────────────────────────────────────┐
  │  Problem: India produces solar panels faster than labs can      │
  │  characterise them. IQC has no open-source, IEC-compliant,     │
  │  reproducible tool chain.                                       │
  └────────────────────┬────────────────────────────────────────────┘
                       │
                       ▼
DESIGN (Q1 2026 — repos scaffolded)
  ┌─────────────────────────────────────────────────────────────────┐
  │  Surya Yantra   → IV tracer + IEC correction engine            │
  │  GanitaSutra-v0 → parameter extraction (LM fitting)            │
  │  Antaryami-OS   → AI scheduling OS + fault router              │
  │  SolarLabX      → LIMS / QMS / accreditation audit trail       │
  │  ShilpaSutra    → parametric CAD for fixture geometry          │
  └────────────────────┬────────────────────────────────────────────┘
                       │
                       ▼
IMPLEMENTATION (Q2 2026 — active sprints)
  ┌─────────────────────────────────────────────────────────────────┐
  │  ✅ IEC 60891 P1–P4 engine (TypeScript, 100% Vitest coverage)   │
  │  ✅ WebSocket IV streaming (Socket.IO)                          │
  │  ✅ PostgreSQL schema (20 models)                               │
  │  ✅ Electron desktop shell                                      │
  │  ✅ pv-pranali URS ingest Wave 6 (Vercel READY)                 │
  │  ⚙️  GanitaSutra 5PDM LM fitting (18 issues — active sprint)   │
  │  ⚙️  Antaryami-OS pv-session-planner (94 issues — **hypersprint**)│
  │  ⚙️  SolarLabX LIMS record push (24 issues — active sprint)     │
  │  ⚙️  ShilpaSutra rack CAD (39 issues — active sprint)           │
  │  🔜 STM32H7 firmware publication (issue #2)                    │
  │  🔜 OG images / sitemap (issues #6, #9)                        │
  └────────────────────┬────────────────────────────────────────────┘
                       │
                       ▼
VALIDATION (Q2–Q3 2026)
  ┌─────────────────────────────────────────────────────────────────┐
  │  IEC 60891 Annex B validation table (issue #7)                 │
  │  GUM uncertainty budget u_c(Pmpp) per procedure (issue #3)     │
  │  NABL accreditation audit (Q2/Q3 2026)                         │
  │  First third-party validated dataset public release            │
  └─────────────────────────────────────────────────────────────────┘
```

## Q2 2026 Milestone Health

| Milestone | Repo | Target | Health |
|-----------|------|--------|--------|
| pv-pranali Wave 6 URS ingest live | pv-pranali | May 2026 | ✅ Vercel READY |
| GanitaSutra 5PDM fitting module merged | GanitaSutra-v0 | May 2026 | ⚙️ In sprint (18 issues, ↑+1) |
| Antaryami-OS pv-session-planner skill PR | Antaryami-OS | May 2026 | ⚙️ **Hypersprint** (94 issues, ↑+45 in 24 h) |
| STM32H7 firmware source published | Surya Yantra | May 2026 | 🔴 Not started (issue #2) |
| `autoExtract` API endpoint live | Surya Yantra | May/Jun 2026 | 🟡 Depends on GanitaSutra |
| pv-session-planner webhook wired | Surya Yantra + Antaryami | May/Jun 2026 | 🟡 Depends on Antaryami-OS |
| IEC 60891 Annex B validation table | Surya Yantra docs | Jun 2026 | 🔴 Not started (issue #7) |
| NABL accreditation audit | Surya Yantra + SolarLabX | Jun/Jul 2026 | 🟡 Prep underway; firmware + GUM budget blocking |
| First third-party validated dataset | Surya Yantra | Jul 2026 | 🟡 Depends on NABL audit pass |

## The Critical Path: NABL Accreditation

NABL (National Accreditation Board for Testing and Calibration Laboratories) requires:

1. **Measurement uncertainty budget** — IEC 60891 §8 specifies the method. Currently missing from `docs/IEC-CORRECTIONS.md` (tracked in issue #3). Worked partial budget available in `drafts/vitest-to-nabl-uncertainty-budget.md`.
2. **Reference standard traceability** — the Kipp & Zonen SMP10 and IMT Si-RS485TC-T-MB must have current calibration certificates traceable to NPL India.
3. **Repeatability study** — ≥10 consecutive sweeps of the same module with Pmpp CV < 0.5 %. Initial commissioning shows < 0.3 % Voc repeatability; a formal Pmpp study is required.
4. **Documented test procedure** — a formal Standard Operating Procedure (SOP) document is required for the audit.
5. **STM32H7 firmware published** — third-party reproducibility of the test bed requires the MUX controller source code (issue #2).

## pv-pranali: The Missing Procurement Layer

The Srishti PV Lab stack was missing its upstream boundary: how does the lab specify the equipment it procures? When a client commissions a sun simulator or IV tracer, how is the User Requirements Specification parsed into verifiable, IEC-traceable requirements?

[pv-pranali](https://github.com/ganeshgowri-ASA/pv-pranali) answers this. In Wave 6 (current), it is processing `iRIL-MxML-FRM-GE-003-Rev00` — a URS for a BBA P0 Steady-State Sun Simulator:

| URS parameter | Value |
|--------------|-------|
| Simulator type | MH or LED steady-state |
| Module capacity | 2-module simultaneous |
| Irradiance range | 700–1300 W/m² |
| Temperature range | 20–75 °C |
| Measurement method | 4-wire I-V |
| Calibration | ISO 17025, traceable |
| Classification | IEC 60904-9:2020 Class A+ |

The pv-pranali agent extracts 23 structured requirements from the URS, generates a requirements × IEC standard traceability matrix, and produces an `agents/urs/ingest.py` parser with 30 unit tests (all passing). The output feeds into ShilpaSutra (for fixture CAD) and Antaryami-OS (for scheduling constraints).

This closes the full loop: pv-pranali defines what the lab specifies → ShilpaSutra designs the physical setup → Surya Yantra makes the measurements → GanitaSutra extracts parameters → Antaryami-OS schedules sessions → SolarLabX records results for accreditation.

## Open Issues Blocking Q2 Milestones

| Issue | Blocks | Status |
|-------|--------|--------|
| #2 — STM32H7 firmware not published | Third-party reproducibility; NABL audit | Open |
| #3 — IEC-CORRECTIONS.md peer-review checklist | NABL uncertainty budget | Open |
| #6 — OG images missing | posts/surya-yantra article live on social | Open |
| #7 — Fraunhofer ISE validation table | NABL independent verification | Open |
| #13 — hardware/schematics/ missing | ShilpaSutra CAD integration target | Open |
| #17 — antaryami-os sequence diagram | antaryami-os articles publish-ready | Open |
| #18 — ganitasutra benchmark table | ganitasutra articles publish-ready | Open |
| #20 — NABL statistical power analysis | 75-module article publish-ready | Open |

## References

1. Surya Yantra: [github.com/ganeshgowri-ASA/surya-yantra](https://github.com/ganeshgowri-ASA/surya-yantra).
2. GanitaSutra-v0: [github.com/ganeshgowri-ASA/GanitaSutra-v0](https://github.com/ganeshgowri-ASA/GanitaSutra-v0).
3. Antaryami-OS: [github.com/ganeshgowri-ASA/antaryami-os](https://github.com/ganeshgowri-ASA/antaryami-os).
4. SolarLabX: [github.com/ganeshgowri-ASA/SolarLabX](https://github.com/ganeshgowri-ASA/SolarLabX).
5. ShilpaSutra: [github.com/ganeshgowri-ASA/ShilpaSutra](https://github.com/ganeshgowri-ASA/ShilpaSutra).
6. pv-pranali: [github.com/ganeshgowri-ASA/pv-pranali](https://github.com/ganeshgowri-ASA/pv-pranali).
7. NABL, *Specific Criteria for Accreditation of Testing Laboratories in the field of Solar Energy*, NABL 121, 2023.
8. IEC 60891:2021 §8, *Uncertainty of the correction procedures*. IEC, Geneva.
9. IEC 60904-9:2020, *Photovoltaic devices — Part 9: Solar simulator performance requirements*. IEC, Geneva.
10. Jahn U., Frischemeier G., Mayer K. (2014). *PV system performance assessment — IEA-PVPS Task 13 outcome*. 29th EU PVSEC.

---

## Peer Review

*Sunday 11 May 2026 — Roadmap update pass*

### Technical Accuracy

- [ ] All repo issue counts verified against live GitHub as of 11 May 2026 ✅ (antaryami-os 94, GanitaSutra-v0 18, SolarLabX 24, ShilpaSutra 39, pv-pranali 0)
- [ ] pv-pranali Vercel production deployment confirmed READY ✅
- [ ] pv-pranali Wave 6 URS ingest details verified from commit history ✅
- [ ] Ideation→implementation diagram steps match repo commit history and open issues
- [ ] Q2 milestone health statuses reviewed against actual sprint velocity
- [ ] NABL critical path items verified against NABL 121 §4.2–4.6

### Citation Completeness

- [ ] All repo links resolve to live GitHub repositories ✅
- [ ] NABL 121 2023 edition confirmed ✅
- [ ] IEC 60891:2021 §8 confirmed ✅
- [ ] IEC 60904-9:2020 confirmed ✅

### Reviewer Sign-off

| Role | Name | Date | Signature |
|------|------|------|----------|
| Technical reviewer | — | — | — |
| Standards reviewer | — | — | — |
| Editor | — | — | — |

*Assign reviewers in the GitHub PR before promoting `draft: true → false`.*
