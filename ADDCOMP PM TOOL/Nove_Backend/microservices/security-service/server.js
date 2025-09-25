const express = require("express");
const { Client } = require("pg");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3008;

// Database connection configuration
const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://sakshikalyanjadhav@localhost:5432/pm_platform",
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("✅ Connected to database successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

// Helper function to create API response
const createApiResponse = (success, data = null, error = null) => ({
  success,
  data,
  error,
});

// Helper function to create API error
const createApiError = (code, message) => ({
  success: false,
  data: null,
  error: {
    code,
    message,
  },
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Security service is running",
    timestamp: new Date().toISOString(),
  });
});

// Get user roles endpoint (handle both paths)
app.get("/get-user-roles", async (req, res) => {
  try {
    console.log("📋 [SECURITY SERVICE] Get user roles request received");

    // Query to get all user roles
    const query = `
      SELECT 
        role_id,
        role_uuid,
        role_name,
        role_value,
        role_group,
        status,
        created_by_uuid,
        created_by_name,
        modified_by_uuid,
        modified_by_name,
        create_ts,
        insert_ts
      FROM user_roles
      ORDER BY role_id DESC
    `;

    const result = await client.query(query);

    console.log(`📊 [SECURITY SERVICE] Found ${result.rows.length} user roles`);

    res.json(createApiResponse(true, result.rows));
  } catch (error) {
    console.error("❌ [SECURITY SERVICE] Error fetching user roles:", error);
    res
      .status(500)
      .json(createApiError("INTERNAL_ERROR", "Internal server error"));
  }
});

// Handle full API path from gateway
app.get("/api/v1/security/get-user-roles", async (req, res) => {
  try {
    console.log(
      "📋 [SECURITY SERVICE] Get user roles request received (full path)"
    );

    // Query to get all user roles
    const query = `
      SELECT 
        role_id,
        role_uuid,
        role_name,
        role_value,
        role_group,
        status,
        created_by_uuid,
        created_by_name,
        modified_by_uuid,
        modified_by_name,
        create_ts,
        insert_ts
      FROM user_roles
      ORDER BY role_id DESC
    `;

    const result = await client.query(query);

    console.log(`📊 [SECURITY SERVICE] Found ${result.rows.length} user roles`);

    res.json(createApiResponse(true, result.rows));
  } catch (error) {
    console.error("❌ [SECURITY SERVICE] Error fetching user roles:", error);
    res
      .status(500)
      .json(createApiError("INTERNAL_ERROR", "Internal server error"));
  }
});

// Get role groups endpoint
app.get("/get-role-group", async (req, res) => {
  try {
    console.log("📋 [SECURITY SERVICE] Get role groups request received");

    const query = `
      SELECT 
        role_group_id,
        role_group_unique_id,
        role_group_uuid,
        role_group,
        status,
        created_by_uuid,
        create_ts,
        insert_ts
      FROM latest_role_group
      ORDER BY role_group_unique_id DESC
    `;

    const result = await client.query(query);

    console.log(
      `📊 [SECURITY SERVICE] Found ${result.rows.length} role groups`
    );

    res.json(createApiResponse(true, result.rows));
  } catch (error) {
    console.error("❌ [SECURITY SERVICE] Error fetching role groups:", error);
    res
      .status(500)
      .json(createApiError("INTERNAL_ERROR", "Internal server error"));
  }
});

