'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type Procedure = 'P1' | 'P2' | 'P3' | 'P4';

export interface CorrectionConfig {
  procedure: Procedure;
  smmfEnabled: boolean;
  iamEnabled: boolean;
  aoiDeg: number;
  beamFraction: number;
  rsOverride?: number;
  kappaOverride?: number;
}

const PROCEDURES: Array<{ value: Procedure; label: string; desc: string }> = [
  { value: 'P1', label: 'P1 — Classic additive', desc: 'Linear I/V shift; needs Rs, κ' },
  { value: 'P2', label: 'P2 — Multiplicative', desc: 'Blaesser; no Rs required' },
  { value: 'P3', label: 'P3 — Matrix-less', desc: 'Independent Isc, Voc, Pmp corrections' },
  { value: 'P4', label: 'P4 — Variable Rs', desc: 'P1 with irradiance-dependent Rs' },
];

export function CorrectionPanel({
  value,
  onChange,
}: {
  value: CorrectionConfig;
  onChange: (v: CorrectionConfig) => void;
}) {
  const patch = (p: Partial<CorrectionConfig>) => onChange({ ...value, ...p });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>IEC 60891:2021 Procedure</Label>
        <Select
          value={value.procedure}
          onValueChange={(v) => patch({ procedure: v as Procedure })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROCEDURES.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                <div>
                  <div className="font-medium">{p.label}</div>
                  <div className="text-xs text-muted-foreground">{p.desc}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 rounded-md border p-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>SMMF (IEC 60904-7)</Label>
            <p className="text-xs text-muted-foreground">
              Spectral mismatch vs AM1.5G reference
            </p>
          </div>
          <Switch
            checked={value.smmfEnabled}
            onCheckedChange={(c) => patch({ smmfEnabled: c })}
          />
        </div>
      </div>

      <div className="space-y-3 rounded-md border p-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>IAM — Martin-Ruiz (IEC 61853-2)</Label>
            <p className="text-xs text-muted-foreground">
              Angle-of-incidence modifier for beam component
            </p>
          </div>
          <Switch
            checked={value.iamEnabled}
            onCheckedChange={(c) => patch({ iamEnabled: c })}
          />
        </div>
        {value.iamEnabled && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <Label className="text-xs">AOI (°)</Label>
              <Input
                type="number"
                min={0}
                max={90}
                step={1}
                value={value.aoiDeg}
                onChange={(e) => patch({ aoiDeg: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Beam fraction</Label>
              <Input
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={value.beamFraction}
                onChange={(e) => patch({ beamFraction: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 rounded-md border p-4">
        <Label>Series resistance (Rs) override</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Rs (Ω)</Label>
            <Input
              type="number"
              step={0.01}
              placeholder="use module default"
              value={value.rsOverride ?? ''}
              onChange={(e) =>
                patch({ rsOverride: e.target.value ? Number.parseFloat(e.target.value) : undefined })
              }
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">κ (Ω/°C)</Label>
            <Input
              type="number"
              step={0.0001}
              placeholder="use module default"
              value={value.kappaOverride ?? ''}
              onChange={(e) =>
                patch({
                  kappaOverride: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
