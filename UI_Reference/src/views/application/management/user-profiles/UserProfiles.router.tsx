import { lazy } from 'react';
import { main_app_routes } from 'src/routes/paths';



const SingleUserProfileWithTabs = lazy(() => import('./views/SingleUserProfileWithTabs'));
const UserProfilesTable = lazy(() => import('./views/UserProfilesTable'));

export const userProfilesRoutes = [
    { path: main_app_routes.app.users, element: <UserProfilesTable /> },
    { path: `${main_app_routes.app.users}/manage`, element: <SingleUserProfileWithTabs /> },
    { path: `${main_app_routes.app.users}/manage/:uuid`, element: <SingleUserProfileWithTabs /> },
]