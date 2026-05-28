---
title: "Structural Lint Report — 2026-05-28"
date: "2026-05-28"
weekly_angle: "Thu (peer-review)"
base_commit: "3031b05"
---

# Structural Lint Report — 2026-05-28

Full audit of `docs/` and `hardware/` on the `main` branch base commit `3031b05`.

---

## 1. Heading hierarchy

| File | Result | Notes |
|------|--------|-------|
| `docs/API.md` | ✅ PASS | H1 → H2 only; consistent |
| `docs/IEC-CORRECTIONS.md` | ✅ PASS | H1 → H2 → H3 → H4 clean |
| `docs/DEPLOYMENT.md` | ✅ PASS | H1 → H2 only |
| `docs/HARDWARE-SETUP.md` | ✅ PASS | H1 → H2 → H3 clean |
| `hardware/BOM.md` | ✅ PASS | H1 → H2 only |
| `README.md` | ✅ PASS | H1 → H2 only |

**No heading-level skips found.** No orphaned H3s without a parent H2.

---

## 2. Citation coverage

| File | Citations present | Gaps |
|------|------------------|------|
| `docs/IEC-CORRECTIONS.md` | ✅ §5 References (5 entries) | IEC webstore URLs and DOIs absent — filed in PR #97 (Wed) |
| `docs/HARDWARE-SETUP.md` | ✅ §9 Further Reading (4 entries) | No publisher/edition year |
| `docs/API.md` | ⚠️ RFC 7807 mentioned in preamble but no references section | Minor — filed as issue |
| `docs/DEPLOYMENT.md` | ✅ No citations needed (procedural doc) | — |
| `hardware/BOM.md` | ✅ Vendor URLs in table | — |

---

## 3. Broken internal links

| Link | File | Status | Issue |
|------|------|--------|-------|
| `packages/scpi-client/` | README.md | ❌ directory does not exist | #89 |
| `packages/iv-engine/` | README.md | ❌ directory does not exist | #89 |
| `packages/types/` | README.md | ❌ directory does not exist | #89 |
| `hardware/schematics/` | README.md, HARDWARE-SETUP.md | ❌ directory does not exist | #90 |
| `hardware/WIRING.md` | README.md | ❌ file does not exist | #90 |
| `docs/PRD.md` | README.md | ❌ file does not exist | filed Sun PR #50 |
| `hardware/firmware/mux-controller/` | HARDWARE-SETUP.md §4.2 | ❌ directory does not exist | #92 |
| `apps/desktop/relay` | DEPLOYMENT.md §8 | ❌ directory does not exist | #91 (P0) |

**8 broken internal links** — all pre-existing, tracked in open issues.

---

## 4. Alt-text on figures

**No raster images (`<img>`, `![]()`) found in any doc file.** All diagrams are ASCII
art in fenced code blocks. Alt-text N/A.

OG image stubs required in front-matter when articles are promoted to `posts/` —
see `posts/README.md` promotion checklist.

---

## 5. Typos and stale timestamps

| File | Issue | Fix in this PR |
|------|-------|----------------|
| `docs/API.md` | `smmmfUsed` (triple-m) in CorrectionResult example | **Fixed** → `smmfUsed` |
| `docs/API.md` | Footer: `Generated 2026-04-17` | **Updated** → `Last lint pass 2026-05-28` |
| `hardware/BOM.md` | Footer: `Last updated 2026-04-17` | Not changed (prices still valid; reviewer should re-stamp if prices updated) |

---

## 6. API documentation gaps

| Gap | Fix in this PR |
|-----|----------------|
| `GET /api/health` used in DEPLOYMENT.md §7 smoke test but undocumented | **Added** |
| `POST /api/mux/:testBedId/selftest` used in HARDWARE-SETUP.md §4.4 but undocumented | **Added** |
| `POST /api/corrections/apply` referenced in IEC-CORRECTIONS.md §4 pipeline diagram but absent from API.md | **Added** |

---

## 7. Vercel build status

| Project | Latest deployment | State |
|---------|------------------|-------|
| surya-yantra | `dpl_D48qbvC83T7xMN7XdtBSXAoh6yK2` (PR #97, 2026-05-27) | **✅ READY** |

All 20 most-recent surya-yantra deployments are `READY`. No build failures.
No action needed.

_Note: `ganita-sutra` Vercel project had a production ERROR on 2026-05-18 (issue #57
filed in PR #58). No new surya-yantra deployments have failed since.
_

---

*Report generated 2026-05-28 by Claude Code automated editorial pass.*
