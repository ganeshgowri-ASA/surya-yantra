# drafts/

Article drafts for the Srishti PV Lab / Surya Yantra research blog.

## Weekly editing cycle

| Day | Angle | What to do |
|-----|-------|----------|
| Mon | **Outline** | Create new `drafts/*.md` with skeleton headings and front matter |
| Tue | **Bulk removal** | Archive stale drafts (> 90 days old with no progress) to `drafts/archive/` |
| Wed | **Enhancement** | Add references, flesh out sections, cross-link companion-repo PRs |
| Thu | **Peer-review checklist** | Work through `## Peer Review` section in each updated draft; assign reviewers |
| Fri | **Publication-polish** | Finalise prose, add ideation→implementation diagrams; promote to `posts/` |
| Sat | **SEO / metadata** | Review front-matter: `seo_title`, `description`, `keywords`, `og:*`, `canonical` |
| Sun | **Roadmap** | Update roadmap articles; cross-link new engineering milestones |

## Promotion to posts/

A draft is ready to promote to `posts/` only when:

1. All `<!-- TODO -->` inline items are resolved or tracked as GitHub issues.
2. The `## Peer Review` checklist is complete (all items ticked).
3. The reviewer sign-off table has at least one signature.
4. `draft: true` is changed to `draft: false` in the front matter.
5. OG images (`/og/*.png`) exist in `apps/web/public/og/` — see issue #6.

---

## Tuesday 12 May 2026 — Bulk-Removal Audit

### Structural lint results

