const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Helper functions
const createApiResponse = (success, data = null, error = null) => {
  return {
    success,
    data,
    error,
    timestamp: new Date().toISOString(),
  };
};

const createApiError = (code, message) => {
  return { code, message };
};

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
                `Access denied to ${moduleName}${
                  submoduleName ? ` - ${submoduleName}` : ""
                }`
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

// Routes
app.get("/health", (req, res) => {
  res.json(
    createApiResponse(true, {
      service: "secure-auth-service",
      status: "healthy",
      port: PORT,
      security: "enabled",
    })
  );
});

// Login endpoint
app.post("/api/v1/authentication/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 [SECURE AUTH] Login attempt for:", email);

    if (!email || !password) {
      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("MISSING_CREDENTIALS", "Email and password required")
          )
        );
    }

    // Find user by email
    const user = await prisma.users.findFirst({
      where: { email },
      select: {
        user_fact_id: true,
        user_uuid: true,
        email: true,
        password_hash: true,
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

    console.log("👤 [SECURE AUTH] User found:", user ? "Yes" : "No");

    if (!user) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("INVALID_CREDENTIALS", "Invalid email or password")
          )
        );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    console.log("🔑 [SECURE AUTH] Password valid:", isValidPassword);

    if (!isValidPassword) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("INVALID_CREDENTIALS", "Invalid email or password")
          )
        );
    }

    // Check if user is active
    if (user.status !== "ACTIVE") {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("ACCOUNT_INACTIVE", "Account is inactive")
          )
        );
    }

    // Get module security for the user
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
        console.log(
          "🔒 [SECURE AUTH] Module security loaded:",
          moduleSecurity.length,
          "modules"
        );
      } catch (error) {
        console.error("❌ [SECURE AUTH] Error loading module security:", error);
        // Continue without module security for now
      }
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
    const token = jwt.sign(
      {
        user_uuid: user.user_uuid,
        email: user.email,
        role_value: user.role_value,
        role_uuid: user.role_uuid,
      },
      jwtSecret,
      { expiresIn: "24h" }
    );

    console.log("🎫 [SECURE AUTH] Token generated for user:", user.email);

    // Return user data with token
    const userData = {
      user_fact_id: user.user_fact_id,
      user_uuid: user.user_uuid,
      email: user.email,
      status: user.status,
      role_value: user.role_value,
      role_uuid: user.role_uuid,
      first_name: user.first_name,
      last_name: user.last_name,
      full_name: user.full_name,
      department: user.department,
      mobile: user.mobile,
      branch_name: user.branch_name,
      referral_code: user.referral_code,
      create_ts: user.create_ts,
      module_security: moduleSecurity,
    };

    res.json(
      createApiResponse(true, {
        message: "Login successful",
        token,
        user: userData,
      })
    );
  } catch (error) {
    console.error("❌ [SECURE AUTH] Login error:", error);
    res
      .status(500)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("LOGIN_ERROR", "Login failed")
        )
      );
  }
});

// Protected route - Get user profile
app.get(
  "/api/v1/authentication/profile",
  authenticateToken,
  async (req, res) => {
    try {
      console.log("👤 [SECURE AUTH] Profile request for user:", req.user.email);

      // Get full user data
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
          console.error(
            "❌ [SECURE AUTH] Error loading module security:",
            error
          );
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
      console.error("❌ [SECURE AUTH] Profile error:", error);
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
  }
);

// Admin only route - Get all users
app.get(
  "/api/v1/authentication/users",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      console.log(
        "👥 [SECURE AUTH] Admin request for all users by:",
        req.user.email
      );

      const users = await prisma.users.findMany({
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
          users,
          total: users.length,
        })
      );
    } catch (error) {
      console.error("❌ [SECURE AUTH] Users list error:", error);
      res
        .status(500)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("USERS_ERROR", "Failed to get users list")
          )
        );
    }
  }
);

// Module security route - Get user's module permissions
app.get(
  "/api/v1/authentication/module-security",
  authenticateToken,
  async (req, res) => {
    try {
      console.log(
        "🔒 [SECURE AUTH] Module security request for user:",
        req.user.email
      );

      if (!req.user.role_uuid) {
        return res
          .status(400)
          .json(
            createApiResponse(
              false,
              null,
              createApiError("NO_ROLE", "User has no role assigned")
            )
          );
      }

      const moduleSecurity = await prisma.module_security.findMany({
        where: {
          role_uuid: req.user.role_uuid,
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

      res.json(
        createApiResponse(true, {
          module_security: moduleSecurity,
          total_modules: moduleSecurity.length,
          user_role: req.user.role_value,
        })
      );
    } catch (error) {
      console.error("❌ [SECURE AUTH] Module security error:", error);
      res
        .status(500)
        .json(
          createApiResponse(
            false,
            null,
            createApiError(
              "MODULE_SECURITY_ERROR",
              "Failed to get module security"
            )
          )
        );
    }
  }
);

// Logout endpoint
app.put("/api/v1/authentication/logout", authenticateToken, (req, res) => {
  console.log("🚪 [SECURE AUTH] Logout for user:", req.user.email);

  res.json(
    createApiResponse(true, {
      message: "Logged out successfully",
    })
  );
});

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
  console.error("❌ [SECURE AUTH] Unhandled error:", error);
  res.status(500).json(
    createApiResponse(false, null, {
      code: "INTERNAL_ERROR",
      message: "Internal server error",
    })
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Secure Auth service running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(
    `🔐 Login endpoint: http://localhost:${PORT}/api/v1/authentication/login`
  );
  console.log(
    `👤 Profile endpoint: http://localhost:${PORT}/api/v1/authentication/profile`
  );
  console.log(
    `👥 Users endpoint (Admin): http://localhost:${PORT}/api/v1/authentication/users`
  );
  console.log(
    `🔒 Module security endpoint: http://localhost:${PORT}/api/v1/authentication/module-security`
  );
  console.log(`🛡️  Security middleware: ENABLED`);
});

module.exports = app;
