import { lazy } from 'react';
import { main_app_routes } from 'src/routes/paths';


const CustomerManagementSettings = lazy(() => import('./CustomerManagementSettings'));

export const customerManagementRoutes = [
    { path: `${main_app_routes.app.settings.customerManagement}`, element: <CustomerManagementSettings /> },
]