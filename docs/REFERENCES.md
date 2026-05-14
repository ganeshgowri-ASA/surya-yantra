# Surya Yantra — Standards & References

Full bibliographic entries for every standard, paper, and specification
cited across the Surya Yantra documentation.

---

## IEC Standards

### IEC 60891:2021
*Photovoltaic devices — Procedures for temperature and irradiance corrections
to measured I-V characteristics.*
Edition 3.0, 2021-04.
International Electrotechnical Commission.
https://webstore.iec.ch/publication/64639

Used in: `docs/IEC-CORRECTIONS.md` §1, `apps/web/lib/iec60891.ts`,
`POST /api/corrections/p1` – `p4`.

---

### IEC 60904-1:2020
*Photovoltaic devices — Part 1: Measurement of photovoltaic current-voltage
characteristics.*
Edition 3.0, 2020-07.
International Electrotechnical Commission.
https://webstore.iec.ch/publication/61018

Used in: sweep parameters for the ESL-Solar 500 scan sequence, IV curve
point ordering.

---

### IEC 60904-3:2019
*Photovoltaic devices — Part 3: Measurement principles for terrestrial
photovoltaic (PV) solar devices with reference spectral irradiance data.*
Edition 4.0, 2019-04.
International Electrotechnical Commission.
https://webstore.iec.ch/publication/60638

Used in: AM1.5G reference spectrum for SMMF computation
(`apps/web/lib/smmf.ts`).

---

### IEC 60904-7:2019
*Photovoltaic devices — Part 7: Computation of the spectral mismatch
correction for measurements of photovoltaic devices.*
Edition 4.0, 2019-04.
International Electrotechnical Commission.
https://webstore.iec.ch/publication/60639

Used in: `docs/IEC-CORRECTIONS.md` §2, `apps/web/lib/smmf.ts`.

---

### IEC 61215:2021
*Terrestrial photovoltaic (PV) modules — Design qualification and type
approval — Part 1 (test requirements) and Part 2 (test procedures).*
Edition 3.0, 2021-02.
International Electrotechnical Commission.
https://webstore.iec.ch/publication/68282

Used in: module type codes in the module registry schema.

---

### IEC 61853-1:2011
*Photovoltaic (PV) module performance testing and energy rating —
Part 1: Irradiance and temperature performance measurements and power
rating.*
Edition 1.0, 2011-10.
International Electrotechnical Commission.
https://webstore.iec.ch/publication/6172

Used in: energy baseline and power rating methodology.

---

### IEC 61853-2:2016
*Photovoltaic (PV) module performance testing and energy rating —
Part 2: Spectral responsivity, incidence angle and module operating
temperature measurements.*
Edition 1.0, 2016-04.
International Electrotechnical Commission.
https://webstore.iec.ch/publication/24653

Used in: `docs/IEC-CORRECTIONS.md` §3, `apps/web/lib/iam.ts`
(Martin-Ruiz model).

---

### IEC 61853-3:2018
*Photovoltaic (PV) module performance testing and energy rating —
Part 3: Energy rating of PV modules.*
Edition 1.0, 2018-10.
International Electrotechnical Commission.
https://webstore.iec.ch/publication/62978

Used in: seasonal energy yield calculation in Reports module.

---

### IEC 62446-1:2016
*Photovoltaic (PV) systems — Requirements for testing, documentation
and maintenance — Part 1: Grid connected systems.*
Edition 1.0, 2016-05.
International Electrotechnical Commission.
https://webstore.iec.ch/publication/25028

Used in: `docs/HARDWARE-SETUP.md` §9 (commissioning tests).

---

### IEC 61730-1/2:2023
*Photovoltaic (PV) module safety qualification.*
Edition 3.0, 2023.
International Electrotechnical Commission.
https://webstore.iec.ch/publication/72112

Used in: `docs/HARDWARE-SETUP.md` §8 (safety requirements).

---

### IEC 61010-1:2010+AMD1:2016
*Safety requirements for electrical equipment for measurement, control,
and laboratory use — Part 1: General requirements.*
International Electrotechnical Commission.
https://webstore.iec.ch/publication/25315

Used in: `docs/HARDWARE-SETUP.md` §2.3 (RCD mandatory requirement).

---

## IEEE Standards

### IEEE 1547:2018
*IEEE Standard for Interconnection and Interoperability of Distributed
Energy Resources with Associated Electric Power Systems Interfaces.*
IEEE, 2018.
https://standards.ieee.org/ieee/1547/5915/

Used in: `docs/HARDWARE-SETUP.md` §9.

---

## Academic Papers

### Martin & Ruiz (2001)
Martin, N. and Ruiz, J.M.
*Calculation of the PV modules angular losses under field conditions by
means of an analytical model.*
Solar Energy Materials and Solar Cells, 70(1), pp. 25–38.
https://doi.org/10.1016/S0927-0248(00)00408-6

Used in: `docs/IEC-CORRECTIONS.md` §3, `apps/web/lib/iam.ts` (the
`ar` fitting coefficient and `iamMartinRuiz()` formula).

---

## Datasheets & Manuals

| Item | Document |
|---|---|
| ESL-Solar 500 | User Manual (PDF, supplied with unit by ET SolarPower) |
| Omron G9EA-1-B | Datasheet G9EA Datasheet, Cat. No. H153-E1 |
| Kipp & Zonen SMP10 | Instruction Manual, document M.011248.010 |
| IMT Si-RS485TC-T-MB | Technical Manual v3.1, IMT Solar GmbH |

---

*Last updated 2026-05-14. Add new entries alongside any new standard
reference introduced in the codebase or documentation.*
