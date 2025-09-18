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
          company_name: "Nova World Immigration Services Incorporated",
          preview_logo:
            "https://nova-app-test.s3.ca-central-1.amazonaws.com/company_information/Nova_Worlds_Private_Limited/logoNova_Worlds_Private_Limited2025-01-29_05-06-32.png",
          preview_fav_icon:
            "https://nova-app-test.s3.ca-central-1.amazonaws.com/company_information/Nova_Worlds_Private_Limited/nova_app_logoNova_Worlds_Private_Limited2025-01-29_04-36-50.png",
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
    message: "Company Information: ",
    totalRecords: 1,
    currentRecords: 1,
    data: [
      {
        company_information_id: 25,
        company_information_unique_id: 1,
        company_uuid: "f259059b-2fa0-4448-a2a7-193192ca6eac",
        company_name: "Nova World Immigration Services Incorporated",
        company_title: null,
        company_description: null,
        address: null,
        unit_or_suite: "4A",
        city: "Mississauga",
        province_or_state: "Ontario",
        postal_code: "L4T1G3",
        country: "Canada",
        phone: " 1 647 404 6682",
        telephone: " 1 647 403 6682",
        fax: "",
        default_language: "ENGLISH",
        email: null,
        accounts_email: "info@nwimmigration.ca",
        cl_email: null,
        pl_email: null,
        default_tax_region: "ON",
        pst_or_gst_or_vat_number: null,
        bahamas_premium_tax: null,
        logo: "company_information/Nova_Worlds_Private_Limited/logoNova_Worlds_Private_Limited2025-01-29_05-06-32.png",
        fav_icon: "company_information/Nova_Worlds_Private_Limited/nova_app_logoNova_Worlds_Private_Limited2025-01-29_04-36-50.png",
        adsense_header_code: null,
        about: null,
        status: "ACTIVE",
        created_by_uuid: "77c189b1-403e-4ebc-a6cf-4a35fbbc0937",
        created_by_name: "Kamal",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-01-06T09:09:02.000Z",
        insert_ts: "2025-07-01T13:15:09.000Z",
        preview_logo: "https://nova-app-test.s3.ca-central-1.amazonaws.com/company_information/Nova_Worlds_Private_Limited/logoNova_Worlds_Private_Limited2025-01-29_05-06-32.png",
        preview_fav_icon: "https://nova-app-test.s3.ca-central-1.amazonaws.com/company_information/Nova_Worlds_Private_Limited/nova_app_logoNova_Worlds_Private_Limited2025-01-29_04-36-50.png"
      }
    ]
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
