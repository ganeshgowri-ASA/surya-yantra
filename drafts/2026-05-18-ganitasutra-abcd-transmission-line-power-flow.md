---
title: "ABCD Two-Port Networks to Y-Bus: How GanitaSutra Closes the Power Systems Analysis Loop"
slug: ganitasutra-abcd-transmission-line-power-flow
description: "How GanitaSutra-v0's new equivalentPi() and lineYBus() functions bridge distributed-parameter ABCD transmission line models to Newton-Raphson power flow — and why this matters for IEC 61215-grade PV test infrastructure at the Srishti lab."
keywords:
  - GanitaSutra power systems TypeScript
  - ABCD two-port transmission line
  - equivalent pi circuit Newton-Raphson
  - Y-bus admittance matrix open source
  - power flow Gauss-Seidel TypeScript
  - IEC 60909 short-circuit analysis
  - Glover-Sarma-Overbye ABCD model
  - open source power systems JavaScript
  - PV lab grid impedance qualification
  - IEC 61215 supply impedance
  - NABL PV lab power quality
  - transmission line hyperbolic model
  - Srishti Advanced Systems power analysis
date: 2026-05-18
lastmod: 2026-05-18
author: ganeshgowri-ASA
draft: true
og_image: /og/ganitasutra-abcd-transmission-line-power-flow.png
og_image_alt: "Diagram showing the GanitaSutra transmission line ABCD model pipeline: distributed-parameter long-line → equivalentPi() → lineYBus() → Newton-Raphson power flow solver, with connection to Surya Yantra IEC 60891 correction"
canonical: https://surya-yantra.srishtipvlab.in/posts/ganitasutra-abcd-transmission-line-power-flow
twitter_card: summary_large_image
schema_type: TechArticle
schema_about: Open-source TypeScript power systems analysis library for PV testing infrastructure
target_venue: Electric Power Systems Research (Elsevier) or Journal of Open Source Software (JOSS)
word_count_target: 4000
peer_review_status: outline
seo_focus_keyword: open source transmission line ABCD power flow TypeScript
seed_trigger: GanitaSutra-v0 PRs #131–#137 (Mon 2026-05-18) — equivalentPi, lineYBus, ABCD stability tests, Saturday zero-denominator hardening
weekly_angle: outline
---

# ABCD Two-Port Networks to Y-Bus: How GanitaSutra Closes the Power Systems Analysis Loop

> **Status:** Outline — created 2026-05-18 (Monday outline pass).
> **Engineering trigger:** GanitaSutra-v0 PRs #131–#137 shipped `equivalentPi()`,
> `lineYBus()`, 53+ transmission-line tests (up from 34), and zero-denominator
> hardening in `lib/power/transmission-lines.ts`.
> **Research narrative:** A complete open-source TypeScript power systems analysis
> stack — distributed-parameter ABCD → equivalent-π → 2×2 Y-bus — is now
> available for browser and edge-function deployment. This closes the loop between
> GanitaSutra's computational back-end and Surya Yantra's IEC 60891 correction
> engine, enabling supply-impedance-corrected IV curve measurements without a
> Python backend.

---

## §1 — Introduction

### 1.1 Why Power Systems Analysis Belongs in a PV Test Lab

IEC 61215:2021 module design qualification requires IV curve measurements at known
supply conditions. Grid impedance variations introduce a systematic voltage droop
at Isc (up to 27 A for the ESL-Solar 500), biasing the measured Pmax. A lightweight
power systems module embedded in GanitaSutra enables:

- Supply impedance estimation at the Srishti lab's 415 V three-phase busbar
- Voltage droop correction at peak sweep current, feeding IEC 60891 Procedure 2
- Validation that the lab supply meets IEC 60364-6 commissioning requirements

<!-- TODO: Quantify the IV curve bias (%) from 1 % supply voltage variation at Isc=27 A;
     cite ESL-Solar 500 datasheet for rated load impedance -->

### 1.2 Prior Art Gap in Browser-Native Power Systems Tools

Existing open-source power systems libraries — PyPSA, pandapower, OpenDSS — are
Python-based, heavyweight, and require full network topology as input. GanitaSutra
fills the gap for single-line impedance calculations in TypeScript/browser
environments, enabling Surya Yantra's Next.js web app to compute on-demand grid
corrections without a Python sidecar.

<!-- TODO: Literature search to confirm no prior TypeScript/JS power systems library
     reaches distributed-parameter ABCD + Y-bus (this is the novelty claim) -->

