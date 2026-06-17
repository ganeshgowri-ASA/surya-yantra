# Open-Source WebSocket–SCPI Bridge for Real-Time PV IV Curve Streaming

**Status:** seed · **Date:** 2026-06-17 · **Target:** MDPI Sensors / Solar Energy

## Narrative hook

Every IEC 60891 correction pipeline starts with a clean IV sweep. Yet most open-source PV test tools still batch-export CSV files and correct offline. The recent Surya Yantra commits (`feat(ws)`, `feat(web): add iv-tracer`) wire Socket.IO directly to the ESL-Solar 500 SCPI command stream, letting a browser render a live corrected IV+PV curve milliseconds after each sweep step fires. This article documents the architecture choices, latency budget, and IEC 60904-1 sampling constraints that shaped the design.

## Engineering peg (today's commits)

| Commit | Change |
|--------|--------|
| `feat(ws): add real-time IV curve streaming over Socket.IO` | `useIVStream` hook, `websocket-server.ts`, `LiveIVChart` |
| `feat(web): add iv-tracer, modules, corrections, reports pages` | Full Next.js App Router integration |
| `feat(web): add RootLayout + homepage with stats, LiveIVChart demo` | Dynamic import, SSR-false guard |

## Proposed sections

1. **Introduction** — gap between benchtop SCPI instruments and live browser dashboards; prior art (LabVIEW, PyVISA streaming)
2. **System Architecture** — ESL-Solar 500 → SCPI over USB/Ethernet → Node.js serialport → Socket.IO room → React `useIVStream` → `LiveIVChart` (Recharts)
3. **Latency budget** — SCPI scan step period (`SMMF:STEPT`), serialport baud (9600 vs Ethernet), Socket.IO round-trip, React render cycle; target < 50 ms end-to-end at 500-point sweep
4. **IEC 60904-1 constraints** — minimum sweep dwell, scan time ≥ 5 s for quasi-static assumption; how the streaming buffer reconciles live display with standard compliance
5. **IEC 60891 in-flight correction** — applying P1/P2 incrementally as points arrive; showing corrected and raw overlaid in real time
6. **Security model** — HMAC-signed bearer token on WebSocket upgrade; lab-only ESL_SOLAR_HOST env var; no cloud path to the instrument
7. **Benchmark results** — TODO: measure on lab bench (see issue #142 for benchmark protocol)
8. **Comparison** — vs Python + Matplotlib animation; vs commercial PV analyzers (Sinton, Spire); vs browser-based Jupyter kernels
9. **Conclusion** — reproducibility: full stack MIT-licensed, one `pnpm dev` to run

## Key figures needed

- [ ] Architecture diagram: ESL-Solar 500 → PC → Vercel relay → browser (Fig. 1)
- [ ] Screenshot: `LiveIVChart` rendering a 500-point sweep with I-V and P-V overlaid (Fig. 2)
- [ ] Latency histogram: 100 consecutive sweeps, end-to-end ms (Fig. 3) — **blocked on lab bench** (issue #142)
- [ ] Code listing: `useIVStream.ts` hook (< 60 lines) (Listing 1)

## Cross-links to sibling projects

- **SolarLabX** (LIMS): measurement traceability record links back to the streaming session ID
- **GanitaSutra** (SimuFlow): IV curve data can feed a SimuFlow diode-model block for equivalent-circuit extraction
- **Antaryami OS**: AI diagnostics agent (`/api/ai/chat`) streams Claude commentary on live IV anomalies

## Blocking gaps (file issues)

- Lab benchmark data (#142 already filed — confirm protocol)
- `apps/desktop/relay` service not yet implemented — needed for the "Cloudflare Tunnel" architecture path described in DEPLOYMENT.md

## References (seed)

1. IEC 60904-1:2020 — I-V measurement of PV devices
2. IEC 60891:2021 — Temperature and irradiance corrections
3. Dobos, A.P. (2012). An improved coefficient calculator for the California Energy Commission 6 parameter photovoltaic module model. *J. Solar Energy Eng.* 134(2).
4. Socket.IO docs — https://socket.io/docs/v4/
5. ET SolarPower ESL-Solar 500 User Manual (internal)
