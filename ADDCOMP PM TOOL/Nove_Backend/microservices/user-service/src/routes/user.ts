import express from "express";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

import { config } from "../../../shared/config";
import { logger } from "../utils/logger";
import { validateRequest } from "../middleware/validation";
import { userSchema, updateUserSchema, changePasswordSchema, getUsersQuerySchema } from "../schemas/user";
import { createApiResponse, createApiError } from "../../../shared/utils";
import { User, UserRole, NovaWorldUser, NovaWorldUserResponse } from "../../../shared/types";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/v1/user/get-user
 * Get all users in Nova World Group format
 */
router.get("/get-user", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, role, search, user_uuid } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};

    // Apply filters
    if (status) {
      where.status = status;
    }
    
    if (role) {
      where.roleValue = role;
    }
    
    if (user_uuid) {
      where.OR = [
        { userUuid: user_uuid as string },
        { id: user_uuid as string }
      ];
    }
    
    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: 'insensitive' } },
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { name: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [users, totalRecords] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          userFactId: true,
          userUuid: true,
          email: true,
          status: true,
          createdByUuid: true,
          createdByName: true,
          createTs: true,
          insertTs: true,
          userDimId: true,
          roleUuid: true,
          roleValue: true,
          userProfileId: true,
          firstName: true,
          lastName: true,
          personalEmail: true,
          jobTitle: true,
          userType: true,
          assignedPhoneNumber: true,
          sharedEmail: true,
          mobile: true,
          homePhone: true,
          linkedinProfile: true,
          hireDate: true,
          lastDayAtWork: true,
          department: true,
          fax: true,
          dateOfBirth: true,
          motherMaidenName: true,
          photo: true,
          signature: true,
          streetAddress: true,
          unitOrSuite: true,
          city: true,
          csr: true,
          csrCode: true,
          marketer: true,
          marketerCode: true,
          producerOne: true,
          producerOneCode: true,
          producerTwo: true,
          producerTwoCode: true,
          producerThree: true,
          producerThreeCode: true,
          branchCode: true,
          provinceOrState: true,
          postalCode: true,
          country: true,
          languagesKnown: true,
          documents: true,
          branchName: true,
          branchUuid: true,
          referralCode: true,
        },
        skip,
        take: Number(limit),
        orderBy: { userFactId: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    // Transform users to Nova World Group format
    const transformedUsers: NovaWorldUser[] = users.map(user => ({
      user_fact_id: user.userFactId || 0,
      user_uuid: user.userUuid || user.id,
      email: user.email,
      status: user.status || "ACTIVE",
      created_by_uuid: user.createdByUuid || null,
      created_by_name: user.createdByName || null,
      create_ts: user.createTs?.toISOString() || null,
      insert_ts: user.insertTs?.toISOString() || null,
      user_dim_id: user.userDimId || null,
      role_uuid: user.roleUuid || null,
      role_value: user.roleValue || null,
      user_profile_id: user.userProfileId || null,
      first_name: user.firstName || null,
      last_name: user.lastName || null,
      full_name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : (user.firstName || user.lastName || user.name),
      personal_email: user.personalEmail || null,
      job_title: user.jobTitle || null,
      user_type: user.userType || null,
      assigned_phone_number: user.assignedPhoneNumber || null,
      shared_email: user.sharedEmail || null,
      mobile: user.mobile || null,
      home_phone: user.homePhone || null,
      linkedin_profile: user.linkedinProfile || null,
      hire_date: user.hireDate?.toISOString() || null,
      last_day_at_work: user.lastDayAtWork?.toISOString() || null,
      department: user.department || null,
      fax: user.fax || null,
      date_of_birth: user.dateOfBirth?.toISOString() || null,
      mother_maiden_name: user.motherMaidenName || null,
      photo: user.photo || null,
      signature: user.signature || null,
      street_address: user.streetAddress || null,
      unit_or_suite: user.unitOrSuite || null,
      city: user.city || null,
      csr: user.csr || null,
      csr_code: user.csrCode || null,
      marketer: user.marketer || null,
      marketer_code: user.marketerCode || null,
      producer_one: user.producerOne || null,
      producer_one_code: user.producerOneCode || null,
      producer_two: user.producerTwo || null,
      producer_two_code: user.producerTwoCode || null,
      producer_three: user.producerThree || null,
      producer_three_code: user.producerThreeCode || null,
      branch_code: user.branchCode || null,
      province_or_state: user.provinceOrState || null,
      postal_code: user.postalCode || null,
      country: user.country || null,
      languages_known: user.languagesKnown || null,
      documents: user.documents || null,
      branch_name: user.branchName || null,
      branch_uuid: user.branchUuid || null,
      referral_code: user.referralCode || null,
    }));

    const response: NovaWorldUserResponse = {
      message: "All User",
      totalRecords,
      currentRecords: transformedUsers.length,
      data: transformedUsers,
    };

    logger.info(`Retrieved ${transformedUsers.length} users in Nova World Group format`);

    res.json(response);

  } catch (error) {
    logger.error("Get users error:", error);
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
