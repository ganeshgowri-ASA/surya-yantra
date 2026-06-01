---
title: "Surya Yantra — Published Posts"
description: "Research articles promoted from drafts/ after editorial review"
---

# Published Posts

Articles that have completed the full editorial pipeline from `drafts/`.

## Promotion checklist

Before moving a draft here, verify all boxes are ticked:

- [ ] Front matter complete: `title`, `description`, `keywords`, `canonical`, `og_image`, `status: published`
- [ ] All citations formatted with `[^n]` footnotes
- [ ] Figures have non-empty alt text
- [ ] All internal links resolve (no 404s in the local dev build)
- [ ] OG image created at `apps/web/public/og/<slug>.png` (1200×630 px, ≤200 KB)
- [ ] Sitemap entry added to `apps/web/app/sitemap.ts`
- [ ] Next.js page route `apps/web/app/posts/[slug]/page.tsx` renders the article
- [ ] Peer-review checklist (Thursday) completed by a second reader
- [ ] Friday polish pass: ideation→implementation diagram present if applicable

## Open issues blocking this pipeline

- [#115](https://github.com/ganeshgowri-ASA/surya-yantra/issues/115) — `sitemap.ts` missing
- [#114](https://github.com/ganeshgowri-ASA/surya-yantra/issues/114) — OG images missing
- [#111](https://github.com/ganeshgowri-ASA/surya-yantra/issues/111) — no production Vercel deployment
