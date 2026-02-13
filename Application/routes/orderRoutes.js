const express = require("express");
const Order = require("../models/Order");
const { processPayment } = require("../services/paymentService");
const { checkIdempotency, storeResponse } = require("../services/idempotencyService");
const redis = require("../config/redis");

const router = express.Router();

router.post("/", async (req, res) => {
  const key = req.headers["idempotency-key"];

  
  //Write your code here to Return json with { error: "Idempotency-Key required" } and status 400
  if (!key) {
    return res.status(400).json({ error: "Idempotency-Key required" });
  }
  const existing = await checkIdempotency(key);
  if (existing) return res.json(existing);

  try {
    const order = await Order.create(req.body);

    await processPayment();

    order.status = "PAID";
    await order.save();

    await redis.lPush("invoice_queue", order._id.toString());
    await redis.lPush("email_queue", order._id.toString());

    const response = { message: "Order Created", order };

    await storeResponse(key, response);

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;