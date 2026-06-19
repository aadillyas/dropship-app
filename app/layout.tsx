import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { CartCount } from '@/components/CartButton';

export const metadata: Metadata = {
  title: 'DropShip Demo',
  description: 'Dropshipping demo app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
          <Link href="/store" className="font-bold text-xl text-blue-600">DropShip</Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/store" className="hover:text-blue-600">Shop</Link>
            <Link href="/admin" className="hover:text-blue-600">Admin</Link>
            <CartCount />
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
