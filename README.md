# Shopify Headless Store

A modern headless e-commerce storefront built with Next.js 16 and Shopify Storefront API.

## Features

- **Product Catalog**: Browse products with pagination
- **Product Details**: View detailed product information with image gallery
- **Variant Selection**: Select product options (size, color, etc.)
- **Collections**: Browse products by collection
- **Shopping Cart**: Add/update/remove items with drawer UI
- **Shopify Checkout**: Seamless checkout via Shopify
- **Responsive Design**: Works on all devices
- **Dark Mode**: Automatic dark mode support
- **SEO Optimized**: Dynamic metadata for products and collections

## Tech Stack

- [Next.js 16](https://nextjs.org/)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### 1. Shopify Setup

1. Go to your Shopify Admin panel
2. Navigate to **Settings** → **Apps and sales channels** → **Develop apps**
3. Click **Create an app** and give it a name
4. Configure the **Storefront API** access scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_read_content`
5. Install the app and copy the **Storefront API access token**

### 2. Environment Setup

Update the `.env.local` file with your Shopify credentials:

```bash
# Your Shopify store domain (e.g., your-store.myshopify.com)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com

# Storefront API access token
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token

# API version (use latest stable)
NEXT_PUBLIC_SHOPIFY_API_VERSION=2026-01
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your store.

## Project Structure

```
├── app/
│   ├── api/cart/           # Cart API routes
│   ├── collections/        # Collection pages
│   ├── products/           # Product pages
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/
│   ├── add-to-cart-button.tsx
│   ├── cart-drawer.tsx
│   ├── header.tsx
│   ├── product-card.tsx
│   ├── product-gallery.tsx
│   └── variant-selector.tsx
├── lib/
│   ├── cart-context.tsx    # Cart state management
│   └── shopify/
│       ├── client.ts       # Shopify API client
│       ├── queries.ts      # GraphQL queries
│       └── types.ts        # TypeScript types
```

### Styling

The project uses Tailwind CSS. Customize the design by:
- Editing `app/globals.css` for global styles
- Modifying component classes in the `components/` directory

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add your environment variables
4. Deploy!

### Other Platforms

Build the production version:

```bash
npm run build
npm start
```

## Learn More

- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
