---
title: "Surya Yantra: Open-Source IEC-Compliant PV Module IV Curve Tracer for India"
seo_title: "Surya Yantra — Open-Source Solar PV IV Curve Tracer | IEC 60891, SMMF, IAM | Srishti PV Lab"
description: "Surya Yantra is a full-stack open-source PV module IV curve testing platform: IEC 60891 corrections, 75-module MUX, SCPI hardware control, AI diagnostics, and Vercel deployment."
keywords:
  - Surya Yantra
  - solar PV IV curve tracer
  - IEC 60891
  - open source solar testing
  - photovoltaic characterisation India
  - IV curve measurement
  - HJT module testing
  - TOPCon testing
  - IBC solar testing
  - SCPI electronic load
  - spectral mismatch factor
  - incidence angle modifier
  - solar lab India
  - Next.js solar app
canonical: "https://surya-yantra.srishtipvlab.in/posts/surya-yantra-open-source-pv-iv-tracer"
og:
  title: "Surya Yantra — Open-Source PV IV Curve Tracer for India"
  description: "Full-stack solar PV testing platform: IEC 60891:2021 corrections, 75-module automated test bed, AI diagnostics, Vercel + Electron deployment."
  image: "/og/surya-yantra-overview.png"
  type: "article"
twitter:
  card: "summary_large_image"
  title: "Surya Yantra — Open-Source Solar PV IV Tracer"
  description: "IEC-compliant PV module characterisation: all four correction procedures, 300-relay MUX, SCPI, AI diagnostics. Open source. India-built."
  image: "/og/surya-yantra-overview.png"
author: "Srishti PV Lab"
date: "2026-05-02"
lastmod: "2026-05-02"
draft: false
tags:
  - surya-yantra
  - solar-pv
  - open-source
  - iec-60891
  - iv-curve
  - photovoltaic
  - india
  - nextjs
  - electron
categories:
  - announcement
  - research
reading_time: 8
schema_type: "Article"
related_repos:
  - surya-yantra
  - SolarLabX
  - GanitaSutra-v0
  - antaryami-os
---

# Surya Yantra: Open-Source IEC-Compliant PV Module IV Curve Tracer for India

*Published 2 May 2026 · Srishti PV Lab, Jamnagar*

India now manufactures solar panels faster than it can rigorously characterise them. The gap between production throughput and laboratory measurement capacity costs developers and buyers alike — in power guarantees that cannot be independently verified, in warranty disputes that hinge on contested datasheets, and in performance ratios that drift from projections.

