'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Activity, ArrowLeft, Play, Square } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const LiveIVChart = dynamic(
  () => import('@/components/LiveIVChart').then((m) => m.LiveIVChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

function ChartSkeleton() {
  return (
    <div className="flex h-[420px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
      Loading live IV chart…
    </div>
  );
}

interface SweepResult {
  metric: string;
  measured: string;
  corrected: string;
  unit: string;
}

const DEMO_RESULTS: SweepResult[] = [
  { metric: 'Isc', measured: '11.52', corrected: '11.47', unit: 'A' },
  { metric: 'Voc', measured: '49.48', corrected: '49.62', unit: 'V' },
  { metric: 'Imp', measured: '10.84', corrected: '10.79', unit: 'A' },
  { metric: 'Vmp', measured: '41.15', corrected: '41.24', unit: 'V' },
  { metric: 'Pmax', measured: '446.1', corrected: '445.0', unit: 'W' },
  { metric: 'FF', measured: '0.782', corrected: '0.783', unit: '—' },
];

export default function IvTracerPage() {
  const [moduleId, setModuleId] = useState('M-A01');
  const [irradiance, setIrradiance] = useState('1000');
  const [temperature, setTemperature] = useState('25');
  const [running, setRunning] = useState(false);

  return (
    <main className="container mx-auto max-w-7xl py-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to dashboard
      </Link>

      <header className="mb-8 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">IV Tracer</h1>
          <p className="text-sm text-muted-foreground">
            Run IEC 60891 corrected sweeps against the ESL-Solar 500
          </p>
        </div>
        <Badge variant={running ? 'success' : 'secondary'} className="ml-auto">
          {running ? 'Sweeping' : 'Idle'}
        </Badge>
      </header>

      <section className="mb-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Test parameters
          </h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="module-id">Module</Label>
              <Input
                id="module-id"
                value={moduleId}
                onChange={(e) => setModuleId(e.target.value)}
                placeholder="M-A01"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="irradiance">Irradiance (W/m²)</Label>
              <Input
                id="irradiance"
                type="number"
                value={irradiance}
                onChange={(e) => setIrradiance(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="temperature">Cell temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRunning(true)}
                disabled={running}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                Start
              </button>
              <button
                type="button"
                onClick={() => setRunning(false)}
                disabled={!running}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Square className="h-4 w-4" />
                Stop
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <LiveIVChart sessionId={`iv-${moduleId}`} height={400} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Sweep results</h2>
        <div className="rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead className="text-right">Measured</TableHead>
                <TableHead className="text-right">STC-corrected</TableHead>
                <TableHead>Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEMO_RESULTS.map((row) => (
                <TableRow key={row.metric}>
                  <TableCell className="font-medium">{row.metric}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.measured}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.corrected}</TableCell>
                  <TableCell className="text-muted-foreground">{row.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}
