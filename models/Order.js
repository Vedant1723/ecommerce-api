const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
  },
  items: {
    type: [Object],
  },
  orderStatus: {
    type: String,
    default: "pending",
  },
  amount: {
    type: String,
  },
  address: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = Order = mongoose.model("order", OrderSchema);
