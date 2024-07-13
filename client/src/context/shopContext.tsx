import { createContext, useEffect, useState } from "react";
import { IProduct } from "../models/interface";
import { useGetProducts } from "../hooks/useGetProducts";
import axios from "axios";
import { useGetToken } from "../hooks/useGetToken";
import { ProductErrors } from "../errors";
import { useNavigate } from "react-router-dom";

export interface IShopContext {
  addToCart: (itemID: string) => void;
  removeFromCart: (itemID: string) => void;
  updateCartItemCount: (newAmount: number, itemID: string) => void;
  deleteCartItem: (itemID: string) => void;
  getCartItemCount: (itemID: string) => number;
  availableMoney: number;
  getTotalAmount: () => number;
  checkout: () => void;
}

const defaultVal: IShopContext = {
  addToCart: () => null,
  removeFromCart: () => null,
  updateCartItemCount: () => null,
  deleteCartItem: () => null,
  getCartItemCount: () => 0,
  availableMoney: 0,
  getTotalAmount: () => null,
  checkout: () => null,
};

export const ShopContext = createContext<IShopContext>(defaultVal);

export const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    if (savedCartItems) {
      console.log("Loading cart items from localStorage:", savedCartItems);
      return JSON.parse(savedCartItems);
    }
    return {};
  });

  const { products } = useGetProducts();
  const { headers } = useGetToken();
  const [availableMoney, setAvailableMoney] = useState<number>(0);
  const navigate = useNavigate();

  const fetchAvailableMoney = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/user/available-money/${localStorage.getItem(
          "userID"
        )}`,
        { headers }
      );

      setAvailableMoney(res.data.availableMoney);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAvailableMoney();
  }, []);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    console.log("Saving cart items to localStorage:", cartItems);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (itemID: string) => {
    if (!cartItems[itemID]) {
      setCartItems((prev) => ({ ...prev, [itemID]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemID]: prev[itemID] + 1 }));
    }
  };

  const removeFromCart = (itemID: string) => {
    setCartItems((prev) => {
      const newCartItems = { ...prev };
      if (newCartItems[itemID] > 0) {
        newCartItems[itemID] -= 1;
        if (newCartItems[itemID] === 0) {
          delete newCartItems[itemID];
        }
      }
      return newCartItems;
    });
  };

  const deleteCartItem = (itemID: string) => {
    setCartItems((prev) => {
      const newCartItems = { ...prev };
      delete newCartItems[itemID];
      return newCartItems;
    });
  };

  const updateCartItemCount = (newAmount: number, itemID: string) => {
    if (newAmount < 0) {
      return;
    }
    setCartItems((prev) => ({ ...prev, [itemID]: newAmount }));
  };

  const getCartItemCount = (itemID: string) => {
    if (itemID in cartItems) {
      return cartItems[itemID];
    } else {
      return 0;
    }
  };

  const getTotalAmount = () => {
    let amount = 0;
    try {
      for (const item in cartItems) {
        let itemInfo: IProduct = products.find(
          (product) => product._id === item
        );

        amount += itemInfo.price * cartItems[item];
      }
    } catch (err) {
      console.log(err);
    }

    return amount;
  };

  const checkout = async () => {
    const body = { customerID: localStorage.getItem("userID"), cartItems };

    try {
      await axios.post("http://localhost:3001/products/checkout", body, {
        headers,
      });

      setCartItems({});

      await fetchAvailableMoney();

      navigate("/");
    } catch (err) {
      let errorMessage: string = "";
      switch (err.response.data.type) {
        case ProductErrors.NO_PRODUCT_FOUND:
          errorMessage = "Product doesn't exist.";
          break;
        case ProductErrors.NOT_ENOUGH_STOCK:
          errorMessage = "Product stock is not enough.";
          break;
        case ProductErrors.NO_AVAILABLE_MONEY:
          errorMessage = "You don't have enough money.";
          break;
        default:
          errorMessage = "Something went wrong.";
      }

      alert(`ERROR: ${errorMessage}`);
    }
  };

  const contextValue: IShopContext = {
    addToCart,
    removeFromCart,
    updateCartItemCount,
    deleteCartItem,
    getCartItemCount,
    availableMoney,
    getTotalAmount,
    checkout,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
