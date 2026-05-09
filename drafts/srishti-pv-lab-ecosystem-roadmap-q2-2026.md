---
title: "Srishti PV Lab Q2 2026 Roadmap: Four Repositories, One Solar Verification Pipeline"
seo_title: "Srishti PV Lab Q2 2026 Roadmap: Surya Yantra + GanitaSutra + Antaryami-OS + SolarLabX"
description: "How Surya Yantra, GanitaSutra-v0, Antaryami-OS, and SolarLabX converge into a NABL-accreditation-ready open-source PV verification pipeline — Q2 2026 milestone update."
keywords:
  - Srishti PV Lab roadmap
  - solar PV open source India
  - NABL accreditation PV lab
  - Surya Yantra roadmap
  - GanitaSutra-v0
  - Antaryami-OS solar scheduling
  - SolarLabX LIMS
  - IEC 60891 automation
  - PV module characterisation India
  - open source solar verification
  - photovoltaic ecosystem
  - Q2 2026 milestones
canonical: "https://surya-yantra.srishtipvlab.in/posts/srishti-pv-lab-ecosystem-roadmap-q2-2026"
og:
  title: "Srishti PV Lab Q2 2026 Roadmap: Four Repos, One Verification Pipeline"
  description: "Surya Yantra + GanitaSutra + Antaryami-OS + SolarLabX converge this quarter. NABL audit preparation, parameter-free corrections, AI scheduling — status and milestones."
  image: "/og/srishti-pv-lab-roadmap-q2-2026.png"
  type: "article"
twitter:
  card: "summary_large_image"
  title: "Srishti PV Lab Q2 2026: Open-Source PV Verification Pipeline"
  description: "Four repos converging: Surya Yantra (IV tracer), GanitaSutra (curve fitting), Antaryami-OS (AI scheduling), SolarLabX (LIMS). NABL audit looming."
  image: "/og/srishti-pv-lab-roadmap-q2-2026.png"
author: "Srishti PV Lab Engineering"
date: "2026-05-04"
lastmod: "2026-05-09"
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
categories:
  - roadmap
  - research
reading_time: 10
schema_type: "Article"
related_repos:
  - surya-yantra
  - GanitaSutra-v0
  - antaryami-os
  - SolarLabX
  - ShilpaSutra
---

# Srishti PV Lab Q2 2026 Roadmap: Four Repositories, One Solar Verification Pipeline

*4 May 2026 · Updated 9 May 2026 · Srishti PV Lab, Jamnagar*

Three months into 2026, four independently developed repositories are converging into something more significant than any one of them could achieve alone: a complete, open-source, NABL-accreditation-ready solar PV module verification pipeline.

## The Convergence Moment

As of 9 May 2026:

