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

export interface IVChartPoint {
  voltage: number;
  current: number;
  power?: number;
}

export interface IVChartProps {
  data: IVChartPoint[];
  compareData?: IVChartPoint[];
  height?: number;
  label?: string;
  compareLabel?: string;
}

export function IVChart({
  data,
  compareData,
  height = 380,
  label = 'Measured',
  compareLabel = 'STC-corrected',
}: IVChartProps) {
  const merged = useMemo(() => {
    return data.map((p, i) => ({
      voltage: Number(p.voltage.toFixed(3)),
      current: Number(p.current.toFixed(4)),
      power: Number(((p.power ?? p.voltage * p.current) ?? 0).toFixed(3)),
      currentCompare: compareData?.[i]
        ? Number(compareData[i]!.current.toFixed(4))
        : undefined,
      powerCompare: compareData?.[i]
        ? Number(
            (
              compareData[i]!.power ??
              compareData[i]!.voltage * compareData[i]!.current
            ).toFixed(3),
          )
        : undefined,
    }));
  }, [data, compareData]);

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={merged} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="voltage"
            type="number"
            domain={['dataMin', 'dataMax']}
            label={{ value: 'Voltage (V)', position: 'insideBottom', offset: -5 }}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            yAxisId="i"
            orientation="left"
            label={{ value: 'Current (A)', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            yAxisId="p"
            orientation="right"
            label={{ value: 'Power (W)', angle: 90, position: 'insideRight' }}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              fontSize: 12,
            }}
          />
          <Legend />
          <Line
            yAxisId="i"
            type="monotone"
            dataKey="current"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            name={`I — ${label}`}
          />
          <Line
            yAxisId="p"
            type="monotone"
            dataKey="power"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name={`P — ${label}`}
          />
          {compareData && (
            <>
              <Line
                yAxisId="i"
                type="monotone"
                dataKey="currentCompare"
                stroke="#ef4444"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
                name={`I — ${compareLabel}`}
              />
              <Line
                yAxisId="p"
                type="monotone"
                dataKey="powerCompare"
                stroke="#10b981"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
                name={`P — ${compareLabel}`}
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
