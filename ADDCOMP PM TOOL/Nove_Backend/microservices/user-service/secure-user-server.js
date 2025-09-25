const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
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

// Security middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("UNAUTHORIZED", "Access token is required")
          )
        );
    }

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
    const decoded = jwt.verify(token, jwtSecret);

    if (!decoded.user_uuid) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("INVALID_TOKEN", "Invalid token payload")
          )
        );
    }

    // Fetch user details from database
    const user = await prisma.users.findFirst({
      where: {
        user_uuid: decoded.user_uuid,
        status: "ACTIVE",
      },
      select: {
        user_uuid: true,
        email: true,
        role_value: true,
        role_uuid: true,
        first_name: true,
        last_name: true,
        full_name: true,
        status: true,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("USER_NOT_FOUND", "User not found or inactive")
          )
        );
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("INVALID_TOKEN", "Invalid or malformed token")
          )
        );
    }

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("TOKEN_EXPIRED", "Token has expired")
          )
        );
    }

    return res
      .status(500)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("AUTH_ERROR", "Authentication failed")
        )
      );
  }
};

// Role-based authorization middleware
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("UNAUTHORIZED", "User not authenticated")
          )
        );
    }

    if (!allowedRoles.includes(req.user.role_value)) {
      return res
        .status(403)
        .json(
          createApiResponse(
            false,
            null,
            createApiError(
              "FORBIDDEN",
              `Access denied. Required roles: ${allowedRoles.join(", ")}`
            )
          )
        );
    }

    next();
  };
};

// Admin only middleware
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("UNAUTHORIZED", "User not authenticated")
        )
      );
  }

  if (req.user.role_value !== "ADMIN") {
    return res
      .status(403)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("ADMIN_REQUIRED", "Admin access required")
        )
      );
  }

  next();
};

// Module security middleware
const requireModuleAccess = (moduleName, submoduleName = null) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("UNAUTHORIZED", "User not authenticated")
          )
        );
    }

    try {
      // For ADMIN users, allow all module access
      if (req.user.role_value === "ADMIN") {
        return next();
      }

      // Check module security for non-ADMIN users
      const moduleSecurity = await prisma.module_security.findFirst({
        where: {
          role_uuid: req.user.role_uuid,
          module_name: moduleName,
          ...(submoduleName && { submodule_name: submoduleName }),
          status: "ACTIVE",
          show_module: true,
        },
      });

      if (!moduleSecurity) {
        return res
          .status(403)
          .json(
            createApiResponse(
              false,
              null,
              createApiError(
                "MODULE_ACCESS_DENIED",
                `Access denied to ${moduleName}${submoduleName ? ` - ${submoduleName}` : ""}`
              )
            )
          );
      }

      // Check view access for GET requests
      if (req.method === "GET" && !moduleSecurity.view_access) {
        return res
          .status(403)
          .json(
            createApiResponse(
              false,
              null,
              createApiError(
                "VIEW_ACCESS_DENIED",
                `View access denied to ${moduleName}`
              )
            )
          );
      }

      // Check edit access for POST, PUT, DELETE requests
      if (
        ["POST", "PUT", "DELETE"].includes(req.method) &&
        !moduleSecurity.edit_access
      ) {
        return res
          .status(403)
          .json(
            createApiResponse(
              false,
              null,
              createApiError(
                "EDIT_ACCESS_DENIED",
                `Edit access denied to ${moduleName}`
              )
            )
          );
      }

      next();
    } catch (error) {
      console.error("Module security check error:", error);
      return res
        .status(500)
        .json(
          createApiResponse(
            false,
            null,
            createApiError(
              "SECURITY_CHECK_ERROR",
              "Failed to verify module access"
            )
          )
        );
    }
  };
};

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Secure User service is running",
    security: "enabled",
    timestamp: new Date().toISOString(),
  });
});

