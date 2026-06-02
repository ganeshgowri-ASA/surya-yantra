# Surya Yantra — Article Pipeline

This directory holds articles in progress. The article lifecycle is:

```
drafts/  →  peer review  →  posts/
```

## Weekly Angle Schedule

| Day | Angle | Action |
|---|---|---|
| Mon | **Outline** | Write skeleton: title, H2 sections, 3 bullets each |
| Tue | **Bulk removal** | Cut stale drafts older than 60 days with no progress |
| Wed | **Enhancement** | Add references, expand thin sections, add code examples |
| Thu | **Peer-review** | Apply the checklist in `posts/README.md` |
| Fri | **Polish + ideation** | Final prose pass; open new seeds for next week |
| Sat | **SEO / metadata** | Frontmatter: slug, description, keywords, OG image |
| Sun | **Roadmap** | Quarter outlook; update article pipeline backlog |

## Naming Convention

```
drafts/YYYY-MM-DD-slug.md
```

Date = first-draft date. Slug is lowercase, hyphen-separated, max 60 chars.

## Frontmatter Schema

```yaml
---
title: "Article Title"
date: YYYY-MM-DD
status: outline | draft | review | ready
tags: []
related_repos: []
related_issues: []
---
```

`status` must be `ready` before promotion to `posts/`.
