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
  });
};

/**
 * Find user by Google ID
 */
const findUserByGoogleId = async (googleId) => {
  return await prisma.user.findUnique({
    where: { googleId },
  });
};

/**
 * Create new user
 */
const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
  });
};

/**
 * Update user
 */
const updateUser = async (id, data) => {
  return await prisma.user.update({
    where: { id },
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
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
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
    where: { id: userId },
    data: { lastLoginAt: new Date() },
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
