import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Surya Yantra — Solar Module Characterization Lab',
    template: '%s · Surya Yantra',
  },
  description:
    'IEC 60891:2021 / IEC 60904 / IEC 61853-compliant solar PV module IV curve tracer and characterization platform — real-time IV tracing, spectral mismatch correction, incidence-angle modifier, and AI diagnostics for HJT, TOPCon, IBC, HPBC, and CdTe modules.',
  applicationName: 'Surya Yantra',
  authors: [{ name: 'Srishti PV Lab', url: 'https://surya-yantra.vercel.app' }],
  keywords: [
    'solar PV testing',
    'IV curve tracer',
    'IEC 60891',
    'IEC 60904',
    'IEC 61853',
    'spectral mismatch factor',
    'SMMF',
    'incidence angle modifier',
    'IAM',
    'STC correction',
    'ESL-Solar 500',
    'HJT',
    'TOPCon',
    'IBC',
    'HPBC',
    'bifacial module',
    'CdTe thin film',
    'MUX relay matrix',
    'Kelvin 4-wire',
    'Srishti PV Lab',
    'open-source LIMS',
    'photovoltaic characterization',
  ],
  metadataBase: new URL('https://surya-yantra.vercel.app'),
  alternates: { canonical: 'https://surya-yantra.vercel.app' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Surya Yantra — Solar Module Characterization Lab',
    description:
      'Open-source PV module IV curve tracer. IEC 60891:2021 P1–P4 corrections, SMMF (IEC 60904-7), IAM Martin-Ruiz (IEC 61853-2). 300 V / 27 A · 75-module 4-wire test bed · ESL-Solar 500.',
    type: 'website',
    url: 'https://surya-yantra.vercel.app',
    siteName: 'Surya Yantra',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary',
    title: 'Surya Yantra — Solar Module Characterization Lab',
    description:
      'IEC 60891-compliant open-source PV module IV curve tracer. Next.js + Electron. Srishti PV Lab, Jamnagar.',
    creator: '@ganeshgowriASA',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Surya Yantra',
  applicationCategory: 'Scientific Software',
  operatingSystem: 'Web, Windows',
  description:
    'IEC 60891:2021 / IEC 60904 / IEC 61853-compliant solar PV module IV curve tracer and characterization platform for the Srishti PV Lab 75-module test bed.',
  url: 'https://surya-yantra.vercel.app',
  author: {
    '@type': 'Organization',
    name: 'Srishti PV Lab',
    url: 'https://surya-yantra.vercel.app',
  },
  license: 'https://opensource.org/licenses/MIT',
  codeRepository: 'https://github.com/ganeshgowri-ASA/surya-yantra',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        {children}
      </body>
    </html>
  );
}
