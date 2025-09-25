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

// Routes
app.get("/health", (req, res) => {
  res.json(
    createApiResponse(true, {
      service: "auth-service",
      status: "healthy",
      port: PORT,
    })
  );
});

// Login endpoint
app.post("/api/v1/authentication/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt for:", email);

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
    const user = await prisma.user.findUnique({
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

    console.log("User found:", user ? "Yes" : "No");

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
    console.log("Password valid:", isValidPassword);

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

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.user_uuid,
        email: user.email,
        role: user.role_value,
      },
      process.env.JWT_SECRET ||
        "your-super-secret-jwt-key-change-this-in-production-2024",
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    // Update last login
    await prisma.user.update({
      where: { user_uuid: user.user_uuid },
      data: { insert_ts: new Date() },
    });

    console.log("Login successful for:", email);

    res.json(
      createApiResponse(true, {
        user: {
          id: user.user_uuid,
          email: user.email,
          name: user.full_name || `${user.first_name} ${user.last_name}`,
          role: user.role_value,
          isActive: user.status === "ACTIVE",
          department: user.department,
          branch: user.branch_name,
          module_security: moduleSecurity,
        },
        token,
      })
    );
  } catch (error) {
    console.error("Login error:", error);
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

// Signup endpoint
app.post("/api/v1/authentication/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName, department, mobile, role } =
      req.body;

    console.log("Signup attempt for:", email);

    if (!email || !password || !firstName || !lastName) {
      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            null,
            createApiError(
              "MISSING_FIELDS",
              "Email, password, first name, and last name are required"
            )
          )
        );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(409)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("USER_EXISTS", "User with this email already exists")
          )
        );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate unique ID
    const uniqueId = Math.floor(Math.random() * 100000) + 1000;

    // Create new user
    const user = await prisma.user.create({
      data: {
        user_fact_unique_id: uniqueId,
        email,
        password_hash: hashedPassword,
        status: "ACTIVE",
        role_value: role || "EMPLOYEE",
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        department: department || null,
        mobile: mobile || null,
        branch_name: "NOVA SCOTIA",
        referral_code: `NU-${uniqueId}`,
        created_by_name: "Self Registration",
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.user_uuid,
        email: user.email,
        role: user.role_value,
      },
      process.env.JWT_SECRET ||
        "your-super-secret-jwt-key-change-this-in-production-2024",
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    console.log("Signup successful for:", email);

    res.status(201).json(
      createApiResponse(true, {
        user: {
          id: user.user_uuid,
          email: user.email,
          name: user.full_name,
          role: user.role_value,
          isActive: user.status === "ACTIVE",
          department: user.department,
          mobile: user.mobile,
          branch: user.branch_name,
          referralCode: user.referral_code,
        },
        token,
      })
    );
  } catch (error) {
    console.error("Signup error:", error);
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

// Forgot password endpoint
app.post("/api/v1/authentication/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Forgot password request for:", email);

    if (!email) {
      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("MISSING_EMAIL", "Email is required")
          )
        );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        user_uuid: true,
        email: true,
        first_name: true,
        last_name: true,
        status: true,
      },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json(
        createApiResponse(true, {
          message:
            "If an account with this email exists, a password reset link has been sent.",
        })
      );
    }

    if (user.status !== "ACTIVE") {
      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("ACCOUNT_INACTIVE", "Account is inactive")
          )
        );
    }

    // Generate reset token (in production, store this in database with expiry)
    const resetToken = jwt.sign(
      { userId: user.user_uuid, email: user.email, type: "password_reset" },
      process.env.JWT_SECRET ||
        "your-super-secret-jwt-key-change-this-in-production-2024",
      { expiresIn: "1h" }
    );

    // In production, send email with reset link
    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json(
      createApiResponse(true, {
        message:
          "If an account with this email exists, a password reset link has been sent.",
        resetToken: resetToken, // Only for development - remove in production
      })
    );
  } catch (error) {
    console.error("Forgot password error:", error);
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

// Reset password endpoint
app.post("/api/v1/authentication/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    console.log("Reset password attempt");

    if (!token || !newPassword) {
      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            null,
            createApiError(
              "MISSING_FIELDS",
              "Token and new password are required"
            )
          )
        );
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET ||
          "your-super-secret-jwt-key-change-this-in-production-2024"
      );
    } catch (error) {
      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("INVALID_TOKEN", "Invalid or expired reset token")
          )
        );
    }

    if (decoded.type !== "password_reset") {
      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("INVALID_TOKEN", "Invalid reset token")
          )
        );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    await prisma.user.update({
      where: { user_uuid: decoded.userId },
      data: {
        password_hash: hashedPassword,
        insert_ts: new Date(), // Update last modified time
      },
    });

    console.log("Password reset successful for:", decoded.email);

    res.json(
      createApiResponse(true, {
        message: "Password has been reset successfully",
      })
    );
  } catch (error) {
    console.error("Reset password error:", error);
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

// User verification endpoint
app.post("/api/v1/authentication/user-verification", async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        user_fact_id: true,
        user_uuid: true,
        email: true,
        status: true,
        role_value: true,
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

    if (user.status !== "ACTIVE") {
      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("ACCOUNT_INACTIVE", "Account is inactive")
          )
        );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.user_uuid,
        email: user.email,
        role: user.role_value,
      },
      process.env.JWT_SECRET ||
        "your-super-secret-jwt-key-change-this-in-production-2024",
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    // Update last login
    await prisma.user.update({
      where: { user_uuid: user.user_uuid },
      data: { insert_ts: new Date() },
    });

    res.json(
      createApiResponse(true, {
        user: {
          id: user.user_uuid,
          email: user.email,
          name: user.full_name || `${user.first_name} ${user.last_name}`,
          role: user.role_value,
          isActive: user.status === "ACTIVE",
          department: user.department,
          branch: user.branch_name,
        },
        token,
      })
    );
  } catch (error) {
    console.error("User verification error:", error);
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
app.listen(PORT, () => {
  console.log(`🚀 Auth service running on port ${PORT}`);
  console.log(
    `📊 Database: ${
      process.env.DATABASE_URL ||
      "postgresql://postgres:password@localhost:5432/pm_platform"
    }`
  );
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down auth service...");
  await prisma.$disconnect();
  process.exit(0);
});
