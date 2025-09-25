-- Nove Backend Database Schema
-- PostgreSQL Database for PM Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS AND AUTHENTICATION TABLES
-- =============================================

-- Users table
CREATE TABLE users (
    user_fact_id SERIAL PRIMARY KEY,
    user_fact_unique_id INTEGER UNIQUE NOT NULL,
    user_uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE' NOT NULL,
    created_by_uuid UUID,
    created_by_name VARCHAR(255),
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_dim_id INTEGER,
    role_uuid UUID,
    role_value VARCHAR(100),
    user_profile_id INTEGER,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    full_name VARCHAR(255),
    personal_email VARCHAR(255),
    job_title VARCHAR(255),
    user_type VARCHAR(100),
    assigned_phone_number VARCHAR(50),
    shared_email VARCHAR(255),
    mobile VARCHAR(50),
    home_phone VARCHAR(50),
    linkedin_profile VARCHAR(500),
    hire_date DATE,
    last_day_at_work DATE,
    department VARCHAR(255),
    fax VARCHAR(50),
    date_of_birth DATE,
    mother_maiden_name VARCHAR(255),
    photo VARCHAR(500),
    signature VARCHAR(500),
    street_address TEXT,
    unit_or_suite VARCHAR(100),
    city VARCHAR(255),
    csr VARCHAR(255),
    csr_code VARCHAR(100),
    marketer VARCHAR(255),
    marketer_code VARCHAR(100),
    producer_one VARCHAR(255),
    producer_one_code VARCHAR(100),
    producer_two VARCHAR(255),
    producer_two_code VARCHAR(100),
    producer_three VARCHAR(255),
    producer_three_code VARCHAR(100),
    branch_code VARCHAR(100),
    province_or_state VARCHAR(255),
    postal_code VARCHAR(20),
    country VARCHAR(255),
    languages_known TEXT,
    documents JSONB,
    branch_name VARCHAR(255),
    branch_uuid UUID,
    referral_code VARCHAR(100)
);

