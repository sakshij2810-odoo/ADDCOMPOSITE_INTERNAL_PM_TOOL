import express from "express";
import { validateRequest } from "../middleware/validation";
import {
  authSchema,
  loginSchema,
  otpSchema,
} from "../validation/auth.validation.js";
import {
  userVerification,
  login,
  validateOtpGetToken,
  forgetPassword,
  logout,
} from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * POST /api/v1/authentication/user-verification
 * User account verification
 */
router.post(
  "/user-verification",
  validateRequest(authSchema),
  userVerification
);

/**
 * POST /api/v1/authentication/login
 * Login with Google OAuth or email/password
 */
router.post("/login", validateRequest(loginSchema), login);

/**
 * POST /api/v1/authentication/validate-otp-get-token
 * Validate OTP for getting token
 */
router.post(
  "/validate-otp-get-token",
  validateRequest(otpSchema),
  validateOtpGetToken
);

/**
 * POST /api/v1/authentication/forget-password
 * Generate OTP for forget password
 */
router.post("/forget-password", forgetPassword);

/**
 * PUT /api/v1/authentication/logout
 * Logout a user
 */
router.put("/logout", logout);

export { router as authRoutes };
