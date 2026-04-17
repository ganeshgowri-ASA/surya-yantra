// ESL-Solar 500 SCPI driver
// Implements SCPI-1999 commands per ET SolarPower ESL-Solar 500 manual.
// Supports USB, RS232, Ethernet (raw socket).
//
// Commands (subset, per manual):
//   *IDN?                          — identification query
//   *RST                           — reset to default
//   SYST:ERR?                      — error queue
//   INPUT ON|OFF                   — enable/disable input (load)
//   MODE CC|CV|CR|CP               — operating mode
//   CURR <A>                       — CC setpoint
//   VOLT <V>                       — CV setpoint
//   RES  <Ω>                       — CR setpoint
//   POW  <W>                       — CP setpoint
//   MEAS:VOLT?  MEAS:CURR?  MEAS:POW?
//   MPP:TRAC ON|OFF                — MPP tracker
//   MPP:SCAN:START <Vs>,<Ve>,<t>   — MPP scan
//   IVSW:START <Vs>,<Ve>,<N>,<t>   — IV sweep trigger
//   IVSW:DATA?                     — retrieve curve (CSV: i,V,I,P;...)
//
// Exact mnemonics may vary between firmware revisions — adjust per physical unit.

import type {
  ConnectionOptions,
  DeviceIdentity,
  DeviceLimits,
  IVPoint,
  IVSweepConfig,
  IVSweepResult,
  LiveReadings,
  LoadMode,
} from './types';
import { SCPIError } from './types';

type Transport = {
  write(data: string): Promise<void>;
  read(timeoutMs?: number): Promise<string>;
  close(): Promise<void>;
  isOpen(): boolean;
};

export class ESLSolar500 {
  private transport: Transport | null = null;
  private readonly options: ConnectionOptions;
  private lockPromise: Promise<void> = Promise.resolve();

  constructor(options: ConnectionOptions) {
    this.options = { timeoutMs: 3000, baudRate: 9600, tcpPort: 5025, ...options };
  }

  // ---------- Connection lifecycle ----------

  async connect(): Promise<void> {
    if (this.options.interfaceType === 'ETHERNET') {
      this.transport = await this.openTcpTransport();
    } else {
      this.transport = await this.openSerialTransport();
    }
  }

  async disconnect(): Promise<void> {
    if (this.transport) {
      await this.transport.close();
      this.transport = null;
    }
  }

  isConnected(): boolean {
    return this.transport?.isOpen() ?? false;
  }

  // ---------- Identification ----------

  async identify(): Promise<DeviceIdentity> {
    const resp = await this.query('*IDN?');
    const [manufacturer = 'Unknown', model = 'ESL-Solar 500', serialNumber = '', firmware = ''] =
      resp.split(',').map((s) => s.trim());
    return { manufacturer, model, serialNumber, firmware };
  }

  async reset(): Promise<void> {
    await this.write('*RST');
  }

  async getErrorQueue(): Promise<string> {
    return this.query('SYST:ERR?');
  }

  getLimits(): DeviceLimits {
    return { maxVoltage: 300, maxCurrent: 27, maxPower: 900 };
  }

  // ---------- Output / load control ----------

  async setInput(on: boolean): Promise<void> {
    await this.write(`INPUT ${on ? 'ON' : 'OFF'}`);
  }

  async setMode(mode: LoadMode): Promise<void> {
    const map: Record<LoadMode, string | null> = {
      CC: 'MODE CC',
      CV: 'MODE CV',
      CR: 'MODE CR',
      CP: 'MODE CP',
      MPP_TRACK: 'MPP:TRAC ON',
      MPP_SCAN: null, // set via startMppScan
      IV_SWEEP: null, // set via startIVSweep
    };
    const cmd = map[mode];
    if (!cmd) throw new SCPIError(`Mode ${mode} requires dedicated start method`);
    await this.write(cmd);
  }

  async setCurrent(amps: number): Promise<void> {
    this.assertWithin(amps, 0, 27, 'current');
    await this.write(`CURR ${amps.toFixed(4)}`);
  }

  async setVoltage(volts: number): Promise<void> {
    this.assertWithin(volts, 0, 300, 'voltage');
    await this.write(`VOLT ${volts.toFixed(3)}`);
  }

