const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3005;

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
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
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

// Health check route
app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "company-information-service",
    status: "healthy",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

// Handle preflight OPTIONS requests
app.options("*", (req, res) => {
  console.log("🔄 OPTIONS preflight request received from:", req.get("origin"));
  res.status(200).end();
});

// Company Information Routes

// Get Public Company Information
app.get(
  "/api/v1/companyInformation/get-public-company-information",
  (req, res) => {
    console.log("🏢 Public company information request received");

    res.json({
      message: "Company Information Record",
      totalRecords: 1,
      currentRecords: 1,
      data: [
        {
          company_name: "Addcomposites oy",
          preview_logo:
            "https://cdn.prod.website-files.com/65d8589d1d07ae7c06b4b253/65dc150bf8f7695a87422fa3_hdr-logo.png",
          preview_fav_icon:
            "https://cdn.prod.website-files.com/65d8589d1d07ae7c06b4b253/65dc150bf8f7695a87422fa3_hdr-logo.png",
          company_title: null,
          company_description: null,
          adsense_header_code: null,
        },
      ],
    });
  }
);

// Get Company Information (Private)
app.get("/api/v1/companyInformation/get-company-information", (req, res) => {
  console.log("🏢 Company information request received");

  res.json({
    message: "Company Information Record",
    totalRecords: 1,
    currentRecords: 1,
    data: [
      {
        company_name: "Addcomposites oy",
        preview_logo:
          "https://cdn.prod.website-files.com/65d8589d1d07ae7c06b4b253/65dc150bf8f7695a87422fa3_hdr-logo.png",
        preview_fav_icon:
          "https://cdn.prod.website-files.com/65d8589d1d07ae7c06b4b253/65dc150bf8f7695a87422fa3_hdr-logo.png",
        company_title: "Leading Composites Services",
        company_description:
          "Additive Manufacturing for Lightweight Structural Components",
        adsense_header_code: null,
        created_at: "2025-01-29T05:06:32.000Z",
        updated_at: "2025-01-29T05:06:32.000Z",
      },
    ],
  });
});

// Upsert Company Information
app.post(
  "/api/v1/companyInformation/upsert-company-information",
  (req, res) => {
    console.log("🏢 Upsert company information request received:", req.body);

    const {
      company_name,
      preview_logo,
      preview_fav_icon,
      company_title,
      company_description,
      adsense_header_code,
    } = req.body;

    // Basic validation
    if (!company_name) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_REQUIRED_FIELD",
          message: "Company name is required",
        },
      });
    }

    // Mock upsert response
    res.json({
      success: true,
      message: "Company information updated successfully",
      data: {
        id: "1",
        company_name: company_name,
        preview_logo: preview_logo || null,
        preview_fav_icon: preview_fav_icon || null,
        company_title: company_title || null,
        company_description: company_description || null,
        adsense_header_code: adsense_header_code || null,
        updated_at: new Date().toISOString(),
      },
    });
  }
);

// Get Environment Configuration
app.get(
  "/api/v1/companyInformation/get-environment-configuration",
  (req, res) => {
    console.log("⚙️ Environment configuration request received");

    res.json({
      message: "Environment Configuration Record",
      totalRecords: 1,
      currentRecords: 1,
      data: [
        {
          environment: "development",
          api_base_url: "http://localhost:3001",
          frontend_url: "http://localhost:8005",
          database_url: "postgresql://user:password@localhost:5432/pm_platform",
          redis_url: "redis://localhost:6379",
          jwt_secret: "your-jwt-secret-key-development",
          google_client_id: "your-google-client-id",
          google_client_secret: "your-google-client-secret",
          cors_origin: "http://localhost:8005",
          created_at: "2025-01-29T05:06:32.000Z",
          updated_at: "2025-01-29T05:06:32.000Z",
        },
      ],
    });
  }
);

// Upsert Environment Configuration
app.post(
  "/api/v1/companyInformation/upsert-environment-configuration",
  (req, res) => {
    console.log(
      "⚙️ Upsert environment configuration request received:",
      req.body
    );

    const {
      environment,
      api_base_url,
      frontend_url,
      database_url,
      redis_url,
      jwt_secret,
      google_client_id,
      google_client_secret,
      cors_origin,
    } = req.body;

    // Basic validation
    if (!environment) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_REQUIRED_FIELD",
          message: "Environment is required",
        },
      });
    }

    // Mock upsert response
    res.json({
      success: true,
      message: "Environment configuration updated successfully",
      data: {
        id: "1",
        environment: environment,
        api_base_url: api_base_url || "http://localhost:3001",
        frontend_url: frontend_url || "http://localhost:8005",
        database_url:
          database_url ||
          "postgresql://user:password@localhost:5432/pm_platform",
        redis_url: redis_url || "redis://localhost:6379",
        jwt_secret: jwt_secret || "your-jwt-secret-key-development",
        google_client_id: google_client_id || "your-google-client-id",
        google_client_secret:
          google_client_secret || "your-google-client-secret",
        cors_origin: cors_origin || "http://localhost:8005",
        updated_at: new Date().toISOString(),
      },
    });
  }
);

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
  console.log(`🏢 Company Information service running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(
    `🏢 Public Company Info: http://localhost:${PORT}/api/v1/companyInformation/get-public-company-information`
  );
  console.log(
    `⚙️ Environment Config: http://localhost:${PORT}/api/v1/companyInformation/get-environment-configuration`
  );
});
