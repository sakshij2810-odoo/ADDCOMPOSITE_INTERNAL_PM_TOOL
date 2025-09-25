const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://sakshikalyanjadhav@localhost:5432/pm_platform",
    },
  },
});

async function testCreateTask() {
  try {
    console.log("🔍 Testing task creation...");

    // Generate task code
    function generateTaskCode() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = "";
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }

    const taskData = {
      task_module_wise_code: generateTaskCode(),
      module_name: "Notes",
      sub_module_name: "Notes",
      module_reference_column: "customer_policy_id",
      module_reference_code_or_id: "",
      task_name: "test task 1",
      description: "sw",
      task_completed_date: null,
      task_priority: null,
      assigned_to_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
      assigned_to_name: "Umesh Yadav",
      created_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
      created_by_name: "Umesh Yadav",
      modified_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
      modified_by_name: "Umesh Yadav",
      task_type: "Notes",
      status: "ACTIVE",
      file_upload: null,
      date_created: "09/22/2025",
      due_date: "09/27/2025",
      due_time: "12:01 AM",
      date_completed: null,
      time_completed: null,
    };

    console.log("📝 Creating task with data:", taskData);

    const newTask = await prisma.taskModuleWise.create({
      data: taskData,
    });

    console.log("✅ Task created successfully:", newTask);

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Error creating task:", error);
    await prisma.$disconnect();
  }
}

testCreateTask();
