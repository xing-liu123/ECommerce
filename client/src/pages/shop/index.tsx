import { Product } from "./product";
import "./styles.css";
import { useContext } from "react";
import { IShopContext, ShopContext } from "../../context/shopContext";
import { Navigate } from "react-router-dom";

export const ShopPage = () => {
  const { isAuthenticated, products } = useContext<IShopContext>(ShopContext);

  if (!isAuthenticated) {
    return <Navigate to="/auth" />
  }

  return (
    <div className="shop">
      <div className="products">
        {products.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};
