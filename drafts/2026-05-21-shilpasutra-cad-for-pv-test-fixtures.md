---
title: "From Prompt to PCB Layout: Using ShilpaSutra's Conversational CAD Agent to Engineer PV Test Fixtures"
slug: shilpasutra-cad-for-pv-test-fixtures
status: seed
date: 2026-05-21
lastmod: 2026-05-21
tags: [shilpasutra, surya-yantra, cad, fixture-design, kelvin-sensing, open-source]
seed_source: ShilpaSutra pushed 2026-05-21 (84 open issues active sprint)
weekly_angle: Thu — peer-review checklist
---

## Peer-Review Checklist (fill before promotion to `posts/`)

- [ ] All factual claims about ShilpaSutra API/features verified against the ShilpaSutra repo README
- [ ] Kelvin-sensing wiring constraints (Force 16 mm², Sense 2.5 mm²) cross-checked with `docs/HARDWARE-SETUP.md §5`
- [ ] Parametric model outputs (slot pitch, busbar height) validated against `hardware/BOM.md` dimensions
- [ ] All figures have alt-text
- [ ] Citations: IEC 62446-1:2016 and ShilpaSutra project URL included
- [ ] No proprietary ShilpaSutra internals disclosed (check repo visibility: public)
- [ ] Abstract ≤ 250 words
- [ ] Code snippets tested end-to-end (if any)

---

## Abstract

Designing the mechanical chassis for a 75-module, 300-relay PV test bed is
an exercise in constraint satisfaction: you need 160 Phoenix Contact UT 16
terminal blocks, a 6U 19" rack enclosure, and copper busbars whose cross-
section must carry 30 A DC without exceeding 60 °C rise — all while
maintaining 4-wire Kelvin topology that separates Force and Sense paths
right up to the module junction box.

**ShilpaSutra** (ganeshgowri-ASA/ShilpaSutra) is an AI-powered
Text/Multimodal-to-CAD & CFD platform. This article shows how to drive
ShilpaSutra's conversational design agent with Surya Yantra's hardware
constraints to generate:

1. A parametric STEP model of the MUX chassis panel
2. A busbar sizing calculation with thermal FEA snapshot
3. A cable-harness routing diagram for the Kelvin pairs

The result cuts fixture-design iteration from days to hours and produces
artefacts directly importable into the rack-layout drawing.

---

## 1. The Design Problem

### 1.1 Mechanical envelope

The MUX relay matrix (Hammond RM2U1908, 6U) must accommodate:

- 300 Omron G9EA-1-B relays on DIN rail (35 mm pitch per relay socket)
- 160 × UT 16 terminal blocks (Force lane) — 6.2 mm pitch each
- 160 × UT 2.5 terminal blocks (Sense lane) — 5.2 mm pitch each
- 20 × MCP23017 I²C expanders + STM32H743 controller board

Available chassis depth: 800 mm; width: 19" (482 mm usable); height: 6U
(266 mm).

### 1.2 Kelvin constraint

Force+ and Force− carry up to 30 A; each must be 16 mm² copper.
Sense+ and Sense− are voltage-only; 2.5 mm² suffices, but they **must**
be shielded twisted pairs with the shield grounded at the MUX end only.
This means Force and Sense cables from the same module share a Stäubli
MC4-EVO2 Y-splitter at the panel entry but fan out to separate terminal
rows inside.

---

## 2. Driving ShilpaSutra

### 2.1 Context injection

```
User: I need a 6U rack panel layout for a 75-channel, 4-wire Kelvin
      relay matrix. Relay: Omron G9EA-1-B on DIN rail (35mm pitch).
      Force terminal: Phoenix UT 16 (6.2mm pitch, 2 per channel = 150).
      Sense terminal: Phoenix UT 2.5 (5.2mm pitch, 2 per channel = 150).
      Panel width 482mm, depth 800mm, height 266mm (6U).
      Produce: (a) parametric DIN-rail layout sketch, (b) busbar sizing
      for 30A×75 channels at 60°C rise limit, (c) cable-entry Y-splitter
      pattern at the rear panel.
```

### 2.2 Expected ShilpaSutra outputs

ShilpaSutra's parametric engine resolves the DIN-rail count (≈ 8 rails
at 35 mm pitch = 280 mm, fits within 266 mm height with 3 rows staggered
across 3 sub-panels), generates a STEP file, and runs a 2D heat-flow
estimate for the copper busbar.

> **TODO (content gap):** Embed the actual ShilpaSutra session transcript
> and STEP preview once the conversational API is stable.

---

## 3. Integration with Surya Yantra

The STEP model exported from ShilpaSutra feeds directly into:

- `hardware/BOM.md` — update enclosure line (§2.7) with final chassis
  part number once the parametric model is frozen
- `docs/HARDWARE-SETUP.md §4` — replace the text description of MUX
  dimensions with a link to the generated drawing

A future PR will add `hardware/schematics/` (referenced in README but
currently absent — see GitHub Issue #TBD).

---

## 4. CFD Thermal Validation

At full load (75 modules × 30 A × 300 Ω contact resistance ≈ 675 W
dissipation in worst case) the rack fan tray must maintain all relays
below their 85 °C maximum. ShilpaSutra's CFD module (built on OpenFOAM
under the hood) can sweep fan speed vs. hot-spot temperature in < 5
minutes per simulation point.

> **TODO (content gap):** Run the CFD sweep and include the fan-speed vs
> max-relay-temp chart with alt-text.

---

## 5. References

1. ShilpaSutra repository — https://github.com/ganeshgowri-ASA/ShilpaSutra
2. Surya Yantra Hardware Setup — `docs/HARDWARE-SETUP.md`
3. Surya Yantra Bill of Materials — `hardware/BOM.md`
4. IEC 62446-1:2016, *Grid-connected PV systems — Minimum requirements for
   system documentation, commissioning tests, and inspection*.
5. Phoenix Contact UT 16 terminal block datasheet, 2024.
6. Omron G9EA-1-B relay datasheet, Rev. 5, 2023.
