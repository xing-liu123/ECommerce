import { createContext, useEffect, useState } from "react";

export interface IShopContext {
  addToCart: (itemID: string) => void;
  removeFromCart: (itemID: string) => void;
  updateCartItemCount: (newAmount: number, itemID: string) => void;
  getCartItemCount: (itemID: string) => number;
//   availableMoney: number;
}

const defaultVal: IShopContext = {
  addToCart: () => null,
  removeFromCart: () => null,
  updateCartItemCount: () => null,
  getCartItemCount: () => 0,
//   availableMoney: 0,
};

export const ShopContext = createContext<IShopContext>(defaultVal);

export const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState<{ string: number } | {}>({});
//   const [availableMoney, setAvailableMoney] = useState<number>(0);


  const addToCart = (itemID: string) => {
    if (!cartItems[itemID]) {
      setCartItems((prev) => ({ ...prev, [itemID]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemID]: prev[itemID] + 1 }));
    }
  };

  const removeFromCart = (itemID: string) => {
    if (!cartItems[itemID] || cartItems[itemID] === 0) {
      return;
    } else {
      setCartItems((prev) => ({ ...prev, [itemID]: cartItems[itemID] - 1 }));
    }
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

  const contextValue: IShopContext = {
    addToCart,
    removeFromCart,
    updateCartItemCount,
    getCartItemCount,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
