'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { SORT_OPTIONS, SortOption } from '@/lib/shopify/sorting';

interface SortSelectProps {
  currentSort?: SortOption;
  productCount: number;
}

export function SortSelect({ currentSort = 'featured', productCount }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (newSort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSort === 'featured') {
      params.delete('sort');
    } else {
      params.set('sort', newSort);
    }
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  const currentSortLabel = SORT_OPTIONS.find(option => option.value === currentSort)?.label || 'Featured';

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-zinc-600 dark:text-zinc-400">
        {productCount} product{productCount !== 1 ? 's' : ''}
      </span>
      
      <div className="relative">
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value as SortOption)}
          className="appearance-none cursor-pointer rounded-lg border border-zinc-300 bg-white px-4 py-2 pr-8 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-white dark:focus:ring-white"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
          <svg
            className="h-4 w-4"
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
        </div>
      </div>
    </div>
  );
}
