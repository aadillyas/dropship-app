import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'dropship.db');

let db: Database.Database;

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      source_price REAL NOT NULL,
      sell_price REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'received',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL
    );
  `);
  seedIfEmpty();
}

function seedIfEmpty() {
  const count = (db.prepare('SELECT COUNT(*) as c FROM products').get() as { c: number }).c;
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO products (title, description, image_url, source_price, sell_price, status)
    VALUES (?, ?, ?, ?, ?, 'published')
  `);

  const products = [
    ['Wireless Earbuds Pro', 'High quality TWS earbuds with active noise cancellation and 30hr battery life.', 'https://picsum.photos/seed/earbuds/400/400', 8.50, 29.99],
    ['Magnetic Phone Stand', 'Adjustable desk stand with magnetic base, compatible with all phones.', 'https://picsum.photos/seed/stand/400/400', 3.20, 14.99],
    ['LED Desk Lamp', 'Touch-controlled LED lamp with 3 brightness levels and USB charging port.', 'https://picsum.photos/seed/lamp/400/400', 11.00, 39.99],
    ['Portable Blender', 'USB rechargeable mini blender for smoothies on the go. 400ml capacity.', 'https://picsum.photos/seed/blender/400/400', 9.80, 34.99],
    ['Smart Watch Fitness Tracker', 'Heart rate monitor, step counter, sleep tracking. Water resistant.', 'https://picsum.photos/seed/watch/400/400', 15.00, 54.99],
  ];

  for (const p of products) {
    insert.run(...p);
  }
}
