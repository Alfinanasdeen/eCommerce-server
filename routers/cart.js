import express from "express";
import Cart from "../models/Cart.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// CREATE
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});


export default router;
