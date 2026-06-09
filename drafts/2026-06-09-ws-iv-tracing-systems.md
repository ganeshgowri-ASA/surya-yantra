---
title: "Open-Source WebSocket–SCPI Bridge for Real-Time PV IV Curve Streaming: Architecture, Performance Model, and IEC 60891 Integration"
slug: ws-iv-tracing-systems
date: 2026-06-09
status: outline
week_angle: Monday/outline
keywords:
  - photovoltaic
  - IV curve tracer
  - WebSocket
  - SCPI
  - Socket.IO
  - real-time measurement
  - IEC 60891
  - open-source instrumentation
description: >
  System-architecture paper describing a WebSocket–SCPI bridge that streams
  live IV curve data from an ESL-Solar 500 electronic load to a Next.js
  browser client with sub-50 ms end-to-end latency, and integrates the IEC
  60891 correction pipeline for real-time STC normalisation.
target_journal: MDPI Sensors (Open Access)
estimated_length_words: 6000
blocking_gaps:
  - Measured latency benchmarks (see issue #142)
  - ESL-Solar 500 USB baud rate confirmation (9600 vs 115200)
  - Memory heap benchmark at ≥ 1 h continuous streaming
related_code:
  - apps/web/lib/websocket-server.ts
  - apps/web/hooks/useIVStream.ts
  - apps/web/components/LiveIVChart.tsx
  - apps/web/app/api/ws/route.ts
  - apps/web/types/iv-stream.ts
related_issues: [#129, #142]
---

# Outline

## 1. Abstract (≈ 200 words)
- Motivation: IV tracing feedback loops — operator adjusts tilt/shading but
  receives corrected STC results only after a full post-hoc pipeline run.
- Contribution: sub-50 ms streaming bridge; ring-buffer architecture; optional
  real-time P2 correction.
- Results: theoretical latency model; measured results pending (§4 blocked on
  lab commissioning — see issue #142).
- Open-source: MIT, all code in `apps/web/`.

---

## 2. Introduction

### 2.1 The feedback-loop problem in PV module characterisation
- Traditional flow: sweep → CSV export → Python/MATLAB correction → results.
  Typical round-trip: 2–10 minutes.
- Consequence: engineers cannot observe transient shading, soiling, or cell
  temperature effects in real time.
- Prior art: LabVIEW streaming (proprietary, Windows-only); PyVISA polling
  (Python-only, no browser UI); SMA Sunny Explorer (firmware-locked).

### 2.2 Contribution
- A fully open-source, instrument-agnostic WebSocket bridge that exposes IV
  data to any browser client.
- IEC 60891 P2 correction optionally applied per-point in the streaming path.
- Tested on ESL-Solar 500 via SCPI; protocol-agnostic (any SCPI instrument
  reachable via USB or TCP).

### 2.3 Paper structure
- §3 Architecture, §4 Performance, §5 IEC Integration, §6 Discussion.

---

## 3. System Architecture

### 3.1 Transport stack
```
ESL-Solar 500
  ↓  SCPI (USB serial / TCP:5025)
serialport / net (Node.js)
  ↓
IV Sampler (lib/websocket-server.ts)
  ↓  Socket.IO rooms per session
Browser (useIVStream.ts hook)
  ↓  useMemo → chartData
LiveIVChart.tsx (Recharts)
```

### 3.2 Server-side components
- `lib/websocket-server.ts`: singleton Socket.IO server; per-session pub/sub
  rooms; 1000-point in-memory replay buffer; `start`, `stop`, `pause`,
  `resume` lifecycle events.
- Sampler loop: `MEAS:MPPSCAN:LISTFIRST?` → parse → emit `iv:point`;
  `MEAS:MPPSCAN:LISTNEXT?` until `END`; then loop at configurable interval.
- Session isolation: each test session has its own Socket.IO room; multiple
  browser clients can subscribe to the same session.

### 3.3 Client-side hook (`useIVStream.ts`)
- Connection state machine: `connecting → connected → paused → disconnected`.
- Exponential reconnect: 1 s, 2 s, 4 s, 8 s (cap 30 s).
- Ring buffer: configurable depth (default 5000 pts); oldest points dropped
  when full.
- Pause/resume: buffer accumulates while paused; replays on resume.

### 3.4 Browser rendering (`LiveIVChart.tsx`)
- Recharts `LineChart` with dual Y-axes: current (A) and power (W).
- Auto-scroll: X-axis tracks latest voltage point.
- Status indicator: colour-coded (connecting / streaming / paused / error).
- Controls: Pause/Resume, Clear, Reconnect, Download CSV.

### 3.5 Authentication gap (see issue #152)
- Current implementation: no auth on `/api/ws`. A Socket.IO middleware guard
  (session cookie or HMAC token) is required before production use.
- Planned: `requireAuth()` from `apps/web/lib/api-auth.ts`.

---

## 4. Performance Evaluation (§ BLOCKED — issue #142)

### 4.1 Theoretical latency model
```
T_total = T_scpi + T_parse + T_socket + T_render

T_scpi   ≈ 1/baud × bytes + instrument processing
          (USB 9600 baud, ~50 bytes/point → ~52 ms; TCP 10 Mbps → <0.1 ms)
T_parse  ≈ 0.5 ms (V;A;W string split)
T_socket ≈ 1–5 ms (LAN) / 5–20 ms (Wi-Fi)
T_render ≈ 1000/FPS ms = 16.7 ms at 60 FPS

Target T_total < 50 ms requires Ethernet SCPI (TCP:5025), not USB serial.
```

### 4.2 Measured benchmarks (TODO — see issue #142)
| Condition | Mean latency (ms) | σ |
|-----------|------------------|---|
| USB 9600  | —                | — |
| TCP LAN   | —                | — |
| TCP Wi-Fi | —                | — |

### 4.3 Frame-rate under load (TODO)
| Incoming rate (pts/s) | Chrome FPS | Firefox FPS |
|-----------------------|-----------|------------|
| 50                    | —         | —          |
| 200                   | —         | —          |
| 500                   | —         | —          |

### 4.4 Memory stability (TODO)
- Expected: heap stable at ring-buffer ceiling (≈ 200 kB at 5000 pts × 40 B).
- Measure: Chrome DevTools heap snapshot at t = 0, 30 min, 1 h, 4 h.

---

## 5. Integration with IEC 60891 Correction Pipeline

### 5.1 Post-hoc vs streaming correction
| Approach | Latency overhead | Accuracy |
|----------|-----------------|---------|
| Post-hoc (current) | 0 ms streaming; ~200 ms batch after sweep | Full P1–P4 with bilinear interpolation |
| Per-point streaming P2 | ~2 ms/point (JS V8) | P2 only; G and T from latest env reading |

### 5.2 Real-time P2 feasibility
- Requires: G and T sampled from environmental sensors at the same cadence as
  IV points. Currently, Modbus RTU sensors update at 1 Hz; SCPI sweep runs
  at 100–500 pts/s. Mismatch means per-point correction uses the last 1 Hz
  environmental reading.
- Acceptable for trend-monitoring; not acceptable for publication-quality STC
  values. Post-hoc P2 with synchronised timestamps remains the reference.

### 5.3 Architecture diagram (Fig. 1 — placeholder)
> *TODO: SVG showing the dual-path: streaming path (WebSocket) and correction
> path (REST POST /api/corrections/p2). Alt-text required.*

---

## 6. Comparison with Prior Art

| System | Protocol | Browser UI | IEC corrections | Open-source |
|--------|----------|-----------|----------------|-------------|
| LabVIEW NXG Streaming | NI-DAQmx / VISA | No | Via plug-ins | No |
| PyVISA + Plotly Dash | SCPI | Yes (Dash) | Manual | Yes |
| SMA Sunny Explorer | Proprietary | No | No | No |
| **Surya Yantra** | SCPI / Socket.IO | Yes (Next.js) | Yes (IEC 60891 P1–P4) | Yes (MIT) |

---

## 7. Discussion

### 7.1 Instrument independence
- Any SCPI instrument reachable via `serialport` or TCP can be substituted.
- The sampler loop expects `MEAS:MPPSCAN:LISTFIRST?` format; an adapter layer
  for Keithley 2651A or Chroma 62000P is a one-function shim.

### 7.2 Security hardening required before public deployment
- The `/api/ws` endpoint must be gated (issue #152).
- The MUX relay control (`/api/mux/*/connect`) must not be reachable without
  authentication — a WebSocket client could trigger live 300 V DC switching.

### 7.3 Limitations
- 9600 baud USB imposes ~52 ms/point overhead — TCP is strongly preferred.
- Real-time P2 correction is a qualitative monitor; do not use for reports.
- No support for multi-module parallel streaming (MUX serialises modules).

---

## 8. Conclusion (≈ 200 words)
- First open-source WebSocket–SCPI bridge for PV IV curve streaming.
- Full IEC 60891 integration in post-hoc path; real-time P2 feasible for
  monitoring.
- Deployed at Srishti PV Lab; code at `ganeshgowri-ASA/surya-yantra`.
- Future work: measured benchmarks, auth hardening, multi-instrument adapters.

---

## References (to be filled — 8+ required)

1. IEC 60891:2021 — *Photovoltaic devices — Procedures for temperature and
   irradiance corrections to measured I-V characteristics.*
   [IEC Webstore](https://webstore.iec.ch/publication/66244)

2. SCPI Consortium (1999). *Standard Commands for Programmable Instruments
   (SCPI) v1999.0.* [scpiconsortium.org](http://www.scpiconsortium.org)

3. Socket.IO (2024). *Socket.IO Documentation — Server API.*
   [socket.io/docs](https://socket.io/docs/v4/server-api/)

4. — *PyVISA: Python package for support of the "Virtual Instrument Software
   Architecture" (VISA).* [pyvisa.readthedocs.io](https://pyvisa.readthedocs.io)

5. Ransome, S., & Sutterlueti, J. (2011). Choosing the best simplified
   correction methods for outdoor PV modelling. *26th EU PVSC.*
   *(TODO: DOI)*

6. *(TODO: IEC 60904-7:2019 citation — spectral mismatch)*

7. *(TODO: Recharts performance benchmark citation)*

8. *(TODO: India solar testing capacity reference — MNRE or IEA)*
