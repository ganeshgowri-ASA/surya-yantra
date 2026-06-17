# Structural Lint Report — 2026-06-17 (W25 Tuesday)

Weekly angle: **bulk-removal of stale drafts / phantom references**.

Scope: `README.md`, `docs/`, `hardware/BOM.md`, `apps/web/prisma/schema.prisma`, `apps/web/lib/`.

---

## Auto-fixed in this PR

| # | File | Issue | Fix |
|---|------|-------|-----|
| 1 | `README.md` | `packages/` subtree (scpi-client, iv-engine, types) listed in repo structure but directory does not exist | Removed phantom section; directory will be added when packages are actually extracted |
| 2 | `README.md` | `hardware/schematics/` referenced as "SVG circuit diagrams" — directory does not exist | Replaced with honest note: schematics in progress, not yet committed |
| 3 | `README.md` | `hardware/WIRING.md` listed but file does not exist | Removed; coverage folded into `docs/HARDWARE-SETUP.md` reference |
| 4 | `README.md` | `docs/PRD.md` listed but file does not exist (actual docs are API, DEPLOYMENT, HARDWARE-SETUP, IEC-CORRECTIONS) | Fixed to reflect actual files |
| 5 | `docs/API.md` | Example payload uses `"model": "claude-opus-4-7"` — outdated model ID | Updated to `claude-opus-4-8` |
| 6 | `docs/API.md` | Footer: "Generated 2026-04-17" — 2 months stale | Updated to "Last reviewed 2026-06-17" |
| 7 | `apps/web/prisma/schema.prisma` | `AIConversation.model` default `"claude-3-5-sonnet"` — model family discontinued | Updated to `"claude-sonnet-4-6"` |

---

## Issues filed (substantive gaps — require human decision)

See GitHub issues created alongside this PR.

| Issue | Title | Priority |
|-------|-------|----------|
| #TBD | `smmmf*` triple-m typo in schema + API docs (breaking migration required) | High |
| #TBD | `packages/iv-engine` extraction: standalone npm package for IEC correction engine | Medium |
| #TBD | `hardware/schematics/` — SVG circuit diagrams missing (blocker for IEC 62446-1 documentation) | Medium |
| #TBD | `apps/desktop/relay` service not implemented — blocks Cloudflare Tunnel path in DEPLOYMENT.md | Medium |
| #TBD | `docs/PRD.md` — Product Requirements Document never created | Low |
| #TBD | Lab benchmark data for WebSocket streaming latency (needed for article #1) | Low |

---

## Heading-hierarchy check

| File | Result |
|------|--------|
| `README.md` | H1 → H2 only. No skipped levels. PASS |
| `docs/API.md` | H1 → H2 → H3 (§Library API subsections). No skipped levels. PASS |
| `docs/IEC-CORRECTIONS.md` | H1 → H2 → H3 → H4 (§1.5 table). No skipped levels. PASS |
| `docs/DEPLOYMENT.md` | H1 → H2 (numbered). No H3 used. PASS |
| `docs/HARDWARE-SETUP.md` | H1 → H2 → H3. No skipped levels. PASS |
| `hardware/BOM.md` | H1 → H2 (sections). PASS |

---

## Citation coverage

| File | Citations present | Gaps |
|------|------------------|------|
| `docs/IEC-CORRECTIONS.md` | IEC 60891:2021, IEC 60904-3:2019, IEC 60904-7:2019, IEC 61853-2:2016, Martin & Ruiz 2001 | None — complete |
| `docs/HARDWARE-SETUP.md` | IEC 62446-1:2016, IEC 61730-1/2:2023, IEEE 1547:2018 | IEC 61010-1 cited inline (§2.3) but not in "Further reading" |
| `docs/API.md` | None (API reference, citations not expected) | N/A |
| `hardware/BOM.md` | None (procurement doc) | N/A |

---

## Broken-link check

| Link | Status |
|------|--------|
| `hardware/BOM.md` (in README + HARDWARE-SETUP) | PASS — file exists |
| `docs/HARDWARE-SETUP.md` (in README, post-fix) | PASS — file exists |
| `docs/IEC-CORRECTIONS.md` (in README + API) | PASS — file exists |
| ~~`packages/scpi-client/`~~ | REMOVED |
| ~~`hardware/schematics/`~~ | REMOVED |
| ~~`hardware/WIRING.md`~~ | REMOVED |
| ~~`docs/PRD.md`~~ | REMOVED |
| `apps/desktop/relay` (in DEPLOYMENT.md §8) | WARN — path does not exist, issue filed |
| External BOM vendor URLs | Not checked (out of scope for static lint) |

---

## Alt-text check

No `<img>` tags or `![...]()` images in any doc file. Markdown badge `img` shields in README use descriptive alt text via the badge URL label. PASS.

---

## Vercel deployment status

Project: **surya-yantra** (`prj_QiTDz1I0e4kde3Fy2j0pZ1LJqTrc`) — latest deployment state: **READY** (green).

---

## Article seeds created

- `drafts/2026-06-17-websocket-scpi-iv-streaming.md` — "Open-Source WebSocket–SCPI Bridge for Real-Time PV IV Curve Streaming"
- `drafts/2026-06-17-iec-corrections-typescript-open-source.md` — "Implementing IEC 60891:2021 Procedures 1–4 in TypeScript"

Both bridge today's engineering commits (LiveIVChart, IEC correction engine, WebSocket streaming) to publishable research narratives targeting MDPI Sensors and Measurement (Elsevier).

---

*Automated by Claude Code scheduled routine — W25 Tuesday angle.*
