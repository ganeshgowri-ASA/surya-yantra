'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Activity, Gauge, LineChart, Sun, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const LiveIVChart = dynamic(
  () => import('@/components/LiveIVChart').then((m) => m.LiveIVChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

function ChartSkeleton() {
  return (
    <div className="flex h-[420px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
      Loading live IV chart…
    </div>
  );
}

interface StatCard {
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STATS: StatCard[] = [
  { label: 'Total Modules', value: '75', hint: '15×5 TestBed-Alpha matrix', icon: Sun },
  { label: 'Active Tests', value: '3', hint: 'IV sweeps in progress', icon: Activity },
  { label: 'Irradiance', value: '987 W/m²', hint: 'Live reference cell', icon: Gauge },
  { label: 'Peak Power', value: '412.6 W', hint: 'Last sweep Pmax', icon: Zap },
];

interface NavTile {
  href: string;
  title: string;
  description: string;
}

const NAV_TILES: NavTile[] = [
  { href: '/iv-tracer', title: 'IV Tracer', description: 'Run IEC 60891 corrected sweeps against the ESL-Solar 500.' },
  { href: '/modules', title: 'Modules', description: 'Browse the 75-slot matrix, type classes, and serial registry.' },
  { href: '/corrections', title: 'Corrections', description: 'Apply P1–P4 temperature/irradiance corrections to STC.' },
  { href: '/reports', title: 'Reports', description: 'Export certified IV, SMMF, and IAM test reports.' },
];

export default function HomePage() {
  return (
    <main className="container mx-auto max-w-7xl py-10">
      <header className="mb-10 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sun className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Surya Yantra</h1>
            <p className="text-sm text-muted-foreground">
              Solar module characterization & diagnostics lab · IEC 60891 / 60904 / 61853 compliant
            </p>
          </div>
          <Badge variant="success" className="ml-auto">
            Online
          </Badge>
        </div>
      </header>

      <section aria-label="Key metrics" className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ label, value, hint, icon: Icon }) => (
          <div key={label} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
          </div>
        ))}
      </section>

      <section aria-label="Live IV curve" className="mb-10">
        <div className="mb-3 flex items-center gap-2">
          <LineChart className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Live IV Curve — Demo Session</h2>
          <Badge variant="secondary" className="ml-2">
            Socket.IO
          </Badge>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <LiveIVChart sessionId="demo-session" height={400} />
        </div>
      </section>

      <section aria-label="Features" className="grid gap-4 sm:grid-cols-2">
        {NAV_TILES.map(({ href, title, description }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/50 hover:bg-accent"
          >
            <h3 className="text-base font-semibold group-hover:text-primary">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </Link>
        ))}
      </section>

      <footer className="mt-12 border-t pt-6 text-xs text-muted-foreground">
        Surya Yantra · Srishti PV Lab · built on Next.js 14, Prisma, Socket.IO
      </footer>
    </main>
  );
}
