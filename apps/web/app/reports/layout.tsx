import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Reports',
  description:
    'Export IEC-certified IV curve test reports in PDF, CSV, and XLSX. Includes STC-corrected parameters (Isc, Voc, Pmax, FF), spectral mismatch factor (SMMF), incidence-angle modifier (IAM), and AI-generated fault diagnostics.',
  openGraph: {
    title: 'Reports · Surya Yantra',
    description:
      'Export certified IV, SMMF, and IAM test reports in PDF / CSV / XLSX. STC-corrected parameters + AI diagnostics.',
  },
  twitter: {
    card: 'summary',
    title: 'Reports · Surya Yantra',
    description: 'Export IEC-certified PV test reports — PDF, CSV, XLSX — with STC correction and AI diagnostics.',
  },
};

export default function ReportsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
