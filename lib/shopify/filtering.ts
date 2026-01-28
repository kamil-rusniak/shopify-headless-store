import { ShopifyProduct } from './types';

export interface FilterOptions {
  priceRange?: {
    min?: number;
    max?: number;
  };
  vendors?: string[];
  productTypes?: string[];
  tags?: string[];
  inStock?: boolean;
}

export interface FilterConfig {
  value: keyof FilterOptions;
  label: string;
  type: 'range' | 'checkbox' | 'multiselect';
}

export function extractFilterOptions(products: ShopifyProduct[]): {
  vendors: string[];
  productTypes: string[];
  tags: string[];
  priceRange: { min: number; max: number };
} {
  const vendors = new Set<string>();
  const productTypes = new Set<string>();
  const tags = new Set<string>();
  let minPrice = Infinity;
  let maxPrice = 0;

  products.forEach((product) => {
    // Extract vendors
    if (product.vendor) {
      vendors.add(product.vendor);
    }

    // Extract product types
    if (product.productType) {
      productTypes.add(product.productType);
    }

    // Extract tags
    if (product.tags) {
      product.tags.forEach((tag) => tags.add(tag));
    }

    // Calculate price range
    const price = parseFloat(product.priceRange.minVariantPrice.amount);
    minPrice = Math.min(minPrice, price);
    maxPrice = Math.max(maxPrice, price);
  });

  return {
    vendors: Array.from(vendors).sort(),
    productTypes: Array.from(productTypes).sort(),
    tags: Array.from(tags).sort(),
    priceRange: {
      min: minPrice === Infinity ? 0 : minPrice,
      max: maxPrice,
    },
  };
}

export function filterProducts(products: ShopifyProduct[], filters: FilterOptions): ShopifyProduct[] {
  return products.filter((product) => {
    // Price range filter
    if (filters.priceRange) {
      const price = parseFloat(product.priceRange.minVariantPrice.amount);
      if (filters.priceRange.min && price < filters.priceRange.min) return false;
      if (filters.priceRange.max && price > filters.priceRange.max) return false;
    }

    // Vendor filter
    if (filters.vendors && filters.vendors.length > 0) {
      if (!product.vendor || !filters.vendors.includes(product.vendor)) return false;
    }

    // Product type filter
    if (filters.productTypes && filters.productTypes.length > 0) {
      if (!product.productType || !filters.productTypes.includes(product.productType)) return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      if (!product.tags || !filters.tags.some(tag => product.tags.includes(tag))) return false;
    }

    // In stock filter
    if (filters.inStock !== undefined) {
      if (filters.inStock && !product.availableForSale) return false;
      if (!filters.inStock && product.availableForSale) return false;
    }

    return true;
  });
}
