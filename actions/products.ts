'use server';

import { getDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProduct(formData: FormData) {
  const db = getDb();
  db.prepare(`
    INSERT INTO products (title, description, image_url, source_price, sell_price, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    formData.get('title'),
    formData.get('description'),
    formData.get('image_url'),
    Number(formData.get('source_price')),
    Number(formData.get('sell_price')),
    formData.get('status') ?? 'draft'
  );
  revalidatePath('/admin');
  revalidatePath('/store');
  redirect('/admin');
}

export async function updateProduct(id: number, formData: FormData) {
  const db = getDb();
  db.prepare(`
    UPDATE products SET title=?, description=?, image_url=?, source_price=?, sell_price=?, status=?
    WHERE id=?
  `).run(
    formData.get('title'),
    formData.get('description'),
    formData.get('image_url'),
    Number(formData.get('source_price')),
    Number(formData.get('sell_price')),
    formData.get('status') ?? 'draft',
    id
  );
  revalidatePath('/admin');
  revalidatePath('/store');
  redirect('/admin');
}

export async function togglePublish(id: number, currentStatus: string) {
  const db = getDb();
  const next = currentStatus === 'published' ? 'draft' : 'published';
  db.prepare('UPDATE products SET status=? WHERE id=?').run(next, id);
  revalidatePath('/admin');
  revalidatePath('/store');
}

export async function deleteProduct(id: number) {
  const db = getDb();
  db.prepare('DELETE FROM products WHERE id=?').run(id);
  revalidatePath('/admin');
  revalidatePath('/store');
  redirect('/admin');
}
