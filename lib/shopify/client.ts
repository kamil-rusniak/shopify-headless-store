import {
  ShopifyProduct,
  ShopifyCollection,
  ShopifyCart,
  ShopifyProductsResponse,
  ShopifyProductResponse,
  ShopifyCollectionsResponse,
  ShopifyCollectionResponse,
  ShopifyCartResponse,
  ShopifyCartCreateResponse,
  ShopifyCartLinesAddResponse,
  ShopifyCartLinesUpdateResponse,
  ShopifyCartLinesRemoveResponse,
} from './types';

import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_COLLECTIONS_QUERY,
  GET_PRODUCTS_BY_COLLECTION_QUERY,
  GET_CART_QUERY,
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  UPDATE_CART_MUTATION,
  REMOVE_FROM_CART_MUTATION,
  SEARCH_PRODUCTS_QUERY,
} from './queries';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2026-01';

const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

interface ShopifyFetchOptions {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
}

async function shopifyFetch<T>({
  query,
  variables,
  cache = 'force-cache',
  tags,
}: ShopifyFetchOptions): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
    cache,
    ...(tags && { next: { tags } }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors) {
    console.error('Shopify GraphQL errors:', json.errors);
    throw new Error(json.errors[0]?.message || 'Unknown Shopify API error');
  }

  return json.data;
}

// Product Functions
export async function getProducts(first: number = 20): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<ShopifyProductsResponse>({
    query: GET_PRODUCTS_QUERY,
    variables: { first },
    tags: ['products'],
  });

  return data.products.edges.map((edge) => edge.node);
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<ShopifyProductResponse>({
    query: GET_PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
    tags: ['products', `product-${handle}`],
  });

  return data.product;
}

// Collection Functions
export async function getCollections(first: number = 20): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<ShopifyCollectionsResponse>({
    query: GET_COLLECTIONS_QUERY,
    variables: { first },
    tags: ['collections'],
  });

  return data.collections.edges.map((edge) => edge.node);
}

export async function getCollectionByHandle(
  handle: string,
  productsFirst: number = 20
): Promise<ShopifyCollection | null> {
  const data = await shopifyFetch<ShopifyCollectionResponse>({
    query: GET_PRODUCTS_BY_COLLECTION_QUERY,
    variables: { handle, first: productsFirst },
    tags: ['collections', `collection-${handle}`],
  });

  return data.collection;
}

// Cart Functions
export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<ShopifyCartResponse>({
    query: GET_CART_QUERY,
    variables: { cartId },
    cache: 'no-store',
  });

  return data.cart;
}

export async function createCart(
  lines?: { merchandiseId: string; quantity: number }[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<ShopifyCartCreateResponse>({
    query: CREATE_CART_MUTATION,
    variables: { lines },
    cache: 'no-store',
  });

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  return data.cartCreate.cart;
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<ShopifyCartLinesAddResponse>({
    query: ADD_TO_CART_MUTATION,
    variables: { cartId, lines },
    cache: 'no-store',
  });

  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }

  return data.cartLinesAdd.cart;
}

export async function updateCart(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<ShopifyCartLinesUpdateResponse>({
    query: UPDATE_CART_MUTATION,
    variables: { cartId, lines },
    cache: 'no-store',
  });

  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors[0].message);
  }

  return data.cartLinesUpdate.cart;
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<ShopifyCartLinesRemoveResponse>({
    query: REMOVE_FROM_CART_MUTATION,
    variables: { cartId, lineIds },
    cache: 'no-store',
  });

  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors[0].message);
  }

  return data.cartLinesRemove.cart;
}

// Utility Functions
export function formatPrice(money: { amount: string; currencyCode: string }): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode,
  }).format(parseFloat(money.amount));
}

// Search Function
export async function searchProducts(query: string, first: number = 20): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{ search: { edges: { node: ShopifyProduct }[] } }>({
    query: SEARCH_PRODUCTS_QUERY,
    variables: { query, first },
    cache: 'no-store',
  });

  return data.search.edges.map((edge) => edge.node);
}
