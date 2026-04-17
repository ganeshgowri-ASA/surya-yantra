'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type LoadMode = 'CC' | 'CV' | 'CR' | 'CP' | 'MPP_TRACK' | 'MPP_SCAN' | 'IV_SWEEP';

export interface SweepConfig {
  mode: LoadMode;
  setpoint: number;
  startV: number;
  stopV: number;
  stepCount: number;
  scanTimeSec: number;
}

const MODE_UNITS: Partial<Record<LoadMode, string>> = {
  CC: 'A',
  CV: 'V',
  CR: 'Ω',
  CP: 'W',
};

export function LoadControl({
  value,
  onChange,
}: {
  value: SweepConfig;
  onChange: (v: SweepConfig) => void;
}) {
  const patch = (p: Partial<SweepConfig>) => onChange({ ...value, ...p });
  const unit = MODE_UNITS[value.mode];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Load mode</Label>
        <Select value={value.mode} onValueChange={(v) => patch({ mode: v as LoadMode })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CC">CC — Constant Current</SelectItem>
            <SelectItem value="CV">CV — Constant Voltage</SelectItem>
            <SelectItem value="CR">CR — Constant Resistance</SelectItem>
            <SelectItem value="CP">CP — Constant Power</SelectItem>
            <SelectItem value="MPP_TRACK">MPP Tracker</SelectItem>
            <SelectItem value="MPP_SCAN">MPP Scan</SelectItem>
            <SelectItem value="IV_SWEEP">IV Sweep</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {unit && (
        <div className="space-y-2">
          <Label>Setpoint ({unit})</Label>
          <Input
            type="number"
            step={0.01}
            value={value.setpoint}
            onChange={(e) => patch({ setpoint: Number.parseFloat(e.target.value) || 0 })}
          />
        </div>
      )}

      {(value.mode === 'IV_SWEEP' || value.mode === 'MPP_SCAN') && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Start V</Label>
            <Input
              type="number"
              min={0}
              max={300}
              step={0.1}
              value={value.startV}
              onChange={(e) => patch({ startV: Number.parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Stop V</Label>
            <Input
              type="number"
              min={0}
              max={300}
              step={0.1}
              value={value.stopV}
              onChange={(e) => patch({ stopV: Number.parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Steps</Label>
            <Input
              type="number"
              min={10}
              max={10000}
              step={10}
              value={value.stepCount}
              onChange={(e) => patch({ stepCount: Number.parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Scan time (s)</Label>
            <Input
              type="number"
              min={0.1}
              step={0.1}
              value={value.scanTimeSec}
              onChange={(e) => patch({ scanTimeSec: Number.parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
