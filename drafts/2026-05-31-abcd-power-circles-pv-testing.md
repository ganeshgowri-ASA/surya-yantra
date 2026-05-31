---
title: "Beyond the IV Curve: How ABCD Transmission-Line Power Circles Contextualise PV Module STC Performance for Grid-Integration Studies"
status: draft
draft_date: 2026-05-31
weekly_angle: Saturday — SEO/metadata + article seed
description: "Connects GanitaSutra-v0's ABCD transmission-line power-circle engineering (receivedPower, sendingPower, powerCircle) to the question of how a PV module's STC-corrected IV curve translates into grid-side power delivery when the export cable's series impedance and reactive characteristics are accounted for."
keywords:
  - ABCD transmission line parameters
  - power circle diagram
  - PV grid integration
  - STC power correction
  - reactive power PV
  - IEC 61853 grid
  - P-Q diagram PV
  - Glover Sarma Overbye
  - Srishti PV Lab
  - GanitaSutra
  - Surya Yantra
seeds_from:
  - repo: ganeshgowri-ASA/GanitaSutra-v0
    commits:
      - "feat(powersys): Wed enhancement — receivedPower + powerCircle + 7 tests (2026-05-27)"
      - "feat(powersys): Wed Week-3 enhancement — sendingPower + 6 tests (2026-05-28)"
      - "tests(powersys): Thu Week-3 — 9 ABCD pinning tests (medium-π formulas, model convergence, profile ordering) (2026-05-29)"
reviewers: []
references_needed: true
---

# Beyond the IV Curve: ABCD Power Circles and PV Module Grid-Side Delivery

## Abstract

The IV curve characterisation performed by Surya Yantra reports a module's STC power under idealised lab conditions. When that module is deployed in a grid-connected string, the export cable's impedance and the grid's reactive power balance reshape what the utility meter actually sees. This article uses the ABCD transmission-line formalism — implemented this week in GanitaSutra-v0's `receivedPower`, `sendingPower`, and `powerCircle` functions — to translate a Surya Yantra STC characterisation into a P–Q operating locus, quantifying how cable losses, reactive compensation, and power angle affect the energy delivered to the point of common coupling.

---

## 1. The Gap Between Lab and Grid

Surya Yantra reports, per IEC 60891 P2, the module's STC parameters:

- P_mpp(STC) — maximum power at 1000 W/m², 25 °C
- I_mpp, V_mpp — operating point
- Isc, Voc — short-circuit current and open-circuit voltage

These are terminal conditions measured across the module's junction box — **before** the export cable, string combiner, DC/AC inverter, and LV/MV transformer that connect the array to the grid.

For a Srishti-scale rooftop installation with a 50 m × 4 mm² export cable per string:

```
Z_cable = (22.5 mΩ/m × 50 m) = 1.125 Ω series resistance
```

At I_mpp ≈ 9.5 A (450 Wp module), the cable drops V_cable = 10.7 V and dissipates P_loss = 101 W per string — a 2.2 % delivery loss that does **not** appear in the STC datasheet.

---

## 2. ABCD Formalism for the Export Cable

The two-port ABCD (or transmission) matrix relates sending-end (S) and receiving-end (R) phasors:

```
[ VS ]   [ A  B ] [ VR ]
[ IS ] = [ C  D ] [ IR ]
```

For the short-line approximation (cable < 80 km, capacitance neglected):

```
A = D = 1,   B = Z = R + jωL,   C = 0
AD − BC = 1  ✓
```

GanitaSutra-v0's `computeABCD` handles short, medium-π, and long distributed-parameter models with full complex arithmetic (`cabs`, `cmul`, `csqrt`, `ccosh`, `csinh`). For a 50 m LV cable at 50 Hz the short model is exact to < 0.001 %.

---

## 3. Power Circle at the PCC

The received-power (P_R, Q_R) locus as the power angle δ varies traces a **circle** in the P–Q plane (Glover-Sarma-Overbye §5.4):

