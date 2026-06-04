# Structural Lint Report

Scope: `docs/`, `hardware/BOM.md`, `README.md`, `drafts/`
Audited: heading hierarchy · citation coverage · broken internal links · alt-text on figures

---

## 2026-06-04 (Wednesday) — enhancement pass

| ID | Severity | Area | Finding | Action |
|----|----------|------|---------|--------|
| LNT-001 | FIXED (PR #131) | `docs/API.md:259` | Stale model ID `claude-opus-4-7` | Fixed → `claude-opus-4-8` |
| LNT-002 | ISSUED (PR #131) | `README.md §Repository Structure` | 5 paths in repo tree don't exist | Issues filed |
| LNT-003 | ISSUED (PR #131) | `README.md §Hardware` | `hardware/schematics/` absent | Issues filed |
| LNT-004 | ISSUED (PR #131) | `README.md §Hardware` | `hardware/WIRING.md` absent | Issues filed |
| LNT-005 | ISSUED (PR #131) | `docs/DEPLOYMENT.md §8` | `apps/desktop/relay` absent | Issues filed |
| LNT-006 | ISSUED (PR #131) | `docs/HARDWARE-SETUP.md §4.2` | `hardware/firmware/mux-controller/` absent | Issues filed |
| LNT-007 | AUTO-FIXED | `README.md §IEC Correction Methods` | IAM formula parentheses error | Fixed: `(1 − exp(−cos θ / ar)) / (1 − exp(−1/ar))` |
| LNT-008 | AUTO-FIXED | `docs/API.md` footer | Date `2026-04-17` stale | Updated to `2026-06-04` |
| LNT-009 | AUTO-FIXED | `docs/API.md` | No formal References section | Added §References (5 entries) |
| LNT-010 | AUTO-FIXED | `docs/HARDWARE-SETUP.md §9` | Informal "Further reading" list | Upgraded to §9 References (7 formal citations) |
| LNT-011 | AUTO-FIXED | `docs/DEPLOYMENT.md` | No References section | Added §12 References (8 entries) |
| LNT-012 | ISSUE | `drafts/2026-06-03-iec60891-open-source.md §4.2` | Validation table needs IEC 60891 Annex B reference values | File issue — requires IEC PDF access |
| LNT-013 | ISSUE | `drafts/2026-06-03-iec60891-open-source.md §6` | Field validation needs Srishti lab measurement data | File issue — post-commissioning |
| LNT-014 | WARN | `hardware/BOM.md` | Footer `Last updated 2026-04-17` stale | Update on next BOM revision |

---

## Heading Hierarchy ✅

All five docs (`README.md`, `API.md`, `IEC-CORRECTIONS.md`, `DEPLOYMENT.md`,
`HARDWARE-SETUP.md`) maintain clean H1 → H2 → H3 descent with no skipped levels.
Both article drafts follow the same pattern.

---

## Citation Coverage — Wednesday Enhancement

| File | Before (Tue) | After (Wed) |
|------|-------------|------------|
| `docs/IEC-CORRECTIONS.md` | ✅ 5 refs | ✅ unchanged |
| `docs/API.md` | ⚠️ none | ✅ 5 refs added |
| `docs/HARDWARE-SETUP.md` | ⚠️ informal list | ✅ 7 formal refs |
| `docs/DEPLOYMENT.md` | ⚠️ none | ✅ 8 refs added |
| `README.md` | ⚠️ inline only | ✅ operational doc — inline citations appropriate |
| `drafts/2026-06-03-iec60891-open-source.md` | 🔴 TODO (outline) | ✅ 8 refs; status → draft |
| `drafts/2026-06-03-unified-pv-ecosystem.md` | 🔴 TODO (outline) | ✅ 10 refs; status → draft |

---

## Alt-text on Figures ✅

No embedded images exist in any current doc. Both article drafts include
`alt`-text templates on all figure placeholders, following the format:

```
alt="[Description including axis labels and key data points]"
```

---

## Cross-repo commit seeding

Attempted to pull latest commits from antaryami-os, GanitaSutra-v0, ShilpaSutra,
SolarLabX. **Access denied** — those repos are not in the current session scope.

To enable full cross-repo seeding, add the repos to the session using `add_repo`
or by expanding the session's repository scope. The article seed
`drafts/2026-06-03-unified-pv-ecosystem.md` draws on Vercel project metadata and
surya-yantra codebase signals as a proxy.

---

## Vercel build status ✅

Project `surya-yantra` (prj_QiTDz1I0e4kde3Fy2j0pZ1LJqTrc):
- Latest deployment: `dpl_HNRxyMVzMZrgzzNkQSVehvqJgFvP`
- State: **READY**
- Deployed from branch: `claude/wizardly-lovelace-h5vpI` (Tuesday PR #131)

No Hugging Face Space found in Vercel project list.

---

## Open actions

- [ ] File GitHub issue for LNT-012 (IEC 60891 Annex B validation table).
- [ ] File GitHub issue for LNT-013 (field validation — post-commissioning).
- [ ] Merge PR #131 (Tuesday bootstrap) before or alongside this PR.
- [ ] PR #135 (docs: remove stale unpublished path refs) — merge when ready.
- [ ] Expand session scope to include antaryami-os, GanitaSutra-v0, ShilpaSutra,
      SolarLabX for complete cross-repo commit seeding (Sunday roadmap task).

---

## 2026-06-03 (Tuesday) — triage / bootstrap

*(See PR #131 on branch `claude/wizardly-lovelace-h5vpI` for details.)*

Summary: No existing drafts (zero stale items). Bootstrap session:
- Established `drafts/` and `posts/` pipeline directories.
- Created two article seeds at `status: outline`.
- Auto-fixed LNT-001 (stale model ID in API.md).
- Filed issues for LNT-002 through LNT-007 (broken internal links).
