'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ShopifyProduct, formatPrice } from '@/lib/shopify';
import { ProductGallery, VariantSelector, AddToCartButton } from '@/components';

interface ProductDetailsProps {
  product: ShopifyProduct;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const variants = product.variants.edges.map((edge) => edge.node);
  const images = product.images.edges.map((edge) => edge.node);

  // Initialize with first available variant's options
  const initialOptions = useMemo(() => {
    const firstAvailableVariant =
      variants.find((v) => v.availableForSale) || variants[0];
    return firstAvailableVariant.selectedOptions.reduce(
      (acc, option) => ({
        ...acc,
        [option.name]: option.value,
      }),
      {} as Record<string, string>
    );
  }, [variants]);

  const [selectedOptions, setSelectedOptions] =
    useState<Record<string, string>>(initialOptions);

  // Find the variant that matches selected options
  const selectedVariant = useMemo(() => {
    return variants.find((variant) =>
      variant.selectedOptions.every(
        (option) => selectedOptions[option.name] === option.value
      )
    );
  }, [variants, selectedOptions]);

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const price = selectedVariant?.price || product.priceRange.minVariantPrice;
  const compareAtPrice = selectedVariant?.compareAtPrice;
  const hasDiscount =
    compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
        {/* Product Gallery */}
        <ProductGallery images={images} title={product.title} />

        {/* Product Info */}
        <div className="mt-8 lg:mt-0">
          {/* Vendor */}
          {product.vendor && (
            <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
              {product.vendor}
            </p>
          )}

          {/* Title */}
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {product.title}
          </h1>

          {/* Price */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              {formatPrice(price)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-zinc-500 line-through">
                {formatPrice(compareAtPrice)}
              </span>
            )}
            {hasDiscount && (
              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-300">
                Sale
              </span>
            )}
          </div>

          {/* Variant Selector */}
          <div className="mt-8">
            <VariantSelector
              options={product.options}
              variants={variants}
              selectedOptions={selectedOptions}
              onOptionChange={handleOptionChange}
            />
          </div>

          {/* Add to Cart */}
          <div className="mt-8">
            <AddToCartButton
              variantId={selectedVariant?.id || variants[0].id}
              availableForSale={selectedVariant?.availableForSale ?? false}
            />
          </div>

          {/* Description */}
          {product.descriptionHtml && (
            <div className="mt-8 border-t border-zinc-200 pt-8 dark:border-zinc-800">
              <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Description
              </h2>
              <div
                className="prose prose-sm prose-zinc mt-4 dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </div>
          )}

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="mt-8 border-t border-zinc-200 pt-8 dark:border-zinc-800">
              <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Tags
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/collections/all?tags=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
