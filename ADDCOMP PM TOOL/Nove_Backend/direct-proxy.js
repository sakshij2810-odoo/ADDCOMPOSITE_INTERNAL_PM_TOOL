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
    message: "Direct API Gateway is running",
    timestamp: new Date().toISOString(),
  });
});

// Welcome endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Addcomposites API Gateway",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Direct proxy for user service
app.use("/api/v1/user", (req, res) => {
  console.log(`Proxying user request: ${req.method} ${req.url}`);

  const body = req.body ? JSON.stringify(req.body) : "";
  const options = {
    hostname: "localhost",
    port: 3002,
    path: req.url,
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (err) => {
    console.error("Proxy error:", err.message);
    res.status(503).json({
      success: false,
      error: {
        code: "SERVICE_UNAVAILABLE",
        message: "User service unavailable",
      },
    });
  });

  if (body) {
    proxyReq.write(body);
  }

  proxyReq.end();
});

// Direct proxy for auth service
app.use("/api/v1/authentication", (req, res) => {
  console.log(`Proxying auth request: ${req.method} ${req.url}`);

  const body = req.body ? JSON.stringify(req.body) : "";
  const options = {
    hostname: "localhost",
    port: 3001,
    path: req.url,
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (err) => {
    console.error("Proxy error:", err.message);
    res.status(503).json({
      success: false,
      error: {
        code: "SERVICE_UNAVAILABLE",
        message: "Auth service unavailable",
      },
    });
  });

  if (body) {
    proxyReq.write(body);
  }

  proxyReq.end();
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Direct API Gateway running on port ${PORT}`);
  console.log(`🌐 Gateway URL: http://localhost:${PORT}`);
});
