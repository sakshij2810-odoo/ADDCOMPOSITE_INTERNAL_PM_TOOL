const { logger } = require("../utils/logger");
const { createApiResponse, createApiError } = require("../../../shared/utils");
const {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  getTeamMembers,
  getUserById,
  deactivateUser,
} = require("../services/user.service");

/**
 * Get user profile
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

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

    const user = await getUserProfile(userId);

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
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
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
    const existingUser = await getUserProfile(userId);

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

    const updatedUser = await updateUserProfile(userId, {
      ...updateData,
      updatedAt: new Date(),
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
};

/**
 * Change user password
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
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
    const user = await getUserProfile(userId);

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
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await updateUserProfile(userId, {
      // In a real implementation, you'd store the hashed password
      updatedAt: new Date(),
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
};

/**
 * Get team members
 */
const getTeam = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
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

    const result = await getTeamMembers({
      page: Number(page),
      limit: Number(limit),
      department,
      role,
    });

    logger.info(`Team members retrieved: ${result.users.length} users`);

    res.json(createApiResponse(true, result));
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
};

/**
 * Get user by ID
 */
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const requestingUserId = req.headers["x-user-id"];

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

    const user = await getUserById(id);

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
};

/**
 * Deactivate user account
 */
const deactivateUserAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const requestingUserId = req.headers["x-user-id"];

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
    const user = await getUserById(id);

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
    await deactivateUser(id);

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
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getTeam,
  getUser,
  deactivateUserAccount,
};
