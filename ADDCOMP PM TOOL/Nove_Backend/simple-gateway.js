const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API Gateway is running",
    timestamp: new Date().toISOString(),
  });
});

// Welcome endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Addcomposites oy API Gateway",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Simple proxy for authentication
app.use("/api/v1/authentication", (req, res, next) => {
  console.log(`Proxying auth request: ${req.method} ${req.url}`);
  const proxy = createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error("Auth proxy error:", err.message);
      res.status(503).json({
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "Auth service unavailable",
        },
      });
    },
  });
  proxy(req, res, next);
});

// Simple proxy for user service
app.use("/api/v1/user", (req, res, next) => {
  console.log(`Proxying user request: ${req.method} ${req.url}`);
  const proxy = createProxyMiddleware({
    target: "http://localhost:3002",
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error("User proxy error:", err.message);
      res.status(503).json({
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "User service unavailable",
        },
      });
    },
  });
  proxy(req, res, next);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple API Gateway running on port ${PORT}`);
  console.log(`🌐 Gateway URL: http://localhost:${PORT}`);
});
