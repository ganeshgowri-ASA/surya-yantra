# Structural Lint Report — Surya Yantra docs/ + drafts/

*Generated: 2026-06-06 · Friday weekly angle*
*Previous report: 2026-06-05 (Thursday)*

---

## Scope

Files scanned: `docs/API.md`, `docs/IEC-CORRECTIONS.md`, `docs/HARDWARE-SETUP.md`,
`docs/DEPLOYMENT.md`, `README.md`, `drafts/2026-06-05-iec60891-open-source.md`,
`drafts/2026-06-05-realtime-iv-streaming.md`

---

## docs/API.md

| Check | Status | Detail |
|-------|--------|--------|
| Heading hierarchy | ✅ PASS | H1 → H2 throughout; no skipped levels |
| Internal cross-links | ✅ PASS | Links to IEC-CORRECTIONS.md and DEPLOYMENT.md valid |
| Broken links | ✅ PASS | All relative paths verified |
| Alt-text on figures | N/A | No figures |
| `smmmfUsed` typo | ✅ **FIXED (Fri)** | Corrected to `smmfUsed` in CorrectionResult JSON example |
| Stale model ID | ✅ FIXED (Thu) | `claude-opus-4-8` |
| Missing `/api/health` | ✅ **FIXED (Fri)** | Documented with 200 / 503 response shapes |
| HTTP 503 in error table | ✅ **FIXED (Fri)** | Added alongside Health Check section |
| Footer date | ✅ **UPDATED (Fri)** | `last reviewed 2026-06-06` |

---

## docs/IEC-CORRECTIONS.md

| Check | Status | Detail |
|-------|--------|--------|
| Heading hierarchy | ✅ PASS | H1 → H2 → H3; correct nesting |
| Citation coverage | ✅ PASS | 5 IEC primary-source references, all cited in-text |
| Broken links | ✅ PASS | No outbound links |
| Alt-text on figures | N/A | ASCII art only; no img tags |
| Equation consistency | ✅ PASS | `G` used throughout; no mixing with `Irr` |
| Worked example values | ✅ PASS | Match `posts/2026-06-06-iec60891-open-source.md` §3.4 |

---

## docs/HARDWARE-SETUP.md

| Check | Status | Detail |
|-------|--------|--------|
| Heading hierarchy | ✅ PASS | H1 → H2 → H3 |
| §9 external refs | ⚠️ WARN | IEC 62446, IEC 61730, IEEE 1547 cited as bare text; no hyperlinks |
| Broken internal link | ❌ **FAIL** | §4.2 references `hardware/firmware/mux-controller/` — directory absent |
| Alt-text on figures | N/A | ASCII art only |
| Commissioning checklist | ✅ PASS | 10 actionable checkbox items |

---

## docs/DEPLOYMENT.md

| Check | Status | Detail |
|-------|--------|--------|
| Heading hierarchy | ✅ PASS | H1 → H2 |
| `/api/health` smoke test | ✅ PASS | Endpoint now documented in API.md |
| `.env.example` reference | ❌ **FAIL** | Copied in Quick Start but file is absent from repo |
| `apps/desktop/relay` | ❌ **FAIL** | Referenced in §8 but relay service not yet implemented |
| Alt-text on figures | N/A | No figures |

---

## README.md

| Check | Status | Detail |
|-------|--------|--------|
| Heading hierarchy | ✅ PASS | H2 → H3; no gaps |
| Repo structure | ❌ **FAIL** | Lists `packages/scpi-client/`, `packages/iv-engine/`, `packages/types/` — none exist |
| Broken file references | ❌ **FAIL** | `hardware/schematics/`, `hardware/WIRING.md`, `docs/PRD.md` referenced but absent |
| Badge alt-text | ✅ PASS | Shield.io badges carry descriptive alt text |

---

## drafts/2026-06-05-iec60891-open-source.md

| Check | Status | Detail |
|-------|--------|--------|
| Heading hierarchy | ✅ PASS | H1 → H2 → H3 → H4 |
| Abstract word count | ✅ PASS | ~235 words |
| Title word count | ❌ → FIXED | 16 words in draft; trimmed to 14 in polished post |
| Equation numbers | ❌ → FIXED | Missing in draft; (1)–(8) added in polished post |
| §2.2 citations | ⚠️ WARN | 2 × [AUTH NEEDED]; researcher to resolve |
| §4 Results | ❌ **FAIL** | Placeholder only — real lab data required |
| Figures 1 & 2 | ❌ **FAIL** | Placeholder captions; no SVG produced yet |
| Author sections | ❌ → FIXED | Missing in draft; added in polished post |
| **Polished version** | ✅ | `posts/2026-06-06-iec60891-open-source.md` |

---

## drafts/2026-06-05-realtime-iv-streaming.md

| Check | Status | Detail |
|-------|--------|--------|
| Heading hierarchy | ✅ PASS | H1 → H2 → H3 |
| Abstract word count | ✅ PASS | ~230 words |
| Title word count | ✅ PASS | 15 words exactly |
| §2.3 / §5.1 citations | ⚠️ WARN | 3 × [CITATION NEEDED] |
| §4 Performance data | ❌ **FAIL** | All placeholder — lab benchmarks not yet captured |
| Architecture diagram | ⚠️ WARN | ASCII art; needs SVG + alt-text before submission |
| USB baud rate | ⚠️ WARN | Listed as 9600; verify against ESL-Solar 500 datasheet |
| Status | 🔶 | Awaiting benchmarks; not ready for Polish pass yet |

---

## Issues to File

| Priority | Description | Affected file(s) |
|----------|-------------|------------------|
| P1 | Real IV dataset for §4 Results | `2026-06-05-iec60891-open-source.md` |
| P1 | `packages/scpi-client` missing from monorepo | `README.md`, `2026-06-05-realtime-iv-streaming.md §5.3` |
| P1 | `hardware/firmware/mux-controller/` absent | `HARDWARE-SETUP.md §4.2` |
| P2 | `.env.example` missing | `DEPLOYMENT.md`, `README.md` |
| P2 | `hardware/schematics/` + `WIRING.md` absent | `README.md` |
| P2 | GitHub Actions CI/CD not configured | repo-wide |
| P2 | `apps/desktop/relay` service unimplemented | `DEPLOYMENT.md §8` |
| P3 | `docs/PRD.md` absent | `README.md` |

---

*Next lint pass: Saturday 2026-06-07 (SEO / metadata angle)*
