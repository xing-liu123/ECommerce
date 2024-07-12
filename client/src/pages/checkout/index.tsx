import { ShopContext, IShopContext } from "../../context/shopContext";
import { useGetProducts } from "../../hooks/useGetProducts";
import { IProduct } from "../../models/interface";
import { useContext } from "react";
import { CartItem } from "./cartItem";
import "./styles.css";
import { useNavigate } from "react-router-dom";

export const CheckoutPage = () => {
  const { getCartItemCount, getTotalAmount, checkout } =
    useContext<IShopContext>(ShopContext);
  const { products } = useGetProducts();
  const navigate = useNavigate();

  const totalAmount = getTotalAmount();
  return (
    <div>
      {totalAmount > 0 ? (
        <div className="shopping-cart">
          <div className="cart">
            {products.map((product: IProduct) => {
              if (getCartItemCount(product._id) !== 0) {
                return <CartItem key={product._id} product={product} />;
              }
            })}
          </div>

          <div className="checkout">
            <p>
              {" "}
              <span>Estimated Total</span>
              <span>USD ${totalAmount.toFixed(2)}</span>
            </p>
            <button onClick={() => navigate("/")}> Continue Shopping </button>
            <button onClick={checkout}> Checkout </button>
          </div>
        </div>
      ) : (
        <h1> Your Shopping Cart is Empty </h1>
      )}
    </div>
  );
};
