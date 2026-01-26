import { Metadata } from 'next';
import { getProducts } from '@/lib/shopify';
import { ProductCard } from '@/components';

export const metadata: Metadata = {
  title: 'All Products | Store',
  description: 'Browse our collection of products',
};

export default async function ProductsPage() {
  const products = await getProducts(50);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          All Products
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg
            className="mb-4 h-16 w-16 text-zinc-300 dark:text-zinc-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            No products found
          </h2>
          <p className="mt-2 text-zinc-500">
            Check back later for new arrivals!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
