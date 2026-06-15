# Surya Yantra — Engineering & Content Roadmap

> **Roadmap date:** 2026-06-15 (W25 Sunday review)
> **Horizon:** Q3 2026 (Jul–Sep)
>
> This document captures planned engineering milestones, the article publication
> pipeline, and how Surya Yantra fits into the broader Srishti PV Lab ecosystem.
> Reviewed weekly on Sundays; major changes tracked as GitHub issues.

---

## 1. Ecosystem Map

```
                       ┌────────────────────────────┐
                       │      Antaryami-OS          │
                       │  Enterprise AI OS / HRMS   │
                       └──────────────┬─────────────┘
                                      │ orchestration
                    ┌─────────────────┼──────────────────┐
                    ▼                 ▼                  ▼
          ┌──────────────┐  ┌──────────────────┐  ┌──────────────┐
          │  SolarLabX   │  │   Surya Yantra   │  │ ShilpaSutra  │
          │  LIMS + QMS  │  │  IV Tracer +     │  │  Text→CAD    │
          │  Audit + SOP │  │  IEC Corrections │  │  + CFD sim   │
          └──────┬───────┘  └────────┬─────────┘  └──────┬───────┘
                 │                   │                    │
                 └───────────────────┼────────────────────┘
                                     │ pv-pranali
                                     ▼
                          ┌──────────────────────┐
                          │  GanitaSutra         │
                          │  SimuFlow + PlotEngine│
                          │  (IV model toolboxes) │
                          └──────────────────────┘
```

**Surya Yantra's role:** produces the primary measurement artifact (corrected IV
curve + STC parameters) that feeds SolarLabX's LIMS traceability chain, and
generates the raw data that GanitaSutra's simulation toolboxes validate against.

---

## 2. Q3 2026 Engineering Milestones

### 2.1 Core platform (July)

| # | Milestone | Owner | Issue |
|---|-----------|-------|-------|
| M1 | `packages/scpi-client` extracted from `apps/web/lib` | backend | #148 |
| M2 | `packages/iv-engine` extracted, tested as standalone | backend | #149 |
| M3 | `packages/types` shared TypeScript types package | backend | #150 |
| M4 | CI/CD pipeline — GitHub Actions (lint + test + build) | devops | #151 |
| M5 | `hardware/schematics/` SVG diagrams committed | hardware | #147 |
| M6 | `hardware/WIRING.md` wiring guide | hardware | #152 |
| M7 | MUX/Environmental screen pages implemented | frontend | #153 |
| M8 | `/api/health` endpoint implemented | backend | #154 |

### 2.2 IEC compliance depth (August)

| # | Milestone | Owner | Issue |
|---|-----------|-------|-------|
| M9 | IEC 60891 Procedure 3 curve-alignment robustness | backend | #155 |
| M10 | Uncertainty budget (GUM) for each correction procedure | research | #120 |
| M11 | IEC 61853-3 energy rating calculation (`lib/energy-rating.ts`) | backend | #156 |
| M12 | MUX controller firmware open-sourced (`hardware/firmware/`) | hardware | #157 |

### 2.3 SolarLabX integration (September)

| # | Milestone | Owner | Issue |
|---|-----------|-------|-------|
| M13 | REST export: `POST /api/export/solarlabx` pushes corrected curve to SolarLabX LIMS | integration | #158 |
| M14 | NABL audit trail — `IVMeasurement.auditLog` JSON field | backend | #159 |
| M15 | pv-pranali agent can trigger IV sweeps via Surya Yantra API | integration | #160 |

---

## 3. Article Publication Pipeline — W25 Status

### 3.1 Active drafts

| File | Title | Target | Status |
|------|-------|--------|--------|
| `drafts/2026-06-15-ws-iv-tracing-systems.md` | Open-Source WebSocket–SCPI Bridge for Real-Time PV IV Curve Streaming | MDPI Sensors | Seed created today |
| `drafts/2026-06-15-multi-agent-pv-orchestration.md` | Multi-Agent PV Test Orchestration with LangGraph + Claude Code | IEEE Access | Seed created today |

### 3.2 Q3 publication targets

| Quarter | Article | Venue | Status |
|---------|---------|-------|--------|
| Q3 W27 | WebSocket–SCPI Bridge (see above) | MDPI Sensors | Outline |
| Q3 W29 | Multi-Agent PV Orchestration (see above) | IEEE Access | Outline |
| Q3 W31 | From Schema to NABL: PostgreSQL for ISO 17025 PV Labs | Measurement (Elsevier) | Planned |
| Q3 W33 | GanitaSutra SimuFlow vs MATLAB/Simulink for PV Modelling | Solar Energy | Planned |
| Q3 W35 | ShilpaSutra Text-to-CAD for Rapid PV Test Fixture Design | Automation in Construction | Planned |

---

## 4. Two Article Seeds — W25

### Seed A: WebSocket–SCPI Bridge for Real-Time IV Streaming

**Narrative hook:** Open-source solar PV labs face a last-mile gap between
instrument-grade SCPI hardware (ESL-Solar 500) and the browser dashboards
their engineers actually use. Surya Yantra's WebSocket bridge (`useIVStream`,
`/api/ws`) demonstrates a reproducible, IEC-compliant architecture for this.

**Link to this week's engineering:** The `LiveIVChart.tsx` component and
`lib/websocket-server.ts` are production code in the main branch.
`hooks/useIVStream.ts` handles back-pressure and reconnection, making it
publishable as a reference architecture.

**Research narrative:** Instrument latency < 50 ms round-trip over local
LAN; batch correction (IEC 60891 P2) applied per sweep in < 5 ms on
Prisma-backed Node.js. Compares favourably with LabVIEW VISA streaming
at similar cost. Section on reliability: MUX interlock prevents multi-module
conflicts (server-enforced `409 Conflict`).

**Target:** MDPI Sensors — Open Instrumentation special issue.

---

### Seed B: Multi-Agent PV Test Orchestration with LangGraph + Claude Code

**Narrative hook:** pv-pranali (multi-agent LangGraph + MCP) can already
trigger ShilpaSutra CAD jobs and Antaryami-OS workflows. Extending it to
drive Surya Yantra IV sweeps creates a fully autonomous PV characterisation
pipeline: design → manufacture → test → LIMS in one agent graph.

**Link to this week's engineering:** pv-pranali's Vercel deployment is
READY (confirmed today). The Surya Yantra API (`POST /api/sessions`,
`POST /api/sessions/:id/start`, WebSocket stream) is the only missing
MCP tool surface needed to close the loop.

**Research narrative:** Describe the agent graph: ShilpaSutra generates
fixture CAD → antaryami-os schedules lab time → Surya Yantra executes
sweep → SolarLabX records in LIMS → GanitaSutra validates against
simulated curves. Quantify: how many human touches remain vs. fully
autonomous? What are the failure modes?

**Target:** IEEE Access (Open Access, fast review).

---

## 5. Risks & Open Questions

| Risk | Severity | Mitigation |
|------|----------|------------|
| MUX firmware not open-sourced | High | Issue #157; target M12 for Aug release |
| No CI/CD — PRs not gated | Medium | Issue #151; M4 July |
| `hardware/schematics/` absent | Medium | Issue #147; M5 July |
| Uncertainty budget (GUM) missing from articles | High | Issue #120; needed for Measurement submission |
| `apps/web/.env.example` was absent | Low | **Fixed in this PR** |
| IAM formula wrong in README | Low | **Fixed in this PR** |
| API model reference stale | Low | **Fixed in this PR** |

---

*Next Sunday review: 2026-06-22 — check M1–M3 (package extraction) progress.*
