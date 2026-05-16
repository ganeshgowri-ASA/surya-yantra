---
title: "SCPI Safety Layers at Scale: Governing LLM Control of Physical PV Instruments in the Antaryami-OS 116-Issue Hypersprint"
slug: antaryami-os-scpi-safety-governance-hypersprint
description: "How a 116-issue hypersprint in Antaryami-OS shaped a five-domain safety governance framework for LLM-driven SCPI command sequences controlling the ESL-Solar 500 electronic load in the Srishti PV Lab."
keywords:
  - LLM physical instrument control
  - SCPI safety framework
  - AI PV lab automation
  - Antaryami-OS
  - ESL-Solar 500 SCPI
  - autonomous test equipment
  - NABL audit AI systems
  - IEC 62446 test automation
  - electronic load safety
  - AI governance physical instruments
  - Surya Yantra automation
  - Srishti PV Lab AI
  - open source AI OS solar
  - LangGraph PV session planner
date: 2026-05-16
lastmod: 2026-05-16
author: ganeshgowri-ASA
draft: true
og_image: /og/antaryami-os-scpi-safety-governance.png
canonical: https://surya-yantra.srishtipvlab.in/posts/antaryami-os-scpi-safety-governance-hypersprint
twitter_card: summary_large_image
schema_type: TechArticle
schema_about: LLM safety governance for physical instrument control in photovoltaic laboratories
target_venue: npj Computational Materials or Solar Energy
word_count_target: 4000
peer_review_status: seed-only
seo_focus_keyword: LLM SCPI safety framework physical instruments
seed_trigger: antaryami-os pushed 2026-05-15 with 116 open issues (hypersprint active)
---

# SCPI Safety Layers at Scale: Governing LLM Control of Physical PV Instruments

> **Status:** Seed — created 2026-05-16 (Saturday). Linked to antaryami-os hypersprint (116 issues as of 2026-05-15). See issue #28 for Q2 milestone triage.
> **Research narrative:** The 116-issue hypersprint is the empirical basis for a five-domain safety governance framework for LLM-controlled physical test equipment.

## Seed Thesis

An LLM orchestrating an electronic load (SCPI commands over TCP/USB) operates at the intersection of three failure domains that conventional software safety frameworks do not address simultaneously:

1. **Language ambiguity** — "sweep to 300 V slowly" has no unique SCPI expansion
2. **Hardware state coupling** — a wrong relay command while a live IV sweep is running can arc-weld a G9EA-1-B contact
3. **Audit non-determinism** — the same natural-language intent produces different SCPI sequences on re-runs, complicating NABL 121 traceability

The 116-issue Antaryami-OS hypersprint (8 May → 15 May 2026, +74 issues in 7 days) produced the empirical dataset for understanding which failure modes emerge first when an AI OS begins controlling physical instruments at lab scale.

---

## Proposed Article Structure

### §1 — The Five Safety Domains

| Domain | Problem | Antaryami-OS mechanism |
|--------|---------|------------------------|
| **Authorisation** | Which skills may emit which SCPI verbs? | Skill whitelist (JSON, per-role) |
| **Audit** | Replay trace for NABL 121 §4.2 | Structured audit log: `{ts, skill, scpi_cmd, hw_state_before, hw_state_after}` |
| **Uncertainty propagation** | G, T uncertainty → I, V uncertainty → P uncertainty | `{value, u}` tuples through the correction chain |
| **Model accountability** | Which LLM call produced which SCPI command? | Claude claude-opus-4-7 `request_id` logged alongside `session_id` |
| **Override & escalation** | Human operator can interrupt at any time | MUX interlock: `SOUR OFF` → relay open before any override |

### §2 — Hypersprint Issue Taxonomy

