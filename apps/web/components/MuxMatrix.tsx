'use client';

import { cn } from '@/lib/utils';
import type { SlotState } from './ModuleGrid';

export function MuxMatrix({ slots }: { slots: SlotState[] }) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-left text-xs">
        <thead className="bg-muted">
          <tr>
            <th className="p-2 font-medium">Slot</th>
            <th className="p-2 font-medium">Destination</th>
            <th className="p-2 font-medium">Force+/−</th>
            <th className="p-2 font-medium">Sense+/−</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((s) => (
            <tr key={s.slotNumber} className="border-t">
              <td className="p-2 font-mono">{s.slotNumber}</td>
              <td className="p-2">
                <span
                  className={cn(
                    'rounded px-2 py-0.5 text-xs font-medium',
                    s.destination === 'ELOAD' && 'bg-primary/20 text-primary',
                    s.destination === 'INVERTER' && 'bg-emerald-500/20 text-emerald-700',
                    s.destination === 'CONVERTER' && 'bg-sky-500/20 text-sky-700',
                    s.destination === 'IDLE' && 'bg-muted text-muted-foreground',
                  )}
                >
                  {s.destination}
                </span>
              </td>
              <td className="p-2">
                <Dot active={s.forceOn ?? false} />
              </td>
              <td className="p-2">
                <Dot active={s.senseOn ?? false} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Dot({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        'inline-block h-2.5 w-2.5 rounded-full',
        active ? 'bg-emerald-500' : 'bg-muted',
      )}
    />
  );
}
