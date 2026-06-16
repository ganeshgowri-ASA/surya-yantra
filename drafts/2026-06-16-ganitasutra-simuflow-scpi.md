---
title: "Web-Based Block Diagram Simulation as SCPI Test Sequence Validator: GanitaSutra SimuFlow Applied to ESL-Solar 500 Electronic Load Control"
slug: ganitasutra-simuflow-scpi-validation
date: 2026-06-16
status: seed
week_angle: Tuesday/new-seed
keywords:
  - model-based design
  - SCPI
  - block diagram
  - simulation
  - SimuFlow
  - GanitaSutra
  - electronic load
  - PV testing
  - test automation
  - instrument control
description: >
  Proposes a model-based design workflow in which GanitaSutra's SimuFlow
  block diagram engine is used to simulate and validate ESL-Solar 500 SCPI
  command sequences before hardware integration in the Surya Yantra PV test
  system, reducing live-hardware iteration cycles.
target_journal: "IEEE Transactions on Instrumentation and Measurement OR Measurement (Elsevier)"
estimated_length_words: 6000
engineering_trigger: >
  GanitaSutra (ganeshgowri-ASA/GanitaSutra, TypeScript, last updated 2026-05-03)
  provides a MATLAB/Simulink-inspired SimuFlow block diagram engine with 21
  toolboxes, a CodePad editor, and PlotEngine. Surya Yantra's README documents
  11 ESL-Solar 500 SCPI commands forming a stateful protocol with timing
  dependencies (STEP × STEPT × baud rate). Drawing this as a SimuFlow state
  machine and simulating it catches timing violations before hardware is live.
related_code:
  - apps/web/lib/websocket-server.ts     # SCPI sampler loop (LISTFIRST/LISTNEXT)
  - apps/desktop/electron/ipc/           # serialport IPC bridge
  - README.md                            # §ESL-Solar 500 SCPI Commands table
related_repos:
  - ganeshgowri-ASA/GanitaSutra          # SimuFlow block diagram engine
