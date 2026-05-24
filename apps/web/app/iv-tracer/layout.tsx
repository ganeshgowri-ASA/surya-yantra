import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IV Tracer',
  description:
    'Run IEC 60891-corrected IV sweeps against the ESL-Solar 500 electronic load. Real-time Socket.IO curve streaming, 500-point resolution, Kelvin-sensed measurements.',
  keywords: [
    'IV curve tracer',
    'ESL-Solar 500',
    'IEC 60891 sweep',
    'real-time IV curve',
    'solar module sweep',
    'SCPI electronic load',
  ],
  alternates: { canonical: 'https://surya-yantra.vercel.app/iv-tracer' },
  openGraph: {
    title: 'IV Tracer · Surya Yantra',
    description:
      'Real-time IEC 60891-corrected IV curve tracer for solar PV modules.',
    url: 'https://surya-yantra.vercel.app/iv-tracer',
  },
};

export default function IvTracerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
