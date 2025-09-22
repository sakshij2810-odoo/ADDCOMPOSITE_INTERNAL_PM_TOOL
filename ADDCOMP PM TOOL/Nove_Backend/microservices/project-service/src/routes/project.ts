import express from "express";
import { validateRequest, validateQuery } from "../middleware/validation";
import {
  projectSchema,
  updateProjectSchema,
  projectQuerySchema,
  addMemberSchema,
} from "../validation/project.validation.js";
import {
  getAllProjects,
  createNewProject,
  getProject,
  updateProjectById,
  deleteProjectById,
  addMember,
  removeMember,
} from "../controllers/project.controller.js";

const router = express.Router();

/**
 * GET /api/v1/projects
 * Get all projects with filtering and pagination
 */
router.get("/", validateQuery(projectQuerySchema), getAllProjects);

/**
 * POST /api/v1/projects
 * Create a new project
 */
router.post("/", validateRequest(projectSchema), createNewProject);

/**
 * GET /api/v1/projects/:id
 * Get project by ID
 */
router.get("/:id", getProject);

/**
 * PUT /api/v1/projects/:id
 * Update project
 */
router.put("/:id", validateRequest(updateProjectSchema), updateProjectById);

/**
 * DELETE /api/v1/projects/:id
 * Delete project
 */
router.delete("/:id", deleteProjectById);

/**
 * POST /api/v1/projects/:id/members
 * Add member to project
 */
router.post("/:id/members", validateRequest(addMemberSchema), addMember);

/**
 * DELETE /api/v1/projects/:id/members/:memberId
 * Remove member from project
 */
router.delete("/:id/members/:memberId", removeMember);

export { router as projectRoutes };
