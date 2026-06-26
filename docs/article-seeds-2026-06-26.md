# Article Seeds — 2026-06-26 (Thursday W26)

Two article seeds connecting today's engineering context to research narratives.
Cross-repo commit data is unavailable (MCP session is scoped to surya-yantra
only); seeds are grounded in public repo descriptions and the existing issue
trail.

---

## Seed A: IEC 60891 in Production: Four Correction Procedures in a 500-Test-Cycle Deployment

**One-line pitch**: After 500+ module tests at Srishti PV Lab (Jamnagar),
which IEC 60891 correction procedure is most accurate under Indian outdoor
conditions — and does the answer change with module technology?

**Research gap**: IEC 60891:2021 defines four procedures but gives no
guidance on when to prefer P1 vs P2 vs P4. Published comparisons use
simulated data or European climate conditions. India's high-aerosol,
high-irradiance-variability environment is unrepresented.

**Surya Yantra engineering hook**: The correction engine in
`apps/web/lib/iec60891.ts` implements all four procedures. Once the test bed
completes its commissioning cycle (~Q3 2026), it will generate the first
publicly available, IEC-validated comparison dataset from an Indian desert-
edge location.

**Proposed structure**:
1. Method comparison framework (theoretical accuracy bounds)
2. Experimental setup — 75-module array, 5 technology types (HJT, TOPCon,
   IBC, First Solar CdTe, Perovskite), 12-month campaign
3. Results: Pmpp deviation P1 vs P2 vs P4 stratified by ΔG/G and ΔT
4. Recommendation matrix: which procedure for which technology under which
   irradiance window

**Target journal**: Solar Energy (Elsevier), IF ~7. Alternatively Progress
in Photovoltaics for higher impact if novelty is confirmed.

**Blocking for submission**: Lab commissioning + ≥100 paired (P1, P2, P4)
test records. Currently 0 records on `main` branch.

**Estimated timeline**: Outline ready now. Bulk writing: Q4 2026 once data
is available. Submission target: Q1 2027.

---

## Seed B: Multi-Agent Orchestration for Solar PV Test Equipment Proposals: A LangGraph + MCP Case Study

**One-line pitch**: pv-pranali demonstrates that a Claude Code + MiMo
multi-agent system (antaryami-os, ShilpaSutra, SuryaPrajna, Vidyut-Srishti)
can generate accurate, standards-compliant PV test equipment proposals,
reducing turnaround from days to minutes.

**Research gap**: LLM-based multi-agent systems (LangGraph, CrewAI) are
widely studied for software tasks; their application to hardware procurement
and standards-compliance in specialised engineering domains is barely
explored.

**Surya Yantra engineering hook**: The pv-pranali orchestration system uses
surya-yantra's hardware BOM and SCPI driver specs as grounding data. The
proposal outputs name specific equipment (ESL-Solar 500, Omron G9EA-1-B
relays) and reference IEC standards — providing a measurable accuracy
baseline against the actual Srishti lab build.

**Proposed structure**:
1. System architecture: LangGraph agent graph, MCP tool definitions,
   WSL/tmux execution environment
2. Agent topology: antaryami-os (orchestrator), ShilpaSutra (CAD/CFD
   specifier), SuryaPrajna (power-electronics specifier), Vidyut-Srishti
   (electrical specifier)
3. Evaluation: BoM accuracy (part number match), IEC clause coverage,
   latency vs human expert
4. Failure modes: hallucinated part numbers, version-skewed standards

**Target journal**: IEEE Access (open, fast), or Applied Sciences (MDPI).
Conference track: IEEE PVSC 2027.

**Blocking for submission**: pv-pranali repo access + ≥10 end-to-end
proposal runs with expert evaluation. GitHub session is scoped to
surya-yantra only; requires separate access grant.

**Estimated timeline**: Outline ready now. Submission: Q2 2027 if evaluation
data is collected Q3–Q4 2026.

---

*Generated Thursday 2026-06-26 (W26). See `docs/peer-review-2026-06-26.md`
for the full peer-review checklist on the two active drafts.*
