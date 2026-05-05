# OUTLINE — From Toolbox to Test Lab: GanitaSutra's Open Math Engine Powering Surya Yantra's IEC Correction Pipeline

**Status:** outline  
**Created:** 2026-05-05  
**Seed source:** GanitaSutra repo pushed 2026-05-03 (MATLAB/Simulink-inspired web platform, 21 toolboxes)  
**Target:** Journal of Open Source Software (JOSS) / IEEE Software  
**Audience:** Scientific-software engineers, PV researchers, open-source community

---

## Abstract (draft)

GanitaSutra is a browser-based mathematical computation platform modelled on
the MATLAB/Simulink paradigm, offering 21 toolboxes including numerical
integration, signal processing, and curve fitting. Surya Yantra's IEC correction
engine — implementing IEC 60891 Procedures 1–4, spectral mismatch (IEC 60904-7),
and incidence-angle modifiers (IEC 61853-2) — was prototyped and validated
inside GanitaSutra before being ported to TypeScript production code. This paper
describes the cross-repo dependency, the numerical challenges (union-grid
harmonisation, trapezoidal SMMF integration), and a reproducibility workflow
that pairs GanitaSutra notebooks with the Surya Yantra test-bed data.

---

## 1. Introduction

- [ ] Research software engineering for PV: the MATLAB dependency problem
- [ ] Open-source alternatives: NumPy/SciPy (Python), GanitaSutra (browser)
- [ ] Thesis: coupling a math platform to hardware SW reduces validation cycle time

**Key references to gather:**
- Smith & Jones (2020) — open-source PV simulation survey
- GanitaSutra repo README / release notes (2026-05-03 push)
- IEC 60904-7:2019 (SMMF integration algorithm)

---

## 2. GanitaSutra Architecture (Brief)

- [ ] Toolbox inventory — highlight Numerical Methods + Signal Processing toolboxes
- [ ] Browser runtime vs Node.js: implications for test-lab integration
- [ ] Export pipeline: GanitaSutra notebook → JSON → TypeScript module

**Figure placeholders:**
- Fig 1: GanitaSutra toolbox dependency graph (to be generated from repo)

---

## 3. IEC 60891 Numerical Challenges

### 3.1 Union-Grid Harmonisation for SMMF
- [ ] Why four spectral series (E_test, E_ref, SR_ref, SR_dut) have mismatched wavelength grids
- [ ] Linear resampling strategy; zero-padding at boundaries
- [ ] Error bound: trapezoidal vs Simpson's rule on 1 nm IEC grids

### 3.2 Procedure 3 Bilinear Interpolation
- [ ] Parameter `t` outside [0,1]: extrapolation warnings in production
- [ ] Numerical stability for nearly-collinear reference curves

### 3.3 Validation Inside GanitaSutra
- [ ] Worked example: reproduce §1.5 of IEC-CORRECTIONS.md in a GanitaSutra notebook
- [ ] Pmpp error: P1 = 451 W, P2 = 450 W, GanitaSutra notebook match to 0.01 W

---

## 4. Cross-Repo Reproducibility Workflow

- [ ] GanitaSutra notebook (URL/embed) as a living appendix to Surya Yantra paper
- [ ] CI gate: GanitaSutra exports → TypeScript Vitest suite (already passing)
- [ ] Proposed `@ganitasutra/pv-corrections` npm package for community reuse

---

## 5. Discussion

- [ ] Limitations: GanitaSutra is web-only (no offline lab use today)
- [ ] Roadmap: WebAssembly build for Electron desktop integration

---

## References (to populate)

1. GanitaSutra repository (ganeshgowri-ASA/GanitaSutra, 2026)
2. IEC 60891:2021, IEC 60904-7:2019
3. To add: ≥4 scientific-software reproducibility papers
