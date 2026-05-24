import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test Reports',
  description:
    'Export certified IEC 60891 IV test reports for solar PV modules as PDF, CSV, or XLSX. Includes STC-corrected Isc, Voc, Pmpp, FF, SMMF, and IAM parameters with measurement traceability.',
  keywords: [
    'PV test report',
    'solar module report PDF',
    'IEC 60891 test report',
    'STC corrected IV report',
    'photovoltaic certification report',
    'IV curve export',
  ],
  alternates: { canonical: 'https://surya-yantra.vercel.app/reports' },
  openGraph: {
    title: 'Test Reports · Surya Yantra',
    description:
      'Export IEC-compliant solar PV module test reports: STC-corrected IV parameters, SMMF, IAM — PDF, CSV, XLSX.',
    url: 'https://surya-yantra.vercel.app/reports',
  },
};

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
