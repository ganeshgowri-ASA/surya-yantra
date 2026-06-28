---
title: "Open-Source WebSocket–SCPI Bridge for Real-Time PV Module IV Curve Streaming"
slug: "websocket-scpi-iv-streaming-surya-yantra"
status: outline
target_venue: "MDPI Sensors"
outline_date: 2026-06-28
linked_repos:
  - surya-yantra
  - SolarLabX
tags:
  - SCPI
  - WebSocket
  - IEC-60891
  - real-time
  - ESL-Solar-500
  - PV-characterization
  - Node.js
  - open-source
---

# Open-Source WebSocket–SCPI Bridge for Real-Time PV Module IV Curve Streaming

> **Status:** outline — lab benchmarks required before bulk-write phase

## Abstract (draft)

Automated PV module characterisation at scale demands real-time acquisition
from electronic loads over SCPI, streamed without perceptible latency to a
browser UI. Commercial solutions are proprietary; published open-source
alternatives lack IEC 60891:2021 correction pipelines. This paper describes
the Surya Yantra WebSocket–SCPI bridge: a Node.js `serialport`-backed server
action that pipelines ESL-Solar 500 MPP-scan results through spectral,
incidence-angle, and temperature/irradiance corrections before emitting
corrected IV+PV curves to the React `LiveIVChart` component over a
persistent WebSocket connection.

TODO: Add measured round-trip latency and sweep fidelity at 500 points/sweep.

## 1. Introduction

### 1.1 Motivation

The Srishti PV Lab (Jamnagar, India) operates a 75-module, 15 × 5 test bed
with 4-wire Kelvin sensing and a 300-relay MUX matrix. Operators need
sub-second feedback on IV curve shape during sequential module sweeps to
detect step-change degradation before the full 75-module session completes.

### 1.2 Related work

TODO: Survey commercial IV tracers (Sinton, Halm, Spire) and open-source
alternatives (pvlib, pyiv). Identify gap: none combine SCPI + WebSocket +
browser-native IEC 60891 corrections.

### 1.3 Contributions

1. Open-source WebSocket–SCPI bridge for ESL-Solar 500 (MIT licence).
2. Browser-rendered IEC 60891 P1–P4 corrections with sub-100 ms round-trip.
3. Multiplexer interlock ensuring single-active-module safety at the API layer.

## 2. System Architecture

### 2.1 Hardware layer

- ESL-Solar 500 electronic load (0–300 V / 0–27 A) via USB/SCPI
- 300-relay MUX matrix (STM32H7 + MCP23017 expanders + Omron G9EA)
- 4-wire Kelvin harness: Force± (16 mm²) + Sense± (2.5 mm² shielded)
- Environmental sensors: Kipp & Zonen SMP10 pyranometer, IMT reference cell,
  Pt-100 (×4) cell temperature

### 2.2 Software stack

```
ESL-Solar 500 ──SCPI/USB──► apps/desktop/relay (Node.js HTTP relay)
                                      │
                            Cloudflare Tunnel
                                      │
                         apps/web/app/api/ (Next.js)
                                      │
                    WebSocket Server Action (Next.js 14)
                                      │
                    components/LiveIVChart (Recharts)
```

Key commits in `surya-yantra`:
- `7f2fb4d` — WebSocket IV streaming scaffold
- `73d5a6f` — `LiveIVChart` Recharts component
- `3031b05` — IV-tracer, modules, corrections, reports pages

### 2.3 SCPI command sequence

```
SOUR:FUNC:MODE CV                  # set constant-voltage sweep mode
SOUR:MPPSCAN:START 0               # sweep start voltage (V)
SOUR:MPPSCAN:STOP 50               # sweep stop voltage (V)
SOUR:MPPSCAN:STEP 0.1              # step size (V)
SOUR:MPPSCAN:STEPT 0.005           # dwell time (s)
SOUR:MPPSCAN:EXEC                  # trigger sweep
MEAS:MPPSCAN:LISTFIRST?            # read first (V, I, P) triple
# … MEAS:MPPSCAN:LISTNEXT? until empty
```

## 3. IEC 60891 Correction Pipeline

Correction order (matches `POST /api/corrections/apply`):

1. **IAM** — correct G_eff for angle of incidence (Martin-Ruiz, `ar = 0.17`)
2. **SMMF** — correct Isc for spectral mismatch (IEC 60904-7)
3. **IEC 60891 P1 or P2** — translate (G_meas, T_meas) → STC (1000 W/m², 25 °C)

The full Vitest test suite for Procedures 1–4 is in `apps/web/__tests__/`
(commit `61ae9b0`).

TODO: Benchmark correction latency vs. sweep duration at 500 points.

## 4. Results

TODO: Lab measurements required.

- [ ] Round-trip latency (SCPI trigger → browser pixel) at 500 points
- [ ] Correction accuracy vs. manual PVsyst calculation (blocked: hardware
      commissioning, see issue #208)
- [ ] Concurrent sweep throughput (75 modules × typical 5 s/sweep)

## 5. Discussion

### 5.1 Relay service deployment trade-offs

| Option            | Latency overhead | Cost    | Persistent URL |
| ----------------- | ---------------- | ------- | -------------- |
| Cloudflare Tunnel | ~5 ms            | Free    | Yes            |
| Tailscale Funnel  | ~5 ms            | Free    | Yes            |
| ngrok             | ~15 ms           | Paid    | Yes (paid)     |

### 5.2 Vercel serverless vs. edge function trade-off

Long-running WebSocket connections conflict with Vercel's 10 s function
timeout. The relay service pattern (lab PC → tunnel → Next.js API) keeps
the Vercel function as a thin proxy, passing the WebSocket upgrade to the
lab-side relay which holds the SCPI connection open.

## 6. Conclusion

TODO: After lab benchmarks.

## References

- IEC 60891:2021 — Temperature & irradiance corrections to I-V characteristics
- IEC 60904-7:2019 — Spectral mismatch correction
- IEC 61853-2:2016 — Incidence angle modifier (Martin-Ruiz)
- ESL-Solar 500 User Manual (ET SolarPower, FW ≥ 1.12)
- TODO: Add latency benchmark citations