blocking_gaps:
  - GanitaSutra SimuFlow JSON IR schema (not yet publicly documented)
  - Formal SCPI state machine spec for ESL-Solar 500 (ET SolarPower)
  - USB serial capture of actual ESL-Solar 500 command sequence for validation
  - packages/scpi-client/ (planned — issue #139 — currently missing)
---

# Seed / Research Narrative

## Hook

Before the first relay closure and 300 V live test, how do you know your SCPI
command sequence is correct? The traditional answer: run it on hardware, catch
the fault at the instrument response, iterate under live voltage. A model-based
alternative: draw the command sequence as a SimuFlow block diagram — explicitly
specifying state transitions, parameter dependencies, and timing constraints —
then simulate it in a browser. GanitaSutra provides the simulation engine;
Surya Yantra's ESL-Solar 500 SCPI driver is the hardware target.

---

## Engineering Link

**GanitaSutra** (ganeshgowri-ASA/GanitaSutra, TypeScript, 2 forks, 1 star,
last commit 2026-05-03) is a MATLAB/Simulink-inspired TypeScript web platform:
- **SimuFlow**: graphical block diagram editor with signal routing and 21
  built-in toolboxes (control, signal processing, linear algebra, etc.).
- **CodePad**: inline TypeScript/Python editor linked to simulation block outputs.
- **PlotEngine**: time-series and X-Y plot output for simulation results.

**Surya Yantra**'s ESL-Solar 500 SCPI command table (README.md) defines a
11-command stateful protocol:

| State | SCPI Command | Notes |
|-------|-------------|-------|
| Idle → Active | `SOUR ON` | Enable output |
| Active → CC/CV/CR | `SOUR:FUNC:MODE CC\|CV\|CR` | Mode select |
| Setup scan | `SOUR:MPPSCAN:START v` | Voltage start |
| Setup scan | `SOUR:MPPSCAN:STOP v` | Voltage stop |
| Setup scan | `SOUR:MPPSCAN:STEP v` | Step size |
| Setup scan | `SOUR:MPPSCAN:STEPT v` | Step dwell time |
| Trigger | `SOUR:MPPSCAN:EXEC` | Begin scan |
| Read (loop) | `MEAS:MPPSCAN:LISTFIRST?` | First result |
| Read (loop) | `MEAS:MPPSCAN:LISTNEXT?` | Subsequent → `END` |
| Real-time | `MEAS:ALL?` → `V;A;W` | Live point |
| Shutdown | `SOUR OFF` | Disable output |

The critical timing constraint: `STEPT` (dwell time per step, ms) × number
of steps must fit within the USB read buffer window at 9600 baud — an implicit
constraint not documented in the instrument manual.

---

## Proposed Research Questions

1. Can a SimuFlow block diagram fully specify the ESL-Solar 500 SCPI state
   machine, including all timing constraints and error-recovery branches?
2. Does simulation pre-validation reduce hardware integration time and catch
   timing violations (e.g., the 9600-baud USB bottleneck) before live testing?
3. Is the SimuFlow JSON IR sufficient to auto-generate a partial Node.js
   `serialport`-based SCPI driver skeleton (targeting `packages/scpi-client/`)?

---

## Preliminary Outline

### 1. Introduction
- Challenge: SCPI instruments have implicit state machines not fully documented
  in manuals — timing, mode lock-out, buffer overflow, error recovery.
- Prior art: LabVIEW dataflow (NI) — proprietary, Windows-only; PyVISA —
  Python script, no formal state diagram; IVI-COM driver framework — verbose,
  no simulation.
- Contribution: first use of an open-source, web-based block diagram engine
  (GanitaSutra SimuFlow) to formally specify, simulate, and partially generate
  a SCPI instrument driver.

### 2. ESL-Solar 500 SCPI State Machine

#### 2.1 States
- `IDLE`: output off, no mode active.
- `CC_ACTIVE / CV_ACTIVE / CR_ACTIVE`: constant-current/voltage/resistance.
- `SCAN_SETUP`: start/stop/step/stept parameters loaded, not yet triggered.
- `SCANNING`: `EXEC` sent; instrument sweeping voltage.
- `RESULT_READY`: scan complete; LISTFIRST?/LISTNEXT? drain the buffer.
- `MPP_TRACKING`: continuous MPPTRACK mode (separate state, not used in IV sweep).

#### 2.2 Timing model
```
T_sweep = N_steps × STEPT_ms + T_settle
T_read  = N_steps × (bytes_per_point / baud_rate)

At USB 9600 baud, ~50 bytes/point:
  T_read ≈ N_steps × 52 ms
  For N = 500 points → T_read ≈ 26 s (unacceptably slow)
  Minimum viable: N ≤ 100 at 9600 baud, or TCP:5025 at 10 Mbps
```
This matches the theoretical model in `2026-06-09-ws-iv-tracing-systems §4.1`,
confirming consistency across the two papers.

#### 2.3 SimuFlow block representation
- Each SCPI command → a Function Block with typed input (parameter value,
  trigger edge) and typed output (response string, status flag).
- State transitions → SimuFlow Switch/Selector blocks.
- Timing constraints → Delay blocks fed from a Clock source.
- Error branches → Conditional blocks with `fault` output port.

### 3. Simulation Results (TODO)
- Expected finding: at N = 500 steps, 9600-baud read time = 26 s → timing
  violation detected in simulation before any hardware interaction.
- Expected finding: TCP:5025 removes the bottleneck; recommended default.

### 4. Code Generation (TODO)
- Target: `packages/scpi-client/` (planned — issue #139).
- Approach: SimuFlow block diagram → JSON IR → Node.js `serialport` template.
- Generated skeleton: typed `sendCommand(cmd: ScpiCommand): Promise<string>`
  with built-in state guard (throws if called in wrong state).

### 5. Validation
- USB serial capture of actual ESL-Solar 500 handshake (blocking gap).
- Metric: SimuFlow timing prediction error vs measured dwell time (ms).

### 6. Discussion
#### 6.1 Generalisation
- Any SCPI instrument reachable via `serialport` or TCP:5025 can be modelled.
- Adapter shims for Keithley 2651A, Chroma 62000P are one-function overrides.

#### 6.2 Limitations
- SimuFlow is discrete-event; analogue effects (load transients, current
  settling, cable inductance) require SPICE co-simulation.
- Code generation produces a skeleton, not a complete driver; manual
  calibration of timing constants required.

#### 6.3 Link to GanitaSutra roadmap
- Hardware-in-the-loop (HIL) simulation is the natural next step: SimuFlow
  drives the real instrument via a serialport adapter block.

### 7. Conclusion
- SimuFlow block diagrams provide a lightweight, open-source, browser-accessible
  alternative to LabVIEW for SCPI instrument state machine specification.
- Simulation catches timing violations before live-hardware integration.
- Partial driver code generation reduces boilerplate for new instrument adapters.
- Surya Yantra / GanitaSutra integration is a reproducible open-source workflow
  for the PV test equipment community.

---

## References (seed — expand to 10+)

1. IVI Foundation (2023). *IVI-COM Instrument Driver Architecture Specification.*
   [ivifoundation.org](https://www.ivifoundation.org)
2. SCPI Consortium (1999). *Standard Commands for Programmable Instruments v1999.0.*
3. National Instruments (2022). *LabVIEW Dataflow Programming Model.*
   [ni.com/labview](https://www.ni.com/en/shop/labview.html)
4. *(TODO: Model-based design for test instrumentation — IEEE TIM reference)*
5. *(TODO: SCPI formal state machine — prior art search)*
6. *(TODO: GanitaSutra SimuFlow technical note — if published by ganeshgowri-ASA)*
7. *(TODO: Open-source SCPI driver frameworks comparison)*
8. *(TODO: Hardware-in-the-loop testing for power electronics — IEEE reference)*
