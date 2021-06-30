const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
  },
  productID: {
    type: mongoose.Schema.Types.ObjectId,
  },
  product: {
    type: Object,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Cart = mongoose.model("cart", CartSchema);
