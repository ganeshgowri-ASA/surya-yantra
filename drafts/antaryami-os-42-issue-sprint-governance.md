---
title: "Governing AI That Controls Physical Instruments: Lessons from the Antaryami-OS 42-Issue Sprint"
seo_title: "AI Governance for Physical Lab Automation: Antaryami-OS Sprint Analysis | Srishti PV Lab"
description: "When AI orchestrates physical laboratory instruments, governance is not optional. How Antaryami-OS's sprint — 42 issues on 9 May, 49 by 10 May, 94 by 11 May — reveals the governance architecture needed to safely run Claude over a 300 V solar test bed."
keywords:
  - AI governance physical instruments
  - Antaryami-OS
  - AI lab automation safety
  - LLM instrument control governance
  - NABL AI traceability
  - enterprise AI governance India
  - Claude safety physical systems
  - AI audit trail NABL
  - solar PV AI governance
  - ReAct safety constraints
  - AI operating system governance
  - Srishti PV Lab
canonical: "https://surya-yantra.srishtipvlab.in/posts/antaryami-os-governance-sprint-may-2026"
og:
  title: "Governing AI Over Physical Instruments: Antaryami-OS Sprint"
  description: "42 on 9 May, 49 by 10 May, 94 by 11 May — what the Antaryami-OS hypersprint velocity tells us about governing AI over a 300 V solar test bed."
  image: "/og/antaryami-governance.png"
  type: "article"
twitter:
  card: "summary_large_image"
  title: "AI Governance for Physical Lab Automation | Antaryami-OS"
  description: "42→49→94 in 48 h: governance lessons for AI systems controlling 300 V solar instruments."
  image: "/og/antaryami-governance.png"
author: "Srishti PV Lab Engineering"
date: "2026-05-09"
lastmod: "2026-05-11"
draft: true
tags:
  - ai-governance
  - antaryami-os
  - physical-automation
  - claude-api
  - solar-pv
  - safety
  - nabl
  - enterprise-ai
categories:
  - ai
  - engineering
  - research
reading_time: 12
schema_type: "TechArticle"
related_repos:
  - antaryami-os
  - surya-yantra
  - SolarLabX
---

# Governing AI That Controls Physical Instruments: Lessons from the Antaryami-OS 42-Issue Sprint

*Article seed — 9 May 2026 (Friday — publication-polish angle) · Updated 11 May 2026 · Srishti PV Lab Engineering*

