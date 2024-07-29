import Providers from '@/src/components/layout/providers';
import { Toaster } from '@/src/components/ui/toaster';
import '@uploadthing/react/styles.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { auth } from '@/src/auth';
import { languages } from '../i18n/settings';
import { dir } from 'i18next';
import ConvexClientProvider from '@/src/components/convex-client-provider';
import { TooltipProvider } from '@radix-ui/react-tooltip';

const inter = Inter({ subsets: ['latin'] });

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export const metadata: Metadata = {
  title: 'Next Shadcn',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default async function RootLayout({
  children,
  params: {
    lng
  }
}: {
  children: React.ReactNode,
  params: {
    lng: string
  }
}) {
  const session = await auth();
  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden`}>
        <ConvexClientProvider session={session}>
          <Toaster />
          <TooltipProvider>{children}</TooltipProvider>
          
        </ConvexClientProvider>
      </body>
    </html>
  );
}
