const router = require("express").Router();
const userController = require("../controllers/userController");

/*
-------------<Auth>-------------
*/

// @POST Route
// @DESC User Signup
router.post("/register", userController.signup);

// @POST Route
// @DESC User Login
router.post("/login", userController.login);

// @POST Route
// @DESC OTP Confirmation
router.post("/confirm-otp", userController.confirmOTP);

/*
-------------</Auth>-------------
*/

/*
-------------<Products>-------------
*/

// @GET Route
// @DESC Get all Products
router.post("/products/all", userController.getAllProducts);

/*
-------------</Products>-------------
*/

module.exports = router;