// Get user by query parameters (for frontend compatibility) - Protected
app.get(
  "/api/v1/user/get-user",
  authenticateToken,
  requireModuleAccess("Users", "Users"),
  async (req, res) => {
    console.log("👤 [SECURE USER] Get user request received");
    console.log("👤 [SECURE USER] Query params:", req.query);
    console.log("👤 [SECURE USER] User making request:", req.user.email);

    try {
      const { email, user_uuid, page = 1, limit = 10 } = req.query;

      let whereClause = {};

      if (email) {
        whereClause.email = email;
      }

      if (user_uuid) {
        whereClause.user_uuid = user_uuid;
      }

      // For non-ADMIN users, only allow access to their own data
      if (req.user.role_value !== "ADMIN") {
        whereClause.user_uuid = req.user.user_uuid;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [users, totalCount] = await Promise.all([
        prisma.users.findMany({
          where: whereClause,
          select: {
            user_fact_id: true,
            user_uuid: true,
            email: true,
            status: true,
            role_value: true,
            role_uuid: true,
            first_name: true,
            last_name: true,
            full_name: true,
            department: true,
            mobile: true,
            branch_name: true,
            referral_code: true,
            create_ts: true,
          },
          skip: skip,
          take: parseInt(limit),
          orderBy: {
            create_ts: "desc",
          },
        }),
        prisma.users.count({ where: whereClause }),
      ]);

      // Get module security for each user
      const usersWithSecurity = await Promise.all(
        users.map(async (user) => {
          let moduleSecurity = [];
          if (user.role_uuid) {
            try {
              moduleSecurity = await prisma.module_security.findMany({
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
                  created_by_name: true,
                  module_name: true,
                  submodule_name: true,
                  table_name: true,
                  module_key: true,
                },
              });
            } catch (error) {
              console.error(
                "Error loading module security for user:",
                user.email,
                error
              );
            }
          }
          return {
            ...user,
            module_security: moduleSecurity,
          };
        })
      );

      res.json(
        createApiResponse(true, {
          message: "User Details",
          totalRecords: totalCount,
          currentRecords: usersWithSecurity.length,
          data: usersWithSecurity,
        })
      );
    } catch (error) {
      console.error("❌ [SECURE USER] Get user error:", error);
      res
        .status(500)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("USER_FETCH_ERROR", "Failed to fetch user data")
          )
        );
    }
  }
);

// Get user profile - Protected
app.get("/api/v1/user/profile", authenticateToken, async (req, res) => {
  try {
    console.log("👤 [SECURE USER] Profile request for user:", req.user.email);

    const user = await prisma.users.findFirst({
      where: { user_uuid: req.user.user_uuid },
      select: {
        user_fact_id: true,
        user_uuid: true,
        email: true,
        status: true,
        role_value: true,
        role_uuid: true,
        first_name: true,
        last_name: true,
        full_name: true,
        department: true,
        mobile: true,
        branch_name: true,
        referral_code: true,
        create_ts: true,
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

    // Get module security
    let moduleSecurity = [];
    if (user.role_uuid) {
      try {
        moduleSecurity = await prisma.module_security.findMany({
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
            created_by_name: true,
            module_name: true,
            submodule_name: true,
            table_name: true,
            module_key: true,
          },
        });
      } catch (error) {
        console.error("❌ [SECURE USER] Error loading module security:", error);
      }
    }

    res.json(
      createApiResponse(true, {
        user: {
          ...user,
          module_security: moduleSecurity,
        },
      })
    );
  } catch (error) {
    console.error("❌ [SECURE USER] Profile error:", error);
    res
      .status(500)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("PROFILE_ERROR", "Failed to get user profile")
        )
      );
  }
});

// Update user profile - Protected
app.put("/api/v1/user/profile", authenticateToken, async (req, res) => {
  try {
    console.log(
      "✏️ [SECURE USER] Profile update request for user:",
      req.user.email
    );

    const { first_name, last_name, full_name, mobile, department } = req.body;

    const updatedUser = await prisma.users.update({
      where: { user_uuid: req.user.user_uuid },
      data: {
        ...(first_name && { first_name }),
        ...(last_name && { last_name }),
        ...(full_name && { full_name }),
        ...(mobile && { mobile }),
        ...(department && { department }),
      },
      select: {
        user_fact_id: true,
        user_uuid: true,
        email: true,
        status: true,
        role_value: true,
        role_uuid: true,
        first_name: true,
        last_name: true,
        full_name: true,
        department: true,
        mobile: true,
        branch_name: true,
        referral_code: true,
        create_ts: true,
      },
    });

    res.json(
      createApiResponse(true, {
        message: "Profile updated successfully",
        user: updatedUser,
      })
    );
  } catch (error) {
    console.error("❌ [SECURE USER] Profile update error:", error);
    res
      .status(500)
      .json(
        createApiResponse(
          false,
          null,
          createApiError(
            "PROFILE_UPDATE_ERROR",
            "Failed to update user profile"
          )
        )
      );
  }
});

