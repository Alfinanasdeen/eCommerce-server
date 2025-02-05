import express from "express";
import {
  getProductById,
  getAllProducts,
  addProduct,
  editProduct,
  getProductsByTitle,
  addProductByAdmin,
  deleteProductByAdmin,
} from "../controllers/productController.js";

const router = express.Router();

// Routes
router.get("/find/:id", getProductById);
router.get("/", getAllProducts);
router.post("/", addProduct);
router.put("/admin/editProducts/:id", editProduct);
router.get("/api/products", getProductsByTitle);
router.post("/admin/products", addProductByAdmin);
router.delete("/admin/products/:id", deleteProductByAdmin);

export default router;
