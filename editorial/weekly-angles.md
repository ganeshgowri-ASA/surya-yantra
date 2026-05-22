# Weekly Editorial Angles

Each day of the week has a specific editorial focus for the Surya Yantra research pipeline.
Run the corresponding pass every week; results go on a `claude/editorial-YYYY-MM-DD` branch.

| Day | Focus | Key actions |
|---|---|---|
| **Mon** | Outline | Write H2/H3 skeleton for seeds; set `status: outline` |
| **Tue** | Stale-draft removal | Archive or delete drafts with `status: stale` or last-modified > 60 days |
| **Wed** | Enhancement | Add IEC citations, cross-repo links, figures; set `status: enhanced` |
| **Thu** | Peer-review checklist | Apply `peer-review-checklist-template.md` to each enhanced draft |
| **Fri** | Polish + ideation→implementation diagram | Final prose, add Mermaid flowchart, set `status: polish` |
| **Sat** | SEO / metadata | Fill front-matter: keywords, abstract ≤ 250 w, slug, ORCID |
| **Sun** | Roadmap | Scan all four related repos for week's commits; seed 2 new articles |

## Related repositories

| Repo | Domain | Last known update |
|---|---|---|
| `ganeshgowri-ASA/surya-yantra` | PV IV-curve tracer & test mgmt | Active |
| `ganeshgowri-ASA/SolarLabX` | LIMS + QMS + audit for solar labs | 2026-03-25 |
| `ganeshgowri-ASA/antaryami-os` | Enterprise AI OS | 2026-05-10 |
| `ganeshgowri-ASA/GanitaSutra-v0` | Computational mathematics platform | 2026-05-08 |
| `ganeshgowri-ASA/ShilpaSutra` | AI text-to-CAD/CFD | 2026-03-31 |

## Article seeding heuristic

When reviewing engineering commits, ask:
1. **What new algorithm or data structure was added?** → methods paper seed
2. **What hardware challenge was solved?** → instrumentation / field-deployment seed
3. **What did two repos accomplish together?** → systems integration seed
4. **What standard was newly implemented or validated?** → standards-compliance seed
