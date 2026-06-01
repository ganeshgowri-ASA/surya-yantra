---
title: "Surya Yantra — Article Drafts"
description: "Working directory for in-progress research articles"
---

# Article Drafts

In-progress research articles for the Surya Yantra documentation site.

## Naming convention

`YYYY-MM-DD-slug.md` — draft created (or significantly revised) on that date.

## Promotion

When an article passes peer review (Thu checklist) and Friday polish, move it to
`posts/` and set `status: published` in its front matter.

## Weekly editorial angles

| Day | Angle |
|-----|-------|
| Mon | Outline — new article skeleton |
| Tue | Bulk removal of stale/abandoned drafts |
| Wed | Enhancement — add references, deepen analysis |
| Thu | Peer-review checklist pass |
| Fri | Publication-ready polish + ideation→implementation diagram |
| Sat | SEO / metadata (YAML front matter, keywords, og_image) |
| Sun | Roadmap — ecosystem synthesis and Q-quarter planning |

## Structural lint checks (run weekly)

- Heading hierarchy: no H3 before parent H2
- Citation coverage: every factual claim has a `[^n]` footnote
- Broken links: all `[text](url)` resolve
- Figure alt text: every `![...]()` has a non-empty alt string
- Front matter: title, description, keywords, canonical, og_image present
