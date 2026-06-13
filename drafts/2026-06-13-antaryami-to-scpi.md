---
title: "From Organizational Intent to SCPI Command: Integrating Antaryami-OS Workflow Agents with Surya Yantra via a LangGraph Orchestration Layer"
slug: antaryami-to-scpi
date: 2026-06-13
status: seed
week_angle: Friday/ideation-seed
keywords:
  - multi-agent AI
  - LangGraph
  - MCP (Model Context Protocol)
  - organizational AI
  - solar PV testing
  - SCPI instrument control
  - workflow automation
  - antaryami-os
  - pv-pranali
description: >
  Systems-integration paper describing how Antaryami-OS's work-order and
  scheduling agents can drive Surya Yantra's SCPI test execution through a
  pv-pranali LangGraph + MCP orchestration layer, closing the loop from
  organizational intent (test schedule, procurement order) to instrument
  command (SCPI sweep) and back to report generation.
target_journal: "Applied Sciences (MDPI) OR IEEE Transactions on Instrumentation and Measurement"
estimated_length_words: 5500
blocking_gaps:
  - Antaryami-OS API documentation for work-order creation endpoint
  - pv-pranali LangGraph graph topology specification
  - Measured orchestration latency (task-to-SCPI round trip)
related_repos:
  - ganeshgowri-ASA/antaryami-os (last updated 2026-05-10)
  - ganeshgowri-ASA/pv-pranali (last updated 2026-05-03)
  - ganeshgowri-ASA/SolarLabX (last updated 2026-03-25)
  - ganeshgowri-ASA/surya-yantra (this repo)
related_code:
  - apps/web/app/api/sessions/route.ts (Surya Yantra test session creation)
  - apps/web/app/api/ai/chat/route.ts (AI diagnostics endpoint)
  - docs/API.md §3 (Test Sessions), §9 (AI Diagnostics)
engineering_basis: >
  Antaryami-OS received updates on 2026-05-10 (enterprise AI OS workflows).
  pv-pranali LangGraph MCP orchestrator last updated 2026-05-03. This seed
  proposes the integration architecture connecting these two systems through
  Surya Yantra's REST API and SCPI hardware layer.
---

# Seed Outline

## 1. Abstract (≈ 200 words — to be written)

**Thesis:** The gap between organizational work-order creation (Antaryami-OS)
and physical instrument execution (Surya Yantra SCPI sweep) can be closed by
a LangGraph multi-agent graph (pv-pranali) that translates natural-language
test requests into structured API calls, with each node in the graph corresponding
to one layer of the instrument control stack.

**Key claim:** An AI-native lab automation stack — where organizational context
(who ordered the test, what SLA applies, which module batch is under test) is
preserved from work-order creation to PDF report — enables traceability levels
not achievable with traditional point-to-point integrations.

---

## 2. System Architecture

### 2.1 Three-layer stack

```
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 1 — Organizational (Antaryami-OS)                            │
│  Work orders · schedules · personnel assignment · SLA tracking      │
│  Last commit: 2026-05-10                                            │
│  Interface: REST API (antaryami-os/app/api/work-orders/)            │
└────────────────────────────┬────────────────────────────────────────┘
                             │ work-order JSON + module batch context
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 2 — Orchestration (pv-pranali / LangGraph + MCP)             │
│  Multi-agent graph translating intent → structured API calls        │
│  Nodes: WorkOrderParser → TestPlanner → SCPIMapper → ResultAggregator│
│  Last commit: 2026-05-03                                            │
│  Interface: MCP tools over Claude Code / MiMo on WSL/tmux           │
└────────────────────────────┬────────────────────────────────────────┘
                             │ POST /api/sessions (Surya Yantra)
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 3 — Instrument (Surya Yantra)                                │
│  Test session mgmt · MUX switching · SCPI sweep · IEC correction    │
│  Interface: REST API (docs/API.md) + WebSocket streaming            │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 LangGraph node topology (proposed)

```mermaid
stateDiagram-v2
    [*] --> WorkOrderParser : work-order JSON from Antaryami-OS
    WorkOrderParser --> TestPlanner : parsed intent\n(module IDs, test type, SLA)
    TestPlanner --> ModuleResolver : look up modules via\nGET /api/modules
    ModuleResolver --> MUXScheduler : schedule slot for each module
    MUXScheduler --> SCPIMapper : translate to test session config\n(startV, stopV, stepCount, loadMode)
    SCPIMapper --> SessionExecutor : POST /api/sessions\nPOST /api/sessions/:id/start
    SessionExecutor --> ResultCollector : poll session status\nGET /api/measurements?sessionId=...
    ResultCollector --> IECCorrector : POST /api/measurements/:id/correct
    IECCorrector --> ReportGenerator : POST /api/reports
    ReportGenerator --> WorkOrderUpdater : PATCH work-order status → COMPLETE
    WorkOrderUpdater --> [*] : work-order closed in Antaryami-OS
