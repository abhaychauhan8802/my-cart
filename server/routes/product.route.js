import express from "express";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getFeaturedProducts,
  getRecommendedProducts,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

// Admin routes
router.post("/create", verifyToken, isAdmin, createProduct);
router.delete("/delete/:id", verifyToken, isAdmin, deleteProduct);
router.get("/", verifyToken, isAdmin, getAllProduct);
router.put(
  "/toggle-featured-product/:id",
  verifyToken,
  isAdmin,
  toggleFeaturedProduct
);

// Public routes
router.get("/featured-products", getFeaturedProducts);
router.get("/recommended-products", getRecommendedProducts);

export default router;
