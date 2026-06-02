# Surya Yantra — Published Articles

Articles in this directory have passed the full review checklist and are
ready for publication or have already been published.

## Promotion Checklist

Before moving a draft from `drafts/` to `posts/`, verify:

### Structure
- [ ] Headings hierarchy: H1 → H2 → H3, no skipped levels
- [ ] All H2 sections have at least 2 paragraphs or equivalent content
- [ ] Abstract / introduction states the research question within first 100 words

### Citations
- [ ] Every factual claim that is not obvious has a reference
- [ ] All IEC standard citations include year (e.g. IEC 60891:2021)
- [ ] Code snippets reference the source file and line/function

### Figures
- [ ] Every `![...]()` tag has non-empty alt text
- [ ] Mermaid diagrams render without errors (test with `npx @mermaid-js/mermaid-cli`)
- [ ] Tables have header rows

### Links
- [ ] All internal cross-links resolve (`[text](../drafts/...)` etc.)
- [ ] All external links return 2xx (run `lychee --offline-cache`)

### Metadata
- [ ] Frontmatter complete: `title`, `date`, `status: ready`, `tags`, `related_repos`
- [ ] `status` changed from `draft`/`review` to `ready`
- [ ] SEO description added (Saturday angle fills this)

### Content
- [ ] No placeholder text (`TODO`, `TBD`, `[to fill in]`, `...`)
- [ ] Code examples are tested / runnable
- [ ] Word count is within 20 % of the estimate in the outline

## Naming Convention

```
posts/YYYY-MM-DD-slug.md
```

Date = publication date. Slug matches the draft slug.
