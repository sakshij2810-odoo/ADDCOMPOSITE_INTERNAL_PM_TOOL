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
    services: {
      auth: "http://localhost:3001",
      user: "http://localhost:3002",
      project: "http://localhost:3003",
      task: "http://localhost:3004",
      company: "http://localhost:3005",
      leads: "http://localhost:3006",
      analytics: "http://localhost:3007",
      security: "http://localhost:3008",
    },
  });
});

// Welcome endpoint (like the production API)
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Addcomposites API Gateway",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Authentication Service Routes
app.use(
  "/api/v1/authentication",
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `Proxying auth request: ${req.method} ${req.url} -> ${proxyReq.path}`
      );
    },
    onError: (err, req, res) => {
      console.error("Auth service error:", err.message);
      res.status(503).json({
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "Authentication service is currently unavailable",
        },
      });
    },
  })
);

// User Service Routes
app.use(
  "/api/v1/user",
  createProxyMiddleware({
    target: "http://localhost:3002",
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `Proxying user request: ${req.method} ${req.url} -> ${proxyReq.path}`
      );
    },
    onError: (err, req, res) => {
      console.error("User service error:", err.message);
      res.status(503).json({
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "User service is currently unavailable",
        },
      });
    },
  })
);

// Project Service Routes
app.use(
  "/api/v1/projects",
  createProxyMiddleware({
    target: "http://localhost:3003",
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error("Project service error:", err.message);
      res.status(503).json({
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "Project service is currently unavailable",
        },
      });
    },
  })
);

// Project Create Route
app.use(
  "/api/v1/create-project",
  createProxyMiddleware({
    target: "http://localhost:3003",
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error("Project service error:", err.message);
      res.status(503).json({
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "Project service is currently unavailable",
        },
      });
    },
  })
);

// Task Service Routes
app.use(
  "/api/v1/task",
  createProxyMiddleware({
    target: "http://localhost:3004",
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error("Task service error:", err.message);
      res.status(503).json({
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "Task service is currently unavailable",
        },
      });
    },
  })
);

// Company Information Service Routes
app.use(
  "/api/v1/companyInformation",
  createProxyMiddleware({
    target: "http://localhost:3005",
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error("Company service error:", err.message);
      res.status(503).json({
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "Company service is currently unavailable",
        },
      });
    },
  })
);

// Leads Service Routes
app.use(
  "/api/v1/lead",
  createProxyMiddleware({
    target: "http://localhost:3006",
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error("Leads service error:", err.message);
      res.status(503).json({
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "Leads service is currently unavailable",
        },
      });
    },
  })
);

// Analytics Service Routes
app.use(
  "/api/v1/analytics",
  createProxyMiddleware({
    target: "http://localhost:3007",
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error("Analytics service error:", err.message);
      res.status(503).json({
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "Analytics service is currently unavailable",
        },
      });
    },
  })
);

// Security Service Routes
app.use(
  "/api/v1/security",
  createProxyMiddleware({
    target: "http://localhost:3008",
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `Proxying security request: ${req.method} ${req.url} -> ${proxyReq.path}`
      );
    },
    onError: (err, req, res) => {
      console.error("Security service error:", err.message);
      res.status(503).json({
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "Security service is currently unavailable",
        },
      });
    },
  })
);

// General/Other Routes (for backward compatibility)
app.use(
  "/api/v1/general",
  createProxyMiddleware({
    target: "http://localhost:3005", // Using company service for general routes
    changeOrigin: true,
  })
);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`🌐 Gateway URL: http://localhost:${PORT}`);
  console.log(`📡 Proxying requests to microservices...`);
  console.log(`   Auth Service: http://localhost:3001`);
  console.log(`   User Service: http://localhost:3002`);
  console.log(`   Project Service: http://localhost:3003`);
  console.log(`   Task Service: http://localhost:3004`);
  console.log(`   Company Service: http://localhost:3005`);
  console.log(`   Leads Service: http://localhost:3006`);
  console.log(`   Analytics Service: http://localhost:3007`);
  console.log(`   Security Service: http://localhost:3008`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down API Gateway...");
  process.exit(0);
});
