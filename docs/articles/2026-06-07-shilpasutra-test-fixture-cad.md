---
title: "AI-Parametric Design of a 75-Module 4-Wire Kelvin Test Fixture Using ShilpaSutra"
slug: shilpasutra-pv-test-fixture-cad
date: 2026-06-07
author: Srishti PV Lab
status: seed
tags:
  - cad
  - hardware
  - shilpasutra
  - surya-yantra
  - test-fixture
keywords:
  - AI CAD solar test fixture
  - 4-wire Kelvin connection PV module
  - parametric design PV test bed
  - ShilpaSutra CAD generation
  - IEC 62915 test documentation
  - 75 module test bed design
description: >
  ShilpaSutra's conversational CAD agent can turn a natural-language description
  of the Surya Yantra 75-module 4-wire Kelvin test bed into parametric drawings,
  BOM-linked assembly trees, and IEC 62915-compliant test documentation —
  closing the gap between firmware that traces IV curves and the physical fixture
  that holds the modules.
---

# AI-Parametric Design of a 75-Module 4-Wire Kelvin Test Fixture Using ShilpaSutra

*Engineering note seeded 2026-06-07, linking ShilpaSutra's conversational
CAD platform to Surya Yantra's hardware design requirements.*

---

## 1. The documentation gap in PV test system hardware

Surya Yantra's software stack is well-specified: the `docs/HARDWARE-SETUP.md`
describes the system block diagram, `hardware/BOM.md` lists purchased
components, and `hardware/schematics/` (planned) will host SVG circuit
diagrams. What is missing is **parametric mechanical drawings** of the
test fixture that holds 75 bifacial modules in a 15 × 5 grid and routes
4-wire Kelvin connections from each module to the MUX relay matrix.

This fixture is not a commodity item. Its design constraints include:

| Constraint | Value |
|---|---|
| Module array | 15 rows × 5 columns, 1 m pitch |
| Electrical connection | 4-wire Kelvin: Force+, Force−, Sense+, Sense− |
| Wiring gauge | 10 mm² (Force), 2.5 mm² (Sense) |
| Connector standard | MC4 (PV side) + custom lemo/terminal (MUX side) |
| Frame material | Unistrut 41 × 41 mm (galvanised steel) |
| Tilt | Fixed 10° (Jamnagar latitude 22.47°N) |
| Wind load | Zone III, 50-year return (IS 875 Part 3) |

---

## 2. ShilpaSutra as a parametric CAD partner

