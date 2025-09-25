const { logger } = require("../utils/logger");
const { createApiResponse, createApiError } = require("../../../shared/utils");
const { DailyTaskStatus } = require("../../../shared/types");
const {
  getDailyTasks,
  getDailyTaskById,
  createDailyTask,
  updateDailyTask,
  deleteDailyTask,
  startDailyTask,
  completeDailyTask,
} = require("../services/dailyTask.service");

/**
 * Get daily tasks for a user with filtering and pagination
 */
const getAllDailyTasks = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
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

    const result = await getDailyTasks({
      userId,
      page: Number(page),
      limit: Number(limit),
      date,
      status,
      projectId,
    });

    logger.info(
      `Daily tasks retrieved: ${result.dailyTasks.length} tasks for user ${userId}`
    );

    res.json(createApiResponse(true, result));
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
};

/**
 * Create a new daily task
 */
const createNewDailyTask = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
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

    const dailyTask = await createDailyTask({
      ...dailyTaskData,
      userId,
      date: new Date(dailyTaskData.date),
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
};

/**
 * Get daily task by ID
 */
const getDailyTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"];

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

    const dailyTask = await getDailyTaskById(id, userId);

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
};

/**
 * Update daily task
 */
const updateDailyTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"];
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
    const existingDailyTask = await getDailyTaskById(id, userId);

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

    const updatedDailyTask = await updateDailyTask(id, {
      ...updateData,
      updatedAt: new Date(),
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
};

/**
 * Delete daily task
 */
const deleteDailyTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"];

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
    const dailyTask = await getDailyTaskById(id, userId);

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

    await deleteDailyTask(id);

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
};

/**
 * Start working on a daily task
 */
const startTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"];

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

    const result = await startDailyTask(id, userId);

    if (!result) {
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            null,
            createApiError(
              "DAILY_TASK_NOT_FOUND",
              "Daily task not found or already started"
            )
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
};

/**
 * Complete a daily task
 */
const completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"];

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

    const result = await completeDailyTask(id, userId);

    if (!result) {
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            null,
            createApiError(
              "DAILY_TASK_NOT_FOUND",
              "Daily task not found or not in progress"
            )
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
};

module.exports = {
  getAllDailyTasks,
  createNewDailyTask,
  getDailyTask,
  updateDailyTaskById,
  deleteDailyTaskById,
  startTask,
  completeTask,
};
