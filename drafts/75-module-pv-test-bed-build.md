---
title: "Building a 75-Module Solar PV Test Bed: From Kelvin Harness to Cloud Dashboard"
seo_title: "75-Module Solar PV IV Test Bed Build: ESL-Solar 500, MUX, SCPI, Cloud Dashboard | Srishti PV Lab"
description: "End-to-end engineering narrative of Srishti PV Lab's 75-module test infrastructure: ESL-Solar 500, 300-relay MUX, 4-wire Kelvin sensing, STM32H7 firmware, and Surya Yantra cloud platform."
keywords:
  - solar PV test bed
  - IV curve tracer hardware
  - ESL-Solar 500
  - MUX relay matrix
  - 4-wire Kelvin sensing
  - SCPI solar testing
  - IEC 62446
  - photovoltaic characterisation
  - India solar lab
  - STM32H7 relay control
  - Omron G9EA relay
  - MCP23017 IO expander
  - Modbus RTU relay
canonical: "https://surya-yantra.srishtipvlab.in/posts/75-module-pv-test-bed-build"
og:
  title: "Building a 75-Module Solar PV Test Bed: Hardware to Cloud"
  description: "From ₹33.5 lakh BOM to cloud dashboard: the complete engineering story of Srishti PV Lab's automated IV curve test infrastructure."
  image: "/og/75-module-test-bed.png"
  type: "article"
twitter:
  card: "summary_large_image"
  title: "75-Module PV Test Bed: Kelvin Harness to Cloud Dashboard"
  description: "ESL-Solar 500, 300-relay MUX, STM32H7, 4-wire Kelvin, and Surya Yantra — the full engineering build story."
  image: "/og/75-module-test-bed.png"
author: "Srishti PV Lab Engineering"
date: "2026-05-02"
lastmod: "2026-05-09"
draft: true
tags:
  - solar-pv
  - hardware
  - test-infrastructure
  - iec-62446
  - electronic-load
  - relay-matrix
  - embedded-systems
  - india
categories:
  - hardware
  - research
reading_time: 18
schema_type: "TechArticle"
related_repos:
  - surya-yantra
  - SolarLabX
  - antaryami-os
---

# Building a 75-Module Solar PV Test Bed: From Kelvin Harness to Cloud Dashboard

India's solar manufacturing capacity crossed 50 GW/year in 2025. Yet characterisation infrastructure — the labs that verify a module's power output, thermal behaviour, and spectral response — remains sparse relative to that production scale. At Srishti PV Lab in Jamnagar we built a 75-module automated test bed from the ground up. This article documents the engineering decisions, the full Bill of Materials (₹33.5 lakh, April 2026 pricing), and the open-source software stack that ties it together.

