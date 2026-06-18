# From Natural Language Work Order to SCPI Command: MCP-Orchestrated AI Pipeline for Automated Solar PV IV Testing

**Status:** outline — Wednesday W26 seed  
**Target venue:** IEEE Access (open access, broad scope) or MDPI Applied Sciences  
**Estimated submission:** Q4 2026  
**Related issues:** #164 (MCP tool surface), #173 (MUX/Environmental pages), #174 (health endpoint), #179 (WebSocket auth — security prerequisite)  
**Companion repo hook:** antaryami-os (work-order source) · pv-pranali (LangGraph orchestrator)

---

## Abstract (draft)

The integration of large language models (LLMs) into laboratory automation introduces
a new class of human-machine interface: natural language work orders that must be
translated reliably and safely into low-level instrument commands. This paper
presents a three-tier MCP-orchestrated AI pipeline for fully automated solar PV
IV curve testing: Antaryami-OS generates structured work orders from natural
language lab requests; pv-pranali (LangGraph + Model Context Protocol) decomposes
and routes work orders to Surya Yantra's REST API; Surya Yantra closes relays,
triggers SCPI sweeps on the ESL-Solar 500 electronic load, and applies
IEC 60891:2021 corrections. We evaluate the pipeline on 10 canonical work-order
templates, reporting end-to-end latency (target: < 30 s work-order-to-SCPI),
orchestration correctness (pass/fail on IEC measurement integrity checks), and
traceability (ISO 17025 §7.9 audit trail). Safety interlocks — MUX single-ELOAD
exclusion, HMAC-signed relay commands, WebSocket auth gating — are described and
verified through fault-injection tests. We discuss the role of the MCP tool surface
in making the Surya Yantra REST API discoverable and callable by LLM agents.

**Keywords:** MCP; Model Context Protocol; LangGraph; PV testing; SCPI; lab automation; AI; IV curve; IEC 60891; ISO 17025

---

## 1. Introduction

### 1.1 Motivation

- Solar PV test throughput bottleneck: human operator required for every sweep selection and report sign-off
- Antaryami-OS: enterprise AI operating system for structured workflow management (ganeshgowri-ASA/antaryami-os)
- Gap: no published end-to-end pipeline from NL work order to physical instrument command in a PV lab context
- MCP (Anthropic, 2024) enables LLM agents to discover and invoke structured tool surfaces [ref: MCP spec]

### 1.2 System overview

```
Lab operator / ERP
      │ natural language work order
      ▼
Antaryami-OS (enterprise AI OS)
      │ structured WorkOrder JSON
      ▼
pv-pranali LangGraph orchestrator (MCP client)
      │ MCP tool calls
      ▼
Surya Yantra MCP tool surface (6 tools)
      │ REST API calls
      ▼
Surya Yantra web app (Next.js / Vercel)
      │ SCPI + Modbus over Cloudflare Tunnel
      ▼
ESL-Solar 500 + MUX relay matrix (Jamnagar lab)
```

### 1.3 Paper contributions

