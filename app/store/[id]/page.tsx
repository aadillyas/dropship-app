import { getDb } from '@/lib/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { AddToCartButton } from '@/components/CartButton';
import Link from 'next/link';

type Product = { id: number; title: string; description: string; image_url: string; sell_price: number };

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getDb().prepare(
    "SELECT * FROM products WHERE id=? AND status='published'"
  ).get(Number(id)) as Product | undefined;

  if (!product) notFound();

  return (
    <div>
      <Link href="/store"
        className="inline-flex items-center gap-1 text-sm mb-6 hover:underline"
        style={{ color: 'var(--text-muted)' }}>
        ← Back to shop
      </Link>

      <div className="rounded-2xl overflow-hidden flex flex-col md:flex-row gap-0"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="relative w-full md:w-96 h-72 md:h-auto flex-shrink-0" style={{ background: 'var(--border)' }}>
          <Image src={product.image_url} alt={product.title} fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-between p-8 flex-1">
          <div>
            <h1 className="text-2xl font-bold mb-3 leading-snug" style={{ color: 'var(--text)' }}>{product.title}</h1>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{product.description}</p>
          </div>
          <div className="mt-8">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold" style={{ color: 'var(--blue)' }}>${product.sell_price.toFixed(2)}</span>
            </div>
            <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>Free delivery · Cash on delivery</p>
            <AddToCartButton product={{ id: product.id, title: product.title, sell_price: product.sell_price }} />
          </div>
        </div>
      </div>
    </div>
  );
}
