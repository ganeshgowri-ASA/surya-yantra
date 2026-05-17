---
title: "Bridging the Air Gap: The Surya Yantra Desktop Relay for Cloud-to-Lab-Hardware Connectivity"
slug: surya-yantra-desktop-relay-cloud-to-lab-hardware
description: "How the Surya Yantra Electron relay service bridges a Vercel-deployed web app to a lab-local ESL-Solar 500 electronic load over SCPI — architecture, security model, and deployment via Cloudflare Tunnel."
keywords:
  - Surya Yantra relay service
  - SCPI over HTTP cloud
  - Vercel lab hardware bridge
  - Electron relay architecture
  - ESL-Solar 500 remote control
  - Cloudflare Tunnel lab
  - PV test automation cloud
  - SCPI HTTP proxy
  - lab hardware cloud integration
  - Srishti PV Lab architecture
  - serialport Node.js SCPI
  - remote electronic load control
  - solar test equipment cloud
date: 2026-05-17
lastmod: 2026-05-17
author: ganeshgowri-ASA
draft: true
og_image: /og/surya-yantra-desktop-relay-architecture.png
og_image_alt: "Architecture diagram showing the Surya Yantra relay service bridging Vercel cloud to a lab-local ESL-Solar 500 via Cloudflare Tunnel, with HMAC-signed API calls"
canonical: https://surya-yantra.srishtipvlab.in/posts/surya-yantra-desktop-relay-cloud-to-lab-hardware
twitter_card: summary_large_image
schema_type: TechArticle
schema_about: Cloud-to-lab-hardware relay architecture for remote PV instrument control
target_venue: HardwareX or SoftwareX (Elsevier open-access)
word_count_target: 3000
peer_review_status: seed-only
seo_focus_keyword: cloud PV lab hardware relay SCPI architecture
seed_trigger: Issue #44 (apps/desktop/relay missing) + issue #45 (firmware gap) surfaced in Thursday structural lint; Sunday roadmap pass 2026-05-17
weekly_angle: roadmap
---

# Bridging the Air Gap: The Surya Yantra Desktop Relay

