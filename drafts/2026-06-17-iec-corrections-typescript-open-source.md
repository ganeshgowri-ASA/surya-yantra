# Implementing IEC 60891:2021 Procedures 1–4 in TypeScript: Lessons from an Open-Source PV IV Tracer

**Status:** seed · **Date:** 2026-06-17 · **Target:** Measurement (Elsevier) / Progress in Photovoltaics

## Narrative hook

The IEC 60891:2021 standard describes four procedures for translating a measured PV module I-V curve from field conditions to STC (1000 W/m², 25 °C). Reference implementations exist in Fortran, MATLAB, and Python — but not in a type-safe, server-side TypeScript runtime deployed on serverless infrastructure at nanosecond-scale cold-start budgets. The Surya Yantra correction engine (`apps/web/lib/iec60891.ts`, `smmf.ts`, `iam.ts`) provides such an implementation with a full Vitest test suite and a live REST API. This article documents the implementation decisions, numerical validation against IEC example data, and the software-engineering patterns that make it suitable for a multi-tenant lab LIMS.

## Engineering peg

The Surya Yantra Vitest suite (`__tests__/lib/iec60891.test.ts`, `iam.test.ts`, `smmf.test.ts`) validates all four IEC 60891 procedures against known reference values. The Prisma schema exposes these via `CorrectionResult` records with full audit trail. The `POST /api/corrections/apply` pipeline chains IAM → SMMF → IEC 60891 in strict order.

## Proposed sections

1. **Introduction** — importance of consistent IV corrections for module degradation monitoring, bankability reports, and IEC 61215 type approval
2. **IEC 60891:2021 in brief** — four-procedure taxonomy (P1 linear, P2 multiplicative, P3 bilinear interpolation, P4 with shunt); when each applies
3. **TypeScript implementation** — module design, type signatures, pure-function approach; why serverless (Vercel Edge Functions) requires zero global state
4. **Numerical validation** — reproduce the worked example from §1.5 of IEC-CORRECTIONS.md; compare P1 vs P2 Pmpp discrepancy; validate SMMF trapezoidal integration against IEC 60904-3 AM1.5G table
5. **IAM Martin-Ruiz model** — `ar = 0.17` default, beam/diffuse/albedo decomposition per IEC 61853-2 Annex C; sensitivity analysis across technology types
6. **Pipeline order** — IAM first (corrects G_eff), then SMMF (corrects Isc), then IEC 60891 (translates to STC); why order matters numerically
7. **Warning headers** — `x-sy-correction-warning` when extrapolation bounds exceeded; `quality_rating` downgrade when SMMF ∉ [0.8, 1.2]
8. **`smmmf` field name typo in schema** — known issue; backwards-compatibility plan before schema migration (see issue #XXX) — TODO: file issue
9. **Integration with a multi-tenant LIMS** — `CorrectionResult` records, Prisma audit trail, role-based access (ADMIN/ENGINEER/OPERATOR/VIEWER)
10. **Limitations and future work** — P3 requires two reference curves (scarce in practice); P4 Rsh term sensitive to sensor calibration; planned `packages/iv-engine` extraction as a standalone npm package

## Key figures needed

- [ ] UML: `POST /api/corrections/apply` pipeline (IAM → SMMF → IEC 60891) (Fig. 1)
- [ ] Plot: P1 vs P2 Pmpp prediction error as ΔG/G varies 0–50 % (Fig. 2) — **can generate from existing lib**
- [ ] Plot: IAM(θ) for ar = 0.14, 0.17, 0.20 across 0–90° (Fig. 3) — **can generate from existing lib**
- [ ] Table: SMMF ranges by technology and sky condition (Table 1) — from IEC-CORRECTIONS.md §2.3

## Cross-links to sibling projects

- **SolarLabX** (LIMS / ISO 17025): uncertainty budget for each correction procedure maps to GUM Type B components in the SolarLabX uncertainty module
- **GanitaSutra** (SimuFlow): the `correctProcedure1` function can be wrapped as a GanitaSutra toolbox node for PV system simulation
- **Antaryami OS**: the AI diagnostics prompt in `/api/ai/chat` currently passes raw Isc/Voc/Pmpp deltas; passing the full `CorrectionResult` would allow Claude to reason about which correction factor caused an anomaly

## Blocking gaps

- Schema `smmmf*` triple-m typo should be resolved before code is cited in a paper — file issue
- `packages/iv-engine` extraction (planned but not yet started) would allow standalone npm install
- P3 implementation needs integration tests with real two-curve field data

## References (seed)

1. IEC 60891:2021 — Photovoltaic devices — Procedures for temperature and irradiance corrections
2. IEC 60904-3:2019 — Measurement principles for terrestrial PV devices with reference spectral irradiance data
3. IEC 60904-7:2019 — Computation of the spectral mismatch correction
4. IEC 61853-2:2016 — Module performance testing: spectral responsivity, incidence angle and module operating temperature
5. Martin N., Ruiz J.M. (2001). Calculation of the PV modules angular losses under field conditions. *Solar Energy Materials & Solar Cells* 70, 25–38.
6. Müllejans H. et al. (2009). Spectral mismatch in calibration of photovoltaic reference devices by global sunlight method. *Measurement Science & Technology* 20, 075101.
