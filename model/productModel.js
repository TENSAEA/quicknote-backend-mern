const mongoose = require("mongoose");
const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // Add any additional product fields here
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
