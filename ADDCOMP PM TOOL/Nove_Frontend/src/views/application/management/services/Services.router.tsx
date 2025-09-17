import { lazy } from 'react';
import { main_app_routes, paths } from 'src/routes/paths';



const ServicesTableView = lazy(() => import('./ServicesTableView'));
const SingleServiceForm = lazy(() => import('./SingleServiceForm'));

export const servicesRoutes = [
    { path: main_app_routes.app.services, element: <ServicesTableView /> },
    { path: `${main_app_routes.app.services}/manage`, element: <SingleServiceForm /> },
    { path: `${main_app_routes.app.services}/manage/:uuid`, element: <SingleServiceForm /> },
]