1. First published integration of Model Context Protocol with a physical PV IV test instrument
2. Six-tool MCP surface design for `@surya-yantra/*` (issue #164)
3. Safety-first design: MUX ELOAD interlock, HMAC auth, WebSocket gating
4. End-to-end latency and correctness benchmark (10 NL work-order templates)
5. Traceability audit: ISO 17025 §7.9 requirement satisfaction with AI-generated reports

---

## 2. Background

### 2.1 Model Context Protocol (MCP)

- Anthropic MCP specification (2024): tool definition, discovery, invocation
- MCP vs. plain function calling: schema-first, server-hosted, discoverable at runtime
- pv-pranali uses LangGraph + MCP client to build multi-step instrument-control agents
- [TODO: cite MCP spec paper/doc URL from Anthropic]

### 2.2 LangGraph multi-agent framework

- LangGraph: stateful, graph-based orchestration for LLM agents (LangChain, 2023) [ref needed]
- pv-pranali architecture: StateGraph with nodes for work-order parsing, MUX slot selection, sweep execution, correction, report generation
- Interrupt-and-resume pattern for operator approval of high-voltage operations

### 2.3 Antaryami-OS work-order model

- antaryami-os: enterprise-grade organisational AI OS (ganeshgowri-ASA/antaryami-os, 188 open issues)
- WorkOrder schema: `{moduleIds[], testBedId, correctionProcedure, targetConditions, reportFormat}`
- Role-based access: lab manager vs. operator vs. read-only auditor
- [TODO: confirm WorkOrder schema with antaryami-os repo — last commit 2026-05-10]

### 2.4 Safety considerations for AI-controlled instruments

- Relay hot-swap risk: MUX must sequence SOUR OFF → relay switch → SOUR ON
- ELOAD single-active interlock: server-enforced 409 Conflict on double-connect
- WebSocket auth gap (issue #179): `/api/ws` currently unauthenticated — prerequisite fix before deployment
- HMAC-signed commands: shared secret between Vercel and lab relay service (issue #186)

---

## 3. MCP Tool Surface Design

### 3.1 The six tools (issue #164)

| Tool name | HTTP mapping | Safety note |
|-----------|-------------|-------------|
| `surya_yantra__list_modules` | `GET /api/modules` | Read-only |
| `surya_yantra__get_mux_status` | `GET /api/mux/:bedId` | Read-only |
| `surya_yantra__create_session` | `POST /api/sessions` | Requires operator role |
| `surya_yantra__start_session` | `POST /api/sessions/:id/start` | Requires operator role; triggers SCPI |
| `surya_yantra__correct_measurement` | `POST /api/measurements/:id/correct` | IEC 60891 pipeline |
| `surya_yantra__create_report` | `POST /api/reports` | ISO 17025 report signing |

### 3.2 Tool schema design principles

- Idempotent where possible: `correct_measurement` is safe to retry
- Dangerous actions require explicit confirmation field (`"confirmed": true`)
- All tools return `req_id` for ISO 17025 audit trail linkage

### 3.3 Auto-discovery endpoint

```
GET /api/mcp/tools  →  JSON array of MCP tool definitions
```

pv-pranali agent calls this at startup, enabling zero-config tool registration.

---

## 4. Pipeline Execution Walkthrough

### 4.1 Step-by-step trace for "Sweep Row 3, P2 correction, PDF report"

1. Antaryami-OS parses NL: `"sweep all modules in row 3, apply P2 correction, generate NABL-style PDF report"`
2. LangGraph node `parse_work_order`: emits `{moduleIds: [31..35], procedure: "IEC60891_P2", reportFormat: "pdf"}`
3. Node `check_mux`: calls `surya_yantra__get_mux_status` → verifies slots 31–35 are OPEN
4. Node `create_session`: calls `surya_yantra__create_session` with sweep parameters
5. Node `await_operator_approval` (interrupt): pauses for human confirmation of high-voltage operation
6. Node `start_session`: calls `surya_yantra__start_session` → SCPI sweep begins
7. Node `apply_correction`: loops over measurements, calls `surya_yantra__correct_measurement`
8. Node `generate_report`: calls `surya_yantra__create_report` → signed PDF with `uExpandedPct`

### 4.2 Latency decomposition (estimated)

| Step | Estimated duration |
|------|-------------------|
| NL parsing (Claude Sonnet) | 1–2 s |
| MUX status check | < 0.5 s |
| Session creation + start | < 1 s |
| SCPI sweep (5 modules × 5 s) | 25 s |
| IEC correction (5 modules) | < 2 s |
| Report PDF generation | 2–3 s |
| **Total (excl. operator pause)** | **~32 s** |

Target < 30 s requires overlapping correction with sweep; feasible with streaming.

---

## 5. Safety and Security

### 5.1 MUX ELOAD interlock

- Firmware enforces single-ELOAD-at-a-time; server re-enforces with 409 Conflict
- pv-pranali agent designed to never call `start_session` without prior MUX status check

### 5.2 HMAC authentication

- Relay service (`apps/desktop/relay`, issue #186) and Vercel web app share a secret
- All relay commands carry `X-SY-Signature: HMAC-SHA256(body, secret)`
- Prevents replay attacks from Cloudflare Tunnel exposure

### 5.3 WebSocket auth (open gap)

- Issue #179: `/api/ws` currently has no auth
- `requireAuth()` in `apps/web/lib/api-auth.ts` must be implemented before public deployment
- pv-pranali agent must include session token in Socket.IO handshake

---

## 6. Evaluation

### 6.1 Experiment design

- 10 canonical NL work-order templates (simple, compound, edge-case)
- Metrics: (1) parse success rate, (2) instrument command accuracy, (3) end-to-end latency, (4) IEC measurement integrity (correct procedure applied), (5) ISO 17025 traceability score
- Fault injection: double-connect attempt, bad module ID, sweep abort mid-run

### 6.2 Preliminary results

[TODO: run experiments on lab hardware — blocked on issue #179 (auth) and #186 (relay service)]

### 6.3 Comparison with manual operation

[TODO: time-and-motion study of manual vs. AI-orchestrated workflow]

---

## 7. Discussion

- LLM non-determinism: structured output parsing with Zod schema validation mitigates hallucination risk
- MCP as a safety boundary: tools are the only contact surface; raw SCPI not exposed to the LLM
- Scalability to 75 modules: session batching, parallel MUX switching (future work)
- Open-source: full pipeline code in `ganeshgowri-ASA/surya-yantra` + `ganeshgowri-ASA/pv-pranali`

---

## 8. Conclusion

[TODO: write after evaluation section is complete]

---

## References

1. Anthropic (2024). *Model Context Protocol specification*. [TODO: add official URL when published]
2. LangChain Inc. (2023). *LangGraph: Building Stateful, Multi-Actor Applications with LLMs*. [TODO: add arXiv or docs URL]
3. IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and irradiance corrections to measured I-V characteristics*. Edition 3.0. Geneva: IEC.
4. ISO/IEC 17025:2017, *General requirements for the competence of testing and calibration laboratories*. Edition 3.0. Geneva: ISO/IEC. (§7.9 complaints; §7.8 reporting of results including measurement uncertainty.)
5. ET SolarPower, *ESL-Solar 500 Electronic Load User Manual*, v1.12, 2024.
6. Jones M. et al. (2015). *JSON Web Token (JWT)*. RFC 7519. IETF. (HMAC-signed bearer token scheme.)
7. Brown T. et al. (2020). Language models are few-shot learners. In *NeurIPS 2020*. https://doi.org/10.48550/arXiv.2005.14165 (Background on LLM capability for structured instruction following.)
8. [TODO: cite antaryami-os tech report or GitHub repo DOI when available]
9. [TODO: cite pv-pranali LangGraph + MCP architecture paper or README when available]
10. IEC 62446-1:2016, *Grid-connected photovoltaic systems — Minimum requirements for system documentation, commissioning tests and inspection*. Edition 1.0. Geneva: IEC.
