import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../../../api/products';
import { normalizeProducts } from '../../../utils/normalize';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    // Query key is static for local data; cache policy is set at QueryClient level.
    queryFn: fetchProducts,
    // Normalize once at query boundary so UI hooks can consume predictable structure.
    select: normalizeProducts,
  });
}
