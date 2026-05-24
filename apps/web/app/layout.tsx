import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Surya Yantra — Solar PV Module IV Curve Tracer & Test Platform',
    template: '%s · Surya Yantra',
  },
  description:
    'Open-source IEC 60891 / IEC 60904 / IEC 61853-compliant solar PV module characterization platform. IV curve tracing, temperature & irradiance corrections, spectral mismatch, and AI-powered fault diagnostics for Srishti PV Lab, Jamnagar.',
  keywords: [
    'solar PV testing',
    'IV curve tracer',
    'IEC 60891',
    'IEC 60904',
    'IEC 61853',
    'PV module characterization',
    'photovoltaic testing',
    'ESL-Solar 500',
    'SCPI electronic load',
    'solar module diagnostics',
    'STC correction',
    'spectral mismatch factor',
    'incidence angle modifier',
    'Srishti PV Lab',
  ],
  metadataBase: new URL('https://surya-yantra.vercel.app'),
  alternates: {
    canonical: 'https://surya-yantra.vercel.app',
  },
  authors: [{ name: 'Srishti PV Lab', url: 'https://surya-yantra.vercel.app' }],
  openGraph: {
    title: 'Surya Yantra — Solar PV Module IV Curve Tracer',
    description:
      'IEC-compliant solar PV characterization: IV tracing, G/T corrections, spectral mismatch, and AI fault diagnostics. Open-source, runs on Vercel + Electron.',
    type: 'website',
    url: 'https://surya-yantra.vercel.app',
    siteName: 'Surya Yantra',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Surya Yantra — Solar PV Module IV Curve Tracer',
    description:
      'IEC 60891 / 60904 / 61853-compliant PV characterization platform with real-time IV streaming and Claude AI diagnostics.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
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
