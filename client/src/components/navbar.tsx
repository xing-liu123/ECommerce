import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { IShopContext, ShopContext } from "../context/shopContext";

export const Navbar = () => {
  const { availableMoney } = useContext<IShopContext>(ShopContext);

  return (
    <div className="navbar">
      <Link to="/" className="navbar-title">
        <h1>My Shop</h1>
      </Link>

      <div className="navbar-links">
        <Link to="/">Shop</Link>
        <Link to="/purchased-items">Purchases</Link>
        <Link to="/checkout">
          <FontAwesomeIcon icon={faShoppingCart} />
        </Link>
        <Link to="/auth">Logout</Link>
        <span>${availableMoney}</span>
      </div>
    </div>
  );
};
