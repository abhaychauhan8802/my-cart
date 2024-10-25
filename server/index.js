import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectToDb } from "./lib/mongodb.js";
import authRoute from "./routes/auth.route.js";
import productRoute from "./routes/product.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  connectToDb();
  console.log(`Server is listen on port ${port}`);
});
