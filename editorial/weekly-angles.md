# Weekly Editorial Angles

Each day of the week has a specific editorial focus for the article pipeline.
This is a rhythm, not a rigid rule — skip a day if there is nothing to do.

| Day | Angle | Primary deliverable |
|-----|-------|--------------------|
| **Mon** | **Outline** | New article seeds with H2 section skeleton; no body text yet |
| **Tue** | **Bulk-removal** | Audit all open PRs and drafts; close stale, archive superseded, file issues for gaps |
| **Wed** | **Enhancement** | Add references (with DOIs), flesh out body text in existing drafts, fix citation gaps |
| **Thu** | **Peer-review** | Apply 34-item checklist to every draft ≥`📝 draft` status; update status labels |
| **Fri** | **Polish** | Final copy-edit; add ideation→implementation diagram; verify all figures and captions |
| **Sat** | **SEO/metadata** | Front-matter completeness, sitemap entry, OG image, keyword density |
| **Sun** | **Roadmap** | Cross-repo sprint state; update draft index with latest engineering signals |

## Lean-week rule

If a pass produces no changes (nothing to lint, no new seeds, no stale content),
commit an empty pass log (`drafts/_pass-<date>.md`) with `status: nothing-to-do`
rather than skipping the commit entirely. This keeps the deployment timeline intact.
