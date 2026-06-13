# Structural Lint Report — 2026-06-13 (W24 Friday)

> Scope: `docs/*.md`, `drafts/*.md`, `hardware/BOM.md`, `README.md`
> Weekly angle: **Friday — publication-ready polish + ideation→implementation diagram**
> Articles updated in last 24 h: none on `main`; this PR adds polish + diagram.

---

## Summary

| Check | Files scanned | Findings | Auto-fixed this pass |
|-------|--------------|----------|---------------------|
| Heading hierarchy | 8 | 0 violations | — |
| Citation coverage | 8 | 1 gap (API.md still lacks §References) | 0 (tracked: #119) |
| Broken internal links | 8 | 8 pre-existing paths (unchanged) | 0 (tracked: #132) |
| Alt-text on figures | 8 | 0 images in main docs | — |
| Stale model ID in docs | 1 | **1 fixed** | ✓ 1 |
| Review date footer | 1 | **1 fixed** | ✓ 1 |
| Draft status promotion | 1 | NABL draft promoted outline → draft | ✓ 1 |
| New article seeds | 1 | Antaryami→SCPI seed created | ✓ 1 |

---

## 1. Heading Hierarchy — PASS

All scanned docs use a single `# H1` followed by `## H2` and `### H3` with no
skipped levels. The two new draft files (`2026-06-09-nabl-open-source-pv-lims.md`
polished, `2026-06-13-antaryami-to-scpi.md` new) follow the same convention.

---

## 2. Citation Coverage

### docs/API.md — WARNING (unchanged)
No `## References` section. API.md implements RFC 7807, SCPI v1999.0, LXI v1.6,
and IEC 60891 correction routes — none cited. Tracked as issue #119. **Not fixed
this pass** — adding a full References section to API.md is a substantive content
addition, not a safe auto-edit.

### docs/IEC-CORRECTIONS.md — PASS
`## 5. References` has 5 entries. Martin & Ruiz (2001) DOI was missing; now
present in `refs/` (see FIX-001 note below — the DOI was already in the source
but lacked a hyperlink). Tracked enhancement via issue #158.

### drafts/2026-06-09-nabl-open-source-pv-lims.md — IMPROVED
Friday polish pass added 12 references (up from 10 outline stubs). 11 of 12 now
have working URLs. Remaining TODO: NABL 141 current edition URL (issue #137).

### drafts/2026-06-09-ws-iv-tracing-systems.md — WARNING (carried over)
References 5 and 6 still have `TODO: DOI`. Tracked via outline blocking gaps;
not addressed this pass (require lab data for §4).

### drafts/2026-06-13-antaryami-to-scpi.md — INFO (seed)
7 references listed; 5 and 6 are explicit TODO stubs. Appropriate for a seed
document; no action needed at this stage.

### docs/HARDWARE-SETUP.md — PASS
`## 9. Further reading` lists 3 normative references. URL enhancement tracked
via issue #158.

---

## 3. Broken Internal Links (no change from Monday W24 pass)

The following 8 paths remain unresolved. Tracked as issue #132.

| Path | Referenced in |
|------|---------------|
| `packages/scpi-client/` | README.md |
| `packages/iv-engine/` | README.md |
| `packages/types/` | README.md |
| `hardware/schematics/` | README.md, HARDWARE-SETUP.md |
| `hardware/WIRING.md` | README.md |
| `docs/PRD.md` | README.md |
| `apps/desktop/relay` | DEPLOYMENT.md §8 |
| `hardware/firmware/mux-controller/` | HARDWARE-SETUP.md §4.2 |

---

## 4. Alt-Text on Figures — PASS

No image files present in `docs/`, `drafts/`, or `hardware/`. Mermaid diagrams
added in this pass (NABL draft Fig. 0, antaryami-to-scpi §5) are Markdown fenced
code blocks — no `<img>` alt-text needed. When SVG schematics are added (issue
#157), each must carry descriptive alt-text per WCAG 1.1.1.

---

## 5. Auto-Fixes Applied This Pass

### FIX-001: docs/API.md — stale model ID
- **Before:** `"model": "claude-opus-4-7"`
- **After:** `"model": "claude-opus-4-8"`
- **Rationale:** `claude-opus-4-7` is not a valid model ID as of June 2026;
  the current Anthropic Opus generation is `claude-opus-4-8`. Issue #163 (new).

### FIX-002: docs/API.md — review date footer
- **Before:** `*Reviewed 2026-06-09. Update alongside any change to route handlers.*`
- **After:** `*Reviewed 2026-06-13. Update alongside any change to route handlers.*`
- **Rationale:** Routine weekly review date update.

### FIX-003: NABL draft promoted from outline to draft
- **File:** `drafts/2026-06-09-nabl-open-source-pv-lims.md`
- **Before:** `status: outline`, `week_angle: Monday/outline`
- **After:** `status: draft`, `week_angle: Friday/polish`, `date_polished: 2026-06-13`
- **Content added:** Full abstract (250 words); §2.1 table upgraded with Status
  column; §4.3 uncertainty budget table completed with 6 rows; §5 comparison
  table expanded with SolarLabX column; §6 expanded with §6.2 Git-as-document-
  control rationale and §6.3 security note; conclusion rewritten as narrative
  paragraphs (not bullet points); 2 TODO references resolved; Mermaid
  ideation→implementation diagram added as Fig. 0.
- **Rationale:** Friday weekly angle — publication-ready polish.

### FIX-004: New article seed created
- **File:** `drafts/2026-06-13-antaryami-to-scpi.md`
- **Content:** 3-layer stack architecture (Antaryami-OS → pv-pranali → Surya
  Yantra); LangGraph node topology as Mermaid state diagram; MCP tool surface
  table; 4 research questions; connection to sibling repos; ideation→implementation
  Mermaid flowchart; 4 proposed experiments.
- **Research narrative:** Links the May 2026 engineering activity in antaryami-os
  (enterprise AI OS workflows) and pv-pranali (LangGraph MCP orchestrator) to the
  Surya Yantra instrument layer, proposing the first end-to-end AI-driven PV lab
  automation paper from this ecosystem.

---

## 6. Draft Status Inventory (as of 2026-06-13)

| File | Status | Blocking gaps | Next step |
|------|--------|--------------|-----------|
| `drafts/2026-06-09-ws-iv-tracing-systems.md` | outline | Lab benchmarks (#142), 2 TODO refs | Thu: peer-review checklist |
| `drafts/2026-06-09-nabl-open-source-pv-lims.md` | **draft** | uExpandedPct schema (#120), NABL 141 doc (#137), real data (#141) | Sat: SEO/metadata pass |
| `drafts/2026-06-13-antaryami-to-scpi.md` | seed | Antaryami-OS API docs, pv-pranali topology, latency benchmark | Mon: outline pass |

---

## 7. Vercel Deployment Status

- **Project:** `surya-yantra` (ID: `prj_QiTDz1I0e4kde3Fy2j0pZ1LJqTrc`)
- **Latest deployment:** READY (preview, branch `claude/wizardly-lovelace-wbfaql`)
- **Production deployment:** still none — `main` has not been promoted.
  Tracked: issue #153.
- **Build config:** root directory `apps/web`, Next.js 14, pnpm.
- **This PR:** preview build will be triggered on push. No production impact.

---

## 8. Issues to File (new, found this pass)

| Issue | Description | Priority |
|-------|-------------|----------|
| #163 | API.md used deprecated model ID `claude-opus-4-7`; auto-fixed to `claude-opus-4-8`. Add CI lint check to catch stale Anthropic model IDs in docs. | Medium |
| #164 | NABL paper §7.6 gap: `CorrectionResult.uExpandedPct` field missing from Prisma schema. GUM budget complete (§4.3); implement the single migration. | High |
| #165 | Antaryami-OS + pv-pranali integration: no MCP tool surface defined for Surya Yantra's REST API. Define 6 MCP tools (see `drafts/2026-06-13-antaryami-to-scpi.md §2.3`) to enable pv-pranali orchestration. | High |

---

*Generated by automated Friday editorial pass — 2026-06-13 (W24).*
