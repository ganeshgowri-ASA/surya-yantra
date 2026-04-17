# IEC Correction Algorithms — Implementation Notes

This document describes **how** Surya Yantra implements the corrections
mandated by IEC 60891:2021, IEC 60904-7:2019, and IEC 61853-2:2016, and
**why** each approximation and default parameter was chosen.

The code lives in `apps/web/lib/`:

| File              | Standard                       | Purpose                              |
| ----------------- | ------------------------------ | ------------------------------------ |
| `iec60891.ts`     | IEC 60891:2021                 | G / T translation (Procedures 1–4)   |
| `smmf.ts`         | IEC 60904-7:2019               | Spectral mismatch factor             |
| `iam.ts`          | IEC 61853-2:2016 (Martin-Ruiz) | Incidence-angle modifier             |

---

## 1. IEC 60891:2021 — Temperature & Irradiance Corrections

The standard defines four procedures for translating a measured I-V curve at
conditions `(G1, T1)` to target conditions `(G2, T2)` — usually STC
`(1000 W/m², 25 °C)`.

### 1.1 Procedure 1 — classical linear

Used when the module's absolute temperature coefficients `α`, `β`, series
resistance `Rs`, and curve correction factor `κ` are known.

```
Δ = (T2 − T1)
I2 = I1 + Isc·(G2/G1 − 1) + α·Δ
V2 = V1 − Rs·(I2 − I1) − κ·I2·Δ + β·Δ
```

**Implementation** (`correctProcedure1`):

* `α` and `β` are expected in **absolute** units (A/°C, V/°C). The Prisma
  schema stores them in %/°C (`alphaPct`, `betaPct`); the API converters
  multiply by STC `Isc` / `Voc` before calling the function.
* Throws when measured irradiance `G1 ≤ 0` (prevents divide-by-zero).
* No extrapolation limits are imposed, but IEC 60891 recommends
  `|G2/G1 − 1| ≤ 0.2` and `|T2 − T1| ≤ 10 K` for P1 accuracy. The API
  returns a warning header (`x-sy-correction-warning`) when exceeded.

### 1.2 Procedure 2 — multiplicative (recommended for G2/G1 ≠ 1)

Keeps the curve shape under large irradiance translations:

```
I2 = I1 · (1 + α_rel·Δ) · (G2/G1)
V2 = V1 + β·Δ − Rs·(I2 − I1) − κ·I2·Δ
```

where `α_rel = α / Isc` is the relative coefficient (1/°C).

**When to use:** indoor flash measurements at non-STC irradiances, or any
translation where `|ΔG| > 200 W/m²`.

### 1.3 Procedure 3 — bilinear interpolation/extrapolation

Needs **two measured reference curves** at `(G_a, T_a)` and `(G_b, T_b)`. No
coefficients are required — useful when the module's electrical parameters
are unknown or poorly calibrated.

```
t = [(G2 − G_a)·(G_b − G_a) + (T2 − T_a)·(T_b − T_a)]
    / [(G_b − G_a)² + (T_b − T_a)²]

I2(v) = I_a(v) + t·(I_b(v) − I_a(v))
V2(v) = V_a(v) + t·(V_b(v) − V_a(v))
```

* Both reference curves must share point count and ordering.
* `t ∈ [0, 1]` is interpolation; outside that range is extrapolation (logged
  with a warning).

### 1.4 Procedure 4 — combined parametric method with shunt

Extends P2 with shunt-resistance `Rsh` to account for leakage currents when
moving between very different irradiances:

```
I2 = I1·(1 + α_rel·Δ)·(G2/G1) + (V1 / Rsh) · (G2/G1 − 1)
V2 = V1 + β·Δ − Rs·(I2 − I1) − κ·I2·Δ
```

Falls back to P2 when `Rsh` is not supplied (the schema field is optional).

### 1.5 Worked example

Measured at `G1 = 824 W/m²`, `T1 = 47.3 °C` on the 450 Wp bifacial reference
module (`α = 0.0024 A/°C`, `β = −0.134 V/°C`, `Rs = 0.38 Ω`, `κ = 0.0012 Ω/°C`):

| Quantity      | Measured | P1 → STC | P2 → STC |
| ------------- | -------- | -------- | -------- |
| Isc           |   9.47 A | 11.49 A  | 11.51 A  |
| Voc           |  47.21 V | 50.18 V  | 50.18 V  |
| Pmpp          |   389 W  |   451 W  |   450 W  |

P2 produces slightly lower Pmpp because its multiplicative current model
avoids the linear over-prediction that P1 exhibits near Voc.

---

## 2. IEC 60904-7:2019 — Spectral Mismatch Factor

### 2.1 Definition

