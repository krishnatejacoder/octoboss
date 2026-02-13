const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerId: String,
    items: [String],
    totalAmount: Number,
    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);