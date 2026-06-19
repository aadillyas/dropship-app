import { getDb } from '@/lib/db';
import Link from 'next/link';

type Order = { id: number; customer_name: string; address: string; total: number; status: string; created_at: string };
type OrderItem = { title: string; quantity: number; price: number };

export default function OrderConfirmPage({ searchParams }: { searchParams: { orderId?: string } }) {
  const orderId = Number(searchParams.orderId);
  const db = getDb();
  const order = db.prepare('SELECT * FROM orders WHERE id=?').get(orderId) as Order | undefined;
  const items = db.prepare('SELECT * FROM order_items WHERE order_id=?').all(orderId) as OrderItem[];

  if (!order) {
    return <p className="text-center py-20 text-gray-500">Order not found.</p>;
  }

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="bg-white rounded-xl border p-8">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✓</span>
        </div>
        <h1 className="text-2xl font-bold mb-1">Order Confirmed!</h1>
        <p className="text-gray-500 mb-6">Order #{order.id} — We&apos;ll be in touch soon.</p>

        <div className="text-left bg-gray-50 rounded-lg p-4 mb-6 divide-y">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between py-2 text-sm">
              <span>{item.title} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between py-2 font-bold">
            <span>Total</span>
            <span className="text-blue-600">${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-left text-sm text-gray-600 mb-6">
          <p><span className="font-medium">Name:</span> {order.customer_name}</p>
          <p><span className="font-medium">Address:</span> {order.address}</p>
          <p><span className="font-medium">Payment:</span> Cash on Delivery</p>
        </div>

        <Link href="/store" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
