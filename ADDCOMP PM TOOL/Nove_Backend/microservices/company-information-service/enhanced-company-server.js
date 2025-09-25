const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app = express();
const PORT = process.env.COMPANY_SERVICE_PORT || process.env.PORT || 3005;

// Initialize Prisma client
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8005",
      "http://localhost:8004",
      "http://localhost:5173",
      "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Request-ID",
      "auth-token",
    ],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests, please try again later",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
app.use(morgan("combined"));

// Debug middleware to log all requests
app.use((req, res, next) => {
  // Only log important requests
  if (
    req.originalUrl.includes("/upload-files") ||
    req.originalUrl.includes("/upsert-company-information")
  ) {
    console.log(`🔍 [COMPANY SERVICE] ${req.method} ${req.originalUrl}`);
    console.log(`🔍 [COMPANY SERVICE] Headers:`, req.headers);
    console.log(`🔍 [COMPANY SERVICE] Body:`, req.body);
  }
  next();
});

// Helper functions
const createApiResponse = (success, data, error = null) => ({
  success,
  data,
  error,
});

const createApiError = (code, message) => ({
  code,
  message,
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Company Information service is running",
    timestamp: new Date().toISOString(),
  });
});

// =============================================
// COMPANY INFORMATION ENDPOINTS
// =============================================

// Get company information (main endpoint)
app.get(
  "/api/v1/companyInformation/get-company-information",
  async (req, res) => {
    console.log("🏢 Company information request received");
    console.log("🏢 Query params:", req.query);

    try {
      const { pageNo = 1, itemPerPage = 10 } = req.query;
      const page = parseInt(pageNo, 10);
      const limit = parseInt(itemPerPage, 10);
      const offset = (page - 1) * limit;

      const totalCount = await prisma.companyInformation.count();

      const companyInfo = await prisma.companyInformation.findMany({
        orderBy: { created_at: "desc" },
        skip: offset,
        take: limit,
      });

      // Transform data to match expected format
      const transformedData = companyInfo.map((info, index) => ({
        company_information_id: info.id,
        company_information_unique_id: info.id,
        company_uuid: `company-${info.id}-${Date.now()}`,
        company_name: info.company_name,
        company_title: info.company_title,
        company_description: info.company_description,
        address: null,
        unit_or_suite: null,
        city: null,
        province_or_state: null,
        postal_code: null,
        country: null,
        phone: null,
        telephone: null,
        fax: null,
        default_language: "ENGLISH",
        email: null,
        accounts_email: null,
        cl_email: null,
        pl_email: null,
        default_tax_region: null,
        pst_or_gst_or_vat_number: null,
        bahamas_premium_tax: null,
        logo: info.preview_logo,
        fav_icon: info.preview_fav_icon,
        adsense_header_code: info.adsense_header_code,
        about: info.company_description,
        status: "ACTIVE",
        created_by_uuid: null,
        created_by_name: "System",
        modified_by_uuid: null,
        modified_by_name: "System",
        create_ts: info.created_at,
        insert_ts: info.updated_at,
        preview_logo: info.preview_logo,
        preview_fav_icon: info.preview_fav_icon,
      }));

      const response = {
        message: "Company Information: ",
        totalRecords: totalCount,
        currentRecords: transformedData.length,
        data: transformedData,
      };

      console.log(
        `✅ Found ${transformedData.length} company information records`
      );
      res.json(response);
    } catch (error) {
      console.error("❌ Error fetching company information:", error);
      res.status(500).json({
        success: false,
        data: null,
        error: {
          code: "INTERNAL_ERROR",
          message: "Internal server error",
        },
      });
    }
  }
);