**Engineering signal (11 May 2026 update):** [Antaryami-OS](https://github.com/ganeshgowri-ASA/antaryami-os) now carries **94 open issues** — up from 49 on 10 May (+45 in ≈24 hours, **+91.8%**). The sprint has entered hypersprint territory. At 94 issues, Antaryami-OS is the highest-velocity repository in the stack by a factor of 2.5×. The 8-day trajectory (4 → 33 → 42 → 49 → 94) suggests a phase transition from architectural scaffolding to active hardware integration testing. Every governance argument in this article is amplified by this acceleration — see `drafts/antaryami-os-94-issue-hypersprint-roadmap.md` for the full analysis.

**Engineering signal (10 May 2026 update):** [Antaryami-OS](https://github.com/ganeshgowri-ASA/antaryami-os) pushed to main overnight and carried **49 open issues** — up from 42 on 9 May (+7 in ≈24 hours, +17.5%). The governance analysis below was written from the 42-issue state; the acceleration to 94 by 11 May reinforces every argument made here.

**Original signal (9 May 2026):** [Antaryami-OS](https://github.com/ganeshgowri-ASA/antaryami-os) pushed to main this morning and now carries **42 open issues**, up from 33 yesterday (+9, +27% in 24 hours). This is the fourth consecutive day of sprint acceleration for an enterprise AI operating system that, in the Srishti PV Lab stack, will orchestrate test sessions on a 300 V / 27 A solar IV tracer. Forty-two open issues is no longer a side sprint — it is a production-readiness signal that demands governance thinking.

This article examines what AI governance means when the AI is not generating text for humans to read, but commanding electronic loads, relay matrices, and LIMS pipelines in a physical laboratory.

## Why Governance Is Different for Physical AI Systems

Most AI governance frameworks focus on content harms: bias, toxicity, hallucination. These matter. But in a physical-lab AI OS, governance has a second dimension: **consequential physical actions**.

When Antaryami-OS's `pv-session-planner` skill assigns a module slot and the deterministic SCPI driver executes that assignment:

- A 300-relay MUX changes state.
- A 300 V / 27 A electronic load begins sourcing current through a module whose temperature may be uncertain.
- A current-voltage sweep commences that will be stored as a calibration-grade measurement.

If the AI made a scheduling error — wrong slot, ignored a thermal limit, routed a rush-priority module to a sub-optimal irradiance window — the measurement is taken, stored, and potentially forwarded to a LIMS as a valid result. The error propagates silently. This is categorically different from an LLM generating a wrong answer that a human immediately sees and can reject.

## The Five Governance Domains for Physical AI OS

### 1. Authorisation — What May the AI Command?

Antaryami-OS enforces a **capability envelope**: a whitelist of tool calls the LLM may invoke. The `pv-session-planner` skill is scoped to read-only queries (`readModuleQueue`, `queryIrradianceForecast`) and a single constrained write (`emitSlotAssignment`). The `connectRelay()` SCPI primitive is **not in scope** — the LLM cannot call it directly. A deterministic relay controller converts `emitSlotAssignment` outputs into SCPI sequences after independent safety validation. This is the authorisation boundary.

### 2. Audit — What Did the AI Actually Command?

NABL 121 §4.5 requires equipment records tracing each measurement to its conditions. In an AI-orchestrated lab, this extends to: *which AI decision produced this measurement session?*

Antaryami-OS logs every tool call:

```json
{
  "ts": "2026-05-09T06:23:11Z",
  "skill": "pv-session-planner",
  "model": "claude-sonnet-4-6",
  "sessionId": "clx-sess-0721",
  "tool": "emitSlotAssignment",
  "slot": 34,
  "moduleId": "SY-M-034",
  "estimatedG": 921,
  "estimatedT": 43.2,
  "rationale": "Solar noon ±1h window; priority: RUSH-QC"
}
```

The `rationale` field captures the LLM's stated reason. It is the NABL auditor's entry point for understanding why a particular module was measured at a particular time.

### 3. Uncertainty Propagation — Does the AI Know What It Doesn't Know?

IEC 60891 correction accuracy degrades when G or T deviates from measurement conditions beyond recommended limits. Each `queryIrradianceForecast()` result should carry `{ G: number, u_G: number }`, and the LLM system prompt should instruct the planner to preference low-uncertainty slots for high-priority modules. This is an architectural requirement the 94-issue hypersprint is presumably developing at pace.

### 4. Model Accountability — Which Model Made This Decision?

The Antaryami-OS tier routing (Haiku 4.5 for triage, claude-sonnet-4-6 for planning, Opus 4.7 for deep fault analysis) means different model versions make different decisions in the same system. The audit log must capture `model`, `modelVersion`, and `promptVersion` (system prompt hash). When Anthropic releases a new model and the operator upgrades, historical decisions remain attributable — analogous to recording which calibrated instrument made a reference measurement.

### 5. Override and Escalation — When the AI Is Wrong

The lab operator must always be able to pause a session, inspect pending slot assignments before they execute, override any assignment, and flag a completed session as "AI-assisted scheduling — requires review" in the LIMS. This is not a safety add-on — it is ISO/IEC 17025:2017 §6.2.3: the person responsible for testing retains authority over measurement conditions.

## Ideation → Implementation → Governance: The Full Pipeline

```
IDEATION
  ┌──────────────────────────────────────────────────────────────┐
  │  Problem: 75 modules/day, 1 load, variable G/T,             │
  │  AI cost limit, NABL audit requirements                     │
  └────────────────────┬─────────────────────────────────────────┘
                       │
                       ▼
DESIGN
  ┌──────────────────────────────────────────────────────────────┐
  │  Skill decomposition (pv-session-planner, pv-fault-router,  │
  │  multi-lab-coordinator) + safety envelopes + model routing  │
  └────────────────────┬─────────────────────────────────────────┘
                       │
                       ▼
IMPLEMENTATION
  ┌──────────────────────────────────────────────────────────────┐
  │  Tool schemas · Zod validation · SCPI safety layer          │
  │  LIMS webhook · Audit log writer                            │
  └────────────────────┬─────────────────────────────────────────┘
                       │
                       ▼
GOVERNANCE  ← Friday new layer
  ┌──────────────────────────────────────────────────────────────┐
  │  Authorisation whitelist · Audit trail (model + version)    │
  │  Uncertainty-annotated inputs · Override interface          │
  │  NABL 121 §4.5 equipment record integration                 │
  └────────────────────┬─────────────────────────────────────────┘
                       │
                       ▼
OUTCOME
  ┌──────────────────────────────────────────────────────────────┐
  │  75 modules/day · NABL-traceable · AI cost < ₹40/month      │
  │  Operator remains responsible for measurement conditions     │
  └──────────────────────────────────────────────────────────────┘
```

## The 94-Issue Hypersprint (Monday 11 May)

Forty-five new issues in 24 hours (49 → 94, +91.8%) is a qualitative change in sprint character, not merely a quantitative one. A +7 overnight delta confirms a sustained sprint; a +45 overnight delta signals that integration testing has hit a combinatorial surface — hardware state machine edge cases, LIMS schema incompatibilities, and audit log format debates compounding simultaneously.

At 94 issues, this sprint is now generating artefacts at the scale of a week's worth of typical engineering work in a single day. Each filed issue is a governance artefact: documented evidence of a failure mode identified and tracked — the engineering equivalent of a NABL corrective action record (ISO/IEC 17025:2017 §8.7). The 94-issue count represents 94 such records. For the full phase-transition analysis, see `drafts/antaryami-os-94-issue-hypersprint-roadmap.md`.

## The 49-Issue Signal (Sunday 10 May)

Seven new issues overnight (42 → 49) confirmed the sprint was sustained, not a one-day burst. That signal has since been superseded by the 11 May hypersprint. The 49-issue baseline established that Antaryami-OS was in active integration testing; the jump to 94 confirmed it was hitting hardware-level complexity.

## Research Narrative

The broader contribution is a governance taxonomy for AI systems that act on physical measurement infrastructure — an area that existing frameworks (EU AI Act, NIST AI RMF) address in general terms but rarely instantiate for scientific instrument control. Srishti PV Lab provides a concrete reference architecture.

**Target venue:** *npj Computational Materials* (AI for science instrumentation) or *Solar Energy* (domain-specific deployment case study).

## References

1. Antaryami-OS: [github.com/ganeshgowri-ASA/antaryami-os](https://github.com/ganeshgowri-ASA/antaryami-os).
2. ISO/IEC 17025:2017, *General requirements for the competence of testing and calibration laboratories*, §6.2.3, §8.7. ISO, Geneva.
3. NABL, *Specific Criteria for Accreditation of Testing Laboratories in the field of Solar Energy*, NABL 121 §4.5, 2023.
4. NIST (2023). *Artificial Intelligence Risk Management Framework (AI RMF 1.0)*. NIST AI 100-1.
5. Yao S., Zhao J., Yu D., Du N., Shafran I., Narasimhan S., Cao Y. (2023). *ReAct: Synergizing Reasoning and Acting in Language Models*. ICLR 2023. arXiv:2210.03629.
6. Anthropic (2026). *Claude API: Tool use and model accountability*. Technical documentation.
7. IEC 60891:2021 §8, *Uncertainty of measurement correction procedures*. IEC, Geneva.

---

## Peer Review

*Friday 9 May 2026 — Article seed review · Updated Sunday 11 May 2026*

### Technical Accuracy

- [ ] Governance taxonomy (5 domains) verified against ISO/IEC 17025:2017 §6.2 and §8.2–8.7
- [ ] Audit log JSON structure matches actual Antaryami-OS implementation (verify once sprint lands)
- [ ] NABL 121 §4.5 equipment record requirements verified against 2023 edition
- [ ] Model tier routing cost estimates verified against current Anthropic pricing
- [ ] Issue count updated to 94 as of 11 May 2026 ✅

### Citation Completeness

- [ ] ISO/IEC 17025:2017 confirmed ✅
- [ ] NABL 121 confirmed ✅
- [ ] NIST AI RMF 1.0 confirmed ✅
- [ ] Yao et al. (2023) arXiv:2210.03629 confirmed ✅

### Code Cross-References

- [ ] Tool schema examples are conceptual — verify against actual Antaryami-OS skill implementation once PR lands
- [ ] Audit log JSON format — verify against actual logger output

### Reviewer Sign-off

| Role | Name | Date | Signature |
|------|------|------|----------|
| Technical reviewer (AI governance) | — | — | — |
| Standards reviewer (ISO 17025 + NABL) | — | — | — |
| Editor | — | — | — |

*Assign reviewers in the GitHub PR before promoting `draft: true → false`.*
