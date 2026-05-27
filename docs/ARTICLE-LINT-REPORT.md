# Article Structural Lint Report

**Generated:** 2026-05-27 (Wednesday — Enhancement: add references)
**Scope:** `drafts/`, `posts/`, `docs/*.md`

---

## 1. Summary

| Check | Scope | Result |
|---|---|---|
| Headings hierarchy (H1 → H2 → H3, no skips) | drafts/ | ✅ 2 drafts — hierarchy correct |
| Citation coverage (all claims cite a reference) | drafts/ | ⚠️ Sections marked `[TODO]` have uncited claims |
| Broken internal links | all docs | ⚠️ 3 broken links (see §3) |
| Alt text on figures | drafts/ | ✅ All figure stubs include alt-text spec |
| Front-matter completeness | drafts/ | ✅ title, slug, status, created, tags present |
| Posts directory populated | posts/ | ℹ️ No articles promoted to posts/ yet |

---

## 2. Headings Hierarchy

### `drafts/2026-05-27-iv-reliability-loop.md`

```
H2 Abstract
H2 1. Introduction
H2 2. The Measurement Side — Surya Yantra
  H3 2.1 Hardware
  H3 2.2 IEC 60891 Correction Pipeline
  H3 2.3 Degradation Metric
H2 3. The Stress Side — Agnipariksha
H2 4. The Closed Loop
H2 5. Case Study Outline
H2 6. Discussion
  H3 6.1 Measurement Uncertainty Budget
  H3 6.2 LeTID Specifics
H2 7. Conclusion
H2 References
H2 Figures Needed
H2 Peer-Review Checklist
```

**Result:** ✅ Valid hierarchy (H2 → H3, no skips).

### `drafts/2026-05-27-ai-test-infra-design.md`

```
H2 Abstract
H2 1. Introduction
H2 2. GenAI-CAD-CFD-Studio in Context
H2 3. Workflow: Natural Language → BOM-Verified CAD → Surya Yantra Integration
H2 4. Case Study Outline: MUX Matrix PCB Layout
H2 5. Digital Twin Connection
H2 6. Discussion
  H3 6.1 Current Limitations
  H3 6.2 Opportunity: Closed-Loop DFM
H2 7. Conclusion
H2 References
H2 Figures Needed
H2 Peer-Review Checklist
```

**Result:** ✅ Valid hierarchy.

### `docs/IEC-CORRECTIONS.md`

**Result:** ✅ H2 → H3 hierarchy correct throughout. References section enhanced 2026-05-27 with DOI links and sub-categories.

### `docs/API.md`

**Result:** ✅ H2 sections with consistent structure. No H3 skips.

### `README.md`

**Result:** ✅ H1 → H2 hierarchy correct.

---

## 3. Broken Internal Links

| Document | Link Text | Target | Issue |
|---|---|---|---|
| `README.md` | `hardware/schematics/` | `hardware/schematics/` | ❌ Directory missing — no files |
| `README.md` | `hardware/WIRING.md` | `hardware/WIRING.md` | ❌ File does not exist |
| `README.md` | `docs/PRD.md` | `docs/PRD.md` | ❌ File does not exist |
| `README.md` (repo structure) | `packages/scpi-client/` | `packages/` | ❌ Entire `packages/` directory missing |
| `README.md` (repo structure) | `packages/iv-engine/` | `packages/` | ❌ Entire `packages/` directory missing |
| `README.md` (repo structure) | `packages/types/` | `packages/` | ❌ Entire `packages/` directory missing |

**Total broken links: 6** (tracked as GitHub Issue — see §5).

---

## 4. Citation Coverage

### Uncited Claims Requiring Attention

| Document | Section | Claim | Action |
|---|---|---|---|
| `drafts/2026-05-27-iv-reliability-loop.md` | §3 Agnipariksha | Stress protocol parameters | Add ref to IEC 61215-2:2021 procedure numbers |
| `drafts/2026-05-27-iv-reliability-loop.md` | §6.1 Uncertainty | ESL-Solar 500 accuracy spec | Add ref to ESL-Solar 500 datasheet |
| `drafts/2026-05-27-iv-reliability-loop.md` | §6.2 LeTID | "partially reversible" | Add ref to IEC 63209-1 or peer-reviewed LeTID study |
| `drafts/2026-05-27-ai-test-infra-design.md` | §2 GenAI-CAD | CAD capabilities | Pull from GenAI-CAD-CFD-Studio commit log when access available |
| `docs/API.md` | §AI Diagnostics | `claude-opus-4-7` model | No reference needed (product choice) |

---

## 5. Issues to File

The following GitHub issues should be created for substantive content gaps:

1. **`hardware/schematics/` is empty** — SVG circuit diagrams referenced in README do not exist
2. **`hardware/WIRING.md` missing** — wiring guide referenced in README/BOM does not exist
3. **`docs/PRD.md` missing** — Product Requirements document referenced in README structure
4. **`packages/` directory missing** — monorepo packages (scpi-client, iv-engine, types) referenced in README but absent
5. **`apps/web/.env.example` missing** — Quick Start instructions reference it; first-time setup will fail
6. **API.md date is stale** — footer says "Generated 2026-04-17", needs updating policy

---

## 6. Alt Text Coverage

All figure entries in both draft articles include an `alt:` annotation in the figure checklist. No figure image files exist yet (expected — articles are seeds).

When actual images are added to `drafts/assets/` or `posts/assets/`, this lint will re-run to verify the `alt` attribute is present in the rendered Markdown `![alt](path)` syntax.

---

## 7. Next Lint Run

Schedule: auto-run every Wednesday as part of the weekly enhancement pass.
Trigger: any push to `drafts/` or `posts/` should re-run this report.
