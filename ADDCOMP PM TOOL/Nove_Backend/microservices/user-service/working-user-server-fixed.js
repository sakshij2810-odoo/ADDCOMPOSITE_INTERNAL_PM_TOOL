const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = process.env.PORT || 3002;

// Initialize Prisma client
const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL ||
        "postgresql://postgres:password@localhost:5432/pm_platform",
    },
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Helper functions
const createApiResponse = (success, data, error = null) => ({
  success,
  data,
  error,
  timestamp: new Date().toISOString(),
});

const createApiError = (code, message) => ({
  code,
  message,
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "User service is running",
    timestamp: new Date().toISOString(),
  });
});

// Get user by query parameters (for frontend compatibility)
app.get("/api/v1/user/get-user", async (req, res) => {
  console.log("👤 [USER SERVICE] Get user request received");
  console.log("👤 [USER SERVICE] Query params:", req.query);
  console.log("👤 [USER SERVICE] Request URL:", req.originalUrl);
  console.log("👤 [USER SERVICE] Request headers:", req.headers);

  try {
    const { status, user_uuid, email, department, role } = req.query;

    let where = {};

    if (user_uuid) {
      where.user_uuid = user_uuid;
    }

    if (email) {
      where.email = email;
    }

    if (status) {
      where.status = status;
    }

    if (department) {
      where.department = department;
    }

    if (role) {
      where.role_value = role;
    }

    // If no specific user_uuid, return all users matching criteria
    if (!user_uuid && !email) {
      const users = await prisma.user.findMany({
        where,
        orderBy: { create_ts: "desc" },
      });

      console.log(
        "✅ [USER SERVICE] Returning users list, count:",
        users.length
      );
      const response = {
        message: "All User",
        totalRecords: users.length,
        currentRecords: users.length,
        data: users.map((user) => ({
          user_fact_id: user.user_fact_id,
          user_uuid: user.user_uuid,
          email: user.email,
          status: user.status,
          created_by_uuid: user.created_by_uuid,
          created_by_name: user.created_by_name,
          create_ts: user.create_ts,
          insert_ts: user.insert_ts,
          user_dim_id: user.user_dim_id,
          role_uuid: user.role_uuid,
          role_value: user.role_value,
          user_profile_id: user.user_profile_id,
          first_name: user.first_name,
          last_name: user.last_name,
          full_name: user.full_name,
          personal_email: user.personal_email,
          job_title: user.job_title,
          user_type: user.user_type,
          assigned_phone_number: user.assigned_phone_number,
          shared_email: user.shared_email,
          mobile: user.mobile,
          home_phone: user.home_phone,
          linkedin_profile: user.linkedin_profile,
          hire_date: user.hire_date,
          last_day_at_work: user.last_day_at_work,
          department: user.department,
          fax: user.fax,
          date_of_birth: user.date_of_birth,
          mother_maiden_name: user.mother_maiden_name,
          photo: user.photo,
          signature: user.signature,
          street_address: user.street_address,
          unit_or_suite: user.unit_or_suite,
          city: user.city,
          csr: user.csr,
          csr_code: user.csr_code,
          marketer: user.marketer,
          marketer_code: user.marketer_code,
          producer_one: user.producer_one,
          producer_one_code: user.producer_one_code,
          producer_two: user.producer_two,
          producer_two_code: user.producer_two_code,
          producer_three: user.producer_three,
          producer_three_code: user.producer_three_code,
          branch_code: user.branch_code,
          province_or_state: user.province_or_state,
          postal_code: user.postal_code,
          country: user.country,
          languages_known: user.languages_known,
          documents: user.documents,
          branch_name: user.branch_name,
          branch_uuid: user.branch_uuid,
          referral_code: user.referral_code,
          module_security: [], // TODO: Add module_security data
        })),
      };
      console.log("✅ [USER SERVICE] Response data:", response);
      return res.json(response);
    }

    // If specific user_uuid or email, return single user
    const user = await prisma.user.findUnique({
      where: user_uuid ? { user_uuid } : { email },
    });

    if (!user) {
      console.log("❌ [USER SERVICE] User not found for query:", where);
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("USER_NOT_FOUND", "User not found")
          )
        );
    }

    console.log("✅ [USER SERVICE] Returning single user:", user.user_uuid);
    const response = {
      message: "User Details",
      totalRecords: 1,
      currentRecords: 1,
      data: [
        {
          user_fact_id: user.user_fact_id,
          user_uuid: user.user_uuid,
          email: user.email,
          status: user.status,
          created_by_uuid: user.created_by_uuid,
          created_by_name: user.created_by_name,
          create_ts: user.create_ts,
          insert_ts: user.insert_ts,
          user_dim_id: user.user_dim_id,
          role_uuid: user.role_uuid,
          role_value: user.role_value,
          user_profile_id: user.user_profile_id,
          first_name: user.first_name,
          last_name: user.last_name,
          full_name: user.full_name,
          personal_email: user.personal_email,
          job_title: user.job_title,
          user_type: user.user_type,
          assigned_phone_number: user.assigned_phone_number,
          shared_email: user.shared_email,
          mobile: user.mobile,
          home_phone: user.home_phone,
          linkedin_profile: user.linkedin_profile,
          hire_date: user.hire_date,
          last_day_at_work: user.last_day_at_work,
          department: user.department,
          fax: user.fax,
          date_of_birth: user.date_of_birth,
          mother_maiden_name: user.mother_maiden_name,
          photo: user.photo,
          signature: user.signature,
          street_address: user.street_address,
          unit_or_suite: user.unit_or_suite,
          city: user.city,
          csr: user.csr,
          csr_code: user.csr_code,
          marketer: user.marketer,
          marketer_code: user.marketer_code,
          producer_one: user.producer_one,
          producer_one_code: user.producer_one_code,
          producer_two: user.producer_two,
          producer_two_code: user.producer_two_code,
          producer_three: user.producer_three,
          producer_three_code: user.producer_three_code,
          branch_code: user.branch_code,
          province_or_state: user.province_or_state,
          postal_code: user.postal_code,
          country: user.country,
          languages_known: user.languages_known,
          documents: user.documents,
          branch_name: user.branch_name,
          branch_uuid: user.branch_uuid,
          referral_code: user.referral_code,
          module_security: [], // TODO: Add module_security data
        },
      ],
    };
    console.log("✅ [USER SERVICE] Single user response:", response);
    res.json(response);
  } catch (error) {
    console.error("❌ [USER SERVICE] Get user error:", error);
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

// Get user by ID
app.get("/api/v1/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { user_uuid: id },
    });

    if (!user) {
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("USER_NOT_FOUND", "User not found")
          )
        );
    }

    res.json(
      createApiResponse(true, {
        user: {
          id: user.user_uuid,
          email: user.email,
          name: user.full_name || `${user.first_name} ${user.last_name}`,
          role: user.role_value,
          isActive: user.status === "ACTIVE",
          department: user.department,
          mobile: user.mobile,
          branch: user.branch_name,
          referralCode: user.referral_code,
          createdAt: user.create_ts,
        },
      })
    );
  } catch (error) {
    console.error("Get user error:", error);
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
    console.log(`🚀 User service running on port ${PORT}`);
    console.log(
      `📊 Database: ${process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/pm_platform"}`
    );

    // Test database connection
    await prisma.$connect();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down User service...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down User service...");
  await prisma.$disconnect();
  process.exit(0);
});
