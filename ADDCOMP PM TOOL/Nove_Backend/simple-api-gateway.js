const express = require("express");
const http = require("http");
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
    message: "Simple API Gateway is running",
    timestamp: new Date().toISOString(),
    services: {
      auth: "http://localhost:3001",
      user: "http://localhost:3002",
      project: "http://localhost:3003",
      task: "http://localhost:3004",
      company: "http://localhost:3005",
      leads: "http://localhost:3006",
      analytics: "http://localhost:3007",
    },
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

// Direct proxy function
function createDirectProxy(targetPort) {
  return (req, res) => {
    console.log(
      `🔄 [GATEWAY] Proxying ${req.method} ${req.originalUrl} to port ${targetPort}`
    );
    console.log(`🔄 [GATEWAY] Request headers:`, req.headers);
    console.log(`🔄 [GATEWAY] Request body:`, req.body);

    const body = req.body ? JSON.stringify(req.body) : "";
    const options = {
      hostname: "localhost",
      port: targetPort,
      path: req.originalUrl, // Keep the full original path
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        ...req.headers, // Forward all headers
      },
    };

    const proxyReq = http.request(options, (proxyRes) => {
      console.log(
        `✅ [GATEWAY] Response from port ${targetPort}: ${proxyRes.statusCode}`
      );
      console.log(`✅ [GATEWAY] Response headers:`, proxyRes.headers);
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on("error", (err) => {
      console.error(
        `❌ [GATEWAY] Proxy error for port ${targetPort}:`,
        err.message
      );
      res.status(503).json({
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: `Service on port ${targetPort} is currently unavailable`,
        },
      });
    });

    if (body) {
      proxyReq.write(body);
    }

    proxyReq.end();
  };
}

// Route handlers
app.use("/api/v1/authentication", createDirectProxy(3001));
app.use("/api/v1/user", createDirectProxy(3002));
app.use("/api/v1/project", createDirectProxy(3003));
app.use("/api/v1/task", createDirectProxy(3004));
app.use("/api/v1/companyInformation", createDirectProxy(3005));
app.use("/api/v1/lead", createDirectProxy(3006));
app.use("/api/v1/analytics", createDirectProxy(3007));

// 404 handler
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
  console.log(`🚀 Simple API Gateway running on port ${PORT}`);
  console.log(`🌐 Gateway URL: http://localhost:${PORT}`);
  console.log(`📡 Proxying requests to microservices...`);
  console.log(`   Auth Service: http://localhost:3001`);
  console.log(`   User Service: http://localhost:3002`);
  console.log(`   Project Service: http://localhost:3003`);
  console.log(`   Task Service: http://localhost:3004`);
  console.log(`   Company Service: http://localhost:3005`);
  console.log(`   Leads Service: http://localhost:3006`);
  console.log(`   Analytics Service: http://localhost:3007`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down Simple API Gateway...");
  process.exit(0);
});
