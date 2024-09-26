import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    categories: {
      type: [String], // An array to hold multiple categories (if needed)
      required: true,
    },
    filters: {
      // A flexible filters object that can hold category-specific filters
      brand: { type: String },
      size: { type: String },
      color: { type: String },
      warranty: { type: String },
      material: { type: String },
      style: { type: String },
      skinType: { type: String },
      activity: { type: String },
      ageGroup: { type: String },
      category: { type: String }, // For Toys & Games category-specific
      genre: { type: String }, // For Books & Stationery
      binding: { type: String }, // For Books & Stationery
      type: { type: String }, // Automotive and other categories that use 'type'
      instrumentType: { type: String }, // Music Instruments
      petType: { type: String }, // Pet Supplies
      productType: { type: String }, // Pet Supplies and other types
      plantType: { type: String }, // Gardening
      toolType: { type: String }, // Gardening
    },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);

//categories: { type: Array },
