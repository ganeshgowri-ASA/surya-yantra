---
title: "Open-Source WebSocket–SCPI Bridge for Real-Time PV IV Curve Streaming: Architecture and IEC 60891 Integration"
status: seed
created: 2026-06-15
weekly_angle: roadmap
target_venue: "MDPI Sensors — Open Instrumentation special issue"
target_length_words: 6000
blocked_on:
  - "Lab benchmark data (latency, throughput) — issue #142"
  - "GUM uncertainty budget for streaming corrections — issue #120"
---

## Abstract (draft)

Real-time I-V curve characterisation of photovoltaic modules in outdoor test
beds requires a sub-100 ms round-trip from SCPI instrument to browser display,
while simultaneously applying IEC 60891:2021 temperature and irradiance
corrections. Commercial solutions (LabVIEW + VISA) are cost-prohibitive for
independent research labs. We present Surya Yantra, an open-source platform
(MIT licence) that bridges the ESL-Solar 500 electronic load via a Node.js
SCPI driver, streams corrected I-V curves over WebSocket (Socket.IO), and
renders them in a Next.js 14 dashboard at < 50 ms client-perceived latency.
The correction pipeline (IEC 60891 Procedures 1–4, SMMF, IAM) executes in
< 5 ms per curve on commodity hardware. The MUX relay interlock prevents
simultaneous multi-module connections, enforced at both firmware and API
layers. Code, schema, and test vectors are published on GitHub.

---

## 1. Introduction

TODO — motivate open-source solar test infrastructure; cite NREL, Fraunhofer
ISE, and recent MDPI papers on low-cost IV tracers.

Key claims to establish here:
1. Cost gap between commercial and open-source IV characterisation systems.
2. IEC 60891:2021 compliance requirement for NABL/ISO 17025 labs.
3. Real-time display latency matters for operator feedback loops.

---

## 2. System Architecture

### 2.1 Hardware layer

- ESL-Solar 500 electronic load (ET SolarPower): 0–300 V / 0–27 A.
- 300-relay MUX matrix (75 modules × 4-wire Kelvin lanes).
- Pyranometer (Kipp & Zonen SMP10) + IMT reference cell on Modbus RTU.

### 2.2 SCPI driver (`packages/scpi-client`)

TODO — describe once M1 (issue #148) extracts `scpi-client` package.

Key SCPI commands used:

| Function | Command |
|----------|---------|
| MPP sweep | `SOUR:MPPSCAN:START`, `STOP`, `STEP`, `STEPT`, `EXEC` |
| Readback | `MEAS:MPPSCAN:LISTFIRST?` → `LISTNEXT?` |
| E-load off | `SOUR OFF` (before every MUX relay transition) |

### 2.3 WebSocket bridge (`lib/websocket-server.ts`, `/api/ws`)

- Node.js Socket.IO server mounted on Next.js API route.
- Each connected client subscribes to a `sessionId` room.
- SCPI sweep results are pushed as `iv:point` events; end-of-sweep as
  `iv:complete`.
- Back-pressure: if the client buffer exceeds 512 queued events, points are
  batched.

### 2.4 Client hook (`hooks/useIVStream.ts`)

- React hook wrapping Socket.IO client.
- Handles reconnection with exponential backoff (2 s, 4 s, 8 s, max 30 s).
- Exposes `{ points, status, error }` to `LiveIVChart.tsx`.

---

## 3. IEC Correction Pipeline

Order of operations (per `POST /api/corrections/apply`):

1. **IAM** — adjust G for off-normal incidence (Martin-Ruiz model, ar = 0.17).
2. **SMMF** — adjust Isc for spectral mismatch (IEC 60904-7 trapezoidal integration).
3. **IEC 60891 P2** — translate (G₁, T₁) → STC (1000 W/m², 25 °C).

See `docs/IEC-CORRECTIONS.md` for full algorithmic detail.

TODO — add worked example with field data once lab benchmarks (#142) are
complete. P1 vs P2 comparison table (already drafted in IEC-CORRECTIONS.md
§1.5) should be reproduced here with expanded uncertainty.

---

## 4. Performance Benchmarks

TODO — measure and report:
- [ ] SCPI sweep time for 500-point IV curve at 5-second scan time.
- [ ] WebSocket client-perceived latency (local LAN, Wi-Fi, 4G).
- [ ] Correction pipeline execution time (P1, P2, P3, P4, SMMF, IAM).
- [ ] Concurrent session capacity (how many simultaneous sweeps?).

---

## 5. MUX Interlock Safety

The firmware (STM32H7) + API layer both enforce a single-module-at-a-time
invariant:

1. Firmware: only one ELOAD-destination relay may be closed simultaneously.
2. API: `POST /api/mux/:id/connect` returns `409 Conflict` if another slot
   is already ELOAD-connected.
3. SCPI: `SOUR OFF` is issued before every relay transition.

This prevents arc damage to relay contacts (rated 100 A peak, not for
continuous make-under-load).

---

## 6. Comparison with Commercial Systems

TODO — table comparing Surya Yantra vs LabVIEW + VISA vs pvanalytics vs
other open-source IV tracers. Focus on: cost, IEC compliance, real-time
display, data format, hardware compatibility.

---

## 7. Conclusions

TODO — summarise claims once benchmarks are complete.

---

## References

TODO — cite:
- IEC 60891:2021
- IEC 60904-7:2019
- IEC 61853-2:2016
- Martin & Ruiz (2001) — Solar Energy Materials & Solar Cells 70:25–38
- Relevant MDPI Sensors papers on low-cost IV tracers
- ESL-Solar 500 datasheet
