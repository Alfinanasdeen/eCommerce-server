import express from "express";
import { createCart } from "../controllers/cartController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Route to create a cart
router.post("/", verifyToken, createCart);

export default router;
