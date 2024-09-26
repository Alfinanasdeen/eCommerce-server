import express from "express";
import connectToMongoDB from "./data.config.js";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import productRoute from "./routers/product.js";
import cartRoute from "./routers/cart.js";
import orderRoute from "./routers/order.js";
import authRouter from "./routers/auth.js";
import { verifyToken } from "./verifyToken.js";

dotenv.config();

// Determine which environment file to load
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: path.resolve(__dirname, envPath) });

const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use("/uploads", express.static("uploads"));
const hostname = "0.0.0.0";

connectToMongoDB();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);



app.use("/api", authRouter); // No need for token verification here
app.use("/api/products", verifyToken, productRoute); // Apply token verification here for product routes
app.use("/api/carts", verifyToken, cartRoute); // Apply token verification if needed for cart routes
app.use("/api/orders", verifyToken, orderRoute); // Apply token verification if needed for order routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}!`);
});
