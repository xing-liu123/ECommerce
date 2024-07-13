import { useContext } from "react";
import { IShopContext, ShopContext } from "../../context/shopContext";

export const PurchasedItemsPage = () => {
  const { purchasedItems, getCartItemCount, addToCart } =
    useContext<IShopContext>(ShopContext);
  return (
    <div className="purchased-items-page">
      <h1>Previously Purchased Items</h1>
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
                Purchased Again {count > 0 && <p> ({count}) </p>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
