---
title: "WebSocket–SCPI Bridge for Real-Time Multiplexed PV IV Curve Acquisition: Open-Source Architecture and IEC 60904-1 Validation"
status: "seed"
created: "2026-06-27"
weekly_angle: "SEO/metadata (Sat)"
target_journal: "Measurement (Elsevier) — https://www.sciencedirect.com/journal/measurement"
target_audience: "PV test engineers, instrumentation researchers, open-source lab tooling community"
related_engineering: |
  surya-yantra commits: feat(ws) Socket.IO IV streaming, feat(web) LiveIVChart,
  feat(web) iv-tracer/modules/corrections/reports pages (2026-06 batch).
  SolarLabX: Vitest 91-test suite for iv-curve.ts (PR #154), @anthropic-ai/sdk upgrade (PR #169).
keywords:
  - WebSocket SCPI
  - PV IV curve streaming
  - IEC 60904-1
  - real-time photovoltaic testing
  - open-source solar lab instrumentation
  - Socket.IO Next.js
  - ESL-Solar 500
  - multiplexed IV tracer
seo_description: "Open-source architecture for streaming PV IV curves from an ESL-Solar 500 SCPI electronic load via WebSocket to a Next.js browser UI, with IEC 60904-1 compliance discussion."
---

# WebSocket–SCPI Bridge for Real-Time Multiplexed PV IV Curve Acquisition

## Abstract (draft)

TODO: 150–200 words once lab benchmarks are available.

Key claims to support:
- Sub-100 ms round-trip latency from SCPI sweep command to browser curve render.
- MUX switching overhead per module slot (<200 ms relay settle + settle verification).
- IEC 60904-1 §7.4 sweep timing compliance at 5 s/sweep / 500 points.

---

## 1. Introduction

Open-source PV test instrumentation is sparse: most IV tracers ship as closed, proprietary systems with vendor-locked data formats. This paper describes the WebSocket-over-SCPI bridge in *Surya Yantra*, an open-source platform for the Srishti PV Lab 75-module test bed in Jamnagar, India.

**Research gap**: No published open-source system combines:
1. Real-time browser-rendered IV+PV curves during sweep execution.
2. Hardware multiplexer control for sequential multi-module testing.
3. IEC 60891 STC corrections applied in-browser before data persistence.

**Contribution**: Architecture, latency characterisation, and source code.

---

## 2. System Architecture

### 2.1 SCPI communication layer

- Node.js `serialport` on lab PC (or Electron IPC bridge).
- ESL-Solar 500 over USB (`/dev/ttyUSB0`, 9600 baud) or Ethernet (TCP 5025).
- SCPI command sequence for a 500-point IV sweep: `SOUR:MPPSCAN:START`, `STOP`, `STEP`, `STEPT`, `EXEC` → poll `MEAS:MPPSCAN:LISTFIRST?` / `LISTNEXT?`.

### 2.2 WebSocket streaming

- Socket.IO event `iv:point` emitted per measurement point as it is polled.
- Browser client accumulates points in a `useReducer`; Recharts `<LineChart>` re-renders on each new point.
- Event `iv:sweep_complete` triggers IEC 60891 correction and database write.

### 2.3 MUX sequencing

- `POST /api/mux/:bedId/connect` before sweep; `disconnect` after.
- Server-enforced single-slot-active invariant (HTTP 409 on conflict).

---

## 3. IEC 60904-1 Compliance Discussion

IEC 60904-1:2020 §7.4 specifies that the sweep shall be completed in a time short enough that temperature change during the sweep is <1 K.

TODO: Measure cell temperature at sweep start/end in the lab and report ΔT per sweep duration. Target: ΔT < 0.5 K at 5 s/sweep.

---

## 4. Real-Time Corrections Pipeline

```
SCPI points → Socket.IO → browser reducer
                                │
                    iv:sweep_complete
                                │
                POST /api/measurements/:id/correct
                                │
                    IAM → SMMF → IEC 60891 P1/P2
                                │
                        STC IV curve → PDF report
```

---

## 5. Performance Benchmarks

TODO — requires lab run. Targets:

| Metric | Target | Measured |
|--------|--------|----------|
| SCPI poll → Socket.IO emit latency | < 20 ms | TODO |
| Browser render lag per point | < 5 ms | TODO |
| MUX settle time (Omron G9EA) | < 100 ms | TODO |
| Full 75-module sequential test | < 15 min | TODO |

---

## 6. Open-Source Availability

Repository: https://github.com/ganeshgowri-ASA/surya-yantra  
License: MIT

---

## 7. References

1. IEC 60904-1:2020, *Photovoltaic devices — Part 1: Measurement of photovoltaic current-voltage characteristics.*
2. IEC 60891:2021, *Procedures for temperature and irradiance corrections to measured I-V characteristics.*
3. ET SolarPower, *ESL-Solar 500 User Manual*, 2024.

TODO: Add references for Socket.IO, Next.js App Router, and comparable open-source IV tracers (pvtrace, OpenIV, SolarEdge InSight SDK).

---

## Content gaps (block merge until resolved)

- [ ] Lab benchmarks for Table 5 (issue #TODO after filing)
- [ ] ΔT during sweep measurement (IEC 60904-1 §7.4 evidence)
- [ ] Comparison table with 2–3 commercial IV tracers (Keysight B2900A, Sinton Instruments, Newport)
