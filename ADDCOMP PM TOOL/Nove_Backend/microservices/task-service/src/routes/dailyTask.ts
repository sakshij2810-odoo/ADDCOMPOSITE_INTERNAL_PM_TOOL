import express from "express";
import { PrismaClient } from "@prisma/client";

import { config } from "../../../shared/config";
import { logger } from "../utils/logger";
import { validateRequest, validateQuery } from "../middleware/validation";
import { dailyTaskSchema, updateDailyTaskSchema, dailyTaskQuerySchema } from "../schemas/dailyTask";
import { createApiResponse, createApiError } from "../../../shared/utils";
import { DailyTask, DailyTaskStatus } from "../../../shared/types";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/v1/daily-tasks
 * Get daily tasks for a user with filtering and pagination
 */
router.get("/", validateQuery(dailyTaskQuerySchema), async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const { page, limit, date, status, projectId } = req.query;

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
    const where: any = { userId };

    // Apply filters
    if (date) {
      const targetDate = new Date(date as string);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      where.date = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }
    if (status) {
      where.status = status;
    }
    if (projectId) {
      where.task = {
        projectId: projectId as string,
      };
    }

    const [dailyTasks, total] = await Promise.all([
      prisma.dailyTask.findMany({
        where,
        include: {
          task: {
            select: {
              id: true,
              title: true,
              description: true,
              status: true,
              priority: true,
              taskType: true,
              dueDate: true,
              project: {
                select: {
                  id: true,
                  name: true,
                  status: true,
                },
              },
            },
          },
        },
        skip,
        take: Number(limit),
        orderBy: { date: "desc" },
      }),
      prisma.dailyTask.count({ where }),
    ]);

    logger.info(`Daily tasks retrieved: ${dailyTasks.length} tasks for user ${userId}`);

    res.json(
      createApiResponse(true, {
        dailyTasks,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      })
    );

  } catch (error) {
    logger.error("Get daily tasks error:", error);
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
 * POST /api/v1/daily-tasks
 * Create a new daily task
 */
router.post("/", validateRequest(dailyTaskSchema), async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const dailyTaskData = req.body;

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

    // Check if task exists and is assigned to user
    const task = await prisma.task.findFirst({
      where: {
        id: dailyTaskData.taskId,
        OR: [
          { assignedTo: userId },
          { project: { members: { some: { userId } } } },
        ],
      },
    });

    if (!task) {
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("TASK_NOT_FOUND", "Task not found or not assigned to user")
          )
        );
    }

    // Check if daily task already exists for this date
    const existingDailyTask = await prisma.dailyTask.findFirst({
      where: {
        userId,
        taskId: dailyTaskData.taskId,
        date: new Date(dailyTaskData.date),
      },
    });

    if (existingDailyTask) {
      return res
        .status(409)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("DAILY_TASK_EXISTS", "Daily task already exists for this date")
          )
        );
    }

    // Create daily task
    const dailyTask = await prisma.dailyTask.create({
      data: {
        ...dailyTaskData,
        userId,
        date: new Date(dailyTaskData.date),
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            taskType: true,
            dueDate: true,
            project: {
              select: {
                id: true,
                name: true,
                status: true,
              },
            },
          },
        },
      },
    });

    logger.info(`Daily task created: ${dailyTask.id} for user ${userId}`);

    res.status(201).json(createApiResponse(true, { dailyTask }));

  } catch (error) {
    logger.error("Create daily task error:", error);
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
 * GET /api/v1/daily-tasks/:id
 * Get daily task by ID
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

    const dailyTask = await prisma.dailyTask.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            taskType: true,
            dueDate: true,
            project: {
              select: {
                id: true,
                name: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!dailyTask) {
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("DAILY_TASK_NOT_FOUND", "Daily task not found")
          )
        );
    }

    logger.info(`Daily task retrieved: ${dailyTask.id}`);

    res.json(createApiResponse(true, { dailyTask }));

  } catch (error) {
    logger.error("Get daily task by ID error:", error);
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
 * PUT /api/v1/daily-tasks/:id
 * Update daily task
 */
router.put("/:id", validateRequest(updateDailyTaskSchema), async (req, res) => {
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

    // Check if daily task exists and belongs to user
    const existingDailyTask = await prisma.dailyTask.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingDailyTask) {
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("DAILY_TASK_NOT_FOUND", "Daily task not found")
          )
        );
    }

    // Update daily task
    const updatedDailyTask = await prisma.dailyTask.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            taskType: true,
            dueDate: true,
            project: {
              select: {
                id: true,
                name: true,
                status: true,
              },
            },
          },
        },
      },
    });

    logger.info(`Daily task updated: ${updatedDailyTask.id} by user ${userId}`);

    res.json(createApiResponse(true, { dailyTask: updatedDailyTask }));

  } catch (error) {
    logger.error("Update daily task error:", error);
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
 * DELETE /api/v1/daily-tasks/:id
 * Delete daily task
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

    // Check if daily task exists and belongs to user
    const dailyTask = await prisma.dailyTask.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!dailyTask) {
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("DAILY_TASK_NOT_FOUND", "Daily task not found")
          )
        );
    }

    // Delete daily task
    await prisma.dailyTask.delete({
      where: { id },
    });

    logger.info(`Daily task deleted: ${id} by user ${userId}`);

    res.json(
      createApiResponse(true, {
        message: "Daily task deleted successfully",
      })
    );

  } catch (error) {
    logger.error("Delete daily task error:", error);
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
 * POST /api/v1/daily-tasks/:id/start
 * Start working on a daily task
 */
router.post("/:id/start", async (req, res) => {
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

    // Update daily task status to in_progress
    const updatedDailyTask = await prisma.dailyTask.updateMany({
      where: {
        id,
        userId,
        status: DailyTaskStatus.PENDING,
      },
      data: {
        status: DailyTaskStatus.IN_PROGRESS,
        startedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    if (updatedDailyTask.count === 0) {
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("DAILY_TASK_NOT_FOUND", "Daily task not found or already started")
          )
        );
    }

    logger.info(`Daily task started: ${id} by user ${userId}`);

    res.json(
      createApiResponse(true, {
        message: "Daily task started successfully",
      })
    );

  } catch (error) {
    logger.error("Start daily task error:", error);
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
 * POST /api/v1/daily-tasks/:id/complete
 * Complete a daily task
 */
router.post("/:id/complete", async (req, res) => {
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

    // Update daily task status to completed
    const updatedDailyTask = await prisma.dailyTask.updateMany({
      where: {
        id,
        userId,
        status: DailyTaskStatus.IN_PROGRESS,
      },
      data: {
        status: DailyTaskStatus.COMPLETED,
        completedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    if (updatedDailyTask.count === 0) {
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("DAILY_TASK_NOT_FOUND", "Daily task not found or not in progress")
          )
        );
    }

    logger.info(`Daily task completed: ${id} by user ${userId}`);

    res.json(
      createApiResponse(true, {
        message: "Daily task completed successfully",
      })
    );

  } catch (error) {
    logger.error("Complete daily task error:", error);
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

export { router as dailyTaskRoutes };
