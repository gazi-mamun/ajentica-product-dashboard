import type { Product } from '../features/products/types';

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/products.json');

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  return response.json() as Promise<Product[]>;
}
