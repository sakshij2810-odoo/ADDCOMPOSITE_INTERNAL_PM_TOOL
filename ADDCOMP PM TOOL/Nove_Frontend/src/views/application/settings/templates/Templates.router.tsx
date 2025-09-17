import { lazy } from 'react';
import { main_app_routes } from 'src/routes/paths';

const Templates = lazy(() => import('./TemplatesList'));
const Template = lazy(() => import('./Template'));

export const templatesRoutes = [
  { path: `${main_app_routes.app.settings.templates}`, element: <Templates /> },
  { path: `${main_app_routes.app.settings.templates}/manage`, element: <Template /> },
  { path: `${main_app_routes.app.settings.templates}/manage/:templateCode`, element: <Template /> },
  {
    path: `${main_app_routes.app.settings.templates}/clone/:templateCode`,
    element: <Template isDuplicate={true} />,
  },
];
