---
title: "Srishti PV Lab Intelligence Stack: Q2 Close-Out and Q3 2026 Roadmap"
slug: srishti-pv-lab-ecosystem-roadmap-q3-2026
description: "A Sunday roadmap review of the four interconnected open-source tools — Antaryami-OS, GanitaSutra-v0, ShilpaSutra, SolarLabX — built around Surya Yantra, and the engineering milestones that define Q3 2026 for India's first AI-native PV testing laboratory."
keywords:
  - Srishti PV Lab roadmap
  - open source PV testing India
  - AI solar lab automation
  - Antaryami-OS roadmap
  - GanitaSutra IEC 60891
  - ShilpaSutra AI CAD
  - SolarLabX LIMS roadmap
  - Surya Yantra IV tracer roadmap
  - NABL PV lab India 2026
  - solar energy AI tools India
  - IEC 61215 automated testing
  - pv-session-planner Q3
  - Srishti Advanced Systems
date: 2026-05-17
lastmod: 2026-05-17
author: ganeshgowri-ASA
draft: true
og_image: /og/srishti-pv-lab-ecosystem-roadmap-q3-2026.png
og_image_alt: "Srishti PV Lab Q3 2026 roadmap diagram showing Antaryami-OS, GanitaSutra, ShilpaSutra, SolarLabX and Surya Yantra as interconnected nodes with Q3 milestone annotations"
canonical: https://surya-yantra.srishtipvlab.in/posts/srishti-pv-lab-ecosystem-roadmap-q3-2026
twitter_card: summary_large_image
schema_type: TechArticle
schema_about: Open-source AI-native photovoltaic testing laboratory roadmap for India
target_venue: Solar Energy or Renewable and Sustainable Energy Reviews
word_count_target: 4500
peer_review_status: seed-only
seo_focus_keyword: open source PV testing AI India roadmap
seed_trigger: Sunday 2026-05-17 roadmap angle — Q2 close-out, Q3 planning
weekly_angle: roadmap
---

# Srishti PV Lab Intelligence Stack: Q2 Close-Out and Q3 2026 Roadmap

> **Status:** Seed — created 2026-05-17 (Sunday roadmap pass). Synthesises the week's engineering signals from all five system repos into a forward-looking Q3 milestone plan.
>
> **Research narrative:** Five open-source tools now collectively address every stage of the PV module certification workflow. This article describes where they stand at the Q2/Q3 boundary and what must ship before the Srishti lab can run a fully unattended NABL-traceable IEC 61215 qualification test.

---

## Context: The Srishti PV Lab Intelligence Stack

The Srishti PV Lab at Jamnagar operates what is likely India's first **AI-native, open-source PV module testing infrastructure**. Five tools are now in active development as of May 2026:

| System | Role | Status (2026-05-17) |
|--------|------|----------------------|
| **Surya Yantra** | IV curve tracer + IEC 60891 correction engine | Core libs shipped; Electron app scaffolded; relay service pending |
| **Antaryami-OS** | AI operating system: skill execution + SCPI safety governance | 116 open issues; Q2 milestone `pv-session-planner` in flight |
| **GanitaSutra-v0** | Computational tool: IEC 60891 algorithm prototyping + 5PDM parameter extraction | 23 open issues; SimuFlow + PV toolbox sprint |
| **ShilpaSutra** | AI-CAD platform: parametric fixture design + CFD thermal validation | 57 open issues; 300-relay MUX chassis model in progress |
| **SolarLabX** | LIMS + QMS: test protocol definition + NABL report generation | 32 open issues; QA loop integration with Surya Yantra in progress |

---

## §1 — Q2 2026 Milestone Review (as of 2026-05-17)

### 1.1 What shipped in Q2

| Milestone | System | Status |
|-----------|--------|--------|
| IEC 60891:2021 Procedures 1–4 in production TypeScript | Surya Yantra | ✅ Shipped (`apps/web/lib/iec60891.ts`, 46 Vitest passing) |
| SMMF (IEC 60904-7) + IAM Martin-Ruiz (IEC 61853-2) | Surya Yantra | ✅ Shipped |
| Full REST API reference | Surya Yantra | ✅ Shipped (`docs/API.md`) |
| 75-module MUX schema + UI | Surya Yantra | ✅ Shipped (`apps/web/app/mux/`) |
| Electron desktop shell | Surya Yantra | ✅ Scaffolded (`apps/desktop/`) |
| Vercel deployment guide | Surya Yantra | ✅ Shipped (`docs/DEPLOYMENT.md`) |
| GanitaSutra IEC 60891 algorithm prototyping article seed | GanitaSutra-v0 | 🟡 Draft (`drafts/2026-05-14-ganitasutra-iec60891-algorithm-design.md`) |
| ShilpaSutra MUX chassis CAD article seed | ShilpaSutra | 🟡 Draft (`drafts/2026-05-14-shilpasutra-mux-chassis-cad.md`) |
| SCPI safety governance article seed | Antaryami-OS | 🟡 Draft (`drafts/2026-05-16-antaryami-os-scpi-safety-governance.md`) |
| SolarLabX QA loop article seed | SolarLabX | 🟡 Draft (`drafts/2026-05-16-solarlabx-surya-yantra-pv-qa-loop.md`) |

