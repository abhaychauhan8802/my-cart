import { generateTokens } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import { redis } from "../lib/redis.js";
import jwt from "jsonwebtoken";

// Function

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// Controllers

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be 6 character long" });
    }

    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(409).json({ message: "User already exist" });
    }

    const user = await User.create({ username, email, password });

    const { accessToken, refreshToken } = generateTokens(user._id);

    await redis.set(
      `refresh_token:${user._id}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60 * 1000
    );

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.log("Error in signup route", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existUser = await User.findOne({ email });

    if (!existUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const correctPassword = await existUser.comparePassword(password);

    if (!correctPassword) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(existUser._id);

    await redis.set(
      `refresh_token:${existUser._id}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60 * 1000
    );

    setCookies(res, accessToken, refreshToken);

    res.status(200).json({
      id: existUser._id,
      username: existUser.username,
      email: existUser.email,
      isAdmin: existUser.isAdmin,
    });
  } catch (error) {
    console.log("Error in login route", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      await redis.del(`refresh_token:${decoded.id}`);
    }

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.log("Error in logout route", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const profile = async (req, res) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in profile route", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refresh_token;

    if (!oldRefreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(
      oldRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const storedToken = await redis.get(`refresh_token:${decoded.id}`);

    if (storedToken !== oldRefreshToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { accessToken, refreshToken } = generateTokens(decoded.id);

    await redis.set(
      `refresh_token:${decoded.id}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60 * 1000
    );

    setCookies(res, accessToken, refreshToken);

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken route", error.message);
    res.status(500).json({ message: error.message });
  }
};
