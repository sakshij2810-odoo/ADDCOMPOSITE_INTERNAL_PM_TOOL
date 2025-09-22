const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

/**
 * Get user profile by ID
 */
const getUserProfile = async (userId) => {
  return await prisma.user.findUnique({
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
};

/**
 * Update user profile
 */
const updateUserProfile = async (userId, updateData) => {
  return await prisma.user.update({
    where: { id: userId },
    data: updateData,
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
};

/**
 * Get user by ID
 */
const getUserById = async (id) => {
  return await prisma.user.findUnique({
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
};

/**
 * Get team members with filtering and pagination
 */
const getTeamMembers = async (filters) => {
  const { page = 1, limit = 10, department, role } = filters;

  const skip = (page - 1) * limit;
  const where = { isActive: true };

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
      take: limit,
      orderBy: { name: "asc" },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Deactivate user account
 */
const deactivateUser = async (id) => {
  return await prisma.user.update({
    where: { id },
    data: {
      isActive: false,
      updatedAt: new Date(),
    },
  });
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
 * Create new user
 */
const createUser = async (userData) => {
  const hashedPassword = await hashPassword(userData.password);

  return await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
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
};

/**
 * Update user
 */
const updateUser = async (id, updateData) => {
  return await prisma.user.update({
    where: { id },
    data: updateData,
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
};

/**
 * Get users by department
 */
const getUsersByDepartment = async (department) => {
  return await prisma.user.findMany({
    where: {
      department,
      isActive: true,
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
      lastLoginAt: true,
    },
    orderBy: { name: "asc" },
  });
};

/**
 * Get users by role
 */
const getUsersByRole = async (role) => {
  return await prisma.user.findMany({
    where: {
      role,
      isActive: true,
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
      lastLoginAt: true,
    },
    orderBy: { name: "asc" },
  });
};

/**
 * Search users
 */
const searchUsers = async (query, filters = {}) => {
  const { page = 1, limit = 10, department, role } = filters;
  const skip = (page - 1) * limit;

  const where = {
    isActive: true,
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
      { firstName: { contains: query, mode: "insensitive" } },
      { lastName: { contains: query, mode: "insensitive" } },
    ],
  };

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
      take: limit,
      orderBy: { name: "asc" },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserById,
  getTeamMembers,
  deactivateUser,
  hashPassword,
  comparePassword,
  createUser,
  updateUser,
  getUsersByDepartment,
  getUsersByRole,
  searchUsers,
};
