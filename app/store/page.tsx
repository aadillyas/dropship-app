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
      <h1 className="text-2xl font-bold mb-6">Shop</h1>
      {products.length === 0 && <p className="text-gray-500">No products available yet.</p>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(p => (
          <Link key={p.id} href={`/store/${p.id}`} className="bg-white rounded-xl border hover:shadow-md transition overflow-hidden">
            <div className="relative h-48 bg-gray-100">
              <Image src={p.image_url} alt={p.title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-sm mb-1 line-clamp-2">{p.title}</h2>
              <p className="text-blue-600 font-bold">${p.sell_price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