### 1.2 What slipped from Q2

| Milestone | System | Blocker | Tracking |
|-----------|--------|---------|---------|
| `packages/` monorepo extract | Surya Yantra | Prioritised web app delivery first | Issue #43 |
| `hardware/schematics/` SVG files | Surya Yantra | ShilpaSutra CAD output not yet exported | Issue #42 |
| `apps/desktop/relay` service | Surya Yantra | Scoping in progress | Issue #44 |
| MUX controller firmware | Surya Yantra | STM32H7 firmware in separate sprint | Issue #45 |
| `pv-session-planner` webhook MVP | Antaryami-OS | 116-issue hypersprint; Q2 target at risk | Issue #28 |
| `apps/web/lib/antaryami.ts` | Surya Yantra | Depends on antaryami-os webhook interface | Issue #29 |
| Product Requirements Document | Surya Yantra | First draft now in `docs/PRD.md` | Issue #37 |

---

## §2 — Q3 2026 Milestone Plan

### 2.1 Surya Yantra Q3 targets

| Milestone | Priority | Owner | Due |
|-----------|----------|-------|-----|
| `apps/desktop/relay` — Express HTTP-to-SCPI bridge | P0 | eng | Jul 2026 |
| `packages/scpi-client/` extract from `apps/web/lib/` | P0 | eng | Jul 2026 |
| `packages/iv-engine/` extract (shared Electron + web) | P0 | eng | Jul 2026 |
| `hardware/schematics/` — four SVG files | P1 | ShilpaSutra → eng | Jul 2026 |
| `hardware/firmware/mux-controller/` scaffold | P1 | eng | Aug 2026 |
| `POST /api/corrections/apply` consolidated endpoint | P1 | eng | Jul 2026 |
| `apps/web/lib/antaryami.ts` `notifySessionEvent` | P1 | eng | Jul 2026 |
| `app/sitemap.ts` + `public/robots.txt` | P2 | eng | Jun 2026 |
| OG images for all article drafts | P2 | design | Jul 2026 |
| First article promoted to `posts/` | P2 | content | Aug 2026 |

### 2.2 Antaryami-OS Q3 targets (Surya Yantra integration surface)

