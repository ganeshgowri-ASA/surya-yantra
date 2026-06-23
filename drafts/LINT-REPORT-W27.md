# Structural Lint Report — W27 (2026-06-23, Monday)

Scope: `README.md`, `docs/*.md`, `hardware/BOM.md`  
Run date: 2026-06-23  
Files with commits in last 24h: **none** (last commit: 2026-04-17)

---

## 1. Heading Hierarchy

| File | Finding | Severity |
|------|---------|----------|
| `README.md` | Lines 94–113: shell comment lines (`# ...`) inside a fenced code block register as H1 in naive grep-based linters — **false positive**, not real headings. Actual hierarchy H1→H2→H3 is correct. | INFO |
| `docs/API.md` | H1→H2→H3 correct throughout. | PASS |
| `docs/DEPLOYMENT.md` | H1→H2 correct. Shell comment lines inside code blocks same false-positive issue. | INFO |
| `docs/HARDWARE-SETUP.md` | H1→H2→H3 correct (H3 uses decimal notation 2.1, 2.2, 3.1, etc.). | PASS |
| `docs/IEC-CORRECTIONS.md` | H1→H2→H3 correct (decimal notation). `## 5. References` present and populated. | PASS |
| `hardware/BOM.md` | H1→H2 only (no H3). Appropriate for a tabular reference document. | PASS |

**Overall heading hierarchy: PASS**

---

## 2. Broken Local Links

| Source file | Broken link | Reason | Severity | Auto-fix |
|-------------|-------------|--------|----------|----------|
| `README.md:58` | `hardware/schematics/` | Directory does not exist | **HIGH** | Create `hardware/schematics/README.md` stub |
| `README.md:60` | `hardware/WIRING.md` | File does not exist | **HIGH** | Create `hardware/WIRING.md` stub |
| `README.md:62` | `docs/PRD.md` | File does not exist | **MEDIUM** | Create `docs/PRD.md` stub |
| `docs/API.md` | `./IEC-CORRECTIONS.md` | Resolves correctly from `docs/` dir (false positive in relative-path check) | INFO | None needed |
| `docs/HARDWARE-SETUP.md` | `../hardware/BOM.md` | Resolves correctly to `hardware/BOM.md` (false positive in absolute-path check) | INFO | None needed |

**Genuine broken links: 3 (hardware/schematics/, hardware/WIRING.md, docs/PRD.md)**

---

## 3. Alt-text on Figures

| File | Finding |
|------|---------|
| `README.md` | 5 badge images — all have descriptive alt-text in `[]`. PASS |
| `docs/*.md` | No images. PASS |
| `hardware/BOM.md` | No images. PASS |

**Alt-text: PASS**

---

## 4. Citation Coverage

| File | Finding |
|------|---------|
| `docs/IEC-CORRECTIONS.md` | `## 5. References` section present with 5 numbered citations. PASS |
| `docs/API.md` | No citation section — not required for API reference. INFO |
| `docs/DEPLOYMENT.md` | No citation section — not required for deployment guide. INFO |
| `docs/HARDWARE-SETUP.md` | `## 9. Further reading` section references IEC standards inline. PASS |
| `hardware/BOM.md` | Vendor URLs present inline in table. Appropriate for BOM. PASS |
| `README.md` | IEC standards listed in Standards Compliance table — no formal citations needed for README. PASS |

**Citation coverage: PASS**

---

## 5. Auto-fixes Applied This Run

| # | File | Fix | Issue filed |
|---|------|-----|------------|
| 1 | `hardware/schematics/README.md` | Created stub explaining planned auto-generation pipeline via ShilpaSutra | See PR |
| 2 | `hardware/WIRING.md` | Created stub with cable routing rules from BOM | See PR |
| 3 | `docs/PRD.md` | Created stub product requirements document | See PR |

---

## 6. Issues to File (Substantive — not auto-fixed)

| Priority | Description | Labels |
|----------|-------------|--------|
| HIGH | `hardware/schematics/` missing: rack elevation, MUX matrix, Kelvin harness SVGs | `documentation`, `hardware`, `good-first-issue` |
| HIGH | `lib/uncertainty.ts` not implemented: GUM uncertainty budget for IEC 60891 P1–P4 | `research`, `enhancement`, `iec-compliance` |
| MEDIUM | `uExpandedPct` field in SolarLabX LIMS schema not populated by Surya Yantra API | `integration`, `solarlabx` |
| MEDIUM | MCP server manifest stub (`apps/web/mcp/`) needed for Antaryami OS integration | `integration`, `antaryami` |
| LOW | `docs/PRD.md` needs full product requirements content | `documentation` |
