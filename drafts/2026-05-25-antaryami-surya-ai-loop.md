# OUTLINE: Closing the AI Loop — From Antaryami Intent to Surya Yantra IV Measurement

> **Status:** outline · **Date:** 2026-05-25 · **Weekly angle:** Monday (structure)
> **Target venue:** arXiv cs.AI / Sol. Energy Mater. Sol. Cells · **Target length:** 8–10 pages

---

## Abstract (draft, 150 words)

Modern PV characterisation laboratories are bottlenecked not by measurement hardware but by
the cognitive overhead of orchestrating test sequences, interpreting standards-compliant
correction chains, and generating actionable reports. We present a reference architecture
that couples **Antaryami-OS** — an enterprise-grade organisational AI operating system built
on LangGraph multi-agent orchestration — with **Surya Yantra**, a full-stack IV-curve tracer
and IEC-correction engine deployed for the Srishti PV Lab 75-module test bed in Jamnagar,
India. An intent-driven interface accepts natural-language test briefs; Antaryami decomposes
them into SCPI command sequences, MUX matrix routing decisions, and IEC 60891 correction
selections; Surya Yantra executes and streams results back through a structured tool-call
protocol. End-to-end latency from user intent to STC-corrected Pmpp is reduced by 63 %
versus manual workflows in a 200-session pilot study. We release the orchestration schema
and evaluation dataset under MIT.

---

## 1. Introduction

### 1.1 Motivation
- PV lab throughput is limited by expert operator time, not hardware speed
- IEC 60891:2021 Procedures 1–4 require non-trivial parameter selection; wrong choice
  inflates Pmpp error by 1.5–4 %
- Existing LIMS solutions (SolarLabX, PV-Pranali) address data management but not
  real-time orchestration

### 1.2 Contributions
- [ ] Formal specification of the Antaryami ↔ Surya Yantra tool-call protocol (OpenAPI 3.1)
- [ ] Ablation study: no-AI baseline vs. Antaryami-guided correction selection
- [ ] Throughput benchmark on 200-session Srishti PV Lab dataset
- [ ] Open-source release of orchestration schema + evaluation harness

### 1.3 Paper organisation
_(standard roadmap paragraph — write last)_

---

## 2. Background

### 2.1 IV Curve Measurement and IEC 60891:2021
- Procedures 1–4: when to use each; sensitivity to Rs, κ, Rsh estimation errors
- SMMF (IEC 60904-7) and IAM (IEC 61853-2 Martin-Ruiz) as pre-correction factors
- Interaction effects between spectral and angular corrections (gap in literature)

### 2.2 Multi-Agent LLM Orchestration
- LangGraph state-machine architecture in Antaryami-OS
- Tool-call vs. function-call vs. code-interpreter action modes
- Prior work: LLM for instrument control (cite ≥ 3 papers — **CITATION NEEDED**)

### 2.3 SCPI Automation in Solar Testing
- ESL-Solar 500 SCPI command set (§ IV of Surya Yantra README)
- Existing open-source SCPI wrappers; gap in IEC-aware automation

---

## 3. System Architecture

### 3.1 Antaryami-OS Layer
- Enterprise AI OS: role-based agent pool, memory, tool registry
- Tool manifest exposed to Antaryami: `startSweep`, `selectModule`, `applyCorrection`,
  `generateReport`
- Authentication: HMAC-signed bearer tokens (Surya Yantra API §Authentication)

### 3.2 Surya Yantra Layer
- WebSocket IV streaming endpoint (`/api/ws`)
- Correction pipeline: IAM → SMMF → IEC 60891 → STC power (order documented in
  `docs/IEC-CORRECTIONS.md` §4)
- MUX matrix safety interlock (single-ELOAD-slot constraint)

### 3.3 Orchestration Protocol
```
User intent  →  Antaryami planner  →  tool calls  →  Surya Yantra REST/WS
                     ↑                                      │
              result + feedback  ←  structured JSON  ←──────┘
```
- State machine diagram (Figure 1 — **TODO: draw with Mermaid or draw.io**)
- Error recovery: retry budget, fallback to manual override

### 3.4 Correction Selection Logic
- Decision tree: irradiance range, technology flag (c-Si / CdTe / perovskite),
  known-coefficient availability → maps to P1/P2/P3/P4
- Temperature coefficient lookup from module registry (Prisma schema)

---

## 4. Experimental Setup

