import express from "express";
import { validateRequest, validateQuery } from "../middleware/validation";
import {
  updateUserSchema,
  changePasswordSchema,
  teamQuerySchema,
} from "../validation/user.validation.js";
import {
  getProfile,
  updateProfile,
  changePassword,
  getTeam,
  getUser,
  deactivateUserAccount,
} from "../controllers/user.controller.js";

const router = express.Router();

/**
 * GET /api/v1/user/profile
 * Get user profile
 */
router.get("/profile", getProfile);

/**
 * PUT /api/v1/user/profile
 * Update user profile
 */
router.put("/profile", validateRequest(updateUserSchema), updateProfile);

/**
 * POST /api/v1/user/change-password
 * Change user password
 */
router.post(
  "/change-password",
  validateRequest(changePasswordSchema),
  changePassword
);

/**
 * GET /api/v1/user/team
 * Get team members
 */
router.get("/team", validateQuery(teamQuerySchema), getTeam);

/**
 * GET /api/v1/user/:id
 * Get user by ID
 */
router.get("/:id", getUser);

/**
 * DELETE /api/v1/user/:id
 * Deactivate user account
 */
router.delete("/:id", deactivateUserAccount);

export { router as userRoutes };
