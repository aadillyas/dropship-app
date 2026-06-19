@AGENTS.md

# DropShip App

## What this is
A dropshipping demo app built in Next.js 16 App Router + SQLite. Two portals: an admin portal for managing products (sourced from suppliers like AliExpress) and a customer storefront where users can browse, add to cart, and place orders.

## Tech stack
- **Framework**: Next.js 16 (App Router, Server Components, Server Actions)
- **Database**: SQLite via `better-sqlite3` — file at `dropship.db` in project root (gitignored)
- **Styling**: Tailwind CSS v4 + CSS variables for dark/light theming (no component library)
- **State**: Cart stored in `localStorage`, synced via custom `cart-updated` browser event
- **Hosting**: Not yet deployed — local only. GitHub repo: https://github.com/aadillyas/dropship-app

## File structure
```
app/
  layout.tsx               # Root layout — sticky nav, dark mode toggle, cart count
  page.tsx                 # Redirects to /store
  store/page.tsx           # Customer storefront — product grid
  store/[id]/page.tsx      # Product detail + Add to Cart
  cart/page.tsx            # Cart review + checkout form (client component)
  order-confirm/page.tsx   # Order confirmation page
  admin/page.tsx           # Catalog manager table
  admin/products/new/page.tsx     # Add product form
  admin/products/[id]/page.tsx    # Edit product form

actions/
  products.ts              # Server Actions: createProduct, updateProduct, togglePublish, deleteProduct
  orders.ts                # Server Actions: placeOrder

components/
  CartButton.tsx           # AddToCartButton + CartCount (both client components)
  DarkModeToggle.tsx       # Sun/moon toggle, persists to localStorage
  DeleteButton.tsx         # Client component wrapper for delete confirm dialog
  ProductForm.tsx          # Shared form for create/edit product (server component)

lib/
  db.ts                    # SQLite connection, schema init, seed data (5 products on first run)
```

## Data model
- **products**: `id, title, description, image_url, source_price, sell_price, status (draft/published), created_at`
- **orders**: `id, customer_name, address, phone, total, status, created_at`
- **order_items**: `id, order_id, product_id, title, quantity, price`

## Theming
Dark/light mode uses CSS variables defined in `globals.css`. Key variables:
`--bg`, `--bg-card`, `--bg-nav`, `--border`, `--text`, `--text-muted`, `--blue`, `--blue-hover`, `--blue-light`, `--green`, `--green-light`, `--red`

Dark mode class is `html.dark`, toggled by `DarkModeToggle.tsx`. Always use CSS variables for colors — never hardcode Tailwind color classes for themed elements.

## Key conventions
- `params` in dynamic routes are `Promise<{id: string}>` — always `await params` (Next.js 16)
- No auth — `/admin` is open, no login gate (demo only)
- No payment — orders use Cash on Delivery, no Stripe
- No supplier API scraping — products are added manually via the admin form
- Images use `picsum.photos` as placeholders; `next.config.ts` allows `picsum.photos` as a remote image domain

## Running locally
```bash
npm run dev   # starts on http://localhost:3000
```
Database auto-creates and seeds 5 products on first run.

## What's intentionally not built yet (future work)
- Auth for admin portal
- Stripe or payment gateway
- Real supplier feed / scraping from AliExpress etc.
- Order management UI in admin (view/update order status)
- Email confirmation on order
