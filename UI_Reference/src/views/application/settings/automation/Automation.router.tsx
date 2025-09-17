import { lazy } from 'react';
import { main_app_routes } from 'src/routes/paths';
import { ManageAutomation } from './ManageAutomation';

const Automation = lazy(() => import('./Automation'));

export const automationRoutes = [
  { path: `${main_app_routes.app.settings.automation}`, element: <Automation /> },
  { path: `${main_app_routes.app.settings.automation}/manage`, element: <ManageAutomation /> },
  {
    path: `${main_app_routes.app.settings.automation}/manage/:automationCode`,
    element: <ManageAutomation />,
  },
];
