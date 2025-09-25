import axios, { AxiosError } from 'axios';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

// eslint-disable-next-line import/no-cycle
import { clearUserSession } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

const calendly_base_api = axios.create({
  baseURL: CONFIG.calendlyBaseUrl,
  headers: {
    Authorization: `Bearer ${CONFIG.calendlyAuthToken}`, // Example: Auth token
    'Content-Type': 'application/json',
  },
});

calendly_base_api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearUserSession();
      window.location.href = paths.auth.jwt.signIn;
    }
    return Promise.reject((error.response && error.response.data) || 'Something went wrong!');
  }
);

export default calendly_base_api;

// ----------------------------------------------------------------------

export const server_base_endpoints = {
  general: {
    upload_files: '/general/upload-files',

    file_explorer: '/general/file-explorer',
    file_move: '/general/file-move',
    file_rename_folder: '/general/file-rename-folder',
    file_rename: '/general/file-rename',
    get_record_counts: '/general/get-record-counts',
    download_files: '/general/download-files',
  },
  auth: {
    sign_in: '/authentication/login',
    sign_up: '/authentication/sign-up',
    validate_otp: '/authentication/validate-otp-get-token',
    forget_password: '/authentication/forget-password',
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
    },
  },
  security: {
    get_roles: '/security/get-roles',
    upsert_roles: '/security/upsert-roles',
    get_role_groups: '/security/get-role-group',
    upsert_role_group: '/security/upsert-role-group',
    upsert_rmcap: '/security/upsert-role-module-content-access-permission',
  },
  questionnaire: {
    upsert_questionnaire: '/questionnaire/upsert-questionnaire',
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
    get_service: '/services/get-services',
    upsert_service: '/services/create-services',
  },
  customers: {
    upsert_customer: '/customer/upsert-customer',
    get_customers: '/customer/get-customer',
    upsert_customer_service: '/customer/upsert-customer-service',
    get_customer_services: '/customer/get-customer-service',
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
