import useLoading from "@/hooks/useLoading";
import { Product } from "@/types/type";

const Products: React.FC = () => {
  const [loading, products] = useLoading<Product[]>("/api/products");

  return (
    <div>
      {!loading &&
        products?.map((product) => <div key={product.id}>{product.name}</div>)}
      {loading && <div>{"loading..."}</div>}
    </div>
  );
};

export default Products;
