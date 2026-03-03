import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProductDashboard } from "./features/products/components/Productdashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min
      retry: 2,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductDashboard />
    </QueryClientProvider>
  );
}
