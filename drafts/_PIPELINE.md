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

## Session log

### 2026-06-03 (Tuesday) — bootstrap

**Result**: No existing drafts. Zero stale items to remove.

Bootstrap session. Two article seeds created at `status: outline`:

- `2026-06-03-iec60891-open-source.md` — IEC correction engine research narrative
- `2026-06-03-unified-pv-ecosystem.md` — Cross-repo ecosystem paper seed

### 2026-06-04 (Wednesday) — enhancement: add references

Both drafts advanced from `status: outline` → `status: draft`:

- `2026-06-03-iec60891-open-source.md` — Abstract written; §2.2 Related work filled; 8 references added
- `2026-06-03-unified-pv-ecosystem.md` — Abstract written; §3.3 API contracts sketched; 10 references added

Docs updated:
- `docs/API.md` — References section added (5 entries); model ID & datestamp corrected
- `docs/HARDWARE-SETUP.md` — §9 "Further reading" upgraded to formal References (7 entries)
- `docs/DEPLOYMENT.md` — §12 References added (8 entries)
- `README.md` — IAM formula parentheses error fixed

Cross-repo commits (antaryami-os, GanitaSutra-v0, ShilpaSutra, SolarLabX): not accessible
via current session scope. Article seeds rely on Vercel project list and surya-yantra
codebase signals. Add those repos to session scope to enable full cross-repo seeding.
