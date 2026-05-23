---
title: "Shared Numerical Integration Primitives for PV Correction Pipelines: Extracting @srishti/numerics from Surya Yantra and GanitaSutra-v0"
slug: ganitasutra-numerics-pv-correction-pipeline
status: seed
authors:
  - name: "Ganesh Gowri"
    affiliation: "Srishti PV Lab, Jamnagar, India"
    orcid: ""
date: 2026-05-23
lastmod: 2026-05-23
lang: en
description: "Design proposal and implementation roadmap for extracting shared trapezoidal integration, spectral interpolation, and grid-union primitives from Surya Yantra and GanitaSutra-v0 into a published @srishti/numerics monorepo package."
keywords:
  - GanitaSutra numerical integration
  - PV spectral mismatch computation
  - TypeScript monorepo package extraction
  - IEC 60904-7 trapezoidal integration
  - open-source solar software
  - @srishti/numerics
  - WASM browser computation
  - Turborepo monorepo
canonical_url: "https://srishtipvlab.in/research/ganitasutra-numerics-pv-correction-pipeline"
og_image: "/og/article-003-ganitasutra-og.png"
twitter_card: summary_large_image
schema_type: TechReport
reading_time_minutes: 12
related_repos:
  - surya-yantra
  - GanitaSutra-v0
---

# Shared Numerical Integration Primitives for PV Correction Pipelines: Extracting @srishti/numerics from Surya Yantra and GanitaSutra-v0

## Seed Context

**Engineering trigger:** Article-001 §6.3 identifies code duplication between `apps/web/lib/smmf.ts` (Surya Yantra) and GanitaSutra-v0's planned numerical computation layer. Specifically, `trapz`, `unionGrid`, and `interpolate` functions implementing IEC 60904-7 spectral integration are currently private to the web app, yet they solve a general scientific computing problem that GanitaSutra-v0 targets.

**Research question:** What is the minimal, well-specified API surface for a shared `@srishti/numerics` package that satisfies both the PV correction pipeline (Surya Yantra) and the broader scientific computing goals of GanitaSutra-v0 — without introducing an over-engineered abstraction?

---

## Proposed Outline

### 1. Introduction
- Code duplication risk in monorepo ecosystems
- IEC 60904-7 spectral integration as the motivating use case
- GanitaSutra-v0 design goals and overlap with Surya Yantra needs

### 2. Current Implementation in Surya Yantra
- `trapz(grid, y)` — trapezoidal rule over arbitrary x-grid
- `unionGrid(...series)` — sorted union of wavelength arrays
- `interpolate(series, targetGrid)` — linear interpolation with zero-padding outside domain
- Vitest test coverage (current: partial)

### 3. GanitaSutra-v0 Integration Surface
<!-- TODO: Pull GanitaSutra-v0 public API when accessible; cross-reference issue #61 (Extract shared packages) -->
- Planned `@srishti/numerics` package scope
- WASM compilation target for browser use
- Version compatibility with Surya Yantra's Next.js 14 build

### 4. Extraction Plan
- Turborepo workspace: add `packages/numerics/`
- Expose ESM + CJS + type definitions
- CI: run Vitest + Bun test in both consumers
- Migration: update `lib/smmf.ts` import path

### 5. Benchmarks
- Node.js vs. WASM performance on 1700-point AM1.5G spectrum (IEC 60904-3)
- Memory allocation profile: pre-allocated Float64Array vs. generic number[]

### 6. Conclusion and Publication Target
- Target: *Journal of Open Source Software* (JOSS) — short software paper
- Secondary: GanitaSutra-v0 release notes + Surya Yantra CHANGELOG

---

## Key Links

- `apps/web/lib/smmf.ts` — current implementation to be extracted
- `apps/web/__tests__/lib/smmf.test.ts` — existing Vitest tests
- Issue #61: "Extract shared packages from apps/web/lib into monorepo packages/"
- Issue #71: "chore: scaffold missing packages/ monorepo subpackages"
- GanitaSutra-v0: ganeshgowri-ASA/GanitaSutra-v0 (access restricted in this session)

---

## Next Steps (Mon outline pass)

1. Clone GanitaSutra-v0 and audit its current numerical module API
2. Write a draft API specification for `@srishti/numerics` v0.1
3. Scaffold `packages/numerics/` under Turborepo
4. Move `trapz`, `unionGrid`, `interpolate` with their tests
