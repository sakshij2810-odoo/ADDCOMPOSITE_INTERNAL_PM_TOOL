const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3002;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:8004", "http://localhost:8005"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests, please try again later",
    },
  },
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
app.use(morgan("combined"));

// Health check route
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "User service is running",
    timestamp: new Date().toISOString(),
    service: "user-service",
    port: PORT,
  });
});

// User routes - DEPRECATED: Use working-user-server.js instead
app.get("/api/v1/user/profile", (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: "SERVICE_DEPRECATED",
      message:
        "This service has been deprecated. Please use working-user-server.js instead.",
    },
  });
});

app.put("/api/v1/user/profile", (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: "SERVICE_DEPRECATED",
      message:
        "This service has been deprecated. Please use working-user-server.js instead.",
    },
  });
});

app.get("/api/v1/user/team", (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: "SERVICE_DEPRECATED",
      message:
        "This service has been deprecated. Please use working-user-server.js instead.",
    },
  });
});

app.get("/api/v1/user/:id", (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: "SERVICE_DEPRECATED",
      message:
        "This service has been deprecated. Please use working-user-server.js instead.",
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
    },
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 User service running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Users endpoint: http://localhost:${PORT}/api/v1/user/team`);
});
