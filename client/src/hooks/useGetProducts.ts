import { IProduct } from "../models/interface";
import { useEffect, useState } from "react";
import { useGetToken } from "./useGetToken";
import axios from "axios";

export const useGetProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const { headers } = useGetToken();

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

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products };
};
