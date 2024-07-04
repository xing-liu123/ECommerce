import { Router, Request, Response, NextFunction } from "express";
import { verifyToken } from "./user";
import { ProductModel } from "../models/product";

const router = Router();

router.get("/products", verifyToken, async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find({});

    res.json({ products });
  } catch (err) {
    res.status(400).json({ type: err });
  }
});
