import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IEC Corrections',
  description:
    'Apply IEC 60891:2021 Procedures 1–4 temperature and irradiance corrections to solar PV IV curves. Interactive P1 linear, P2 multiplicative, P3 bilinear, and P4 combined parametric correction with SMMF and IAM support.',
  keywords: [
    'IEC 60891',
    'temperature correction',
    'irradiance correction',
    'STC correction',
    'P1 P2 P3 P4',
    'spectral mismatch',
    'incidence angle modifier',
    'PV IV correction',
  ],
  alternates: { canonical: 'https://surya-yantra.vercel.app/corrections' },
  openGraph: {
    title: 'IEC 60891 Corrections · Surya Yantra',
    description:
      'Interactive IEC 60891:2021 P1–P4 temperature and irradiance correction calculator for solar PV module IV curves.',
    url: 'https://surya-yantra.vercel.app/corrections',
  },
};

export default function CorrectionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
