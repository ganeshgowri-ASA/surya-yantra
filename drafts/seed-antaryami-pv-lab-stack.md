---
title: "The PV Lab Intelligence Stack: Surya Yantra Data + SolarLabX LIMS + Antaryami OS Orchestration"
date: 2026-06-22
week: W26
day_angle: roadmap
status: seed
tags: [antaryami-os, solarlabx, multi-agent, mcp, lims, orchestration, article-seed]
source_repos: [antaryami-os, SolarLabX]
source_activity: "antaryami-os pushed 2026-06-21T03:41:45Z; SolarLabX pushed 2026-06-21T03:36:30Z"
target_venue: "npj Computational Materials or IEEE Trans. on Automation Science"
estimated_words: 5500
---

# Seed: The PV Lab Intelligence Stack

## Research narrative

As of June 2026, three Srishti repositories handle distinct layers of the solar PV testing lifecycle:

| System | Role | Tech |
|--------|------|------|
| **Surya Yantra** | IV curve capture + IEC correction | Next.js, Electron, SCPI |
| **SolarLabX** | LIMS, QMS, uncertainty budget, SOP generation | Next.js, Prisma, Anthropic SDK |
| **Antaryami OS** | Enterprise AI OS — multi-agent orchestration | TypeScript, MCP |

Each runs independently with its own Vercel deployment and Prisma schema. There is no automated data handshake between them:

- A Surya Yantra corrected IV measurement cannot be automatically ingested into SolarLabX's LIMS sample record.
- SolarLabX's SOP generator does not read Surya Yantra's active sweep configuration to autofill test conditions.
- Antaryami OS has no MCP server connector for either system.

**The research question:** can Antaryami OS act as an MCP-based orchestration layer that binds all three systems into a coherent PV lab intelligence stack — with Surya Yantra as the instrument layer, SolarLabX as the data/compliance layer, and Antaryami OS as the reasoning and notification layer?

## Proposed architecture

```
Antaryami OS (orchestration, Claude Opus 4.8)
      │
      ├── MCP Tool: surya-yantra-mcp
      │      POST /api/sessions (create sweep)
      │      GET  /api/measurements/:id/curve (fetch IV data)
      │      POST /api/measurements/:id/correct (IEC corrections)
      │
      ├── MCP Tool: solarlabx-mcp
      │      POST /api/lims/samples (ingest corrected curve)
      │      POST /api/sop/generate (autofill sweep conditions)
      │      GET  /api/audit (compliance check)
      │
      └── Notification: push corrected Pmpp + NABL status to operator
```

## Proposed contribution

1. Define the Surya Yantra MCP server specification (OpenAPI → MCP tool manifest).
2. Implement the SolarLabX ingest adapter that accepts a Surya Yantra `CorrectionResult` and creates a LIMS `Sample` record.
3. Demonstrate an Antaryami OS agent session that:
   a. Creates an IV sweep via Surya Yantra.
   b. Waits for the corrected `Pmpp`.
   c. Ingests the result into SolarLabX LIMS.
   d. Triggers SOP generation pre-filled with the sweep conditions.
   e. Notifies the operator via Antaryami's notification channel.
4. Measure end-to-end latency and Claude API token cost vs. manual data transfer.

## Sections scaffold

1. Introduction — the multi-system PV lab problem
2. Related work — LIMS integration, lab automation, LLM orchestration
3. System architecture — three-layer stack with MCP
4. Surya Yantra MCP server implementation
5. SolarLabX ingest adapter
6. Antaryami OS agent session (case study)
7. Evaluation: latency, cost, operator workload reduction
8. Conclusion and future work (adding ShilpaSutra CAD layer)

## Blockers

- Antaryami OS MCP server framework API not yet public (private repo).
- SolarLabX production deployment not yet active (all Vercel deployments CANCELED — see open issue).
- Surya Yantra hardware not yet commissioned for real measurement data.

## Action items

- [ ] Open a GitHub issue in antaryami-os requesting MCP tool manifest spec.
- [ ] Draft `POST /api/lims/ingest-iv-result` endpoint spec for SolarLabX.
- [ ] Create Surya Yantra `apps/web/mcp/` directory with tool manifest stub.
