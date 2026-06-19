import Link from 'next/link';

type Product = { id?: number; title?: string; description?: string; image_url?: string; source_price?: number; sell_price?: number; status?: string };

export default function ProductForm({ product, action }: { product?: Product; action: (formData: FormData) => Promise<void> }) {
  return (
    <div className="max-w-xl">
      <Link href="/admin" className="text-sm text-blue-600 hover:underline mb-4 inline-block">← Back to catalog</Link>
      <div className="bg-white rounded-xl border p-6">
        <h1 className="text-xl font-bold mb-6">{product?.id ? 'Edit Product' : 'Add New Product'}</h1>
        <form action={action} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">Title</label>
            <input name="title" defaultValue={product?.title} required className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Description</label>
            <textarea name="description" defaultValue={product?.description} rows={3} className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Image URL</label>
            <input name="image_url" defaultValue={product?.image_url} className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Source Price ($)</label>
              <input name="source_price" type="number" step="0.01" defaultValue={product?.source_price} required className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Sell Price ($)</label>
              <input name="sell_price" type="number" step="0.01" defaultValue={product?.sell_price} required className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Status</label>
            <select name="status" defaultValue={product?.status ?? 'draft'} className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition mt-2">
            {product?.id ? 'Save Changes' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
