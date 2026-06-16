---
title: "Conversational AI for Solar PV Module Fault Diagnosis: Integrating Claude LLM into an IEC 60891-Compliant Measurement Pipeline"
slug: ai-pv-fault-diagnosis-claude
date: 2026-06-16
status: seed
week_angle: Tuesday/new-seed
keywords:
  - photovoltaic
  - fault diagnosis
  - large language model
  - Claude
  - AI diagnostics
  - IEC 60891
  - IV curve analysis
  - antaryami-os
  - conversational AI
  - PV testing
description: >
  Proposes benchmarking Claude-powered conversational fault diagnosis against
  rule-based methods for solar PV module characterisation, using Surya Yantra's
  streaming measurement pipeline and antaryami-os multi-agent architecture.
target_journal: "Solar Energy (Elsevier) OR IEEE Journal of Photovoltaics"
estimated_length_words: 5500
engineering_trigger: >
  Surya Yantra POST /api/ai/chat (streaming Claude Sonnet 4.6) is live in
  apps/web/app/api/. antaryami-os (ganeshgowri-ASA/antaryami-os, last active
  2026-05-10) provides enterprise multi-agent orchestration patterns — tool-use
  loops, memory stores, structured JSON output — that wrap the Claude API call
  into a reliable diagnostic pipeline with retry logic and confidence scoring.
related_code:
  - apps/web/app/api/ws/route.ts
  - apps/web/lib/iec60891.ts
  - docs/API.md                       # /api/ai/chat spec
related_repos:
  - ganeshgowri-ASA/antaryami-os      # multi-agent orchestration
