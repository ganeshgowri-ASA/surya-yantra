'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Download } from 'lucide-react';
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

type Procedure = 'P1' | 'P2' | 'P3' | 'P4';

interface ProcedureInfo {
  id: Procedure;
  title: string;
  description: string;
}

const PROCEDURES: ProcedureInfo[] = [
  { id: 'P1', title: 'P1 — Linear', description: 'Classical linear correction. Requires α, β, Rs, κ.' },
  { id: 'P2', title: 'P2 — Multiplicative', description: 'Relative temperature coefficients and multiplicative irradiance.' },
  { id: 'P3', title: 'P3 — Bilinear', description: 'Interpolates across two reference IV curves at different G, T.' },
  { id: 'P4', title: 'P4 — Combined', description: 'Parametric correction with Rs, Rsh, and voltage scaling.' },
];

interface MeasuredInputs {
  isc: string;
  voc: string;
  g1: string;
  t1: string;
  alpha: string;
  beta: string;
  rs: string;
  kappa: string;
}

const DEFAULT_INPUTS: MeasuredInputs = {
  isc: '11.52',
  voc: '49.48',
  g1: '987',
  t1: '42.5',
  alpha: '0.0048',
  beta: '-0.124',
  rs: '0.35',
  kappa: '0.00012',
};

const STC_G = 1000;
const STC_T = 25;

function correctP1(i: MeasuredInputs) {
  const isc = parseFloat(i.isc);
  const voc = parseFloat(i.voc);
  const g1 = parseFloat(i.g1);
  const t1 = parseFloat(i.t1);
  const alpha = parseFloat(i.alpha);
  const beta = parseFloat(i.beta);
  const rs = parseFloat(i.rs);
  const kappa = parseFloat(i.kappa);
  const dT = STC_T - t1;
  const isc2 = isc + isc * (STC_G / g1 - 1) + alpha * dT;
  const voc2 = voc - rs * (isc2 - isc) - kappa * isc2 * dT + beta * dT;
  return { isc2, voc2 };
}

export default function CorrectionsPage() {
  const [active, setActive] = useState<Procedure>('P1');
  const [inputs, setInputs] = useState<MeasuredInputs>(DEFAULT_INPUTS);

  const corrected = useMemo(() => correctP1(inputs), [inputs]);

  const update = (key: keyof MeasuredInputs) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs((s) => ({ ...s, [key]: e.target.value }));

  const handleExport = () => {
    const payload = { procedure: active, inputs, corrected, stc: { g: STC_G, t: STC_T } };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iec60891-${active}-correction.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
          <Calculator className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">IEC Corrections</h1>
          <p className="text-sm text-muted-foreground">
            Apply P1–P4 temperature/irradiance corrections to STC
          </p>
        </div>
        <Badge variant="outline" className="ml-auto">
          IEC 60891:2021
        </Badge>
      </header>

      <nav
        role="tablist"
        aria-label="IEC 60891 procedures"
        className="mb-6 inline-flex rounded-lg border bg-card p-1 shadow-sm"
      >
        {PROCEDURES.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={active === p.id}
            onClick={() => setActive(p.id)}
            className={
              active === p.id
                ? 'rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground shadow'
                : 'rounded-md px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground'
            }
          >
            {p.id}
          </button>
        ))}
      </nav>

      <section className="mb-6 rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="text-base font-semibold">{PROCEDURES.find((p) => p.id === active)!.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {PROCEDURES.find((p) => p.id === active)!.description}
        </p>
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Measured data
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field id="isc" label="Isc (A)" value={inputs.isc} onChange={update('isc')} />
            <Field id="voc" label="Voc (V)" value={inputs.voc} onChange={update('voc')} />
            <Field id="g1" label="Irradiance G1 (W/m²)" value={inputs.g1} onChange={update('g1')} />
            <Field id="t1" label="Temperature T1 (°C)" value={inputs.t1} onChange={update('t1')} />
            <Field id="alpha" label="α (A/°C)" value={inputs.alpha} onChange={update('alpha')} />
            <Field id="beta" label="β (V/°C)" value={inputs.beta} onChange={update('beta')} />
            <Field id="rs" label="Rs (Ω)" value={inputs.rs} onChange={update('rs')} />
            <Field id="kappa" label="κ (Ω/°C)" value={inputs.kappa} onChange={update('kappa')} />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              STC-corrected result
            </h2>
            <Badge variant="secondary">G = {STC_G} W/m² · T = {STC_T} °C</Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead className="text-right">Measured</TableHead>
                <TableHead className="text-right">Corrected</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Isc</TableCell>
                <TableCell className="text-right tabular-nums">{parseFloat(inputs.isc).toFixed(3)} A</TableCell>
                <TableCell className="text-right tabular-nums">{corrected.isc2.toFixed(3)} A</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Voc</TableCell>
                <TableCell className="text-right tabular-nums">{parseFloat(inputs.voc).toFixed(3)} V</TableCell>
                <TableCell className="text-right tabular-nums">{corrected.voc2.toFixed(3)} V</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <button
            type="button"
            onClick={handleExport}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            <Download className="h-4 w-4" />
            Export corrected data (JSON)
          </button>
        </div>
      </section>
    </main>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={onChange} inputMode="decimal" />
    </div>
  );
}
