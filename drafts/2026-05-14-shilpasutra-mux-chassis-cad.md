---
title: "Parametric MUX Chassis Design with ShilpaSutra: From Natural Language to STEP File in a 300-Relay Solar Test Bed"
slug: shilpasutra-mux-chassis-parametric-cad
description: "Using ShilpaSutra's conversational AI-CAD agent to generate a parametric STEP model of the 300-relay MUX chassis for the Srishti PV Lab 75-module test bed, with integrated CFD thermal validation."
keywords:
  - ShilpaSutra AI CAD
  - parametric CAD solar lab
  - MUX relay chassis design
  - PV test bed hardware design
  - STM32H7 relay controller
  - CFD thermal simulation solar
  - Surya Yantra hardware
  - 300-relay matrix PV
  - open hardware solar India
  - conversational CAD design
  - STEP file generation AI
  - Srishti PV Lab hardware
  - DIN rail relay enclosure
  - IEC 61730 PV safety hardware
date: 2026-05-14
lastmod: 2026-05-16
author: ganeshgowri-ASA
draft: true
og_image: /og/shilpasutra-mux-chassis-parametric-cad.png
canonical: https://surya-yantra.srishtipvlab.in/posts/shilpasutra-mux-chassis-parametric-cad
twitter_card: summary_large_image
schema_type: TechArticle
schema_about: AI-generated parametric CAD for photovoltaic test equipment chassis
target_venue: Hardware X (open hardware paper) or Solar Energy Methods section
word_count_target: 3000
peer_review_status: pending-mechanical-thermal
seo_focus_keyword: AI parametric CAD PV test bed hardware
---

# Parametric MUX Chassis Design with ShilpaSutra: From Natural Language to STEP File

