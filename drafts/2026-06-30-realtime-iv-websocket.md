# Real-Time IV Curve Telemetry Over WebSocket: Architecture and Protocol Design in Surya Yantra

**Status**: seed — Tuesday 2026-06-30
**Target venue**: MDPI Sensors / IEEE PVSC 2027 proceedings
**Linked engineering work**: `bb8791c` (WebSocket IV streaming), `3031b05` (iv-tracer page), `apps/web/hooks/useIVStream.ts`, `apps/web/components/LiveIVChart.tsx`

---

## Abstract (draft)

Traditional PV module IV curve tracers acquire a full sweep in batch and post-process
the data offline. As test-bed sizes grow — the Srishti PV Lab runs 75 modules on a
300-relay MUX matrix — the latency between measurement and insight becomes a
bottleneck for operator feedback. This paper describes the WebSocket streaming
architecture implemented in Surya Yantra that delivers real-time IV curve data from
the ESL-Solar 500 electronic load to a browser-based dashboard, enabling live IEC
60891-corrected curve visualisation with sub-second latency.

---

## Outline

### 1. Introduction
- Traditional batch IV measurement workflow and its latency profile
- Motivation: 75-module test bed, operator monitoring, defect triage in real time
- Contribution: open-source WebSocket–SCPI bridge with IEC correction hooks

### 2. System Architecture
- SCPI acquisition loop on lab PC (Electron app) → Node.js WebSocket server
- `apps/web/app/api/ws/route.ts` — Next.js WebSocket route handler
- `hooks/useIVStream.ts` — React hook: connection management, reconnect back-off
- `components/LiveIVChart.tsx` vs static `IVChart.tsx` — comparison
- Sequence diagram: SCPI sweep → JSON frame → WebSocket → React state → chart render

### 3. Protocol Design
- Wire format: `IVStreamFrame` type (`apps/web/types/iv-stream.ts`)
- Frame fields: sweep_id, slot, timestamp, points (V[], I[]), meta (G, T, procedure)
- Batching strategy: 10-point micro-frames during sweep, full-curve frame at end
- Error frame taxonomy: `TIMEOUT`, `MUX_CONFLICT`, `QUALITY_LOW`

### 4. IEC 60891 Integration
- On-the-fly P1 correction applied per frame using `lib/iec60891.ts`
- Streaming corrected and raw curves in parallel
- Warning header propagation: `x-sy-correction-warning` → UI badge

### 5. Performance Characterisation (TODO — lab benchmarks needed)
- End-to-end latency: SCPI command → browser pixel (target < 200 ms)
- Frame rate: points/s vs sweep step count
- CPU budget on Intel NUC 13 Pro under 75-module sequential sweep
- Comparison with polling-based REST approach

### 6. Discussion
- Comparison with LabVIEW streaming, DAQmx circular buffers
- Trade-offs: WebSocket vs Server-Sent Events vs gRPC for lab telemetry
- Failure modes: relay bounce, E-load transient, reconnect under MUX switch

### 7. Conclusion
- Open-source WebSocket–SCPI bridge enables sub-second IV telemetry
- Architecture generalises to any SCPI-over-TCP instrument
- Future: multi-module parallel acquisition with independent WebSocket streams

---

## References (seed — expand for submission)

1. IEC 60891:2021, *Temperature and irradiance corrections to I-V characteristics*.
2. IEC 60904-1:2020, *I-V measurement of photovoltaic devices*.
3. ET SolarPower ESL-Solar 500 SCPI Reference Manual, 2024.
4. MDN Web Docs — WebSocket API (2026).
5. Next.js App Router documentation — Route Handlers (Vercel, 2026).

---

## Content gaps / blocking issues

- [ ] **Lab benchmarks** — end-to-end latency and throughput numbers needed (see GitHub issue)
- [ ] **Sequence diagram** — figure with alt-text "Sequence diagram: SCPI→WebSocket→React pipeline"
- [ ] **Wire format schema** — include full TypeScript interface from `types/iv-stream.ts`
- [ ] MDPI Sensors author guidelines confirmation (5000–8000 words, LaTeX preferred)