// Admin only - Get all users
app.get(
  "/api/v1/user/all",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      console.log(
        "👥 [SECURE USER] Admin request for all users by:",
        req.user.email
      );

      const { page = 1, limit = 50 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [users, totalCount] = await Promise.all([
        prisma.users.findMany({
          select: {
            user_fact_id: true,
            user_uuid: true,
            email: true,
            status: true,
            role_value: true,
            role_uuid: true,
            first_name: true,
            last_name: true,
            full_name: true,
            department: true,
            mobile: true,
            branch_name: true,
            referral_code: true,
            create_ts: true,
          },
          skip: skip,
          take: parseInt(limit),
          orderBy: {
            create_ts: "desc",
          },
        }),
        prisma.users.count(),
      ]);

      res.json(
        createApiResponse(true, {
          message: "All Users",
          totalRecords: totalCount,
          currentRecords: users.length,
          data: users,
        })
      );
    } catch (error) {
      console.error("❌ [SECURE USER] All users error:", error);
      res
        .status(500)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("USERS_ERROR", "Failed to get all users")
          )
        );
    }
  }
);

// Admin only - Update user role
app.put(
  "/api/v1/user/role",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      console.log(
        "🔧 [SECURE USER] Role update request by admin:",
        req.user.email
      );

      const { user_uuid, role_value } = req.body;

      if (!user_uuid || !role_value) {
        return res
          .status(400)
          .json(
            createApiResponse(
              false,
              null,
              createApiError(
                "MISSING_PARAMETERS",
                "user_uuid and role_value are required"
              )
            )
          );
      }

      // Get the role_uuid for the new role
      const role = await prisma.user_roles.findFirst({
        where: { role_value },
        select: { role_uuid: true },
      });

      if (!role) {
        return res
          .status(400)
          .json(
            createApiResponse(
              false,
              null,
              createApiError("INVALID_ROLE", "Invalid role value")
            )
          );
      }

      const updatedUser = await prisma.users.update({
        where: { user_uuid },
        data: {
          role_value,
          role_uuid: role.role_uuid,
        },
        select: {
          user_fact_id: true,
          user_uuid: true,
          email: true,
          status: true,
          role_value: true,
          role_uuid: true,
          first_name: true,
          last_name: true,
          full_name: true,
          department: true,
          mobile: true,
          branch_name: true,
          referral_code: true,
          create_ts: true,
        },
      });

      res.json(
        createApiResponse(true, {
          message: "User role updated successfully",
          user: updatedUser,
        })
      );
    } catch (error) {
      console.error("❌ [SECURE USER] Role update error:", error);
      res
        .status(500)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("ROLE_UPDATE_ERROR", "Failed to update user role")
          )
        );
    }
  }
);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json(
    createApiResponse(false, null, {
      code: "NOT_FOUND",
      message: "Route not found",
    })
  );
});

// Error handler
app.use((error, req, res, next) => {
  console.error("❌ [SECURE USER] Unhandled error:", error);
  res.status(500).json(
    createApiResponse(false, null, {
      code: "INTERNAL_ERROR",
      message: "Internal server error",
    })
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Secure User service running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(
    `👤 Get user endpoint: http://localhost:${PORT}/api/v1/user/get-user`
  );
  console.log(
    `👤 Profile endpoint: http://localhost:${PORT}/api/v1/user/profile`
  );
  console.log(
    `👥 All users endpoint (Admin): http://localhost:${PORT}/api/v1/user/all`
  );
  console.log(
    `🔧 Role update endpoint (Admin): http://localhost:${PORT}/api/v1/user/role`
  );
  console.log(`🛡️  Security middleware: ENABLED`);
});

module.exports = app;
