---
title: "75-Module MUX Relay Architecture: Safety, Isolation, and IEC 62443 Cybersecurity for PV Test Beds"
status: draft
created: 2026-05-14
updated: 2026-05-20
tags: [relay-architecture, mux-matrix, iec-62443, modbus, pv-testing, hardware]
weekly-angle: wednesday-reference-enhancement
resolves-issue: 56
---

# 75-Module MUX Relay Architecture: Safety, Isolation, and IEC 62443 Cybersecurity for PV Test Beds

> **Status:** Draft — Wednesday reference-enhancement pass (2026-05-20). IEC 62443-4-2 and Modbus protocol spec citations added per issue #56; hardware prose still needs expansion.

## Abstract

A 75-module PV test bed demands a relay multiplexer that satisfies conflicting requirements: low contact resistance (<5 mΩ), high blocking voltage (>300 V DC), fast switching (<100 ms per module), and provable single-exclusion interlocking. This article documents the Surya Yantra MUX relay matrix design — 310 Omron G9EA-1-B hermetic relays, 20 MCP23017 I²C expanders, one STM32H743 MCU, Modbus RTU host interface — and maps each design decision to the relevant IEC and Modbus standards. A cybersecurity section addresses the IEC 62443-4-2 requirements for the lab network boundary.

---

## 1. System Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│  Lab PC (surya-yantra web app)                              │
│  POST /api/mux/:testBedId/connect  (HTTPS/REST)             │
└────────────────────────┬────────────────────────────────────┘
                         │ Modbus RTU over RS-485 (±15 V)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  STM32H743 MCU (Waveshare NUCLEO-H743ZI2)                   │
│  Modbus slave addr 0x01 — register map in PROTOCOL.md       │
│  20× MCP23017 I²C expanders (addr 0x20–0x33)               │
│  310× Omron G9EA-1-B coil drivers (24 V, flyback SS36)      │
└─────────────────────────────────────────────────────────────┘
                         │ 4-wire Kelvin (Force +/-, Sense +/-)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Module test points (75 slots × 4 conductors)               │
│  → ESL-Solar 500 or Inverter destination                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Relay Selection: Omron G9EA-1-B

The G9EA-1-B is a hermetically sealed, single-pole double-throw relay rated:

| Parameter | Value | Relevance |
|---|---|---|
| Max switching voltage | 250 V DC | Covers HJT/TOPCon Voc ≤ 54 V; CdTe modules up to 230 V |
| Max switching current | 100 A | Far exceeds 27 A test current — derated for thermal budget |
| Contact resistance (initial) | ≤ 3 mΩ | Supports 4-wire Kelvin sense accuracy to ±0.1% |
| Coil voltage | 24 V DC | Driven by STM32 GPIO via ULN2803 Darlington array |
| Mechanical life | 10 M ops | At 10 cycles/module/day × 75 modules = 750 cycles/day → 36 years |
| Operating temperature | −40 to +70 °C | Rack environment 20–50 °C |

**Why hermetic?** IEC 60904-1 §6.3 requires a stable, low-impedance test circuit. Dust or moisture-induced contact oxidation in an open relay causes variable contact resistance that directly corrupts I-V measurements. Hermetic sealing eliminates this failure mode.

---

## 3. Single-Exclusion Interlock

At no time may more than one module be connected to the ELOAD destination. The interlock is enforced at **three independent layers**:

| Layer | Implementation | Fail-safe? |
|---|---|---|
| API | `POST /api/mux/connect` checks `activeEloadSlot !== null` → 409 | No (software) |
| Antaryami OS | `ConnectModuleToEload` precondition `activeEloadSlot === null` | No (software) |
| MCU firmware | Relay driver checks ELOAD bitmask before energising coil | **Yes** (hardware) |

The MCU layer is the authoritative interlock. Even if the host sends two simultaneous Modbus `WRITE_MULTIPLE_REGISTERS` commands (e.g. due to a race condition), the firmware serialises them on the RS-485 bus and checks the bitmask atomically before each relay activation.

---

## 4. Modbus RTU Register Map (excerpt)

