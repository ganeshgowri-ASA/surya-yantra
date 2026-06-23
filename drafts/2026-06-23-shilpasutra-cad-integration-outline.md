---
title: "ShilpaSutra CAD Integration: Auto-generating Rack and Wiring Diagrams from Surya Yantra's Hardware Schema"
date: 2026-06-23
week: W27
day_angle: outline
status: outline
tags: [shilpasutra, cad, hardware, bom, schematics, svg, ai-design, article-outline]
source_repos: [ShilpaSutra, surya-yantra]
target_venue: "MDPI Applied Sciences (Special Issue: AI in Test & Measurement) or IEEE PVSC 2027"
estimated_words: 5000
word_count_now: 0
---

# Article Outline: ShilpaSutra CAD Integration with Surya Yantra Hardware Schema

## 1. Abstract (150 words — TODO after full draft)

> **Placeholder:** Surya Yantra ships a machine-readable BOM (300+ line items) and a hardware setup guide that fully specifies the 75-module, 4-wire Kelvin test bed. ShilpaSutra is a text-and-multimodal-to-CAD platform capable of generating parametric SVG/DXF drawings from structured JSON input. This paper proposes and implements a pipeline that ingests Surya Yantra's `hardware/BOM.md` and `hardware/WIRING.md`, converts them to a ShilpaSutra prompt schema, and auto-generates: (a) a 19-inch rack elevation drawing, (b) a 300-relay MUX matrix wiring diagram, and (c) a 4-wire Kelvin harness connection detail. The generated SVGs replace the currently missing `hardware/schematics/` directory, closing a critical documentation gap. Accuracy against manually drawn reference diagrams is evaluated using vector-space similarity metrics.

---

## 2. Introduction

### 2.1 Motivation

- Surya Yantra's `README.md` references `hardware/schematics/` (SVG circuit diagrams), `hardware/WIRING.md`, and `docs/PRD.md` — none of which currently exist in the repository (verified: 2026-06-23 structural lint). This blocks hardware commissioning for contributors.
- Manually drawing rack elevation diagrams and 300-relay wiring matrices is error-prone and expensive (~40 engineering hours estimated).
- ShilpaSutra provides an AI-native CAD pipeline that accepts structured text and multimodal inputs and returns parametric SVG/DXF outputs via its conversational design agent.

### 2.2 Research Questions

1. Can a structured hardware schema (BOM + wiring text) be compiled into a ShilpaSutra prompt that reliably generates accurate rack elevation and wiring diagrams?
2. What is the minimum prompt specificity required to achieve ≥ 90% topological accuracy against a reference schematic?
3. How does the AI-generated drawing quality compare to industry-standard CAD tools (SolidWorks Electrical, AutoCAD) on a set of standardised IEC 61439-compliant evaluation criteria?

### 2.3 Contributions

1. **BOM-to-CAD schema**: a JSON conversion of `hardware/BOM.md` into ShilpaSutra's parametric input format.
2. **Three auto-generated schematics**: rack elevation, MUX matrix wiring diagram, 4-wire Kelvin harness detail — committed to `hardware/schematics/`.
3. **Evaluation framework**: vector similarity + expert review rubric for AI-generated electrical schematics.
4. **Open-source pipeline**: `tools/bom-to-shilpasutra/` script in this repository.

---

## 3. Background and Related Work

### 3.1 Surya Yantra Hardware Architecture

- **ESL-Solar 500 electronic load** (300 V / 27 A, SCPI over USB/RS232/Ethernet) — primary instrument.
- **MUX relay matrix**: 310 × Omron G9EA-1-B SPDT relays, STM32H743 MCU, I²C MCP23017 expanders — 75 × 4-wire Kelvin channels.
- **4-wire Kelvin harness**: LAPP ÖLFLEX (16 mm² force) + Belden 9463A (2.5 mm² sense), 600 m each.
- **19" 6U rack**: Hammond RM2U1908 enclosure, 35 mm DIN rails.
- Full BOM: `hardware/BOM.md` (8 sections, 50+ line items, India MRP in INR).

### 3.2 ShilpaSutra

- TypeScript/Next.js platform for text-to-CAD and multimodal-to-CAD.
- Conversational design agent backed by Claude Opus.
- Outputs: parametric SVG, DXF (AutoCAD-compatible), STEP (3D, experimental).
- Relevant prior art: [TODO — cite ShilpaSutra CVPR/AAAI submission if available].

### 3.3 AI-Assisted Schematic Generation — Prior Art

- [TODO] Survey of LLM + CAD tools: text2CAD (arXiv 2024), AutoCAD Generative Design, Onshape AI.
- Gap: none target relay matrix and rack-level PV test equipment; none use BOM as structured input.

---

## 4. Methodology

### 4.1 BOM-to-Schema Compiler (`tools/bom-to-shilpasutra/`)

