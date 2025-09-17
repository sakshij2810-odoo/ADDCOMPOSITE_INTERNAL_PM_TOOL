import Joi from "joi";

// User verification schema
export const authSchema = Joi.object({
  email: Joi.string().email().required(),
  verificationCode: Joi.string().length(6).required(),
});

// Login schema
export const loginSchema = Joi.object({
  email: Joi.string().email().when("googleToken", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  password: Joi.string().min(6).when("googleToken", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  googleToken: Joi.string().optional(),
}).or("email", "googleToken");

// OTP validation schema
export const otpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

// Password reset schema
export const passwordResetSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Change password schema
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
});

// Refresh token schema
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

// Logout schema
export const logoutSchema = Joi.object({
  token: Joi.string().optional(),
});
