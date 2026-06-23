# Surya Yantra — Product Requirements Document

> **Status: living document** — updated as features ship.  
> Last review: 2026-06-23 (W27 Monday outline pass)

---

## 1. Purpose and Scope

Surya Yantra is the IV curve tracer and test management system for Srishti PV Lab, Jamnagar. This PRD defines the functional and non-functional requirements for:

- **Web app** (`apps/web/`) — Vercel-deployed Next.js 14 web application.
- **Desktop app** (`apps/desktop/`) — Electron 30 standalone Windows/macOS app.
- **Hardware interface** — ESL-Solar 500 electronic load via SCPI, 75-module MUX relay matrix.

---

## 2. User Personas

| Persona | Role | Primary screens |
|---------|------|----------------|
| **Lab Technician** | Runs IV sweeps, selects modules, exports reports | IV Tracer, MUX Matrix, Reports |
| **Lab Engineer** | Configures corrections, reviews AI diagnostics, manages STC parameters | IV Corrections, AI Diagnostics, Module Registry |
| **Lab Manager** | Reviews test batch summaries, degradation trends, compliance status | Dashboard, Reports |
| **Integration Developer** | Connects Surya Yantra to SolarLabX LIMS, Antaryami OS | API Reference, MCP manifest |

---

## 3. Functional Requirements

### 3.1 IV Curve Tracing

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | System shall sweep voltage from 0 V to Voc in configurable steps (1–500 steps) | MUST | Implemented |
| FR-02 | System shall support CC, CV, CR, and MPPT scan modes on ESL-Solar 500 | MUST | Implemented |
| FR-03 | System shall capture V, I, P at each sweep point with ≤ 5 ms timestamping | MUST | Implemented |
| FR-04 | System shall stream live IV curve to browser via WebSocket (< 200 ms latency) | MUST | Implemented |
| FR-05 | System shall support adaptive sweep concentrating sample density near MPP | SHOULD | Planned — see `drafts/seed-ganitasutra-simflow-iv-sweep.md` |

### 3.2 MUX Matrix Control

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-10 | System shall switch any of 75 module channels via `POST /api/mux/select` | MUST | Schema defined |
| FR-11 | System shall display 15×5 relay grid with live relay state | MUST | UI scaffold present |
| FR-12 | System shall run relay health self-test on startup | MUST | Planned |

### 3.3 IEC Corrections

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-20 | System shall implement IEC 60891:2021 Procedures 1–4 | MUST | Implemented (`lib/iec60891.ts`) |
| FR-21 | System shall implement SMMF per IEC 60904-7 | MUST | Implemented (`lib/smmf.ts`) |
| FR-22 | System shall implement Martin-Ruiz IAM per IEC 61853-2 | MUST | Implemented (`lib/iam.ts`) |
| FR-23 | System shall report GUM expanded uncertainty U(P_mpp) at k=2 | SHOULD | Planned — see `drafts/2026-06-23-gum-uncertainty-iec60891-outline.md` |

### 3.4 Reports and Export

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-30 | System shall export IV data as CSV, XLSX, and PDF | MUST | Scaffold present |
| FR-31 | System shall support batch comparison of multiple modules | SHOULD | Planned |
| FR-32 | Report PDF shall include GUM uncertainty budget | SHOULD | Planned |

### 3.5 AI Diagnostics

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-40 | System shall provide Claude-powered chat interface for IV fault analysis | MUST | Scaffold present |
| FR-41 | AI shall identify shading, delamination, bypass-diode, and PID signatures | SHOULD | Planned |

### 3.6 Integrations

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-50 | System shall expose MCP tool manifest for Antaryami OS integration | SHOULD | Planned — see `drafts/seed-antaryami-pv-lab-stack.md` |
| FR-51 | System shall push corrected `CorrectionResult` to SolarLabX LIMS `uExpandedPct` | SHOULD | Planned |

---

## 4. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | API response time (P95) | < 200 ms (excluding sweep duration) |
| NFR-02 | WebSocket IV stream latency | < 200 ms end-to-end |
| NFR-03 | Vercel deployment availability | ≥ 99.5% |
| NFR-04 | Expanded uncertainty U(P_mpp) | ≤ 2.0% (k=2) — IEC 61215 requirement |
| NFR-05 | Browser support | Chrome 120+, Firefox 120+, Edge 120+ |
| NFR-06 | SCPI command response | < 500 ms per command (ESL-Solar 500 spec) |

---

## 5. Out of Scope (v1.0)

- Multi-site deployment (single lab only).
- Mobile app.
- Direct inverter I-V characterization (E-Load only).
- EL imaging integration (separate system: Surya Drishti).

---

## 6. Open Questions

- [ ] FR-23: which uncertainty model for Procedure 3 (bilinear)? Monte Carlo vs. numerical Jacobian?
- [ ] FR-50: MCP server framework — use Antaryami OS SDK or implement standalone?
- [ ] NFR-04: Does CdTe (First Solar) with SMMF stacking still meet 2.0% target?

---

## 7. Revision History

| Date | Author | Summary |
|------|--------|---------|
| 2026-06-23 | Claude (W27 Monday outline) | Initial stub created; requirements extracted from README + docs/ |
| — | — | Full PRD review pending with Srishti PV Lab team |
