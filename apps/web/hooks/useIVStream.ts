// Surya Yantra — useIVStream hook
//
// Subscribes to a live IV curve over Socket.IO at `/api/ws`, with:
//   - status lifecycle (idle → connecting → connected → streaming → …)
//   - automatic reconnection with exponential backoff + jitter
//   - local pause/resume (buffers server points instead of dropping the socket)
//   - capped ring buffer so long sessions don't balloon memory
//   - full cleanup on unmount / session change

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import type {
  ClientToServerEvents,
  IVStreamError,
  IVStreamMeta,
  IVStreamPoint,
  IVStreamStatus,
  ServerToClientEvents,
} from '../types/iv-stream';

type IVSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export interface UseIVStreamOptions {
  sessionId: string;
  url?: string;             // defaults to same-origin
  path?: string;            // defaults to '/api/ws'
  maxPoints?: number;       // ring-buffer size, default 5000
  autoConnect?: boolean;    // default true
  reconnectionAttempts?: number; // default Infinity
}

export interface UseIVStreamResult {
  status: IVStreamStatus;
  points: IVStreamPoint[];
  latest: IVStreamPoint | null;
  meta: IVStreamMeta | null;
  error: IVStreamError | null;
  isPaused: boolean;
  reconnectAttempt: number;
  pause: () => void;
  resume: () => void;
  clear: () => void;
  disconnect: () => void;
  reconnect: () => void;
}

const DEFAULT_PATH = '/api/ws';
const DEFAULT_MAX_POINTS = 5_000;
const BASE_RECONNECT_DELAY_MS = 500;
const MAX_RECONNECT_DELAY_MS = 15_000;

function resolveUrl(explicit?: string): string | undefined {
  if (explicit) return explicit;
  if (typeof window === 'undefined') return undefined;
  return window.location.origin;
}

