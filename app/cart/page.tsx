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
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
        <a href="/store" className="text-blue-600 hover:underline">Continue shopping</a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="bg-white rounded-xl border mb-6 divide-y">
        {cart.map(item => (
          <div key={item.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-50">−</button>
              <span className="w-4 text-center">{item.quantity}</span>
              <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-50">+</button>
              <span className="ml-3 font-semibold w-16 text-right">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        ))}
        <div className="flex justify-between px-5 py-4 font-bold">
          <span>Total</span>
          <span className="text-blue-600">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>
        <form action={handleCheckout} className="flex flex-col gap-4">
          <input name="name" placeholder="Full name" required className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input name="phone" placeholder="Phone number" className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <textarea name="address" placeholder="Delivery address" required rows={3} className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition">
            Place Order (Cash on Delivery)
          </button>
        </form>
      </div>
    </div>
  );
}
