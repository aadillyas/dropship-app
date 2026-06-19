'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type CartItem = { id: number; title: string; price: number; quantity: number };

function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
}

export function AddToCartButton({ product }: { product: { id: number; title: string; sell_price: number } }) {
  const [added, setAdded] = useState(false);

  function handleAdd() {
    const cart = getCart();
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id: product.id, title: product.title, price: product.sell_price, quantity: 1 });
    }
    saveCart(cart);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
    >
      {added ? '✓ Added!' : 'Add to Cart'}
    </button>
  );
}

export function CartCount() {
  const [count, setCount] = useState(0);
  const router = useRouter();

  function update() {
    const cart = getCart();
    setCount(cart.reduce((s, i) => s + i.quantity, 0));
  }

  useEffect(() => {
    update();
    window.addEventListener('cart-updated', update);
    return () => window.removeEventListener('cart-updated', update);
  }, []);

  return (
    <button onClick={() => router.push('/cart')} className="relative">
      <span>🛒 Cart</span>
      {count > 0 && (
        <span className="ml-1 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">{count}</span>
      )}
    </button>
  );
}
