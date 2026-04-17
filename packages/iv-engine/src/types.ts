export interface IVPoint {
  voltage: number;
  current: number;
  power?: number;
}

export interface ModuleParams {
  /** Nameplate / curve params (STC unless noted) */
  alphaPct: number; // ISC temp coeff %/°C
  betaPct: number; // VOC temp coeff %/°C
  gammaPct: number; // Pmp temp coeff %/°C (P3/P4)
  rs?: number; // series resistance (Ω) (P1/P4)
  kappa?: number; // temp coeff of Rs (Ω/°C) (P1)
  iscSTC: number;
  vocSTC: number;
  cellsSeries?: number;
  arCoeff?: number; // Martin-Ruiz AR coefficient (default 0.17)
}

export interface MeasurementConditions {
  gMeas: number; // W/m²
  tMeas: number; // °C (cell)
}

export interface STCConditions {
  gSTC: number; // 1000
  tSTC: number; // 25
}

export const STC: STCConditions = { gSTC: 1000, tSTC: 25 };

export type Procedure = 'P1' | 'P2' | 'P3' | 'P4';

export interface CorrectionInput {
  curve: IVPoint[];
  module: ModuleParams;
  conditions: MeasurementConditions;
  target?: STCConditions;
  procedure: Procedure;
  smmf?: number; // multiplicative correction on ISC
  iam?: number; // multiplicative correction on ISC for angle of incidence
}

export interface CorrectionResult {
  procedure: Procedure;
  corrected: IVPoint[];
  raw: IVPoint[];
  metrics: {
    voc: number;
    isc: number;
    vmpp: number;
    impp: number;
    pmpp: number;
    ff: number;
  };
  rawMetrics: {
    voc: number;
    isc: number;
    vmpp: number;
    impp: number;
    pmpp: number;
    ff: number;
  };
  deltaI: number;
  deltaV: number;
  smmfUsed?: number;
  iamUsed?: number;
}
