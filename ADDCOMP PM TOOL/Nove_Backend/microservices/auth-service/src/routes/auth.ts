import express from "express";
import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { config } from "../../../../shared/config";
import { logger } from "../utils/logger";
import { validateRequest } from "../middleware/validation";
import { authSchema, loginSchema, otpSchema } from "../schemas/auth";
import { createApiResponse, createApiError } from "../../../../shared/utils";
import { User, UserRole } from "../../../../shared/types";

const router = express.Router();
const prisma = new PrismaClient();
const googleClient = new OAuth2Client(config.google.clientId);

/**
 * POST /api/v1/authentication/user-verification
 * User account verification
 */
router.post(
  "/user-verification",
  validateRequest(authSchema),
  async (req, res) => {
    try {
      const { email, verificationCode } = req.body;

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
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

      // Verify the code (in a real implementation, you'd check against stored verification code)
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
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      logger.info(`User verified successfully: ${user.email}`);

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
  }
);

/**
 * POST /api/v1/authentication/login
 * Login with Google OAuth or email/password
 */
router.post("/login", validateRequest(loginSchema), async (req, res) => {
  try {
    const { email, password, googleToken } = req.body;

    let user: User | null = null;

    if (googleToken) {
      // Google OAuth login
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: googleToken,
          audience: config.google.clientId,
        });

        const payload = ticket.getPayload();
        if (!payload) {
          return res
            .status(400)
            .json(
              createApiResponse(
                false,
                null,
                createApiError("INVALID_GOOGLE_TOKEN", "Invalid Google token")
              )
            );
        }

        // Find or create user
        user = await prisma.user.findUnique({
          where: { googleId: payload.sub },
        });

        if (!user) {
          // Create new user
          user = await prisma.user.create({
            data: {
              googleId: payload.sub!,
              email: payload.email!,
              name: payload.name!,
              firstName: payload.given_name,
              lastName: payload.family_name,
              avatarUrl: payload.picture,
              role: UserRole.EMPLOYEE,
              isActive: true,
            },
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
      user = await prisma.user.findUnique({
        where: { email },
      });

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

      // In a real implementation, you'd verify the password hash
      // For now, we'll just check if the user exists and is active
      if (!user.isActive) {
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
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    logger.info(`User logged in successfully: ${user.email}`);

    res.json(
      createApiResponse(true, {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          avatarUrl: user.avatarUrl,
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
});

/**
 * POST /api/v1/authentication/validate-otp-get-token
 * Validate OTP for getting token
 */
router.post(
  "/validate-otp-get-token",
  validateRequest(otpSchema),
  async (req, res) => {
    try {
      const { email, otp } = req.body;

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
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
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

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
  }
);

/**
 * POST /api/v1/authentication/forget-password
 * Generate OTP for forget password
 */
router.post("/forget-password", async (req, res) => {
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
    const user = await prisma.user.findUnique({
      where: { email },
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
});

/**
 * PUT /api/v1/authentication/logout
 * Logout a user
 */
router.put("/logout", async (req, res) => {
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
});

export { router as authRoutes };
