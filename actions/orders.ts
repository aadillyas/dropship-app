'use server';

import { getDb } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function placeOrder(cartJson: string, formData: FormData) {
  const db = getDb();
  const cart: { id: number; title: string; price: number; quantity: number }[] = JSON.parse(cartJson);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const result = db.prepare(`
    INSERT INTO orders (customer_name, address, phone, total)
    VALUES (?, ?, ?, ?)
  `).run(
    formData.get('name'),
    formData.get('address'),
    formData.get('phone'),
    total
  );

  const orderId = result.lastInsertRowid as number;

  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, title, quantity, price)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const item of cart) {
    insertItem.run(orderId, item.id, item.title, item.quantity, item.price);
  }

  redirect(`/order-confirm?orderId=${orderId}`);
}
