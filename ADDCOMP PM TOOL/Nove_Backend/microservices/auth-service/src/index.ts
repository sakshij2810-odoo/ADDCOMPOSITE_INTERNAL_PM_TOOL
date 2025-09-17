import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// Simple config without shared dependency
const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  security: {
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
    },
  },
};
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import { authRoutes } from "./routes/auth";
import { healthRoutes } from "./routes/health";
import { connectDatabase } from "./database/connection";
import { connectRedis } from "./database/redis";

// Load environment variables
dotenv.config();

const app = express();
const PORT = config.port || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.security.corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.security.rateLimit.windowMs,
  max: config.security.rateLimit.maxRequests,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests, please try again later",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);
app.use(requestLogger);

// Health check route (no auth required)
app.use("/health", healthRoutes);

// Authentication routes
app.use("/api/v1/authentication", authRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
    },
    timestamp: new Date().toISOString(),
    requestId: req.headers["x-request-id"] || "unknown",
  });
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    // Connect to database
    await connectDatabase();
    logger.info("Database connected successfully");

    // Connect to Redis
    await connectRedis();
    logger.info("Redis connected successfully");

    // Start server
    app.listen(PORT, () => {
      logger.info(`Auth service running on port ${PORT}`);
      logger.info(`Environment: ${config.nodeEnv}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
