# posts/

Published articles — fully reviewed, polished, and ready for external publication
(arXiv preprint, Srishti PV Lab blog, or peer-reviewed journal submission package).

Each file must pass the peer-review checklist in `drafts/_pr-check-NNN-YYYY-MM-DD.md`
**and** the Saturday SEO audit before being moved here from `drafts/`.

## Naming convention

```
YYYY-MM-DD-slug.md
```

Example: `2026-06-01-iec60891-procedure-comparison.md`

## Required front-matter on publication

```yaml
---
title: "Full article title"
slug: url-safe-slug
authors:
  - name: "First Last"
    affiliation: "Srishti PV Lab, Jamnagar"
    orcid: "0000-0000-0000-0000"
date: YYYY-MM-DD
lastmod: YYYY-MM-DD
status: published
lang: en
description: "160-char meta description."
keywords: [keyword1, keyword2]
canonical_url: "https://srishtipvlab.in/research/<slug>"
og_image: "/og/<slug>-og.png"
twitter_card: summary_large_image
schema_type: ScholarlyArticle
reading_time_minutes: 15
doi: ""
venue: ""
abstract: |
  One-paragraph abstract.
related_repos:
  - surya-yantra
  - SolarLabX
  - antaryami-os
---
```
