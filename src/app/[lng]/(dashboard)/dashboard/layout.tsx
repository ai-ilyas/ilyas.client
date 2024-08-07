import Header from '@/src/components/layout/header';
import Sidebar from '@/src/components/layout/sidebar';
import StoreProvider from '@/src/lib/store/store-provider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ilyas App',
  description: 'Create your Architecture'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="w-full pt-16">
          <StoreProvider>{children}</StoreProvider>
        </main>
      </div>
    </>
  );
}
