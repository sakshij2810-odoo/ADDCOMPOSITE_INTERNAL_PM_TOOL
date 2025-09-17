import { lazy } from 'react';
import { main_app_routes } from 'src/routes/paths';

const SingleUserProfileWithTabs = lazy(() => import('./views/SingleUserProfileWithTabs'));
const UserProfilesTable = lazy(() => import('./views/UserProfilesTable'));

export const userProfilesRoutes = [
  { path: main_app_routes.app.users.root, element: <UserProfilesTable /> },
  { path: `${main_app_routes.app.users.root}/manage`, element: <SingleUserProfileWithTabs /> },
  {
    path: `${main_app_routes.app.users.root}/manage/:uuid`,
    element: <SingleUserProfileWithTabs />,
  },
];
