# Research Article Seeds — 2026-06-24

> Weekly Tuesday ideation run. Linking Srishti Lab ecosystem engineering
> progress to publishable research narratives.
>
> Sibling-repo commit access is restricted to `surya-yantra` in CI; seeds
> are based on repo descriptions, open-issue counts, and architecture visible
> in this repository.

---

## Seed 1 — IV Curve Tracing as a LIMS Primitive

**Working title:** "From Relay Click to Research Record: Building a Traceable
IV-Measurement Pipeline on Top of IEC 60891"

**Narrative hook:**
Every PV module measurement that Surya Yantra captures — an IV sweep at
824 W/m² on a bifacial TOPCon unit — is meaningless without a traceable chain
from raw SCPI data through spectral correction to a lab-information record.
SolarLabX already provides the LIMS shell (QMS, audit trail, SOP generation);
Surya Yantra provides the instrument layer. This article maps the exact data
handoff: which JSON fields cross the boundary, which IEC standard governs each
transform, and why the `POST /api/measurements/:id/correct` pipeline is the
natural seam between instrument and system.

**Target:** Solar Energy journal / arXiv cs.SY

**Audience:** PV lab engineers, LIMS architects, IEC 60891 implementers.

**Proposed sections:**
1. The SCPI-to-JSON bridge (ESL-Solar 500 → `IVMeasurement` record)
2. IEC 60891 P1/P2 as data transforms, not black boxes
3. SMMF and IAM as pre-correction gates (failure → HTTP 422, not silent pass)
4. Handoff schema: what SolarLabX ingests from Surya Yantra
5. Traceability chain: sensor calibration → correction → signed PDF report

**Linked repos:** `surya-yantra` (instrument layer), `SolarLabX` (LIMS)

**Content gaps to resolve before drafting:**
- [ ] Confirm SolarLabX ingestion schema (blocked: repo access restricted)
- [ ] Add sequence diagram: relay switch → SCPI sweep → correction → record
- [ ] Cite IEC 62446-1:2016 for traceability requirements

---

## Seed 2 — Multiplexed 75-Module Testing: A Real-Time Scheduling Problem

**Working title:** "Scheduling 75 Solar Modules Through One Electronic Load:
A Constraint-Satisfaction Approach to MUX Matrix Management"

**Narrative hook:**
A 300-relay matrix that can connect any of 75 PV modules to a single ESL-Solar
500 is trivially described as a multiplexer — but the scheduling problem hidden
inside it is non-trivial. Which module goes next? How do you prevent arc events
when relay transitions happen while residual charge remains? How do you keep
environmental-sensor timestamps inside the IEC 60891 validity window
(`|ΔG| ≤ 200 W/m²`, `|ΔT| ≤ 10 K`) across a multi-hour run? The Antaryami
orchestration layer is the natural solver host; Surya Yantra's MUX API is the
actuator.

**Target:** IEEE Transactions on Industrial Informatics / internal tech report

**Audience:** Solar test engineers, embedded-systems developers,
AI-for-science practitioners.

**Proposed sections:**
1. Constraint set (one ELOAD slot, relay arc safety, G/T validity window,
   calibration drift budget)
2. Formalising as CSP: variables, domains, hard vs. soft constraints
3. Antaryami as the solver host (tool-use agent over MUX API)
4. Prototype throughput: modules/hour before and after scheduling
5. Open problem: real-time re-scheduling on G/T excursion mid-run

**Linked repos:** `surya-yantra` (MUX actuator), `antaryami-os` (scheduler)

**Content gaps to resolve before drafting:**
- [ ] Instrument current throughput: modules swept per hour on a full 75-run
- [ ] Define arc-safety dwell time (firmware spec from `hardware/firmware/`)
- [ ] Confirm Antaryami tool-use interface for MUX API calls

---

## Editorial calendar placement

| Seed | Outline due | Draft due | Peer review | Publish target |
|------|-------------|-----------|-------------|----------------|
| 1 — LIMS Primitive | 2026-06-29 (Mon) | 2026-07-08 (Wed) | 2026-07-10 (Thu) | 2026-07-18 |
| 2 — CSP Scheduler  | 2026-07-06 (Mon) | 2026-07-15 (Wed) | 2026-07-17 (Thu) | 2026-07-25 |

---

## Directory structure TODO

This repo currently has no `drafts/` or `posts/` directories. Before the next
Monday outline session, create:

```
docs/
  drafts/          # work-in-progress articles (not published)
    YYYY-MM-DD-slug.md
  posts/           # published / publication-ready articles
    YYYY-MM-DD-slug.md
  ARTICLE-SEEDS.md # this file — updated weekly on Tuesdays
```

See GitHub issue filed alongside this PR for the full setup checklist.