```

### 2.3 MCP tool surface

Each LangGraph node invokes one or more MCP tools:

| Node | MCP tool | Surya Yantra endpoint |
|------|----------|----------------------|
| ModuleResolver | `surya_yantra__get_modules` | `GET /api/modules?technology=...` |
| MUXScheduler | `surya_yantra__mux_status` | `GET /api/mux/:bedId` |
| SessionExecutor | `surya_yantra__create_session` | `POST /api/sessions` |
| SessionExecutor | `surya_yantra__start_session` | `POST /api/sessions/:id/start` |
| IECCorrector | `surya_yantra__correct_measurement` | `POST /api/measurements/:id/correct` |
| ReportGenerator | `surya_yantra__create_report` | `POST /api/reports` |

---

## 3. Research Questions

1. **Orchestration fidelity**: Does the LangGraph orchestrator correctly translate
   a natural-language work order ("test all 5 HJT modules in Row 3 to STC using
   P2 correction") into the correct sequence of REST calls, including selecting
   the right MUX slots and IEC procedure?

2. **Latency**: What is the end-to-end latency from work-order creation in
   Antaryami-OS to SCPI sweep start in Surya Yantra? Is it acceptable for a
   same-day turnaround SLA?

3. **Error handling**: How does the LangGraph graph handle partial failures
   (e.g., a relay self-test failure at slot 34 mid-batch)?

4. **Traceability**: Is the organizational context (work-order ID, operator ID,
   SLA tier) preserved in the `IVMeasurement` and `Report` records for NABL
   audit purposes?

---

## 4. Connection to Sibling Repos

### 4.1 Antaryami-OS (last updated 2026-05-10)

The May 10 commits to `antaryami-os` added enterprise workflow automation
features to the organizational AI OS. The proposed integration uses Antaryami-OS
as the **source of test intent** — work orders arrive as structured JSON and
carry organizational metadata (client ID, SLA, urgency) that is threaded through
the entire orchestration layer into the final NABL test report.

### 4.2 pv-pranali (last updated 2026-05-03)

`pv-pranali` already implements a LangGraph + MCP orchestration pipeline for
"PV Test Equipment Proposal" — generating procurement specifications for test
equipment by orchestrating ShilpaSutra (parametric CAD), Antaryami-OS
(organizational approval workflows), and other agents. The proposed paper extends
this graph by adding a **test execution** branch: instead of stopping at the
procurement proposal, the graph continues into Surya Yantra's REST API to execute
the test and retrieve the results.

### 4.3 SolarLabX (last updated 2026-03-25)

`SolarLabX` provides the LIMS + QMS + audit trail layer that wraps around Surya
Yantra. The integration architecture positions SolarLabX as the **management
layer** (personnel competence, calibration schedules, SOPs), Antaryami-OS as the
**work-order layer**, pv-pranali as the **orchestration layer**, and Surya Yantra
as the **instrument layer**. Together, the four repos form a complete,
AI-driven PV laboratory automation stack.

---

## 5. Ideation → Implementation Diagram

```mermaid
flowchart TD
    I1["💡 Idea\n'Can AI drive the whole lab pipeline\nfrom work order to report?'"]
    --> D1["Architecture Sketch\n3-layer stack:\nAntaryami-OS → pv-pranali → Surya Yantra"]
    --> D2["Interface Contract\nSurya Yantra REST API (docs/API.md)\nAntaryami-OS work-order schema\npv-pranali MCP tool surface"]
    --> D3["LangGraph Graph Design\n10-node state machine\n(§2.2 above)"]
    --> D4["MCP Tool Implementation\n6 surya_yantra__ tools wrapping\nthe Surya Yantra REST API"]
    --> D5["Integration Testing\nEnd-to-end: work order → SCPI sweep\n→ IEC correction → PDF report"]
    --> D6["Latency Measurement\nOrchestration latency benchmark\n(TODO: lab commissioning)"]
    --> D7["Failure Mode Analysis\nPartial batch failure,\nrelay self-test error handling"]
    --> D8["Paper Writing\nArchitecture + results\n→ Applied Sciences / IEEE TIM"]

    subgraph "Blocking (open)"
        B1["Antaryami-OS API docs\n(work-order endpoint)"]
        B2["pv-pranali graph topology\n(not yet public)"]
        B3["Latency benchmark\n(lab commissioning)"]
    end

    D4 -.->|"blocked"| B1
    D4 -.->|"blocked"| B2
    D6 -.->|"blocked"| B3
```

---

## 6. Proposed Experiments

1. **Correctness test**: Feed 10 natural-language work orders of increasing
   complexity to the LangGraph graph; measure how many produce the correct
   sequence of REST calls (ground truth: manually authored call sequences).

2. **Latency test**: Measure wall-clock time from work-order JSON submission
   to first SCPI `MEAS:MPPSCAN:EXEC` command on the wire (target: < 30 s).

3. **Failure injection**: Deliberately fail the `POST /api/mux/:bedId/connect`
   call at step 3 of 10; verify that the graph routes to the error-handling
   subgraph and marks the work-order as `PARTIAL_FAILURE` in Antaryami-OS.

4. **Traceability audit**: Verify that the final `Report` PDF carries the
   Antaryami-OS work-order ID and operator ID in its metadata section.

---

## 7. References (seed — to be expanded)

1. LangGraph documentation. *LangGraph: A library for building stateful,
   multi-actor applications with LLMs.*
   [https://langchain-ai.github.io/langgraph/](https://langchain-ai.github.io/langgraph/)

2. Anthropic (2024). *Model Context Protocol — Open standard for LLM tool
   access.* [https://modelcontextprotocol.io](https://modelcontextprotocol.io)

3. IEC 60891:2021 — Photovoltaic devices — Procedures for temperature and
   irradiance corrections to measured I-V characteristics.
   [https://webstore.iec.ch/publication/66244](https://webstore.iec.ch/publication/66244)

4. ISO 17025:2017 — General requirements for the competence of testing and
   calibration laboratories. ISO, Geneva.

5. *(TODO: prior work on AI-driven laboratory automation)*

6. *(TODO: pv-pranali paper or citation if published)*
