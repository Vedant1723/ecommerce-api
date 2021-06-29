const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  address: {
    type: String,
  },
  gender: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  lat: {
    type: String,
  },
  long: {
    type: String,
  },
  location: {
    type: String,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
