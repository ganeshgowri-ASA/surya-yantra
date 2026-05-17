# Surya Yantra — Product Requirements Document

> **Status:** Outline — created 2026-05-17. Full elaboration tracked in issue #37.
> **Maintained by:** Srishti PV Lab platform team.

---

## 1. Overview

Surya Yantra is an open-source PV module IV curve tracer and test management system built for the Srishti PV Lab, Jamnagar. It automates the measurement, IEC-compliant correction, and reporting workflow for a 75-module, 4-wire Kelvin test bed driven by an ESL-Solar 500 electronic load.

---

## 2. User Personas

| Persona | Description | Primary need |
|---------|-------------|--------------|
| **Lab Technician** | Operates the test bed day-to-day; runs sweeps and exports reports | Simple UI to select modules, trigger sweeps, download corrected PDFs |
| **Lead Engineer** | Defines test protocols, interprets correction results, manages NABL traceability | Full correction parameter control, uncertainty audit trail, AI diagnostics |
| **Lab Manager** | Tracks throughput, manages equipment calibration, controls access | Dashboard KPIs, calibration due dates, role-based access |
| **Research Engineer** | Prototypes new correction algorithms; publishes results | API access, raw curve export, GanitaSutra integration |
| **Antaryami-OS Skill** | Automated agent that plans and executes test sessions | Reliable `POST /api/sessions` endpoint with HMAC auth |

---

## 3. Core Functional Requirements

### 3.1 IV Measurement

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Sweep IV curve on any of 75 modules via MUX selection in ≤ 2 s setup + 5 s sweep | P0 |
| FR-02 | Support SCPI modes: IV_SWEEP, CC, CV, CR, MPP_SCAN, MPP_TRACK | P0 |
| FR-03 | Live WebSocket streaming of IV points during sweep | P0 |
| FR-04 | Measure V (0–300 V), I (0–27 A), W simultaneously | P0 |

### 3.2 IEC Correction Engine

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-10 | IEC 60891:2021 Procedures 1, 2, 3, 4 | P0 |
| FR-11 | IEC 60904-7:2019 Spectral Mismatch Factor | P0 |
| FR-12 | IEC 61853-2:2016 IAM Martin-Ruiz model | P0 |
| FR-13 | Chain: IAM → SMMF → IEC 60891 in order | P0 |
| FR-14 | Warning header when correction is outside recommended range | P1 |
| FR-15 | `autoExtract: true` flag to use GanitaSutra-derived parameters | P1 |

### 3.3 Module Registry

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-20 | CRUD for 75-module catalogue with STC parameters | P0 |
| FR-21 | Filter by technology (HJT, TOPCon, IBC, HPBC, Perovskite, CdTe) | P0 |
| FR-22 | Track slot position in 15×5 MUX matrix | P0 |

### 3.4 Reporting

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-30 | PDF report with corrected IV, STC parameters, uncertainty budget | P0 |
| FR-31 | CSV and XLSX export of raw + corrected data | P0 |
| FR-32 | NABL 121-compliant expanded uncertainty U at k=2 | P1 |

### 3.5 AI Diagnostics

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-40 | Streaming chat with Claude for fault analysis (`POST /api/ai/chat`) | P1 |
| FR-41 | Context: session IV data, module STC params, correction results | P1 |

### 3.6 Hardware Integration (Relay Service)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-50 | `apps/desktop/relay` Express service: `/scpi`, `/mux`, `/health` | P0 |
| FR-51 | HMAC-SHA256 authentication on all relay endpoints | P0 |
| FR-52 | SCPI command whitelist enforced before serial port access | P0 |
| FR-53 | MUX interlock: reject `mux.connect` when `eload !== "OFF"` | P0 |
| FR-54 | Cloudflare Tunnel deployment on lab NUC | P0 |

---

## 4. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | IV sweep latency (setup + sweep + correction) | ≤ 10 s per module |
| NFR-02 | Concurrent MUX slots active on ELOAD destination | 1 (enforced by server) |
| NFR-03 | Voltage range | 0–300 V DC |
| NFR-04 | Current range | 0–27 A DC |
| NFR-05 | Module count | 75 (15 rows × 5 columns) |
| NFR-06 | Correction accuracy (P1 at ΔG ≤ 200 W/m², ΔT ≤ 10 K) | ≤ 0.5 % MPP error |
| NFR-07 | Uptime (web app, Vercel) | 99.5 % |
| NFR-08 | Data retention | 5 years (NABL requirement) |

---

## 5. Out of Scope (v1)

- Multi-lab / multi-site deployment
- Grid-tied inverter testing (IEC 61683)
- Module-level power electronics (MLPE) optimiser testing
- EL / PL imaging integration
- Automated mechanical loading tests (IEC 61215 §10.16, §10.17)

---

## 6. Standards Compliance

See `docs/IEC-CORRECTIONS.md` for algorithmic details.

| Standard | Scope |
|----------|-------|
| IEC 60891:2021 | Temperature & irradiance corrections |
| IEC 60904-1:2020 | I-V measurement |
| IEC 60904-3:2019 | AM1.5G reference spectrum |
| IEC 60904-7:2019 | Spectral mismatch |
| IEC 61215:2021 | Module design qualification |
| IEC 61853-1/2/3 | Energy rating |
| NABL 121:2023 | Measurement uncertainty |
| ISO/IEC 17025:2017 | General laboratory competence |

---

## 7. Open Issues

See GitHub issues for current blockers. Key PRD-level gaps:

- Issue #43 — `packages/` monorepo structure vs. current `apps/web/lib/` layout
- Issue #44 — `apps/desktop/relay` not scaffolded (FR-50–54 not implementable without it)
- Issue #45 — STM32H743 MUX firmware missing (required for FR-01 relay addressing)
- Issue #29 — `apps/web/lib/antaryami.ts` missing (required for Antaryami-OS integration)

---

*First outline: 2026-05-17 · Surya Yantra platform team. Full elaboration in progress.*
