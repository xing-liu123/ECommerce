import { useGetProducts } from "../../hooks/useGetProducts";
import { Product } from "./product";

export const ShopPage = () => {
  const { products } = useGetProducts();

  return (
    <div className="shop">
      <div className="product">
        {products.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};
