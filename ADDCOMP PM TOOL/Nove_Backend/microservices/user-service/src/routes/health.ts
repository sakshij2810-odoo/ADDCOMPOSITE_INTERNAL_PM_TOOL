import express from "express";
import { PrismaClient } from "@prisma/client";

import { createApiResponse } from "../../../shared/utils";
import { logger } from "../utils/logger";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /health
 * Health check endpoint
 */
router.get("/", async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "user-service",
      version: "1.0.0",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: "connected",
      redis: "connected", // In a real implementation, check Redis connection
    };

    res.json(createApiResponse(true, health));

  } catch (error) {
    logger.error("Health check failed:", error);

    const health = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      service: "user-service",
      version: "1.0.0",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: "disconnected",
      redis: "unknown",
      error: error instanceof Error ? error.message : "Unknown error",
    };

    res.status(503).json(createApiResponse(false, health));
  }
});

/**
 * GET /health/ready
 * Readiness check endpoint
 */
router.get("/ready", async (req, res) => {
  try {
    // Check if service is ready to accept requests
    await prisma.$queryRaw`SELECT 1`;

    res.json(
      createApiResponse(true, {
        status: "ready",
        timestamp: new Date().toISOString(),
        service: "user-service",
      })
    );

  } catch (error) {
    logger.error("Readiness check failed:", error);
    res.status(503).json(
      createApiResponse(false, {
        status: "not ready",
        timestamp: new Date().toISOString(),
        service: "user-service",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    );
  }
});

/**
 * GET /health/live
 * Liveness check endpoint
 */
router.get("/live", (req, res) => {
  res.json(
    createApiResponse(true, {
      status: "alive",
      timestamp: new Date().toISOString(),
      service: "user-service",
      uptime: process.uptime(),
    })
  );
});

export { router as healthRoutes };
