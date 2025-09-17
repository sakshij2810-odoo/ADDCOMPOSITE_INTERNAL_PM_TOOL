import { PrismaClient } from "@prisma/client";
import { config } from "../../../shared/config";
import { logger } from "../utils/logger";

let prisma: PrismaClient;

export async function connectDatabase(): Promise<PrismaClient> {
  try {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: config.database.url,
        },
      },
      log: [
        { level: "query", emit: "event" },
        { level: "error", emit: "stdout" },
        { level: "info", emit: "stdout" },
        { level: "warn", emit: "stdout" },
      ],
    });

    // Log database queries in development
    if (config.nodeEnv === "development") {
      prisma.$on("query", (e) => {
        logger.debug("Database query:", {
          query: e.query,
          params: e.params,
          duration: `${e.duration}ms`,
        });
      });
    }

    // Test the connection
    await prisma.$connect();

    logger.info("Database connected successfully");
    return prisma;
  } catch (error) {
    logger.error("Database connection failed:", error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    if (prisma) {
      await prisma.$disconnect();
      logger.info("Database disconnected successfully");
    }
  } catch (error) {
    logger.error("Database disconnection failed:", error);
    throw error;
  }
}

export { prisma };