-- User roles table
CREATE TABLE user_roles (
    role_uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    role_value VARCHAR(100) UNIQUE NOT NULL,
    role_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by_uuid UUID,
    created_by_name VARCHAR(255),
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Module security table
CREATE TABLE module_security (
    role_module_id SERIAL PRIMARY KEY,
    role_module_unique_id INTEGER UNIQUE NOT NULL,
    role_module_uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    module_uuid UUID NOT NULL,
    role_uuid UUID REFERENCES user_roles(role_uuid),
    show_module INTEGER DEFAULT 1,
    view_access INTEGER DEFAULT 0,
    edit_access INTEGER DEFAULT 0,
    send_sms INTEGER DEFAULT 0,
    send_mail INTEGER DEFAULT 0,
    send_whatsapp INTEGER DEFAULT 0,
    send_call INTEGER DEFAULT 0,
    filter_values JSONB,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_by_uuid UUID,
    created_by_name VARCHAR(255),
    modified_by_uuid UUID,
    modified_by_name VARCHAR(255),
    create_ts TIMESTAMP,
    insert_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    module_name VARCHAR(255),
    submodule_name VARCHAR(255),
    table_name VARCHAR(255),
    module_key VARCHAR(255)
);

-- =============================================
-- COMPANY INFORMATION TABLES
-- =============================================

-- Company information table
CREATE TABLE company_information (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    preview_logo VARCHAR(500),
    preview_fav_icon VARCHAR(500),
    company_title VARCHAR(255),
    company_description TEXT,
    adsense_header_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Environment configuration table
CREATE TABLE environment_configuration (
    id SERIAL PRIMARY KEY,
    environment VARCHAR(100) NOT NULL,
    api_base_url VARCHAR(500),
    frontend_url VARCHAR(500),
    database_url VARCHAR(500),
    redis_url VARCHAR(500),
    jwt_secret VARCHAR(500),
    google_client_id VARCHAR(500),
    google_client_secret VARCHAR(500),
    cors_origin VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- CONVERSATION TABLES
-- =============================================

-- Conversations table
CREATE TABLE conversations (
    conversation_id SERIAL PRIMARY KEY,
    conversation_uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    user_uuid UUID REFERENCES users(user_uuid),
    conversation_type VARCHAR(100) DEFAULT 'CHAT',
    title VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_by_uuid UUID,
    created_by_name VARCHAR(255),
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversation messages table
CREATE TABLE conversation_messages (
    message_id SERIAL PRIMARY KEY,
    message_uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    conversation_uuid UUID REFERENCES conversations(conversation_uuid),
    user_uuid UUID REFERENCES users(user_uuid),
    message_type VARCHAR(50) DEFAULT 'TEXT',
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'SENT',
    created_by_uuid UUID,
    created_by_name VARCHAR(255),
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- LEADS TABLES
-- =============================================

-- Leads table
CREATE TABLE leads (
    leads_uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    referral_code VARCHAR(100),
    leads_code VARCHAR(255) UNIQUE NOT NULL,
    terms_and_condition INTEGER DEFAULT 0,
    branch_name VARCHAR(255),
    branch_uuid UUID,
    service_type VARCHAR(100),
    service_sub_type VARCHAR(255),
    applicant_first_name VARCHAR(255),
    applicant_last_name VARCHAR(255),
    nationality VARCHAR(100),
    country VARCHAR(100),
    state_or_province VARCHAR(255),
    country_of_residence VARCHAR(100),
    status_in_country VARCHAR(100),
    unique_token_no VARCHAR(255),
    submitted_on TIMESTAMP,
    user_roles VARCHAR(255),
    current_residential_address TEXT,
    primary_language VARCHAR(100),
    english_exam_type VARCHAR(100),
    date_of_ielts_exam DATE,
    overall_ielts_score DECIMAL(4,2),
    which_intake_you_want_to_apply_for VARCHAR(255),
    intake_year INTEGER,
    program_type_apply_for VARCHAR(255),
    highest_level_of_education VARCHAR(255),
    matriculation_start_date DATE,
    matriculation_end_date DATE,
    completion_year INTEGER,
    school_name VARCHAR(255),
    percentage DECIMAL(5,2),
    math_marks DECIMAL(5,2),
    english_marks DECIMAL(5,2),
    senior_secondary_start_date DATE,
    senior_secondary_end_date DATE,
    senior_secondary_school_name VARCHAR(255),
    senior_secondary_completion_year INTEGER,
    senior_secondary_field_of_study VARCHAR(255),
    senior_secondary_percentage DECIMAL(5,2),
    company_name VARCHAR(255),
    job_title VARCHAR(255),
    job_start_date DATE,
    visa_refusal BOOLEAN DEFAULT FALSE,
    valid_study_permit_visa BOOLEAN DEFAULT FALSE,
    applicant_date_of_birth DATE,
    age INTEGER,
    applicant_sex VARCHAR(20),
    contact_number VARCHAR(50),
    email VARCHAR(255),
    marital_status VARCHAR(50),
    number_of_children INTEGER DEFAULT 0,
    is_er_approved_outside_canada BOOLEAN DEFAULT FALSE,
    education JSONB,
    is_last_10_years BOOLEAN,
    last_10_foreign_years INTEGER,
    work_history JSONB,
    english_language_test_type VARCHAR(100),
    english_test_result_less_than_two_years VARCHAR(10),
    english_ability_speaking INTEGER,
    english_ability_reading INTEGER,
    english_ability_writing INTEGER,
    english_ability_listening INTEGER,
    english_ability_total_points INTEGER,
    french_language_test_type VARCHAR(100),
    french_test_result_less_than_two_years VARCHAR(10),
    french_ability_speaking INTEGER,
    french_ability_reading INTEGER,
    french_ability_writing INTEGER,
    french_ability_listening INTEGER,
    second_language_ability_total_points INTEGER,
    work_and_educ INTEGER,
    wkr_frg_exp INTEGER,
    speak_and_edu INTEGER,
    speak_and_work INTEGER,
    sponsor_type VARCHAR(100),
    sponsor_income DECIMAL(15,2),
    currency_field VARCHAR(10),
    movable DECIMAL(15,2),
    immovable DECIMAL(15,2),
    net_worth DECIMAL(15,2),
    travel_history JSONB,
    upon_signing_of_this_agreement DECIMAL(15,2),
    upon_submission DECIMAL(15,2),
    upon_execution_of_this_agreement DECIMAL(15,2),
    hst DECIMAL(15,2),
    total_fees DECIMAL(15,2),
    spouse_first_name VARCHAR(255),
    spouse_last_name VARCHAR(255),
    spouse_date_of_birth DATE,
    spouse_sex VARCHAR(20),
    spouse_has_degree_outside_canada_degree BOOLEAN,
    spouse_education JSONB,
    spouse_education_points INTEGER,
    is_spouse_last_10_years BOOLEAN,
    spouse_work_history JSONB,
    spouse_work_points INTEGER,
    spouse_english_language_test_type VARCHAR(100),
    spouse_english_test_result_less_than_two_years VARCHAR(10),
    spouse_english_ability_speaking INTEGER,
    spouse_english_ability_reading INTEGER,
    spouse_english_ability_writing INTEGER,
    spouse_english_ability_listening INTEGER,
    spouse_english_ability_total_points INTEGER,
    spouse_french_language_test_type VARCHAR(100),
    spouse_french_test_result_less_than_two_years VARCHAR(10),
    spouse_french_ability_speaking INTEGER,
    spouse_french_ability_reading INTEGER,
    spouse_french_ability_writing INTEGER,
    spouse_french_ability_listening INTEGER,
    self_employment BOOLEAN,
    relatives_in_canada VARCHAR(10),
    is_valid_job_offer VARCHAR(10),
    noc_teer_job_offer_type VARCHAR(100),
    province_or_territory_nomination VARCHAR(10),
    certificate_of_qualification VARCHAR(10),
    certificate_points INTEGER,
    applicant_crs_points JSONB,
    total_additional INTEGER,
    additional_points INTEGER,
    additional_points_alt INTEGER,
    leads_source VARCHAR(100),
    total INTEGER,
    passport VARCHAR(500),
    wes_document VARCHAR(500),
    iltes_document VARCHAR(500),
    resume VARCHAR(500),
    funds_available VARCHAR(100),
    prior_travel_history VARCHAR(10),
    country_code VARCHAR(10),
    childrens_details JSONB,
    no_work_experience INTEGER DEFAULT 0,
    relative_relation VARCHAR(100),
    spouse_no_work_experience INTEGER DEFAULT 0,
    asignee_uuid UUID,
    asignee_email VARCHAR(255),
    asignee_name VARCHAR(255),
    applicant_oinp_points JSONB,
    job_offer JSONB,
    oinp_subtotal INTEGER,
    oinp_total INTEGER,
    specify VARCHAR(255),
    notes TEXT,
    questionnaire_name VARCHAR(255),
    questionnaire_uuid UUID,
    comment TEXT,
    asignee JSONB,
    time_to_contact VARCHAR(255),
    assigned_to_id VARCHAR(50),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_by_uuid UUID,
    created_by_name VARCHAR(255),
    modified_by_uuid UUID,
    modified_by_name VARCHAR(255),
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TASK MODULE TABLES
-- =============================================

-- Task module wise table
CREATE TABLE task_module_wise (
    task_module_wise_id SERIAL PRIMARY KEY,
    task_module_wise_uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    task_module_wise_code VARCHAR(50) UNIQUE NOT NULL,
    module_name VARCHAR(255) NOT NULL,
    sub_module_name VARCHAR(255) NOT NULL,
    module_reference_column VARCHAR(255),
    module_reference_code_or_id VARCHAR(255),
    task_name VARCHAR(255) NOT NULL,
    description TEXT,
    task_completed_date TIMESTAMP,
    task_priority VARCHAR(50),
    assigned_to_uuid UUID REFERENCES users(user_uuid),
    assigned_to_name VARCHAR(255),
    created_by_uuid UUID REFERENCES users(user_uuid),
    created_by_name VARCHAR(255),
    modified_by_uuid UUID REFERENCES users(user_uuid),
    modified_by_name VARCHAR(255),
    task_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    file_upload JSONB,
    date_created VARCHAR(50),
    due_date VARCHAR(50),
    due_time VARCHAR(50),
    date_completed VARCHAR(50),
    time_completed VARCHAR(50),
    create_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ANALYTICS TABLES
-- =============================================

-- Analytics data table
CREATE TABLE analytics_data (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(255) NOT NULL,
    metric_value INTEGER DEFAULT 0,
    growth_percentage DECIMAL(5,2) DEFAULT 0,
    date_from DATE,
    date_to DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_uuid ON users(user_uuid);
CREATE INDEX idx_users_status ON users(status);

-- Conversation indexes
CREATE INDEX idx_conversations_user_uuid ON conversations(user_uuid);
CREATE INDEX idx_conversations_status ON conversations(status);

-- Leads indexes
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_ts ON leads(create_ts);

-- Analytics indexes
CREATE INDEX idx_analytics_metric_name ON analytics_data(metric_name);
CREATE INDEX idx_analytics_date_range ON analytics_data(date_from, date_to);

-- Task module indexes
CREATE INDEX idx_task_module_wise_uuid ON task_module_wise(task_module_wise_uuid);
CREATE INDEX idx_task_module_wise_code ON task_module_wise(task_module_wise_code);
CREATE INDEX idx_task_module_wise_assigned_to ON task_module_wise(assigned_to_uuid);
CREATE INDEX idx_task_module_wise_status ON task_module_wise(status);
CREATE INDEX idx_task_module_wise_module_name ON task_module_wise(module_name);
CREATE INDEX idx_task_module_wise_created_ts ON task_module_wise(create_ts);

-- =============================================
-- SAMPLE DATA INSERTION
-- =============================================

-- Insert sample user roles
INSERT INTO user_roles (role_value, role_name, description, created_by_name) VALUES
('ADMIN', 'Administrator', 'Full system access', 'System'),
('USER', 'Regular User', 'Standard user access', 'System'),
('MANAGER', 'Manager', 'Management level access', 'System');

-- Insert sample company information
INSERT INTO company_information (company_name, preview_logo, preview_fav_icon, company_title, company_description) VALUES
('Addcomposites oy', 
 'https://cdn.prod.website-files.com/65d8589d1d07ae7c06b4b253/65dc150bf8f7695a87422fa3_hdr-logo.png',
 'https://cdn.prod.website-files.com/65d8589d1d07ae7c06b4b253/65dc150bf8f7695a87422fa3_hdr-logo.png',
 'Leading Composites Services',
 'Additive Manufacturing for Lightweight Structural Components');

-- Insert sample environment configuration
INSERT INTO environment_configuration (environment, api_base_url, frontend_url, cors_origin) VALUES
('development', 'http://localhost:3001', 'http://localhost:8005', 'http://localhost:8005'),
('production', '', '', '');

-- Insert sample analytics data
INSERT INTO analytics_data (metric_name, metric_value, growth_percentage, date_from, date_to) VALUES
('count_leads', 0, 0, '2025-09-10', '2025-09-18'),
('count_customer', 0, 0, '2025-09-10', '2025-09-18'),
('count_user', 0, 0, '2025-09-10', '2025-09-18'),
('customer_invoice_PENDING', 0, 0, '2025-09-10', '2025-09-18'),
('customer_invoice_PARTIALLY_PAID', 0, 0, '2025-09-10', '2025-09-18'),
('customer_invoice_PAID', 0, 0, '2025-09-10', '2025-09-18');

-- Insert sample user (for testing)
INSERT INTO users (
    user_fact_unique_id, email, password_hash, status, created_by_name,
    first_name, last_name, full_name, personal_email, role_value,
    branch_name, branch_uuid, referral_code
) VALUES (
    12, 'sakshi.jadhav@addcomposites.com', '$2b$10$example_hash', 'ACTIVE', 'System',
    'Sakshi', 'Jadhav', 'Sakshi Jadhav', 'sakshi.jadhav@addcomposites.com', 'ADMIN',
    'NOVA SCOTIA', uuid_generate_v4(), 'NW-40'
);

-- Insert sample module security
INSERT INTO module_security (
    role_module_unique_id, module_uuid, role_uuid, show_module, view_access, edit_access,
    filter_values, status, created_by_name, module_name, submodule_name, table_name, module_key
) VALUES
(7, uuid_generate_v4(), (SELECT role_uuid FROM user_roles WHERE role_value = 'ADMIN'), 1, 1, 1,
 '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', 'Ramesh', 'Tasks', 'Taskboard', 'latest_task_module_wise', 'TASKS|TASKBOARD|LATEST_TASK_MODULE_WISE'),
(8, uuid_generate_v4(), (SELECT role_uuid FROM user_roles WHERE role_value = 'ADMIN'), 1, 1, 1,
 '{"and": {"user_uuid": ["*"], "branch_uuid": ["*"]}}', 'ACTIVE', 'Ramesh', 'Users', 'Users', 'latest_user', 'USERS|USERS|LATEST_USER');

COMMIT;
