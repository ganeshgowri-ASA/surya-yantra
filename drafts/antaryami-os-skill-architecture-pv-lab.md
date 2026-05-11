---
title: "Skill-Based AI Operating System Architecture for Physical Instrument Automation: Lessons from Antaryami-OS"
seo_title: "Skill-Based AI OS for PV Lab Automation: Antaryami-OS Architecture | Srishti PV Lab"
description: "How Antaryami-OS decomposes physical PV lab automation into composable AI skills, and what ReAct-style reasoning over deterministic safety constraints means for SCPI instrument control."
keywords:
  - AI operating system
  - skill-based AI architecture
  - LLM physical automation
  - Antaryami-OS
  - ReAct reasoning acting
  - AI lab scheduling
  - Claude tool use
  - solar PV AI
  - SCPI AI orchestration
  - multi-agent solar lab
  - enterprise AI India
  - AI skill composition
canonical: "https://surya-yantra.srishtipvlab.in/posts/antaryami-os-skill-architecture-pv-lab"
og:
  title: "Skill-Based AI OS for PV Lab Automation: Antaryami-OS"
  description: "From 4 to 31 open issues in 3 days: inside the Antaryami-OS sprint that's building AI skill orchestration for physical solar lab instruments."
  image: "/og/antaryami-skill-architecture.png"
  type: "article"
twitter:
  card: "summary_large_image"
  title: "AI OS for Solar PV Labs: Antaryami-OS Skill Architecture"
  description: "ReAct reasoning + deterministic SCPI safety = AI-orchestrated 75-module test scheduling. Inside the Antaryami-OS sprint."
  image: "/og/antaryami-skill-architecture.png"
author: "Srishti PV Lab Engineering"
date: "2026-05-07"
lastmod: "2026-05-11"
draft: true
tags:
  - ai-operating-system
  - antaryami-os
  - skill-architecture
  - claude-api
  - react-reasoning
  - solar-pv
  - lab-automation
  - india
categories:
  - engineering
  - ai
  - research
reading_time: 14
schema_type: "TechArticle"
related_repos:
  - antaryami-os
  - surya-yantra
  - SolarLabX
---

# Skill-Based AI Operating System Architecture for Physical Instrument Automation: Lessons from Antaryami-OS

*Article seed — 7 May 2026 · Updated 10 May 2026 · Srishti PV Lab Engineering*

