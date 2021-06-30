const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: String,
  },
  cuttedPrice: {
    type: String,
  },
  image: {
    type: String,
    default: "https://i.ibb.co/k0GfqGR/image.png",
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  category: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Product = mongoose.model("product", ProductSchema);
