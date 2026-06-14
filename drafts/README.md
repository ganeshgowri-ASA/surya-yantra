---
title: "Drafts Pipeline — Surya Yantra Research Articles"
last_updated: "2026-06-14"
---

# Drafts Pipeline

Working directory for research article drafts linked to engineering progress
across the Srishti PV Lab software ecosystem.

## Weekly cadence

| Day | Angle | Action |
|-----|-------|--------|
| Mon | Outline | Scaffold new article outlines from sibling-repo activity |
| Tue | Bulk removal | Close stale drafts (> 30 days without progress) |
| Wed | Enhancement | Add references, fill sections, cite standards |
| Thu | Peer review | Apply checklist from `docs/PEER-REVIEW-CHECKLIST.md` |
| Fri | Polish | Publication-ready final pass; add ideation→implementation diagram |
| Sat | SEO/Metadata | YAML front-matter, keywords, canonical URL, OG image |
| Sun | Roadmap | Ecosystem status, Q3/Q4 targets, cross-repo narrative |

## Staleness rule

A draft is **stale** if it has not been edited in 30 days AND has no
associated GitHub issue marked `in-progress`. Stale drafts are moved to
`drafts/_archive/` on Tuesday.

## Promotion checklist (draft → posts/)

- [ ] All TODOs resolved or replaced with explicit citations
- [ ] Abstract ≤ 250 words
- [ ] Peer-review checklist PASS (all 17 criteria)
- [ ] ≥ 8 DOI-verified references
- [ ] SEO front-matter complete (title, description, keywords, canonical, og_image)
- [ ] Ideation→implementation Mermaid diagram included
- [ ] No stale model references (`claude-opus-4-8` is current as of 2026-06-14)

## Article status tracker

| File | Title (short) | Status | Target venue | Blocker |
|------|---------------|--------|-------------|---------|
| `2026-06-14-roadmap-q3-2026.md` | Srishti Ecosystem Q3 Roadmap | outline | internal | — |
| `2026-06-14-ts-safety-iec-pv-reporting.md` | TypeScript Safety & IEC PV Reports | outline | J. Open Source Software | lab benchmarks |
| `2026-06-14-unified-solar-ecosystem.md` | Unified Solar PV Lab Automation Stack | outline | Solar Energy | integration work |
