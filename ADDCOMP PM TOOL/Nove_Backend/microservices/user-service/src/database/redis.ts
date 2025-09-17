import { createClient } from "redis";
import { config } from "../../../shared/config";
import { logger } from "../utils/logger";

let redisClient: ReturnType<typeof createClient>;

export async function connectRedis() {
  try {
    redisClient = createClient({
      url: config.redis.url,
      password: config.redis.password,
      database: config.redis.db,
    });

    redisClient.on("error", (err) => {
      logger.error("Redis client error:", err);
    });

    redisClient.on("connect", () => {
      logger.info("Redis client connected");
    });

    redisClient.on("ready", () => {
      logger.info("Redis client ready");
    });

    redisClient.on("end", () => {
      logger.info("Redis client disconnected");
    });

    await redisClient.connect();
    logger.info("Redis connected successfully");
    return redisClient;
  } catch (error) {
    logger.error("Redis connection failed:", error);
    throw error;
  }
}

export async function disconnectRedis() {
  try {
    if (redisClient) {
      await redisClient.quit();
      logger.info("Redis disconnected successfully");
    }
  } catch (error) {
    logger.error("Redis disconnection failed:", error);
    throw error;
  }
}

export { redisClient };
