import { lazy } from 'react';
import { ComingSoonView } from 'src/components/coming-soon';

// ----------------------------------------------------------------------

const AdminListView = lazy(() => import('./AdminListView'));

export const adminRoutes = [
  {
    path: 'admin',
    children: [
      { element: <AdminListView />, index: true },
      {
        path: 'users',
        element: (
          <ComingSoonView
            title="Admin User Management"
            description="Advanced user management for administrators is coming soon."
          />
        ),
      },
      {
        path: 'projects',
        element: (
          <ComingSoonView
            title="Admin Project Oversight"
            description="Project oversight and management tools are coming soon."
          />
        ),
      },
      {
        path: 'system',
        element: (
          <ComingSoonView
            title="System Configuration"
            description="System configuration and settings are coming soon."
          />
        ),
      },
      {
        path: 'security',
        element: (
          <ComingSoonView
            title="Security Management"
            description="Advanced security management tools are coming soon."
          />
        ),
      },
      {
        path: 'audit',
        element: (
          <ComingSoonView
            title="Audit Logs"
            description="System audit logs and monitoring are coming soon."
          />
        ),
      },
      {
        path: 'backups',
        element: (
          <ComingSoonView
            title="Backup Management"
            description="Data backup and recovery management is coming soon."
          />
        ),
      },
      {
        path: 'monitoring',
        element: (
          <ComingSoonView
            title="System Monitoring"
            description="Real-time system monitoring dashboard is coming soon."
          />
        ),
      },
      {
        path: 'data',
        children: [
          {
            element: (
              <ComingSoonView
                title="Data Management"
                description="Data management overview is coming soon."
              />
            ),
            index: true,
          },
          {
            path: 'export',
            element: (
              <ComingSoonView
                title="Data Export"
                description="Data export functionality is coming soon."
              />
            ),
          },
          {
            path: 'import',
            element: (
              <ComingSoonView
                title="Data Import"
                description="Data import functionality is coming soon."
              />
            ),
          },
          {
            path: 'cleanup',
            element: (
              <ComingSoonView
                title="Data Cleanup"
                description="Data cleanup tools are coming soon."
              />
            ),
          },
          {
            path: 'analytics',
            element: (
              <ComingSoonView
                title="Data Analytics"
                description="Data analytics dashboard is coming soon."
              />
            ),
          },
        ],
      },
    ],
  },
];
