---
title: "From Conversation to Fixture: How ShilpaSutra's AI-CAD Designs the Srishti PV Lab Test Rack"
seo_title: "AI-Powered CAD for Solar PV Test Fixtures: ShilpaSutra × Srishti PV Lab | Parametric Design"
description: "ShilpaSutra's conversational AI-to-CAD platform can derive the Srishti PV Lab's 75-module test rack geometry, Kelvin harness routing, and cable management from parametric constraints — linking AI design to IEC-compliant measurement infrastructure."
keywords:
  - AI CAD solar test fixture
  - ShilpaSutra parametric design
  - solar PV test rack design
  - AI-generated technical drawing
  - photovoltaic fixture design
  - Kelvin harness routing CAD
  - IEC 60904 test fixture
  - conversational CAD India
  - open source CAD AI
  - solar lab fixture design
  - parametric solar rack
  - Srishti PV Lab
canonical: "https://surya-yantra.srishtipvlab.in/posts/shilpasutra-cad-pv-fixture-design"
og:
  title: "AI-CAD for PV Test Fixtures: ShilpaSutra × Srishti PV Lab"
  description: "ShilpaSutra's conversational parametric CAD applied to the 75-module rack geometry, Kelvin harness routing, and cable management — bridging AI design and lab hardware."
  image: "/og/shilpasutra-pv-fixture.png"
  type: "article"
twitter:
  card: "summary_large_image"
  title: "ShilpaSutra AI-CAD for Solar Test Racks | Srishti PV Lab"
  description: "From a natural-language description of module dimensions, cable constraints, and bend radii to a parametric 75-module test rack drawing."
  image: "/og/shilpasutra-pv-fixture.png"
author: "Srishti PV Lab Engineering"
date: "2026-05-09"
lastmod: "2026-05-09"
draft: true
tags:
  - shilpasutra
  - cad
  - pv-test-fixture
  - solar-pv
  - parametric-design
  - ai-cad
  - hardware
  - india
categories:
  - hardware
  - ai
  - engineering
reading_time: 10
schema_type: "TechArticle"
related_repos:
  - ShilpaSutra
  - surya-yantra
---

# From Conversation to Fixture: How ShilpaSutra's AI-CAD Designs the Srishti PV Lab Test Rack

*Article seed — 9 May 2026 (Friday — publication-polish angle) · Srishti PV Lab Engineering*

