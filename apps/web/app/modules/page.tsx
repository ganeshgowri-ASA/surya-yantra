'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

interface ModuleType {
  id: string;
  modelName: string;
  technology: string;
  pmpSTC: number;
  manufacturer: { name: string };
}

interface Module {
  id: string;
  serialNumber: string;
  slotPosition: number | null;
  isActive: boolean;
  moduleType: ModuleType;
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [types, setTypes] = useState<ModuleType[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ serialNumber: '', moduleTypeId: '', slotPosition: '' });

  async function load() {
    setLoading(true);
    const [ml, tl] = await Promise.all([
      fetch('/api/modules').then((r) => r.json()),
      fetch('/api/module-types').then((r) => r.json()),
    ]);
    setModules(ml.modules ?? []);
    setTypes(tl.moduleTypes ?? []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function submit() {
    if (!form.serialNumber || !form.moduleTypeId) return;
    await fetch('/api/modules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serialNumber: form.serialNumber,
        moduleTypeId: form.moduleTypeId,
        testBedId: 'testbed-alpha',
        slotPosition: form.slotPosition ? Number.parseInt(form.slotPosition) : undefined,
      }),
    });
    setForm({ serialNumber: '', moduleTypeId: '', slotPosition: '' });
    setOpen(false);
    load();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Module Registry</h1>
          <p className="text-muted-foreground">
            {modules.length} of 75 slots registered · {types.length} module types available
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Module
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register new module</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Serial Number</Label>
                <Input
                  value={form.serialNumber}
                  onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
                  placeholder="e.g. LR-HBC-2024-0042"
                />
              </div>
              <div className="space-y-2">
                <Label>Module Type</Label>
                <Select
                  value={form.moduleTypeId}
                  onValueChange={(v) => setForm({ ...form, moduleTypeId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose module type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.manufacturer.name} — {t.modelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Slot (1–75, optional)</Label>
                <Input
                  type="number"
                  min={1}
                  max={75}
                  value={form.slotPosition}
                  onChange={(e) => setForm({ ...form, slotPosition: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submit} disabled={!form.serialNumber || !form.moduleTypeId}>
                Register
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Registered Modules</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 text-left font-medium">Slot</th>
                  <th className="p-3 text-left font-medium">Serial</th>
                  <th className="p-3 text-left font-medium">Model</th>
                  <th className="p-3 text-left font-medium">Technology</th>
                  <th className="p-3 text-right font-medium">Pmpp STC</th>
                  <th className="p-3 text-center font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-muted-foreground">
                      Loading…
                    </td>
                  </tr>
                ) : modules.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-muted-foreground">
                      No modules registered. Click “Add Module”.
                    </td>
                  </tr>
                ) : (
                  modules.map((m) => (
                    <tr key={m.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3 font-mono">{m.slotPosition ?? '—'}</td>
                      <td className="p-3 font-medium">{m.serialNumber}</td>
                      <td className="p-3">
                        {m.moduleType.manufacturer.name} — {m.moduleType.modelName}
                      </td>
                      <td className="p-3 text-muted-foreground">{m.moduleType.technology}</td>
                      <td className="p-3 text-right">{m.moduleType.pmpSTC.toFixed(0)} W</td>
                      <td className="p-3 text-center">
                        {m.isActive ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
