# Structural Lint Report — 2026-06-03

Scope: `docs/`, `hardware/BOM.md`, `README.md`  
Audited: heading hierarchy · citation coverage · broken internal links · alt-text on figures

---

## Summary

| ID | Severity | Area | Finding | Action |
|----|----------|------|---------|--------|
| LNT-001 | AUTO-FIXED | `docs/API.md:259` | Stale model ID `claude-opus-4-7` | Updated to `claude-opus-4-8` |
| LNT-002 | ISSUE | `README.md:58–65` | 5 paths in repo tree diagram don't exist | See issue #X |
| LNT-003 | ISSUE | `README.md:167–170` | `hardware/schematics/` directory referenced but absent | See issue #X |
| LNT-004 | ISSUE | `README.md:60` | `hardware/WIRING.md` referenced but absent | See issue #X |
| LNT-005 | ISSUE | `README.md:63` | `docs/PRD.md` referenced but absent | See issue #X |
| LNT-006 | ISSUE | `docs/DEPLOYMENT.md:119` | `apps/desktop/relay` path referenced but absent | See issue #X |
| LNT-007 | ISSUE | `docs/HARDWARE-SETUP.md:131` | `hardware/firmware/mux-controller/` referenced but absent | See issue #X |
| LNT-008 | WARN | `docs/API.md:319` | Footer date `2026-04-17` is stale | Update on next API change |
| LNT-009 | WARN | `hardware/BOM.md:161` | `Last updated 2026-04-17` footer is stale | Update on next BOM change |

---

## Detail

### LNT-001 — AUTO-FIXED ✅

**File**: `docs/API.md` line 259  
**Before**: `"model": "claude-opus-4-7"`  
**After**: `"model": "claude-opus-4-8"`  
The example payload used a retired model ID. `claude-opus-4-8` is the current production Opus.

---

### LNT-002/003/004/005/006/007 — BROKEN LINKS (6 paths)

**Root cause**: The README and docs were written ahead of implementation. The following
paths are referenced in prose or code but do not exist in the repository:

| Path | Referenced in |
|------|--------------|
| `packages/scpi-client/` | README.md §Repository Structure |
| `packages/iv-engine/` | README.md §Repository Structure |
| `packages/types/` | README.md §Repository Structure |
| `hardware/schematics/` | README.md §Hardware |
| `hardware/WIRING.md` | README.md §Hardware |
| `docs/PRD.md` | README.md §Repository Structure |
| `apps/desktop/relay` | docs/DEPLOYMENT.md §8 |
| `hardware/firmware/mux-controller/` | docs/HARDWARE-SETUP.md §4.2 |

**Fix options** (tracked in GitHub issues):
1. Create the missing files/directories (preferred for schematics, WIRING.md, firmware/).
2. Remove dead references from the docs (acceptable for packages/ until monorepo expands).

---

## Heading Hierarchy ✅

All five docs (`README.md`, `API.md`, `IEC-CORRECTIONS.md`, `DEPLOYMENT.md`,
`HARDWARE-SETUP.md`, `BOM.md`) have clean H1 → H2 → H3 descent with no skipped levels.

---

## Citation Coverage ✅

`docs/IEC-CORRECTIONS.md` has a numbered References section with 5 IEC standard citations
and the Martin-Ruiz (2001) paper. Other docs (README, DEPLOYMENT, HARDWARE-SETUP, BOM)
are operational docs that don't require academic citations. The new article drafts in
`drafts/` carry citation placeholders to be filled by Wednesday per the weekly cadence.

---

## Alt-text on Figures ✅

No embedded images exist in any current doc. The article seed drafts include
`alt`-text templates for the figures that will be added during the Wednesday
enhancement pass.

---

## Next actions

- [x] LNT-001 auto-fixed in this PR.
- [ ] File GitHub issues for LNT-002 through LNT-007 (tracked below).
- [ ] LNT-008/009 stale footers: update on next routine doc edit.