> **Status:** Seed — created 2026-05-17 (Sunday roadmap pass). This article seeds the architecture for `apps/desktop/relay`, which is currently missing from the repository (issue #44) and is a P0 Q3 milestone.
>
> **Research narrative:** Cloud-deployed PV testing software cannot directly reach lab-local serial instruments. The relay service is the missing infrastructure layer that makes cloud-native IV testing physically real — and the design decisions here (HMAC auth, Cloudflare Tunnel, SCPI command serialisation) are a reusable pattern for any lab digitisation project.

---

## Seed Thesis

The Surya Yantra architecture has a deliberate split: the **web app** runs on Vercel (globally accessible, managed, always updated) while the **ESL-Solar 500 electronic load** and **300-relay MUX matrix** are physically located in the Srishti lab in Jamnagar. These cannot talk directly — Vercel functions cannot open serial ports or make TCP connections to a private LAN.

The `apps/desktop/relay` service closes this gap. It runs on the lab's Intel NUC 13 PC, accepts HTTPS requests from Vercel, translates them to SCPI commands over USB/Ethernet to the ESL-Solar 500, and relays Modbus RTU commands to the STM32H743-based MUX controller.

This article describes the relay's architecture, security model, and deployment topology — patterns applicable to any IoT or lab-hardware-as-a-service scenario.

---

## Proposed Article Structure

### §1 — Why a Relay? The Physics of Lab Connectivity

PV test equipment runs at 300 V / 27 A DC. The instruments are:
- **ESL-Solar 500**: SCPI over TCP/USB, LAN address `192.168.1.40`
- **MUX controller** (STM32H743): Modbus RTU over RS485, USB-CDC serial
- **Environmental sensors** (Kipp & Zonen SMP10, IMT Solar cell): Modbus RTU over RS485

Vercel's edge functions run in ephemeral, firewalled containers. They cannot:
- Open raw TCP sockets to a private IP
- Access USB serial ports
- Hold persistent connections for 5-second IV sweeps

The relay service gives Vercel a single HTTPS endpoint that handles all of the above.

### §2 — Relay Architecture

```
Vercel Web App / Antaryami-OS skill
          │ POST /scpi   HMAC-SHA256 signed
          ▼
Cloudflare Tunnel (https://relay.srishtipvlab.in)
          │ tunnelled TLS
          ▼
apps/desktop/relay  (Express, Node.js, lab NUC)
   ├── POST /scpi       → serialport → ESL-Solar 500 (USB/TCP)
   ├── POST /mux        → Modbus RTU → STM32H743 MUX controller
   └── GET  /health     → {eload: "IDLE", mux: "OK", sensors: "OK"}
```

**Key design decisions:**

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Tunnel provider | Cloudflare Tunnel | Free; no inbound firewall required; persistent URL |
| Auth | HMAC-SHA256 header `x-sy-hmac` | Stateless; replay-safe with `ts` claim; matches `apps/web/lib/antaryami.ts` |
| Protocol serialisation | SCPI command as JSON `{cmd: string, timeout_ms: number}` | Allows the relay to enforce a command whitelist before sending to instrument |
| Connection pooling | Single persistent serial connection per instrument | ESL-Solar 500 does not support concurrent SCPI sessions |
| Safety pre-condition | `GET /health` returns `hw_state`; relay rejects `mux.connect` when `eload !== "OFF"` | Prevents relay-arc from cloud trigger (mirrors antaryami-os MUX interlock) |

### §3 — SCPI Command Whitelist

The relay enforces a JSON whitelist of permitted SCPI verbs and their rate limits:

```json
{
  "MEAS:ALL?":        { "maxHz": 10 },
  "SOUR:FUNC:MODE":   { "maxHz": 1  },
  "SOUR:CURR":        { "maxHz": 10 },
  "SOUR:VOLT":        { "maxHz": 10 },
  "SOUR ON":          { "maxHz": 1  },
  "SOUR OFF":         { "maxHz": 10 },
  "SOUR:MPPSCAN:EXEC":{ "maxHz": 0.1 }
}
```

Commands outside the whitelist are rejected with HTTP 403 before reaching the serial port. This is the **deterministic safety layer** — it cannot be bypassed by any LLM prompt injection because the relay never passes raw natural language to the instrument.

### §4 — Deployment on the Lab NUC

```bash
# On the Intel NUC 13 (lab PC)
cd apps/desktop/relay
pnpm install
cp .env.example .env.local
# Set: SY_RELAY_SECRET, ESL_SOLAR_HOST, MUX_SERIAL_PORT

# Start the relay
pnpm start

# Install Cloudflare tunnel (one-time)
cloudflared tunnel create surya-yantra-relay
cloudflared tunnel route dns surya-yantra-relay relay.srishtipvlab.in
cloudflared service install
```

The relay service is a ~400-line Node.js/Express app. Its entire dependency tree is:
- `express` + `express-async-handler`
- `serialport` (already used by `apps/desktop/electron/ipc/serialport.ts`)
- `modbus-serial` (for MUX Modbus RTU)
- `ws` (WebSocket for sweep streaming)

### §5 — Open Questions for Q3

<!-- TODO before promotion to posts/ -->

- [ ] Confirm `apps/desktop/electron/ipc/serialport.ts` can be shared with relay without duplication
- [ ] Define Modbus register map for STM32H743 MUX controller (requires firmware issue #45 resolution)
- [ ] Load test: concurrent IV sweep + MUX transition at 10 Hz MEAS:ALL? polling
- [ ] Confirm Cloudflare Tunnel latency is acceptable for 5-second sweep with 500-point IV curve
- [ ] Security review: HMAC key rotation procedure

---

## Connections to Existing Articles

- **SCPI safety governance** (`drafts/2026-05-16-antaryami-os-scpi-safety-governance.md`) — the relay's deterministic whitelist is the hardware enforcement layer for the safety governance framework described there
- **SolarLabX QA loop** (`drafts/2026-05-16-solarlabx-surya-yantra-pv-qa-loop.md`) — SolarLabX calls `POST /api/sessions` on Vercel, which calls `POST /scpi` on the relay; the relay is the final hop to physical measurement
- **Q3 roadmap** (`drafts/2026-05-17-srishti-pv-lab-ecosystem-roadmap-q3-2026.md`) — `apps/desktop/relay` is listed as a P0 Q3 milestone

---

## Implementation Stub (to be committed when scaffolded)

```
apps/desktop/relay/
├── package.json
├── .env.example          (SY_RELAY_SECRET, ESL_SOLAR_HOST, MUX_SERIAL_PORT)
├── src/
│   ├── index.ts          (Express server, /scpi, /mux, /health routes)
│   ├── scpi.ts           (serialport + whitelist enforcement)
│   ├── mux.ts            (Modbus RTU bridge)
│   └── auth.ts           (HMAC-SHA256 request verification)
└── Dockerfile            (for Linux NUC deployment)
```

---

## References (Seed)

1. ET SolarPower, *ESL-Solar 500 Electronic Load User Manual*, Rev 1.12, 2024.
2. Cloudflare, *Cloudflare Tunnel Documentation*. Cloudflare Inc., 2026.
3. Node.js serialport library. `https://serialport.io/docs/`, accessed 2026-05-17.
4. IEC 61010-1:2010, *Safety requirements for electrical equipment for measurement, control, and laboratory use — Part 1: General requirements*. Geneva: IEC.
5. Surya Yantra. *Deployment Guide — DEPLOYMENT.md §8 Hardware Connectivity*. GitHub: ganeshgowri-ASA/surya-yantra, 2026.
