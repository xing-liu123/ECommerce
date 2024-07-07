import { ShopContext, IShopContext } from "../../context/shopContext";
import { IProduct } from "../../models/interface";
import { useContext } from "react";

interface Props {
  product: IProduct;
}

export const Product = (props: Props) => {
  const { _id, productName, description, price, imageURL, stockQuantity } =
    props.product;

  const { addToCart, getCartItemCount } = useContext<IShopContext>(ShopContext);

  const count = getCartItemCount(_id);

  return (
    <div className="product">
      <img src={imageURL} />
      <div className="description">
        <h3>{productName}</h3>
        <p>{description}</p>
        <p>${price}</p>
      </div>

      {stockQuantity > 0 ? (
        <button className="add-to-cart-button" onClick={() => addToCart(_id)}>
          Add To Cart {count > 0 && <p>({count})</p>}
        </button>
      ) : (
        <div className="stock-quantity">
          <h2>OUT OF STOCK</h2>
        </div>
      )}
    </div>
  );
};
