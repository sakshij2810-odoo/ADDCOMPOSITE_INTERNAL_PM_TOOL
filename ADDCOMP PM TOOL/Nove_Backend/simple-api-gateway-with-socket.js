const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:8004", "http://localhost:8005"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["polling", "websocket"],
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API Gateway with Socket.IO is running",
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

// Welcome endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Addcomposites oy API Gateway with Socket.IO",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("🔌 [SOCKET] Client connected:", socket.id);

  // Handle authentication
  socket.on("authenticate", (data) => {
    console.log("🔐 [SOCKET] Authentication request:", data);
    // For now, just acknowledge the connection
    socket.emit("authenticated", { success: true, socketId: socket.id });
  });

  // Handle chat messages
  socket.on("send_message", (data) => {
    console.log("💬 [SOCKET] Message received:", data);
    // Broadcast to all connected clients
    io.emit("new_message", data);
  });

  // Handle user join
  socket.on("user_join", (data) => {
    console.log("👤 [SOCKET] User joined:", data);
    socket.broadcast.emit("user_joined", data);
  });

  // Handle user leave
  socket.on("user_leave", (data) => {
    console.log("👋 [SOCKET] User left:", data);
    socket.broadcast.emit("user_left", data);
  });

  // Handle disconnect
  socket.on("disconnect", (reason) => {
    console.log("❌ [SOCKET] Client disconnected:", socket.id, reason);
  });

  // Handle errors
  socket.on("error", (error) => {
    console.error("⚠️ [SOCKET] Error:", error);
  });
});

// Direct proxy function
function createDirectProxy(targetPort) {
  return (req, res) => {
    // Only log important requests
    if (
      req.originalUrl.includes("/upload-files") ||
      req.originalUrl.includes("/upsert-company-information")
    ) {
      console.log(
        `🔄 [GATEWAY] Proxying ${req.method} ${req.originalUrl} to port ${targetPort}`
      );
    }

    const options = {
      hostname: "localhost",
      port: targetPort,
      path: req.originalUrl, // Keep the full original path
      method: req.method,
      headers: {
        ...req.headers, // Forward all headers including Content-Type for multipart
      },
    };

    // Remove host header to avoid conflicts
    delete options.headers.host;

    const proxyReq = http.request(options, (proxyRes) => {
      // Only log important responses
      if (
        req.originalUrl.includes("/upload-files") ||
        req.originalUrl.includes("/upsert-company-information")
      ) {
        console.log(
          `✅ [GATEWAY] Response from port ${targetPort}: ${proxyRes.statusCode}`
        );
      }
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    // Add timeout to prevent hanging requests
    proxyReq.setTimeout(30000, () => {
      console.error(`❌ [GATEWAY] Request timeout for port ${targetPort}`);
      proxyReq.destroy();
      if (!res.headersSent) {
        res.status(504).json({
          success: false,
          error: {
            code: "GATEWAY_TIMEOUT",
            message: `Request to port ${targetPort} timed out`,
          },
        });
      }
    });

    proxyReq.on("error", (err) => {
      console.error(
        `❌ [GATEWAY] Proxy error for port ${targetPort}:`,
        err.message
      );
      if (!res.headersSent) {
        res.status(503).json({
          success: false,
          error: {
            code: "SERVICE_UNAVAILABLE",
            message: `Service on port ${targetPort} is currently unavailable`,
          },
        });
      }
    });

    // Handle different content types
    if (
      req.headers["content-type"] &&
      req.headers["content-type"].includes("multipart/form-data")
    ) {
      // Stream the request data directly for file uploads
      req.pipe(proxyReq);
    } else {
      // For JSON requests, use the already parsed body or collect it
      if (req.body && Object.keys(req.body).length > 0) {
        // Use already parsed body
        const body = JSON.stringify(req.body);
        proxyReq.write(body);
        proxyReq.end();
      } else {
        // Collect body from stream
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          if (body) {
            proxyReq.write(body);
          }
          proxyReq.end();
        });
        req.on("error", (err) => {
          console.error("Request error:", err);
          proxyReq.destroy();
        });
      }
    }
  };
}

// Authentication Service Routes
app.use("/api/v1/authentication", createDirectProxy(3001));

// User Service Routes
app.use("/api/v1/user", createDirectProxy(3002));

// Project Service Routes
app.use("/api/v1/project", createDirectProxy(3003));
app.use("/api/v1/projects", (req, res) => {
  // Rewrite /api/v1/projects/get-projects to /api/v1/project for the project service
  const originalUrl = req.originalUrl;
  req.originalUrl = originalUrl.replace(
    "/api/v1/projects/get-projects",
    "/api/v1/project"
  );
  createDirectProxy(3003)(req, res);
});
app.use("/api/v1/create-project", createDirectProxy(3003));

// Task Service Routes
app.use("/api/v1/task", createDirectProxy(3004));
app.use("/api/v1/tasks", createDirectProxy(3004)); // Add plural route for frontend compatibility

// Company Information Service Routes
app.use("/api/v1/companyInformation", createDirectProxy(3005));

// Branch Office Routes
app.use("/api/v1/branch", createDirectProxy(3005));

// Security Settings Routes
app.use("/api/v1/security", createDirectProxy(3008));

// Application Settings Routes
app.use("/api/v1/settings", createDirectProxy(3005));

// Leads Service Routes
app.use("/api/v1/lead", createDirectProxy(3006));

// Analytics Service Routes
app.use("/api/v1/analytics", createDirectProxy(3007));

// General/Other Routes (for backward compatibility)
app.use("/api/v1/general", createDirectProxy(3005)); // Using company service for general routes

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
server.listen(PORT, () => {
  console.log(`🚀 API Gateway with Socket.IO running on port ${PORT}`);
  console.log(`🌐 Gateway URL: http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO enabled for real-time communication`);
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
  console.log("\n🛑 Shutting down API Gateway...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down API Gateway...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});