```
SMMF = [∫E_test(λ)·SR_ref(λ)dλ / ∫E_ref(λ)·SR_ref(λ)dλ]
      ÷ [∫E_test(λ)·SR_dut(λ)dλ / ∫E_ref(λ)·SR_dut(λ)dλ]
```

Symbols:

| Symbol    | Meaning                                               |
| --------- | ----------------------------------------------------- |
| `E_ref`   | Reference spectrum (AM1.5G from IEC 60904-3)          |
| `E_test`  | Measured / modelled spectrum at the DUT plane         |
| `SR_ref`  | Spectral responsivity of the calibrated reference cell |
| `SR_dut`  | Spectral responsivity of the device under test        |

`SMMF = 1` when either (a) the test spectrum equals the reference, or
(b) the reference cell has the same spectral response as the DUT.

### 2.2 Implementation details

* **Grid harmonisation** — all four series are linearly resampled onto the
  sorted **union** of their native wavelength grids. Values outside any
  series' domain are treated as 0 (no extrapolation).
* **Integration** — trapezoidal over the union grid. The typical IEC
  60904-3 AM1.5G table has ~1700 points at 1 nm spacing; this is well below
  the 50 k sample budget we allow per API call.
* **Units** — `E(λ)` in W/m²/nm and `SR(λ)` in A/W cancel in the ratio, so
  inputs may be in any consistent scale.
* **Correction** — apply with `Isc_corrected = Isc_measured / SMMF`
  (`correctIscForSpectrum`).

### 2.3 Typical SMMF ranges (field data)

| Scenario                     | SMMF range       |
| ---------------------------- | ---------------- |
| Clear sky, AM ≈ 1.5, c-Si    | 0.98 – 1.02      |
| Clear sky, thin-film CdTe    | 0.95 – 1.05      |
| Hazy / high AOD, c-Si        | 0.90 – 1.10      |
| Overcast, thin-film          | 0.85 – 1.15      |

SMMF outside `[0.8, 1.2]` triggers a `quality_rating = 1` downgrade in
`IVMeasurement`.

---

## 3. IEC 61853-2:2016 — Incidence Angle Modifier (Martin-Ruiz)

### 3.1 Model

```
IAM(θ) = (1 − exp(−cos θ / ar)) / (1 − exp(−1/ar))
```

Where `ar` is the angular-loss fitting coefficient. IEC 61853-2 recommends
`ar ≈ 0.16` for unglazed and `ar ≈ 0.17` for single-glass c-Si modules
(the default in `apps/web/lib/iam.ts`).

Key values (for `ar = 0.17`):

| θ (°) | IAM     |
| ----- | ------- |
| 0     | 1.0000  |
| 30    | 0.9967  |
| 45    | 0.9878  |
| 60    | 0.9499  |
| 70    | 0.8852  |
| 80    | 0.6377  |
| 85    | 0.3766  |
| 90    | 0.0000  |

### 3.2 Beam / diffuse / albedo decomposition

Plane-of-array irradiance is split into its three components and each is
multiplied by its own IAM:

* **Beam**   — AOI-dependent via `iamMartinRuiz(aoiBeamDeg)`
* **Diffuse** — fixed effective AOI of 58° (per IEC 61853-2 Annex C)
* **Albedo**  — fixed effective AOI of 80°

```ts
G_eff = G_beam·IAM(θ_beam) + G_diffuse·IAM(58°) + G_albedo·IAM(80°)
```

### 3.3 When to apply

* **Outdoor tests** — always, unless the sun is within ±3° of normal
  incidence (in which case IAM ≈ 1 to within 0.3 %).
* **Indoor flash tests** — never; the optical system is collimated at 0°.

---

## 4. Order of operations in `POST /api/corrections/apply`

```
raw IV curve
   │
   ├── IAM  ────────► correct G for non-normal incidence
   │
   ├── SMMF ────────► correct Isc for spectral mismatch
   │
   ├── IEC 60891 ──► translate (G, T) → (G_target, T_target)
   │
   └── STC power report
```

If any intermediate step returns a factor outside `[0.5, 2.0]`, the pipeline
aborts with HTTP 422 — this indicates a sensor calibration drift rather than
a real module anomaly.

---

## 5. References

1. IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and
   irradiance corrections to measured I-V characteristics*.
2. IEC 60904-3:2019, *Measurement principles for terrestrial PV devices
   with reference spectral irradiance data*.
3. IEC 60904-7:2019, *Computation of the spectral mismatch correction for
   measurements of photovoltaic devices*.
4. IEC 61853-2:2016, *Photovoltaic (PV) module performance testing and
   energy rating — Part 2: Spectral responsivity, incidence angle and
   module operating temperature measurements*.
5. Martin N., Ruiz J.M., *Calculation of the PV modules angular losses
   under field conditions by means of an analytical model*, Solar Energy
   Materials & Solar Cells 70 (2001) 25–38.
