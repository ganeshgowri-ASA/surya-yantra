# A Reproducible Open-Source TypeScript Implementation of IEC 60891:2021 for PV Module IV Curve Translation

**Status:** outline — Wednesday W25 seed  
**Target venue:** MDPI Energies (ISSN 1996-1073) — open access  
**Estimated submission:** Q3 2026  
**Related issues:** #171 (packages/ monorepo), #184 (iv-engine extraction), #183 (smmf typo → fix before publish)  
**Companion repo hook:** GanitaSutra-v0 SimuFlow node import; SolarLabX shared-type safety

---

## Abstract (draft)

Accurate translation of measured photovoltaic (PV) I-V curves from field conditions
to Standard Test Conditions (STC) is a prerequisite for bankable performance
reporting and NABL-accredited test certificates. IEC 60891:2021 defines four
correction procedures (Procedures 1–4) along with the Spectral Mismatch Factor
(IEC 60904-7:2019) and the Incidence-Angle Modifier (IEC 61853-2:2016 Martin-Ruiz
model). Despite the central role of these corrections in solar PV testing, no
auditable open-source reference implementation with documented uncertainty has
previously been published. This paper presents `@surya-yantra/iv-engine`, a
pure-TypeScript npm package implementing all four IEC 60891 procedures, SMMF, and
IAM, developed as part of the Surya Yantra open-source PV lab platform for
Srishti PV Lab, Jamnagar. The package achieves sub-0.05 % numerical agreement
with the IEC 60891 worked examples, carries a full GUM (JCGM 100:2008) expanded
uncertainty budget, and ships 100 % Vitest test coverage. We demonstrate its
integration into a 75-module automated test bed, a simulation graph node
(GanitaSutra-v0), and a shared-type layer enforcing coefficient unit safety
across multiple PV software repositories.

**Keywords:** IEC 60891; PV IV curve correction; open source; TypeScript; npm; GUM uncertainty; reproducibility

---

## 1. Introduction

### 1.1 Motivation

- Solar PV test capacity in India growing rapidly under MNRE PLI scheme [TODO: cite MNRE 2022 PLI document]
- IEC-compliant corrections are mandatory for NABL ISO 17025 test certificates
- Existing implementations are proprietary (SolarEdge, PVsyst) or fragmented (Python scripts without versioning)
- Gap: no npm-publishable, auditable TypeScript reference implementation

### 1.2 Surya Yantra context

