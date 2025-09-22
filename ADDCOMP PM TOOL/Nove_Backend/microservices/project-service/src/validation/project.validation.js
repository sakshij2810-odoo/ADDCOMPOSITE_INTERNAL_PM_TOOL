const Joi = require("joi");

/**
 * Validation schema for creating a project
 */
const projectSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Project name is required",
  }),
  description: Joi.string().optional(),
  status: Joi.string()
    .valid("PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED")
    .optional()
    .messages({
      "any.only":
        "Status must be one of: PLANNING, ACTIVE, ON_HOLD, COMPLETED, ARCHIVED",
    }),
  priority: Joi.string()
    .valid("LOW", "MEDIUM", "HIGH", "URGENT")
    .optional()
    .messages({
      "any.only": "Priority must be one of: LOW, MEDIUM, HIGH, URGENT",
    }),
  projectType: Joi.string()
    .valid("INTERNAL", "CLIENT", "RESEARCH", "MAINTENANCE")
    .optional()
    .messages({
      "any.only":
        "Project type must be one of: INTERNAL, CLIENT, RESEARCH, MAINTENANCE",
    }),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  budget: Joi.number().positive().optional().messages({
    "number.positive": "Budget must be a positive number",
  }),
  projectManagerId: Joi.string().required().messages({
    "any.required": "Project manager ID is required",
  }),
  clientId: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});

/**
 * Validation schema for updating a project
 */
const updateProjectSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  status: Joi.string()
    .valid("PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED")
    .optional()
    .messages({
      "any.only":
        "Status must be one of: PLANNING, ACTIVE, ON_HOLD, COMPLETED, ARCHIVED",
    }),
  priority: Joi.string()
    .valid("LOW", "MEDIUM", "HIGH", "URGENT")
    .optional()
    .messages({
      "any.only": "Priority must be one of: LOW, MEDIUM, HIGH, URGENT",
    }),
  projectType: Joi.string()
    .valid("INTERNAL", "CLIENT", "RESEARCH", "MAINTENANCE")
    .optional()
    .messages({
      "any.only":
        "Project type must be one of: INTERNAL, CLIENT, RESEARCH, MAINTENANCE",
    }),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  budget: Joi.number().positive().optional().messages({
    "number.positive": "Budget must be a positive number",
  }),
  projectManagerId: Joi.string().optional(),
  clientId: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});

/**
 * Validation schema for project query parameters
 */
const projectQuerySchema = Joi.object({
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
  status: Joi.string()
    .valid("PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED")
    .optional()
    .messages({
      "any.only":
        "Status must be one of: PLANNING, ACTIVE, ON_HOLD, COMPLETED, ARCHIVED",
    }),
  priority: Joi.string()
    .valid("LOW", "MEDIUM", "HIGH", "URGENT")
    .optional()
    .messages({
      "any.only": "Priority must be one of: LOW, MEDIUM, HIGH, URGENT",
    }),
  projectType: Joi.string()
    .valid("INTERNAL", "CLIENT", "RESEARCH", "MAINTENANCE")
    .optional()
    .messages({
      "any.only":
        "Project type must be one of: INTERNAL, CLIENT, RESEARCH, MAINTENANCE",
    }),
  search: Joi.string().optional(),
  projectManagerId: Joi.string().optional(),
});

/**
 * Validation schema for adding project member
 */
const addMemberSchema = Joi.object({
  userId: Joi.string().required().messages({
    "any.required": "User ID is required",
  }),
});

module.exports = {
  projectSchema,
  updateProjectSchema,
  projectQuerySchema,
  addMemberSchema,
};
