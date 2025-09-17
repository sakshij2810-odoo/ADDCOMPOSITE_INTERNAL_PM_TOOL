import express from "express";
import { PrismaClient } from "@prisma/client";

import { config } from "../../../shared/config";
import { logger } from "../utils/logger";
import { validateRequest, validateQuery } from "../middleware/validation";
import { projectSchema, updateProjectSchema, projectQuerySchema } from "../schemas/project";
import { createApiResponse, createApiError } from "../../../shared/utils";
import { Project, ProjectStatus, Priority, ProjectType } from "../../../shared/types";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/v1/projects
 * Get all projects with filtering and pagination
 */
router.get("/", validateQuery(projectQuerySchema), async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const { page, limit, status, priority, projectType, search, projectManagerId } = req.query;

    if (!userId) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("UNAUTHORIZED", "User ID not provided")
          )
        );
    }

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};

    // Apply filters
    if (status) {
      where.status = status;
    }
    if (priority) {
      where.priority = priority;
    }
    if (projectType) {
      where.projectType = projectType;
    }
    if (projectManagerId) {
      where.projectManagerId = projectManagerId;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          projectManager: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              tasks: true,
              members: true,
            },
          },
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.project.count({ where }),
    ]);

    logger.info(`Projects retrieved: ${projects.length} projects`);

    res.json(
      createApiResponse(true, {
        projects,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      })
    );

  } catch (error) {
    logger.error("Get projects error:", error);
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

/**
 * POST /api/v1/projects
 * Create a new project
 */
router.post("/", validateRequest(projectSchema), async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const projectData = req.body;

    if (!userId) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("UNAUTHORIZED", "User ID not provided")
          )
        );
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        ...projectData,
        createdBy: userId,
        updatedBy: userId,
      },
      include: {
        projectManager: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info(`Project created: ${project.name} by ${userId}`);

    res.status(201).json(createApiResponse(true, { project }));

  } catch (error) {
    logger.error("Create project error:", error);
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

/**
 * GET /api/v1/projects/:id
 * Get project by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("UNAUTHORIZED", "User ID not provided")
          )
        );
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        projectManager: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            role: true,
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            assignedTo: true,
            dueDate: true,
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            tasks: true,
            members: true,
          },
        },
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

    logger.info(`Project retrieved: ${project.name}`);

    res.json(createApiResponse(true, { project }));

  } catch (error) {
    logger.error("Get project by ID error:", error);
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

/**
 * PUT /api/v1/projects/:id
 * Update project
 */
router.put("/:id", validateRequest(updateProjectSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"] as string;
    const updateData = req.body;

    if (!userId) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("UNAUTHORIZED", "User ID not provided")
          )
        );
    }

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
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

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...updateData,
        updatedBy: userId,
        updatedAt: new Date(),
      },
      include: {
        projectManager: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info(`Project updated: ${updatedProject.name} by ${userId}`);

    res.json(createApiResponse(true, { project: updatedProject }));

  } catch (error) {
    logger.error("Update project error:", error);
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

/**
 * DELETE /api/v1/projects/:id
 * Delete project
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("UNAUTHORIZED", "User ID not provided")
          )
        );
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id },
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

    // Soft delete by updating status to archived
    await prisma.project.update({
      where: { id },
      data: {
        status: ProjectStatus.ARCHIVED,
        updatedBy: userId,
        updatedAt: new Date(),
      },
    });

    logger.info(`Project archived: ${project.name} by ${userId}`);

    res.json(
      createApiResponse(true, {
        message: "Project archived successfully",
      })
    );

  } catch (error) {
    logger.error("Delete project error:", error);
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

/**
 * POST /api/v1/projects/:id/members
 * Add member to project
 */
router.post("/:id/members", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId: memberId } = req.body;
    const requestingUserId = req.headers["x-user-id"] as string;

    if (!requestingUserId) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("UNAUTHORIZED", "User ID not provided")
          )
        );
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id },
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

    // Add member to project
    await prisma.projectMember.create({
      data: {
        projectId: id,
        userId: memberId,
        role: "MEMBER",
        addedBy: requestingUserId,
      },
    });

    logger.info(`Member added to project: ${memberId} to ${project.name}`);

    res.json(
      createApiResponse(true, {
        message: "Member added to project successfully",
      })
    );

  } catch (error) {
    logger.error("Add member to project error:", error);
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

/**
 * DELETE /api/v1/projects/:id/members/:memberId
 * Remove member from project
 */
router.delete("/:id/members/:memberId", async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const requestingUserId = req.headers["x-user-id"] as string;

    if (!requestingUserId) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("UNAUTHORIZED", "User ID not provided")
          )
        );
    }

    // Remove member from project
    await prisma.projectMember.deleteMany({
      where: {
        projectId: id,
        userId: memberId,
      },
    });

    logger.info(`Member removed from project: ${memberId} from ${id}`);

    res.json(
      createApiResponse(true, {
        message: "Member removed from project successfully",
      })
    );

  } catch (error) {
    logger.error("Remove member from project error:", error);
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

export { router as projectRoutes };
