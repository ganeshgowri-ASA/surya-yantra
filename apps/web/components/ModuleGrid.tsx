'use client';

import { cn } from '@/lib/utils';

export interface SlotState {
  slotNumber: number;
  destination: 'ELOAD' | 'INVERTER' | 'CONVERTER' | 'IDLE';
  forceOn?: boolean;
  senseOn?: boolean;
  moduleSerial?: string | null;
}

export interface ModuleGridProps {
  rows?: number;
  cols?: number;
  slots: SlotState[];
  selectedSlot?: number | null;
  onSelect?: (slotNumber: number) => void;
}

const DEST_COLOR: Record<SlotState['destination'], string> = {
  ELOAD: 'bg-primary text-primary-foreground',
  INVERTER: 'bg-emerald-500 text-white',
  CONVERTER: 'bg-sky-500 text-white',
  IDLE: 'bg-muted text-muted-foreground',
};

export function ModuleGrid({
  rows = 15,
  cols = 5,
  slots,
  selectedSlot,
  onSelect,
}: ModuleGridProps) {
  const map = new Map(slots.map((s) => [s.slotNumber, s]));

  return (
    <div className="space-y-3">
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: rows * cols }, (_, i) => {
          const slotNumber = i + 1;
          const state = map.get(slotNumber) ?? {
            slotNumber,
            destination: 'IDLE' as const,
          };
          const selected = selectedSlot === slotNumber;
          return (
            <button
              key={slotNumber}
              type="button"
              onClick={() => onSelect?.(slotNumber)}
              className={cn(
                'flex aspect-square flex-col items-center justify-center rounded-md border-2 p-2 text-xs transition-all hover:scale-[1.02]',
                DEST_COLOR[state.destination],
                selected ? 'border-ring ring-2 ring-ring ring-offset-2' : 'border-transparent',
              )}
              title={`Slot ${slotNumber} · ${state.destination}`}
            >
              <span className="text-sm font-bold">{slotNumber}</span>
              <span className="text-[10px] opacity-80">{state.destination}</span>
            </button>
          );
        })}
      </div>

      <Legend />
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
      {(['ELOAD', 'INVERTER', 'CONVERTER', 'IDLE'] as const).map((d) => (
        <div key={d} className="flex items-center gap-2">
          <span className={cn('h-3 w-3 rounded-sm', DEST_COLOR[d])} />
          {d}
        </div>
      ))}
    </div>
  );
}
