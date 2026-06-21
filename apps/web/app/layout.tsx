import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://surya-yantra.vercel.app'),
  applicationName: 'Surya Yantra',
  title: {
    default: 'Surya Yantra — Solar Module Characterization Lab',
    template: '%s · Surya Yantra',
  },
  description:
    'IEC 60891 / 60904-compliant open-source PV module characterization platform — automated IV curve tracing, irradiance & temperature corrections, real-time AI diagnostics for solar test laboratories.',
  keywords: [
    'solar PV IV curve tracer',
    'IEC 60891 correction',
    'photovoltaic module characterization',
    'open-source solar testing',
    'SCPI electronic load',
    'ISO 17025 LIMS',
    'NABL accreditation',
    'ESL-Solar 500',
    'STC correction',
    'spectral mismatch factor',
    'Next.js solar lab',
    'Srishti PV Lab',
  ],
  authors: [{ name: 'Srishti PV Lab', url: 'https://surya-yantra.vercel.app' }],
  creator: 'Srishti PV Lab / ganeshgowri-ASA',
  publisher: 'Srishti PV Lab',
  category: 'Technology / Renewable Energy',
  alternates: {
    // TODO issue #195: update to https://surya-yantra.srishtipvlab.in once DNS verified
    canonical: 'https://surya-yantra.vercel.app',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://surya-yantra.vercel.app',
    siteName: 'Surya Yantra',
    title: 'Surya Yantra — Solar Module Characterization Lab',
    description:
      'IEC 60891 / 60904-compliant open-source PV module IV characterization platform for the Srishti PV Lab, Jamnagar. 75-module test bed, real-time IV tracing, AI diagnostics.',
    // TODO issue #194: images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Surya Yantra IV curve tracer dashboard' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Surya Yantra — Solar Module Characterization Lab',
    description:
      'Open-source PV module IV curve tracer · IEC 60891:2021 · 75-module test bed · AI diagnostics',
    creator: '@SrishtiPVLab',
    // TODO issue #194: images: ['/og-default.png'],
  },
  // TODO issue #196: add verification tokens after GSC / Bing Webmaster registration
  // verification: {
  //   google: 'PASTE_GSC_TOKEN',
  //   other: { 'msvalidate.01': 'PASTE_BING_TOKEN' },
  // },
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
    </html>
  );
}
