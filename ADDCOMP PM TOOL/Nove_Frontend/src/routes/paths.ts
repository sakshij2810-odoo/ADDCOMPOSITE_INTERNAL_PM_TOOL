import { paramCase } from 'src/utils/change-case';
import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '',
  MAIN: '',
  PUBLIC: '/public',
  ERROR: '/error',
};

// ----------------------------------------------------------------------

export const main_app_routes = {
  root: `${ROOTS.MAIN}`,
  auth: {
    signIn: `${ROOTS.AUTH}/sign-in`,
    signUp: `${ROOTS.AUTH}/sign-up`,
    logout: `${ROOTS.AUTH}/logout`,
    forbidden: `${ROOTS.AUTH}/forbidden`,
    sessionExpired: `${ROOTS.AUTH}/session-expired`,
  },
  app: {
    // Dashboard routes
    dashboard: {
      root: `${ROOTS.MAIN}/dashboard`,
      overview: `${ROOTS.MAIN}/dashboard/overview`,
      analytics: `${ROOTS.MAIN}/dashboard/analytics`,
      notifications: `${ROOTS.MAIN}/dashboard/notifications`,
    },
    // Project Management routes
    projects: {
      root: `${ROOTS.MAIN}/projects`,
      create: `${ROOTS.MAIN}/projects/create`,
      detail: `${ROOTS.MAIN}/projects/:id`,
      edit: `${ROOTS.MAIN}/projects/:id/edit`,
      tasks: `${ROOTS.MAIN}/projects/:id/tasks`,
      gantt: `${ROOTS.MAIN}/projects/:id/gantt`,
      resources: `${ROOTS.MAIN}/projects/:id/resources`,
      timeline: `${ROOTS.MAIN}/projects/:id/timeline`,
      analytics: `${ROOTS.MAIN}/projects/:id/analytics`,
      settings: `${ROOTS.MAIN}/projects/:id/settings`,
      archive: `${ROOTS.MAIN}/projects/:id/archive`,
    },
    // Task Management routes
    tasks: {
      root: `${ROOTS.MAIN}/tasks`,
      create: `${ROOTS.MAIN}/tasks/create`,
      detail: `${ROOTS.MAIN}/tasks/:id`,
      edit: `${ROOTS.MAIN}/tasks/:id/edit`,
      board: `${ROOTS.MAIN}/tasks/board`,
      calendar: `${ROOTS.MAIN}/tasks/calendar`,
      templates: `${ROOTS.MAIN}/tasks/templates`,
      bulkEdit: `${ROOTS.MAIN}/tasks/bulk-edit`,
      taskActivities: `${ROOTS.MAIN}/tasks/task-activities`,
      management: `${ROOTS.MAIN}/tasks/management`,
    },
    // Resource Management routes
    resources: {
      root: `${ROOTS.MAIN}/resources`,
      availability: `${ROOTS.MAIN}/resources/availability`,
      allocations: `${ROOTS.MAIN}/resources/allocations`,
      conflicts: `${ROOTS.MAIN}/resources/conflicts`,
      planning: `${ROOTS.MAIN}/resources/planning`,
      reports: `${ROOTS.MAIN}/resources/reports`,
    },
    // User Management routes
    users: {
      root: `${ROOTS.MAIN}/users`,
      detail: `${ROOTS.MAIN}/users/:id`,
      edit: `${ROOTS.MAIN}/users/:id/edit`,
      tasks: `${ROOTS.MAIN}/users/:id/tasks`,
      timeEntries: `${ROOTS.MAIN}/users/:id/time-entries`,
      availability: `${ROOTS.MAIN}/users/:id/availability`,
      invite: `${ROOTS.MAIN}/users/invite`,
    },
    // Analytics & Reporting routes
    analytics: {
      root: `${ROOTS.MAIN}/analytics`,
      projects: `${ROOTS.MAIN}/analytics/projects`,
      resources: `${ROOTS.MAIN}/analytics/resources`,
      performance: `${ROOTS.MAIN}/analytics/performance`,
      profitability: `${ROOTS.MAIN}/analytics/profitability`,
      timelineDeviations: `${ROOTS.MAIN}/analytics/timeline-deviations`,
    },
    reports: {
      root: `${ROOTS.MAIN}/reports`,
      export: `${ROOTS.MAIN}/reports/export`,
    },
    // Settings & Configuration routes
    settings: {
      root: `${ROOTS.MAIN}/settings`,
      profile: `${ROOTS.MAIN}/settings/profile`,
      notifications: `${ROOTS.MAIN}/settings/notifications`,
      integrations: `${ROOTS.MAIN}/settings/integrations`,
      security: `${ROOTS.MAIN}/settings/security`,
      team: `${ROOTS.MAIN}/settings/team`,
      system: `${ROOTS.MAIN}/settings/system`,
      customerManagement: `${ROOTS.MAIN}/settings/customer-management`,
      automation: `${ROOTS.MAIN}/settings/automation`,
      templates: `${ROOTS.MAIN}/settings/templates`,
    },
    // Admin Panel routes
    admin: {
      root: `${ROOTS.MAIN}/admin`,
      users: `${ROOTS.MAIN}/admin/users`,
      projects: `${ROOTS.MAIN}/admin/projects`,
      system: `${ROOTS.MAIN}/admin/system`,
      security: `${ROOTS.MAIN}/admin/security`,
      audit: `${ROOTS.MAIN}/admin/audit`,
      backups: `${ROOTS.MAIN}/admin/backups`,
      monitoring: `${ROOTS.MAIN}/admin/monitoring`,
      data: {
        root: `${ROOTS.MAIN}/admin/data`,
        export: `${ROOTS.MAIN}/admin/data/export`,
        import: `${ROOTS.MAIN}/admin/data/import`,
        cleanup: `${ROOTS.MAIN}/admin/data/cleanup`,
        analytics: `${ROOTS.MAIN}/admin/data/analytics`,
      },
    },
    // Mobile routes
    mobile: {
      root: `${ROOTS.MAIN}/mobile`,
      tasks: {
        root: `${ROOTS.MAIN}/mobile/tasks`,
        detail: `${ROOTS.MAIN}/mobile/tasks/:id`,
        today: `${ROOTS.MAIN}/mobile/tasks/today`,
        upcoming: `${ROOTS.MAIN}/mobile/tasks/upcoming`,
        completed: `${ROOTS.MAIN}/mobile/tasks/completed`,
        timer: `${ROOTS.MAIN}/mobile/tasks/:id/timer`,
        notes: `${ROOTS.MAIN}/mobile/tasks/:id/notes`,
        reallocate: `${ROOTS.MAIN}/mobile/tasks/reallocate`,
      },
      calendar: `${ROOTS.MAIN}/mobile/calendar`,
      profile: `${ROOTS.MAIN}/mobile/profile`,
      settings: `${ROOTS.MAIN}/mobile/settings`,
      google: {
        drive: {
          root: `${ROOTS.MAIN}/mobile/google/drive`,
          folder: `${ROOTS.MAIN}/mobile/google/drive/:folderId`,
        },
        calendar: `${ROOTS.MAIN}/mobile/google/calendar`,
        chat: `${ROOTS.MAIN}/mobile/google/chat`,
        meet: `${ROOTS.MAIN}/mobile/google/meet`,
      },
    },
    // Existing routes (keeping for backward compatibility)
    leads: {
      root: `${ROOTS.MAIN}/leads`,
      // docucments: `${ROOTS.MAIN}/leads/documents`
    },
    chats: `${ROOTS.MAIN}/chats`,
    documents_and_services: `${ROOTS.MAIN}/documnets-and-services`,
    programs: {
      root: `${ROOTS.MAIN}/programs`,
      crsDraws: `${ROOTS.MAIN}/programs/crs-drwas`,
      nocCodes: `${ROOTS.MAIN}/programs/noc-codes`,
      studyProgram: `${ROOTS.MAIN}/programs/study-program`,
    },
    company: `${ROOTS.MAIN}/company`,
    fileManager: `${ROOTS.MAIN}/file-manager`,
    customers: `${ROOTS.MAIN}/customers`,
    services: `${ROOTS.MAIN}/services`,
    security: {
      root: `${ROOTS.MAIN}/security`,
      securityGroups: `${ROOTS.MAIN}/security/security-groups`,
      securityGroupsDuplicate: `${ROOTS.MAIN}/security/security-groups-duplicate`,
      approvals: `${ROOTS.MAIN}/security/approvals`,
      roleGroups: `${ROOTS.MAIN}/security/role-groups`,
    },
    questionnaire: {
      root: `${ROOTS.MAIN}/questionnaire`,
      groupedChecklist: `${ROOTS.MAIN}/questionnaire/documents`,
      // questions: `${ROOTS.MAIN}/questionnaire/questions`,
      // answers: `${ROOTS.MAIN}/questionnaire/answers`,
      // questionOptions: `${ROOTS.MAIN}/questionnaire/question-options`,
    },
    management: {
      branch: `${ROOTS.MAIN}/management/branch-management`,
    },
  },
  public: {
    leads: `${ROOTS.PUBLIC}/leads`,
  },
  errors: {
    error403: `${ROOTS.ERROR}/403`,
    error404: `${ROOTS.ERROR}/404`,
    error500: `${ROOTS.ERROR}/500`,
  },
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneStore: 'https://mui.com/store/items/zone-landing-page/',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figmaUrl: 'https://www.figma.com/design/cAPz4pYPtQEXivqe11EcDE/%5BPreview%5D-Minimal-Web.v6.0.0',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id: string) => `/product/${id}`,
    demo: { details: `/product/${MOCK_ID}` },
  },
  post: {
    root: `/post`,
    details: (title: string) => `/post/${paramCase(title)}`,
    demo: { details: `/post/${paramCase(MOCK_TITLE)}` },
  },
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
      forgotPassword: `${ROOTS.AUTH}/jwt/forgot-password`,
      resetPassword: `${ROOTS.AUTH}/jwt/reset-password`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  authDemo: {
    split: {
      signIn: `${ROOTS.AUTH_DEMO}/split/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/split/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/split/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/split/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/split/verify`,
    },
    centered: {
      signIn: `${ROOTS.AUTH_DEMO}/centered/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/centered/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/centered/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/centered/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/centered/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    app: {
      // Project Management routes
      projects: {
        root: `${ROOTS.MAIN}/projects`,
        create: `${ROOTS.MAIN}/projects/create`,
        detail: `${ROOTS.MAIN}/projects/:id`,
        edit: `${ROOTS.MAIN}/projects/:id/edit`,
        tasks: `${ROOTS.MAIN}/projects/:id/tasks`,
        gantt: `${ROOTS.MAIN}/projects/:id/gantt`,
        resources: `${ROOTS.MAIN}/projects/:id/resources`,
        timeline: `${ROOTS.MAIN}/projects/:id/timeline`,
        analytics: `${ROOTS.MAIN}/projects/:id/analytics`,
        settings: `${ROOTS.MAIN}/projects/:id/settings`,
        archive: `${ROOTS.MAIN}/projects/:id/archive`,
      },
      // Task Management routes
      tasks: {
        root: `${ROOTS.MAIN}/tasks`,
        create: `${ROOTS.MAIN}/tasks/create`,
        detail: `${ROOTS.MAIN}/tasks/:id`,
        edit: `${ROOTS.MAIN}/tasks/:id/edit`,
        board: `${ROOTS.MAIN}/tasks/board`,
        calendar: `${ROOTS.MAIN}/tasks/calendar`,
        templates: `${ROOTS.MAIN}/tasks/templates`,
        bulkEdit: `${ROOTS.MAIN}/tasks/bulk-edit`,
        taskActivities: `${ROOTS.MAIN}/tasks/task-activities`,
        management: `${ROOTS.MAIN}/tasks/management`,
      },
      // Resource Management routes
      resources: {
        root: `${ROOTS.MAIN}/resources`,
        availability: `${ROOTS.MAIN}/resources/availability`,
        allocations: `${ROOTS.MAIN}/resources/allocations`,
        conflicts: `${ROOTS.MAIN}/resources/conflicts`,
        planning: `${ROOTS.MAIN}/resources/planning`,
        reports: `${ROOTS.MAIN}/resources/reports`,
      },
      // Analytics & Reporting routes
      analytics: {
        root: `${ROOTS.MAIN}/analytics`,
        projects: `${ROOTS.MAIN}/analytics/projects`,
        resources: `${ROOTS.MAIN}/analytics/resources`,
        performance: `${ROOTS.MAIN}/analytics/performance`,
        profitability: `${ROOTS.MAIN}/analytics/profitability`,
        timelineDeviations: `${ROOTS.MAIN}/analytics/timeline-deviations`,
      },
      reports: {
        root: `${ROOTS.MAIN}/reports`,
        export: `${ROOTS.MAIN}/reports/export`,
      },
      // Admin Panel routes
      admin: {
        root: `${ROOTS.MAIN}/admin`,
        users: `${ROOTS.MAIN}/admin/users`,
        projects: `${ROOTS.MAIN}/admin/projects`,
        system: `${ROOTS.MAIN}/admin/system`,
        security: `${ROOTS.MAIN}/admin/security`,
        audit: `${ROOTS.MAIN}/admin/audit`,
        backups: `${ROOTS.MAIN}/admin/backups`,
        monitoring: `${ROOTS.MAIN}/admin/monitoring`,
        data: {
          root: `${ROOTS.MAIN}/admin/data`,
          export: `${ROOTS.MAIN}/admin/data/export`,
          import: `${ROOTS.MAIN}/admin/data/import`,
          cleanup: `${ROOTS.MAIN}/admin/data/cleanup`,
          analytics: `${ROOTS.MAIN}/admin/data/analytics`,
        },
      },
      // Mobile routes
      mobile: {
        root: `${ROOTS.MAIN}/mobile`,
        tasks: {
          root: `${ROOTS.MAIN}/mobile/tasks`,
          detail: `${ROOTS.MAIN}/mobile/tasks/:id`,
          today: `${ROOTS.MAIN}/mobile/tasks/today`,
          upcoming: `${ROOTS.MAIN}/mobile/tasks/upcoming`,
          completed: `${ROOTS.MAIN}/mobile/tasks/completed`,
          timer: `${ROOTS.MAIN}/mobile/tasks/:id/timer`,
          notes: `${ROOTS.MAIN}/mobile/tasks/:id/notes`,
          reallocate: `${ROOTS.MAIN}/mobile/tasks/reallocate`,
        },
        calendar: `${ROOTS.MAIN}/mobile/calendar`,
        profile: `${ROOTS.MAIN}/mobile/profile`,
        settings: `${ROOTS.MAIN}/mobile/settings`,
        google: {
          drive: {
            root: `${ROOTS.MAIN}/mobile/google/drive`,
            folder: `${ROOTS.MAIN}/mobile/google/drive/:folderId`,
          },
          calendar: `${ROOTS.MAIN}/mobile/google/calendar`,
          chat: `${ROOTS.MAIN}/mobile/google/chat`,
          meet: `${ROOTS.MAIN}/mobile/google/meet`,
        },
      },
    },
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
      course: `${ROOTS.DASHBOARD}/course`,
      leads: `${ROOTS.DASHBOARD}/leads`,
      company: `${ROOTS.DASHBOARD}/company`,
    },
    leads: {
      leads: `${ROOTS.DASHBOARD}/leads`,
      crsDraws: `${ROOTS.DASHBOARD}/leads/crs-drwas`,
      nocCodes: `${ROOTS.DASHBOARD}/leads/noc-codes`,
      studyProgram: `${ROOTS.DASHBOARD}/leads/study-program`,
    },
    programs: {
      programs: `${ROOTS.DASHBOARD}/programs`,
      crsDraws: `${ROOTS.DASHBOARD}/programs/crs-drwas`,
      nocCodes: `${ROOTS.DASHBOARD}/programs/noc-codes`,
      studyProgram: `${ROOTS.DASHBOARD}/programs/study-program`,
    },
    users: `${ROOTS.DASHBOARD}/users`,
    customers: `${ROOTS.DASHBOARD}/customers`,
    security: {
      root: `${ROOTS.DASHBOARD}/security`,
      securityGroups: `${ROOTS.DASHBOARD}/security/security-groups`,
      securityGroupsDuplicate: `${ROOTS.DASHBOARD}/security/security-groups-duplicate`,
      approvals: `${ROOTS.DASHBOARD}/security/approvals`,
      roleGroups: `${ROOTS.DASHBOARD}/security/role-groups`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title: string) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title: string) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id: string) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      },
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    },
  },
};
