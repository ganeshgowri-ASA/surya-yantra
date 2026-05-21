---
title: "Closing the Loop: Streaming Surya Yantra IV Curve Results into SolarLabX's LIMS Quality Records"
slug: iv-curve-to-solarlabx-lims
status: seed
date: 2026-05-21
lastmod: 2026-05-21
tags: [surya-yantra, solarlabx, lims, iec61215, quality-management, api-integration]
seed_source: SolarLabX pushed 2026-05-20 (42 open issues active sprint); antaryami-os pushed 2026-05-20 (130 open issues)
weekly_angle: Thu — peer-review checklist
---

## Peer-Review Checklist (fill before promotion to `posts/`)

- [ ] SolarLabX LIMS ingest API endpoint and schema verified against SolarLabX repo
- [ ] IEC 61215:2021 module qualification requirements cross-checked (pass/fail thresholds)
- [ ] CorrectionResult JSON schema in article matches `docs/API.md` exactly (field names, units)
- [ ] WebSocket streaming payload (IV curve points) matches `apps/web/types/iv-stream.ts`
- [ ] Sequence diagram reviewed by at least one domain expert
- [ ] All figures have alt-text
- [ ] Citations: IEC 61215:2021, IEC 61853-1, SolarLabX URL, Antaryami-OS URL
- [ ] No auth tokens or private API keys in code examples
- [ ] Abstract ≤ 250 words

---

## Abstract

A PV lab generates two kinds of data that must coexist in a quality
management system: **raw measurement artefacts** (IV curves, environmental
readings) from instruments like Surya Yantra, and **structured quality
records** (test reports, deviation notices, calibration certificates)
managed in a LIMS such as SolarLabX.

Today those two worlds rarely talk. Test engineers manually export CSV
files from the IV tracer and re-enter key parameters — Pmp, Isc, Voc,
fill factor — into the LIMS. Errors creep in, traceability suffers, and
IEC 61215 audit trails are incomplete.

This article proposes and sketches an API bridge: Surya Yantra's
`POST /api/corrections/apply` result is forwarded in real time to
SolarLabX's LIMS ingest endpoint, creating a linked quality record with
full IEC 60891 correction metadata. The Antaryami-OS AI layer monitors
the stream and flags statistically anomalous modules for human review.

---

## 1. Background

### 1.1 Surya Yantra's correction pipeline

After a raw IV sweep, Surya Yantra runs:

```
raw IV curve → IAM (IEC 61853-2) → SMMF (IEC 60904-7)
             → IEC 60891 P1–P4 → STC power report
```

The STC power report is a `CorrectionResult` record (see `docs/API.md §5`):

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

### 1.2 SolarLabX's LIMS

SolarLabX (ganeshgowri-ASA/SolarLabX) is a unified solar PV lab
operations suite providing LIMS, QMS, audit trails, test protocols,
uncertainty budgets, and AI vision — deployable on Vercel (Nextjs).

> **TODO (content gap):** Obtain the SolarLabX LIMS ingest API schema
> (endpoint URL, required fields, auth method) from the SolarLabX repo
> and fill in §2.2 below.

---

## 2. The Integration Design

### 2.1 Sequence

```
Surya Yantra                SolarLabX LIMS          Antaryami-OS
──────────────              ──────────────          ─────────────
POST /api/sessions/:id/start
  │
  │  (sweep loop)
  ├──► POST /api/corrections/apply
  │         │
  │         └──► forward CorrectionResult ──────────────────────►
  │                                        POST /api/lims/ingest
  │                                              │
  │                                              │  creates linked
  │                                              │  quality record
  │                                              │
  │                                         notify Antaryami-OS
  │                                              │
  │                                              └──► anomaly check
  │                                                   (Pmp drift > 2%)
  │                                                        │
  │◄──────────────────────────── deviation notice ─────────┘
```

### 2.2 Payload mapping

| Surya Yantra field | SolarLabX LIMS field | Notes |
|---|---|---|
| `measurementId` | `source_ref` | Foreign key back to IV curve |
| `procedure` | `correction_method` | e.g. `IEC60891_P1` |
| `gMeas` / `tMeas` | `test_irradiance` / `test_temp` | Measurement conditions |
| `smmfUsed` | `spectral_correction_factor` | Dimensionless |
| `iamUsed` | `iam_factor` | Dimensionless |
| `deltaI` / `deltaV` | `delta_isc` / `delta_voc` | STC translation deltas |
| _derived_ Pmp@STC | `pmp_stc` | Computed from corrected curve |
| _derived_ FF | `fill_factor` | Computed via `fillFactor()` |

> **TODO (content gap):** Verify SolarLabX field names once LIMS API is
> stable (tracked in SolarLabX#TBD).

### 2.3 Anomaly monitoring via Antaryami-OS

Antaryami-OS (ganeshgowri-ASA/antaryami-os) acts as the enterprise AI
layer above both systems. After each ingest, it queries the LIMS for the
module's historical Pmp@STC trend. If the rolling 30-day slope exceeds
−0.5 %/month (IEC 61215 degradation threshold), it raises a deviation
notice that routes to the lab manager's inbox.

This closes the quality loop without manual intervention.

---

## 3. Implementation Sketch

### 3.1 Webhook from Surya Yantra

Add an environment variable `LIMS_WEBHOOK_URL` to `apps/web/.env.local`.
After `POST /api/corrections/apply` succeeds, fire an async fetch:

```typescript
// apps/web/app/api/corrections/apply/route.ts (addition)
if (process.env.LIMS_WEBHOOK_URL) {
  fetch(process.env.LIMS_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.LIMS_API_KEY}` },
    body: JSON.stringify(correctionResult),
  }).catch(console.error); // non-blocking
}
```

This is a fire-and-forget call; LIMS failures do not block the IV
correction pipeline (the lab must keep measuring even if LIMS is down).

### 3.2 SolarLabX ingest handler

> **TODO (content gap):** Implement `POST /api/lims/ingest` in SolarLabX
> once the payload schema is agreed. Link to the SolarLabX PR once open.

---

## 4. IEC 61215 Compliance Notes

IEC 61215:2021 requires that PV module qualification test records include:

- Measurement conditions (G, T, AOI) — supplied by Surya Yantra's
  `EnvironmentalReading`
- Correction method and coefficients applied — supplied by `CorrectionResult`
- Uncertainty budget — **content gap**: Surya Yantra does not yet compute
  expanded uncertainty (GUM method). See §5.

---

## 5. Open Issues (filed as GitHub issues)

| Issue | Repo | Description |
|---|---|---|
| #TBD | surya-yantra | Add GUM uncertainty budget to CorrectionResult |
| #TBD | surya-yantra | LIMS_WEBHOOK_URL env var + non-blocking forward |
| #TBD | SolarLabX | LIMS ingest endpoint for external IV data |

---

## 6. References

1. SolarLabX repository — https://github.com/ganeshgowri-ASA/SolarLabX
2. Antaryami-OS repository — https://github.com/ganeshgowri-ASA/antaryami-os
3. Surya Yantra API Reference — `docs/API.md`
4. Surya Yantra IEC Corrections — `docs/IEC-CORRECTIONS.md`
5. IEC 61215:2021, *Terrestrial photovoltaic (PV) modules — Design
   qualification and type approval*.
6. IEC 61853-1:2011, *Photovoltaic (PV) module performance testing and
   energy rating — Part 1: Irradiance and temperature performance
   measurements and power rating*.
7. JCGM 100:2008 (GUM), *Evaluation of measurement data — Guide to the
   expression of uncertainty in measurement*.
