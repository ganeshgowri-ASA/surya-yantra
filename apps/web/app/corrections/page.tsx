'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { IVChart, IVChartPoint } from '@/components/IVChart';
import { CorrectionPanel, CorrectionConfig } from '@/components/CorrectionPanel';
import { Loader2, Wand2 } from 'lucide-react';

export default function CorrectionsPage() {
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [measurementId, setMeasurementId] = useState<string>('');
  const [raw, setRaw] = useState<IVChartPoint[]>([]);
  const [corrected, setCorrected] = useState<IVChartPoint[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [config, setConfig] = useState<CorrectionConfig>({
    procedure: 'P1',
    smmfEnabled: false,
    iamEnabled: false,
    aoiDeg: 15,
    beamFraction: 0.85,
  });

  useEffect(() => {
    fetch('/api/measurements?limit=100')
      .then((r) => r.json())
      .then((d) => {
        setMeasurements(d.measurements ?? []);
        if (d.measurements?.[0]) setMeasurementId(d.measurements[0].id);
      });
  }, []);

  async function applyCorrection() {
    if (!measurementId) return;
    setBusy(true);
    try {
      // Load raw curve
      const mRes = await fetch(`/api/measurements?limit=1&sessionId=__notused__`).catch(
        () => null,
      );
      // Fetch the session to get raw points
      const m = measurements.find((x) => x.id === measurementId);
      if (!m) return;
      const sessionRes = await fetch(`/api/iv-trace?sessionId=${m.sessionId}`).then((r) =>
        r.json(),
      );
      const match = sessionRes.session?.measurements?.find((x: any) => x.id === measurementId);
      setRaw(
        match?.rawCurvePoints?.map((p: any) => ({
          voltage: p.voltage,
          current: p.current,
          power: p.power,
        })) ?? [],
      );

      const res = await fetch('/api/corrections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          measurementId,
          procedure: config.procedure,
          aoiDeg: config.iamEnabled ? config.aoiDeg : undefined,
          beamFraction: config.beamFraction,
          applySmmf: config.smmfEnabled,
          rsOverride: config.rsOverride,
          kappaOverride: config.kappaOverride,
        }),
      });
      const data = await res.json();
      if (data.result) {
        setCorrected(
          data.result.corrected.map((p: any) => ({
            voltage: p.voltage,
            current: p.current,
            power: p.voltage * p.current,
          })),
        );
        setMetrics(data.result.metrics);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">IEC 60891 Corrections</h1>
        <p className="text-muted-foreground">
          Correct IV curves to STC (1000 W/m², 25 °C, AM1.5G) — P1–P4, SMMF, IAM
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle>Raw vs STC-Corrected Curve</CardTitle>
          </CardHeader>
          <CardContent>
            {raw.length > 0 ? (
              <>
                <IVChart data={raw} compareData={corrected.length ? corrected : undefined} />
                {metrics && (
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
                    <Metric label="Voc STC" v={`${metrics.voc.toFixed(2)} V`} />
                    <Metric label="Isc STC" v={`${metrics.isc.toFixed(2)} A`} />
                    <Metric label="Vmpp" v={`${metrics.vmpp.toFixed(2)} V`} />
                    <Metric label="Impp" v={`${metrics.impp.toFixed(2)} A`} />
                    <Metric label="Pmpp" v={`${metrics.pmpp.toFixed(1)} W`} />
                    <Metric label="FF" v={metrics.ff.toFixed(3)} />
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-96 items-center justify-center text-sm text-muted-foreground">
                Select a measurement and click Apply.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Correction Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Measurement</Label>
              <Select value={measurementId} onValueChange={setMeasurementId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select measurement" />
                </SelectTrigger>
                <SelectContent>
                  {measurements.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.module.serialNumber} · {new Date(m.measuredAt).toLocaleString()}
                    </SelectItem>
                  ))}
                  {measurements.length === 0 && (
                    <SelectItem value="__none__" disabled>
                      No measurements yet
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <CorrectionPanel value={config} onChange={setConfig} />

            <Button
              onClick={applyCorrection}
              disabled={busy || !measurementId}
              className="w-full"
              size="lg"
            >
              {busy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Correcting…
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" /> Apply {config.procedure}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, v }: { label: string; v: string }) {
  return (
    <div className="rounded-md border bg-background p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{v}</div>
    </div>
  );
}
