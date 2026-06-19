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
    if (existing) existing.quantity += 1;
    else cart.push({ id: product.id, title: product.title, price: product.sell_price, quantity: 1 });
    saveCart(cart);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
      style={{
        background: added ? 'var(--green)' : 'var(--blue)',
        color: '#fff',
      }}
    >
      {added ? '✓ Added to cart!' : 'Add to Cart'}
    </button>
  );
}

export function CartCount() {
  const [count, setCount] = useState(0);
  const router = useRouter();

  function update() {
    setCount(getCart().reduce((s, i) => s + i.quantity, 0));
  }

  useEffect(() => {
    update();
    window.addEventListener('cart-updated', update);
    return () => window.removeEventListener('cart-updated', update);
  }, []);

  return (
    <button
      onClick={() => router.push('/cart')}
      className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--blue-light)] hover:text-[var(--blue)]"
      style={{ color: 'var(--text-muted)' }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3.6 6h16.8M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
      Cart
      {count > 0 && (
        <span className="text-xs font-bold text-white rounded-full px-1.5 py-0.5 min-w-[20px] text-center"
          style={{ background: 'var(--blue)', lineHeight: '1' }}>
          {count}
        </span>
      )}
    </button>
  );
}
