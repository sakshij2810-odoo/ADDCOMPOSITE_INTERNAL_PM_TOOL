import { lazy } from 'react';
import { ComingSoonView } from 'src/components/coming-soon';

// ----------------------------------------------------------------------

const AnalyticsListView = lazy(() => import('./AnalyticsListView'));

export const analyticsRoutes = [
  {
    path: 'analytics',
    children: [
      { element: <AnalyticsListView />, index: true },
      {
        path: 'projects',
        element: (
          <ComingSoonView
            title="Project Analytics"
            description="Project analytics dashboard is coming soon."
          />
        ),
      },
      {
        path: 'resources',
        element: (
          <ComingSoonView
            title="Resource Analytics"
            description="Resource utilization analytics are coming soon."
          />
        ),
      },
      {
        path: 'performance',
        element: (
          <ComingSoonView
            title="Performance Analytics"
            description="Team performance analytics are coming soon."
          />
        ),
      },
      {
        path: 'profitability',
        element: (
          <ComingSoonView
            title="Profitability Analytics"
            description="Project profitability reports are coming soon."
          />
        ),
      },
      {
        path: 'timeline-deviations',
        element: (
          <ComingSoonView
            title="Timeline Deviations"
            description="Timeline deviation analysis is coming soon."
          />
        ),
      },
    ],
  },
];
