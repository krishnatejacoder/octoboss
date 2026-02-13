const mongoose = require("mongoose");

const connectMongo = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/resilient_orders");
  console.log("MongoDB Connected");
};

module.exports = connectMongo;