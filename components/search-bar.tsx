'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchProducts } from '@/lib/shopify';
import { ShopifyProduct } from '@/lib/shopify/types';

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProductsAsync = async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const products = await searchProducts(query.trim(), 8);
          setResults(products);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    };

    const timeoutId = setTimeout(searchProductsAsync, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
      setResults([]);
    }
  };

  const handleProductClick = (product: ShopifyProduct) => {
    router.push(`/products/${product.handle}`);
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  return (
    <div ref={searchRef} className="relative">
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        aria-label="Search"
      >
        <svg
          className="h-6 w-6"
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

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 rounded-lg border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 pr-10 text-sm placeholder-zinc-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:border-white dark:focus:ring-white"
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-black dark:border-zinc-600 dark:border-t-white"></div>
                </div>
              )}
            </div>

            {/* Search Results */}
            {query.trim().length >= 2 && (
              <div className="space-y-2">
                {results.length > 0 ? (
                  <div className="max-h-80 space-y-2 overflow-y-auto">
                    {results.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        {/* Product Image */}
                        {product.featuredImage && (
                          <img
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText || product.title}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        )}
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {product.title}
                          </h3>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {product.priceRange.minVariantPrice.amount
                              ? `$${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}`
                              : 'Price not available'}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : !isLoading ? (
                  <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                    No products found for "{query}"
                  </p>
                ) : null}
              </div>
            )}

            {/* Search Button */}
            {query.trim().length >= 2 && (
              <button
                type="submit"
                className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                See all results for "{query}"
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
