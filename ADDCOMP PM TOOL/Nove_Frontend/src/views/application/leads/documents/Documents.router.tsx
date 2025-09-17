import { lazy } from 'react';
import { main_app_routes, paths } from 'src/routes/paths';



const DocumentsTableView = lazy(() => import('./DocumentsTableView'));

export const documentsRoutes = [
    // { path: main_app_routes.app.leads.docucments, element: <DocumentsTableView /> },

]