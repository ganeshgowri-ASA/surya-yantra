---
title: "Surya Yantra — Published Articles"
status: active
last_updated: "2026-05-30"
---

# Surya Yantra — Published Articles

Research articles promoted from `drafts/` after passing all peer-review
checklist items.

## Published

| Date | Article | Venue | Reading time |
|------|---------|-------|-------------|
| 2026-05-30 | [From IV Curve to Reliability: Surya Yantra × Agnipariksha](./2026-05-30-iv-reliability-loop.md) | Solar Energy (Elsevier) target | ~14 min |

## Promotion checklist

Before moving a file from `drafts/` to `posts/`:

- [ ] All peer-review checklist items PASS
- [ ] DOIs verified for all references (no 404s)
- [ ] Unvalidated quantitative claims replaced with measured data or removed /
      caveated
- [ ] SEO front-matter complete (title ≤ 60 chars, description ≤ 160 chars,
      ≥ 10 keywords, canonical URL)
- [ ] OG image uploaded at `apps/web/public/og/<slug>.png` (1200 × 630 px)
- [ ] `apps/web/app/sitemap.ts` entry added
- [ ] `posts/README.md` index updated
- [ ] Maintainer review + merge approval

## Front-matter schema

```yaml
---
title: "Article Title (≤60 chars)"
slug: "url-slug"
description: "≤160-char SEO description for search results."
keywords:
  - keyword1
  - keyword2
status: "published"
date: "YYYY-MM-DD"
lastmod: "YYYY-MM-DD"
author: "First Last"
affiliation: "Srishti PV Lab, Jamnagar"
og_image: "/og/slug.png"
canonical_url: "https://surya-yantra.srishtipvlab.in/posts/slug"
twitter_card: "summary_large_image"
schema_type: "TechArticle"
reading_time_minutes: 12
lang: "en"
target_venue: "Journal Name (Publisher)"
doi: ""  # fill after publication
---
```

## Open items before first live article

- [ ] issue #106 — OG image for iv-curve-to-reliability-loop (1200 × 630 px)
- [ ] `apps/web/app/sitemap.ts` — add `/posts/iv-curve-to-reliability-loop` entry
- [ ] Agnipariksha data for §5 case study (TC 50 measured ΔPmpp)
