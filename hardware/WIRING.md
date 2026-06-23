# Surya Yantra — Wiring Guide

> Refer to `docs/HARDWARE-SETUP.md` for the full commissioning procedure. This document captures the cable routing rules and connection conventions.

---

## 1. Cable Types

| Role | Cable | Cross-section | Colour code | Connector |
|------|-------|--------------|-------------|-----------|
| Force + | LAPP ÖLFLEX CLASSIC 110 CY | 16 mm² | Red | MC4-EVO2 + Ring lug M8 |
| Force − | LAPP ÖLFLEX CLASSIC 110 CY | 16 mm² | Black | MC4-EVO2 + Ring lug M8 |
| Sense + | Belden 9463A twisted-pair shielded | 2.5 mm² | Blue | MC4-EVO2 (sense pin) |
| Sense − | Belden 9463A twisted-pair shielded | 2.5 mm² | White | MC4-EVO2 (sense pin) |

---

## 2. 4-Wire Kelvin Connection (per module)

```
PV Module
  [+] ──── Force+ (16 mm² red) ──── MUX relay Force+ bus ──── E-Load Force+
  [+] ──── Sense+ (2.5 mm² blue) ── MUX relay Sense+ bus ──── E-Load Sense+
  [-] ──── Sense− (2.5 mm² white) ─ MUX relay Sense− bus ──── E-Load Sense−
  [-] ──── Force− (16 mm² black) ── MUX relay Force− bus ──── E-Load Force−
```

MC4 Y-splitter (Staubli MC4-EVO2) at module junction:
- **Male MC4** on Force pair: connects to module MC4 positive/negative.
- **Female MC4** on Sense pair: piggybacks at Y-splitter junction point.

---

## 3. MUX Relay Matrix Wiring

- **310 relays** (Omron G9EA-1-B, 100 A, 250 VDC) mounted on DIN rails in Hammond 6U chassis.
- **75 channels** (15 rows × 5 columns): each channel uses 4 relays (Force+, Force−, Sense+, Sense−).
- **10 spare relays** (rows 16-17, partial).
- **Bus bars**: Force+ / Force− use 16 mm² copper bus bars rated 200 A continuous. Sense+ / Sense− use 2.5 mm² terminal strips.

### DIN Rail Assignment

| DIN Rail | Rows | Relay numbers | Purpose |
|----------|------|--------------|---------|
| Rail 1 | 1–4 | R001–R064 | Force+ channels 1–16 |
| Rail 2 | 5–8 | R065–R128 | Force− channels 1–16 |
| Rail 3 | 9–12 | R129–R192 | Sense+ channels 1–16 |
| Rail 4 | 13–15 | R193–R256 | Sense− channels 1–16 |
| Rail 5 | 16–17 | R257–R310 | Force+/− channels 17–25 + spares |

> **TODO:** Verify DIN rail assignment with hardware team during commissioning. Relay numbering convention: R001 = Row 1 Col 1, R005 = Row 1 Col 5, R006 = Row 2 Col 1.

---

## 4. Cable Tray Routing

- **Left tray** (looking from front): Force cables (16 mm² red/black) — separated from Sense by ≥ 50 mm.
- **Right tray**: Sense cables (2.5 mm² blue/white) + STM32 MCU signal wiring.
- **Grounding**: Shield of Belden 9463A connected to chassis earth at rack end only (not at module end) to avoid ground loops.

---

## 5. E-Load (ESL-Solar 500) Terminal Connections

| Terminal | Connects to | Note |
|----------|-------------|------|
| FORCE + | MUX Force+ bus bar | 50 A rated terminal |
| FORCE − | MUX Force− bus bar | 50 A rated terminal |
| SENSE + | MUX Sense+ bus bar | 4-wire Kelvin |
| SENSE − | MUX Sense− bus bar | 4-wire Kelvin |
| RS232/USB | Lab PC COM port | SCPI control |
| Ethernet | Lab network switch | Optional SCPI over TCP |

---

## 6. Safety Notes

- **Isolation**: De-energise all modules before connecting or disconnecting relay wiring.
- **Fusing**: Each Force+ line fused at 30 A (automotive blade fuse, ATO series) at DIN rail entry.
- **Polarity**: Double-check Force/Sense polarity before first relay self-test (`POST /api/mux/self-test`).
- **300 VDC maximum**: All cables, terminals, and relay contacts rated ≥ 300 VDC. First Solar CdTe modules may reach 150 Voc — still within spec.

---

## 7. Further Reading

- `hardware/BOM.md` — purchase links and specs for all items above.
- `hardware/schematics/` — SVG wiring diagrams (planned, see `hardware/schematics/README.md`).
- `docs/HARDWARE-SETUP.md` — commissioning procedure, Sections 4–5.
