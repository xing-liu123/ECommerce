import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/user";
import { productRouter } from "./routes/product";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/products", productRouter);

mongoose.connect(
  "mongodb+srv://lx530189283:SSBlThpkdZ58XgQJ@ecommerce.vudzw2i.mongodb.net/ecommerce"
);

app.listen(3001, () => console.log("Server started."));
