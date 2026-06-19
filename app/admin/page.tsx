import { getDb } from '@/lib/db';
import Link from 'next/link';
import { togglePublish, deleteProduct } from '@/actions/products';
import DeleteButton from '@/components/DeleteButton';

type Product = { id: number; title: string; source_price: number; sell_price: number; status: string };

export default function AdminPage() {
  const products = getDb().prepare('SELECT * FROM products ORDER BY created_at DESC').all() as Product[];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Catalog</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{products.length} products</p>
        </div>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
          style={{ background: 'var(--blue)' }}>
          + Add Product
        </Link>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <table className="w-full text-sm">
          <thead style={{ borderBottom: '1px solid var(--border)' }}>
            <tr>
              {['Product', 'Source', 'Sell', 'Margin', 'Status', ''].map(h => (
                <th key={h} className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wide ${h === 'Product' || h === '' ? 'text-left' : 'text-right'} ${h === 'Status' ? 'text-center' : ''}`}
                  style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => {
              const margin = ((p.sell_price - p.source_price) / p.sell_price * 100).toFixed(0);
              return (
                <tr key={p.id} style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                  <td className="px-5 py-4 font-medium max-w-[200px] truncate" style={{ color: 'var(--text)' }}>{p.title}</td>
                  <td className="px-5 py-4 text-right" style={{ color: 'var(--text-muted)' }}>${p.source_price.toFixed(2)}</td>
                  <td className="px-5 py-4 text-right font-semibold" style={{ color: 'var(--text)' }}>${p.sell_price.toFixed(2)}</td>
                  <td className="px-5 py-4 text-right">
                    <span className="font-semibold" style={{ color: 'var(--green)' }}>{margin}%</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <form action={togglePublish.bind(null, p.id, p.status)}>
                      <button type="submit"
                        className="px-3 py-1 rounded-full text-xs font-semibold transition hover:opacity-80"
                        style={p.status === 'published'
                          ? { background: 'var(--green-light)', color: 'var(--green)' }
                          : { background: 'var(--border)', color: 'var(--text-muted)' }}>
                        {p.status === 'published' ? '● Published' : '○ Draft'}
                      </button>
                    </form>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/admin/products/${p.id}`}
                      className="text-xs font-medium mr-4 hover:underline"
                      style={{ color: 'var(--blue)' }}>
                      Edit
                    </Link>
                    <DeleteButton action={deleteProduct.bind(null, p.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="text-center py-16 text-sm" style={{ color: 'var(--text-muted)' }}>No products yet. Add one to get started.</p>
        )}
      </div>
    </div>
  );
}
