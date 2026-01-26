'use client';

import { ShopifyProductVariant } from '@/lib/shopify';

interface VariantSelectorProps {
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
  variants: ShopifyProductVariant[];
  selectedOptions: Record<string, string>;
  onOptionChange: (name: string, value: string) => void;
}

export function VariantSelector({
  options,
  variants,
  selectedOptions,
  onOptionChange,
}: VariantSelectorProps) {
  const isOptionAvailable = (optionName: string, optionValue: string) => {
    // Check if any variant with this option is available
    return variants.some((variant) => {
      const hasOption = variant.selectedOptions.some(
        (opt) => opt.name === optionName && opt.value === optionValue
      );
      if (!hasOption) return false;

      // Check if this variant matches all other selected options
      const matchesOtherOptions = Object.entries(selectedOptions).every(
        ([name, value]) => {
          if (name === optionName) return true;
          return variant.selectedOptions.some(
            (opt) => opt.name === name && opt.value === value
          );
        }
      );

      return matchesOtherOptions && variant.availableForSale;
    });
  };

  if (options.length === 0 || (options.length === 1 && options[0].values.length === 1)) {
    return null;
  }

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.id}>
          <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {option.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              const isAvailable = isOptionAvailable(option.name, value);

              return (
                <button
                  key={value}
                  onClick={() => onOptionChange(option.name, value)}
                  disabled={!isAvailable}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    isSelected
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                      : isAvailable
                        ? 'border-zinc-300 bg-white text-zinc-900 hover:border-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-500'
                        : 'cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400 line-through dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-600'
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
