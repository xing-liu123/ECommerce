import { createContext, useEffect, useState } from "react";
import { IProduct } from "../models/interface";
import axios from "axios";
import { useGetToken } from "../hooks/useGetToken";
import { ProductErrors } from "../errors";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export interface IShopContext {
  addToCart: (itemID: string) => void;
  removeFromCart: (itemID: string) => void;
  updateCartItemCount: (newAmount: number, itemID: string) => void;
  deleteCartItem: (itemID: string) => void;
  getCartItemCount: (itemID: string) => number;
  products: IProduct[];
  availableMoney: number;
  purchasedItems: IProduct[];
  getTotalAmount: () => number;
  checkout: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const defaultVal: IShopContext = {
  addToCart: () => null,
  removeFromCart: () => null,
  updateCartItemCount: () => null,
  deleteCartItem: () => null,
  getCartItemCount: () => 0,
  products: [],
  availableMoney: 0,
  purchasedItems: [],
  getTotalAmount: () => null,
  checkout: () => null,
  isAuthenticated: false,
  setIsAuthenticated: () => null,
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

  const [cookies, setCookies] = useCookies(["access_token"]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const { headers } = useGetToken();
  const [availableMoney, setAvailableMoney] = useState<number>(0);
  const [purchasedItems, setPurchasedItems] = useState<IProduct[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    cookies.access_token !== null
  );
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

  const fetchProducts = async () => {
    try {
      const fetchProducts = await axios.get("http://localhost:3001/products", {
        headers,
      });
      setProducts(fetchProducts.data.products);
    } catch (err) {
      alert("Error: Something went wrong.");
    }
  };


  const fetchPurchasedItems = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/products/purchased-items/${localStorage.getItem(
          "userID"
        )}`,
        { headers }
      );

      setPurchasedItems(res.data.purchasedItems);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchAvailableMoney();
      fetchPurchasedItems();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem('cartItems');
      localStorage.clear();
      setCookies("access_token", null);
    }
  }, [isAuthenticated]);

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
    products,
    availableMoney,
    purchasedItems,
    getTotalAmount,
    checkout,
    isAuthenticated,
    setIsAuthenticated,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
