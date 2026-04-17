import * as React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export interface IVChartPoint {
  voltage: number;
  current: number;
  /** Optional instantaneous power (V·I). Computed if absent. */
  power?: number;
}

export interface IVChartProps {
  data: IVChartPoint[];
  /** Optional overlaid, corrected-to-STC curve for comparison. */
  correctedData?: IVChartPoint[];
  /** Hide the power (PV) curve overlay. */
  hidePower?: boolean;
  /** Chart title rendered above the plot. */
  title?: string;
  /** Accessible label — used when rendering headlessly. */
  ariaLabel?: string;
  /** Height in pixels (passed to ResponsiveContainer wrapper). */
  height?: number;
}

function withPower(points: IVChartPoint[]): IVChartPoint[] {
  return points.map(p => ({
    voltage: p.voltage,
    current: p.current,
    power: p.power ?? p.voltage * p.current,
  }));
}

/**
 * IVChart — displays the measured I-V curve and the derived P-V curve.
 * Optionally overlays the corrected (STC-translated) curve for comparison.
 */
export function IVChart({
  data,
  correctedData,
  hidePower = false,
  title,
  ariaLabel = 'IV curve',
  height = 360,
}: IVChartProps) {
  if (!data || data.length === 0) {
    return (
      <div role="status" aria-label="no-data" data-testid="iv-chart-empty">
        No measurement data
      </div>
    );
  }

  const measured = withPower(data);
  const corrected = correctedData ? withPower(correctedData) : undefined;

  return (
    <div data-testid="iv-chart" aria-label={ariaLabel}>
      {title ? <h3 data-testid="iv-chart-title">{title}</h3> : null}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={measured}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="voltage"
            type="number"
            label={{ value: 'Voltage (V)', position: 'insideBottom', offset: -5 }}
          />
          <YAxis yAxisId="left" label={{ value: 'Current (A)', angle: -90, position: 'insideLeft' }} />
          {!hidePower ? (
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: 'Power (W)', angle: 90, position: 'insideRight' }}
            />
          ) : null}
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="current"
            name="I (measured)"
            stroke="#2563eb"
            dot={false}
            isAnimationActive={false}
          />
          {!hidePower ? (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="power"
              name="P"
              stroke="#f59e0b"
              dot={false}
              isAnimationActive={false}
            />
          ) : null}
          {corrected ? (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="current"
              data={corrected}
              name="I (STC)"
              stroke="#10b981"
              strokeDasharray="5 5"
              dot={false}
              isAnimationActive={false}
            />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default IVChart;
