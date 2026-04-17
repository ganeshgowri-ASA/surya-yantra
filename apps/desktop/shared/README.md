# Shared Sources

This directory contains symlinks back into `apps/web` so the Electron shell can
reuse the Next.js app's components, lib code, Prisma schema, and public assets
without duplicating files.

| Symlink       | Target                  |
| ------------- | ----------------------- |
| `components/` | `../../web/components/` |
| `lib/`        | `../../web/lib/`        |
| `app-routes/` | `../../web/app/`        |
| `public/`     | `../../web/public/`     |
| `prisma/`     | `../../web/prisma/`     |

Use relative imports like:

```ts
import { IVChart } from "../../shared/components/iv-chart";
```

On Windows, clone with `git config --global core.symlinks true` or run
`git clone -c core.symlinks=true ...` so these links are checked out correctly.
If symlinks are unavailable, the Electron shell still functions: at runtime it
loads the Next.js app over HTTP (dev) or from the packaged standalone output
(production), so no source sharing is required to start the app.
