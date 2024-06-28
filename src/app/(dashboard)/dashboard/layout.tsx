import Header from '@/src/components/layout/header';
import Sidebar from '@/src/components/layout/sidebar';
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
        <main className="w-full pt-16">{children}</main>
      </div>
    </>
  );
}
