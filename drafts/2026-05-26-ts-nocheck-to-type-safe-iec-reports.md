---
title: "From @ts-nocheck to Type-Safe IEC Reports: Surgical TypeScript Hardening for PV Lab Software"
status: seed
date: 2026-05-26
weekly_angle: Tuesday (bulk-removal of stale/unsafe code)
target_venue: "Solar Energy / IEEE J. Photovoltaics (software practice section)"
target_length: "6–8 pages"
related_repos:
  - surya-yantra
  - SolarLabX
triggered_by: "SolarLabX PR — chore(bulk-removal): remove @ts-nocheck from export-utils.ts; fix docx ShadingType (2026-05-26)"
---

# SEED: From @ts-nocheck to Type-Safe IEC Reports: Surgical TypeScript Hardening for PV Lab Software

> **Status:** seed · **Date:** 2026-05-26 · **Weekly angle:** Tuesday (bulk-removal)
> **Triggered by:** SolarLabX Tuesday bulk-removal: `@ts-nocheck` removed from
> `export-utils.ts`; `ShadingType.SOLID` type fix in Word export; `children: any[]`
> replaced with precise docx union type. See SolarLabX branch `claude/stoic-gauss-ahyYS`.

---

## Core Narrative

PV lab management software (LIMS, IV tracers, reporting tools) increasingly
ships with `@ts-nocheck` suppressor comments inherited from rapid prototyping
sprints. These blanket suppressors mask **real type errors** that propagate into
IEC-mandated report artefacts — Word documents, PDFs, XLSX spreadsheets —
where field truncation or wrong type shapes may appear as silent data quality
failures during audits.

This paper documents the **surgical removal** of `@ts-nocheck` from the
SolarLabX LIMS export layer and the corresponding type-contract fixes, linking
each fix to its IEC audit relevance. The same methodology applies to Surya
Yantra's correction engine and report generation paths.

---

## 1. Introduction

### 1.1 The `@ts-nocheck` accumulation pattern
- Rapid prototyping → `@ts-nocheck` to ship; never removed before merge
- In scientific software, silent type coercions can corrupt numerical fields
  in exported measurement records
- IEC 61215:2021 §10.1 report templates require traceable, correct parameter
  values — wrong types in DOCX/XLSX fields violate this traceability chain

### 1.2 SolarLabX case study (2026-05-26)
- `export-utils.ts` carried `@ts-nocheck` masking two real type violations:
  1. `shading: { fill: "..." }` — missing required `type` field
     (`ITableCellShadingAttributesProperties.type = ShadingType.SOLID`)
  2. `children: any[]` — should be `Array<Paragraph | Table>` per docx API
- Neither error corrupted output visually, but violated the type contract
  and would have broken on a `docx` major version bump
- Removal methodology: enable strict checks incrementally → fix each error →
  verify output parity

### 1.3 Surya Yantra relevance
- `apps/web/lib/iec60891.ts`, `smmf.ts`, `iam.ts`: no `@ts-nocheck` (clean)
- Future `apps/desktop/relay/` service: must not carry suppressors as it
  will handle live SCPI command routing
- `packages/iv-engine/` (planned): strict mode from day 1 to prevent
  the SolarLabX accumulation pattern

---

## 2. Methodology: Surgical `@ts-nocheck` Removal

### 2.1 Triage: not all suppressors are equal
| Suppressor type | Risk | Removal strategy |
|-----------------|------|------------------|
| Entire-file `@ts-nocheck` | High | Incremental: enable checking, fix errors one-by-one |
| Per-line `@ts-ignore` | Medium | Evaluate each — is the error real or a TS limitation? |
| `as any` casts | Low-Medium | Replace with assertion functions or discriminated unions |

### 2.2 ShadingType fix (docx ITableCellShadingAttributesProperties)
```ts
// Before (masked by @ts-nocheck — type field missing):
shading: { fill: "2F5496" }

// After (type-safe):
import { ShadingType } from "docx";
shading: { type: ShadingType.SOLID, fill: "2F5496" }
```
**IEC relevance:** Header row background colour in IEC 60891 correction
summary tables — visual branding correctness, not measurement data.

### 2.3 Children type fix (Array union vs. `any[]`)
```ts
// Before:
const children: any[] = [];

// After:
import { Paragraph, Table } from "docx";
const children: Array<InstanceType<typeof Paragraph> |
                      InstanceType<typeof Table>> = [];
```
**IEC relevance:** Prevents non-docx objects being silently discarded when
building measurement report sections, which could omit correction results.

### 2.4 Verification: output parity test
- Generate Word report before and after fix
- Byte-level diff of `.docx` XML: no change to measurement data fields
- Visual inspection: header background and table structure identical
- TypeScript strict mode: 0 errors (was 2 masked by `@ts-nocheck`)

---

## 3. Type Safety Across the Surya Yantra → SolarLabX Pipeline

### 3.1 Shared type schema (planned: `packages/types/`)
- `IVPoint`, `IVCurve`, `CorrectionResult` — currently duplicated between
  `apps/web/lib/iec60891.ts` (Surya Yantra) and SolarLabX LIMS ingest
- Shared schema via `@srishti/types` package would make type errors
  at the integration boundary compile-time failures rather than runtime surprises

### 3.2 Correction result serialisation
- `CorrectionResult.deltaV` is `number` in Surya Yantra's Prisma schema
- SolarLabX imports this as a string in early versions (silent coercion)
- With strict types and shared schema: compile error forces explicit cast

### 3.3 Report template type validation
- Proposed: JSON Schema validation of the `CorrectionResult` record
  **before** it enters the Word/XLSX template pipeline
- Validates `gMeas > 0`, `tMeas` in [-40, 100], correction factors in [0.5, 2]
- Aligns with IEC 60891:2021 Annex B guidance on input range checks

---

## 4. Generalisation: A Checklist for PV Lab Software Type Safety

| Check | Surya Yantra | SolarLabX | Priority |
|-------|-------------|-----------|----------|
| No `@ts-nocheck` in lib/ | ✅ Clean | ✅ Fixed (2026-05-26) | P0 |
| No `@ts-nocheck` in report generators | ✅ N/A | ✅ Fixed | P0 |
| No `any[]` in report child arrays | ✅ N/A | ✅ Fixed | P1 |
| Shared `CorrectionResult` type | ❌ Planned | ❌ Planned | P1 |
| JSON Schema pre-validation of IEC data | ❌ Planned | ❌ Planned | P2 |
| Strict TypeScript (`strict: true`) | ✅ Yes | ❌ Check | P1 |

---

## 5. Related Work

> **CITATION NEEDED (≥ 3):**
> - [ ] Papers on type safety in scientific software (Python/TypeScript)
> - [ ] IEC 61215:2021 §10.1 report traceability requirements
> - [ ] TypeScript strict mode adoption practices in production codebases

---

## Open Action Items (Tuesday 2026-05-26)

- [ ] Verify SolarLabX `export-utils.ts` PR merges cleanly — no regressions
- [ ] Audit `apps/web` for any remaining `@ts-ignore` per-line suppressors
- [ ] Draft `packages/types/` schema (shared `CorrectionResult`, `IVCurve`)
- [ ] Propose JSON Schema pre-validation step for Wednesday enhancement pass
- [ ] Add ≥ 3 citations on type safety in scientific computing (Wednesday)
