import Cart from "../models/Cart.js";
import mongoose from "mongoose";
import Product from "../models/Product.js";

export const createCart = async (req, res) => {
  const { userId, products } = req.body;

  try {
    if (
      !userId ||
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Invalid data: userId and products are required" });
    }

    const invalidProduct = products.find(
      (p) => !p.productId || !mongoose.Types.ObjectId.isValid(p.productId)
    );
    if (invalidProduct) {
      return res
        .status(400)
        .json({ message: `Invalid productId: ${invalidProduct.productId}` });
    }

    const newCartItem = new Cart({
      userId: mongoose.Types.ObjectId(userId),
      products: products.map((product) => ({
        productId: mongoose.Types.ObjectId(product.productId),
        quantity: product.quantity || 1,
      })),
    });

    const savedCartItem = await newCartItem.save();
    console.log("Saved Cart Item:", savedCartItem);
    res.status(201).json(savedCartItem);
  } catch (err) {
    console.error("Error creating cart item:", err);
    res.status(500).json({ message: "Failed to create cart item", error: err });
  }
};

// Add product to cart
export const addProductToCart = async (req, res) => {
  const { userId, products } = req.body;

  // Validate inputs
  if (!userId || !Array.isArray(products) || products.length === 0) {
    return res
      .status(400)
      .json({ message: "Invalid data: userId and products are required" });
  }

  try {
    // Check if products have valid productId and quantity
    const invalidProduct = products.find(
      (p) => !p.productId || !mongoose.Types.ObjectId.isValid(p.productId)
    );
    if (invalidProduct) {
      return res
        .status(400)
        .json({ message: `Invalid productId: ${invalidProduct.productId}` });
    }

    const newCart = new Cart({
      userId: new mongoose.Types.ObjectId(userId), // Fixed here
      products: products.map((product) => ({
        productId: new mongoose.Types.ObjectId(product.productId), // Fixed here
        quantity: product.quantity || 1,
      })),
      // You can calculate or pass the total price from the frontend
    });

    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ message: "Error adding product to cart", error });
  }
};

// Remove product from cart
export const removeProductFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ "products.productId": req.params.id });
    if (!cart) {
      console.log("Cart not found for product ID:", req.params.id);
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (product) => product.productId.toString() !== req.params.id
    );
    await cart.save();
    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: "Error removing product from cart" });
  }
};

export const getCartItemsForAdmin = async (req, res) => {
  try {
    const rawCartItems = await Cart.find();
    console.log("Raw Cart Items:", rawCartItems);

    const cartItems = await Cart.find()
      .populate("userId", "username email")
      .populate("products.productId", "title price desc");

    console.log("Populated Cart Items:", cartItems);

    if (!cartItems.length) {
      return res.status(404).json({ message: "No cart items found" });
    }

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items for admin:", error);
    res.status(500).json({ message: "Failed to fetch cart items", error });
  }
};
