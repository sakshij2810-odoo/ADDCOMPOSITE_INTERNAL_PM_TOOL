import express from "express";
import { validateRequest, validateQuery } from "../middleware/validation";
import {
  dailyTaskSchema,
  updateDailyTaskSchema,
  dailyTaskQuerySchema,
} from "../validation/dailyTask.validation.js";
import {
  getAllDailyTasks,
  createNewDailyTask,
  getDailyTask,
  updateDailyTaskById,
  deleteDailyTaskById,
  startTask,
  completeTask,
} from "../controllers/dailyTask.controller.js";

const router = express.Router();

/**
 * GET /api/v1/daily-tasks
 * Get daily tasks for a user with filtering and pagination
 */
router.get("/", validateQuery(dailyTaskQuerySchema), getAllDailyTasks);

/**
 * POST /api/v1/daily-tasks
 * Create a new daily task
 */
router.post("/", validateRequest(dailyTaskSchema), createNewDailyTask);

/**
 * GET /api/v1/daily-tasks/:id
 * Get daily task by ID
 */
router.get("/:id", getDailyTask);

/**
 * PUT /api/v1/daily-tasks/:id
 * Update daily task
 */
router.put("/:id", validateRequest(updateDailyTaskSchema), updateDailyTaskById);

/**
 * DELETE /api/v1/daily-tasks/:id
 * Delete daily task
 */
router.delete("/:id", deleteDailyTaskById);

/**
 * POST /api/v1/daily-tasks/:id/start
 * Start working on a daily task
 */
router.post("/:id/start", startTask);

/**
 * POST /api/v1/daily-tasks/:id/complete
 * Complete a daily task
 */
router.post("/:id/complete", completeTask);

export { router as dailyTaskRoutes };