| Repository | Status | Sprint activity (9 May 2026) |
|-----------|--------|--------------------------|
| [Surya Yantra](https://github.com/ganeshgowri-ASA/surya-yantra) | Hardware commissioned; web app on Vercel | NABL prep, firmware publication |
| [GanitaSutra-v0](https://github.com/ganeshgowri-ASA/GanitaSutra-v0) | PV toolbox active sprint | **16 open issues** (pushed 8 May); 5PDM LM-fitting sprint |
| [Antaryami-OS](https://github.com/ganeshgowri-ASA/antaryami-os) | AI scheduling active development | **42 open issues** (pushed 9 May — **+9 today**, +27%) |
| [SolarLabX](https://github.com/ganeshgowri-ASA/SolarLabX) | LIMS / QMS target | **18 open issues** (pushed 8 May); LIMS sprint stable |
| [ShilpaSutra](https://github.com/ganeshgowri-ASA/ShilpaSutra) | AI-to-CAD platform | **37 open issues** (pushed 9 May — **+4 today**); active sprint |

**9 May signal:** Both antaryami-os (+9 issues, pushed 02:15 IST) and ShilpaSutra (+4 issues, pushed 03:36 IST) pushed to main today before 07:00 IST — concurrent early-morning sprints. Antaryami-OS at 42 issues is now the highest-activity repo in the stack.

## The Ecosystem Architecture

```
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
  │  · IEC 60891 P1–P4 corrections (lib/iec60891.ts)             │
  │  · SMMF + IAM pipeline (lib/smmf.ts, lib/iam.ts)             │
  │  · REST API + WebSocket real-time                            │
  └────────┬──────────────┬─────────────────────────────────────┘
           │ extractModuleParams() │ notifySessionEvent()
           ▼                      ▼
  PARAMETER EXTRACTION      AI ORCHESTRATION
  ┌──────────────────┐      ┌─────────────────────────────────────┐
  │  GANITASUTRA-v0  │      │  ANTARYAMI-OS (42 issues, 9 May)    │
  │  16 issues       │      │  · pv-session-planner (Sonnet 4.6)  │
  │  · 5PDM LM-fit   │      │  · pv-fault-router (Haiku/Opus tier)│
  │  · α, β, Rₛ, κ   │      │  · multi-lab-coordinator            │
  │    auto-extract  │      └─────────────────┬───────────────────┘
  └──────────────────┘                        │ LIMS push
                                              ▼
  LIMS & CERTIFICATION
  ┌──────────────────────────────────────────────────────────────┐
  │  SOLARLAB-X (18 issues, pushed 8 May)                        │
  │  · Module test record database                               │
  │  · IEC-accredited audit trail                               │
  │  · Inter-lab QC comparison                                  │
  └──────────────────────────────────────────────────────────────┘

  DESIGN & FIXTURE (new layer — in sprint)
  ┌──────────────────────────────────────────────────────────────┐
  │  SHILPASUTRA (37 issues, pushed 9 May)                       │
  │  · Parametric CAD for rack geometry (issue #13)              │
  │  · Kelvin harness routing optimisation                       │
  │  · CFD thermal map → T_cell[slot] for scheduler             │
  └──────────────────────────────────────────────────────────────┘
```

## The Full Ideation → Implementation → Validation Diagram

This is the Friday publication-polish deliverable: the complete pipeline from research problem to NABL audit artefact.

```
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
  │  ⚙️  GanitaSutra 5PDM LM fitting (16 issues — active sprint)   │
  │  ⚙️  Antaryami-OS pv-session-planner (42 issues — active sprint)│
  │  ⚙️  SolarLabX LIMS record push (18 issues — active sprint)     │
  │  ⚙️  ShilpaSutra rack CAD (37 issues — active sprint)           │
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
| GanitaSutra 5PDM fitting module merged | GanitaSutra-v0 | May 2026 | ⚙️ In sprint (16 issues) |
| Antaryami-OS pv-session-planner skill PR | Antaryami-OS | May 2026 | ⚙️ In sprint (42 issues, accelerating) |
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
6. NABL, *Specific Criteria for Accreditation of Testing Laboratories in the field of Solar Energy*, NABL 121, 2023.
7. IEC 60891:2021 §8, *Uncertainty of the correction procedures*. IEC, Geneva.
8. Jahn U., Frischemeier G., Mayer K. (2014). *PV system performance assessment — IEA-PVPS Task 13 outcome*. 29th EU PVSEC.

---

## Peer Review

*Friday 9 May 2026 — Publication-polish pass*

### Technical Accuracy

- [ ] All repo issue counts verified against live GitHub as of 9 May 2026 ✅ (antaryami-os 42, GanitaSutra-v0 16, SolarLabX 18, ShilpaSutra 37)
- [ ] Ideation→implementation diagram steps match repo commit history and open issues
- [ ] Q2 milestone health statuses reviewed against actual sprint velocity
- [ ] NABL critical path items verified against NABL 121 §4.2–4.6

### Citation Completeness

- [ ] All repo links resolve to live GitHub repositories ✅
- [ ] NABL 121 2023 edition confirmed ✅
- [ ] IEC 60891:2021 §8 confirmed ✅

### Reviewer Sign-off

| Role | Name | Date | Signature |
|------|------|------|----------|
| Technical reviewer | — | — | — |
| Standards reviewer | — | — | — |
| Editor | — | — | — |

*Assign reviewers in the GitHub PR before promoting `draft: true → false`.*
