import { lazy } from 'react';
import { ComingSoonView } from 'src/components/coming-soon';

// ----------------------------------------------------------------------

const MobileListView = lazy(() => import('./MobileListView'));

export const mobileRoutes = [
  {
    path: 'mobile',
    children: [
      { element: <MobileListView />, index: true },
      {
        path: 'tasks',
        children: [
          {
            element: (
              <ComingSoonView
                title="Mobile Tasks"
                description="Mobile task management is coming soon."
              />
            ),
            index: true,
          },
          {
            path: ':id',
            element: (
              <ComingSoonView
                title="Task Detail"
                description="Mobile task detail view is coming soon."
              />
            ),
          },
          {
            path: 'today',
            element: (
              <ComingSoonView
                title="Today's Tasks"
                description="Today's tasks view is coming soon."
              />
            ),
          },
          {
            path: 'upcoming',
            element: (
              <ComingSoonView
                title="Upcoming Tasks"
                description="Upcoming tasks view is coming soon."
              />
            ),
          },
          {
            path: 'completed',
            element: (
              <ComingSoonView
                title="Completed Tasks"
                description="Completed tasks view is coming soon."
              />
            ),
          },
          {
            path: ':id/timer',
            element: (
              <ComingSoonView
                title="Task Timer"
                description="Task timer functionality is coming soon."
              />
            ),
          },
          {
            path: ':id/notes',
            element: (
              <ComingSoonView
                title="Task Notes"
                description="Task notes functionality is coming soon."
              />
            ),
          },
          {
            path: 'reallocate',
            element: (
              <ComingSoonView
                title="Request Reallocation"
                description="Task reallocation request is coming soon."
              />
            ),
          },
        ],
      },
      {
        path: 'calendar',
        element: (
          <ComingSoonView
            title="Mobile Calendar"
            description="Mobile calendar integration is coming soon."
          />
        ),
      },
      {
        path: 'profile',
        element: (
          <ComingSoonView
            title="Mobile Profile"
            description="Mobile profile management is coming soon."
          />
        ),
      },
      {
        path: 'settings',
        element: (
          <ComingSoonView
            title="Mobile Settings"
            description="Mobile app settings are coming soon."
          />
        ),
      },
      {
        path: 'google',
        children: [
          {
            path: 'drive',
            children: [
              {
                element: (
                  <ComingSoonView
                    title="Google Drive"
                    description="Google Drive integration is coming soon."
                  />
                ),
                index: true,
              },
              {
                path: ':folderId',
                element: (
                  <ComingSoonView
                    title="Drive Folder"
                    description="Google Drive folder view is coming soon."
                  />
                ),
              },
            ],
          },
          {
            path: 'calendar',
            element: (
              <ComingSoonView
                title="Google Calendar"
                description="Google Calendar integration is coming soon."
              />
            ),
          },
          {
            path: 'chat',
            element: (
              <ComingSoonView
                title="Google Chat"
                description="Google Chat integration is coming soon."
              />
            ),
          },
          {
            path: 'meet',
            element: (
              <ComingSoonView
                title="Google Meet"
                description="Google Meet integration is coming soon."
              />
            ),
          },
        ],
      },
    ],
  },
];
