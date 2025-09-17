import { main_app_routes, paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';
import { MODULE_KEYS } from 'src/constants/enums';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  company: icon('ic:company'),
  security: icon('solar:folder-security-bold'),
  projects: icon('ic-folder'),
  resources: icon('ic-user'),
  reports: icon('ic-analytics'),
  admin: icon('ic-lock'),
  mobile: icon('ic-phone'),
};

// ----------------------------------------------------------------------

export interface INavbarMenu {
  subheader: string;
  items: INavbarMenuItem[];
}

export interface INavbarMenuItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
  modules: string[];
  allowFullAccess?: boolean;
  children?: INavbarMenuItem[];
}

export const appNavbarMenuData: INavbarMenu[] = [
  {
    subheader: 'Overview',
    items: [
      {
        title: 'Dashboard',
        path: main_app_routes.root,
        icon: ICONS.dashboard,
        allowFullAccess: true,
        modules: [],
      },
      {
        title: 'Leads',
        path: main_app_routes.app.leads.root,
        icon: ICONS.course,
        modules: [MODULE_KEYS.LEADS],
        // children: [
        //     { title: 'Leads', path: main_app_routes.app.leads.root, modules: [MODULE_KEYS.LEADS] },
        //     // { title: 'Documents', path: main_app_routes.app.leads.docucments, modules: [MODULE_KEYS.LEADS] },
        // ],
      },

      {
        title: 'Customers',
        path: main_app_routes.app.customers,
        icon: ICONS.user,

        modules: [MODULE_KEYS.CUSTOMERS],
      },

      {
        title: 'File Manager',
        path: main_app_routes.app.fileManager,
        icon: ICONS.folder,
        allowFullAccess: true,
        modules: [],
      },

      {
        title: 'Chats',
        path: main_app_routes.app.chats,
        icon: ICONS.chat,
        modules: [MODULE_KEYS.CONVERSATION],
      },
      {
        title: 'Projects',
        path: main_app_routes.app.projects.root,
        icon: ICONS.projects,
        allowFullAccess: true,
        modules: [],
      },
      {
        title: 'Resources',
        path: main_app_routes.app.resources.root,
        icon: ICONS.resources,
        allowFullAccess: true,
        modules: [],
      },
      {
        title: 'Analytics',
        path: main_app_routes.app.analytics.root,
        icon: ICONS.analytics,
        allowFullAccess: true,
        modules: [],
      },
      {
        title: 'Reports',
        path: main_app_routes.app.reports.root,
        icon: ICONS.reports,
        allowFullAccess: true,
        modules: [],
      },
      // {
      //   title: 'Customers',
      //   path: main_app_routes.app.customers,
      //   icon: ICONS.user,
      //   modules: [MODULE_KEYS.CUSTOMERS],
      // },
      // {
      //   title: 'File Manager',
      //   path: main_app_routes.app.fileManager,
      //   icon: ICONS.folder,
      //   modules: [MODULE_KEYS.CUSTOMERS],
      // },
    ],
  },
  {
    subheader: 'Programs/Service Management',
    items: [
      {
        title: 'Services/Document Checklists',
        path: main_app_routes.app.documents_and_services,
        icon: ICONS.course,
        modules: [
          MODULE_KEYS.QUESTIONS,
          MODULE_KEYS.QUESTIONS_OPTIONS,
          MODULE_KEYS.ANSWERS,
          MODULE_KEYS.SERVICE,
        ],
        // children: [
        //     { title: 'Document Checklist', path: main_app_routes.app.questionnaire.root, modules: [MODULE_KEYS.SECURITY] },
        //     // { title: 'Questions', path: main_app_routes.app.questionnaire.questions, modules: [MODULE_KEYS.SECURITY] },
        //     // { title: 'Answers', path: main_app_routes.app.questionnaire.answers, modules: [MODULE_KEYS.SECURITY] },
        //     // { title: 'Question Options', path: main_app_routes.app.questionnaire.questionOptions, modules: [MODULE_KEYS.SECURITY] },
        // ],
      },
      // {
      //     title: 'Services',
      //     path: main_app_routes.app.services,
      //     icon: ICONS.job,
      //     modules: [MODULE_KEYS.COMPANY_INFORMATION]
      // },
      {
        title: 'Programs',
        path: main_app_routes.app.programs.root,
        icon: ICONS.kanban,
        modules: [MODULE_KEYS.NOC_CODES, MODULE_KEYS.CRS_DRAWS, MODULE_KEYS.STUDY_PROGRAM],
      },
      {
        title: 'Tasks',
        path: main_app_routes.app.tasks.root,
        icon: ICONS.course,
        modules: [MODULE_KEYS.TASKBOARD],
        children: [
          {
            title: 'Activities',
            path: main_app_routes.app.tasks.taskActivities,
            allowFullAccess: true,
            modules: [MODULE_KEYS.TASKBOARD],
          },
        ],
      },
      // {
      //     title: 'Branch Office',
      //     path: main_app_routes.app.management.branch,
      //     icon: ICONS.course,
      //     modules: [MODULE_KEYS.BRANCH],
      // },
      // {
      //     title: 'Settings',
      //     path: main_app_routes.app.settings.customerManagement,
      //     icon: ICONS.course,
      //     modules: [MODULE_KEYS.LEADS],
      //     children: [
      //         { title: 'Customer Management', path: main_app_routes.app.settings.customerManagement, modules: [MODULE_KEYS.LEADS] },
      //         // { title: 'Documents', path: main_app_routes.app.leads.docucments, modules: [MODULE_KEYS.LEADS] },
      //     ],
      // },
      // {
      //     title: 'Company',
      //     path: main_app_routes.app.company,
      //     icon: ICONS.banking,
      //     modules: [MODULE_KEYS.COMPANY_INFORMATION]
      // },
      // {
      //     title: 'Users',
      //     path: main_app_routes.app.users,
      //     icon: ICONS.user,
      //     modules: [MODULE_KEYS.USERS]
      // },

      // {
      //     title: 'Security',
      //     path: main_app_routes.app.security.root,
      //     icon: ICONS.lock,
      //     modules: [MODULE_KEYS.SECURITY],
      //     children: [
      //         { title: 'Security', path: main_app_routes.app.security.securityGroups, modules: [MODULE_KEYS.SECURITY] },
      //         { title: 'Role Groups', path: main_app_routes.app.security.roleGroups, modules: [MODULE_KEYS.SECURITY] },
      //         { title: 'Approvals', path: main_app_routes.app.security.approvals, modules: [MODULE_KEYS.SECURITY] },

      //     ],
      // },
    ],
  },
  {
    subheader: 'Company Information',
    items: [
      {
        title: 'Company Info',
        path: main_app_routes.app.company,
        icon: ICONS.banking,
        modules: [MODULE_KEYS.COMPANY_INFORMATION],
      },
      {
        title: 'Branch Office',
        path: main_app_routes.app.management.branch,
        icon: ICONS.course,
        modules: [MODULE_KEYS.BRANCH],
      },
      {
        title: 'Users and staff',
        path: main_app_routes.app.users.root,
        icon: ICONS.user,
        modules: [MODULE_KEYS.USERS],
      },

      {
        title: 'Security',
        path: main_app_routes.app.security.root,
        icon: ICONS.lock,
        modules: [MODULE_KEYS.SECURITY, MODULE_KEYS.ROLE_GROUP],
        children: [
          {
            title: 'Security',
            path: main_app_routes.app.security.securityGroups,
            modules: [MODULE_KEYS.SECURITY],
          },
          {
            title: 'Role Groups',
            path: main_app_routes.app.security.roleGroups,
            modules: [MODULE_KEYS.ROLE_GROUP],
          },
          {
            title: 'Approvals',
            path: main_app_routes.app.security.approvals,
            modules: [MODULE_KEYS.SECURITY],
          },
        ],
      },
      {
        title: 'Settings',
        path: main_app_routes.app.settings.root,
        icon: ICONS.course,
        modules: [
          MODULE_KEYS.SETTING_CUSTOMER_AUTOMATION,
          MODULE_KEYS.SETTING_TEMPLATE,
          MODULE_KEYS.SETTING_AUTOMATION,
        ],
        children: [
          {
            title: 'Customer Management',
            path: main_app_routes.app.settings.customerManagement,
            modules: [MODULE_KEYS.SETTING_CUSTOMER_AUTOMATION],
          },
          // { title: 'Documents', path: main_app_routes.app.leads.docucments, modules: [MODULE_KEYS.LEADS] },
          {
            title: 'Automation',
            path: main_app_routes.app.settings.automation,
            modules: [MODULE_KEYS.SETTING_AUTOMATION],
          },
          {
            title: 'Templates',
            path: main_app_routes.app.settings.templates,
            modules: [MODULE_KEYS.SETTING_CUSTOMER_AUTOMATION],
          },
        ],
      },
    ],
  },
  {
    subheader: 'Administration',
    items: [
      {
        title: 'Admin Panel',
        path: main_app_routes.app.admin.root,
        icon: ICONS.admin,
        allowFullAccess: true,
        modules: [],
      },
      {
        title: 'Mobile SDK',
        path: main_app_routes.app.mobile.root,
        icon: ICONS.mobile,
        allowFullAccess: true,
        modules: [],
      },
    ],
  },
];
