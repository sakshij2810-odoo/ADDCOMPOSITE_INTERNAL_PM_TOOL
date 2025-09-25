const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3004;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:8004", "http://localhost:8005"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests, please try again later",
    },
  },
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
app.use(morgan("combined"));

// Health check route
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Task service is running",
    timestamp: new Date().toISOString(),
    service: "task-service",
    port: PORT,
  });
});

// Mock tasks data
const mockTasks = [
  {
    id: "task-1",
    projectId: "project-1",
    title: "Implement user authentication",
    description: "Set up JWT-based authentication system",
    status: "IN_PROGRESS",
    priority: "HIGH",
    taskType: "DEVELOPMENT",
    assignedTo: "user-1",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    projectId: "project-1",
    title: "Design user interface",
    description: "Create wireframes and mockups for the portal",
    status: "TODO",
    priority: "MEDIUM",
    taskType: "DESIGN",
    assignedTo: "user-4",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    projectId: "project-2",
    title: "Research new technologies",
    description: "Investigate latest frameworks and tools",
    status: "COMPLETED",
    priority: "LOW",
    taskType: "RESEARCH",
    assignedTo: "user-2",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Task routes
app.get("/api/v1/tasks", (req, res) => {
  const { page = 1, limit = 10, projectId, assignedTo, status } = req.query;

  let filteredTasks = mockTasks;

  if (projectId) {
    filteredTasks = filteredTasks.filter((t) => t.projectId === projectId);
  }

  if (assignedTo) {
    filteredTasks = filteredTasks.filter((t) => t.assignedTo === assignedTo);
  }

  if (status) {
    filteredTasks = filteredTasks.filter((t) => t.status === status);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: {
      tasks: paginatedTasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredTasks.length,
        totalPages: Math.ceil(filteredTasks.length / limit),
      },
    },
  });
});

app.post("/api/v1/tasks", (req, res) => {
  const newTask = {
    id: "task-" + Date.now(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockTasks.push(newTask);

  res.status(201).json({
    success: true,
    data: { task: newTask },
  });
});

// Daily tasks routes
app.get("/api/v1/daily-tasks", (req, res) => {
  const { page = 1, limit = 10, userId, date, status } = req.query;

  let filteredDailyTasks = mockDailyTasks;

  if (userId) {
    filteredDailyTasks = filteredDailyTasks.filter(
      (dt) => dt.userId === userId
    );
  }

  if (date) {
    const targetDate = new Date(date);
    filteredDailyTasks = filteredDailyTasks.filter((dt) => {
      const taskDate = new Date(dt.date);
      return taskDate.toDateString() === targetDate.toDateString();
    });
  }

  if (status) {
    filteredDailyTasks = filteredDailyTasks.filter(
      (dt) => dt.status === status
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedDailyTasks = filteredDailyTasks.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: {
      dailyTasks: paginatedDailyTasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredDailyTasks.length,
        totalPages: Math.ceil(filteredDailyTasks.length / limit),
      },
    },
  });
});

app.post("/api/v1/daily-tasks", (req, res) => {
  const newDailyTask = {
    id: "daily-task-" + Date.now(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockDailyTasks.push(newDailyTask);

  res.status(201).json({
    success: true,
    data: { dailyTask: newDailyTask },
  });
});

app.post("/api/v1/daily-tasks/:id/start", (req, res) => {
  const { id } = req.params;
  const dailyTask = mockDailyTasks.find((dt) => dt.id === id);

  if (!dailyTask) {
    return res.status(404).json({
      success: false,
      error: {
        code: "DAILY_TASK_NOT_FOUND",
        message: "Daily task not found",
      },
    });
  }

  dailyTask.status = "IN_PROGRESS";
  dailyTask.startedAt = new Date().toISOString();
  dailyTask.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    data: {
      message: "Daily task started successfully",
    },
  });
});

app.post("/api/v1/daily-tasks/:id/complete", (req, res) => {
  const { id } = req.params;
  const dailyTask = mockDailyTasks.find((dt) => dt.id === id);

  if (!dailyTask) {
    return res.status(404).json({
      success: false,
      error: {
        code: "DAILY_TASK_NOT_FOUND",
        message: "Daily task not found",
      },
    });
  }

  dailyTask.status = "COMPLETED";
  dailyTask.completedAt = new Date().toISOString();
  dailyTask.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    data: {
      message: "Daily task completed successfully",
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
    },
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Task service running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 Tasks endpoint: http://localhost:${PORT}/api/v1/tasks`);
  console.log(
    `📅 Daily tasks endpoint: http://localhost:${PORT}/api/v1/daily-tasks`
  );
});
