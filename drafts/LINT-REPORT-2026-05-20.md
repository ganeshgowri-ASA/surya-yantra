# Structural Lint Report — 2026-05-20

**Scope:** `docs/` (4 files). No `posts/` directory exists yet. `drafts/` newly created this session.

---

## docs/API.md

| Check | Result | Action taken |
|---|---|---|
| H1 present and unique | ✅ "Surya Yantra — API Reference" | — |
| Heading hierarchy (H1→H2→H3) | ✅ correct | — |
| Broken internal links | ✅ none | — |
| Citation coverage | ⚠️ No references section | Added to scope for future pass |
| Figures / alt-text | ✅ no figures | — |
| Stale date footer | ❌ "Generated 2026-04-17" | Fixed: added "Last linted 2026-05-20" |
| Typo in example JSON | ❌ `smmmfUsed` (3×m) | Fixed: corrected to `smmfUsed` |

---

## docs/IEC-CORRECTIONS.md

| Check | Result | Action taken |
|---|---|---|
| H1 present and unique | ✅ | — |
| Heading hierarchy | ✅ H1→H2(1–5)→H3(1.1–1.5 etc.) | — |
| Broken internal links | ✅ none | — |
| Citation coverage | ✅ 5 references, all with edition year + publisher | — |
| Figures / alt-text | ✅ no figures (ASCII art only) | — |
| Stale content | ✅ no stale dates | — |

---

## docs/DEPLOYMENT.md

| Check | Result | Action taken |
|---|---|---|
| H1 present and unique | ✅ | — |
| Heading hierarchy | ✅ H1→H2(1–11) | — |
| Broken internal links | ✅ | — |
| Citation coverage | ❌ No references/further reading section | Fixed: added §12 Further Reading with 5 entries |
| Figures / alt-text | ✅ no figures | — |
| Footer linted date | ❌ missing | Fixed: added "Last linted 2026-05-20" |

---

## docs/HARDWARE-SETUP.md

| Check | Result | Action taken |
|---|---|---|
| H1 present and unique | ✅ | — |
| Heading hierarchy | ✅ H1→H2(1–9)→H3(2.1–8.x) | — |
| Broken internal links | ⚠️ `hardware/firmware/mux-controller/` referenced in §4.2 but missing | Filed as issue #63 (already open) |
| Citation coverage | ❌ §9 Further Reading: inconsistent format, missing publisher/year/URL | Fixed: reformatted all 7 entries to numbered bibliography style |
| Figures / alt-text | ✅ no figures (ASCII art only) | — |
| IEC edition years | ⚠️ IEC 62446-1:2016, IEC 61730-1/2:2023 editions present but missing publisher "IEC, Geneva" | Fixed in §9 reformat |

---

## Sibling-repo scan (antaryami-os, GanitaSutra-v0, ShilpaSutra, SolarLabX)

**Status: BLOCKED.** GitHub MCP session is scoped to `ganeshgowri-asa/surya-yantra` only.
Seed proposals are inferred from open issues cross-referencing those repos (see `drafts/SEEDS.md`).
To enable direct commit scraping, the session token must be extended to cover all four repos.

---

## Vercel deployment health

**Status: UNVERIFIABLE.** No `.vercel/project.json` in the repository root.
Vercel MCP `list_projects` requires a team ID not available in this session.
Issue #52 (no GitHub Actions CI) and issue #57 (Vercel build error on ARCHITECTURE.md commit) are already open.
Recommend: add `.vercel/project.json` to the repo and set up a GitHub Actions workflow per issue #52.

---

## Summary of auto-edits applied

| File | Change |
|---|---|
| `docs/API.md` | Fixed `smmmfUsed` → `smmfUsed` typo; updated footer date |
| `docs/HARDWARE-SETUP.md` | Reformatted §9 Further Reading to numbered bibliography style with publisher/year |
| `docs/DEPLOYMENT.md` | Added §12 Further Reading with 5 entries; updated footer date |
| `drafts/antaryami-os-skill-architecture.md` | New: Wednesday reference-enhancement draft (issue #33) |
| `drafts/relay-architecture.md` | New: Wednesday reference-enhancement draft (issue #56) |
| `drafts/vitest-to-nabl-uncertainty-budget.md` | New: Wednesday reference-enhancement draft (issue #33) |
| `drafts/SEEDS.md` | New: 2 article seeds for Q3 2026 |
| `drafts/INDEX.md` | New: drafts index + promotion checklist |
| `drafts/LINT-REPORT-2026-05-20.md` | This file |
| `posts/.gitkeep` | New: initialises posts/ directory |