[ShilpaSutra](https://github.com/ganeshgowri-ASA/ShilpaSutra) ("The Formulas
of Craftsmanship") is a Text/Multimodal-to-CAD platform with:

- **Conversational design agent** powered by Claude
- **Parametric sketch engine** (constraints, DOF solver)
- **FEM structural analysis** for wind/dead-load verification
- **IEC drawing sheet generation** (A0–A4, title block, revision table)
- **BOM integration** with quantity take-off

The June 2026 development sprint (see Vercel deployment history PR #207,
#204, #201, #198) has been cleaning up dead code and adding unit tests to the
geometry engine, making the sketch and assembly modules more reliable for
production use.

---

## 3. Proposed ShilpaSutra prompt for the fixture frame

The following natural-language prompt is suitable for ShilpaSutra's
`/api/generate-cad` endpoint:

```
Design a fixed-tilt solar PV module test rack for 75 bifacial modules
(900 W each) arranged in a 15 × 5 grid:

- Module dimensions: 2279 × 1134 × 35 mm (Tier 1 bifacial 72-cell)
- Row spacing: 100 mm clear gap for bifacial rear access
- Column spacing: 30 mm
- Tilt angle: 10° fixed (south-facing, Jamnagar 22.47°N 70.06°E)
- Frame: Unistrut P1000 41×41 mm hot-dip galvanised
- Foundation: helical ground screws, 4 per row (60 total)
- Electrical routing: 4-wire Kelvin harness conduit along each row,
  running to a 19-inch relay cabinet at the east end
- Standards: IS 875 Part 3 wind Zone III, IEC 62915 test documentation

Generate: (1) front elevation, (2) side elevation,
(3) typical module-clip detail, (4) wiring conduit routing plan.
```

---

## 4. Expected design outputs

### 4.1 Structural frame

ShilpaSutra's assembly engine can generate a parametric frame where the
15 rows are instances of a single row sub-assembly. Key parameters:

```
row_count       = 15
col_count       = 5
module_width    = 1134   # mm
module_height   = 2279   # mm
row_gap         = 100    # mm
col_gap         = 30     # mm
tilt_angle      = 10     # degrees
purlin_section  = P1000  # 41×41 Unistrut
rafter_section  = P3300  # 41×82 Unistrut (every 2nd column)
```

Parametric total footprint:
```
frame_width  = 5 × 1134 + 4 × 30 = 5790 mm ≈ 5.8 m
frame_height = 15 × 2279 + 14 × 100 = 35585 mm ≈ 35.6 m
```

### 4.2 4-wire Kelvin wiring conduit layout

Each module requires four conductors to the MUX. With 75 modules and
4 conductors each = 300 conductors. The routing plan groups them:

- **Per-row conduit** (15 rows × 20 conductors = row loom)
- **Trunk conduit** along the east edge to the relay cabinet
- **Cabinet entry** into the 300-relay MUX matrix

ShilpaSutra can generate an IEC 62915-compliant wiring diagram with
wire numbers, conductor sizes, and termination details.

### 4.3 FEM wind load verification

ShilpaSutra's FEM module can verify the Unistrut frame against IS 875 Part 3
Zone III (basic wind speed 44 m/s at Jamnagar). Expected critical load case:
wind pressure on the tilted panel array acting on the end rafter.

```
A_eff ≈ 5.8 m × 35.6 m × sin(10°) = 35.8 m²  (projected normal area)
q_d   = 0.6 × V² = 0.6 × 44² ≈ 1162 N/m²
F_wind ≈ Cf × q_d × A_eff ≈ 1.3 × 1162 × 35.8 ≈ 54 kN
```

The assembly must be verified for this load with adequate safety factor
(IS 800 steel design, SF ≥ 1.5).

---

## 5. Integration with Surya Yantra's test documentation

Once generated, the ShilpaSutra drawings can be linked into the Surya Yantra
documentation workflow:

1. **`hardware/schematics/`** — receive the SVG exports from ShilpaSutra
2. **`hardware/BOM.md`** — auto-generated BOM from the parametric model
   replaces the manually maintained current BOM
3. **`docs/HARDWARE-SETUP.md`** — embed generated drawings with alt-text
4. **Reports screen** — the test report PDF (`POST /api/reports`) can
   reference the fixture drawing number for traceability

---

## 6. IEC 62915 alignment

IEC 62915:2021 (*PV module type approval, design and safety qualification
testing — Test equipment and calibration*) requires that test equipment
documentation include dimensional drawings, wiring diagrams, and
uncertainty budgets. ShilpaSutra's output directly maps to:

- Clause 5.2: Test equipment documentation
- Clause 6.1: Wiring and connection diagrams
- Clause 7.3: Calibration traceability records (via SolarLabX calibration chain)

---

## 7. Next steps for this article

- [ ] Run the ShilpaSutra prompt and capture the generated CAD output
- [ ] Add actual SVG drawings to `hardware/schematics/`
- [ ] Perform FEM wind load verification with IS 875 Zone III parameters
- [ ] Create PR to replace manual BOM entries with parametric quantities

---

*Related repos: [ShilpaSutra](https://github.com/ganeshgowri-ASA/ShilpaSutra) ·
[Surya Yantra](https://github.com/ganeshgowri-ASA/surya-yantra) ·
[SolarLabX](https://github.com/ganeshgowri-ASA/SolarLabX)*
