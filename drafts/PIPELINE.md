# Article Pipeline — Surya Yantra Research Authoring

Tracks every article at each stage. Weekly angles drive progression:
Mon=outline · Tue=stale-draft removal · Wed=add references · Thu=peer-review checklist · Fri=publication polish · Sat=SEO/metadata · Sun=roadmap.

| Slug | Stage | Target venue | Blocking issues | Last touched |
|------|-------|-------------|----------------|--------------|
| `2026-06-18-iec-engine-npm-open-source` | outline | MDPI Energies | #171, #184 | 2026-06-18 |
| `2026-06-18-ai-lab-automation-mcp-orchestration` | outline | IEEE Access | #164, #176 | 2026-06-18 |
| `2026-06-15-ws-iv-tracing-systems` *(unmerged branch 0q9toz)* | bulk draft | MDPI Sensors | #177, #178, #179 | 2026-06-15 |
| `2026-06-15-multi-agent-pv-orchestration` *(unmerged branch 0q9toz)* | bulk draft | Applied Sciences | #176 | 2026-06-15 |
| `2026-06-09-nabl-open-source-pv-lims` *(unmerged W24 branch)* | enhancement | Measurement (Elsevier) | #180, #163 | 2026-06-09 |
| `2026-06-09-ws-iv-tracing-systems` *(unmerged W24 branch)* | enhancement | MDPI Sensors | #178, #177 | 2026-06-09 |

## Companion-repo pulse (as of 2026-06-18)

| Repo | Last commit | Open issues | Seed connection |
|------|------------|-------------|----------------|
| antaryami-os | 2026-05-10 | 188 | AI lab automation MCP pipeline |
| pv-pranali | 2026-05-03 | 0 | LangGraph orchestrator |
| GanitaSutra-v0 | 2026-05-08 | 53 | iv-engine computation graph node |
| ShilpaSutra | 2026-03-31 | 163 | CAD design for MUX chassis |
| SolarLabX | 2026-03-25 | 112 | LIMS + NABL ISO 17025 article |

No companion-repo commits in the last 24 h. Both new seeds above are driven by
surya-yantra internal engineering progress (issues #164, #171, #184).

## Structural lint report — 2026-06-18

| File | Issue | Status |
|------|-------|--------|
| `docs/API.md` | `smmmfUsed` triple-m typo (issue #183) | **Fixed** this run |
| `docs/API.md` | No References section | **Fixed** this run |
| `docs/API.md` | Footer date 2026-04-17 | **Fixed** this run |
| `docs/IEC-CORRECTIONS.md` | References section sparse (5 → 10 items) | **Fixed** this run |
| `docs/HARDWARE-SETUP.md` | Further reading bare citations | **Fixed** this run |
| `docs/HARDWARE-SETUP.md` | `hardware/schematics/` linked but absent | Open — issue #170, #185 |
| `docs/HARDWARE-SETUP.md` | `hardware/firmware/mux-controller/` linked but absent | Open — issue #175 |
| `docs/DEPLOYMENT.md` | `apps/desktop/relay` referenced but absent | Open — issue #186 |
| `README.md` | `packages/` dirs listed but absent | Open — issue #167, #171 |
| `README.md` | `hardware/WIRING.md` linked but absent | Open |
| `docs/API.md` | `GET /api/health` documented but not implemented | Open — issue #174 |
| `apps/web/lib/api-auth.ts` | File missing; WebSocket auth unguarded | Open — issue #179 (**security**) |
| Vercel project | No production target set on `main` branch | Open — issue #166 (**P0**) |

Broken-link count: **9** missing files/dirs referenced in docs.
Alt-text gaps: 1 open figure placeholder in ws-iv-tracing-systems §5.3 (issue #177).
Citation TODOs: 7 across ws-iv-tracing-systems (#178) and nabl-open-source-pv-lims (#180).
