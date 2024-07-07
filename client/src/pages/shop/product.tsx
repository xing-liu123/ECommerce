import { IProduct } from "../../models/interface";

interface Props {
  product: IProduct;
}

export const Product = (props: Props) => {
  const { _id, productName, description, price, imageURL, stockQuantity } =
    props.product;

  return (
    <div className="product">
      <img src={imageURL} />
      <div className="description">
        <h3>{productName}</h3>
        <p>{description}</p>
        <p>${price}</p>
      </div>

      {stockQuantity > 0 ? (
        <button className="add-to-cart-button">Add To Cart</button>
      ) : (
        <div className="stock-quantity">
          <h2>OUT OF STOCK</h2>
        </div>
      )}
    </div>
  );
};
