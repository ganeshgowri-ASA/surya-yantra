// Surya Yantra — Socket.IO server for real-time IV curve streaming
//
// Exposes a singleton `getIVSocketServer()` that attaches a Socket.IO server
// to the provided Node HTTP server. The server listens for client subscriptions
// to a `sessionId`, relays points published via `publishIVPoint()` and
// broadcasts meta/end/error events to subscribers of that session.
//
// Publishing is process-local (the SCPI sampler imports `publishIVPoint`
// directly). For multi-instance deployments swap the internal EventEmitter
// for a Redis adapter — the public API stays the same.

import { EventEmitter } from 'node:events';
import type { Server as HTTPServer } from 'node:http';
import { Server as IOServer, type Socket } from 'socket.io';
import type {
  ClientToServerEvents,
  IVStreamError,
  IVStreamMeta,
  IVStreamPoint,
  ServerToClientEvents,
} from '../types/iv-stream';

type TypedIO = IOServer<ClientToServerEvents, ServerToClientEvents>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

const IV_PATH = '/api/ws';
const MAX_POINTS_PER_SESSION = 10_000;
const PING_INTERVAL_MS = 20_000;
const PING_TIMEOUT_MS = 10_000;

interface SessionBuffer {
  meta?: IVStreamMeta;
  points: IVStreamPoint[];
  ended: boolean;
  endReason?: string;
}

// Process-local pub/sub. Replace with Redis adapter for horizontal scale.
const bus = new EventEmitter();
bus.setMaxListeners(0);

const sessionBuffers = new Map<string, SessionBuffer>();
const pausedSockets = new WeakSet<TypedSocket>();

let ioInstance: TypedIO | null = null;

function roomForSession(sessionId: string): string {
  return `iv:${sessionId}`;
}

function getOrCreateBuffer(sessionId: string): SessionBuffer {
  let buf = sessionBuffers.get(sessionId);
  if (!buf) {
    buf = { points: [], ended: false };
    sessionBuffers.set(sessionId, buf);
  }
  return buf;
}

export function publishIVMeta(meta: IVStreamMeta): void {
  const buf = getOrCreateBuffer(meta.sessionId);
  buf.meta = meta;
  buf.ended = false;
  buf.endReason = undefined;
  buf.points = [];
  bus.emit(`meta:${meta.sessionId}`, meta);
  ioInstance?.to(roomForSession(meta.sessionId)).emit('iv:meta', meta);
}

export function publishIVPoint(sessionId: string, point: IVStreamPoint): void {
  const buf = getOrCreateBuffer(sessionId);
  buf.points.push(point);
  if (buf.points.length > MAX_POINTS_PER_SESSION) {
    buf.points.splice(0, buf.points.length - MAX_POINTS_PER_SESSION);
  }
  bus.emit(`point:${sessionId}`, point);
  ioInstance?.to(roomForSession(sessionId)).emit('iv:point', point);
}

export function publishIVEnd(sessionId: string, reason: string): void {
  const buf = getOrCreateBuffer(sessionId);
  buf.ended = true;
  buf.endReason = reason;
  bus.emit(`end:${sessionId}`, reason);
  ioInstance?.to(roomForSession(sessionId)).emit('iv:end', reason);
}

export function publishIVError(sessionId: string, err: IVStreamError): void {
  bus.emit(`error:${sessionId}`, err);
  ioInstance?.to(roomForSession(sessionId)).emit('iv:error', err);
}

export function clearSessionBuffer(sessionId: string): void {
  sessionBuffers.delete(sessionId);
}

function handleSubscribe(socket: TypedSocket, sessionId: string): void {
  if (!sessionId || typeof sessionId !== 'string') {
    socket.emit('iv:error', {
      code: 'BAD_SESSION_ID',
      message: 'sessionId must be a non-empty string',
      recoverable: false,
      at: Date.now(),
    });
    return;
  }
  const room = roomForSession(sessionId);
  void socket.join(room);

  // Replay cached state so late subscribers catch up.
  const buf = sessionBuffers.get(sessionId);
  if (buf?.meta) socket.emit('iv:meta', buf.meta);
  if (buf && buf.points.length > 0) socket.emit('iv:batch', buf.points);
  if (buf?.ended) socket.emit('iv:end', buf.endReason ?? 'completed');
}

function handleUnsubscribe(socket: TypedSocket, sessionId: string): void {
  void socket.leave(roomForSession(sessionId));
}

export function getIVSocketServer(httpServer: HTTPServer): TypedIO {
  if (ioInstance) return ioInstance;

  const io: TypedIO = new IOServer(httpServer, {
    path: IV_PATH,
    pingInterval: PING_INTERVAL_MS,
    pingTimeout: PING_TIMEOUT_MS,
    cors: { origin: true, credentials: true },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    socket.on('iv:subscribe', (sessionId) => handleSubscribe(socket, sessionId));
    socket.on('iv:unsubscribe', (sessionId) => handleUnsubscribe(socket, sessionId));
    socket.on('iv:pause', () => {
      pausedSockets.add(socket);
    });
    socket.on('iv:resume', () => {
      pausedSockets.delete(socket);
    });

    socket.on('disconnect', () => {
      pausedSockets.delete(socket);
    });

    socket.on('error', (err) => {
      // Surface to observability; avoid throwing so other sockets stay up.
      console.error('[iv-ws] socket error', err);
    });
  });

  io.engine.on('connection_error', (err) => {
    console.error('[iv-ws] connection_error', err.code, err.message);
  });

  ioInstance = io;
  return io;
}

export function shutdownIVSocketServer(): Promise<void> {
  const io = ioInstance;
  ioInstance = null;
  sessionBuffers.clear();
  if (!io) return Promise.resolve();
  return new Promise((resolve) => io.close(() => resolve()));
}
