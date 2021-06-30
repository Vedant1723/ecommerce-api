const router = require("express").Router();
const fileUpload = require("../config/fileUpload");
const adminController = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminAuth");

/*
-------------<Auth>-------------
*/

// @POST Route
// @DESC Admin Signup
router.post("/register", adminController.register);

// @POST Route
// @DESC Login Admin
router.post("/login", adminController.login);

/*
-------------</Auth>-------------
*/

/*
-------------<Category>-------------
*/

// @POST Route
// @DESC Create Category
router.post("/create-category", adminAuth, adminController.createCategory);

// @PUT Route
// @DESC Update Category by ID
router.post("/update-category/:id", adminAuth, adminController.updateCategory);

// @DELETE Route
// @DESC Delete Category by ID
router.post("/delete-category/:id", adminAuth, adminController.deleteCategory);

/*
-------------</Category>-------------
*/

/*
-------------<Products>-------------
*/

// @GET Route
// @DESC Get All Products
router.get("/products/all", adminAuth, adminController.getAllProducts);

// @POST Route
// @DESC Create Product
router.post(
  "/products/create",
  adminAuth,
  fileUpload.single("image"),
  adminController.createProduct
);

// @PUT Route
// @DESC Update Product
router.put(
  "/products/update/:id",
  adminAuth,
  fileUpload.single("image"),
  adminController.updateProduct
);

// @DELETE Route
// @DESC Delete Product
router.delete("/products/delete/:id", adminAuth, adminController.deleteProduct);

/*
-------------</Products>-------------
*/

/*
-------------<Order>-------------
*/

// @PUT Route
// @DESC Update Order Status
router.put("/order/:orderID", adminAuth, adminController.updateOrder);

/*
-------------</Order>-------------
*/

module.exports = router;
