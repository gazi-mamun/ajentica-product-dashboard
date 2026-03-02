import type { Product } from '../features/products/types';

export type NormalizedProducts = {
  byId: Record<string, Product>;
  allIds: string[];
};

export function normalizeProducts(products: Product[]): NormalizedProducts {
  const byId: Record<string, Product> = {};
  const allIds: string[] = [];

  for (const product of products) {
    byId[product.id] = product;
    allIds.push(product.id);
  }

  return { byId, allIds };
}
