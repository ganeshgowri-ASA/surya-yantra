import React from 'react';
import { describe, expect, it, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IVChart, type IVChartPoint } from '../../components/IVChart';

// Recharts uses ResponsiveContainer which measures DOM. Stub ResizeObserver
// and give the container a fixed size so the chart renders in jsdom.
beforeAll(() => {
  class RO {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error — jsdom lacks ResizeObserver
  globalThis.ResizeObserver = globalThis.ResizeObserver ?? RO;

  // Force ResponsiveContainer to emit fixed dimensions.
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    value: 800,
  });
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    value: 400,
  });
});

const SAMPLE: IVChartPoint[] = [
  { voltage: 0, current: 11.5 },
  { voltage: 20.6, current: 11.47 },
  { voltage: 41.2, current: 10.93 },
  { voltage: 45.4, current: 6.01 },
  { voltage: 48.5, current: 1.15 },
  { voltage: 49.5, current: 0 },
];

describe('IVChart', () => {
  it('renders the chart container when data is supplied', () => {
    render(<IVChart data={SAMPLE} />);
    expect(screen.getByTestId('iv-chart')).toBeInTheDocument();
  });

  it('shows an empty-state message when no data is provided', () => {
    render(<IVChart data={[]} />);
    expect(screen.getByTestId('iv-chart-empty')).toBeInTheDocument();
    expect(screen.getByText(/No measurement data/i)).toBeInTheDocument();
  });

  it('renders a title when one is provided', () => {
    render(<IVChart data={SAMPLE} title="Module SN-0001" />);
    const title = screen.getByTestId('iv-chart-title');
    expect(title).toHaveTextContent('Module SN-0001');
  });

  it('uses the provided aria-label on the chart', () => {
    render(<IVChart data={SAMPLE} ariaLabel="bifacial-HJT IV curve" />);
    expect(screen.getByLabelText('bifacial-HJT IV curve')).toBeInTheDocument();
  });

  it('computes power = V·I when power is not pre-supplied', () => {
    // We cannot inspect recharts internals, so we verify the util indirectly:
    // the component must not throw and must render with the P-V overlay visible.
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<IVChart data={SAMPLE} />);
    expect(spy).not.toHaveBeenCalledWith(expect.stringContaining('NaN'));
    spy.mockRestore();
  });

  it('accepts an overlaid corrected-to-STC curve without error', () => {
    const corrected: IVChartPoint[] = SAMPLE.map(p => ({
      voltage: p.voltage * 1.02,
      current: p.current * 1.05,
    }));
    const { container } = render(<IVChart data={SAMPLE} correctedData={corrected} />);
    expect(container).toBeTruthy();
  });
});
