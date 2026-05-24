---
title: "Autonomous PV Fault Narratives: Integrating Antaryami-OS with Surya Yantra's Claude-Powered Diagnostics"
slug: antaryami-pv-fault-narratives
date: 2026-05-24
status: seed
tags: [antaryami-os, ai-diagnostics, claude, fault-detection, solar-pv, enterprise-ai]
related_repos: [antaryami-os, surya-yantra]
weekly_angle: SEO/metadata
keywords:
  - PV module fault detection AI
  - autonomous solar diagnostics
  - Claude AI solar testing
  - antaryami enterprise AI OS
  - IV curve anomaly detection
description: >
  How Antaryami-OS's enterprise orchestration layer can transform Surya
  Yantra's per-session Claude diagnostics into a persistent, multi-tenant
  fault-narrative engine — automatically correlating IV anomalies across
  the 75-module array over time.
---

# Autonomous PV Fault Narratives: Integrating Antaryami-OS with Surya Yantra's Claude-Powered Diagnostics

## The Gap Today

Surya Yantra's `/api/ai/chat` endpoint lets a lab operator ask:

> *"Explain why Isc dropped 6% after the last sweep."*

Claude streams back a contextual narrative: bypass diode activation, soiling
estimate, or temperature correction inaccuracy. But the conversation is scoped
to a **single session and module**. When the question becomes:

> *"Which modules degraded > 3% over the last 30 days, and what fault mode
> is most likely?"*

…the current architecture has no answer. That cross-session, cross-module
reasoning is exactly what Antaryami-OS was designed for.

---

## Background: Antaryami-OS Architecture

Antaryami-OS (last major push: May 2026) is an enterprise AI operating system
for organizational knowledge — structured around:

- **Agent pool**: persistent agents that subscribe to event streams
- **Memory fabric**: cross-session retrieval over structured + unstructured data
- **Workflow DAGs**: multi-step pipelines with typed inputs/outputs
- **Tenancy model**: org-scoped memory isolation, role-based tool access

In the PV lab context, Surya Yantra plays the role of a **data producer** in
the Antaryami event bus.

---

## Proposed Integration Architecture

```
Surya Yantra (Next.js)
   │
   ├── POST /api/measurements/:id/correct  ──► IVCorrectionComplete event
   ├── POST /api/sessions/:id/start        ──► TestSessionStarted event
   └── WebSocket IV stream                 ──► LiveIVPoint events
         │
         ▼
   Antaryami-OS Event Bus
         │
   ┌─────┴──────────────────────────────────┐
   │  PV Fault Watcher Agent               │
   │  • subscribes to IVCorrectionComplete  │
   │  • stores (moduleId, Pmpp, date) in    │
   │    memory fabric                       │
   │  • every 24h: query degradation trend  │
   │  • threshold breach → fire narrative   │
   └───────────────────┬────────────────────┘
                       │
              Claude (claude-opus-4-7)
              Prompt: "Analyse degradation
               for module {id}: {trend_data}"
                       │
              ┌────────▼────────┐
              │  Fault Narrative │
              │  + recommended  │
              │  action ticket  │
              └────────┬────────┘
                       │
              Antaryami Workflow DAG
              → create Jira/Notion ticket
              → email lab manager
              → flag in Surya Yantra UI
```

---

## Key Research Questions

1. **Latency vs. freshness**: Antaryami's memory fabric uses vector similarity
   for historical recall. For time-series IV data (500 points/sweep ×
   75 modules × 24h), is embedding-based retrieval efficient, or do we need a
   dedicated time-series index (InfluxDB / TimescaleDB)?

2. **Fault taxonomy**: The Claude prompt currently has no structured fault
   taxonomy. Does pre-seeding the agent with the IEC 62446-1 fault categories
   improve actionability of the narrative?

3. **Multi-tenant lab**: SolarLabX (another Srishti project) has a LIMS schema.
   Can a single Antaryami tenant serve both Surya Yantra and SolarLabX test
   beds simultaneously with memory isolation?

4. **Uncertainty-aware narratives**: When SMMF is outside [0.98, 1.02] but
   Pmpp still looks normal, should the agent flag a sensor calibration drift
   rather than a module fault?

---

## Preliminary Design: PV Fault Watcher Agent

```ts
// Conceptual Antaryami agent definition
const pvFaultWatcher = defineAgent({
  name: 'pv-fault-watcher',
  subscribes: ['IVCorrectionComplete'],
  memory: { scope: 'org', ttl: '90d' },

  async handle(event: IVCorrectionComplete) {
    await memory.store(`pmax:${event.moduleId}:${event.date}`, event.pmpp);

    const trend = await memory.query(
      `SELECT pmpp, date FROM pmax:${event.moduleId} ORDER BY date DESC LIMIT 30`
    );

    const degradation = (trend[0].pmpp - trend.at(-1)!.pmpp) / trend.at(-1)!.pmpp;
    if (Math.abs(degradation) > 0.03) {
      const narrative = await claude.complete({
        model: 'claude-opus-4-7',
        prompt: buildFaultPrompt(event.moduleId, trend),
      });
      await workflow.trigger('create-fault-ticket', { moduleId: event.moduleId, narrative });
    }
  },
});
```

---

## Implementation Milestones

- [ ] Define `IVCorrectionComplete` event schema in `packages/types/`
- [ ] Add event emission to `POST /api/measurements/:id/correct`
- [ ] Prototype Antaryami agent in `services/pv-fault-watcher/`
- [ ] Validate against 30-day synthetic degradation dataset
- [ ] Publish fault classification accuracy vs. baseline (rule-based thresholds)

---

## Related Work

Surya Yantra already integrates Claude for **per-request** diagnostics
(`/api/ai/chat`). This article proposes the complementary **persistent,
cross-session** layer. The two modes are not redundant — the lab operator
uses conversational diagnostics for immediate troubleshooting; Antaryami
handles longitudinal fleet monitoring.

---

## References

1. Antaryami-OS repository: `ganeshgowri-ASA/antaryami-os` (Enterprise AI OS,
   TypeScript, updated May 2026).
2. Surya Yantra `docs/API.md` — `/api/ai/chat` streaming endpoint.
3. IEC 62446-1:2016, *Grid-connected PV systems — Minimum requirements for
   system documentation, commissioning tests, and inspection*.
4. Golive A. et al., *Automated degradation analysis of PV modules using
   AI-assisted IV curve interpretation*, Prog. PV 31 (2023) 8.
5. SolarLabX repository: `ganeshgowri-ASA/SolarLabX` — LIMS schema reference
   for multi-lab tenancy design.
