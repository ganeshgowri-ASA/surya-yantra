# Article Seed: A Sovereign Open-Source Solar PV Testing Ecosystem for Emerging Markets — Surya Yantra, SolarLabX, and the Path to NABL Accreditation

**Status**: seed  
**Target venue**: Solar Energy (Elsevier) — ISSN 0038-092X  
**Estimated length**: 8,000–10,000 words  
**Created**: 2026-06-29 (Sunday roadmap pass)

---

## Abstract (draft)

Emerging solar markets face a compound challenge: rapid PV capacity addition demands high-throughput, accreditable module testing, yet commercial laboratory information management systems (LIMS) are expensive, opaque, and poorly adapted to local regulatory requirements (NABL, BIS). We present a vertically integrated, open-source PV testing ecosystem comprising four inter-operating platforms developed at Srishti PV Lab, Jamnagar: (1) **Surya Yantra** — automated IV curve tracer with IEC 60891:2021 corrections; (2) **SolarLabX** — LIMS/QMS aligned to ISO 17025 and NABL 141; (3) **antaryami-os** — enterprise AI operating system providing fault-diagnosis and SOP generation; and (4) **ShilpaSutra** — AI-powered CAD/CFD for hardware design. The ecosystem runs entirely on commodity cloud infrastructure (Vercel, PostgreSQL) with a hybrid local relay for hardware I/O, eliminating proprietary software costs estimated at > ₹30 lakh/year for a typical Indian PV test lab. We describe the architecture, inter-service API contracts, and the road to NABL accreditation.

**Keywords**: photovoltaic testing, LIMS, ISO 17025, NABL, open source, India, IEC 60891, AI diagnostics

---

## 1. Introduction

India added 24 GW of solar capacity in FY2025–26, driving demand for accredited PV module testing. NABL-accredited labs must demonstrate ISO 17025:2017 compliance: documented test methods, calibrated instruments, uncertainty budgets, and auditable records. Commercial LIMS solutions (Laboratory Systems Europe, StarLIMS, LabVantage) range from ₹15–50 lakh in licensing alone, with annual maintenance at 20 % of license value.

The open-source ecosystem described here covers the full testing lifecycle:

```
Hardware design  →  IV measurement  →  IEC correction  →  LIMS record  →  AI review  →  Report
(ShilpaSutra)       (Surya Yantra)     (iec60891.ts)      (SolarLabX)    (antaryami)    (PDF/XLSX)
```

### 1.1 Research context

> **TODO**: cite 2–3 prior open-source LIMS for solar testing (e.g., openLIMS, Bika Open Source LIMS). Identify gap for IEC-specific workflows and Indian regulatory alignment.

---

## 2. System Architecture

### 2.1 Surya Yantra — IV tracer

The IV tracer communicates with the ESL-Solar 500 electronic load (0–300 V / 0–27 A) via SCPI over USB or Ethernet. A 300-relay MUX matrix (75 × 4-wire Kelvin) switches modules sequentially. The Next.js web app streams live I–V curves over Socket.IO; corrections are applied server-side via `POST /api/corrections/apply`.

**Key interfaces exposed to SolarLabX:**
- `GET /api/measurements/:id/curve?corrected=true` → STC I–V array
- `POST /api/sessions` → create + queue a test sweep
- `GET /api/modules/:id` → module metadata (manufacturer, STC params)

### 2.2 SolarLabX — LIMS/QMS

> **TODO**: describe SolarLabX sample receipt → IV test assignment → result record → uncertainty budget → report chain. Needs SolarLabX codebase access or PRD.

Key SolarLabX endpoints that consume Surya Yantra output:
- `POST /api/lims/samples/:id/results` — attach IV result to sample record
- `POST /api/reports/generate` — compile ISO 17025 test report

### 2.3 antaryami-os — AI Operating System

Claude Opus/Sonnet is called at two points:
1. **Fault diagnosis** (`POST /api/ai/chat` in Surya Yantra) — explain anomalies in the corrected I–V curve
2. **SOP generation** (`POST /api/sop/generate` in SolarLabX) — produce test procedure drafts aligned to IEC clauses

> **TODO**: describe the antaryami-os tool-calling architecture and how Surya Yantra registers as an MCP tool.

### 2.4 ShilpaSutra — AI CAD/CFD

ShilpaSutra generated the 3D model of the 75-module test bed and the MUX relay chassis from a conversational prompt. The exported DXF/STEP files are the source of truth for the BOM and wiring guide.

> **TODO**: include a representative ShilpaSutra screenshot and the 19" rack STEP export.

---

## 3. Inter-Service API Contract

```
Surya Yantra          SolarLabX             antaryami-os
──────────────────────────────────────────────────────────
/api/measurements ──► /api/lims/samples    ──► tool: get_iv_result
/api/modules      ──► /api/lims/instruments ──► tool: list_modules
/api/sessions     ──► /api/lims/work-orders ──► tool: create_session
/api/ai/chat      ◄── antaryami Claude call ──► tool: analyze_fault
```

Authentication uses HMAC-signed bearer tokens issued per-service.

---

## 4. NABL Accreditation Pathway

ISO 17025:2017 clauses addressed by each platform:

| Clause | Requirement | Platform | Status |
|--------|-------------|----------|--------|
| 6.4 | Equipment calibration records | SolarLabX | 🔄 |
| 6.5 | Metrological traceability | Surya Yantra GUM budget | 🔲 |
| 7.2 | Method validation | IEC 60891 test vectors | ✅ |
| 7.6 | Measurement uncertainty | SolarLabX uncertainty module | 🔄 |
| 7.8 | Report requirements | SolarLabX PDF export | 🔄 |
| 8.4 | Audit records | SolarLabX audit trail | ✅ |

> **TODO**: map to NABL 141 specific clauses for testing laboratories.

---

## 5. Cost Analysis

> **TODO**: quantify:
> - License cost avoided vs. leading commercial LIMS (get quotes from 2–3 vendors)
> - Cloud infrastructure cost: Vercel Pro + Neon DB + Anthropic API (see DEPLOYMENT.md: ~₹8,000/month)
> - Hardware cost for 75-module test bed (see BOM.md: ~₹18,50,000 one-time)

---

## 6. Results and Discussion

> **TODO**: once hardware is commissioned, report:
> - Throughput: modules tested per 8-hour shift
> - Uncertainty budget: expanded uncertainty U (k=2) for Pmpp
> - Uptime: system availability over first 90 days

---

## 7. Conclusion

The Surya Yantra / SolarLabX / antaryami / ShilpaSutra ecosystem demonstrates that a full-stack, NABL-pathway PV test laboratory can be built entirely on open-source software. The architecture is transferable to any ISO 17025 testing discipline where an electronic load, multiplexed DUT switching, and standards-mandated data correction are required.

---

## References

1. ISO 17025:2017. *General requirements for the competence of testing and calibration laboratories.* Geneva: ISO.
2. NABL 141. *Specific criteria for accreditation of testing and calibration laboratories.* New Delhi: NABL.
3. IEC 60891:2021. *Photovoltaic devices — Procedures for temperature and irradiance corrections.* Geneva: IEC.
4. IEC 61215:2021. *Terrestrial photovoltaic (PV) modules — Design qualification and type approval.* Geneva: IEC.
5. > **TODO**: cite India solar capacity statistics (MNRE Annual Report 2025–26).
6. > **TODO**: cite commercial LIMS cost benchmarks (GartnerPeer, LabX market survey).

---

*Seed generated by Sunday roadmap routine 2026-06-29.*
