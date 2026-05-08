---
title: "Documentation as a First-Class Deliverable: How Srishti PV Lab's GitHub Peer-Review Workflow Prepares for NABL Accreditation"
seo_title: "NABL Accreditation Prep: GitHub Peer-Review Documentation Workflow | Srishti PV Lab"
description: "How treating lab documentation as versioned, peer-reviewed artefacts — managed through GitHub PRs, weekly content audits, and structured checklists — maps directly onto NABL 121's measurement traceability requirements."
keywords:
  - NABL accreditation PV lab
  - documentation peer review
  - NABL 121 solar testing
  - ISO 17025 documentation
  - GitHub documentation workflow
  - PV lab quality management
  - measurement traceability
  - open source lab accreditation
  - India solar lab NABL
  - IEC 60891 NABL compliance
  - solar IV tracer accreditation
  - quality management system
canonical: "https://surya-yantra.srishtipvlab.in/posts/nabl-documentation-peer-review-workflow"
og:
  title: "NABL Accreditation via GitHub: Srishti PV Lab's Documentation Peer-Review Workflow"
  description: "Versioned docs, weekly content audits, structured peer-review checklists — a GitHub-native approach to satisfying NABL 121's traceability requirements."
  image: "/og/nabl-documentation-workflow.png"
  type: "article"
twitter:
  card: "summary_large_image"
  title: "NABL Accreditation via GitHub Peer Review | Srishti PV Lab"
  description: "How GitHub PRs + weekly content automation replaces paper-based QMS documentation for NABL 121 solar lab accreditation."
  image: "/og/nabl-documentation-workflow.png"
author: "Srishti PV Lab Engineering"
date: "2026-05-08"
lastmod: "2026-05-08"
draft: true
tags:
  - nabl
  - accreditation
  - documentation
  - quality-management
  - solar-pv
  - open-source
  - india
categories:
  - quality
  - research
reading_time: 11
schema_type: "TechArticle"
related_repos:
  - surya-yantra
  - SolarLabX
---

# Documentation as a First-Class Deliverable: How Srishti PV Lab's GitHub Peer-Review Workflow Prepares for NABL Accreditation

*Article seed — 8 May 2026 (Thursday weekly angle: peer-review checklist) · Srishti PV Lab Engineering*

NABL accreditation under ISO/IEC 17025:2017 is, fundamentally, a documentation exercise. The auditor does not watch you measure a module — they read your SOPs, calibration records, uncertainty budgets, and traceability chains. If those documents cannot be located, versioned, and cross-referenced under scrutiny, the measurement itself becomes unacceptable regardless of its technical accuracy.

Srishti PV Lab is pursuing NABL accreditation for solar PV module testing under NABL 121 (Specific Criteria for Testing Laboratories in Solar Energy). This article documents how the lab's GitHub-native documentation workflow maps onto the NABL 121 requirements — and why treating `docs/` as a peer-reviewed codebase turns out to be a surprisingly close fit.

## The NABL 121 Documentation Requirements

NABL 121 §4 (following ISO/IEC 17025:2017 §8.2–8.6) requires:

| Requirement | NABL 121 clause | Current coverage |
|-------------|----------------|-----------------|
| Documented test methods referencing IEC standards | 4.2.1 | `docs/IEC-CORRECTIONS.md` §1–4 |
| Uncertainty budget for each test method | 4.2.3 | `docs/IEC-CORRECTIONS.md §6.1` item 4 — **pending** |
| Evidence of method validation | 4.2.4 | `apps/web/__tests__/lib/iec60891.test.ts` — partial |
| Equipment calibration records | 4.5.2 | Not yet in repo — tracked in issue backlog |
| Traceability of measurement standards to SI | 4.5.3 | NABL-calibrated pyranometer chain — not documented in repo |
| Competency records for personnel | 4.6.1 | Out of scope for this repository |
| Review of requests and contracts | 4.4.1 | Not yet in repo |

Of these, the documentation items — method description, uncertainty budget, validation evidence — are directly addressable through structured Markdown documents managed in this repository.

## The GitHub Workflow as a QMS Proxy

The weekly content automation cycle operates as follows:

```
Monday    → Draft outlines (new test methods, findings)
Tuesday   → Bulk-remove stale drafts (archival hygiene)
Wednesday → Enhance drafts (add references, flesh out sections)
Thursday  → Peer-review checklist pass (this article's angle)
Friday    → Publication-polish + ideation→implementation diagram
Saturday  → SEO / metadata
Sunday    → Roadmap update
```

This maps imperfectly but usefully onto ISO/IEC 17025's document control cycle:

