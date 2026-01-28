import { Metadata } from 'next';
import { searchProducts, sortProducts, filterProducts } from '@/lib/shopify';
import { ProductCard, SortSelect, FilterPanel } from '@/components';
import Link from 'next/link';
import { ShopifyProduct } from '@/lib/shopify/types';
import { parseSearchParams } from '@/lib/url-utils';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q || '';

  return {
    title: query ? `Search: ${query} | Store` : 'Search | Store',
    description: query
      ? `Search results for "${query}"`
      : 'Search for products',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const searchParamsObj = await searchParams;
  const { q } = searchParamsObj;
  const query = q || '';

  let allProducts: ShopifyProduct[] = [];
  let hasSearched = false;

  if (query.trim()) {
    hasSearched = true;
    try {
      allProducts = await searchProducts(query.trim(), 50);
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  // Parse search params for sorting and filtering
  const { sort, filters } = parseSearchParams(new URLSearchParams(searchParamsObj as any));
  
  // Apply filters and sorting
  const filteredProducts = filterProducts(allProducts, filters);
  const sortedProducts = sortProducts(filteredProducts, sort);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {query ? `Search Results for "${query}"` : 'Search'}
        </h1>
        {query && (
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Search Form */}
      <div className="mb-8">
        <form action="/search" method="get" className="max-w-md">
          <div className="relative">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search products..."
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 pr-10 text-sm placeholder-zinc-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:border-white dark:focus:ring-white"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Filters and Sort */}
      {hasSearched && allProducts.length > 0 && (
        <div className="mb-8 space-y-6">
          <FilterPanel 
            products={allProducts} 
            currentFilters={filters}
            productCount={filteredProducts.length}
          />
          
          <div className="flex justify-between items-center">
            <SortSelect currentSort={sort} productCount={filteredProducts.length} />
          </div>
        </div>
      )}

      {/* Results */}
      {!hasSearched ? (
        <div className="text-center py-12">
          <p className="text-zinc-600 dark:text-zinc-400">
            Enter a search term to find products.
          </p>
        </div>
      ) : sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            No products found for "{query}".
          </p>
          <Link
            href="/products"
            className="inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  );
}
