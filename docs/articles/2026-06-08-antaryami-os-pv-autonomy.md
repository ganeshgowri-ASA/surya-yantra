---
title: "antaryami-os as the Intelligence Layer for Autonomous PV Module Testing"
slug: antaryami-os-pv-lab-autonomy
date: 2026-06-08
author: Srishti PV Lab
status: seed
tags:
  - ai
  - automation
  - antaryami-os
  - surya-yantra
  - enterprise-ai
keywords:
  - AI solar testing automation
  - enterprise AI operating system PV lab
  - autonomous IV curve testing
  - antaryami-os integration
  - Srishti PV Lab AI agent
description: >
  antaryami-os is an enterprise-grade AI operating system with 176+ active
  development threads as of June 2026. This article proposes how its agent
  orchestration layer can transform Surya Yantra from a manual IV tracer into
  an autonomous system that schedules sweeps, detects anomalies, and generates
  IEC-compliant reports without operator intervention.
---

# antaryami-os as the Intelligence Layer for Autonomous PV Module Testing

*Article seed — 2026-06-08. Based on antaryami-os (last updated 2026-05-10,
176 open issues) and Surya Yantra's current manual test workflow.*

---

## 1. The autonomy gap in current PV testing

Surya Yantra's current architecture is a capable but human-driven system:

1. Lab technician selects modules in the UI
2. Technician configures IV sweep parameters (startV, stopV, stepCount)
3. System drives the MUX relay to connect the selected module
4. ESL-Solar 500 executes the IV sweep
5. Technician applies IEC 60891 corrections and generates a report

Steps 1–5 take 3–5 minutes per module. For a 75-module test bed, a complete
measurement campaign requires 4–6 hours of active operator time. At scale —
multiple test beds, daily degradation sweeps — this is the binding constraint
on throughput.

An AI operating system layer breaks this constraint by:
- Scheduling sweeps when conditions are optimal (G > 800 W/m², T stable ±1 °C)
- Detecting and re-queuing failed measurements without operator input
- Applying corrections and generating reports autonomously
- Alerting only on genuine anomalies — Isc drop >3%, FF <0.72, Pmpp delta >1.5%

---

## 2. antaryami-os architecture overview

[antaryami-os](https://github.com/ganeshgowri-ASA/antaryami-os) is an
enterprise-grade organisational AI operating system (TypeScript). As of June
2026 it is the most actively developed platform in the Srishti ecosystem
(176 open issues). Its core components relevant to PV lab automation:

```
antaryami-os
├── Agent registry      — named, purpose-scoped AI agents
├── Task scheduler      — cron + event-driven dispatch
├── Tool bus            — standardised API bridge (MCP-compatible)
├── Memory layer        — per-agent context persistence
└── Audit log           — full action trail (IEC 62443 SR 6.2 relevant)
```

The **tool bus** is the integration point. Surya Yantra's REST API becomes a
named tool set callable by any antaryami-os agent:

```ts
// Tool definitions registered with the antaryami-os tool bus
const suryaYantraTools = [
  {
    name: 'get_env_conditions',
    description: 'Current irradiance G (W/m²) and cell temperature T (°C)',
    endpoint: 'GET /api/env/:testBedId/latest',
  },
  {
    name: 'list_active_modules',
    description: 'All modules active in the test bed',
    endpoint: 'GET /api/modules?isActive=true',
  },
  {
    name: 'start_iv_sweep',
    description: 'Start an IV sweep on one module',
    endpoint: 'POST /api/sessions',
    params: ['moduleId', 'startV', 'stopV', 'stepCount'],
  },
  {
    name: 'apply_iec_correction',
    description: 'Apply IEC 60891 P1 to STC (1000 W/m², 25 °C)',
    endpoint: 'POST /api/measurements/:id/correct',
  },
  {
    name: 'generate_report',
    description: 'Generate PDF report for a completed test session',
    endpoint: 'POST /api/reports',
  },
];
```

---

## 3. Proposed autonomous daily sweep agent

The primary use case is a **daily sweep agent** that runs without an operator:

```
07:30  agent wakes, queries G forecast → /api/env/:bedId/latest
08:00  G > 900 W/m², T_cell ±1 °C stable for 10 min → start campaign
08:01  sweep module 1 → 5 → 10 → … → 75 (sequential, ~4 min each)
12:30  campaign complete; 75 IV curves collected
12:31  trigger IEC 60891 P1 correction for all 75 measurements
12:35  generate daily summary report  → POST /api/reports
12:36  compare today's Pmpp to same time last week per module
12:37  anomalies detected: dispatch alert with LLM diagnosis
12:38  write full audit trail to antaryami-os memory layer
```

This workflow requires no operator presence from 08:00 to 12:38.

---

## 4. Anomaly detection with LLM reasoning

antaryami-os agents combine tool calls with LLM reasoning to classify
measurement anomalies:

```ts
// Anomaly classification step
const measurements = await tool('list_measurements', { sessionId });
const anomalies = measurements.filter(m => {
  const pmppDrop  = (m.pmppRef - m.pmppToday) / m.pmppRef > 0.015;
  const lowFF     = m.fillFactor < 0.72;
  const iscDrop   = (m.iscStc - m.iscMeasured) / m.iscStc > 0.03;
  return pmppDrop || lowFF || iscDrop;
});

if (anomalies.length) {
  const diagnosis = await agent.reason({
    context: 'PV module anomaly — Srishti test bed',
    data: anomalies,
    question: 'Most likely root cause and recommended action?',
  });
  await tool('send_alert', { severity: 'high', message: diagnosis });
}
```

Common patterns the agent can distinguish:

| Symptom | Likely cause |
|---------|-------------|
| Isc ↓, Voc stable | Soiling or partial shading (temporary) |
| Voc ↓, Isc stable | Solder joint degradation or bypass diode failure |
| FF ↓, Isc + Voc stable | Series resistance increase (connector corrosion) |
| All params ↓ proportionally | Reference cell or irradiance sensor drift |

---

## 5. Integration prerequisites

| Requirement | Status | Notes |
|-------------|--------|-------|
| Auth middleware on all Surya Yantra API routes | Missing | See Zero-Trust API article (2026-06-07) |
| Agent API token (role: `agent`) | Not implemented | Needs HMAC token + RBAC |
| WebSocket subscription for live sweep monitoring | Available | `/api/ws` endpoint exists |
| Webhook: sweep completion → antaryami-os event bus | Not implemented | ~1 day |
| antaryami-os tool bus registration | Not implemented | See tool definitions above |

The auth gap (row 1) is the hard blocker. The Zero-Trust API article's
Phase 1 hardening is prerequisite to any agent integration.

---

## 6. Next steps for this article

- [ ] Document the antaryami-os tool bus registration API format
- [ ] Implement a proof-of-concept daily sweep agent as an antaryami-os flow
- [ ] Benchmark: agent orchestration latency vs. manual workflow time
- [ ] Diagram: full agent state machine (idle → env-check → sweep → correct → report → alert)
- [ ] Reference: IEC 62443-3-3 SR 1.1 (human user identification) for agent identity

---

*Related repos:
[antaryami-os](https://github.com/ganeshgowri-ASA/antaryami-os) ·
[surya-yantra](https://github.com/ganeshgowri-ASA/surya-yantra)*
