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
      <Link href="/store" className="text-sm text-blue-600 hover:underline mb-4 inline-block">← Back to shop</Link>
      <div className="bg-white rounded-xl border p-6 flex flex-col md:flex-row gap-8">
        <div className="relative w-full md:w-80 h-64 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <Image src={product.image_url} alt={product.title} fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h1 className="text-2xl font-bold mb-3">{product.title}</h1>
            <p className="text-gray-600 mb-6">{product.description}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600 mb-4">${product.sell_price.toFixed(2)}</p>
            <AddToCartButton product={{ id: product.id, title: product.title, sell_price: product.sell_price }} />
          </div>
        </div>
      </div>
    </div>
  );
}
