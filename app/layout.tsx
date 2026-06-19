import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { CartCount } from '@/components/CartButton';
import DarkModeToggle from '@/components/DarkModeToggle';

export const metadata: Metadata = {
  title: 'DropShip',
  description: 'Dropshipping demo app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav style={{ background: 'var(--bg-nav)', borderBottom: '1px solid var(--border)' }}
          className="sticky top-0 z-50 backdrop-blur-md px-6 py-3 flex items-center justify-between">
          <Link href="/store" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ background: 'var(--blue)' }}>D</span>
            <span className="font-bold text-lg" style={{ color: 'var(--text)' }}>DropShip</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/store"
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--blue-light)] hover:text-[var(--blue)]"
              style={{ color: 'var(--text-muted)' }}>
              Shop
            </Link>
            <Link href="/admin"
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--blue-light)] hover:text-[var(--blue)]"
              style={{ color: 'var(--text-muted)' }}>
              Admin
            </Link>
            <div style={{ width: 1, height: 20, background: 'var(--border)' }} className="mx-1" />
            <CartCount />
            <DarkModeToggle />
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