**Surya Yantra** (Sanskrit: *सूर्य यन्त्र*, "Solar Instrument") is an open-source, IEC-compliant PV module IV curve testing platform built at Srishti PV Lab, Jamnagar. MIT licence. [github.com/ganeshgowri-ASA/surya-yantra](https://github.com/ganeshgowri-ASA/surya-yantra).

## What It Does

Surya Yantra automates the full IV characterisation workflow for a 75-module outdoor test bed:

1. **Sweep** — Commands the ESL-Solar 500 electronic load over SCPI to trace the complete I-V curve from Isc to Voc in ~5 seconds per module.
2. **MUX** — Routes each sweep through a 300-relay multiplexer (75 modules × 4-wire Kelvin lanes), one module at a time with hardware interlock.
3. **Correct** — Applies IEC 60891:2021 Procedures 1–4, spectral mismatch factor (IEC 60904-7), and the Martin-Ruiz incidence-angle modifier (IEC 61853-2) to translate every curve to STC (1000 W/m², 25 °C).
4. **Report** — Generates signed PDF, CSV, or XLSX reports with all measurements, corrections, and environmental readings.
5. **Diagnose** — Passes anomalous curves to an AI diagnostics endpoint (Claude or GPT-4o) that explains the probable cause in plain language.

## Standards Compliance

| Standard | Coverage |
|----------|---------|
| IEC 60891:2021 | G/T correction Procedures 1, 2, 3, 4 |
| IEC 60904-1:2020 | I-V measurement principles |
| IEC 60904-3:2019 | AM1.5G reference spectrum |
| IEC 60904-7:2019 | Spectral mismatch factor (SMMF) |
| IEC 61215:2021 | Module design qualification support |
| IEC 61853-1:2011 | Power and energy rating |
| IEC 61853-2:2016 | Spectral responsivity, AOI (Martin-Ruiz IAM) |
| IEC 61853-3:2018 | Energy rating calculation |

## Hardware Compatibility

Validated against the **ET SolarPower ESL-Solar 500** (0–300 V, 0–27 A). The 300 V range covers CdTe thin-film and high-string-voltage bifacial configurations:

| Technology | Voc range | Isc range |
|------------|-----------|----------|
| Mono c-Si / PERC | 35–50 V | 8–12 A |
| HJT | 40–52 V | 8–12 A |
| TOPCon | 38–51 V | 8–12 A |
| IBC | 42–55 V | 8–14 A |
| HPBC / Perovskite tandem | 38–60 V | 8–16 A |
| First Solar CdTe Series 7 | 180–225 V | 1.5–3 A |

## Technology Stack

```
Frontend    Next.js 14 · React 18 · TypeScript · Tailwind CSS
Charts      Recharts (real-time IV/PV curves)
UI          shadcn/ui + Radix UI
Database    PostgreSQL 15 + Prisma ORM (20 models)
Hardware    serialport (Node.js) — SCPI over USB/RS-232/Ethernet
AI          Anthropic Claude · OpenAI GPT-4o
Desktop     Electron 30 (Windows .exe distribution)
Deployment  Vercel (web) · GitHub Actions (CI/CD)
Monorepo    Turborepo + pnpm workspaces
```

## Two Deployment Modes

**Web (Vercel):** The Next.js app deploys to Vercel in ~2 minutes. A Cloudflare Tunnel relays SCPI commands from the cloud to the lab’s ESL-Solar 500 without opening inbound firewall ports. Production cost: ~₹100/month (Vercel Pro + managed Postgres + Claude API).

**Desktop (Electron):** An offline-capable Windows executable bundles the same UI and drives the instrument directly over USB — suitable for labs without reliable internet or with no-cloud policies.

Full deployment guide: [`docs/DEPLOYMENT.md`](../docs/DEPLOYMENT.md).

## Quick Start

```bash
git clone https://github.com/ganeshgowri-ASA/surya-yantra.git
cd surya-yantra
pnpm install
cp apps/web/.env.example apps/web/.env.local
# Add DATABASE_URL and ANTHROPIC_API_KEY to .env.local
pnpm db:push
pnpm db:seed
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The dashboard works with seeded demo data — no hardware required for UI exploration.

## Ecosystem Integration

Surya Yantra is one node in the Srishti PV Lab open-source stack:

- **[SolarLabX](https://github.com/ganeshgowri-ASA/SolarLabX)** — LIMS + QMS + audit trail for IEC-accredited labs. Surya Yantra pushes corrected IV measurements directly into SolarLabX’s test record database via the `/api/measurements` webhook.
- **[GanitaSutra-v0](https://github.com/ganeshgowri-ASA/GanitaSutra-v0)** — MATLAB-inspired computation platform (21 toolboxes, SimuFlow block diagrams). The IEC 60891 correction logic is shared with GanitaSutra’s PV simulation toolbox. GanitaSutra’s curve-fitting module (in active development as of May 2026) will automatically extract temperature coefficients and series resistance from two measured curves, removing the need for module datasheet parameters in P3/P4 corrections.
- **[Antaryami-OS](https://github.com/ganeshgowri-ASA/antaryami-os)** — Enterprise AI operating system. Orchestrates multi-lab test scheduling and routes AI diagnostics queries to the optimal model (Claude Opus 4.7 for deep fault analysis, Haiku 4.5 for rapid triage).

## Roadmap

- **Q2 2026** — STM32H7 MUX controller firmware published in `hardware/firmware/`
- **Q2 2026** — NABL accreditation audit; first third-party validated measurement dataset released
- **Q3 2026** — IEC 61853-3 energy rating pipeline (G–T matrix → annual energy yield)
- **Q3 2026** — GanitaSutra coefficient-extraction integration for parameter-free P3/P4 corrections
- **Q4 2026** — Perovskite stability monitoring mode (ISOS-L-1 light-soak protocol)

## Contributing

Issues and pull requests welcome. Priority areas:

- SCPI drivers for Chroma 63600, Keithley 2651A
- Modbus drivers for additional pyranometer models (EKO MS-802, Hukseflux SR20)
- Hindi and Tamil UI translations

---

*MIT © 2026 Srishti PV Lab / ganeshgowri-ASA. Questions: open a GitHub issue.*
