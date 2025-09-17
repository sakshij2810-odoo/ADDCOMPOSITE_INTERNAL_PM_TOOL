import { lazy } from 'react';
import { main_app_routes } from 'src/routes/paths';

const ServicesTableView = lazy(() => import('./DocumentsAndServiceTabView'));
const ManageSingleQuestionnaire = lazy(() => import('./document-checklist/ManageSingleQuestionnaire'));
const SingleServiceForm = lazy(() => import('./services/SingleServiceForm'));

export const documentsAndServicesRoutes = [
    { path: main_app_routes.app.documents_and_services, element: <ServicesTableView /> },
    { path: `${main_app_routes.app.documents_and_services}/checklist/manage`, element: <ManageSingleQuestionnaire /> },
    { path: `${main_app_routes.app.documents_and_services}/checklist/manage/:uuid`, element: <ManageSingleQuestionnaire /> },

    { path: `${main_app_routes.app.documents_and_services}/service/manage`, element: <SingleServiceForm /> },
    { path: `${main_app_routes.app.documents_and_services}/service/manage/:uuid`, element: <SingleServiceForm /> },
]