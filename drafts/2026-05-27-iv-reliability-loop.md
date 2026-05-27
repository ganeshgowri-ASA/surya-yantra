---
title: "From IV Curve to Reliability: How Surya Yantra and Agnipariksha Close the PV Module Characterisation Loop"
slug: iv-curve-to-reliability-loop
status: seed
created: 2026-05-27
updated: 2026-05-27
weekly-angle: enhancement (add references)
tags: [pv-testing, iec-60891, iec-61215, reliability, iv-curve, surya-yantra, agnipariksha]
seed-source: agnipariksha repo updated 2026-05-26; surya-yantra IEC correction engine
---

## Abstract

Photovoltaic module characterisation divides into two complementary acts: (1) precision I-V curve tracing under controlled irradiance and temperature, and (2) accelerated stress tests that force the module to age years in days. Neither is useful in isolation. This article shows how Surya Yantra's IEC 60891-compliant correction engine and Agnipariksha's ITECH IT6000C-based reliability station fit together into a closed-loop test protocol — measure baseline, stress, measure again, correct both curves to STC, compute degradation.

---

## 1. Introduction

A PV module leaving the factory carries a datasheet peak power rating measured at STC (1000 W/m², 25 °C, AM1.5G). In service, irradiance fluctuates between 0 and 1200 W/m², cell temperature swings from −20 °C to 85 °C, and spectral distribution changes hour by hour. After years of UV exposure, thermal cycling, and damp-heat cycling the module's electrical parameters drift. To know *how much* they drifted, and to attribute the drift to a specific stress mechanism, a lab needs two things:

1. A way to measure I-V curves and translate them to a common reference condition (STC) so that pre-stress and post-stress measurements are directly comparable.
2. A controlled stress station that applies well-defined mechanical, thermal, or electrical stimuli and records the dose precisely.

Surya Yantra provides (1); Agnipariksha provides (2).

---

## 2. The Measurement Side — Surya Yantra

### 2.1 Hardware

The Srishti PV Lab test bed consists of 75 module positions arranged in a 15 × 5 matrix, each channel wired 4-wire Kelvin (Force+/−, Sense+/−) to a 300-relay MUX matrix. An ESL-Solar 500 electronic load (0–300 V, 0–27 A) performs the IV sweep under SCPI control over USB/RS232/Ethernet. A calibrated reference cell and pyranometer supply G and T in real time.

### 2.2 IEC 60891 Correction Pipeline

Raw measured curves arrive at (G₁, T₁) ≠ (1000 W/m², 25 °C). The correction pipeline applies three sequential steps:

```
Raw IV @ (G₁, T₁)
   │
   ├─ IAM(θ_beam)  [IEC 61853-2, Martin-Ruiz]  → effective G
   ├─ SMMF         [IEC 60904-7]               → corrected Isc
   └─ IEC 60891    [P1 or P2]                  → STC IV curve
```

Procedure 2 (multiplicative) is preferred when |ΔG| > 200 W/m²; Procedure 1 (linear) is used within ±20 % of the target irradiance.

### 2.3 Degradation Metric

After each stress sequence, the STC-corrected peak power Pmpp is extracted. Relative degradation is:

```
ΔP% = (Pmpp_post − Pmpp_pre) / Pmpp_pre × 100
```

Fill Factor and Isc/Voc ratios are tracked separately to isolate resistive degradation (Rs increase → FF drop) from current-loss mechanisms (Isc drop → micro-crack, LeTID) from voltage-loss mechanisms (Voc drop → junction shunting).

---

## 3. The Stress Side — Agnipariksha

*[TODO: pull actual code/data from agnipariksha repo once cross-repo access is available]*

Agnipariksha programs an ITECH IT6000C DC power supply to apply the following stress protocols, each traceable to an IEC standard:

| Protocol | IEC Standard | Agnipariksha Mode |
|---|---|---|
| Thermal Cycling (TC 200) | IEC 61215-2:2021 §4.11 | `TC` — 200 cycles −40 °C → 85 °C |
| Humidity Freeze (HF 10) | IEC 61215-2:2021 §4.12 | `HF` — 10 cycles 85 °C/85 % RH → −40 °C |
| Damp Heat (DH 1000) | IEC 61215-2:2021 §4.13 | `DH` — 1000 h at 85 °C / 85 % RH |
| LeTID | IEC 63209-1:2021 | `LETID` — light + temperature soak |
| Bypass Diode Thermal | IEC 61215-2:2021 §4.16 | `BPD` — 1 A reverse for 1 h |
| Ground Continuity | IEC 61730-2:2023 §MST16 | `GND` — 2.5× frame current |
| Reverse Current Overload | IEC 61215-2:2021 §4.17 | `RCO` — 1.35 × Isc for 1 h |

---

## 4. The Closed Loop

```
[Baseline IV @ Surya Yantra]
         │
         ▼
[Stress in Agnipariksha — TC/DH/HF/LeTID]
         │
         ▼
[Post-stress IV @ Surya Yantra]
         │
         ▼
[IEC 60891 STC Correction on both curves]
         │
         ▼
[ΔPmpp, ΔFF, ΔIsc, ΔVoc — degradation report]
         │
         ▼
[AI Diagnostics via Claude: root-cause inference]
```

