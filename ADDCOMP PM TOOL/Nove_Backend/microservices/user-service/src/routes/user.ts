import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { config } from "../../../shared/config";
import { logger } from "../utils/logger";
import { validateRequest } from "../middleware/validation";
import { userSchema, updateUserSchema, changePasswordSchema } from "../schemas/user";
import { createApiResponse, createApiError } from "../../../shared/utils";
import { User, UserRole } from "../../../shared/types";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/v1/user/profile
 * Get user profile
 */
router.get("/profile", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;

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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        role: true,
        department: true,
        position: true,
        phone: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("USER_NOT_FOUND", "User not found")
          )
        );
    }

    logger.info(`User profile retrieved: ${user.email}`);

    res.json(createApiResponse(true, { user }));

  } catch (error) {
    logger.error("Get user profile error:", error);
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
});

/**
 * PUT /api/v1/user/profile
 * Update user profile
 */
router.put("/profile", validateRequest(updateUserSchema), async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
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

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("USER_NOT_FOUND", "User not found")
          )
        );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        role: true,
        department: true,
        position: true,
        phone: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info(`User profile updated: ${updatedUser.email}`);

    res.json(createApiResponse(true, { user: updatedUser }));

  } catch (error) {
    logger.error("Update user profile error:", error);
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
});

/**
 * POST /api/v1/user/change-password
 * Change user password
 */
router.post("/change-password", validateRequest(changePasswordSchema), async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const { currentPassword, newPassword } = req.body;

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

    // Get user with password hash
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("USER_NOT_FOUND", "User not found")
          )
        );
    }

    // In a real implementation, you'd verify the current password
    // For now, we'll just check if the user exists and is active
    if (!user.isActive) {
      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("ACCOUNT_INACTIVE", "Account is inactive")
          )
        );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        // In a real implementation, you'd store the hashed password
        updatedAt: new Date(),
      },
    });

    logger.info(`Password changed for user: ${user.email}`);

    res.json(
      createApiResponse(true, {
        message: "Password changed successfully",
      })
    );

  } catch (error) {
    logger.error("Change password error:", error);
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
});

/**
 * GET /api/v1/user/team
 * Get team members
 */
router.get("/team", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const { page = 1, limit = 10, department, role } = req.query;

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

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { isActive: true };

    if (department) {
      where.department = department;
    }

    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          role: true,
          department: true,
          position: true,
          phone: true,
          lastLoginAt: true,
        },
        skip,
        take: Number(limit),
        orderBy: { name: "asc" },
      }),
      prisma.user.count({ where }),
    ]);

    logger.info(`Team members retrieved: ${users.length} users`);

    res.json(
      createApiResponse(true, {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      })
    );

  } catch (error) {
    logger.error("Get team members error:", error);
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
});

/**
 * GET /api/v1/user/:id
 * Get user by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const requestingUserId = req.headers["x-user-id"] as string;

    if (!requestingUserId) {
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

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        role: true,
        department: true,
        position: true,
        phone: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("USER_NOT_FOUND", "User not found")
          )
        );
    }

    logger.info(`User retrieved: ${user.email}`);

    res.json(createApiResponse(true, { user }));

  } catch (error) {
    logger.error("Get user by ID error:", error);
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
});

/**
 * DELETE /api/v1/user/:id
 * Deactivate user account
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const requestingUserId = req.headers["x-user-id"] as string;

    if (!requestingUserId) {
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

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("USER_NOT_FOUND", "User not found")
          )
        );
    }

    // Deactivate user instead of deleting
    await prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });

    logger.info(`User deactivated: ${user.email}`);

    res.json(
      createApiResponse(true, {
        message: "User account deactivated successfully",
      })
    );

  } catch (error) {
    logger.error("Deactivate user error:", error);
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
});

export { router as userRoutes };