Measurement data flows from this test bed into [SolarLabX](https://github.com/ganeshgowri-ASA/SolarLabX) for LIMS and QMS workflows. [Antaryami-OS](https://github.com/ganeshgowri-ASA/antaryami-os) provides the AI scheduling layer that coordinates test sessions across multiple labs.

## Why 75 Modules?

A commercial solar plant procures modules in batches of thousands. Statistically meaningful incoming quality control (IQC) requires testing ~1–3 % of each batch. For a 5 MW plant with ~10,000 modules that is 100–300 measurements. A 75-module simultaneous-mount capacity lets the lab test one full 1 MW batch per day with two sweeps (morning + afternoon), aligning with natural irradiance cycles and the IEC 62446-1 commissioning protocol.

The 15 × 5 physical layout mirrors common ground-mount racking, making electrical data directly comparable to in-field measurements.

<!-- TODO: Add statistical power analysis justifying 75-module sample size for NABL accreditation (tracked in issue #20) -->

## System Architecture

```
  ┌──────────────────┐        ┌────────────────────────┐
  │  75-module array  │  ───►  │ 4-wire Kelvin harness  │
  │  (15 × 5 layout)  │        │  Force+/−  Sense+/−    │
  └──────────────────┘        └───────────┬────────────┘
                                          │
                                          ▼
                              ┌────────────────────────┐
                              │   300-relay MUX matrix │
                              │   75 × (4-wire lanes)  │
                              └───────┬────────────────┘
                                      │ one module at a time
                                      ▼
                              ┌────────────────────────┐
                              │  ESL-Solar 500 e-load  │
                              │  0–300 V / 0–27 A      │
                              └───────┬────────────────┘
                                      │ SCPI (USB/Ethernet)
                                      ▼
                              ┌────────────────────────┐
                              │  Surya Yantra Platform │
                              │  (Electron + Vercel)   │
                              └────────────────────────┘
```

## The Electronic Load: ESL-Solar 500

The core of any IV tracer is the electronic load. We chose the **ET SolarPower ESL-Solar 500** (₹4,50,000 ex-GST) for:

- **300 V / 27 A / 500 W** — covers HJT, IBC, TOPCon, and First Solar CdTe (Voc ≈ 220 V for 60-cell CdTe).
- **Built-in MPPSCAN mode** — a single SCPI sequence sweeps the full IV curve without host-side point-by-point control.
- **Scan time ~5 s for 500 points** — fast enough to avoid irradiance drift during the sweep.
- **LXI Ethernet** — enables the Vercel relay service to control it remotely via Cloudflare Tunnel.

```bash
# Full IV sweep SCPI sequence
SOUR:FUNC:MODE CC
SOUR:MPPSCAN:START 0
SOUR:MPPSCAN:STOP 300
SOUR:MPPSCAN:STEP 0.6      # 500 points across 300 V
SOUR:MPPSCAN:STEPT 0.01    # 10 ms dwell per point
SOUR:MPPSCAN:EXEC
# poll until sweep complete, then:
MEAS:MPPSCAN:LISTFIRST?
# iterate MEAS:MPPSCAN:LISTNEXT? — each line: voltage;current;power
```

<!-- TODO: Add oscilloscope screenshot of a real HJT module sweep showing Isc knee -->

## The MUX Relay Matrix

Connecting 75 modules sequentially to a single load requires a multiplexer. Commercial PV test-bed MUX solutions cost ₹8–15 lakh; we built ours for under ₹5 lakh.

### Design requirements

- **300 SPDT relays** (75 modules × 4 wires).
- **100 A DC rated** per contact (worst-case Isc ≈12 A; 100 A headroom for arc suppression).
- **ELOAD interlock**: physically impossible to connect two modules to the load simultaneously.
- **Self-test**: contact resistance < 5 mΩ per relay, verified at commissioning and monthly thereafter.

### Relay selection: Omron G9EA-1-B

The **Omron G9EA-1-B** (₹1,250 each, 310 ordered including spares) is hermetically sealed, rated 100 A / 250 VDC. Hermetic sealing prevents contact oxidation in Jamnagar's humid, salt-laden coastal air.

> **Counterfeits warning**: Fake Omron relays are common in grey-market channels. Source exclusively from element14 India or Mouser with traceable lot codes.

### Control architecture: STM32H743 + MCP23017

```
Lab PC ──USB── Modbus RTU ──► STM32H743ZI2 ──► 18× MCP23017 ──► relay coils (24 VDC)
```

The **Waveshare NUCLEO-H743ZI2** board runs a Modbus RTU server exposing each relay as a coil register. Eighteen **Microchip MCP23017** I²C I/O expanders drive relay coils through flyback-protected MOSFET stages.

The firmware enforces the ELOAD interlock in hardware: only the relay group addressed as `DESTINATION=ELOAD` may be energised; all others are opened first. The server-side API returns `409 Conflict` on any violation.

<!-- TODO: Publish firmware source to hardware/firmware/mux-controller/ — tracked in GitHub issue #2 -->

## 4-Wire Kelvin Sensing

A 2-wire connection includes Force-cable resistance in the measured voltage — typically 0.1–0.5 Ω at these currents, causing a Voc error of 0.5–2.5 V. Kelvin sensing carries voltage on a separate current-free pair, eliminating this error.

Implementation notes:

- **Force**: LAPP ÖLFLEX CLASSIC 110 CY 2×16 mm² (₹480/m), shielded against EMI near the relay matrix.
- **Sense**: Belden 9463A 2×2.5 mm² shielded twisted pair. Shield grounded at MUX end only (single-point) to prevent ground loops.
- **MC4 Y-splitter** (Stäubli MC4-EVO2, ₹260) at the module junction box: Force and Sense share one MC4 body.
- **Torque**: Force terminal screws at 3.5 Nm with Loctite 243 to prevent vibration loosening.

<!-- TODO: Add photo of MC4 Y-splitter termination at module junction box -->

## Environmental Sensor Suite

IEC 60891 corrections require real-time G, T_cell, and AOI. Deployed sensors:

| Sensor | Model | Interface | Purpose |
|--------|-------|-----------|-------|
| Pyranometer | Kipp & Zonen SMP10 | Modbus RTU | In-plane irradiance G_POA |
| Reference PV cell | IMT Si-RS485TC-T-MB | Modbus RTU | Cross-check G + integrated T_cell |
| Cell Pt-100 (×4) | TE PTFD102A1B0 + MAX31865 | SPI | Direct back-sheet temperature |
| Spectroradiometer | Apogee SP-421 + SP-715 | USB | E_test(λ) for SMMF |
| GPS + RTC | u-blox NEO-M9N | USB | Solar position → AOI |
| Wind speed/direction | Davis 6410 | Pulse + 0–5 V | Thermal model input |

## Safety

DC voltages from a 75-module outdoor array reach >250 V open-circuit. Key measures:

1. **ABB OTDC32F1 DC isolator** (1000 V / 32 A) at the array–harness junction — always open before any Kelvin harness work.
2. **Gigavac GX23 emergency contactors** (normally closed, 100 A DC) — trip on E-stop or UPS fail.
3. **Schneider Acti 9 iID RCD** (63 A / 30 mA) upstream of the rack — mandatory per IEC 61010-1.
4. **Category 2 arc-rated PPE** (Honeywell Salisbury ILPB0R) for all MUX chassis work with mains present.
5. **Firmware SOUR OFF** commanded before every relay transition — prevents arcing under load.

Total CAPEX: **₹32.4 lakh** ex-GST. Full BOM with purchase links: [`hardware/BOM.md`](../hardware/BOM.md).

## Ideation → Implementation: The Full Build Journey

```
IDEATION (problem statement)
  ┌──────────────────────────────────────────────────────────────┐
  │  IQC labs in India have no open-source, IEC-compliant,         │
  │  automated IV test system for >10 modules per day.             │
  └────────────────────┬─────────────────────────────────────────┘
                       │
                       ▼
DESIGN (architecture decisions — Q1 2026)
  ┌──────────────────────────────────────────────────────────────┐
  │  ESL-Solar 500 (300 V / 27 A, LXI, MPPSCAN)                   │
  │  300-relay MUX (Omron G9EA + STM32H743 + MCP23017)            │
  │  4-wire Kelvin (LAPP Force + Belden Sense)                     │
  │  Surya Yantra (Next.js + Electron, IEC 60891 engine)           │
  │  Antaryami-OS AI scheduling + SolarLabX LIMS                  │
  └────────────────────┬─────────────────────────────────────────┘
                       │
                       ▼
PROCUREMENT & BUILD (Feb–Mar 2026)
  ┌──────────────────────────────────────────────────────────────┐
  │  BOM finalised ₹32.4L · Relay matrix chassis welded           │
  │  Kelvin harness terminated · Env sensor suite installed       │
  │  NUCLEO-H743ZI2 Modbus firmware flashed                       │
  └────────────────────┬─────────────────────────────────────────┘
                       │
                       ▼
COMMISSIONING (April 2026)
  ┌──────────────────────────────────────────────────────────────┐
  │  300/300 relay self-test PASS · < 0.3% Voc repeatability     │
  │  Surya Yantra web app live on Vercel                          │
  │  IEC 60891 engine Vitest: 100% statement coverage             │
  └────────────────────┬─────────────────────────────────────────┘
                       │
                       ▼
VALIDATION (Q2–Q3 2026 — pending)
  ┌──────────────────────────────────────────────────────────────┐
  │  GUM uncertainty budget (issue #3 · #7)                       │
  │  NABL accreditation audit · First public dataset release       │
  └──────────────────────────────────────────────────────────────┘
```

## Results and Next Steps

Initial commissioning (April 2026) confirmed 300/300 relay self-test PASS and < 0.3 % Voc repeatability across consecutive sweeps. Detailed characterisation results and comparison with a CREST-certified reference will be published after the NABL accreditation audit (expected Q3 2026).

<!-- TODO: Add first real throughput data: modules/day, correction accuracy vs reference lab -->

## References

1. IEC 62446-1:2016, *Grid-connected PV systems — Minimum requirements for documentation, commissioning tests, and inspection*. IEC, Geneva.
2. IEC 60904-1:2020, *Measurement principles for terrestrial photovoltaic (PV) devices*. IEC, Geneva.
3. IEC 61010-1:2010+A1:2016, *Safety requirements for electrical equipment for measurement, control, and laboratory use*. IEC, Geneva.
4. IEC 60891:2021 §8, *Uncertainty of measurement correction procedures*. IEC, Geneva.
5. NABL, *Specific Criteria for Accreditation of Testing Laboratories in the field of Solar Energy*, NABL 121, 2023.
6. Jahn U., Frischemeier G., Mayer K. (2014). *PV system performance assessment — IEA-PVPS Task 13 outcome*. 29th EU PVSEC.
7. ET SolarPower, *ESL-Solar 500 User Manual*, FW 1.12.
8. Omron Corporation, *G9EA-1 Series High Power Relay datasheet*, 2024.
9. Surya Yantra hardware BOM: `hardware/BOM.md`.
10. Surya Yantra hardware setup guide: `docs/HARDWARE-SETUP.md`.

---

## Peer Review

*Thursday 8 May 2026 — Weekly peer-review checklist pass*

### Technical Accuracy

- [ ] All equations verified against cited source
- [ ] TypeScript code snippets compile without errors
- [ ] Claims about companion-repo sprint state verified against latest GitHub activity
- [ ] All `<!-- TODO -->` items tracked as open GitHub issues

### Citation Completeness

- [ ] All referenced papers include DOI or arXiv ID
- [ ] IEC standards cite year and section number

### Reviewer Sign-off

| Role | Name | Date | Signature |
|------|------|------|----------|
| Technical reviewer | — | — | — |
| Standards reviewer | — | — | — |
| Editor | — | — | — |

*Assign reviewers in the GitHub PR before promoting `draft: true → false`.*
