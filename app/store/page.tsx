import { getDb } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';

type Product = { id: number; title: string; description: string; image_url: string; sell_price: number };

export default function StorePage() {
  const products = getDb().prepare(
    "SELECT id, title, description, image_url, sell_price FROM products WHERE status='published'"
  ).all() as Product[];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--text)' }}>Shop</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{products.length} products available</p>
      </div>

      {products.length === 0 && (
        <p className="text-center py-20" style={{ color: 'var(--text-muted)' }}>No products available yet.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {products.map(p => (
          <Link key={p.id} href={`/store/${p.id}`}
            className="group rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="relative h-52 overflow-hidden" style={{ background: 'var(--border)' }}>
              <Image src={p.image_url} alt={p.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-sm mb-2 line-clamp-2 leading-snug" style={{ color: 'var(--text)' }}>{p.title}</h2>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold" style={{ color: 'var(--blue)' }}>${p.sell_price.toFixed(2)}</span>
                <span className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ background: 'var(--blue-light)', color: 'var(--blue)' }}>
                  View →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
