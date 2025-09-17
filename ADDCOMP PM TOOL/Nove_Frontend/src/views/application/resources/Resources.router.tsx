import { lazy } from 'react';
import { ComingSoonView } from 'src/components/coming-soon';

// ----------------------------------------------------------------------

const ResourcesListView = lazy(() => import('./ResourcesListView'));

export const resourcesRoutes = [
  {
    path: 'resources',
    children: [
      { element: <ResourcesListView />, index: true },
      {
        path: 'availability',
        element: (
          <ComingSoonView
            title="Resource Availability"
            description="Resource availability calendar is coming soon."
          />
        ),
      },
      {
        path: 'allocations',
        element: (
          <ComingSoonView
            title="Resource Allocations"
            description="Resource allocation matrix is coming soon."
          />
        ),
      },
      {
        path: 'conflicts',
        element: (
          <ComingSoonView
            title="Resource Conflicts"
            description="Resource conflict resolution is coming soon."
          />
        ),
      },
      {
        path: 'planning',
        element: (
          <ComingSoonView
            title="Resource Planning"
            description="Resource planning view is coming soon."
          />
        ),
      },
      {
        path: 'reports',
        element: (
          <ComingSoonView
            title="Resource Reports"
            description="Resource utilization reports are coming soon."
          />
        ),
      },
    ],
  },
];
