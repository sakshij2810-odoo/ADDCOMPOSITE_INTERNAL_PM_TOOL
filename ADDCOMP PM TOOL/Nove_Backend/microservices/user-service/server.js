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

// Mock users data
const mockUsers = [
  {
    id: "user-1",
    email: "sakshi.jadhav@addcomposites.com",
    name: "Sakshi Jadhav",
    firstName: "Sakshi",
    lastName: "Jadhav",
    role: "ADMIN",
    department: "Engineering",
    position: "Lead Developer",
    phone: "+1-555-0101",
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "user-2",
    email: "john.doe@addcomposites.com",
    name: "John Doe",
    firstName: "John",
    lastName: "Doe",
    role: "PROJECT_MANAGER",
    department: "Project Management",
    position: "Senior Project Manager",
    phone: "+1-555-0102",
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "user-3",
    email: "jane.smith@addcomposites.com",
    name: "Jane Smith",
    firstName: "Jane",
    lastName: "Smith",
    role: "EMPLOYEE",
    department: "Engineering",
    position: "Software Developer",
    phone: "+1-555-0103",
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "user-4",
    email: "mike.wilson@addcomposites.com",
    name: "Mike Wilson",
    firstName: "Mike",
    lastName: "Wilson",
    role: "EMPLOYEE",
    department: "Design",
    position: "UI/UX Designer",
    phone: "+1-555-0104",
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "user-5",
    email: "sarah.johnson@addcomposites.com",
    name: "Sarah Johnson",
    firstName: "Sarah",
    lastName: "Johnson",
    role: "EMPLOYEE",
    department: "Quality Assurance",
    position: "QA Engineer",
    phone: "+1-555-0105",
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// User routes
app.get("/api/v1/user/profile", (req, res) => {
  const userId = req.headers["x-user-id"];
  const user = mockUsers.find((u) => u.id === userId) || mockUsers[0];

  res.json({
    success: true,
    data: { user },
  });
});

app.put("/api/v1/user/profile", (req, res) => {
  const userId = req.headers["x-user-id"];
  const user = mockUsers.find((u) => u.id === userId) || mockUsers[0];

  res.json({
    success: true,
    data: {
      user: { ...user, ...req.body, updatedAt: new Date().toISOString() },
    },
  });
});

app.get("/api/v1/user/team", (req, res) => {
  const { page = 1, limit = 10, department, role } = req.query;

  let filteredUsers = mockUsers;

  if (department) {
    filteredUsers = filteredUsers.filter((u) => u.department === department);
  }

  if (role) {
    filteredUsers = filteredUsers.filter((u) => u.role === role);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: {
      users: paginatedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit),
      },
    },
  });
});

app.get("/api/v1/user/:id", (req, res) => {
  const { id } = req.params;
  const user = mockUsers.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        code: "USER_NOT_FOUND",
        message: "User not found",
      },
    });
  }

  res.json({
    success: true,
    data: { user },
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
