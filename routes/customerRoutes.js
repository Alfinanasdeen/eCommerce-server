// routes/customerRoutes.js
import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  getAllCustomers,
  deleteUser,
} from "../controllers/customerController.js";

const router = express.Router();

// GET request to fetch all customers
router.get("/admin/customers", verifyToken, getAllCustomers);

// Route to delete a user by ID
router.delete("/admin/delete/:id", verifyToken, deleteUser);

export default router;
