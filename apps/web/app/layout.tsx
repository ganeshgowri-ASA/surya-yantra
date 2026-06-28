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
    'IEC 60891 / 60904-compliant solar PV module characterization platform — IV tracing, environmental corrections, and real-time diagnostics for Srishti PV Lab, Jamnagar.',
  applicationName: 'Surya Yantra',
  authors: [{ name: 'Srishti PV Lab', url: 'https://surya-yantra.vercel.app' }],
  keywords: [
    'PV module testing',
    'IV curve tracer',
    'solar characterization',
    'IEC 60891',
    'IEC 60904',
    'IEC 61853',
    'SCPI',
    'ESL-Solar 500',
    'spectral mismatch factor',
    'STC correction',
    'HJT solar',
    'TOPCon',
    'IBC module',
    'CdTe thin film',
    'NABL accreditation',
    'open source PV lab',
    'Srishti PV Lab',
    'Jamnagar solar',
  ],
  metadataBase: new URL('https://surya-yantra.vercel.app'),
  alternates: {
    canonical: 'https://surya-yantra.vercel.app',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'Surya Yantra — Solar Module Characterization Lab',
    description:
      'IEC 60891 / 60904-compliant solar PV module characterization platform — IV tracing, environmental corrections, and real-time diagnostics.',
    type: 'website',
    url: 'https://surya-yantra.vercel.app',
    siteName: 'Surya Yantra',
    locale: 'en_IN',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Surya Yantra — Solar PV Module IV Characterization Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Surya Yantra — Solar Module Characterization Lab',
    description:
      'IEC 60891 / 60904-compliant PV module IV tracer — open-source, Vercel + Electron, Srishti PV Lab Jamnagar.',
    images: ['/og-image.png'],
  },
  category: 'technology',
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
