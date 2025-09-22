const Joi = require("joi");

/**
 * Validation schema for creating a user
 */
const userSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  name: Joi.string().required().messages({
    "any.required": "Name is required",
  }),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  avatarUrl: Joi.string().uri().optional().messages({
    "string.uri": "Avatar URL must be a valid URL",
  }),
  role: Joi.string().valid("ADMIN", "MANAGER", "EMPLOYEE").optional().messages({
    "any.only": "Role must be one of: ADMIN, MANAGER, EMPLOYEE",
  }),
  department: Joi.string().optional(),
  position: Joi.string().optional(),
  phone: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
});

/**
 * Validation schema for updating a user
 */
const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  avatarUrl: Joi.string().uri().optional().messages({
    "string.uri": "Avatar URL must be a valid URL",
  }),
  department: Joi.string().optional(),
  position: Joi.string().optional(),
  phone: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
});

/**
 * Validation schema for change password
 */
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "any.required": "Current password is required",
  }),
  newPassword: Joi.string().min(8).required().messages({
    "string.min": "New password must be at least 8 characters long",
    "any.required": "New password is required",
  }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm password must match new password",
      "any.required": "Confirm password is required",
    }),
});

/**
 * Validation schema for team query parameters
 */
const teamQuerySchema = Joi.object({
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
  department: Joi.string().optional(),
  role: Joi.string().valid("ADMIN", "MANAGER", "EMPLOYEE").optional().messages({
    "any.only": "Role must be one of: ADMIN, MANAGER, EMPLOYEE",
  }),
});

module.exports = {
  userSchema,
  updateUserSchema,
  changePasswordSchema,
  teamQuerySchema,
};
