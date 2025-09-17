import Joi from "joi";
import { DailyTaskStatus } from "../../../shared/types";

// Daily task creation schema
export const dailyTaskSchema = Joi.object({
  taskId: Joi.string().uuid().required(),
  date: Joi.date().required(),
  status: Joi.string()
    .valid(...Object.values(DailyTaskStatus))
    .default(DailyTaskStatus.PENDING),
  timeSpentPercentage: Joi.number().min(0).max(100).default(0),
  notes: Joi.string().max(1000).optional(),
});

// Daily task update schema
export const updateDailyTaskSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(DailyTaskStatus))
    .optional(),
  timeSpentPercentage: Joi.number().min(0).max(100).optional(),
  notes: Joi.string().max(1000).optional(),
});

// Daily task query schema
export const dailyTaskQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  date: Joi.date().optional(),
  status: Joi.string()
    .valid(...Object.values(DailyTaskStatus))
    .optional(),
  projectId: Joi.string().uuid().optional(),
});

// Daily task ID schema
export const dailyTaskIdSchema = Joi.object({
  id: Joi.string().uuid().required(),
});
