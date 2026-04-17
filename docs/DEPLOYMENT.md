# Deployment Guide — Vercel

This guide walks through deploying the Surya Yantra web app (`apps/web`) to
Vercel with a managed PostgreSQL database and environment secrets. The
Electron desktop app is distributed separately (see `apps/desktop/README`).

---

## 1. Prerequisites

* A GitHub account with access to `ganeshgowri-ASA/surya-yantra`.
* A [Vercel](https://vercel.com) account (Hobby tier is enough for staging).
* A managed PostgreSQL 15 instance. Recommended options:
  * **Neon** — serverless, branchable, free tier.
  * **Supabase** — includes row-level auth if you need it.
  * **Vercel Postgres** — simplest integration; Enterprise cost at scale.
* Anthropic and/or OpenAI API keys for the AI diagnostics feature.
* Node.js 20+ locally for the one-time `prisma generate` step.

---

## 2. Create the Vercel project

1. Sign in to Vercel → **Add New… → Project**.
2. Import `ganeshgowri-ASA/surya-yantra`.
3. Set **Root Directory** to `apps/web`.
4. Framework preset is auto-detected as **Next.js**.
5. Build command — leave default (`next build`).
6. Install command — set to `pnpm install --frozen-lockfile`.
7. Output directory — leave default (`.next`).

> **Monorepo note:** Vercel respects the root directory, so `apps/desktop`
> and the hardware schematics never hit the build.

---

## 3. Configure environment variables

In **Project Settings → Environment Variables** add:

| Key                     | Scope              | Value                                   |
| ----------------------- | ------------------ | --------------------------------------- |
| `DATABASE_URL`          | Production+Preview | `postgres://user:pass@host/db?sslmode=require` |
| `DIRECT_URL`            | Production+Preview | Same as above, bypassing any PgBouncer  |
| `NEXTAUTH_SECRET`       | Production+Preview | `openssl rand -base64 32`               |
| `NEXTAUTH_URL`          | Production         | `https://surya-yantra.vercel.app`       |
| `ANTHROPIC_API_KEY`     | Production+Preview | `sk-ant-…`                              |
| `OPENAI_API_KEY`        | Production+Preview | `sk-…` (optional)                       |
| `ESL_SOLAR_HOST`        | Production         | `192.168.1.40` (lab-side gateway)       |
| `MUX_DRIVER_URL`        | Production         | `https://mux.srishti.local`             |
| `LOG_LEVEL`             | All                | `info`                                  |

**Never** commit the actual values — `.env.local` and `apps/web/.env*` are
gitignored.

---

## 4. Set up the database

```bash
# From your local machine, with DATABASE_URL exported
cd apps/web
pnpm install
pnpm exec prisma migrate deploy     # applies all migrations
pnpm db:seed                        # loads the module catalogue
```

For ongoing schema changes:

```bash
pnpm exec prisma migrate dev --name add_new_field
git add apps/web/prisma/migrations
git commit -m "db: add new field"
```

Vercel runs `prisma migrate deploy` automatically in the build step via the
`postinstall` hook.

---

## 5. Regional considerations

The Srishti lab runs in Jamnagar (22.47 °N, 70.06 °E). For best latency:

* Vercel build region: **Singapore (sin1)** or **Mumbai (bom1)**.
* Database region: **Mumbai**.
* CDN: keep Vercel's global edge network enabled.

---

## 6. Custom domain

1. In **Project Settings → Domains** add `surya-yantra.srishtipvlab.in`.
2. Add the displayed `CNAME` at your DNS provider.
3. Vercel issues a Let's Encrypt certificate automatically.

---

## 7. Post-deploy smoke test

```bash
BASE=https://surya-yantra.vercel.app

curl -fsSL $BASE/api/health                         # expects {"status":"ok"}
curl -fsSL $BASE/api/modules?limit=1                # expects one module
curl -fsSL -X POST $BASE/api/corrections/iam \
     -H 'content-type: application/json' \
     -d '{"theta": 60}'                             # expects ~0.9499
```

If any call returns 5xx check **Deployments → Functions → Logs**.

---

## 8. Hardware connectivity

The lab's ESL-Solar 500 and MUX matrix are **not** reachable from Vercel
directly. Deploy the lightweight relay service (`apps/desktop/relay`) on
a lab PC and expose it to the internet via:

* **Cloudflare Tunnel** (recommended, free, no inbound firewall)
* **Tailscale Funnel** (simple, uses your tailnet)
* **ngrok** (fastest to set up, paid plan for persistent URLs)

The web app then hits `MUX_DRIVER_URL` which points at the tunnel endpoint.

---

## 9. Rolling back

Vercel keeps all previous deployments. To roll back:

1. **Deployments → …menu on the previous build → Promote to Production**.
2. If the database schema also changed, run the down migration:

   ```bash
   pnpm exec prisma migrate resolve --rolled-back <migration_name>
   ```

---

## 10. Monitoring & alerts

* Enable **Vercel Analytics** and **Web Vitals**.
* Connect **Sentry** for error reporting (`SENTRY_DSN` env var).
* Add an **Uptime** check on `/api/health` with a 1-minute interval.
* The AI diagnostics route (`/api/ai/chat`) runs as an Edge Function by
  default — watch the streaming budget on the Anthropic / OpenAI side.

---

## 11. Cost envelope (typical)

| Line item                       | Monthly         |
| ------------------------------- | --------------- |
| Vercel Pro seat                 | $20             |
| Vercel Postgres 1 GB            | ~$15            |
| Anthropic Claude (100k tok/day) | ~$40            |
| Cloudflare Tunnel               | $0              |
| Sentry team                     | $26             |
| **Total**                       | **~$100/mo**    |

---

*Maintained by the Srishti PV Lab platform team.*
