// Shopify Storefront API Types

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  image?: ShopifyImage;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  images: {
    edges: {
      node: ShopifyImage;
    }[];
  };
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  variants: {
    edges: {
      node: ShopifyProductVariant;
    }[];
  };
  seo: {
    title: string | null;
    description: string | null;
  };
  tags: string[];
  vendor: string;
  productType: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: {
    edges: {
      node: ShopifyProduct;
    }[];
  };
}

export interface ShopifyCartItem {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: ShopifyImage | null;
    };
    price: ShopifyMoney;
  };
  cost: {
    totalAmount: ShopifyMoney;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
    totalTaxAmount: ShopifyMoney | null;
  };
  lines: {
    edges: {
      node: ShopifyCartItem;
    }[];
  };
}

export interface ShopifyPage {
  id: string;
  handle: string;
  title: string;
  body: string;
  bodySummary: string;
  seo: {
    title: string | null;
    description: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyMenu {
  id: string;
  handle: string;
  items: {
    id: string;
    title: string;
    url: string;
    items: {
      id: string;
      title: string;
      url: string;
    }[];
  }[];
}

// API Response types
export interface ShopifyProductsResponse {
  products: {
    edges: {
      node: ShopifyProduct;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

export interface ShopifyProductResponse {
  product: ShopifyProduct | null;
}

export interface ShopifyCollectionsResponse {
  collections: {
    edges: {
      node: ShopifyCollection;
    }[];
  };
}

export interface ShopifyCollectionResponse {
  collection: ShopifyCollection | null;
}

export interface ShopifyCartResponse {
  cart: ShopifyCart | null;
}

export interface ShopifyCartCreateResponse {
  cartCreate: {
    cart: ShopifyCart;
    userErrors: {
      field: string[];
      message: string;
    }[];
  };
}

export interface ShopifyCartLinesAddResponse {
  cartLinesAdd: {
    cart: ShopifyCart;
    userErrors: {
      field: string[];
      message: string;
    }[];
  };
}

export interface ShopifyCartLinesUpdateResponse {
  cartLinesUpdate: {
    cart: ShopifyCart;
    userErrors: {
      field: string[];
      message: string;
    }[];
  };
}

export interface ShopifyCartLinesRemoveResponse {
  cartLinesRemove: {
    cart: ShopifyCart;
    userErrors: {
      field: string[];
      message: string;
    }[];
  };
}
