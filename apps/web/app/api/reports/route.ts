import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const Schema = z.object({
  sessionId: z.string().min(1),
  format: z.enum(['CSV', 'XLSX', 'PDF']).default('CSV'),
  title: z.string().default('IV Test Report'),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const session = await prisma.testSession.findUnique({
    where: { id: parsed.data.sessionId },
    include: {
      operator: true,
      testBed: { include: { org: true } },
      measurements: {
        include: {
          module: { include: { moduleType: { include: { manufacturer: true } } } },
          condition: true,
          rawCurvePoints: { orderBy: { seqIndex: 'asc' } },
          correctedCurvePoints: { orderBy: { seqIndex: 'asc' } },
          correctionResult: true,
        },
      },
    },
  });
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const { format, title } = parsed.data;

  if (format === 'CSV') {
    const csv = buildCSV(session);
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${slug(title)}.csv"`,
      },
    });
  }

  if (format === 'XLSX') {
    const buf = await buildXLSX(session, title);
    return new NextResponse(buf as unknown as BodyInit, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${slug(title)}.xlsx"`,
      },
    });
  }

  // PDF
  const pdfBuf = await buildPDF(session, title);
  return new NextResponse(pdfBuf as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${slug(title)}.pdf"`,
    },
  });
}

function slug(s: string) {
  return s.replace(/[^a-z0-9]+/gi, '_').toLowerCase();
}

function buildCSV(session: any): string {
  const lines: string[] = [];
  lines.push(`# ${session.name} — ${new Date(session.createdAt).toISOString()}`);
  lines.push(`# TestBed: ${session.testBed.name}  Org: ${session.testBed.org.name}`);
  lines.push('');
  lines.push(
    'module_serial,model,voc_raw,isc_raw,pmpp_raw,ff_raw,voc_stc,isc_stc,pmpp_stc,g_poa,t_cell,correction',
  );
  for (const m of session.measurements) {
    lines.push(
      [
        m.module.serialNumber,
        m.module.moduleType.modelName,
        m.vocRaw ?? '',
        m.iscRaw ?? '',
        m.pmppRaw ?? '',
        m.ffRaw ?? '',
        m.vocSTC ?? '',
        m.iscSTC ?? '',
        m.pmppSTC ?? '',
        m.condition?.gPoa ?? '',
        m.condition?.tCell ?? '',
        m.correctionProc,
      ].join(','),
    );
  }
  return lines.join('\n');
}

async function buildXLSX(session: any, title: string): Promise<Buffer> {
  const ExcelJS = (await import('exceljs')).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Surya Yantra';
  wb.title = title;

  const summary = wb.addWorksheet('Summary');
  summary.columns = [
    { header: 'Serial', key: 'serial', width: 20 },
    { header: 'Model', key: 'model', width: 30 },
    { header: 'Voc raw', key: 'vocR', width: 10 },
    { header: 'Isc raw', key: 'iscR', width: 10 },
    { header: 'Pmpp raw', key: 'pR', width: 12 },
    { header: 'FF raw', key: 'ffR', width: 10 },
    { header: 'Voc STC', key: 'vocS', width: 10 },
    { header: 'Isc STC', key: 'iscS', width: 10 },
    { header: 'Pmpp STC', key: 'pS', width: 12 },
    { header: 'G (W/m²)', key: 'g', width: 10 },
    { header: 'T cell (°C)', key: 't', width: 12 },
    { header: 'Procedure', key: 'proc', width: 14 },
  ];
  for (const m of session.measurements) {
    summary.addRow({
      serial: m.module.serialNumber,
      model: m.module.moduleType.modelName,
      vocR: m.vocRaw,
      iscR: m.iscRaw,
      pR: m.pmppRaw,
      ffR: m.ffRaw,
      vocS: m.vocSTC,
      iscS: m.iscSTC,
      pS: m.pmppSTC,
      g: m.condition?.gPoa,
      t: m.condition?.tCell,
      proc: m.correctionProc,
    });
  }

  for (const m of session.measurements) {
    const ws = wb.addWorksheet(`Curve — ${m.module.serialNumber.slice(0, 20)}`);
    ws.addRow(['V (raw)', 'I (raw)', 'P (raw)', 'V (STC)', 'I (STC)', 'P (STC)']);
    const n = Math.max(m.rawCurvePoints.length, m.correctedCurvePoints.length);
    for (let i = 0; i < n; i++) {
      const r = m.rawCurvePoints[i];
      const c = m.correctedCurvePoints[i];
      ws.addRow([r?.voltage, r?.current, r?.power, c?.voltage, c?.current, c?.power]);
    }
  }

  const buf = await wb.xlsx.writeBuffer();
  return Buffer.from(buf);
}

async function buildPDF(session: any, title: string): Promise<Buffer> {
  const PDFDocument = (await import('pdfkit')).default;
  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  const chunks: Buffer[] = [];
  doc.on('data', (c) => chunks.push(c as Buffer));
  const done = new Promise<void>((resolve) => doc.on('end', () => resolve()));

  doc.fontSize(18).text(title, { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).text(`Session: ${session.name}`);
  doc.text(`TestBed: ${session.testBed.name} · ${session.testBed.org.name}`);
  doc.text(`Operator: ${session.operator.name}`);
  doc.text(`Generated: ${new Date().toISOString()}`);
  doc.moveDown();

  doc.fontSize(13).text('Measurements', { underline: true });
  for (const m of session.measurements) {
    doc.moveDown(0.5);
    doc.fontSize(11).text(`• ${m.module.serialNumber} — ${m.module.moduleType.modelName}`);
    doc.fontSize(9).text(
      `Voc=${fmt(m.vocRaw)} V · Isc=${fmt(m.iscRaw)} A · Pmpp=${fmt(m.pmppRaw)} W · FF=${fmt(m.ffRaw, 3)}`,
    );
    if (m.pmppSTC != null) {
      doc
        .fontSize(9)
        .text(
          `STC: Voc=${fmt(m.vocSTC)} V · Isc=${fmt(m.iscSTC)} A · Pmpp=${fmt(m.pmppSTC)} W (${m.correctionProc})`,
        );
    }
  }
  doc.end();
  await done;
  return Buffer.concat(chunks);
}

function fmt(n: number | null | undefined, digits = 2) {
  if (n == null) return '—';
  return n.toFixed(digits);
}
