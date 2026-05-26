---
title: "Structural Lint Report — 2026-05-26"
date: 2026-05-26
weekly_angle: Tuesday (bulk-removal of stale drafts)
---

# Structural Lint Report — 2026-05-26

Automated structural audit of `docs/`, `hardware/`, and `drafts/` run on
Tuesday, 2026-05-26 (weekly angle: bulk-removal of stale drafts).

---

## 1. Files Scanned

| File | Lines | Last commit |
|------|-------|-------------|
| `README.md` | ~220 | 3031b05 + this PR |
| `docs/API.md` | 319 | 3031b05 + this PR |
| `docs/DEPLOYMENT.md` | 165 | 3031b05 |
| `docs/HARDWARE-SETUP.md` | 228 | 3031b05 |
| `docs/IEC-CORRECTIONS.md` | 231 | 3031b05 |
| `hardware/BOM.md` | 161 | 3031b05 |
| `drafts/staleness-audit-2026-05-26.md` | — | this PR (new) |
| `drafts/2026-05-26-ts-nocheck-to-type-safe-iec-reports.md` | — | this PR (new) |
| `drafts/2026-05-26-auth-guards-pv-ai-apis.md` | — | this PR (new) |

---

## 2. Heading Hierarchy — PASS

All files use a single H1 followed by H2/H3 in strict descending order.
No heading level skips detected.

---

## 3. Citation Coverage

| File | References section | Status |
|------|--------------------|--------|
| `docs/IEC-CORRECTIONS.md` | §5 References (5 entries) | PASS |
| `docs/HARDWARE-SETUP.md` | §9 Further reading (4 entries) | PASS |
| `docs/API.md` | None (API reference — acceptable) | N/A |
| `docs/DEPLOYMENT.md` | None (operational guide — acceptable) | N/A |
| `hardware/BOM.md` | None (BOM table — acceptable) | N/A |
| `README.md` | Standards list in §Standards Compliance | PASS |

---

## 4. Broken Internal Links

### 4.1 Fixed in this PR

| Source file | Reference | Fix applied |
|-------------|-----------|-------------|
| `README.md` repository structure | `packages/scpi-client/`, `packages/iv-engine/`, `packages/types/` | Annotated `[Planned — Milestone 2]` |
| `README.md` repository structure | `hardware/schematics/`, `hardware/WIRING.md`, `hardware/firmware/` | Annotated `[Planned]` with issue numbers |
| `README.md` repository structure | `docs/PRD.md` | Annotated `[Planned]` with issue number |
| `README.md` repository structure | `apps/desktop/relay/` | Annotated `[Planned]` with issue number |
| `README.md` §Hardware body text | Clickable link to `hardware/schematics/` (404) | Replaced with plain text + `[Planned]` note |
| `docs/API.md` footer | Stale "Generated 2026-04-17" | Updated to "Last lint pass 2026-05-26" |

### 4.2 Pre-existing — tracked in open issues (not fixed here)

| Source file | Broken reference | Issue |
|-------------|-----------------|-------|
| `docs/DEPLOYMENT.md` L118 | `apps/desktop/relay` (code, not docs) | #74, #91 |
| `docs/HARDWARE-SETUP.md` L132 | `hardware/firmware/mux-controller/` | #75, #87, #92 |

---

## 5. Alt-Text on Figures — N/A

No image files embedded via Markdown in any scanned file.
`hardware/schematics/` does not exist yet (see §4).

---

## 6. Stale Draft PRs Audit

See `drafts/staleness-audit-2026-05-26.md` for the full 20-PR assessment.

**Summary:** 2 PRs worth keeping (#93 Monday, #85 Saturday SEO).
**16 PRs recommended for closure** as superseded or stale.
The oldest open PR (#11, ~20 days) contains scaffolding fully superseded by this and
prior PRs.

---

## 7. Vercel Deployment Status

Checked 2026-05-26 against Vercel team `ganeshgowrimitsui-3250s-projects`.

| Project | Latest deployment | State | Notes |
|---------|-----------------|-------|-------|
| `surya-yantra` | `dpl_B1m22WExv1N3BYN1DuuoeygFWsWB` (PR #93, 2026-05-25) | **READY ✅** | Monday outline pass preview build |
| `solar-lab-x` | `dpl_G3qoxFivcb7qKeHjt4oihKRTUJNf` (2026-05-26) | CANCELED | PR preview superseded by branch push — normal, **not an error** |

**No ERROR states in last 20 builds for either project. Both sites healthy.**

---

## 8. Engineering Signals from SolarLabX (2026-05-25/26)

| Date | Signal | Article seed relevance |
|------|--------|----------------------|
| 2026-05-26 | `chore(bulk-removal)`: remove `@ts-nocheck` from `export-utils.ts`; fix `ShadingType.SOLID` in Word export | → `drafts/2026-05-26-ts-nocheck-to-type-safe-iec-reports.md` |
| 2026-05-25 | `security`: add `requireAuth()` guard on AI routes; move Roboflow key from URL to `Authorization` header; tighten `remotePatterns` | → `drafts/2026-05-26-auth-guards-pv-ai-apis.md` |
| 2026-05-25 | `refactor(export-utils)`: extract `computeColWidths` helper — DRY principle in XLSX export | Subtheme in type-safety article |

Note: sibling repos antaryami-os, GanitaSutra-v0, ShilpaSutra are not accessible
via MCP in this session (restricted to surya-yantra only). Signals above are from
SolarLabX via the Vercel deployment metadata in `solar-lab-x` project.

---

## 9. Summary

| Check | Result |
|-------|--------|
| Heading hierarchy | ✅ PASS |
| Citation coverage | ✅ PASS (where required) |
| Broken links — fixed in this PR | ✅ 6 references annotated `[Planned]` |
| Broken links — pre-existing | ⚠️ 2 remaining (tracked in issues) |
| Stale drafts removed | ✅ 16 PRs identified for closure |
| Stale timestamps | ✅ Fixed (API.md) |
| Alt-text | ✅ N/A |
| Vercel builds | ✅ Both projects healthy |

---

*Generated by Claude Code automated Tuesday bulk-removal pass.*
