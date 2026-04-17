'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download } from 'lucide-react';

interface SessionRow {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  measurements: Array<{ id: string; pmppSTC: number | null; module: { serialNumber: string } }>;
}

export default function ReportsPage() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/measurements?limit=100')
      .then((r) => r.json())
      .then((d) => {
        const bySession = new Map<string, SessionRow>();
        for (const m of d.measurements ?? []) {
          if (!m.sessionId) continue;
          const row = bySession.get(m.sessionId) ?? {
            id: m.sessionId,
            name: `Session ${m.sessionId.slice(0, 8)}`,
            status: 'COMPLETED',
            createdAt: m.measuredAt,
            measurements: [],
          };
          row.measurements.push({
            id: m.id,
            pmppSTC: m.pmppSTC,
            module: { serialNumber: m.module.serialNumber },
          });
          bySession.set(m.sessionId, row);
        }
        setSessions([...bySession.values()]);
      });
  }, []);

  async function download(sessionId: string, format: 'CSV' | 'XLSX' | 'PDF') {
    setBusy(sessionId + format);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, format, title: `Surya Yantra ${sessionId}` }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `surya_${sessionId}.${format.toLowerCase()}`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Export test sessions as CSV, XLSX, or PDF.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Test Sessions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 text-left font-medium">Session</th>
                  <th className="p-3 text-left font-medium">Date</th>
                  <th className="p-3 text-center font-medium">Measurements</th>
                  <th className="p-3 text-center font-medium">Status</th>
                  <th className="p-3 text-right font-medium">Export</th>
                </tr>
              </thead>
              <tbody>
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-muted-foreground">
                      No sessions yet. Run an IV sweep to create one.
                    </td>
                  </tr>
                ) : (
                  sessions.map((s) => (
                    <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3 font-mono text-xs">{s.id.slice(0, 12)}…</td>
                      <td className="p-3">{new Date(s.createdAt).toLocaleString()}</td>
                      <td className="p-3 text-center">{s.measurements.length}</td>
                      <td className="p-3 text-center">
                        <Badge variant="success">{s.status}</Badge>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          {(['CSV', 'XLSX', 'PDF'] as const).map((f) => (
                            <Button
                              key={f}
                              size="sm"
                              variant="outline"
                              disabled={busy === s.id + f}
                              onClick={() => download(s.id, f)}
                            >
                              {busy === s.id + f ? (
                                <FileText className="h-3 w-3 animate-pulse" />
                              ) : (
                                <Download className="h-3 w-3" />
                              )}
                              <span className="ml-1">{f}</span>
                            </Button>
                          ))}
                        </div>
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
