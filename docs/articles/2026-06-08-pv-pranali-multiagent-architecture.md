---
title: "pv-pranali: A LangGraph + MCP Multi-Agent System for PV Test Equipment Proposals"
slug: pv-pranali-multiagent-architecture
date: 2026-06-08
author: Srishti PV Lab
status: seed
tags:
  - multiagent
  - langgraph
  - mcp
  - pv-pranali
  - claude-code
keywords:
  - LangGraph multi-agent solar PV
  - MCP server PV lab
  - Claude Code agent orchestration
  - pv-pranali architecture
  - PV test equipment proposal automation
description: >
  pv-pranali orchestrates ShilpaSutra, Antaryami, Vidyalaya-Office, SuryaPrajna,
  and Vidyut-Srishti via LangGraph + MCP running Claude Code + MiMo on
  WSL/tmux. This seed article maps the architecture and proposes where Surya
  Yantra fits into the proposal generation pipeline.
---

# pv-pranali: A LangGraph + MCP Multi-Agent System for PV Test Equipment Proposals

*Article seed — 2026-06-08. Based on
[pv-pranali](https://github.com/ganeshgowri-ASA/pv-pranali) (Python, last
updated 2026-05-03), which orchestrates multiple Srishti platforms via
LangGraph and MCP.*

---

## 1. The problem: multi-domain PV proposal assembly

A complete IV curve tracer proposal for a new test bed requires five domains:

| Domain | Deliverable |
|--------|------------|
| Electrical design | E-load specs, MUX relay matrix, 4-wire Kelvin harness |
| Mechanical design | Test rack, cable management, rack enclosure drawings |
| Standards compliance | IEC 60891, IEC 60904-1, IEC 61853-1/2 compliance matrix |
| Procurement | India BOM with vendor links, GST, lead times |
| Documentation | System spec, test protocol, uncertainty budget, SOP |

Assembling this manually requires 3–5 domain experts and 2–3 weeks.
pv-pranali automates the orchestration: it decomposes the proposal into
sub-tasks, dispatches each to the appropriate specialist platform, and
synthesises the outputs into a coherent proposal document.

---

## 2. System architecture

```
pv-pranali (Python, LangGraph)
│
├── Supervisor (Claude claude-opus-4-8)
│     Input: "Generate IV tracer proposal for 100-module outdoor bed"
│     Decomposes → dispatches → synthesises
│
├── ShilpaSutra agent ──► MCP server
│     Role: mechanical drawings, rack design, FEM wind verification
│     Output: SVG schematics, parametric BOM, IEC drawing sheets
│
├── Antaryami agent ──► MCP server
│     Role: requirements analysis, standards mapping, risk assessment
│     Output: system requirements, IEC compliance matrix, risk register
│
├── SuryaPrajna agent ──► MCP server (IV analysis platform)
│     Role: IV curve analysis, degradation modelling, calibration
│     Output: measurement uncertainty budget, calibration schedule
│
├── Vidyut-Srishti agent ──► MCP server (electrical design)
│     Role: circuit design, protection coordination, load calculations
│     Output: electrical schematics, protection relay settings
│
└── Vidyalaya-Office agent ──► MCP server (document assembly)
      Role: SOP generation, report formatting, revision management
      Output: final proposal PDF, test protocol, SOP document set
```

The system runs on WSL/tmux: each agent is a persistent tmux pane.
Claude Code drives the supervisor; MiMo (lightweight model runner) handles
the domain-specific sub-agents.

---

## 3. LangGraph state machine

