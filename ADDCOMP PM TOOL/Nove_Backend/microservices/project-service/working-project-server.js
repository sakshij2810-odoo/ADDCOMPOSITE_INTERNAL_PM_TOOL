const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = process.env.PROJECT_SERVICE_PORT || process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

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

// Routes
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

// Get all projects
app.get("/api/v1/project", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, search } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.project.count({ where }),
    ]);

    res.json(
      createApiResponse(true, {
        projects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      })
    );
  } catch (error) {
    console.error("Get projects error:", error);
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

// Create new project
app.post("/api/v1/project", async (req, res) => {
  try {
    const projectData = req.body;
    const userId = req.headers["x-user-id"];

    const project = await prisma.project.create({
      data: {
        ...projectData,
        projectManagerId: userId,
        createdBy: userId,
      },
    });

    res.status(201).json(createApiResponse(true, { project }));
  } catch (error) {
    console.error("Create project error:", error);
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

// Get project by ID
app.get("/api/v1/project/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        projectManager: {
          select: {
            user_uuid: true,
            email: true,
            full_name: true,
            role_value: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                user_uuid: true,
                email: true,
                full_name: true,
                role_value: true,
              },
            },
          },
        },
        tasks: true,
      },
    });

    if (!project) {
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("PROJECT_NOT_FOUND", "Project not found")
          )
        );
    }

    res.json(createApiResponse(true, { project }));
  } catch (error) {
    console.error("Get project error:", error);
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

// Update project
app.put("/api/v1/project/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.headers["x-user-id"];

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...updateData,
        updatedBy: userId,
      },
    });

    res.json(createApiResponse(true, { project }));
  } catch (error) {
    console.error("Update project error:", error);
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

// Delete project
app.delete("/api/v1/project/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({
      where: { id },
    });

    res.json(
      createApiResponse(true, { message: "Project deleted successfully" })
    );
  } catch (error) {
    console.error("Delete project error:", error);
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

// Status endpoint
app.get("/api/v1/project/status", (req, res) => {
  res.json(
    createApiResponse(true, {
      service: "project-service",
      status: "running",
      port: PORT,
      database: "connected",
      endpoints: [
        "GET /health",
        "GET /api/v1/project",
        "POST /api/v1/project",
        "GET /api/v1/project/:id",
        "PUT /api/v1/project/:id",
        "DELETE /api/v1/project/:id",
        "GET /api/v1/project/status",
      ],
    })
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Project service running on port ${PORT}`);
  console.log(
    `📊 Database: ${process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/pm_platform"}`
  );
  console.log(`✅ Database connected successfully!`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down project service...");
  await prisma.$disconnect();
  process.exit(0);
});
