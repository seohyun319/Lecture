import { Product } from "@/types/type";
import axios from "axios";
import { useEffect, useState } from "react";

const Products: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = async () => {
    setLoading(true);
    const response = await axios.get<Product[]>("/api/products");
    setProducts(response.data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>
      {!loading &&
        products.map((product) => <div key={product.id}>{product.name}</div>)}
      {loading && <div>{"loading..."}</div>}
    </div>
  );
};

export default Products;
