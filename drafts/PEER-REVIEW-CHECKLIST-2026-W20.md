# Peer-Review Checklist — Surya Yantra Docs (Week 20, 2026-05-15)

> Thursday workflow: verify every document in `docs/` and `hardware/` against
> this checklist before it is promoted to `posts/` or linked from the public
> Vercel site. Mark each item ✅ pass · ⚠️ needs-work · ❌ blocker.

---

## 1. Structural Lint Results (auto-scan 2026-05-15)

### 1.1 Heading hierarchy

| File | Verdict | Notes |
|---|---|---|
| `docs/IEC-CORRECTIONS.md` | ✅ | H1 → H2 → H3, no skips |
| `docs/API.md` | ✅ | H1 → H2 → H3, no skips |
| `docs/DEPLOYMENT.md` | ✅ | H1 → H2 only, correct |
| `docs/HARDWARE-SETUP.md` | ✅ | H1 → H2 → H3, no skips |
| `hardware/BOM.md` | ✅ | H1 → H2 only, correct |
| `README.md` | ✅ | H1 → H2 → H3, code-block `#` comments not counted |

### 1.2 Internal links (broken-path audit)

| File | Link | Target exists? | Severity |
|---|---|---|---|
| `README.md` | `hardware/schematics/` | ❌ directory missing | **Blocker** |
| `README.md` | `packages/scpi-client/`, `packages/iv-engine/`, `packages/types/` | ❌ directory missing | **Blocker** |
| `docs/HARDWARE-SETUP.md §4.2` | `hardware/firmware/mux-controller/` | ❌ directory missing | High |
| `docs/DEPLOYMENT.md §8` | `apps/desktop/relay` | ❌ directory missing | High |
| `docs/API.md` | `./IEC-CORRECTIONS.md` | ✅ exists | — |
| `docs/HARDWARE-SETUP.md` | `../hardware/BOM.md` | ✅ exists | — |

### 1.3 Citation coverage

| File | Citations present | Standard |
|---|---|---|
| `docs/IEC-CORRECTIONS.md` | ✅ 5 numbered refs (IEC 60891, 60904-3, 60904-7, 61853-2, Martin-Ruiz 2001) | Academic / standards |
| `docs/API.md` | ✅ n/a (technical reference) | — |
| `docs/DEPLOYMENT.md` | ✅ n/a (ops guide) | — |
| `docs/HARDWARE-SETUP.md §9` | ⚠️ 4 informal references, not consistently formatted | Needs uniform style |
| `hardware/BOM.md` | ✅ n/a (procurement doc) | — |

### 1.4 Alt-text on figures

No raster/vector images exist in the docs corpus yet. ASCII block diagrams
in `HARDWARE-SETUP.md §1` and `§4.2` are readable in plain text; once SVG
schematics land in `hardware/schematics/`, all `<img>` / `![]()` tags must
carry descriptive alt text per WCAG 2.1 §1.1.1.

### 1.5 Cross-reference consistency

| Finding | Files involved | Severity |
|---|---|---|
| `IEC-CORRECTIONS.md §4` documents `POST /api/corrections/apply` but `API.md` only documents `/p1`–`/p4` individually; the consolidated endpoint is undocumented | `IEC-CORRECTIONS.md`, `API.md` | **Blocker** |
| `API.md` footer says "Generated 2026-04-17" — stale by ~4 weeks | `API.md` | Medium |
| `BOM.md` footer says "Last updated 2026-04-17" — stale by ~4 weeks | `BOM.md` | Low |

---

## 2. Content-Quality Checklist

Use this for each article / doc entering peer review.

### 2.1 Accuracy & completeness

- [ ] All IEC procedure numbers match the latest edition cited (IEC 60891:2021, not :2009)
- [ ] Code snippets compile / run against the current `apps/web/lib/` implementation
- [ ] API request/response examples match current route-handler signatures
- [ ] Hardware specs (voltage, current, relay count) match `hardware/BOM.md`
- [ ] Cost figures updated to within 90 days; GST note present for INR prices

### 2.2 Narrative flow

- [ ] Abstract / intro answers: *what*, *why this matters*, *who it's for*
- [ ] Logical section ordering: background → method → results → discussion
- [ ] No orphaned sections (every H2 has at least one paragraph before any H3)
- [ ] Conclusion summarises key findings, not just restates the intro

### 2.3 References

- [ ] Every standard cited has edition year (e.g., IEC 60891:**2021**)
- [ ] Every peer-reviewed source has: author, year, title, journal/conf, DOI or ISBN
- [ ] References list is sorted by first appearance in text (Vancouver) or alphabetically (APA) — choose one and apply consistently
- [ ] URL-only citations are accompanied by access date

### 2.4 Terminology consistency

- [ ] "Isc" vs "I_sc" — use one form throughout
- [ ] "irradiance" (W/m²) not "insolation" (Wh/m²) unless energy is meant
- [ ] "STC" spelled out on first use: Standard Test Conditions (1000 W/m², 25 °C, AM1.5G)
- [ ] Acronym register consistent with `docs/IEC-CORRECTIONS.md` glossary (SMMF, IAM, SCPI, MUX, POA)

### 2.5 Code / implementation references

- [ ] File paths reflect actual repo layout (not the planned layout in README)
- [ ] Function signatures match exported symbols in `apps/web/lib/*.ts`
- [ ] Any `TODO` or `not implemented yet` blocks are flagged as issues before merge

### 2.6 SEO / discoverability (pre-publication gate — deferred to Saturday)

- [ ] `posts/` frontmatter has: `title`, `description`, `tags`, `date`, `author`, `canonical_url`
- [ ] Title is ≤ 60 chars; description is 120–160 chars
- [ ] At least one internal link to a related post or doc

---

## 3. Open Issues Raised Today

| # | Summary | File | Severity |
|---|---|---|---|
| GH-1 | `hardware/schematics/` directory missing — 3 references broken | README.md | Blocker |
| GH-2 | `packages/` monorepo packages not yet committed | README.md | Blocker |
| GH-3 | `POST /api/corrections/apply` undocumented in API.md | API.md | Blocker |
| GH-4 | `apps/desktop/relay` referenced but not implemented | DEPLOYMENT.md | High |
| GH-5 | MUX firmware missing from repo (`hardware/firmware/`) | HARDWARE-SETUP.md | High |

---

## 4. Article Seeds for This Week

See companion draft files:

- [`seed-001-shilpasutra-iv-pipeline.md`](./seed-001-shilpasutra-iv-pipeline.md)
- [`seed-002-intelligence-stack.md`](./seed-002-intelligence-stack.md)

---

*Generated by the Thursday peer-review workflow · 2026-05-15*
