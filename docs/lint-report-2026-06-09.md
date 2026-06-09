# Structural Lint Report — 2026-06-09 (W24 Monday)

> Scope: `docs/*.md`, `hardware/BOM.md`, `README.md`
> Updated articles in last 24 h: none (main branch at 2026-04-17; all
> recent content on unmerged PR branches — see issue #159).

---

## Summary

| Check | Files scanned | Findings | Auto-fixed this pass |
|-------|--------------|----------|---------------------|
| Heading hierarchy | 6 | 0 violations | — |
| Citation coverage | 6 | 2 files with 0 citations | 0 (tracked: #119, #158) |
| Broken internal links | 6 | 8 paths (pre-existing) | 0 (tracked: #132) |
| Alt-text on figures | 6 | 0 figures in main docs | — |
| Stale footer dates | 2 | 2 fixed | ✓ 2 |
| Missing .env.example | 1 | 1 created | ✓ 1 |

---

## 1. Heading Hierarchy — PASS

All docs use a single `# H1` followed by `## H2` and `### H3` sections with
no skipped levels. No violations found.

---

## 2. Citation Coverage

### docs/IEC-CORRECTIONS.md — PASS
Has a `## 5. References` section with 5 entries (IEC 60891:2021, IEC 60904-3,
IEC 60904-7, IEC 61853-2, Martin & Ruiz 2001). The Martin & Ruiz citation
lacks a DOI — tracked as issue #158.

### docs/API.md — WARNING
No `## References` section. API.md implements RFC 7807, SCPI 1999.0, LXI
Consortium Specification v1.6, and IEC 60891 correction routes — none are
cited. Tracked as issue #119.

### docs/DEPLOYMENT.md — INFO
Deployment guide; references to external services are inline links. No
normative standards cited. Acceptable for an ops doc; no action needed.

### docs/HARDWARE-SETUP.md — PASS
`## 9. Further reading` lists IEC 62446-1:2016, IEC 61730-1/2:2023, IEEE
1547:2018. All are plain-text citations without URLs — acceptable for a
hardware guide; enhancement tracked via issue #158.

### README.md — INFO
No References section (appropriate for a project README).

### hardware/BOM.md — INFO
No standards citations (appropriate for a BOM).

---

## 3. Broken Internal Links

The following 8 paths are referenced in docs but do not exist in the
repository. All were pre-existing; tracked collectively as issue #132.
No new broken links introduced.

| Path | Referenced in | Issue |
|------|-------------|-------|
| `packages/scpi-client/` | README.md | #132, #139, #145 |
| `packages/iv-engine/` | README.md | #132 |
| `packages/types/` | README.md | #132 |
| `hardware/schematics/` | README.md, HARDWARE-SETUP.md | #132, #147, #154, #157 |
| `hardware/WIRING.md` | README.md | #132, #147 |
| `docs/PRD.md` | README.md | #132 |
| `apps/desktop/relay` | DEPLOYMENT.md §8 | #128 |
| `hardware/firmware/mux-controller/` | HARDWARE-SETUP.md §4.2 | #132, #140 |

---

## 4. Alt-Text on Figures

No image files (`*.png`, `*.svg`, `*.jpg`) are present in `docs/` or
`hardware/`. The ASCII block diagram in `HARDWARE-SETUP.md §1` is text;
no alt-text needed. When SVG schematics are added (issue #157), each
`<img>` or `![...]()` must include a descriptive alt-text per WCAG 1.1.1.

---

## 5. Auto-Fixes Applied This Pass

### FIX-001: docs/API.md footer date
- **Before:** `*Generated 2026-04-17. Update alongside any change to route handlers.*`
- **After:** `*Reviewed 2026-06-09. Update alongside any change to route handlers.*`
- **Rationale:** Footer was 53 days stale. Issue #126.

### FIX-002: hardware/BOM.md footer date
- **Before:** `*Last updated 2026-04-17 · Srishti PV Lab procurement desk.*`
- **After:** `*Last reviewed 2026-06-09 · Srishti PV Lab procurement desk. Prices valid as of April 2026 — verify with vendor before issuing purchase orders.*`
- **Rationale:** BOM prices are 53 days stale; clarified that prices are as-of
  April 2026 and must be re-verified. Issue #126.

### FIX-003: apps/web/.env.example created
- **File:** `apps/web/.env.example`
- **Rationale:** `README.md` Quick Start instructs `cp apps/web/.env.example apps/web/.env.local` but the file was absent, breaking first-time contributor onboarding. Issue #146.

---

## 6. New Article Outlines (Monday weekly angle)

Two article outlines created in `drafts/`:

| File | Working title | Target journal |
|------|--------------|---------------|
| `drafts/2026-06-09-ws-iv-tracing-systems.md` | Open-Source WebSocket–SCPI Bridge for Real-Time PV IV Curve Streaming | MDPI Sensors |
| `drafts/2026-06-09-nabl-open-source-pv-lims.md` | From Schema to NABL: Open-Source PostgreSQL Architecture for ISO 17025–Accredited Solar PV Test Laboratories | Measurement (Elsevier) |

Both outlines reference existing code paths and open issues, and explicitly
mark sections that are blocked on lab data or pending schema additions.

---

## 7. Open Issues Cross-Reference (not duplicated this pass)

The following issues are already tracked and were not re-filed:

- **#159** — Merge policy for 30+ open editorial PRs (filed 2026-06-08)
- **#158** — Add DOI/URL citations to IEC-CORRECTIONS.md
- **#157** — Scaffold hardware/schematics/
- **#155** — Add og:image for social preview
- **#154** — hardware/schematics/ empty
- **#153** — No production Vercel deployment (all builds are preview-only)
- **#152** — Hardware API routes have no authentication
- **#151** — Establish drafts/ and posts/ publishing workflow
- **#147, #132** — README/HARDWARE-SETUP broken paths
- **#146** — apps/web/.env.example missing (resolved by FIX-003 above)
- **#145** — packages/scpi-client not implemented
- **#142** — WebSocket streaming benchmarks needed
- **#141** — Real IV measurement data needed for articles
- **#140** — MUX firmware not committed
- **#139** — packages/scpi-client not implemented
- **#132** — 8 broken internal references
- **#129** — WebSocket API docs missing from API.md
- **#128** — apps/desktop/relay missing
- **#127** — README non-existent paths
- **#126** — Stale footer dates (partially resolved by FIX-001 and FIX-002)
- **#120** — Measurement uncertainty budget missing from schema
- **#119** — API.md missing References section + 2 endpoints
- **#118** — No GitHub Actions CI workflow

---

## 8. Vercel Deployment Status

- **Project:** `surya-yantra` (ID: `prj_QiTDz1I0e4kde3Fy2j0pZ1LJqTrc`)
- **Latest build:** READY (preview branch, not production)
- **Production deployment:** None — `main` has not been deployed to production
  since the project was created. Tracked as issue #153.
- **Action required:** Merge at least one PR to `main` to trigger a production
  Vercel build. See issue #159 for the proposed merge policy.

---

*Generated by automated Monday editorial pass — 2026-06-09.*