export function useIVStream(options: UseIVStreamOptions): UseIVStreamResult {
  const {
    sessionId,
    url,
    path = DEFAULT_PATH,
    maxPoints = DEFAULT_MAX_POINTS,
    autoConnect = true,
    reconnectionAttempts = Number.POSITIVE_INFINITY,
  } = options;

  const [status, setStatus] = useState<IVStreamStatus>('idle');
  const [points, setPoints] = useState<IVStreamPoint[]>([]);
  const [meta, setMeta] = useState<IVStreamMeta | null>(null);
  const [error, setError] = useState<IVStreamError | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  const socketRef = useRef<IVSocket | null>(null);
  const pausedRef = useRef(false);
  const pendingRef = useRef<IVStreamPoint[]>([]);
  const unmountedRef = useRef(false);

  const appendPoints = useCallback(
    (incoming: IVStreamPoint[]) => {
      if (incoming.length === 0) return;
      setPoints((prev) => {
        const next = prev.length + incoming.length > maxPoints
          ? [...prev, ...incoming].slice(-maxPoints)
          : [...prev, ...incoming];
        return next;
      });
    },
    [maxPoints],
  );

  const flushPending = useCallback(() => {
    if (pendingRef.current.length === 0) return;
    const drained = pendingRef.current;
    pendingRef.current = [];
    appendPoints(drained);
  }, [appendPoints]);

  const pause = useCallback(() => {
    pausedRef.current = true;
    setIsPaused(true);
    socketRef.current?.emit('iv:pause');
    setStatus((s) => (s === 'streaming' ? 'paused' : s));
  }, []);

  const resume = useCallback(() => {
    pausedRef.current = false;
    setIsPaused(false);
    socketRef.current?.emit('iv:resume');
    flushPending();
    setStatus((s) => (s === 'paused' ? 'streaming' : s));
  }, [flushPending]);

  const clear = useCallback(() => {
    setPoints([]);
    pendingRef.current = [];
  }, []);

  const disconnect = useCallback(() => {
    const s = socketRef.current;
    socketRef.current = null;
    if (s) {
      s.removeAllListeners();
      s.disconnect();
    }
    setStatus('closed');
  }, []);

  const connect = useCallback(() => {
    if (!sessionId) return;
    const resolvedUrl = resolveUrl(url);
    if (!resolvedUrl) return;

    // Tear down any prior socket before creating a new one.
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setStatus('connecting');
    setError(null);

    const socket: IVSocket = io(resolvedUrl, {
      path,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts,
      reconnectionDelay: BASE_RECONNECT_DELAY_MS,
      reconnectionDelayMax: MAX_RECONNECT_DELAY_MS,
      randomizationFactor: 0.5,
      timeout: 10_000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      if (unmountedRef.current) return;
      setReconnectAttempt(0);
      setStatus('connected');
      socket.emit('iv:subscribe', sessionId);
      if (pausedRef.current) socket.emit('iv:pause');
    });

    socket.on('disconnect', (reason) => {
      if (unmountedRef.current) return;
      setStatus(reason === 'io client disconnect' ? 'closed' : 'reconnecting');
    });

    socket.io.on('reconnect_attempt', (attempt) => {
      if (unmountedRef.current) return;
      setReconnectAttempt(attempt);
      setStatus('reconnecting');
    });

    socket.io.on('reconnect_failed', () => {
      if (unmountedRef.current) return;
      setStatus('error');
      setError({
        code: 'RECONNECT_FAILED',
        message: 'Exhausted reconnection attempts',
        recoverable: false,
        at: Date.now(),
      });
    });

    socket.on('connect_error', (err) => {
      if (unmountedRef.current) return;
      setError({
        code: 'CONNECT_ERROR',
        message: err.message ?? 'connect error',
        recoverable: true,
        at: Date.now(),
      });
    });

    socket.on('iv:meta', (incoming) => {
      if (unmountedRef.current) return;
      setMeta(incoming);
      setStatus('streaming');
    });

    socket.on('iv:point', (point) => {
      if (unmountedRef.current) return;
      if (pausedRef.current) {
        pendingRef.current.push(point);
        if (pendingRef.current.length > maxPoints) {
          pendingRef.current.splice(0, pendingRef.current.length - maxPoints);
        }
        return;
      }
      appendPoints([point]);
      setStatus((s) => (s === 'connected' ? 'streaming' : s));
    });

    socket.on('iv:batch', (batch) => {
      if (unmountedRef.current) return;
      if (pausedRef.current) {
        pendingRef.current.push(...batch);
        if (pendingRef.current.length > maxPoints) {
          pendingRef.current.splice(0, pendingRef.current.length - maxPoints);
        }
        return;
      }
      appendPoints(batch);
      setStatus((s) => (s === 'connected' ? 'streaming' : s));
    });

    socket.on('iv:end', () => {
      if (unmountedRef.current) return;
      setStatus('closed');
    });

    socket.on('iv:error', (err) => {
      if (unmountedRef.current) return;
      setError(err);
      if (!err.recoverable) setStatus('error');
    });
  }, [sessionId, url, path, reconnectionAttempts, appendPoints, maxPoints]);

  const reconnect = useCallback(() => {
    disconnect();
    setPoints([]);
    pendingRef.current = [];
    connect();
  }, [connect, disconnect]);

  useEffect(() => {
    unmountedRef.current = false;
    if (!autoConnect || !sessionId) return;
    connect();
    return () => {
      unmountedRef.current = true;
      const s = socketRef.current;
      socketRef.current = null;
      if (s) {
        try {
          s.emit('iv:unsubscribe', sessionId);
        } catch {
          // socket may already be closed; swallow
        }
        s.removeAllListeners();
        s.disconnect();
      }
    };
  }, [autoConnect, sessionId, connect]);

  const latest = useMemo<IVStreamPoint | null>(
    () => (points.length > 0 ? points[points.length - 1] : null),
    [points],
  );

  return {
    status,
    points,
    latest,
    meta,
    error,
    isPaused,
    reconnectAttempt,
    pause,
    resume,
    clear,
    disconnect,
    reconnect,
  };
}

export default useIVStream;