// Get public company information
app.get(
  "/api/v1/companyInformation/get-public-company-information",
  async (req, res) => {
    console.log("🏢 Public company information request received");
    try {
      const companyInfo = await prisma.companyInformation.findFirst({
        orderBy: { created_at: "desc" },
      });

      if (!companyInfo) {
        return res.json({
          success: true,
          message: "Company information retrieved successfully",
          data: {
            company_name: "ADDCOMPOSITES OY",
            company_title: "Immigration Services",
            company_description: "Professional immigration consulting services",
            preview_logo: "/assets/logo/logo-full.svg",
            preview_fav_icon: "/assets/logo/logo-single.svg",
            adsense_header_code: null,
          },
        });
      }

      res.json({
        success: true,
        message: "Company information retrieved successfully",
        data: companyInfo,
      });
    } catch (error) {
      console.error("❌ Error fetching company information:", error);
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
  }
);

// Upsert company information (create or update)
app.post(
  "/api/v1/companyInformation/upsert-company-information",
  async (req, res) => {
    console.log("🏢 Upsert company information request received");
    console.log("🏢 Request body:", req.body);

    try {
      const {
        company_name,
        company_title,
        company_description,
        preview_logo,
        preview_fav_icon,
        adsense_header_code,
      } = req.body;

      if (!company_name) {
        return res.status(400).json({
          success: false,
          data: null,
          error: {
            code: "VALIDATION_ERROR",
            message: "company_name is required",
          },
        });
      }

      // Check if company info exists
      let companyInfo = await prisma.companyInformation.findFirst();

      if (companyInfo) {
        // Prepare update data - only include fields that are provided
        const updateData = {
          company_name,
          updated_at: new Date(),
        };

        // Only update fields that are provided (not null/undefined)
        if (company_title !== undefined)
          updateData.company_title = company_title;
        if (company_description !== undefined)
          updateData.company_description = company_description;
        if (preview_logo !== undefined)
          updateData.preview_logo = preview_logo === "" ? null : preview_logo;
        if (preview_fav_icon !== undefined)
          updateData.preview_fav_icon =
            preview_fav_icon === "" ? null : preview_fav_icon;
        if (adsense_header_code !== undefined)
          updateData.adsense_header_code = adsense_header_code;

        // Update existing
        companyInfo = await prisma.companyInformation.update({
          where: { id: companyInfo.id },
          data: updateData,
        });
        console.log(
          `✅ Updated company information: ${companyInfo.company_name}`
        );
      } else {
        // Prepare create data - only include fields that are provided
        const createData = {
          company_name,
          created_at: new Date(),
          updated_at: new Date(),
        };

        // Only include fields that are provided (not null/undefined)
        if (company_title !== undefined)
          createData.company_title = company_title;
        if (company_description !== undefined)
          createData.company_description = company_description;
        if (preview_logo !== undefined)
          createData.preview_logo = preview_logo === "" ? null : preview_logo;
        if (preview_fav_icon !== undefined)
          createData.preview_fav_icon =
            preview_fav_icon === "" ? null : preview_fav_icon;
        if (adsense_header_code !== undefined)
          createData.adsense_header_code = adsense_header_code;

        // Create new
        companyInfo = await prisma.companyInformation.create({
          data: createData,
        });
        console.log(
          `✅ Created new company information: ${companyInfo.company_name}`
        );
      }

      const response = {
        message: "Company information upserted successfully",
        data: companyInfo,
      };

      res.json(response);
    } catch (error) {
      console.error("❌ Error upserting company information:", error);
      res.status(500).json({
        success: false,
        data: null,
        error: {
          code: "INTERNAL_ERROR",
          message: "Internal server error",
        },
      });
    }
  }
);

// Update company information
app.put(
  "/api/v1/companyInformation/update-company-information",
  async (req, res) => {
    console.log("🏢 Update company information request received");
    console.log("🏢 Request body:", req.body);

    try {
      const {
        company_name,
        company_title,
        company_description,
        preview_logo,
        preview_fav_icon,
        adsense_header_code,
      } = req.body;

      // Check if company info exists
      let companyInfo = await prisma.companyInformation.findFirst();

      if (companyInfo) {
        // Update existing
        companyInfo = await prisma.companyInformation.update({
          where: { id: companyInfo.id },
          data: {
            company_name,
            company_title,
            company_description,
            preview_logo,
            preview_fav_icon,
            adsense_header_code,
            updated_at: new Date(),
          },
        });
      } else {
        // Create new
        companyInfo = await prisma.companyInformation.create({
          data: {
            company_name,
            company_title,
            company_description,
            preview_logo,
            preview_fav_icon,
            adsense_header_code,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
      }

      res.json({
        success: true,
        message: "Company information updated successfully",
        data: companyInfo,
      });
    } catch (error) {
      console.error("❌ Error updating company information:", error);
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
  }
);

// =============================================
// FILE UPLOAD CONFIGURATION
// =============================================

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and common document types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images and documents are allowed!"));
    }
  },
});

// =============================================
// FILE UPLOAD ENDPOINTS
// =============================================

// Upload files endpoint
app.post(
  "/api/v1/general/upload-files",
  (req, res, next) => {
    upload.single("files")(req, res, (err) => {
      if (err) {
        console.error("❌ Multer error:", err);
        return res.status(400).json({
          success: false,
          data: null,
          error: {
            code: "FILE_UPLOAD_ERROR",
            message: err.message,
          },
        });
      }
      next();
    });
  },
  async (req, res) => {
    console.log("📁 File upload request received");
    console.log("📁 File:", req.file);
    console.log("📁 Body:", req.body);

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          data: null,
          error: {
            code: "VALIDATION_ERROR",
            message: "No file uploaded",
          },
        });
      }

      const { module_name, as_payload } = req.body;

      if (!module_name) {
        return res.status(400).json({
          success: false,
          data: null,
          error: {
            code: "VALIDATION_ERROR",
            message: "module_name is required",
          },
        });
      }

      let payload = {};
      if (as_payload) {
        try {
          payload = JSON.parse(as_payload);
        } catch (error) {
          console.error("Error parsing as_payload:", error);
          payload = {};
        }
      }

      // Generate file URL (in production, this would be a proper CDN URL)
      const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;

      // Prepare response data
      const responseData = {
        file_id: req.file.filename,
        original_name: req.file.originalname,
        file_name: req.file.filename,
        file_size: req.file.size,
        file_type: req.file.mimetype,
        file_url: fileUrl,
        module_name: module_name,
        payload: payload,
        uploaded_at: new Date().toISOString(),
        status: "UPLOADED",
      };

      const response = {
        message: "File uploaded successfully",
        data: responseData,
      };

      console.log(`✅ File uploaded successfully: ${req.file.originalname}`);
      res.json(response);
    } catch (error) {
      console.error("❌ Error uploading file:", error);
      res.status(500).json({
        success: false,
        data: null,
        error: {
          code: "INTERNAL_ERROR",
          message: "Internal server error",
        },
      });
    }
  }
);