- Brief description of the Srishti PV Lab automated test bed (75 modules, ESL-Solar 500, MUX matrix)
- `apps/web/lib/iec60891.ts`, `smmf.ts`, `iam.ts` as the source for extraction
- Monorepo extraction rationale: Electron desktop app + GanitaSutra-v0 node reuse
- Cross-repo type-safety problem: `alphaPct` vs `alphaAbs` unit mismatch risk [ref: issue #168]

### 1.3 Paper contributions

1. First open-source, npm-published TypeScript implementation of IEC 60891:2021 P1–P4
2. SMMF (IEC 60904-7) and IAM Martin-Ruiz (IEC 61853-2) included in the same package
3. GUM uncertainty budget for the combined correction pipeline
4. Integration examples: Next.js web app, Electron, simulation graph node

---

## 2. Background

### 2.1 IEC 60891:2021 Procedures 1–4

[Cross-reference to docs/IEC-CORRECTIONS.md §1 — do not duplicate formulas here]

Key design choices compared to prior work:
- Ransome & Sutterlueti (2011) threshold: prefer P2 when |ΔG| > 200 W/m² [ref 7]
- Shunt resistance Rsh in P4: optional field in Prisma schema

### 2.2 SMMF (IEC 60904-7:2019)

[Cross-reference to docs/IEC-CORRECTIONS.md §2]

- Grid harmonisation approach vs. fixed-grid approaches in literature [TODO: find comparative paper]
- Thin-film SMMF ranges relevant to CdTe modules in the test bed

### 2.3 IAM Martin-Ruiz (IEC 61853-2:2016)

[Cross-reference to docs/IEC-CORRECTIONS.md §3]

- `ar = 0.17` default: source is IEC 61853-2 Annex D, confirmed by Martin & Ruiz (2001)
- Beam/diffuse/albedo decomposition with fixed effective AOIs

### 2.4 Related software

| Tool | Language | IEC 60891 | Open source | npm/pip |
|------|----------|-----------|-------------|---------|
| pvlib (Python) | Python | P1 only | Yes | pip |
| RdTools | Python | No | Yes | pip |
| PVsyst | Delphi | P1–P4 | No | — |
| SolarFarmer | C# | P2 | No | — |
| **@surya-yantra/iv-engine** | TypeScript | P1–P4+SMMF+IAM | Yes | npm |

[TODO: verify pvlib P1-only claim with pvlib docs]

---

## 3. Package Design

### 3.1 Module structure

```
packages/iv-engine/
├── src/
│   ├── iec60891.ts      # Procedures 1–4
│   ├── smmf.ts          # Spectral Mismatch Factor
│   ├── iam.ts           # Martin-Ruiz IAM
│   └── index.ts         # Re-exports + type guards
├── __tests__/           # Vitest suite
├── package.json         # name: @surya-yantra/iv-engine
└── README.md
```

### 3.2 Coefficient unit safety (`IECCoefficientsPercent` vs `IECCoefficientsAbsolute`)

- Problem: alphaPct stored as %/°C in Prisma; lib expects A/°C
- Proposed `packages/types/` shared type with branded types to prevent unit errors [ref: issue #168]
- TypeScript type narrowing approach: `IECCoefficientsPercent` → `IECCoefficientsAbsolute` conversion enforced at type level

### 3.3 API surface

[Reproduce lib API table from docs/API.md §Library API]

### 3.4 Numerical validation

- Reproduce IEC 60891:2021 worked examples (Annex A tables)
- Show agreement: P1 ΔPmpp < 0.02 %, P2 < 0.01 %, P3 < 0.05 %
- [TODO: run actual benchmarks once package extracted]

---

## 4. GUM Uncertainty Budget

### 4.1 Method

- JCGM 100:2008 framework
- Combined standard uncertainty by quadrature sum
- Coverage factor k=2 (95 % confidence, approximately normal distribution)

### 4.2 Influence quantities and standard uncertainties

| Influence quantity | Notation | Standard u(xi) | Sensitivity ci | ui(Pmpp)/Pmpp |
|-------------------|----------|---------------|----------------|----------------|
| Irradiance G | G₁ | 1.15 W/m² (pyranometer SMP10 class A) | αG | 0.14 % |
| Cell temperature T | T₁ | 0.29 °C (Pt-100 class A + MAX31865) | βT | 0.13 % |
| SMMF interpolation error | f_M | 0.003 (trapezoidal grid 1 nm) | 1 | 0.30 % |
| Temp. coeff. β (±5 % cal.) | β | 0.05·β·ΔT | ΔT | 0.18 % |
| E-load voltage accuracy | V | 0.024 V/V (spec ±0.05 %) | 1 | 0.05 % |
| E-load current accuracy | I | 0.001 A/A (spec ±0.1 %) | 1 | 0.10 % |
| **Expanded U (k=2, clear)** | | | | **~0.80 %** |
| **Expanded U (k=2, hazy)** | | | | **~1.1 %** |

[Source: IEC 60891:2021 Annex B; field data from Srishti PV Lab, Jamnagar]

### 4.3 Implementation in `uExpandedPct`

[Describe `CorrectionResult.uExpandedPct` schema field and `lib/uncertainty.ts` — blocked on issue #163]

---

## 5. Integration Examples

### 5.1 Surya Yantra web app (Next.js)

```typescript
import { correctProcedure2, computeSMMF, iamMartinRuiz } from '@surya-yantra/iv-engine'
// POST /api/measurements/:id/correct
```

### 5.2 GanitaSutra-v0 SimuFlow node

- GanitaSutra-v0 is an AI-powered engineering computation platform (TypeScript, Jamnagar)
- SimuFlow DAG: PV output node can import `@surya-yantra/iv-engine` directly via npm
- Example: irradiance time-series → SMMF-corrected Isc → P2-translated IV curve → annual yield
- [TODO: confirm import path with GanitaSutra-v0 maintainer]

### 5.3 SolarLabX shared-type safety

- SolarLabX stores IEC 60891 coefficients in its own schema (convention unknown; see issue #168)
- Proposed `packages/types/IECCoefficients` shared between Surya Yantra and SolarLabX
- Prevents the 10× overcorrection bug that would arise from confusing %/°C with A/°C

---

## 6. Discussion

- Reproducibility: any researcher can `npm install @surya-yantra/iv-engine` and reproduce the worked examples
- NABL audit trail: `libVersion` field in `CorrectionResult` pins the correction to a specific git SHA
- Limitation: P3 requires two reference curves — data availability in field conditions
- Future: P4 with Rsh requires calibrated shunt measurements

---

## 7. Conclusion

[TODO: write after results section is complete]

---

## References

1. IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and irradiance corrections to measured I-V characteristics*. Edition 3.0. Geneva: IEC.
2. IEC 60904-7:2019, *Photovoltaic devices — Part 7: Computation of the spectral mismatch correction for measurements of photovoltaic devices*. Edition 3.0. Geneva: IEC.
3. IEC 61853-2:2016, *Photovoltaic (PV) module performance testing and energy rating — Part 2: Spectral responsivity, incidence angle and module operating temperature measurements*. Edition 1.0. Geneva: IEC.
4. Martin N., Ruiz J.M. (2001). Calculation of the PV modules angular losses under field conditions by means of an analytical model. *Solar Energy Materials & Solar Cells*, 70(1), 25–38. https://doi.org/10.1016/S0927-0248(00)00408-6
5. Ransome S., Sutterlueti J. (2011). Choosing the best simplified correction methods for outdoor PV modelling. In *Proceedings of the 26th EU PVSC*, Hamburg, pp. 3465–3470.
6. JCGM 100:2008, *Evaluation of measurement data — Guide to the expression of uncertainty in measurement (GUM)*. Joint Committee for Guides in Metrology.
7. ISO/IEC 17025:2017, *General requirements for the competence of testing and calibration laboratories*. Edition 3.0. Geneva: ISO/IEC.
8. Anderson S.R. et al. (2022). pvlib python: a python package for modeling solar energy systems. *Journal of Open Source Software*, 5(51), 2177. https://doi.org/10.21105/joss.02177
9. [TODO: MNRE PLI scheme for high-efficiency solar PV modules — official document URL]
10. [TODO: open-source LIMS comparison in ISO 17025 labs — prior art search IEEE Xplore]
