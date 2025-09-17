const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

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
app.get("/api/v1/user/get-user", (req, res) => {
  console.log("👤 Get user request received:", {
    query: req.query,
    headers: req.headers,
    origin: req.get("origin"),
    timestamp: new Date().toISOString(),
  });

  const { status, user_uuid } = req.query;

  // Mock user data matching the UI_Reference response format
  const userData = {
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

  console.log("✅ User data response sent successfully");
  res.json({
    message: "All User",
    totalRecords: 1,
    currentRecords: 1,
    data: [userData],
  });
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
