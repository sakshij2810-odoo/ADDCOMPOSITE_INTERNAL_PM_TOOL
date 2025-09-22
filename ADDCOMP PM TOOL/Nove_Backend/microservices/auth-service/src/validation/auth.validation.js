const Joi = require("joi");

/**
 * Validation schema for user verification
 */
const authSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  verificationCode: Joi.string().required().messages({
    "any.required": "Verification code is required",
  }),
});

/**
 * Validation schema for login
 */
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .when("googleToken", {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    })
    .messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required when not using Google authentication",
    }),
  password: Joi.string()
    .when("googleToken", {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    })
    .messages({
      "any.required":
        "Password is required when not using Google authentication",
    }),
  googleToken: Joi.string().optional(),
})
  .or("email", "googleToken")
  .messages({
    "object.missing": "Either email/password or Google token is required",
  });

/**
 * Validation schema for OTP validation
 */
const otpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  otp: Joi.string().required().messages({
    "any.required": "OTP is required",
  }),
});

/**
 * Validation schema for forget password
 */
const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
});

/**
 * Validation schema for change password
 */
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "any.required": "Current password is required",
  }),
  newPassword: Joi.string().min(8).required().messages({
    "string.min": "New password must be at least 8 characters long",
    "any.required": "New password is required",
  }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm password must match new password",
      "any.required": "Confirm password is required",
    }),
});

module.exports = {
  authSchema,
  loginSchema,
  otpSchema,
  forgetPasswordSchema,
  changePasswordSchema,
};
