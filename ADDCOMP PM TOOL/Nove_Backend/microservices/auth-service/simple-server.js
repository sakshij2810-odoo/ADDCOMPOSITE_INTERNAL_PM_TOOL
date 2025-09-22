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

// Company configuration storage (similar to company_outlet_env)
let companyConfigStorage = [
  {
    id: 1,
    company_outlet_env: "c4f8a2b1-1234-5678-9abc-def012345678",
    master_company_outlet: "m1a2b3c4-5678-9def-0123-456789abcdef",
    env_name: "WhatsApp Phone ID",
    env_key: "WHATSAPP_PHONE_ID",
    env_value: "+919511119155",
    value_datatype: "STRING",
    is_encrypted: 0,
    status: "ACTIVE",
    created_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    created_by_name: "Sakshi Jadhav",
    modified_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    modified_by_name: "Sakshi Jadhav",
    create_ts: "2025-09-22T11:00:00.000Z",
    insert_ts: "2025-09-22T11:00:00.000Z"
  },
  {
    id: 2,
    company_outlet_env: "d5f9b3c2-2345-6789-bcde-f123456789ab",
    master_company_outlet: "m1a2b3c4-5678-9def-0123-456789abcdef",
    env_name: "Enable Email Status Reports",
    env_key: "SEND_STATUS_REPORT",
    env_value: "true",
    value_datatype: "BOOLEAN",
    is_encrypted: 0,
    status: "ACTIVE",
    created_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    created_by_name: "Sakshi Jadhav",
    modified_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    modified_by_name: "Sakshi Jadhav",
    create_ts: "2025-09-22T11:01:00.000Z",
    insert_ts: "2025-09-22T11:01:00.000Z"
  },
  {
    id: 3,
    company_outlet_env: "e6a0c4d3-3456-789a-cdef-23456789abcd",
    master_company_outlet: "m1a2b3c4-5678-9def-0123-456789abcdef",
    env_name: "Status Report Webhook URL",
    env_key: "STATUS_REPORT_WEBHOOK",
    env_value: "https://api.example.com/webhook/status",
    value_datatype: "URL",
    is_encrypted: 0,
    status: "ACTIVE",
    created_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    created_by_name: "Sakshi Jadhav",
    modified_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    modified_by_name: "Sakshi Jadhav",
    create_ts: "2025-09-22T11:02:00.000Z",
    insert_ts: "2025-09-22T11:02:00.000Z"
  },
  {
    id: 4,
    company_outlet_env: "f7b1d5e4-4567-89ab-def0-3456789abcde",
    master_company_outlet: "m1a2b3c4-5678-9def-0123-456789abcdef",
    env_name: "WhatsApp Business Account ID",
    env_key: "WHATSAPP_BUSINESS_ACCOUNT_ID",
    env_value: "694409273758187",
    value_datatype: "STRING",
    is_encrypted: 0,
    status: "ACTIVE",
    created_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    created_by_name: "Sakshi Jadhav",
    modified_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    modified_by_name: "Sakshi Jadhav",
    create_ts: "2025-09-22T11:03:00.000Z",
    insert_ts: "2025-09-22T11:03:00.000Z"
  },
  {
    id: 5,
    company_outlet_env: "a8c2e6f5-5678-9abc-ef01-456789abcdef",
    master_company_outlet: "m1a2b3c4-5678-9def-0123-456789abcdef",
    env_name: "Company Email Address",
    env_key: "COMPANY_EMAIL",
    env_value: "info@nwimmigration.ca",
    value_datatype: "EMAIL",
    is_encrypted: 0,
    status: "ACTIVE",
    created_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    created_by_name: "Sakshi Jadhav",
    modified_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    modified_by_name: "Sakshi Jadhav",
    create_ts: "2025-09-22T11:04:00.000Z",
    insert_ts: "2025-09-22T11:04:00.000Z"
  },
  {
    id: 6,
    company_outlet_env: "b9d3f7a6-6789-abcd-f012-56789abcdef0",
    master_company_outlet: "m1a2b3c4-5678-9def-0123-456789abcdef",
    env_name: "Database Connection String",
    env_key: "DATABASE_URL",
    env_value: "postgresql://user:password@localhost:5432/pm_platform",
    value_datatype: "CONNECTION_STRING",
    is_encrypted: 1,
    status: "ACTIVE",
    created_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    created_by_name: "Sakshi Jadhav",
    modified_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    modified_by_name: "Sakshi Jadhav",
    create_ts: "2025-09-22T11:05:00.000Z",
    insert_ts: "2025-09-22T11:05:00.000Z"
  },
  {
    id: 7,
    company_outlet_env: "c0e4a8b7-789a-bcde-0123-6789abcdef01",
    master_company_outlet: "m1a2b3c4-5678-9def-0123-456789abcdef",
    env_name: "API Rate Limit",
    env_key: "API_RATE_LIMIT",
    env_value: "1000",
    value_datatype: "NUMBER",
    is_encrypted: 0,
    status: "ACTIVE",
    created_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    created_by_name: "Sakshi Jadhav",
    modified_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    modified_by_name: "Sakshi Jadhav",
    create_ts: "2025-09-22T11:06:00.000Z",
    insert_ts: "2025-09-22T11:06:00.000Z"
  },
  {
    id: 8,
    company_outlet_env: "d1f5b9c8-89ab-cdef-1234-789abcdef012",
    master_company_outlet: "m1a2b3c4-5678-9def-0123-456789abcdef",
    env_name: "Company Logo URL",
    env_key: "COMPANY_LOGO_URL",
    env_value: "https://nwimmigration.ca/assets/logo.png",
    value_datatype: "URL",
    is_encrypted: 0,
    status: "ACTIVE",
    created_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    created_by_name: "Sakshi Jadhav",
    modified_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    modified_by_name: "Sakshi Jadhav",
    create_ts: "2025-09-22T11:07:00.000Z",
    insert_ts: "2025-09-22T11:07:00.000Z"
  }
];

// JSON storage for branches (similar to branch_json_store table)
let branchJsonStorage = [];

// In-memory storage for branches (for demo purposes)
let branchesStorage = [
  {
    branch_uuid: "91b78ebf-8ba7-45f8-baf4-051053aa8c47",
    branch_name: "NOVA SCOTIA",
    branch_code: "NS-001",
    branch_email: "info@novascotia.nwimmigration.ca",
    branch_logo: null,
    description: "Nova Scotia Branch",
    branch_phone_no: "1 647 404 6682",
    branch_mobile_no: "1 647 403 6682",
    status: "ACTIVE",
    created_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    created_by_name: "Sakshi Jadhav",
    modified_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    modified_by_name: "Sakshi Jadhav",
    create_ts: new Date().toISOString(),
    insert_ts: new Date().toISOString()
  },
  {
    branch_uuid: "d9caf335-d89f-4d65-8b74-2e502fc57189",
    branch_name: "TORONTO",
    branch_code: "TOR-001",
    branch_email: "info@toronto.nwimmigration.ca",
    branch_logo: null,
    description: "Toronto Branch",
    branch_phone_no: "1 416 555 0123",
    branch_mobile_no: "1 416 555 0124",
    status: "ACTIVE",
    created_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    created_by_name: "Sakshi Jadhav",
    modified_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    modified_by_name: "Sakshi Jadhav",
    create_ts: new Date().toISOString(),
    insert_ts: new Date().toISOString()
  },
  {
    branch_uuid: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    branch_name: "VANCOUVER",
    branch_code: "VAN-001",
    branch_email: "info@vancouver.nwimmigration.ca",
    branch_logo: null,
    description: "Vancouver Branch",
    branch_phone_no: "1 604 555 0123",
    branch_mobile_no: "1 604 555 0124",
    status: "ACTIVE",
    created_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    created_by_name: "Sakshi Jadhav",
    modified_by_uuid: "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f",
    modified_by_name: "Sakshi Jadhav",
    create_ts: new Date().toISOString(),
    insert_ts: new Date().toISOString()
  }
];

// In-memory storage for users (for demo purposes)
let usersStorage = [];

