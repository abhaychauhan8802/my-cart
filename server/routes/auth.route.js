import express from "express";
import {
  login,
  signup,
  logout,
  profile,
  refreshToken,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", verifyToken, profile);
router.post("/refresh-token", refreshToken);

export default router;
