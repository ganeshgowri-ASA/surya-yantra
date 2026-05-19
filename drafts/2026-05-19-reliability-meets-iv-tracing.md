# When Reliability Testing Meets In-Situ IV Tracing: A Combined Framework for Indian Field Conditions

**Status:** seed  
**Date:** 2026-05-19  
**Author:** Srishti PV Lab  
**Tags:** iv-tracing, reliability, iec-61215, agnipariksha, surya-yantra, india  
**Sister repos:** surya-yantra · agnipariksha

---

## Why This Article

The `agnipariksha` repo (Shreshtata Power Supplies' accelerated-aging station,
last updated 2026-05-17) and `surya-yantra` both entered active development in
the same sprint window. That convergence opens a research angle that neither
project covers alone: **combining stress-exposure data with real-time IV curve
progression to build degradation signatures at the module level**.

---

## Core Research Question

> Can IV curve shape parameters (fill-factor slope, shunt-resistance drift,
> series-resistance creep) be used as leading indicators of the reliability
> failure modes observed in IEC 61215 damp-heat and UV-exposure sequences,
> specifically for the Indian outdoor climate (Jamnagar: ASHRAE 2A humid
> subtropical, 5.5 kWh/m²/day GHI)?

---

## Proposed Narrative Arc

### 1. Context: India's PV reliability challenge

- IEC 61215 qualification uses controlled lab stressors; Indian conditions
  (dust, monsoon humidity, 45 °C ambient) exceed the test envelope.
- Most degradation studies report annual yield loss without tying it to a
  *mechanism*. This article targets the mechanism gap.

### 2. The test bed

- Surya Yantra's 75-module array (HJT, TOPCon, IBC, CdTe technology mix)
  measured weekly via IEC 60891 P2-corrected IV sweeps.
- Agnipariksha damp-heat chamber co-running accelerated exposures on coupon
  samples from the same module lots.

### 3. Feature extraction from IV curves

Key shape parameters to extract per sweep:

| Parameter | Extraction method | Failure signature |
|---|---|---|
| `Rs` (series resistance) | Slope at Voc end | Cell interconnect fatigue |
| `Rsh` (shunt resistance) | Slope at Isc end | PID / micro-crack leakage |
| Fill Factor | `FF = Pmpp / (Isc·Voc)` | General degradation composite |
| `dPmpp/dt` | Linear regression over 12 weeks | Annualised power loss rate |

Surya Yantra's `findMPP()` and `fillFactor()` already return `vmpp`, `impp`,
`pmpp`. Rs/Rsh need curve-fitting via the single-diode model — candidate
addition to `lib/iec60891.ts`.

### 4. Linking to agnipariksha stressors

- Map each week's IV measurement to accumulated stress dose (kWh UV, hours
  damp-heat, thermal-cycling count) logged by agnipariksha.
- Hypothesis: Rs rise > 5% within 200 thermal cycles predicts a >2% Pmpp
  degradation at STC within the same quarter.

### 5. Reproducibility and open data

- Publish the weekly IV dataset on Hugging Face (HF Space companion).
- Provide the agnipariksha-to-surya-yantra data pipeline as a GitHub Action.

---

## Gaps to Resolve Before Writing

- [ ] agnipariksha API schema for exporting stress-dose logs — confirm format
- [ ] Single-diode model curve-fit for Rs/Rsh — needs implementation in `lib/`
- [ ] Ethics/data-sharing agreement with Shreshtata Power Supplies
- [ ] At least 8 weeks of co-located field data before submission

---

## Target Venue

*Solar Energy* (Elsevier) or *Progress in Photovoltaics* — both accept
open-data companion articles. Alternatively, IEEE PVSC extended abstract if
data collection reaches critical mass by September 2026.

---

## References to Acquire

1. Jordan D.C., Kurtz S.R., "Photovoltaic Degradation Rates — An Analytical
   Review", *Progress in Photovoltaics* 21 (2013) 12–29.
2. IEC 61215-1:2021 *Terrestrial PV modules — Design qualification and type
   approval*.
3. Wohlgemuth J.H., "IEC 61215: What it is and isn't", NREL Tech Report 2012.
4. (To add) agnipariksha test protocol documentation.
