const { PrismaClient } = require("@prisma/client");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { config } = require("../../../../shared/config");
const { logger } = require("../utils/logger");
const { UserRole } = require("../../../../shared/types");

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(config.google.clientId);

/**
 * Find user by email
 */
const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      user_fact_id: true,
      user_uuid: true,
      email: true,
      password_hash: true,
      status: true,
      role_value: true,
      first_name: true,
      last_name: true,
      full_name: true,
      department: true,
      mobile: true,
      branch_name: true,
      referral_code: true,
      create_ts: true,
    },
  });
};

/**
 * Find user by Google ID (if using Google OAuth)
 */
const findUserByGoogleId = async (googleId) => {
  // For now, we'll search by email since we don't have googleId field
  // In a real implementation, you'd add googleId field to the database
  return null;
};

/**
 * Create new user
 */
const createUser = async (userData) => {
  return await prisma.user.create({
    data: {
      user_fact_unique_id:
        userData.user_fact_unique_id || Math.floor(Math.random() * 10000),
      email: userData.email,
      password_hash: userData.password_hash,
      status: userData.status || "ACTIVE",
      role_value: userData.role_value || "EMPLOYEE",
      first_name: userData.first_name,
      last_name: userData.last_name,
      full_name: userData.full_name,
      department: userData.department,
      mobile: userData.mobile,
      branch_name: userData.branch_name,
      referral_code: userData.referral_code,
      created_by_name: userData.created_by_name || "System",
    },
  });
};

/**
 * Update user
 */
const updateUser = async (id, data) => {
  return await prisma.user.update({
    where: { user_uuid: id },
    data,
  });
};

/**
 * Verify Google OAuth token
 */
const verifyGoogleToken = async (googleToken) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: config.google.clientId,
    });

    return ticket.getPayload();
  } catch (error) {
    logger.error("Google OAuth verification error:", error);
    throw new Error("Invalid Google token");
  }
};

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.user_uuid,
      email: user.email,
      role: user.role_value,
    },
    process.env.JWT_SECRET ||
      "your-super-secret-jwt-key-change-this-in-production-2024",
    { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
  );
};

/**
 * Hash password
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

/**
 * Compare password
 */
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Update last login
 */
const updateLastLogin = async (userId) => {
  return await prisma.user.update({
    where: { user_uuid: userId },
    data: { insert_ts: new Date() }, // Using insert_ts as last login time
  });
};

module.exports = {
  findUserByEmail,
  findUserByGoogleId,
  createUser,
  updateUser,
  verifyGoogleToken,
  generateToken,
  hashPassword,
  comparePassword,
  updateLastLogin,
};
