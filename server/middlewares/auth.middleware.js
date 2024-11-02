import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log("Error in verifyToken", error.message);
    res.status(401).json({ message: error.message });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not round" });
    }

    if (user.isAdmin) {
      next();
    } else {
      return res
        .status(400)
        .json({ message: "Only admin can access this route" });
    }
  } catch (error) {
    console.log("Error in isAdmin function", error.message);
    res.status(401).json({ message: error.message });
  }
};
