import { ShopContext, IShopContext } from "../../context/shopContext";
import { useGetProducts } from "../../hooks/useGetProducts";
import { IProduct } from "../../models/interface";
import { useContext } from "react";
import { CartItem } from "./cartItem";
import "./styles.css";

export const CheckoutPage = () => {
  const { getCartItemCount } = useContext<IShopContext>(ShopContext);
  const { products } = useGetProducts();

  return (
    <div className="cart">
      <div>
        <h1>Your Cart Items</h1>
      </div>
      <div className="cart">
        {products.map((product: IProduct) => {
          if (getCartItemCount(product._id) !== 0) {
            return <CartItem key={product._id} product={product} />;
          }
        })}
      </div>
    </div>
  );
};
