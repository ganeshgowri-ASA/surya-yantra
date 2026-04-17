# Hardware Setup Guide

Step-by-step instructions for assembling the Srishti PV Lab 75-module test
bed: ESL-Solar 500 electronic load, MUX relay matrix, 4-wire Kelvin sensing,
environmental sensors, and the rack that houses it all.

For the complete parts list and India purchase links, see
[`../hardware/BOM.md`](../hardware/BOM.md).

---

## 1. System Block Diagram

```
  ┌──────────────────┐        ┌────────────────────────┐
  │  75-module array │  ───►  │ 4-wire Kelvin harness  │
  │  (15 × 5 layout) │        │  Force+/-  Sense+/-    │
  └──────────────────┘        └───────────┬────────────┘
                                          │
                                          ▼
                              ┌────────────────────────┐
                              │   300-relay MUX matrix │
                              │   75 × (4-wire lanes)  │
                              └───────┬────────────────┘
                                      │ one module
                                      ▼
                              ┌────────────────────────┐
                              │  ESL-Solar 500 e-load  │
                              │  0-300 V / 0-27 A      │
                              └───────┬────────────────┘
                                      │ SCPI (USB/Ether)
                                      ▼
                              ┌────────────────────────┐
                              │  Lab PC (Electron app) │
                              │      or Vercel relay   │
                              └────────────────────────┘

  Environmental sensors (G, Tcell, Tamb, wind, AOI)
          └─► Modbus RTU → USB-RS485 → PC
```

---

## 2. Rack & Power

### 2.1 Rack specification

* 19" 36U standing rack with lockable front glass door and rear cable-entry
  brushed panel.
* Rated at **4000 W** continuous cooling with dual 230 mm fans.
* Earth-bonded copper busbar along the full rear height (minimum 25 × 3 mm).

### 2.2 Rack unit layout (top → bottom)

| U      | Item                              |
| ------ | --------------------------------- |
| 1U     | Cable manager                     |
| 2U     | ESL-Solar 500 electronic load     |
| 1U     | Cable manager                     |
| 6U     | MUX relay matrix chassis (custom) |
| 1U     | Fieldbus isolator / surge arrestor|
| 2U     | KVM + 19" 15" display             |
| 1U     | Lab PC shelf (Intel NUC 13 Pro)   |
| 1U     | 8-port Ethernet switch (managed)  |
| 1U     | 12 V / 24 V DC power supplies     |
| 2U     | Online UPS (3 kVA)                |
| remain | Cable trays + patch panels        |

### 2.3 Input power

* **230 V AC, 50 Hz**, dedicated 20 A MCB circuit from the lab distribution
  board.
* Surge protection: Type-2 SPD at the rack inlet, 40 kA clamp, Iₙ = 20 kA.
* Residual-current device (RCD) 30 mA upstream — **mandatory** per IEC 61010-1.
* Ground impedance ≤ 1 Ω to the building earth pit.

---

## 3. ESL-Solar 500 — Electronic Load

### 3.1 Unboxing & rack mounting

1. Use front rack ears from ET SolarPower's 2U kit.
2. Leave ≥ 50 mm air gap at the rear exhaust.
3. Connect the IEC C14 power cord last.

### 3.2 DC terminals

| Terminal | Wire           | Torque  | Notes                          |
| -------- | -------------- | ------- | ------------------------------ |
| Force +  | 16 mm² ferrule | 3.5 Nm  | Red. To MUX common bus.        |
| Force −  | 16 mm² ferrule | 3.5 Nm  | Black.                         |
| Sense +  | 2.5 mm²        | 0.6 Nm  | Shielded twisted pair. Red.    |
| Sense −  | 2.5 mm²        | 0.6 Nm  | Shielded twisted pair. Black.  |

Use welding-cable-grade copper for Force lines (300 V / 30 A rating).

### 3.3 Communication

* **USB (default)** — `/dev/ttyUSB0` on Linux, `COMx` on Windows, 9600 baud,
  SCPI protocol.
* **Ethernet (optional)** — static IP `192.168.1.40`, raw TCP port 5025
  (LXI standard for SCPI).
* **RS-232** — only for legacy integration; use a USB-RS232 FTDI adapter.

Validate with:

```bash
echo "*IDN?" | socat -t5 - /dev/ttyUSB0,b9600,raw,echo=0
# expected: "ET SolarPower,ESL-Solar 500,SN123456,FW1.12"
```

---

## 4. MUX Relay Matrix

### 4.1 Overview

