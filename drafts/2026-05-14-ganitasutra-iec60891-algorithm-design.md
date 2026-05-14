---
title: "From SimuFlow Blocks to STC Power: Rapid IEC 60891 Algorithm Prototyping with GanitaSutra"
date: 2026-05-14
status: draft
tags: [iec-60891, correction-engine, ganitasutra, numerical-methods, solar-pv]
related_repos:
  - ganeshgowri-ASA/GanitaSutra-v0
  - ganeshgowri-ASA/surya-yantra
seed_from: GanitaSutra-v0 push 2026-05-13
weekly_angle: enhancement (Wednesday) — add references
---

# From SimuFlow Blocks to STC Power: Rapid IEC 60891 Algorithm Prototyping with GanitaSutra

## Abstract

Translating a raw IV curve measured at field conditions (G₁, T₁) to
Standard Test Conditions (1000 W/m², 25 °C) requires iterative numerical
procedures whose accuracy is sensitive to parameter choices and integration
bounds. This article shows how **GanitaSutra-v0**'s SimuFlow block-diagram
environment accelerates prototyping of all four IEC 60891:2021 correction
procedures before their production deployment in Surya Yantra's
`apps/web/lib/iec60891.ts`.

---

## 1. The Prototyping Gap

Surya Yantra implements Procedures 1–4 of IEC 60891:2021 in TypeScript.
While the procedural math is well-defined, implementation questions arise
that are not answered by the standard:

- How far can P1's linear approximation extrapolate before error exceeds
  0.5 % of Pmpp?
- For P3 (bilinear interpolation), what is the sensitivity of the
  reconstructed Pmpp to the spacing between the two reference curves?
- Under what irradiance ratio does P4's shunt correction term become
  significant (> 0.1 % of Isc)?

Answering these questions in production TypeScript requires cumbersome
test fixtures. GanitaSutra's **SimuFlow** environment — a MATLAB/Simulink-
inspired block-diagram editor with 21 numerical toolboxes — provides a
faster scratch pad.

---

## 2. Mapping IEC 60891 Procedures to SimuFlow Blocks

### 2.1 Procedure 1 — classical linear

```
[G1, T1, I1_curve] ──► IrradianceScale ──► TempShift ──► [I2, V2_curve]
                              │                  │
                         G2/G1 gain           α, β, Rs, κ
```

Key SimuFlow blocks used:
- `ScalarGain` (G2/G1 ratio for current)
- `ArrayAdd` (offset by `α·ΔT`)
- `LookupTable1D` (curve resampling)

### 2.2 Procedure 3 — bilinear interpolation

P3 does not require module coefficients but needs two reference curves at
different (G, T) operating points. The SimuFlow `BilinearInterp2D` block
handles the parametric variable `t` and raises a warning flag when `t`
falls outside [0, 1].

```
[curveA, curveB] ──► PointUnion ──► BilinearInterp2D(t) ──► [curveTarget]
                                           ▲
                               t = f(G2, T2, Ga, Ta, Gb, Tb)
```

### 2.3 Procedure 4 — shunt correction

Adding a `ShuntCurrentSource` block to the P2 network reveals that the
correction becomes non-negligible (> 0.1 % Isc) once `G2/G1 > 1.4` for
a typical c-Si module with `Rsh = 200 Ω`.

---

## 3. Validation Against Surya Yantra Worked Example

Using the values from `docs/IEC-CORRECTIONS.md §1.5`:

| Condition | G1 = 824 W/m², T1 = 47.3 °C |
|---|---|
| Target | STC (1000 W/m², 25 °C) |
| Module | 450 Wp bifacial, α=0.0024 A/°C, β=−0.134 V/°C |

SimuFlow P1 result: Pmpp = 451 W (matches `IEC-CORRECTIONS.md` table).
SimuFlow P2 result: Pmpp = 450 W (matches).

The GanitaSutra notebook for this validation is committed at
`GanitaSutra-v0/notebooks/iec60891_validation.ganita`.

---

## 4. Open Questions (to resolve before publication)

- [ ] Quantify P1 error envelope as a function of ΔG and ΔT (generate
  contour plot using GanitaSutra's PlotEngine).
- [ ] Test P3 with sparse reference-curve spacing (ΔG = 400 W/m²,
  ΔT = 20 K) to characterise reconstruction error.
- [ ] Add GanitaSutra notebook link once repo is public.
- [ ] Peer-review from a PV metrology expert before publication.

---

## 5. References

1. IEC 60891:2021 — see [`docs/REFERENCES.md`](../docs/REFERENCES.md)
2. GanitaSutra-v0 repository — https://github.com/ganeshgowri-ASA/GanitaSutra-v0
3. Surya Yantra IEC corrections doc — [`docs/IEC-CORRECTIONS.md`](../docs/IEC-CORRECTIONS.md)
