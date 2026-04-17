'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Grid3x3 } from 'lucide-react';
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

type ModuleStatus = 'tested' | 'queued' | 'in-progress' | 'failed';
type TypeClass = 'CdTe' | 'HPBC' | 'HJT' | 'TOPCon' | 'IBC';

interface ModuleRow {
  slot: string;
  serial: string;
  typeClass: TypeClass;
  manufacturer: string;
  pmax: number;
  status: ModuleStatus;
}

const TYPE_CLASSES: TypeClass[] = ['CdTe', 'HPBC', 'HJT', 'TOPCon', 'IBC'];
const MANUFACTURERS = ['First Solar', 'LONGi', 'REC', 'Jinko', 'Trina'];
const STATUSES: ModuleStatus[] = ['tested', 'queued', 'in-progress', 'failed'];

function generateModules(): ModuleRow[] {
  const rows: ModuleRow[] = [];
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 5; col++) {
      const idx = row * 5 + col;
      const rowLetter = String.fromCharCode(65 + row);
      const typeClass = TYPE_CLASSES[col];
      rows.push({
        slot: `${rowLetter}${String(col + 1).padStart(2, '0')}`,
        serial: `SY-${typeClass}-${String(1000 + idx).padStart(4, '0')}`,
        typeClass,
        manufacturer: MANUFACTURERS[col],
        pmax: 395 + ((idx * 7) % 45),
        status: STATUSES[idx % STATUSES.length],
      });
    }
  }
  return rows;
}

const STATUS_VARIANT: Record<ModuleStatus, 'success' | 'secondary' | 'warning' | 'destructive'> = {
  tested: 'success',
  queued: 'secondary',
  'in-progress': 'warning',
  failed: 'destructive',
};

const STATUS_LABEL: Record<ModuleStatus, string> = {
  tested: 'Tested',
  queued: 'Queued',
  'in-progress': 'In progress',
  failed: 'Failed',
};

export default function ModulesPage() {
  const modules = useMemo(generateModules, []);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeClass | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ModuleStatus | 'all'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return modules.filter((m) => {
      if (typeFilter !== 'all' && m.typeClass !== typeFilter) return false;
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      if (q && !m.serial.toLowerCase().includes(q) && !m.slot.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [modules, query, typeFilter, statusFilter]);

  const summary = useMemo(() => {
    const byStatus = { tested: 0, queued: 0, 'in-progress': 0, failed: 0 };
    for (const m of modules) byStatus[m.status]++;
    return byStatus;
  }, [modules]);

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
          <Grid3x3 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Module Registry</h1>
          <p className="text-sm text-muted-foreground">
            Browse the 75-slot matrix, type classes, and serial registry
          </p>
        </div>
      </header>

      <section className="mb-6 grid gap-3 sm:grid-cols-4">
        {STATUSES.map((s) => (
          <div key={s} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="text-xs font-medium text-muted-foreground">{STATUS_LABEL[s]}</div>
            <div className="mt-1 flex items-end justify-between">
              <span className="text-2xl font-semibold tabular-nums">{summary[s]}</span>
              <Badge variant={STATUS_VARIANT[s]}>{s}</Badge>
            </div>
          </div>
        ))}
      </section>

      <section className="mb-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="q">Search slot or serial</Label>
            <Input
              id="q"
              placeholder="e.g. A01 or SY-HJT-1003"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="type-filter">Type class</Label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TypeClass | 'all')}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">All types</option>
              {TYPE_CLASSES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="status-filter">Status</Label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ModuleStatus | 'all')}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slot</TableHead>
              <TableHead>Serial</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead className="text-right">Pmax (W)</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((m) => (
              <TableRow key={m.slot}>
                <TableCell className="font-mono font-medium">{m.slot}</TableCell>
                <TableCell className="font-mono text-xs">{m.serial}</TableCell>
                <TableCell>{m.typeClass}</TableCell>
                <TableCell className="text-muted-foreground">{m.manufacturer}</TableCell>
                <TableCell className="text-right tabular-nums">{m.pmax}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[m.status]}>{STATUS_LABEL[m.status]}</Badge>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                  No modules match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      <p className="mt-3 text-xs text-muted-foreground">
        Showing {filtered.length} of {modules.length} modules.
      </p>
    </main>
  );
}
