---
title: "Securing PV Lab AI APIs: Auth Guards, HMAC Tokens, and Credential Hygiene for Solar Characterisation Platforms"
status: seed
date: 2026-05-26
weekly_angle: Tuesday (bulk-removal — removing unauthenticated API surface)
target_venue: "Renewable Energy / IET Renewable Power Generation"
target_length: "7–9 pages"
related_repos:
  - surya-yantra
  - SolarLabX
triggered_by: "SolarLabX PRs — security: add auth guards to AI routes + fix credential exposure (2026-05-25); Saturday: Zod validation on 4 API routes; relay service (surya-yantra issue #74/#91)"
---

# SEED: Securing PV Lab AI APIs: Auth Guards, HMAC Tokens, and Credential Hygiene for Solar Characterisation Platforms

> **Status:** seed · **Date:** 2026-05-26 · **Weekly angle:** Tuesday (bulk-removal)
> **Triggered by:** SolarLabX PR `security: add auth guards to AI routes and fix
> credential exposure` (2026-05-25): `requireAuth()` helper added, Roboflow API
> key moved from URL query param → Authorization header, wildcard `remotePatterns`
> tightened to explicit trusted hosts.
> Also: surya-yantra P0 gap — `apps/desktop/relay` relay service needs HMAC auth
> to bridge Vercel cloud ↔ ESL-Solar 500 lab hardware (issues #74, #91).

---

## Core Narrative

AI-enhanced PV lab platforms (IV tracers, LIMS, diagnostics) expose HTTP APIs
that invoke LLMs, vision models, and hardware controllers. Without authentication
these endpoints are:

1. **Unauthenticated by default** — any internet host can trigger expensive LLM
   calls or, worse, issue SCPI commands to hardware
2. **Credential-leaking** — API keys in URL query parameters appear in server logs,
   proxy traces, and browser history
3. **Prompt-injectable** — unvalidated user input reaches LLM system prompts,
   enabling jailbreak and data exfiltration

This paper documents the **systematic hardening** of the SolarLabX AI API surface
and proposes the same architecture for Surya Yantra's planned relay service.

---

## 1. Introduction

### 1.1 The PV Lab AI API threat model
- Cloud-hosted web app (Vercel) + physical lab hardware (ESL-Solar 500, MUX matrix)
- LLM endpoints: SOP generation, visual inspection (EL/IR), IV fault diagnosis
- Hardware endpoints (relay service): SCPI commands, MUX relay switching

### 1.2 Vulnerabilities found and fixed in SolarLabX (2026-05-24/25)
| Vulnerability | Fix | File |
|---|---|---|
| Unauthenticated LLM endpoints | `requireAuth()` guard using NextAuth `getServerSession` | `lib/api-auth.ts` |
| Roboflow API key in URL query param | Move to `Authorization` header | `api/vision/detect/route.ts` |
| Wildcard `**` in `next.config.mjs` `remotePatterns` | Replace with explicit hosts | `next.config.mjs` |
| Unvalidated string input to LLM prompts | Zod schema + `stripControlChars()` | All AI routes |

### 1.3 Surya Yantra security gaps (open)
- `POST /api/ai/chat` — LLM endpoint (issue #88 tracks health endpoint; auth status unknown)
- `apps/desktop/relay` — does not exist yet (issue #74 P0); when built, HMAC auth is required
- SCPI commands must be **whitelisted** before relay forwards them to ESL-Solar 500

---

## 2. Authentication Architecture

### 2.1 Session-cookie auth (web UI)
- NextAuth.js `getServerSession()` — validates JWT in httpOnly session cookie
- `requireAuth()` helper returns `{ session, error }` — callers return `401` on error
- Applied to: `/api/sop/generate`, `/api/vision/detect`, `/api/reports/generate`, `/api/chat`

```ts
// lib/api-auth.ts (SolarLabX pattern)
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAuth(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return { session: null, error: "Unauthorized" };
  return { session, error: null };
}
```

### 2.2 HMAC-signed bearer tokens (relay service / external integrations)
- Pattern: `Authorization: Bearer <base64(timestamp.nonce.HMAC-SHA256)>`
- Token window: ±30 seconds (prevents replay attacks)
- Key rotation: 90-day schedule with 24-hour overlap for zero-downtime rotation
- Applicable to: Surya Yantra relay service ↔ Vercel web app

```ts
// Proposed: apps/desktop/relay/src/auth.ts
import { createHmac, timingSafeEqual } from "crypto";

export function verifyHmacToken(token: string, secret: string): boolean {
  const [ts, nonce, mac] = Buffer.from(token, "base64")
    .toString().split(".");
  if (Math.abs(Date.now() / 1000 - parseInt(ts)) > 30) return false;
  const expected = createHmac("sha256", secret)
    .update(`${ts}.${nonce}`).digest("hex");
  return timingSafeEqual(Buffer.from(mac), Buffer.from(expected));
}
```

### 2.3 SCPI command whitelisting (hardware safety layer)
The relay service must **not** forward arbitrary SCPI commands:
```ts
const ALLOWED_SCPI = new Set([
  "SOUR ON", "SOUR OFF",
  "SOUR:FUNC:MODE CC", "SOUR:FUNC:MODE CV", "SOUR:FUNC:MODE CR",
  "SOUR:MPPSCAN:EXEC", "SOUR:MPPTRACK:EXEC",
  "MEAS:ALL?", "MEAS:MPPSCAN:LISTFIRST?", "MEAS:MPPSCAN:LISTNEXT?",
  "MEAS:TEMP?", "MEAS:LIGHTINT?",
]);

export function isSafeScpi(cmd: string): boolean {
  // Allow parameterised forms: "SOUR:CURR 5.2"
  const base = cmd.split(" ")[0];
  return ALLOWED_SCPI.has(base) || ALLOWED_SCPI.has(cmd.split(" ").slice(0,2).join(" "));
}
```
**Rationale:** The ESL-Solar 500 supports `SOUR:VOLT` up to 300 V. An
authenticated-but-malicious caller could issue `SOUR:VOLT 300` while the module
under test has a nominal Voc of 50 V, causing destructive overvoltage.
Whitelisting prevents this even if auth is compromised.

---

## 3. Credential Hygiene

### 3.1 API keys in URL query parameters (anti-pattern)
- Roboflow `api_key=<key>` in query string → appears in:
  - Nginx/Vercel edge access logs
  - Browser history
  - HTTP Referer headers sent to third-party resources
  - CDN cache keys (key may be cached with response)

### 3.2 Fix: move to Authorization header
```ts
// Before (SolarLabX, pre-fix):
fetch(`https://detect.roboflow.com/...?api_key=${process.env.ROBOFLOW_KEY}`)

// After (SolarLabX, post-fix):
fetch("https://detect.roboflow.com/...", {
  headers: { Authorization: `Bearer ${process.env.ROBOFLOW_KEY}` }
})
```

### 3.3 Environment variable hygiene for Surya Yantra relay
- `RELAY_HMAC_SECRET` — 32-byte random value, stored in Vercel env (production)
  and `.env.local` (development)
- `ESL_SOLAR_HOST` — serial port path (`/dev/ttyUSB0`) or TCP (`192.168.1.50:5000`)
- `MUX_DRIVER_URL` — Modbus RTU endpoint
- None of these should ever appear in URL parameters or log output

---

## 4. Input Validation as Security Layer

### 4.1 Zod schemas prevent prompt injection
```ts
const SopSchema = z.object({
  standard: z.string().max(60),
  clause: z.string().max(120),
  title: z.string().max(200),
  additionalContext: z.string().max(2000),
});

function stripControlChars(s: string): string {
  return s.replace(/[\x00-\x1F\x7F]/g, "");
}
```
`stripControlChars` prevents embedding control sequences that could manipulate
the LLM's system prompt when interpolated into the request body.

### 4.2 Application to Surya Yantra AI diagnostic endpoint
- `POST /api/ai/chat` accepts `moduleId`, `sessionId`, `message`
- `message` must be stripped of control chars and length-bounded (≤ 4000 chars)
- `moduleId` must be validated against Prisma schema (prevent SQL injection)

---

## 5. IEC Compliance Context

| Standard | Relevant clause | Security requirement |
|----------|----------------|----------------------|
| IEC 62443-4-2:2019 | CR 1.1 | Human user identification and authentication |
| IEC 62443-4-2:2019 | CR 2.1 | Authorization enforcement |
| IEC 61010-1:2010 | §4.4 | Protection against unintended operation |
| OWASP API Security Top 10 | API1:2023 | Broken Object Level Authorization |
| OWASP API Security Top 10 | API8:2023 | Security Misconfiguration |

The SCPI command whitelist maps to IEC 61010-1 §4.4 (protection against
unintended operation of electrically hazardous equipment).

---

## 6. References

> **CITATION COVERAGE: INCOMPLETE — action required before Wednesday enhancement pass**

- [ ] IEC 62443-4-2:2019 — Security for Industrial Automation and Control Systems
- [ ] IEC 61010-1:2010 — Safety requirements for electrical measurement equipment
- [ ] OWASP API Security Top 10 (2023 edition)
- [ ] NextAuth.js documentation (session-based auth pattern)
- [ ] NIST SP 800-204B — Attribute-Based Access Control for Microservices
- [ ] ≥ 2 papers on security in scientific instrument control APIs — **RESEARCH NEEDED**

---

## Open Action Items (Tuesday 2026-05-26)

- [ ] Confirm `POST /api/ai/chat` in Surya Yantra has auth guard — audit route handler
- [ ] Add `RELAY_HMAC_SECRET` to Vercel environment variable list in DEPLOYMENT.md
- [ ] Draft `apps/desktop/relay/src/auth.ts` with HMAC verification (linked to issue #74)
- [ ] Add Zod validation + `stripControlChars` to Surya Yantra AI chat endpoint
- [ ] Cross-link to SolarLabX PR #133 in issue #74 description (pattern already proven)
- [ ] Add ≥ 3 security citations for Wednesday reference pass
