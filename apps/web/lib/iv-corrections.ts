// Wrapper around @surya/iv-engine — accepts raw measurement data and
// returns corrected curve + metrics ready for persistence.

import {
  applyIEC60891,
  computeSMMF,
  effectiveIAM,
  compensateWireDrop,
  wireResistance,
  AM15G_REFERENCE,
  type CorrectionInput,
  type CorrectionResult,
  type IVPoint,
  type ModuleParams,
  type Procedure,
  type SpectralPoint,
  type WireSpec,
} from '@surya/iv-engine';

export interface CorrectionRequest {
  procedure: Procedure;
  curve: IVPoint[];
  module: ModuleParams;
  gMeas: number;
  tMeas: number;
  // Optional upgrades
  aoiDeg?: number;
  beamFraction?: number;
  applySmmf?: boolean;
  measuredSpectrum?: SpectralPoint[];
  referenceCellSR?: SpectralPoint[];
  deviceSR?: SpectralPoint[];
  wireSpec?: WireSpec;
}

export function performFullCorrection(req: CorrectionRequest): CorrectionResult {
  let curve = req.curve;

  // 1. Wire compensation (if using 2-wire mode with a supplied wire spec)
  if (req.wireSpec) {
    const rWire = wireResistance(req.wireSpec);
    curve = compensateWireDrop({ curve, wireResistanceOhms: rWire });
  }

  // 2. IAM (Martin-Ruiz per IEC 61853-2)
  let iam: number | undefined;
  if (req.aoiDeg !== undefined) {
    iam = effectiveIAM({
      aoiDeg: req.aoiDeg,
      beamFraction: req.beamFraction ?? 0.85,
      aR: req.module.arCoeff ?? 0.17,
    });
  }

  // 3. SMMF (per IEC 60904-7) — require all four spectra
  let smmf: number | undefined;
  if (
    req.applySmmf &&
    req.measuredSpectrum &&
    req.referenceCellSR &&
    req.deviceSR
  ) {
    smmf = computeSMMF({
      eRef: AM15G_REFERENCE,
      eMeas: req.measuredSpectrum,
      srRef: req.referenceCellSR,
      srDev: req.deviceSR,
    });
  }

  // 4. IEC 60891 correction to STC
  const input: CorrectionInput = {
    curve,
    module: req.module,
    conditions: { gMeas: req.gMeas, tMeas: req.tMeas },
    procedure: req.procedure,
    smmf,
    iam,
  };
  return applyIEC60891(input);
}

export type { CorrectionResult, IVPoint, Procedure } from '@surya/iv-engine';
