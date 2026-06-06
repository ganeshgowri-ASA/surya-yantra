# Article Pipeline — Surya Yantra Research

Weekly editorial angles:
| Day | Angle |
|-----|-------|
| Mon | Outline: new article stubs |
| Tue | Bulk removal of stale drafts (>90 days untouched) |
| Wed | Enhancement: add / fix references |
| Thu | Peer-review checklist pass |
| Fri | Publication-ready polish + ideation→implementation diagram |
| Sat | SEO / metadata (slug, description, keywords, OG image) |
| Sun | Roadmap: link article themes to next sprint |

---

## Active Drafts

| File | Topic | Status | Created | Last touched | Blocker |
|------|-------|--------|---------|--------------|--------|
| `2026-06-05-iec60891-open-source.md` | IEC 60891:2021 open-source implementation | Peer-review done; **polished → posts/** | 2026-06-05 | 2026-06-06 | Lab validation data (Issue filed) |
| `2026-06-05-realtime-iv-streaming.md` | Real-time IV curve streaming + WebSocket | Peer-review done; awaiting benchmarks | 2026-06-05 | 2026-06-05 | Measured latency data; relay service |

## Published

| File | Topic | Date | Notes |
|------|-------|------|-------|
| `posts/2026-06-06-iec60891-open-source.md` | IEC 60891:2021 P1–P4 TypeScript implementation | 2026-06-06 | Friday polish applied; 4 blocker issues filed |

## Retired / Stale

*(none yet)*

---

## Friday 2026-06-06 — Work Summary

- **Vercel** `surya-yantra` latest deployment: `READY` ✅
- **Publication-ready polish**: `drafts/2026-06-05-iec60891-open-source.md` → `posts/2026-06-06-iec60891-open-source.md`
  - Title shortened to 14 words (was 16)
  - Equation numbers (1)–(8) added
  - Author Contributions, Competing Interests, Data Availability sections added
  - PLACEHOLDER markers replaced with formal Data Availability note
  - Cross-reference to `docs/ideation-to-implementation.md` added
- **Ideation→implementation diagram**: `docs/ideation-to-implementation.md` created
- **API.md auto-fixes applied**:
  - `smmmfUsed` → `smmfUsed` (triple-m typo in CorrectionResult JSON)
  - `GET /api/health` endpoint documented (was referenced in DEPLOYMENT.md smoke test but undocumented)
  - HTTP 503 added to error code table
  - `last reviewed` date updated to 2026-06-06
- **GitHub issues filed**: 5 issues for structural content gaps

---

## Companion Repo Pulse (last checked 2026-06-06)

| Repo | Last GitHub activity | Article relevance |
|------|---------------------|-------------------|
| antaryami-os | 2026-05-10 | AI diagnostics layer for PV fault detection |
| GanitaSutra-v0 | 2026-05-08 | Numerical toolbox for IV curve analysis |
| ShilpaSutra | 2026-03-31 | Parametric CAD for PV mount / tracker design |
| SolarLabX | 2026-03-25 | LIMS/QMS context for lab accreditation narrative |

> Note: companion repos are private or scope-restricted in this session.
> Commit details pulled from GitHub search; deep-linking requires repo access.

---

## Article Seeds — 2026-06-06 (Friday)

Based on the engineering state of sister repos:

### Seed 1 — "GanitaSutra SimuFlow as a Visual Verification Tool for IEC 60891 Bilinear Interpolation"

*Narrative bridge*: GanitaSutra's SimuFlow block-diagram environment (last active May 2026) can
model IEC 60891 Procedure 3's bilinear interpolation step visually. An article describing how
lab technicians can use SimuFlow to verify P3 results against the TypeScript implementation
would create a reproducibility narrative linking the two platforms.

*Engineering hook*: `lib/iec60891.ts::correctProcedure3` — the bilinear `t` parameter
calculation is non-obvious and benefits from a visual representation.

*Suggested slug*: `ganitasutra-iec-p3-visual-verification`

### Seed 2 — "antaryami-os as an Orchestration Layer for Multi-Module PV Fleet Correction"

*Narrative bridge*: antaryami-os (last active May 2026) is an enterprise AI OS that can
orchestrate API calls across services. An article showing how it can drive Surya Yantra's
`POST /api/measurements/:id/correct` endpoint in batch — applying P2 corrections to a full
75-module sweep and streaming results to SolarLabX — positions both platforms in a
research-grade automation narrative.

*Engineering hook*: The Surya Yantra REST API is stateless and authentication-token-based,
making it a natural target for AI-orchestrated batch workflows.

*Suggested slug*: `antaryami-pv-fleet-correction-orchestration`
