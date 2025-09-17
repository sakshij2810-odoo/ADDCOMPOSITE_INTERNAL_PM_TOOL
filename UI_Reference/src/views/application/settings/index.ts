/* eslint-disable import/extensions */
import { automationRoutes } from './automation';
import { customerManagementRoutes } from './customer-management';
import { templatesRoutes } from './templates';

export const settingsRoutes = [
  ...customerManagementRoutes,
  ...automationRoutes,
  ...templatesRoutes,
];
