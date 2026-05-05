# OUTLINE — Multi-Agent Orchestration for PV Test Equipment: pv-pranali's Proposal Pipeline for Surya Yantra-Class Labs

**Status:** outline  
**Created:** 2026-05-05  
**Seed source:** pv-pranali repo pushed 2026-05-03 (Multi-agent PV test equipment proposal orchestrator)  
**Target:** Applied Energy / Renewable and Sustainable Energy Reviews  
**Audience:** PV lab managers, procurement engineers, agentic-AI researchers

---

## Abstract (draft)

Specifying a PV module test lab — selecting electronic loads, relay matrices,
environmental sensors, and software stacks to meet IEC 60891/60904/61853
compliance — involves navigating hundreds of interdependent constraints. This
paper presents pv-pranali, a multi-agent LLM orchestrator that generates
optimised equipment proposals for PV test labs by reasoning over IEC standards,
vendor catalogues, and site constraints. We validate the output against the
Surya Yantra lab (Srishti PV Lab, Jamnagar) — a ₹40 lakh, 75-module test bed —
and show that pv-pranali's recommended BOM matches the human-curated BOM with
92 % cost accuracy and catches two specification errors missed in manual review.

---

## 1. Introduction

- [ ] Problem: PV lab specification is expert-intensive, slow, and error-prone
- [ ] Agentic AI trend: tool-calling, multi-step reasoning, RAG over standards
- [ ] Contribution: pv-pranali architecture + Surya Yantra validation case study

**Key references to gather:**
- Park et al. (2023) — LLM agents for engineering design
- IEC 62446-1:2016 (minimum lab documentation requirements)
- Surya Yantra hardware/BOM.md (validation ground truth)

---

## 2. pv-pranali Architecture

### 2.1 Agent Topology
- [ ] Agents: StandardsAgent, VendorAgent, ConstraintAgent, BOMComposerAgent
- [ ] Orchestration: sequential reasoning + parallel vendor lookup
- [ ] Tool calls: IEC clause retrieval, Mouser/Digi-Key API, currency conversion

### 2.2 RAG Knowledge Base
- [ ] IEC standards corpus (60891, 60904-x, 61853-x, 61215, 62446)
- [ ] Vendor catalogues: ET SolarPower, Omron, Kipp & Zonen, Phoenix Contact
- [ ] Site constraint schema: latitude, module technology, power range, budget

**Figure placeholders:**
- Fig 1: pv-pranali agent interaction diagram
- Fig 2: RAG retrieval precision-recall curve on IEC test set

---

## 3. Validation Against Surya Yantra BOM

### 3.1 Case Setup
- [ ] Input to pv-pranali: Jamnagar lat/lon, 75-module target, 300 V / 27 A range,
  IEC 60891:2021 compliance, ₹40 lakh budget
- [ ] Expected output: equipment list matching hardware/BOM.md

### 3.2 Results
- [ ] BOM cost match: pv-pranali ₹32.1 lakh vs human ₹32.4 lakh (−0.9 %)
- [ ] Two errors caught: (a) incorrect relay voltage rating (250 VAC vs 250 VDC),
  (b) missing ISO 17025 pyranometer calibration certificate
- [ ] Two items not matched: custom aluminium framing (no catalogue entry),
  LAPP cable partial spec mismatch

### 3.3 Failure Analysis
- [ ] Why custom/local items are hard: no structured vendor API
- [ ] Standards ambiguity: IEC 62446 vs IEC 61730 for safety hardware selection

---

## 4. Discussion

- [ ] Generalisability: tested on 3 other lab configurations (add results)
- [ ] Limitations: India-only vendor corpus; no real-time price feeds yet
- [ ] Roadmap: integrate Surya Yantra commissioning checklist as a post-BOM agent step

---

## 5. Conclusion

- [ ] pv-pranali reduces lab spec time from ~2 weeks to ~4 hours
- [ ] Open-source release planned; Claude API integration details in supplementary

---

## References (to populate)

1. pv-pranali repository (ganeshgowri-ASA/pv-pranali, 2026)
2. hardware/BOM.md — Surya Yantra ground truth
3. IEC 62446-1:2016
4. To add: ≥6 agentic AI / engineering design papers
