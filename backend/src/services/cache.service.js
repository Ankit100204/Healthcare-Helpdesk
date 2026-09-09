const { redisClient } = require("../config/redis");

const logger = require("../config/logger");

class CacheService {

    /**
     * Get Cache
     */
    async get(key) {

        const value = await redisClient.get(key);

        if (!value) {

            logger.info(`Redis MISS -> ${key}`);

            return null;

        }

        logger.info(`Redis HIT -> ${key}`);

        return JSON.parse(value);

    }

    /**
     * Set Cache
     */
    async set(key, value, ttl = 300) {

        await redisClient.set(
            key,
            JSON.stringify(value),
            {
                EX: ttl
            }
        );

    }

    /**
     * Delete Cache
     */
    async del(key) {

        await redisClient.del(key);

    }

    /**
     * Check Exists
     */
    async exists(key) {

        return await redisClient.exists(key);

    }

    /**
     * Remember Pattern (Cache Aside)
     */
    async remember(key, ttl, callback) {

        try {

            const cached = await this.get(key);

            if (cached) {

                return cached;

            }

        } catch (error) {

            logger.error(error);

        }

        const data = await callback();

        try {

            await this.set(
                key,
                data,
                ttl
            );

        } catch (error) {

            logger.error(error);

        }

        return data;

    }

    /**
 * Delete Keys By Pattern
 */
async delPattern(pattern) {

    try {

        let cursor = 0;

        do {

            const result = await redisClient.scan(
                cursor,
                {
                    MATCH: pattern,
                    COUNT: 100
                }
            );

            cursor = Number(result.cursor);

            const keys = result.keys;

            if (keys.length > 0) {

                await redisClient.del(keys);

                logger.info(
                    `Redis Deleted ${keys.length} Keys`
                );

            }

        } while (cursor !== 0);

    } catch (error) {

        logger.error(error);

    }

}
/**
 * Get Remaining TTL
 */
async ttl(key){

    return await redisClient.ttl(key);

}
}

module.exports = new CacheService();