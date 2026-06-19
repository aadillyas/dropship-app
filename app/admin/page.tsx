import { getDb } from '@/lib/db';
import Link from 'next/link';
import { togglePublish, deleteProduct } from '@/actions/products';
import DeleteButton from '@/components/DeleteButton';

type Product = { id: number; title: string; source_price: number; sell_price: number; status: string };

export default function AdminPage() {
  const products = getDb().prepare('SELECT * FROM products ORDER BY created_at DESC').all() as Product[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Catalog Manager</h1>
        <Link href="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Product</th>
              <th className="text-right px-4 py-3 font-semibold">Source</th>
              <th className="text-right px-4 py-3 font-semibold">Sell</th>
              <th className="text-right px-4 py-3 font-semibold">Margin</th>
              <th className="text-center px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(p => {
              const margin = ((p.sell_price - p.source_price) / p.sell_price * 100).toFixed(0);
              return (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-right text-gray-500">${p.source_price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-semibold">${p.sell_price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-green-600 font-medium">{margin}%</td>
                  <td className="px-4 py-3 text-center">
                    <form action={togglePublish.bind(null, p.id, p.status)}>
                      <button type="submit" className={`px-3 py-1 rounded-full text-xs font-semibold ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {p.status === 'published' ? 'Published' : 'Draft'}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/products/${p.id}`} className="text-blue-600 hover:underline mr-3">Edit</Link>
                    <DeleteButton action={deleteProduct.bind(null, p.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 && <p className="text-center py-10 text-gray-400">No products yet.</p>}
      </div>
    </div>
  );
}