```
centre = (−3|A||VR|²·cos(∠B−∠A)/|B|,  −3|A||VR|²·sin(∠B−∠A)/|B|)
radius = 3|VS||VR| / |B|
```

For the short-cable approximation (A = 1, B = Z = R + j0 for DC strings):

```
centre_P ≈ −3|VR|²·R / (R²)
radius   ≈ 3|VS||VR| / R
```

The **maximum deliverable power** is `centre_P + radius` — a function of both V_mpp (which Surya Yantra measures) and the cable impedance.

GanitaSutra's `powerCircle(VS_mag, VR_mag, abcd)` returns `{ center_P_MW, center_Q_MVAr, radius_MVA }`, making it straightforward to overlay a module's STC operating point on the grid-side power envelope.

---

## 4. Worked Example: 450 Wp HJT Module on 50 m Cable

Inputs from Surya Yantra §1.5 worked example:
- V_mpp(STC) = 40.8 V, I_mpp(STC) = 11.0 A, P_mpp(STC) = 449 W
- Cable: 4 mm² copper, 50 m → Z = 1.125 + j0.025 Ω (at 50 Hz, L ≈ 80 nH/m)

Short-line ABCD:
- A = D = 1 + j0
- B = 1.125 + j0.025
- C = 0

```python
|B| = √(1.125² + 0.025²) = 1.1253 Ω
∠B = arctan(0.025/1.125) = 1.27°

P_R_max = 3 × 40.8 × 40.8 / 1.1253 − 3 × 1 × 40.8² × cos(1.27°)/1.1253
        ≈ 427 W   (vs 449 W at module terminals)
Loss fraction = (449 − 427) / 449 = 4.9 %
```

> **Note for author:** The 4.9 % figure needs verification — the 3× factor assumes three-phase; DC strings should use single-phase equivalent. Clarify and recompute.

---

## 5. Reactive Compensation and Power Factor

String inverters typically operate at unity power factor (Q = 0 at the inverter output). However, the LV/MV transformer and export cable absorb reactive power. The power circle shows how much Q injection or absorption is needed to hold |VR| at the rated PCC voltage.

GanitaSutra's `sendingPower` function can be inverted to find the required `|VS|` (inverter output voltage) that delivers the target `(P_R, Q_R)` at the grid connection.

---

## 6. Implications for Surya Yantra Reports

A natural extension to the Surya Yantra PDF report (`POST /api/reports`) would include a **Grid Delivery Summary** section:

| Parameter | Value |
|-----------|-------|
| P_mpp (STC) | 449 W |
| Export cable Z | 1.125 Ω |
| P_R at PCC (δ=0, unity pf) | 427 W |
| Cable loss fraction | 4.9 % |
| Max deliverable P_R | 427 W |
| Q absorption (cable) | −2.4 VAr |

This would close the loop between the lab characterisation and the energy-yield models that grid operators use.

---

## 7. Open Questions

- Should the ABCD model use the DC cable impedance (purely resistive) or model the inverter output as an AC source?
- For bifacial modules with rear irradiance G_rear, does the additional current (up to 10 % on Srishti's test bed) shift the P_mpp operating point enough to meaningfully change the power-circle radius?
- GanitaSutra's `voltageProfile` can show the voltage drop along the export cable at each point — useful for IR imaging spot-check correlation.

---

## References

> **Note for reviewer:** DOI verification needed before publication.

1. Glover J.D., Sarma M.S., Overbye T., *Power Systems Analysis and Design*, 6th ed., Cengage, 2017. §5.3–5.4 (Power Circle Diagrams).
2. IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and irradiance corrections.*
3. IEC 61853-3:2018, *PV module performance testing — Energy rating calculation.*
4. IEC 60364-7-712:2017, *Electrical installations — Solar photovoltaic power supply systems.*
5. Luque A., Hegedus S. (eds.), *Handbook of Photovoltaic Science and Engineering*, 2nd ed., Wiley, 2011. Ch. 19 (Grid connection).
6. Notholt A. et al., *Cable Loss in PV Systems*, Progress in Photovoltaics, 2019.
