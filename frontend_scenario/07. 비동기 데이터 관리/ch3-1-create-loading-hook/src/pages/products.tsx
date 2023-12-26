import { Product } from "@/types/type";
import axios from "axios";
import { useEffect, useState } from "react";

const useLoading = (url: string) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const loadData = async () => {
    setLoading(true);
    const response = await axios.get<Product[]>(url);
    setProducts(response.data);
    setLoading(false);
  };
  useEffect(() => {
    void loadData();
  }, []);

  return [loading, products];
};

const Products: React.FC = () => {
  const [loading, products] = useLoading("/api/products");

  return (
    <div>
      {!loading &&
        products.map((product) => <div key={product.id}>{product.name}</div>)}
      {loading && <div>{"loading..."}</div>}
    </div>
  );
};

export default Products;