// Serve uploaded files
app.use("/uploads", express.static(uploadsDir));

// =============================================
// BRANCH OFFICE ENDPOINTS
// =============================================

// Get all branch offices
app.get("/api/v1/branch/get-branches", async (req, res) => {
  console.log("🏢 Get branches request received");
  console.log("🏢 Query params:", req.query);

  try {
    const { status, pageNo = 1, itemPerPage = 10 } = req.query;

    const whereClause = status ? { status } : {};

    const [branches, totalCount] = await Promise.all([
      prisma.branchOffices.findMany({
        where: whereClause,
        skip: (parseInt(pageNo) - 1) * parseInt(itemPerPage),
        take: parseInt(itemPerPage),
        orderBy: { create_ts: "desc" },
      }),
      prisma.branchOffices.count({ where: whereClause }),
    ]);

    res.json({
      success: true,
      message: "Branches retrieved successfully",
      totalRecords: totalCount,
      currentRecords: branches.length,
      data: branches,
    });
  } catch (error) {
    console.error("❌ Error fetching branches:", error);
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

// Create branch office
app.post("/api/v1/branch/create-branch", async (req, res) => {
  console.log("🏢 Create branch request received");
  console.log("🏢 Request body:", req.body);

  try {
    const {
      branch_name,
      branch_code,
      branch_address,
      city,
      province_or_state,
      postal_code,
      country,
      phone,
      email,
      manager_uuid,
      manager_name,
      status = "ACTIVE",
    } = req.body;

    // Validate required fields
    if (!branch_name || !branch_code) {
      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            null,
            createApiError(
              "MISSING_REQUIRED_FIELD",
              "Branch name and code are required"
            )
          )
        );
    }

    const newBranch = await prisma.branchOffices.create({
      data: {
        branch_name,
        branch_code,
        branch_address,
        city,
        province_or_state,
        postal_code,
        country,
        phone,
        email,
        manager_uuid,
        manager_name,
        status,
        created_by_uuid: req.headers["auth-token"]
          ? JSON.parse(
              Buffer.from(
                req.headers["auth-token"].split(".")[1],
                "base64"
              ).toString()
            ).userId
          : null,
        created_by_name: "System",
        create_ts: new Date(),
        insert_ts: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Branch created successfully",
      data: newBranch,
    });
  } catch (error) {
    console.error("❌ Error creating branch:", error);
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

// Update branch office
app.put("/api/v1/branch/update-branch/:branchUuid", async (req, res) => {
  console.log("🏢 Update branch request received");
  console.log("🏢 Branch UUID:", req.params.branchUuid);
  console.log("🏢 Request body:", req.body);

  try {
    const { branchUuid } = req.params;
    const updateData = req.body;

    const updatedBranch = await prisma.branchOffices.update({
      where: { branch_uuid: branchUuid },
      data: {
        ...updateData,
        modified_by_uuid: req.headers["auth-token"]
          ? JSON.parse(
              Buffer.from(
                req.headers["auth-token"].split(".")[1],
                "base64"
              ).toString()
            ).userId
          : null,
        modified_by_name: "System",
        insert_ts: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Branch updated successfully",
      data: updatedBranch,
    });
  } catch (error) {
    console.error("❌ Error updating branch:", error);
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

// Delete branch office
app.delete("/api/v1/branch/delete-branch/:branchUuid", async (req, res) => {
  console.log("🏢 Delete branch request received");
  console.log("🏢 Branch UUID:", req.params.branchUuid);

  try {
    const { branchUuid } = req.params;

    await prisma.branchOffices.delete({
      where: { branch_uuid: branchUuid },
    });

    res.json({
      success: true,
      message: "Branch deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting branch:", error);
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

// =============================================
// USERS AND STAFF ENDPOINTS
// =============================================

// Get all users (enhanced version)
app.get("/api/v1/user/get-users", async (req, res) => {
  console.log("👥 Get users request received");
  console.log("👥 Query params:", req.query);

  try {
    const {
      status,
      role_value,
      department,
      branch_name,
      pageNo = 1,
      itemPerPage = 10,
    } = req.query;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (role_value) whereClause.role_value = role_value;
    if (department) whereClause.department = department;
    if (branch_name) whereClause.branch_name = branch_name;

    const [users, totalCount] = await Promise.all([
      prisma.users.findMany({
        where: whereClause,
        skip: (parseInt(pageNo) - 1) * parseInt(itemPerPage),
        take: parseInt(itemPerPage),
        orderBy: { create_ts: "desc" },
      }),
      prisma.users.count({ where: whereClause }),
    ]);

    res.json({
      success: true,
      message: "Users retrieved successfully",
      totalRecords: totalCount,
      currentRecords: users.length,
      data: users,
    });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
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

// =============================================
// SECURITY SETTINGS ENDPOINTS
// =============================================

// Get security settings
app.get("/api/v1/security/get-security-settings", async (req, res) => {
  console.log("🔒 Get security settings request received");
  console.log("🔒 Query params:", req.query);

  try {
    const { category } = req.query;

    const whereClause = category ? { category } : {};

    const settings = await prisma.securitySettings.findMany({
      where: whereClause,
      orderBy: { category: "asc" },
    });

    res.json({
      success: true,
      message: "Security settings retrieved successfully",
      data: settings,
    });
  } catch (error) {
    console.error("❌ Error fetching security settings:", error);
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

// Update security settings
app.put("/api/v1/security/update-security-settings", async (req, res) => {
  console.log("🔒 Update security settings request received");
  console.log("🔒 Request body:", req.body);

  try {
    const { settings } = req.body; // Array of settings to update

    const updatePromises = settings.map(async (setting) => {
      return prisma.securitySettings.upsert({
        where: { setting_name: setting.setting_name },
        update: {
          setting_value: setting.setting_value,
          modified_by_uuid: req.headers["auth-token"]
            ? JSON.parse(
                Buffer.from(
                  req.headers["auth-token"].split(".")[1],
                  "base64"
                ).toString()
              ).userId
            : null,
          modified_by_name: "System",
          insert_ts: new Date(),
        },
        create: {
          setting_name: setting.setting_name,
          setting_value: setting.setting_value,
          setting_type: setting.setting_type || "TEXT",
          category: setting.category || "AUTHENTICATION",
          description: setting.description,
          is_encrypted: setting.is_encrypted || true,
          status: "ACTIVE",
          created_by_uuid: req.headers["auth-token"]
            ? JSON.parse(
                Buffer.from(
                  req.headers["auth-token"].split(".")[1],
                  "base64"
                ).toString()
              ).userId
            : null,
          created_by_name: "System",
          create_ts: new Date(),
          insert_ts: new Date(),
        },
      });
    });

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: "Security settings updated successfully",
    });
  } catch (error) {
    console.error("❌ Error updating security settings:", error);
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

// =============================================
// APPLICATION SETTINGS ENDPOINTS
// =============================================

// Get application settings
app.get("/api/v1/settings/get-application-settings", async (req, res) => {
  console.log("⚙️ Get application settings request received");
  console.log("⚙️ Query params:", req.query);

  try {
    const { category, is_public } = req.query;

    const whereClause = {};
    if (category) whereClause.category = category;
    if (is_public !== undefined) whereClause.is_public = is_public === "true";

    const settings = await prisma.applicationSettings.findMany({
      where: whereClause,
      orderBy: { category: "asc" },
    });

    res.json({
      success: true,
      message: "Application settings retrieved successfully",
      data: settings,
    });
  } catch (error) {
    console.error("❌ Error fetching application settings:", error);
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

// Update application settings
app.put("/api/v1/settings/update-application-settings", async (req, res) => {
  console.log("⚙️ Update application settings request received");
  console.log("⚙️ Request body:", req.body);

  try {
    const { settings } = req.body; // Array of settings to update

    const updatePromises = settings.map(async (setting) => {
      return prisma.applicationSettings.upsert({
        where: { setting_key: setting.setting_key },
        update: {
          setting_value: setting.setting_value,
          modified_by_uuid: req.headers["auth-token"]
            ? JSON.parse(
                Buffer.from(
                  req.headers["auth-token"].split(".")[1],
                  "base64"
                ).toString()
              ).userId
            : null,
          modified_by_name: "System",
          insert_ts: new Date(),
        },
        create: {
          setting_key: setting.setting_key,
          setting_value: setting.setting_value,
          setting_type: setting.setting_type || "TEXT",
          category: setting.category || "GENERAL",
          description: setting.description,
          is_encrypted: setting.is_encrypted || false,
          is_public: setting.is_public || false,
          status: "ACTIVE",
          created_by_uuid: req.headers["auth-token"]
            ? JSON.parse(
                Buffer.from(
                  req.headers["auth-token"].split(".")[1],
                  "base64"
                ).toString()
              ).userId
            : null,
          created_by_name: "System",
          create_ts: new Date(),
          insert_ts: new Date(),
        },
      });
    });

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: "Application settings updated successfully",
    });
  } catch (error) {
    console.error("❌ Error updating application settings:", error);
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

// =============================================
// EXISTING ENDPOINTS (for backward compatibility)
// =============================================

// Get Record Counts
app.get("/api/v1/general/get-record-counts", (req, res) => {
  console.log("📊 Get record counts request received");
  console.log("📊 Query params:", req.query);

  const { table_name } = req.query;

  if (!table_name) {
    return res.status(400).json({
      success: false,
      error: {
        code: "MISSING_REQUIRED_FIELD",
        message: "table_name parameter is required",
      },
    });
  }

  // Mock record counts based on table name - return array format expected by frontend
  let recordCounts = [];
  let totalRecords = 0;

  switch (table_name) {
    case "latest_crs_draws":
      recordCounts = [
        { status: "ACTIVE", count: 0 },
        { status: "DEAD", count: 0 },
        { status: "OPPORTUNITY", count: 0 },
      ];
      totalRecords = 0;
      break;
    case "users":
      recordCounts = [
        { status: "ACTIVE", count: 8 },
        { status: "INACTIVE", count: 0 },
        { status: "PENDING", count: 0 },
      ];
      totalRecords = 8;
      break;
    case "task_module_wise":
      recordCounts = [
        { status: "ACTIVE", count: 4 },
        { status: "PENDING", count: 0 },
        { status: "COMPLETED", count: 0 },
      ];
      totalRecords = 4;
      break;
    case "projects":
      recordCounts = [
        { status: "ACTIVE", count: 0 },
        { status: "COMPLETED", count: 0 },
        { status: "CANCELLED", count: 0 },
      ];
      totalRecords = 0;
      break;
    case "leads":
      recordCounts = [
        { status: "ACTIVE", count: 0 },
        { status: "CONVERTED", count: 0 },
        { status: "LOST", count: 0 },
      ];
      totalRecords = 0;
      break;
    default:
      recordCounts = [
        { status: "ACTIVE", count: 0 },
        { status: "INACTIVE", count: 0 },
      ];
      totalRecords = 0;
  }

  res.json({
    success: true,
    message: `Record counts for ${table_name} retrieved successfully`,
    totalRecords: totalRecords,
    data: recordCounts,
  });
});

// Get Environment Configuration
app.get(
  "/api/v1/companyInformation/get-environment-configuration",
  (req, res) => {
    console.log("⚙️ Environment configuration request received");

    res.json({
      success: true,
      message: "Environment configuration retrieved successfully",
      data: {
        environment: process.env.NODE_ENV || "development",
        version: "1.0.0",
        features: {
          authentication: true,
          fileUpload: true,
          notifications: true,
          analytics: true,
        },
        limits: {
          maxFileSize: "10MB",
          maxUsers: 1000,
          maxProjects: 500,
        },
      },
    });
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res
    .status(500)
    .json(
      createApiResponse(
        false,
        null,
        createApiError("INTERNAL_ERROR", "Internal server error")
      )
    );
});

// =============================================
// Get Role Module Content Access Permission
// =============================================

app.get(
  "/api/v1/security/get-role-module-content-access-permission",
  async (req, res) => {
    console.log(
      "🔒 Get role module content access permission request received"
    );
    console.log("🔒 Query params:", req.query);

    try {
      const { role_uuid } = req.query;

      if (!role_uuid) {
        return res.status(400).json({
          success: false,
          data: null,
          error: {
            code: "VALIDATION_ERROR",
            message: "role_uuid is required",
          },
        });
      }

      // Get role information
      const role = await prisma.roles.findUnique({
        where: {
          role_uuid: role_uuid,
          status: "ACTIVE",
        },
        select: {
          role_name: true,
          role_group: true,
          status: true,
        },
      });

      if (!role) {
        return res.status(404).json({
          success: false,
          data: null,
          error: {
            code: "NOT_FOUND",
            message: "Role not found",
          },
        });
      }

      // Get role module permissions
      const roleModules = await prisma.roleModule.findMany({
        where: {
          role_uuid: role_uuid,
          status: "ACTIVE",
        },
        select: {
          role_module_uuid: true,
          module_uuid: true,
          module_name: true,
          submodule_name: true,
          table_name: true,
          map_column_user_uuid: true,
          column_relation_options: true,
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
        },
        orderBy: { module_name: "asc" },
      });

      const response = {
        message: "Record Access Permission",
        data: {
          role_name: role.role_name,
          role_group: role.role_group,
          status: role.status,
          data: roleModules,
        },
      };

      console.log(
        `✅ Found ${roleModules.length} role module permissions for role ${role_uuid}`
      );
      res.json(response);
    } catch (error) {
      console.error("❌ Error fetching role module permissions:", error);
      res.status(500).json({
        success: false,
        data: null,
        error: {
          code: "INTERNAL_ERROR",
          message: "Internal server error",
        },
      });
    }
  }
);

// =============================================
// Get Roles
// =============================================

app.get("/api/v1/security/get-roles", async (req, res) => {
  console.log("🔒 Get roles request received");
  console.log("🔒 Query params:", req.query);

  try {
    const { pageNo = 1, itemPerPage = 10 } = req.query;
    const page = parseInt(pageNo, 10);
    const limit = parseInt(itemPerPage, 10);
    const offset = (page - 1) * limit;

    const totalCount = await prisma.roles.count({
      where: { status: "ACTIVE" },
    });

    const roles = await prisma.roles.findMany({
      where: { status: "ACTIVE" },
      orderBy: { role_name: "asc" },
      skip: offset,
      take: limit,
      select: {
        role_id: true,
        role_uuid: true,
        role_name: true,
        role_value: true,
        role_group: true,
        status: true,
        created_by_uuid: true,
        created_by_name: true,
        modified_by_uuid: true,
        modified_by_name: true,
        create_ts: true,
        insert_ts: true,
      },
    });

    const response = {
      message: "Role ",
      totalRecords: totalCount,
      currentRecords: roles.length,
      data: roles,
    };

    console.log(`✅ Found ${roles.length} roles`);
    res.json(response);
  } catch (error) {
    console.error("❌ Error fetching roles:", error);
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

// =============================================
// Get Role Groups
// =============================================

app.get("/api/v1/security/get-role-group", async (req, res) => {
  console.log("🔒 Get role groups request received");
  console.log("🔒 Query params:", req.query);

  try {
    const { pageNo = 1, itemPerPage = 10 } = req.query;
    const page = parseInt(pageNo, 10);
    const limit = parseInt(itemPerPage, 10);
    const offset = (page - 1) * limit;

    // Get total count
    const totalCount = await prisma.roleGroups.count({
      where: { status: "ACTIVE" },
    });

    // Get role groups with pagination
    const roleGroups = await prisma.roleGroups.findMany({
      where: { status: "ACTIVE" },
      orderBy: { role_group: "asc" },
      skip: offset,
      take: limit,
      select: {
        role_group_id: true,
        role_group_unique_id: true,
        role_group_uuid: true,
        role_group: true,
        status: true,
        created_by_uuid: true,
        create_ts: true,
        insert_ts: true,
      },
    });

    const response = {
      message: "Role Groups ",
      totalRecords: totalCount,
      currentRecords: roleGroups.length,
      data: roleGroups,
    };

    console.log(`✅ Found ${roleGroups.length} role groups`);
    res.json(response);
  } catch (error) {
    console.error("❌ Error fetching role groups:", error);
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

// =============================================
// Upsert Role Group
// =============================================

app.post("/api/v1/security/upsert-role-group", async (req, res) => {
  console.log("🔒 Upsert role group request received");
  console.log("🔒 Request body:", req.body);

  try {
    const { role_group_uuid, role_group, status = "ACTIVE" } = req.body;

    if (!role_group) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          message: "role_group is required",
        },
      });
    }

    let roleGroupResult;
    let isUpdate = false;

    if (role_group_uuid) {
      // Check if role group exists
      const existingRoleGroup = await prisma.roleGroups.findUnique({
        where: { role_group_uuid: role_group_uuid },
      });

      if (existingRoleGroup) {
        // Update existing role group
        roleGroupResult = await prisma.roleGroups.update({
          where: { role_group_uuid: role_group_uuid },
          data: {
            role_group: role_group,
            status: status,
            insert_ts: new Date(),
          },
        });
        isUpdate = true;
        console.log(`✅ Updated role group: ${role_group_uuid}`);
      } else {
        // Create new role group with provided UUID
        const maxUniqueId = await prisma.roleGroups.findFirst({
          orderBy: { role_group_unique_id: "desc" },
          select: { role_group_unique_id: true },
        });
        const nextUniqueId = (maxUniqueId?.role_group_unique_id || 0) + 1;

        roleGroupResult = await prisma.roleGroups.create({
          data: {
            role_group_uuid: role_group_uuid,
            role_group: role_group,
            status: status,
            role_group_unique_id: nextUniqueId,
            created_by_uuid: req.body.created_by_uuid || null,
            create_ts: new Date(),
            insert_ts: new Date(),
          },
        });
        console.log(`✅ Created new role group with UUID: ${role_group_uuid}`);
      }
    } else {
      // Create new role group with generated UUID
      const maxUniqueId = await prisma.roleGroups.findFirst({
        orderBy: { role_group_unique_id: "desc" },
        select: { role_group_unique_id: true },
      });
      const nextUniqueId = (maxUniqueId?.role_group_unique_id || 0) + 1;

      roleGroupResult = await prisma.roleGroups.create({
        data: {
          role_group: role_group,
          status: status,
          role_group_unique_id: nextUniqueId,
          created_by_uuid: req.body.created_by_uuid || null,
          create_ts: new Date(),
          insert_ts: new Date(),
        },
      });
      console.log(
        `✅ Created new role group with generated UUID: ${roleGroupResult.role_group_uuid}`
      );
    }

    const response = {
      message: isUpdate
        ? "Role group updated successfully"
        : "Role group created successfully",
      data: {
        role_group_id: roleGroupResult.role_group_id,
        role_group_unique_id: roleGroupResult.role_group_unique_id,
        role_group_uuid: roleGroupResult.role_group_uuid,
        role_group: roleGroupResult.role_group,
        status: roleGroupResult.status,
        created_by_uuid: roleGroupResult.created_by_uuid,
        create_ts: roleGroupResult.create_ts,
        insert_ts: roleGroupResult.insert_ts,
      },
    };

    console.log(
      `✅ Role group ${isUpdate ? "updated" : "created"} successfully`
    );
    res.json(response);
  } catch (error) {
    console.error("❌ Error upserting role group:", error);
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

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json(
      createApiResponse(
        false,
        null,
        createApiError("NOT_FOUND", "Route not found")
      )
    );
});

// Start server
app.listen(PORT, () => {
  console.log(
    `🏢 Enhanced Company Information service running on port ${PORT}`
  );
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(
    `🏢 Company Info: http://localhost:${PORT}/api/v1/companyInformation/get-public-company-information`
  );
  console.log(
    `🏢 Branch Offices: http://localhost:${PORT}/api/v1/branch/get-branches`
  );
  console.log(`👥 Users: http://localhost:${PORT}/api/v1/user/get-users`);
  console.log(
    `🔒 Security: http://localhost:${PORT}/api/v1/security/get-security-settings`
  );
  console.log(
    `⚙️ Settings: http://localhost:${PORT}/api/v1/settings/get-application-settings`
  );
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 Shutting down Company Information service...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🛑 Shutting down Company Information service...");
  await prisma.$disconnect();
  process.exit(0);
});