---

## §2 — Mathematical Foundation

### 2.1 Distributed-Parameter ABCD Model

The long-line ABCD matrix (Glover-Sarma-Overbye 6th ed. §5) is:

```
[VS]   [ cosh(γl)       Zc·sinh(γl) ] [VR]
[IS] = [ sinh(γl)/Zc    cosh(γl)    ] [IR]
```

where γ = √(zy) is the complex propagation constant and Zc = √(z/y) is the
characteristic impedance. GanitaSutra computes `ccosh`/`csinh` using
`Math.cosh`/`Math.sinh` (IEEE 754-2019; avoids catastrophic cancellation for
small α·l — see PR #131 refactor rationale).

**Three models shipped:**

| Model | Validity | A/D | B | C |
|-------|----------|-----|---|---|
| Short | <80 km | 1 | z·ℓ | 0 |
| Medium-π | 80–250 km | 1+ZY/2 | Z | Y(1+ZY/4) |
| Long | >250 km | cosh(γl) | Zc·sinh(γl) | sinh(γl)/Zc |

All satisfy AD−BC=1 (reciprocity) — verified algebraically and via 53+ tests.

<!-- TODO: Table comparing medium-π vs long-line accuracy at 100/200/500 km vs.
     IEC 60909-0 reference values (quantify when medium-π is adequate) -->

### 2.2 Equivalent-π Conversion — `equivalentPi(abcd)` (PR #133)

Converts ABCD to the nominal-π circuit ready for power flow:

```typescript
Z_series = B
Y_A = (D − 1) / B   // sending-end shunt to ground
Y_B = (A − 1) / B   // receiving-end shunt to ground
```

Validation checkpoints: short model gives Y_A = Y_B = 0 (no shunts, as expected);
medium-π recovers Y_total/2 exactly; long model deviates by >0.5% at 500 km
(hyperbolic correction confirmed — see PR #133 test block "Long-model shunts
deviate from nominal-π by >0.5% at 500 km").

### 2.3 2×2 Admittance Matrix — `lineYBus(abcd)` (PR #133)

Builds the nodal admittance matrix for direct Y-bus insertion:

```
Y₁₁ = Y_A + 1/Z_series    Y₁₂ = −1/Z_series
Y₂₁ = −1/Z_series          Y₂₂ = Y_B + 1/Z_series
```

Suitable for Newton-Raphson or Gauss-Seidel power flow — the receiving-end bus
injects current IR = Y₂₁·VS + Y₂₂·VR, which closes the power balance equation.

<!-- TODO: Worked example: compute Y-bus for Srishti lab 11 kV feeder
     (800 m XLPE cable, r=0.268 Ω/km, x=0.079 Ω/km from IS 1554 Part 1) -->

---

## §3 — Test Coverage and Numerical Stability

### 3.1 Test Uplift Summary (PRs #131–#137)

| PR | Δ tests | Key assertions |
|----|---------|----------------|
| #131 | +5 | Long-line stability (2000 km), AD−BC=1 reciprocity |
| #132 | +5 | `Math.cosh/sinh` precision; `voltageProfile` no `reverse()` mutation |
| #133 | +13 | `equivalentPi` correctness; `lineYBus`; SIL identity (|VS|=|VR| at SIL load) |
| #134 | +12 | Orthogonal ABCD; `loadCurrent` leading pf; SIL quadratic voltage scaling |
| #135 | +10 | Thu uplift — 10 assertions across frequency scaling, SIL, lossless short |
| #136 | +5 | Sat: `lineLosses` PS_MW=0 guard; `voltageProfile` nPoints<1 RangeError |
| #137 | +3 | Sat: zero-denominator pinning (VR=0, VS=0 paths as UI-validation preconditions) |

**Total transmission-line tests:** 34 → 53+ (target: 60 before article promotion)

### 3.2 Zero-Denominator Hardening (PR #136)

The Saturday security pass hardened three arithmetic fault paths:

| Function | Fault condition | Before | After |
|----------|----------------|--------|-------|
| `lineLosses` | PS_MW = 0 | NaN/Infinity | `loss_pct = 0` |
| `voltageProfile` | nPoints < 1 | 0/0 in loop | `RangeError` |
| `voltageRegulation`, `ferrantiEffect`, `loadCurrent` | VR = 0 | NaN/Infinity | Pinned `!isFinite` (UI precondition) |

The `VR=0` paths are physically nonsensical for a powered bus; pinning them
as `!isFinite` documents the UI validation requirement (IEC 60364-6: the load
voltage shall be non-zero before a correction is applied).

<!-- TODO: Confirm alignment with IEC 60364-6 §61.3 measurement preconditions -->

---

## §4 — Application to PV Lab: IEC 61215 Supply Impedance

### 4.1 Connecting GanitaSutra to Surya Yantra's Correction Engine

<!-- TODO: Full worked example — complete after apps/web/lib/antaryami.ts
     is scaffolded (surya-yantra issue #29) and POST /api/corrections/apply
     is consolidated (surya-yantra issue #53) -->

The proposed integration pipeline:

1. GanitaSutra `lineYBus()` computes lab feeder admittance from cable datasheet
2. `voltageRegulation()` at Isc=27 A yields supply droop ΔV [%]
3. Surya Yantra `POST /api/corrections/apply` uses ΔV as input to IEC 60891 P2
4. SolarLabX records grid impedance as a measurement condition in the NABL test certificate

### 4.2 GanitaSutra × SolarLabX: Grid Impedance in the Test Certificate

<!-- TODO: SolarLabX #115 (OpenAPI 3.1 spec) should include a
     `grid_impedance_ohm` field in the test certificate schema.
     Coordinate with SolarLabX team before article finalisation. -->

---

## §5 — Research Contribution

### 5.1 Novelty Claim

The combination of (a) distributed-parameter ABCD with precision `Math.cosh/sinh`,
(b) `equivalentPi()` + `lineYBus()` for direct Newton-Raphson insertion, (c)
zero-denominator hardening for embedded/browser deployment, and (d) direct
application to PV test lab supply qualification constitutes a novel minimal
power systems analysis library for TypeScript/edge environments.

<!-- TODO: Confirm via Google Scholar + npm registry search that no
     prior TypeScript power systems library reaches ABCD + Y-bus -->

### 5.2 Suggested Venues

| Venue | Scope | Notes |
|-------|-------|-------|
| Electric Power Systems Research | Power engineering | IF 3.9, short comms accepted |
| IEEE Access | Broad open-access | Lower barrier, faster turnaround |
| Journal of Open Source Software | Software-centric | 1000-word review article format |
| Applied Energy | Energy systems | If PV lab application dominates the narrative |

---

## §6 — Blockers Before Promotion to posts/

- [ ] Literature survey: no prior TypeScript/JS ABCD + Y-bus library (novelty confirmation)
- [ ] Worked example: Srishti lab 11 kV feeder impedance → ΔV at Isc=27 A
- [ ] Integration with Surya Yantra IEC 60891 P2 (requires issues #53 + #29)
- [ ] GanitaSutra-v0 repo citation: confirm public URL or pre-print DOI
- [ ] OG image: `/og/ganitasutra-abcd-transmission-line-power-flow.png` (issue #48 scope)
- [ ] Peer review: power systems engineer + PV test specialist

---

## References (Outline)

1. Glover, J.D., Sarma, M.S., Overbye, T.J. (2012). *Power Systems Analysis and Design*, 5th ed. Cengage Learning. §5: Transmission Lines.
2. IEC 60909-0:2016, *Short-circuit currents in three-phase AC systems — Part 0: Calculation of currents*. Geneva: IEC.
3. IEC 61215:2021, *Terrestrial photovoltaic (PV) modules — Design qualification and type approval*. Geneva: IEC.
4. IEC 60364-6:2016, *Low-voltage electrical installations — Part 6: Verification*. Geneva: IEC.
5. IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and irradiance corrections to measured I-V characteristics*. Geneva: IEC.
6. GanitaSutra-v0. *Computational Design Tools for Materials and Energy Systems*. GitHub: ganeshgowri-ASA/GanitaSutra-v0, 2026.
7. Surya Yantra. *Srishti PV Module IV Curve Tracer & Test Management System*. GitHub: ganeshgowri-ASA/surya-yantra, 2026.
8. Brown, M. et al. (2023). PyPSA-Earth: A new global open energy system optimisation model. *Energy Strategy Reviews*, 46, 101016.

<!-- TODO: Add IEEE Std 399-1997 (Brown Book) for industrial power analysis -->
<!-- TODO: Add IS 1554 Part 1 (Indian Standard for PVC cables) for feeder datasheet -->
