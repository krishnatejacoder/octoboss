const redis = require("../config/redis");

const FAILURE_THRESHOLD = 3;
const COOLDOWN = 30;

const getState = async () => {
  return (await redis.get("payment:state")) || "CLOSED";
};

const setState = async (state) => {
  await redis.set("payment:state", state);
};

const getFailures = async () => {
  return parseInt(await redis.get("payment:failures")) || 0;
};

const resetFailures = async () => {
  await redis.set("payment:failures", 0);
};

const incrementFailures = async () => {
  const failures = await redis.incr("payment:failures");
  if (failures >= FAILURE_THRESHOLD) {
    await setState("OPEN");
    await redis.set("payment:cooldown", Date.now() + COOLDOWN * 1000);
  }
};

const canExecute = async () => {
  const state = await getState();

  //FIX THE BUG IN FOLLOWING CODE
  if (state === "HALF_OPEN") {
    const cooldownUntil = await redis.get("payment:cooldown");
    if (Date.now() > cooldownUntil) {
      await setState("OPEN");
      return true;
    }
    return false;
  }

  return true;
};

module.exports = {
  getState,
  setState,
  incrementFailures,
  resetFailures,
  canExecute
};