# सूर्य यन्त्र — Surya Yantra

> **Srishti PV Module IV Curve Tracer & Test Management System**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://postgresql.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)

---

## What is Surya Yantra?

**Surya Yantra** (Sanskrit: सूर्य यन्त्र = "Solar Instrument") is a full-stack, open-source PV module testing platform built for **Srishti PV Lab**, Jamnagar. It provides:

- **Automated IV curve tracing** via ESL-Solar 500 electronic load (SCPI over USB/RS232/Ethernet)
- **75-module test bed management** with 4-wire Kelvin sensing + multiplexer switching
- **IEC-compliant corrections**: IEC 60891:2021 Procedures 1–4, SMMF (IEC 60904-7), IAM (IEC 61853-2 Martin-Ruiz)
- **300V / 27A range** supporting HJT, HPBC, IBC, TOPCon, Perovskite, First Solar CdTe thin-film
- **AI diagnostics** powered by Claude/OpenAI for fault detection and performance insights
- Runs as **Vercel web app** AND **standalone Electron desktop tool**

---

## System Specifications

| Parameter | Value |
|---|---|
| Module Power | 900W bifacial |
| Voltage Range | 0 – 300V DC (First Solar CdTe support) |
| Current Range | 0 – 27A (HJT/HPBC/IBC/Perovskite) |
| Test Bed | 75 modules, 15 rows × 5 columns |
| Wiring | 4-wire Kelvin (Force+/- & Sense+/-) |
| MUX | 300-relay matrix, 75 × 4-wire channels |
| E-Load | ESL-Solar 500 (ET SolarPower) |
| Interface | USB / RS232 / Ethernet (SCPI) |
| Standards | IEC 60891:2021, IEC 60904-1/3/7, IEC 61853-1/2/3, IEC 61215 |

---

## Repository Structure

```
surya-yantra/
├── apps/
│   ├── web/                  # Next.js 14 Web App (Vercel)
│   │   ├── app/              # App Router pages
│   │   ├── components/       # UI components
│   │   ├── lib/              # Business logic
│   │   └── prisma/           # Database schema
│   └── desktop/              # Electron standalone app
├── packages/
│   ├── scpi-client/          # ESL-Solar SCPI driver
│   ├── iv-engine/            # IEC 60891 correction engine
│   └── types/                # Shared TypeScript types
├── hardware/
│   ├── schematics/           # SVG circuit diagrams
│   ├── BOM.md                # Complete Bill of Materials
│   └── WIRING.md             # Wiring guide
└── docs/
    ├── PRD.md                # Product Requirements
    ├── API.md                # API Reference
    └── IEC-CORRECTIONS.md    # Standards implementation
```

---

## Screens & Features

| Screen | Description |
|---|---|
| **Dashboard** | Live system status, last IV params, environmental conditions |
| **IV Tracer** | Real-time IV+PV curve plot, load mode control, sweep config |
| **Module Registry** | 75-module catalogue, STC data, tech specs |
| **MUX Matrix** | 15×5 visual grid, relay state, E-Load/Inverter routing |
| **IV Corrections** | IEC 60891 P1–P4, SMMF, IAM correction controls |
| **Environmental** | G (irradiance), T (cell/ambient), AOI, spectral data |
| **Reports** | PDF/CSV/XLSX export, comparison, degradation trends |
| **AI Diagnostics** | Claude LLM chat for fault analysis and recommendations |

---

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- pnpm 9+

### Installation

```bash
# Clone the repo
git clone https://github.com/ganeshgowri-ASA/surya-yantra.git
cd surya-yantra

# Install dependencies (monorepo)
pnpm install

# Setup environment
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your DATABASE_URL, ANTHROPIC_API_KEY etc.

# Push database schema
pnpm db:push

# Seed module catalogue
pnpm db:seed

# Start development
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Electron Desktop App

```bash
cd apps/desktop
pnpm dev:electron
```

---

## ESL-Solar 500 SCPI Commands Used

| Function | SCPI Command |
|---|---|
| Load ON/OFF | `SOUR ON` / `SOUR OFF` |
| CC Mode | `SOUR:FUNC:MODE CC` + `SOUR:CURR v` |
| CV Mode | `SOUR:FUNC:MODE CV` + `SOUR:VOLT v` |
| CR Mode | `SOUR:FUNC:MODE CR` + `SOUR:RES v` |
| MPP Scan | `SOUR:MPPSCAN:START v`, `STOP v`, `STEP v`, `STEPT v`, `EXEC` |
| MPP Track | `SOUR:MPPTRACK:EXEC` |
| Measure All | `MEAS:ALL?` → `V;A;W` |
| Scan List | `MEAS:MPPSCAN:LISTFIRST?` → `MEAS:MPPSCAN:LISTNEXT?` |
| Temperature | `MEAS:TEMP?` |
| Irradiance | `MEAS:LIGHTINT?` |

---

## IEC Correction Methods

### IEC 60891:2021 Procedure 1 (Classic Linear)
```
I2 = I1 + Isc·(G2/G1 - 1) + α·(T2 - T1)
V2 = V1 - Rs·(I2 - I1) - κ·I2·(T2 - T1) + β·(T2 - T1)
```

### Spectral Mismatch Factor (SMMF — IEC 60904-7)
```
SMMF = [∫E_test(λ)·SR_ref(λ)dλ / ∫E_ref(λ)·SR_ref(λ)dλ] /
       [∫E_test(λ)·SR_dut(λ)dλ / ∫E_ref(λ)·SR_dut(λ)dλ]
```

### IAM — Martin-Ruiz Model (IEC 61853-2)
```
IAM(θ) = 1 - exp(-cos(θ)/ar) / (1 - exp(-1/ar))
```

---

## Hardware

See [`hardware/BOM.md`](hardware/BOM.md) for complete Bill of Materials with online purchase links.

See [`hardware/schematics/`](hardware/schematics/) for:
- System overview schematic
- MUX relay matrix wiring
- 4-wire Kelvin connection detail
- 19" rack layout drawing

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Charts | Recharts (IV/PV curves, real-time) |
| UI Components | shadcn/ui + Radix UI |
| Database | PostgreSQL 15 + Prisma ORM |
| Hardware | serialport (Node.js) for SCPI communication |
| AI | Anthropic Claude + OpenAI GPT-4o |
| Desktop | Electron 30 |
| Deployment | Vercel (web) + GitHub Actions (CI/CD) |
| Monorepo | Turborepo + pnpm workspaces |

---

## Standards Compliance

- **IEC 60891:2021** — Temperature & irradiance corrections to I-V characteristics
- **IEC 60904-1:2020** — I-V measurement of PV devices
- **IEC 60904-3:2019** — Measurement principles (AM1.5G reference spectrum)
- **IEC 60904-7:2019** — Computation of spectral mismatch
- **IEC 61215:2021** — Module design qualification
- **IEC 61853-1:2011** — Power & energy rating, irradiance & temperature
- **IEC 61853-2:2016** — Spectral responsivity, AOI, module operating temperature
- **IEC 61853-3:2018** — Energy rating calculation

---

## License

MIT © 2026 Srishti PV Lab / ganeshgowri-ASA

---

*Built with ❤️ for advancing solar PV testing in India*