blocking_gaps:
  - Real IV dataset with labelled PV faults (issue #141)
  - Structured system prompt + few-shot examples for fault taxonomy
  - Rule-based baseline classifier for benchmarking
  - Latency measurement for Claude Sonnet 4.6 in streaming mode
---

# Seed / Research Narrative

## Hook

When an IV curve shows a 6 % drop in Isc alongside an unchanged Voc, a
trained PV engineer immediately suspects partial shading or soiling. A Claude
LLM with access to IEC 60891-corrected IV parameters can reason over the same
evidence in natural language — and explain *why*, citing the standard. This
paper asks whether that explanation is accurate enough to replace or augment a
rule-based fault classifier in the Srishti PV Lab workflow.

---

## Engineering Link

**Surya Yantra** already exposes two AI-accessible surfaces:

1. **`POST /api/ai/chat`** (streamed, `text/event-stream`) — passes `sessionId`,
   `moduleId`, and a natural-language question to Claude Sonnet 4.6 (or GPT-4o
   fallback). The system prompt has access to the session's corrected IV
   parameters: Isc, Voc, Pmpp, FF, α, β, SMMF, IAM.

2. **Real-time IV stream** (`/api/ws`, Socket.IO) — emits per-point `{v, i, p}`
   tuples; an AI backend subscriber can flag anomalies mid-sweep.

**antaryami-os** (ganeshgowri-ASA/antaryami-os, TypeScript, 188 open issues,
last commit 2026-05-10) is an Enterprise-Grade Organisational AI OS with:
- Multi-agent tool-use loops with structured JSON output schemas.
- Memory stores for session context across sweeps.
- Guardrails to prevent prompt injection via malformed instrument metadata.

The natural integration: antaryami-os agent wraps `POST /api/ai/chat`,
appends the last N corrected IV parameter records as context, and returns a
structured `{ fault_class, confidence, evidence, recommendation }` JSON response
alongside the free-text explanation.

---

## Proposed Research Questions

1. Can a zero-shot Claude Sonnet 4.6 prompt correctly classify the top 5 PV
   fault modes from IEC 60891-corrected IV parameters alone?
2. What few-shot + chain-of-thought prompt strategy achieves the highest
   classification accuracy on a labelled field dataset?
3. How does LLM diagnostic latency (1–3 s) compare to a rule-based classifier
   (< 10 ms) for real-time streaming fault flagging?

---

## Fault Taxonomy

| Fault | IV signature | Reference standard |
|-------|-------------|-------------------|
| Partial shading | Isc ↓, stepped P-V knee | IEC 61829 |
| Soiling | Isc ↓ proportional to shading % | IEC 61724-1 |
| Delamination | Rs ↑, FF ↓ | IEC 61215 §10.13 |
| Cell crack | Isc ↓ + σ across modules ↑ | EL imaging |
| Bypass diode failure | Stepped I-V, partial Voc loss | IEC 61730 §10.18 |

---

## Preliminary Outline

### 1. Introduction
- PV testing requires rapid iteration: sweep → interpret → adjust configuration.
  LLMs compress the interpretation step from minutes to seconds.
- Prior art: PV-Lib rule-based detection; ML classifiers (SVM/RF on IV curve
  features); no LLM-native benchmark found in PV literature.
- Contribution: first benchmark of Claude conversational AI vs rule-based fault
  classifier on IEC 60891-corrected IV curves from an open-source test system.

### 2. Methodology
#### 2.1 Dataset
- 75-module test bed, synthetic fault injection + real field data (TODO #141).
- Labels: one fault class per measurement, confirmed by visual inspection and
  EL imaging.

#### 2.2 Prompt engineering variants
| Variant | Strategy |
|---------|----------|
| ZS | Zero-shot: IV params → "Diagnose the fault" |
| FS-5 | 5 labelled examples in context |
| CoT | Chain-of-thought: "Reason step by step" |
| FS-CoT | Few-shot + CoT combined |

#### 2.3 Evaluation metrics
- Top-1 accuracy, macro F1 per fault class.
- Mean first-token latency (ms) via streaming API.
- Model: Claude Sonnet 4.6 (`claude-sonnet-4-6`) — cost-optimised;
  Claude Opus 4.8 (`claude-opus-4-8`) — accuracy ceiling.

### 3. Antaryami-OS Integration Architecture
```
IV sweep completes
  → POST /api/ai/chat {sessionId, moduleId, message}
    → antaryami-os agent picks up corrected IV params
      → Claude Sonnet 4.6 (streaming SSE)
        → structured JSON: {fault_class, confidence, evidence, recommendation}
          → stored in IVMeasurement.aiDiagnosis (new field)
            → rendered in Reports screen
```

### 4. Results (TODO)
- Hypothesis: FS-CoT achieves > 85 % top-1 accuracy across all 5 fault classes.
- Hypothesis: Claude Opus 4.8 outperforms Sonnet 4.6 by ~8 % on
  low-signal faults (delamination, cell crack).
- Hypothesis: LLM latency (median 1.2 s) is acceptable for post-sweep but
  not for real-time per-point streaming anomaly detection.

### 5. Discussion
- **Architecture recommendation:** use rule-based classifier (10 ms) for
  real-time streaming alert; LLM provides post-sweep explanation report.
- **Prompt security:** antaryami-os guardrails sanitise module metadata before
  embedding in prompt (prevents injection via serialNumber or notes fields).
- **Model versioning:** pin Claude model ID (`claude-sonnet-4-6`) in
  `IVMeasurement.aiModelUsed` for ISO 17025 §7.11 reproducibility.

### 6. Conclusion
- LLM-based diagnostics are accurate enough for post-sweep fault explanation;
  rule-based preferred for real-time streaming.
- Open-source implementation: `POST /api/ai/chat` in Surya Yantra;
  antaryami-os agent wrapper.
- NABL compliance note: AI diagnosis must be reviewed by a qualified engineer;
  cannot be sole basis for a test report under ISO 17025.

---

## References (seed — expand to 10+)

1. IEC 61215:2021 — Terrestrial PV modules — Design qualification and type approval.
2. IEC 61829:2015 — Crystalline silicon PV arrays — I-V measurement on-site.
3. Garoudja, E. et al. (2017). Statistical fault detection in PV systems using
   modified Shewhart charts. *Solar Energy*, 150, 485–499.
   DOI: [10.1016/j.solener.2017.04.052](https://doi.org/10.1016/j.solener.2017.04.052)
4. Anthropic (2025). *Claude API Technical Reference — Model IDs and Capabilities.*
   [docs.anthropic.com/api](https://docs.anthropic.com/en/api/getting-started)
5. *(TODO: LLM zero-shot classification benchmark reference)*
6. *(TODO: PV-Lib rule-based fault detection citation)*
7. *(TODO: IEC 61724-1 soiling loss measurement)*
8. *(TODO: Electroluminescence imaging for cell crack detection citation)*
