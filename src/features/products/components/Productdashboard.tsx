import { useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../types";
import { ProductDashboardView } from "./ProductDashboardView";

export function ProductDashboard() {
  const { data, isLoading, isError, refetch } = useProducts();

  const products = useMemo<Product[]>(() => {
    if (!data) return [];
    return data.allIds
      .map((id) => data.byId[id])
      .filter((item): item is Product => Boolean(item));
  }, [data]);

  return (
    <ProductDashboardView
      products={products}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
    />
  );
}
