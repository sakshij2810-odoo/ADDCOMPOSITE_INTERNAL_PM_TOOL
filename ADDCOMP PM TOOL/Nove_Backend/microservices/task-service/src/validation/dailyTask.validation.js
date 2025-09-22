const Joi = require("joi");

/**
 * Validation schema for creating a daily task
 */
const dailyTaskSchema = Joi.object({
  taskId: Joi.string().required().messages({
    "any.required": "Task ID is required",
  }),
  date: Joi.date().required().messages({
    "any.required": "Date is required",
    "date.base": "Date must be a valid date",
  }),
  notes: Joi.string().optional(),
  timeSpent: Joi.number().min(0).optional().messages({
    "number.min": "Time spent must be a positive number",
  }),
  status: Joi.string()
    .valid("PENDING", "IN_PROGRESS", "COMPLETED")
    .optional()
    .messages({
      "any.only": "Status must be one of: PENDING, IN_PROGRESS, COMPLETED",
    }),
});

/**
 * Validation schema for updating a daily task
 */
const updateDailyTaskSchema = Joi.object({
  notes: Joi.string().optional(),
  timeSpent: Joi.number().min(0).optional().messages({
    "number.min": "Time spent must be a positive number",
  }),
  status: Joi.string()
    .valid("PENDING", "IN_PROGRESS", "COMPLETED")
    .optional()
    .messages({
      "any.only": "Status must be one of: PENDING, IN_PROGRESS, COMPLETED",
    }),
});

/**
 * Validation schema for daily task query parameters
 */
const dailyTaskQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be an integer",
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.base": "Limit must be a number",
    "number.integer": "Limit must be an integer",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit must be at most 100",
  }),
  date: Joi.date().optional().messages({
    "date.base": "Date must be a valid date",
  }),
  status: Joi.string()
    .valid("PENDING", "IN_PROGRESS", "COMPLETED")
    .optional()
    .messages({
      "any.only": "Status must be one of: PENDING, IN_PROGRESS, COMPLETED",
    }),
  projectId: Joi.string().optional(),
});

module.exports = {
  dailyTaskSchema,
  updateDailyTaskSchema,
  dailyTaskQuerySchema,
};
