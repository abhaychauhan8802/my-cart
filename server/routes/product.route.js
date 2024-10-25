import express from "express";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  removeProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

// Admin routes
router.post("/create-product", verifyToken, isAdmin, createProduct);
router.delete("/remove-product/:id", verifyToken, isAdmin, removeProduct);

export default router;
