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
    'IEC 60891 / 60904-compliant solar PV module characterization platform — IV tracing, environmental corrections, and real-time diagnostics.',
  metadataBase: new URL('https://surya-yantra.vercel.app'),
  openGraph: {
    title: 'Surya Yantra',
    description: 'Solar module characterization & diagnostics platform.',
    type: 'website',
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
