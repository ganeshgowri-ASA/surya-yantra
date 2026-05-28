---
title: "Surya Yantra — Published Articles"
status: active
last_updated: "2026-05-28"
---

# Surya Yantra — Published Articles

Research articles promoted from `drafts/` after passing all 34 peer-review checklist
items (see `editorial/peer-review-checklist-template.md`).

## Published

_No articles published yet._

First candidate: `2026-05-28-smmf-nabl-uncertainty.md` (🌱 seed as of W22 Thu).
Earliest realistic promotion: W24–W25 (mid-June 2026) pending lab validation data.

## Promotion checklist

Before moving a file from `drafts/` to `posts/`:

- [ ] All 34 items in `editorial/peer-review-checklist-template.md` PASS
- [ ] DOIs verified for all references (no 404s)
- [ ] All unvalidated quantitative claims replaced with measured data or removed
- [ ] SEO front-matter complete (title ≤60 chars, description ≤160 chars, ≥10 keywords, canonical URL)
- [ ] OG image uploaded at `public/og/<slug>.png` (1200×630 px)
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
