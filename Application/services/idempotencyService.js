const redis = require("../config/redis");

const checkIdempotency = async (key) => {
  //Implement your code here
   const cached = await redis.get(`idem:${key}`);

  if (!cached) {
    return null; 
  }
  return JSON.parse(cached);
};

const storeResponse = async (key, response) => {
  await redis.set(`idem:${key}`, JSON.stringify(response), {
    EX: 86400
  });
};

module.exports = { checkIdempotency, storeResponse };