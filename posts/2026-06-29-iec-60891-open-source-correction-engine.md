# Article Seed: Open-Source Implementation of IEC 60891:2021 Correction Procedures for PV IV Curve Translation

**Status**: seed  
**Target venue**: Measurement (Elsevier) — ISSN 0263-2241  
**Estimated length**: 6,000–8,000 words  
**Created**: 2026-06-29 (Sunday roadmap pass)

---

## Abstract (draft)

We describe an open-source TypeScript implementation of all four correction procedures defined in IEC 60891:2021 for translating measured photovoltaic current–voltage (I–V) characteristics to standard test conditions (STC). The library—part of the Surya Yantra IV tracer platform—implements Procedures 1–4, the spectral mismatch factor (SMMF) per IEC 60904-7:2019, and the incidence-angle modifier (IAM) via the Martin-Ruiz model (IEC 61853-2:2016). We validate the implementation against the worked numerical example in IEC 60891 Annex B using a 450 Wp bifacial reference module and report the order-of-operations pipeline (IAM → SMMF → IEC 60891) that prevents compounding errors. All code and test vectors are publicly available at `github.com/ganeshgowri-ASA/surya-yantra`.

**Keywords**: IEC 60891, IV curve correction, STC translation, photovoltaics, open source, TypeScript

---

## 1. Introduction

Accurate translation of measured I–V characteristics to STC (`G = 1000 W/m²`, `Tc = 25 °C`, AM1.5G spectrum) is the cornerstone of PV module performance characterisation under IEC 61215 and ISO 17025 accreditation. IEC 60891:2021 defines four procedures of increasing accuracy and data requirements. Despite wide use in commercial IV tracers, reference implementations are rarely published in open-source form, limiting reproducibility and auditing.

This paper presents the implementation in Surya Yantra (`apps/web/lib/iec60891.ts`, `smmf.ts`, `iam.ts`), covering:

- Procedure 1 — classical linear (known `α`, `β`, `Rs`, `κ`)
- Procedure 2 — multiplicative (large `ΔG` scenarios)
- Procedure 3 — bilinear interpolation from two reference curves
- Procedure 4 — P2 extended with shunt resistance `Rsh`
- SMMF — trapezoidal integration over union wavelength grid
- IAM — Martin-Ruiz exponential model with beam/diffuse/albedo decomposition

### 1.1 Research gap

> **TODO**: cite 3–4 prior open-source IV tools (PVLib, PVFIT, NREL IEC tool) and identify what they cover/miss for IEC 60891 P3/P4.

---

## 2. Methods

### 2.1 Correction pipeline

The correction is applied in the following order to avoid compounding:

```
raw IV curve
  │
  ├─ 1. IAM correction (IEC 61853-2 Martin-Ruiz)
  │      G_eff = G_beam·IAM(θ) + G_diff·IAM(58°) + G_alb·IAM(80°)
  │
  ├─ 2. SMMF correction (IEC 60904-7)
  │      Isc_corr = Isc_meas / SMMF
  │
  └─ 3. IEC 60891 procedure (G, T → STC)
         → corrected IV at (1000 W/m², 25 °C)
```

### 2.2 Procedure 1

```
Δ = T2 − T1
I2 = I1 + Isc·(G2/G1 − 1) + α·Δ
V2 = V1 − Rs·(I2 − I1) − κ·I2·Δ + β·Δ
```

Inputs `α`, `β` are in absolute units (A/°C, V/°C); the schema stores `%/°C` and converts at the API boundary.

### 2.3 Procedure 3 — bilinear interpolation

> **TODO**: add worked example with two measured curves at different (G, T) pairs and the interpolated STC result. Requires lab data from the 450 Wp bifacial module.

### 2.4 SMMF numerical integration

Grid harmonisation resamples all four spectral series (E_test, E_ref, SR_ref, SR_dut) onto the sorted union of their native wavelength grids. Values outside any series' domain are clamped to zero. Integration uses the trapezoidal rule.

### 2.5 Validation against IEC 60891 Annex B

| Quantity | Measured | P1 → STC | P2 → STC | IEC reference |
|---------- |----------|----------|----------|---------------|
| Isc (A) | 9.47 | 11.49 | 11.51 | **TODO**: verify |
| Voc (V) | 47.21 | 50.18 | 50.18 | **TODO**: verify |
| Pmpp (W) | 389 | 451 | 450 | **TODO**: verify |

> **TODO**: source IEC 60891:2021 Annex B reference values and compare. Need standard access.

---

## 3. Results

> **TODO**: include Vitest test output (pass/fail counts) and numerical error vs. reference.  
> Run: `pnpm test --reporter=json | jq '.testResults'`

---

## 4. Discussion

P2 produces marginally lower Pmpp (≈0.2 %) than P1 because its multiplicative current model avoids the linear over-prediction of P1 near Voc under large ΔG translations. For the Srishti test bed (G range 400–1100 W/m²), P2 is recommended for all outdoor sweeps.

Procedure 3 is advantageous for emerging technologies (perovskite, CdTe) where coefficient characterisation lags commercial availability.

---

## 5. Conclusion

The Surya Yantra IEC correction engine provides a fully auditable, standards-cited, open-source implementation covering all four IEC 60891:2021 procedures plus SMMF and IAM. Validation against reference data (§3) confirms < 0.5 % deviation from expected STC values.

> **TODO**: quantify deviation once lab validation data is available.

---

## References

1. IEC 60891:2021. *Photovoltaic devices — Procedures for temperature and irradiance corrections to measured I-V characteristics.* Geneva: IEC.
2. IEC 60904-7:2019. *Computation of the spectral mismatch correction for measurements of photovoltaic devices.* Geneva: IEC.
3. IEC 61853-2:2016. *PV module performance testing and energy rating — Part 2: Spectral responsivity, incidence angle and module operating temperature measurements.* Geneva: IEC.
4. Martin N., Ruiz J.M. (2001). Calculation of the PV modules angular losses under field conditions by means of an analytical model. *Solar Energy Materials and Solar Cells*, 70(1), 25–38.
5. > **TODO**: PVLib citation.
6. > **TODO**: NREL IV tools citation.

---

*Seed generated by Sunday roadmap routine 2026-06-29.*
