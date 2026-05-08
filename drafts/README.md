# drafts/

Article drafts for the Srishti PV Lab / Surya Yantra research blog.

## Weekly editing cycle

| Day | Angle | What to do |
|-----|-------|-----------|
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

## Active drafts (as of 2026-05-08)

| File | Topic | Status | Blocking issues |
|------|-------|--------|----------------|
| `75-module-pv-test-bed-build.md` | Hardware build narrative | ⚙️ In progress | NABL statistical power analysis TODO; oscilloscope photo; throughput data |
| `antaryami-os-pv-lab-scheduling.md` | AI scheduling skill | ⚙️ In progress | Sequence diagram (#17); pv-session-planner PR link (#17) |
| `antaryami-os-skill-architecture-pv-lab.md` | AI OS architecture | ⚙️ In progress | Sequence diagram (#17); pv-session-planner PR link (#17) |
| `ganitasutra-5pdm-parameter-extraction.md` | 5PDM LM fitting | ⚙️ In progress | Benchmark table (#18); pv-toolbox PR link (#18) |
| `ganitasutra-parameter-free-pv-corrections.md` | Parameter-free P3/P4 | ⚙️ In progress | GanitaSutra PR link; benchmark table |
| `iec-60891-typescript-implementation.md` | IEC 60891 TypeScript | ⚙️ In progress | Fraunhofer ISE table (#7); CdTe trace (#7) |
| `srishti-pv-lab-ecosystem-roadmap-q2-2026.md` | Q2 ecosystem roadmap | ⚙️ In progress | Milestone confirmations |
| `nabl-documentation-peer-review-workflow.md` | NABL + GitHub QMS | 🌱 Seed | New seed 2026-05-08 |
| `vitest-to-nabl-uncertainty-budget.md` | Vitest → GUM budget | 🌱 Seed | New seed 2026-05-08; GUM budget needs sensor cal certificates |
