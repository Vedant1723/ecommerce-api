const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Otp = require("../models/Otp");
const otpGenerator = require("../config/otpGenerator");
const sendMail = require("../config/sendMail");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
