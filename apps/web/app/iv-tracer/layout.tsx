import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'IV Tracer',
  description:
    'Run IEC 60891:2021 P1–P4 corrected IV sweeps against the ESL-Solar 500 electronic load. Real-time IV+PV curve plotting via WebSocket · STC correction · fill-factor and MPP computation.',
  openGraph: {
    title: 'IV Tracer · Surya Yantra',
    description:
      'Real-time PV module IV curve sweeps with IEC 60891:2021 STC correction. ESL-Solar 500 · 300 V / 27 A range.',
  },
  twitter: {
    card: 'summary',
    title: 'IV Tracer · Surya Yantra',
    description: 'Real-time IEC 60891-corrected IV sweeps on the ESL-Solar 500.',
  },
};

export default function IvTracerLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
