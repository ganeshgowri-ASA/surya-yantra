# hardware/schematics/

> **Status:** Placeholder — tracked in issue #42.
>
> This directory will contain SVG circuit diagrams for the Srishti PV Lab test bed.
> All SVG files must include a `<title>` element and a `<desc>` element for accessibility
> (screen-reader alt-text).

## Files expected

| File | Description | Source | Status |
|------|-------------|--------|--------|
| `system-overview.svg` | Top-level block diagram: 75-module array → Kelvin harness → MUX → ESL-Solar 500 → Lab PC | Convert ASCII art from `docs/HARDWARE-SETUP.md §1` | ⬜ Pending |
| `mux-relay-matrix.svg` | 300-relay 15×5 matrix layout with Force+/- and Sense+/- lanes | ShilpaSutra CAD export (issue #40 / #22) | ⬜ Pending |
| `4-wire-kelvin.svg` | Force+/- and Sense+/- Kelvin connection detail per module | ShilpaSutra CAD export | ⬜ Pending |
| `rack-layout.svg` | 19" 36U rack front-panel U position assignment | ShilpaSutra CAD export | ⬜ Pending |

## SVG template

Each file must conform to:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"
     role="img" aria-labelledby="title desc">
  <title id="title"><!-- Short accessible title --></title>
  <desc id="desc"><!-- One-sentence description for screen readers --></desc>
  <!-- diagram content -->
</svg>
```

## Related issues

- Issue #42 — `hardware/schematics/` directory missing (blocker)
- Issue #37 — `hardware/WIRING.md` also missing
- Issue #22 / #40 — ShilpaSutra CAD output is the planned source for MUX and Kelvin SVGs

*Created 2026-05-17 — Sunday structural pass.*
