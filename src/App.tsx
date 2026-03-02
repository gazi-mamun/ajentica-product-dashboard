import { useEffect } from "react";
import { useProducts } from "./features/products/hooks/useProducts";

function App() {
  const { data, isLoading, error } = useProducts();

  useEffect(() => {
    if (data) {
      console.log("normalized products:", data); // { byId, allIds }
      console.log("first product:", data.byId[data.allIds[0]]);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load products</div>;

  return <div>Products loaded</div>;
}

export default App;
