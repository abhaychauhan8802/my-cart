import express from "express";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";
import {
  getAllOrders,
  getOrders,
  placeOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/get-all-orders", verifyToken, isAdmin, getAllOrders);

router.get("/get-orders", verifyToken, getOrders);
router.post("/place-order", verifyToken, placeOrder);

export default router;
