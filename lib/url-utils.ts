import { SortOption, FilterOptions } from '@/lib/shopify';

export function parseSearchParams(searchParams: URLSearchParams): {
  sort: SortOption;
  filters: FilterOptions;
} {
  const sort = (searchParams.get('sort') as SortOption) || 'featured';
  
  const filters: FilterOptions = {};

  // Parse price range
  const minPrice = searchParams.get('min_price');
  const maxPrice = searchParams.get('max_price');
  if (minPrice || maxPrice) {
    filters.priceRange = {
      min: minPrice ? parseFloat(minPrice) : undefined,
      max: maxPrice ? parseFloat(maxPrice) : undefined,
    };
  }

  // Parse vendors
  const vendors = searchParams.get('vendors');
  if (vendors) {
    filters.vendors = vendors.split(',').filter(Boolean);
  }

  // Parse product types
  const types = searchParams.get('types');
  if (types) {
    filters.productTypes = types.split(',').filter(Boolean);
  }

  // Parse tags
  const tags = searchParams.get('tags');
  if (tags) {
    filters.tags = tags.split(',').filter(Boolean);
  }

  // Parse stock status
  const inStock = searchParams.get('in_stock');
  if (inStock) {
    filters.inStock = inStock === 'true';
  }

  return { sort, filters };
}