| Check | Result |
|-------|--------|
| Heading hierarchy (H1→H2→H3) | ✅ All 14 drafts + 1 post pass |
| Citation coverage | ✅ All articles cite IEC/ISO standards with year + section |
| Broken internal link | 🔴 `antaryami-os-pv-lab-scheduling.md` references `apps/web/lib/antaryami.ts` — file does not exist in repo (issue #29 filed) |
| Alt-text on figures | ✅ No bare `<img>` tags; ASCII diagrams only |
| OG images | 🔴 `/og/*.png` still missing across all articles — tracked in **issue #6** |
| Stale static date in `docs/API.md` | 🔴 Footer read "Generated 2026-04-17" — fixed in this PR (issue #15 partial) |

### Staleness / overlap assessment

| File | Age (days) | Active TODO count | Overlap risk | Verdict |
|------|------------|-------------------|--------------|--------|
| `75-module-pv-test-bed-build.md` | 9 | 2 | None | ✅ Keep |
| `antaryami-os-pv-lab-scheduling.md` | 9 | 3 | None | ✅ Keep — byline fixed |
| `antaryami-os-skill-architecture-pv-lab.md` | 5 | 2 | None | ✅ Keep |
| `ganitasutra-5pdm-parameter-extraction.md` | 5 | 2 | ⚠️ Overlaps `ganitasutra-parameter-free` | Keep — primary article |
| `ganitasutra-parameter-free-pv-corrections.md` | 9 | 2 | ⚠️ Overlaps `ganitasutra-5pdm` | ⚠️ Flag — issue #30 filed |
| `iec-60891-typescript-implementation.md` | 9 | 2 | None | ✅ Keep |
| `srishti-pv-lab-ecosystem-roadmap-q2-2026.md` | varies | 1 | None | ✅ Keep |
| `nabl-documentation-peer-review-workflow.md` | 4 | 0 | None | ✅ Keep — seed |
| `vitest-to-nabl-uncertainty-budget.md` | 4 | 0 | None | ✅ Keep — seed |
| `antaryami-os-42-issue-sprint-governance.md` | 3 | 2 | None | ✅ Keep — rename tracked #27 |
| `shilpasutra-cad-pv-fixture-design.md` | 3 | 4 | None | ✅ Keep — seed |
| `pv-pranali-multi-agent-pv-proposal-orchestrator.md` | 2 | 5 | None | ✅ Keep — seed |
| `antaryami-os-94-issue-hypersprint-roadmap.md` | 1 | 2 | None | ✅ Keep — seed |
| `antaryami-os-post-hypersprint-day1-integration-signal.md` | 0 | 3 | None | 🌱 New seed (12 May) |
| `solarlabx-surya-yantra-cross-lab-iv-pipeline.md` | 0 | 4 | None | 🌱 New seed (12 May) |

**No drafts qualify for archival** — oldest article was seeded 9 days ago (3 May 2026). Archive threshold is 90 days per editorial policy.

### Article seeds proposed — 12 May 2026

| Seed | Engineering signal | Research narrative |
|------|--------------------|-----------------------|
| `antaryami-os-post-hypersprint-day1-integration-signal.md` | antaryami-os Day 1 post-hypersprint (94 issues) | Phase-transition analysis; Category A/B/C triage framework for NABL-regulated AI test systems; target IEEE Trans. Instrumentation & Measurement |
| `solarlabx-surya-yantra-cross-lab-iv-pipeline.md` | SolarLabX 24 issues (+4 in 2 days) | GUM-compliant IV uncertainty propagation across Jamnagar + Chennai labs; AI inter-lab root-cause; target Solar Energy or Measurement (Elsevier) |

---

## Active drafts (as of 2026-05-12)

| File | Topic | Status | Blocking issues |
|------|-------|--------|----------------|
| `75-module-pv-test-bed-build.md` | Hardware build narrative | ⚙️ In progress | NABL statistical power analysis (#20); oscilloscope photo; throughput data |
| `antaryami-os-pv-lab-scheduling.md` | AI scheduling skill | ⚙️ In progress | Sequence diagram (#17); pv-session-planner PR link (#17); `antaryami.ts` lib missing (#29) |
| `antaryami-os-skill-architecture-pv-lab.md` | AI OS architecture | ⚙️ In progress | Sequence diagram (#17); pv-session-planner PR link (#17) |
| `ganitasutra-5pdm-parameter-extraction.md` | 5PDM LM fitting | ⚙️ In progress | Benchmark table (#18); pv-toolbox PR link (#18) |
| `ganitasutra-parameter-free-pv-corrections.md` | Parameter-free P3/P4 | ⚠️ Overlap risk | Consolidate or differentiate vs. 5PDM article — issue #30 |
| `iec-60891-typescript-implementation.md` | IEC 60891 TypeScript | ⚙️ In progress | Fraunhofer ISE table (#7); CdTe trace (#7) |
| `srishti-pv-lab-ecosystem-roadmap-q2-2026.md` | Q2 ecosystem roadmap | ⚙️ In progress | Milestone confirmations; antaryami-os Q2 triage (#28) |
| `nabl-documentation-peer-review-workflow.md` | NABL + GitHub QMS | 🌱 Seed | New seed 2026-05-08 |
| `vitest-to-nabl-uncertainty-budget.md` | Vitest → GUM budget | 🌱 Seed | New seed 2026-05-08; sensor cal certificates |
| `antaryami-os-42-issue-sprint-governance.md` | AI governance for physical lab OS | 🌱 Seed | Filename rename needed on promotion (issue #27) |
| `shilpasutra-cad-pv-fixture-design.md` | ShilpaSutra AI-CAD for test rack | 🌱 Seed | New seed 2026-05-09 (Fri); CAD output screenshot needed |
| `pv-pranali-multi-agent-pv-proposal-orchestrator.md` | pv-pranali URS ingest + multi-agent orchestration | 🌱 Seed | Content gap issued (#24) |
| `antaryami-os-94-issue-hypersprint-roadmap.md` | antaryami-os hypersprint phase-transition analysis | 🌱 Seed | New seed 2026-05-11 (Sun); Q2 triage (#28) |
| `antaryami-os-post-hypersprint-day1-integration-signal.md` | Day-1 aftermath; integration velocity | 🌱 Seed | **New seed 2026-05-12** (Tue); needs #28 triage data |
| `solarlabx-surya-yantra-cross-lab-iv-pipeline.md` | Cross-lab IV uncertainty pipeline | 🌱 Seed | **New seed 2026-05-12** (Tue); needs SolarLabX API schema; calibration certificates |

## Companion repo sprint state (12 May 2026)

| Repo | Open issues | Change since 11 May | Signal |
|------|-------------|---------------------|--------|
| antaryami-os | **94** (Day 1 post-hypersprint) | stable | 🔴 Triage in progress — Q2 milestone (#28) |
| ShilpaSutra | **39** | stable | 🟠 Active |
| GanitaSutra-v0 | **18** | stable | 🟠 Active |
| SolarLabX | **24** (+4 since 10 May) | +4 | 🟠 Active — cross-lab pipeline |
| pv-pranali | **0** | — | ✅ Vercel READY |
