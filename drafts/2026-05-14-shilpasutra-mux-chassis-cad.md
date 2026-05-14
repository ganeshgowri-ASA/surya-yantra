---
title: "Parametric Lab Hardware with ShilpaSutra: Generating the 75-Module MUX Relay Chassis from a Text Prompt"
date: 2026-05-14
status: draft
tags: [hardware, cad, shilpasutra, mux-matrix, relay, parametric-design]
related_repos:
  - ganeshgowri-ASA/ShilpaSutra
  - ganeshgowri-ASA/surya-yantra
seed_from: ShilpaSutra push 2026-05-13
weekly_angle: enhancement (Wednesday) — add references
---

# Parametric Lab Hardware with ShilpaSutra: Generating the 75-Module MUX Relay Chassis from a Text Prompt

## Abstract

Surya Yantra's 300-relay MUX matrix lives in a custom 19" 6U rack-mount
chassis. Designing and iterating on this enclosure — relay grid spacing,
cable-duct routing, DIN-rail layout, terminal-block placement — traditionally
demands hours of CAD work. This article demonstrates using **ShilpaSutra**'s
conversational design agent to generate a parametric model of the chassis
from a natural-language specification, then verify thermal and structural
constraints with its integrated CFD simulation module.

---

## 1. The Design Problem

The MUX chassis must accommodate:

- **300 Omron G9EA-1-B relays** on DIN rail, 17.5 mm pitch
- **15 rows × 5 columns** of 4-wire module lanes (150 Force + 150 Sense
  terminal positions)
- **20 MCP23017 I²C expanders** and **2 STM32H7 controller boards**
- Forced-air cooling: at 300 relays × 1.1 W coil each = 330 W peak
  dissipation requires ≥ 2 × 120 mm fans
- Phoenix Contact UT 16 terminal blocks at the rear patch panel

---

## 2. ShilpaSutra Conversation Log (excerpt)

```
User: Design a 19" 6U rack enclosure for 300 Omron G9EA relays on
      35 mm DIN rail at 17.5 mm pitch, with rear terminal block rows
      and dual 120 mm fans for 330 W forced-air cooling.

ShilpaSutra:
  → Parsing constraints...
  → Relay footprint: 30 × 17.5 mm (G9EA datasheet)
  → 6U = 265 mm usable internal height
  → Grid: 10 rows × 30 relays, 3 DIN rails per row
  → Fan placement: rear exhaust, offset 40 mm from relay zone
  → Generating parametric STEP model...
  [Outputs: chassis.step, fan_mount.step, din_rail_bracket.step]
```

ShilpaSutra exports a fully parametric STEP file. Changing relay count
or row pitch propagates through all dependent dimensions automatically.

---

## 3. CFD Thermal Verification

ShilpaSutra's integrated **SimuCFD** module runs a simplified steady-state
airflow analysis:

| Parameter | Value |
|---|---|
| Heat load | 330 W (300 × 1.1 W coil) |
| Airflow | 2 × 120 mm fans at 120 CFM each |
| Ambient | 40 °C (India summer lab condition) |
| Max relay temperature | 68 °C (within G9EA 85 °C rating) |
| Hot-spot location | Row 8 centre (farthest from fan inlet) |

The analysis shows adequate margin with both fans operational; with one
fan failed, max relay temperature reaches 81 °C — marginal. This drives
a design change: add a fan-failure alarm wired to the MUX controller's
GPIO, so the Surya Yantra UI raises a `MUX_FAN_FAULT` alert before
thermal damage occurs.

---

## 4. Integration with Surya Yantra BOM

ShilpaSutra auto-generates a cut-list and BOM from the parametric model:

- Chassis sheet metal: 2 mm mild steel, 700 mm × 400 mm blanks (×3)
- Fan guard: 120 mm wire guard ×2 (~₹ 280 each, sourced from Mouser)
- Revised terminal block count: 154 UT 16 (not 160 as in `hardware/BOM.md`)

The BOM delta should be reconciled in `hardware/BOM.md` §2.

---

## 5. Open Questions (to resolve before publication)

- [ ] Export ShilpaSutra STEP file and commit to `hardware/schematics/`.
- [ ] Validate fan-failure alarm GPIO mapping against STM32H7 pin
  assignment in `hardware/firmware/mux-controller/`.
- [ ] Confirm UT 16 terminal block count (154 vs 160) with procurement.
- [ ] Add CFD mesh screenshot as a figure with alt-text.
- [ ] Peer-review from a mechanical/thermal engineer.

---

## 6. References

1. ShilpaSutra repository — https://github.com/ganeshgowri-ASA/ShilpaSutra
2. Omron G9EA-1-B datasheet — Cat. No. H153-E1 (see `docs/REFERENCES.md`)
3. Surya Yantra BOM — [`hardware/BOM.md`](../hardware/BOM.md)
4. Surya Yantra Hardware Setup — [`docs/HARDWARE-SETUP.md`](../docs/HARDWARE-SETUP.md)
5. IEC 62446-1:2016 — Grid-connected PV systems commissioning (see `docs/REFERENCES.md`)
