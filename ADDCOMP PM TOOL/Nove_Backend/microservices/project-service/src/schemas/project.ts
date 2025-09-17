import Joi from "joi";
import { ProjectStatus, Priority, ProjectType } from "../../../shared/types";

// Project creation schema
export const projectSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().max(1000).optional(),
  status: Joi.string()
    .valid(...Object.values(ProjectStatus))
    .default(ProjectStatus.PLANNING),
  priority: Joi.string()
    .valid(...Object.values(Priority))
    .default(Priority.MEDIUM),
  projectType: Joi.string()
    .valid(...Object.values(ProjectType))
    .required(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  estimatedDays: Joi.number().integer().min(1).optional(),
  budget: Joi.number().min(0).optional(),
  projectManagerId: Joi.string().uuid().optional(),
  clientId: Joi.string().uuid().optional(),
  googleDriveFolderId: Joi.string().optional(),
  googleCalendarId: Joi.string().optional(),
  googleChatSpaceId: Joi.string().optional(),
  tags: Joi.array().items(Joi.string().max(50)).optional(),
  metadata: Joi.object().optional(),
});

// Project update schema
export const updateProjectSchema = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  description: Joi.string().max(1000).optional(),
  status: Joi.string()
    .valid(...Object.values(ProjectStatus))
    .optional(),
  priority: Joi.string()
    .valid(...Object.values(Priority))
    .optional(),
  projectType: Joi.string()
    .valid(...Object.values(ProjectType))
    .optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  estimatedDays: Joi.number().integer().min(1).optional(),
  actualDays: Joi.number().integer().min(0).optional(),
  budget: Joi.number().min(0).optional(),
  actualCost: Joi.number().min(0).optional(),
  projectManagerId: Joi.string().uuid().optional(),
  clientId: Joi.string().uuid().optional(),
  googleDriveFolderId: Joi.string().optional(),
  googleCalendarId: Joi.string().optional(),
  googleChatSpaceId: Joi.string().optional(),
  tags: Joi.array().items(Joi.string().max(50)).optional(),
  metadata: Joi.object().optional(),
});

// Project query schema
export const projectQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string()
    .valid(...Object.values(ProjectStatus))
    .optional(),
  priority: Joi.string()
    .valid(...Object.values(Priority))
    .optional(),
  projectType: Joi.string()
    .valid(...Object.values(ProjectType))
    .optional(),
  projectManagerId: Joi.string().uuid().optional(),
  search: Joi.string().max(100).optional(),
});

// Project ID schema
export const projectIdSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

// Add member schema
export const addMemberSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  role: Joi.string().valid("MEMBER", "ADMIN").default("MEMBER"),
});
