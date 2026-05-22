# Structural Lint Report — 2026-05-22

**Branch:** `main` (base)  
**Run by:** Claude Code editorial agent  
**Weekly angle:** Thursday — peer-review checklist  
**Scope:** `README.md`, `docs/*.md`, `hardware/BOM.md`  
**Last 24 h changes:** No new commits in last 24 h (most recent commit 2026-04-17).

---

## 1. Heading Hierarchy

| File | Finding | Severity |
|---|---|---|
| `README.md` | H1 → H2 → H3 hierarchy is correct throughout. Note: lines 94–117 contain `#` characters inside fenced code blocks; these are not headings — confirmed benign. | ✅ Pass |
| `docs/API.md` | H1 → H2 → H3 hierarchy correct. | ✅ Pass |
| `docs/IEC-CORRECTIONS.md` | H1 → H2 → H3 → H4 (via numbered subsections) — correct, no skipped levels. | ✅ Pass |
| `docs/HARDWARE-SETUP.md` | H2 → H3 (numbered subsections) — correct. No H4. | ✅ Pass |
| `docs/DEPLOYMENT.md` | H1 → H2 only — shallow but appropriate for a guide. | ✅ Pass |
| `hardware/BOM.md` | H1 → H2 only — appropriate. | ✅ Pass |

---

## 2. Broken / Missing Internal Links

| Location | Link | Status | Action required |
|---|---|---|---|
| `README.md` — badge | `LICENSE` | ❌ File does not exist | Create `LICENSE` (MIT text) or remove badge |
| `README.md` — Repository Structure table | `hardware/schematics/` | ❌ Directory does not exist | Create stub or annotate as "planned" |
| `README.md` — Repository Structure table | `hardware/WIRING.md` | ❌ File does not exist | Create stub or remove reference |
| `README.md` — Repository Structure table | `docs/PRD.md` | ❌ File does not exist | Create stub PRD or remove reference |
| `README.md` — Repository Structure table | `packages/scpi-client/` | ❌ Package not implemented | Annotate as "planned (Milestone 2)" |
| `README.md` — Repository Structure table | `packages/iv-engine/` | ❌ Package not implemented | Annotate as "planned (Milestone 2)" |
| `README.md` — Repository Structure table | `packages/types/` | ❌ Package not implemented | Annotate as "planned (Milestone 2)" |
| `docs/API.md` | `./IEC-CORRECTIONS.md` | ✅ Exists | — |
| `docs/IEC-CORRECTIONS.md` | No internal links | — | — |

**Issue count:** 7 broken internal links (6 stub/missing files + 1 missing `LICENSE`).

---

## 3. Citation Coverage

| File | Standards cited | Has formal references section | Missing |
|---|---|---|---|
| `docs/IEC-CORRECTIONS.md` | IEC 60891:2021, IEC 60904-7:2019, IEC 61853-2:2016 | ✅ Section 5 "References" | ✅ Martin & Ruiz (2001) fully cited (vol. 70, pp. 25–38). IEC standard entries lack edition numbers — minor. |
| `docs/API.md` | Mentions IEC in context | ❌ No references section | Should link to `IEC-CORRECTIONS.md` |
| `README.md` | Lists 8 IEC standards | ❌ No references section | Acceptable for a README |
| `hardware/BOM.md` | No standards cited | N/A | Acceptable for a BOM |
| `docs/HARDWARE-SETUP.md` | References commissioning tests | ❌ No formal refs | Add ESL-Solar 500 datasheet reference |
| `docs/DEPLOYMENT.md` | No citations needed | N/A | — |

**Gap:** `docs/IEC-CORRECTIONS.md §5` has all key citations present. Minor: IEC standard entries omit edition numbers (e.g. "Ed. 3") — add for precision.

---

## 4. Alt-Text on Figures

No images or figures are present in any Markdown file. The `hardware/schematics/` directory is referenced but does not exist.

**Action:** When schematics are added, all `<img>` and `![...]` tags must include descriptive alt-text.

---

## 5. Stale-Date Audit

| File | "Last updated" date | Age | Status |
|---|---|---|---|
| `hardware/BOM.md` | 2026-04-17 | 35 days | Acceptable |
| `docs/API.md` | 2026-04-17 (footer) | 35 days | ⚠️ Needs update when new API routes added |
| All other docs | No explicit dates | — | Recommend adding `_last-updated` front-matter |

---

## 6. Summary

| Check | Passing | Failing |
|---|---|---|
| Heading hierarchy | 6 / 6 | 0 |
| Internal links | 2 / 9 | 7 |
| Citation coverage | 1 / 3 reviewed | 2 gaps |
| Alt-text | N/A | N/A (no figures) |
| Stale dates | 1 flagged | 1 warning |

### Auto-editable issues (safe to fix in this PR)
- None of the 7 broken links require content invention — all are either stubs or label changes in the README table.

### Issues requiring substantive content (filed as GitHub issues)
- `#ISSUE-A`: Create `docs/PRD.md` stub
- `#ISSUE-B`: Create `hardware/WIRING.md` stub
- `#ISSUE-C`: Create `hardware/schematics/` placeholder + SVG stubs
- `#ISSUE-D`: Add Martin & Ruiz (1994) citation to `IEC-CORRECTIONS.md §5`
- `#ISSUE-E`: Add `packages/` monorepo stubs for `scpi-client`, `iv-engine`, `types`