```
hardware/BOM.md
    │
    ├── parser.ts — extract: item, manufacturer, model, qty, dimensions
    │
    ├── spatial_mapper.ts — assign rack units (U), DIN rail positions
    │
    └── schema_emitter.ts — output ShilpaSutra JSON prompt schema
```

Key parsing rules:
- Relay count: BOM item 2.1 (Omron G9EA-1-B, qty=310) → 15 rows × 5 columns × 4 relays/channel = 300 + 10 spares.
- Rack layout: items 2.5 (DIN rail), 2.7 (Hammond 6U chassis) → 6U = 266 mm usable height.
- Cable routing: items 3.1–3.7 → Force cables (16 mm², red/black) separate tray from Sense (2.5 mm², blue/white).

### 4.2 ShilpaSutra Prompt Construction

Prompt template structure:
```json
{
  "intent": "generate rack elevation drawing",
  "constraints": {
    "standard": "IEC 61439-1",
    "rack": { "model": "Hammond RM2U1908", "units": 6, "depth_mm": 229 },
    "components": [ ... ],
    "routing": { "power_tray": "left", "signal_tray": "right" }
  },
  "output_format": "SVG",
  "style": "technical line drawing, no colour fill, IEC symbols"
}
```

### 4.3 Evaluation

| Criterion | Metric | Target |
|-----------|--------|--------|
| Topological correctness | Component presence recall | ≥ 95% |
| Spatial accuracy | Bounding-box IoU vs. reference | ≥ 0.80 |
| IEC symbol compliance | Expert review score (1–5) | ≥ 4.0 |
| Generation latency | Wall-clock time | < 30 s |
| Vector similarity | SSIM of rendered PNG | ≥ 0.85 |

---

## 5. Results — TODO (Lab validation needed)

### 5.1 Rack Elevation Drawing

- [ ] Generated SVG at `hardware/schematics/rack-elevation.svg`
- [ ] Expert review score
- [ ] SSIM vs. reference

### 5.2 MUX Matrix Wiring Diagram

- [ ] Generated SVG at `hardware/schematics/mux-matrix-wiring.svg`
- [ ] Relay numbering accuracy (expected: R001–R310, 15 rows × 5 columns × 4 wires)
- [ ] Bus labels (Force+, Force-, Sense+, Sense-)

### 5.3 4-Wire Kelvin Harness Detail

- [ ] Generated SVG at `hardware/schematics/kelvin-harness.svg`
- [ ] MC4 Y-splitter topology verified
- [ ] Cable ferrule annotations present

---

## 6. Discussion

### 6.1 Gains for Surya Yantra

- Closes the `hardware/schematics/` documentation gap (structural lint issue).
- Provides a reproducible pipeline: BOM update → re-run compiler → updated schematic in CI.
- Enables hardware commissioning contributors to verify wiring without access to lab.

### 6.2 Gains for ShilpaSutra

- Demonstrates ShilpaSutra's applicability to electrical/relay schematics (not just mechanical CAD).
- Provides a real-world evaluation dataset (Srishti PV Lab hardware).

### 6.3 Limitations

- SVG output is 2D; 3D rack assembly would require STEP format (ShilpaSutra experimental).
- IEC 61439 symbol library completeness in ShilpaSutra is unverified — gap analysis needed.
- Accuracy depends on BOM completeness; missing dimensions require manual lookup.

---

## 7. Conclusion

> **TODO after lab validation.** Expected finding: ShilpaSutra can generate topologically accurate schematic stubs from structured BOM input in < 30 seconds, reducing manual drafting time by > 95% for initial layout, with expert review identifying ~15 symbol-level corrections needed.

---

## 8. References

- [TODO] Cite ShilpaSutra repository and any conference paper.
- [TODO] IEC 61439-1:2011 — Low-voltage switchgear and controlgear assemblies.
- [TODO] Hammond Manufacturing RM2U1908 datasheet.
- [TODO] Omron G9EA-1-B relay datasheet.
- [TODO] Survey of AI-assisted CAD generation tools.
- [TODO] text2CAD arXiv reference.

---

## Blockers / Open Questions

- [ ] ShilpaSutra JSON schema for electrical components — request from ShilpaSutra team.
- [ ] Reference schematics for evaluation — need a domain expert to draw gold-standard once (estimated: 8h).
- [ ] ShilpaSutra SVG export stability — verify via ShilpaSutra prod deployment.
- [ ] MUX matrix relay numbering convention — confirm with hardware team.

## Action Items (Monday W27)

- [ ] Open issue: "Request ShilpaSutra electrical component schema" → in ShilpaSutra repo.
- [ ] Create stub `hardware/schematics/README.md` noting planned auto-generation pipeline (unblocks README link).
- [ ] Create stub `hardware/WIRING.md` with known cable routing rules (unblocks README link).
- [ ] Commit BOM parser skeleton to `tools/bom-to-shilpasutra/`.
