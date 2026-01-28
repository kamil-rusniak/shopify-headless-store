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
    <div className="border-b border-zinc-200 pb-6 dark:border-zinc-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Filters</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
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

      {/* Mobile Toggle */}
      <div className="md:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between rounded-lg border border-zinc-300 px-4 py-2 text-left dark:border-zinc-600"
        >
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Filters {hasActiveFilters && `(${productCount})`}
          </span>
          <svg
            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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

      {/* Filter Content */}
      {isExpanded && (
        <div className="space-y-6 mt-4">
          {/* Price Range */}
          <div>
            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">Price Range</h4>
            <div className="flex items-center gap-2">
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
                className="w-24 rounded-lg border border-zinc-300 px-3 py-1 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-white dark:focus:ring-white"
              />
              <span className="text-zinc-500">-</span>
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
                className="w-24 rounded-lg border border-zinc-300 px-3 py-1 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-white dark:focus:ring-white"
              />
            </div>
          </div>

          {/* In Stock */}
          <div>
            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">Availability</h4>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={currentFilters.inStock === true}
                onChange={(e) => {
                  updateFilters({ inStock: e.target.checked ? true : undefined });
                }}
                className="rounded border-zinc-300 text-black focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:focus:ring-white"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">In Stock Only</span>
            </label>
          </div>

          {/* Vendors */}
          {filterOptions.vendors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">Brand</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {filterOptions.vendors.map((vendor) => (
                  <label key={vendor} className="flex items-center gap-2">
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
                      className="rounded border-zinc-300 text-black focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:focus:ring-white"
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
              <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">Category</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {filterOptions.productTypes.map((type) => (
                  <label key={type} className="flex items-center gap-2">
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
                      className="rounded border-zinc-300 text-black focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:focus:ring-white"
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{type}</span>
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