// In-memory storage for role groups (for demo purposes)
let roleGroupsStorage = [
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
];

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
    const dbUsers = await prisma.user.findMany({
      where: {
        ...(status && { status }),
        ...(user_uuid && { userUuid: user_uuid }),
      },
      take: 10, // Limit results
    });

    console.log(`📊 Found ${dbUsers.length} users in database`);

    // Get users from our in-memory storage
    let storageUsers = usersStorage;
    
    // Filter by status if provided
    if (status && status !== '-1') {
      storageUsers = usersStorage.filter(user => user.status === status);
    }
    
    // Filter by user_uuid if provided
    if (user_uuid) {
      storageUsers = usersStorage.filter(user => user.user_uuid === user_uuid);
    }

    console.log(`📊 Found ${storageUsers.length} users in storage`);

    // Transform storage users to match database format
    const transformedStorageUsers = storageUsers.map((user, index) => ({
      user_fact_id: index + 1000, // Generate unique ID for storage users
      user_uuid: user.user_uuid,
      email: user.email,
      status: user.status,
      created_by_uuid: user.created_by_uuid,
      created_by_name: user.created_by_name,
      create_ts: user.insert_ts,
      insert_ts: user.insert_ts,
      user_dim_id: index + 1000,
      role_uuid: user.user_role === "ADMIN" ? "1a2209e9-21f7-4448-b144-611bd39c8517" : "0870ac83-045a-4263-80f1-9cd65e25c0bc",
      role_value: user.user_role,
      user_profile_id: index + 1000,
      first_name: user.first_name,
      last_name: user.last_name,
      full_name: `${user.first_name} ${user.last_name}`.trim(),
      personal_email: user.email,
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
      branch_name: user.branch_name,
      branch_uuid: user.branch_uuid,
      referral_code: null,
      module_security: []
    }));

    // Combine database users and storage users
    const allUsers = [...dbUsers, ...transformedStorageUsers];

    console.log(`📊 Total users (DB + Storage): ${allUsers.length}`);

    if (allUsers.length === 0) {
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
      // Transform combined users to match API format
      const transformedUsers = allUsers.map(user => ({
        user_fact_id: user.userFactId || user.user_fact_id,
        user_uuid: user.userUuid || user.user_uuid,
        email: user.email,
        status: user.status,
        created_by_uuid: user.createdByUuid || user.created_by_uuid,
        created_by_name: user.createdByName || user.created_by_name,
        create_ts: user.createTs || user.create_ts,
        insert_ts: user.insertTs || user.insert_ts,
        user_dim_id: user.userDimId || user.user_dim_id,
        role_uuid: user.roleUuid || user.role_uuid,
        role_value: user.roleValue || user.role_value,
        user_profile_id: user.userProfileId || user.user_profile_id,
        first_name: user.firstName || user.first_name,
        last_name: user.lastName || user.last_name,
        full_name: user.name || user.full_name,
        personal_email: user.personalEmail || user.personal_email,
        job_title: user.jobTitle || user.job_title,
        user_type: user.userType || user.user_type,
        assigned_phone_number: user.assignedPhoneNumber || user.assigned_phone_number,
        shared_email: user.sharedEmail || user.shared_email,
        mobile: user.mobile,
        home_phone: user.homePhone || user.home_phone,
        linkedin_profile: user.linkedinProfile || user.linkedin_profile,
        hire_date: user.hireDate || user.hire_date,
        last_day_at_work: user.lastDayAtWork || user.last_day_at_work,
        department: user.department,
        fax: user.fax,
        date_of_birth: user.dateOfBirth || user.date_of_birth,
        mother_maiden_name: user.motherMaidenName || user.mother_maiden_name,
        photo: user.photo,
        signature: user.signature,
        street_address: user.streetAddress || user.street_address,
        unit_or_suite: user.unitOrSuite || user.unit_or_suite,
        city: user.city,
        csr: user.csr,
        csr_code: user.csrCode || user.csr_code,
        marketer: user.marketer,
        marketer_code: user.marketerCode || user.marketer_code,
        producer_one: user.producerOne || user.producer_one,
        producer_one_code: user.producerOneCode || user.producer_one_code,
        producer_two: user.producerTwo || user.producer_two,
        producer_two_code: user.producerTwoCode || user.producer_two_code,
        producer_three: user.producerThree || user.producer_three,
        producer_three_code: user.producerThreeCode || user.producer_three_code,
        branch_code: user.branchCode || user.branch_code,
        province_or_state: user.provinceOrState || user.province_or_state,
        postal_code: user.postalCode || user.postal_code,
        country: user.country,
        languages_known: user.languagesKnown || user.languages_known,
        documents: user.documents,
        branch_name: user.branchName || user.branch_name,
        branch_uuid: user.branchUuid || user.branch_uuid,
        referral_code: user.referralCode || user.referral_code,
        module_security: [] // Add security modules if needed
      }));

      console.log("✅ Database user data response sent successfully");
      res.json({
        message: "All User",
        totalRecords: allUsers.length,
        currentRecords: allUsers.length,
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

  // Return stored branches with pagination support
  const { pageNo = 1, itemPerPage = 10, status } = req.query;
  let filteredBranches = branchesStorage;

  // Filter by status if provided
  if (status && status !== '-1') {
    filteredBranches = branchesStorage.filter(branch => branch.status === status);
  }

  // Calculate pagination
  const startIndex = (pageNo - 1) * itemPerPage;
  const endIndex = startIndex + parseInt(itemPerPage);
  const paginatedBranches = filteredBranches.slice(startIndex, endIndex);

  console.log("📊 Returning branch data:", {
    totalBranches: branchesStorage.length,
    filteredBranches: filteredBranches.length,
    paginatedBranches: paginatedBranches.length,
    pageNo,
    itemPerPage
  });

  res.json({
    message: "All Branch",
    totalRecords: filteredBranches.length,
    currentRecords: paginatedBranches.length,
    data: paginatedBranches
  });
});

// Data Management API - Get Single Branch endpoint
app.get("/api/v1/dataManagement/get-single-branch", (req, res) => {
  console.log("🏢 Single branch request received:", {
    query: req.query,
    uuid: req.query.uuid,
    timestamp: new Date().toISOString(),
  });

  const { uuid } = req.query;

  if (!uuid) {
    return res.status(400).json({
      success: false,
      message: "Branch UUID is required",
      error: "MISSING_UUID"
    });
  }

  // Find branch by UUID in our storage
  const branch = branchesStorage.find(branch => branch.branch_uuid === uuid);

  if (!branch) {
    return res.status(404).json({
      success: false,
      message: "Branch not found",
      error: "BRANCH_NOT_FOUND"
    });
  }

  console.log("✅ Single branch found:", branch.branch_uuid);

  res.json({
    success: true,
    message: "Branch retrieved successfully",
    data: branch
  });
});

// Data Management API - Upsert Branch endpoint
app.post("/api/v1/dataManagement/upsert-branch", (req, res) => {
  console.log("🏢 Branch upsert request received:", {
    body: req.body,
    headers: req.headers,
    timestamp: new Date().toISOString(),
  });

  try {
    // Destructure all fields including branch_uuid for upsert logic
    const {
      branch_uuid,
      branch_name,
      branch_code,
      branch_email,
      branch_logo,
      description,
      branch_phone_no,
      branch_mobile_no,
      status
    } = req.body;

    // Mock created/modified user data (replace with actual logged-in user context)
    const uuid = "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f";
    const name = "Sakshi Jadhav";

    let resultBranch;
    let isUpdate = false;

    // Check if branch_uuid exists in request body (update operation)
    if (branch_uuid) {
      // Find existing branch by UUID
      const existingBranchIndex = branchesStorage.findIndex(branch => branch.branch_uuid === branch_uuid);
      
      if (existingBranchIndex !== -1) {
        // Update existing branch
        const existingBranch = branchesStorage[existingBranchIndex];
        resultBranch = {
          ...existingBranch,
          branch_name: branch_name || existingBranch.branch_name,
          branch_code: branch_code || existingBranch.branch_code,
          branch_email: branch_email || existingBranch.branch_email,
          branch_logo: branch_logo !== undefined ? branch_logo : existingBranch.branch_logo,
          description: description || existingBranch.description,
          branch_phone_no: branch_phone_no || existingBranch.branch_phone_no,
          branch_mobile_no: branch_mobile_no || existingBranch.branch_mobile_no,
          status: status || existingBranch.status,
          modified_by_uuid: uuid,
          modified_by_name: name,
          insert_ts: new Date().toISOString()
        };
        
        // Update the branch in storage
        branchesStorage[existingBranchIndex] = resultBranch;
        isUpdate = true;
        
        console.log("✅ Branch updated successfully:", resultBranch.branch_uuid);
      } else {
        // Branch UUID provided but not found - treat as new creation
        console.log("⚠️ Branch UUID provided but not found, creating new branch");
      }
    }

    // If not an update, create new branch
    if (!isUpdate) {
      resultBranch = {
        branch_uuid: branch_uuid || "91b78ebf-8ba7-45f8-baf4-051053aa8c47", // Use provided UUID or generate new one
        branch_name: branch_name || "NOVA SCOTIA",
        branch_code: branch_code || "NS-001",
        branch_email: branch_email || "info@novascotia.nwimmigration.ca",
        branch_logo: branch_logo || null,
        description: description || "Nova Scotia Branch",
        branch_phone_no: branch_phone_no || "1 647 404 6682",
        branch_mobile_no: branch_mobile_no || "1 647 403 6682",
        status: status || "ACTIVE",
        created_by_uuid: uuid,
        created_by_name: name,
        modified_by_uuid: uuid,
        modified_by_name: name,
        create_ts: new Date().toISOString(),
        insert_ts: new Date().toISOString()
      };

      // Store the new branch in our in-memory storage
      branchesStorage.push(resultBranch);
      
      console.log("✅ Branch created successfully:", resultBranch.branch_uuid);
    }

    // Dynamic response based on operation type
    res.status(isUpdate ? 200 : 201).json({
      message: isUpdate ? "Branch updated successfully." : "Branch created successfully.",
      data: resultBranch
    });
  } catch (err) {
    console.error("❌ Error in branch upsert:", err);
    res.status(500).json({ 
      message: "Error creating branch", 
      error: err.message 
    });
  }
});

// User API - Get Branch endpoint (for user creation form)
app.get("/api/v1/user/get-branch", (req, res) => {
  console.log("🏢 User branch request received:", {
    query: req.query,
    pageNo: req.query.pageNo,
    itemPerPage: req.query.itemPerPage,
    timestamp: new Date().toISOString(),
  });

  // Return stored branches with pagination support
  const { pageNo = 1, itemPerPage = 20 } = req.query;
  
  // Calculate pagination
  const startIndex = (pageNo - 1) * itemPerPage;
  const endIndex = startIndex + parseInt(itemPerPage);
  const paginatedBranches = branchesStorage.slice(startIndex, endIndex);

  // Transform data to match expected structure with branch_id
  const transformedBranches = paginatedBranches.map((branch, index) => ({
    branch_id: startIndex + index + 1, // Generate sequential ID
    branch_uuid: branch.branch_uuid,
    branch_name: branch.branch_name,
    branch_code: branch.branch_code,
    branch_phone_no: branch.branch_phone_no,
    branch_mobile_no: branch.branch_mobile_no,
    branch_logo: branch.branch_logo,
    branch_email: branch.branch_email,
    description: branch.description,
    branch_address_line1: null,
    branch_address_line2: null,
    branch_address_state: null,
    branch_address_city: null,
    branch_address_district: null,
    branch_address_country: null,
    branch_address_pincode: null,
    status: branch.status,
    created_by_uuid: branch.created_by_uuid,
    created_by_name: branch.created_by_name,
    modified_by_uuid: branch.modified_by_uuid,
    modified_by_name: branch.modified_by_name,
    create_ts: branch.create_ts,
    insert_ts: branch.insert_ts
  }));

  console.log("📊 Returning branch data for user form:", {
    totalBranches: branchesStorage.length,
    paginatedBranches: transformedBranches.length,
    pageNo,
    itemPerPage
  });

  res.json({
    message: "All Branch",
    totalRecords: branchesStorage.length,
    currentRecords: transformedBranches.length,
    data: transformedBranches
  });
});

// User API - Get Branch endpoint (alternative path for frontend compatibility)
app.get("/user/get-branch", (req, res) => {
  console.log("🏢 User branch request received (alt path):", {
    query: req.query,
    pageNo: req.query.pageNo,
    itemPerPage: req.query.itemPerPage,
    timestamp: new Date().toISOString(),
  });

  // Return stored branches with pagination support
  const { pageNo = 1, itemPerPage = 20 } = req.query;
  
  // Calculate pagination
  const startIndex = (pageNo - 1) * itemPerPage;
  const endIndex = startIndex + parseInt(itemPerPage);
  const paginatedBranches = branchesStorage.slice(startIndex, endIndex);

  // Transform data to match IUserBranch interface expected by frontend
  const transformedBranches = paginatedBranches.map((branch) => ({
    branch_uuid: branch.branch_uuid,
    branch_name: branch.branch_name,
    status: branch.status
  }));

  console.log("📊 Returning branch data for user form (alt path):", {
    totalBranches: branchesStorage.length,
    paginatedBranches: transformedBranches.length,
    pageNo,
    itemPerPage
  });

  res.json({
    message: "All Branch",
    totalRecords: branchesStorage.length,
    currentRecords: transformedBranches.length,
    data: transformedBranches
  });
});

// User API - Upsert User endpoint
app.post("/api/v1/user/upsert-user", (req, res) => {
  console.log("👤 User upsert request received:", {
    body: req.body,
    headers: req.headers,
    timestamp: new Date().toISOString(),
  });

  try {
    // Destructure all fields including user_uuid for upsert logic
    const {
      user_uuid,
      first_name,
      last_name,
      email,
      user_role,
      branch_uuid,
      status
    } = req.body;

    // Mock created/modified user data (replace with actual logged-in user context)
    const adminUuid = "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f";
    const adminName = "Sakshi jadhav";

    let resultUser;
    let isUpdate = false;

    // Find branch name from branch_uuid
    const branch = branchesStorage.find(b => b.branch_uuid === branch_uuid);
    const branchName = branch ? branch.branch_name : "Unknown Branch";

    // Check if user_uuid exists in request body (update operation)
    if (user_uuid) {
      // Find existing user by UUID
      const existingUserIndex = usersStorage.findIndex(user => user.user_uuid === user_uuid);
      
      if (existingUserIndex !== -1) {
        // Update existing user
        const existingUser = usersStorage[existingUserIndex];
        resultUser = {
          user_uuid: existingUser.user_uuid,
          first_name: first_name || existingUser.first_name,
          last_name: last_name || existingUser.last_name,
          email: email || existingUser.email,
          user_role: user_role || existingUser.user_role,
          branch_uuid: branch_uuid || existingUser.branch_uuid,
          branch_name: branchName || existingUser.branch_name,
          status: status || existingUser.status,
          created_by_uuid: existingUser.created_by_uuid,
          created_by_name: existingUser.created_by_name,
          modified_by_uuid: adminUuid,
          modified_by_name: adminName,
          insert_ts: new Date().toISOString()
        };
        
        // Update the user in storage
        usersStorage[existingUserIndex] = resultUser;
        isUpdate = true;
        
        console.log("✅ User updated successfully:", resultUser.user_uuid);
      } else {
        // User UUID provided but not found - treat as new creation
        console.log("⚠️ User UUID provided but not found, creating new user");
      }
    }

    // If not an update, create new user
    if (!isUpdate) {
      resultUser = {
        user_uuid: user_uuid || generateUUID(), // Use provided UUID or generate new one
        first_name: first_name || "",
        last_name: last_name || "",
        email: email || "",
        user_role: user_role || "EMPLOYEE",
        branch_uuid: branch_uuid || "",
        branch_name: branchName || "",
        status: status || "ACTIVE",
        created_by_uuid: adminUuid,
        created_by_name: adminName,
        modified_by_uuid: adminUuid,
        modified_by_name: adminName,
        insert_ts: new Date().toISOString()
      };

      // Store the new user in our in-memory storage
      usersStorage.push(resultUser);
      
      console.log("✅ User created successfully:", resultUser.user_uuid);
    }

    // Dynamic response based on operation type
    res.status(isUpdate ? 200 : 201).json({
      message: isUpdate ? "User updated successfully." : "User created successfully.",
      data: resultUser
    });
  } catch (err) {
    console.error("❌ Error in user upsert:", err);
    res.status(500).json({ 
      message: "Error creating/updating user", 
      error: err.message 
    });
  }
});

// Helper function to generate UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Helper function to generate template code
function generateTemplateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Security API - Role Module Content Access Permission endpoint
app.get("/api/v1/security/get-role-module-content-access-permission", (req, res) => {
  console.log("🔐 Get role module content access permission request received:", {
    query: req.query,
    headers: req.headers,
    origin: req.get("origin"),
    timestamp: new Date().toISOString(),
  });

  // Return the same data structure as the production API
  const mockModuleData = [
    {
      "module_uuid": "36b96d9d-9fd4-436d-80b5-35dbd74a1366",
      "module_name": "Tasks",
      "submodule_name": "Taskboard",
      "map_column_user_uuid": [
        "created_by_uuid",
        "modified_by_uuid"
      ],
      "column_relation_options": [
        {
          "api": "/user/get-user",
          "field": "email",
          "value": "user_uuid",
          "column_key": "user_uuid",
          "column_label": "User"
        },
        {
          "api": "/user/get-branch",
          "field": "branch_name",
          "value": "branch_uuid",
          "column_key": "branch_uuid",
          "column_label": "Branch"
        }
      ],
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "insert_ts": "2024-11-21T11:09:51.000Z",
      "role_name": "",
      "role_uuid": "",
      "view_access": 0,
      "edit_access": 0,
      "send_sms": 0,
      "send_mail": 0,
      "send_whatsapp": 0,
      "send_call": 0,
      "show_module": 0,
      "filter_values": {}
    },
    {
      "module_uuid": "dfaf7756-1362-459a-8560-d7827d1f352c",
      "module_name": "Users",
      "submodule_name": "Users",
      "map_column_user_uuid": [
        "created_by_uuid",
        "modified_by_uuid"
      ],
      "column_relation_options": [
        {
          "api": "/user/get-user",
          "field": "email",
          "value": "user_uuid",
          "column_key": "user_uuid",
          "column_label": "User"
        },
        {
          "api": "/user/get-branch",
          "field": "branch_name",
          "value": "branch_uuid",
          "column_key": "branch_uuid",
          "column_label": "Branch"
        }
      ],
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "insert_ts": "2024-11-21T11:09:51.000Z",
      "role_name": "",
      "role_uuid": "",
      "view_access": 0,
      "edit_access": 0,
      "send_sms": 0,
      "send_mail": 0,
      "send_whatsapp": 0,
      "send_call": 0,
      "show_module": 0,
      "filter_values": {}
    },
    {
      "module_uuid": "b1fbbbc8-e078-4088-aac4-1811baf73696",
      "module_name": "Data Management",
      "submodule_name": "Branch",
      "map_column_user_uuid": [
        "created_by_uuid",
        "modified_by_uuid"
      ],
      "column_relation_options": [
        {
          "api": "/user/get-user",
          "field": "email",
          "value": "user_uuid",
          "column_key": "user_uuid",
          "column_label": "User"
        },
        {
          "api": "/user/get-branch",
          "field": "branch_name",
          "value": "branch_uuid",
          "column_key": "branch_uuid",
          "column_label": "Branch"
        }
      ],
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "insert_ts": "2024-11-21T11:09:51.000Z",
      "role_name": "",
      "role_uuid": "",
      "view_access": 0,
      "edit_access": 0,
      "send_sms": 0,
      "send_mail": 0,
      "send_whatsapp": 0,
      "send_call": 0,
      "show_module": 0,
      "filter_values": {}
    }
  ];

  console.log("✅ Role module content access permission response sent successfully");
  res.json({
    message: "Module List",
    data: mockModuleData
  });
});

// Security API - Upsert Roles endpoint
app.post("/api/v1/security/upsert-roles", (req, res) => {
  console.log("🔐 Upsert roles request received:", {
    body: req.body,
    headers: req.headers,
    origin: req.get("origin"),
    timestamp: new Date().toISOString(),
  });

  try {
    const {
      role_name,
      role_group,
      status,
      role_uuid // For update operations
    } = req.body;

    const adminUuid = "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f";
    const adminName = "sakshi jadhav";

    let resultRole;
    let isUpdate = false;

    // Generate a new UUID if not provided
    const newRoleUuid = role_uuid || generateUUID();

    // For now, we'll just return the created role data
    // In a real implementation, this would interact with a database
    resultRole = {
      role_name: role_name || "NEW_ROLE",
      role_group: role_group || "EMPLOYEE",
      status: status || "ACTIVE",
      created_by_uuid: adminUuid,
      created_by_name: adminName,
      modified_by_uuid: adminUuid,
      modified_by_name: adminName,
      role_value: role_name || "NEW_ROLE",
      role_uuid: newRoleUuid
    };

    console.log("✅ Role upsert response sent successfully");
    res.status(201).json({
      message: "Roles created successfully.",
      data: resultRole
    });
  } catch (err) {
    console.error("❌ Error in role upsert:", err);
    res.status(500).json({
      message: "Error creating/updating role",
      error: err.message
    });
  }
});

// Security API - Upsert Role Module Content Access Permission endpoint
app.post("/api/v1/security/upsert-role-module-content-access-permission", (req, res) => {
  console.log("🔐 Upsert role module content access permission request received:", {
    body: req.body,
    headers: req.headers,
    origin: req.get("origin"),
    timestamp: new Date().toISOString(),
  });

  try {
    const {
      role_uuid,
      role_name,
      module_permissions // Array of module permissions
    } = req.body;

    const adminUuid = "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f";
    const adminName = "Umesh Yadav";

    // Mock data structure based on the production API response
    const mockModuleData = [
      {
        "module_uuid": "36b96d9d-9fd4-436d-80b5-35dbd74a1366",
        "module_name": "Tasks",
        "submodule_name": "Taskboard",
        "map_column_user_uuid": [
          "created_by_uuid",
          "modified_by_uuid"
        ],
        "column_relation_options": [
          {
            "api": "/user/get-user",
            "field": "email",
            "value": "user_uuid",
            "column_key": "user_uuid",
            "column_label": "User"
          },
          {
            "api": "/user/get-branch",
            "field": "branch_name",
            "value": "branch_uuid",
            "column_key": "branch_uuid",
            "column_label": "Branch"
          }
        ],
        "created_by_name": adminName,
        "modified_by_uuid": adminUuid,
        "modified_by_name": adminName,
        "insert_ts": "2024-11-21T11:09:51.000Z",
        "role_name": role_name || "abbc",
        "role_uuid": role_uuid || "0e9f19f5-5bfc-4a36-b16a-37a821eafa16",
        "view_access": 0,
        "edit_access": 0,
        "send_sms": 0,
        "send_mail": 0,
        "send_whatsapp": 0,
        "send_call": 0,
        "show_module": 0,
        "filter_values": "{}",
        "created_by_uuid": adminUuid,
        "role_module_uuid": generateUUID(),
        "create_ts": "2025-09-22 08-45-20",
        "status": "ACTIVE"
      },
      {
        "module_uuid": "dfaf7756-1362-459a-8560-d7827d1f352c",
        "module_name": "Users",
        "submodule_name": "Users",
        "map_column_user_uuid": [
          "created_by_uuid",
          "modified_by_uuid"
        ],
        "column_relation_options": [
          {
            "api": "/user/get-user",
            "field": "email",
            "value": "user_uuid",
            "column_key": "user_uuid",
            "column_label": "User"
          },
          {
            "api": "/user/get-branch",
            "field": "branch_name",
            "value": "branch_uuid",
            "column_key": "branch_uuid",
            "column_label": "Branch"
          }
        ],
        "created_by_name": adminName,
        "modified_by_uuid": adminUuid,
        "modified_by_name": adminName,
        "insert_ts": "2024-11-21T11:09:51.000Z",
        "role_name": role_name || "abbc",
        "role_uuid": role_uuid || "0e9f19f5-5bfc-4a36-b16a-37a821eafa16",
        "view_access": 0,
        "edit_access": 0,
        "send_sms": 0,
        "send_mail": 0,
        "send_whatsapp": 0,
        "send_call": 0,
        "show_module": 0,
        "filter_values": "{}",
        "created_by_uuid": adminUuid,
        "role_module_uuid": generateUUID(),
        "create_ts": "2025-09-22 08-45-20",
        "status": "ACTIVE"
      },
      {
        "module_uuid": "b1fbbbc8-e078-4088-aac4-1811baf73696",
        "module_name": "Data Management",
        "submodule_name": "Branch",
        "map_column_user_uuid": [
          "created_by_uuid",
          "modified_by_uuid"
        ],
        "column_relation_options": [
          {
            "api": "/user/get-user",
            "field": "email",
            "value": "user_uuid",
            "column_key": "user_uuid",
            "column_label": "User"
          },
          {
            "api": "/user/get-branch",
            "field": "branch_name",
            "value": "branch_uuid",
            "column_key": "branch_uuid",
            "column_label": "Branch"
          }
        ],
        "created_by_name": adminName,
        "modified_by_uuid": adminUuid,
        "modified_by_name": adminName,
        "insert_ts": "2024-11-21T11:09:51.000Z",
        "role_name": role_name || "abbc",
        "role_uuid": role_uuid || "0e9f19f5-5bfc-4a36-b16a-37a821eafa16",
        "view_access": 0,
        "edit_access": 0,
        "send_sms": 0,
        "send_mail": 0,
        "send_whatsapp": 0,
        "send_call": 0,
        "show_module": 0,
        "filter_values": "{}",
        "created_by_uuid": adminUuid,
        "role_module_uuid": generateUUID(),
        "create_ts": "2025-09-22 08-45-20",
        "status": "ACTIVE"
      }
    ];

    console.log("✅ Role module content access permission upsert response sent successfully");
    res.status(200).json({
      message: "Role module has been Updated.",
      data: mockModuleData
    });
  } catch (err) {
    console.error("❌ Error in role module permission upsert:", err);
    res.status(500).json({
      message: "Error creating/updating role module permissions",
      error: err.message
    });
  }
});

// Security API - Upsert Role Group endpoint
app.post("/api/v1/security/upsert-role-group", (req, res) => {
  console.log("🔐 Upsert role group request received:", {
    body: req.body,
    headers: req.headers,
    origin: req.get("origin"),
    timestamp: new Date().toISOString(),
  });

  try {
    const {
      role_group_uuid,
      role_group,
      status
    } = req.body;

    const adminUuid = "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f";
    const adminName = "Sakshi Jadhav";

    let resultRoleGroup;
    let isUpdate = false;

    if (role_group_uuid) {
      // Check if role group exists for update
      const existingRoleGroupIndex = roleGroupsStorage.findIndex(rg => rg.role_group_uuid === role_group_uuid);
      if (existingRoleGroupIndex !== -1) {
        const existingRoleGroup = roleGroupsStorage[existingRoleGroupIndex];
        resultRoleGroup = {
          ...existingRoleGroup,
          role_group: role_group || existingRoleGroup.role_group,
          status: status || existingRoleGroup.status,
          insert_ts: new Date().toISOString()
        };
        roleGroupsStorage[existingRoleGroupIndex] = resultRoleGroup;
        isUpdate = true;
        console.log("✅ Role group updated successfully:", resultRoleGroup.role_group_uuid);
      } else {
        console.log("⚠️ Role group UUID provided but not found, creating new role group");
      }
    }

    if (!isUpdate) {
      // Create new role group
      resultRoleGroup = {
        role_group_id: Math.max(...roleGroupsStorage.map(rg => rg.role_group_id)) + 1,
        role_group_unique_id: Math.max(...roleGroupsStorage.map(rg => rg.role_group_unique_id)) + 1,
        role_group_uuid: role_group_uuid || generateUUID(),
        role_group: role_group || "NEW_ROLE_GROUP",
        status: status || "ACTIVE",
        created_by_uuid: adminUuid,
        create_ts: new Date().toISOString(),
        insert_ts: new Date().toISOString()
      };
      roleGroupsStorage.push(resultRoleGroup);
      console.log("✅ Role group created successfully:", resultRoleGroup.role_group_uuid);
    }

    console.log("✅ Role group upsert response sent successfully");
    res.status(isUpdate ? 200 : 201).json({
      message: isUpdate ? "Role group updated successfully." : "Role group created successfully.",
      data: resultRoleGroup
    });
  } catch (err) {
    console.error("❌ Error in role group upsert:", err);
    res.status(500).json({
      message: "Error creating/updating role group",
      error: err.message
    });
  }
});

// Security API - Get Modules endpoint
app.get("/api/v1/security/get-modules", (req, res) => {
  console.log("🔐 Security modules request received:", {
    query: req.query,
    headers: req.headers,
    origin: req.get("origin"),
    timestamp: new Date().toISOString(),
  });

  // Return the same data structure as the production API
  const mockModulesData = [
    {
      "module_uuid": "36b96d9d-9fd4-436d-80b5-35dbd74a1366",
      "module_name": "Tasks",
      "submodule_name": "Taskboard",
      "table_name": "latest_task_module_wise",
      "map_column_user_uuid": [
        "created_by_uuid",
        "modified_by_uuid"
      ],
      "column_relation_options": [
        {
          "api": "/user/get-user",
          "field": "email",
          "value": "user_uuid",
          "column_key": "user_uuid",
          "column_label": "User"
        },
        {
          "api": "/user/get-branch",
          "field": "branch_name",
          "value": "branch_uuid",
          "column_key": "branch_uuid",
          "column_label": "Branch"
        }
      ],
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": null
    },
    {
      "module_uuid": "dfaf7756-1362-459a-8560-d7827d1f352c",
      "module_name": "Users",
      "submodule_name": "Users",
      "table_name": "latest_user",
      "map_column_user_uuid": [
        "created_by_uuid",
        "modified_by_uuid"
      ],
      "column_relation_options": [
        {
          "api": "/user/get-user",
          "field": "email",
          "value": "user_uuid",
          "column_key": "user_uuid",
          "column_label": "User"
        },
        {
          "api": "/user/get-branch",
          "field": "branch_name",
          "value": "branch_uuid",
          "column_key": "branch_uuid",
          "column_label": "Branch"
        }
      ],
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": null
    },
    {
      "module_uuid": "b1fbbbc8-e078-4088-aac4-1811baf73696",
      "module_name": "Data Management",
      "submodule_name": "Branch",
      "table_name": "latest_branch",
      "map_column_user_uuid": [
        "created_by_uuid",
        "modified_by_uuid"
      ],
      "column_relation_options": [
        {
          "api": "/user/get-user",
          "field": "email",
          "value": "user_uuid",
          "column_key": "user_uuid",
          "column_label": "User"
        },
        {
          "api": "/user/get-branch",
          "field": "branch_name",
          "value": "branch_uuid",
          "column_key": "branch_uuid",
          "column_label": "Branch"
        }
      ],
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": null
    },
    {
      "module_uuid": "fe57d8b4-11a5-4f0a-841e-499a4e53c44a",
      "module_name": "Security",
      "submodule_name": "Security",
      "table_name": "role_module",
      "map_column_user_uuid": [
        "created_by_uuid",
        "modified_by_uuid"
      ],
      "column_relation_options": [
        {
          "api": "/user/get-user",
          "field": "email",
          "value": "user_uuid",
          "column_key": "user_uuid",
          "column_label": "User"
        },
        {
          "api": "/user/get-branch",
          "field": "branch_name",
          "value": "branch_uuid",
          "column_key": "branch_uuid",
          "column_label": "Branch"
        }
      ],
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": null
    },
    {
      "module_uuid": "b474d2d3-9f41-46b4-91dd-aaf3bca7a18a",
      "module_name": "Security",
      "submodule_name": "Role Group",
      "table_name": "latest_role_group",
      "map_column_user_uuid": [
        "created_by_uuid",
        "modified_by_uuid"
      ],
      "column_relation_options": [
        {
          "api": "/user/get-user",
          "field": "email",
          "value": "user_uuid",
          "column_key": "user_uuid",
          "column_label": "User"
        },
        {
          "api": "/user/get-branch",
          "field": "branch_name",
          "value": "branch_uuid",
          "column_key": "branch_uuid",
          "column_label": "Branch"
        }
      ],
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": null
    }
  ];

  console.log("✅ Security modules response sent successfully");
  res.json({
    message: "Modules",
    data: mockModulesData
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

  // Return stored role groups with pagination support
  const { pageNo = 1, itemPerPage = 10, status } = req.query;
  let filteredRoleGroups = roleGroupsStorage;

  // Filter by status if provided
  if (status && status !== '-1') {
    filteredRoleGroups = roleGroupsStorage.filter(rg => rg.status === status);
  }

  // Calculate pagination
  const startIndex = (pageNo - 1) * itemPerPage;
  const endIndex = startIndex + parseInt(itemPerPage);
  const paginatedRoleGroups = filteredRoleGroups.slice(startIndex, endIndex);

  console.log("📊 Returning role group data:", {
    totalRoleGroups: roleGroupsStorage.length,
    filteredRoleGroups: filteredRoleGroups.length,
    paginatedRoleGroups: paginatedRoleGroups.length,
    pageNo,
    itemPerPage
  });

  res.json({
    message: "Role Groups ",
    totalRecords: filteredRoleGroups.length,
    currentRecords: paginatedRoleGroups.length,
    data: paginatedRoleGroups
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
      count = roleGroupsStorage.length;
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
    case "latest_branch":
      count = branchesStorage.length;
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

// General API - Get table info endpoint
app.get("/api/v1/general/get-table-info", (req, res) => {
  console.log("📊 General table info request received:", {
    query: req.query,
    table_name: req.query.table_name,
    timestamp: new Date().toISOString(),
  });

  const { table_name } = req.query;

  if (!table_name) {
    return res.status(400).json({
      success: false,
      message: "Table name is required",
      error: "MISSING_TABLE_NAME"
    });
  }

  // Mock table info based on table name
  let tableInfo = {
    success: true,
    message: `Table info for ${table_name}`,
    table_name: table_name,
    columns: [],
    row_count: 0,
    table_type: "VIEW"
  };

  // Provide different mock data based on table name
  switch (table_name) {
    case "latest_task_module_wise":
      tableInfo = {
        success: true,
        message: `Table info for ${table_name}`,
        table_name: table_name,
        columns: [
          { name: "task_id", type: "INTEGER", nullable: false },
          { name: "task_uuid", type: "VARCHAR", nullable: false },
          { name: "task_name", type: "VARCHAR", nullable: true },
          { name: "task_description", type: "TEXT", nullable: true },
          { name: "status", type: "VARCHAR", nullable: true },
          { name: "created_by_uuid", type: "VARCHAR", nullable: true },
          { name: "modified_by_uuid", type: "VARCHAR", nullable: true },
          { name: "create_ts", type: "TIMESTAMP", nullable: true },
          { name: "insert_ts", type: "TIMESTAMP", nullable: true }
        ],
        row_count: 0,
        table_type: "VIEW",
        data: [
          {
            table_status: ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED", "ON_HOLD"]
          }
        ]
      };
      break;
    case "latest_user":
      tableInfo = {
        success: true,
        message: `Table info for ${table_name}`,
        table_name: table_name,
        columns: [
          { name: "user_id", type: "INTEGER", nullable: false },
          { name: "user_uuid", type: "VARCHAR", nullable: false },
          { name: "email", type: "VARCHAR", nullable: false },
          { name: "first_name", type: "VARCHAR", nullable: true },
          { name: "last_name", type: "VARCHAR", nullable: true },
          { name: "status", type: "VARCHAR", nullable: true },
          { name: "created_by_uuid", type: "VARCHAR", nullable: true },
          { name: "modified_by_uuid", type: "VARCHAR", nullable: true },
          { name: "create_ts", type: "TIMESTAMP", nullable: true },
          { name: "insert_ts", type: "TIMESTAMP", nullable: true }
        ],
        row_count: 3,
        table_type: "VIEW",
        data: [
          {
            table_status: ["ACTIVE", "INACTIVE", "PENDING", "SUSPENDED", "DELETED"]
          }
        ]
      };
      break;
    case "latest_branch":
      tableInfo = {
        success: true,
        message: `Table info for ${table_name}`,
        table_name: table_name,
        columns: [
          { name: "branch_id", type: "INTEGER", nullable: false },
          { name: "branch_uuid", type: "VARCHAR", nullable: false },
          { name: "branch_name", type: "VARCHAR", nullable: false },
          { name: "branch_code", type: "VARCHAR", nullable: true },
          { name: "branch_email", type: "VARCHAR", nullable: true },
          { name: "status", type: "VARCHAR", nullable: true },
          { name: "created_by_uuid", type: "VARCHAR", nullable: true },
          { name: "modified_by_uuid", type: "VARCHAR", nullable: true },
          { name: "create_ts", type: "TIMESTAMP", nullable: true },
          { name: "insert_ts", type: "TIMESTAMP", nullable: true }
        ],
        row_count: branchesStorage.length,
        table_type: "VIEW",
        data: [
          {
            table_status: ["ACTIVE", "INACTIVE", "PENDING", "MAINTENANCE"]
          }
        ]
      };
      break;
    case "latest_role_group":
      tableInfo = {
        success: true,
        message: `Table info for ${table_name}`,
        table_name: table_name,
        columns: [
          { name: "role_group_id", type: "INTEGER", nullable: false },
          { name: "role_group_uuid", type: "VARCHAR", nullable: false },
          { name: "role_group", type: "VARCHAR", nullable: false },
          { name: "status", type: "VARCHAR", nullable: true },
          { name: "created_by_uuid", type: "VARCHAR", nullable: true },
          { name: "create_ts", type: "TIMESTAMP", nullable: true },
          { name: "insert_ts", type: "TIMESTAMP", nullable: true }
        ],
        row_count: roleGroupsStorage.length,
        table_type: "VIEW",
        data: [
          {
            table_status: ["ACTIVE", "INACTIVE", "PENDING"]
          }
        ]
      };
      break;
    default:
      tableInfo = {
        success: true,
        message: `Table info for ${table_name}`,
        table_name: table_name,
        columns: [
          { name: "id", type: "INTEGER", nullable: false },
          { name: "name", type: "VARCHAR", nullable: true },
          { name: "status", type: "VARCHAR", nullable: true },
          { name: "created_at", type: "TIMESTAMP", nullable: true },
          { name: "updated_at", type: "TIMESTAMP", nullable: true }
        ],
        row_count: 0,
        table_type: "TABLE",
        data: [
          {
            table_status: ["ACTIVE", "INACTIVE", "PENDING"]
          }
        ]
      };
  }

  console.log("✅ Table info response sent successfully for:", table_name);
  res.json(tableInfo);
});

// Template API - Get SQL view or columns endpoint
app.get("/api/v1/template/get-sql-view-or-columns", (req, res) => {
  console.log("📊 Template SQL view/columns request received:", {
    query: req.query,
    templates_dynamic_views_code: req.query.templates_dynamic_views_code,
    timestamp: new Date().toISOString(),
  });

  const { templates_dynamic_views_code } = req.query;

  // If templates_dynamic_views_code is provided, return columns for that specific view
  if (templates_dynamic_views_code) {
    console.log("📋 Returning columns for SQL view:", templates_dynamic_views_code);
    
    // Mock column data based on the view code
    let columnsData = [];
    
    switch (templates_dynamic_views_code) {
      case "UHQAKRTNTG":
        columnsData = [
          "id",
          "name", 
          "description",
          "status",
          "created_at",
          "updated_at"
        ];
        break;
      case "VUWFWMHKB1":
        columnsData = [
          "lead_id",
          "lead_name",
          "opportunity_id",
          "opportunity_name",
          "lead_status",
          "opportunity_status",
          "assigned_to",
          "created_at",
          "updated_at"
        ];
        break;
      case "JR32TYKWOO":
        columnsData = [
          "lead_id",
          "lead_name",
          "lead_email",
          "lead_phone",
          "lead_status",
          "assigned_to",
          "assigned_date",
          "created_at"
        ];
        break;
      default:
        columnsData = [
          "id",
          "name",
          "status",
          "created_at"
        ];
    }

    console.log("✅ Template SQL view columns response sent successfully");
    res.json({
      message: "template views and columns",
      data: columnsData
    });
  } else {
    // Return the list of available SQL views
    const templateViewsData = [
      {
        templates_dynamic_views_unique_id: 3,
        templates_dynamic_views_code: "UHQAKRTNTG",
        view_for: ""
      },
      {
        templates_dynamic_views_unique_id: 2,
        templates_dynamic_views_code: "VUWFWMHKB1",
        view_for: "Lead assign with oppourtunity"
      },
      {
        templates_dynamic_views_unique_id: 1,
        templates_dynamic_views_code: "JR32TYKWOO",
        view_for: "Lead Assign"
      }
    ];

    console.log("✅ Template SQL view list response sent successfully");
    res.json({
      message: "template views and columns",
      totalRecords: 3,
      currentRecords: 3,
      data: templateViewsData
    });
  }
});

// General API - Get table or column name endpoint
app.get("/api/v1/general/get-table-or-column-name", (req, res) => {
  console.log("🗃️ General table/column name request received:", {
    query: req.query,
    table_type: req.query.table_type,
    timestamp: new Date().toISOString(),
  });

  const { table_type } = req.query;

  // Comprehensive list of database views and tables
  const viewsList = [
    "latest_accn_account_receivable_trust",
    "latest_accn_accounting_information",
    "latest_accn_accounts_payable",
    "latest_accn_accounts_payable_cheque",
    "latest_accn_accounts_receivable",
    "latest_accn_bank_account",
    "latest_accn_bill_template",
    "latest_accn_bill_transaction_items",
    "latest_accn_cheque",
    "latest_accn_company_charts_of_accounts",
    "latest_accn_company_gl_accounts",
    "latest_accn_company_information",
    "latest_accn_company_onboarding",
    "latest_accn_create_bill",
    "latest_accn_create_payment",
    "latest_accn_invoice_information",
    "latest_accn_invoice_payment_accounts_receivable",
    "latest_accn_invoice_payment_transaction_items",
    "latest_accn_invoice_template",
    "latest_accn_invoice_transaction_items",
    "latest_accn_payment_payable_details",
    "latest_accn_system_gl_account",
    "latest_accn_tax_info",
    "latest_accn_transaction_description",
    "latest_accn_transaction_type",
    "latest_accn_transactions",
    "latest_accn_vendor",
    "latest_answers",
    "latest_approval",
    "latest_approval_count",
    "latest_assignee",
    "latest_branch",
    "latest_comment_t",
    "latest_company_information",
    "latest_conversation",
    "latest_country_state",
    "latest_crs_draws",
    "latest_crs_draws_noc_code",
    "latest_customer_automation",
    "latest_customer_invoice",
    "latest_customer_personal_information",
    "latest_customer_pr",
    "latest_customer_prospect_details",
    "latest_customer_service",
    "latest_customer_social",
    "latest_distinct_services_type",
    "latest_document",
    "latest_document_signature",
    "latest_document_template",
    "latest_documents",
    "latest_environment_configuration",
    "latest_formula",
    "latest_history",
    "latest_langchain_response",
    "latest_lead_signature",
    "latest_lead_to_graph",
    "latest_lead_with_opportunity",
    "latest_lead_without_opportunity_status",
    "latest_lead_without_opportunity_status_1",
    "latest_leads",
    "latest_messages",
    "latest_module",
    "latest_noc_codes",
    "latest_opportunity",
    "latest_participants",
    "latest_pdf_buffers",
    "latest_process_records",
    "latest_question_answer",
    "latest_questionnaire",
    "latest_questions",
    "latest_questions_options",
    "latest_retainer",
    "latest_retainer_leads",
    "latest_role",
    "latest_role_group",
    "latest_role_module",
    "latest_services",
    "latest_services_customer_info",
    "latest_study_program",
    "latest_task_module_wise",
    "latest_task_user_taskboard",
    "latest_template_module_mapping",
    "latest_templates",
    "latest_templates_dynamic_views",
    "latest_user",
    "latest_user_dim",
    "latest_user_profile",
    "latest_webhook_signature",
    "latest_workflow_action",
    "latest_workflow_action_email",
    "latest_workflow_action_message",
    "latest_workflow_basic",
    "latest_workflow_condition",
    "latest_zone"
  ];

  console.log("✅ Table/column name response sent successfully");
  res.json({
    message: "All Views list",
    data: viewsList
  });
});

// General API - Get country state endpoint
app.get("/api/v1/general/get-country-state", (req, res) => {
  console.log("🌍 Get country state request received:", {
    query: req.query,
    country_name: req.query.country_name,
    timestamp: new Date().toISOString(),
  });

  const { country_name } = req.query;

  if (!country_name) {
    return res.status(400).json({
      message: "Country name is required",
      error: "MISSING_COUNTRY_NAME"
    });
  }

  // Mock data for India states and union territories
  const indiaStatesData = [
    {
      "country_state_id": 4853,
      "country_state_unique_id": 4853,
      "country_state_uuid": "e4efd40c-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "West Bengal",
      "country_code": "IN",
      "state_code": "WB",
      "type": "state",
      "latitude": "22.9867569",
      "longitude": "87.8549755",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:57:01.000Z",
      "insert_ts": "2025-04-28T11:57:01.000Z"
    },
    {
      "country_state_id": 4852,
      "country_state_unique_id": 4852,
      "country_state_uuid": "e08da7ad-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Ladakh",
      "country_code": "IN",
      "state_code": "LA",
      "type": "union territory",
      "latitude": "34.2268475",
      "longitude": "77.5619419",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:53.000Z",
      "insert_ts": "2025-04-28T11:56:53.000Z"
    },
    {
      "country_state_id": 4040,
      "country_state_unique_id": 4040,
      "country_state_uuid": "ddb05ed1-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Chhattisgarh",
      "country_code": "IN",
      "state_code": "CT",
      "type": "state",
      "latitude": "21.2786567",
      "longitude": "81.8661442",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:49.000Z",
      "insert_ts": "2025-04-28T11:56:49.000Z"
    },
    {
      "country_state_id": 4039,
      "country_state_unique_id": 4039,
      "country_state_uuid": "e10b7529-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Madhya Pradesh",
      "country_code": "IN",
      "state_code": "MP",
      "type": "state",
      "latitude": "22.9734229",
      "longitude": "78.6568942",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:54.000Z",
      "insert_ts": "2025-04-28T11:56:54.000Z"
    },
    {
      "country_state_id": 4038,
      "country_state_unique_id": 4038,
      "country_state_uuid": "e4166e88-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Tripura",
      "country_code": "IN",
      "state_code": "TR",
      "type": "state",
      "latitude": "23.9408482",
      "longitude": "91.9881527",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:59.000Z",
      "insert_ts": "2025-04-28T11:56:59.000Z"
    },
    {
      "country_state_id": 4037,
      "country_state_unique_id": 4037,
      "country_state_uuid": "dd288f18-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Bihar",
      "country_code": "IN",
      "state_code": "BR",
      "type": "state",
      "latitude": "25.0960742",
      "longitude": "85.3131194",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:48.000Z",
      "insert_ts": "2025-04-28T11:56:48.000Z"
    },
    {
      "country_state_id": 4036,
      "country_state_unique_id": 4036,
      "country_state_uuid": "e204fd41-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Mizoram",
      "country_code": "IN",
      "state_code": "MZ",
      "type": "state",
      "latitude": "23.164543",
      "longitude": "92.9375739",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:56.000Z",
      "insert_ts": "2025-04-28T11:56:56.000Z"
    },
    {
      "country_state_id": 4035,
      "country_state_unique_id": 4035,
      "country_state_uuid": "e39ba276-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Tamil Nadu",
      "country_code": "IN",
      "state_code": "TN",
      "type": "state",
      "latitude": "11.1271225",
      "longitude": "78.6568942",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:58.000Z",
      "insert_ts": "2025-04-28T11:56:58.000Z"
    },
    {
      "country_state_id": 4034,
      "country_state_unique_id": 4034,
      "country_state_uuid": "e35c4d57-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Sikkim",
      "country_code": "IN",
      "state_code": "SK",
      "type": "state",
      "latitude": "27.5329718",
      "longitude": "88.5122178",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:58.000Z",
      "insert_ts": "2025-04-28T11:56:58.000Z"
    },
    {
      "country_state_id": 4033,
      "country_state_unique_id": 4033,
      "country_state_uuid": "ddee2f20-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Dadra and Nagar Haveli and Daman and Diu",
      "country_code": "IN",
      "state_code": "DH",
      "type": "union territory",
      "latitude": "20.3973736",
      "longitude": "72.8327991",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:49.000Z",
      "insert_ts": "2025-04-28T11:56:49.000Z"
    },
    {
      "country_state_id": 4031,
      "country_state_unique_id": 4031,
      "country_state_uuid": "dd604c7a-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Chandigarh",
      "country_code": "IN",
      "state_code": "CH",
      "type": "union territory",
      "latitude": "30.7333148",
      "longitude": "76.7794179",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:48.000Z",
      "insert_ts": "2025-04-28T11:56:48.000Z"
    },
    {
      "country_state_id": 4030,
      "country_state_unique_id": 4030,
      "country_state_uuid": "def95f99-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Gujarat",
      "country_code": "IN",
      "state_code": "GJ",
      "type": "state",
      "latitude": "22.258652",
      "longitude": "71.1923805",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:51.000Z",
      "insert_ts": "2025-04-28T11:56:51.000Z"
    },
    {
      "country_state_id": 4029,
      "country_state_unique_id": 4029,
      "country_state_uuid": "dfabbcf4-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Jammu and Kashmir",
      "country_code": "IN",
      "state_code": "JK",
      "type": "union territory",
      "latitude": "33.277839",
      "longitude": "75.3412179",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:52.000Z",
      "insert_ts": "2025-04-28T11:56:52.000Z"
    },
    {
      "country_state_id": 4028,
      "country_state_unique_id": 4028,
      "country_state_uuid": "e0551721-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Kerala",
      "country_code": "IN",
      "state_code": "KL",
      "type": "state",
      "latitude": "10.8505159",
      "longitude": "76.2710833",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:53.000Z",
      "insert_ts": "2025-04-28T11:56:53.000Z"
    },
    {
      "country_state_id": 4027,
      "country_state_unique_id": 4027,
      "country_state_uuid": "dce4b65e-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Assam",
      "country_code": "IN",
      "state_code": "AS",
      "type": "state",
      "latitude": "26.2006043",
      "longitude": "92.9375739",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:47.000Z",
      "insert_ts": "2025-04-28T11:56:47.000Z"
    },
    {
      "country_state_id": 4026,
      "country_state_unique_id": 4026,
      "country_state_uuid": "e018d3b7-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Karnataka",
      "country_code": "IN",
      "state_code": "KA",
      "type": "state",
      "latitude": "15.3172775",
      "longitude": "75.7138884",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:53.000Z",
      "insert_ts": "2025-04-28T11:56:53.000Z"
    },
    {
      "country_state_id": 4025,
      "country_state_unique_id": 4025,
      "country_state_uuid": "dfe43dbb-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Jharkhand",
      "country_code": "IN",
      "state_code": "JH",
      "type": "state",
      "latitude": "23.6101808",
      "longitude": "85.2799354",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:52.000Z",
      "insert_ts": "2025-04-28T11:56:52.000Z"
    },
    {
      "country_state_id": 4024,
      "country_state_unique_id": 4024,
      "country_state_uuid": "dc5784cb-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Arunachal Pradesh",
      "country_code": "IN",
      "state_code": "AR",
      "type": "state",
      "latitude": "28.2179994",
      "longitude": "94.7277528",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:46.000Z",
      "insert_ts": "2025-04-28T11:56:46.000Z"
    },
    {
      "country_state_id": 4023,
      "country_state_unique_id": 4023,
      "country_state_uuid": "dbe1577a-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Andaman and Nicobar Islands",
      "country_code": "IN",
      "state_code": "AN",
      "type": "union territory",
      "latitude": "11.7400867",
      "longitude": "92.6586401",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:45.000Z",
      "insert_ts": "2025-04-28T11:56:45.000Z"
    },
    {
      "country_state_id": 4022,
      "country_state_unique_id": 4022,
      "country_state_uuid": "e44d5ea2-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Uttar Pradesh",
      "country_code": "IN",
      "state_code": "UP",
      "type": "state",
      "latitude": "26.8467088",
      "longitude": "80.9461592",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:57:00.000Z",
      "insert_ts": "2025-04-28T11:57:00.000Z"
    },
    {
      "country_state_id": 4021,
      "country_state_unique_id": 4021,
      "country_state_uuid": "de2d9379-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Delhi",
      "country_code": "IN",
      "state_code": "DL",
      "type": "union territory",
      "latitude": "28.7040592",
      "longitude": "77.1024902",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:49.000Z",
      "insert_ts": "2025-04-28T11:56:49.000Z"
    },
    {
      "country_state_id": 4020,
      "country_state_unique_id": 4020,
      "country_state_uuid": "df7650d2-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Himachal Pradesh",
      "country_code": "IN",
      "state_code": "HP",
      "type": "state",
      "latitude": "31.1048294",
      "longitude": "77.1733901",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:51.000Z",
      "insert_ts": "2025-04-28T11:56:51.000Z"
    },
    {
      "country_state_id": 4019,
      "country_state_unique_id": 4019,
      "country_state_uuid": "e0cdb396-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Lakshadweep",
      "country_code": "IN",
      "state_code": "LD",
      "type": "union territory",
      "latitude": "10.3280265",
      "longitude": "72.7846336",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:54.000Z",
      "insert_ts": "2025-04-28T11:56:54.000Z"
    },
    {
      "country_state_id": 4018,
      "country_state_unique_id": 4018,
      "country_state_uuid": "e238d1be-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Nagaland",
      "country_code": "IN",
      "state_code": "NL",
      "type": "state",
      "latitude": "26.1584354",
      "longitude": "94.5624426",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:56.000Z",
      "insert_ts": "2025-04-28T11:56:56.000Z"
    },
    {
      "country_state_id": 4017,
      "country_state_unique_id": 4017,
      "country_state_uuid": "dc190ba1-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Andhra Pradesh",
      "country_code": "IN",
      "state_code": "AP",
      "type": "state",
      "latitude": "15.9128998",
      "longitude": "79.7399875",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:46.000Z",
      "insert_ts": "2025-04-28T11:56:46.000Z"
    },
    {
      "country_state_id": 4016,
      "country_state_unique_id": 4016,
      "country_state_uuid": "e4b6b9ee-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Uttarakhand",
      "country_code": "IN",
      "state_code": "UK",
      "type": "state",
      "latitude": "30.066753",
      "longitude": "79.0192997",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:57:00.000Z",
      "insert_ts": "2025-04-28T11:57:00.000Z"
    },
    {
      "country_state_id": 4015,
      "country_state_unique_id": 4015,
      "country_state_uuid": "e2e0b1a2-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Punjab",
      "country_code": "IN",
      "state_code": "PB",
      "type": "state",
      "latitude": "31.1471305",
      "longitude": "75.3412179",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:57.000Z",
      "insert_ts": "2025-04-28T11:56:57.000Z"
    },
    {
      "country_state_id": 4014,
      "country_state_unique_id": 4014,
      "country_state_uuid": "e322484c-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Rajasthan",
      "country_code": "IN",
      "state_code": "RJ",
      "type": "state",
      "latitude": "27.0238036",
      "longitude": "74.2179326",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:58.000Z",
      "insert_ts": "2025-04-28T11:56:58.000Z"
    },
    {
      "country_state_id": 4013,
      "country_state_unique_id": 4013,
      "country_state_uuid": "e26ef556-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Odisha",
      "country_code": "IN",
      "state_code": "OR",
      "type": "state",
      "latitude": "20.9516658",
      "longitude": "85.0985236",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:56.000Z",
      "insert_ts": "2025-04-28T11:56:56.000Z"
    },
    {
      "country_state_id": 4012,
      "country_state_unique_id": 4012,
      "country_state_uuid": "e3da234c-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Telangana",
      "country_code": "IN",
      "state_code": "TG",
      "type": "state",
      "latitude": "18.1124372",
      "longitude": "79.0192997",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:59.000Z",
      "insert_ts": "2025-04-28T11:56:59.000Z"
    },
    {
      "country_state_id": 4011,
      "country_state_unique_id": 4011,
      "country_state_uuid": "e2a45f1e-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Puducherry",
      "country_code": "IN",
      "state_code": "PY",
      "type": "union territory",
      "latitude": "11.9415915",
      "longitude": "79.8083133",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:57.000Z",
      "insert_ts": "2025-04-28T11:56:57.000Z"
    },
    {
      "country_state_id": 4010,
      "country_state_unique_id": 4010,
      "country_state_uuid": "e1794bd4-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Manipur",
      "country_code": "IN",
      "state_code": "MN",
      "type": "state",
      "latitude": "24.6637173",
      "longitude": "93.9062688",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:55.000Z",
      "insert_ts": "2025-04-28T11:56:55.000Z"
    },
    {
      "country_state_id": 4009,
      "country_state_unique_id": 4009,
      "country_state_uuid": "dec3dccb-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Goa",
      "country_code": "IN",
      "state_code": "GA",
      "type": "state",
      "latitude": "15.2993265",
      "longitude": "74.123996",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:50.000Z",
      "insert_ts": "2025-04-28T11:56:50.000Z"
    },
    {
      "country_state_id": 4008,
      "country_state_unique_id": 4008,
      "country_state_uuid": "e1431de9-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Maharashtra",
      "country_code": "IN",
      "state_code": "MH",
      "type": "state",
      "latitude": "19.7514798",
      "longitude": "75.7138884",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:55.000Z",
      "insert_ts": "2025-04-28T11:56:55.000Z"
    },
    {
      "country_state_id": 4007,
      "country_state_unique_id": 4007,
      "country_state_uuid": "df37f870-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Haryana",
      "country_code": "IN",
      "state_code": "HR",
      "type": "state",
      "latitude": "29.0587757",
      "longitude": "76.085601",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:51.000Z",
      "insert_ts": "2025-04-28T11:56:51.000Z"
    },
    {
      "country_state_id": 4006,
      "country_state_unique_id": 4006,
      "country_state_uuid": "e1c71c1b-2427-11f0-a003-0e525aef9233",
      "country_id": 101,
      "country_name": "India",
      "state_name": "Meghalaya",
      "country_code": "IN",
      "state_code": "ML",
      "type": "state",
      "latitude": "25.4670308",
      "longitude": "91.366216",
      "status": "ACTIVE",
      "created_by_uuid": null,
      "created_by_name": null,
      "modified_by_uuid": null,
      "modified_by_name": null,
      "create_ts": "2025-04-28T11:56:55.000Z",
      "insert_ts": "2025-04-28T11:56:55.000Z"
    }
  ];

  // Filter by country name (case-insensitive)
  let filteredData = [];
  if (country_name.toLowerCase() === 'india') {
    filteredData = indiaStatesData;
  } else {
    // For other countries, return empty array for now
    filteredData = [];
  }

  console.log("✅ Country state response sent successfully for:", country_name);
  res.json({
    message: "Country state record",
    totalRecords: filteredData.length,
    currentRecords: filteredData.length,
    data: filteredData
  });
});

// Customer API - Upsert customer invoice endpoint
app.post("/api/v1/customer/upsert-customer-invoice", (req, res) => {
  console.log("💰 Customer invoice upsert request received:", {
    body: req.body,
    headers: req.headers,
    origin: req.get("origin"),
    timestamp: new Date().toISOString(),
  });

  try {
    const {
      customer_invoice_uuid,
      customer_uuid,
      invoice_no,
      creation_date,
      due_date,
      company_name,
      company_address_line1,
      company_address_line2,
      company_city,
      company_state,
      company_country,
      company_postal_code,
      customer_name,
      customer_address_line1,
      customer_address_line2,
      customer_city,
      customer_state,
      customer_country,
      customer_postal_code,
      invoice_items,
      payment_paid,
      adjustment,
      taxes,
      sub_total,
      total,
      status
    } = req.body;

    const adminUuid = "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f";
    const adminName = "Umesh Yadav";

    // Generate UUID if not provided
    const newCustomerInvoiceUuid = customer_invoice_uuid || generateUUID();

    // Default invoice items if not provided
    const defaultInvoiceItems = invoice_items || [
      {
        "transaction_type": "SERVICE",
        "correction_sign": "+",
        "description": "",
        "service_type": "",
        "service_sub_type": "",
        "tax": "",
        "price": "",
        "country": "",
        "state_or_province": ""
      }
    ];

    // Mock response structure matching the exact format provided
    const resultCustomerInvoice = {
      "customer_invoice_uuid": newCustomerInvoiceUuid,
      "customer_uuid": customer_uuid || "",
      "invoice_no": invoice_no || Math.floor(Math.random() * 1000) + 1,
      "creation_date": creation_date || "8990-06-06T18:30:00.000Z",
      "due_date": due_date || "6789-04-04T18:30:00.000Z",
      "company_name": company_name || "",
      "company_address_line1": company_address_line1 || "",
      "company_address_line2": company_address_line2 || "",
      "company_city": company_city || "",
      "company_state": company_state || "",
      "company_country": company_country || "",
      "company_postal_code": company_postal_code || "",
      "customer_name": customer_name || "",
      "customer_address_line1": customer_address_line1 || "",
      "customer_address_line2": customer_address_line2 || "",
      "customer_city": customer_city || "",
      "customer_state": customer_state || "",
      "customer_country": customer_country || "",
      "customer_postal_code": customer_postal_code || "",
      "invoice_items": defaultInvoiceItems,
      "payment_paid": payment_paid || "0.00",
      "adjustment": adjustment || "0.00",
      "taxes": taxes || "0.00",
      "sub_total": sub_total || "0.00",
      "total": total || "0.00",
      "status": status || "PAID",
      "created_by_uuid": adminUuid,
      "created_by_name": adminName,
      "modified_by_uuid": adminUuid,
      "modified_by_name": adminName,
      "create_ts": new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      }).replace(/(\d+)\/(\d+)\/(\d+),?\s*(\d+):(\d+):(\d+)/, '$3-$1-$2 $4:$5:$6')
    };

    console.log("✅ Customer invoice upsert response sent successfully");
    res.status(201).json({
      message: "Customer Invoice has been false?updated : created",
      data: resultCustomerInvoice
    });
  } catch (err) {
    console.error("❌ Error in customer invoice upsert:", err);
    res.status(500).json({
      message: "Error creating/updating customer invoice",
      error: err.message
    });
  }
});

// Branch JSON Storage API - Insert branch data as JSON
app.post("/api/v1/branch/json-store", (req, res) => {
  console.log("📦 Branch JSON store insert request received:", {
    body: req.body,
    headers: req.headers,
    origin: req.get("origin"),
    timestamp: new Date().toISOString(),
  });

  try {
    // Build JSON object similar to your SQL query
    const jsonData = {
      message: "All Branch",
      totalRecords: branchesStorage.length,
      currentRecords: branchesStorage.length,
      data: branchesStorage.map(branch => ({
        branch_uuid: branch.branch_uuid,
        branch_name: branch.branch_name,
        branch_code: branch.branch_code,
        branch_email: branch.branch_email,
        branch_logo: branch.branch_logo,
        description: branch.description,
        branch_phone_no: branch.branch_phone_no,
        branch_mobile_no: branch.branch_mobile_no,
        status: branch.status,
        created_by_uuid: branch.created_by_uuid,
        created_by_name: branch.created_by_name,
        modified_by_uuid: branch.modified_by_uuid,
        modified_by_name: branch.modified_by_name,
        create_ts: branch.create_ts,
        insert_ts: branch.insert_ts
      }))
    };

    // Store in JSON storage
    const jsonStoreEntry = {
      id: branchJsonStorage.length + 1,
      data: jsonData,
      created_at: new Date().toISOString()
    };

    branchJsonStorage.push(jsonStoreEntry);

    console.log("✅ Branch JSON store insert successful:", jsonStoreEntry.id);
    res.status(201).json({
      message: "Branch data stored as JSON successfully",
      data: jsonStoreEntry
    });
  } catch (err) {
    console.error("❌ Error in branch JSON store insert:", err);
    res.status(500).json({
      message: "Error storing branch data as JSON",
      error: err.message
    });
  }
});

// Branch JSON Storage API - Get all JSON stored data
app.get("/api/v1/branch/json-store", (req, res) => {
  console.log("📦 Branch JSON store get request received:", {
    query: req.query,
    timestamp: new Date().toISOString(),
  });

  const { id } = req.query;
  
  if (id) {
    // Get specific JSON entry
    const jsonEntry = branchJsonStorage.find(entry => entry.id === parseInt(id));
    if (!jsonEntry) {
      return res.status(404).json({
        message: "JSON store entry not found",
        error: "NOT_FOUND"
      });
    }
    
    console.log("✅ Branch JSON store entry retrieved successfully");
    res.json({
      message: "Branch JSON store entry retrieved successfully",
      data: jsonEntry
    });
  } else {
    // Get all JSON entries
    console.log("✅ Branch JSON store entries retrieved successfully");
    res.json({
      message: "Branch JSON store entries retrieved successfully",
      totalRecords: branchJsonStorage.length,
      data: branchJsonStorage
    });
  }
});

// Branch JSON Storage API - Update specific field in JSON
app.put("/api/v1/branch/json-store/:id/update", (req, res) => {
  console.log("📦 Branch JSON store update request received:", {
    params: req.params,
    body: req.body,
    timestamp: new Date().toISOString(),
  });

  try {
    const { id } = req.params;
    const { field_path, new_value, branch_index = 0 } = req.body;

    const jsonEntry = branchJsonStorage.find(entry => entry.id === parseInt(id));
    if (!jsonEntry) {
      return res.status(404).json({
        message: "JSON store entry not found",
        error: "NOT_FOUND"
      });
    }

    // Update the specific field in the JSON data
    if (field_path && new_value !== undefined) {
      // Simple field update (e.g., "data.data.0.status")
      const pathParts = field_path.split('.');
      let current = jsonEntry.data;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (pathParts[i] === '0' || pathParts[i] === '1' || pathParts[i] === '2') {
          // Array index
          current = current[parseInt(pathParts[i])];
        } else {
          current = current[pathParts[i]];
        }
      }
      
      const lastKey = pathParts[pathParts.length - 1];
      current[lastKey] = new_value;
      
      // Update timestamp
      jsonEntry.updated_at = new Date().toISOString();
    }

    console.log("✅ Branch JSON store update successful:", id);
    res.json({
      message: "Branch JSON store updated successfully",
      data: jsonEntry
    });
  } catch (err) {
    console.error("❌ Error in branch JSON store update:", err);
    res.status(500).json({
      message: "Error updating branch JSON store",
      error: err.message
    });
  }
});

// Branch JSON Storage API - Delete JSON entry
app.delete("/api/v1/branch/json-store/:id", (req, res) => {
  console.log("📦 Branch JSON store delete request received:", {
    params: req.params,
    timestamp: new Date().toISOString(),
  });

  try {
    const { id } = req.params;
    const existingIndex = branchJsonStorage.findIndex(entry => entry.id === parseInt(id));

    if (existingIndex === -1) {
      return res.status(404).json({
        message: "JSON store entry not found",
        error: "NOT_FOUND"
      });
    }

    const deletedEntry = branchJsonStorage.splice(existingIndex, 1)[0];
    console.log("✅ Branch JSON store entry deleted successfully:", deletedEntry.id);

    res.json({
      message: "Branch JSON store entry deleted successfully",
      data: deletedEntry
    });
  } catch (err) {
    console.error("❌ Error in branch JSON store delete:", err);
    res.status(500).json({
      message: "Error deleting branch JSON store entry",
      error: err.message
    });
  }
});

// Branch API - Get all branches from database
app.get("/api/v1/dataManagement/get-branch", async (req, res) => {
  console.log("🏢 Get branches request received:", {
    query: req.query,
    timestamp: new Date().toISOString(),
  });

  try {
    const { pageNo = 1, itemPerPage = 10, status } = req.query;
    
    // Build where clause for filtering
    let whereClause = {};
    if (status && status !== '-1') {
      whereClause.status = status;
    }

    // Get total count
    const totalRecords = await prisma.branch.count({ where: whereClause });

    // Get paginated data
    const startIndex = (pageNo - 1) * itemPerPage;
    const branches = await prisma.branch.findMany({
      where: whereClause,
      orderBy: { id: 'desc' },
      skip: startIndex,
      take: parseInt(itemPerPage)
    });

    // Transform data to match expected format
    const transformedBranches = branches.map(branch => ({
      branch_uuid: branch.branchUuid,
      branch_name: branch.branchName,
      branch_code: branch.branchCode,
      branch_email: branch.branchEmail,
      branch_logo: branch.branchLogo,
      description: branch.description,
      branch_phone_no: branch.branchPhoneNo,
      branch_mobile_no: branch.branchMobileNo,
      status: branch.status,
      created_by_uuid: branch.createdByUuid,
      created_by_name: branch.createdByName,
      modified_by_uuid: branch.modifiedByUuid,
      modified_by_name: branch.modifiedByName,
      create_ts: branch.createTs,
      insert_ts: branch.insertTs
    }));

    console.log("✅ Branches retrieved from database successfully");
    res.json({
      message: "All Branch",
      totalRecords: totalRecords,
      currentRecords: transformedBranches.length,
      data: transformedBranches
    });
  } catch (err) {
    console.error("❌ Error retrieving branches from database:", err);
    res.status(500).json({
      message: "Error retrieving branches",
      error: err.message
    });
  }
});

// Branch API - Get single branch by UUID
app.get("/api/v1/dataManagement/get-single-branch", async (req, res) => {
  console.log("🏢 Get single branch request received:", {
    query: req.query,
    uuid: req.query.uuid,
    timestamp: new Date().toISOString(),
  });

  try {
    const { uuid } = req.query;
    if (!uuid) {
      return res.status(400).json({ 
        success: false, 
        message: "Branch UUID is required", 
        error: "MISSING_UUID" 
      });
    }

    const branch = await prisma.branch.findUnique({
      where: { branchUuid: uuid }
    });

    if (!branch) {
      return res.status(404).json({ 
        success: false, 
        message: "Branch not found", 
        error: "BRANCH_NOT_FOUND" 
      });
    }

    // Transform data to match expected format
    const transformedBranch = {
      branch_uuid: branch.branchUuid,
      branch_name: branch.branchName,
      branch_code: branch.branchCode,
      branch_email: branch.branchEmail,
      branch_logo: branch.branchLogo,
      description: branch.description,
      branch_phone_no: branch.branchPhoneNo,
      branch_mobile_no: branch.branchMobileNo,
      status: branch.status,
      created_by_uuid: branch.createdByUuid,
      created_by_name: branch.createdByName,
      modified_by_uuid: branch.modifiedByUuid,
      modified_by_name: branch.modifiedByName,
      create_ts: branch.createTs,
      insert_ts: branch.insertTs
    };

    console.log("✅ Single branch retrieved from database successfully");
    res.json({ 
      success: true, 
      message: "Branch retrieved successfully", 
      data: transformedBranch 
    });
  } catch (err) {
    console.error("❌ Error retrieving single branch from database:", err);
    res.status(500).json({
      success: false,
      message: "Error retrieving branch",
      error: err.message
    });
  }
});

// Branch API - Upsert branch (create or update)
app.post("/api/v1/dataManagement/upsert-branch", async (req, res) => {
  console.log("🏢 Upsert branch request received:", {
    body: req.body,
    headers: req.headers,
    origin: req.get("origin"),
    timestamp: new Date().toISOString(),
  });

  try {
    const {
      branch_uuid,
      branch_name,
      branch_code,
      branch_email,
      branch_logo,
      description,
      branch_phone_no,
      branch_mobile_no,
      status
    } = req.body;

    const adminUuid = "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f";
    const adminName = "Sakshi Jadhav";

    let resultBranch;
    let isUpdate = false;

    if (branch_uuid) {
      // Try to update existing branch
      try {
        resultBranch = await prisma.branch.update({
          where: { branchUuid: branch_uuid },
          data: {
            branchName: branch_name,
            branchCode: branch_code,
            branchEmail: branch_email,
            branchLogo: branch_logo,
            description: description,
            branchPhoneNo: branch_phone_no,
            branchMobileNo: branch_mobile_no,
            status: status || "ACTIVE",
            modifiedByUuid: adminUuid,
            modifiedByName: adminName,
            insertTs: new Date(),
            updatedAt: new Date()
          }
        });
        isUpdate = true;
        console.log("✅ Branch updated in database successfully:", resultBranch.branchUuid);
      } catch (updateError) {
        if (updateError.code === 'P2025') {
          // Record not found, will create new one
          console.log("⚠️ Branch UUID provided but not found, creating new branch");
        } else {
          throw updateError;
        }
      }
    }

    if (!isUpdate) {
      // Create new branch
      resultBranch = await prisma.branch.create({
        data: {
          branchUuid: branch_uuid || undefined, // Let Prisma generate UUID if not provided
          branchName: branch_name || "NOVA SCOTIA",
          branchCode: branch_code || "NS-001",
          branchEmail: branch_email || "info@novascotia.nwimmigration.ca",
          branchLogo: branch_logo || null,
          description: description || "Nova Scotia Branch",
          branchPhoneNo: branch_phone_no || "1 647 404 6682",
          branchMobileNo: branch_mobile_no || "1 647 403 6682",
          status: status || "ACTIVE",
          createdByUuid: adminUuid,
          createdByName: adminName,
          modifiedByUuid: adminUuid,
          modifiedByName: adminName,
          createTs: new Date(),
          insertTs: new Date()
        }
      });
      console.log("✅ Branch created in database successfully:", resultBranch.branchUuid);
    }

    // Transform result to match expected format
    const transformedResult = {
      branch_uuid: resultBranch.branchUuid,
      branch_name: resultBranch.branchName,
      branch_code: resultBranch.branchCode,
      branch_email: resultBranch.branchEmail,
      branch_logo: resultBranch.branchLogo,
      description: resultBranch.description,
      branch_phone_no: resultBranch.branchPhoneNo,
      branch_mobile_no: resultBranch.branchMobileNo,
      status: resultBranch.status,
      created_by_uuid: resultBranch.createdByUuid,
      created_by_name: resultBranch.createdByName,
      modified_by_uuid: resultBranch.modifiedByUuid,
      modified_by_name: resultBranch.modifiedByName,
      create_ts: resultBranch.createTs,
      insert_ts: resultBranch.insertTs
    };

    console.log("✅ Branch upsert response sent successfully");
    res.status(isUpdate ? 200 : 201).json({
      message: isUpdate ? "Branch updated successfully." : "Branch created successfully.",
      data: transformedResult
    });
  } catch (err) {
    console.error("❌ Error in branch upsert:", err);
    res.status(500).json({
      message: "Error creating/updating branch",
      error: err.message
    });
  }
});

// Branch API - Get branches for user form (alternative endpoint)
app.get("/api/v1/user/get-branch", async (req, res) => {
  console.log("🏢 Get branches for user request received:", {
    query: req.query,
    timestamp: new Date().toISOString(),
  });

  try {
    const { pageNo = 1, itemPerPage = 20 } = req.query;
    
    // Get paginated data
    const startIndex = (pageNo - 1) * itemPerPage;
    const branches = await prisma.branch.findMany({
      where: { status: "ACTIVE" },
      orderBy: { id: 'desc' },
      skip: startIndex,
      take: parseInt(itemPerPage)
    });

    const totalRecords = await prisma.branch.count({ where: { status: "ACTIVE" } });

    // Transform data to match expected format for user form
    const transformedBranches = branches.map((branch, index) => ({
      branch_id: startIndex + index + 1,
      branch_uuid: branch.branchUuid,
      branch_name: branch.branchName,
      branch_code: branch.branchCode,
      branch_phone_no: branch.branchPhoneNo,
      branch_mobile_no: branch.branchMobileNo,
      branch_logo: branch.branchLogo,
      branch_email: branch.branchEmail,
      description: branch.description,
      branch_address_line1: null,
      branch_address_line2: null,
      branch_address_state: null,
      branch_address_city: null,
      branch_address_district: null,
      branch_address_country: null,
      branch_address_pincode: null,
      status: branch.status,
      created_by_uuid: branch.createdByUuid,
      created_by_name: branch.createdByName,
      modified_by_uuid: branch.modifiedByUuid,
      modified_by_name: branch.modifiedByName,
      create_ts: branch.createTs,
      insert_ts: branch.insertTs
    }));

    console.log("✅ Branches for user form retrieved from database successfully");
    res.json({
      message: "All Branch",
      totalRecords: totalRecords,
      currentRecords: transformedBranches.length,
      data: transformedBranches
    });
  } catch (err) {
    console.error("❌ Error retrieving branches for user form:", err);
    res.status(500).json({
      message: "Error retrieving branches",
      error: err.message
    });
  }
});

// Company Configuration API - Get company outlet environment variables
app.get("/api/v1/company/outlet-env", (req, res) => {
  console.log("🏢 Company outlet environment request received:", {
    query: req.query,
    timestamp: new Date().toISOString(),
  });

  const { pageNo = 1, itemPerPage = 100, status, env_key, master_company_outlet } = req.query;
  
  let filteredData = [...companyConfigStorage];

  // Filter by status if provided
  if (status && status !== '-1') {
    filteredData = filteredData.filter(item => item.status === status);
  }

  // Filter by env_key if provided
  if (env_key) {
    filteredData = filteredData.filter(item => 
      item.env_key.toLowerCase().includes(env_key.toLowerCase())
    );
  }

  // Filter by master_company_outlet if provided
  if (master_company_outlet) {
    filteredData = filteredData.filter(item => 
      item.master_company_outlet === master_company_outlet
    );
  }

  // Sort by ID descending (like in the image)
  filteredData.sort((a, b) => b.id - a.id);

  // Apply pagination
  const startIndex = (pageNo - 1) * itemPerPage;
  const endIndex = startIndex + parseInt(itemPerPage);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  console.log("✅ Company outlet environment response sent successfully");
  res.json({
    message: "Company outlet environment variables retrieved successfully",
    totalRecords: filteredData.length,
    currentRecords: paginatedData.length,
    data: paginatedData
  });
});

// Company Configuration API - Get single company outlet environment variable
app.get("/api/v1/company/outlet-env/:id", (req, res) => {
  console.log("🏢 Single company outlet environment request received:", {
    params: req.params,
    timestamp: new Date().toISOString(),
  });

  const { id } = req.params;
  const configItem = companyConfigStorage.find(item => item.id === parseInt(id));

  if (!configItem) {
    return res.status(404).json({
      message: "Company outlet environment variable not found",
      error: "NOT_FOUND"
    });
  }

  console.log("✅ Single company outlet environment response sent successfully");
  res.json({
    message: "Company outlet environment variable retrieved successfully",
    data: configItem
  });
});

// Company Configuration API - Create or update company outlet environment variable
app.post("/api/v1/company/outlet-env", (req, res) => {
  console.log("🏢 Company outlet environment upsert request received:", {
    body: req.body,
    headers: req.headers,
    origin: req.get("origin"),
    timestamp: new Date().toISOString(),
  });

  try {
    const {
      id,
      company_outlet_env,
      master_company_outlet,
      env_name,
      env_key,
      env_value,
      value_datatype,
      is_encrypted,
      status
    } = req.body;

    const adminUuid = "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f";
    const adminName = "Sakshi Jadhav";

    let resultConfig;
    let isUpdate = false;

    if (id) {
      // Update existing configuration
      const existingIndex = companyConfigStorage.findIndex(item => item.id === parseInt(id));
      if (existingIndex !== -1) {
        const existingConfig = companyConfigStorage[existingIndex];
        resultConfig = {
          ...existingConfig,
          company_outlet_env: company_outlet_env || existingConfig.company_outlet_env,
          master_company_outlet: master_company_outlet || existingConfig.master_company_outlet,
          env_name: env_name || existingConfig.env_name,
          env_key: env_key || existingConfig.env_key,
          env_value: env_value || existingConfig.env_value,
          value_datatype: value_datatype || existingConfig.value_datatype,
          is_encrypted: is_encrypted !== undefined ? is_encrypted : existingConfig.is_encrypted,
          status: status || existingConfig.status,
          modified_by_uuid: adminUuid,
          modified_by_name: adminName,
          insert_ts: new Date().toISOString()
        };
        companyConfigStorage[existingIndex] = resultConfig;
        isUpdate = true;
        console.log("✅ Company outlet environment updated successfully:", resultConfig.id);
      } else {
        console.log("⚠️ Configuration ID provided but not found, creating new configuration");
      }
    }

    if (!isUpdate) {
      // Create new configuration
      const newId = Math.max(...companyConfigStorage.map(item => item.id)) + 1;
      resultConfig = {
        id: newId,
        company_outlet_env: company_outlet_env || generateUUID(),
        master_company_outlet: master_company_outlet || "m1a2b3c4-5678-9def-0123-456789abcdef",
        env_name: env_name || "New Configuration",
        env_key: env_key || "NEW_CONFIG_KEY",
        env_value: env_value || "",
        value_datatype: value_datatype || "STRING",
        is_encrypted: is_encrypted !== undefined ? is_encrypted : 0,
        status: status || "ACTIVE",
        created_by_uuid: adminUuid,
        created_by_name: adminName,
        modified_by_uuid: adminUuid,
        modified_by_name: adminName,
        create_ts: new Date().toISOString(),
        insert_ts: new Date().toISOString()
      };
      companyConfigStorage.push(resultConfig);
      console.log("✅ Company outlet environment created successfully:", resultConfig.id);
    }

    console.log("✅ Company outlet environment upsert response sent successfully");
    res.status(isUpdate ? 200 : 201).json({
      message: isUpdate ? "Company outlet environment updated successfully." : "Company outlet environment created successfully.",
      data: resultConfig
    });
  } catch (err) {
    console.error("❌ Error in company outlet environment upsert:", err);
    res.status(500).json({
      message: "Error creating/updating company outlet environment",
      error: err.message
    });
  }
});

// Company Configuration API - Delete company outlet environment variable
app.delete("/api/v1/company/outlet-env/:id", (req, res) => {
  console.log("🏢 Company outlet environment delete request received:", {
    params: req.params,
    timestamp: new Date().toISOString(),
  });

  try {
    const { id } = req.params;
    const existingIndex = companyConfigStorage.findIndex(item => item.id === parseInt(id));

    if (existingIndex === -1) {
      return res.status(404).json({
        message: "Company outlet environment variable not found",
        error: "NOT_FOUND"
      });
    }

    const deletedConfig = companyConfigStorage.splice(existingIndex, 1)[0];
    console.log("✅ Company outlet environment deleted successfully:", deletedConfig.id);

    res.json({
      message: "Company outlet environment variable deleted successfully",
      data: deletedConfig
    });
  } catch (err) {
    console.error("❌ Error in company outlet environment delete:", err);
    res.status(500).json({
      message: "Error deleting company outlet environment",
      error: err.message
    });
  }
});

// Customer API - Upsert customer endpoint
app.post("/api/v1/customer/upsert-customer", (req, res) => {
  console.log("👥 Customer upsert request received:", {
    body: req.body,
    headers: req.headers,
    origin: req.get("origin"),
    timestamp: new Date().toISOString(),
  });

  try {
    const {
      customer_fact_uuid,
      customer_code,
      branch_name,
      branch_uuid,
      customer_name,
      form_of_business,
      tax_zone,
      mailing_address,
      unit_or_suite,
      city,
      province_or_state,
      postal_code,
      country,
      language,
      producer,
      marketer,
      branch,
      assigned_to,
      csr,
      status,
      referral_code,
      customer_first_name,
      customer_last_name,
      customer_sex,
      customer_phone_number,
      customer_email,
      customer_dob,
      customer_place_of_birth,
      customer_country_of_birth,
      customer_address_line1,
      customer_address_line2,
      customer_address_landmark,
      customer_address_city,
      customer_address_state_or_province,
      customer_address_country,
      customer_address_postal_code,
      citizenship,
      status_in_country,
      current_country_of_residence,
      previous_country_of_residence,
      height,
      color_of_eyes,
      passport_details,
      national_identity_details,
      marriage_information,
      education_level,
      work_history_details,
      travel_history_in_canada,
      native_language,
      ilets_overall_score,
      ilets_reading,
      ilets_listening,
      ilets_speaking,
      ilets_writing,
      additional_family_information,
      customer_father_details,
      customer_mother_details,
      customer_personal_history,
      membership_or_association,
      additional_education_details,
      relatives_in_canada,
      relative_details_and_status,
      asignee_uuid,
      asignee_name,
      residency_expiry_date,
      educational_details,
      relative_in_canada
    } = req.body;

    const adminUuid = "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f";
    const adminName = "Umesh Yadav";

    // Generate UUIDs if not provided
    const newCustomerFactUuid = customer_fact_uuid || generateUUID();
    const newCustomerPersonalInfoUuid = generateUUID();
    const newCustomerCode = customer_code || generateCustomerCode();

    // Default passport details
    const defaultPassportDetails = passport_details || {
      "passport_number": "",
      "country_of_issue": "",
      "issue_date": "",
      "expiry_date": "",
      "valid_in_canada_from": "",
      "valid_in_canada_to": ""
    };

    // Default national identity details
    const defaultNationalIdentityDetails = national_identity_details || {
      "national_identity_document": "",
      "document_number": "",
      "country_of_issue": "",
      "issue_date": "",
      "expiry_date": ""
    };

    // Default marriage information
    const defaultMarriageInformation = marriage_information || {
      "current_status": "SINGLE",
      "date_of_marriage": "",
      "previously_married": "NO",
      "date_of_previous_marriage": "",
      "any_children_from_previous_marriage": "NO",
      "date_of_divoced": "",
      "date_of_separation": ""
    };

    // Default customer father details
    const defaultCustomerFatherDetails = customer_father_details || {
      "first_name": "",
      "last_name": "",
      "dob": "",
      "place_of_birth": "",
      "country_of_birth": "",
      "date_of_death": ""
    };

    // Default customer mother details
    const defaultCustomerMotherDetails = customer_mother_details || {
      "first_name": "",
      "last_name": "",
      "dob": "",
      "place_of_birth": "",
      "country_of_birth": "",
      "date_of_death": ""
    };

    // Default membership or association
    const defaultMembershipOrAssociation = membership_or_association || {
      "country_name": "",
      "membership": []
    };

    // Mock response structure matching the exact format provided
    const resultCustomer = {
      "customer_prospect_details_id": Math.floor(Math.random() * 1000) + 1,
      "customer_prospect_details_unique_id": Math.floor(Math.random() * 100) + 1,
      "customer_fact_uuid": newCustomerFactUuid,
      "customer_code": newCustomerCode,
      "branch_name": branch_name || "",
      "branch_uuid": branch_uuid || "",
      "customer_name": customer_name || "undefined",
      "form_of_business": form_of_business || null,
      "tax_zone": tax_zone || null,
      "mailing_address": mailing_address || null,
      "unit_or_suite": unit_or_suite || null,
      "city": city || null,
      "province_or_state": province_or_state || null,
      "postal_code": postal_code || null,
      "country": country || null,
      "language": language || null,
      "producer": producer || null,
      "marketer": marketer || null,
      "branch": branch || null,
      "assigned_to": assigned_to || null,
      "csr": csr || null,
      "status": status || "ACTIVE",
      "created_by_uuid": adminUuid,
      "created_by_name": adminName,
      "modified_by_uuid": adminUuid,
      "modified_by_name": adminName,
      "customer_personal_information_id": Math.floor(Math.random() * 1000) + 1,
      "customer_personal_information_unique_id": Math.floor(Math.random() * 100) + 1,
      "customer_personal_information_uuid": newCustomerPersonalInfoUuid,
      "referral_code": referral_code || generateReferralCode(),
      "customer_first_name": customer_first_name || "DF",
      "customer_last_name": customer_last_name || "DF",
      "customer_sex": customer_sex || "",
      "customer_phone_number": customer_phone_number || "",
      "customer_email": customer_email || "AD@GH.BJKII",
      "customer_dob": customer_dob || "2024-02-07T18:30:00.000Z",
      "customer_place_of_birth": customer_place_of_birth || "",
      "customer_country_of_birth": customer_country_of_birth || "",
      "customer_address_line1": customer_address_line1 || "",
      "customer_address_line2": customer_address_line2 || "",
      "customer_address_landmark": customer_address_landmark || "",
      "customer_address_city": customer_address_city || "",
      "customer_address_state_or_province": customer_address_state_or_province || "",
      "customer_address_country": customer_address_country || "",
      "customer_address_postal_code": customer_address_postal_code || "",
      "citizenship": citizenship || "",
      "status_in_country": status_in_country || "",
      "current_country_of_residence": current_country_of_residence || "",
      "previous_country_of_residence": previous_country_of_residence || "",
      "height": height || "",
      "color_of_eyes": color_of_eyes || "",
      "passport_details": defaultPassportDetails,
      "national_identity_details": defaultNationalIdentityDetails,
      "marriage_information": defaultMarriageInformation,
      "education_level": education_level || null,
      "work_history_details": work_history_details || [],
      "travel_history_in_canada": travel_history_in_canada || [],
      "native_language": native_language || "",
      "ilets_overall_score": ilets_overall_score || "",
      "ilets_reading": ilets_reading || "",
      "ilets_listening": ilets_listening || "",
      "ilets_speaking": ilets_speaking || "",
      "ilets_writing": ilets_writing || "",
      "additional_family_information": additional_family_information || [],
      "customer_father_details": defaultCustomerFatherDetails,
      "customer_mother_details": defaultCustomerMotherDetails,
      "customer_personal_history": customer_personal_history || [],
      "membership_or_association": defaultMembershipOrAssociation,
      "additional_education_details": additional_education_details || [],
      "relatives_in_canada": relatives_in_canada || null,
      "relative_details_and_status": relative_details_and_status || [],
      "asignee_uuid": asignee_uuid || null,
      "asignee_name": asignee_name || null,
      "residency_expiry_date": residency_expiry_date || "",
      "educational_details": educational_details || [],
      "relative_in_canada": relative_in_canada || "NO"
    };

    console.log("✅ Customer upsert response sent successfully");
    res.status(200).json({
      message: "Customer has been updated successfully.",
      data: resultCustomer
    });
  } catch (err) {
    console.error("❌ Error in customer upsert:", err);
    res.status(500).json({
      message: "Error creating/updating customer",
      error: err.message
    });
  }
});

// Helper function to generate customer code
function generateCustomerCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helper function to generate referral code
function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Lead API - Auth upsert lead endpoint
app.post("/api/v1/lead/auth-upsert-lead", (req, res) => {
  console.log("👤 Lead auth upsert request received:", {
    body: req.body,
    headers: req.headers,
    origin: req.get("origin"),
    timestamp: new Date().toISOString(),
  });

  try {
    const {
      lead_uuid,
      first_name,
      last_name,
      email,
      phone,
      business_name,
      service_type,
      service_sub_type,
      status,
      assigned_to,
      notes,
      source,
      priority
    } = req.body;

    const adminUuid = "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f";
    const adminName = "Sakshi Jadhav";

    // Generate UUID if not provided
    const newLeadUuid = lead_uuid || generateUUID();

    // Mock response structure for lead upsert
    const resultLead = {
      lead_id: Math.floor(Math.random() * 1000) + 1,
      lead_uuid: newLeadUuid,
      first_name: first_name || "",
      last_name: last_name || "",
      full_name: `${first_name || ''} ${last_name || ''}`.trim(),
      email: email || "",
      phone: phone || "",
      business_name: business_name || "",
      service_type: service_type || "GENERAL",
      service_sub_type: service_sub_type || "",
      status: status || "NEW",
      assigned_to: assigned_to || null,
      assigned_to_name: assigned_to ? "Assigned User" : null,
      notes: notes || "",
      source: source || "WEBSITE",
      priority: priority || "MEDIUM",
      created_by_uuid: adminUuid,
      created_by_name: adminName,
      modified_by_uuid: adminUuid,
      modified_by_name: adminName,
      create_ts: new Date().toISOString(),
      insert_ts: new Date().toISOString()
    };

    console.log("✅ Lead auth upsert response sent successfully");
    res.status(201).json({
      message: "Lead created successfully.",
      data: resultLead
    });
  } catch (err) {
    console.error("❌ Error in lead auth upsert:", err);
    res.status(500).json({
      message: "Error creating/updating lead",
      error: err.message
    });
  }
});

// Lead API - Alternative endpoint for typo handling
app.post("/api/v1/lead/uth-upsert-lead", (req, res) => {
  console.log("👤 Lead auth upsert request (typo endpoint) received:", {
    body: req.body,
    headers: req.headers,
    origin: req.get("origin"),
    timestamp: new Date().toISOString(),
  });

  try {
    const {
      lead_uuid,
      first_name,
      last_name,
      email,
      phone,
      business_name,
      service_type,
      service_sub_type,
      status,
      assigned_to,
      notes,
      source,
      priority
    } = req.body;

    const adminUuid = "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f";
    const adminName = "Sakshi Jadhav";

    // Generate UUID if not provided
    const newLeadUuid = lead_uuid || generateUUID();

    // Mock response structure for lead upsert
    const resultLead = {
      lead_id: Math.floor(Math.random() * 1000) + 1,
      lead_uuid: newLeadUuid,
      first_name: first_name || "",
      last_name: last_name || "",
      full_name: `${first_name || ''} ${last_name || ''}`.trim(),
      email: email || "",
      phone: phone || "",
      business_name: business_name || "",
      service_type: service_type || "GENERAL",
      service_sub_type: service_sub_type || "",
      status: status || "NEW",
      assigned_to: assigned_to || null,
      assigned_to_name: assigned_to ? "Assigned User" : null,
      notes: notes || "",
      source: source || "WEBSITE",
      priority: priority || "MEDIUM",
      created_by_uuid: adminUuid,
      created_by_name: adminName,
      modified_by_uuid: adminUuid,
      modified_by_name: adminName,
      create_ts: new Date().toISOString(),
      insert_ts: new Date().toISOString()
    };

    console.log("✅ Lead auth upsert response sent successfully (typo endpoint)");
    res.status(201).json({
      message: "Lead created successfully.",
      data: resultLead
    });
  } catch (err) {
    console.error("❌ Error in lead auth upsert (typo endpoint):", err);
    res.status(500).json({
      message: "Error creating/updating lead",
      error: err.message
    });
  }
});

// Template API - Edit template endpoint
app.post("/api/v1/template/edit-template", (req, res) => {
  console.log("📝 Template edit request received:", {
    body: req.body,
    headers: req.headers,
    origin: req.get("origin"),
    timestamp: new Date().toISOString(),
  });

  try {
    const {
      templates_uuid,
      template_code,
      template_category,
      template_name,
      table_name_or_dynamic_view_code,
      call_type,
      column,
      template_subject,
      track_changes,
      body,
      status
    } = req.body;

    const adminUuid = "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f";
    const adminName = "Umesh Yadav";

    // Generate UUID and template code if not provided
    const newTemplatesUuid = templates_uuid || generateUUID();
    const newTemplateCode = template_code || generateTemplateCode();

    // Mock response structure matching the exact format provided
    const resultTemplate = {
      template_code: newTemplateCode,
      template_category: template_category || "SMS",
      template_name: template_name || "Default Template",
      table_name_or_dynamic_view_code: table_name_or_dynamic_view_code || "latest_accn_account_receivable_trust",
      call_type: call_type || "TABLE",
      column: column || "",
      template_subject: template_subject || "Default Subject",
      track_changes: track_changes || "@@track_changes",
      body: body || "<p>Default template body</p>",
      status: status || "ACTIVE",
      templates_uuid: newTemplatesUuid,
      created_by_uuid: adminUuid,
      created_by_name: adminName,
      modified_by_uuid: adminUuid,
      modified_by_name: adminName,
      create_ts: new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      }).replace(/(\d+)\/(\d+)\/(\d+),?\s*(\d+):(\d+):(\d+)/, '$3-$1-$2 $4:$5:$6')
    };

    console.log("✅ Template edit response sent successfully");
    res.status(201).json({
      message: "Templates has been created successfully.",
      data: resultTemplate
    });
  } catch (err) {
    console.error("❌ Error in template edit:", err);
    res.status(500).json({
      message: "Error creating/updating template",
      error: err.message
    });
  }
});

// Workflow API - Upsert workflow basic endpoint
app.post("/api/v1/workflow/upsert-workflow-basic", (req, res) => {
  console.log("🔄 Workflow basic upsert request received:", {
    body: req.body,
    headers: req.headers,
    origin: req.get("origin"),
    timestamp: new Date().toISOString(),
  });

  try {
    const {
      workflow_uuid,
      workflow_name,
      workflow_description,
      table_name,
      trigger_event,
      trigger_condition,
      status,
      is_active,
      priority
    } = req.body;

    const adminUuid = "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f";
    const adminName = "Sakshi Jadhav";

    // Generate UUID if not provided
    const newWorkflowUuid = workflow_uuid || generateUUID();

    // Mock response structure for workflow basic
    const resultWorkflowBasic = {
      workflow_id: Math.floor(Math.random() * 1000) + 1,
      workflow_unique_id: Math.floor(Math.random() * 100) + 1,
      workflow_uuid: newWorkflowUuid,
      workflow_name: workflow_name || "Default Workflow",
      workflow_description: workflow_description || "Automated workflow process",
      table_name: table_name || "latest_task_module_wise",
      trigger_event: trigger_event || "INSERT",
      trigger_condition: trigger_condition || "status = 'PENDING'",
      status: status || "ACTIVE",
      is_active: is_active !== undefined ? is_active : true,
      priority: priority || 1,
      created_by_uuid: adminUuid,
      created_by_name: adminName,
      modified_by_uuid: adminUuid,
      modified_by_name: adminName,
      create_ts: new Date().toISOString(),
      insert_ts: new Date().toISOString()
    };

    console.log("✅ Workflow basic upsert response sent successfully");
    res.status(201).json({
      message: "Workflow basic created successfully.",
      data: resultWorkflowBasic
    });
  } catch (err) {
    console.error("❌ Error in workflow basic upsert:", err);
    res.status(500).json({
      message: "Error creating/updating workflow basic",
      error: err.message
    });
  }
});

// Workflow API - Get API endpoints endpoint
app.get("/api/v1/workflow/get-apis-endpoints", (req, res) => {
  console.log("🔗 Workflow API endpoints request received:", {
    query: req.query,
    method_type: req.query.method_type,
    timestamp: new Date().toISOString(),
  });

  const { method_type } = req.query;

  // Comprehensive list of API endpoints organized by module
  const apiEndpoints = {
    "accounting": [
      "/api/v1/accounting/edit-account-payment-accounts-receivable",
      "/api/v1/accounting/edit-account-invoice-payment-transaction-items",
      "/api/v1/accounting/edit-account-company-charts-of-accounts",
      "/api/v1/accounting/edit-account-company-gl-accounts",
      "/api/v1/accounting/edit-account-company-information",
      "/api/v1/accounting/edit-account-company-onboarding",
      "/api/v1/accounting/edit-account-invoice",
      "/api/v1/accounting/edit-accn-transaction-report",
      "/api/v1/accounting/edit-account-invoice-template",
      "/api/v1/accounting/edit-account-transaction-type",
      "/api/v1/accounting/edit-account-transaction-description",
      "/api/v1/accounting/edit-account-create-bill",
      "/api/v1/accounting/edit-account-bill-payment-transaction-items",
      "/api/v1/accounting/edit-account-bill-template",
      "/api/v1/accounting/edit-account-create-payment",
      "/api/v1/accounting/edit-account-bank-account",
      "/api/v1/accounting/edit-account-cheque",
      "/api/v1/accounting/edit-account-vendor",
      "/api/v1/accounting/edit-account-system-gl-account"
    ],
    "analytics": [],
    "approval": [
      "/api/v1/approval/insert-approval",
      "/api/v1/approval/handle-approval",
      "/api/v1/approval/insert-approval-count"
    ],
    "authentication": [
      "/api/v1/authentication/user-verification",
      "/api/v1/authentication/login",
      "/api/v1/authentication/validate-otp-get-token",
      "/api/v1/authentication/forget-password",
      "/api/v1/authentication/logout"
    ],
    "comment": [
      "/api/v1/comment/upsert-comment"
    ],
    "companyInformation": [
      "/api/v1/companyInformation/upsert-company-information",
      "/api/v1/companyInformation/upsert-environment-configuration"
    ],
    "conversation": [
      "/api/v1/conversation/upsert-messages"
    ],
    "customer": [
      "/api/v1/customer/upsert-customer",
      "/api/v1/customer/edit-customer-prospact-details",
      "/api/v1/customer/check-customer-prospact-details-customer-code",
      "/api/v1/customer/edit-customer-social",
      "/api/v1/customer/edit-document",
      "/api/v1/customer/edit-customer-pr",
      "/api/v1/customer/upsert-customer-service",
      "/api/v1/customer/upsert-customer-automation",
      "/api/v1/customer/upsert-customer-invoice"
    ],
    "dataManagement": [
      "/api/v1/dataManagement/upsert-branch",
      "/api/v1/dataManagement/upsert-zone"
    ],
    "formula": [
      "/api/v1/formula/upsert-formula"
    ],
    "general": [
      "/api/v1/general/send-grid-email",
      "/api/v1/general/upload-files",
      "/api/v1/general/download-files",
      "/api/v1/general/microsoftgraph/search",
      "/api/v1/general/microsoftgraph/fetchUnreadEmails",
      "/api/v1/general/microsoftgraph/send-email",
      "/api/v1/general/approval/status-approval",
      "/api/v1/general/base64-to-buffer",
      "/api/v1/general/generate-dynamic-sql",
      "/api/v1/general/file-explorer",
      "/api/v1/general/file-move",
      "/api/v1/general/file-rename-folder",
      "/api/v1/general/file-rename",
      "/api/v1/general/upsert-country-state"
    ],
    "history": [
      "/api/v1/history/upsert-history",
      "/api/v1/history/upsert-email-history"
    ],
    "lead": [
      "/api/v1/lead/upsert-lead",
      "/api/v1/lead/auth-upsert-lead",
      "/api/v1/lead/create-opportunity",
      "/api/v1/lead/edit-study",
      "/api/v1/lead/lead-reports",
      "/api/v1/lead/lead-suggestion",
      "/api/v1/lead/sign-document",
      "/api/v1/lead/signature-history",
      "/api/v1/lead/generate-signed-document",
      "/api/v1/lead/sign-document-webhook",
      "/api/v1/lead/lead-signature",
      "/api/v1/lead/retainer",
      "/api/v1/lead/create-retainer-pdf-document",
      "/api/v1/lead/signature-customer-webhook",
      "/api/v1/lead/fetch-graphs-from-lead-data",
      "/api/v1/lead/extract-lead-with-genai"
    ],
    "questionnaire": [
      "/api/v1/questionnaire/upsert-questionnaire",
      "/api/v1/questionnaire/upsert-question",
      "/api/v1/questionnaire/upsert-answer",
      "/api/v1/questionnaire/upsert-questions-options",
      "/api/v1/questionnaire/duplicate-questionnaire"
    ],
    "security": [
      "/api/v1/security/upsert-roles",
      "/api/v1/security/upsert-role-module-content-access-permission",
      "/api/v1/security/upsert-role-group"
    ],
    "services": [
      "/api/v1/services/create-services"
    ],
    "tasks": [
      "/api/v1/tasks/upsert-user-taskboard",
      "/api/v1/tasks/create-task-module-wise"
    ],
    "template": [
      "/api/v1/template/edit-template",
      "/api/v1/template/render-template",
      "/api/v1/template/upsert-sql-view-or-columns",
      "/api/v1/template/create-document-template"
    ],
    "user": [
      "/api/v1/user/upsert-user",
      "/api/v1/user/update-profile",
      "/api/v1/user/change-user-role"
    ],
    "workflow": [
      "/api/v1/workflow/upsert-workflow-basic",
      "/api/v1/workflow/upsert-workflow-condition",
      "/api/v1/workflow/upsert-workflow-action",
      "/api/v1/workflow/upsert-workflow-action-email",
      "/api/v1/workflow/upsert-workflow-action-message",
      "/api/v1/workflow/workflow-initiate"
    ]
  };

  console.log("✅ API endpoints response sent successfully");
  res.json({
    message: "All api endpoints",
    data: apiEndpoints
  });
});

// Customer API - Upsert customer automation endpoint
app.post("/api/v1/customer/upsert-customer-automation", (req, res) => {
  console.log("🤖 Customer automation upsert request received:", {
    body: req.body,
    headers: req.headers,
    origin: req.get("origin"),
    timestamp: new Date().toISOString(),
  });

  try {
    const {
      customer_automation_uuid,
      customer_fact_uuid,
      sub_module_uuid,
      automation_type,
      status
    } = req.body;

    const adminUuid = "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f";
    const adminName = "Umesh Yadav";

    // Generate UUID if not provided
    const newCustomerAutomationUuid = customer_automation_uuid || generateUUID();

    // Mock response structure matching the production API
    const resultCustomerAutomation = {
      customer_automation_id: 1,
      customer_automation_unique_id: 1,
      customer_automation_uuid: newCustomerAutomationUuid,
      customer_fact_uuid: customer_fact_uuid || null,
      sub_module_uuid: sub_module_uuid || null,
      automation_type: automation_type || "MANUAL",
      status: status || "ACTIVE",
      created_by_uuid: "77f492f7-5701-4386-8abc-3bcb55efa918",
      created_by_name: "Ramesh",
      modified_by_uuid: adminUuid,
      modified_by_name: adminName,
      create_ts: "2025-06-28 16:49:11",
      insert_ts: new Date().toISOString()
    };

    console.log("✅ Customer automation upsert response sent successfully");
    res.status(200).json({
      message: "Customer Automation has been updated successfully.",
      data: resultCustomerAutomation
    });
  } catch (err) {
    console.error("❌ Error in customer automation upsert:", err);
    res.status(500).json({
      message: "Error creating/updating customer automation",
      error: err.message
    });
  }
});

// Approval API - Insert approval count endpoint
app.post("/api/v1/approval/insert-approval-count", (req, res) => {
  console.log("📋 Insert approval count request received:", {
    body: req.body,
    headers: req.headers,
    origin: req.get("origin"),
    timestamp: new Date().toISOString(),
  });

  try {
    const {
      approval_count_uuid,
      table_name,
      link_table,
      link_column,
      approval_hierarchy,
      status,
      approval_raise_status,
      previous_status,
      next_status
    } = req.body;

    const adminUuid = "0522b6ac-3ec7-4a6f-92b0-f6becd6e346f";
    const adminName = "Sakshi Jadhav";

    // Generate UUID if not provided
    const newApprovalCountUuid = approval_count_uuid || generateUUID();

    // Mock response structure based on typical approval count response
    const resultApprovalCount = {
      approval_count_id: Math.floor(Math.random() * 1000) + 1,
      approval_count_unique_id: Math.floor(Math.random() * 100) + 1,
      approval_count_uuid: newApprovalCountUuid,
      table_name: table_name || "latest_task_module_wise",
      level: approval_hierarchy ? approval_hierarchy.length.toString() : "1",
      approval_hierarchy: approval_hierarchy || [["EMPLOYEE"]],
      approval_raise_status: approval_raise_status || "PENDING",
      previous_status: previous_status || "DRAFT",
      next_status: next_status || "APPROVED",
      status: status || "ACTIVE",
      created_by_uuid: adminUuid,
      created_by_name: adminName,
      modified_by_uuid: adminUuid,
      modified_by_name: adminName,
      create_ts: new Date().toISOString(),
      insert_ts: new Date().toISOString()
    };

    console.log("✅ Approval count inserted successfully:", resultApprovalCount.approval_count_uuid);
    res.status(201).json({
      message: "Approval count created successfully.",
      data: resultApprovalCount
    });
  } catch (err) {
    console.error("❌ Error in approval count insert:", err);
    res.status(500).json({
      message: "Error creating approval count",
      error: err.message
    });
  }
});

// General API - Get table description endpoint
app.get("/api/v1/general/get-table-description", (req, res) => {
  console.log("📊 General table description request received:", {
    query: req.query,
    table_name: req.query.table_name,
    timestamp: new Date().toISOString(),
  });

  const { table_name } = req.query;

  if (!table_name) {
    return res.status(400).json({
      message: "Table name is required",
      error: "MISSING_TABLE_NAME"
    });
  }

  // Mock table description based on table name
  let tableDescription = {
    message: `Table description : ${table_name}`,
    currentRecords: 0,
    data: []
  };

  // Provide different mock data based on table name
  switch (table_name) {
    case "latest_user":
      tableDescription = {
        message: `Table description : ${table_name}`,
        currentRecords: 16,
        data: [
          "`user_fact_id`",
          "`user_uuid`",
          "`email`",
          "`status`",
          "`created_by_uuid`",
          "`created_by_name`",
          "`create_ts`",
          "`insert_ts`",
          "`user_dim_id`",
          "`role_uuid`",
          "`role_value`",
          "`user_profile_id`",
          "`first_name`",
          "`last_name`",
          "`full_name`",
          "`personal_email`"
        ]
      };
      break;
    case "latest_approval_count":
      tableDescription = {
        message: `Table description : ${table_name}`,
        currentRecords: 16,
        data: [
          "`approval_count_id`",
          "`approval_count_unique_id`",
          "`approval_count_uuid`",
          "`table_name`",
          "`level`",
          "`approval_hierarchy`",
          "`approval_raise_status`",
          "`previous_status`",
          "`next_status`",
          "`status`",
          "`created_by_uuid`",
          "`created_by_name`",
          "`modified_by_uuid`",
          "`modified_by_name`",
          "`create_ts`",
          "`insert_ts`"
        ]
      };
      break;
    case "latest_task_module_wise":
      tableDescription = {
        message: `Table description : ${table_name}`,
        currentRecords: 12,
        data: [
          "`task_id`",
          "`task_uuid`",
          "`task_name`",
          "`task_description`",
          "`task_status`",
          "`priority`",
          "`assigned_to_uuid`",
          "`assigned_to_name`",
          "`status`",
          "`created_by_uuid`",
          "`created_by_name`",
          "`create_ts`"
        ]
      };
      break;
    case "latest_branch":
      tableDescription = {
        message: `Table description : ${table_name}`,
        currentRecords: 14,
        data: [
          "`branch_id`",
          "`branch_uuid`",
          "`branch_name`",
          "`branch_code`",
          "`branch_email`",
          "`branch_logo`",
          "`description`",
          "`branch_phone_no`",
          "`branch_mobile_no`",
          "`status`",
          "`created_by_uuid`",
          "`created_by_name`",
          "`create_ts`",
          "`insert_ts`"
        ]
      };
      break;
    case "latest_role_group":
      tableDescription = {
        message: `Table description : ${table_name}`,
        currentRecords: 7,
        data: [
          "`role_group_id`",
          "`role_group_unique_id`",
          "`role_group_uuid`",
          "`role_group`",
          "`status`",
          "`created_by_uuid`",
          "`create_ts`"
        ]
      };
      break;
    case "latest_leads":
      tableDescription = {
        message: `Table description : ${table_name}`,
        currentRecords: 25,
        data: [
          "`leads_uuid`",
          "`referral_code`",
          "`leads_code`",
          "`terms_and_condition`",
          "`branch_name`",
          "`branch_uuid`",
          "`service_type`",
          "`service_sub_type`",
          "`applicant_first_name`",
          "`applicant_last_name`",
          "`nationality`",
          "`country`",
          "`state_or_province`",
          "`country_of_residence`",
          "`status_in_country`",
          "`unique_token_no`",
          "`submitted_on`",
          "`user_roles`",
          "`current_residential_address`",
          "`primary_language`",
          "`english_exam_type`",
          "`Date_of_IELTS_exam`",
          "`overall_IELTS_score`",
          "`status`",
          "`create_ts`"
        ]
      };
      break;
    case "latest_customer_pr":
      tableDescription = {
        message: `Table description : ${table_name}`,
        currentRecords: 18,
        data: [
          "`customer_fact_id`",
          "`customer_uuid`",
          "`customer_name`",
          "`customer_email`",
          "`customer_phone`",
          "`customer_address`",
          "`customer_type`",
          "`service_type`",
          "`status`",
          "`assigned_to_uuid`",
          "`assigned_to_name`",
          "`created_by_uuid`",
          "`created_by_name`",
          "`modified_by_uuid`",
          "`modified_by_name`",
          "`create_ts`",
          "`insert_ts`",
          "`update_ts`"
        ]
      };
      break;
    default:
      tableDescription = {
        message: `Table description : ${table_name}`,
        currentRecords: 5,
        data: [
          "`id`",
          "`name`",
          "`description`",
          "`status`",
          "`created_at`"
        ]
      };
  }

  console.log("✅ Table description response sent successfully for:", table_name);
  res.json(tableDescription);
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
