import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/Sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Surya Yantra — Srishti PV Lab',
  description: 'PV module IV curve tracer & IEC 60891 test management system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <TooltipProvider delayDuration={150}>
          <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
