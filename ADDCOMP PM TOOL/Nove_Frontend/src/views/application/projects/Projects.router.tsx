import { lazy } from 'react';
import { ComingSoonView } from 'src/components/coming-soon';

// ----------------------------------------------------------------------

const ProjectsListView = lazy(() => import('./ProjectsListView'));
const ProjectCreateView = lazy(() => import('./ProjectCreateView'));
const ProjectDetailView = lazy(() => import('./ProjectDetailView'));
const ProjectEditView = lazy(() => import('./ProjectEditView'));

export const projectsRoutes = [
  {
    path: 'projects',
    children: [
      { element: <ProjectsListView />, index: true },
      { path: 'create', element: <ProjectCreateView /> },
      { path: ':id', element: <ProjectDetailView /> },
      { path: ':id/edit', element: <ProjectEditView /> },
      {
        path: ':id/tasks',
        element: (
          <ComingSoonView
            title="Project Tasks"
            description="Project tasks management is coming soon."
          />
        ),
      },
      {
        path: ':id/gantt',
        element: (
          <ComingSoonView
            title="Gantt Chart"
            description="Interactive Gantt chart view is coming soon."
          />
        ),
      },
      {
        path: ':id/resources',
        element: (
          <ComingSoonView
            title="Resource Allocation"
            description="Resource allocation management is coming soon."
          />
        ),
      },
      {
        path: ':id/timeline',
        element: (
          <ComingSoonView
            title="Project Timeline"
            description="Project timeline view is coming soon."
          />
        ),
      },
      {
        path: ':id/analytics',
        element: (
          <ComingSoonView
            title="Project Analytics"
            description="Project analytics dashboard is coming soon."
          />
        ),
      },
      {
        path: ':id/settings',
        element: (
          <ComingSoonView
            title="Project Settings"
            description="Project settings management is coming soon."
          />
        ),
      },
      {
        path: ':id/archive',
        element: (
          <ComingSoonView
            title="Archive Project"
            description="Project archiving functionality is coming soon."
          />
        ),
      },
    ],
  },
];
