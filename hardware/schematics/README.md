# Hardware Schematics

> **Status: planned — auto-generation in progress via ShilpaSutra CAD pipeline.**

The following SVG schematics will be auto-generated from `hardware/BOM.md` and `hardware/WIRING.md` using the ShilpaSutra text-to-CAD pipeline described in `drafts/2026-06-23-shilpasutra-cad-integration-outline.md`:

| File | Description | Status |
|------|-------------|--------|
| `rack-elevation.svg` | 19" 6U rack elevation — Hammond RM2U1908, component placement | TODO |
| `mux-matrix-wiring.svg` | 300-relay matrix wiring diagram — 15 rows × 5 cols × 4-wire Kelvin channels | TODO |
| `kelvin-harness.svg` | 4-wire Kelvin harness connection detail — MC4 Y-splitter, Force/Sense separation | TODO |
| `system-overview.svg` | Full system block diagram — ESL-Solar 500 → MUX → Module array | TODO |

## Generation Pipeline

Once the ShilpaSutra integration is complete:

```bash
pnpm tools:gen-schematics
# reads: hardware/BOM.md + hardware/WIRING.md
# writes: hardware/schematics/*.svg via ShilpaSutra API
```

## Manual Reference

Until auto-generation is available, refer to:
- `hardware/BOM.md` — complete bill of materials with manufacturer specs
- `hardware/WIRING.md` — cable routing rules and connection instructions
- `docs/HARDWARE-SETUP.md` — step-by-step commissioning guide
