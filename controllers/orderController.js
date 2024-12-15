import Order from "../models/Order.js";

// Create a new order
export const createOrder = async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: "Error creating order", error: err });
  }
};