<!-- TODO: Pull antaryami-os full issue list (116 as of 2026-05-15) and tag critical-path vs parallel (issue #28 triage) -->
<!-- NOTE: MCP access to antaryami-os is denied in this session — taxonomy must be done from antaryami-os session -->

The 116 issues split into five observed clusters (preliminary, from issue title scan):

- SCPI safety layer (25 %) — command whitelist, MUX interlock, emergency stop binding
- Audit & traceability (20 %) — log schema, NABL export, `request_id` linkage
- Scheduling & session planning (20 %) — `pv-session-planner` skill, slot queue, cancellation
- Surya Yantra integration (15 %) — webhook, HMAC signing, `notifySessionEvent` (issue #29)
- Infrastructure (20 %) — CI, Vercel deployment, environment secrets

### §3 — SCPI Safety in Practice: The `pv-session-planner` Skill

The Q2 milestone is a working `pv-session-planner` webhook integration. The skill must:

1. Resolve a natural-language test request ("Run an IV sweep on all Row 5 modules at STC") into a structured session spec
2. Submit `POST /api/sessions` to Surya Yantra with validated parameters
3. Monitor sweep completion via WebSocket and trigger `POST /api/measurements/:id/correct`
4. Push the result to SolarLabX LIMS as a test record

Each step has an Authorisation check, an Audit log entry, and an Uncertainty propagation update.

### §4 — Worked Safety Incident: MUX Relay Arc Risk

A relay arc occurs when `SOUR OFF` is not sent before the MUX transitions from module A to module B. The Antaryami-OS skill safety layer must enforce:

```
assert hw_state.eload === "OFF" before any mux.connect() call
```

This is implemented as a deterministic pre-condition check (not LLM-generated) — a critical design principle: safety interlocks must not pass through the LLM inference path.

### §5 — NABL Compliance Implications

NABL 121 §4.2 requires that all test decisions be traceable to a specific operator or automated procedure. LLM-generated SCPI sequences challenge this because:
- The same intent → different commands on re-run
- The LLM "operator" has no unique identifier

Resolution: log `claude-opus-4-7` + `request_id` + `session_id` as a composite audit key. The `request_id` is deterministic per API call; the session + skill + request triple is unique.

---

## Connections to Existing Articles

- **Antaryami-OS skill architecture** (`drafts/antaryami-os-skill-architecture-pv-lab.md`) — covers architecture; this article covers governance failure modes
- **vitest-to-nabl-uncertainty-budget** (`drafts/vitest-to-nabl-uncertainty-budget.md`) — covers uncertainty propagation; this article cites it for the `{value, u}` tuple design
- **Surya Yantra 75-module test bed** (planned `posts/`) — the hardware context for all safety claims

---

## Blocker Checklist

- [ ] antaryami-os issue triage (116 issues → critical-path / parallel tags) — requires antaryami-os session access (issue #28)
- [ ] Confirm `pv-session-planner` Q2 milestone health (at-risk or on-track)
- [ ] Audit log JSON schema — confirm against antaryami-os actual implementation once PR lands
- [ ] `apps/web/lib/antaryami.ts` — `notifySessionEvent` must exist (issue #29)
- [ ] One real relay arc near-miss incident log (or synthesised from firmware spec) for §4
- [ ] Peer review: multi-agent systems researcher + NABL PV lab director

---

## References (Seed)

1. Wei J., et al. (2022). *Chain-of-Thought Prompting Elicits Reasoning in Large Language Models*. NeurIPS 2022. arXiv:2201.11903.
2. Yao S., et al. (2023). *ReAct: Synergizing Reasoning and Acting in Language Models*. ICLR 2023. arXiv:2210.03629.
3. Valmeekam K., et al. (2023). *On the Planning Abilities of Large Language Models*. NeurIPS 2023 Workshop. arXiv:2305.15771.
4. NABL 121:2023, *Guidelines for Estimation and Expression of Uncertainty in Measurement*. National Accreditation Board for Testing and Calibration Laboratories, India.
5. ISO/IEC 17025:2017, *General requirements for the competence of testing and calibration laboratories*, §6.2.3. ISO, Geneva.
6. Antaryami-OS. *Enterprise-Grade Organizational AI Operating System*. GitHub: ganeshgowri-ASA/antaryami-os, 2026.
7. Surya Yantra API Reference. `docs/API.md`, `POST /api/sessions`, `POST /api/mux/:bedId/selftest`. GitHub: ganeshgowri-ASA/surya-yantra, 2026.
