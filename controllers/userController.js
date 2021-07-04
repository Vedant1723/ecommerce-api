const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Otp = require("../models/Otp");
const otpGenerator = require("../config/otpGenerator");
const sendMail = require("../config/sendMail");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
require("dotenv").config();

/*
-------------<Auth>-------------
*/

exports.signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address,
      gender,
      phoneNumber,
      lat,
      long,
      location,
    } = req.body;

    // Check if user Exists or not
    var user = await User.findOne({ email });
    if (user) {
      return res.json({ statusCode: 400, msg: "User Already Exists" });
    }

    //Creating the User
    user = new User({
      name,
      email,
      password,
      address,
      gender,
      phoneNumber,
      lat,
      long,
      location,
    });

    // Hashing the Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Saving the User into DB
    await user.save();

    // Sending the OTP
    let otp = new Otp({
      userID: user.id,
      otp: otpGenerator(6),
    });

    await otp.save((err) => {
      if (err) return res.json({ statusCode: 500, message: err.message });
      //Send Mail
      sendMail(user.email, "OTP Verification", otp.otp);
      return res.json({
        statusCode: 200,
        message: "OTP sent to " + user.email,
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.confirmOTP = async (req, res) => {
  try {
    var otp = await Otp.findOne({ otp: req.body.otp });
    if (!otp) {
      return res.json({ statusCode: 400, message: "OTP is not Valid" });
    }

    if (otp.isUsed) {
      return res.json({ statusCode: 400, message: "OTP is already Used" });
    }

    var user = await User.findById(otp.userID);

    //update the OTP entity
    otp.isUsed = true;

    await otp.save();

    // Generating Token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: 360000000 },
      (err, token) => {
        if (err) throw err;
        return res.json({
          statusCode: 200,
          message: "OTP Verified",
          data: user,
          token: token,
        });
      }
    );
  } catch (error) {
    console.log(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if User Exists or not
    var user = await User.findOne({ email });
    if (!user) {
      return res.json({ statusCode: 404, message: "User not Found" });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ statusCode: 400, message: "Invalid Credentials" });
    }

    // Sending the OTP
    let otp = new Otp({
      userID: user.id,
      otp: otpGenerator(6),
    });
    await otp.save((err) => {
      if (err) return res.json({ statusCode: 500, message: err.message });
      //Send Mail
      sendMail(user.email, "OTP Verification", otp.otp);
      return res.json({
        statusCode: 200,
        message: "OTP sent to " + user.email,
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};

/*
-------------</Auth>-------------
*/

/*
-------------<Products>-------------
*/

exports.getProductById = async (req, res) => {
  try {
    var product = await Product.findById(req.params.id);
    return res.json(product);
  } catch (error) {
    console.log(error.message);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (error) {
    console.log(error.message);
  }
};

/*
-------------</Products>-------------
*/

/*
-------------<Cart>-------------
*/

exports.getCartItems = async (req, res) => {
  try {
    const products = await Cart.find({ userID: req.user.id });
    return res.json(products);
  } catch (error) {
    console.log(error.message);
  }
};

exports.addItemToCart = async (req, res) => {
  try {
    var itemObj = {
      userID: req.user.id,
      productID: req.params.productID,
      quantity: parseInt(req.query.qty),
    };
    var product = await Product.findById(req.params.productID);

    if (!product) {
      return res.json({ statusCode: 404, message: "Product not Found!" });
    }
    itemObj.product = product;

    let cartItem = new Cart(itemObj);
    await cartItem.save();

    return res.json({
      statusCode: 200,
      message: "Item Added in the Cart",
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    var qty = parseInt(req.query.qty);

    var cartItem = await Cart.findById(req.params.cartID);

    if (!cartItem) {
      return res.json({ statusCode: 404, message: "Product not Found!" });
    }

    await Cart.findOneAndUpdate(
      { _id: req.params.cartID },
      { $set: { quantity: qty } },
      {
        new: true,
      }
    );
    return res.json({
      statusCode: 200,
      message: "Items Updated",
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteItemFromCart = async (req, res) => {
  try {
    var cartItem = await Cart.findById(req.params.cartID);

    if (!cartItem) {
      return res.json({ statusCode: 404, message: "Product not Found!" });
    }

    await Cart.findByIdAndDelete(req.params.cartID);
    return res.json({ statusCode: 200, message: "Item removed!" });
  } catch (error) {
    console.log(error.message);
  }
};

/*
-------------</Cart>-------------
*/

/*
-------------<Order>-------------
*/

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userID: req.user.id });

    res.json(orders);
  } catch (error) {
    console.log(error.message);
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    var obj = {
      items: items,
      amount: amount,
      address: address,
      userID: req.user.id,
    };

    let order = new Order(obj);
    await order.save();
    return res.json({ statusCode: 200, message: "Order Successfull" });
  } catch (error) {
    console.log(error.message);
  }
};

/*
-------------</Order>-------------
*/
