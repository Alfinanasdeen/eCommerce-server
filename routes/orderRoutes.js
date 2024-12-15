// routes/orderRoutes.js
import express from "express";
import { createOrder } from "../controllers/orderController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Route to create an order
router.post("/", verifyToken, createOrder);

export default router;
