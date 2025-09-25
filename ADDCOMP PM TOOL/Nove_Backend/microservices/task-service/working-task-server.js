const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.TASK_SERVICE_PORT || process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Prisma Client
const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL ||
        "postgresql://sakshikalyanjadhav@localhost:5432/pm_platform",
    },
  },
});

// Helper function to generate task code
function generateTaskCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helper function to create API response
function createApiResponse(success, data = null, error = null) {
  return {
    success,
    data,
    error,
    timestamp: new Date().toISOString(),
  };
}

// Helper function to create API error
function createApiError(code, message) {
  return {
    code,
    message,
  };
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Task service is running",
    timestamp: new Date().toISOString(),
  });
});

// Create task module wise endpoint
app.post("/api/v1/task/create-task-module-wise", async (req, res) => {
  console.log("📝 [TASK SERVICE] Create task module wise request received");
  console.log("📝 [TASK SERVICE] Request body:", req.body);

  try {
    const {
      task_module_wise_uuid,
      task_module_wise_code,
      module_name,
      sub_module_name,
      module_reference_column,
      module_reference_code_or_id,
      task_name,
      description,
      task_completed_date,
      task_priority,
      assigned_to_uuid,
      assigned_to_name,
      created_by_uuid,
      created_by_name,
      task_type,
      status = "ACTIVE",
      file_upload,
      date_created,
      due_date,
      due_time,
      date_completed,
      time_completed,
    } = req.body;

    // Validate required fields
    if (!module_name || !sub_module_name || !task_name || !task_type) {
      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("VALIDATION_ERROR", "Missing required fields")
          )
        );
    }

    // Generate task code if not provided
    const finalTaskCode = task_module_wise_code || generateTaskCode();

    let taskResult;
    let isUpdate = false;

    // Check if task_module_wise_uuid is provided for update
    if (task_module_wise_uuid) {
      // Check if task exists
      const existingTask = await prisma.taskModuleWise.findUnique({
        where: { task_module_wise_uuid: task_module_wise_uuid },
      });

      if (existingTask) {
        // Update existing task
        taskResult = await prisma.taskModuleWise.update({
          where: { task_module_wise_uuid: task_module_wise_uuid },
          data: {
            task_module_wise_code: finalTaskCode,
            module_name,
            sub_module_name,
            module_reference_column: module_reference_column || null,
            module_reference_code_or_id: module_reference_code_or_id || null,
            task_name,
            description: description || null,
            task_completed_date: task_completed_date
              ? new Date(task_completed_date)
              : null,
            task_priority: task_priority || null,
            assigned_to_uuid: assigned_to_uuid || null,
            assigned_to_name: assigned_to_name || null,
            modified_by_uuid: created_by_uuid || null,
            modified_by_name: created_by_name || null,
            task_type,
            status,
            file_upload: file_upload || null,
            date_created: date_created || null,
            due_date: due_date || null,
            due_time: due_time || null,
            date_completed: date_completed || null,
            time_completed: time_completed || null,
            insert_ts: new Date(),
          },
        });
        isUpdate = true;
        console.log(
          "✅ [TASK SERVICE] Task updated successfully:",
          taskResult.task_module_wise_uuid
        );
      } else {
        // Task doesn't exist, create new one with provided UUID
        taskResult = await prisma.taskModuleWise.create({
          data: {
            task_module_wise_uuid: task_module_wise_uuid,
            task_module_wise_code: finalTaskCode,
            module_name,
            sub_module_name,
            module_reference_column: module_reference_column || null,
            module_reference_code_or_id: module_reference_code_or_id || null,
            task_name,
            description: description || null,
            task_completed_date: task_completed_date
              ? new Date(task_completed_date)
              : null,
            task_priority: task_priority || null,
            assigned_to_uuid: assigned_to_uuid || null,
            assigned_to_name: assigned_to_name || null,
            created_by_uuid: created_by_uuid || null,
            created_by_name: created_by_name || null,
            modified_by_uuid: created_by_uuid || null,
            modified_by_name: created_by_name || null,
            task_type,
            status,
            file_upload: file_upload || null,
            date_created: date_created || null,
            due_date: due_date || null,
            due_time: due_time || null,
            date_completed: date_completed || null,
            time_completed: time_completed || null,
            create_ts: new Date(),
            insert_ts: new Date(),
          },
        });
        console.log(
          "✅ [TASK SERVICE] Task created successfully with provided UUID:",
          taskResult.task_module_wise_uuid
        );
      }
    } else {
      // Create new task with generated UUID
      taskResult = await prisma.taskModuleWise.create({
        data: {
          task_module_wise_code: finalTaskCode,
          module_name,
          sub_module_name,
          module_reference_column: module_reference_column || null,
          module_reference_code_or_id: module_reference_code_or_id || null,
          task_name,
          description: description || null,
          task_completed_date: task_completed_date
            ? new Date(task_completed_date)
            : null,
          task_priority: task_priority || null,
          assigned_to_uuid: assigned_to_uuid || null,
          assigned_to_name: assigned_to_name || null,
          created_by_uuid: created_by_uuid || null,
          created_by_name: created_by_name || null,
          modified_by_uuid: created_by_uuid || null,
          modified_by_name: created_by_name || null,
          task_type,
          status,
          file_upload: file_upload || null,
          date_created: date_created || null,
          due_date: due_date || null,
          due_time: due_time || null,
          date_completed: date_completed || null,
          time_completed: time_completed || null,
          create_ts: new Date(),
          insert_ts: new Date(),
        },
      });
      console.log(
        "✅ [TASK SERVICE] Task created successfully:",
        taskResult.task_module_wise_uuid
      );
    }

    // Format response data
    const responseData = {
      task_module_wise_id: taskResult.task_module_wise_id,
      task_module_wise_unique_id: taskResult.task_module_wise_unique_id,
      task_module_wise_uuid: taskResult.task_module_wise_uuid,
      task_module_wise_code: taskResult.task_module_wise_code,
      module_name: taskResult.module_name,
      sub_module_name: taskResult.sub_module_name,
      module_reference_column: taskResult.module_reference_column,
      module_reference_code_or_id: taskResult.module_reference_code_or_id,
      task_name: taskResult.task_name,
      description: taskResult.description,
      assigned_to_uuid: taskResult.assigned_to_uuid,
      assigned_to_name: taskResult.assigned_to_name,
      created_by_uuid: taskResult.created_by_uuid,
      created_by_name: taskResult.created_by_name,
      modified_by_uuid: taskResult.modified_by_uuid,
      modified_by_name: taskResult.modified_by_name,
      task_type: taskResult.task_type,
      status: taskResult.status,
      date_created: taskResult.date_created,
      due_date: taskResult.due_date,
      due_time: taskResult.due_time,
      create_ts: taskResult.create_ts
        .toISOString()
        .replace("T", " ")
        .substring(0, 19),
      insert_ts: taskResult.insert_ts
        .toISOString()
        .replace("T", " ")
        .substring(0, 19),
    };

    res.status(isUpdate ? 200 : 201).json({
      message: isUpdate
        ? "Task module wise updated successfully"
        : "Task module wise created successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("❌ [TASK SERVICE] Create task error:", error);
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

// Create task module wise (plural route for frontend compatibility)
app.post("/api/v1/tasks/create-task-module-wise", async (req, res) => {
  console.log(
    "📝 [TASK SERVICE] Create task module wise request received (plural route)"
  );
  console.log("📝 [TASK SERVICE] Request body:", req.body);

  try {
    const {
      task_module_wise_uuid,
      task_module_wise_code,
      module_name,
      sub_module_name,
      module_reference_column,
      module_reference_code_or_id,
      task_name,
      description,
      task_completed_date,
      task_priority,
      assigned_to_uuid,
      assigned_to_name,
      created_by_uuid,
      created_by_name,
      modified_by_uuid,
      modified_by_name,
      task_type,
      status = "ACTIVE",
      file_upload,
      date_created,
      due_date,
      due_time,
      date_completed,
      time_completed,
    } = req.body;

    // Validate required fields
    if (!module_name || !sub_module_name || !task_name || !task_type) {
      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("MISSING_REQUIRED_FIELD", "Missing required fields")
          )
        );
    }

    // Generate task code if not provided
    const finalTaskCode = task_module_wise_code || generateTaskCode();

    let taskResult;
    let isUpdate = false;

    // Check if task_module_wise_uuid is provided for update
    if (task_module_wise_uuid) {
      // Check if task exists
      const existingTask = await prisma.taskModuleWise.findUnique({
        where: { task_module_wise_uuid: task_module_wise_uuid },
      });

      if (existingTask) {
        // Update existing task
        taskResult = await prisma.taskModuleWise.update({
          where: { task_module_wise_uuid: task_module_wise_uuid },
          data: {
            task_module_wise_code: finalTaskCode,
            module_name,
            sub_module_name,
            module_reference_column,
            module_reference_code_or_id,
            task_name,
            description,
            task_completed_date: task_completed_date
              ? new Date(task_completed_date)
              : null,
            task_priority,
            assigned_to_uuid,
            assigned_to_name,
            modified_by_uuid: modified_by_uuid || created_by_uuid,
            modified_by_name: modified_by_name || created_by_name,
            task_type,
            status,
            file_upload,
            date_created,
            due_date,
            due_time,
            date_completed,
            time_completed,
            insert_ts: new Date(),
          },
        });
        isUpdate = true;
        console.log(
          "✅ [TASK SERVICE] Task updated successfully:",
          taskResult.task_module_wise_uuid
        );
      } else {
        // Task doesn't exist, create new one with provided UUID
        taskResult = await prisma.taskModuleWise.create({
          data: {
            task_module_wise_uuid: task_module_wise_uuid,
            task_module_wise_code: finalTaskCode,
            module_name,
            sub_module_name,
            module_reference_column,
            module_reference_code_or_id,
            task_name,
            description,
            task_completed_date: task_completed_date
              ? new Date(task_completed_date)
              : null,
            task_priority,
            assigned_to_uuid,
            assigned_to_name,
            created_by_uuid,
            created_by_name,
            modified_by_uuid: modified_by_uuid || created_by_uuid,
            modified_by_name: modified_by_name || created_by_name,
            task_type,
            status,
            file_upload,
            date_created,
            due_date,
            due_time,
            date_completed,
            time_completed,
            create_ts: new Date(),
            insert_ts: new Date(),
          },
        });
        console.log(
          "✅ [TASK SERVICE] Task created successfully with provided UUID:",
          taskResult.task_module_wise_uuid
        );
      }
    } else {
      // Create new task with generated UUID
      taskResult = await prisma.taskModuleWise.create({
        data: {
          task_module_wise_uuid: uuidv4(),
          task_module_wise_code: finalTaskCode,
          module_name,
          sub_module_name,
          module_reference_column,
          module_reference_code_or_id,
          task_name,
          description,
          task_completed_date: task_completed_date
            ? new Date(task_completed_date)
            : null,
          task_priority,
          assigned_to_uuid,
          assigned_to_name,
          created_by_uuid,
          created_by_name,
          modified_by_uuid: modified_by_uuid || created_by_uuid,
          modified_by_name: modified_by_name || created_by_name,
          task_type,
          status,
          file_upload,
          date_created,
          due_date,
          due_time,
          date_completed,
          time_completed,
          create_ts: new Date(),
          insert_ts: new Date(),
        },
      });
      console.log(
        "✅ [TASK SERVICE] Task created successfully:",
        taskResult.task_module_wise_uuid
      );
    }

    // Format response to match expected structure
    const responseData = {
      task_module_wise_id: taskResult.task_module_wise_id,
      task_module_wise_unique_id: taskResult.task_module_wise_unique_id,
      task_module_wise_uuid: taskResult.task_module_wise_uuid,
      task_module_wise_code: taskResult.task_module_wise_code,
      module_name: taskResult.module_name,
      sub_module_name: taskResult.sub_module_name,
      module_reference_column: taskResult.module_reference_column,
      module_reference_code_or_id: taskResult.module_reference_code_or_id,
      task_name: taskResult.task_name,
      description: taskResult.description,
      assigned_to_uuid: taskResult.assigned_to_uuid,
      assigned_to_name: taskResult.assigned_to_name,
      created_by_uuid: taskResult.created_by_uuid,
      created_by_name: taskResult.created_by_name,
      task_type: taskResult.task_type,
      status: taskResult.status,
      date_created: taskResult.date_created,
      due_date: taskResult.due_date,
      due_time: taskResult.due_time,
      modified_by_uuid: taskResult.modified_by_uuid,
      modified_by_name: taskResult.modified_by_name,
      create_ts: taskResult.create_ts,
      insert_ts: taskResult.insert_ts,
    };

    res.json({
      message: isUpdate
        ? "Task module wise updated successfully"
        : "Task module wise created successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("❌ [TASK SERVICE] Create task error:", error);
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

// Get all tasks endpoint
app.get("/api/v1/task/get-tasks", async (req, res) => {
  console.log("📝 [TASK SERVICE] Get tasks request received");
  console.log("📝 [TASK SERVICE] Query params:", req.query);

  try {
    const {
      status,
      assigned_to_uuid,
      module_name,
      pageNo = 1,
      itemPerPage = 10,
    } = req.query;

    let where = {};

    if (status) {
      where.status = status;
    }

    if (assigned_to_uuid) {
      where.assigned_to_uuid = assigned_to_uuid;
    }

    if (module_name) {
      where.module_name = module_name;
    }

    const skip = (parseInt(pageNo) - 1) * parseInt(itemPerPage);
    const take = parseInt(itemPerPage);

    const [tasks, totalCount] = await Promise.all([
      prisma.taskModuleWise.findMany({
        where,
        orderBy: { create_ts: "desc" },
        skip,
        take,
      }),
      prisma.taskModuleWise.count({ where }),
    ]);

    console.log("✅ [TASK SERVICE] Returning tasks, count:", tasks.length);

    res.json({
      message: "Tasks retrieved successfully",
      totalRecords: totalCount,
      currentRecords: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("❌ [TASK SERVICE] Get tasks error:", error);
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

// Get task module wise with date filters (for frontend compatibility)
app.get("/api/v1/tasks/get-task-module-wise", async (req, res) => {
  console.log("📝 [TASK SERVICE] Get task module wise request received");
  console.log("📝 [TASK SERVICE] Query params:", req.query);
  try {
    const { from_date, to_date, pageNo = 1, itemPerPage = 11 } = req.query;

    // Build where clause
    const whereClause = {};

    // Add date filters if provided
    if (from_date || to_date) {
      whereClause.create_ts = {};
      if (from_date) {
        whereClause.create_ts.gte = new Date(from_date);
      }
      if (to_date) {
        // Add one day to make the end date inclusive
        const endDate = new Date(to_date);
        endDate.setDate(endDate.getDate() + 1);
        whereClause.create_ts.lte = endDate;
      }
    }

    // Calculate pagination
    const skip = (parseInt(pageNo) - 1) * parseInt(itemPerPage);
    const take = parseInt(itemPerPage);

    // Get total count
    const totalRecords = await prisma.taskModuleWise.count({
      where: whereClause,
    });

    // Get tasks with pagination
    const tasks = await prisma.taskModuleWise.findMany({
      where: whereClause,
      skip,
      take,
      orderBy: { create_ts: "desc" },
    });

    // Format response to match expected structure
    const formattedTasks = tasks.map((task, index) => ({
      task_module_wise_id: task.task_module_wise_id,
      task_module_wise_unique_id: index + 1, // Generate unique ID for frontend
      task_module_wise_uuid: task.task_module_wise_uuid,
      task_module_wise_code: task.task_module_wise_code,
      module_name: task.module_name,
      sub_module_name: task.sub_module_name,
      module_reference_column: task.module_reference_column,
      module_reference_code_or_id: task.module_reference_code_or_id,
      task_name: task.task_name,
      description: task.description,
      due_date: task.due_date,
      due_time: task.due_time,
      assigned_to_uuid: task.assigned_to_uuid,
      assigned_to_name: task.assigned_to_name,
      task_completed_date: task.task_completed_date,
      time_completed: task.time_completed,
      task_priority: task.task_priority,
      task_type: task.task_type,
      file_upload: task.file_upload,
      date_created: task.date_created,
      status: task.status,
      created_by_uuid: task.created_by_uuid,
      created_by_name: task.created_by_name,
      modified_by_uuid: task.modified_by_uuid,
      modified_by_name: task.modified_by_name,
      create_ts: task.create_ts,
      insert_ts: task.insert_ts,
    }));

    console.log(
      "✅ [TASK SERVICE] Task module wise retrieved successfully, count:",
      formattedTasks.length
    );

    res.json({
      message: "Task module wise Records fetched successfully!",
      totalRecords,
      currentRecords: formattedTasks.length,
      data: formattedTasks,
    });
  } catch (error) {
    console.error("❌ [TASK SERVICE] Get task module wise error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
      },
    });
  }
});

// Get task by UUID endpoint
app.get("/api/v1/task/get-task/:uuid", async (req, res) => {
  console.log("📝 [TASK SERVICE] Get task by UUID request received");
  console.log("📝 [TASK SERVICE] UUID:", req.params.uuid);

  try {
    const { uuid } = req.params;

    const task = await prisma.taskModuleWise.findUnique({
      where: { task_module_wise_uuid: uuid },
    });

    if (!task) {
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("TASK_NOT_FOUND", "Task not found")
          )
        );
    }

    console.log("✅ [TASK SERVICE] Task found:", task.task_module_wise_uuid);

    res.json({
      message: "Task retrieved successfully",
      data: task,
    });
  } catch (error) {
    console.error("❌ [TASK SERVICE] Get task error:", error);
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

// Update task endpoint
app.put("/api/v1/task/update-task/:uuid", async (req, res) => {
  console.log("📝 [TASK SERVICE] Update task request received");
  console.log("📝 [TASK SERVICE] UUID:", req.params.uuid);
  console.log("📝 [TASK SERVICE] Request body:", req.body);

  try {
    const { uuid } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.task_module_wise_uuid;
    delete updateData.task_module_wise_code;
    delete updateData.create_ts;

    const updatedTask = await prisma.taskModuleWise.update({
      where: { task_module_wise_uuid: uuid },
      data: {
        ...updateData,
        insert_ts: new Date(),
      },
    });

    console.log(
      "✅ [TASK SERVICE] Task updated successfully:",
      updatedTask.task_module_wise_uuid
    );

    res.json({
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("❌ [TASK SERVICE] Update task error:", error);
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

// Delete task endpoint
app.delete("/api/v1/task/delete-task/:uuid", async (req, res) => {
  console.log("📝 [TASK SERVICE] Delete task request received");
  console.log("📝 [TASK SERVICE] UUID:", req.params.uuid);

  try {
    const { uuid } = req.params;

    await prisma.taskModuleWise.delete({
      where: { task_module_wise_uuid: uuid },
    });

    console.log("✅ [TASK SERVICE] Task deleted successfully:", uuid);

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("❌ [TASK SERVICE] Delete task error:", error);
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

// Start server
app.listen(PORT, async () => {
  try {
    console.log(`🚀 Task service running on port ${PORT}`);
    console.log(
      `📊 Database: ${process.env.DATABASE_URL || "postgresql://sakshikalyanjadhav@localhost:5432/pm_platform"}`
    );

    // Test database connection
    await prisma.$connect();
    console.log("✅ Connected to database successfully!");
  } catch (error) {
    console.error("❌ Failed to start task service:", error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down task service...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down task service...");
  await prisma.$disconnect();
  process.exit(0);
});
