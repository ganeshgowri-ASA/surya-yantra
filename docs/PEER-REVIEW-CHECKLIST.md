# Peer-Review Checklist — Surya Yantra Documentation

> Applied every **Thursday** before merging documentation PRs.

---

## Structure

- [ ] Heading hierarchy is H1 → H2 → H3 with no skips
- [ ] Every internal link (`[text](path)`) resolves to a real file or anchor
- [ ] ASCII/SVG diagrams have a caption sentence below them
- [ ] Markdown tables have a header row and at least two columns

## Technical Accuracy

- [ ] All IEC standard references include the publication year (e.g. IEC 60891:**2021**)
- [ ] Formulas match the implementation in `apps/web/lib/` — spot-check at least one per PR
- [ ] API request/response JSON examples match actual route handler types in `apps/web/app/api/`
- [ ] SCPI command strings match ESL-Solar 500 firmware ≥ 1.12
- [ ] Hardware part numbers and ratings match `hardware/BOM.md`
- [ ] IAM formula uses correct parenthesisation: `(1 − exp(−cosθ/ar)) / (1 − exp(−1/ar))`

## Citations

- [ ] Every standard cited inline has a full entry in a References section
- [ ] Academic papers include journal, volume, year, and page range (DOI preferred)
- [ ] BOM purchase links are live and point to the correct product (check spot sample)

## Completeness

- [ ] New API endpoints are documented: method, path, auth requirement, request body, response shape, error codes
- [ ] New IEC correction procedures include a worked numerical example
- [ ] Safety hazards for new hardware components are noted in HARDWARE-SETUP.md §8
- [ ] New environment variables are listed in DEPLOYMENT.md §3

## Style

- [ ] Abbreviations expanded on first use per document: STC, SMMF, IAM, MUX, AOI, POA, DUT
- [ ] Units stated for all measurements: W/m², °C, Ω, A, V, nm
- [ ] Code blocks carry a language tag (` ```bash `, ` ```ts `, ` ```json `)
- [ ] Numbers > 999 use comma separator (10,000 not 10000)
- [ ] No orphaned TODO/FIXME comments left in prose

## Known Open Gaps (file issues before merging)

Track the following as GitHub issues; do not merge docs PRs that add _new_ references to these paths:

- [ ] `hardware/schematics/` — SVG circuit diagrams directory missing (referenced in README)
- [ ] `hardware/WIRING.md` — wiring guide missing (referenced in README)
- [ ] `hardware/firmware/mux-controller/` — STM32H7 firmware missing (referenced in HARDWARE-SETUP.md §4.2)
- [ ] `packages/scpi-client/`, `packages/iv-engine/`, `packages/types/` — monorepo packages not yet present (referenced in README repo tree)
- [ ] `docs/PRD.md` — Product Requirements Document missing (referenced in README repo tree)
- [ ] `apps/web/.env.example` — Quick Start references `cp apps/web/.env.example …` but file absent

---

*Maintained by the Srishti PV Lab platform team. Last updated 2026-06-19.*
