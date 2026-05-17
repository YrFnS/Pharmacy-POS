import type {Metadata} from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/sidebar';
import { ShiftModal } from '@/components/shift-modal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Pharmacy POS',
  description: 'Modern Pharmacy Point of Sale',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-zinc-50 text-zinc-900 flex h-screen overflow-hidden" suppressHydrationWarning>
        <Sidebar  />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
           {children}
        </div>
        <ShiftModal />
      </body>
    </html>
  );
}
