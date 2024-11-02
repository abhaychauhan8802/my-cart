import express from "express";
import {
  addToCart,
  getCartItems,
  removeFromCart,
  updateQuantity,
} from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/get-cart-items", verifyToken, getCartItems);
router.post("/add-to-cart", verifyToken, addToCart);
router.post("/remove-from-cart", verifyToken, removeFromCart);
router.post("/update-quantity/:id", verifyToken, updateQuantity);
export default router;
