'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConditionsPanel } from '@/components/ConditionsPanel';
import { Save } from 'lucide-react';

interface Reading {
  gPoa: number;
  tCell: number;
  tAmbient: number;
  tModule: number | null;
  windSpeed: number | null;
  aoi: number | null;
  airmass: number | null;
}

export default function ConditionsPage() {
  const [latest, setLatest] = useState<Reading | null>(null);
  const [form, setForm] = useState({
    gPoa: '980',
    tCell: '45',
    tAmbient: '32',
    tModule: '',
    windSpeed: '',
    aoi: '15',
    airmass: '1.5',
  });
  const [busy, setBusy] = useState(false);

  async function load() {
    const r = await fetch('/api/conditions/latest').then((x) => x.json());
    setLatest(r.reading);
  }
  useEffect(() => {
    load();
  }, []);

  async function submit() {
    setBusy(true);
    await fetch('/api/conditions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gPoa: Number.parseFloat(form.gPoa),
        tCell: Number.parseFloat(form.tCell),
        tAmbient: Number.parseFloat(form.tAmbient),
        tModule: form.tModule ? Number.parseFloat(form.tModule) : undefined,
        windSpeed: form.windSpeed ? Number.parseFloat(form.windSpeed) : undefined,
        aoi: form.aoi ? Number.parseFloat(form.aoi) : undefined,
        airmass: form.airmass ? Number.parseFloat(form.airmass) : undefined,
      }),
    });
    setBusy(false);
    load();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Environmental</h1>
        <p className="text-muted-foreground">
          POA irradiance, cell/ambient temperature, AOI — used for IEC 60891 correction.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Latest Reading</CardTitle>
        </CardHeader>
        <CardContent>
          <ConditionsPanel c={latest} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Log New Reading</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="G_POA (W/m²)" v={form.gPoa} k="gPoa" onChange={setForm} form={form} />
            <Field label="T cell (°C)" v={form.tCell} k="tCell" onChange={setForm} form={form} />
            <Field
              label="T ambient (°C)"
              v={form.tAmbient}
              k="tAmbient"
              onChange={setForm}
              form={form}
            />
            <Field
              label="T module (°C)"
              v={form.tModule}
              k="tModule"
              onChange={setForm}
              form={form}
            />
            <Field
              label="Wind (m/s)"
              v={form.windSpeed}
              k="windSpeed"
              onChange={setForm}
              form={form}
            />
            <Field label="AOI (°)" v={form.aoi} k="aoi" onChange={setForm} form={form} />
            <Field label="Airmass" v={form.airmass} k="airmass" onChange={setForm} form={form} />
          </div>
          <Button onClick={submit} disabled={busy} className="mt-4">
            <Save className="mr-2 h-4 w-4" /> Save reading
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  v,
  k,
  onChange,
  form,
}: {
  label: string;
  v: string;
  k: string;
  onChange: (f: any) => void;
  form: Record<string, string>;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input
        type="number"
        step="any"
        value={v}
        onChange={(e) => onChange({ ...form, [k]: e.target.value })}
      />
    </div>
  );
}
