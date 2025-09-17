import { lazy, Suspense } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import { CONFIG } from 'src/config-global';

import { authRoutes } from './auth';
import { authDemoRoutes } from './auth-demo';
import { dashboardRoutes } from './dashboard';
import { DashboardLayout } from 'src/layouts/dashboard';
import { AuthGuard } from 'src/auth/guard';
import { LoadingScreen } from 'src/components/loading-screen';
import { leadsRoutes } from 'src/views/application/leads';
import { configurationRoutes } from 'src/views/application/configuration';
import { managementRoutes } from 'src/views/application/management';
import { componentsRoute } from 'src/views/components/AppComponents.router';
import { filemanagerRoute } from 'src/views/application/file-manager/FileManager.router';
import { settingsRoutes } from 'src/views/application/settings';
import { dataManagementRoutes } from 'src/views/application/data-management';
import { publicNavRoutes } from './public-routes';
import { chatsRoutes } from 'src/views/application/chats';
import { tasksRoutes } from 'src/views/application/tasks';
import { projectsRoutes } from 'src/views/application/projects';
import { resourcesRoutes } from 'src/views/application/resources';
import { analyticsRoutes } from 'src/views/application/analytics';
import { reportsRoutes } from 'src/views/application/reports';
import { adminRoutes } from 'src/views/application/admin';
import { mobileRoutes } from 'src/views/application/mobile';
import { main_app_routes } from '../paths';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard'));
// const HomePage = lazy(() => import('src/pages/home'));
const Page500 = lazy(() => import('src/pages/error/500'));
const Page403 = lazy(() => import('src/pages/error/403'));
const Page404 = lazy(() => import('src/pages/error/404'));

const appLayoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export function Router() {
  return useRoutes([
    {
      path: '/',
      element: CONFIG.auth.skip ? (
        <>{appLayoutContent}</>
      ) : (
        <AuthGuard>{appLayoutContent}</AuthGuard>
      ),
      children: [{ element: <IndexPage />, index: true }, ...leadsRoutes]
        .concat(configurationRoutes)
        .concat(managementRoutes)
        .concat(componentsRoute)
        .concat(filemanagerRoute)
        .concat(settingsRoutes)
        .concat(dataManagementRoutes)
        .concat(chatsRoutes)
        .concat(tasksRoutes)
        .concat(projectsRoutes)
        .concat(resourcesRoutes)
        .concat(analyticsRoutes)
        .concat(reportsRoutes)
        .concat(adminRoutes)
        .concat(mobileRoutes),
    },

    // Auth
    ...authRoutes,

    // Public
    ...publicNavRoutes,

    // No match
    { path: main_app_routes.errors.error500, element: <Page500 /> },
    { path: main_app_routes.errors.error404, element: <Page404 /> },
    { path: main_app_routes.errors.error403, element: <Page403 /> },
    { path: '*', element: <Navigate to={main_app_routes.errors.error404} replace /> },
  ]);
}
