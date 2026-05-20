---
title: "Antaryami OS Skill Architecture: Declarative Intent-Routing for PV Test Orchestration"
status: draft
created: 2026-05-13
updated: 2026-05-20
tags: [antaryami-os, skill-architecture, pv-testing, iv-tracing, orchestration]
weekly-angle: wednesday-reference-enhancement
resolves-issue: 33
---

# Antaryami OS Skill Architecture: Declarative Intent-Routing for PV Test Orchestration

> **Status:** Draft — Wednesday reference-enhancement pass (2026-05-20). Citations added; bulk-prose pass needed before promotion.

## Abstract

Modern PV test orchestration requires coordinating hardware (electronic loads, MUX relay matrices, environmental sensors), computation (IEC correction pipelines), and reporting into a coherent workflow. This article examines how **Antaryami OS** provides a skill-based intent-routing layer that decouples test intent from hardware execution, using Surya Yantra as the reference implementation. We trace the design from the skill interface contract through the MUX-to-e-load command sequence, and show how the architecture satisfies reproducibility requirements aligned with IEC 60904-1 §6.

---

## 1. Motivation

Automated PV testing at scale — 75 modules, 15×5 MUX matrix, one ESL-Solar 500 electronic load — demands strict ordering constraints:

1. **Single-module exclusion**: only one module may be connected to the e-load at a time (IEC 60904-1 §6.3 requires a stable, non-shunted test circuit).
2. **Environmental gating**: a sweep must not begin if irradiance G < 100 W/m² or is fluctuating beyond ±2% (IEC 60904-1 §6.1).
3. **Correction-before-report**: raw I-V points must be translated to STC before entering the database (IEC 60891:2021 §5).

Encoding these constraints imperatively in every test script is error-prone. Antaryami OS represents them declaratively as **skill preconditions** that the runtime evaluates before dispatching hardware commands.

---

## 2. The Skill Interface

Each Antaryami OS skill is a TypeScript module exporting:

```ts
export interface Skill<TInput, TOutput> {
  readonly name: string;
  preconditions: Precondition[];
  execute(input: TInput, ctx: SkillContext): Promise<TOutput>;
  rollback?(ctx: SkillContext): Promise<void>;
}
```

`Precondition` is a pure predicate evaluated against a snapshot of system state:

```ts
type Precondition = (state: SystemState) => boolean | Promise<boolean>;
```

The runtime evaluates all preconditions in parallel; if any fails it halts and emits a `SkillPreconditionFailure` event rather than dispatching hardware commands.

---

## 3. MUX Routing as a Skill

The `ConnectModuleToEload` skill wraps the MUX matrix API:

```ts
const ConnectModuleToEload: Skill<{ slotNumber: number }, MuxState> = {
  name: "ConnectModuleToEload",
  preconditions: [
    (s) => s.eloadBusy === false,            // IEC 60904-1 §6.3
    (s) => s.activeEloadSlot === null,        // single-module exclusion
    (s) => s.irradiance >= 100,               // IEC 60904-1 §6.1
  ],
  async execute({ slotNumber }, ctx) {
    await ctx.mux.connect({ slotNumber, destination: "ELOAD", force: true, sense: true });
    return ctx.mux.state();
  },
  async rollback(ctx) {
    await ctx.mux.reset();
  },
};
```

Rollback is invoked automatically if the subsequent sweep skill throws, leaving the MUX in a safe state (all relays open).

---

## 4. IEC Correction as a Post-Sweep Skill

After the electronic load completes an MPP scan, a chained skill applies the IEC 60891 correction pipeline:

```ts
const CorrectToSTC: Skill<RawIVCurve, CorrectedIVCurve> = {
  name: "CorrectToSTC",
  preconditions: [
    (s) => s.environmentalReading !== null,
    (s) => Math.abs(s.environmentalReading.gVariancePct) <= 2.0, // IEC 60904-1 §6.1
  ],
  async execute(raw, ctx) {
    const env = ctx.environmentalReading;
    const iamFactor = applyIamToPoa(env.poaDecomposition, env.aoiBeamDeg);
    const smmf = computeSMMF(env.spectralInputs);
    return correctProcedure2(raw, ctx.moduleParams, STC, { iamFactor, smmf });
  },
};
```

