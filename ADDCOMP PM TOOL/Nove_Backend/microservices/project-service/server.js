const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3003;

// Database connection
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://sakshikalyanjadhav@localhost:5432/pm_platform",
});

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
// Main endpoint that matches frontend call
app.get("/api/v1/project", async (req, res) => {
  console.log("📋 [PROJECT SERVICE] Get projects request received");
  console.log("📋 [PROJECT SERVICE] Query params:", req.query);

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

    // For now, return mock data to ensure the API works
    // TODO: Implement database queries once database is properly set up
    console.log("📋 [PROJECT SERVICE] Returning mock data");

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
    const startIndex = (parseInt(pageNo) - 1) * parseInt(itemPerPage);
    const endIndex = startIndex + parseInt(itemPerPage);
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        projects: paginatedProjects,
        pagination: {
          page: parseInt(pageNo),
          limit: parseInt(itemPerPage),
          total: filteredProjects.length,
          totalPages: Math.ceil(filteredProjects.length / itemPerPage),
        },
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
      },
      timestamp: new Date().toISOString(),
    });
  }
});

// Alternative endpoint following task service pattern
app.get("/api/v1/project/get-projects", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, search } = req.query;

    let query = `
      SELECT p.*, 
             COUNT(pm.id) as member_count
      FROM projects p
      LEFT JOIN project_members pm ON p.id = pm."projectId"
    `;

    let whereConditions = [];
    let queryParams = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      whereConditions.push(`p.status = $${paramCount}`);
      queryParams.push(status);
    }

    if (priority) {
      paramCount++;
      whereConditions.push(`p.priority = $${paramCount}`);
      queryParams.push(priority);
    }

    if (search) {
      paramCount++;
      whereConditions.push(
        `(p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`
      );
      queryParams.push(`%${search}%`);
    }

    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(" AND ")}`;
    }

    query += ` GROUP BY p.id ORDER BY p."createdAt" DESC`;

    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM projects p
      ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""}
    `;

    const countResult = await pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // Add pagination
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    queryParams.push(parseInt(limit));

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    queryParams.push((parseInt(page) - 1) * parseInt(limit));

    const result = await pool.query(query, queryParams);

    const projects = result.rows.map((row) => ({
      id: row.id,
      project_uuid: row.project_uuid,
      name: row.name,
      description: row.description,
      status: row.status,
      priority: row.priority,
      projectType: row.projectType,
      startDate: row.startDate,
      endDate: row.endDate,
      estimatedDays: row.estimatedDays,
      budget: row.budget,
      projectManagerId: row.projectManagerId,
      clientId: row.clientId,
      tags: row.tags || [],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      createdBy: row.createdBy,
      updatedBy: row.updatedBy,
      _count: {
        members: parseInt(row.member_count) || 0,
        tasks: 0,
      },
    }));

    res.json({
      success: true,
      data: {
        projects: projects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: "Failed to fetch projects from database",
      },
    });
  }
});

app.post("/api/v1/create-project", async (req, res) => {
  try {
    const { project_uuid, ...projectData } = req.body;

    if (project_uuid) {
      // Update existing project
      const updateQuery = `
        UPDATE projects 
        SET name = $1, description = $2, status = $3, priority = $4, 
            "projectType" = $5, "startDate" = $6, "endDate" = $7, 
            "estimatedDays" = $8, budget = $9, "projectManagerId" = $10, 
            "clientId" = $11, tags = $12, "updatedAt" = NOW(), "updatedBy" = $13
        WHERE project_uuid = $14
        RETURNING *
      `;

      const values = [
        projectData.name,
        projectData.description,
        projectData.status,
        projectData.priority,
        projectData.projectType,
        projectData.startDate,
        projectData.endDate,
        projectData.estimatedDays,
        projectData.budget,
        projectData.projectManagerId,
        projectData.clientId,
        projectData.tags || [],
        projectData.updatedBy || "system",
        project_uuid,
      ];

      const result = await pool.query(updateQuery, values);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Project not found",
          },
        });
      }

      const updatedProject = result.rows[0];
      res.json({
        success: true,
        data: {
          project: {
            id: updatedProject.id,
            project_uuid: updatedProject.project_uuid,
            name: updatedProject.name,
            description: updatedProject.description,
            status: updatedProject.status,
            priority: updatedProject.priority,
            projectType: updatedProject.projectType,
            startDate: updatedProject.startDate,
            endDate: updatedProject.endDate,
            estimatedDays: updatedProject.estimatedDays,
            budget: updatedProject.budget,
            projectManagerId: updatedProject.projectManagerId,
            clientId: updatedProject.clientId,
            tags: updatedProject.tags || [],
            createdAt: updatedProject.createdAt,
            updatedAt: updatedProject.updatedAt,
            createdBy: updatedProject.createdBy,
            updatedBy: updatedProject.updatedBy,
            _count: { members: 0, tasks: 0 },
          },
        },
      });
    } else {
      // Create new project
      const insertQuery = `
        INSERT INTO projects (name, description, status, priority, "projectType", 
                           "startDate", "endDate", "estimatedDays", budget, 
                           "projectManagerId", "clientId", tags, "createdBy", "updatedBy")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;

      const values = [
        projectData.name,
        projectData.description,
        projectData.status || "PLANNING",
        projectData.priority || "MEDIUM",
        projectData.projectType,
        projectData.startDate,
        projectData.endDate,
        projectData.estimatedDays,
        projectData.budget,
        projectData.projectManagerId,
        projectData.clientId,
        projectData.tags || [],
        projectData.createdBy || "system",
        projectData.updatedBy || "system",
      ];

      const result = await pool.query(insertQuery, values);
      const newProject = result.rows[0];

      res.status(201).json({
        success: true,
        data: {
          project: {
            id: newProject.id,
            project_uuid: newProject.project_uuid,
            name: newProject.name,
            description: newProject.description,
            status: newProject.status,
            priority: newProject.priority,
            projectType: newProject.projectType,
            startDate: newProject.startDate,
            endDate: newProject.endDate,
            estimatedDays: newProject.estimatedDays,
            budget: newProject.budget,
            projectManagerId: newProject.projectManagerId,
            clientId: newProject.clientId,
            tags: newProject.tags || [],
            createdAt: newProject.createdAt,
            updatedAt: newProject.updatedAt,
            createdBy: newProject.createdBy,
            updatedBy: newProject.updatedBy,
            _count: { members: 0, tasks: 0 },
          },
        },
      });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: "Failed to save project to database",
      },
    });
  }
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
  console.log(`📋 Projects endpoint: http://localhost:${PORT}/api/v1/project`);
  console.log(
    `📋 Get projects endpoint: http://localhost:${PORT}/api/v1/project/get-projects`
  );
});
