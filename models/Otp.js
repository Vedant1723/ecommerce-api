const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
  },
  otp: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
});

module.exports = Otp = mongoose.model("otp", OtpSchema);