**Engineering signal:** [Antaryami-OS](https://github.com/ganeshgowri-ASA/antaryami-os) went from 4 open issues on 3 May to 31 on 6 May (7× in 3 days) and has since entered a hypersprint: **94 open issues as of 11 May 2026** (+45 in the last 24 hours alone, +91.8%). The 8-day trajectory (4 → 33 → 42 → 49 → 94) is a phase-transition signal — from architectural scaffolding to active hardware integration testing. See companion article *"Governing AI That Controls Physical Instruments: Lessons from the Antaryami-OS 42-Issue Sprint"* for the governance angle; this article focuses on the skill architecture.

This article examines the architectural problem Antaryami-OS is solving and why a skill-based AI OS is a more tractable abstraction than a monolithic LLM agent for controlling physical laboratory instruments.

## The Problem: LLMs Don't Belong Directly in Instrument Control Loops

The naive approach to AI-controlled lab automation is to give an LLM direct SCPI access and let it reason about what commands to send. This fails for three reasons:

1. **Latency**: LLM inference adds 200–2000 ms per step. An IV sweep loop that needs to poll instrument state every 50 ms cannot tolerate this.
2. **Reliability**: LLMs hallucinate. An ESL-Solar 500 that receives `SOUR:VOLT 400` (above its 300 V rating) from a hallucinating LLM will fault, potentially taking the relay matrix with it.
3. **Auditability**: NABL accreditation requires a traceable command log. An LLM reasoning trace is not an audit trail.

The solution is the pattern Yao et al. (2023) formalised as ReAct: the LLM *reasons and plans* over the problem, then *acts* by calling deterministic tool functions. The tools enforce safety, generate audit-ready logs, and return structured state. The LLM never touches instrument registers directly.

## The Antaryami-OS Skill Abstraction

Antaryami-OS organises LLM + tool combinations as *skills*. A skill has:

- **A natural-language interface**: the caller describes what it wants in plain text.
- **A set of tool bindings**: deterministic functions the LLM may call.
- **A safety envelope**: invariants the tool layer enforces regardless of LLM output.
- **An output contract**: a typed return value the caller can depend on.

This is analogous to a microservice with an LLM as the business logic layer. The key insight is that *the LLM is not a blackbox endpoint* — it is a planner that operates inside a constrained tool namespace.

### Skill example: `pv-session-planner`

```typescript
// Antaryami-OS skill invocation (conceptual)
const schedule = await skills.pvSessionPlanner({
  modules: moduleQueue,       // 75 module records from Surya Yantra
  irradianceForecast: gForecast, // from met service
  temperatureForecast: tForecast,
  priorityFlags: rushOrders,
  budget: { maxApiCostINR: 2 },  // today's AI budget
});
// Returns: OrderedSlotAssignment[]
```

Internally, the skill uses Claude claude-sonnet-4-6 with a system prompt that describes the scheduling constraints as first-class rules, and a tool set that includes `getModuleData()`, `queryIrradianceForecast()`, and `emitSlotAssignment()`. The tool layer validates each `emitSlotAssignment()` call against the physical constraint that only one module can be connected to the load at a time.

The LLM never sees the SCPI state machine. The SCPI driver runs from the `OrderedSlotAssignment[]` list deterministically after the planning phase.

## The Safety Envelope Pattern

For physical instrument automation, the safety envelope is not optional. Antaryami-OS enforces three layers:

### Layer 1: Tool schema validation
Every tool call is validated against a Zod schema before execution. An LLM cannot call `connectModule({ slotNumber: -1 })` — the schema rejects it before any I/O occurs.

### Layer 2: Invariant checks
The `connectModule()` tool function queries the current relay state before energising a relay. If any `DESTINATION=ELOAD` relay is already active, the call returns `{ error: 'INTERLOCK_VIOLATION' }` and the LLM must replan. This mirrors the server-side `409 Conflict` that Surya Yantra's REST API returns — the same safety rule enforced at two layers.

### Layer 3: Audit logging
Every tool call is written to a structured log:
```json
{ "ts": "2026-05-07T07:23:11Z", "skill": "pv-session-planner",
  "tool": "emitSlotAssignment", "slot": 34, "estimatedG": 921,
  "estimatedT": 43.2, "sessionId": "clx-sess-0721" }
```
This log is the NABL audit trail. The LLM's reasoning trace is stored separately as a debug artefact, not as a compliance record.

## Model Tier Routing

The `pv-fault-router` skill implements a cost-aware routing pattern that Wu et al. (2023) describe in the AutoGen framework as *agent specialisation by capability*:

```
anomalyScore < 0.6  →  Haiku 4.5  (~₹0.12/1k tokens)
anomalyScore ≥ 0.6  →  Opus 4.7   (~₹1.25/1k tokens)
```

The anomaly score is computed deterministically from the IV curve (Pmpp deviation, fill factor drop, morphology classifiers). The LLM is only invoked after the score is computed — never to compute the score. This ensures AI cost scales with diagnostic complexity, not with throughput.

At 75 modules/day with ~10 % anomaly rate and an average fault-router call costing ₹0.50 (mix of Haiku triage + occasional Opus deep analysis), the total AI cost is ~₹37.50/day — within the ₹40/month budget for a 22-working-day month.

## What the Sprint Signals

The 7× issue increase from 3–6 May, accelerating to 49 by 10 May and **94 by 11 May** (+91.8% in 24 h), is consistent with a team running integration testing against Surya Yantra's staging environment and filing each failure as an issue. At 94 issues, this sprint is producing real integration coverage data at a scale that would take weeks under normal development cadence — the most valuable kind of feedback for a physical-lab AI OS, where edge cases from hardware state machines are impossible to enumerate in advance.

The governance implications of this sprint scale are covered in *"Governing AI That Controls Physical Instruments: Lessons from the Antaryami-OS 42-Issue Sprint"* (`drafts/antaryami-os-42-issue-sprint-governance.md`).

<!-- TODO: Link to antaryami-os PR for pv-session-planner skill once merged -->
<!-- TODO: Add sequence diagram of full skill invocation flow: Surya Yantra webhook → Antaryami-OS → SCPI commands → audit log -->

## Research Narrative

This work sits at the intersection of three research threads:

1. **LLM tool use for physical automation** — extending ReAct (Yao et al., 2023) and Toolformer (Schick et al., 2023) to real-time instrument control with hard safety constraints.
2. **AI operating systems** — Antaryami-OS's skill abstraction is a practical instantiation of the "OS for AI" vision articulated by emerging system frameworks (AutoGen, LangGraph, CrewAI).
3. **Domain-specific LLM adaptation for solar PV** — the combination of physics-based anomaly scoring with LLM diagnostic reasoning is a pattern applicable to any complex measurement domain.

Target venue: **AAAI 2027 AI for Science track** or **Applied AI Letters** — this fits the empirical-systems-paper format (real deployment, measurable outcomes, clear architecture).

## References

1. Yao S., Zhao J., Yu D., Du N., Shafran I., Narasimhan S., Cao Y. (2023). *ReAct: Synergizing Reasoning and Acting in Language Models*. ICLR 2023. arXiv:2210.03629.
2. Schick T., Dwivedi-Yu J., Dessì R., Raileanu R., Lomeli M., Zettlemoyer L., Cancedda N., Scialom T. (2023). *Toolformer: Language Models Can Teach Themselves to Use Tools*. NeurIPS 2023. arXiv:2302.04761.
3. Wu Q., Bansal G., Zhang J., et al. (2023). *AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation*. arXiv:2308.08155.
4. Anthropic (2026). *Claude API: Tool use, multi-turn conversations, and the claude-sonnet-4-6 model*. Technical documentation.
5. Hong S., Zhuge M., Chen J., Zheng X., Cheng Y., Wang J., Zhang C., Wang Z., Yau S.K.S., Lin Z., Zhou L., Ran C., Xiao L., Wu C., Schmidhuber J. (2024). *MetaGPT: Meta Programming for a Multi-Agent Collaborative Framework*. ICLR 2024. arXiv:2308.00352.
6. Chase H. (2022). *LangChain: Building applications with LLMs through composability*. GitHub. DOI: 10.5281/zenodo.6853699.
7. Antaryami-OS: [github.com/ganeshgowri-ASA/antaryami-os](https://github.com/ganeshgowri-ASA/antaryami-os).
8. Surya Yantra AI diagnostics API: `POST /api/ai/chat` — see `docs/API.md`.

---

## Peer Review

*Thursday 8 May 2026 — Weekly peer-review checklist pass*

### Technical Accuracy

- [ ] All equations verified against cited source (DOI or section number confirmed)
- [ ] TypeScript code snippets compile without errors against current `apps/web/lib/`
- [ ] Numerical examples cross-checked against test suite values in `apps/web/__tests__/`
- [ ] Claims about companion-repo sprint state verified against latest GitHub activity
- [ ] All `<!-- TODO -->` items either resolved inline or tracked as open GitHub issues

### Citation Completeness

- [ ] All referenced papers include DOI or arXiv ID
- [ ] IEC standards cite year and section number
- [ ] Software references include version, commit hash, or publication DOI
- [ ] No citation appears as a bare URL without author/year

### Code Cross-References

- [ ] All TypeScript paths mentioned exist in `apps/web/lib/` on `main`
- [ ] Every described behaviour has test coverage in `apps/web/__tests__/`
- [ ] API endpoints described match current `docs/API.md`
- [ ] External package imports (`@ganitasutra/pv-toolbox` etc.) have a tracked issue or PR

### Reviewer Sign-off

| Role | Name | Date | Signature |
|------|------|------|----------|
| Technical reviewer | — | — | — |
| Standards reviewer | — | — | — |
| Editor | — | — | — |

*Assign reviewers in the GitHub PR before promoting `draft: true → false`.*
