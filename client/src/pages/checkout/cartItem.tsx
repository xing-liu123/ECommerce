import { ShopContext, IShopContext } from "../../context/shopContext";
import { IProduct } from "../../models/interface";
import { useContext } from "react";

interface Props {
  product: IProduct;
}

export const CartItem = (prop: Props) => {
  const { _id, imageURL, price, productName } = prop.product;
  const { getCartItemCount, addToCart, removeFromCart, updateCartItemCount } =
    useContext<IShopContext>(ShopContext);

  const cartItemCount: number = getCartItemCount(_id);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value);
    updateCartItemCount(value, _id);
  };

  return (
    <div className="cart-item">
      <img src={imageURL} />{" "}
      <div className="description">
        <h3>{productName}</h3>
        <p>${price}</p>
      </div>
      <div className="count">
        <div className="count-handler">
          <button onClick={() => removeFromCart(_id)}> - </button>
          <select value={cartItemCount} onChange={handleSelectChange}>
            {Array.from({ length: 20 }, (_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
          <button onClick={() => addToCart(_id)}> + </button>
        </div>
        <button className="remove-button" onClick={() => updateCartItemCount(0, _id)}> Remove </button>
      </div>
    </div>
  );
};
