# DRAFT — Article Seed 002

**Working title:** India's Integrated Solar Intelligence Stack: Antaryami-OS, SolarLabX, and Surya Yantra

**Status:** Seed / outline only  
**Triggered by:** antaryami-os pushed 2026-05-14 · SolarLabX pushed 2026-05-14 (both yesterday)  
**Weekly angle (Thu):** Peer-review checklist → this seed needs fleshing before promotion  
**Target publication:** `posts/` after Friday polish pass

---

## Research Narrative

Three projects in the same ecosystem advanced on the same day:

- **antaryami-os** — Enterprise-Grade Organizational AI Operating System (private,
  TypeScript). Routes business intent → multi-agent task execution. Vercel-hosted.
- **SolarLabX** — Unified Solar PV Lab Operations Suite: LIMS + QMS + Audit +
  Test Protocols + Uncertainty + AI Vision + SOP Gen + Reports. Vercel-hosted.
- **Surya Yantra** — Precision IV characterization instrument: ESL-Solar 500
  e-load, 75-module test bed, IEC correction engine, real-time streaming.

Together they form a **vertical integration stack** for solar PV quality assurance
in India: the AI OS orchestrates work orders → the LIMS manages sample custody
and test protocols → the IV tracer produces IEC-compliant measurements → results
flow back up through SolarLabX's QMS → Antaryami-OS acts on quality alerts.

The thesis: **end-to-end AI orchestration of a solar PV test lab is now
achievable with open-source tooling and commodity cloud infrastructure.**

---

## Proposed Outline

### 1. Introduction
- The problem: India's solar PV manufacturing capacity is scaling to 50+ GW/yr
  by 2030; NABL-accredited test labs are the bottleneck
- Traditional lab operations: siloed LIMS, paper SOP binders, manual IV testing
- Proposed solution: AI-orchestrated stack on Vercel + Postgres + Claude API

### 2. Stack Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   antaryami-os                           │
│  Enterprise AI OS · multi-agent orchestration           │
│  Routes test requests · monitors quality alerts         │
│  Issues work orders to SolarLabX                        │
└──────────────────────┬──────────────────────────────────┘
                       │ REST / event stream
┌──────────────────────▼──────────────────────────────────┐
│                    SolarLabX                             │
│  LIMS + QMS · sample custody · SOP generation           │
│  Uncertainty budgets · AI Vision (defect detection)     │
│  Audit trail · IEC 61215 compliance reports             │
└──────────────────────┬──────────────────────────────────┘
                       │ POST /api/sessions (test job)
