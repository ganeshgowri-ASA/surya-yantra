import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Module Registry',
  description:
    'Browse the 75-slot PV module test bed matrix at Srishti PV Lab. Manage HJT, TOPCon, IBC, HPBC, Perovskite, and CdTe thin-film modules with full STC parameters, serial numbers, and slot assignments.',
  keywords: [
    'PV module registry',
    'solar module catalogue',
    'HJT TOPCon IBC module',
    'photovoltaic test bed',
    '75-module matrix',
    'PV module STC parameters',
  ],
  alternates: { canonical: 'https://surya-yantra.vercel.app/modules' },
  openGraph: {
    title: 'Module Registry · Surya Yantra',
    description:
      '75-slot solar PV module test bed registry: HJT, TOPCon, IBC, CdTe with STC parameters and slot assignments.',
    url: 'https://surya-yantra.vercel.app/modules',
  },
};

export default function ModulesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
