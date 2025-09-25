const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.ANALYTICS_SERVICE_PORT || process.env.PORT || 3007;

// Security middleware
app.use(helmet());

// CORS configuration - Match UI_Reference API
const corsOptions = {
  origin: "*", // Allow all origins like the reference API
  credentials: false, // Set to false when origin is "*"
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Request-ID",
    "auth-token", // Allow the custom auth-token header
    "accept",
    "origin",
    "x-requested-with",
  ],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
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
    service: "analytics-service",
    status: "healthy",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

// CORS middleware handles OPTIONS requests automatically

// Analytics API endpoints
app.get("/api/v1/analytics/get-analytics", (req, res) => {
  console.log("📊 Get analytics request received:", req.query);

  const { from_date, to_date } = req.query;

  // Mock analytics data matching the UI_Reference response format
  res.json({
    message: "Analytics :",
    data: [
      {
        count_leads: 0,
        growth: 0,
      },
      {
        count_customer: 0,
        growth: 0,
      },
      {
        count_user: 0,
        growth: 0,
      },
      {
        customer_invoice_PENDING: 0,
        growth: 0,
      },
      {
        customer_invoice_PARTIALLY_PAID: 0,
        growth: 0,
      },
      {
        customer_invoice_PAID: 0,
        growth: 0,
      },
    ],
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
  console.log(`📊 Analytics service running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(
    `📊 Analytics API: http://localhost:${PORT}/api/v1/analytics/get-analytics`
  );
});
