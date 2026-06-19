import { getDb } from '@/lib/db';
import { updateProduct } from '@/actions/products';
import ProductForm from '@/components/ProductForm';
import { notFound } from 'next/navigation';

type Product = { id: number; title: string; description: string; image_url: string; source_price: number; sell_price: number; status: string };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getDb().prepare('SELECT * FROM products WHERE id=?').get(Number(id)) as Product | undefined;
  if (!product) notFound();

  const action = updateProduct.bind(null, product.id);
  return <ProductForm product={product} action={action} />;
}
