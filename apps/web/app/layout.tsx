import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const SITE_URL = 'https://surya-yantra.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Surya Yantra — Solar PV Module IV Curve Tracer',
    template: '%s · Surya Yantra',
  },
  description:
    'Open-source PV module testing platform for Srishti PV Lab. IEC 60891:2021 / IEC 60904-compliant IV curve tracing, STC corrections, spectral mismatch, and AI diagnostics for HJT, TOPCon, IBC, Perovskite & CdTe modules.',
  keywords: [
    'IV curve tracer',
    'solar PV module testing',
    'IEC 60891',
    'IEC 60904',
    'STC correction',
    'photovoltaic characterization',
    'ESL-Solar 500',
    'SCPI instrument control',
    'spectral mismatch factor',
    'incidence angle modifier',
    'open source solar testing',
    'HJT module testing',
    'TOPCon',
    'Srishti PV Lab',
    'Jamnagar',
    'India solar testing',
  ],
  authors: [{ name: 'Srishti PV Lab', url: 'https://github.com/ganeshgowri-ASA' }],
  creator: 'Srishti PV Lab',
  publisher: 'Srishti PV Lab',
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'Surya Yantra — Solar PV Module IV Curve Tracer',
    description:
      'IEC 60891:2021 / 60904-compliant PV module testing platform. IV tracing, STC corrections, spectral mismatch & AI diagnostics.',
    url: SITE_URL,
    siteName: 'Surya Yantra',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Surya Yantra — Solar PV Module IV Curve Tracer',
    description:
      'Open-source IEC-compliant IV tracing & diagnostics platform for solar PV labs.',
    creator: '@ganeshgowriASA',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Surya Yantra',
  description:
    'Open-source PV module IV curve tracer and test management system for Srishti PV Lab, Jamnagar.',
  applicationCategory: 'ScientificApplication',
  operatingSystem: 'Web, Windows (Electron)',
  url: SITE_URL,
  author: {
    '@type': 'Organization',
    name: 'Srishti PV Lab',
    url: 'https://github.com/ganeshgowri-ASA',
  },
  license: 'https://opensource.org/licenses/MIT',
  keywords:
    'IV curve tracer, IEC 60891, solar PV, photovoltaic, STC correction, SCPI, HJT, TOPCon',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        {children}
      </body>
      <Script
        id="json-ld-app"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </html>
  );
}