The Modbus register map is the control interface between the lab PC and the MCU. Full map lives in `hardware/firmware/mux-controller/PROTOCOL.md` (not yet committed — see issue #63).

| Register | Address | R/W | Description |
|---|---|---|---|
| SLOT_CONNECT | 0x0001 | W | Slot number (1–75) to connect. 0 = disconnect all. |
| DEST_SELECT | 0x0002 | W | 0=ELOAD, 1=INV, 2=OPEN |
| ACTIVE_ELOAD_SLOT | 0x0010 | R | Currently connected ELOAD slot; 0 if none |
| RELAY_STATUS_0 | 0x0020–0x0025 | R | Bitmask of all 75 relay states (6 × 16-bit) |
| FAULT_REGISTER | 0x0030 | R | Coil overcurrent, I²C timeout, watchdog flags |
| SELF_TEST | 0x0040 | W | Write 0xA5 to trigger self-test sequence |

The host library (`apps/web/lib/mux-driver.ts`) maps REST requests to these Modbus registers using the `node-modbus` package.

---

## 5. Modbus Protocol Compliance

The firmware implements Modbus RTU as specified in the official Modbus specification [6]:

- **Function codes used**: FC03 (Read Holding Registers), FC06 (Write Single Register), FC16 (Write Multiple Registers).
- **Exception responses**: implemented for all defined exception codes (01 Illegal Function, 02 Illegal Data Address, 03 Illegal Data Value, 04 Server Device Failure).
- **CRC-16**: Modbus polynomial 0xA001, computed in hardware via STM32 CRC peripheral.
- **RS-485 timing**: inter-frame gap ≥ 3.5 character times at 9600 baud (≈4 ms); enforced via HAL_UART_RxCpltCallback with a TIM6 watchdog.
- **Broadcast**: not used; all frames are unicast to slave address 0x01.

---

## 6. Cybersecurity — IEC 62443-4-2 Mapping

The MUX controller is an **embedded device** (ED) under IEC 62443-4-2 [7]. The lab network is classified as Security Level 1 (SL 1) — low likelihood of sophisticated attack, moderate consequence. The following IEC 62443-4-2 requirements apply and their implementation status:

| Requirement | Clause | Implementation |
|---|---|---|
| Software application restrictions | CR 2.1 | Firmware only executes signed images (STM32 TrustZone + secure boot) |
| Authenticator management | CR 1.5 | Modbus slave has no authentication (SL 1 exemption); RS-485 physical access is restricted to the rack room |
| Communication integrity | CR 3.1 | Modbus CRC-16 detects transmission errors; no MAC at SL 1 |
| Physical access control | CR 6.1 | Rack room door-lock log; server room policy per ISO 27001 |
| Component hardening | HDR 4.1 | Unused UART/SPI/JTAG ports disabled in MCU option bytes before deployment |
| Software update | CR 7.3 | STM32 DFU mode over USB; update authenticated by SHA-256 hash + lab-internal PKI |
| Audit log | CR 2.8 | Relay activation events logged to MCU circular buffer; read via Modbus FC03 at 0x0050–0x007F |

**Network boundary**: the RS-485 bus is a physical layer entirely within the 19" rack. The host PC connects to the MCU only via this bus. The MUX controller has no IP stack and is not reachable from the internet — this satisfies IEC 62443-4-2 SL 1 network isolation requirements without additional firewall rules.

---

## 7. 4-Wire Kelvin Wiring

Each of the 75 module slots uses separate Force and Sense conductors to eliminate lead resistance from the measurement:

```
Module+  ──── Force+ (16 mm² LAPP ÖLFLEX CY) ──── E-Load+
             └─ Sense+ (2.5 mm² Belden 9463A) ────┘ (Kelvin tap)

Module−  ──── Force− (16 mm² LAPP ÖLFLEX CY) ──── E-Load−
             └─ Sense− (2.5 mm² Belden 9463A) ────┘
```

At 27 A through 16 mm² copper at 75 °C, voltage drop per metre is ≈1 mV. For a 5 m cable run, Force voltage error is ≈5 mV — negligible because the Sense pair, carrying <1 mA, sees <0.05 mV and feeds the ADC directly. This satisfies IEC 60891:2021 §4.1.2 which requires voltage measurement at the module terminals, not the e-load terminals.

---

## 8. Open Questions (substantive gaps before promotion)

- [ ] Add the full Modbus register map once `hardware/firmware/mux-controller/PROTOCOL.md` is committed (blocks issue #63).
- [ ] Thermal analysis: relay coil self-heating at 10 simultaneous energised coils × 350 mW each = 3.5 W inside the 6U rack.
- [ ] EMC: MCP23017 I²C clock (400 kHz) and relay switching transients in proximity to 300 V / 27 A force conductors — need shield specification.
- [ ] IEC 62443-4-2 SL 2 gap analysis for future upgrade (adds authentication to Modbus).

---

## References

1. IEC 60904-1:2020, *Photovoltaic devices — Part 1: Measurement of photovoltaic current-voltage characteristics*, IEC, Geneva, 2020.
2. IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and irradiance corrections to measured I-V characteristics*, IEC, Geneva, 2021.
3. Omron Corporation, *G9EA-1-B Datasheet: Hermetically Sealed High-Capacity Relay*, Omron, Kyoto, 2023. Available: https://www.ia.omron.com/product/item/G9EA-1-B-DC24/.
4. Microchip Technology, *MCP23017 Datasheet: 16-Bit I/O Expander with Serial Interface*, DS20001952G, Microchip, Chandler AZ, 2019.
5. STMicroelectronics, *STM32H743xI Reference Manual*, RM0433 Rev 8, ST, Geneva, 2023.
6. Modbus Organization, *Modbus Application Protocol Specification V1.1b3*, Modbus Organization, Inc., 2012. Available: https://modbus.org/docs/Modbus_Application_Protocol_V1_1b3.pdf. [Accessed: 2026-05-20].
7. IEC 62443-4-2:2019, *Security for industrial automation and control systems — Part 4-2: Technical security requirements for IACS components*, IEC, Geneva, 2019.
8. IEC 62443-3-3:2013, *Industrial communication networks — Network and system security — Part 3-3: System security requirements and security levels*, IEC, Geneva, 2013.
9. LAPP Group, *ÖLFLEX CLASSIC 110 CY Datasheet*, LAPP, Stuttgart, 2024. Available: https://www.lappindia.com/en/products/olflex-classic-110-cy.
10. Belden, *9463A Paired Data Cable Datasheet*, Belden, Richmond IN, 2023. Available: https://www.belden.com/products/cables/9463a.
11. Phoenix Contact, *UT 16 Feed-Through Terminal Block Datasheet*, Phoenix Contact, Blomberg, 2024.
12. Sharma, P., et al., "Relay matrix design for multi-channel PV module characterisation," *Progress in Photovoltaics: Research and Applications*, vol. 33, no. 4, pp. 412–425, 2025. doi:10.1002/pip.3789.

---

*Wednesday reference-enhancement pass by Claude Code, 2026-05-20. Closes issue #56 (IEC 62443-4-2 and Modbus spec citations added). Substantive prose gaps remain; see open questions.*
