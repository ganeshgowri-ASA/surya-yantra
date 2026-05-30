---
title: "Structural Lint Report — 2026-05-30 (Friday)"
date: "2026-05-30"
weekly_angle: "Fri — publication-ready polish + ideation→implementation diagram"
base_branch: "main"
base_commit: "3031b05"
reviewed_files:
  - docs/API.md
  - docs/IEC-CORRECTIONS.md
  - docs/DEPLOYMENT.md
  - docs/HARDWARE-SETUP.md
  - hardware/BOM.md
  - README.md
---

# Structural Lint Report — 2026-05-30 (Friday)

Full structural lint of `docs/`, `hardware/`, and root `README.md` on the main
branch base (commit `3031b05`), plus new files introduced in this PR.

---

## 1. Heading hierarchy

| File | Result | Notes |
|------|--------|-------|
| `docs/API.md` | ✅ PASS | H1 → H2 only; no skips |
| `docs/IEC-CORRECTIONS.md` | ✅ PASS | H1 → H2 → H3 clean |
| `docs/DEPLOYMENT.md` | ✅ PASS | H1 → H2 only |
| `docs/HARDWARE-SETUP.md` | ✅ PASS | H1 → H2 → H3 clean |
| `hardware/BOM.md` | ✅ PASS | H1 → H2 only |
| `README.md` | ✅ PASS | H1 → H2 only |
| `posts/2026-05-30-iv-reliability-loop.md` | ✅ PASS | H1 → H2 → H3 clean |
| `drafts/article-seed-ganitasutra-smmf-quadrature.md` | ✅ PASS | H1 → H2 → H3 |
| `drafts/article-seed-solarlabx-nabl-chain.md` | ✅ PASS | H1 → H2 → H3 |

**No heading-level skips. No orphaned H3s.**

---

## 2. Citation coverage

| File | Citations | Gaps / Actions |
|------|-----------|----------------|
| `docs/IEC-CORRECTIONS.md` | ✅ §5 — 5 IEC refs + Martin-Ruiz | IEC webstore URLs absent — open issue #98 |
| `docs/HARDWARE-SETUP.md` | ✅ §9 — 4 further-reading entries | Year/edition missing; tolerable for an internal guide |
| `docs/API.md` | ⚠️ RFC 7807 mentioned in preamble — no refs section | Low priority (procedural doc); filed as issue #99 |
| `docs/DEPLOYMENT.md` | ✅ Procedural doc — citations not required | — |
| `hardware/BOM.md` | ✅ Vendor URLs in table cells | — |
| `posts/2026-05-30-iv-reliability-loop.md` | ✅ 10 refs with DOIs | DOIs verified manually |

---

## 3. Broken internal links

| Link | File | Status | Tracking |
|------|------|--------|---------|
| `packages/scpi-client/` | README.md | ❌ dir does not exist | issue #89 |
| `packages/iv-engine/` | README.md | ❌ dir does not exist | issue #89 |
| `packages/types/` | README.md | ❌ dir does not exist | issue #89 |
| `hardware/schematics/` | README.md, HARDWARE-SETUP.md | ❌ dir does not exist | issue #90 |
| `hardware/WIRING.md` | README.md | ❌ file does not exist | issue #90 |
| `docs/PRD.md` | README.md | ❌ file does not exist | filed prior PR |
| `hardware/firmware/mux-controller/` | HARDWARE-SETUP.md §4.2 | ❌ dir does not exist | issue #92 |
| `apps/desktop/relay` | DEPLOYMENT.md §8 | ❌ dir does not exist | issue #91 (P0) |

**All 8 are pre-existing broken links tracked in open issues. None introduced by this PR.**

---

## 4. Alt-text on figures

**No raster images found in any doc or article file.** All diagrams are ASCII art
or Mermaid code blocks (rendered client-side). The published article
`posts/2026-05-30-iv-reliability-loop.md` includes a `fig-*` list in its
front-matter `Figures Needed` section with alt-text strings prepared for when
the SVG/PNG assets are produced.

OG image stub: `posts/2026-05-30-iv-reliability-loop.md` specifies
`og_image: "/og/iv-curve-to-reliability-loop.png"` — file must be created at
`apps/web/public/og/iv-curve-to-reliability-loop.png` (1200 × 630 px) before
the article is live on the Vercel site. Filed as issue #106.

---

## 5. Typos and stale timestamps

| File | Issue | Action |
|------|-------|--------|
| `docs/API.md` (main) | `smmmfUsed` triple-m typo in CorrectionResult | **Fixed** in this PR → `smmfUsed` |
| `docs/API.md` (main) | Footer `Generated 2026-04-17` | **Updated** → `Last lint pass 2026-05-30` |
| `docs/API.md` (main) | `"model": "claude-opus-4-7"` — deprecated model ID | **Updated** → `claude-opus-4-8` |
| `hardware/BOM.md` | Footer `Last updated 2026-04-17` | Not changed (prices still valid as of May 2026; re-stamp only when prices refreshed) |
| `docs/DEPLOYMENT.md` | `NEXTAUTH_URL` set to `surya-yantra.vercel.app` but custom domain is `surya-yantra.srishtipvlab.in` | Added clarifying comment in this PR |

---

## 6. API documentation completeness (carried from Thu pass)

| Gap | Action |
|-----|--------|
| `GET /api/health` — used in DEPLOYMENT.md §7 but not documented | **Added** |
| `POST /api/mux/:testBedId/selftest` — referenced in HARDWARE-SETUP.md §4.4 | **Added** |
| `POST /api/corrections/apply` — pipeline endpoint referenced in IEC-CORRECTIONS.md §4 | **Added** |
| `503` error code for unhealthy DB | **Added** to Error Codes table |

---

## 7. Vercel build status

| Project | Latest deployment | State | Checked |
|---------|------------------|-------|---------|
| surya-yantra | `dpl_32AvUJwz9UxHkKR8WDBcyhZKu4dJ` | ✅ **READY** | 2026-05-30 |

All 20 most-recent surya-yantra deployments on Vercel are in `READY` state.
No build failures. No action required.

---

## 8. Article promotion: iv-reliability-loop

| Check | Result |
|-------|--------|
| Abstract ≤ 250 words | ✅ ~240 words |
| SEO front-matter complete | ✅ title, description, keywords, canonical URL, og_image |
| D2 bias claim quantified correctly | ✅ 0.22 % (from §1.5 worked example, single-condition caveat added) |
| All TODOs resolved or noted with caveats | ✅ |
| Ideation→implementation diagram added | ✅ Mermaid flowchart in §2 |
| Implementation map table | ✅ |
| Uncertainty budget table | ✅ |
| References with DOIs | ✅ 10 refs |
| Broken links | ✅ None introduced |
| Procedure selection rules table | ✅ |

**Promotion decision: ✅ Approved for `posts/`.**

---

*Report generated 2026-05-30 by Claude Code automated editorial pass (Friday angle).*
