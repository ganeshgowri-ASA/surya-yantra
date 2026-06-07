---
title: "Zero-Trust API Architecture for Hardware-Coupled Solar PV Test Systems"
slug: zero-trust-api-solar-lab-instrumentation
date: 2026-06-07
author: Srishti PV Lab
status: seed
tags:
  - security
  - api
  - solar-lab
  - surya-yantra
  - solar-lab-x
keywords:
  - API security solar lab
  - IEC 60891 REST API
  - SCPI over HTTP security
  - solar PV test system authentication
  - zero-trust instrumentation
description: >
  How yesterday's auth hardening work in SolarLabX (Zod validation on 8 data
  routes) illuminates the unique threat model of hardware-coupled PV test
  systems — and what Surya Yantra must add before its MUX matrix and e-load
  APIs face public traffic.
---

# Zero-Trust API Architecture for Hardware-Coupled Solar PV Test Systems

*Engineering note seeded 2026-06-07 from SolarLabX Saturday auth hardening
(commit `a33c16df`, PR #177) and ShilpaSutra HTTP-header hardening
(commit `fb83a4393`, PR #207).*

---

## 1. Why hardware-coupled APIs are a distinct threat class

Most web application security literature assumes the blast radius of an
API breach is limited to data. A solar PV test system like Surya Yantra has
a fundamentally different risk profile: its API routes wrap physical hardware.

```
Browser / external client
        │
        ▼
  Next.js API (Vercel edge)
        │
        ├── POST /api/mux/:bedId/connect  ──►  300-relay matrix
        ├── POST /api/sessions/:id/start  ──►  ESL-Solar 500 e-load
        └── GET  /api/env/:bedId/latest   ──►  irradiance sensor bus
```

An unauthenticated `POST /api/mux/clx-bed-01/connect` with
`{ "slotNumber": 34, "destination": "ELOAD", "force": true }` does not
merely read a database row — it closes a physical relay and routes 300 V DC
through a module under test.

---

## 2. Yesterday's progress in the sibling repos

### SolarLabX (2026-06-06, PR #177)

SolarLabX hardened its remaining 8 data-plane routes with a consistent
pattern:

```ts
// lib/api-auth.ts (new helper)
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) return { session: null, error: 401 };
  return { session, error: null };
}

// app/api/audit/route.ts (representative)
export async function POST(req: Request) {
  const { error } = await requireAuth();
  if (error) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = AuditPostSchema.parse(await req.json()); // Zod
  ...
}
```

Routes hardened: `/api/audit`, `/api/lims/samples`, and 6 others.

### ShilpaSutra (2026-06-06, PR #207)

ShilpaSutra's solver routes received input clamping to prevent
CPU-exhaustion attacks on unbounded numerical loops:

```ts
// /api/simulate — before
const { maxIterations } = body;
// runs Gauss-Seidel until convergence with no iteration cap

// after
const maxIterations = Math.min(Math.max(body.maxIterations ?? 100, 1), 500);
```

It also added HTTP security headers globally via `next.config.mjs`:
`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`,
`Referrer-Policy`, `Permissions-Policy`.

---

## 3. Surya Yantra's current exposure

As of April 2026 (last scaffold commit `3031b05`), Surya Yantra's API
routes have **no authentication middleware**. The hardware-facing routes are
the highest-risk surface:

| Route | Hardware consequence of unauthorized call |
|---|---|
| `POST /api/mux/:bedId/connect` | Closes a relay, routes live voltage |
| `POST /api/sessions/:id/start` | Triggers IV sweep on ESL-Solar 500 |
| `POST /api/corrections/apply` | Overwrites stored STC reference values |
| `DELETE /api/modules/:id` | Removes calibration records |

---

## 4. Recommended hardening sequence

### Phase 1 — Auth gate on all hardware-facing routes (1 day)

Adopt the same `requireAuth()` pattern from SolarLabX:

```ts
// apps/web/lib/api-auth.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) return { session: null, error: 401 as const };
  return { session, error: null };
}
```

Apply to: all `/api/mux/*`, `/api/sessions/*`, `/api/corrections/*`.

### Phase 2 — Zod input validation on instrument parameters (1 day)

SCPI commands accept numeric parameters. Without bounds checking, an
attacker can set `startV: 999999` on a 300 V-rated load:

```ts
// apps/web/app/api/sessions/route.ts
const SessionSchema = z.object({
  startV:    z.number().min(0).max(300),
  stopV:     z.number().min(0).max(300),
  stepCount: z.number().int().min(10).max(2000),
  scanTimeSec: z.number().min(0.1).max(60),
});
```

### Phase 3 — HTTP security headers (2 hours)

Add the same header set as ShilpaSutra to `apps/web/next.config.mjs`:

```js
headers: async () => [{
  source: '/(.*)',
  headers: [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  ],
}]
```

### Phase 4 — MUX driver URL SSRF hardening (tracked issue)

`MUX_DRIVER_URL` is an env var consumed by the relay API. If it is user-
supplied or manipulated, it can be used for SSRF to reach internal lab
network endpoints. The driver URL must be validated against an allowlist
before the relay call is forwarded.

---

## 5. Connection to IEC standards compliance

IEC 62443 (industrial automation & control system security) applies to
systems where software directly commands physical processes. A PV test
system driving 300 V relays via an internet-accessible API is exactly this
category. The auth hardening work in SolarLabX and ShilpaSutra this week
brings those platforms into closer alignment with IEC 62443-3-3 security
levels; Surya Yantra should follow the same trajectory before any production
deployment.

---

## 6. Next steps for this article

- [ ] Add code walkthrough of the auth middleware implementation
- [ ] Benchmark: latency overhead of session validation on fast IV sweeps
- [ ] Reference: IEC 62443-3-3 SR 1.1 (human user identification)
- [ ] Diagram: auth flow from browser → Vercel edge → hardware relay

---

*Related repos: [SolarLabX](https://github.com/ganeshgowri-ASA/SolarLabX) PR #177 ·
[ShilpaSutra](https://github.com/ganeshgowri-ASA/ShilpaSutra) PR #207 ·
[Surya Yantra](https://github.com/ganeshgowri-ASA/surya-yantra)*
