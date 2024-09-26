import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  const qSearch = req.query.search; // Handle search query

  try {
    let products;

    // Handle search query
    if (qSearch) {
      products = await Product.find({
        $or: [
          { name: { $regex: qSearch, $options: "i" } }, // Search by name
          { description: { $regex: qSearch, $options: "i" } }, // Optionally search by description
        ],
      });
    } else if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: { $in: [qCategory] },
      });
    } else {
      products = await Product.find(); // Get all products if no filters are applied
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ADD PRODUCT
router.post("/", async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
