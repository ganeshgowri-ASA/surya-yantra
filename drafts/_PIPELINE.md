# Content Pipeline — Surya Yantra Research Articles

This directory holds **work-in-progress drafts** before they graduate to `posts/`.

## Weekly cadence

| Day | Action |
|-----|--------|
| Mon | New article **outline** (H1–H3 skeleton, abstract, keywords) |
| Tue | **Triage**: remove or archive drafts stale > 30 days with no recent commit |
| Wed | **Enhancement**: pull in references, add figures/diagrams, flesh out sections |
| Thu | **Peer-review checklist** run (see `_CHECKLIST.md`) |
| Fri | **Publication-ready polish** + add ideation→implementation diagram |
| Sat | **SEO/metadata**: front-matter slug, description, OG tags, canonical URL |
| Sun | **Roadmap**: open issues for next article ideas linked to engineering progress |

## Staleness rule (Tuesday triage)

A draft is *stale* if:
- Its filename date is > 30 days old **AND**
- It has received no commit in the last 14 days **AND**
- It has no `status: active` front-matter flag

Stale drafts move to `drafts/_archive/` (not deleted).

## File naming

```
drafts/YYYY-MM-DD-kebab-title.md
```

## Front-matter schema

```yaml
---
title: "Full article title"
slug: kebab-url-slug
status: outline | draft | review | ready  # outline=Mon seed, ready=Fri
date: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [iec60891, pv-testing, open-source]
repos: [surya-yantra, SolarLabX, GanitaSutra]   # linked codebases
citations: []   # DOI or URL list (Wed fills this)
seo_description: ""   # 155 chars max (Sat fills this)
---
```

## Triage run — 2026-06-03 (Tuesday)

**Result**: No existing drafts. Zero stale items to remove.

This was the bootstrap session. Two article seeds created today:

- `2026-06-03-iec60891-open-source.md` — IEC correction engine research narrative
- `2026-06-03-unified-pv-ecosystem.md` — Cross-repo ecosystem paper seed

Both are at `status: outline` and will advance per the weekly cadence.
