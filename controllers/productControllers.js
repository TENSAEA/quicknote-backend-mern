const asyncHandler = require("express-async-handler");
const Product = require("../model/productModel");
const User = require("../model/userModel");

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
});

const getProducts = async (req, res) => {
  const products = await Product.find({ user: req.user.id });
  res.status(200).json(products);
};

const createProduct = async (req, res) => {
  const product = await Product.create({
    user: req.user.id,
    title: req.body.title,
    description: req.body.description,
  });

  res.status(200).json(product);
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({ error: "Product not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (product.user.toString() !== user.id) {
      return res.status(401).json({ error: "User not authorized" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Check if headers have already been sent
    if (!res.headersSent) {
      return res.status(200).json(updatedProduct);
    }
  } catch (error) {
    console.error("Error during product update:", error);
    // Check if headers have already been sent
    if (!res.headersSent) {
      return res.status(500).json({ error: "Server error" });
    }
  }
};
// const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(400).json({ error: "Product not found" });
//     }

//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(401).json({ error: "User not found" });
//     }

//     if (product.user.toString() !== user.id) {
//       return res.status(401).json({ error: "User not authorized" });
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     res.status(200).json(updatedProduct);
//   } catch (error) {
//     // If an error occurs after a response has already been sent, log the error instead of trying to send another response
//     if (!res.headersSent) {
//       res.status(500).json({ error: "Server error" });
//     } else {
//       console.error("Error after response was sent:", error);
//     }
//   }
// };

// const deleteProduct = async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   if (!product) {
//     res.status(400).json({ error: "Product not found" });
//   }

//   const user = await User.findById(req.user.id);
//   if (!user) {
//     res.status(401).json({ error: "User not found" });
//   }

//   if (product.user.toString() !== user.id) {
//     res.status(401).json({ error: "User not authorized" });
//   }

//   await Product.findOneAndDelete(req.params.id);

//   res.status(200).json({ message: "Deleted successfully" });
// };
const deleteProduct = async (req, res) => {
  try {
    console.log(`Attempting to delete product with ID: ${req.params.id}`);
    const product = await Product.findOneAndDelete({ _id: req.params.id });

    if (!product) {
      console.log(`Product with ID: ${req.params.id} not found.`);
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(`Product with ID: ${req.params.id} deleted successfully.`);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(`Error deleting product with ID: ${req.params.id}`, error);
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};
module.exports = {
  getAllProducts,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
