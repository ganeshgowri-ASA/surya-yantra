// Singleton ESL-Solar connection manager (server-side only).
// In production on Vercel (serverless), the driver will connect on demand
// using credentials from env. For self-hosted / desktop, a single instance
// is reused across requests.

import 'server-only';
import { ESLSolar500 } from '@surya/scpi-client';
import type { ConnectionOptions, IVSweepConfig, IVSweepResult, LiveReadings } from '@surya/scpi-client';

let instance: ESLSolar500 | null = null;

function getOptionsFromEnv(): ConnectionOptions {
  const iface = (process.env.ESL_INTERFACE ?? 'ETHERNET').toUpperCase() as
    | 'USB'
    | 'RS232'
    | 'ETHERNET';
  return {
    interfaceType: iface,
    comPort: process.env.ESL_COM_PORT,
    baudRate: process.env.ESL_BAUD ? Number.parseInt(process.env.ESL_BAUD) : 9600,
    ipAddress: process.env.ESL_IP,
    tcpPort: process.env.ESL_PORT ? Number.parseInt(process.env.ESL_PORT) : 5025,
  };
}

export async function getESL(): Promise<ESLSolar500> {
  if (instance && instance.isConnected()) return instance;
  instance = new ESLSolar500(getOptionsFromEnv());
  await instance.connect();
  return instance;
}

export async function disconnectESL(): Promise<void> {
  if (instance) {
    await instance.disconnect();
    instance = null;
  }
}

export async function readLiveSafe(): Promise<LiveReadings | null> {
  try {
    const esl = await getESL();
    return await esl.readLive();
  } catch {
    return null;
  }
}

export async function runIVSweep(cfg: IVSweepConfig): Promise<IVSweepResult> {
  const esl = await getESL();
  return esl.startIVSweep(cfg);
}

/**
 * Mock IV sweep for development / Vercel deploy without hardware.
 * Uses a single-diode approximation so the plot looks realistic.
 */
export function mockIVSweep(cfg: IVSweepConfig): IVSweepResult {
  const voc = cfg.stopV > 0 ? cfg.stopV : 45;
  const isc = 12;
  const n = cfg.stepCount;
  const points = Array.from({ length: n }, (_, i) => {
    const v = cfg.startV + ((cfg.stopV - cfg.startV) * i) / (n - 1);
    const ratio = v / voc;
    const current = Math.max(
      0,
      isc * (1 - Math.pow(ratio, 24)) - 0.002 * Math.exp(ratio * 8),
    );
    return { index: i, voltage: v, current, power: v * current };
  });
  const mpp = points.reduce((a, b) => (b.power > a.power ? b : a));
  return {
    config: cfg,
    points,
    durationMs: Math.round(cfg.scanTimeSec * 1000),
    voc,
    isc,
    vmpp: mpp.voltage,
    impp: mpp.current,
    pmpp: mpp.power,
    ff: mpp.power / (voc * isc),
  };
}