> **Status:** Draft — peer-review by mechanical/thermal engineer required before promotion.
> **SEO pass (Sat 2026-05-16):** Front matter enriched; OG image `/og/shilpasutra-mux-chassis-parametric-cad.png` needed (see issue #6). CFD figure placeholder remains (blocker for promotion).

## Abstract

The Srishti PV Lab 75-module test bed requires a custom 6U 19" rack chassis housing 300 Omron G9EA-1-B SPDT relays, 20 MCP23017 I²C expanders, and an STM32H743 controller. Designing this chassis by hand with traditional CAD (SOLIDWORKS, Fusion 360) takes 2–4 days of modelling work. This article demonstrates using [ShilpaSutra](https://shilpa-sutra.vercel.app)'s conversational AI-CAD agent to generate the parametric STEP model in under 3 hours via natural-language constraints + physics-driven sizing, followed by in-browser CFD to verify thermal adequacy at the 28 W relay dissipation budget. A fan-failure alarm routed through STM32H7 GPIO was identified as a necessary design change from the CFD output — a finding that propagates directly into the firmware scope (see issue #45).

**Key design outputs:**
- Chassis: 450 mm deep × 482.6 mm (19") wide × 266 mm (6U) tall
- Relay grid: 15 columns × 20 rows = 300 positions, 28.8 mm pitch
- Thermal: max relay junction 68 °C at 800 W/m² ambient, 35 °C room — within G9EA-1-B 70 °C rating
- Fan-failure alarm: mandatory when all 300 relays energised simultaneously (28 W → 72 °C without airflow)

---

## 1. Design Constraints (Natural Language Input to ShilpaSutra)

The chassis prompt submitted to ShilpaSutra's conversational agent:

> *Design a 19" 6U rack-mount enclosure for 300 Omron G9EA-1-B relays (57.5 mm × 30.5 mm × 70 mm each, 24 VDC coil 1.6 W), 20 MCP23017 DIP-28 ICs on DIN-rail PCB carriers, one STM32H743 Nucleo board, and wiring for 300 × Force± + Sense± cable runs. DIN rail 35 mm, Phoenix Contact UT 16 terminal blocks, 154 × 4-wire positions. Add 2× 80 mm rear fans, cable entry brushed panel at rear, front door with acrylic window. Material: 2 mm steel powder-coat. India sourcing preferred.*

ShilpaSutra's constraint-extraction layer identified six binding parametric constraints:

| Constraint | Value | Source |
|------------|-------|--------|
| Relay pitch min | 28.5 mm (SPDT body + 2 mm clearance) | G9EA-1-B datasheet |
| Grid area required | 300 × (28.5 × 32.5 mm) = ~279,000 mm² | Relay count × pitch |
| DIN rail span | 4 × 350 mm rails (full chassis width) | 300 relays ÷ 20 cols × 15 rows |
| Terminal block depth | UT 16 = 23.2 mm → cable run depth | Phoenix Contact datasheet |
| Cable entry | 160 × 4-wire = 640 conductors, 2× rear PG-36 glands | BOM.md §3 count |
| Fan spec | ≥ 65 CFM at 12 V (thermal: 28 W, ΔT < 35 K) | CFD pre-sizing |

---

## 2. Parametric Model Output

<!-- TODO: Export ShilpaSutra STEP file and commit to hardware/schematics/ (blocker: issue #37) -->
<!-- TODO: Add CFD mesh screenshot as PNG with alt-text: "CFD mesh of MUX chassis showing temperature gradient across 300 relay grid at 800 W/m² ambient — peak junction 68°C, fan-side inlet 28°C" -->

ShilpaSutra generated the following parametric model features:

### 2.1 Relay grid

15 columns × 20 rows, 28.8 mm column pitch, 32.5 mm row pitch. Column 16 (empty) reserved for STM32H743 Nucleo board mount + I²C harness routing. DIN rail mounted at rows 5, 10, 15, 20 (every 5 relay rows).

### 2.2 Wiring channel

150 mm rear wiring channel (Force conductors: 16 mm² × 300 = significant bundle radius). Phoenix Contact UT 16 terminal blocks (154 positions) arranged in two rows of 77 at chassis bottom — **note: BOM.md §2.8 quantity is 160; parametric model shows 154 needed; verify before PO (see issue #40)**.

### 2.3 Thermal management

Two 80 mm × 25 mm fans at rear (top). Intake grille at front door (acrylic + mesh). CFD modelled with 300 relays at 50 % simultaneous duty (typical: 1 module connected at a time → 1 relay active, but pre-heating phase pulses all coils briefly).

**Fan failure scenario:** With 300 relays simultaneously energised (28 W total) and no airflow, the model predicts 72 °C relay junction — 2 K above the G9EA-1-B 70 °C limit. ShilpaSutra flagged this and suggested a fan-failure GPIO alarm on STM32H743 PA7 (tachometer input). This propagates to the firmware scope in `hardware/firmware/mux-controller/` (issue #45).

---

## 3. Comparison with Manual CAD Approach

| Metric | Manual (Fusion 360) | ShilpaSutra AI-CAD |
|--------|:-----------:|:----------:|
| Time to first STEP | ~3 days | ~3 hours |
| Constraint propagation | Manual re-edit | Parametric auto-update |
| CFD integration | Separate Ansys session | In-browser (ShilpaSutra) |
| Fan-failure discovery | Requires explicit analysis | Flagged automatically |
| BOM delta detection | Manual check | Auto: 154 vs 160 terminals |
| Export format | STEP, DXF | STEP, DXF, SVG (planned) |

---

## 4. Integration with Surya Yantra and SolarLabX

The chassis STEP file feeds three downstream artefacts:

1. **`hardware/schematics/mux-relay-matrix.svg`** — ShilpaSutra export path (issue #37)
2. **`hardware/firmware/mux-controller/`** — fan-failure alarm GPIO pin assignment (issue #45)
3. **SolarLabX** test fixture record — the chassis dimensions and relay count are registered in SolarLabX's LIMS as instrument asset `MUX-001`, enabling audit trail linkage to IV measurements

---

## 5. Conclusions

<!-- TODO: Peer-review from mechanical/thermal engineer -->

ShilpaSutra's conversational CAD workflow is viable for custom laboratory hardware where the constraint set is well-defined but the geometry is non-trivial. The key value is not time-saving alone (3 h vs. 3 days) but the automatic propagation of constraint changes — when the relay count was revised from 300 to 310 (spare channel capacity), all dependent dimensions (DIN rail spans, terminal block rows, fan sizing) updated without manual re-modelling. The fan-failure alarm discovery from CFD is the most safety-critical finding: it is now a firmware requirement rather than a post-commissioning surprise.

---

## References

1. Omron Industrial Automation. *G9EA-1-B High-Capacity Power Relay Datasheet*, Rev. 2024-03. Omron Corporation.
2. Phoenix Contact. *UT 16-1P Feed-Through Terminal Block Product Datasheet*, Item 3044144. Phoenix Contact GmbH.
3. LAPP Group. *ÖLFLEX CLASSIC 110 CY Catalogue*, 2024 Edition. LAPP India Pvt. Ltd.
4. ShilpaSutra. *AI-Powered Text/Multimodal to CAD & CFD Platform*, v0.3. GitHub: ganeshgowri-ASA/ShilpaSutra, 2026.
5. Surya Yantra. *75-Module PV Test Bed BOM*, `hardware/BOM.md`. GitHub: ganeshgowri-ASA/surya-yantra, 2026.
6. IEC 61730-1:2023, *PV module safety qualification — Part 1: Requirements for construction*. Geneva: IEC.
7. IEC 61730-2:2023, *PV module safety qualification — Part 2: Requirements for testing*. Geneva: IEC.

<!-- BLOCKER: Export ShilpaSutra STEP file → commit to hardware/schematics/ (issue #37) -->
<!-- BLOCKER: CFD mesh screenshot PNG with alt-text needed -->
<!-- TODO: Validate fan-failure alarm GPIO against STM32H743 pin assignment (issue #45) -->
<!-- TODO: Reconcile UT 16 terminal count 154 vs 160 in BOM.md §2.8 with procurement -->
