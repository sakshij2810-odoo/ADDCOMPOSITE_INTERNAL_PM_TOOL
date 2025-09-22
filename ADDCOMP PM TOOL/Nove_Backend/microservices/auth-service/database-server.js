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
          message: "user_uuid is required",
        },
      });
    }

    const user = await UserService.getUserWithModuleSecurity(user_uuid, status);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "User not found",
        },
      });
    }

    console.log("✅ User data retrieved from database successfully");
    res.json({
      message: "All User",
      totalRecords: 1,
      currentRecords: 1,
      data: [user],
    });
  } catch (error) {
    console.error("❌ Error getting user:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "DATABASE_ERROR",
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
          message: "user_uuid is required",
        },
      });
    }

    const conversations = await ConversationService.getConversationsByUser(
      user_uuid
    );

    console.log("✅ Conversation data retrieved from database successfully");
    res.json({
      message: "Conversations:",
      currentRecords: conversations.length,
      data: conversations,
    });
  } catch (error) {
    console.error("❌ Error getting conversations:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "DATABASE_ERROR",
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
      const companyInfo = await CompanyService.getPublicCompanyInformation();

      if (!companyInfo) {
        return res.status(404).json({
          success: false,
          error: {
            code: "COMPANY_INFO_NOT_FOUND",
            message: "Company information not found",
          },
        });
      }

      console.log(
        "✅ Company information retrieved from database successfully"
      );
      res.json({
        message: "Company Information Record",
        totalRecords: 1,
        currentRecords: 1,
        data: [companyInfo],
      });
    } catch (error) {
      console.error("❌ Error getting company information:", error);
      res.status(500).json({
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Internal server error",
        },
      });
    }
  }
);

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

    // Authenticate user with database
    const user = await UserService.authenticateUser(email, password);

    if (!user) {
      console.log("❌ Login failed for:", email);
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        full_name: user.full_name,
        user_fact_unique_id: user.user_fact_unique_id,
        user_uuid: user.user_uuid,
        email: user.email,
        role_uuid: user.role_uuid,
        role_value: user.role_value,
        branch_uuid: user.branch_uuid,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
      },
      process.env.JWT_SECRET || "your-jwt-secret-key-development"
    );

    console.log("✅ Login successful for:", email);
    console.log("📤 Sending login response...");

    res.json({
      message: "Login successful.",
      data: {
        token: token,
        isOTPPreview: false,
        user: {
          user_fact_id: user.user_fact_id,
          user_fact_unique_id: user.user_fact_unique_id,
          user_uuid: user.user_uuid,
          email: user.email,
          status: user.status,
          created_by_uuid: user.created_by_uuid,
          created_by_name: user.created_by_name,
          create_ts: user.create_ts,
          user_dim_id: user.user_dim_id,
          role_uuid: user.role_uuid,
          role_value: user.role_value,
          user_profile_id: user.user_profile_id,
          first_name: user.first_name,
          last_name: user.last_name,
          full_name: user.full_name,
          personal_email: user.personal_email,
          job_title: user.job_title,
          user_type: user.user_type,
          assigned_phone_number: user.assigned_phone_number,
          shared_email: user.shared_email,
          mobile: user.mobile,
          home_phone: user.home_phone,
          linkedin_profile: user.linkedin_profile,
          hire_date: user.hire_date,
          last_day_at_work: user.last_day_at_work,
          department: user.department,
          fax: user.fax,
          date_of_birth: user.date_of_birth,
          mother_maiden_name: user.mother_maiden_name,
          photo: user.photo,
          signature: user.signature,
          street_address: user.street_address,
          unit_or_suite: user.unit_or_suite,
          city: user.city,
          csr: user.csr,
          csr_code: user.csr_code,
          marketer: user.marketer,
          marketer_code: user.marketer_code,
          producer_one: user.producer_one,
          producer_one_code: user.producer_one_code,
          producer_two: user.producer_two,
          producer_two_code: user.producer_two_code,
          producer_three: user.producer_three,
          producer_three_code: user.producer_three_code,
          branch_code: user.branch_code,
          province_or_state: user.province_or_state,
          postal_code: user.postal_code,
          country: user.country,
          languages_known: user.languages_known,
          documents: user.documents,
          branch_name: user.branch_name,
          branch_uuid: user.branch_uuid,
          referral_code: user.referral_code,
        },
      },
    });
    console.log("✅ Login response sent successfully");
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "DATABASE_ERROR",
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
});
