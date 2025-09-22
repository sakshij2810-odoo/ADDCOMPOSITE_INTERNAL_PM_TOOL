const { PrismaClient } = require("@prisma/client");
const { ProjectStatus } = require("../../../shared/types");

const prisma = new PrismaClient();

/**
 * Get projects with filtering and pagination
 */
const getProjects = async (filters) => {
  const {
    userId,
    page = 1,
    limit = 10,
    status,
    priority,
    projectType,
    search,
    projectManagerId,
  } = filters;

  const skip = (page - 1) * limit;
  const where = {};

  // Apply filters
  if (status) {
    where.status = status;
  }
  if (priority) {
    where.priority = priority;
  }
  if (projectType) {
    where.projectType = projectType;
  }
  if (projectManagerId) {
    where.projectManagerId = projectManagerId;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      include: {
        projectManager: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            members: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.count({ where }),
  ]);

  return {
    projects,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get project by ID
 */
const getProjectById = async (id) => {
  return await prisma.project.findUnique({
    where: { id },
    include: {
      projectManager: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
      client: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      members: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          role: true,
        },
      },
      tasks: {
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          assignedTo: true,
          dueDate: true,
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          tasks: true,
          members: true,
        },
      },
    },
  });
};

/**
 * Create a new project
 */
const createProject = async (projectData) => {
  return await prisma.project.create({
    data: projectData,
    include: {
      projectManager: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
      client: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

/**
 * Update project
 */
const updateProject = async (id, updateData) => {
  return await prisma.project.update({
    where: { id },
    data: updateData,
    include: {
      projectManager: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
      client: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

/**
 * Delete project (soft delete by archiving)
 */
const deleteProject = async (id, userId) => {
  return await prisma.project.update({
    where: { id },
    data: {
      status: ProjectStatus.ARCHIVED,
      updatedBy: userId,
      updatedAt: new Date(),
    },
  });
};

/**
 * Add member to project
 */
const addProjectMember = async (projectId, userId, addedBy) => {
  return await prisma.projectMember.create({
    data: {
      projectId,
      userId,
      role: "MEMBER",
      addedBy,
    },
  });
};

/**
 * Remove member from project
 */
const removeProjectMember = async (projectId, userId) => {
  return await prisma.projectMember.deleteMany({
    where: {
      projectId,
      userId,
    },
  });
};

/**
 * Get project members
 */
const getProjectMembers = async (projectId) => {
  return await prisma.projectMember.findMany({
    where: { projectId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          role: true,
        },
      },
    },
  });
};

/**
 * Check if user is project member
 */
const isProjectMember = async (projectId, userId) => {
  const member = await prisma.projectMember.findFirst({
    where: {
      projectId,
      userId,
    },
  });
  return !!member;
};

/**
 * Get user's projects
 */
const getUserProjects = async (userId, filters = {}) => {
  const { page = 1, limit = 10, status, priority, projectType } = filters;
  const skip = (page - 1) * limit;
  const where = {
    OR: [{ projectManagerId: userId }, { members: { some: { userId } } }],
  };

  // Apply filters
  if (status) {
    where.status = status;
  }
  if (priority) {
    where.priority = priority;
  }
  if (projectType) {
    where.projectType = projectType;
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      include: {
        projectManager: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            members: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.count({ where }),
  ]);

  return {
    projects,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  getProjectMembers,
  isProjectMember,
  getUserProjects,
};
