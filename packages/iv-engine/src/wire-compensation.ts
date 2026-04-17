// 4-wire Kelvin / wire resistance compensation
//
// When measuring long cable runs with 2-wire, the wire drop attributes
// voltage loss to the device. 4-wire Kelvin sensing eliminates this — but
// if only 2-wire is available, we can subtract the IR-drop after the fact:
//
//   V_module(I) = V_measured(I) − I · R_wire_total
//
// R_wire_total = 2 · (ρ · L / A)  — for round-trip (force + return)

export interface WireSpec {
  lengthMeters: number;
  crossSectionMm2: number;
  /** Copper: 1.68e-8 Ωm. Aluminum: 2.82e-8 Ωm */
  resistivityOhmMeters?: number;
}

/** Compute round-trip wire resistance in Ω. */
export function wireResistance(spec: WireSpec): number {
  const rho = spec.resistivityOhmMeters ?? 1.68e-8;
  const aM2 = spec.crossSectionMm2 * 1e-6;
  return (2 * rho * spec.lengthMeters) / aM2;
}

export interface CompensationInput {
  curve: Array<{ voltage: number; current: number }>;
  wireResistanceOhms: number;
}

export function compensateWireDrop(
  input: CompensationInput,
): Array<{ voltage: number; current: number }> {
  return input.curve.map((p) => ({
    voltage: p.voltage - p.current * input.wireResistanceOhms,
    current: p.current,
  }));
}

/**
 * Kelvin 4-wire: caller passes the measured voltage directly at the sense
 * terminals. No compensation is needed — this is an identity pass-through,
 * exported for API symmetry.
 */
export function kelvinPassThrough<T>(curve: T[]): T[] {
  return curve;
}
