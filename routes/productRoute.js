const express = require("express");
const router = express.Router();
const { productValidator } = require("../middleware/productValidator");
const { protectProduct } = require("../middleware/authMiddleware");
const {
  getAllProducts, // This might be used only for admin users
  getProducts, // This should be adjusted to get products for the logged-in user
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productControllers");

// Route to get all products for the logged-in user
router.get("/", protectProduct, getProducts);

// Route to create a new product for the logged-in user
router.post("/", protectProduct, productValidator, createProduct);

// Route to update a product for the logged-in user
router.put("/:id", protectProduct, productValidator, updateProduct);

// Route to delete a product for the logged-in user
router.delete("/:id", protectProduct, deleteProduct);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { productValidator } = require("../middleware/productValidator");
// const { protectProduct } = require("../middleware/authMiddleware");
// const { adminValidator } = require("../middleware/adminValidator");
// const {
//   getAllProducts,
//   getProducts,
//   createProduct,
//   updateProduct,
//   deleteProduct,
// } = require("../controllers/productControllers");

// router
//   .route("/")
//   .get(protectProduct, adminValidator, getAllProducts)
//   .post(protectProduct, productValidator, createProduct);

// router
//   .route("/:id")
//   .get(protectProduct, getProducts)
//   .put(protectProduct, productValidator, updateProduct)
//   .delete(protectProduct, deleteProduct);

// module.exports = router;
