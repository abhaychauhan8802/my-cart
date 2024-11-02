import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getAllOrders = async (req, res) => {
  try {
    try {
      const orders = await Order.find({}).populate("products.product").exec();

      if (!orders) {
        return res.status(404).json({ message: "Order list is empty" });
      }

      res.status(200).json(orders);
    } catch (error) {
      console.log("Error in getOrders route", error);
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    console.log("Error in getAllOrders route", error);
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { userId } = req;

    const orders = await Order.find({ user: userId })
      .populate("products.product")
      .exec();

    if (orders.length === 0) {
      return res.status(404).json({ message: "User not have any orders" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.log("Error in getOrders route", error);
    res.status(500).json({ message: error.message });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);

    const products = await Product.find({ _id: { $in: user.cartItems } });

    if (user) {
      if (user.cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      const productsInCart = products.map((product) => {
        const item = user.cartItems.find(
          (cartItem) => cartItem.id === product.id
        );

        return { ...product.toJSON(), quantity: item.quantity };
      });

      const newOrder = new Order({
        user: userId,
        products: productsInCart.map((product) => ({
          product: product._id,
          quantity: product.quantity,
          price: product.price,
          total: product.price * product.quantity,
        })),
        totalAmount: productsInCart.reduce((accumulator, item) => {
          return (accumulator += item.price * item.quantity);
        }, 0),
      });

      await newOrder.save();

      res.status(200).json(newOrder);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("Error in placeUserOrder route", error);
    res.status(500).json({ message: error.message });
  }
};