The key insight is that the correction step must be applied consistently to both pre- and post-stress curves. Inconsistent procedure selection (P1 before, P2 after) introduces a systematic bias that can mask real degradation signals of ±0.5 %, comparable to the expected degradation rate from a 200-cycle TC test.

---

## 5. Case Study Outline

*[TODO: populate with real measurement data from the 450 Wp bifacial reference module]*

Planned case study: Subject the reference HJT module (Slot 34) to TC 50 (abbreviated), measure Pmpp before and after with both P1 and P2 correction applied, quantify the procedure-induced bias vs. the real degradation signal.

---

## 6. Discussion

### 6.1 Measurement Uncertainty Budget

| Source | Contribution |
|---|---|
| ESL-Solar 500 current accuracy (±0.05 % FS) | ~0.013 A @ 27 A |
| Reference cell irradiance calibration (±1 %) | ~0.5 % on Isc |
| Cell temperature thermocouple (±0.5 °C) | ~0.12 % on Voc |
| IEC 60891 P1 extrapolation bias (at ΔG=200 W/m²) | ~0.3 % on Pmpp |
| Combined (RSS) | ~0.6 % on Pmpp |

A 0.6 % measurement uncertainty means degradation signals below ~1.2 % (2σ) are not statistically distinguishable from noise — relevant context when interpreting TC 50 results.

### 6.2 LeTID Specifics

Light and elevated temperature induced degradation (LeTID) is particularly challenging because it is partially reversible. The Agnipariksha LeTID protocol must be paired with immediate post-stress IV measurement (within 30 min of light soak end) to capture the maximum degradation state before partial recovery begins.

---

## 7. Conclusion

*[TODO: write after case study data is available]*

Surya Yantra's IEC 60891 correction engine and Agnipariksha's reliability stress station form two halves of a complete module qualification workflow. The article demonstrated that consistent correction procedure selection is as critical to result quality as the stress protocol itself, and proposed a reference test matrix linking each stress type to the electrical parameter it most directly degrades.

---

## References

1. IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and irradiance corrections to measured I-V characteristics*. Geneva: IEC. ISBN 978-2-8322-9875-3.
2. IEC 60904-7:2019, *Computation of the spectral mismatch correction for measurements of photovoltaic devices*. Geneva: IEC.
3. IEC 61215-1:2021, *Terrestrial photovoltaic (PV) modules — Design qualification and type approval — Part 1: Test requirements*. Geneva: IEC.
4. IEC 61215-2:2021, *Terrestrial photovoltaic (PV) modules — Design qualification and type approval — Part 2: Test procedures*. Geneva: IEC.
5. IEC 61853-2:2016, *Photovoltaic (PV) module performance testing and energy rating — Part 2: Spectral responsivity, incidence angle and module operating temperature measurements*. Geneva: IEC.
6. IEC 63209-1:2021, *Photovoltaic modules — Extended stress testing — Part 1: Test sequences*. Geneva: IEC.
7. Martin N., Ruiz J.M. (2001). Calculation of the PV modules angular losses under field conditions by means of an analytical model. *Solar Energy Materials and Solar Cells*, 70(1), 25–38. https://doi.org/10.1016/S0927-0248(00)00408-6
8. Müller B. et al. (2013). Measuring and modeling the spectral impact of soiling on a photovoltaic system in Abu Dhabi. *Progress in Photovoltaics*, 22(1), 53–64. https://doi.org/10.1002/pip.2214
9. Osterwald C.R. (1986). Translation of device performance measurements to reference conditions. *Solar Cells*, 18(3–4), 269–279. https://doi.org/10.1016/0379-6787(86)90124-6
10. Gallardo-Saavedra S., Hernández-Callejo L., Duque-Pérez O. (2018). Quantitative failure rates and modes analysis in photovoltaic plants. *Energy*, 183, 825–836. https://doi.org/10.1016/j.energy.2019.06.185

---

## Figures Needed

- [ ] `fig-01-system-architecture.svg` — Surya Yantra + Agnipariksha closed-loop block diagram (alt: "Block diagram showing IV tracer feeding stress station with STC correction applied to pre- and post-stress curves")
- [ ] `fig-02-iec60891-pipeline.svg` — IAM → SMMF → IEC 60891 correction sequence (alt: "Signal flow diagram of the three-stage IEC correction pipeline")
- [ ] `fig-03-degradation-case-study.png` — IV curves before/after TC 50, P1 vs P2 correction comparison (alt: "IV and PV curves for HJT reference module before and after TC 50 stress, corrected with IEC 60891 Procedures 1 and 2")

---

## Peer-Review Checklist

- [ ] Abstract ≤ 250 words
- [ ] All headings use sentence case
- [ ] All figures have alt text
- [ ] All references have DOI or stable URL
- [ ] Equations rendered in KaTeX / MathJax
- [ ] No broken internal links
- [ ] SEO: title, description, keywords meta
- [ ] Reading level ≤ Grade 14 (Flesch-Kincaid)
