# ARTICLE SEED — The Full Data Pipeline: IV Curve to IEC Reliability Verdict in One Traceable Chain

> **Status:** Seed (Thursday 2026-05-29)  
> **Source signals:** `surya-yantra` IEC 60891 correction engine · `agnipariksha` analysis verdict engine (Tab 4 + Tab 5, merged 2026-05-28)

---

## Research Hook

When a PV module is tested at a lab like Srishti PV Lab, the raw measurement
is a single IV scan at ambient conditions — say 824 W/m² and 47 °C. To get a
qualification verdict you need to:

1. Correct the IV curve to STC (IEC 60891)
2. Extract Pmpp, Voc, Isc, FF at STC
3. Use that Pmpp as the baseline for degradation tests (LeTID, RCOT)
4. Aggregate GC, EB, thermal, degradation verdicts into an IEC 61730-2 report

Today this pipeline is **split across tools**, spreadsheets, and institutional
knowledge. **Surya Yantra** and **Agnipariksha** together implement every step
in software, with a full audit trail from SCPI command to signed PDF report.

---

## Proposed Article Structure

### Abstract (target: 150 words)
We present an end-to-end, open-source PV module qualification pipeline that
links IV curve measurement (Surya Yantra, IEC 60891) to IEC 61730-2
reliability verdicts (Agnipariksha) with full provenance tracking. The pipeline
operates in DEMO mode for reproducible benchmarking and LIVE mode for actual
hardware. We describe the correction chain, the verdict engine architecture,
and the structured IEC report format, and identify three open research
questions around spectral mismatch, LeTID parameter calibration, and
scalability to 75-module parallel test beds.

### 1. Motivation
- The IEC 61215 / 61730 qualification route requires both performance and
  safety/reliability data — currently handled by separate instruments.
- Provenance loss between IV measurement and LeTID baseline is a documented
  source of inter-lab variance.
- Open-source implementation enables reproducibility and independent audit.

### 2. The Correction Chain (Surya Yantra)

```
Raw IV (G1, T1)
  └─ IAM(θ_beam)        IEC 61853-2 Martin-Ruiz
  └─ SMMF               IEC 60904-7 trapezoidal integration
  └─ IEC 60891 P1–P4    G/T translation to STC
  └─ STC: Pmpp, Voc, Isc, FF
```

Key invariant: if any factor ∉ [0.5, 2.0] → HTTP 422 (sensor calibration
drift, not a module anomaly).

### 3. The Verdict Engine (Agnipariksha)

```
Pmax(0) ← Surya Yantra STC Pmpp
  ├─ GC   (IEC 61730-2 MST 13) — R_max ≤ 0.1 Ω
  ├─ EB   (IEC 61730-2 MST 13) — NxN pair heatmap
  ├─ IR   (IEC TS 60904-12-1) — ΔT hot-spot detection
  ├─ RCOT (IEC 61730-2 MST 26) — T_j abort gate
  └─ LeTID (IEC TS 63342)     — Pmax(t)/Pmax(0) ≥ 0.95
       └─ Verdict: PASS / FAIL / INCONCLUSIVE
               └─ IEC Report PDF + HTML (Tab 5)
```

### 4. Provenance and Audit Trail
- Every STC-corrected Pmpp carries a `measurementId` linking back to the
  raw IV scan, environmental reading, SCPI session, and the correction
  parameters used (procedure, α, β, Rs, κ, SMMF, IAM).
- The IEC report embeds the git SHA of both repos at generation time,
  so any party can reproduce the computation.

### 5. Open Research Questions

| Question | Where it bites | Proposed investigation |
|---|---|---|
| Jamnagar SMMF for Indian spectra | IEC 60904-7 SMMF is calibrated for AM1.5G; Jamnagar morning haze shifts AM significantly | Measure SMMF with Apogee SP-421 across seasons; fit a local correction table |
| LeTID logistic parameters | DEMO uses -3 % at 162 h; actual Srishti data may differ | Run a 200 h LeTID sweep on 3 HJT modules and fit the logistic model |
| GC threshold normalisation | IEC 61730-2 specifies R ≤ some_threshold; threshold may need area normalisation for large bifacial modules | Survey IEC 61730-2 Annex data and propose a normalised threshold formula |

### 6. Conclusion
The combined Surya Yantra + Agnipariksha pipeline closes the provenance gap
between IV measurement and qualification verdict. The architecture is modular
enough to extend to additional IEC 61853-3 energy rating tests without
changing the correction chain or the verdict engine contract.

---

## Target Venues

- **IEEE PVSC** — implementation / instrumentation track
- **Energies (MDPI)** — open-source tooling article
- **Solar Energy Materials & Solar Cells** — methods paper on SMMF calibration

---

## Next Steps

- [ ] Add `GET /api/sessions/:id/pmpp` to Surya Yantra API (see peer-review
      checklist item 2.1 gap — shortcut for Agnipariksha handoff).
- [ ] Validate IEC 61730-2 GC threshold against Omron G9EA-1-B contact
      resistance spec (< 5 mΩ per HARDWARE-SETUP.md §4.4).
- [ ] Draft §§ 1–3 by next Monday outline pass.

---

*Seed generated: 2026-05-29 · Surya Yantra editorial system · Thursday peer-review angle*
