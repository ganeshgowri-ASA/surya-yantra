# Surya Yantra — Research Articles Content Roadmap

**Updated: 2026-06-08 (Sunday — weekly angle: roadmap)**

This document is the single source of truth for the research article pipeline
across Surya Yantra and its sister repositories. Updated every Sunday.

---

## Ideation → Implementation → Publication Pipeline

```
  Cross-repo activity              Article lifecycle
  (commits, PRs, issues)
         │
         ▼
  ┌─────────────┐     Mon/Sun    ┌───────────────────────────────────────────────┐
  │   Ideation  │ ─────────────► │  seed  →  draft  →  review  →  ready  →  pub │
  │  Engineering│               └───────────────────────────────────────────────┘
  │   signals   │                   Tue-Wed    Thu      Fri        Sat+
  └─────────────┘
         │
  ┌──────┴──────────────────────────────────────────────┐
  │  Sister repos checked each session:                 │
  │  antaryami-os · GanitaSutra · ShilpaSutra ·         │
  │  SolarLabX · pv-pranali · GanitaSutra-v0            │
  └─────────────────────────────────────────────────────┘
```

### Stage Definitions

| Stage | Criteria | Word count |
|-------|----------|-----------|
| `seed` | Engineering anchor + next-steps checklist | 400–800 |
| `draft` | All sections complete, no open `[ ]` items | 800–2 000 |
| `review` | Peer-review checklist complete, waiting sign-off | any |
| `ready` | Full SEO front matter, DOI citations, ideation diagram if applicable | any |
| `published` | Moved to `posts/`, announced | any |

### Weekly Angle Schedule

| Day | Focus |
|-----|-------|
| Mon | Outline — 2 new article outlines seeded |
| Tue | Bulk-removal — audit seeds >30 days stale |
| Wed | Enhancement — add references, citations, cross-links |
| Thu | Peer-review checklist pass |
| Fri | Publication-ready polish + ideation→implementation diagram |
| Sat | SEO / metadata pass |
| Sun | Roadmap update (this file) |

---

## Q3 2026 Publication Plan

### Week 24 (June 8–14): Security & Hardware Foundation

| Day | Article | Status | Action |
|-----|---------|--------|--------|
| Mon | antaryami-os PV autonomy (2026-06-08) | seed | → draft |
| Tue | pv-pranali multi-agent (2026-06-08) | seed | flesh out |
| Wed | Zero-Trust API (2026-06-07): add IEC 62443 references | seed | → draft |
| Thu | ShilpaSutra fixture CAD (2026-06-07): peer-review checklist | seed | → review |
| Fri | Zero-Trust API: publish to `posts/` | review | → published |
| Sat | ShilpaSutra CAD: SEO pass | draft | → ready |
| Sun | Roadmap update | — | update this file |

### Week 25 (June 15–21): GanitaSutra × IEC Corrections

| Target | Title | Repo anchor |
|--------|-------|-------------|
| Article A | GanitaSutra SimuFlow as an IEC 60891 Block Diagram Engine | GanitaSutra + surya-yantra |
| Article B | Browser-Native Spectral Mismatch with GanitaSutra PlotEngine | GanitaSutra + IEC 60904-7 |

### Week 26 (June 22–28): pv-pranali Multi-Agent Series

| Target | Title | Repo anchor |
|--------|-------|-------------|
| Article A | pv-pranali Architecture: LangGraph + MCP for PV Proposals | pv-pranali |
| Article B | Claude Code + MiMo on WSL: Practical Multi-Agent PV Automation | pv-pranali + antaryami-os |

### Week 27 (June 29 – July 5): SolarLabX × Surya Yantra Integration

| Target | Title | Repo anchor |
|--------|-------|-------------|
| Article A | From Sample to Report: SolarLabX × Surya Yantra End-to-End | SolarLabX + surya-yantra |
| Article B | Uncertainty Budget for a 75-Module PV Test Bed (IEC 60904-1) | SolarLabX + surya-yantra |

### Week 28 (July 6–12): ShilpaSutra Hardware Design Series

| Target | Title | Repo anchor |
|--------|-------|-------------|
| Article A | AI-Parametric 75-Module 4-Wire Kelvin Fixture (from 2026-06-07 seed) | ShilpaSutra |
| Article B | FEM Wind Load Verification for IS 875 Zone III: Jamnagar Lab Rack | ShilpaSutra |

### Evergreen (publish any week)

| Title | Repo | Notes |
|-------|------|-------|
| IEC 60891:2021 Procedures 1–4 — A Practitioner's Guide | surya-yantra | Expand IEC-CORRECTIONS.md |
| 4-Wire Kelvin Sensing for PV Modules: Why It Matters | surya-yantra | Hardware deep-dive |
| WebSocket Real-Time IV Streaming: Architecture Notes | surya-yantra | Expand API.md WS section |
| Zero-Trust for Hardware-Coupled APIs (IEC 62443) | SolarLabX + surya-yantra | From 2026-06-07 seed |

---

## Article Status Tracker (as of 2026-06-08)

| Date seeded | Slug | Status | Target publish |
|-------------|------|--------|----------------|
| 2026-06-08 | antaryami-os-pv-lab-autonomy | seed | W24 Fri |
| 2026-06-08 | pv-pranali-multiagent-architecture | seed | W26 |
| 2026-06-08 | srishti-q3-2026-research-roadmap | seed | ongoing |
| 2026-06-07 | zero-trust-api-solar-lab | seed | W24 Fri |
| 2026-06-07 | shilpasutra-pv-test-fixture-cad | seed | W28 |

> Articles from 2026-06-07 live on branch `claude/wizardly-lovelace-s1h8h`
> (PR #150). The five articles above are on this branch (`claude/wizardly-lovelace-RcWoK`, PR #151).

---

## Infrastructure Priorities

| Priority | Item | Issue | Target |
|----------|------|-------|--------|
| P0 | Auth middleware on all hardware-facing API routes | see Zero-Trust article | Before production |
| P1 | `hardware/schematics/` directory scaffold | filed | W28 |
| P1 | IEC citation DOI links in IEC-CORRECTIONS.md | filed | W25 |
| P2 | PR merge policy — 30+ open editorial PRs | filed | W24 |
| P3 | CI linkcheck (`lychee`) for BOM vendor URLs | — | W27 |
| P3 | MCP server for Surya Yantra (for pv-pranali integration) | — | W26 |

---

## Vercel Deployment Status

| Branch | State | Last deployed |
|--------|-------|---------------|
| `claude/wizardly-lovelace-s1h8h` (PR #150) | READY ✅ | 2026-06-07 (Saturday) |
| `claude/wizardly-lovelace-0OfHw` (PR #148) | READY ✅ | 2026-06-06 (Friday) |
| `main` | Not separately deployed (preview only) | — |

*Main branch has no standalone Vercel deployment — all deployments are preview
builds from feature/editorial branches.*

---

## Cross-Repo Seeding Schedule

| Repo | Focus area | Check frequency |
|------|-----------|-----------------|
| antaryami-os | AI OS patterns, orchestration | Weekly |
| GanitaSutra | Math toolbox features, SimuFlow | Weekly |
| ShilpaSutra | CAD/CFD features, unit tests | Bi-weekly |
| SolarLabX | LIMS/QMS, auth hardening | Bi-weekly |
| pv-pranali | Multi-agent architecture | Monthly |
| GanitaSutra-v0 | Track via PR activity (private) | Monthly |

*Updated: 2026-06-08 — Next update: 2026-06-15*
