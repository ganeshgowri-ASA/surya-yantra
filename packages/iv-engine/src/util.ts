import type { IVPoint } from './types';

export interface Metrics {
  voc: number;
  isc: number;
  vmpp: number;
  impp: number;
  pmpp: number;
  ff: number;
}

export function computeMetrics(curve: IVPoint[]): Metrics {
  if (curve.length === 0) return { voc: 0, isc: 0, vmpp: 0, impp: 0, pmpp: 0, ff: 0 };

  // ISC: current where V = 0 (interpolated)
  const sortedByV = [...curve].sort((a, b) => a.voltage - b.voltage);
  const isc = interpolateAt(sortedByV, 0, 'v', 'i');

  // VOC: voltage where I = 0 (interpolated)
  const sortedByI = [...curve].sort((a, b) => a.current - b.current);
  const voc = interpolateAt(sortedByI, 0, 'i', 'v');

  // MPP: max power
  let mpp: IVPoint = curve[0]!;
  let pMax = (curve[0]!.power ?? curve[0]!.voltage * curve[0]!.current);
  for (const p of curve) {
    const pw = p.power ?? p.voltage * p.current;
    if (pw > pMax) {
      pMax = pw;
      mpp = p;
    }
  }

  const ff = voc * isc === 0 ? 0 : pMax / (voc * isc);
  return { voc, isc, vmpp: mpp.voltage, impp: mpp.current, pmpp: pMax, ff };
}

function interpolateAt(
  sorted: IVPoint[],
  target: number,
  by: 'v' | 'i',
  out: 'v' | 'i',
): number {
  const keyOf = (p: IVPoint) => (by === 'v' ? p.voltage : p.current);
  const valOf = (p: IVPoint) => (out === 'v' ? p.voltage : p.current);

  // Look for a pair that straddles target
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i]!;
    const b = sorted[i + 1]!;
    const ka = keyOf(a);
    const kb = keyOf(b);
    if ((ka <= target && kb >= target) || (ka >= target && kb <= target)) {
      const denom = kb - ka;
      if (Math.abs(denom) < 1e-9) return valOf(a);
      const t = (target - ka) / denom;
      return valOf(a) + t * (valOf(b) - valOf(a));
    }
  }
  // Fallback: closest point
  let best = sorted[0]!;
  let bestErr = Math.abs(keyOf(best) - target);
  for (const p of sorted) {
    const err = Math.abs(keyOf(p) - target);
    if (err < bestErr) {
      bestErr = err;
      best = p;
    }
  }
  return valOf(best);
}
