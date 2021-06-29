const router = require("express").Router();
const userController = require("../controllers/userController");

// @POST Route
// @DESC User Signup
router.post("/register", userController.signup);

// @POST Route
// @DESC User Login
router.post("/login", userController.login);

// @POST Route
// @DESC OTP Confirmation
router.post("/confirm-otp", userController.confirmOTP);

module.exports = router;
