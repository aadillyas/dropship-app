import Link from 'next/link';

type Product = { id?: number; title?: string; description?: string; image_url?: string; source_price?: number; sell_price?: number; status?: string };

const inputStyle = {
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
};

export default function ProductForm({ product, action }: { product?: Product; action: (formData: FormData) => Promise<void> }) {
  return (
    <div className="max-w-xl">
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm mb-6 hover:underline" style={{ color: 'var(--text-muted)' }}>
        ← Back to catalog
      </Link>
      <div className="rounded-2xl p-7" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>
          {product?.id ? 'Edit Product' : 'Add New Product'}
        </h1>
        <form action={action} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'var(--text-muted)' }}>Title</label>
            <input name="title" defaultValue={product?.title} required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 transition"
              style={inputStyle} />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
            <textarea name="description" defaultValue={product?.description} rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 transition resize-none"
              style={inputStyle} />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'var(--text-muted)' }}>Image URL</label>
            <input name="image_url" defaultValue={product?.image_url}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 transition"
              style={inputStyle} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'var(--text-muted)' }}>Source Price ($)</label>
              <input name="source_price" type="number" step="0.01" defaultValue={product?.source_price} required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 transition"
                style={inputStyle} />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'var(--text-muted)' }}>Sell Price ($)</label>
              <input name="sell_price" type="number" step="0.01" defaultValue={product?.sell_price} required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 transition"
                style={inputStyle} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'var(--text-muted)' }}>Status</label>
            <select name="status" defaultValue={product?.status ?? 'draft'}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 transition"
              style={inputStyle}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <button type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white text-sm transition hover:opacity-90 mt-2"
            style={{ background: 'var(--blue)' }}>
            {product?.id ? 'Save Changes' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
