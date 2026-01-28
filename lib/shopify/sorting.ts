import { ShopifyProduct } from './types';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc' | 'created-desc' | 'created-asc';

export interface SortConfig {
  value: SortOption;
  label: string;
}

export const SORT_OPTIONS: SortConfig[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'title-asc', label: 'Name: A to Z' },
  { value: 'title-desc', label: 'Name: Z to A' },
  { value: 'created-desc', label: 'Newest' },
  { value: 'created-asc', label: 'Oldest' },
];

export function sortProducts(products: ShopifyProduct[], sortOption: SortOption): ShopifyProduct[] {
  const sortedProducts = [...products];

  switch (sortOption) {
    case 'price-asc':
      return sortedProducts.sort((a, b) => 
        parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount)
      );
    
    case 'price-desc':
      return sortedProducts.sort((a, b) => 
        parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount)
      );
    
    case 'title-asc':
      return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
    
    case 'title-desc':
      return sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
    
    case 'created-desc':
      return sortedProducts.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    
    case 'created-asc':
      return sortedProducts.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    
    case 'featured':
    default:
      // Keep original order (featured)
      return sortedProducts;
  }
}
