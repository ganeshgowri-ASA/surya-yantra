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
import { Badge } from '@/components/ui/badge';
import { IVChart, IVChartPoint } from '@/components/IVChart';
import { LoadControl, SweepConfig } from '@/components/LoadControl';
import { Play, Loader2, Zap } from 'lucide-react';

interface ModuleLite {
  id: string;
  serialNumber: string;
  moduleType: { modelName: string };
}

export default function IVTracePage() {
  const [modules, setModules] = useState<ModuleLite[]>([]);
  const [moduleId, setModuleId] = useState<string>('');
  const [running, setRunning] = useState(false);
  const [curve, setCurve] = useState<IVChartPoint[]>([]);
  const [metrics, setMetrics] = useState<null | {
    voc: number;
    isc: number;
    vmpp: number;
    impp: number;
    pmpp: number;
    ff: number;
  }>(null);
  const [config, setConfig] = useState<SweepConfig>({
    mode: 'IV_SWEEP',
    setpoint: 0,
    startV: 0,
    stopV: 50,
    stepCount: 500,
    scanTimeSec: 5,
  });

  useEffect(() => {
    fetch('/api/modules?activeOnly=true')
      .then((r) => r.json())
      .then((d) => {
        setModules(d.modules ?? []);
        if (d.modules?.[0]) setModuleId(d.modules[0].id);
      })
      .catch(() => setModules([]));
  }, []);

  async function startSweep() {
    if (!moduleId) return;
    setRunning(true);
    setCurve([]);
    try {
      const res = await fetch('/api/iv-trace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          startV: config.startV,
          stopV: config.stopV,
          stepCount: config.stepCount,
          scanTimeSec: config.scanTimeSec,
          mock: true,
        }),
      });
      const data = await res.json();
      if (data.result) {
        setCurve(
          data.result.points.map((p: any) => ({
            voltage: p.voltage,
            current: p.current,
            power: p.power,
          })),
        );
        setMetrics({
          voc: data.result.voc,
          isc: data.result.isc,
          vmpp: data.result.vmpp,
          impp: data.result.impp,
          pmpp: data.result.pmpp,
          ff: data.result.ff,
        });
      }
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">IV Tracer</h1>
        <p className="text-muted-foreground">
          ESL-Solar 500 · 4-wire Kelvin · 0–300 V / 0–27 A
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Live Curve</CardTitle>
            {metrics && <Badge variant="success">Pmpp {metrics.pmpp.toFixed(1)} W</Badge>}
          </CardHeader>
          <CardContent>
            {curve.length > 0 ? (
              <IVChart data={curve} />
            ) : (
              <div className="flex h-96 items-center justify-center text-sm text-muted-foreground">
                {running ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Sweeping…
                  </span>
                ) : (
                  'No curve yet — select a module and click Start.'
                )}
              </div>
            )}

            {metrics && (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
                <Metric label="Voc" v={`${metrics.voc.toFixed(2)} V`} />
                <Metric label="Isc" v={`${metrics.isc.toFixed(2)} A`} />
                <Metric label="Vmpp" v={`${metrics.vmpp.toFixed(2)} V`} />
                <Metric label="Impp" v={`${metrics.impp.toFixed(2)} A`} />
                <Metric label="Pmpp" v={`${metrics.pmpp.toFixed(1)} W`} />
                <Metric label="FF" v={metrics.ff.toFixed(3)} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sweep Config</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Module</Label>
              <Select value={moduleId} onValueChange={setModuleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.serialNumber} · {m.moduleType.modelName}
                    </SelectItem>
                  ))}
                  {modules.length === 0 && (
                    <SelectItem value="__none__" disabled>
                      Register modules first
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <LoadControl value={config} onChange={setConfig} />

            <Button
              onClick={startSweep}
              disabled={running || !moduleId}
              className="w-full"
              size="lg"
            >
              {running ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running…
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> Start Sweep
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              <Zap className="mr-1 inline h-3 w-3" />
              Mock mode active (no hardware required for Vercel deploy)
            </p>
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
