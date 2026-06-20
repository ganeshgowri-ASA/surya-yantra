import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'IEC Corrections',
  description:
    'Apply IEC 60891:2021 Procedures 1–4 temperature and irradiance corrections to STC. Integrated spectral mismatch factor (SMMF / IEC 60904-7) and incidence-angle modifier (IAM / IEC 61853-2 Martin-Ruiz model).',
  openGraph: {
    title: 'IEC Corrections · Surya Yantra',
    description:
      'IEC 60891:2021 P1–P4 • SMMF (IEC 60904-7) • IAM Martin-Ruiz (IEC 61853-2) — full correction pipeline to STC.',
  },
  twitter: {
    card: 'summary',
    title: 'IEC Corrections · Surya Yantra',
    description: 'IEC 60891 P1–P4, SMMF, and IAM correction pipeline for PV module IV curves.',
  },
};

export default function CorrectionsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
