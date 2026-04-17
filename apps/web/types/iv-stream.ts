// Surya Yantra — IV streaming shared types
// Used by both the Socket.IO server and the React client hook.

export interface IVStreamPoint {
  t: number;       // timestamp (ms since epoch)
  seq: number;     // monotonically increasing sequence number
  voltage: number; // volts
  current: number; // amps
  power: number;   // watts
}

export interface IVStreamMeta {
  sessionId: string;
  moduleSerial?: string;
  loadMode: 'CC' | 'CV' | 'CR' | 'CP' | 'MPP_TRACK' | 'MPP_SCAN' | 'IV_SWEEP';
  startV: number;
  stopV: number;
  stepCount: number;
  sampleRateHz: number;
  startedAt: number;
}

export interface IVStreamError {
  code: string;
  message: string;
  recoverable: boolean;
  at: number;
}

export type IVStreamStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'streaming'
  | 'paused'
  | 'reconnecting'
  | 'error'
  | 'closed';

// Socket.IO event map — keep server + client in sync.
export interface ServerToClientEvents {
  'iv:meta': (meta: IVStreamMeta) => void;
  'iv:point': (point: IVStreamPoint) => void;
  'iv:batch': (points: IVStreamPoint[]) => void;
  'iv:end': (reason: string) => void;
  'iv:error': (err: IVStreamError) => void;
}

export interface ClientToServerEvents {
  'iv:subscribe': (sessionId: string) => void;
  'iv:unsubscribe': (sessionId: string) => void;
  'iv:pause': () => void;
  'iv:resume': () => void;
}
