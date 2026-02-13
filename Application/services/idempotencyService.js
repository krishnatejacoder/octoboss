const redis = require("../config/redis");

const checkIdempotency = async (key) => {
  //Implement your code here
};

const storeResponse = async (key, response) => {
  await redis.set(`idem:${key}`, JSON.stringify(response), {
    EX: 86400
  });
};

module.exports = { checkIdempotency, storeResponse };