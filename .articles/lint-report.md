# Structural Lint Report — 2026-06-05

Run against: `docs/`, `hardware/`, `drafts/`, `posts/`

---

## Summary

| Check | Status |
|---|---|
| Heading hierarchy | 4 files PASS, 0 FAIL |
| Citation coverage | 1 WARN (`API.md`, `DEPLOYMENT.md` have no references section) |
| Broken internal links | 4 FAIL (missing directories referenced in README/HARDWARE-SETUP) |
| Stale content | 1 FAIL (`API.md` model ID), 2 WARN (datestamps) |
| Alt-text on figures | N/A — no image assets found in docs/ |
| `drafts/` articles (today) | 2 created (bootstrapped) |
| `posts/` | 0 published articles |

---

## 1. Heading Hierarchy

### docs/API.md — PASS
Hierarchy: `#` → `##` → `###` — correct throughout.

### docs/IEC-CORRECTIONS.md — PASS
Hierarchy: `#` → `##` (`## 1. …`) → `### 1.1 …` — correct.

### docs/HARDWARE-SETUP.md — PASS
Hierarchy: `#` → `##` → `###` → `####` — correct.

### hardware/BOM.md — PASS
`#` → `##` section headers only — acceptable for a BOM table.

---

## 2. Citation Coverage

### docs/IEC-CORRECTIONS.md — PASS
§5 References has 5 properly numbered citations (IEC 60891, 60904-3, 60904-7, 61853-2, Martin-Ruiz 2001).

### docs/API.md — WARN
No references/citations section. This is acceptable for a pure API reference but a `## References` section with the Anthropic API docs and RFC 7807 would improve auditability.

### docs/DEPLOYMENT.md — WARN
No references section. Consider adding Vercel docs, Prisma migration docs, and IEC 62446-1 for post-deploy compliance.

### hardware/BOM.md — PASS
Every line item includes a vendor URL. Prices are dated 2026-04-17 (>45 days old — flag for procurement review).

---

## 3. Broken Internal Links

### README.md:52 — FAIL
References `packages/scpi-client/` — directory does not exist in repo.

### README.md:53 — FAIL
References `packages/iv-engine/` — directory does not exist in repo.

### README.md:54 — FAIL
References `packages/types/` — directory does not exist in repo.

### docs/HARDWARE-SETUP.md:132 — FAIL
References `hardware/firmware/mux-controller/` — directory does not exist in repo.

> **Triage note:** These are planned but unimplemented packages. README shows the _intended_ monorepo layout. Open issues filed — see §6 below.

---

## 4. Stale Content

### docs/API.md:259 — FAIL (auto-fixed in this PR)
`"model": "claude-opus-4-7"` — model ID is stale. Corrected to `claude-opus-4-8`.

### docs/API.md footer — WARN
Datestamp `2026-04-17` is ~49 days old. Updated to `2026-06-05` in this PR.

### hardware/BOM.md footer — WARN
`Last updated 2026-04-17` — prices from April 2026 may have drifted. Manual review recommended before raising POs.

---

## 5. Alt-Text / Figures

No image files (`*.png`, `*.jpg`, `*.svg`) found in `docs/` or `hardware/`. The ASCII block diagrams in HARDWARE-SETUP.md are in fenced code blocks (not `<img>` elements) so no alt-text is required.

**Gap:** The README references `hardware/schematics/` SVG circuit diagrams (system overview, MUX wiring, Kelvin detail, rack layout) — these files do not exist. When added, each `<img>` in Markdown must carry meaningful `alt` text.

---

## 6. Issues Filed

| # | Title | Severity |
|---|---|---|
| TBD | `packages/scpi-client` not implemented — SCPI driver missing | High |
| TBD | `packages/iv-engine` not implemented — standalone correction engine missing | Medium |
| TBD | `hardware/firmware/mux-controller` source not committed | Medium |
| TBD | `hardware/schematics/` SVG diagrams not committed | Low |
| TBD | Lab validation data missing from IEC article draft | High |

---

## 7. Articles Bootstrapped Today

| File | Status | Weekly angle applied |
|---|---|---|
| `drafts/2026-06-05-iec60891-open-source.md` | Draft | Thu: peer-review checklist |
| `drafts/2026-06-05-realtime-iv-streaming.md` | Draft | Thu: peer-review checklist |

---

*Generated automatically — 2026-06-05 · weekly angle: Thursday (peer-review checklist)*
