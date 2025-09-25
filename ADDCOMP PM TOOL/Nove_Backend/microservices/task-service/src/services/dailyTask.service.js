const { PrismaClient } = require("@prisma/client");
const { DailyTaskStatus } = require("../../../shared/types");

const prisma = new PrismaClient();

/**
 * Get daily tasks with filtering and pagination
 */
const getDailyTasks = async (filters) => {
  const { userId, page = 1, limit = 10, date, status, projectId } = filters;

  const skip = (page - 1) * limit;
  const where = { userId };

  // Apply filters
  if (date) {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
    where.date = {
      gte: startOfDay,
      lte: endOfDay,
    };
  }
  if (status) {
    where.status = status;
  }
  if (projectId) {
    where.task = {
      projectId: projectId,
    };
  }

  const [dailyTasks, total] = await Promise.all([
    prisma.dailyTask.findMany({
      where,
      include: {
        task: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            taskType: true,
            dueDate: true,
            project: {
              select: {
                id: true,
                name: true,
                status: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { date: "desc" },
    }),
    prisma.dailyTask.count({ where }),
  ]);

  return {
    dailyTasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get daily task by ID
 */
const getDailyTaskById = async (id, userId) => {
  return await prisma.dailyTask.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      task: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          taskType: true,
          dueDate: true,
          project: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },
      },
    },
  });
};

/**
 * Create a new daily task
 */
const createDailyTask = async (dailyTaskData) => {
  // Check if task exists and is assigned to user
  const task = await prisma.task.findFirst({
    where: {
      id: dailyTaskData.taskId,
      OR: [
        { assignedTo: dailyTaskData.userId },
        { project: { members: { some: { userId: dailyTaskData.userId } } } },
      ],
    },
  });

  if (!task) {
    throw new Error("Task not found or not assigned to user");
  }

  // Check if daily task already exists for this date
  const existingDailyTask = await prisma.dailyTask.findFirst({
    where: {
      userId: dailyTaskData.userId,
      taskId: dailyTaskData.taskId,
      date: dailyTaskData.date,
    },
  });

  if (existingDailyTask) {
    throw new Error("Daily task already exists for this date");
  }

  return await prisma.dailyTask.create({
    data: dailyTaskData,
    include: {
      task: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          taskType: true,
          dueDate: true,
          project: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },
      },
    },
  });
};

/**
 * Update daily task
 */
const updateDailyTask = async (id, updateData) => {
  return await prisma.dailyTask.update({
    where: { id },
    data: updateData,
    include: {
      task: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          taskType: true,
          dueDate: true,
          project: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },
      },
    },
  });
};

/**
 * Delete daily task
 */
const deleteDailyTask = async (id) => {
  return await prisma.dailyTask.delete({
    where: { id },
  });
};

/**
 * Start daily task
 */
const startDailyTask = async (id, userId) => {
  const updatedDailyTask = await prisma.dailyTask.updateMany({
    where: {
      id,
      userId,
      status: DailyTaskStatus.PENDING,
    },
    data: {
      status: DailyTaskStatus.IN_PROGRESS,
      startedAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return updatedDailyTask.count > 0;
};

/**
 * Complete daily task
 */
const completeDailyTask = async (id, userId) => {
  const updatedDailyTask = await prisma.dailyTask.updateMany({
    where: {
      id,
      userId,
      status: DailyTaskStatus.IN_PROGRESS,
    },
    data: {
      status: DailyTaskStatus.COMPLETED,
      completedAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return updatedDailyTask.count > 0;
};

/**
 * Get daily tasks for a specific date range
 */
const getDailyTasksByDateRange = async (userId, startDate, endDate) => {
  return await prisma.dailyTask.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      task: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          taskType: true,
          dueDate: true,
          project: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },
      },
    },
    orderBy: { date: "desc" },
  });
};

/**
 * Get daily task statistics for a user
 */
const getDailyTaskStats = async (userId, startDate, endDate) => {
  const where = {
    userId,
    date: {
      gte: startDate,
      lte: endDate,
    },
  };

  const [total, completed, inProgress, pending] = await Promise.all([
    prisma.dailyTask.count({ where }),
    prisma.dailyTask.count({
      where: { ...where, status: DailyTaskStatus.COMPLETED },
    }),
    prisma.dailyTask.count({
      where: { ...where, status: DailyTaskStatus.IN_PROGRESS },
    }),
    prisma.dailyTask.count({
      where: { ...where, status: DailyTaskStatus.PENDING },
    }),
  ]);

  const totalTimeSpent = await prisma.dailyTask.aggregate({
    where: { ...where, timeSpent: { not: null } },
    _sum: {
      timeSpent: true,
    },
  });

  return {
    total,
    completed,
    inProgress,
    pending,
    totalTimeSpent: totalTimeSpent._sum.timeSpent || 0,
  };
};

module.exports = {
  getDailyTasks,
  getDailyTaskById,
  createDailyTask,
  updateDailyTask,
  deleteDailyTask,
  startDailyTask,
  completeDailyTask,
  getDailyTasksByDateRange,
  getDailyTaskStats,
};