  async setResistance(ohms: number): Promise<void> {
    if (ohms <= 0) throw new SCPIError('Resistance must be > 0');
    await this.write(`RES ${ohms.toFixed(3)}`);
  }

  async setPower(watts: number): Promise<void> {
    this.assertWithin(watts, 0, 900, 'power');
    await this.write(`POW ${watts.toFixed(2)}`);
  }

  // ---------- Measurement ----------

  async readLive(): Promise<LiveReadings> {
    const [vStr, iStr, pStr] = await Promise.all([
      this.query('MEAS:VOLT?'),
      this.query('MEAS:CURR?'),
      this.query('MEAS:POW?'),
    ]);
    return {
      voltage: this.parseFloat(vStr),
      current: this.parseFloat(iStr),
      power: this.parseFloat(pStr),
      timestamp: Date.now(),
    };
  }

  // ---------- MPP ----------

  async mppTrackerEnable(on: boolean): Promise<void> {
    await this.write(`MPP:TRAC ${on ? 'ON' : 'OFF'}`);
  }

  async startMppScan(startV: number, stopV: number, scanTimeSec: number): Promise<void> {
    this.assertWithin(startV, 0, 300, 'startV');
    this.assertWithin(stopV, 0, 300, 'stopV');
    await this.write(`MPP:SCAN:START ${startV.toFixed(3)},${stopV.toFixed(3)},${scanTimeSec.toFixed(2)}`);
  }

  // ---------- IV Sweep ----------

  async startIVSweep(cfg: IVSweepConfig): Promise<IVSweepResult> {
    this.assertWithin(cfg.startV, 0, 300, 'startV');
    this.assertWithin(cfg.stopV, 0, 300, 'stopV');
    if (cfg.stepCount < 10 || cfg.stepCount > 10000) {
      throw new SCPIError('stepCount must be 10..10000');
    }

    const start = Date.now();
    await this.write(
      `IVSW:START ${cfg.startV.toFixed(3)},${cfg.stopV.toFixed(3)},${cfg.stepCount},${cfg.scanTimeSec.toFixed(2)}`,
    );

    // Poll until sweep completes
    const deadline = start + Math.ceil(cfg.scanTimeSec * 1000) + 5000;
    while (Date.now() < deadline) {
      const status = await this.query('IVSW:STAT?').catch(() => 'RUNNING');
      if (status.trim().toUpperCase().startsWith('DONE')) break;
      await sleep(50);
    }

    const raw = await this.query('IVSW:DATA?', 10_000);
    const points = this.parseSweepData(raw);
    const metrics = computeIVMetrics(points);
    return {
      config: cfg,
      points,
      durationMs: Date.now() - start,
      ...metrics,
    };
  }

  // ---------- Low level ----------

  async write(cmd: string): Promise<void> {
    await this.withLock(async () => {
      this.requireTransport().write(cmd + '\n');
    });
  }

  async query(cmd: string, timeoutMs?: number): Promise<string> {
    return this.withLock(async () => {
      const t = this.requireTransport();
      await t.write(cmd + '\n');
      return (await t.read(timeoutMs ?? this.options.timeoutMs)).trim();
    });
  }

  private requireTransport(): Transport {
    if (!this.transport) throw new SCPIError('Not connected — call connect() first');
    return this.transport;
  }

  private async withLock<T>(fn: () => Promise<T>): Promise<T> {
    const prev = this.lockPromise;
    let release!: () => void;
    this.lockPromise = new Promise((r) => (release = r));
    try {
      await prev;
      return await fn();
    } finally {
      release();
    }
  }

  private parseFloat(s: string): number {
    const n = Number.parseFloat(s.trim().split(/[ ,;]/)[0] ?? '');
    if (!Number.isFinite(n)) throw new SCPIError(`Bad numeric response: "${s}"`);
    return n;
  }

  private parseSweepData(raw: string): IVPoint[] {
    // Expected format per point: "i,V,I,P" separated by ";" or newlines
    const records = raw.split(/[;\n]+/).map((r) => r.trim()).filter(Boolean);
    return records
      .map((rec, idx) => {
        const parts = rec.split(',').map((p) => Number.parseFloat(p));
        const [maybeIdx, v, i, p] = parts;
        if ([maybeIdx, v, i, p].some((n) => !Number.isFinite(n))) return null;
        // Support both "i,V,I,P" (4 fields) and "V,I,P" (3 fields)
        if (parts.length === 3) {
          return { index: idx, voltage: maybeIdx!, current: v!, power: i! };
        }
        return { index: maybeIdx!, voltage: v!, current: i!, power: p! };
      })
      .filter((p): p is IVPoint => p !== null);
  }

