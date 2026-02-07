'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterOptions, extractFilterOptions } from '@/lib/shopify/filtering';
import { ShopifyProduct } from '@/lib/shopify/types';

interface FilterPanelProps {
  products: ShopifyProduct[];
  currentFilters: FilterOptions;
  productCount: number;
}

export function FilterPanel({ products, currentFilters, productCount }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);

  const filterOptions = extractFilterOptions(products);

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update price range
    if (newFilters.priceRange) {
      if (newFilters.priceRange.min) {
        params.set('min_price', newFilters.priceRange.min.toString());
      } else {
        params.delete('min_price');
      }
      if (newFilters.priceRange.max) {
        params.set('max_price', newFilters.priceRange.max.toString());
      } else {
        params.delete('max_price');
      }
    }

    // Update vendors
    if (newFilters.vendors) {
      if (newFilters.vendors.length > 0) {
        params.set('vendors', newFilters.vendors.join(','));
      } else {
        params.delete('vendors');
      }
    }

    // Update product types
    if (newFilters.productTypes) {
      if (newFilters.productTypes.length > 0) {
        params.set('types', newFilters.productTypes.join(','));
      } else {
        params.delete('types');
      }
    }

    // Update tags
    if (newFilters.tags) {
      if (newFilters.tags.length > 0) {
        params.set('tags', newFilters.tags.join(','));
      } else {
        params.delete('tags');
      }
    }

    // Update stock status
    if (newFilters.inStock !== undefined) {
      params.set('in_stock', newFilters.inStock.toString());
    } else {
      params.delete('in_stock');
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('min_price');
    params.delete('max_price');
    params.delete('vendors');
    params.delete('types');
    params.delete('tags');
    params.delete('in_stock');

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  const hasActiveFilters = !!(
    currentFilters.priceRange ||
    (currentFilters.vendors && currentFilters.vendors.length > 0) ||
    (currentFilters.productTypes && currentFilters.productTypes.length > 0) ||
    (currentFilters.tags && currentFilters.tags.length > 0) ||
    currentFilters.inStock !== undefined
  );

  return (
    <div className="border-b border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between px-0 pr-4 py-0">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 text-left cursor-pointer w-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors rounded-lg px-4 py-4 -my-0"
        >
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-zinc-600 dark:text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Filters</h3>
          </div>
          {hasActiveFilters && (
            <span className="inline-flex items-center rounded-full bg-black px-2.5 py-0.5 text-xs font-medium text-white dark:bg-white dark:text-black">
              {productCount}
            </span>
          )}
        </button>
        
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm cursor-pointer whitespace-nowrap text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            <svg
              className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="px-4 pt-2 pb-6 space-y-6">
          {/* Price Range */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
              <svg
                className="h-4 w-4 text-zinc-500 dark:text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              Price Range
            </h4>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={currentFilters.priceRange?.min || ''}
                  onChange={(e) => {
                    const min = e.target.value ? parseFloat(e.target.value) : undefined;
                    updateFilters({
                      priceRange: {
                        min,
                        max: currentFilters.priceRange?.max,
                      },
                    });
                  }}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-white dark:focus:ring-white"
                />
              </div>
              <span className="text-zinc-500 font-medium">-</span>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Max"
                  value={currentFilters.priceRange?.max || ''}
                  onChange={(e) => {
                    const max = e.target.value ? parseFloat(e.target.value) : undefined;
                    updateFilters({
                      priceRange: {
                        min: currentFilters.priceRange?.min,
                        max,
                      },
                    });
                  }}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-white dark:focus:ring-white"
                />
              </div>
            </div>
          </div>

          {/* In Stock */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
              <svg
                className="h-4 w-4 text-zinc-500 dark:text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Availability
            </h4>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={currentFilters.inStock === true}
                onChange={(e) => {
                  updateFilters({ inStock: e.target.checked ? true : undefined });
                }}
                className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:focus:ring-white"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">In Stock Only</span>
            </label>
          </div>

          {/* Vendors */}
          {filterOptions.vendors.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-zinc-500 dark:text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Brand
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {filterOptions.vendors.map((vendor) => (
                  <label key={vendor} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentFilters.vendors?.includes(vendor) || false}
                      onChange={(e) => {
                        const vendors = currentFilters.vendors || [];
                        const newVendors = e.target.checked
                          ? [...vendors, vendor]
                          : vendors.filter(v => v !== vendor);
                        updateFilters({ vendors: newVendors });
                      }}
                      className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:focus:ring-white"
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{vendor}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Product Types */}
          {filterOptions.productTypes.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-zinc-500 dark:text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Category
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {filterOptions.productTypes.map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentFilters.productTypes?.includes(type) || false}
                      onChange={(e) => {
                        const productTypes = currentFilters.productTypes || [];
                        const newTypes = e.target.checked
                          ? [...productTypes, type]
                          : productTypes.filter(t => t !== type);
                        updateFilters({ productTypes: newTypes });
                      }}
                      className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:focus:ring-white"
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {filterOptions.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-zinc-500 dark:text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                  />
                </svg>
                Tags
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filterOptions.tags.map((tag) => (
                  <label key={tag} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentFilters.tags?.includes(tag) || false}
                      onChange={(e) => {
                        const tags = currentFilters.tags || [];
                        const newTags = e.target.checked
                          ? [...tags, tag]
                          : tags.filter(t => t !== tag);
                        updateFilters({ tags: newTags });
                      }}
                      className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:focus:ring-white"
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{tag}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
