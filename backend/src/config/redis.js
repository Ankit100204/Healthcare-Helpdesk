const { createClient } = require("redis");

const env = require("./env");
const logger = require("./logger");

const redisClient = createClient({
    url: env.REDIS_URL || "redis://127.0.0.1:6379"
});

redisClient.on("connect", () => {
    logger.info("Redis Connected");
});

redisClient.on("error", (err) => {
    logger.error(err);
});

const connectRedis = async () => {
    await redisClient.connect();
};

module.exports = {
    redisClient,
    connectRedis
};