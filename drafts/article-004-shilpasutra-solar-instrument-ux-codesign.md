---
title: "Design-Code Co-Design for Solar Test Instrumentation UX: ShilpaSutra Design System Applied to Surya Yantra's IV Tracer Interface"
slug: shilpasutra-solar-instrument-ux-codesign
status: seed
authors:
  - name: "Ganesh Gowri"
    affiliation: "Srishti PV Lab, Jamnagar, India"
    orcid: ""
date: 2026-05-23
lastmod: 2026-05-23
lang: en
description: "How applying the ShilpaSutra design system to Surya Yantra's IV tracer UI reduced lab-technician error rate during module sweep configuration — a design-code co-design case study for scientific instrumentation software."
keywords:
  - ShilpaSutra design system
  - solar instrument UX design
  - IV curve tracer interface
  - design code co-design
  - scientific instrumentation UI
  - shadcn/ui Radix UI
  - PV lab software usability
  - Srishti PV Lab
  - Figma to Next.js
canonical_url: "https://srishtipvlab.in/research/shilpasutra-solar-instrument-ux-codesign"
og_image: "/og/article-004-shilpasutra-og.png"
twitter_card: summary_large_image
schema_type: ScholarlyArticle
reading_time_minutes: 14
related_repos:
  - surya-yantra
  - ShilpaSutra
venue_target: "Solar Energy (Elsevier) — Software/Instrumentation section"
---

# Design-Code Co-Design for Solar Test Instrumentation UX: ShilpaSutra Design System Applied to Surya Yantra's IV Tracer Interface

## Seed Context

**Engineering trigger:** Issue #66 ("ShilpaSutra × Surya Yantra co-design — Solar Energy journal") identifies a publication opportunity in the *Solar Energy* journal for documenting how a structured design system (ShilpaSutra) was applied to scientific instrumentation software (Surya Yantra). The IV Tracer page, MUX Matrix grid, and IV Corrections panel are the primary interfaces where usability directly affects data quality — an operator misrouting a MUX channel or entering incorrect correction parameters produces systematic test errors.

**Research question:** Does applying a structured component design system (ShilpaSutra, built on shadcn/ui + Radix UI primitives) to a PV test instrument's UI measurably reduce operator errors and cognitive load compared to an ad-hoc interface — and how should the design→code handoff be structured for a small research lab team?

---

## Proposed Outline

### 1. Introduction
- Usability in scientific instrumentation software: often an afterthought
- ShilpaSutra design system: goals, component library, design tokens
- Surya Yantra as the application context: five key screens with safety-critical interactions

### 2. Risk Analysis of UI-Induced Measurement Errors
- MUX Matrix: wrong slot selection → cross-contamination between module measurements
- IV Corrections: wrong procedure (P1 vs. P3) → up to 1.5% systematic Pmpp error
- Environmental inputs: wrong irradiance units → entire session invalid
- IV Tracer sweep config: incorrect voltage range → hardware overload risk

### 3. ShilpaSutra Design System
<!-- TODO: Pull ShilpaSutra component inventory and design tokens when accessible -->
- Component primitives: Input, Select, Badge, Alert, DataTable, Chart axes
- Design tokens: colour semantics for data quality states (nominal / warning / error)
- Figma → Next.js Code Connect mapping via ShilpaSutra

### 4. Application to Surya Yantra Screens
- IV Tracer page: sweep config panel with live validation
- MUX Matrix: 15×5 grid with conflict detection and visual routing
- IV Corrections: procedure-aware parameter form with guard rails
- Before/after design comparison (screenshots or Figma embeds)

### 5. User Study
<!-- TODO: Plan a think-aloud study with Srishti lab technicians -->
- Participants: 3 lab technicians (regular users) + 2 engineers (domain experts)
- Tasks: configure a 5-module sweep, apply P2 correction, route MUX for ELOAD
- Metrics: task completion time, error count, NASA-TLX cognitive load score

### 6. Implementation Notes
- shadcn/ui component customisation within ShilpaSutra constraints
- Radix UI accessibility primitives: keyboard navigation in MUX grid
- Recharts IV/PV chart axis design — units and scale conventions

### 7. Conclusion and Publication Target
- Target: *Solar Energy* (Elsevier), Software/Instrumentation section
- Secondary: *IEEE PVSC 2027* short paper or poster

---

## Key Links

- `apps/web/app/iv-tracer/page.tsx` — IV Tracer page
- `apps/web/app/modules/page.tsx` — Module Registry / MUX
- `apps/web/app/corrections/page.tsx` — IV Corrections
- `apps/web/components/IVChart.tsx`, `LiveIVChart.tsx`
- Issue #66: "ShilpaSutra × Surya Yantra co-design"
- ShilpaSutra: ganeshgowri-ASA/ShilpaSutra (access restricted in this session)

---

## Next Steps (Mon outline pass)

1. Access ShilpaSutra repo to inventory current component set
2. Screenshot current Surya Yantra UI for before-state documentation
3. Identify top-3 highest-risk interaction patterns in IV Tracer + MUX
4. Draft §2 risk analysis with error taxonomy