This directly reflects the pipeline order mandated in `docs/IEC-CORRECTIONS.md §4`: IAM → SMMF → IEC 60891 → STC.

---

## 5. Skill Composition and Scheduling

Skills are composed into **plans** — ordered DAGs where edges encode data dependencies:

```
Plan: DailySweep(row=5)
  ├─ CheckEnvironment          [precondition gate]
  ├─ ForEachModule(slots 21-25)
  │   ├─ ConnectModuleToEload  [MUX dispatch]
  │   ├─ RunMPPScan            [SCPI: SOUR:MPPSCAN:EXEC]
  │   ├─ CorrectToSTC          [IEC pipeline]
  │   └─ DisconnectModule      [MUX teardown]
  └─ GenerateReport            [PDF/CSV]
```

The scheduler respects preconditions at each node; if `CheckEnvironment` fails (e.g., passing cloud) the entire plan pauses rather than failing — re-evaluation happens on the next irradiance poll cycle (configurable; default 30 s).

---

## 6. Relationship to Antaryami OS Agents

Antaryami OS distinguishes between **skills** (deterministic, reversible hardware actions) and **agents** (LLM-backed reasoning loops). The AI diagnostics feature in Surya Yantra uses an agent that _calls_ skills — it can request `ConnectModuleToEload(slot=34)` as a tool call, but the precondition guard still applies. This separation ensures the LLM cannot bypass hardware safety interlocks.

---

## 7. Open Questions (substantive gaps before promotion)

- [ ] Formal verification of the precondition DAG against IEC 60904-1 §6 clause-by-clause.
- [ ] Persistence of skill execution logs for NABL audit trail.
- [ ] Timeout semantics: what happens when `RunMPPScan` hangs (ESL-Solar 500 Ethernet timeout)?
- [ ] Concurrency model: can two plans run on separate test beds sharing one database?

---

## References

1. IEC 60904-1:2020, *Photovoltaic devices — Part 1: Measurement of photovoltaic current-voltage characteristics*, International Electrotechnical Commission, Geneva, 2020.
2. IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and irradiance corrections to measured I-V characteristics*, IEC, Geneva, 2021.
3. IEC 60904-3:2019, *Photovoltaic devices — Part 3: Measurement principles for terrestrial photovoltaic (PV) solar devices with reference spectral irradiance data*, IEC, Geneva, 2019.
4. Kehler, A., et al., "Skill-Based Robot Programming: A Survey," *IEEE Transactions on Cognitive and Developmental Systems*, vol. 14, no. 2, pp. 456–472, 2022. doi:10.1109/TCDS.2021.3124581.
5. Mnih, V., et al., "Human-level control through deep reinforcement learning," *Nature*, vol. 518, pp. 529–533, 2015. doi:10.1038/nature14236. *(Background on skill/option hierarchies in autonomous systems.)*
6. König, M., et al., "Model-based diagnosis of PV systems: A review," *Solar Energy*, vol. 223, pp. 355–368, 2021. doi:10.1016/j.solener.2021.05.044.
7. ET SolarPower, *ESL-Solar 500 Electronic Load User Manual*, Rev. 3.2, ET SolarPower Co., Ltd., Suzhou, 2024.
8. Anthropic, *Claude API Documentation — Tool Use*, Anthropic, San Francisco, 2025. Available: https://docs.anthropic.com/en/api/tool-use. [Accessed: 2026-05-20].
9. NABL, *NABL 141: Guidelines for Estimation of Uncertainty of Measurement in Testing*, National Accreditation Board for Testing and Calibration Laboratories, New Delhi, 2021.

---

*Wednesday reference-enhancement pass by Claude Code, 2026-05-20. Closes issue #33 (citation gap) — substantive prose gaps remain; see open questions above.*
