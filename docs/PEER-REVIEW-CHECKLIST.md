# Surya Yantra — Peer-Review Checklist

> **Weekly Thursday angle.** Apply this checklist before merging any PR that
> touches `apps/web/lib/`, `app/api/`, `docs/`, or `hardware/`. Each section
> maps to a failure mode caught in past reviews.

Last updated: 2026-05-29

---

## 1. Correctness — IEC Correction Engine

| # | Check | Pass? |
|---|-------|-------|
| 1.1 | All four IEC 60891 procedures have unit tests that compare against the worked example in `docs/IEC-CORRECTIONS.md §1.5` (P1 → Isc 11.49 A, P2 → 11.51 A) | ☐ |
| 1.2 | `correctProcedure1` throws when `G1 ≤ 0` | ☐ |
| 1.3 | `correctProcedure3` throws or warns when `t ∉ [0, 1]` (extrapolation) | ☐ |
| 1.4 | `correctProcedure4` falls back to P2 when `Rsh` is undefined | ☐ |
| 1.5 | `computeSMMF` returns exactly 1.0 when `E_test = E_ref` | ☐ |
| 1.6 | `iamMartinRuiz(60°, { ar: 0.17 })` returns 0.9499 ± 0.0001 | ☐ |
| 1.7 | `iamMartinRuiz(90°)` returns exactly 0 | ☐ |
| 1.8 | Pipeline aborts with HTTP 422 when any intermediate factor is outside `[0.5, 2.0]` | ☐ |

---

## 2. Validation — REST API

| # | Check | Pass? |
|---|-------|-------|
| 2.1 | `POST /api/corrections/p1` rejects missing `irradiance` with 400 | ☐ |
| 2.2 | `POST /api/sessions` rejects unknown `loadMode` with 400 | ☐ |
| 2.3 | `POST /api/mux/:bedId/connect` rejects `destination` not in `[ELOAD, INVERTER, BYPASS]` with 400 | ☐ |
| 2.4 | `POST /api/mux/:bedId/connect` returns 409 when another slot is already bound to `ELOAD` | ☐ |
| 2.5 | All `PATCH` routes disallow changing `id`, `createdAt`, and internal audit fields | ☐ |
| 2.6 | `GET /api/health` returns `{"status":"ok"}` with 200, even without a DB connection (liveness vs readiness) | ☐ |
| 2.7 | `POST /api/ai/chat` validates `model` is one of the allowed Claude identifiers (reject arbitrary strings) | ☐ |

---

## 3. Units & Physical Sanity

| # | Check | Pass? |
|---|-------|-------|
| 3.1 | `alphaPct` and `betaPct` are stored in %/°C in the DB schema and converted to A/°C and V/°C **before** the correction functions — confirm no double-conversion | ☐ |
| 3.2 | Irradiance values are in W/m² throughout (not kW/m² or mW/cm²) | ☐ |
| 3.3 | Temperature values are in °C (not K) in all API request/response schemas | ☐ |
| 3.4 | `smmmfUsed` field in `CorrectionResult` is spelled `smmfUsed` (triple-m typo was present in v1 — confirm resolved) | ☐ |
| 3.5 | IAM is only applied for outdoor test types; indoor flash sessions must not apply IAM | ☐ |
| 3.6 | SMMF outside `[0.8, 1.2]` downgrades `quality_rating` to 1 in `IVMeasurement` | ☐ |

---

## 4. Numerical Accuracy

| # | Check | Pass? |
|---|-------|-------|
| 4.1 | SMMF grid union uses sorted unique wavelengths; duplicate points do not inflate the trapezoidal sum | ☐ |
| 4.2 | P3 interpolation index `t` is computed with the Euclidean norm (not a simple ratio); test with non-orthogonal `(G_a, T_a)` → `(G_b, T_b)` pairs | ☐ |
| 4.3 | All floating-point comparisons in tests use `toBeCloseTo(value, 4)` (4 decimal places = 0.01 % accuracy) | ☐ |
| 4.4 | `fillFactor` is computed as `Pmpp / (Voc × Isc)` — verify it never exceeds 1.0 for real IV curves | ☐ |
| 4.5 | `findMPP` uses a local search over the curve points, not a global maximum that could pick noise spikes | ☐ |

---

## 5. Documentation Coverage

| # | Check | Pass? |
|---|-------|-------|
| 5.1 | Every new REST endpoint is listed in `docs/API.md` with request schema and example response | ☐ |
| 5.2 | Every new IEC procedure or formula change is described in `docs/IEC-CORRECTIONS.md` with a worked example | ☐ |
| 5.3 | `hardware/BOM.md` version is updated when a hardware component is added or removed | ☐ |
| 5.4 | No broken internal links in `docs/` — run `grep -r '\](.*)' docs/ | grep -v http` and verify all paths exist | ☐ |
| 5.5 | Stale date footers (`Generated YYYY-MM-DD`) are updated when the document changes | ☐ |
| 5.6 | Model references in docs and examples use current model IDs (no `claude-opus-4-7`; current is `claude-opus-4-8`) | ☐ |

---

## 6. Safety Rails — Hardware & Deployment

| # | Check | Pass? |
|---|-------|-------|
| 6.1 | The server enforces at most **one** `ELOAD`-bound MUX slot at any time; the interlocking logic is covered by an integration test | ☐ |
| 6.2 | `SOUR OFF` is commanded before any relay transition (verified in the SCPI driver and the MUX connect handler) | ☐ |
| 6.3 | The MUX selftest endpoint (`POST /api/mux/:bedId/selftest`) is documented and tested | ☐ |
| 6.4 | Vercel environment variables (`DATABASE_URL`, `ANTHROPIC_API_KEY`, `ESL_SOLAR_HOST`) are **not** committed; `.env.example` is the only env file in version control | ☐ |
| 6.5 | The `/api/ai/chat` route runs on the Node.js runtime (not Edge), because Prisma ORM requires Node.js APIs | ☐ |
| 6.6 | `POST /api/corrections/apply` aborts and returns 422 before returning corrected data when any safety-rail check fails | ☐ |

---

## How to Use

1. Copy this checklist into the PR description.
2. Check each box after verifying — link to the test file or line number where applicable.
3. Any unchecked box at merge time must have a tracked GitHub issue explaining why it is deferred.
4. Reviewer signs off below:

```
Reviewer: ____________________  Date: __________  Approved: YES / NO
```

---

*Surya Yantra · Srishti PV Lab · Updated 2026-05-29*
