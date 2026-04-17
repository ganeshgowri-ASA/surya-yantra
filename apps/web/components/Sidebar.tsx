'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Activity,
  Cpu,
  Grid3x3,
  SlidersHorizontal,
  CloudSun,
  FileBarChart,
  Sparkles,
  Sun,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/iv-trace', label: 'IV Tracer', icon: Activity },
  { href: '/modules', label: 'Modules', icon: Cpu },
  { href: '/mux', label: 'MUX Matrix', icon: Grid3x3 },
  { href: '/corrections', label: 'IEC Corrections', icon: SlidersHorizontal },
  { href: '/conditions', label: 'Environmental', icon: CloudSun },
  { href: '/reports', label: 'Reports', icon: FileBarChart },
  { href: '/diagnostics', label: 'AI Diagnostics', icon: Sparkles },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex items-center gap-2 border-b px-6 py-5">
        <Sun className="h-6 w-6 text-primary" />
        <div>
          <div className="text-base font-semibold leading-tight">सूर्य यन्त्र</div>
          <div className="text-xs text-muted-foreground">Surya Yantra</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4 text-xs text-muted-foreground">
        <div className="font-medium text-foreground">Srishti PV Lab</div>
        <div>Jamnagar · SPL-001</div>
      </div>
    </aside>
  );
}
