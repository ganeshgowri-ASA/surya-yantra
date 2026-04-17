'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type ReportType = 'IV' | 'SMMF' | 'IAM';
type DownloadFormat = 'pdf' | 'csv' | 'json';

interface CompletedTest {
  id: string;
  date: string;
  module: string;
  operator: string;
  pmax: number;
  compliant: boolean;
}

const COMPLETED: CompletedTest[] = [
  { id: 'RPT-2026-0412-A01', date: '2026-04-12', module: 'SY-HJT-1003', operator: 'K. Iyer', pmax: 412.6, compliant: true },
  { id: 'RPT-2026-0411-B04', date: '2026-04-11', module: 'SY-TOPCon-1014', operator: 'K. Iyer', pmax: 429.1, compliant: true },
  { id: 'RPT-2026-0411-C02', date: '2026-04-11', module: 'SY-IBC-1008', operator: 'M. Rao', pmax: 438.7, compliant: true },
  { id: 'RPT-2026-0410-D05', date: '2026-04-10', module: 'SY-CdTe-1019', operator: 'M. Rao', pmax: 395.2, compliant: false },
  { id: 'RPT-2026-0410-A05', date: '2026-04-10', module: 'SY-HPBC-1004', operator: 'S. Patel', pmax: 416.8, compliant: true },
];

const REPORT_TYPES: { id: ReportType; label: string; blurb: string }[] = [
  { id: 'IV', label: 'IV Curve', blurb: 'IEC 60891 corrected IV sweep with Isc, Voc, FF, Pmax.' },
  { id: 'SMMF', label: 'SMMF', blurb: 'Spectral Mismatch Factor per IEC 60904-7 (AM1.5G).' },
  { id: 'IAM', label: 'IAM', blurb: 'Incidence-angle modifier per IEC 61853-2.' },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('IV');
  const [selectedId, setSelectedId] = useState<string>(COMPLETED[0]!.id);

  const selected = useMemo(
    () => COMPLETED.find((t) => t.id === selectedId) ?? COMPLETED[0]!,
    [selectedId],
  );

  const handleDownload = (format: DownloadFormat) => () => {
    const filename = `${selected.id}-${reportType}.${format}`;
    const payload = {
      id: selected.id,
      reportType,
      module: selected.module,
      date: selected.date,
      operator: selected.operator,
      pmax: selected.pmax,
      compliant: selected.compliant,
    };
    const body =
      format === 'json'
        ? JSON.stringify(payload, null, 2)
        : format === 'csv'
          ? `id,type,module,date,operator,pmax,compliant\n${selected.id},${reportType},${selected.module},${selected.date},${selected.operator},${selected.pmax},${selected.compliant}\n`
          : `PDF placeholder — ${filename}`;
    const mime = format === 'json' ? 'application/json' : format === 'csv' ? 'text/csv' : 'application/pdf';
    const blob = new Blob([body], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

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
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Test Reports</h1>
          <p className="text-sm text-muted-foreground">
            Export certified IV, SMMF, and IAM test reports
          </p>
        </div>
        <Badge variant="outline" className="ml-auto">
          {COMPLETED.length} completed
        </Badge>
      </header>

      <section className="mb-6 rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Report type
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {REPORT_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setReportType(t.id)}
              aria-pressed={reportType === t.id}
              className={
                reportType === t.id
                  ? 'rounded-lg border-2 border-primary bg-accent p-4 text-left shadow-sm'
                  : 'rounded-lg border p-4 text-left hover:bg-accent'
              }
            >
              <div className="font-semibold">{t.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{t.blurb}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-xl border bg-card shadow-sm">
        <div className="border-b p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Completed tests
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Operator</TableHead>
              <TableHead className="text-right">Pmax (W)</TableHead>
              <TableHead>Compliance</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {COMPLETED.map((t) => (
              <TableRow
                key={t.id}
                data-state={selectedId === t.id ? 'selected' : undefined}
                className="cursor-pointer"
                onClick={() => setSelectedId(t.id)}
              >
                <TableCell className="font-mono text-xs">{t.id}</TableCell>
                <TableCell>{t.date}</TableCell>
                <TableCell className="font-mono text-xs">{t.module}</TableCell>
                <TableCell className="text-muted-foreground">{t.operator}</TableCell>
                <TableCell className="text-right tabular-nums">{t.pmax}</TableCell>
                <TableCell>
                  <Badge variant={t.compliant ? 'success' : 'destructive'}>
                    {t.compliant ? 'IEC pass' : 'Review'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <input
                    type="radio"
                    aria-label={`Select ${t.id}`}
                    checked={selectedId === t.id}
                    onChange={() => setSelectedId(t.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Download {reportType} report — {selected.id}
          </h2>
          <div className="flex flex-wrap gap-2">
            {(['pdf', 'csv', 'json'] as DownloadFormat[]).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={handleDownload(fmt)}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Compliance
            </h2>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">IEC 60891</dt>
              <dd className="font-medium">Pass</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">IEC 60904-7</dt>
              <dd className="font-medium">Pass</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">IEC 61853-2</dt>
              <dd className="font-medium">Pass</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