```python
from langgraph.graph import StateGraph, END

def build_proposal_graph():
    g = StateGraph(ProposalState)

    # Each node calls an MCP-connected specialist agent
    g.add_node("requirements", antaryami_requirements_agent)
    g.add_node("mechanical",   shilpasutra_design_agent)
    g.add_node("electrical",   vidyut_srishti_agent)
    g.add_node("iv_analysis",  surya_prajna_agent)
    g.add_node("assemble",     vidyalaya_office_agent)
    g.add_node("review",       supervisor_review_agent)

    g.set_entry_point("requirements")

    # Sequential start, then parallel domain branches
    g.add_edge("requirements", "mechanical")
    g.add_edge("requirements", "electrical")   # parallel
    g.add_edge("requirements", "iv_analysis")  # parallel
    g.add_edge("mechanical",   "assemble")
    g.add_edge("electrical",   "assemble")
    g.add_edge("iv_analysis",  "assemble")
    g.add_edge("assemble",     "review")

    # Review can loop back or terminate
    g.add_conditional_edges("review", route_after_review, {
        "revise": "requirements",
        "done":   END,
    })

    return g.compile()
```

The parallel branches (`mechanical`, `electrical`, `iv_analysis`) execute
concurrently, cutting total wall-clock time by roughly 3×.

---

## 4. Where Surya Yantra fits

Surya Yantra is the **reference implementation** that pv-pranali proposes
when a client requests an open-source IV curve tracer:

| pv-pranali output | Surya Yantra source |
|-------------------|---------------------|
| Customised procurement BOM | `hardware/BOM.md` (template) |
| System schematic | `hardware/schematics/` (planned) |
| IEC correction engine docs | `docs/IEC-CORRECTIONS.md` |
| Deployment guide | `docs/DEPLOYMENT.md` |
| API specification | `docs/API.md` |
| Software stack | `apps/web/` (Next.js, Prisma, shadcn/ui) |

For pv-pranali to use these assets programmatically, Surya Yantra needs an
MCP server:

```ts
// apps/web/mcp-server.ts (proposed)
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { readFile } from 'fs/promises';
import { db } from './lib/db';

const server = new McpServer({ name: 'surya-yantra', version: '1.0' });

server.tool('get_bom', {}, async () =>
  ({ content: [{ type: 'text', text: await readFile('hardware/BOM.md', 'utf8') }] })
);

server.tool('get_iec_corrections', {}, async () =>
  ({ content: [{ type: 'text', text: await readFile('docs/IEC-CORRECTIONS.md', 'utf8') }] })
);

server.tool('query_module_specs',
  { technology: { type: 'string' } },
  async ({ technology }) => {
    const specs = await db.moduleType.findMany({ where: { technology } });
    return { content: [{ type: 'text', text: JSON.stringify(specs, null, 2) }] };
  }
);
```

---

## 5. WSL/tmux session layout

pv-pranali's recommended WSL session layout:

```
tmux new-session -s pv-pranali
│
├── Window 0: supervisor         claude code run supervisor.py
├── Window 1: shilpasutra-agent  npx @modelcontextprotocol/inspector shilpasutra-mcp
├── Window 2: antaryami-agent    npx @modelcontextprotocol/inspector antaryami-mcp
├── Window 3: surya-prajna-agent npx @modelcontextprotocol/inspector surya-prajna-mcp
├── Window 4: vidyut-agent       npx @modelcontextprotocol/inspector vidyut-mcp
└── Window 5: logs               tail -f /tmp/pv-pranali.log
```

MiMo replaces Claude for the domain agents where the required reasoning
is narrowly scoped (schema validation, format conversion), significantly
reducing API costs per proposal run.

---

## 6. Next steps for this article

- [ ] Clone pv-pranali and document the actual LangGraph node topology
- [ ] Map each MCP server's tool manifest (tool names, input schemas)
- [ ] Run a sample proposal generation and document the output artefacts
- [ ] Diagram: WSL/tmux session screenshot with annotated windows
- [ ] Implement the Surya Yantra MCP server (`apps/web/mcp-server.ts`)
- [ ] Benchmark: time-to-proposal with pv-pranali vs. manual assembly

---

*Related repos:
[pv-pranali](https://github.com/ganeshgowri-ASA/pv-pranali) ·
[surya-yantra](https://github.com/ganeshgowri-ASA/surya-yantra) ·
[antaryami-os](https://github.com/ganeshgowri-ASA/antaryami-os) ·
[ShilpaSutra](https://github.com/ganeshgowri-ASA/ShilpaSutra)*
