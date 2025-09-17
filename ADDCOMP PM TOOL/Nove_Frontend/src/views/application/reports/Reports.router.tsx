import { lazy } from 'react';
import { ComingSoonView } from 'src/components/coming-soon';

// ----------------------------------------------------------------------

const ReportsListView = lazy(() => import('./ReportsListView'));

export const reportsRoutes = [
  {
    path: 'reports',
    children: [
      { element: <ReportsListView />, index: true },
      {
        path: 'export',
        element: (
          <ComingSoonView
            title="Export Reports"
            description="Report export functionality is coming soon."
          />
        ),
      },
    ],
  },
];
