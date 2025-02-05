import express from "express";
import {
  createCart,
  addProductToCart,
  removeProductFromCart,
  getCartItemsForAdmin,
} from "../controllers/cartController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Route to create a cart
router.post("/", verifyToken, createCart);

// Route to add a cart
router.post("/cart", verifyToken, addProductToCart);

// Remove product from cart
router.delete("/cart/:id",removeProductFromCart);

// Get all cart items for admin
router.get("/admin/cart", verifyToken, getCartItemsForAdmin);

export default router;
