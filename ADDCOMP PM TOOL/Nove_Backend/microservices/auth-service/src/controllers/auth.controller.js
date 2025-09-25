const { logger } = require("../utils/logger");
const {
  createApiResponse,
  createApiError,
} = require("../../../../shared/utils");
const { UserRole } = require("../../../../shared/types");
const {
  findUserByEmail,
  findUserByGoogleId,
  createUser,
  updateUser,
  verifyGoogleToken,
  generateToken,
  updateLastLogin,
} = require("../services/auth.service");

/**
 * User account verification
 */
const userVerification = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    // Find user by email
    const user = await findUserByEmail(email);

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

    // Verify the code (in a real implementation, you'd check against stored verification code)
    // For now, we'll just check if the user is active
    if (user.status !== "ACTIVE") {
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

    // Generate JWT token
    const token = generateToken(user);

    // Update last login
    await updateLastLogin(user.user_uuid);

    logger.info(`User verified successfully: ${user.email}`);

    res.json(
      createApiResponse(true, {
        user: {
          id: user.user_uuid,
          email: user.email,
          name: user.full_name || `${user.first_name} ${user.last_name}`,
          role: user.role_value,
          isActive: user.status === "ACTIVE",
          department: user.department,
          branch: user.branch_name,
        },
        token,
      })
    );
  } catch (error) {
    logger.error("User verification error:", error);
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
 * Login with Google OAuth or email/password
 */
const login = async (req, res) => {
  try {
    const { email, password, googleToken } = req.body;

    let user = null;

    if (googleToken) {
      // Google OAuth login
      try {
        const payload = await verifyGoogleToken(googleToken);

        // Find or create user
        user = await findUserByGoogleId(payload.sub);

        if (!user) {
          // Create new user
          user = await createUser({
            email: payload.email,
            password_hash: "google_oauth_user", // Placeholder for Google OAuth users
            first_name: payload.given_name,
            last_name: payload.family_name,
            full_name: payload.name,
            role_value: "EMPLOYEE",
            status: "ACTIVE",
            created_by_name: "Google OAuth",
          });
        }
      } catch (error) {
        logger.error("Google OAuth verification error:", error);
        return res
          .status(400)
          .json(
            createApiResponse(
              false,
              null,
              createApiError(
                "GOOGLE_AUTH_ERROR",
                "Google authentication failed"
              )
            )
          );
      }
    } else if (email && password) {
      // Email/password login
      user = await findUserByEmail(email);

      if (!user) {
        return res
          .status(401)
          .json(
            createApiResponse(
              false,
              null,
              createApiError("INVALID_CREDENTIALS", "Invalid email or password")
            )
          );
      }

      // Verify password hash
      const { comparePassword } = require("../services/auth.service");
      const isValidPassword = await comparePassword(
        password,
        user.password_hash
      );

      if (!isValidPassword) {
        return res
          .status(401)
          .json(
            createApiResponse(
              false,
              null,
              createApiError("INVALID_CREDENTIALS", "Invalid email or password")
            )
          );
      }

      // Check if user is active
      if (user.status !== "ACTIVE") {
        return res
          .status(401)
          .json(
            createApiResponse(
              false,
              null,
              createApiError("ACCOUNT_INACTIVE", "Account is inactive")
            )
          );
      }
    } else {
      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            null,
            createApiError(
              "MISSING_CREDENTIALS",
              "Email/password or Google token required"
            )
          )
        );
    }

    if (!user) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("INVALID_CREDENTIALS", "Invalid credentials")
          )
        );
    }

    // Generate JWT token
    const token = generateToken(user);

    // Update last login
    await updateLastLogin(user.user_uuid);

    logger.info(`User logged in successfully: ${user.email}`);

    res.json(
      createApiResponse(true, {
        user: {
          id: user.user_uuid,
          email: user.email,
          name: user.full_name || `${user.first_name} ${user.last_name}`,
          role: user.role_value,
          isActive: user.status === "ACTIVE",
          department: user.department,
          branch: user.branch_name,
        },
        token,
      })
    );
  } catch (error) {
    logger.error("Login error:", error);
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
 * Validate OTP for getting token
 */
const validateOtpGetToken = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await findUserByEmail(email);

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

    // In a real implementation, you'd validate the OTP against stored OTP
    // For now, we'll just check if the user is active
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

    // Generate JWT token
    const token = generateToken(user);

    // Update last login
    await updateLastLogin(user.id);

    logger.info(`OTP validated successfully for user: ${user.email}`);

    res.json(
      createApiResponse(true, {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
        },
        token,
      })
    );
  } catch (error) {
    logger.error("OTP validation error:", error);
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
 * Generate OTP for forget password
 */
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("MISSING_EMAIL", "Email is required")
          )
        );
    }

    // Find user by email
    const user = await findUserByEmail(email);

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

    // In a real implementation, you'd generate and send OTP via email/SMS
    // For now, we'll just return success
    logger.info(`Password reset OTP generated for user: ${user.email}`);

    res.json(
      createApiResponse(true, {
        message: "OTP sent to your email",
        email: user.email,
      })
    );
  } catch (error) {
    logger.error("Forget password error:", error);
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
 * Logout a user
 */
const logout = async (req, res) => {
  try {
    // In a real implementation, you'd invalidate the JWT token
    // by adding it to a blacklist or using Redis
    logger.info("User logged out successfully");

    res.json(
      createApiResponse(true, {
        message: "Logged out successfully",
      })
    );
  } catch (error) {
    logger.error("Logout error:", error);
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
  userVerification,
  login,
  validateOtpGetToken,
  forgetPassword,
  logout,
};
