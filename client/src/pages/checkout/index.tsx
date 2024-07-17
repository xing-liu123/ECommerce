import { ShopContext, IShopContext } from "../../context/shopContext";
import { IProduct } from "../../models/interface";
import { useContext, useState } from "react";
import { CartItem } from "./cartItem";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import PayPal from "../../components/PayPal";

export const CheckoutPage = () => {
  const { getCartItemCount, getTotalAmount, checkout, products } =
    useContext<IShopContext>(ShopContext);

  const navigate = useNavigate();
  const [paypalCheckout, setPaypalCheckout] = useState<boolean>(false);

  const totalAmount = getTotalAmount();
  return (
    <div>
      {paypalCheckout ? (
        <PayPal />
      ) : (
        <div>
          {totalAmount > 0 ? (
            <div className="shopping-cart">
              <div className="cart">
                {products.map((product: IProduct) => {
                  console.log(getCartItemCount(product._id));
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
                <button onClick={() => navigate("/")}>
                  {" "}
                  Continue Shopping{" "}
                </button>
                <button onClick={() => setPaypalCheckout(true)}> PayPal</button>
                <button onClick={checkout}> Checkout </button>
              </div>
            </div>
          ) : (
            <h1> Your Shopping Cart is Empty </h1>
          )}
        </div>
      )}
    </div>
  );
};
