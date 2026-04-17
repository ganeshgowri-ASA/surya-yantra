// ESL-Solar 500 — shared types

export type LoadMode = 'CC' | 'CV' | 'CR' | 'CP' | 'MPP_TRACK' | 'MPP_SCAN' | 'IV_SWEEP';

export type InterfaceType = 'USB' | 'RS232' | 'ETHERNET';

export interface ConnectionOptions {
  interfaceType: InterfaceType;
  comPort?: string;
  baudRate?: number;
  ipAddress?: string;
  tcpPort?: number;
  timeoutMs?: number;
}

export interface LiveReadings {
  voltage: number;
  current: number;
  power: number;
  timestamp: number;
}

export interface IVSweepConfig {
  startV: number;
  stopV: number;
  stepCount: number;
  scanTimeSec: number;
  direction?: 'forward' | 'reverse' | 'both';
  dwellMs?: number;
}

export interface IVPoint {
  index: number;
  voltage: number;
  current: number;
  power: number;
}

export interface IVSweepResult {
  config: IVSweepConfig;
  points: IVPoint[];
  durationMs: number;
  voc: number;
  isc: number;
  vmpp: number;
  impp: number;
  pmpp: number;
  ff: number;
}

export interface DeviceIdentity {
  manufacturer: string;
  model: string;
  serialNumber: string;
  firmware: string;
}

export interface DeviceLimits {
  maxVoltage: number;
  maxCurrent: number;
  maxPower: number;
}

export class SCPIError extends Error {
  constructor(
    message: string,
    public readonly command?: string,
    public readonly code?: number,
  ) {
    super(message);
    this.name = 'SCPIError';
  }
}
