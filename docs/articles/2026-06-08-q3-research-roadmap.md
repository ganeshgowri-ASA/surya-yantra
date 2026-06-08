---
title: "Srishti PV Lab Q3 2026 Research Roadmap: Building a Full-Stack Solar Intelligence Ecosystem"
slug: srishti-q3-2026-research-roadmap
date: 2026-06-08
author: Srishti PV Lab
status: seed
tags:
  - roadmap
  - research
  - surya-yantra
  - antaryami-os
  - ganitasutra
  - pv-pranali
keywords:
  - solar PV research roadmap 2026
  - Srishti PV Lab India
  - IV curve tracer research
  - IEC 60891 open source
  - AI solar testing platform
description: >
  A Sunday roadmap article surveying the Srishti PV Lab open-source ecosystem
  as of June 2026 — Surya Yantra (IV tracer), SolarLabX (LIMS/QMS), antaryami-os
  (AI OS), GanitaSutra (math toolboxes), ShilpaSutra (AI CAD), pv-pranali
  (multi-agent orchestrator) — and laying out the Q3 2026 publication schedule.
---

# Srishti PV Lab Q3 2026 Research Roadmap

*Sunday review — 2026-06-08. Weekly angle: roadmap.*

---

## 1. The ecosystem at mid-2026

Over the past six months, Srishti PV Lab (Jamnagar, Gujarat) has built an
interconnected suite of open-source platforms for solar PV research and
testing. As of June 2026, the ecosystem spans six active repositories:

| Repository | Purpose | Last active |
|-----------|---------|-------------|
| **surya-yantra** | IV curve tracer, IEC 60891 corrections, 75-module test bed | 2026-04-17 |
| **SolarLabX** | LIMS, QMS, audit trails, uncertainty budgets | 2026-03-25 |
| **antaryami-os** | Enterprise-grade AI operating system | 2026-05-10 |
| **GanitaSutra** | MATLAB-inspired browser math platform, 21 toolboxes | 2026-05-03 |
| **ShilpaSutra** | AI-powered Text/Multimodal → CAD/CFD | 2026-03-31 |
| **pv-pranali** | Multi-agent LangGraph + MCP orchestrator | 2026-05-03 |

These platforms are not silos. They interoperate along a clear data and
intelligence hierarchy:

```
                   ┌─────────────────┐
                   │  antaryami-os   │  ← AI orchestration + audit
                   └────────┬────────┘
                            │ agent API calls
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ surya-yantra │  │  SolarLabX   │  │  ShilpaSutra │
│  IV testing  │  │  LIMS / QMS  │  │  CAD / FEM   │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       └─────────────────┴──────────────────┘
                          │ data + designs
                          ▼
               ┌──────────────────┐
               │   pv-pranali     │  ← orchestrates all above
               │ LangGraph + MCP  │     via Claude Code + MiMo
               └──────────────────┘
                          │ math verification
                          ▼
               ┌──────────────────┐
               │   GanitaSutra    │  ← 21 toolboxes, SimuFlow
               └──────────────────┘
```

---

## 2. Week 24 engineering signals (June 2–7)

### SolarLabX — Auth hardening sprint
PR #177 (June 6) applied `requireAuth()` + Zod validation to 8 remaining
data-plane routes. This pattern is directly applicable to Surya Yantra's
unprotected hardware-facing APIs (MUX, e-load). See the Zero-Trust API seed
article (2026-06-07) for a full analysis.

### ShilpaSutra — Geometry engine stabilisation
PRs #198–#207 cleaned up the parametric sketch engine and added unit tests.
This improves reliability of the ShilpaSutra CAD output that is proposed for
Surya Yantra's `hardware/schematics/` directory.

### antaryami-os — Highest issue velocity
176 open issues as of June 8, highest of all sister repos. Indicates rapid
feature development. The antaryami-os autonomy integration article (seeded
today) targets the Q3 W24 publication slot.

---

## 3. Q3 2026 publication plan

### June: Security + Hardware

| Week | Article | Target |
|------|---------|--------|
| W24 | Zero-Trust API for Hardware-Coupled PV Systems | Jun 13 |
| W24 | antaryami-os PV Lab Autonomy (seeded today) | Jun 13 |
| W25 | GanitaSutra SimuFlow × IEC 60891 | Jun 20 |
| W26 | pv-pranali Multi-Agent Architecture (seeded today) | Jun 27 |

### July: Math Foundations + Integration

| Week | Article | Target |
|------|---------|--------|
| W27 | SolarLabX × Surya Yantra end-to-end integration | Jul 4 |
| W28 | ShilpaSutra fixture CAD (from Jun 7 seed) | Jul 11 |
| W29 | IEC 60891:2021 Practitioner's Guide (evergreen) | Jul 18 |
| W30 | Uncertainty Budget for a 75-Module Test Bed | Jul 25 |

### August: AI Orchestration

| Week | Article | Target |
|------|---------|--------|
| W31 | pv-pranali: Claude Code + MiMo on WSL deep-dive | Aug 1 |
| W32 | antaryami-os autonomous daily sweep: production case study | Aug 8 |
| W33 | GanitaSutra PlotEngine × IEC 60904-7 SMMF | Aug 15 |
| W34 | 4-Wire Kelvin Sensing: hardware deep-dive | Aug 22 |

### September: Standards Compliance Retrospective

| Week | Article | Target |
|------|---------|--------|
| W35 | FEM wind verification IS 875 Zone III (ShilpaSutra) | Sep 5 |
| W36 | WebSocket real-time IV streaming architecture | Sep 12 |
| W37 | IEC 62443 compliance audit for Surya Yantra | Sep 19 |
| W38 | Q3 2026 retrospective | Sep 26 |

---

## 4. Infrastructure milestones needed for Q3

### P0 — Auth middleware (prerequisite for all deployment articles)
The Zero-Trust API article (seed: 2026-06-07, section 4) lays out a 3-phase
hardening plan. Phase 1 (`requireAuth()` on all hardware routes) must ship
before any production deployment and before the antaryami-os integration
article can include live agent examples.

### P1 — `hardware/schematics/` directory
Eleven article references point to this missing directory. The ShilpaSutra
CAD article (seed: 2026-06-07) proposes generating SVGs via ShilpaSutra's
parametric engine. Target: directory populated by W28 (July 11).

### P2 — PR merge policy
30+ open editorial PRs exist with no merge history. A clear policy is needed:
each Friday's publication-ready PR is merged; older overlapping PRs are closed.
This prevents the PR list from becoming noise.

### P3 — Surya Yantra MCP server
For pv-pranali integration (W26 article), Surya Yantra needs an MCP server
exposing its BOM, IEC corrections, API spec, and module database to the
multi-agent orchestrator. This is a 1–2 day implementation.

---

## 5. Next steps for this article

- [ ] Add Vercel deployment history table (weekly build status, error rates)
- [ ] Link to individual article pages once published on posts/
- [ ] Add community metrics: GitHub stars, forks, open issues trend
- [ ] Write Q3 retrospective outline (due Sep 26)

---

*Cross-repo: [surya-yantra](https://github.com/ganeshgowri-ASA/surya-yantra) ·
[SolarLabX](https://github.com/ganeshgowri-ASA/SolarLabX) ·
[antaryami-os](https://github.com/ganeshgowri-ASA/antaryami-os) ·
[GanitaSutra](https://github.com/ganeshgowri-ASA/GanitaSutra) ·
[ShilpaSutra](https://github.com/ganeshgowri-ASA/ShilpaSutra) ·
[pv-pranali](https://github.com/ganeshgowri-ASA/pv-pranali)*
