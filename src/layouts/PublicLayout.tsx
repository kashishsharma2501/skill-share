import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export function PublicLayout({ children, hideFooter }: PublicLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
