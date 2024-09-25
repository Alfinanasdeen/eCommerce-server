import express from "express";
import Order from "../models/Order.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// CREATE
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});


export default router;
