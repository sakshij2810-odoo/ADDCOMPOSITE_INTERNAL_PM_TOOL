const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3001;

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
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
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
app.use(morgan("combined"));

// Health check route
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Auth service is running",
    timestamp: new Date().toISOString(),
    service: "auth-service",
    port: PORT,
  });
});

// Authentication routes
app.post("/api/v1/authentication/login", (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: "SERVICE_DEPRECATED",
      message:
        "This service has been deprecated. Please use working-auth-server.js instead.",
    },
  });
});

app.post("/api/v1/authentication/user-verification", (req, res) => {
  res.json({
    success: true,
    data: {
      message: "User verification endpoint - mock response",
    },
  });
});

app.post("/api/v1/authentication/validate-otp-get-token", (req, res) => {
  res.json({
    success: true,
    data: {
      message: "OTP validation endpoint - mock response",
    },
  });
});

app.post("/api/v1/authentication/forget-password", (req, res) => {
  res.json({
    success: true,
    data: {
      message: "Password reset OTP sent",
    },
  });
});

app.put("/api/v1/authentication/logout", (req, res) => {
  res.json({
    success: true,
    data: {
      message: "Logged out successfully",
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
    requestId: req.headers["x-request-id"] || "unknown",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Auth service running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(
    `🔐 Login endpoint: http://localhost:${PORT}/api/v1/authentication/login`
  );
});
