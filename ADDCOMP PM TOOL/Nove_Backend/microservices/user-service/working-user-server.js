const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = process.env.USER_SERVICE_PORT || process.env.PORT || 3002;

// Initialize Prisma client
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
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

      // Get module security for each user
      const usersWithModuleSecurity = await Promise.all(
        users.map(async (user) => {
          let moduleSecurity = [];

          if (user.role_uuid) {
            try {
              moduleSecurity = await prisma.moduleSecurity.findMany({
                where: {
                  role_uuid: user.role_uuid,
                  status: "ACTIVE",
                },
                select: {
                  role_module_id: true,
                  role_module_unique_id: true,
                  role_module_uuid: true,
                  module_uuid: true,
                  role_uuid: true,
                  show_module: true,
                  view_access: true,
                  edit_access: true,
                  send_sms: true,
                  send_mail: true,
                  send_whatsapp: true,
                  send_call: true,
                  filter_values: true,
                  status: true,
                  created_by_uuid: true,
                  created_by_name: true,
                  modified_by_uuid: true,
                  modified_by_name: true,
                  create_ts: true,
                  insert_ts: true,
                  module_name: true,
                  submodule_name: true,
                  table_name: true,
                  module_key: true,
                },
              });
              console.log(
                `👤 [USER SERVICE] Found ${moduleSecurity.length} module security records for user ${user.email}`
              );
            } catch (error) {
              console.error(
                `❌ [USER SERVICE] Error fetching module security for user ${user.email}:`,
                error
              );
              moduleSecurity = [];
            }
          }

          return {
            ...user,
            module_security: moduleSecurity,
          };
        })
      );

      const response = {
        message: "All User",
        totalRecords: usersWithModuleSecurity.length,
        currentRecords: usersWithModuleSecurity.length,
        data: usersWithModuleSecurity.map((user) => ({
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
          module_security: user.module_security,
        })),
      };
      console.log(
        "✅ [USER SERVICE] Response data with module security:",
        response
      );
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

    // Get module security for the user
    let moduleSecurity = [];
    if (user.role_uuid) {
      try {
        moduleSecurity = await prisma.moduleSecurity.findMany({
          where: {
            role_uuid: user.role_uuid,
            status: "ACTIVE",
          },
          select: {
            role_module_id: true,
            role_module_unique_id: true,
            role_module_uuid: true,
            module_uuid: true,
            role_uuid: true,
            show_module: true,
            view_access: true,
            edit_access: true,
            send_sms: true,
            send_mail: true,
            send_whatsapp: true,
            send_call: true,
            filter_values: true,
            status: true,
            created_by_uuid: true,
            created_by_name: true,
            modified_by_uuid: true,
            modified_by_name: true,
            create_ts: true,
            insert_ts: true,
            module_name: true,
            submodule_name: true,
            table_name: true,
            module_key: true,
          },
        });
        console.log(
          `👤 [USER SERVICE] Found ${moduleSecurity.length} module security records for user ${user.email}`
        );
      } catch (error) {
        console.error(
          `❌ [USER SERVICE] Error fetching module security for user ${user.email}:`,
          error
        );
        moduleSecurity = [];
      }
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
          module_security: moduleSecurity,
        },
      ],
    };
    console.log(
      "✅ [USER SERVICE] Single user response with module security:",
      response
    );
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
// Get user profile by UUID (enhanced for profile page)
app.get("/api/v1/user/:id", async (req, res) => {
  console.log("👤 [USER SERVICE] Get user profile request received");
  console.log("👤 [USER SERVICE] User UUID:", req.params.id);
  console.log("👤 [USER SERVICE] Request headers:", req.headers);
  console.log("👤 [USER SERVICE] Request URL:", req.url);
  console.log("👤 [USER SERVICE] Request method:", req.method);

  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { user_uuid: id },
      select: {
        user_fact_id: true,
        user_uuid: true,
        email: true,
        status: true,
        created_by_uuid: true,
        created_by_name: true,
        create_ts: true,
        insert_ts: true,
        user_dim_id: true,
        role_uuid: true,
        role_value: true,
        user_profile_id: true,
        first_name: true,
        last_name: true,
        full_name: true,
        personal_email: true,
        job_title: true,
        user_type: true,
        assigned_phone_number: true,
        shared_email: true,
        mobile: true,
        home_phone: true,
        linkedin_profile: true,
        hire_date: true,
        last_day_at_work: true,
        department: true,
        fax: true,
        date_of_birth: true,
        mother_maiden_name: true,
        photo: true,
        signature: true,
        street_address: true,
        unit_or_suite: true,
        city: true,
        csr: true,
        csr_code: true,
        marketer: true,
        marketer_code: true,
        producer_one: true,
        producer_one_code: true,
        producer_two: true,
        producer_two_code: true,
        producer_three: true,
        producer_three_code: true,
        branch_code: true,
        province_or_state: true,
        postal_code: true,
        country: true,
        languages_known: true,
        documents: true,
        branch_name: true,
        branch_uuid: true,
        referral_code: true,
      },
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

    // Get module security for the user
    let moduleSecurity = [];
    if (user.role_uuid) {
      try {
        moduleSecurity = await prisma.moduleSecurity.findMany({
          where: {
            role_uuid: user.role_uuid,
            status: "ACTIVE",
          },
          select: {
            role_module_id: true,
            role_module_unique_id: true,
            role_module_uuid: true,
            module_uuid: true,
            role_uuid: true,
            show_module: true,
            view_access: true,
            edit_access: true,
            send_sms: true,
            send_mail: true,
            send_whatsapp: true,
            send_call: true,
            filter_values: true,
            status: true,
            created_by_uuid: true,
            created_by_name: true,
            modified_by_uuid: true,
            modified_by_name: true,
            create_ts: true,
            insert_ts: true,
            module_name: true,
            submodule_name: true,
            table_name: true,
            module_key: true,
          },
        });
        console.log(
          `Found ${moduleSecurity.length} module security records for user ${user.email}`
        );
      } catch (error) {
        console.error(
          `Error fetching module security for user ${user.email}:`,
          error
        );
        moduleSecurity = [];
      }
    }

    const response = {
      message: "User Profile Details",
      data: {
        user: {
          ...user,
          module_security: moduleSecurity,
        },
      },
    };

    console.log(`✅ [USER SERVICE] Returning user profile for: ${user.email}`);
    res.json(response);
  } catch (error) {
    console.error("❌ [USER SERVICE] Get user profile error:", error);
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

// Update user profile by UUID
app.put("/api/v1/user/:id", async (req, res) => {
  console.log("👤 [USER SERVICE] Update user profile request received");
  console.log("👤 [USER SERVICE] User UUID:", req.params.id);
  console.log("👤 [USER SERVICE] Update data:", req.body);

  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { user_uuid: id },
    });

    if (!existingUser) {
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

    // Prepare update data (exclude sensitive fields and system fields)
    const allowedFields = [
      "first_name",
      "last_name",
      "full_name",
      "personal_email",
      "job_title",
      "user_type",
      "assigned_phone_number",
      "shared_email",
      "mobile",
      "home_phone",
      "linkedin_profile",
      "hire_date",
      "last_day_at_work",
      "department",
      "fax",
      "date_of_birth",
      "mother_maiden_name",
      "photo",
      "signature",
      "street_address",
      "unit_or_suite",
      "city",
      "csr",
      "csr_code",
      "marketer",
      "marketer_code",
      "producer_one",
      "producer_one_code",
      "producer_two",
      "producer_two_code",
      "producer_three",
      "producer_three_code",
      "branch_code",
      "province_or_state",
      "postal_code",
      "country",
      "languages_known",
      "documents",
      "status",
    ];

    const filteredUpdateData = {};
    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        filteredUpdateData[key] = updateData[key];
      }
    });

    // Add update timestamp
    filteredUpdateData.insert_ts = new Date();

    // Update user
    const updatedUser = await prisma.user.update({
      where: { user_uuid: id },
      data: filteredUpdateData,
      select: {
        user_fact_id: true,
        user_uuid: true,
        email: true,
        status: true,
        created_by_uuid: true,
        created_by_name: true,
        create_ts: true,
        insert_ts: true,
        user_dim_id: true,
        role_uuid: true,
        role_value: true,
        user_profile_id: true,
        first_name: true,
        last_name: true,
        full_name: true,
        personal_email: true,
        job_title: true,
        user_type: true,
        assigned_phone_number: true,
        shared_email: true,
        mobile: true,
        home_phone: true,
        linkedin_profile: true,
        hire_date: true,
        last_day_at_work: true,
        department: true,
        fax: true,
        date_of_birth: true,
        mother_maiden_name: true,
        photo: true,
        signature: true,
        street_address: true,
        unit_or_suite: true,
        city: true,
        csr: true,
        csr_code: true,
        marketer: true,
        marketer_code: true,
        producer_one: true,
        producer_one_code: true,
        producer_two: true,
        producer_two_code: true,
        producer_three: true,
        producer_three_code: true,
        branch_code: true,
        province_or_state: true,
        postal_code: true,
        country: true,
        languages_known: true,
        documents: true,
        branch_name: true,
        branch_uuid: true,
        referral_code: true,
      },
    });

    const response = {
      message: "User profile updated successfully",
      data: {
        user: updatedUser,
      },
    };

    console.log(
      `✅ [USER SERVICE] User profile updated for: ${updatedUser.email}`
    );
    res.json(response);
  } catch (error) {
    console.error("❌ [USER SERVICE] Update user profile error:", error);
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

// Update user profile (POST endpoint for frontend compatibility)
app.post("/api/v1/user/update-profile", async (req, res) => {
  console.log("👤 [USER SERVICE] Update user profile (POST) request received");
  console.log("👤 [USER SERVICE] Request body:", req.body);

  try {
    const { user_uuid, ...updateData } = req.body;

    if (!user_uuid) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          message: "user_uuid is required",
        },
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { user_uuid: user_uuid },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        data: null,
        error: {
          code: "USER_NOT_FOUND",
          message: "User not found",
        },
      });
    }

    // Prepare update data (exclude sensitive fields and system fields)
    const allowedFields = [
      "first_name",
      "last_name",
      "full_name",
      "personal_email",
      "job_title",
      "user_type",
      "assigned_phone_number",
      "shared_email",
      "mobile",
      "home_phone",
      "linkedin_profile",
      "hire_date",
      "last_day_at_work",
      "department",
      "fax",
      "date_of_birth",
      "mother_maiden_name",
      "photo",
      "signature",
      "street_address",
      "unit_or_suite",
      "city",
      "csr",
      "csr_code",
      "marketer",
      "marketer_code",
      "producer_one",
      "producer_one_code",
      "producer_two",
      "producer_two_code",
      "producer_three",
      "producer_three_code",
      "branch_code",
      "province_or_state",
      "postal_code",
      "country",
      "languages_known",
      "documents",
      "status",
      "role_uuid",
      "role_value",
      "branch_name",
      "branch_uuid",
      "referral_code",
      "created_by_uuid",
      "created_by_name",
    ];

    const filteredUpdateData = {};
    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        filteredUpdateData[key] = updateData[key];
      }
    });

    // Add update timestamp
    filteredUpdateData.insert_ts = new Date();

    // Update user
    const updatedUser = await prisma.user.update({
      where: { user_uuid: user_uuid },
      data: filteredUpdateData,
      select: {
        user_fact_id: true,
        user_fact_unique_id: true,
        user_uuid: true,
        email: true,
        status: true,
        created_by_uuid: true,
        created_by_name: true,
        create_ts: true,
        insert_ts: true,
        user_dim_id: true,
        role_uuid: true,
        role_value: true,
        user_profile_id: true,
        first_name: true,
        last_name: true,
        full_name: true,
        personal_email: true,
        job_title: true,
        user_type: true,
        assigned_phone_number: true,
        shared_email: true,
        mobile: true,
        home_phone: true,
        linkedin_profile: true,
        hire_date: true,
        last_day_at_work: true,
        department: true,
        fax: true,
        date_of_birth: true,
        mother_maiden_name: true,
        photo: true,
        signature: true,
        street_address: true,
        unit_or_suite: true,
        city: true,
        csr: true,
        csr_code: true,
        marketer: true,
        marketer_code: true,
        producer_one: true,
        producer_one_code: true,
        producer_two: true,
        producer_two_code: true,
        producer_three: true,
        producer_three_code: true,
        branch_code: true,
        province_or_state: true,
        postal_code: true,
        country: true,
        languages_known: true,
        documents: true,
        branch_name: true,
        branch_uuid: true,
        referral_code: true,
      },
    });

    const response = {
      message: "User Profile updated successfully.",
      data: updatedUser,
    };

    console.log(
      `✅ [USER SERVICE] User profile updated for: ${updatedUser.email}`
    );
    res.json(response);
  } catch (error) {
    console.error("❌ [USER SERVICE] Update user profile (POST) error:", error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
      },
    });
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
