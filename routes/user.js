const router = require("express").Router();
const userController = require("../controllers/userController");
const userAuth = require("../middlewares/userAuth");

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
// @DESC Get Product By ID
router.get("/product/:id", userController.getProductByID);

// @GET Route
// @DESC Get all Products
router.post("/products/all", userController.getAllProducts);

/*
-------------</Products>-------------
*/

/*
-------------<Cart>-------------
*/

// @GET Route
// @DESC Get All items added in Cart
router.get("/cart/all", userAuth, userController.getCartItems);

// @GET Route
// @DESC Add Item to Cart
router.get("/cart/add/:productID", userAuth, userController.addItemToCart);

// @GET Route
// @DESC Update Item Quantity in Cart
router.get("/cart/update/:cartID", userAuth, userController.updateCartItem);

// @DELETE Route
// @DESC Delete Item from Cart
router.delete(
  "/cart/delete/:cartID",
  userAuth,
  userController.deleteItemFromCart
);

/*
-------------</Cart>-------------
*/

/*
-------------<Order>-------------
*/

// @GET Route
// @DESC Get all Orders
router.get("/order/all", userAuth, userController.getOrders);

// @POST Route
// @DESC Create Order
router.post("/order/create", userAuth, userController.createOrder);

/*
-------------</Order>-------------
*/

module.exports = router;
