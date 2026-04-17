'use client';

import { Sun, Thermometer, Wind, Compass } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface Conditions {
  gPoa: number;
  tCell: number;
  tAmbient: number;
  tModule?: number | null;
  windSpeed?: number | null;
  aoi?: number | null;
  airmass?: number | null;
}

export function ConditionsPanel({ c }: { c: Conditions | null }) {
  if (!c) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          No environmental data yet. Log a reading in /conditions.
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Tile icon={Sun} label="G_POA" value={`${c.gPoa.toFixed(0)} W/m²`} />
      <Tile icon={Thermometer} label="T cell" value={`${c.tCell.toFixed(1)} °C`} />
      <Tile icon={Thermometer} label="T ambient" value={`${c.tAmbient.toFixed(1)} °C`} />
      <Tile
        icon={Wind}
        label="Wind"
        value={c.windSpeed != null ? `${c.windSpeed.toFixed(1)} m/s` : '—'}
      />
      <Tile
        icon={Compass}
        label="AOI"
        value={c.aoi != null ? `${c.aoi.toFixed(1)}°` : '—'}
      />
      <Tile
        icon={Sun}
        label="Airmass"
        value={c.airmass != null ? c.airmass.toFixed(2) : '—'}
      />
    </div>
  );
}

function Tile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <Icon className="h-5 w-5 text-primary" />
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-lg font-semibold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
