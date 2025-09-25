const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PROJECT_SERVICE_PORT || process.env.PORT || 3003;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:8004",
      "http://localhost:8005",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  })
);
app.use(express.json());

// Helper functions
const createApiResponse = (success, data = null, error = null) => {
  return {
    success,
    data,
    error,
    timestamp: new Date().toISOString(),
  };
};

const createApiError = (code, message) => {
  return { code, message };
};

// Mock projects data
const mockProjects = [
  {
    id: "project-1",
    name: "Addcomposites oy",
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
    createdAt: new Date("2025-09-15").toISOString(), // Within the date range
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
    createdAt: new Date("2025-09-10").toISOString(), // Within the date range
    updatedAt: new Date().toISOString(),
    _count: {
      tasks: 8,
      members: 3,
    },
  },
  {
    id: "project-3",
    name: "Customer Portal Enhancement",
    description: "Enhance customer portal with new features",
    status: "ACTIVE",
    priority: "HIGH",
    projectType: "CLIENT",
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    budget: 25000,
    projectManagerId: "user-3",
    clientId: "client-2",
    tags: ["portal", "enhancement", "customer"],
    createdAt: new Date("2025-09-05").toISOString(), // Within the date range
    updatedAt: new Date().toISOString(),
    _count: {
      tasks: 12,
      members: 4,
    },
  },
  {
    id: "project-4",
    name: "Legacy System Migration",
    description: "Migrate legacy systems to modern architecture",
    status: "ACTIVE",
    priority: "MEDIUM",
    projectType: "INTERNAL",
    startDate: new Date("2025-08-30").toISOString(),
    endDate: new Date("2025-12-30").toISOString(),
    budget: 75000,
    projectManagerId: "user-4",
    tags: ["migration", "legacy", "architecture"],
    createdAt: new Date("2025-08-30").toISOString(), // Within the date range
    updatedAt: new Date().toISOString(),
    _count: {
      tasks: 20,
      members: 6,
    },
  },
  {
    id: "project-5",
    name: "Mobile App Development",
    description: "Develop mobile application for iOS and Android",
    status: "PLANNING",
    priority: "HIGH",
    projectType: "CLIENT",
    startDate: new Date("2025-09-20").toISOString(),
    endDate: new Date("2026-03-20").toISOString(),
    budget: 100000,
    projectManagerId: "user-5",
    clientId: "client-3",
    tags: ["mobile", "ios", "android", "app"],
    createdAt: new Date("2025-09-20").toISOString(), // Within the date range
    updatedAt: new Date().toISOString(),
    _count: {
      tasks: 25,
      members: 8,
    },
  },
];

// Health check
app.get("/health", (req, res) => {
  res.json(
    createApiResponse(true, {
      service: "project-service",
      status: "healthy",
      port: PORT,
      database: "connected",
    })
  );
});

// Get all projects - Main endpoint that matches frontend call
app.get("/api/v1/project", async (req, res) => {
  try {
    const {
      pageNo = 1,
      itemPerPage = 10,
      from_date,
      to_date,
      status,
      priority,
      search,
    } = req.query;

    console.log("📋 [PROJECT SERVICE] Get projects request received");
    console.log("📋 [PROJECT SERVICE] Query params:", req.query);

    let filteredProjects = [...mockProjects];

    // Apply filters
    if (status) {
      filteredProjects = filteredProjects.filter((p) => p.status === status);
    }

    if (priority) {
      filteredProjects = filteredProjects.filter(
        (p) => p.priority === priority
      );
    }

    if (search) {
      filteredProjects = filteredProjects.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply date filtering
    if (from_date) {
      const fromDate = new Date(from_date);
      filteredProjects = filteredProjects.filter(
        (p) => new Date(p.createdAt) >= fromDate
      );
    }

    if (to_date) {
      const toDate = new Date(to_date);
      filteredProjects = filteredProjects.filter(
        (p) => new Date(p.createdAt) <= toDate
      );
    }

    // Apply pagination
    const page = parseInt(pageNo);
    const limit = parseInt(itemPerPage);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    res.json(
      createApiResponse(true, {
        projects: paginatedProjects,
        pagination: {
          page: page,
          limit: limit,
          total: filteredProjects.length,
          totalPages: Math.ceil(filteredProjects.length / limit),
        },
      })
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    res
      .status(500)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("INTERNAL_ERROR", "Internal server error")
        )
      );
  }
});

// Alternative endpoint following task service pattern
app.get("/api/v1/project/get-projects", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, search } = req.query;

    let filteredProjects = [...mockProjects];

    if (status) {
      filteredProjects = filteredProjects.filter((p) => p.status === status);
    }

    if (priority) {
      filteredProjects = filteredProjects.filter(
        (p) => p.priority === priority
      );
    }

    if (search) {
      filteredProjects = filteredProjects.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    res.json(
      createApiResponse(true, {
        projects: paginatedProjects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredProjects.length,
          totalPages: Math.ceil(filteredProjects.length / limit),
        },
      })
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    res
      .status(500)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("INTERNAL_ERROR", "Internal server error")
        )
      );
  }
});

// 404 handler
app.use("*", (req, res) => {
  res
    .status(404)
    .json(
      createApiResponse(
        false,
        null,
        createApiError("NOT_FOUND", "Route not found")
      )
    );
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Fixed Project service running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 Projects endpoint: http://localhost:${PORT}/api/v1/project`);
  console.log(
    `📋 Get projects endpoint: http://localhost:${PORT}/api/v1/project/get-projects`
  );
});