<!-- TODO: Triage antaryami-os 116 issues and update when session access is available (issue #28) -->

Based on the engineering signal visible from surya-yantra issues and article drafts:

| Milestone | Priority | Notes |
|-----------|----------|-------|
| `pv-session-planner` skill MVP | P0 | Calls `POST /api/sessions` on Surya Yantra |
| SCPI command whitelist (per-role JSON) | P0 | Safety critical — must not pass through LLM |
| Structured audit log schema | P0 | Required for NABL 121 §4.2 compliance |
| `notifySessionEvent` webhook receiver | P0 | Depends on issue #29 in Surya Yantra |
| Uncertainty propagation through skill chain | P1 | `{value, u}` tuples end-to-end |
| `request_id` logging alongside `session_id` | P1 | Claude claude-opus-4-7 auditability |

### 2.3 Ecosystem Q3 integration milestones

The following require **cross-repo coordination** and have no single owner:

1. **End-to-end IEC 61215 flash test demo** (SolarLabX → Surya Yantra → SolarLabX):
   - SolarLabX creates test protocol
   - Antaryami-OS `pv-session-planner` triggers `POST /api/sessions`
   - Surya Yantra sweeps module, applies IEC 60891 P2 correction
   - Result pushed back to SolarLabX; NABL PDF generated
   - *Target: August 2026 — Q3 capstone milestone*

2. **GanitaSutra parameter extraction → Surya Yantra autoExtract**:
   - GanitaSutra 5PDM LM fitting produces `{α, β, Rs, κ, Rsh}` from measured IV curves
   - `POST /api/corrections/apply?autoExtract=true` uses extracted params instead of datasheet
   - *Target: July 2026*

3. **ShilpaSutra fixture export → `hardware/schematics/`**:
   - ShilpaSutra generates STEP + SVG for 300-relay MUX chassis and 4-wire Kelvin harness
   - SVGs committed to `hardware/schematics/` with proper `<title>` / `<desc>` alt-text
   - *Target: July 2026*

---

## §3 — Research Publication Roadmap

The five tools collectively constitute a **methodology contribution** to open-source PV testing. The publication strategy is:

| Article | Venue target | Status | Target submission |
|---------|-------------|--------|-------------------|
| *Surya Yantra: Open-source IV curve tracer for 75-module PV test beds* | Solar Energy | `posts/surya-yantra-open-source-pv-iv-tracer.md` | Sep 2026 |
| *GanitaSutra + IEC 60891: Algorithm prototyping for PV corrections* | npj Comp. Mat. | `drafts/2026-05-14-ganitasutra-iec60891-algorithm-design.md` | Oct 2026 |
| *ShilpaSutra AI-CAD for PV test fixtures* | Hardware X | `drafts/2026-05-14-shilpasutra-mux-chassis-cad.md` | Oct 2026 |
| *SCPI safety governance for LLM-controlled instruments* | npj Comp. Mat. | `drafts/2026-05-16-antaryami-os-scpi-safety-governance.md` | Nov 2026 |
| *Closing the PV QA loop: SolarLabX + Surya Yantra* | Sol. Energy | `drafts/2026-05-16-solarlabx-surya-yantra-pv-qa-loop.md` | Nov 2026 |
| *India's integrated solar intelligence stack* | RSER | `drafts/seed-002-intelligence-stack.md` | Dec 2026 |

---

## §4 — Open Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| antaryami-os Q2 milestone slips to Q3 | High (116 open issues) | High (blocks IEC 61215 demo) | Decouple relay-only integration; demo with manual session trigger |
| `apps/desktop/relay` under-scoped | Medium | High (cloud → lab hardware dead end) | Spike task in Jun 2026 to define TCP-to-SCPI bridge interface |
| GanitaSutra `extractModuleParams()` interface changes | Medium | Medium (articles use conceptual API) | Mark code examples as `// planned` until package ships |
| NABL audit challenge on LLM-generated SCPI | Low-Medium | High (lab accreditation) | Deterministic pre-condition layer; request_id logging |
| ShilpaSutra STEP export format incompatible with SVG pipeline | Low | Low (workaround: manual SVG conversion) | Confirm with ShilpaSutra team before relying on auto-export |

---

## §5 — Blockers for This Article Before Promotion

- [ ] antaryami-os Q2 milestone health confirmed (issue #28 triage — requires antaryami-os session access)
- [ ] End-to-end demo trace log (even synthetic) for §2.3
- [ ] GanitaSutra `extractModuleParams()` API confirmed (issue #34)
- [ ] Publication timeline reviewed with ganeshgowri-ASA
- [ ] OG image: `/og/srishti-pv-lab-ecosystem-roadmap-q3-2026.png` (issue #48 follow-on)
- [ ] Peer review: PV lab director + AI systems researcher

---

## References (Seed)

1. IEC 61215:2021, *Terrestrial photovoltaic (PV) modules — Design qualification and type approval*. Geneva: IEC.
2. IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and irradiance corrections to measured I-V characteristics*. Geneva: IEC.
3. NABL 121:2023, *Guidelines for Estimation and Expression of Uncertainty in Measurement*. National Accreditation Board for Testing and Calibration Laboratories, India.
4. Antaryami-OS. *Enterprise-Grade Organizational AI Operating System*. GitHub: ganeshgowri-ASA/antaryami-os, 2026.
5. GanitaSutra-v0. *Computational Design Tools for Materials and Energy Systems*. GitHub: ganeshgowri-ASA/GanitaSutra-v0, 2026.
6. ShilpaSutra. *AI-Native CAD Platform for Hardware Design*. GitHub: ganeshgowri-ASA/ShilpaSutra, 2026.
7. SolarLabX. *Unified Solar PV Lab Operations Suite: LIMS + QMS + Audit + Test Protocols*. GitHub: ganeshgowri-ASA/SolarLabX, 2026.
8. Surya Yantra. *Srishti PV Module IV Curve Tracer & Test Management System*. GitHub: ganeshgowri-ASA/surya-yantra, 2026.
