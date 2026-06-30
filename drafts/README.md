# Surya Yantra — Article Drafts

Research articles seeded from engineering progress in this repo and the wider
Srishti PV Lab ecosystem (antaryami-os, GanitaSutra-v0, ShilpaSutra, SolarLabX).

## Workflow

| Day       | Angle                                         |
| --------- | --------------------------------------------- |
| Monday    | Outline — new draft scaffolding               |
| Tuesday   | Triage — remove stale / superseded drafts     |
| Wednesday | Enhancement — add references, citations       |
| Thursday  | Peer-review checklist                         |
| Friday    | Publication polish + ideation→implementation diagram |
| Saturday  | SEO / metadata                                |
| Sunday    | Roadmap update                                |

## Status index

| File                                                          | Status     | Target venue           | Last touched |
| ------------------------------------------------------------- | ---------- | ---------------------- | ------------ |
| [2026-06-30-realtime-iv-websocket.md](2026-06-30-realtime-iv-websocket.md) | seed       | arXiv / MDPI Energies  | 2026-06-30   |
| [2026-06-30-cross-platform-pv-testing.md](2026-06-30-cross-platform-pv-testing.md) | seed       | IEEE PVSC 2027 / OSS journal | 2026-06-30   |

## Stale-draft triage log (Tuesday 2026-06-30)

**30 unmerged open PRs** (PR #121 – #229) have accumulated from daily automated
runs since 2026-05-31. Each contains article seeds, doc fixes, and lint patches —
none have been reviewed or merged. This is the primary stale-draft problem.

### Recommended triage actions

| Priority | Action | PRs |
| -------- | ------ | --- |
| Close — superseded | The earliest Monday/Tuesday article seeds in #121–#131 are superseded by later versions of the same articles in #207–#229. Close without merge. | #121, #122, #125, #130, #131 |
| Close — doc fixes already landed | `docs/fix-broken-refs-132` (#135) fixes overlapping with later PRs; the fix may be stale on current main. Verify, then close or merge. | #135 |
| Close — env example already added | PR #149 (`codex/fix-issue-146-env-example`) adds `.env.example`. This session also adds one. Close #149 after this PR merges. | #149 |
| Review + merge | The 3 most recent PRs (#215, #218, #223, #229) contain the most current article seeds and cumulative doc fixes. Merge these first. | #215, #218, #223, #229 |
| Defer | Middle PRs (#136–#214) contain incremental reference additions and SEO passes; batch-merge or close after reviewing #229. | #136–#214 |

**Filed as GitHub issue** — see issue tracker for the bulk-close tracking issue.

### This session's new drafts

Two article seeds seeded 2026-06-30 from today's engineering progress:
