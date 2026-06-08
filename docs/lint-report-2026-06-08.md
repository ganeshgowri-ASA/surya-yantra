# Structural Lint Report — 2026-06-08 (Sunday)

Scanned: `docs/` (4 files), `hardware/BOM.md`, `README.md`.
Branch: `main` tip `3031b05` (2026-04-17). **No files updated in last 24 h.**

---

## Heading Hierarchy

| File | Result | Notes |
|------|--------|-------|
| `docs/API.md` | PASS | H1 → H2 → H3, no skips |
| `docs/IEC-CORRECTIONS.md` | PASS | H1 → H2 → H3 → H4, correct nesting |
| `docs/HARDWARE-SETUP.md` | PASS | H1 → H2, no skips |
| `docs/DEPLOYMENT.md` | PASS | H1 → H2, no skips |
| `hardware/BOM.md` | PASS | H1 → H2, correct |
| `README.md` | PASS | Single H1, sub-sections as H2, no gaps |

---

## Citation Coverage

| File | Result | Finding | Action |
|------|--------|---------|--------|
| `docs/IEC-CORRECTIONS.md` | WARN | IEC 60891:2021, IEC 60904-7:2019, IEC 61853-2:2016 cited by name but no URLs or DOIs | Issue filed |
| `docs/API.md` line 259 | WARN | Deprecated model `claude-opus-4-7` in `/api/ai/chat` example | **Auto-fixed → `claude-opus-4-8`** |
| `docs/API.md` line 319 | WARN | Footer date stale (2026-04-17) | **Auto-fixed → reviewed 2026-06-08** |
| `docs/HARDWARE-SETUP.md` | INFO | References IEC 60891, IEC 60904-1 in passing; no citation block | Low priority |

---

## Broken Paths / Links

| File | Result | Finding | Action |
|------|--------|---------|--------|
| `README.md` line 58 | WARN | `hardware/schematics/` listed in repo tree but directory absent | **Auto-fixed — marked (planned)** |
| `README.md` line 60 | WARN | `hardware/WIRING.md` listed but file absent | **Auto-fixed — marked (planned)** |
| `docs/HARDWARE-SETUP.md` | WARN | `../hardware/schematics/` referenced — directory absent | Issue filed |
| `hardware/BOM.md` | INFO | 12 vendor URLs present; live link check not possible in this session; recommend CI `lychee` linkcheck | No action |

---

## Alt-text on Figures

| File | Result | Notes |
|------|--------|-------|
| All docs | PASS | No `![...]()` image tags in any file; diagrams use ASCII art |
| `docs/HARDWARE-SETUP.md` | INFO | ASCII block diagram is adequate for now; recommend SVG + prose alt-text when `hardware/schematics/` is populated |

---

## Summary

| Severity | Count | Action |
|----------|-------|--------|
| WARN — auto-fixed in this PR | 4 | Done |
| WARN — issue filed | 2 | See GitHub issues |
| INFO — no action | 2 | Tracked in roadmap |