// Handle full API path from gateway for role groups
app.get("/api/v1/security/get-role-group", async (req, res) => {
  try {
    console.log(
      "📋 [SECURITY SERVICE] Get role groups request received (full path)"
    );
    console.log("📋 [SECURITY SERVICE] Query params:", req.query);

    // Handle pagination parameters
    const pageNo = parseInt(req.query.pageNo) || 1;
    const itemPerPage = parseInt(req.query.itemPerPage) || 100;
    const offset = (pageNo - 1) * itemPerPage;

    const query = `
      SELECT 
        role_group_id,
        role_group_unique_id,
        role_group_uuid,
        role_group,
        status,
        created_by_uuid,
        create_ts,
        insert_ts
      FROM latest_role_group
      ORDER BY role_group_unique_id DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await client.query(query, [itemPerPage, offset]);

    // Get total count for pagination
    const countQuery = "SELECT COUNT(*) as total FROM latest_role_group";
    const countResult = await client.query(countQuery);
    const totalRecords = parseInt(countResult.rows[0].total);

    console.log(
      `📊 [SECURITY SERVICE] Found ${
        result.rows.length
      } role groups (page ${pageNo} of ${Math.ceil(
        totalRecords / itemPerPage
      )})`
    );

    // Return paginated response
    const response = {
      success: true,
      data: result.rows,
      pagination: {
        pageNo,
        itemPerPage,
        totalRecords,
        totalPages: Math.ceil(totalRecords / itemPerPage),
      },
    };

    res.json(response);
  } catch (error) {
    console.error("❌ [SECURITY SERVICE] Error fetching role groups:", error);
    res
      .status(500)
      .json(createApiError("INTERNAL_ERROR", "Internal server error"));
  }
});

// Upsert user roles endpoint
app.post("/upsert-roles", async (req, res) => {
  try {
    console.log("📝 [SECURITY SERVICE] Upsert roles request received");
    console.log("📝 [SECURITY SERVICE] Request body:", req.body);

    const {
      role_uuid,
      role_name,
      role_value,
      role_group,
      status = "ACTIVE",
      created_by_uuid,
      created_by_name,
      modified_by_uuid,
      modified_by_name,
    } = req.body;

    // Check if role exists
    const checkQuery = "SELECT role_uuid FROM user_roles WHERE role_uuid = $1";
    const checkResult = await client.query(checkQuery, [role_uuid]);

    let result;
    if (checkResult.rows.length > 0) {
      // Update existing role
      const updateQuery = `
        UPDATE user_roles SET
          role_name = $2,
          role_value = $3,
          role_group = $4,
          status = $5,
          modified_by_uuid = $6,
          modified_by_name = $7,
          insert_ts = NOW()
        WHERE role_uuid = $1
        RETURNING *
      `;
      result = await client.query(updateQuery, [
        role_uuid,
        role_name,
        role_value,
        role_group,
        status,
        modified_by_uuid,
        modified_by_name,
      ]);
      console.log("✅ [SECURITY SERVICE] Role updated successfully");
    } else {
      // Insert new role
      const insertQuery = `
        INSERT INTO user_roles (
          role_uuid, role_name, role_value, role_group, status,
          created_by_uuid, created_by_name, create_ts, insert_ts
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING *
      `;
      result = await client.query(insertQuery, [
        role_uuid,
        role_name,
        role_value,
        role_group,
        status,
        created_by_uuid,
        created_by_name,
      ]);
      console.log("✅ [SECURITY SERVICE] Role created successfully");
    }

    res.json(createApiResponse(true, result.rows[0]));
  } catch (error) {
    console.error("❌ [SECURITY SERVICE] Error upserting role:", error);
    res
      .status(500)
      .json(createApiError("INTERNAL_ERROR", "Internal server error"));
  }
});

// Upsert role group endpoint
app.post("/upsert-role-group", async (req, res) => {
  try {
    console.log("📝 [SECURITY SERVICE] Upsert role group request received");
    console.log("📝 [SECURITY SERVICE] Request body:", req.body);

    const {
      role_group_uuid,
      role_group,
      status = "ACTIVE",
      created_by_uuid,
    } = req.body;

    // Check if role group exists
    const checkQuery =
      "SELECT role_group_uuid FROM latest_role_group WHERE role_group_uuid = $1";
    const checkResult = await client.query(checkQuery, [role_group_uuid]);

    let result;
    if (checkResult.rows.length > 0) {
      // Update existing role group
      const updateQuery = `
        UPDATE latest_role_group SET
          role_group = $2,
          status = $3,
          insert_ts = NOW()
        WHERE role_group_uuid = $1
        RETURNING *
      `;
      result = await client.query(updateQuery, [
        role_group_uuid,
        role_group,
        status,
      ]);
      console.log("✅ [SECURITY SERVICE] Role group updated successfully");
    } else {
      // Insert new role group
      const insertQuery = `
        INSERT INTO latest_role_group (
          role_group_uuid, role_group, status, created_by_uuid, create_ts, insert_ts
        ) VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING *
      `;
      result = await client.query(insertQuery, [
        role_group_uuid,
        role_group,
        status,
        created_by_uuid,
      ]);
      console.log("✅ [SECURITY SERVICE] Role group created successfully");
    }

    res.json(createApiResponse(true, result.rows[0]));
  } catch (error) {
    console.error("❌ [SECURITY SERVICE] Error upserting role group:", error);
    res
      .status(500)
      .json(createApiError("INTERNAL_ERROR", "Internal server error"));
  }
});

// Get role module content access permission endpoint
app.get("/get-role-module-content-access-permission", async (req, res) => {
  try {
    console.log(
      "📋 [SECURITY SERVICE] Get role module content access permission request received"
    );
    console.log("📋 [SECURITY SERVICE] Query params:", req.query);

    const { role_uuid } = req.query;

    if (!role_uuid) {
      return res
        .status(400)
        .json(createApiError("BAD_REQUEST", "role_uuid is required"));
    }

    // Get role information
    const roleQuery = `
      SELECT 
        role_name,
        role_group,
        status
      FROM user_roles
      WHERE role_uuid = $1
    `;

    const roleResult = await client.query(roleQuery, [role_uuid]);

    if (roleResult.rows.length === 0) {
      return res
        .status(404)
        .json(createApiError("NOT_FOUND", "Role not found"));
    }

    const role = roleResult.rows[0];

    // Get module access permissions for the role
    const moduleQuery = `
      SELECT 
        role_module_uuid,
        module_uuid,
        module_name,
        submodule_name,
        table_name,
        map_column_user_uuid,
        column_relation_options,
        role_uuid,
        show_module,
        view_access,
        edit_access,
        send_sms,
        send_mail,
        send_whatsapp,
        send_call,
        filter_values,
        status
      FROM module_security
      WHERE role_uuid = $1
      ORDER BY module_name, submodule_name
    `;

    const moduleResult = await client.query(moduleQuery, [role_uuid]);

    console.log(
      `📊 [SECURITY SERVICE] Found ${moduleResult.rows.length} module permissions for role ${role.role_name}`
    );

    // Format the response according to the expected structure
    const response = {
      message: "Record Access Permission",
      data: {
        role_name: role.role_name,
        role_group: role.role_group,
        status: role.status,
        data: moduleResult.rows.map((row) => ({
          role_module_uuid: row.role_module_uuid,
          module_uuid: row.module_uuid,
          module_name: row.module_name,
          submodule_name: row.submodule_name,
          table_name: row.table_name,
          map_column_user_uuid: row.map_column_user_uuid || [
            "created_by_uuid",
            "modified_by_uuid",
          ],
          column_relation_options: row.column_relation_options || [
            {
              api: "/user/get-user",
              field: "email",
              value: "user_uuid",
              column_key: "user_uuid",
              column_label: "User",
            },
            {
              api: "/user/get-branch",
              field: "branch_name",
              value: "branch_uuid",
              column_key: "branch_uuid",
              column_label: "Branch",
            },
          ],
          role_uuid: row.role_uuid,
          show_module: row.show_module,
          view_access: row.view_access,
          edit_access: row.edit_access,
          send_sms: row.send_sms,
          send_mail: row.send_mail,
          send_whatsapp: row.send_whatsapp,
          send_call: row.send_call,
          filter_values: row.filter_values || {},
          status: row.status,
        })),
      },
    };

    res.json(response);
  } catch (error) {
    console.error(
      "❌ [SECURITY SERVICE] Error fetching role module content access permission:",
      error
    );
    res
      .status(500)
      .json(createApiError("INTERNAL_ERROR", "Internal server error"));
  }
});

// Handle full API path from gateway for role module content access permission
app.get(
  "/api/v1/security/get-role-module-content-access-permission",
  async (req, res) => {
    try {
      console.log(
        "📋 [SECURITY SERVICE] Get role module content access permission request received (full path)"
      );
      console.log("📋 [SECURITY SERVICE] Query params:", req.query);

      const { role_uuid } = req.query;

      if (!role_uuid) {
        return res
          .status(400)
          .json(createApiError("BAD_REQUEST", "role_uuid is required"));
      }

      // Get role information
      const roleQuery = `
      SELECT 
        role_name,
        role_group,
        status
      FROM user_roles
      WHERE role_uuid = $1
    `;

      const roleResult = await client.query(roleQuery, [role_uuid]);

      if (roleResult.rows.length === 0) {
        return res
          .status(404)
          .json(createApiError("NOT_FOUND", "Role not found"));
      }

      const role = roleResult.rows[0];

      // Get module access permissions for the role
      const moduleQuery = `
      SELECT 
        role_module_uuid,
        module_uuid,
        module_name,
        submodule_name,
        table_name,
        map_column_user_uuid,
        column_relation_options,
        role_uuid,
        show_module,
        view_access,
        edit_access,
        send_sms,
        send_mail,
        send_whatsapp,
        send_call,
        filter_values,
        status
      FROM module_security
      WHERE role_uuid = $1
      ORDER BY module_name, submodule_name
    `;

      const moduleResult = await client.query(moduleQuery, [role_uuid]);

      console.log(
        `📊 [SECURITY SERVICE] Found ${moduleResult.rows.length} module permissions for role ${role.role_name}`
      );

      // Format the response according to the expected structure
      const response = {
        message: "Record Access Permission",
        data: {
          role_name: role.role_name,
          role_group: role.role_group,
          status: role.status,
          data: moduleResult.rows.map((row) => ({
            role_module_uuid: row.role_module_uuid,
            module_uuid: row.module_uuid,
            module_name: row.module_name,
            submodule_name: row.submodule_name,
            table_name: row.table_name,
            map_column_user_uuid: row.map_column_user_uuid || [
              "created_by_uuid",
              "modified_by_uuid",
            ],
            column_relation_options: row.column_relation_options || [
              {
                api: "/user/get-user",
                field: "email",
                value: "user_uuid",
                column_key: "user_uuid",
                column_label: "User",
              },
              {
                api: "/user/get-branch",
                field: "branch_name",
                value: "branch_uuid",
                column_key: "branch_uuid",
                column_label: "Branch",
              },
            ],
            role_uuid: row.role_uuid,
            show_module: row.show_module,
            view_access: row.view_access,
            edit_access: row.edit_access,
            send_sms: row.send_sms,
            send_mail: row.send_mail,
            send_whatsapp: row.send_whatsapp,
            send_call: row.send_call,
            filter_values: row.filter_values || {},
            status: row.status,
          })),
        },
      };

      res.json(response);
    } catch (error) {
      console.error(
        "❌ [SECURITY SERVICE] Error fetching role module content access permission:",
        error
      );
      res
        .status(500)
        .json(createApiError("INTERNAL_ERROR", "Internal server error"));
    }
  }
);

// Upsert role module content access permission endpoint
app.post("/upsert-role-module-content-access-permission", async (req, res) => {
  try {
    console.log("📝 [SECURITY SERVICE] Upsert RMAP request received");
    console.log("📝 [SECURITY SERVICE] Request body:", req.body);

    // This endpoint can be implemented based on your module_security table structure
    res.json(
      createApiResponse(true, { message: "RMAP endpoint - to be implemented" })
    );
  } catch (error) {
    console.error("❌ [SECURITY SERVICE] Error upserting RMAP:", error);
    res
      .status(500)
      .json(createApiError("INTERNAL_ERROR", "Internal server error"));
  }
});

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json(
      createApiError(
        "NOT_FOUND",
        `Route ${req.method} ${req.originalUrl} not found`
      )
    );
});

// Start server
async function startServer() {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Security service running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(
      `📋 User roles endpoint: http://localhost:${PORT}/get-user-roles`
    );
    console.log(
      `📋 Role groups endpoint: http://localhost:${PORT}/get-role-group`
    );
  });
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down Security service...");
  await client.end();
  process.exit(0);
});

startServer().catch(console.error);
