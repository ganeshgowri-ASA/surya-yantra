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
lastmod: "2026-05-08"
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

*4 May 2026 · Updated 7 May 2026 · Srishti PV Lab, Jamnagar*

Three months into 2026, four independently developed repositories are converging into something more significant than any one of them could achieve alone: a complete, open-source, NABL-accreditation-ready solar PV module verification pipeline.

## The Convergence Moment

As of 7 May 2026 (updated from 4 May):

| Repository | Status | Sprint activity (7 May 2026) |
|-----------|--------|-----------------------------|
| [Surya Yantra](https://github.com/ganeshgowri-ASA/surya-yantra) | Hardware commissioned; web app on Vercel | NABL prep, firmware publication |
| [GanitaSutra-v0](https://github.com/ganeshgowri-ASA/GanitaSutra-v0) | PV toolbox active sprint | **15 open issues** (pushed 7 May); 5PDM LM-fitting sprint continuing |
| [Antaryami-OS](https://github.com/ganeshgowri-ASA/antaryami-os) | AI scheduling active development | **33 open issues** (pushed 8 May — continues active daily sprint) |
| [SolarLabX](https://github.com/ganeshgowri-ASA/SolarLabX) | LIMS / QMS target | **18 open issues** (pushed 8 May — **+6 today, +50%**); LIMS sprint acceleration |

The antaryami-os sprint acceleration is the most significant signal this week: a 7× increase in open issues in 3 days indicates either a major feature planning session or a large batch of bug reports from integration testing — either interpretation points to intense near-term development.

## The Ecosystem Architecture

```
  PHYSICAL LAYER
  ┌─────────────────────────────────────────────────────────┐
  │  75-module outdoor array · ESL-Solar 500 · MUX matrix  │
  │  4-wire Kelvin · env sensors · STM32H7 firmware         │
  └─────────────────┬───────────────────────────────────────┘
                             │ SCPI + Modbus over USB/Ethernet
                             ▼
  ACQUISITION & CORRECTION
  ┌─────────────────────────────────────────────────────────┐
  │  SURYA YANTRA  (Next.js + Electron)                     │
  │  · IV sweep orchestration                               │
  │  · IEC 60891 P1–P4 corrections (lib/iec60891.ts)        │
  │  · SMMF + IAM pipeline (lib/smmf.ts, lib/iam.ts)        │
  │  · REST API + WebSocket real-time                        │
  └────────┬──────────────┬──────────────────────────────┘
           │ extractModuleParams() │ notifySessionEvent()
           ▼                      ▼
  PARAMETER EXTRACTION      AI ORCHESTRATION
  ┌─────────────────┐       ┌────────────────────────────────┐
  │  GANITASUTRA    │       │  ANTARYAMI-OS (31 issues)       │
  │  14 issues      │       │  · pv-session-planner (Sonnet) │
  │  · 5PDM curve   │       │  · pv-fault-router             │
  │    fitting      │       │    (Haiku / Opus tier)         │
  │  · α, β, Rₛ     │       │  · multi-lab-coordinator       │
  │    extraction   │       └────────────────┬────────────────┘
  └─────────────────┘                       │ LIMS push
                                             ▼
  LIMS & CERTIFICATION
  ┌─────────────────────────────────────────────────────────┐
  │  SOLARLAB-X (12 issues)                                 │
  │  · Module test record database                          │
  │  · IEC-accredited audit trail                           │
  │  · Inter-lab QC comparison                              │
  └─────────────────────────────────────────────────────────┘
```

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

1. **Measurement uncertainty budget** — IEC 60891 §8 specifies the method. Currently missing from `docs/IEC-CORRECTIONS.md` (tracked in issue #3).
2. **Reference standard traceability** — the Kipp & Zonen SMP10 and IMT Si-RS485TC-T-MB must have current calibration certificates traceable to NPL India.
3. **Repeatability study** — ≥10 consecutive sweeps of the same module with Pmpp CV < 0.5 %. Initial commissioning shows < 0.3 % Voc repeatability; a formal Pmpp study is required.
4. **Documented test procedure** — a formal Standard Operating Procedure (SOP) document is required for the audit.

## Open Issues Blocking Q2 Milestones

| Issue | Blocks | Status |
|-------|--------|--------|
| #2 — STM32H7 firmware not published | Third-party reproducibility; NABL audit | Open |
| #3 — IEC-CORRECTIONS.md peer-review checklist | NABL uncertainty budget | Open |
| #7 — Fraunhofer ISE validation table | NABL independent verification | Open |
| #12 — docs/PRD.md missing | Product requirements documentation | Open |
| #14 — packages/ not scaffolded | Monorepo integrity | Open |

## References

1. Surya Yantra: [github.com/ganeshgowri-ASA/surya-yantra](https://github.com/ganeshgowri-ASA/surya-yantra).
2. GanitaSutra-v0: [github.com/ganeshgowri-ASA/GanitaSutra-v0](https://github.com/ganeshgowri-ASA/GanitaSutra-v0).
3. Antaryami-OS: [github.com/ganeshgowri-ASA/antaryami-os](https://github.com/ganeshgowri-ASA/antaryami-os).
4. SolarLabX: [github.com/ganeshgowri-ASA/SolarLabX](https://github.com/ganeshgowri-ASA/SolarLabX).
5. NABL, *Specific Criteria for Accreditation of Testing Laboratories in the field of Solar Energy*, NABL 121, 2023.
6. IEC 60891:2021 §8, *Uncertainty of the correction procedures*. IEC, Geneva.
7. Jahn U., Frischemeier G., Mayer K. (2014). *PV system performance assessment — IEA-PVPS Task 13 outcome*. 29th EU PVSEC. [Reference for NABL-style repeatability study design.]

---

## Peer Review

*Thursday 8 May 2026 — Weekly peer-review checklist pass*

### Technical Accuracy

- [ ] All equations verified against cited source (DOI or section number confirmed)
- [ ] TypeScript code snippets compile without errors against current `apps/web/lib/`
- [ ] Numerical examples cross-checked against test suite values in `apps/web/__tests__/`
- [ ] Claims about companion-repo sprint state verified against latest GitHub activity
- [ ] All `<!-- TODO -->` items either resolved inline or tracked as open GitHub issues

### Citation Completeness

- [ ] All referenced papers include DOI or arXiv ID
- [ ] IEC standards cite year and section number
- [ ] Software references include version, commit hash, or publication DOI
- [ ] No citation appears as a bare URL without author/year

### Code Cross-References

- [ ] All TypeScript paths mentioned exist in `apps/web/lib/` on `main`
- [ ] Every described behaviour has test coverage in `apps/web/__tests__/`
- [ ] API endpoints described match current `docs/API.md`
- [ ] External package imports (`@ganitasutra/pv-toolbox` etc.) have a tracked issue or PR

### Reviewer Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Technical reviewer | — | — | — |
| Standards reviewer | — | — | — |
| Editor | — | — | — |

*Assign reviewers in the GitHub PR before promoting `draft: true → false`.*
