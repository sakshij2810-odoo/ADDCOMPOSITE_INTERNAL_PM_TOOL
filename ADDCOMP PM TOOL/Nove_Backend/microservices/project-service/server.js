const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3003;

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
    message: "Project service is running",
    timestamp: new Date().toISOString(),
    service: "project-service",
    port: PORT,
  });
});

// Mock projects data
const mockProjects = [
  {
    id: "project-1",
    name: "Nova World Immigration Portal",
    description: "Complete immigration management system",
    status: "ACTIVE",
    priority: "HIGH",
    projectType: "CLIENT",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    budget: 50000,
    projectManagerId: "user-1",
    clientId: "client-1",
    tags: ["immigration", "portal", "web"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _count: {
      tasks: 15,
      members: 5,
    },
  },
  {
    id: "project-2",
    name: "Internal R&D Platform",
    description: "Research and development management system",
    status: "PLANNING",
    priority: "MEDIUM",
    projectType: "INTERNAL",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
    budget: 30000,
    projectManagerId: "user-2",
    tags: ["rnd", "internal", "platform"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _count: {
      tasks: 8,
      members: 3,
    },
  },
];

// Project routes
app.get("/api/v1/projects", (req, res) => {
  const { page = 1, limit = 10, status, priority, search } = req.query;

  let filteredProjects = mockProjects;

  if (status) {
    filteredProjects = filteredProjects.filter((p) => p.status === status);
  }

  if (priority) {
    filteredProjects = filteredProjects.filter((p) => p.priority === priority);
  }

  if (search) {
    filteredProjects = filteredProjects.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: {
      projects: paginatedProjects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredProjects.length,
        totalPages: Math.ceil(filteredProjects.length / limit),
      },
    },
  });
});

app.post("/api/v1/projects", (req, res) => {
  const newProject = {
    id: "project-" + Date.now(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _count: {
      tasks: 0,
      members: 0,
    },
  };

  mockProjects.push(newProject);

  res.status(201).json({
    success: true,
    data: { project: newProject },
  });
});

app.get("/api/v1/projects/:id", (req, res) => {
  const { id } = req.params;
  const project = mockProjects.find((p) => p.id === id);

  if (!project) {
    return res.status(404).json({
      success: false,
      error: {
        code: "PROJECT_NOT_FOUND",
        message: "Project not found",
      },
    });
  }

  res.json({
    success: true,
    data: { project },
  });
});

app.put("/api/v1/projects/:id", (req, res) => {
  const { id } = req.params;
  const projectIndex = mockProjects.findIndex((p) => p.id === id);

  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: "PROJECT_NOT_FOUND",
        message: "Project not found",
      },
    });
  }

  mockProjects[projectIndex] = {
    ...mockProjects[projectIndex],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    data: { project: mockProjects[projectIndex] },
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
  console.log(`🚀 Project service running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 Projects endpoint: http://localhost:${PORT}/api/v1/projects`);
});
