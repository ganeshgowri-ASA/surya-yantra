# Structural Lint Report — 2026-05-23

**Branch:** `claude/wizardly-lovelace-PBuhl`
**Run by:** Claude Code editorial agent
**Weekly angle:** Saturday — SEO / metadata
**Scope:** `README.md`, `docs/*.md`, `hardware/BOM.md`, `drafts/article-*.md`
**Last 24 h changes:** No new commits to main since 2026-04-17. Two articles promoted to `peer-review` status on branch `claude/wizardly-lovelace-SxBNY` (2026-05-22). Two new seeds created this pass (article-003, article-004).

---

## 1. Heading Hierarchy

### docs/ and root

| File | Hierarchy | Status |
|---|---|---|
| `README.md` | H1 → H2 → H3, all code-block `#` confirmed benign | ✅ Pass |
| `docs/API.md` | H1 → H2 → H3 | ✅ Pass |
| `docs/IEC-CORRECTIONS.md` | H1 → H2 → H3 (via numbered §) | ✅ Pass |
| `docs/HARDWARE-SETUP.md` | H2 → H3 | ✅ Pass |
| `docs/DEPLOYMENT.md` | H1 → H2 | ✅ Pass |
| `hardware/BOM.md` | H1 → H2 | ✅ Pass |

### drafts/

| File | Hierarchy | Status |
|---|---|---|
| `article-001` | H1 → H2 → H3 (via §1.1, §1.2, etc.) | ✅ Pass |
| `article-002` | H1 → H2 → H3 | ✅ Pass |
| `article-003` | H1 → H2 → H3 | ✅ Pass |
| `article-004` | H1 → H2 → H3 | ✅ Pass |

**No heading hierarchy violations found.**

---

## 2. Citation Coverage

### docs/ files

| File | Standards cited | Refs section | Gaps |
|---|---|---|---|
| `docs/IEC-CORRECTIONS.md` | IEC 60891:2021, IEC 60904-7:2019, IEC 61853-2:2016, Martín & Ruiz 2001 | ✅ §5 | IEC editions not stated in §5 entries — add "Edition 3" etc. |
| `docs/API.md` | IEC standards mentioned informally | ❌ No refs section | Should link to `IEC-CORRECTIONS.md` |

### article drafts

| File | Placeholders remaining | Severity |
|---|---|---|
| `article-001` | Refs 5–6 (`Virtuani 2018`, `Friesen 2014`) blank | ⚠️ Must fill before `enhanced` |
| `article-001` | `[CITATION NEEDED]` in §2.3 | ⚠️ Track in issue #79-equivalent |
| `article-002` | Refs 4–6 blank (`LLM scientific data`, `Socket.IO`, `PV fault ML survey`) | ⚠️ Must fill before `enhanced` |
| `article-002` | `[CITATION NEEDED]` in §1 (LLM scientific reasoning) | ⚠️ Same |
| `article-003` | Seed — no refs expected yet | ✅ OK |
| `article-004` | Seed — no refs expected yet | ✅ OK |

---

## 3. Broken Links

All broken links carried over from 2026-05-22 lint report — no regression introduced this pass, and no new broken links added.

| Location | Link | Status |
|---|---|---|
| `README.md` | `LICENSE` badge | ❌ Open — issue #80 |
| `README.md` | `hardware/schematics/` | ❌ Open — issue #73 |
| `README.md` | `hardware/WIRING.md` | ❌ Open — issue #73 |
| `README.md` | `docs/PRD.md` | ❌ Open — issue #72 |
| `README.md` | `packages/scpi-client/`, `iv-engine/`, `types/` | ❌ Open — issue #71 |
| `docs/DEPLOYMENT.md` §8 | `apps/desktop/relay` | ❌ Open — issue #44 |
| `docs/HARDWARE-SETUP.md` §4.2 | `hardware/firmware/mux-controller/` | ❌ Open — issue #45 |

No auto-safe fixes available for broken links in this pass (all require content creation or cross-repo access).

---

## 4. Alt-Text on Figures

No images in any Markdown file in the working tree. `hardware/schematics/` still missing (issue #73). When added, all figure references must include descriptive alt-text per WCAG 2.1 §1.1.1.

---

## 5. Front-Matter Completeness (Saturday SEO check)

| Field | article-001 | article-002 | article-003 | article-004 |
|---|---|---|---|---|
| `title` | ✅ | ✅ | ✅ | ✅ |
| `slug` | ✅ | ✅ | ✅ | ✅ |
| `status` | ✅ | ✅ | ✅ | ✅ |
| `date` | ✅ | ✅ | ✅ | ✅ |
| `lastmod` | ✅ | ✅ | ✅ | ✅ |
| `lang` | ✅ | ✅ | ✅ | ✅ |
| `description` | ✅ | ✅ | ✅ | ✅ |
| `keywords` | ✅ (10) | ✅ (9) | ✅ (8) | ✅ (9) |
| `canonical_url` | ✅ | ✅ | ✅ | ✅ |
| `og_image` | ✅ stub | ✅ stub | ✅ stub | ✅ stub |
| `twitter_card` | ✅ | ✅ | ✅ | ✅ |
| `schema_type` | ✅ | ✅ | ✅ | ✅ |
| `reading_time_minutes` | ✅ | ✅ | ✅ | ✅ |
| `orcid` | ⚠️ empty | ⚠️ empty | ⚠️ empty | ⚠️ empty |

**ORCID gap:** All articles have an empty `orcid` field. This must be filled before submission.

---

## 6. Stale-Date Audit

| File | Last-modified | Age | Status |
|---|---|---|---|
| `docs/API.md` | 2026-04-17 | 36 days | ⚠️ Stale footer date when new routes added |
| `article-001` | 2026-05-23 | 0 days | ✅ |
| `article-002` | 2026-05-23 | 0 days | ✅ |
| `article-003` | 2026-05-23 | 0 days | ✅ (new seed) |
| `article-004` | 2026-05-23 | 0 days | ✅ (new seed) |

---

## 7. Summary

| Check | Passing | Failing / Warnings |
|---|---|---|
| Heading hierarchy (all files) | 10 / 10 | 0 |
| Internal broken links | 0 / 7 | 7 (all pre-existing) |
| Citation placeholders | articles 003–004 ok | articles 001–002 have 4 `[CITATION NEEDED]` |
| Alt-text | N/A (no figures) | — |
| SEO front-matter completeness | 4 / 4 articles | ORCID empty (all) |
| `sitemap.xml` | ✅ created | Needs Next.js wiring |
| `robots.txt` | ✅ created | Verify deploy path |

### Issues requiring action (filed or existing)

| Issue | Action |
|---|---|
| #48 | OG image PNG files still missing — needs `next/og` route or manual design |
| #49 | Sitemap + robots stubs created; must be wired to Next.js build |
| #79 | article-002 "91% accuracy" claim marked preliminary — must validate before submission |
| NEW-A | Add `og_title` (≤ 60 chars) field to front-matter schema (see SEO audit §4) |
| NEW-B | Emit JSON-LD structured data from Next.js head using front-matter schema_type |
| NEW-C | Confirm canonical domain (`srishtipvlab.in` vs. `surya-yantra.vercel.app`) |
| #80 | `LICENSE` file still missing |