| ISO/IEC 17025 step | GitHub equivalent |
|-------------------|------------------|
| Document creation | Monday outline (draft PR, `draft: true`) |
| Technical review | Thursday peer-review checklist pass |
| Approval | PR review + approval from QM before merge |
| Distribution | Merge to `main` + Vercel deploy |
| Revision control | Git commit history + `lastmod` front-matter field |
| Obsolescence | Tuesday stale-draft removal cycle |

The critical gap is the *approval step*: GitHub PRs support review assignments and required approvals, but the lab's PRs currently have no required reviewers configured. This is a NABL-visible gap.

## What the Peer-Review Checklist Adds

The `## Peer Review` section (added to every draft on Thursday runs) provides the artefact NABL auditors look for: documented evidence that a competent person reviewed the technical content before it was published.

Specifically, the checklist covers:

1. **Technical accuracy** — are the equations right? Are the code paths real?
2. **Citation completeness** — can every claim be independently verified?
3. **Code cross-references** — does the described behaviour actually exist in the codebase?
4. **Reviewer sign-off** — who approved this, on what date?

For `docs/IEC-CORRECTIONS.md` specifically, the §6 Peer Review section (added in this same Thursday run) provides the validation table, limitations register, and sign-off block that NABL 121 §4.2.3–4.2.4 expect to see for a documented test method.

## What Still Needs Human Action

The GitHub workflow automates the structure; humans must fill the substance:

1. **Assign PR reviewers** — configure branch protection requiring at least one reviewer approval before merge to `main`.
2. **Complete uncertainty budgets** — `docs/IEC-CORRECTIONS.md §6.1` item 4 requires a GUM-compliant u_c(Pmpp) for each procedure. This is a multi-week measurement exercise, not a documentation task.
3. **External validation** — §6.1 item 7 requires comparison against a CREST-certified reference instrument. Planned for Q3 2026 audit campaign.
4. **Equipment records** — calibration certificates for the Kipp & Zonen SMP10 and IMT Si-RS485TC-T-MB reference cell need to be linked from `docs/HARDWARE-SETUP.md`.

## Research Narrative

The broader argument is that open-source, version-controlled documentation is a viable alternative to paper-based QMS systems for small, NABL-aspiring labs — not because it is formally equivalent to ISO/IEC 17025 §8.2–8.6, but because it enforces the same behaviours through different mechanisms: peer review through PR approvals, version control through git history, distribution through Vercel deploys.

This is worth documenting as a case study because NABL accreditation is typically described as out of reach for small labs due to QMS overhead. The GitHub-native approach may substantially reduce that overhead while preserving the traceability chain.

**Target venue:** *Renewable Energy Focus* (practice paper) or *Solar Energy* (technical note).

## References

1. ISO/IEC 17025:2017, *General requirements for the competence of testing and calibration laboratories*. ISO, Geneva.
2. NABL, *Specific Criteria for Accreditation of Testing Laboratories in the field of Solar Energy*, NABL 121, 2023.
3. JCGM 100:2008 (GUM), *Evaluation of measurement data — Guide to the expression of uncertainty in measurement*. BIPM, Geneva.
4. IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and irradiance corrections to measured I-V characteristics*. IEC, Geneva.
5. Surya Yantra `docs/IEC-CORRECTIONS.md §6 Peer Review` — see this repository.
6. Surya Yantra `apps/web/__tests__/lib/iec60891.test.ts` — validation test suite.

---

## Peer Review

*Thursday 8 May 2026 — Weekly peer-review checklist pass (this is the article's own checklist)*

### Technical Accuracy

- [ ] ISO/IEC 17025:2017 clause numbers verified against the published standard
- [ ] NABL 121 clause numbers verified against current NABL 121 (2023 edition)
- [ ] GitHub workflow description matches the actual weekly automation as documented in `drafts/README.md`
- [ ] Table mapping ISO steps to GitHub equivalents reviewed for correctness

### Citation Completeness

- [ ] ISO/IEC 17025:2017 — ISO publication confirmed ✅
- [ ] NABL 121 2023 — NABL publication confirmed ✅
- [ ] GUM (JCGM 100:2008) — BIPM publication confirmed ✅
- [ ] IEC 60891:2021 — IEC publication confirmed ✅

### Code Cross-References

- [ ] `docs/IEC-CORRECTIONS.md §6` exists on `main` after Thursday run ✅ (added this session)
- [ ] `apps/web/__tests__/lib/iec60891.test.ts` exists on `main` ✅

### Reviewer Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Technical reviewer | — | — | — |
| QM / Accreditation lead | — | — | — |
| Editor | — | — | — |
