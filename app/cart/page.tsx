'use client';

import { useState, useEffect } from 'react';
import { placeOrder } from '@/actions/orders';

type CartItem = { id: number; title: string; price: number; quantity: number };

function getCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => { setCart(getCart()); }, []);

  function updateQty(id: number, delta: number) {
    const updated = cart.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)
      .filter(i => i.quantity > 0);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  }

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  async function handleCheckout(formData: FormData) {
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cart-updated'));
    await placeOrder(JSON.stringify(cart), formData);
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-28">
        <div className="text-5xl mb-4">🛒</div>
        <p className="font-semibold text-lg mb-2" style={{ color: 'var(--text)' }}>Your cart is empty</p>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Add some products to get started</p>
        <a href="/store"
          className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition"
          style={{ background: 'var(--blue)' }}>
          Browse products
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--text)' }}>Your Cart</h1>

      <div className="rounded-2xl overflow-hidden mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {cart.map((item, i) => (
          <div key={item.id}
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: i < cart.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div className="flex-1 min-w-0 mr-4">
              <p className="font-medium text-sm truncate" style={{ color: 'var(--text)' }}>{item.title}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>${item.price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item.id, -1)}
                className="w-7 h-7 rounded-lg text-lg font-bold flex items-center justify-center transition hover:opacity-80"
                style={{ background: 'var(--border)', color: 'var(--text)' }}>−</button>
              <span className="w-6 text-center text-sm font-semibold" style={{ color: 'var(--text)' }}>{item.quantity}</span>
              <button onClick={() => updateQty(item.id, 1)}
                className="w-7 h-7 rounded-lg text-lg font-bold flex items-center justify-center transition hover:opacity-80"
                style={{ background: 'var(--blue)', color: '#fff' }}>+</button>
              <span className="ml-3 font-bold text-sm w-16 text-right" style={{ color: 'var(--text)' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center px-5 py-4" style={{ borderTop: '2px solid var(--border)' }}>
          <span className="font-bold" style={{ color: 'var(--text)' }}>Total</span>
          <span className="text-xl font-bold" style={{ color: 'var(--blue)' }}>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="text-lg font-bold mb-5" style={{ color: 'var(--text)' }}>Shipping Details</h2>
        <form action={handleCheckout} className="flex flex-col gap-4">
          {[
            { name: 'name', placeholder: 'Full name', required: true },
            { name: 'phone', placeholder: 'Phone number', required: false },
          ].map(f => (
            <input key={f.name} name={f.name} placeholder={f.placeholder} required={f.required}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 transition"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          ))}
          <textarea name="address" placeholder="Delivery address" required rows={3}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 transition resize-none"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          <button type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white text-sm transition hover:opacity-90"
            style={{ background: 'var(--green)' }}>
            Place Order — Cash on Delivery
          </button>
        </form>
      </div>
    </div>
  );
}
