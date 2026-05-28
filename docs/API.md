# Surya Yantra — API Reference

Complete reference for the REST/JSON endpoints exposed by the Next.js app under
`apps/web/app/api/*` and for the shared library modules in `apps/web/lib/*`.

> All endpoints are JSON over HTTPS. Authentication is session-cookie-based for
> the web UI, and HMAC-signed bearer tokens for external integrations.
> Error responses follow the RFC 7807 `application/problem+json` shape.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Health](#health)
3. [Modules & Registry](#modules--registry)
4. [Test Sessions](#test-sessions)
5. [IV Measurements](#iv-measurements)
6. [IEC Correction Engine](#iec-correction-engine)
7. [Environmental Data](#environmental-data)
8. [MUX Matrix Control](#mux-matrix-control)
9. [Reports](#reports)
10. [AI Diagnostics](#ai-diagnostics)
11. [Library API (internal)](#library-api-internal)

---

## Authentication

```
POST /api/auth/login
```

| Field    | Type    | Required | Notes                        |
| -------- | ------- | -------- | ---------------------------- |
| email    | string  | yes      | Organisation-scoped          |
| password | string  | yes      | 12+ chars, case mix + digit  |

Returns `200 { token, user }` or `401`. `token` is a short-lived JWT.

```
POST /api/auth/logout
```

Clears the session cookie and revokes the JWT.

---

## Health

```
GET /api/health
```

No authentication required. Used by the deployment smoke test
([`DEPLOYMENT.md`](./DEPLOYMENT.md) §7) and uptime monitors.

Response `200`:

```json
{ "status": "ok", "db": "ok", "version": "1.0.0" }
```

If the database connection fails the response is `503`:

```json
{ "status": "degraded", "db": "error", "detail": "connection refused" }
```

---

## Modules & Registry

```
GET    /api/modules
GET    /api/modules/:id
POST   /api/modules
PATCH  /api/modules/:id
DELETE /api/modules/:id
```

Query parameters on `GET /api/modules`:

| Param           | Type      | Default | Notes                           |
| --------------- | --------- | ------- | ------------------------------- |
| `technology`    | enum      | —       | `HJT`, `TOPCon`, `IBC`, …       |
| `manufacturer`  | string    | —       | Partial, case-insensitive match |
| `testBedId`     | string    | —       | Only modules bound to the bed   |
| `limit`         | int       | 50      | Max 500                         |
| `offset`        | int       | 0       |                                 |

Example response (`GET /api/modules/:id`):

```json
{
  "id": "clx1234",
  "serialNumber": "SPL-HJT-00042",
  "moduleType": {
    "manufacturer": "Maxeon",
    "modelName": "SPR-X22-370",
    "technology": "IBC",
    "pmpSTC": 370.0,
    "vocSTC": 44.6,
    "iscSTC": 10.58,
    "alphaPct": 0.024,
    "betaPct": -0.244,
    "gammaPct": -0.29,
    "rs": 0.38,
    "kappa": 0.0012,
    "arCoeff": 0.17
  },
  "testBedId": "clx-bed-01",
  "slotPosition": 34,
  "isActive": true
}
```

---

## Test Sessions

```
POST /api/sessions
GET  /api/sessions
GET  /api/sessions/:id
POST /api/sessions/:id/start
POST /api/sessions/:id/abort
```

`POST /api/sessions` body:

```json
{
  "testBedId": "clx-bed-01",
  "name": "Row 5 daily sweep",
  "loadMode": "IV_SWEEP",
  "startV": 0,
  "stopV": 50,
  "stepCount": 500,
  "scanTimeSec": 5.0,
  "moduleIds": ["clx-m-001", "clx-m-002"]
}
```

Server-side the request is queued against the ESL-Solar 500 and the MUX matrix
is driven to expose each module on the `ELOAD` destination in turn.

---

## IV Measurements

```
GET  /api/measurements?sessionId=...&moduleId=...
GET  /api/measurements/:id
GET  /api/measurements/:id/curve?corrected=true
POST /api/measurements/:id/correct
```

The `POST /correct` endpoint invokes the IEC correction engine. Body:

```json
{
  "procedure": "IEC60891_P1",
  "target": { "irradiance": 1000, "temperature": 25 },
  "applySmmf": true,
  "applyIam": true
}
```

Response is the `CorrectionResult` record:

```json
{
  "id": "clx-corr-001",
  "measurementId": "clx-m-042",
  "procedure": "IEC60891_P1",
  "gMeas": 824.1,
  "tMeas": 47.3,
  "alphaUsed": 0.0024,
  "betaUsed": -0.00244,
  "rsUsed": 0.38,
  "kappaUsed": 0.0012,
  "smmfUsed": 1.013,
  "iamUsed": 0.963,
  "deltaI": 1.985,
  "deltaV": -0.64
}
```

---

## IEC Correction Engine

```
POST /api/corrections/p1
POST /api/corrections/p2
POST /api/corrections/p3
POST /api/corrections/p4
POST /api/corrections/smmf
POST /api/corrections/iam
POST /api/corrections/apply
```

The individual `/p1`–`/p4`, `/smmf`, and `/iam` endpoints accept POSTed JSON and
return a corrected `IVCurve` (or scalar factor for `smmf`/`iam`).
See [`IEC-CORRECTIONS.md`](./IEC-CORRECTIONS.md) for the algorithmic details.

`POST /api/corrections/apply` is the **consolidated pipeline** endpoint referenced
in `IEC-CORRECTIONS.md §4`. It applies IAM → SMMF → IEC 60891 in sequence and
returns the STC-normalised curve:

```json
{
  "measurementId": "clx-m-042",
  "procedure": "IEC60891_P2",
  "target": { "irradiance": 1000, "temperature": 25 },
  "applySmmf": true,
  "applyIam": true,
  "aoiBeamDeg": 32.5
}
```

Aborts with HTTP `422` if any intermediate factor falls outside `[0.5, 2.0]`.

Example — `POST /api/corrections/p3`:

```json
{
  "curveA": { "isc": 5.75, "voc": 49.5, "irradiance": 500, "temperature": 25, "points": [...] },
  "curveB": { "isc": 11.5, "voc": 49.5, "irradiance": 1000, "temperature": 25, "points": [...] },
  "target": { "irradiance": 750, "temperature": 25 }
}
```

---

## Environmental Data

```
GET  /api/env/:testBedId/latest
GET  /api/env/:testBedId/range?from=...&to=...
POST /api/env/:testBedId
```

Returns/accepts `EnvironmentalReading` records (irradiance G, cell & ambient
temperatures, AOI, spectral data, etc.).

---

## MUX Matrix Control

```
GET  /api/mux/:testBedId
POST /api/mux/:testBedId/connect
POST /api/mux/:testBedId/disconnect
POST /api/mux/:testBedId/reset
POST /api/mux/:testBedId/selftest
```

`connect` body:

```json
{
  "slotNumber": 34,
  "destination": "ELOAD",
  "force": true,
  "sense": true
}
```

The server verifies that only **one** `ELOAD`-bound slot is active at any time,
and refuses conflicting requests with `409 Conflict`.

`POST /api/mux/:testBedId/selftest` cycles every relay twice and returns coil
continuity and contact resistance per slot:

```json
{
  "total": 300,
  "passed": 298,
  "failed": [
    { "slot": 14, "lane": "FORCE_POS", "contactResistanceOhm": 0.025, "status": "MARGINAL" }
  ]
}
```

Contact resistance thresholds: `< 0.005 Ω` OK, `0.005–0.020 Ω` MARGINAL, `> 0.020 Ω` FAIL.

---

## Reports

```
POST /api/reports
GET  /api/reports/:id
GET  /api/reports/:id/download?format=pdf|csv|xlsx
```

Reports aggregate a session's measurements with STC corrections applied and
produce a signed PDF using pdfkit, or raw tabular data in CSV/XLSX.

---

## AI Diagnostics

```
POST /api/ai/chat
GET  /api/ai/conversations/:sessionId
```

`POST /api/ai/chat`:

```json
{
  "sessionId": "clx-sess-001",
  "moduleId": "clx-m-042",
  "model": "claude-opus-4-7",
  "message": "Explain why Isc dropped 6% after the last sweep."
}
```

Streams `text/event-stream` chunks.

> **Runtime note:** This route uses the Node.js runtime (`export const runtime = 'nodejs'`),
> not the Edge runtime. Prisma ORM requires Node.js native APIs and cannot run in the
> Vercel Edge network. See [`DEPLOYMENT.md`](./DEPLOYMENT.md) §10 for details.

---

## Library API (internal)

These functions are exported from `apps/web/lib/*` and consumed by the API
routes, the seeding scripts, and the desktop app.

### `lib/iec60891.ts`

```ts
correctProcedure1(curve, moduleParams, target?) → IVCurve
correctProcedure2(curve, moduleParams, target?) → IVCurve
correctProcedure3(curveA, curveB, target?)      → IVCurve
correctProcedure4(curve, moduleParams, target?) → IVCurve
findMPP(curve)                                  → { vmpp, impp, pmpp }
fillFactor(curve)                               → number
```

### `lib/smmf.ts`

```ts
computeSMMF(inputs)                             → number
correctIscForSpectrum(iscMeasured, smmf)        → number
interpolate(series, targetGrid)                 → number[]
trapz(grid, y)                                  → number
unionGrid(...series)                            → number[]
```

### `lib/iam.ts`

```ts
iamMartinRuiz(thetaDeg, { ar?, radians? })      → number
iamCurve(thetasDeg, { ar? })                    → number[]
applyIamToPoa(poaDecomposition, aoiBeamDeg, { ar? }) → number
```

---

## Error Codes

| Status | Meaning                                              |
| ------ | ---------------------------------------------------- |
| 400    | Malformed body / schema validation failure           |
| 401    | Missing or expired token                             |
| 403    | Role lacks permission (operator calling admin route) |
| 404    | Unknown resource                                     |
| 409    | MUX conflict, e-load busy, or calibration in flight  |
| 422    | Measurement below quality threshold                  |
| 500    | Unhandled server error (check `req_id` in response)  |
| 502    | ESL-Solar / MUX driver timeout                       |
| 503    | Database unhealthy (see `GET /api/health`)           |

---

*Last lint pass 2026-05-28.*
