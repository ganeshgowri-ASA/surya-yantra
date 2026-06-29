# Surya Yantra — Roadmap

> Sunday 2026-06-29 snapshot. Updated each Sunday by the weekly routine.

---

## Ideation → Implementation Diagram

```
IDEATION                         DESIGN                       IMPLEMENTATION
──────────────────────────────────────────────────────────────────────────────

[Srishti PV Lab need]            [Architecture]               [Code shipped]
  75-module IV testing     ──►   Next.js + PostgreSQL    ──►   apps/web ✅
  field-deployable test    ──►   Electron shell           ──►   apps/desktop ✅
  IEC-compliant results    ──►   lib/iec60891 + smmf+iam  ──►   Vitest suite ✅
  AI fault diagnosis       ──►   /api/ai/chat (Claude)    ──►   streaming SSE ✅
  hardware relay matrix    ──►   STM32H7 + MCP23017       ──►   firmware 🔲
  hardware schematics      ──►   KiCad / ShilpaSutra      ──►   schematics/ 🔲
  NABL accreditation       ──►   ISO 17025 traceability   ──►   SolarLabX link 🔲
  publication pipeline     ──►   drafts/ → posts/         ──►   article seeds 🔄

Legend: ✅ shipped  🔄 in progress  🔲 not started
```

---

## Milestone Map

### M0 — Foundation (current)

| Item | Status |
|------|--------|
| Next.js web app scaffold | ✅ merged |
| Electron desktop shell | ✅ merged |
| PostgreSQL schema (20 models) | ✅ merged |
| IEC 60891 P1–P4 engine + Vitest | ✅ merged |
| SMMF (IEC 60904-7) + IAM (IEC 61853-2) | ✅ merged |
| WebSocket IV streaming (Socket.IO) | ✅ merged |
| shadcn/ui component library | ✅ merged |
| docs: API, DEPLOYMENT, HARDWARE-SETUP, IEC-CORRECTIONS | ✅ merged |
| hardware/BOM.md (75-module, India pricing) | ✅ merged |
| hardware/WIRING.md | 🔲 open (#1) |
| hardware/schematics/ | 🔲 open (#2) |
| MUX controller firmware | 🔲 open (#3) |
| apps/web/.env.example | 🔲 open |
| Vercel production deployment | 🔲 see §Vercel note |

### M1 — Lab MVP (Q3 2026)

- [ ] MUX firmware repository added / linked
- [ ] Hardware schematics (KiCad SVG exports) committed
- [ ] Full IV sweep → correction → STC report path exercised on real hardware
- [ ] PostgreSQL seeded with all 75 Srishti modules
- [ ] Relay self-test endpoint (`POST /api/mux/:bedId/selftest`) added to API.md
- [ ] `POST /api/reports` PDF export verified end-to-end
- [ ] Vercel production deployment promoted (first stable `main` merge post-M0)

### M2 — NABL-Ready (Q4 2026)

- [ ] ISO 17025 traceability chain: measurement → correction → report → audit log
- [ ] GUM uncertainty budget per measurement (link to SolarLabX `lib/uncertainty.ts`)
- [ ] Calibration certificate management (instrument due-dates)
- [ ] SolarLabX LIMS integration: IV data flows into sample records via API
- [ ] Article submission: "Open-Source IV Tracer for ISO 17025 PV Labs" (MDPI Sensors)

### M3 — Ecosystem (H1 2027)

- [ ] antaryami-os AI OS integration: Surya Yantra as a tool-calling agent
- [ ] GanitaSutra toolbox plugin: IEC 60891 as a SimuFlow block
- [ ] ShilpaSutra CAD model: 3D export of the 19" rack assembly
- [ ] Multi-lab deployment: second Srishti site, shared cloud schema
- [ ] Article submission: "Sovereign PV Testing Stack" (Solar Energy, Elsevier)

---

## Ecosystem Integration Points

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ganeshgowri-ASA ecosystem                       │
│                                                                     │
│  antaryami-os ──────────────────────────────────────────────────►  │
│  (Enterprise AI OS)     AI diagnostics API        /api/ai/chat      │
│                                                                     │
│  GanitaSutra-v0 ────────────────────────────────────────────────►  │
│  (Math toolboxes)   IEC 60891 as SimuFlow block   lib/iec60891.ts   │
│                                                                     │
│  ShilpaSutra ───────────────────────────────────────────────────►  │
│  (AI CAD/CFD)       Rack + MUX 3D models          hardware/         │
│                                                                     │
│  SolarLabX ─────────────────────────────────────────────────────►  │
│  (LIMS + QMS)       IV data → sample records      /api/measurements │
│                                                                     │
│                    ┌─── SURYA YANTRA ───┐                           │
│                    │  IV tracer + IEC  │                            │
│                    │  correction engine │                            │
│                    └───────────────────┘                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Research Publication Pipeline

| Draft | Target venue | Status | Blocker |
|-------|-------------|--------|---------|
| WebSocket-SCPI IV tracing architecture | MDPI Sensors | seed created | lab benchmark data |
| IEC 60891 open-source implementation | Measurement (Elsevier) | seed created | P3/P4 validation curves |
| Sovereign PV lab ecosystem | Solar Energy (Elsevier) | seed created | multi-repo integration |

See `posts/` for current seeds.

---

## Known Technical Debt

| Item | Severity | Tracking |
|------|----------|---------|
| `hardware/WIRING.md` missing (referenced in README) | Medium | issue #1 |
| `hardware/schematics/` empty | Medium | issue #2 |
| MUX firmware not in repo | High | issue #3 |
| `POST /api/mux/:bedId/selftest` not in API.md | Low | issue #4 |
| No Vercel production deployment | High | see §Vercel note |
| API.md model ID was stale (`claude-opus-4-7`) | Low | fixed 2026-06-29 |

---

## Vercel Deployment Note

As of 2026-06-29 the surya-yantra Vercel project (`prj_QiTDz1I0e4kde3Fy2j0pZ1LJqTrc`) has no `target: production` deployment — only branch preview deploys exist. This mirrors the solar-lab-x pattern where Claude PRs deploy to feature branches that are never promoted.

**To fix:** merge a stable branch into `main`; Vercel auto-deploys `main` as production. Recommend making M1 MVP the first production promotion.

---

*Generated by Sunday routine 2026-06-29.*
