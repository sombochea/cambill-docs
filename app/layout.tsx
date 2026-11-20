import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Geist, Geist_Mono } from 'next/font/google';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { template: '%s · CamBill Docs', default: 'CamBill Docs' },
  description: 'Accept KHQR and Bakong payments, invoice customers, bill subscriptions. Integrate in minutes.',
};

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} font-sans`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