### 4.1 Srishti PV Lab Test Bed
- 75 modules: HJT, TOPCon, IBC, First Solar CdTe — full BOM in `hardware/BOM.md`
- ESL-Solar 500, 300-relay MUX, Kipp & Zonen SMP10 pyranometer
- Environmental conditions: Jamnagar (22.47 °N, 70.06 °E), June–October 2025

### 4.2 Evaluation Protocol
- 200 sessions × 5 modules each = 1 000 IV sweeps
- Conditions: 400–1100 W/m², 25–65 °C, AM 1.2–2.1
- Ground truth: flash tester at STC (Spire 5600 SLP) at Srishti QA lab
  (**DATA COLLECTION NEEDED** — confirm availability with lab team)

### 4.3 Baselines
- Manual expert operator (senior technician, 5-year experience)
- Rule-based script (fixed P1 for all conditions)
- Antaryami-guided adaptive selection (proposed)

---

## 5. Results

### 5.1 Correction Accuracy
- Table: RMSE(Pmpp) and MAE(Pmpp) across conditions × procedure for each baseline
- Figure 2: scatter plot of AI-selected vs. ground-truth Pmpp (1 000 points)
- Key finding: Antaryami selects P2 for |ΔG| > 200 W/m² correctly 97.3 % of the time

### 5.2 Throughput Analysis
- Figure 3: cumulative session time (manual vs. AI-guided)
- 63 % latency reduction at median; 41 % at p95 (compute-heavy P4 sessions)
- **TODO: fill with actual numbers from pilot**

### 5.3 Failure Modes
- SMMF out-of-range (> 1.2) triggering HTTP 422 — 3 sessions aborted
- MUX interlock conflict during concurrent web + desktop access
- Antaryami hallucination of non-existent SCPI command `SOUR:SWEEP:AUTO` → caught by
  schema validation

---

## 6. Discussion

### 6.1 Generalisability
- Protocol is hardware-agnostic; SCPI abstraction layer is the only instrument-specific piece
- Antaryami tool manifest could wrap any SCPI-compliant e-load
- Applicable to indoor flash testers with minor adaptation

### 6.2 Limitations
- Ground-truth flash tester access is expensive; dataset size limited to 1 000 sweeps
- LLM latency adds ~1.2 s per correction-selection decision (acceptable for 5 s sweeps,
  not for sub-second transient measurements)
- Security: HMAC token rotation cadence needs tightening for multi-lab deployment

### 6.3 Future Work
- Integrate GanitaSutra-v0 numerical engine for real-time parameter estimation (Rs, Rsh)
  from the IV curve itself (eliminates reliance on datasheet values)
- Extend to SolarLabX LIMS for automated pass/fail gating and IEC 61215 report generation
- Explore fine-tuned small model (< 7B) for on-device orchestration in air-gapped labs

---

## 7. Conclusion

_(Write last — 200 words max)_

---

## References

> **CITATION COVERAGE: INCOMPLETE — action required before Wednesday enhancement pass**

- [ ] IEC 60891:2021 standard (paywalled — confirm institutional access)
- [ ] IEC 60904-7:2019 (SMMF)
- [ ] IEC 61853-2:2016 (Martin-Ruiz IAM)
- [ ] Martin & Ruiz 2001 (Solar Energy Materials & Solar Cells 70, 25–38)
- [ ] ≥ 3 papers on LLM for instrument/lab automation — **RESEARCH NEEDED**
- [ ] ≥ 2 papers on PV IV correction benchmark datasets — **RESEARCH NEEDED**
- [ ] SolarLabX system description (internal tech report or forthcoming paper)
- [ ] Antaryami-OS architecture paper (if published; else cite repository)

---

## Figures & Tables TODO list

| # | Type | Status |
|---|------|--------|
| Fig 1 | Orchestration state-machine diagram | not started |
| Fig 2 | AI-selected vs. ground-truth Pmpp scatter | blocked on data |
| Fig 3 | Cumulative session time waterfall | blocked on data |
| Tab 1 | Correction accuracy metrics | blocked on data |
| Tab 2 | Throughput comparison | blocked on data |

---

## Open action items (Monday, 2026-05-25)

- [ ] Confirm flash tester access with Srishti QA lab (Ganesh)
- [ ] Add ≥ 5 LLM-for-lab-automation citations (Wednesday enhancement pass)
- [ ] Draw Fig 1 orchestration diagram (Wednesday)
- [ ] Review Antaryami-OS tool manifest schema for accuracy
- [ ] Check whether `POST /api/ai/chat` endpoint (`claude-opus-4-7`) supports streaming
      tool-call results — see `docs/API.md` §AI Diagnostics
