const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

// Initialize Prisma client
const prisma = new PrismaClient();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false,
  },
});
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration - Match UI_Reference API
const corsOptions = {
  origin: "*", // Allow all origins like the reference API
  credentials: false, // Set to false when origin is "*"
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Request-ID",
    "auth-token", // Allow the custom auth-token header
    "accept",
    "origin",
    "x-requested-with",
  ],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// Rate limiting - Temporarily increased for development
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10), // 1 minute window
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "1000", 10), // 1000 requests per minute
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
    service: "auth-service",
    status: "healthy",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

// CORS middleware handles OPTIONS requests automatically

// Auth routes
app.get("/api/v1/authentication/status", (req, res) => {
  res.json({
    success: true,
    message: "Auth service is running",
    service: "auth-service",
    port: PORT,
  });
});

// User API endpoints
app.get("/api/v1/user/get-user", async (req, res) => {
  console.log("👤 Get user request received:", {
    query: req.query,
    headers: req.headers,
    origin: req.get("origin"),
    timestamp: new Date().toISOString(),
  });

  const { status, user_uuid } = req.query;

  try {
    // Fetch users from PostgreSQL database
    const users = await prisma.user.findMany({
      where: {
        ...(status && { status }),
        ...(user_uuid && { userUuid: user_uuid }),
      },
      take: 10, // Limit results
    });

    console.log(`📊 Found ${users.length} users in database`);

    if (users.length === 0) {
      // Return mock data if no users found in database
      const mockUserData = {
    user_fact_id: 40,
    user_uuid: user_uuid || "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    email: "sakshi.jadhav@addcomposites.com",
    status: status || "ACTIVE",
    created_by_uuid: "6c96e128-3b41-4a8e-86a6-e937323e84ed",
    created_by_name: "Monika",
    create_ts: "2025-07-02T18:08:15.000Z",
    insert_ts: "2025-07-02T18:08:15.000Z",
    user_dim_id: 56,
    role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
    role_value: "ADMIN",
    user_profile_id: 89,
    first_name: "Sakshi",
    last_name: "Jadhav",
    full_name: "Sakshi Jadhav",
    personal_email: "sakshi.jadhav@addcomposites.com",
    job_title: null,
    user_type: null,
    assigned_phone_number: null,
    shared_email: null,
    mobile: null,
    home_phone: null,
    linkedin_profile: null,
    hire_date: null,
    last_day_at_work: null,
    department: null,
    fax: null,
    date_of_birth: null,
    mother_maiden_name: null,
    photo: null,
    signature: null,
    street_address: null,
    unit_or_suite: null,
    city: null,
    csr: null,
    csr_code: null,
    marketer: null,
    marketer_code: null,
    producer_one: null,
    producer_one_code: null,
    producer_two: null,
    producer_two_code: null,
    producer_three: null,
    producer_three_code: null,
    branch_code: null,
    province_or_state: null,
    postal_code: null,
    country: null,
    languages_known: null,
    documents: null,
    branch_name: "NOVA SCOTIA",
    branch_uuid: "91b78ebf-8ba7-45f8-baf4-051053aa8c47",
    referral_code: "NW-40",
    module_security: [
      {
        role_module_id: 1566,
        role_module_unique_id: 7,
        role_module_uuid: "5392f253-caa3-46e8-9b02-76429f57f791",
        module_uuid: "36b96d9d-9fd4-436d-80b5-35dbd74a1366",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 1,
        send_mail: 1,
        send_whatsapp: 1,
        send_call: 1,
        filter_values: {
          or: {
            user_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: null,
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "Tasks",
        submodule_name: "Taskboard",
        table_name: "latest_task_module_wise",
        module_key: "TASKS|TASKBOARD|LATEST_TASK_MODULE_WISE",
      },
      {
        role_module_id: 1567,
        role_module_unique_id: 8,
        role_module_uuid: "9bf1d3ce-d851-4d96-8901-e77abe79fee3",
        module_uuid: "dfaf7756-1362-459a-8560-d7827d1f352c",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          and: {
            user_uuid: ["*"],
            branch_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: null,
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "Users",
        submodule_name: "Users",
        table_name: "latest_user",
        module_key: "USERS|USERS|LATEST_USER",
      },
      {
        role_module_id: 1568,
        role_module_unique_id: 9,
        role_module_uuid: "4e2cb773-6bd5-49c2-91c7-3ce8c059d0fe",
        module_uuid: "4f5a275c-cc1a-4bf4-9c5d-3c1cb29b2fb6",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          or: {
            user_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: null,
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "Users",
        submodule_name: "Change Role",
        table_name: "change_role",
        module_key: "USERS|CHANGE ROLE|CHANGE_ROLE",
      },
      {
        role_module_id: 1569,
        role_module_unique_id: 148,
        role_module_uuid: "fe4467a8-6ee7-41a6-afa0-186db22ee6a3",
        module_uuid: "8291a8a5-6ea4-4b0e-8e2d-455982b05ae1",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          and: {
            user_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-06-28T11:21:35.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "Users",
        submodule_name: "Assignee",
        table_name: "latest_assignee",
        module_key: "USERS|ASSIGNEE|LATEST_ASSIGNEE",
      },
      {
        role_module_id: 1570,
        role_module_unique_id: 10,
        role_module_uuid: "08188961-7ced-49a7-b1e3-4e58b0275af8",
        module_uuid: "fe57d8b4-11a5-4f0a-841e-499a4e53c44a",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 1,
        send_mail: 1,
        send_whatsapp: 1,
        send_call: 1,
        filter_values: {
          or: {
            user_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: null,
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "Security",
        submodule_name: "Security",
        table_name: "role_module",
        module_key: "SECURITY|SECURITY|ROLE_MODULE",
      },
      {
        role_module_id: 1571,
        role_module_unique_id: 128,
        role_module_uuid: "0ee29cab-677a-4473-bba3-961099fc8302",
        module_uuid: "b474d2d3-9f41-46b4-91dd-aaf3bca7a18a",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          and: {
            user_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-06-26T12:42:57.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "Security",
        submodule_name: "Role Group",
        table_name: "latest_role_group",
        module_key: "SECURITY|ROLE GROUP|LATEST_ROLE_GROUP",
      },
      {
        role_module_id: 1572,
        role_module_unique_id: 11,
        role_module_uuid: "ea1212ec-eb0a-462c-946c-7f35ef5e6e34",
        module_uuid: "b1fbbbc8-e078-4088-aac4-1811baf73696",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 1,
        send_mail: 1,
        send_whatsapp: 1,
        send_call: 1,
        filter_values: {
          or: {
            user_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: null,
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "Data Management",
        submodule_name: "Branch",
        table_name: "latest_branch",
        module_key: "DATA MANAGEMENT|BRANCH|LATEST_BRANCH",
      },
      {
        role_module_id: 1573,
        role_module_unique_id: 12,
        role_module_uuid: "0625a608-f803-468a-901f-b513c4fae8d8",
        module_uuid: "dcdb6a17-8672-4f75-8052-4dc2766312a0",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 1,
        send_mail: 1,
        send_whatsapp: 1,
        send_call: 1,
        filter_values: {
          or: {
            user_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: null,
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "Data Management",
        submodule_name: "Zone",
        table_name: "zone",
        module_key: "DATA MANAGEMENT|ZONE|ZONE",
      },
      {
        role_module_id: 1574,
        role_module_unique_id: 13,
        role_module_uuid: "a1945185-eb91-442e-ae4a-1f78c6f5b849",
        module_uuid: "ba345f5f-b884-11ef-8918-d270ca4b126d",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 1,
        send_mail: 1,
        send_whatsapp: 1,
        send_call: 1,
        filter_values: {
          and: {
            user_uuid: ["*"],
            branch_uuid: ["*"],
            assignee_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2024-12-12T18:30:51.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "LEAD",
        submodule_name: "LEAD",
        table_name: "latest_lead_without_opportunity_status",
        module_key: "LEAD|LEAD|LATEST_LEAD_WITHOUT_OPPORTUNITY_STATUS",
      },
      {
        role_module_id: 1575,
        role_module_unique_id: 126,
        role_module_uuid: "5baa0659-bcfc-493c-a030-9ce83a50ce8b",
        module_uuid: "aabda577-ea61-46d7-8e27-c14f3cbe0bf9",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 1,
        send_mail: 1,
        send_whatsapp: 1,
        send_call: 1,
        filter_values: {
          and: {
            user_uuid: ["*"],
            branch_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-06-26T12:40:07.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "LEAD",
        submodule_name: "All Leads",
        table_name: "latest_leads",
        module_key: "LEAD|ALL LEADS|LATEST_LEADS",
      },
      {
        role_module_id: 1576,
        role_module_unique_id: 22,
        role_module_uuid: "e3cff6c6-48b4-40a3-ac6c-ad5b71ff5888",
        module_uuid: "4be24d07-bf65-11ef-8918-d270ca4b126d",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          or: {
            user_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2024-12-24T08:50:00.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "COMPANY INFORMATION",
        submodule_name: "COMPANY INFORMATION",
        table_name: "latest_company_information",
        module_key:
          "COMPANY INFORMATION|COMPANY INFORMATION|LATEST_COMPANY_INFORMATION",
      },
      {
        role_module_id: 1577,
        role_module_unique_id: 23,
        role_module_uuid: "aebdd9ee-e2d1-4759-8c50-7b9b4d89e201",
        module_uuid: "769f0e58-c329-11ef-8918-d270ca4b126d",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 0,
        view_access: 0,
        edit_access: 0,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          and: {
            user_uuid: ["*"],
            branch_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2024-12-27T10:09:45.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "Approval",
        submodule_name: "Approval",
        table_name: "latest_approval",
        module_key: "APPROVAL|APPROVAL|LATEST_APPROVAL",
      },
      {
        role_module_id: 1578,
        role_module_unique_id: 24,
        role_module_uuid: "9ed87812-1f24-420b-88cf-75341ccac96f",
        module_uuid: "92a74c2e-c329-11ef-8918-d270ca4b126d",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 0,
        view_access: 0,
        edit_access: 0,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          and: {
            user_uuid: ["*"],
            branch_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2024-12-27T10:09:45.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "Approval",
        submodule_name: "Approval Count",
        table_name: "latest_approval_count",
        module_key: "APPROVAL|APPROVAL COUNT|LATEST_APPROVAL_COUNT",
      },
      {
        role_module_id: 1579,
        role_module_unique_id: 35,
        role_module_uuid: "de99a77f-722f-4daf-bd68-056b81c14a33",
        module_uuid: "eb16cc3a-c9a8-11ef-8918-d270ca4b126d",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          and: {
            user_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-01-03T09:34:32.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "NOC CODE",
        submodule_name: "NOC CODE",
        table_name: "latest_noc_codes",
        module_key: "NOC CODE|NOC CODE|LATEST_NOC_CODES",
      },
      {
        role_module_id: 1580,
        role_module_unique_id: 36,
        role_module_uuid: "c2f4cfe9-dbc4-447f-bf7b-4570b15c7400",
        module_uuid: "14169ac0-c9a9-11ef-8918-d270ca4b126d",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 0,
        view_access: 0,
        edit_access: 0,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          and: {
            user_uuid: ["*"],
            branch_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-01-03T09:34:32.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "CRS DRAWS",
        submodule_name: "CRS DRAWS",
        table_name: "latest_crs_draws",
        module_key: "CRS DRAWS|CRS DRAWS|LATEST_CRS_DRAWS",
      },
      {
        role_module_id: 1581,
        role_module_unique_id: 37,
        role_module_uuid: "d0e48dca-cddc-4159-a3cd-5137f0e7fe26",
        module_uuid: "3d22e483-c9b6-11ef-8918-d270ca4b126d",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 0,
        view_access: 0,
        edit_access: 0,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          or: {
            user_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-01-03T09:37:41.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "STUDY PROGRAM",
        submodule_name: "STUDY PROGRAM",
        table_name: "latest_study_program",
        module_key: "STUDY PROGRAM|STUDY PROGRAM|LATEST_STUDY_PROGRAM",
      },
      {
        role_module_id: 1582,
        role_module_unique_id: 38,
        role_module_uuid: "00918198-bc77-4cc7-8166-63b269816e14",
        module_uuid: "8d931cf3-c9b6-11ef-8918-d270ca4b126d",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          and: {
            user_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-01-03T09:39:54.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "CUSTOMER",
        submodule_name: "CUSTOMER",
        table_name: "latest_customer_pr",
        module_key: "CUSTOMER|CUSTOMER|LATEST_CUSTOMER_PR",
      },
      {
        role_module_id: 1583,
        role_module_unique_id: 124,
        role_module_uuid: "c1cbaff6-5338-44f4-bdcd-e48cda544dab",
        module_uuid: "4ddc666b-2ede-4ee0-b09f-fe31e1a22ab0",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          and: {
            user_uuid: ["*"],
            branch_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-06-26T12:36:05.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "CUSTOMER",
        submodule_name: "Customer Personal Information",
        table_name: "latest_customer_personal_information",
        module_key:
          "CUSTOMER|CUSTOMER PERSONAL INFORMATION|LATEST_CUSTOMER_PERSONAL_INFORMATION",
      },
      {
        role_module_id: 1584,
        role_module_unique_id: 132,
        role_module_uuid: "6f8b1712-e7a8-41a5-941e-a66c25fd0601",
        module_uuid: "981565d3-1079-456b-9597-d1889b4fc098",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          and: {
            user_uuid: ["*"],
            branch_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-06-28T08:26:39.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "CUSTOMER",
        submodule_name: "Invoice And Payment",
        table_name: "latest_customer_invoice",
        module_key: "CUSTOMER|INVOICE AND PAYMENT|LATEST_CUSTOMER_INVOICE",
      },
      {
        role_module_id: 1585,
        role_module_unique_id: 133,
        role_module_uuid: "99a3701b-96a4-4664-95ff-061ec18ebeb7",
        module_uuid: "e6c54862-7080-475d-943c-2a19fba0560a",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          and: {
            user_uuid: ["*"],
            branch_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-06-28T08:26:39.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "CUSTOMER",
        submodule_name: "Services",
        table_name: "latest_customer_service",
        module_key: "CUSTOMER|SERVICES|LATEST_CUSTOMER_SERVICE",
      },
      {
        role_module_id: 1586,
        role_module_unique_id: 134,
        role_module_uuid: "0a3b2684-cd4d-4e04-b1c6-ec3df1b572be",
        module_uuid: "aef494db-0b4e-4064-98bc-db87fd963c82",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          and: {
            user_uuid: ["*"],
            branch_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-06-28T08:26:39.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "CUSTOMER",
        submodule_name: "Retainer",
        table_name: "latest_retainer_leads",
        module_key: "CUSTOMER|RETAINER|LATEST_RETAINER_LEADS",
      },
      {
        role_module_id: 1587,
        role_module_unique_id: 55,
        role_module_uuid: "b7d7a835-94c9-44b4-a19c-ab27617e85ef",
        module_uuid: "53654085-d408-11ef-b350-0e525aef9233",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          and: {
            user_uuid: ["*"],
            branch_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-04-16T04:39:41.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "QUESTIONNAIRE",
        submodule_name: "QUESTIONS",
        table_name: "latest_questions",
        module_key: "QUESTIONNAIRE|QUESTIONS|LATEST_QUESTIONS",
      },
      {
        role_module_id: 1588,
        role_module_unique_id: 56,
        role_module_uuid: "a1d32d7e-304a-4ad6-a336-31fb1f169e1b",
        module_uuid: "359369fa-d409-11ef-b350-0e525aef9233",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          and: {
            user_uuid: ["*"],
            branch_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-04-16T04:39:41.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "QUESTIONNAIRE",
        submodule_name: "QUESTIONS OPTIONS",
        table_name: "latest_questions_options",
        module_key: "QUESTIONNAIRE|QUESTIONS OPTIONS|LATEST_QUESTIONS_OPTIONS",
      },
      {
        role_module_id: 1589,
        role_module_unique_id: 57,
        role_module_uuid: "29d36bdf-401c-4065-8a42-8d32edd9c3d7",
        module_uuid: "697b58ab-d409-11ef-b350-0e525aef9233",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          and: {
            user_uuid: ["*"],
            branch_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-04-16T04:39:41.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "QUESTIONNAIRE",
        submodule_name: "ANSWERS",
        table_name: "latest_answers",
        module_key: "QUESTIONNAIRE|ANSWERS|LATEST_ANSWERS",
      },
      {
        role_module_id: 1590,
        role_module_unique_id: 180,
        role_module_uuid: "7f03a6d7-fa5d-48f6-bb89-8488cd842448",
        module_uuid: "24fc954c-0bd0-4592-a0a0-01649f7c9cd2",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          and: {
            user_uuid: ["*"],
            branch_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-06-28T16:04:40.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "QUESTIONNAIRE",
        submodule_name: "QUESTIONNAIRE",
        table_name: "latest_questionnaire",
        module_key: "QUESTIONNAIRE|QUESTIONNAIRE|LATEST_QUESTIONNAIRE",
      },
      {
        role_module_id: 1591,
        role_module_unique_id: 95,
        role_module_uuid: "c597d3ba-35b4-43b6-b82a-729fb9567353",
        module_uuid: "4e828e95-d34f-4539-8454-2615a8823e67",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {},
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-06-25T06:11:38.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "Conversation",
        submodule_name: "Conversation",
        table_name: "latest_conversation",
        module_key: "CONVERSATION|CONVERSATION|LATEST_CONVERSATION",
      },
      {
        role_module_id: 1592,
        role_module_unique_id: 96,
        role_module_uuid: "72312558-e9de-4d31-95ac-21467f3aa930",
        module_uuid: "7d7cc8e8-6089-4b7b-82ac-ec2946ee99d7",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {},
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-06-25T06:11:38.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "Conversation",
        submodule_name: "Chat messages",
        table_name: "latest_messages",
        module_key: "CONVERSATION|CHAT MESSAGES|LATEST_MESSAGES",
      },
      {
        role_module_id: 1593,
        role_module_unique_id: 97,
        role_module_uuid: "35f0e08f-e018-4b44-87bb-01f246a71aba",
        module_uuid: "4ad1da6b-1de3-4d81-bd60-04307c56b40f",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {},
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-06-25T06:11:38.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "Conversation",
        submodule_name: "Conversation participants",
        table_name: "latest_conversation_participants",
        module_key:
          "CONVERSATION|CONVERSATION PARTICIPANTS|LATEST_CONVERSATION_PARTICIPANTS",
      },
      {
        role_module_id: 1594,
        role_module_unique_id: 131,
        role_module_uuid: "5f42ffe0-6424-4d44-be6e-8f736d56cbc2",
        module_uuid: "8c05cf2f-25c1-4b5f-9b6c-71835488b87f",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          and: {
            user_uuid: ["*"],
            branch_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-06-27T05:09:05.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "Setting",
        submodule_name: "Customer Automation",
        table_name: "latest_workflow_basic",
        module_key: "SETTING|CUSTOMER AUTOMATION|LATEST_WORKFLOW_BASIC",
      },
      {
        role_module_id: 1595,
        role_module_unique_id: 137,
        role_module_uuid: "7fec5805-347a-49e2-9930-7a4a118e1557",
        module_uuid: "e8ac87fb-4f6b-4647-887d-658d1ca09a0b",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          and: {
            user_uuid: ["*"],
            branch_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-06-28T08:26:39.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "Setting",
        submodule_name: "Template",
        table_name: "latest_templates",
        module_key: "SETTING|TEMPLATE|LATEST_TEMPLATES",
      },
      {
        role_module_id: 1596,
        role_module_unique_id: 181,
        role_module_uuid: "e1e90824-7161-4009-9447-72841b37c06c",
        module_uuid: "feb9b463-a1a1-4365-82b3-ab797849b721",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          and: {
            user_uuid: ["*"],
            branch_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-06-28T16:24:56.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "Setting",
        submodule_name: "Workflow",
        table_name: "latest_customer_automation",
        module_key: "SETTING|WORKFLOW|LATEST_CUSTOMER_AUTOMATION",
      },
      {
        role_module_id: 1597,
        role_module_unique_id: 135,
        role_module_uuid: "59c8af1b-1099-42b2-bfb2-24c7b9d8963e",
        module_uuid: "0b58b1e0-0148-46d7-b2cd-df690f3a9ed9",
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        show_module: 1,
        view_access: 1,
        edit_access: 1,
        send_sms: 0,
        send_mail: 0,
        send_whatsapp: 0,
        send_call: 0,
        filter_values: {
          and: {
            user_uuid: ["*"],
            branch_uuid: ["*"],
          },
        },
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-06-28T08:26:39.000Z",
        insert_ts: "2025-08-19T22:28:13.000Z",
        module_name: "Service",
        submodule_name: "Service",
        table_name: "latest_services",
        module_key: "SERVICE|SERVICE|LATEST_SERVICES",
      },
    ],
  };

      console.log("✅ Mock user data response sent successfully");
      res.json({
        message: "All User",
        totalRecords: 1,
        currentRecords: 1,
        data: [mockUserData],
      });
    } else {
      // Transform database users to match API format
      const transformedUsers = users.map(user => ({
        user_fact_id: user.userFactId,
        user_uuid: user.userUuid,
        email: user.email,
        status: user.status,
        created_by_uuid: user.createdByUuid,
        created_by_name: user.createdByName,
        create_ts: user.createTs,
        insert_ts: user.insertTs,
        user_dim_id: user.userDimId,
        role_uuid: user.roleUuid,
        role_value: user.roleValue,
        user_profile_id: user.userProfileId,
        first_name: user.firstName,
        last_name: user.lastName,
        full_name: user.name,
        personal_email: user.personalEmail,
        job_title: user.jobTitle,
        user_type: user.userType,
        assigned_phone_number: user.assignedPhoneNumber,
        shared_email: user.sharedEmail,
        mobile: user.mobile,
        home_phone: user.homePhone,
        linkedin_profile: user.linkedinProfile,
        hire_date: user.hireDate,
        last_day_at_work: user.lastDayAtWork,
        department: user.department,
        fax: user.fax,
        date_of_birth: user.dateOfBirth,
        mother_maiden_name: user.motherMaidenName,
        photo: user.photo,
        signature: user.signature,
        street_address: user.streetAddress,
        unit_or_suite: user.unitOrSuite,
        city: user.city,
        csr: user.csr,
        csr_code: user.csrCode,
        marketer: user.marketer,
        marketer_code: user.marketerCode,
        producer_one: user.producerOne,
        producer_one_code: user.producerOneCode,
        producer_two: user.producerTwo,
        producer_two_code: user.producerTwoCode,
        producer_three: user.producerThree,
        producer_three_code: user.producerThreeCode,
        branch_code: user.branchCode,
        province_or_state: user.provinceOrState,
        postal_code: user.postalCode,
        country: user.country,
        languages_known: user.languagesKnown,
        documents: user.documents,
        branch_name: user.branchName,
        branch_uuid: user.branchUuid,
        referral_code: user.referralCode,
        module_security: [] // Add security modules if needed
      }));

      console.log("✅ Database user data response sent successfully");
      res.json({
        message: "All User",
        totalRecords: users.length,
        currentRecords: users.length,
        data: transformedUsers,
      });
    }
  } catch (error) {
    console.error("❌ Error fetching users from database:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: "Failed to fetch users from database",
      },
    });
  }
});

// Conversation API endpoints
app.get("/api/v1/conversation/get-conversation", (req, res) => {
  console.log("💬 Get conversation request received:", {
    query: req.query,
    headers: req.headers,
    origin: req.get("origin"),
    timestamp: new Date().toISOString(),
  });

  const { user_uuid } = req.query;

  // Mock conversation data matching the UI_Reference response format
  console.log("✅ Conversation data response sent successfully");
  res.json({
    message: "Conversations:",
    currentRecords: 0,
    data: [],
  });
});

// Company Information API (temporary - should be moved to dedicated service)
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

// Company Information API (Private) - matches Nova World Group API structure
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

// Data Management API - Branch endpoint
app.get("/api/v1/dataManagement/get-branch", (req, res) => {
  console.log("🏢 Branch data request received:", {
    query: req.query,
    from_date: req.query.from_date,
    to_date: req.query.to_date,
    pageNo: req.query.pageNo,
    itemPerPage: req.query.itemPerPage,
    timestamp: new Date().toISOString(),
  });

  // Mock branch data - matches Nova World Group API structure
  res.json({
    message: "All Branch",
    totalRecords: 0,
    currentRecords: 0,
    data: []
  });
});

// Security API - Roles endpoint
app.get("/api/v1/security/get-roles", (req, res) => {
  console.log("🔐 Security roles request received:", {
    query: req.query,
    timestamp: new Date().toISOString(),
  });

  // Mock roles data - matches Nova World Group API structure
  res.json({
    message: "Role ",
    totalRecords: 5,
    currentRecords: 5,
    data: [
      {
        role_id: 83,
        role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
        role_name: "ADMIN",
        role_value: "ADMIN",
        role_group: "ALL",
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: null,
        insert_ts: "2025-08-19T22:28:13.000Z"
      },
      {
        role_id: 82,
        role_uuid: "899f1d72-8283-4568-9495-512386288352",
        role_name: "Admin",
        role_value: "ADMIN",
        role_group: "ALL",
        status: "ACTIVE",
        created_by_uuid: null,
        created_by_name: null,
        modified_by_uuid: null,
        modified_by_name: null,
        create_ts: null,
        insert_ts: "2025-07-14T13:14:04.000Z"
      },
      {
        role_id: 79,
        role_uuid: "0870ac83-045a-4263-80f1-9cd65e25c0bc",
        role_name: "EMPLOYEE",
        role_value: "EMPLOYEE",
        role_group: "EMPLOYEE",
        status: "ACTIVE",
        created_by_uuid: "693b81e5-e18a-4528-a457-12e0cf03ed70",
        created_by_name: "Rajan",
        modified_by_uuid: "693b81e5-e18a-4528-a457-12e0cf03ed70",
        modified_by_name: "Rajan",
        create_ts: null,
        insert_ts: "2025-06-30T21:23:41.000Z"
      },
      {
        role_id: 44,
        role_uuid: "f8115371-c6de-466d-b2e8-ba8186385fc6",
        role_name: "AGENT",
        role_value: "AGENT",
        role_group: "AGENT",
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: null,
        insert_ts: "2025-06-25T09:02:25.000Z"
      },
      {
        role_id: 40,
        role_uuid: "1b3fb21a-acda-4387-9a8a-48423dc24f13",
        role_name: "BRANCH MANAGER",
        role_value: "BRANCH_MANAGER",
        role_group: "ALL",
        status: "ACTIVE",
        created_by_uuid: "08d8bdeb-5e28-45a3-9337-52bf25423973",
        created_by_name: "Monika verma",
        modified_by_uuid: "08d8bdeb-5e28-45a3-9337-52bf25423973",
        modified_by_name: "Monika verma",
        create_ts: null,
        insert_ts: "2025-06-25T06:12:19.000Z"
      }
    ]
  });
});

// Security API - Role Groups endpoint
app.get("/api/v1/security/get-role-group", (req, res) => {
  console.log("🔐 Security role groups request received:", {
    query: req.query,
    pageNo: req.query.pageNo,
    itemPerPage: req.query.itemPerPage,
    timestamp: new Date().toISOString(),
  });

  // Mock role groups data - matches Nova World Group API structure
  res.json({
    message: "Role Groups ",
    totalRecords: 4,
    currentRecords: 4,
    data: [
      {
        role_group_id: 8,
        role_group_unique_id: 6,
        role_group_uuid: "246b70ee-0c9e-4794-a25b-77eea6701b67",
        role_group: "AGENT",
        status: "ACTIVE",
        created_by_uuid: "6309cda0-2101-4ad1-8e98-c186d04c8bd5",
        create_ts: "2025-06-25T06:15:23.000Z",
        insert_ts: "2025-06-25T06:15:23.000Z"
      },
      {
        role_group_id: 7,
        role_group_unique_id: 5,
        role_group_uuid: "0f39154c-0838-471a-b8dc-ef2e6f8dc825",
        role_group: "EMPLOYEE",
        status: "ACTIVE",
        created_by_uuid: "77c189b1-403e-4ebc-a6cf-4a35fbbc0937",
        create_ts: "2025-04-16T07:23:14.000Z",
        insert_ts: "2025-04-19T19:49:52.000Z"
      },
      {
        role_group_id: 5,
        role_group_unique_id: 4,
        role_group_uuid: "84800115-f94c-4df1-b421-5c5ba380e0ef",
        role_group: "MANAGER",
        status: "ACTIVE",
        created_by_uuid: "08d8bdeb-5e28-45a3-9337-52bf25423973",
        create_ts: "2025-04-16T04:52:22.000Z",
        insert_ts: "2025-04-16T04:52:22.000Z"
      },
      {
        role_group_id: 3,
        role_group_unique_id: 3,
        role_group_uuid: "35ba47e0-99c5-459a-a1ca-13ac55097631",
        role_group: "ALL",
        status: "ACTIVE",
        created_by_uuid: "77c189b1-403e-4ebc-a6cf-4a35fbbc0937",
        create_ts: "2024-12-27T10:04:30.000Z",
        insert_ts: "2024-12-27T15:34:36.000Z"
      }
    ]
  });
});

// Security API - Role Groups endpoint (alternative URL pattern)
app.get("/api/v1/security/role-group", (req, res) => {
  console.log("🔐 Security role groups request received (alternative URL):", {
    query: req.query,
    pageNo: req.query.pageNo,
    itemPerPage: req.query.itemPerPage,
    timestamp: new Date().toISOString(),
  });

  // Mock role groups data - matches Nova World Group API structure
  res.json({
    message: "Role Groups ",
    totalRecords: 4,
    currentRecords: 4,
    data: [
      {
        role_group_id: 8,
        role_group_unique_id: 6,
        role_group_uuid: "246b70ee-0c9e-4794-a25b-77eea6701b67",
        role_group: "AGENT",
        status: "ACTIVE",
        created_by_uuid: "6309cda0-2101-4ad1-8e98-c186d04c8bd5",
        create_ts: "2025-06-25T06:15:23.000Z",
        insert_ts: "2025-06-25T06:15:23.000Z"
      },
      {
        role_group_id: 7,
        role_group_unique_id: 5,
        role_group_uuid: "0f39154c-0838-471a-b8dc-ef2e6f8dc825",
        role_group: "EMPLOYEE",
        status: "ACTIVE",
        created_by_uuid: "77c189b1-403e-4ebc-a6cf-4a35fbbc0937",
        create_ts: "2025-04-16T07:23:14.000Z",
        insert_ts: "2025-04-19T19:49:52.000Z"
      },
      {
        role_group_id: 5,
        role_group_unique_id: 4,
        role_group_uuid: "84800115-f94c-4df1-b421-5c5ba380e0ef",
        role_group: "MANAGER",
        status: "ACTIVE",
        created_by_uuid: "08d8bdeb-5e28-45a3-9337-52bf25423973",
        create_ts: "2025-04-16T04:52:22.000Z",
        insert_ts: "2025-04-16T04:52:22.000Z"
      },
      {
        role_group_id: 3,
        role_group_unique_id: 3,
        role_group_uuid: "35ba47e0-99c5-459a-a1ca-13ac55097631",
        role_group: "ALL",
        status: "ACTIVE",
        created_by_uuid: "77c189b1-403e-4ebc-a6cf-4a35fbbc0937",
        create_ts: "2024-12-27T10:04:30.000Z",
        insert_ts: "2024-12-27T15:34:36.000Z"
      }
    ]
  });
});

// General API - Record counts endpoint
app.get("/api/v1/general/get-record-counts", (req, res) => {
  console.log("📊 General record counts request received:", {
    query: req.query,
    table_name: req.query.table_name,
    timestamp: new Date().toISOString(),
  });

  const { table_name } = req.query;

  // Mock record counts based on table name
  let count = 0;
  switch (table_name) {
    case "latest_role_group":
      count = 4;
      break;
    case "latest_user":
      count = 3;
      break;
    case "latest_company_information":
      count = 1;
      break;
    case "latest_approval_count":
      count = 5;
      break;
    default:
      count = 0;
  }

  res.json({
    success: true,
    message: `Record count for ${table_name}`,
    table_name: table_name,
    count: count
  });
});

// Approval API - Get approval count endpoint
app.get("/api/v1/approval/get-approval-count", (req, res) => {
  console.log("📋 Approval count request received:", {
    query: req.query,
    pageNo: req.query.pageNo,
    itemPerPage: req.query.itemPerPage,
    timestamp: new Date().toISOString(),
  });

  // Mock approval count data
  res.json({
    message: "Approval Count",
    totalRecords: 5,
    currentRecords: 5,
    data: [
      {
        approval_id: 1,
        approval_uuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        approval_name: "Document Review",
        approval_type: "DOCUMENT",
        status: "PENDING",
        created_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
        created_by_name: "Sakshi Jadhav",
        create_ts: "2025-09-18T10:00:00.000Z",
        insert_ts: "2025-09-18T10:00:00.000Z"
      },
      {
        approval_id: 2,
        approval_uuid: "b2c3d4e5-f6g7-8901-bcde-f23456789012",
        approval_name: "Budget Approval",
        approval_type: "FINANCIAL",
        status: "APPROVED",
        created_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
        created_by_name: "Sakshi Jadhav",
        create_ts: "2025-09-18T09:30:00.000Z",
        insert_ts: "2025-09-18T09:30:00.000Z"
      },
      {
        approval_id: 3,
        approval_uuid: "c3d4e5f6-g7h8-9012-cdef-345678901234",
        approval_name: "Project Approval",
        approval_type: "PROJECT",
        status: "REJECTED",
        created_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
        created_by_name: "Sakshi Jadhav",
        create_ts: "2025-09-18T09:00:00.000Z",
        insert_ts: "2025-09-18T09:00:00.000Z"
      },
      {
        approval_id: 4,
        approval_uuid: "d4e5f6g7-h8i9-0123-def0-456789012345",
        approval_name: "Leave Approval",
        approval_type: "HR",
        status: "PENDING",
        created_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
        created_by_name: "Sakshi Jadhav",
        create_ts: "2025-09-18T08:30:00.000Z",
        insert_ts: "2025-09-18T08:30:00.000Z"
      },
      {
        approval_id: 5,
        approval_uuid: "e5f6g7h8-i9j0-1234-ef01-567890123456",
        approval_name: "Purchase Approval",
        approval_type: "PROCUREMENT",
        status: "APPROVED",
        created_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
        created_by_name: "Sakshi Jadhav",
        create_ts: "2025-09-18T08:00:00.000Z",
        insert_ts: "2025-09-18T08:00:00.000Z"
      }
    ]
  });
});

// Customer API - Get customer automation endpoint
app.get("/api/v1/customer/get-customer-automation", (req, res) => {
  console.log("🤖 Customer automation request received:", {
    query: req.query,
    timestamp: new Date().toISOString(),
  });

  // Mock customer automation data - matches Nova World Group API structure exactly
  res.json({
    message: "Customer Automation",
    totalRecords: 1,
    currentRecords: 1,
    data: [
      {
        customer_automation_id: 1,
        customer_automation_unique_id: 1,
        customer_automation_uuid: "dd6c7bec-8eff-4736-83c5-f28bb5ba0cdb",
        customer_fact_uuid: null,
        sub_module_uuid: null,
        automation_type: "AUTOMATED",
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-06-28T16:49:11.000Z",
        insert_ts: "2025-06-28T16:49:11.000Z"
      }
    ]
  });
});

// Workflow API - Get workflow basic endpoint
app.get("/api/v1/workflow/get-workflow-basic", (req, res) => {
  console.log("⚙️ Workflow basic request received:", {
    query: req.query,
    from_date: req.query.from_date,
    to_date: req.query.to_date,
    pageNo: req.query.pageNo,
    itemPerPage: req.query.itemPerPage,
    timestamp: new Date().toISOString(),
  });

  // Mock workflow basic data - matches Nova World Group API structure exactly
  res.json({
    message: "Latest Workflow basic",
    totalRecords: 0,
    currentRecords: 0,
    data: []
  });
});

// Template API - Get templates endpoint
app.get("/api/v1/template/get-templates", (req, res) => {
  console.log("📝 Templates request received:", {
    query: req.query,
    pageNo: req.query.pageNo,
    pageLimit: req.query.pageLimit,
    itemPerPage: req.query.itemPerPage,
    from_date: req.query.from_date,
    to_date: req.query.to_date,
    timestamp: new Date().toISOString(),
  });

  // Mock templates data - matches Nova World Group API structure exactly
  res.json({
    message: " unit_groups",
    totalRecords: 13,
    currentRecords: 10,
    data: [
      {
        templates_id: 33,
        templates_unique_id: 11,
        templates_uuid: "1713dab6-b7a6-4902-b2df-272fc39fdd6a",
        template_code: "G1VR45",
        template_name: "Lead Assigned",
        template_category: "Email",
        call_type: "TABLE",
        table_name_or_dynamic_view_code: "latest_leads",
        template_subject: "A new lead assigned to you.",
        body: "<h1 class=\"nml__editor__content__heading\">A new lead is assigned to you.</h1><p><strong>Lead Detail:</strong></p><ul class=\"nml__editor__content__bullet__list\"><li class=\"nml__editor__content__listItem\"><p>Lead Id: @@latest_leads.lead_id</p></li><li class=\"nml__editor__content__listItem\"><p>Name: @@latest_leads.first_name @@latest_leads.last_name</p></li><li class=\"nml__editor__content__listItem\"><p>Business Name: @@latest_<a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"nml__editor__content__link\" href=\"http://leads.business\">leads.business</a>_name</p></li><li class=\"nml__editor__content__listItem\"><p>Phone: @@latest_<a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"nml__editor__content__link\" href=\"http://leads.phone\">leads.phone</a></p></li><li class=\"nml__editor__content__listItem\"><p>Email: @@latest_<a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"nml__editor__content__link\" href=\"http://leads.email\">leads.email</a></p></li><li class=\"nml__editor__content__listItem\"><p>Time to Contact: @@latest_<a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"nml__editor__content__link\" href=\"http://leads.date\">leads.date</a> @@latest_leads.time_to_contact</p></li><li class=\"nml__editor__content__listItem\"><p>Notes: @@latest_leads.notes</p></li></ul><p>If you have any questions, please visit our website <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"nml__editor__content__link\" href=\"http://aaxel.ca\">aaxel.ca</a></p>",
        status: "ACTIVE",
        created_by_uuid: "4eebb1f4-12f8-43c1-afae-39af83ff7e52",
        created_by_name: "Sumit Patel",
        modified_by_uuid: "4eebb1f4-12f8-43c1-afae-39af83ff7e52",
        modified_by_name: "Sumit Patel",
        insert_ts: "2025-06-14T08:29:02.000Z"
      },
      {
        templates_id: 29,
        templates_unique_id: 10,
        templates_uuid: "a8a3d89c-325c-49f0-8cac-1a2e0845dab1",
        template_code: "F77JAQ",
        template_name: "Lead Creation",
        template_category: "Email",
        call_type: "TABLE",
        table_name_or_dynamic_view_code: "latest_leads",
        template_subject: "You have a new lead.",
        body: "<h1 class=\"nml__editor__content__heading\">Thanks for giving us the opportunity to quote.</h1><p>One of our insurance brokers will be contacting you as soon as possible for @@latest_<a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"nml__editor__content__link\" href=\"http://leads.insurance\">leads.insurance</a>_type.</p><p><strong>Lead Detail:</strong></p><ul class=\"nml__editor__content__bullet__list\"><li class=\"nml__editor__content__listItem\"><p>Lead Id: @@latest_leads.lead_id</p></li><li class=\"nml__editor__content__listItem\"><p>Name: @@latest_leads.first_name @@latest_leads.last_name</p></li><li class=\"nml__editor__content__listItem\"><p>Business Name: @@latest_<a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"nml__editor__content__link\" href=\"http://leads.business\">leads.business</a>_name</p></li><li class=\"nml__editor__content__listItem\"><p>Phone: @@latest_<a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"nml__editor__content__link\" href=\"http://leads.phone\">leads.phone</a></p></li><li class=\"nml__editor__content__listItem\"><p>Email: @@latest_<a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"nml__editor__content__link\" href=\"http://leads.email\">leads.email</a></p></li><li class=\"nml__editor__content__listItem\"><p>Time to Contact: @@latest_<a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"nml__editor__content__link\" href=\"http://leads.date\">leads.date</a> @@latest_leads.time_to_contact</p></li><li class=\"nml__editor__content__listItem\"><p>Notes: @@latest_leads.notes</p></li></ul><p>If you have any questions, please visit our website <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"nml__editor__content__link\" href=\"http://aaxel.ca\">aaxel.ca</a></p>",
        status: "ACTIVE",
        created_by_uuid: "4eebb1f4-12f8-43c1-afae-39af83ff7e52",
        created_by_name: "Sumit Patel",
        modified_by_uuid: "4eebb1f4-12f8-43c1-afae-39af83ff7e52",
        modified_by_name: "Sumit Patel",
        insert_ts: "2025-06-14T07:43:50.000Z"
      },
      {
        templates_id: 28,
        templates_unique_id: 9,
        templates_uuid: "f64fe1eb-a13b-43b7-acbe-61cbbe9ec327",
        template_code: "YYOAA7",
        template_name: "Lead Updation",
        template_category: "Email",
        call_type: "TABLE",
        table_name_or_dynamic_view_code: "latest_leads",
        template_subject: "Lead Updated: #@@latest_leads.lead_id",
        body: "<p>Hi @@latest_leads.assigned_to_id,</p><p>A new lead #@@latest_leads.lead_id has been updated., below is the following changes:</p><p>@@track_changes</p><p>Thanks</p>",
        status: "ACTIVE",
        created_by_uuid: "4eebb1f4-12f8-43c1-afae-39af83ff7e52",
        created_by_name: "Sumit Patel",
        modified_by_uuid: "4eebb1f4-12f8-43c1-afae-39af83ff7e52",
        modified_by_name: "Sumit Patel",
        insert_ts: "2025-06-14T07:43:02.000Z"
      },
      {
        templates_id: 27,
        templates_unique_id: 7,
        templates_uuid: "36a72e88-247c-44e9-92fb-b29f9d54dfc1",
        template_code: "WZWT0A",
        template_name: "new1 - Copy",
        template_category: "WhatsApp",
        call_type: "TABLE",
        table_name_or_dynamic_view_code: "",
        template_subject: "kedll",
        body: "<p>@@track_changes@@current_date</p>",
        status: "ACTIVE",
        created_by_uuid: "4eebb1f4-12f8-43c1-afae-39af83ff7e52",
        created_by_name: "Sumit Patel",
        modified_by_uuid: "4eebb1f4-12f8-43c1-afae-39af83ff7e52",
        modified_by_name: "Sumit Patel",
        insert_ts: "2025-06-13T12:32:28.000Z"
      },
      {
        templates_id: 24,
        templates_unique_id: 7,
        templates_uuid: "482ec3cb-1e85-4fc3-8251-119b449bb45b",
        template_code: "L5HYWE",
        template_name: "new1",
        template_category: "WhatsApp",
        call_type: "TABLE",
        table_name_or_dynamic_view_code: "",
        template_subject: "kedll",
        body: "<p>fefdssw</p>",
        status: "ACTIVE",
        created_by_uuid: "4eebb1f4-12f8-43c1-afae-39af83ff7e52",
        created_by_name: "Sumit Patel",
        modified_by_uuid: "4eebb1f4-12f8-43c1-afae-39af83ff7e52",
        modified_by_name: "Sumit Patel",
        insert_ts: "2025-06-13T11:56:54.000Z"
      },
      {
        templates_id: 23,
        templates_unique_id: 8,
        templates_uuid: "7f6cf8bb-5d93-4334-8171-97e355f1f48e",
        template_code: "W6DPLK",
        template_name: "temp 12",
        template_category: "SMS",
        call_type: "TABLE",
        table_name_or_dynamic_view_code: "",
        template_subject: "",
        body: "testing...",
        status: "ACTIVE",
        created_by_uuid: "4eebb1f4-12f8-43c1-afae-39af83ff7e52",
        created_by_name: "Sumit Patel",
        modified_by_uuid: "4eebb1f4-12f8-43c1-afae-39af83ff7e52",
        modified_by_name: "Sumit Patel",
        insert_ts: "2025-06-13T11:55:23.000Z"
      },
      {
        templates_id: 22,
        templates_unique_id: 7,
        templates_uuid: "482ec3cb-1e85-4fc3-8251-119b449bb45b",
        template_code: "",
        template_name: "jjkkkl - Copy",
        template_category: "WhatsApp",
        call_type: "TABLE",
        table_name_or_dynamic_view_code: "",
        template_subject: "kedll",
        body: "<p>fefdssw</p>",
        status: "ACTIVE",
        created_by_uuid: "4eebb1f4-12f8-43c1-afae-39af83ff7e52",
        created_by_name: "Sumit Patel",
        modified_by_uuid: "4eebb1f4-12f8-43c1-afae-39af83ff7e52",
        modified_by_name: "Sumit Patel",
        insert_ts: "2025-06-13T11:38:23.000Z"
      },
      {
        templates_id: 19,
        templates_unique_id: 6,
        templates_uuid: "14506b42-0d8a-4995-8c68-9b14f970861a",
        template_code: "ZSCGF0",
        template_name: "TESTING TEMPLATE 3",
        template_category: "WhatsApp",
        call_type: "SQL_VIEW",
        table_name_or_dynamic_view_code: "",
        template_subject: "TEST SUB 3",
        body: "<p>fef</p>",
        status: "ACTIVE",
        created_by_uuid: "4eebb1f4-12f8-43c1-afae-39af83ff7e52",
        created_by_name: "Sumit Patel",
        modified_by_uuid: "4eebb1f4-12f8-43c1-afae-39af83ff7e52",
        modified_by_name: "Sumit Patel",
        insert_ts: "2025-06-13T10:11:34.000Z"
      },
      {
        templates_id: 18,
        templates_unique_id: 5,
        templates_uuid: "10a855f2-8b23-4514-b9d1-1a2598208041",
        template_code: "B8XRG0",
        template_name: "TESTING TEMPLATE 2",
        template_category: "WhatsApp",
        call_type: "SQL_VIEW",
        table_name_or_dynamic_view_code: "",
        template_subject: "TEST SUB 2",
        body: "<p>bhh</p>",
        status: "ACTIVE",
        created_by_uuid: "4eebb1f4-12f8-43c1-afae-39af83ff7e52",
        created_by_name: "Sumit Patel",
        modified_by_uuid: "4eebb1f4-12f8-43c1-afae-39af83ff7e52",
        modified_by_name: "Sumit Patel",
        insert_ts: "2025-06-13T10:08:03.000Z"
      },
      {
        templates_id: 15,
        templates_unique_id: 1,
        templates_uuid: "6f0bf1da-00bd-4abd-994a-a1b6fac30c91",
        template_code: "WX1CA4",
        template_name: "Lead Assign",
        template_category: "Email",
        call_type: " SQL_VIEW",
        table_name_or_dynamic_view_code: "JR32TYKWOO",
        template_subject: "lead assigning to you",
        body: "<p>hjjdkkqx</p>",
        status: "ACTIVE",
        created_by_uuid: "7f7c0419-814a-4490-b667-e5c767f4d8ec",
        created_by_name: "Sanskar Sanskar",
        modified_by_uuid: "4eebb1f4-12f8-43c1-afae-39af83ff7e52",
        modified_by_name: "Sumit Patel",
        insert_ts: "2025-06-13T08:52:28.000Z"
      }
    ]
  });
});

// Questionnaire API - Get questionnaire endpoint
app.get("/api/v1/questionnaire/get-questionnaire", (req, res) => {
  console.log("📋 Questionnaire request received:", {
    query: req.query,
    status: req.query.status,
    from_date: req.query.from_date,
    to_date: req.query.to_date,
    pageNo: req.query.pageNo,
    itemPerPage: req.query.itemPerPage,
    timestamp: new Date().toISOString(),
  });

  // Mock questionnaire data - matches Nova World Group API structure exactly
  res.json({
    message: "Questionnaire: ",
    totalRecords: 1,
    currentRecords: 1,
    data: [
      {
        questionnaire_id: 9,
        questionnaire_uuid: "51cd7bc5-c688-4b49-ab99-5ed889e52c6c",
        questionnaire_name: "Test Doc",
        question_per_page: 10,
        description: "26 aug, 2025",
        comment: "test",
        status: "ACTIVE",
        created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        created_by_name: "Ramesh",
        modified_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
        modified_by_name: "Ramesh",
        create_ts: "2025-08-26T16:35:47.000Z",
        insert_ts: "2025-08-26T16:36:22.000Z"
      }
    ]
  });
});

// Lead API - Get NOC codes endpoint
app.get("/api/v1/lead/get-noc_codes", (req, res) => {
  console.log("🏷️ NOC codes request received:", {
    query: req.query,
    from_date: req.query.from_date,
    to_date: req.query.to_date,
    pageNo: req.query.pageNo,
    itemPerPage: req.query.itemPerPage,
    timestamp: new Date().toISOString(),
  });

  // Mock NOC codes data - matches Nova World Group API structure exactly
  res.json({
    message: " unit_groups",
    totalRecords: 0,
    currentRecords: 0,
    data: []
  });
});

// Tasks API - Get task module-wise endpoint
app.get("/api/v1/tasks/get-task-module-wise", (req, res) => {
  console.log("📋 Task module-wise request received:", {
    query: req.query,
    from_date: req.query.from_date,
    to_date: req.query.to_date,
    pageNo: req.query.pageNo,
    itemPerPage: req.query.itemPerPage,
    timestamp: new Date().toISOString(),
  });

  // Mock task module-wise data - matches Nova World Group API structure exactly
  res.json({
    message: "Task module wise Records fetched successfully!",
    totalRecords: 0,
    currentRecords: 0,
    data: []
  });
});

// Lead API - Get leads endpoint
app.get("/api/v1/lead/get-leads", (req, res) => {
  console.log("👥 Leads request received:", {
    query: req.query,
    from_date: req.query.from_date,
    to_date: req.query.to_date,
    pageNo: req.query.pageNo,
    itemPerPage: req.query.itemPerPage,
    timestamp: new Date().toISOString(),
  });

  // Mock leads data - simplified version matching Nova World Group API structure
  res.json({
    message: "All leads",
    currentRecords: 3,
    data: [
      {
        leads_uuid: "8ac7caad-69c9-4314-9222-00b4706814ae",
        referral_code: "NW-44",
        leads_code: "GBL250812180008939",
        terms_and_condition: 1,
        branch_name: "NOVA SCOTIA",
        branch_uuid: "91b78ebf-8ba7-45f8-baf4-051053aa8c47",
        service_type: "WORK_PERMIT",
        service_sub_type: null,
        applicant_first_name: "Jatin",
        applicant_last_name: "Kuamr",
        nationality: "India",
        country: "",
        state_or_province: "",
        country_of_residence: "Canada",
        status_in_country: "STUDY",
        applicant_date_of_birth: "1997-08-11T00:00:00.000Z",
        age: 28,
        applicant_sex: "MALE",
        contact_number: "1234567890",
        email: "jatin@edgenroots.net",
        marital_status: "NEVER_MARRIED_OR_SINGLE",
        education: [
          {
            to: "2024-08-25T18:30:00.000Z",
            from: "2022-08-25T18:30:00.000Z",
            country: "canada",
            qualification: "TWO_YEAR_PROGRAM",
            is_eca_approved: 1,
            marks_percentage: "90",
            school_or_university: "lucknow university"
          }
        ],
        work_history: [
          {
            to: "2018-09-30",
            from: "2015-10-01",
            country: "India ",
            duration: 2,
            designation: "",
            company_name: "Gray sea Medicare pvt. ltd. ",
            noc_job_code: "95102",
            noc_job_uuid: "7626173c-1132-11f0-a003-0e525aef9233",
            location_type: "ON_SITE",
            noc_job_title: "Labourers in chemical products processing and utilities",
            company_location: "Rajasthan ",
            employement_type: "FULL_TIME",
            currently_working: false
          }
        ],
        english_language_test_type: "IELTS",
        english_test_result_less_than_two_years: "YES",
        english_ability_speaking: 10,
        english_ability_reading: 10,
        english_ability_writing: 10,
        english_ability_listening: 10,
        english_ability_total_points: 136,
        applicant_crs_points: {
          total: 483,
          core_human_capital_factor: {
            age: 110,
            subtotal: 408,
            level_of_education: 98,
            official_languages: {
              first_official_language: 136,
              second_official_language: 0
            },
            canadian_work_experience: 64,
            official_languages_subtotal: 136
          }
        },
        leads_source: "OTHER",
        total: 483,
        funds_available: "25001-50000",
        prior_travel_history: "YES",
        country_code: "+1",
        no_work_experience: 0,
        asignee_uuid: "b0c3fe31-5b09-419c-a180-1b1906ab4b6e",
        asignee_email: "kamal@edgenroots.net",
        asignee_name: "Kamal Admin",
        time_to_contact: "9:00 am to 12:00pm",
        assigned_to_id: "44",
        status: "ACTIVE",
        created_by_uuid: null,
        created_by_name: "",
        modified_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
        modified_by_name: "Umesh Yadav",
        create_ts: "2025-08-12T18:00:09.000Z",
        insert_ts: "2025-09-18T16:45:25.000Z"
      },
      {
        leads_uuid: "26dae147-56b4-4e00-abe0-7e1220a305aa",
        referral_code: null,
        leads_code: "GBL250905082807721",
        terms_and_condition: null,
        branch_name: "NOVA SCOTIA",
        branch_uuid: "91b786bf-49f8-b8a7-ba14-051053aa8c47",
        service_type: "PR",
        service_sub_type: "Permanent Residence",
        applicant_first_name: "Akshay",
        applicant_last_name: "Dubey",
        nationality: "India",
        country: "Canada",
        state_or_province: "Nova Scotia",
        applicant_date_of_birth: "1989-07-29T00:00:00.000Z",
        age: null,
        applicant_sex: null,
        contact_number: "1234567890",
        email: "akshay@gmail.com",
        marital_status: "MARRIED",
        education: [],
        work_history: [],
        english_language_test_type: null,
        english_test_result_less_than_two_years: null,
        english_ability_speaking: null,
        english_ability_reading: null,
        english_ability_writing: null,
        english_ability_listening: null,
        english_ability_total_points: null,
        applicant_crs_points: null,
        leads_source: null,
        total: null,
        funds_available: null,
        prior_travel_history: null,
        country_code: null,
        no_work_experience: null,
        asignee_uuid: null,
        asignee_email: null,
        asignee_name: null,
        time_to_contact: null,
        assigned_to_id: null,
        status: "ACTIVE",
        created_by_uuid: null,
        created_by_name: "Ramesh",
        modified_by_uuid: null,
        modified_by_name: null,
        create_ts: "2025-09-05T08:28:07.000Z",
        insert_ts: "2025-09-05T08:28:48.000Z"
      },
      {
        leads_uuid: "0e0c367d-078a-4651-b1a1-e71b8384dd73",
        referral_code: "UME2556",
        leads_code: "GBL250812160806684",
        terms_and_condition: 1,
        branch_name: "NOVA SCOTIA",
        branch_uuid: "91b78ebf-8ba7-45f8-baf4-051053aa8c47",
        service_type: "",
        service_sub_type: null,
        applicant_first_name: "Umesh",
        applicant_last_name: "Yadav",
        nationality: "India",
        country: "",
        state_or_province: "",
        country_of_residence: "Canada",
        status_in_country: "STUDY",
        applicant_date_of_birth: "1997-08-11T00:00:00.000Z",
        age: 28,
        applicant_sex: "MALE",
        contact_number: "1234567890",
        email: "umesh@edgenroots.net",
        marital_status: "MARRIED",
        education: [
          {
            to: "2019-05-30T18:30:00.000Z",
            from: "2015-07-31T18:30:00.000Z",
            country: "INDIA",
            qualification: "BECHELOR_DEGREE_OR_THREE_OR_MORE_YEAR_PROGRAM",
            marks_percentage: "80",
            school_or_university: "I.K. Gujral Punjab Technical University Jalandhar"
          }
        ],
        work_history: [],
        english_language_test_type: "IELTS",
        english_test_result_less_than_two_years: "YES",
        english_ability_speaking: 10,
        english_ability_reading: 10,
        english_ability_writing: 10,
        english_ability_listening: 10,
        english_ability_total_points: 128,
        applicant_crs_points: {
          total: 387,
          core_human_capital_factor: {
            age: 100,
            subtotal: 362,
            level_of_education: 112,
            official_languages: {
              first_official_language: 128,
              second_official_language: 22
            },
            canadian_work_experience: 0,
            official_languages_subtotal: 150
          }
        },
        leads_source: "GOOGLE",
        total: 387,
        funds_available: "25001-50000",
        prior_travel_history: "NO",
        country_code: "+1",
        no_work_experience: 1,
        asignee_uuid: null,
        asignee_email: null,
        asignee_name: null,
        time_to_contact: null,
        assigned_to_id: "44",
        status: "ACTIVE",
        created_by_uuid: "b0c3fe31-5b09-419c-a180-1b1906ab4b6e",
        created_by_name: "Kamal Admin",
        modified_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
        modified_by_name: "Umesh Yadav",
        create_ts: "2025-08-12T16:08:06.000Z",
        insert_ts: "2025-08-26T15:18:20.000Z"
      }
    ]
  });
});

// Customer API - Get customer endpoint
app.get("/api/v1/customer/get-customer", (req, res) => {
  console.log("👤 Customer request received:", {
    query: req.query,
    from_date: req.query.from_date,
    to_date: req.query.to_date,
    pageNo: req.query.pageNo,
    itemPerPage: req.query.itemPerPage,
    timestamp: new Date().toISOString(),
  });

  // Mock customer data - matches Nova World Group API structure exactly
  res.json({
    message: "Customers",
    totalRecords: 0,
    currentRecords: 0,
    data: []
  });
});

// General API - File explorer endpoint
app.post("/api/v1/general/file-explorer", (req, res) => {
  console.log("📁 File explorer request received:", {
    body: req.body,
    headers: req.headers,
    timestamp: new Date().toISOString(),
  });

  // Mock file explorer response - placeholder structure
  res.json({
    success: true,
    data: []
  });
});

// Login endpoint
app.post("/api/v1/authentication/login", (req, res) => {
  console.log("🔐 Login request received:", {
    body: req.body,
    headers: req.headers,
    origin: req.get("origin"),
    userAgent: req.get("user-agent"),
    timestamp: new Date().toISOString(),
  });

  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    console.log("❌ Login failed - Missing credentials:", { email: !!email, password: !!password });
    return res.status(400).json({
      success: false,
      error: {
        code: "MISSING_CREDENTIALS",
        message: "Email and password are required",
      },
    });
  }

  // Simple mock authentication (replace with real logic)
  if (email === "sakshi.jadhav@addcomposites.com" && password === "12345678") {
    console.log("✅ Login successful for:", email);
    console.log("📤 Sending login response...");

    res.json({
      message: "Login successful.",
      data: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsX25hbWUiOiJTYWtzaGkgSmFkaGF2IiwidXNlcl9mYWN0X3VuaXF1ZV9pZCI6MTIsInVzZXJfdXVpZCI6IjA1MjJiNmFjLTNlYzctNGE2Zi05MmIwLWY2YmVjZDZlMzQ2ZiIsImVtYWlsIjoic2Frc2hpLmphZGhhdkBhZGRjb21wb3NpdGVzLmNvbSIsInJvbGVfdXVpZCI6IjFhMjIwOWU5LTIxZjctNDQ0OC1iMTQ0LTYxMWJkMzljODUxNyIsInJvbGVfdmFsdWUiOiJBRE1JTiIsImJyYW5jaF91dWlkIjoiOTFiNzhlYmYtOGJhNy00NWY4LWJhZjQtMDUxMDUzYWE4YzQ3IiwiaWF0IjoxNzU4MDc5MjU1LCJleHAiOjE3NjU4NTUyNTV9.jQxo_eXzYfbzMdBS2wrQG3izcOCQRZvkR5SvDYLYEfg",
        isOTPPreview: false,
        user: {
          user_fact_id: 40,
          user_fact_unique_id: 12,
          user_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
          email: email,
          status: "ACTIVE",
          created_by_uuid: "6c96e128-3b41-4a8e-86a6-e937323e84ed",
          created_by_name: "Monika",
          create_ts: "2025-07-02T18:08:15.000Z",
          user_dim_id: 56,
          user_dim_unique_id: 12,
          role_uuid: "1a2209e9-21f7-4448-b144-611bd39c8517",
          role_value: "ADMIN",
          user_profile_id: 89,
          user_profile_unique_id: 12,
          first_name: "Sakshi",
          last_name: "Jadhav",
          full_name: "Sakshi Jadhav",
          personal_email: email,
          job_title: null,
          user_type: null,
          assigned_phone_number: null,
          shared_email: null,
          mobile: null,
          home_phone: null,
          linkedin_profile: null,
          hire_date: null,
          last_day_at_work: null,
          department: null,
          fax: null,
          date_of_birth: null,
          mother_maiden_name: null,
          photo: null,
          signature: null,
          street_address: null,
          unit_or_suite: null,
          city: null,
          csr: null,
          csr_code: null,
          marketer: null,
          marketer_code: null,
          producer_one: null,
          producer_one_code: null,
          producer_two: null,
          producer_two_code: null,
          producer_three: null,
          producer_three_code: null,
          branch_code: null,
          province_or_state: null,
          postal_code: null,
          country: null,
          languages_known: null,
          documents: null,
          branch_name: "NOVA SCOTIA",
          branch_uuid: "91b78ebf-8ba7-45f8-baf4-051053aa8c47",
          referral_code: "NW-40",
        },
      },
    });
    console.log("✅ Login response sent successfully");
  } else {
    console.log("❌ Login failed for:", email);
    res.status(401).json({
      success: false,
      error: {
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
      },
    });
  }
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

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`🔌 Socket.IO client connected: ${socket.id}`);
  console.log(
    `🌐 Socket.IO connection from origin: ${socket.handshake.headers.origin}`
  );

  // Send welcome message
  socket.emit("welcome", {
    message: "Connected to Nove Backend Socket.IO",
    socketId: socket.id,
    timestamp: new Date().toISOString(),
  });

  // Handle chat messages (if needed)
  socket.on("chat_message", (data) => {
    console.log(`💬 Chat message from ${socket.id}:`, data);
    // Broadcast to all clients
    io.emit("chat_message", {
      ...data,
      socketId: socket.id,
      timestamp: new Date().toISOString(),
    });
  });

  // Handle user authentication via socket
  socket.on("user_auth", (data) => {
    console.log(`🔐 User auth via socket from ${socket.id}:`, data);
    // You can add authentication logic here
    socket.emit("auth_response", {
      success: true,
      message: "Authentication successful",
      socketId: socket.id,
    });
  });

  // Handle disconnection
  socket.on("disconnect", (reason) => {
    console.log(
      `🔌 Socket.IO client disconnected: ${socket.id}, reason: ${reason}`
    );
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Auth service running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 Socket.IO server: http://localhost:${PORT}/socket.io/`);
  console.log(
    `🔐 Auth API: http://localhost:${PORT}/api/v1/authentication/status`
  );
  console.log(
    `🏢 Public Company Info: http://localhost:${PORT}/api/v1/companyInformation/get-public-company-information`
  );
  console.log(`👤 User Info: http://localhost:${PORT}/api/v1/user/get-user`);
  console.log(
    `💬 Conversation Info: http://localhost:${PORT}/api/v1/conversation/get-conversation`
  );
});
