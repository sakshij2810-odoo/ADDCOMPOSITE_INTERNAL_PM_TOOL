const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { createServer } = require("http");
const { Server } = require("socket.io");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Import database services
const UserService = require("../../shared/database/services/UserService");
const CompanyService = require("../../shared/database/services/CompanyService");
const ConversationService = require("../../shared/database/services/ConversationService");
const LeadsService = require("../../shared/database/services/LeadsService");
const AnalyticsService = require("../../shared/database/services/AnalyticsService");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false,
  },
});
const PORT = process.env.PORT || 3001;

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
    service: "auth-service",
    status: "healthy",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

// Auth routes
app.get("/api/v1/authentication/status", (req, res) => {
  res.json({
    success: true,
    message: "Auth service is running",
    service: "auth-service",
    port: PORT,
  });
});

// User API endpoints
app.get("/api/v1/user/get-user", async (req, res) => {
  console.log("👤 Get user request received:", {
    query: req.query,
    headers: req.headers,
    origin: req.get("origin"),
    timestamp: new Date().toISOString(),
  });

  try {
    const { status, user_uuid } = req.query;

    if (!user_uuid) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_USER_UUID",
          message: "user_uuid parameter is required",
        },
      });
    }

    const userData = await UserService.getUserByUuid(
      user_uuid,
      status || "ACTIVE"
    );

    if (!userData) {
      return res.status(404).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "User not found",
        },
      });
    }

    console.log("✅ User data response sent successfully");
    res.json({
      message: "All User",
      totalRecords: 1,
      currentRecords: 1,
      data: [userData],
    });
  } catch (error) {
    console.error("❌ Error in get-user:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
      },
    });
  }
});

// Conversation API endpoints
app.get("/api/v1/conversation/get-conversation", async (req, res) => {
  console.log("💬 Get conversation request received:", {
    query: req.query,
    headers: req.headers,
    origin: req.get("origin"),
    timestamp: new Date().toISOString(),
  });

  try {
    const { user_uuid } = req.query;

    if (!user_uuid) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_USER_UUID",
          message: "user_uuid parameter is required",
        },
      });
    }

    const conversations = await ConversationService.getConversationsByUser(
      user_uuid
    );

    console.log("✅ Conversation data response sent successfully");
    res.json({
      message: "Conversations:",
      currentRecords: conversations.length,
      data: conversations,
    });
  } catch (error) {
    console.error("❌ Error in get-conversation:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
      },
    });
  }
});

// Company Information API
app.get(
  "/api/v1/companyInformation/get-public-company-information",
  async (req, res) => {
    console.log("🏢 Public company information request received");

    try {
      const companyData = await CompanyService.getPublicCompanyInformation();

      if (!companyData) {
        return res.status(404).json({
          success: false,
          error: {
            code: "COMPANY_NOT_FOUND",
            message: "Company information not found",
          },
        });
      }

      res.json({
        message: "Company Information Record",
        totalRecords: 1,
        currentRecords: 1,
        data: [companyData],
      });
    } catch (error) {
      console.error("❌ Error in get-public-company-information:", error);
      res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Internal server error",
        },
      });
    }
  }
);

// Leads API endpoints
app.get("/api/v1/lead/get-leads", async (req, res) => {
  console.log("📋 Get leads request received:", req.query);

  try {
    const { pageNo = 1, itemPerPage = 3 } = req.query;
    const page = parseInt(pageNo);
    const limit = parseInt(itemPerPage);

    const result = await LeadsService.getLeads(page, limit);

    res.json({
      message: "All leads",
      currentRecords: result.leads.length,
      data: result.leads,
    });
  } catch (error) {
    console.error("❌ Error in get-leads:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
      },
    });
  }
});

// Analytics API endpoints
app.get("/api/v1/analytics/get-analytics", async (req, res) => {
  console.log("📊 Get analytics request received:", req.query);

  try {
    const { from_date, to_date } = req.query;

    if (!from_date || !to_date) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_DATE_PARAMETERS",
          message: "from_date and to_date parameters are required",
        },
      });
    }

    const analyticsData = await AnalyticsService.getAnalyticsData(
      from_date,
      to_date
    );

    res.json({
      message: "Analytics :",
      data: analyticsData,
    });
  } catch (error) {
    console.error("❌ Error in get-analytics:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
      },
    });
  }
});

// Login endpoint
app.post("/api/v1/authentication/login", async (req, res) => {
  console.log("🔐 Login request received:", {
    body: req.body,
    headers: req.headers,
    origin: req.get("origin"),
    userAgent: req.get("user-agent"),
    timestamp: new Date().toISOString(),
  });

  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_CREDENTIALS",
          message: "Email and password are required",
        },
      });
    }
  } catch (error) {
    console.error("❌ Error in login:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
      },
    });
  }
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`🔌 Socket.IO client connected: ${socket.id}`);
  console.log(
    `🌐 Socket.IO connection from origin: ${socket.handshake.headers.origin}`
  );

  // Send welcome message
  socket.emit("welcome", {
    message: "Connected to Nove Backend Socket.IO",
    socketId: socket.id,
    timestamp: new Date().toISOString(),
  });

  // Handle chat messages (if needed)
  socket.on("chat_message", (data) => {
    console.log(`💬 Chat message from ${socket.id}:`, data);
    // Broadcast to all clients
    io.emit("chat_message", {
      ...data,
      socketId: socket.id,
      timestamp: new Date().toISOString(),
    });
  });

  // Handle user authentication via socket
  socket.on("user_auth", (data) => {
    console.log(`🔐 User auth via socket from ${socket.id}:`, data);
    // You can add authentication logic here
    socket.emit("auth_response", {
      success: true,
      message: "Authentication successful",
      socketId: socket.id,
    });
  });

  // Handle disconnection
  socket.on("disconnect", (reason) => {
    console.log(
      `🔌 Socket.IO client disconnected: ${socket.id}, reason: ${reason}`
    );
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
server.listen(PORT, () => {
  console.log(`🚀 Auth service running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 Socket.IO server: http://localhost:${PORT}/socket.io/`);
  console.log(
    `🔐 Auth API: http://localhost:${PORT}/api/v1/authentication/status`
  );
  console.log(
    `🏢 Public Company Info: http://localhost:${PORT}/api/v1/companyInformation/get-public-company-information`
  );
  console.log(`👤 User Info: http://localhost:${PORT}/api/v1/user/get-user`);
  console.log(
    `💬 Conversation Info: http://localhost:${PORT}/api/v1/conversation/get-conversation`
  );
  console.log(`📋 Leads API: http://localhost:${PORT}/api/v1/lead/get-leads`);
  console.log(
    `📊 Analytics API: http://localhost:${PORT}/api/v1/analytics/get-analytics`
  );
});
