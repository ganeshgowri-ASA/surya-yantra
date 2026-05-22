# editorial/

Templates and tooling for the Surya Yantra research publication pipeline.

## Contents

| File | Purpose |
|---|---|
| `peer-review-checklist-template.md` | Thursday peer-review checklist applied to each draft |
| `weekly-angles.md` | Day-by-day editorial focus guide |

## How to use the peer-review checklist

1. Copy `peer-review-checklist-template.md` to `drafts/` as `_pr-check-NNN-YYYY-MM-DD.md`.
2. Fill in each checklist item for the article under review.
3. Items marked ❌ become GitHub issues or inline TODO comments in the draft.
4. Once all items pass (✅), update the article front-matter `status: peer-review → polish`.
