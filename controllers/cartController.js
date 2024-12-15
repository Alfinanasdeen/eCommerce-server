import Cart from "../models/Cart.js";

// Create a new cart
export const createCart = async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json({ message: "Error creating cart", error: err });
  }
};
