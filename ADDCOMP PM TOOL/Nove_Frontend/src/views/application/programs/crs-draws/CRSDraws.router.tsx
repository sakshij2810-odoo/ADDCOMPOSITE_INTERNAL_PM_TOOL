import { lazy } from 'react';
import { main_app_routes } from 'src/routes/paths';



const CRSDrawTableView = lazy(() => import('./CRSDrawTableView'));
const ManageSingleCRSDraw = lazy(() => import('./ManageSingleCRSDraw'));

export const crsDrawRoutes = [
    { path: main_app_routes.app.programs.crsDraws, element: <CRSDrawTableView /> },
    { path: `${main_app_routes.app.programs.crsDraws}/manage`, element: <ManageSingleCRSDraw /> },
    { path: `${main_app_routes.app.programs.crsDraws}/manage/:uuid`, element: <ManageSingleCRSDraw /> },
]