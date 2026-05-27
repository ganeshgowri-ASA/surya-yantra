# Surya Yantra — Master Reference Index

Cross-index of all standards, papers, and data sources cited across the project docs and articles. Updated as part of the Wednesday enhancement pass.

**Last updated:** 2026-05-27

---

## IEC Standards

| Standard | Edition | Title | Used In |
|---|---|---|---|
| IEC 60891:2021 | Ed.3 | Temperature & irradiance corrections to I-V characteristics | `IEC-CORRECTIONS.md`, `API.md`, both drafts |
| IEC 60904-1:2020 | Ed.3 | I-V measurement of PV devices | `README.md`, `IEC-CORRECTIONS.md` |
| IEC 60904-3:2019 | Ed.4 | Measurement principles, AM1.5G reference spectrum | `IEC-CORRECTIONS.md`, `smmf.ts` |
| IEC 60904-7:2019 | Ed.4 | Spectral mismatch correction | `IEC-CORRECTIONS.md`, `smmf.ts`, both drafts |
| IEC 61215-1:2021 | Ed.2 | Module design qualification — test requirements | `IEC-CORRECTIONS.md`, article seed 1 |
| IEC 61215-2:2021 | Ed.2 | Module design qualification — test procedures | article seed 1 |
| IEC 61853-1:2011 | Ed.1 | Module performance & energy rating, irradiance & temperature | `README.md`, `IEC-CORRECTIONS.md` |
| IEC 61853-2:2016 | Ed.1 | Spectral responsivity, AOI, module operating temperature | `IEC-CORRECTIONS.md`, `iam.ts`, both drafts |
| IEC 61853-3:2018 | Ed.1 | Energy rating calculation | `README.md`, `IEC-CORRECTIONS.md` |
| IEC 63209-1:2021 | Ed.1 | Extended stress testing — test sequences (LeTID) | article seed 1 |
| IEC 60664-1:2020 | Ed.1 | Insulation coordination for low-voltage equipment | article seed 2 |

## Peer-Reviewed Papers

| Citation | DOI | Used In |
|---|---|---|
| Martin & Ruiz (2001) — PV angular loss analytical model | https://doi.org/10.1016/S0927-0248(00)00408-6 | `IEC-CORRECTIONS.md`, `iam.ts`, article seed 1 |
| Osterwald (1986) — Translation to reference conditions | https://doi.org/10.1016/0379-6787(86)90124-6 | `IEC-CORRECTIONS.md`, article seed 1 |
| Kenny et al. (2006) — Thin film PV module performance | https://doi.org/10.1016/j.tsf.2005.12.021 | `IEC-CORRECTIONS.md` |
| Driesse & Stein (2020) — IEC 61853 to PV simulation | https://doi.org/10.1002/pip.3203 | `IEC-CORRECTIONS.md` |
| Müllejans et al. (2005) — Spectral mismatch calibration | https://doi.org/10.1088/0957-0233/16/6/002 | `IEC-CORRECTIONS.md` |
| Virtuani et al. (2011) — Light source & temperature effects | https://doi.org/10.1002/pip.1018 | `IEC-CORRECTIONS.md` |
| Williams et al. (2024) — Build123d JOSS | https://doi.org/10.21105/joss.06123 | article seed 2 |
| Shepherd et al. (2023) — LLMs for CAD parametric design | https://doi.org/10.1016/j.cad.2023.103620 | article seed 2 |
| Müller et al. (2013) — Spectral soiling impact | https://doi.org/10.1002/pip.2214 | article seed 1 |
| Gallardo-Saavedra et al. (2018) — PV failure rates | https://doi.org/10.1016/j.energy.2019.06.185 | article seed 1 |
| Gueymard (2004) — Sun's spectral irradiance | https://doi.org/10.1016/j.solener.2003.08.039 | `IEC-CORRECTIONS.md` |

## Data Sources & Software

| Resource | URL | Used In |
|---|---|---|
| NREL AM1.5G Reference Spectra | https://www.nrel.gov/grid/solar-resource/spectra-am1.5.html | `IEC-CORRECTIONS.md`, `smmf.ts` |
| Zoo.dev KittyCAD API | https://zoo.dev/docs | article seed 2 |
| OpenFOAM v12 | https://openfoam.org/version/12/ | article seed 2 |
| OMRON G6K-2F-Y relay datasheet | https://components.omron.com/us-en/products/relays/G6K | article seed 2 |

## Hardware Datasheets

| Component | Manufacturer | Document | Used In |
|---|---|---|---|
| ESL-Solar 500 Electronic Load | ET SolarPower | *[TODO: add datasheet URL]* | `hardware/BOM.md`, article seed 1 |
| ITECH IT6000C DC Power Supply | ITECH | *[TODO: add datasheet URL]* | article seed 1 (Agnipariksha) |
| OMRON G6K-2F-Y | Omron | https://components.omron.com/us-en/products/relays/G6K | article seed 2, `hardware/BOM.md` |
