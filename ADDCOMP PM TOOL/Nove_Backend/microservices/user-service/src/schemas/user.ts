import Joi from "joi";
import { UserRole } from "../../../shared/types";

// User creation schema
export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(100).required(),
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  avatarUrl: Joi.string().uri().optional(),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .required(),
  department: Joi.string().max(100).optional(),
  position: Joi.string().max(100).optional(),
  phone: Joi.string().max(20).optional(),
  password: Joi.string().min(8).required(),
});

// User update schema
export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  avatarUrl: Joi.string().uri().optional(),
  department: Joi.string().max(100).optional(),
  position: Joi.string().max(100).optional(),
  phone: Joi.string().max(20).optional(),
});

// Change password schema
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
});

// User query schema
export const userQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  department: Joi.string().optional(),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .optional(),
  search: Joi.string().max(100).optional(),
});

// User ID schema
export const userIdSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

// Get users query schema for Nova World Group format
export const getUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid("ACTIVE", "INACTIVE", "PENDING").optional(),
  role: Joi.string().optional(),
  search: Joi.string().max(100).optional(),
});
