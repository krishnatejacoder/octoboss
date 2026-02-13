const {
  incrementFailures,
  resetFailures,
  canExecute,
  setState
} = require("./circuitBreaker");

const mockPayment = async () => {
  const random = Math.random();

  if (WRITE YOUR CODE HERE) 
  throw new Error("Payment Failed");
  if (WRITE YOUR CODE HERE) {
    await new Promise((res) => setTimeout(res, 4000));
    throw new Error("Payment Timeout");
  }

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