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

// POST: Add a new product
router.post("/", async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// In your product routes file
router.get("/:id", async (req, res) => {
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

// Create Product
router.post("/addProduct", async (req, res) => {
  try {
    const { title, desc, img, categories, filter, price, inStock } = req.body;

    // Check for required fields
    if (!title || !desc || !img || !price) {
      return res
        .status(400)
        .json({
          message: "Title, Description, Image, and Price are required!",
        });
    }

    // Create new product
    const newProduct = new Product({
      title,
      desc,
      img,
      categories: categories ? categories.split(",") : [], // Handling comma-separated string
      filter: filter ? filter.split(",") : [],
      price,
      inStock: inStock !== undefined ? inStock : true,
    });

    // Save product to database
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
