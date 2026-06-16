# Structural Lint Report — 2026-06-16 (W25 Tuesday)

> Scope: `drafts/*.md` (2 existing, 2 new seeds added this pass)  
> Weekly angle: **Tuesday — stale-draft audit + bulk removal**  
> Vercel build status: **READY** (`dpl_4eHxcVUjKeDbvauZ1XNiPfvZMxty`, preview branch;  
> production still undeployed — issue #153)

---

## Summary

| Check | Files scanned | Findings | Auto-fixed | New issues filed |
|-------|--------------|----------|------------|------------------|
| Stale-draft audit | 2 | 0 stale (both kept) | — | — |
| Heading hierarchy | 2 | 0 violations | — | — |
| Citation coverage | 2 | 7 TODO DOIs across 2 files | 0 | #178, #180 |
| Broken internal links | 2 | 1 ghost file reference | 0 | #179 |
| Alt-text on figures | 2 | 1 figure placeholder, no alt-text | 0 | #177 |
| New seeds created | — | 2 seeds scaffolded | ✓ 2 | — |

---

## 1. Stale-Draft Audit — 0 REMOVED

Tuesday's primary task is identifying and bulk-removing drafts with no
forward momentum. Criteria for stale classification:
- Age > 30 days with no commit touching the file, **and**
- Status remains `seed` or `outline` with no active blocking issues closed.

| File | Age | Status | Active blocking issues | Verdict |
|------|-----|--------|----------------------|--------|
| `2026-06-09-ws-iv-tracing-systems.md` | 7 days | outline | #142, #152 | **KEEP** |
| `2026-06-09-nabl-open-source-pv-lims.md` | 7 days | outline | #120, #137, #141 | **KEEP** |

Neither draft qualifies as stale. Both have active blocking issues and
substantive content (9 kB and 12.5 kB respectively). Frontmatter updated
with `tuesday_audit_2026-06-16: keep` and `stale: false`.

**No drafts removed this pass.**

Next stale check scheduled: **2026-07-14** (Tuesday, 28 days from now).
If no blocking issues on either draft have been closed by then, escalate
to issue discussion before removing.

---

## 2. Heading Hierarchy — PASS

Both drafts use a single `# H1` ("Outline" or "Seed / Research Narrative")
followed by `## H2` and `### H3` with no skipped levels. No violations found.

---

## 3. Citation Coverage

### `2026-06-09-ws-iv-tracing-systems.md` — WARNING

8 references listed; 4 have `TODO` placeholders with missing DOIs:

| Ref # | TODO item |
|-------|----------|
| 5 | Ransome & Sutterlueti 2011 — EU PVSC — DOI missing |
| 6 | IEC 60904-7:2019 — citation body missing |
| 7 | Recharts performance benchmark — no citation exists yet |
| 8 | India solar testing capacity — MNRE/IEA source needed |

Filed as **issue #178** (citation completion sprint for ws-iv-tracing-systems).

### `2026-06-09-nabl-open-source-pv-lims.md` — WARNING

10 references listed; 3 have `TODO` placeholders:

| Ref # | TODO item |
|-------|----------|
| 7 | MNRE PLI scheme — official URL missing |
| 8 | NABL accredited lab count — NABL directory lookup needed |
| 9 | Open-source LIMS comparison paper — prior art search needed |

Filed as **issue #180** (citation completion sprint for nabl-open-source-pv-lims).

---

## 4. Broken Internal Links

### `2026-06-09-ws-iv-tracing-systems.md` §3.5 — ERROR

The draft references `apps/web/lib/api-auth.ts` as the planned location for
a `requireAuth()` middleware guard. **This file does not exist** in the
repository (confirmed: `ls apps/web/lib/` shows only `iam.ts`, `iec60891.ts`,
`smmf.ts`, `utils.ts`, `websocket-server.ts`).

- Draft updated this pass to flag the missing file inline.
- Filed as **issue #179** (scaffold `api-auth.ts` for WebSocket auth guard).

### `2026-06-09-nabl-open-source-pv-lims.md` — PASS

All internal references verified:
- `apps/web/prisma/schema.prisma` — exists ✓  
- `apps/web/lib/iec60891.ts` — exists ✓  
- `docs/IEC-CORRECTIONS.md` — exists ✓  
- `docs/DEPLOYMENT.md §11` — §11 "Cost envelope" confirmed present ✓  

---

## 5. Alt-Text on Figures

### `2026-06-09-ws-iv-tracing-systems.md` §5.3 — WARNING

Section 5.3 contains a figure placeholder:
```
> *TODO: SVG showing the dual-path: streaming path (WebSocket) and correction
> path (REST POST /api/corrections/p2).*
```

The placeholder has no alt-text. WCAG 1.1.1 (Success Criterion AA) requires
that all non-text content have a text alternative.

Action taken: draft updated with a suggested alt-text block:
```
Alt-text: "Dual-path diagram showing raw IV points flowing left-to-right
from ESL-Solar 500 via Socket.IO (streaming path) to LiveIVChart browser
component, and via REST POST /api/corrections/p2 (post-hoc correction path)
to the STC report output."
```

Filed as **issue #177** (add SVG figure with alt-text to ws-iv-tracing-systems §5.3).

---

## 6. New Article Seeds (Tuesday weekly angle)

Two seeds created linking day's engineering progress across repos:

| File | Working title | Cross-repo link | Target journal |
|------|--------------|----------------|---------------|
| `drafts/2026-06-16-ai-pv-fault-diagnosis.md` | Conversational AI for Solar PV Module Fault Diagnosis | surya-yantra `/api/ai/chat` × antaryami-os agent patterns | Solar Energy / IEEE J-PVSC |
| `drafts/2026-06-16-ganitasutra-simuflow-scpi.md` | Web-Based Block Diagram Simulation as SCPI Test Sequence Validator | GanitaSutra SimuFlow × surya-yantra ESL-Solar 500 SCPI table | IEEE TIM / Measurement |

### Research narrative rationale

**AI fault diagnosis seed** — The `/api/ai/chat` endpoint (streaming Claude
Sonnet 4.6) is live in `apps/web/app/api/`. The antaryami-os enterprise AI OS
(last updated 2026-05-10) provides the multi-agent scaffolding to wrap the LLM
call into a reliable diagnostic pipeline. The research gap: no published LLM
benchmark for IV curve fault classification exists; rule-based methods (PV-Lib)
are the current reference.

**SCPI validation seed** — GanitaSutra SimuFlow (last updated 2026-05-03)
provides a browser-based block diagram engine that is structurally identical
to what would be needed to specify the ESL-Solar 500 SCPI state machine. The
timing violation (9600-baud USB imposes ~52 ms/point, making a 500-step scan
unacceptably slow) already appears in `ws-iv-tracing-systems §4.1` — the
SimuFlow simulation would catch this before hardware integration. Both papers
reinforce each other: the timing model is a shared cross-reference.

---

## 7. Draft Inventory (post-pass)

| File | Date | Status | Stale audit | Next action |
|------|------|--------|-------------|-------------|
| `2026-06-09-ws-iv-tracing-systems.md` | 2026-06-09 | outline | KEEP | Close #142 (benchmark), #152 (auth) |
| `2026-06-09-nabl-open-source-pv-lims.md` | 2026-06-09 | outline | KEEP | Close #120 (uncertainty field), #137 (Annex B) |
| `2026-06-16-ai-pv-fault-diagnosis.md` | 2026-06-16 | seed | N/A | Source labelled fault dataset (#141) |
| `2026-06-16-ganitasutra-simuflow-scpi.md` | 2026-06-16 | seed | N/A | Document SimuFlow JSON IR; capture USB trace |

---

## 8. Issues Filed This Pass

| Issue | Title | Priority |
|-------|-------|----------|
| #177 | Add SVG dual-path figure with alt-text to ws-iv-tracing §5.3 | Medium |
| #178 | Complete 4 TODO citation DOIs in ws-iv-tracing-systems | Low |
| #179 | Scaffold `apps/web/lib/api-auth.ts` WebSocket auth guard | **High (security)** |
| #180 | Complete 3 TODO citations in nabl-open-source-pv-lims | Low |

---

## 9. Vercel Deployment Status

- **Latest build:** `dpl_4eHxcVUjKeDbvauZ1XNiPfvZMxty` — **READY** ✓
- **Branch:** `claude/wizardly-lovelace-wbfaql` (W24 Monday PR #160)
- **URL:** `surya-yantra-ihhpxyir4-ganeshgowrimitsui-3250s-projects.vercel.app`
- **Build time:** 30 s (READY)
- **Production:** still undeployed — see issue #153
- **Framework:** Next.js (auto-detected) | **Region:** iad1

The preview build is green. No action required on the build itself.
Production deployment requires merging a PR to `main` (issue #159 merge policy).

---

*Generated by automated Tuesday editorial pass — 2026-06-16.*
