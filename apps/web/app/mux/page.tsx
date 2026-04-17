'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ModuleGrid, SlotState } from '@/components/ModuleGrid';
import { Zap, Cable, XCircle } from 'lucide-react';

export default function MuxPage() {
  const [slots, setSlots] = useState<SlotState[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  async function load() {
    const r = await fetch('/api/mux').then((x) => x.json());
    setSlots(
      (r.states ?? []).map((s: any) => ({
        slotNumber: s.slotNumber,
        destination: s.destination,
        forceOn: s.forceOn,
        senseOn: s.senseOn,
      })),
    );
  }
  useEffect(() => {
    load();
  }, []);

  async function assign(dest: 'ELOAD' | 'INVERTER' | 'CONVERTER' | 'IDLE') {
    if (!selected) return;
    await fetch('/api/mux/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotNumber: selected, destination: dest }),
    });
    load();
  }

  const current = selected ? slots.find((s) => s.slotNumber === selected) : null;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">MUX Matrix</h1>
        <p className="text-muted-foreground">
          15 × 5 relay grid · 300 relays · Force/Sense pairs per slot
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>75-Slot Grid</CardTitle>
          </CardHeader>
          <CardContent>
            <ModuleGrid
              slots={slots}
              selectedSlot={selected}
              onSelect={(n) => setSelected(n)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {selected ? `Slot ${selected}` : 'Select a slot'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {current && (
              <div className="rounded-md border bg-muted/30 p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Destination</span>
                  <span className="font-medium">{current.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Force</span>
                  <span className="font-medium">{current.forceOn ? 'ON' : 'OFF'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sense</span>
                  <span className="font-medium">{current.senseOn ? 'ON' : 'OFF'}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Button
                className="w-full justify-start"
                disabled={!selected}
                onClick={() => assign('ELOAD')}
              >
                <Zap className="mr-2 h-4 w-4" /> Route to E-Load (exclusive)
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start"
                disabled={!selected}
                onClick={() => assign('INVERTER')}
              >
                <Cable className="mr-2 h-4 w-4" /> Route to Inverter
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start"
                disabled={!selected}
                onClick={() => assign('CONVERTER')}
              >
                <Cable className="mr-2 h-4 w-4" /> Route to Converter
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled={!selected}
                onClick={() => assign('IDLE')}
              >
                <XCircle className="mr-2 h-4 w-4" /> Idle / Open
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Assigning a slot to E-Load releases any previously-routed slot for safety.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
