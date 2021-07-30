const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Order = require("../models/Order");

/*
-------------<Auth>-------------
*/

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    //   Check if Admin Exists or not
    var admin = await Admin.findOne({ email });

    if (admin) {
      return res.json({ statusCode: 400, msg: "Admin Already Exists" });
    }

    //Creating the Admin
    admin = new Admin({
      name,
      email,
      password,
    });

    // Hashing the Password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    // Saving the Admin into DB
    await admin.save();

    // Generating Token
    const payload = {
      admin: {
        id: admin.id,
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
          message: "Admin Created!",
          data: admin,
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

    // Check if Admin Exists or not
    var admin = await Admin.findOne({ email });
    if (!admin) {
      return res.json({ statusCode: 404, message: "Admin not Found" });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.json({ statusCode: 400, message: "Invalid Credentials" });
    }

    // Generating Token
    const payload = {
      admin: {
        id: admin.id,
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
          message: "Admin Logged in!",
          data: admin,
          token: token,
        });
      }
    );
  } catch (error) {
    console.log(error.message);
  }
};

/*
-------------</Auth>-------------
*/

/*
-------------<Category>-------------
*/

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.json(categories);
  } catch (error) {
    console.log(error.message);
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if same name Category exists or not
    var category = await Category.findOne({ name });

    if (category) {
      return res.json({
        statusCode: 400,
        message: "Category with sane name Already Exists!",
      });
    }
    category = new Category({ name });
    await category.save();
    return res.json({ statusCode: 200, message: "Category Added!" });
  } catch (error) {
    console.log(error.message);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Find Category
    var category = await Category.findById(req.params.id);

    if (!category) {
      return res.json({
        statusCode: 400,
        message: "Category ID is invalid!",
      });
    }
    category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { name: name } },
      { new: true }
    );
    return res.json({ statusCode: 200, message: "Category Updated!" });
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    // Find Category
    var category = await Category.findById(req.params.id);

    if (!category) {
      return res.json({
        statusCode: 400,
        message: "Category ID is invalid!",
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    return res.json({ statusCode: 200, message: "Category Deleted!" });
  } catch (error) {
    console.log(error.message);
  }
};

/*
-------------</Category>-------------
*/

/*
-------------<Products>-------------
*/

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (error) {
    console.log(error.message);
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, cuttedPrice, category } = req.body;
    var productObj = {
      title: title,
      description: description,
      price: price,
      cuttedPrice: cuttedPrice,
      category: category,
    };
    if (req.file) {
      productObj.image = `http://${req.headers.host}/media/${req.file.filename}`;
    }
    let product = new Product(productObj);
    await product.save();

    return res.json({
      statusCode: 200,
      message: "Product Created!",
      product: product,
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { title, description, price, cuttedPrice, category } = req.body;
    var productObj = {
      title: title,
      description: description,
      price: price,
      cuttedPrice: cuttedPrice,
      category: category,
    };
    if (req.file) {
      productObj.image = `http://${req.headers.host}/media/${req.file.filename}`;
    }

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.json({ statusCode: 404, message: "Product not Found!" });
    }
    product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      { $set: productObj },
      { new: true }
    );
    return res.json({ statusCode: 200, message: "Product Updated!" });
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.json({ statusCode: 404, message: "Product not Found!" });
    }
    await Product.findByIdAndDelete(req.params.id);
    return res.json({ statusCode: 200, message: "Product Deleted!" });
  } catch (error) {
    console.log(error.message);
  }
};

/*
-------------</Products>-------------
*/

/*
-------------<Order>-------------
*/

exports.updateOrder = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    let order = await Order.findById(req.params.orderID);

    if (!order) {
      return res.json({ statusCode: 400, message: "Order ID not Valid" });
    }

    await Order.findOneAndUpdate(
      { _id: req.params.orderID },
      {
        $set: { orderStatus: orderStatus },
      },
      { new: true }
    );
    return res.json({ statusCode: 200, message: "Order Status Updated!" });
  } catch (error) {
    console.log(error.message);
  }
};

/*
-------------</Order>-------------
*/
