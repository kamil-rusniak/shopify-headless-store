import Image from 'next/image';
import Link from 'next/link';
import { ShopifyProduct, formatPrice } from '@/lib/shopify';

interface ProductCardProps {
  product: ShopifyProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { handle, title, featuredImage, priceRange, availableForSale } = product;
  const price = priceRange.minVariantPrice;
  const compareAtPrice = priceRange.maxVariantPrice;
  const hasDiscount =
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  return (
    <Link
      href={`/products/${handle}`}
      className="group block overflow-hidden rounded-lg border border-zinc-200 bg-white transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {featuredImage ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.altText || title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-400">
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {!availableForSale && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">
              Sold Out
            </span>
          </div>
        )}
        {hasDiscount && availableForSale && (
          <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
            Sale
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {formatPrice(price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-zinc-500 line-through">
              {formatPrice(compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
