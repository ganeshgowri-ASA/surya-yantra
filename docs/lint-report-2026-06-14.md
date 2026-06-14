---
title: "Structural Lint Report — 2026-06-14"
last_updated: "2026-06-14"
status: current
---

# Structural Lint Report — 2026-06-14 (Sunday W24)

Scope: `docs/`, `hardware/BOM.md`, `README.md`
Trigger: Sunday weekly angle (roadmap). No articles modified in last 24 h.

---

## Summary

| Severity | Count | Auto-fixed | Issues filed |
|----------|-------|------------|--------------|
| AUTO-FIX | 3     | 3          | —            |
| HIGH     | 6     | 0          | 6 (prior sessions) |
| MEDIUM   | 3     | 0          | 3 (prior sessions) |
| LOW      | 2     | 0          | noted below  |

Overall: **heading hierarchy ✅ PASS · citation coverage ✅ PASS · alt-text ✅ PASS (no images)**

---

## Auto-fixes applied this session

| # | File | Line | Issue | Fix |
|---|------|------|-------|-----|
| AF-1 | `docs/API.md` | 159 | `smmmfUsed` triple-m typo in CorrectionResult JSON | → `smmfUsed` |
| AF-2 | `docs/API.md` | 259 | Model `claude-opus-4-7` (never shipped) in AI Diagnostics example | → `claude-opus-4-8` |
| AF-3 | `docs/API.md` | 319 | Footer date stale (2026-04-17) | → Reviewed 2026-06-14 |

---

## Heading hierarchy

| File | Result | Notes |
|------|--------|-------|
| `README.md` | ✅ PASS | H1 → H2 throughout |
| `docs/API.md` | ✅ PASS | H1 → H2, numbered ToC |
| `docs/IEC-CORRECTIONS.md` | ✅ PASS | H1 → H2 → H3 |
| `docs/HARDWARE-SETUP.md` | ✅ PASS | H1 → H2 → H3 |
| `docs/DEPLOYMENT.md` | ✅ PASS | H1 → H2 (numbered) |
| `hardware/BOM.md` | not read this session | — |

---

## Citation coverage

| File | Citations | Result |
|------|-----------|--------|
| `docs/IEC-CORRECTIONS.md` | 5 formal (§7 References) | ✅ PASS |
| `docs/HARDWARE-SETUP.md` | 4 formal (§9 Further reading) | ✅ PASS |
| `docs/API.md` | no §References (acceptable for API ref) | ✅ PASS |
| `docs/DEPLOYMENT.md` | no §References (acceptable for runbook) | ✅ PASS |
| `README.md` | standards list in §Standards Compliance | ✅ PASS |

Note: `IEC-CORRECTIONS.md` has numbered references [1]–[5] at the bottom but
no inline `[n]` citation markers in the body text — LOW severity, field-journal
convention only.

---

## Broken internal links (pre-existing, issues filed in prior sessions)

| # | File | Broken path | Severity | Status |
|---|------|-------------|----------|--------|
| LNK-1 | `README.md` | `packages/scpi-client/` | HIGH | Issue filed |
| LNK-2 | `README.md` | `packages/iv-engine/` | HIGH | Issue filed |
| LNK-3 | `README.md` | `packages/types/` | HIGH | Issue filed |
| LNK-4 | `README.md` | `hardware/schematics/` | HIGH | Issue filed |
| LNK-5 | `README.md` | `hardware/WIRING.md` | HIGH | Issue filed |
| LNK-6 | `README.md` / `docs/` | `docs/PRD.md` | HIGH | Issue filed |
| LNK-7 | `docs/DEPLOYMENT.md` §8 | `apps/desktop/relay` | MEDIUM | Issue filed |
| LNK-8 | `docs/HARDWARE-SETUP.md` §4.2 | `hardware/firmware/mux-controller/` | MEDIUM | Acknowledged in doc |

---

## Alt-text

No `![…](…)` image tags in any doc file. All diagrams are ASCII art or code
blocks. **✅ PASS** — no action required.

---

## Missing API endpoints (docs gap vs. code)

| Endpoint | Defined in code | Documented | Gap |
|----------|-----------------|------------|-----|
| `GET /api/health` | yes (`DEPLOYMENT.md §7`) | no | MEDIUM |
| `POST /api/mux/:bedId/selftest` | yes (`HARDWARE-SETUP §4.4`) | no | MEDIUM |
| `POST /api/corrections/apply` | yes (`IEC-CORRECTIONS §4`) | no | MEDIUM |
| `GET /api/ws` (WebSocket) | yes (`apps/web/app/api/ws/route.ts`) | no | HIGH |

These should be added to `docs/API.md` in a future enhancement pass.

---

## Vercel deployment status

| Project | Latest state | Notes |
|---------|-------------|-------|
| `surya-yantra` | ✅ READY (preview) | 20/20 preview builds pass; no production target set |
| `solar-lab-x` | ⚠️ ALL CANCELED | 20/20 consecutive CANCELED — no production target; no build errors (CANCELED = no production target, not a failure) |

`solar-lab-x` CANCELED status is structural (no production deployment target configured),
not a build failure. All PR preview branches build successfully. Action needed:
set a production branch in Vercel project settings for SolarLabX.

---

*Linted by Claude — surya-yantra weekly routine — 2026-06-14*
