// Domain models for products — the shape of DummyJSON responses.
// Every other file imports these types from here; `interface Product` is written only once.

export interface Review {
  rating: number;
  comment: string;
  date: string; // ISO string
  reviewerName: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string; // category slug, e.g. "smartphones"
  brand?: string; // some products (groceries) have no brand
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
  reviews: Review[];
}

// GET /products, /products/search, /products/category/{slug}
export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// GET /products/categories
export interface Category {
  slug: string;
  name: string;
  url: string;
}

// Local reviews stored in localStorage: productId -> Review[]
export type ReviewsByProduct = Record<string, Review[]>;
