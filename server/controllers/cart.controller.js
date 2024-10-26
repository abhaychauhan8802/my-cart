import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getCartItems = async (req, res) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);

    const products = await Product.find({ _id: { $in: user.cartItems } });

    const productsInCart = products.map((product) => {
      const item = user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );

      return { ...product.toJSON(), quantity: item.quantity };
    });

    res.status(200).json(productsInCart);
  } catch (error) {
    console.log("Error in getCartItem route", error);
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const { userId } = req;

    const user = await User.findById(userId);

    if (!productId) {
      return res.status(400).json({ message: "ProductId is required" });
    }

    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      return res.status(400).json({ message: "Product already in cart" });
    }

    user.cartItems.push(productId);

    await user.save();
    res.status(200).json(user.cartItems);
  } catch (error) {
    console.log("Error in addToCart controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const { userId } = req;

    const user = await User.findById(userId);

    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }

    await user.save();

    res.status(200).json(user.cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const { userId } = req;

    const user = await User.findById(userId);

    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.status(200).json(user.cartItems);
      }

      existingItem.quantity = quantity;
      await user.save();
      res.status(200).json(user.cartItems);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in updateQuantity route", error);
    res.status(500).json({ message: error.message });
  }
};
