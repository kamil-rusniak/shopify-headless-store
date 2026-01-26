'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';

interface AddToCartButtonProps {
  variantId: string;
  availableForSale: boolean;
  className?: string;
}

export function AddToCartButton({
  variantId,
  availableForSale,
  className = '',
}: AddToCartButtonProps) {
  const { addItem, isUpdating } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!availableForSale || isAdding) return;

    setIsAdding(true);
    try {
      await addItem(variantId);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const isDisabled = !availableForSale || isAdding || isUpdating;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`flex w-full items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500 ${className}`}
    >
      {!availableForSale ? (
        'Sold Out'
      ) : isAdding ? (
        <>
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Adding...
        </>
      ) : (
        'Add to Cart'
      )}
    </button>
  );
}