┌──────────────────────▼──────────────────────────────────┐
│                  Surya Yantra                            │
│  IV curve tracer · 75-module test bed                   │
│  IEC 60891 corrections · real-time Socket.IO stream     │
│  AI diagnostics (Claude) · PDF/CSV/XLSX reports         │
└─────────────────────────────────────────────────────────┘
```

### 3. Antaryami-OS: The Orchestration Layer
- Multi-agent task routing: QA engineer natural-language request →
  structured test protocol → SolarLabX work order
- Proactive alerting: monitors Surya Yantra measurement streams for
  out-of-spec Pmp events → triggers corrective action workflows
- Role-based access: operator / lab manager / auditor permission model
  mirrors Surya Yantra's own HMAC-authenticated API roles

### 4. SolarLabX: The LIMS/QMS Layer
- Sample lifecycle: PO receipt → incoming inspection → test assignment
  → Surya Yantra result import → certificate issuance
- Uncertainty budgets: automatically propagates IEC 60891 correction
  uncertainty (ΔRs, Δα, ΔG calibration) into measurement uncertainty
  per ISO/IEC 17025:2017
- AI Vision: defect detection on module EL and UV images before IV testing
  — avoids wasting e-load time on physically damaged units

### 5. Surya Yantra: The Measurement Layer
- ESL-Solar 500 SCPI sweep → IEC correction pipeline → STC result
- Real-time streaming (Socket.IO) allows SolarLabX to observe test
  progress without polling
- AI diagnostics: Claude LLM chat over the measurement session identifies
  Isc degradation, shunt formation, bypass-diode failure signatures

### 6. Data Flow: A Complete Test Cycle
1. Antaryami-OS receives "Qualify 450 Wp HJT batch, IEC 61215" request
2. Creates SolarLabX test order: 10 modules, 3 replicates each
3. SolarLabX generates SOP, assigns LIMS IDs, schedules Surya Yantra slot
4. Surya Yantra runs 30 IV sweeps, applies IEC 60891 P2 + SMMF + IAM
5. Results stream to SolarLabX: Pmp, FF, Isc, Voc at STC
6. SolarLabX uncertainty engine computes expanded uncertainty U (k=2)
7. QMS checks against IEC 61215 Pmpp tolerance (±5 %)
8. Antaryami-OS receives pass/fail alert, notifies procurement team

### 7. India-Specific Considerations
- NABL accreditation (ISO/IEC 17025): requires documented uncertainty
  budget — SolarLabX's uncertainty module provides the chain
- BIS CRS certification for domestic market: IEC 61215 + IEC 61730
  — both testable with Surya Yantra's correction suite
- Cost: entire stack runs on ~₹ 1 lakh/yr cloud spend (Vercel + DB + Claude)
  vs. ₹ 20–50 lakh/yr for traditional certified lab software

### 8. Current Gaps and Roadmap
- No live API bridge between SolarLabX and Surya Yantra yet — manual JSON
- Antaryami-OS ↔ SolarLabX integration is in development (antaryami-os issue backlog)
- GanitaSutra-v0's simulation toolboxes could feed predicted STC parameters
  to SolarLabX before physical testing (pre-test uncertainty reduction)

### 9. Discussion
- Open-source advantage: all three systems use MIT licences, enabling Indian
  test labs to self-host without vendor lock-in
- Claude as the connective tissue: Antaryami-OS, Surya Yantra AI diagnostics,
  SolarLabX SOP generation all use Anthropic Claude — consistent model version
  management is a hidden operational risk
- Regulatory landscape: MNRE's PM-KUSUM and PLI schemes drive demand for
  accredited test certificates — the stack is timed correctly

### 10. Conclusion
- The three-layer stack (AI OS → LIMS/QMS → IV tracer) demonstrates that a
  fully automated, IEC-compliant PV test lab can be built on open-source cloud
  tooling for under ₹ 35 lakh capital cost
- Next milestone: live REST bridge between SolarLabX and Surya Yantra

### 11. References (to populate before publication)
- [ ] antaryami-os README / architecture doc (ganeshgowri-ASA/antaryami-os)
- [ ] SolarLabX README (ganeshgowri-ASA/SolarLabX)
- [ ] ISO/IEC 17025:2017 — General requirements for competence of testing laboratories
- [ ] IEC 61215:2021 — Terrestrial PV modules — Design qualification
- [ ] IEC 61730-1/2:2023 — PV module safety qualification
- [ ] NABL accreditation requirements for photovoltaic testing
- [ ] MNRE Solar Park scheme documentation (for demand context)

---

## Figures Needed

| # | Description | Source |
|---|---|---|
| Fig 1 | Three-layer stack architecture diagram | Create (ASCII → SVG) |
| Fig 2 | Data flow sequence diagram: one complete test cycle | FigJam / Mermaid |
| Fig 3 | Cost comparison: open-source stack vs. traditional lab software | Own estimate |
| Fig 4 | Screenshot: SolarLabX test order → Surya Yantra session → result import | Lab demo |

All figures require alt text before promotion to `posts/`.

---

## Peer-Review Gate (Thursday checklist applied)

- [ ] Heading hierarchy: H1 → H2 → H3 ✅
- [ ] Citations: 7 refs listed, none with DOI yet — **needs work before publication**
- [ ] Cross-references: SolarLabX and antaryami-os links TBD (GitHub URLs once public)
- [ ] Figures: all placeholders — **blockers for Friday polish**
- [ ] Terminology: "irradiance", "STC", "LIMS", "QMS" — all need first-use definitions ⚠️
- [ ] IEC edition years: all present ✅
- [ ] Cost figures: INR estimates — add GST note + validity date ⚠️

---

*Seed created 2026-05-15 · promote after Friday polish pass*
