---
title: "Surya Yantra — H2 2026 Content & Engineering Roadmap"
date: 2026-06-22
week: W26
day_angle: roadmap
status: draft
tags: [roadmap, planning, pv-testing, architecture]
---

# Surya Yantra — H2 2026 Content & Engineering Roadmap

*Sunday roadmap pass — week W26, 2026-06-22.*

---

## 1. Engineering status snapshot

| Area | Status | Blocker / next step |
|------|--------|---------------------|
| IV sweep engine (SCPI + ESL-Solar 500) | ✅ Core done | Lab bench validation pending |
| 300-relay MUX matrix | 🔶 Code done, firmware stub missing | `hardware/firmware/mux-controller/` not in repo (#hardware-fw) |
| IEC 60891 Procedures 1–4 | ✅ Implemented + tested | — |
| SMMF (IEC 60904-7) | ✅ Implemented + tested | — |
| IAM Martin-Ruiz (IEC 61853-2) | ✅ Implemented + tested | — |
| AI diagnostics (`/api/ai/chat`) | ✅ Streaming | Model pinned to claude-opus-4-8 |
| Desktop Electron relay | ❌ Not started | `apps/desktop/relay` missing (#desktop-relay) |
| Report export (PDF/CSV/XLSX) | 🔶 API spec exists | Implementation not yet merged |
| `/api/health` endpoint | ❌ Referenced in docs, not implemented | (#api-health) |
| Vercel production deployment | ✅ Preview green | No custom domain yet |

---

## 2. Q3 article pipeline (Jul–Sep 2026)

### July — IEC algorithm deep-dives
| Week | Article | Target venue | Status |
|------|---------|-------------|--------|
| W27 | "IEC 60891 Procedure 3 Bilinear Interpolation: A Worked Implementation" | MDPI Energies | Outline ready |
| W28 | "Spectral Mismatch Factor Computation at Scale with IEC 60904-7" | Solar Energy | Seed — start |
| W29 | "Martin-Ruiz IAM in the POA Decomposition Pipeline" | Progress in PV | Seed — start |
| W30 | "GUM Uncertainty Budget for a 75-Module IV Tracer" | Measurement | Depends on lab data |

### August — systems & integration
| Week | Article | Target venue | Status |
|------|---------|-------------|--------|
| W31 | "SimuFlow MPPT Diagrams as IV Sweep Templates: GanitaSutra → Surya Yantra" | IEEE PVSC | **New seed (2026-06-21 activity)** |
| W32 | "The PV Lab Intelligence Stack: Surya Yantra + SolarLabX + Antaryami OS" | Nature npj CI | **New seed (2026-06-21 activity)** |
| W33 | "WebSocket SCPI Bridge for Real-Time IV Curve Streaming" | MDPI Sensors | Draft in progress |
| W34 | "ShilpaSutra-Generated MUX Matrix Schematics: CAD as Code" | IET Power Electron | Blocked on schematic repo |

### September — NABL / ISO 17025 track
| Week | Article | Target venue | Status |
|------|---------|-------------|--------|
| W35 | "From PostgreSQL Schema to NABL Accreditation: Open-Source LIMS Architecture" | Measurement | Depends on DB seed |
| W36 | "Zero-Trust API Design for ISO 17025–Accredited PV Test Systems" | Comput. Secur. | Sec design needed |
| W37 | "Electron Desktop Relay Architecture for Air-Gapped Lab Hardware" | IEEE Trans. Instrum. | Blocked on apps/desktop/relay |
| W38 | Buffer / revision week | — | — |

---

## 3. Q4 article pipeline (Oct–Dec 2026)

| Theme | Article seeds | Priority |
|-------|--------------|---------|
| Hardware | MUX relay self-test protocol; 4-wire Kelvin harness calibration | High |
| AI | Multi-model routing (Opus vs. Sonnet) for IV curve diagnosis | High |
| Standards | IEC 62446-1 commissioning test automation | Medium |
| Ecosystem | pv-pranali: multi-agent LangGraph orchestration across Srishti apps | Medium |
| Open source | Releasing Surya Yantra as public repo — contribution guide | Low |

---

## 4. Infrastructure gaps blocking publication

These must be resolved before articles in the dependent category can be written with real data:

1. **`hardware/firmware/mux-controller/`** — relay self-test data and wiring commissioning are article-critical. File a firmware PR or add a stub with the STM32H7 API contract.
2. **`apps/desktop/relay`** — the Cloudflare Tunnel relay is needed to demonstrate live hardware connectivity in the WebSocket article.
3. **`/api/health` endpoint** — referenced in the smoke test section of DEPLOYMENT.md. Implement before the deployment guide can be publication-ready.
4. **`hardware/schematics/`** — ShilpaSutra CAD article requires schematic source files.
5. **PR backlog** — 30+ open draft PRs are unpublished content work. Schedule a triage sprint to merge, close, or squash.

---

## 5. Weekly cadence reminder

| Day | Angle |
|-----|-------|
| Mon | Outline (new article stubs, heading scaffolds) |
| Tue | Bulk-removal (stale drafts, dead references) |
| Wed | Enhancement (add references, fill body sections) |
| Thu | Peer-review checklist |
| Fri | Publication-ready polish + ideation→implementation diagram |
| Sat | SEO/metadata (front-matter, JSON-LD, sitemap) |
| Sun | Roadmap (this document) |

---

*Next roadmap review: 2026-06-29 (W27 Sunday).*
