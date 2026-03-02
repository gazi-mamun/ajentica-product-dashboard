import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../../../api/products';
import { normalizeProducts } from '../../../utils/normalize';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    select: normalizeProducts,
  });
}
