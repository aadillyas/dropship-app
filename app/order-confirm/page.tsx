import { getDb } from '@/lib/db';
import Link from 'next/link';

type Order = { id: number; customer_name: string; address: string; total: number; status: string };
type OrderItem = { title: string; quantity: number; price: number };

export default function OrderConfirmPage({ searchParams }: { searchParams: { orderId?: string } }) {
  const orderId = Number(searchParams.orderId);
  const db = getDb();
  const order = db.prepare('SELECT * FROM orders WHERE id=?').get(orderId) as Order | undefined;
  const items = db.prepare('SELECT * FROM order_items WHERE order_id=?').all(orderId) as OrderItem[];

  if (!order) {
    return <p className="text-center py-20" style={{ color: 'var(--text-muted)' }}>Order not found.</p>;
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl"
          style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
          ✓
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>Order Confirmed!</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          Order <span className="font-semibold" style={{ color: 'var(--text)' }}>#{order.id}</span> — we&apos;ll be in touch soon.
        </p>

        <div className="rounded-xl overflow-hidden mb-6 text-left" style={{ border: '1px solid var(--border)' }}>
          {items.map((item, i) => (
            <div key={i} className="flex justify-between px-4 py-3 text-sm"
              style={{ borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ color: 'var(--text)' }}>{item.title} × {item.quantity}</span>
              <span className="font-semibold" style={{ color: 'var(--text)' }}>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between px-4 py-3 font-bold" style={{ borderTop: '2px solid var(--border)' }}>
            <span style={{ color: 'var(--text)' }}>Total</span>
            <span style={{ color: 'var(--blue)' }}>${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="rounded-xl p-4 text-sm text-left mb-6" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="flex gap-2 mb-1">
            <span style={{ color: 'var(--text-muted)' }}>Name</span>
            <span className="font-medium" style={{ color: 'var(--text)' }}>{order.customer_name}</span>
          </div>
          <div className="flex gap-2 mb-1">
            <span style={{ color: 'var(--text-muted)' }}>Address</span>
            <span className="font-medium" style={{ color: 'var(--text)' }}>{order.address}</span>
          </div>
          <div className="flex gap-2">
            <span style={{ color: 'var(--text-muted)' }}>Payment</span>
            <span className="font-medium" style={{ color: 'var(--text)' }}>Cash on Delivery</span>
          </div>
        </div>

        <Link href="/store"
          className="inline-block px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
          style={{ background: 'var(--blue)' }}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
