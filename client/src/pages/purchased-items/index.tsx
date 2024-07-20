import { useContext } from "react";
import { IShopContext, ShopContext } from "../../context/shopContext";
import "./styles.css";

export const PurchasedItemsPage = () => {
  const { purchasedItems, getCartItemCount, addToCart } =
    useContext<IShopContext>(ShopContext);
  return (
    <div className="purchased-items">
      {purchasedItems.map((item) => {
        const count = getCartItemCount(item._id);
        return (
          <div className="item">
            {" "}
            <h1>{item.productName}</h1>
            <img src={item.imageURL} />
            <p> ${item.price}</p>
            <button onClick={() => addToCart(item._id)}>
              {" "}
              Purchase Again {count > 0 && <p> ({count}) </p>}
            </button>
          </div>
        );
      })}
    </div>
  );
};
