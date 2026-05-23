# drafts/

Research article drafts for the Surya Yantra / Srishti PV Lab publication pipeline.

## Conventions

| Prefix | Meaning |
|---|---|
| `article-NNN-*.md` | Active article drafts |
| `_lint-report-YYYY-MM-DD.md` | Daily structural audit results |
| `_seo-audit-YYYY-MM-DD.md` | Saturday SEO/metadata audit |
| `_seed-*.md` | Raw article seeds (pre-outline stage) |

## Status labels (front-matter `status:` field)

| Status | Description |
|---|---|
| `seed` | Idea captured, no structure yet |
| `outline` | Section skeleton written (Mon pass) |
| `draft` | Bulk prose written |
| `enhanced` | References added (Wed pass) |
| `peer-review` | Under peer-review checklist (Thu pass) |
| `polish` | Publication-ready editing (Fri pass) |
| `published` | Moved to `posts/` |
| `stale` | Marked for removal (Tue pass) |

## Weekly editorial angles

| Day | Focus |
|---|---|
| Mon | Outline — write section skeleton for new seeds |
| Tue | Bulk-remove stale drafts (> 60 days no activity) |
| Wed | Enhancement — add citations, figures, cross-links |
| Thu | Peer-review checklist pass |
| Fri | Publication-ready polish + ideation→implementation diagram |
| Sat | SEO / metadata |
| Sun | Roadmap — seed new articles from weekly engineering progress |

## SEO front-matter schema (Saturday requirements)

Every article must carry the following before moving to `posts/`:

```yaml
slug: url-safe-slug-no-underscores
description: "160-char or fewer search-engine meta description."
canonical_url: "https://srishtipvlab.in/research/<slug>"
og_image: "/og/<slug>-og.png"
twitter_card: summary_large_image
schema_type: ScholarlyArticle        # or BlogPosting / TechReport
reading_time_minutes: 15
lang: en
lastmod: YYYY-MM-DD
```
