import Link from 'next/link';
import { Activity, Cpu, Grid3x3, Sparkles, Zap, ThermometerSun, Sun, Gauge } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

interface Stat {
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}

async function getDashboardStats(): Promise<{
  modulesActive: number;
  sessionsToday: number;
  measurementsToday: number;
  latestCondition: { gPoa: number; tCell: number; tAmbient: number } | null;
}> {
  try {
    const { prisma } = await import('@/lib/prisma');
    const [modulesActive, sessionsToday, measurementsToday, latestCondition] = await Promise.all([
      prisma.module.count({ where: { isActive: true } }),
      prisma.testSession.count({
        where: { createdAt: { gte: new Date(Date.now() - 24 * 3600 * 1000) } },
      }),
      prisma.iVMeasurement.count({
        where: { measuredAt: { gte: new Date(Date.now() - 24 * 3600 * 1000) } },
      }),
      prisma.environmentalReading.findFirst({ orderBy: { timestamp: 'desc' } }),
    ]);
    return {
      modulesActive,
      sessionsToday,
      measurementsToday,
      latestCondition: latestCondition
        ? { gPoa: latestCondition.gPoa, tCell: latestCondition.tCell, tAmbient: latestCondition.tAmbient }
        : null,
    };
  } catch {
    return { modulesActive: 0, sessionsToday: 0, measurementsToday: 0, latestCondition: null };
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const tiles: Stat[] = [
    {
      label: 'Active Modules',
      value: `${stats.modulesActive} / 75`,
      hint: 'Registered on test bed',
      icon: Cpu,
    },
    {
      label: 'Sessions (24h)',
      value: String(stats.sessionsToday),
      hint: 'Test runs launched',
      icon: Activity,
    },
    {
      label: 'Measurements (24h)',
      value: String(stats.measurementsToday),
      hint: 'IV curves captured',
      icon: Gauge,
    },
    {
      label: 'Irradiance (G_POA)',
      value: stats.latestCondition ? `${stats.latestCondition.gPoa.toFixed(0)} W/m²` : '—',
      hint: stats.latestCondition
        ? `Cell ${stats.latestCondition.tCell.toFixed(1)}°C · Amb ${stats.latestCondition.tAmbient.toFixed(1)}°C`
        : 'No live sensor data',
      icon: Sun,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <header className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <Badge variant="success">System Online</Badge>
          </div>
          <p className="mt-1 text-muted-foreground">
            ESL-Solar 500 · 75-module bed · IEC 60891:2021 · Jamnagar (22.47°N, 70.06°E)
          </p>
        </div>
        <Button asChild>
          <Link href="/iv-trace">
            <Zap className="mr-2 h-4 w-4" /> Start IV Trace
          </Link>
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {tiles.map(({ label, value, hint, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground">{hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common workflows</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <QuickTile href="/iv-trace" icon={Activity} label="IV Sweep" />
            <QuickTile href="/mux" icon={Grid3x3} label="Configure MUX" />
            <QuickTile href="/corrections" icon={ThermometerSun} label="Apply IEC 60891" />
            <QuickTile href="/modules" icon={Cpu} label="Module Registry" />
            <QuickTile href="/conditions" icon={Sun} label="Log G & T" />
            <QuickTile href="/diagnostics" icon={Sparkles} label="AI Diagnostics" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Specs</CardTitle>
            <CardDescription>ESL-Solar 500 envelope</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Spec k="Voltage" v="0 – 300 V DC" />
            <Spec k="Current" v="0 – 27 A" />
            <Spec k="Power" v="900 W bifacial" />
            <Spec k="Sensing" v="4-wire Kelvin" />
            <Spec k="MUX" v="300-relay matrix" />
            <Spec k="Standards" v="IEC 60891 / 60904 / 61853" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuickTile({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-2 rounded-lg border bg-background p-4 text-center text-sm transition-colors hover:bg-accent"
    >
      <Icon className="h-5 w-5 text-primary" />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b pb-1 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
