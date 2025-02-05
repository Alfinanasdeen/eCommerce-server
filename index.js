import express from "express";
import connectToMongoDB from "./data.config.js";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import authRouter from "./routes/auth.js";
import paymentRoute from "./routes/paymentRoute.js";
import { verifyToken } from "./middlewares/verifyToken.js";

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
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: false, // Do not allow credentials
  })
);

app.use("/api", authRouter);
app.use("/api/products", verifyToken, productRoutes);
app.use("/api/carts", verifyToken, cartRoutes);
app.use("/api/user", verifyToken, customerRoutes);
app.use("/api/orders", verifyToken, orderRoutes);
app.use("/api/payment", paymentRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}!`);
});
