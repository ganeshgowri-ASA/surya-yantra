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
lastmod: "2026-05-04"
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
---

# Srishti PV Lab Q2 2026 Roadmap: Four Repositories, One Solar Verification Pipeline

*4 May 2026 · Srishti PV Lab, Jamnagar*

Three months into 2026, four independently developed repositories are converging into something more significant than any one of them could achieve alone: a complete, open-source, NABL-accreditation-ready solar PV module verification pipeline. This article maps what each repo delivers in Q2 2026, how they connect, what's on the critical path, and what's still missing before the pipeline is ready for an accreditation audit.

## The Convergence Moment

As of the first week of May 2026:

| Repository | Status | Sprint activity |
|-----------|--------|----------------|
| [Surya Yantra](https://github.com/ganeshgowri-ASA/surya-yantra) | Hardware commissioned; web app deployed to Vercel | NABL prep, firmware publication |
| [GanitaSutra-v0](https://github.com/ganeshgowri-ASA/GanitaSutra-v0) | PV toolbox active sprint | 9 open issues; curve-fitting module in development |
| [Antaryami-OS](https://github.com/ganeshgowri-ASA/antaryami-os) | AI scheduling active development | 4 open issues; pv-session-planner skill in development |
| [SolarLabX](https://github.com/ganeshgowri-ASA/SolarLabX) | LIMS / QMS target | Quieter period (13 open issues); webhook target defined |

Two repos are in active sprints. Two are defined targets. The integration surface between all four is already designed; only the GanitaSutra and Antaryami-OS packages are on the critical path.

## The Ecosystem Architecture

```
  PHYSICAL LAYER
  ┌─────────────────────────────────────────────────────────┐
  │  75-module outdoor array · ESL-Solar 500 · MUX matrix  │
  │  4-wire Kelvin · env sensors · STM32H7 firmware         │
  └─────────────────────────┬───────────────────────────────┘
                             │ SCPI + Modbus over USB/Ethernet
                             ▼
  ACQUISITION & CORRECTION
  ┌─────────────────────────────────────────────────────────┐
  │  SURYA YANTRA  (Next.js + Electron)                     │
  │  · IV sweep orchestration                               │
  │  · IEC 60891 P1–P4 corrections (lib/iec60891.ts)        │
  │  · SMMF + IAM pipeline (lib/smmf.ts, lib/iam.ts)        │
  │  · REST API + WebSocket real-time                        │
  └────────┬──────────────────────┬──────────────────────────┘
           │ extractModuleParams() │ notifySessionEvent()
           ▼                      ▼
  PARAMETER EXTRACTION      AI ORCHESTRATION
  ┌─────────────────┐       ┌────────────────────────────────┐
  │  GANITASUTRA    │       │  ANTARYAMI-OS                  │
  │  · 5PDM curve   │       │  · pv-session-planner (Sonnet) │
  │    fitting      │       │  · pv-fault-router             │
  │  · α, β, Rₛ     │       │    (Haiku / Opus tier)         │
  │    extraction   │       │  · multi-lab-coordinator       │
  └─────────────────┘       └────────────────┬───────────────┘
                                             │ LIMS push
                                             ▼
  LIMS & CERTIFICATION
  ┌─────────────────────────────────────────────────────────┐
  │  SOLARLAB-X                                             │
  │  · Module test record database                          │
  │  · IEC-accredited audit trail                           │
  │  · Inter-lab QC comparison                              │
  └─────────────────────────────────────────────────────────┘
                             │
                             ▼
  OUTCOME: NABL-accredited STC characterisation at 75 modules/day
```

## What Each Repo Delivers in Q2 2026

### Surya Yantra — Hardware to Production

**Already done (April 2026):**
- Hardware commissioned: 300/300 relay self-test PASS, < 0.3 % Voc repeatability.
- Web app live on Vercel: all IEC 60891 P1–P4, SMMF, IAM correction endpoints operational.
- Electron desktop app: offline SCPI + Modbus control.

**Q2 2026 targets:**
1. **STM32H7 MUX firmware publication** — `hardware/firmware/mux-controller/` with Modbus register map and self-test protocol. This unblocks any third party attempting to reproduce the build (tracked in issue #2).
2. **NABL audit preparation** — NABL accreditation requires documented uncertainty budgets per IEC 60891 §8. The peer-review checklist in `docs/IEC-CORRECTIONS.md §6` defines the work; the Annex B validation table needs to be completed.
3. **Auto-extract API endpoint** — `POST /api/corrections/apply` with `autoExtract: true`, consuming GanitaSutra's parameter-extraction package.
4. **Antaryami-OS webhook** — `POST /antaryami-webhook` endpoint and `lib/antaryami.ts` event publisher.

### GanitaSutra-v0 — Eliminating the Datasheet Dependency

GanitaSutra's PV toolbox sprint implements a five-parameter single-diode model (5PDM) Levenberg-Marquardt fit that extracts {α, β, Rₛ, κ, Rsh} from two measured IV curves — no manufacturer datasheet required. This is the prerequisite for Surya Yantra's `autoExtract` mode and for parameter-free P3/P4 corrections.

**Q2 2026 target:** npm-publishable `@ganitasutra/pv-toolbox` package with `extractModuleParams(curveA, curveB): ModuleParams` as the public API.

See: [drafts/ganitasutra-parameter-free-pv-corrections.md](./ganitasutra-parameter-free-pv-corrections.md)

### Antaryami-OS — AI-Optimised Test Scheduling

Antaryami-OS's three PV lab skills (`pv-session-planner`, `pv-fault-router`, `multi-lab-coordinator`) convert the 75-module sequencing problem into an irradiance-aware, cost-budgeted, LIMS-integrated workflow.

**Q2 2026 target (minimum viable):** `pv-session-planner` skill deployed with the Surya Yantra webhook. This provides irradiance-aware slot ordering and priority queue management — enough for the NABL audit's repeatability requirements.

**Q3 2026:** `pv-fault-router` + `multi-lab-coordinator` with full SolarLabX LIMS integration.

See: [drafts/antaryami-os-pv-lab-scheduling.md](./antaryami-os-pv-lab-scheduling.md)

### SolarLabX — The LIMS Target

SolarLabX is the accreditation backend: module test records, chain-of-custody, inter-lab comparison. In Q2 2026 it is primarily a *target* rather than an active development focus — Surya Yantra pushes to it; SolarLabX stores and exposes the data to auditors.

**Q2 2026 target:** Document the `POST /api/measurements` webhook shape that Antaryami-OS's `multi-lab-coordinator` will use, so the SolarLabX integration can be built against a stable contract.

## Q2 2026 Milestone Timeline

| Month | Milestone | Repo |
|-------|-----------|------|
| May 2026 | GanitaSutra 5PDM fitting module merged | GanitaSutra-v0 |
| May 2026 | Antaryami-OS pv-session-planner skill PR | Antaryami-OS |
| May 2026 | STM32H7 firmware source published | Surya Yantra |
| May/June 2026 | `autoExtract` API endpoint live | Surya Yantra |
| May/June 2026 | pv-session-planner webhook wired | Surya Yantra + Antaryami-OS |
| June 2026 | IEC 60891 Annex B validation table complete | Surya Yantra docs |
| June/July 2026 | NABL accreditation audit | Surya Yantra + SolarLabX |
| July 2026 | First third-party validated dataset released | Surya Yantra |

## The Critical Path: NABL Accreditation

NABL (National Accreditation Board for Testing and Calibration Laboratories) requires:

1. **Measurement uncertainty budget** — each correction step contributes to combined uncertainty. IEC 60891 §8 specifies the method. Currently missing from `docs/IEC-CORRECTIONS.md` (tracked in issue #3).
2. **Reference standard traceability** — the Kipp & Zonen SMP10 and IMT Si-RS485TC-T-MB must have current calibration certificates traceable to NPL India.
3. **Repeatability study** — ≥ 10 consecutive sweeps of the same module with Pmpp CV < 0.5 %. Initial commissioning shows < 0.3 % Voc repeatability; a formal Pmpp study is required.
4. **Documented test procedure** — the commissioning checklist in `docs/HARDWARE-SETUP.md §7` is a start; a formal Standard Operating Procedure (SOP) document is required for the audit.

None of these is a software problem. All of them can be addressed in Q2 2026 with focused effort.

## Open Issues Blocking Q2 Milestones

| Issue | Blocks | Status |
|-------|--------|--------|
| #1 — README broken paths | Documentation credibility | Open |
| #2 — STM32H7 firmware not published | Third-party reproducibility; NABL audit | Open |
| #3 — IEC-CORRECTIONS.md peer-review checklist | NABL uncertainty budget | Open (partial fix in this PR) |
| #6 — OG images missing | Social card previews | Open |
| #7 — Fraunhofer ISE validation table | NABL independent verification | Open |

Issues #2, #3, and #7 are on the NABL critical path. Issues #1 and #6 are documentation hygiene.

## What's Not Changing This Quarter

**ShilpaSutra** (last updated March 2026, 13 open issues) is not in active development this quarter. No article seeds are proposed for ShilpaSutra until its sprint resumes.

**SolarLabX** (last updated March 2026) is a LIMS target in Q2 2026. Article seeds about SolarLabX integration will be appropriate when the webhook contract is documented.

## The Missing OG Image

This article references `/og/srishti-pv-lab-roadmap-q2-2026.png`. Like all OG images in the series, it does not yet exist (tracked in issue #6). The recommended content is the ecosystem architecture diagram above, rendered as a 1200×630 px PNG.

## Next Review

This roadmap will be reviewed at the end of Q2 2026 (end of July 2026) and updated based on actual milestone completion. Subscribe to [github.com/ganeshgowri-ASA/surya-yantra](https://github.com/ganeshgowri-ASA/surya-yantra) for release announcements.

## References

1. Surya Yantra: [github.com/ganeshgowri-ASA/surya-yantra](https://github.com/ganeshgowri-ASA/surya-yantra).
2. GanitaSutra-v0: [github.com/ganeshgowri-ASA/GanitaSutra-v0](https://github.com/ganeshgowri-ASA/GanitaSutra-v0).
3. Antaryami-OS: [github.com/ganeshgowri-ASA/antaryami-os](https://github.com/ganeshgowri-ASA/antaryami-os).
4. SolarLabX: [github.com/ganeshgowri-ASA/SolarLabX](https://github.com/ganeshgowri-ASA/SolarLabX).
5. NABL, *Specific Criteria for Accreditation of Testing Laboratories in the field of Solar Energy*, NABL 121, 2023.
6. IEC 60891:2021 §8, *Uncertainty of the correction procedures*.
