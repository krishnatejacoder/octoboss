const {
  incrementFailures,
  resetFailures,
  canExecute,
  setState
} = require("./circuitBreaker");

const mockPayment = async () => {
  const random = Math.random();

  // 30% FAILURE
  if (random < 0.3) {
    throw new Error("Payment Failed");
  }

  // 20% TIMEOUT
  if (random < 0.5) {
    await new Promise((res) => setTimeout(res, 4000));
    throw new Error("Payment Timeout");
  }

  // 50% SUCCESS
  return { success: true };
};

const processPayment = async () => {
  const allowed = await canExecute();

  if (!allowed) throw new Error("Circuit Open - Try Later");

  try {
    const result = await mockPayment();
    await resetFailures();
    await setState("CLOSED");
    return result;
  } catch (err) {
    await incrementFailures();
    throw err;
  }
};

module.exports = { processPayment };