* **300 SPDT power relays** (75 modules × 4 lanes).
* Each lane switches independently; only the ELOAD destination is
  interlocked so that **at most one module is connected to the load at a
  time** (enforced in firmware and re-checked server-side).
* Relays: **Omron G9EA-1-B 100 A**, 250 VDC/AC rated, hermetically sealed.

### 4.2 Control architecture

```
Lab PC ──USB── Modbus RTU ──► MUX controller (STM32H7) ──►
             I²C I/O expanders (MCP23017, 18×) ──► relay coils (24 V DC)
```

The controller firmware lives in `hardware/firmware/mux-controller/` (not in
this documentation repo yet).

### 4.3 Wiring terminal blocks

* **Phoenix Contact UT 16-1P** for Force lanes (75 × 2 = 150 connections).
* **Phoenix Contact UT 2.5-1P** for Sense lanes.
* Shield each Sense pair to the rack busbar at the MUX end only.

### 4.4 Relay health self-test

Run `POST /api/mux/:bedId/selftest`. The firmware cycles every relay twice
and reports coil continuity and contact resistance (< 5 mΩ OK, 5–20 mΩ
marginal, > 20 mΩ fail).

---

## 5. 4-Wire Kelvin Harness

Use 4-wire (Kelvin) sensing so the voltage drop along the Force wires does
not corrupt the Voc measurement.

```
Module  +  ────► Force+ (16 mm²) ────► MUX ────► ESL Force+
        │                             ▲
        └────── Sense+ (2.5 mm², shielded) ──┘
Module  −  ────► Force−                ▲
        │                             │
        └────── Sense− (shielded)     │
```

Recommended cable:

* **Force**: LAPP ÖLFLEX CLASSIC 110 CY 2×16 mm² (shielded).
* **Sense**: Belden 9463A (one twisted pair, foil + braid shield).

Terminate at the module junction box with MC4-compatible crimp contacts,
not spade lugs. Force and Sense share the same MC4 connector body via
a Y-splitter at the module.

---

## 6. Environmental Sensor Set

| Sensor                 | Make/Model                  | Interface             |
| ---------------------- | --------------------------- | --------------------- |
| Pyranometer (G_POA)    | Kipp & Zonen SMP10          | Modbus RTU / RS-485   |
| Reference PV cell      | IMT Si-RS485TC-T-MB         | Modbus RTU / RS-485   |
| Cell temperature (×4)  | Pt-100 class A + MAX31865   | SPI → MCU             |
| Ambient temperature    | Sensirion SHT45             | I²C → MCU             |
| Wind speed/direction   | Davis 6410                  | Pulse + 0-5 V         |
| Spectroradiometer      | Apogee SP-421 + SP-715      | USB                   |
| Sun tracker (AOI calc) | computed from GPS + RTC     | software only         |

All Modbus sensors share one RS-485 bus (A/B pair, 120 Ω termination, 32
devices maximum). Use a CP2102 USB-RS485 adapter for the PC endpoint.

---

## 7. Commissioning checklist

- [ ] Rack is earth-bonded and SPD is installed.
- [ ] All Force lines meet the torque spec (torque-wrench stamp applied).
- [ ] All Sense lines are shielded and terminated at one end only.
- [ ] ESL-Solar 500 firmware is ≥ 1.12.
- [ ] MUX controller self-test shows 300 / 300 relays PASS.
- [ ] Pyranometer tilt matches the array tilt within ±0.5°.
- [ ] RTC on the lab PC is synced via NTP (`chrony` or `systemd-timesyncd`).
- [ ] GPS antenna has clear sky view (for solar position calc).
- [ ] UPS runs ≥ 15 minutes under full rack load.
- [ ] Emergency stop latches and trips all DC + AC contactors.

---

## 8. Safety

* **DC is lethal.** The array can reach > 250 V open-circuit even in partial
  sun. Always short the array's DC disconnect before touching the Force
  bus.
* **Arcing hazard.** The MUX relays are rated for up to 30 A DC. Never hot-
  swap under load — the firmware should always command `SOUR OFF` before
  any relay transition.
* **Heat.** At full load the ESL dissipates ~500 W. Keep at least 300 mm
  clear space in front of its intake grille.
* **PPE.** Category 2 arc-rated gloves and face shield for any work inside
  the MUX chassis with mains power present.

---

## 9. Further reading

* ESL-Solar 500 User Manual (PDF distributed with the unit).
* IEC 62446-1:2016 *Grid-connected PV systems — Minimum requirements for
  system documentation, commissioning tests, and inspection.*
* IEC 61730-1/2:2023 *PV module safety qualification.*
* IEEE 1547:2018 *Standard for Interconnecting Distributed Resources.*
