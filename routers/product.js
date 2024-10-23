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
  const qSearch = req.query.search;

  try {
    let products;

    if (qSearch) {
      products = await Product.find({
        $or: [
          { name: { $regex: qSearch, $options: "i" } },
          { description: { $regex: qSearch, $options: "i" } },
        ],
      });
    } else if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: { $in: [qCategory] },
      });
    } else {
      products = await Product.find();
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

// Endpoint to get products by title
router.get("/api/products", async (req, res) => {
  const { title } = req.query; // Get title from query parameters
  try {
    // Find products where title matches
    const products = await Product.find({
      title: { $regex: title, $options: "i" }, // Case-insensitive search
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Get products added by the admin
router.post("/admin/products", async (req, res) => {
  const newProduct = new Product({
    title: req.body.title,
    desc: req.body.desc,
    img: req.body.img,
    price: req.body.price,
    categories: req.body.categories,
    filters: req.body.filters,
    addedBy: req.user._id,
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/admin/products/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    console.log(`Deleting product with id: ${_id}`); // Log to confirm ID

    const deletedProduct = await Product.findByIdAndDelete(_id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error); // Log the error
    res.status(500).json({ message: "Error deleting product", error });
  }
});

export default router;