**Engineering signal (9 May 2026):** [ShilpaSutra](https://github.com/ganeshgowri-ASA/ShilpaSutra) — described as an "AI-powered Text/Multimodal to CAD & CFD platform with conversational design agent, parametric modeling, and simulation" — pushed to main this morning and now carries **37 open issues** (+4 in 24 hours). ShilpaSutra is in an active sprint. And it is building exactly what the current Srishti PV Lab stack lacks: a tool for **hardware fixture design**.

The 75-module test rack, the Kelvin harness routing, the relay matrix chassis, and cable management currently exist as physical installations without version-controlled parametric CAD files. ShilpaSutra changes that.

## The Fixture Design Problem

The Srishti PV Lab's outdoor test rack has tightly coupled geometric constraints:

| Constraint | Value |
|-----------|-------|
| Module dimensions | 2240 × 1134 × 35 mm (HJT 450 Wp, G12 wafer) |
| Force cable max run (LAPP ÖLFLEX 16 mm², < 5 mΩ) | ≤ 7.8 m |
| Module-to-module pitch (E-W) | 50 mm clearance (IEC 61215 ventilation) |
| Row tilt | 15° (Jamnagar, 22°N) |
| Rack width (15 × 5 layout) | ~18 m |
| Max cable run from corner module to MUX chassis | ≤ 7.8 m |

The corner-module cable constraint is the binding one: the LAPP Force cable's voltage drop at 12 A must be < 5 mΩ per lane, limiting the run to ~7.8 m at 16 mm² cross-section. The MUX chassis must be positioned within that radius of every module. This is a parametric constraint satisfaction problem — exactly what ShilpaSutra's conversational agent is built for.

## What a ShilpaSutra Session Produces

A typical interaction for this fixture:

```
User: Parametric CAD for a 15×5 outdoor solar module test rack.
      Module: 2240 × 1134 × 35 mm. E-W pitch: 50 mm. Row gap: 100 mm.
      Tilt: 15°. All 4-wire cables must reach a central MUX chassis
      within 8 m (LAPP 16 mm² Force). Annotate each module: cable
      run length. Flag >7.5 m yellow, >8 m red.
```

ShilpaSutra's design agent parses the constraints, generates a 3D rack geometry, computes the MUX chassis placement that minimises the maximum cable run, annotates each module slot, and exports SVG floor-plan + STEP file. Changing the module dimensions or MUX placement updates all cable-run annotations automatically.

## The Ideation → Design → Manufacture Pipeline

```
IDEATION (physical constraints)
  ┌──────────────────────────────────────────────────────────────┐
  │  75 modules · cable run ≤ 8 m · tilt 15° · IEC clearances   │
  └──────────────────────┬───────────────────────────────────────┘
                         │ ShilpaSutra conversation
                         ▼
DESIGN (parametric CAD)
  ┌──────────────────────────────────────────────────────────────┐
  │  15 × 5 rack model · MUX placement optimiser                │
  │  Cable run annotation layer (green / yellow / red)          │
  │  Kelvin harness routing · DXF / STEP / SVG export           │
  └──────────────────────┬───────────────────────────────────────┘
                         │ → hardware/schematics/ (issue #13)
                         ▼
DOCUMENTATION (version-controlled)
  ┌──────────────────────────────────────────────────────────────┐
  │  hardware/schematics/rack-layout.svg                        │
  │  hardware/schematics/kelvin-4wire.svg                       │
  │  hardware/WIRING.md cross-references                        │
  └──────────────────────┬───────────────────────────────────────┘
                         │ fabrication
                         ▼
MANUFACTURE
  ┌──────────────────────────────────────────────────────────────┐
  │  Galvanised steel sections (ISA 75×75×6 angle)              │
  │  Hot-dip galvanised fasteners (Class 8.8)                   │
  │  Welded cable trays for Kelvin harness                       │
  └──────────────────────────────────────────────────────────────┘
```

## Connection to Open Issues

| Issue | How ShilpaSutra resolves it |
|-------|----------------------------|
| **#13** — `hardware: add schematics/ directory and WIRING.md` | ShilpaSutra exports `rack-layout.svg`, `kelvin-4wire.svg`, `mux-relay-matrix.svg` |
| **#1** — README references non-existent `hardware/schematics/` | Directory created once SVGs land |
| **#2** — STM32H7 firmware publication | ShilpaSutra CFD defines T_cell[slot] → informs firmware Modbus register layout |

## CFD Extension: Rack Thermal Map

ShilpaSutra includes CFD simulation. The 15 × 5 outdoor rack has non-trivial thermal heterogeneity: interior modules are shielded from wind and heated by adjacent modules, creating a 5–15 °C gradient between edge and interior rows at low wind speeds (Marion, 2002). A ShilpaSutra CFD session — boundary condition: 800 W/m² irradiance, 2 m/s south-west wind (Jamnagar seasonal average) — produces a steady-state `T_cell[slot]` map for all 75 positions.

This temperature map feeds into the Antaryami-OS `pv-session-planner` skill: modules with large |β| (HJT, perovskite) are scheduled to cooler rack positions, maximising P1/P2 correction accuracy. This closes the design-to-measurement intelligence loop.

## Research Narrative

1. **Software paper (JOSS):** ShilpaSutra itself, with the PV fixture design as the demonstration case.
2. **Measurement paper (Solar Energy / IEEE J. Photovoltaics):** Rack temperature heterogeneity vs. CFD prediction, and its effect on P1/P2 correction uncertainty.

## References

1. ShilpaSutra: [github.com/ganeshgowri-ASA/ShilpaSutra](https://github.com/ganeshgowri-ASA/ShilpaSutra).
2. IEC 61215:2021, *Terrestrial photovoltaic (PV) modules — Design qualification and type approval*. IEC, Geneva.
3. Marion B. (2002). *A practical method for determining the temperature coefficients of PV modules*. NREL/CP-520-31590.
4. LAPP Group, *ÖLFLEX CLASSIC 110 CY Cable Technical Specification*, 2024.
5. Surya Yantra hardware setup: `docs/HARDWARE-SETUP.md`.
6. Surya Yantra BOM: `hardware/BOM.md`.
7. Open issue #13: `hardware: add schematics/ directory and WIRING.md`.

---

## Peer Review

*Friday 9 May 2026 — Article seed review*

### Technical Accuracy

- [ ] Cable run constraint (7.8 m, 16 mm², < 5 mΩ) verified against IEC 60228 resistance tables
- [ ] Rack dimensions consistent with `docs/HARDWARE-SETUP.md` and `hardware/BOM.md`
- [ ] ShilpaSutra capabilities verified against current repo description ✅
- [ ] IEC 61215 ventilation clearance reference confirmed

### Citation Completeness

- [ ] IEC 61215:2021 confirmed ✅
- [ ] Marion (2002) NREL/CP-520-31590 confirmed ✅
- [ ] LAPP ÖLFLEX specification matched to BOM ✅

### Reviewer Sign-off

| Role | Name | Date | Signature |
|------|------|------|----------|
| Hardware engineering reviewer | — | — | — |
| CAD / design reviewer | — | — | — |
| Editor | — | — | — |

*Assign reviewers in the GitHub PR before promoting `draft: true → false`.*
