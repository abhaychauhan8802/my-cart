import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";

// Functions

const updateFeaturedProductCache = async () => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true });

    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log(error.message);
  }
};

// Controllers

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    if (!name || !description || !price || !image || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "my-cart/products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("Error in create product route", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];

      try {
        await cloudinary.uploader.destroy(`my-cart/products/${publicId}`);
      } catch (error) {
        console.log(error.message);
      }
    }

    await Product.findByIdAndDelete(id);

    updateFeaturedProductCache();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in remove product route", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({});

    res.status(200).json(products);
  } catch (error) {
    console.log("Error in get all product route", error);
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");

    featuredProducts = JSON.parse(featuredProducts);

    if (featuredProducts) {
      return res.status(200).json(featuredProducts);
    }

    featuredProducts = await Product.find({ isFeatured: true });

    if (!featuredProducts) {
      return res.status(404).json({ message: "Featured Products not found" });
    }

    await redis.set("featured_products", JSON.stringify(featuredProducts));

    res.status(200).json(featuredProducts);
  } catch (error) {
    console.log("Error in featured products route", error);
    res.status(500).json({ message: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const recommendedProducts = await Product.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);

    res.status(200).json(recommendedProducts);
  } catch (error) {
    console.log("Error in recommended products route", error);
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();

    // Update cache
    updateFeaturedProductCache();

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log("Error in toggle featured products route", error);
    redis.status(500).json({ message: error.message });
  }
};
