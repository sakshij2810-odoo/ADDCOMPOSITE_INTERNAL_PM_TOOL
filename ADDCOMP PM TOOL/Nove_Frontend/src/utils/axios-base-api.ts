import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

// eslint-disable-next-line import/no-cycle
import { clearUserSession } from 'src/auth/context/jwt';

// Private Api ----------------------------------------------------------------------

export const axios_public_api = axios.create({ baseURL: CONFIG.serverBaseUrl });

// Private Api ----------------------------------------------------------------------

const axios_base_api = axios.create({ baseURL: CONFIG.serverBaseUrl });

axios_base_api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearUserSession();
      window.location.href = paths.auth.jwt.signIn;
    }
    return Promise.reject((error.response && error.response.data) || 'Something went wrong!');
  }
);

export const fetcherV2 = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axios_base_api.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

export default axios_base_api;

// ----------------------------------------------------------------------

export const server_base_endpoints = {
  analytics: {
    get_analytics: '/analytics/get-analytics',
  },
  general: {
    upload_files: '/general/upload-files',

    file_explorer: '/general/file-explorer',
    file_move: '/general/file-move',
    file_rename_folder: '/general/file-rename-folder',
    file_rename: '/general/file-rename',
    get_record_counts: '/general/get-record-counts',
    download_files: '/general/download-files',
    get_country_state: '/general/get-country-state',
    get_table_or_column_name: '/general/get-table-or-column-name',
    get_process: '/general/get-process',
  },
  auth: {
    sign_in: '/authentication/login',
    sign_up: '/authentication/signup',
    validate_otp: '/authentication/validate-otp-get-token',
    forget_password: '/authentication/forgot-password',
    reset_password: '/authentication/reset-password',
  },
  users: {
    get_users: '/user/get-user',
    upsert_profile: '/user/update-profile',
    create_new_user: '/user/upsert-user',
  },
  approvals: {
    get_approvals_count: '/approval/get-approval-count',
    upsert_approvals_count: '/approval/insert-approval-count',
  },
  leads: {
    leads: {
      upsert_public_leads: '/lead/upsert-lead',
      upsert_private_leads: '/lead/auth-upsert-lead',
      get_private_leads: '/lead/get-leads',
      get_private_lead_suggestions: '/lead/lead-suggestion',
      get_private_lead_reports: '/lead/lead-reports',
      sign_document: '/lead/sign-document',
      signature_history: '/lead/signature-history',
      generate_signed_document: '/lead/generate-signed-document',
      get_retainer_agreement: '/lead/get-retainer',
      upsert_retainer_agreement: '/lead/retainer',
      regenerate_ai_report_summary: '/lead/fetch-graphs-from-lead-data',
      get_ai_report_summary: '/lead/get-lead-graph-data',
      extract_lead_with_genai: '/lead/extract-lead-with-genai',
    },
    crs_draws: {
      upsert_crs_draws: '/lead/edit-crs_draws',
      get_crs_draws: '/lead/get-crs_draws',
    },
    noc_codes: {
      upsert_noc_codes: '/lead/edit-noc_codes',
      get_noc_codes: '/lead/get-noc_codes',
    },
    study_program: {
      upsert_study_programs: '/lead/edit-study',
      get_study_programs: '/lead/get-study',
    },
  },
  history: {
    get_history: '/history/get-history',
  },
  comments: {
    upsert_commnet: '/comment/upsert-comment',
    get_commnet: '/comment/get-comment',
  },
  configurations: {
    company: {
      upsert_company_private_info: '/companyInformation/upsert-company-information',
      get_company_private_info: '/companyInformation/get-company-information',
      get_public_company_information: '/companyInformation/get-public-company-information',
    },
  },
  security: {
    get_roles: '/security/get-user-roles',
    upsert_roles: '/security/upsert-roles',
    get_role_groups: '/security/get-role-group',
    upsert_role_group: '/security/upsert-role-group',
    upsert_rmcap: '/security/upsert-role-module-content-access-permission',
  },
  questionnaire: {
    upsert_questionnaire: '/questionnaire/upsert-questionnaire',
    duplicate_questionnaire: '/questionnaire/duplicate-questionnaire',

    get_questionnaire: '/questionnaire/get-questionnaire',
    upsert_question: '/questionnaire/upsert-question',
    get_question: '/questionnaire/get-question',
    upsert_answer: '/questionnaire/upsert-answer',
    get_answer: '/questionnaire/get-answer',
    upsert_questions_options: '/questionnaire/upsert-questions-options',
    get_questions_options: '/questionnaire/get-questions-options',
    get_question_with_answer: '/questionnaire/get-question-answer',
  },
  services: {
    get_public_service: '/services/get-services-public',
    get_service: '/services/get-services',
    upsert_service: '/services/create-services',
  },
  customers: {
    upsert_customer: '/customer/upsert-customer',
    get_customers: '/customer/get-customer',
    upsert_customer_service: '/customer/upsert-customer-service',
    get_customer_services: '/customer/get-customer-service',
    upsert_customer_automation: '/customer/upsert-customer-automation',
    get_customer_automation: '/customer/get-customer-automation',
    upsert_customer_invoice: '/customer/upsert-customer-invoice',
    get_customer_invoice: '/customer/get-customer-invoice',
  },
  data_management: {
    upsert_branch: '/dataManagement/upsert-branch',
    get_branch: '/dataManagement/get-branch',
  },
  conversations: {
    get_conversation: '/conversation/get-conversation',
    upsert_messages: '/conversation/upsert-messages',
    get_messages: '/conversation/get-messages',
  },
  workflow: {
    get_apis_endpoints: '/workflow/get-apis-endpoints',
    get_workflow_basic: '/workflow/get-workflow-basic',
    upsert_workflow_action_email: '/workflow/upsert-workflow-action-email',
    upsert_workflow_action: '/workflow/upsert-workflow-action',
    upsert_workflow_condition: '/workflow/upsert-workflow-condition',
    upsert_workflow_basic: '/workflow/upsert-workflow-basic',
    upsert_workflow_all_definition: '/workflow/get-workflow-all-definition',
  },
  tasks: {
    upsert_task_module_wise: '/tasks/create-task-module-wise',
    get_task_module_wise: '/tasks/get-task-module-wise',
  },
  projects: {
    upsert_project: '/project',
    get_projects: '/project',
  },
  template: {
    get_templates: '/template/get-templates',
    edit_template: '/template/edit-template',
    render_template: '/template/render-template',
    get_sql_view_or_columns: '/template/get-sql-view-or-columns',
    upsert_sql_view_or_columns: '/template/upsert-sql-view-or-columns',
    create_document_template: '/template/create-document-template',
    get_document_template: '/template/get-document-template',
  },
};

export const consoleAxiosErrors = (error: Error) => {
  if (axios.isAxiosError(error)) {
    console.error('Axios error occurred:', error.message);
    if (error.response) {
      console.error('Axios error Response status:', error.response.status);
      console.error('Axios error Response data:', error.response.data);
    } else if (error.request) {
      console.error('Axios error No response received:', error.request);
    } else {
      console.error('Axios error Request configuration error:', error.message);
    }
  } else {
    console.error('Non-Axios error occurred:', error);
  }
};

export const axios_Loading_messages = {
  save: 'Saving your changes...!',
  save_success: 'Data Saved Successfully...!',
  save_error: 'Error occurred while saving changes...!',
  upload: 'Uploading files...!',
};