  private assertWithin(value: number, min: number, max: number, name: string) {
    if (!Number.isFinite(value) || value < min || value > max) {
      throw new SCPIError(`${name} ${value} out of range [${min}, ${max}]`);
    }
  }

  // ---------- Transports ----------

  private async openSerialTransport(): Promise<Transport> {
    if (!this.options.comPort) throw new SCPIError('comPort is required for USB/RS232');
    const { SerialPort } = await import('serialport');
    const port = new SerialPort({
      path: this.options.comPort,
      baudRate: this.options.baudRate ?? 9600,
      autoOpen: false,
    });

    await new Promise<void>((resolve, reject) => {
      port.open((err) => (err ? reject(err) : resolve()));
    });

    let buffer = '';
    port.on('data', (chunk: Buffer) => {
      buffer += chunk.toString('ascii');
    });

    return {
      isOpen: () => port.isOpen,
      async write(data) {
        await new Promise<void>((resolve, reject) => {
          port.write(data, (err) => (err ? reject(err) : resolve()));
        });
      },
      async read(timeoutMs = 3000) {
        const deadline = Date.now() + timeoutMs;
        while (!buffer.includes('\n') && Date.now() < deadline) {
          await sleep(20);
        }
        const nl = buffer.indexOf('\n');
        if (nl === -1) throw new SCPIError('Read timeout');
        const line = buffer.slice(0, nl);
        buffer = buffer.slice(nl + 1);
        return line;
      },
      async close() {
        await new Promise<void>((resolve) => port.close(() => resolve()));
      },
    };
  }

  private async openTcpTransport(): Promise<Transport> {
    if (!this.options.ipAddress) throw new SCPIError('ipAddress required for Ethernet');
    const net = await import('node:net');
    const socket = new net.Socket();
    socket.setEncoding('ascii');
    socket.setNoDelay(true);

    await new Promise<void>((resolve, reject) => {
      socket.once('error', reject);
      socket.connect(this.options.tcpPort ?? 5025, this.options.ipAddress!, () => {
        socket.removeListener('error', reject);
        resolve();
      });
    });

    let buffer = '';
    socket.on('data', (data: string) => {
      buffer += data;
    });

    let open = true;
    socket.on('close', () => {
      open = false;
    });

    return {
      isOpen: () => open,
      async write(data) {
        await new Promise<void>((resolve, reject) => {
          socket.write(data, (err) => (err ? reject(err) : resolve()));
        });
      },
      async read(timeoutMs = 3000) {
        const deadline = Date.now() + timeoutMs;
        while (!buffer.includes('\n') && Date.now() < deadline) {
          await sleep(20);
        }
        const nl = buffer.indexOf('\n');
        if (nl === -1) throw new SCPIError('Read timeout');
        const line = buffer.slice(0, nl);
        buffer = buffer.slice(nl + 1);
        return line;
      },
      async close() {
        await new Promise<void>((resolve) => socket.end(() => resolve()));
      },
    };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ---------- IV curve metrics ----------

export function computeIVMetrics(points: IVPoint[]) {
  if (points.length === 0) {
    return { voc: 0, isc: 0, vmpp: 0, impp: 0, pmpp: 0, ff: 0 };
  }
  // ISC = current at V ≈ 0 (smallest |V|)
  const byAbsV = [...points].sort((a, b) => Math.abs(a.voltage) - Math.abs(b.voltage));
  const isc = byAbsV[0]!.current;
  // VOC = voltage at |I| ≈ 0
  const byAbsI = [...points].sort((a, b) => Math.abs(a.current) - Math.abs(b.current));
  const voc = byAbsI[0]!.voltage;
  // MPP = max power
  let mpp = points[0]!;
  for (const p of points) if (p.power > mpp.power) mpp = p;
  const ff = voc * isc === 0 ? 0 : mpp.power / (voc * isc);
  return { voc, isc, vmpp: mpp.voltage, impp: mpp.current, pmpp: mpp.power, ff };
}
