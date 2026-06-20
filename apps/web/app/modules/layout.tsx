import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Module Registry',
  description:
    '75-module test bed registry for the Srishti PV Lab. Browse HJT, TOPCon, IBC, HPBC, and First Solar CdTe thin-film modules by slot position, serial number, manufacturer, and test status.',
  openGraph: {
    title: 'Module Registry · Surya Yantra',
    description:
      '75-slot PV module registry: 15 × 5 matrix, technology classes (HJT / TOPCon / IBC / HPBC / CdTe), serial numbers, test status.',
  },
  twitter: {
    card: 'summary',
    title: 'Module Registry · Surya Yantra',
    description: '75-slot PV module registry for HJT, TOPCon, IBC, HPBC, and CdTe modules.',
  },
};

export default function ModulesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
