// Surya Yantra — LiveIVChart
// Real-time IV + PV curve chart wired to the useIVStream hook.
// Renders an auto-scrolling time window, a status indicator, and pause/resume
// controls. Uses Recharts (declared as a dependency in apps/web/package.json).

'use client';

import { useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import useIVStream from '../hooks/useIVStream';
import type { IVStreamStatus } from '../types/iv-stream';

export interface LiveIVChartProps {
  sessionId: string;
  /** Size of the auto-scrolling window in points. */
  windowSize?: number;
  /** Max points retained in memory before the ring buffer wraps. */
  maxPoints?: number;
  /** Render height in px. */
  height?: number;
  className?: string;
}

const STATUS_LABEL: Record<IVStreamStatus, string> = {
  idle: 'Idle',
  connecting: 'Connecting…',
  connected: 'Connected',
  streaming: 'Streaming',
  paused: 'Paused',
  reconnecting: 'Reconnecting…',
  error: 'Error',
  closed: 'Closed',
};

const STATUS_COLOR: Record<IVStreamStatus, string> = {
  idle: '#9ca3af',
  connecting: '#f59e0b',
  connected: '#3b82f6',
  streaming: '#10b981',
  paused: '#f59e0b',
  reconnecting: '#f59e0b',
  error: '#ef4444',
  closed: '#6b7280',
};

function StatusIndicator({
  status,
  reconnectAttempt,
}: {
  status: IVStreamStatus;
  reconnectAttempt: number;
}) {
  const color = STATUS_COLOR[status];
  const pulsing = status === 'streaming' || status === 'connecting' || status === 'reconnecting';
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <span
        aria-hidden
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: color,
          boxShadow: pulsing ? `0 0 0 0 ${color}` : 'none',
          animation: pulsing ? 'iv-pulse 1.4s ease-out infinite' : 'none',
        }}
      />
      <span style={{ color }}>{STATUS_LABEL[status]}</span>
      {status === 'reconnecting' && reconnectAttempt > 0 ? (
        <span style={{ color: '#6b7280' }}>· attempt {reconnectAttempt}</span>
      ) : null}
      <style>{`@keyframes iv-pulse {
        0%   { box-shadow: 0 0 0 0 ${color}80; }
        70%  { box-shadow: 0 0 0 8px ${color}00; }
        100% { box-shadow: 0 0 0 0 ${color}00; }
      }`}</style>
    </div>
  );
}

export function LiveIVChart({
  sessionId,
  windowSize = 500,
  maxPoints = 5_000,
  height = 360,
  className,
}: LiveIVChartProps) {
  const {
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
    reconnect,
  } = useIVStream({ sessionId, maxPoints });

  const windowed = useMemo(
    () => (points.length <= windowSize ? points : points.slice(-windowSize)),
    [points, windowSize],
  );

  const chartData = useMemo(
    () =>
      windowed.map((p) => ({
        seq: p.seq,
        voltage: Number(p.voltage.toFixed(3)),
        current: Number(p.current.toFixed(3)),
        power: Number(p.power.toFixed(3)),
      })),
    [windowed],
  );

  return (
    <div className={className} style={{ width: '100%', fontFamily: 'system-ui, sans-serif' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <StatusIndicator status={status} reconnectAttempt={reconnectAttempt} />
          {meta ? (
            <span style={{ fontSize: 12, color: '#6b7280' }}>
              {meta.loadMode} · {meta.startV}–{meta.stopV} V · {meta.sampleRateHz} Hz
            </span>
          ) : null}
          {latest ? (
            <span style={{ fontSize: 12, color: '#374151' }}>
              V={latest.voltage.toFixed(2)} I={latest.current.toFixed(2)} P={latest.power.toFixed(1)}
            </span>
          ) : null}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={isPaused ? resume : pause}
            aria-pressed={isPaused}
            disabled={status === 'error' || status === 'closed'}
            style={buttonStyle(isPaused ? '#10b981' : '#f59e0b')}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button type="button" onClick={clear} style={buttonStyle('#6b7280')}>
            Clear
          </button>
          <button
            type="button"
            onClick={reconnect}
            disabled={status === 'connecting'}
            style={buttonStyle('#3b82f6')}
          >
            Reconnect
          </button>
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '6px 10px',
            borderRadius: 6,
            fontSize: 12,
            marginBottom: 8,
          }}
        >
          {error.code}: {error.message}
        </div>
      ) : null}

      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="voltage"
            type="number"
            domain={['auto', 'auto']}
            tickFormatter={(v: number) => `${v}V`}
            stroke="#6b7280"
            fontSize={11}
          />
          <YAxis
            yAxisId="current"
            type="number"
            domain={['auto', 'auto']}
            tickFormatter={(v: number) => `${v}A`}
            stroke="#0ea5e9"
            fontSize={11}
          />
          <YAxis
            yAxisId="power"
            orientation="right"
            type="number"
            domain={['auto', 'auto']}
            tickFormatter={(v: number) => `${v}W`}
            stroke="#f97316"
            fontSize={11}
          />
          <Tooltip
            formatter={(value: number, name: string) => [value.toFixed(3), name]}
            labelFormatter={(v: number) => `V=${v}`}
          />
          <Legend />
          <Line
            yAxisId="current"
            type="monotone"
            dataKey="current"
            name="Current (A)"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            yAxisId="power"
            type="monotone"
            dataKey="power"
            name="Power (W)"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div style={{ marginTop: 4, fontSize: 11, color: '#9ca3af' }}>
        showing {windowed.length} of {points.length} points (buffer cap {maxPoints})
      </div>
    </div>
  );
}

function buttonStyle(color: string): React.CSSProperties {
  return {
    background: color,
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: 6,
    fontSize: 12,
    cursor: 'pointer',
    fontWeight: 500,
  };
}

export default LiveIVChart;
